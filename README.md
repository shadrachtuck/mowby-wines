# Mowby Wines - Headless WordPress Small-Batch Wine Website

A headless WordPress website built with Faust.js, WPGraphQL, and Advanced Custom Fields for a small-batch wine brand featuring shop, about, blog, and contact pages.

## Project Structure

```
mowby-wines/
├── app/                    # WordPress installation (Local by Flywheel)
│   └── public/
│       └── wp-content/
├── mowby wines assets/     # Design assets, images, brand files
│   └── wine store animation/  # UI reference React template
└── frontend/               # Next.js/Faust.js frontend application
    ├── components/         # React components
    ├── pages/               # Next.js pages (about, shop, contact, blog)
    ├── wp-templates/        # WordPress template mappings
    └── styles/             # Global styles
```

## Features

- ✅ **Homepage** - Wine bottle animation, mission, harvest imagery
- ✅ **About Page** - Winemaker story, First Crush story, WordPress-managed content
- ✅ **Shop Page** - Wine reservation form for limited releases
- ✅ **Contact Page** - Contact form and inquiry handling
- ✅ **Blog Page** - Wine journal and stories from WordPress posts
- ✅ **Responsive Design** - Modern, mobile-friendly UI
- ✅ **Headless Architecture** - WordPress as CMS, Next.js as frontend

## Prerequisites

1. **Node.js** (v18 or higher) and npm
2. **WordPress** installation (Local by Flywheel or similar)
3. **WordPress Plugins**:
   - Advanced Custom Fields (ACF)
   - WPGraphQL
   - WPGraphQL for Advanced Custom Fields
   - Faust (if using Faust plugin features)

## Quick Start

### 1. WordPress Setup

1. Install and activate required plugins (see [ACF_SETUP.md](./ACF_SETUP.md))
2. Create the "Wines" custom post type using ACF (for wine products)
3. Set up ACF field groups for wines
4. Create About, Shop, Contact, and Blog pages in WordPress
5. Configure GraphQL settings (enable debug mode and public introspection)

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Copy environment template
cp .env.local.sample .env.local

# Edit .env.local and add your WordPress URL and Faust secret key
# Get these from WordPress Admin > Settings > Headless
```

Edit `.env.local`:
```env
NEXT_PUBLIC_WORDPRESS_URL=http://your-wordpress-site.local
FAUST_SECRET_KEY=your_secret_key_here
```

### 3. Run Development Server

```bash
# In the frontend directory
npm run dev
```

Visit `http://localhost:3000` to see your site.

## Documentation

- **[ACF_SETUP.md](./ACF_SETUP.md)** - Detailed guide for setting up Advanced Custom Fields in WordPress
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step setup checklist

## Pages

### Homepage (`/`)
- Wine bottle animation and brand hero
- Views from the harvest imagery
- Our Mission section

### About (`/about`)
- Winemaker and First Crush story
- Dynamic content from WordPress About page

### Shop (`/shop`)
- Wine reservation form for limited releases
- Reserve bottles of First Crush 2025 Syrah

### Contact (`/contact`)
- Contact form for inquiries
- Email and contact info

### Blog (`/blog`)
- Wine journal and stories
- Posts from WordPress

## GraphQL Queries

The frontend uses GraphQL to fetch data from WordPress. Example queries:

### Get About Page
```graphql
query GetAboutPage {
  page(id: "about", idType: SLUG) {
    title
    content
  }
}
```

Test queries in WordPress Admin at `GraphQL > GraphiQL IDE`.

## Faust.js Integration

This project uses Faust.js patterns throughout:

- **useFaustQuery** – WP templates (front-page, single) use `useFaustQuery` for WordPress data with auth/preview support
- **getNextStaticProps** – Custom pages (about, shop, contact, blog) use SSG with 60s revalidation
- **Preview** – `/preview` page supports WordPress draft/preview with `getServerSideProps` for auth

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run generate # Generate GraphQL possible types
```

## Deployment

This project matches a **single-VPS** pattern: nginx on port **80** routes `/` to the Faust/Next app (PM2 on `127.0.0.1:3000`) and WordPress for `/wp-admin`, `/graphql`, `/wp-json`, `/wp-content`, etc. CI/CD uses **GitHub Actions** over SSH (no artifact upload); the server must already have a **git clone** of this repo.

### GitHub Actions (recommended for production)

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

| Type | Name | Role |
|------|------|------|
| Secret | `DEPLOY_HOST` | Server hostname or IP |
| Secret | `DEPLOY_USER` | SSH user used by Actions |
| Secret | `DEPLOY_SSH_KEY` | Private key (PEM); public key on the server’s `authorized_keys` |
| Secret | `FAUST_SECRET_KEY` | Must match WordPress **Faust → Settings → Headless** |
| Variable | `NEXT_PUBLIC_WORDPRESS_URL` | WordPress base URL (often `http://` to the same host on `:80`) |
| Variable | `DEPLOY_PATH` | Repo path on server (default `/var/www/mowby-wines`) |
| Variable | `WP_CONFIG_PATH` | Optional; override if `wp-config.php` is not at `$DEPLOY_PATH/app/public/wp-config.php` |
| Variable | `WP_CONFIG_CANONICAL` | Optional; canonical `wp-config.php` on the server (default tries `/etc/mowby-wines/wp-config.php`) |

**Verify:** In GitHub → Actions → **Deploy frontend** → **Run workflow** (`workflow_dispatch`). Then push to `main` when `frontend/**`, `app/**`, `.github/workflows/deploy.yml`, or root `.gitignore` changes.

The remote job writes `frontend/.env.local`, runs `npm ci`, `npm run build -- --skip-health-checks`, and restarts PM2 app **`mowby-frontend`** with `faust start -- --skip-health-checks` (avoids GraphQL health checks blocking `next start` and causing nginx **502**). Low-RAM hosts get an optional **2G swapfile** when the SSH user is root.

### Server bootstrap (Ubuntu)

As **root** on a fresh VPS:

```bash
# Example: WordPress docroot = clone’s app/public, repo at /var/www/mowby-wines
export WP_ROOT=/var/www/mowby-wines/app/public
export FRONTEND_ROOT=/var/www/mowby-wines
bash scripts/setup-server.sh
```

Then clone this repo to `FRONTEND_ROOT`, install WordPress in `WP_ROOT`, place production **`wp-config.php`** outside git (e.g. `/etc/mowby-wines/wp-config.php`) if you use the deploy workflow’s copy step, and run the first `npm ci` / `pm2` commands as in the script footer.

### Other hosting

For **Vercel**, **Netlify**, or **Docker**, use their build/deploy flows instead; keep `NEXT_PUBLIC_WORDPRESS_URL` and `FAUST_SECRET_KEY` aligned with WordPress Faust settings.

## Resources

- [Faust.js Documentation](https://faustjs.org)
- [WPGraphQL Documentation](https://www.wpgraphql.com)
- [Advanced Custom Fields Documentation](https://www.advancedcustomfields.com/resources)

## License

This project is for Mowby Wines.
