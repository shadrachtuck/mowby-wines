import { gql } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";
import * as MENUS from "../constants/menus";
import { BlogInfoFragment } from "../fragments/GeneralSettings";
import { MowbySiteGlobalsFragment } from "../fragments/MowbySiteGlobals";
import { NavigationMenuItemFragment } from "../fragments/MenuAndImage";
import { SEO } from "../components/SEO";
import WineLayout from "../components/wine/WineLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { Check } from "lucide-react";

/** Exported from Figma — Shop Desktop (67:78). */
const SHOP_ASSETS = {
  fishDecorative: "/mowby-assets/shop/fish-decorative.png",
  pawPrints: "/mowby-assets/shop/paw-prints.png",
  defaultBottle: "/mowby-assets/shop/bottle-first-crush.png",
};

/** Fallback long-form story when the Shop page has no body content in WordPress. */
const FIRST_CRUSH_BODY_FALLBACK = `<p>We craft small-batch, low-alcohol wines that are crisp, youthful, and approachable — perfect for any occasion. We champion sustainability with a low-intervention winemaking approach, sourcing fruit from organic vineyards to craft high-quality natural wines that showcase the terroir, fruit, and varietal characteristics.</p><p>About First Crush: In the wine world, "crush" refers to the winemaking process, and First Crush marks the very first vintage I've completed under my own label. While it's Mowby Wines' first crush, my personal crush began years ago in South Africa. After college, I spent a year traveling and had the incredible opportunity to complete my first wine harvest in South Africa. Immersed in a vibrant winemaking culture with some outstanding winemakers, I developed my first true "wine crush," and I was hooked! That initial crush has grown into a long-term love that I'm thrilled to now share with you.</p><p>This is my debut vintage, and quantities are extremely limited. To secure a bottle (or a few), join our reserve list to reserve your allocation. Bottles will be available upon completion in summer 2026. Stay tuned for more details!</p>`;

const shopStoryBodyClass =
  "font-sans text-black text-xl md:text-2xl tracking-[0.1em] leading-[1.5] [&_p]:mb-6 [&_p:last-child]:mb-0";

function acfImageNode(imageField) {
  if (!imageField) return null;
  return imageField.node ?? imageField.edges?.[0]?.node ?? null;
}

function acfImageUrl(imageField) {
  return acfImageNode(imageField)?.sourceUrl ?? null;
}

function acfImageAlt(imageField, fallback = "") {
  return acfImageNode(imageField)?.altText ?? fallback;
}

function applyTemplate(str, vars) {
  if (!str || typeof str !== "string") return "";
  let out = str;
  Object.entries(vars).forEach(([k, v]) => {
    out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v ?? ""));
  });
  return out;
}

function stripWpEmptyContent(html) {
  if (!html || typeof html !== "string") return "";
  const t = html.replace(/\s/g, "");
  if (!t) return "";
  if (/^<!--\s*wp:.*?-->$/s.test(html.trim())) return "";
  return html;
}

/** Same gentle float as About — for shop decorative fish. */
function FloatingFishArt({
  className = "",
  src,
  imgClassName = "",
  delay = 0,
  invertDrift = false,
}) {
  return (
    <motion.div
      className={className}
      animate={
        invertDrift
          ? { y: [0, -10, 0], x: [0, -5, 0] }
          : { y: [0, -10, 0], x: [0, 5, 0] }
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        className={`w-full h-auto object-contain rounded-none select-none pointer-events-none ${imgClassName}`}
      />
    </motion.div>
  );
}

function FirstCrushHeading({ children }) {
  return (
    <h1 className="font-display not-italic text-[36px] text-black tracking-[0.1em] leading-[1.5] mb-6 md:mb-8">
      {children}
    </h1>
  );
}

export default function ShopPage(props) {
  const data = props?.data;
  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings ?? {};

  const shopPage = data?.shopPage;
  const shop = shopPage?.mowbyShop;
  const rf = shop?.reservationForm;
  const ff = rf?.formFields;

  const pageBodyHtml =
    stripWpEmptyContent(shopPage?.content ?? "") || FIRST_CRUSH_BODY_FALLBACK;

  const bottleSrc = acfImageUrl(shop?.bottleImage) || SHOP_ASSETS.defaultBottle;
  const bottleAlt =
    acfImageAlt(shop?.bottleImage, "") ||
    shop?.productTitle?.trim() ||
    "First Crush Syrah wine bottle";
  const productTitle = shop?.productTitle?.trim() || '"FIRST CRUSH" 2025 SYRAH';

  const formHeading = rf?.heading?.trim() || "Reserve Your Bottles";
  const submitLabel = rf?.submitButtonLabel?.trim() || "Submit";
  const disclaimer =
    rf?.disclaimer?.trim() ||
    "* No payment required at this time. We'll contact you when our wine is available for purchase (estimated May 2025).";

  const nameLabel = ff?.nameLabel?.trim() || "Full Name *";
  const namePlaceholder = ff?.namePlaceholder?.trim() || "Enter your name";
  const emailLabel = ff?.emailLabel?.trim() || "Email Address *";
  const emailPlaceholder = ff?.emailPlaceholder?.trim() || "you@example.com";
  const phoneLabel = ff?.phoneLabel?.trim() || "Phone Number";
  const phonePlaceholder = ff?.phonePlaceholder?.trim() || "(555) 123-4567";
  const bottlesLabel = ff?.bottlesLabel?.trim() || "Number of Bottles *";
  const messageLabel =
    ff?.messageLabel?.trim() || "Additional Notes (Optional)";
  const messagePlaceholder =
    ff?.messagePlaceholder?.trim() || "Any questions or special requests?";

  const successTitle = ff?.successTitle?.trim() || "Reservation Confirmed!";
  const successLine1 = ff?.successLine1?.trim() || "Thank you, {name}!";
  const successLine2 =
    ff?.successLine2?.trim() ||
    "We've reserved {bottles} {bottleWord} of First Crush 2025 Syrah for you.";
  const successLine3 =
    ff?.successLine3?.trim() ||
    "We'll reach out to {email} once our licenses are approved and the wine is ready for purchase (estimated May 2025).";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    bottles: "1",
    message: "",
  });
  const [reserved, setReserved] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReserve = (e) => {
    e.preventDefault();
    const email = formData.email?.trim() ?? "";
    const name = formData.name?.trim() ?? "";
    if (!email || !email.includes("@")) {
      document.getElementById("email")?.focus();
      return;
    }
    if (!name) {
      document.getElementById("name")?.focus();
      return;
    }
    const line1 = formData.addressLine1?.trim() ?? "";
    const city = formData.city?.trim() ?? "";
    const state = formData.state?.trim() ?? "";
    const postal = formData.postalCode?.trim() ?? "";
    if (!line1) {
      document.getElementById("addressLine1")?.focus();
      return;
    }
    if (!city) {
      document.getElementById("city")?.focus();
      return;
    }
    if (!state) {
      document.getElementById("state")?.focus();
      return;
    }
    if (!postal) {
      document.getElementById("postalCode")?.focus();
      return;
    }
    const existing = JSON.parse(
      localStorage.getItem("wineReservations") || "[]",
    );
    localStorage.setItem(
      "wineReservations",
      JSON.stringify([
        ...existing,
        {
          ...formData,
          timestamp: Date.now(),
          product: productTitle,
        },
      ]),
    );
    setReserved(true);
  };

  const bottleWord = formData.bottles === "1" ? "bottle" : "bottles";
  const tplVars = {
    name: formData.name,
    email: formData.email,
    bottles: formData.bottles,
    bottleWord,
  };

  return (
    <>
      <SEO title={`Shop - ${siteTitle}`} description={siteDescription} />
      <WineLayout>
        <div className="min-h-screen bg-mowby-cream pt-20">
          <div className="max-w-[1200px] mx-auto w-full relative">
            {!reserved ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="px-8 md:px-16 pb-16 md:pb-24"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_526px] gap-10 lg:gap-5 items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-w-0 flex flex-col relative z-10"
                  >
                    <FirstCrushHeading>
                      About &ldquo;First Crush:&rdquo;
                    </FirstCrushHeading>
                    <div
                      className={shopStoryBodyClass}
                      dangerouslySetInnerHTML={{ __html: pageBodyHtml }}
                    />
                    <div
                      className="mt-10 md:mt-14 w-full max-w-[463px] pointer-events-none select-none"
                      aria-hidden
                    >
                      <img
                        src={SHOP_ASSETS.pawPrints}
                        alt=""
                        className="w-full h-auto object-contain rounded-none -rotate-[7.29deg] opacity-95"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    className="min-w-0 w-full lg:max-w-[526px] lg:justify-self-end flex flex-col items-center gap-6 relative z-10"
                  >
                    <div
                      className={`w-full max-w-[420px] aspect-[420/859] shrink-0 overflow-hidden`}
                    >
                      <img
                        src={bottleSrc}
                        alt={bottleAlt}
                        className="w-full h-full object-cover object-center scale-[1.02]"
                      />
                    </div>

                    <div className="w-full max-w-[420px] flex flex-col gap-2">
                      <p className="font-sans font-semibold text-base text-black leading-none">
                        Reserve a bottle here:
                      </p>
                      <form onSubmit={handleReserve} className="space-y-5">
                        <p className="font-sans text-sm text-gray-600">
                          {formHeading}
                        </p>

                        <div>
                          <Label
                            htmlFor="name"
                            className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                          >
                            {nameLabel}
                          </Label>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            aria-required="true"
                            className="w-full"
                            placeholder={namePlaceholder}
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                          >
                            {emailLabel}
                          </Label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            aria-required="true"
                            className="w-full"
                            placeholder={emailPlaceholder}
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                          >
                            {phoneLabel}
                          </Label>
                          <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                            className="w-full"
                            placeholder={phonePlaceholder}
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="addressLine1"
                            className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                          >
                            Street address *
                          </Label>
                          <Input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            autoComplete="address-line1"
                            aria-required="true"
                            className="w-full"
                            placeholder="123 Main St"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="addressLine2"
                            className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                          >
                            Apt, suite, etc. (optional)
                          </Label>
                          <Input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            autoComplete="address-line2"
                            className="w-full"
                            placeholder="Apt 4"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                          <div className="min-w-0">
                            <Label
                              htmlFor="city"
                              className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                            >
                              City *
                            </Label>
                            <Input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              autoComplete="address-level2"
                              aria-required="true"
                              className="w-full"
                              placeholder="Boise"
                            />
                          </div>
                          <div className="min-w-0">
                            <Label
                              htmlFor="state"
                              className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                            >
                              State *
                            </Label>
                            <Input
                              type="text"
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              autoComplete="address-level1"
                              aria-required="true"
                              className="w-full"
                              placeholder="ID"
                            />
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="postalCode"
                            className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                          >
                            ZIP code *
                          </Label>
                          <Input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            autoComplete="postal-code"
                            aria-required="true"
                            className="w-full"
                            placeholder="83702"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="bottles"
                            className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                          >
                            {bottlesLabel}
                          </Label>
                          <Select
                            id="bottles"
                            name="bottles"
                            value={formData.bottles}
                            onChange={handleChange}
                            aria-required="true"
                            className="w-full"
                          >
                            <option value="1">1 bottle</option>
                            <option value="2">2 bottles</option>
                            <option value="3">3 bottles</option>
                            <option value="4">4 bottles</option>
                            <option value="5">5 bottles</option>
                            <option value="6">6 bottles (half case)</option>
                            <option value="12">12 bottles (full case)</option>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="message"
                            className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                          >
                            {messageLabel}
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                            className="w-full resize-none"
                            placeholder={messagePlaceholder}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full min-h-11 h-auto rounded-xl px-4 py-2.5 font-sans font-semibold text-base"
                        >
                          {submitLabel}
                        </Button>

                        <p className="text-xs text-gray-500 text-center pt-1 whitespace-pre-line">
                          {disclaimer}
                        </p>
                      </form>
                    </div>

                    {/* In-flow under the form (same column); never absolute-positioned over inputs */}
                    <div
                      className="flex w-full justify-center mt-8 md:mt-10 lg:mt-8 pointer-events-none select-none"
                      aria-hidden
                    >
                      <div className="w-[min(72vw,236px)] shrink-0 -rotate-[105deg] scale-y-[-1] flex items-center justify-center origin-center">
                        <FloatingFishArt
                          className="w-full"
                          src={SHOP_ASSETS.fishDecorative}
                          delay={0.15}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-lg mx-auto px-8 py-16"
              >
                <div className="bg-mowby-cream border-2 border-mowby-seaweed/50 rounded-xl p-8 md:p-12 text-center relative">
                  <Check className="w-16 h-16 text-mowby-seaweed mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-display text-mowby-seaweed tracking-tight uppercase mb-4">
                    {successTitle}
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>{applyTemplate(successLine1, tplVars)}</p>
                    <p>{applyTemplate(successLine2, tplVars)}</p>
                    <p className="text-sm pt-4 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.06)]">
                      {applyTemplate(successLine3, tplVars)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </WineLayout>
    </>
  );
}

ShopPage.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenuItemFragment}
  ${MowbySiteGlobalsFragment}
  query GetShopPage(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $pageUri: ID!
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    mowbySite {
      ...MowbySiteGlobalsFields
    }
    shopPage: page(id: $pageUri, idType: URI) {
      title
      content
      mowbyShop {
        bottleImage {
          node {
            sourceUrl
            altText
          }
        }
        productTitle
        reservationForm {
          heading
          submitButtonLabel
          disclaimer
          formFields {
            nameLabel
            namePlaceholder
            emailLabel
            emailPlaceholder
            phoneLabel
            phonePlaceholder
            bottlesLabel
            messageLabel
            messagePlaceholder
            successTitle
            successLine1
            successLine2
            successLine3
          }
        }
      }
    }
  }
`;

ShopPage.variables = (context, extra) => ({
  headerLocation: MENUS.PRIMARY_LOCATION,
  footerLocation: MENUS.FOOTER_LOCATION,
  pageUri: "/shop/",
});

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page: ShopPage,
    revalidate: 60,
  });
}
