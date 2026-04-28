import { gql } from '@apollo/client';
import { useFaustQuery } from '@faustwp/core';
import { ContentWrapper, SEO } from '../components';
import WineLayout from '../components/wine/WineLayout';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { MowbySiteGlobalsFragment } from '../fragments/MowbySiteGlobals';
import {
  NavigationMenuItemFragment,
  FeaturedImageFragment,
} from '../fragments/MenuAndImage';

const GET_LAYOUT_QUERY = gql`
  ${BlogInfoFragment}
  ${NavigationMenuItemFragment}
  ${MowbySiteGlobalsFragment}
  query GetLayout(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
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
  }
`;

const GET_POST_QUERY = gql`
  ${FeaturedImageFragment}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      author {
        node {
          name
        }
      }
      ...FeaturedImageFragment
    }
  }
`;

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const { post } = useFaustQuery(GET_POST_QUERY);
  const { generalSettings } = useFaustQuery(GET_LAYOUT_QUERY) ?? {};

  const { title: siteTitle, description: siteDescription } = generalSettings ?? {};
  const { title, content, featuredImage, date, author } = post ?? {};

  return (
    <>
      <SEO
        title={siteTitle}
        description={siteDescription}
        imageUrl={featuredImage?.node?.sourceUrl}
      />
      <WineLayout>
        <div className="min-h-screen bg-mowby-cream pt-20">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {featuredImage?.node?.sourceUrl && (
              <div className="mb-8 overflow-hidden">
                <img
                  src={featuredImage.node.sourceUrl}
                  alt={featuredImage.node.altText || title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-serif mb-4 text-gray-900">{title}</h1>
            {(date || author?.node?.name) && (
              <p className="text-gray-600 text-sm mb-8">
                {date && new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {date && author?.node?.name && ' · '}
                {author?.node?.name && `By ${author.node.name}`}
              </p>
            )}
            <div className="prose prose-gray max-w-none">
              <ContentWrapper content={content} />
            </div>
          </article>
        </div>
      </WineLayout>
    </>
  );
}

Component.queries = [
  {
    query: GET_LAYOUT_QUERY,
    variables: (seedNode, ctx) => ({
      headerLocation: MENUS.PRIMARY_LOCATION,
      footerLocation: MENUS.FOOTER_LOCATION,
    }),
  },
  {
    query: GET_POST_QUERY,
    variables: ({ databaseId }, ctx) => ({
      databaseId,
      asPreview: ctx?.asPreview,
    }),
  },
];
