import { gql } from '@apollo/client';
import { getNextStaticProps } from '@faustwp/core';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { MowbySiteGlobalsFragment } from '../fragments/MowbySiteGlobals';
import { NavigationMenuItemFragment } from '../fragments/MenuAndImage';
import { SEO } from '../components/SEO';
import WineLayout from '../components/wine/WineLayout';
import DecorativeFish from '../components/wine/DecorativeFish';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// Placeholder blog posts - replace with GraphQL when WordPress posts are configured
const PLACEHOLDER_POSTS = [
  {
    id: 1,
    title: 'The Art of Natural Winemaking',
    excerpt:
      'Discover the fundamentals of low-intervention winemaking and learn how organic practices create authentic wines.',
    author: 'Corinne Davidson',
    date: 'January 15, 2026',
    category: 'Winemaking',
  },
  {
    id: 2,
    title: 'Behind the Crush: First Vintage Stories',
    excerpt:
      "Take an exclusive look into Mowby Wines' first crush, from grape selection to fermentation.",
    author: 'Corinne Davidson',
    date: 'January 8, 2026',
    category: 'Production',
  },
  {
    id: 3,
    title: 'Sustainable Viticulture in Washington',
    excerpt:
      'Explore how organic vineyards in Washington State are leading the way in sustainable wine production.',
    author: 'Corinne Davidson',
    date: 'December 28, 2025',
    category: 'Sustainability',
  },
];

export default function BlogPage(props) {
  const data = props?.data;
  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings ?? {};

  // Use WordPress posts if available, otherwise placeholder
  const blogAcf = data?.blogPage?.mowbyBlog;
  const journalTitle =
    blogAcf?.journalHeader?.title?.trim() || 'Wine Journal';
  const journalSubtitle =
    blogAcf?.journalHeader?.subtitle?.trim() ||
    'Stories and insights from Mowby Wines';
  const noticeHeading =
    blogAcf?.footerNotice?.heading?.trim() || 'More Articles Coming Soon';
  const noticeBody =
    blogAcf?.footerNotice?.body?.trim() ||
    "We're constantly adding new content. Subscribe to our newsletter to stay updated with the latest wine insights and stories.";

  const posts = data?.posts?.nodes?.length
    ? data.posts.nodes.map((p) => ({
        id: p.databaseId,
        title: p.title,
        excerpt: p.excerpt?.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
        author: p.author?.node?.name || 'Mowby Wines',
        date: p.date,
        category: p.categories?.nodes?.[0]?.name || 'Wine',
        slug: p.slug,
      }))
    : PLACEHOLDER_POSTS;

  return (
    <>
      <SEO title={`Blog - ${siteTitle}`} description={siteDescription} />
      <WineLayout>
        <div className="min-h-screen bg-mowby-cream pt-20">
          <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 relative"
            >
              <h1 className="text-4xl md:text-5xl font-serif mb-4 text-gray-900">
                {journalTitle}
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto whitespace-pre-line">
                {journalSubtitle}
              </p>

              <div className="absolute -top-8 right-12">
                <DecorativeFish variant="green" size="md" />
              </div>
            </motion.div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
                      <span className="text-4xl">🍷</span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                        <span className="px-2 py-1 bg-mowby-blue/15 text-mowby-blue rounded-full font-medium">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-serif mb-3 text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>

                        {post.slug ? (
                          <Link href={`/${post.slug}`}>
                            <Button variant="tertiary" size="sm">
                              Read More
                              <ArrowRight className="w-3 h-3 ml-1 inline" />
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="tertiary" size="sm">
                            Read More
                            <ArrowRight className="w-3 h-3 ml-1 inline" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              <div className="absolute -bottom-12 left-12">
                <DecorativeFish variant="yellow" size="lg" />
              </div>
            </div>

            {/* Coming Soon Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 text-center relative"
            >
              <Card className="p-8 bg-white">
                <h3 className="text-xl font-serif text-gray-900 mb-2">
                  {noticeHeading}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">{noticeBody}</p>
              </Card>

              <div className="absolute -top-8 -right-8">
                <DecorativeFish variant="green" size="md" />
              </div>
            </motion.div>
          </div>
        </div>
      </WineLayout>
    </>
  );
}

BlogPage.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenuItemFragment}
  ${MowbySiteGlobalsFragment}
  query GetBlogPage(
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
    blogPage: page(id: $pageUri, idType: URI) {
      title
      content
    }
    posts(first: 10, where: { status: PUBLISH }) {
      nodes {
        databaseId
        title
        excerpt
        slug
        date
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
          }
        }
      }
    }
  }
`;

BlogPage.variables = (context, extra) => ({
  headerLocation: MENUS.PRIMARY_LOCATION,
  footerLocation: MENUS.FOOTER_LOCATION,
  pageUri: '/blog/',
});

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page: BlogPage,
    revalidate: 60,
  });
}
