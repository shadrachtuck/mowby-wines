#!/usr/bin/env bash
# Idempotent-ish installer for Ubuntu 22.04/24.04 (single VPS: WordPress + Faust/Next.js):
#   - nginx, MySQL, PHP-FPM (WordPress stack)
#   - Node.js 20 + PM2 (Next.js / Faust frontend)
#   - Database + docroot for WordPress; nginx site configs
#
# Usage (as root):
#   bash scripts/setup-server.sh
#
# Optional environment:
#   WP_ROOT          WordPress docroot (default: /var/www/wordpress). For this repo use
#                    .../mowby-wines/app/public so port 80 can proxy / to Next.
#   WP_DB_NAME       (default: wordpress)
#   WP_DB_USER       (default: wordpress)
#   WP_DB_PASS       if unset, a random password is generated and printed once
#   FRONTEND_ROOT    path to git clone with frontend/ (default: /var/www/mowby-wines)
#   INSTALL_WP_CLI   set to 1 to install wp-cli.phar to /usr/local/bin/wp
#   CREATE_SWAP      set to 0 to skip; default 1 — on hosts with <2GiB RAM, create 2G /swapfile
#                    if none active (avoids OOM during npm ci / Next build on small droplets)

set -euo pipefail

WP_ROOT="${WP_ROOT:-/var/www/wordpress}"
FRONTEND_ROOT="${FRONTEND_ROOT:-/var/www/mowby-wines}"
WP_DB_NAME="${WP_DB_NAME:-wordpress}"
WP_DB_USER="${WP_DB_USER:-wordpress}"
INSTALL_WP_CLI="${INSTALL_WP_CLI:-0}"

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  echo "Run as root (sudo bash $0)" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

CREATE_SWAP="${CREATE_SWAP:-1}"
if [[ "$CREATE_SWAP" == "1" ]]; then
  echo "==> Swap (low-RAM droplets — reduces OOM during npm ci / Node builds)"
  MEM_KB="$(awk '/^MemTotal:/ {print $2}' /proc/meminfo)"
  if [[ "${MEM_KB:-0}" -lt 2097152 ]] && ! swapon --show 2>/dev/null | grep -q '/swapfile'; then
    if [[ ! -f /swapfile ]]; then
      echo "Creating 2G /swapfile (MemTotal=${MEM_KB}kB)"
      fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none
      chmod 600 /swapfile
      mkswap /swapfile
    fi
    swapon /swapfile
    grep -q '^/swapfile' /etc/fstab 2>/dev/null || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    sysctl -w vm.swappiness=60 >/dev/null || true
  else
    echo "(swap skipped: MemTotal>=2GiB or /swapfile already active)"
  fi
fi

echo "==> apt update / install base packages"
apt-get update -qq
apt-get install -y -qq \
  ca-certificates curl gnupg software-properties-common \
  nginx \
  mysql-server \
  php-fpm php-mysql php-xml php-mbstring php-curl php-zip php-gd php-intl php-cli

echo "==> Node.js 20 (NodeSource) + PM2"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
node -v
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi
pm2 -v

if [[ "${INSTALL_WP_CLI}" == "1" ]]; then
  echo "==> wp-cli"
  if ! command -v wp >/dev/null 2>&1; then
    curl -fsSL -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x /usr/local/bin/wp
  fi
  wp --info --allow-root 2>/dev/null | head -3 || true
fi

echo "==> WordPress docroot + permissions"
mkdir -p "$WP_ROOT"
chown -R www-data:www-data "$WP_ROOT"
find "$WP_ROOT" -type d -exec chmod 755 {} \;
find "$WP_ROOT" -type f -exec chmod 644 {} \; 2>/dev/null || true

PHP_SOCK="$(ls /run/php/php*-fpm.sock 2>/dev/null | head -n1 || true)"
if [[ -z "$PHP_SOCK" ]]; then
  echo "PHP-FPM socket not found under /run/php — start php-fpm:" >&2
  systemctl enable --now "php$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')-fpm" 2>/dev/null || systemctl enable --now php-fpm
  PHP_SOCK="$(ls /run/php/php*-fpm.sock 2>/dev/null | head -n1)"
fi
if [[ -z "$PHP_SOCK" ]]; then
  echo "Could not detect php-fpm socket." >&2
  exit 1
fi
echo "Using PHP socket: $PHP_SOCK"

if [[ -z "${WP_DB_PASS:-}" ]]; then
  WP_DB_PASS="$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)"
  echo "--------------------------------------------------------------------"
  echo "Generated MySQL password for user '${WP_DB_USER}' (save securely):"
  echo "$WP_DB_PASS"
  echo "--------------------------------------------------------------------"
fi

echo "==> MySQL database + user"
mysql -u root <<SQL
CREATE DATABASE IF NOT EXISTS \`${WP_DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${WP_DB_USER}'@'localhost' IDENTIFIED BY '${WP_DB_PASS}';
GRANT ALL PRIVILEGES ON \`${WP_DB_NAME}\`.* TO '${WP_DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

echo "==> nginx: port 80 — Next.js (Faust) for / ; WordPress for admin, REST, GraphQL, assets"
install -d /etc/nginx/sites-available /etc/nginx/sites-enabled
cat > /etc/nginx/sites-available/mowby-wines-wordpress <<NGINX
# Public site is the Faust app (PM2 :3000). WordPress serves /wp-json, /graphql, /wp-admin, etc.
# Set WP_ROOT to your WordPress docroot (this repo: .../app/public).
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root ${WP_ROOT};
    index index.php index.html;

    client_max_body_size 64M;

    location ~* /(?:uploads|files)/.*\\.php\$ {
        deny all;
    }

    location ~ \\.php\$ {
        include fastcgi.conf;
        fastcgi_pass unix:${PHP_SOCK};
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    }

    location /wp-admin {
        try_files \$uri \$uri/ /index.php?\$args;
    }
    location /wp-json/ {
        try_files \$uri \$uri/ /index.php?\$args;
    }
    location = /graphql {
        try_files \$uri \$uri/ /index.php?\$args;
    }
    location /wp-content/ {
        try_files \$uri \$uri/ /index.php?\$args;
    }
    location /wp-includes/ {
        try_files \$uri \$uri/ /index.php?\$args;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX

cat > /etc/nginx/sites-available/mowby-wines-frontend-proxy <<'NGINX'
# Next.js (PM2) on 127.0.0.1:3000 — browse at http://SERVER_IP:8080/
server {
    listen 8080;
    listen [::]:8080;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/mowby-wines-wordpress /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/mowby-wines-frontend-proxy /etc/nginx/sites-enabled/

nginx -t
systemctl enable nginx
systemctl reload nginx

PHP_VER="$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
systemctl enable --now nginx mysql "php${PHP_VER}-fpm" 2>/dev/null || {
  systemctl enable --now nginx mysql
  systemctl restart "php${PHP_VER}-fpm" || systemctl restart php-fpm
}

echo ""
echo "==> Done."
echo "WordPress files:     $WP_ROOT  (sync repo app/public here or wp core download)"
echo "MySQL database:      $WP_DB_NAME / user $WP_DB_USER"
echo "Frontend repo path:  $FRONTEND_ROOT"
echo ""
echo "Public URLs (IP-only):"
echo "  Faust (primary):    http://157.230.146.199/"
echo "  Faust (alternate):  http://157.230.146.199:8080/"
echo "  WordPress admin:    http://157.230.146.199/wp-admin/"
echo ""
echo "Production: set GitHub variable NEXT_PUBLIC_WORDPRESS_URL and store canonical wp-config at"
echo "  /etc/mowby-wines/wp-config.php (optional; see .github/workflows/deploy.yml)."
echo "After first build on server:"
echo "  cd $FRONTEND_ROOT/frontend && npm ci && npm run build -- --skip-health-checks"
echo "  pm2 start npm --name mowby-frontend --cwd $FRONTEND_ROOT/frontend -- start -- --skip-health-checks"
