import { gql } from '@apollo/client';
import { getNextStaticProps } from '@faustwp/core';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { MowbySiteGlobalsFragment } from '../fragments/MowbySiteGlobals';
import { NavigationMenuItemFragment } from '../fragments/MenuAndImage';
import { SEO } from '../components/SEO';
import WineLayout from '../components/wine/WineLayout';
import { motion } from 'framer-motion';

/** Exported from Figma — About Desktop (32:1582). */
const ABOUT_ASSETS = {
  fishBlueGreenYellow: '/mowby-assets/about/fish-blue-green-yellow.png',
  fishRedPink: '/mowby-assets/about/fish-red-pink.png',
  catBarrel: '/mowby-assets/about/cat-barrel-illustration.png',
  decorative: '/mowby-assets/about/decorative-group.png',
};

const storyBodyClass =
  'font-sans text-black text-xl md:text-2xl font-normal tracking-[0.1em] leading-[1.5] [&_p]:mb-6 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic [&_img]:rounded-none';

const founderBodyClass =
  'font-sans text-black text-xl md:text-2xl font-normal tracking-[0.1em] leading-[1.5] [&_p]:mb-6 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_img]:rounded-none';

const philosophyBodyClass =
  'font-sans text-black text-xl md:text-2xl font-normal tracking-[0.1em] leading-[1.5] [&_p]:mb-0 [&_img]:rounded-none';

const FALLBACK = {
  storyHeading: 'Our Story',
  storyBody: `<p><strong><em>Mowby Wines</em></strong> is named in honor of my late father, Mowbray Davidson.</p><p>A philosopher and friend to all, he cherished connection, building relationships, and, most of all, being out on the river with a fishing pole.</p><p>My dad's love for people and community is exactly what I love most about wine; it brings people together, sparks conversation, and creates memories that last far beyond the final sip.</p><p>My passion for wine began years ago during a harvest in South Africa, where I developed my first crush on wine. I'm thrilled to now share my very first crush with you!</p>`,
  philHeading: 'Our Winemaking Philosophy',
  philBody: `<p>Our mission is to craft low-alcohol, youthful, and approachable wines that can be enjoyed on any occasion. We champion sustainability through a low-intervention winemaking approach, sourcing fruit from organic vineyards to create high-quality natural wines that let the terroir, fruit, and varietal characteristics shine. Our ingredients are simple: organic grapes, naturally occurring fermentations, small additions of sulfur dioxide for stability, and plenty of love.</p>`,
  founderBody: `<p>My name is Emma, and I'm the Owner and Winemaker behind <strong>Mowby Wines</strong> (with a big army of friends and family supporting me every step along the way). I was born and raised in Idaho, spending 20 of my 25 years in this wonderful state. I left to pursue a degree at Montana State University, and after graduating, I joined the nonprofit World Wide Opportunities on Organic Farms (WWOOF) to pursue my love of travel, working abroad on small sustainable farms. Somewhere along the way, I found myself at my first wine harvest in South Africa, and I completely fell in love with the world of wine!</p><p>After a year abroad, I missed Idaho more than ever and returned to my roots, eager to wiggle my way into the Idaho Wine Industry. That path led me to the 3100 Cellars team, Idaho's first and only sparkling winery, where I've been able to learn, grow, pursue an education in Enology through Washington State University, and continue harvesting abroad whenever the chance arises!</p><p>This year, I took a big leap and decided to make my first wine. And with it, Mowby Wines was born! I can't wait to share my first wine with you!</p>`,
};

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

function StoryHeading({ children }) {
  return (
    <h2 className="font-display not-italic text-[36px] text-black tracking-[0.1em] leading-[1.5] mb-0">
      {children}
    </h2>
  );
}

function PhilosophyHeading({ children }) {
  return (
    <h2 className="font-display not-italic text-[36px] text-black tracking-[-0.02em] leading-[1.2] text-left mb-6 md:mb-8">
      {children}
    </h2>
  );
}

/** Same gentle float as `DecorativeFish` — for Figma fish PNGs on About. */
function FloatingFishArt({
  className = '',
  src,
  imgClassName = '',
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
        ease: 'easeInOut',
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

export default function AboutPage(props) {
  const data = props?.data;
  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings ?? {};
  const aboutPage = data?.page;
  const acf = aboutPage?.mowbyAbout;

  const story = acf?.ourStory;
  const phil = acf?.winemakingPhilosophy;
  const founder = acf?.founder;

  const storyHeading =
    story?.heading?.trim() || FALLBACK.storyHeading;
  const storyBodyHtml =
    story?.body?.trim() || FALLBACK.storyBody;
  const storyImg = acfImageUrl(story?.image);
  const storyAlt = acfImageAlt(story?.image, 'Harvest at Mowby Wines');

  const philHeading =
    phil?.heading?.trim() || FALLBACK.philHeading;
  const philBodyHtml = phil?.body?.trim() || FALLBACK.philBody;
  const philImg = acfImageUrl(phil?.image);
  const philAlt = acfImageAlt(phil?.image, 'Winemaking illustration');
  const philIllustrationSrc = philImg || ABOUT_ASSETS.catBarrel;

  const founderImg = acfImageUrl(founder?.image);
  const founderAlt = acfImageAlt(founder?.image, 'Emma Davidson, Founder');
  const founderBodyHtml =
    founder?.body?.trim() || FALLBACK.founderBody;

  const photoFrame =
    'rounded-none overflow-hidden shadow-mowby-soft bg-[#e3e3e3]';

  return (
    <>
      <SEO
        title={`About - ${siteTitle}`}
        description={siteDescription}
      />
      <WineLayout>
        <div className="min-h-screen bg-mowby-cream pt-20">
          <div className="max-w-[1200px] mx-auto w-full">
            {/* Our Story — text + photo side by side from md (no decorative fish) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5 items-start p-8 md:p-16">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-w-0 flex flex-col gap-0"
              >
                <div className="mb-6 md:mb-8">
                  <StoryHeading>{storyHeading}</StoryHeading>
                </div>
                <div
                  className={storyBodyClass}
                  dangerouslySetInnerHTML={{ __html: storyBodyHtml }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="min-w-0 w-full md:justify-self-end md:max-w-[526px]"
              >
                {storyImg ? (
                  <div
                    className={`${photoFrame} aspect-[526/927] max-h-[min(90vh,927px)] w-full shrink-0`}
                  >
                    <img
                      src={storyImg}
                      alt={storyAlt}
                      className="w-full h-full object-cover rounded-none"
                    />
                  </div>
                ) : (
                  <div
                    className={`${photoFrame} aspect-[526/927] flex items-center justify-center text-[#707070] text-sm font-sans px-6 text-center w-full shrink-0`}
                  >
                    Add a story image in WordPress (Our Story → Image).
                  </div>
                )}
              </motion.div>
            </div>

            {/* Winemaking philosophy — Figma: Mission 50:65 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative w-full px-8 md:px-[100px] py-8 md:py-10 flex flex-col items-start"
            >
              <PhilosophyHeading>{philHeading}</PhilosophyHeading>
              <div
                className={`${philosophyBodyClass} text-left max-w-[966px] w-full mb-10 md:mb-14`}
                dangerouslySetInnerHTML={{ __html: philBodyHtml }}
              />
              <div className="flex w-full justify-center px-2">
                <img
                  src={philIllustrationSrc}
                  alt={philImg ? philAlt : ''}
                  className="w-full max-w-[417px] h-auto object-contain rounded-none"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div
                className="pointer-events-none absolute right-[4%] top-[42%] w-[72px] opacity-90 hidden xl:block"
                aria-hidden
              >
                <img
                  src={ABOUT_ASSETS.decorative}
                  alt=""
                  className="w-full h-auto rounded-none"
                />
              </div>
            </motion.section>

            {/* Founder — image + bio side by side; fish above & below portrait */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5 items-start p-8 md:p-16">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="min-w-0 flex flex-col items-center md:items-start justify-start"
              >
                <div className="relative w-full max-w-[629px] shrink-0 mx-auto md:mx-0 isolate">
                  {founderImg ? (
                    <div
                      className={`${photoFrame} relative z-0 aspect-[629/946] max-h-[min(95vh,946px)] w-full`}
                    >
                      <img
                        src={founderImg}
                        alt={founderAlt}
                        className="w-full h-full object-cover rounded-none"
                      />
                    </div>
                  ) : (
                    <div
                      className={`${photoFrame} relative z-0 aspect-[629/946] flex min-h-[200px] items-center justify-center text-[#707070] text-sm font-sans px-6 text-center w-full`}
                    >
                      Add founder portrait in WordPress (Founder → Portrait).
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center md:justify-start md:pl-6 -translate-y-[36%] sm:-translate-y-[38%] md:-translate-y-[40%]"
                    aria-hidden
                  >
                    <FloatingFishArt
                      className="w-[min(90%,180px)] sm:w-[200px] md:w-[213px] rotate-[28deg]"
                      src={ABOUT_ASSETS.fishBlueGreenYellow}
                      delay={0.2}
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center md:justify-start md:pl-5 translate-y-[34%] sm:translate-y-[36%] md:translate-y-[38%]"
                    aria-hidden
                  >
                    <FloatingFishArt
                      className="w-[min(95%,220px)] sm:w-[235px] md:w-[251px] -rotate-[6.7deg]"
                      src={ABOUT_ASSETS.fishRedPink}
                      delay={0.55}
                      invertDrift
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.06 }}
                className="min-w-0 flex flex-col justify-start"
              >
                <div
                  className={founderBodyClass}
                  dangerouslySetInnerHTML={{ __html: founderBodyHtml }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </WineLayout>
    </>
  );
}

AboutPage.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenuItemFragment}
  ${MowbySiteGlobalsFragment}
  query GetAboutPage(
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
    page(id: $pageUri, idType: URI) {
      title
      content
      mowbyAbout {
        ourStory {
          heading
          body
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        winemakingPhilosophy {
          heading
          body
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        founder {
          image {
            node {
              sourceUrl
              altText
            }
          }
          body
        }
      }
    }
  }
`;

AboutPage.variables = (context, extra) => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    pageUri: '/about/',
  };
};

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page: AboutPage,
    revalidate: 60,
  });
}
