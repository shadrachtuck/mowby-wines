import { gql } from '@apollo/client';
import { useFaustQuery } from '@faustwp/core';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { MowbySiteGlobalsFragment } from '../fragments/MowbySiteGlobals';
import { NavigationMenuItemFragment } from '../fragments/MenuAndImage';
import { SEO } from '../components/SEO';
import WineLayout from '../components/wine/WineLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import HarvestGallery from '../components/wine/HarvestGallery';

// Fallbacks when ACF / media is empty (matches previous static content)
const DEFAULT_BOTTLE_IMAGE =
  'https://www.figma.com/api/mcp/asset/bf822845-1d0f-40d9-b884-0adf58f17b50';
const DEFAULT_MISSION_FISH_IMAGE =
  'https://www.figma.com/api/mcp/asset/d04a4a84-9173-483f-9509-a3d4c97459b4';
const DEFAULT_HARVEST_IMAGES = [
  { src: 'https://www.figma.com/api/mcp/asset/1b3fa8f8-af4a-4912-a057-afaa3def6d19', alt: 'Grapes in harvest bin' },
  { src: 'https://www.figma.com/api/mcp/asset/d9df6d39-1b82-46f3-816b-9ed07e83d42b', alt: 'Vineyard landscape' },
  { src: 'https://www.figma.com/api/mcp/asset/9b9e858f-558b-4a44-a895-0d5e89533844', alt: 'Harvest view' },
  { src: 'https://www.figma.com/api/mcp/asset/be9b956e-f7f9-44a6-9589-c8d178d942c4', alt: 'Harvest scene' },
  { src: 'https://www.figma.com/api/mcp/asset/7c7c91fe-a200-4387-b7db-07ebb45bdad3', alt: 'Wine harvest' },
  { src: 'https://www.figma.com/api/mcp/asset/be9b956e-f7f9-44a6-9589-c8d178d942c4', alt: 'Harvest scene' },
];
const DEFAULT_MISSION_BODY = `Our mission is to craft low-alcohol, youthful, and approachable wines that can be enjoyed on any occasion. We champion sustainability through a low-intervention winemaking approach, sourcing fruit from organic vineyards to create high-quality natural wines that let the terroir, fruit, and varietal characteristics shine. Our ingredients are simple: organic grapes, naturally occurring fermentations, small additions of sulfur dioxide for stability, and plenty of love.`;

/** WPGraphQL for ACF: image fields are one-to-one MediaItem connections. */
function acfImageNode(imageField) {
  if (!imageField) return null;
  return imageField.node ?? imageField.edges?.[0]?.node ?? null;
}

function acfImageUrl(imageField) {
  return acfImageNode(imageField)?.sourceUrl ?? null;
}

function acfImageAlt(imageField, fallback = '') {
  return acfImageNode(imageField)?.altText ?? fallback;
}

/** WPGraphQL for ACF: page link / some link fields use ContentNode connections, not String. */
function acfContentNodeConnectionHref(conn) {
  if (!conn) return null;
  const directUri = conn.nodes?.[0]?.uri ?? conn.edges?.[0]?.node?.uri ?? conn.node?.uri;
  if (!directUri || typeof directUri !== 'string') return null;
  const u = directUri.trim();
  if (!u) return null;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return u.startsWith('/') ? u : `/${u}`;
}

const GET_PAGE_DATA = gql`
  ${BlogInfoFragment}
  ${NavigationMenuItemFragment}
  ${MowbySiteGlobalsFragment}
  query GetFrontPageData(
    $uri: String!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    nodeByUri(uri: $uri) {
      ... on Page {
        mowbyFrontPage {
          hero {
            bottleImage {
              node {
                sourceUrl
                altText
              }
            }
            heading
            subheading
            ctaLabel
            ctaurl {
              nodes {
                ... on ContentNode {
                  uri
                }
              }
            }
          }
          harvestGallery {
            sectionTitle
            harvestImages {
              image {
                node {
                  sourceUrl
                  altText
                }
              }
              alt
            }
          }
          mission {
            heading
            body
            fishImage {
              node {
                sourceUrl
                altText
              }
            }
          }
          footerCta {
            buttonLabel
            supportText
          }
        }
      }
    }
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
  }
`;

export default function Component(props) {
  if (props.loading) {
    return <div className="min-h-screen bg-mowby-cream flex items-center justify-center">Loading...</div>;
  }

  const data = useFaustQuery(GET_PAGE_DATA) ?? {};
  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings ?? {};
  const acf = data?.nodeByUri?.mowbyFrontPage;
  const hero = acf?.hero;
  const harvest = acf?.harvestGallery;
  const mission = acf?.mission;
  const footerCta = acf?.footerCta;

  const bottleSrc = acfImageUrl(hero?.bottleImage) || DEFAULT_BOTTLE_IMAGE;
  const bottleAlt =
    acfImageAlt(hero?.bottleImage, '') || hero?.heading || 'First Crush 2025 Syrah';
  const heroHeading = hero?.heading?.trim() || 'First Crush';
  const heroSub = hero?.subheading?.trim() || '2025 Syrah';
  const heroCta = hero?.ctaLabel?.trim() || 'Reserve a Bottle';
  const heroHref = acfContentNodeConnectionHref(hero?.ctaurl) || '/shop';

  const harvestTitle = harvest?.sectionTitle?.trim() || 'Views from the harvest';
  const harvestSlides =
    harvest?.harvestImages
      ?.map((row) => {
        const src = acfImageUrl(row?.image);
        if (!src) return null;
        const alt = (row?.alt && row.alt.trim()) || acfImageAlt(row?.image, '');
        return { src, alt };
      })
      .filter(Boolean) ?? [];
  const slides = harvestSlides.length > 0 ? harvestSlides : DEFAULT_HARVEST_IMAGES;

  const missionHeading = mission?.heading?.trim() || 'Our Mission';
  const missionBody = mission?.body?.trim();
  const fishSrc = acfImageUrl(mission?.fishImage) || DEFAULT_MISSION_FISH_IMAGE;

  const footerBtn = footerCta?.buttonLabel?.trim() || 'Reserve a Bottle';
  const footerSupport =
    footerCta?.supportText?.trim() ||
    'Limited quantities of First Crush 2025 Syrah available';

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <WineLayout>
        {/* Hero Section - large bottle, direct link to shop */}
        <div className="relative z-10 pt-8 pb-12 md:pt-12 md:pb-16 bg-mowby-cream">
          <div className="flex flex-col items-center justify-center px-4">
            <Link href={heroHref} className="block group">
              <div className="mx-auto mb-6 flex w-full max-w-[280px] sm:max-w-[392px] md:max-w-[504px] lg:max-w-[588px] justify-center">
                <img
                  src={bottleSrc}
                  alt={bottleAlt}
                  className="mx-auto h-auto w-auto max-w-full object-contain max-h-[min(75dvh,calc(100dvh-11rem))] transition-transform duration-300 group-hover:scale-[1.02] rounded-none"
                />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-mowby-blue text-center mb-2">
                {heroHeading}
              </h1>
              <p className="text-lg md:text-xl font-sans text-gray-700 text-center mb-6">
                {heroSub}
              </p>
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="h-11 min-h-11 rounded-xl px-7 py-0 text-base font-sans"
                >
                  {heroCta}
                </Button>
              </div>
            </Link>
          </div>
        </div>

        <HarvestGallery title={harvestTitle} slides={slides} />

        {/* Our Mission Section - Figma: cream bg, red & pink fish bottom-right only */}
        <div className="bg-mowby-cream py-16 md:py-20 relative overflow-hidden">
          <div className="max-w-[966px] mx-auto px-4 sm:px-6 lg:px-[100px] text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative pb-16 sm:pb-20 md:pb-24"
            >
              <h2 className="text-2xl md:text-4xl font-display font-bold text-black tracking-tight mb-10 uppercase">
                {missionHeading}
              </h2>
              {missionBody ? (
                <div
                  className="text-[#707070] text-lg leading-[1.6] prose prose-gray max-w-none [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: missionBody }}
                />
              ) : (
                <p className="text-[#707070] text-lg leading-[1.6] ">{DEFAULT_MISSION_BODY}</p>
              )}

              {/* Red & pink fish - bottom right, same float as About `FloatingFishArt` */}
              <motion.div
                className="pointer-events-none absolute bottom-0 right-0 h-20 w-auto sm:h-[88px] md:h-24"
                aria-hidden
                animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.2,
                }}
              >
                <img
                  src={fishSrc}
                  alt=""
                  className="h-full max-h-full w-full object-contain object-right-bottom rounded-none"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section
        <div className="bg-mowby-cream py-12 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <Link href="/shop">
              <Button size="lg" className="rounded-[10px] px-8 font-sans">
                {footerBtn}
              </Button>
            </Link>
            <p className="mt-4 text-gray-600 text-sm">{footerSupport}</p>
          </div>
        </div> */}
      </WineLayout>
    </>
  );
}

Component.queries = [
  {
    query: GET_PAGE_DATA,
    variables: (seedNode) => ({
      uri: (seedNode?.uri && String(seedNode.uri).trim()) || '/',
      headerLocation: MENUS.PRIMARY_LOCATION,
      footerLocation: MENUS.FOOTER_LOCATION,
    }),
  },
];
