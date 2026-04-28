import { gql } from '@apollo/client';

export const NavigationMenuItemFragment = gql`
  fragment NavigationMenuItemFragment on MenuItem {
    id
    path
    label
    parentId
    cssClasses
    menu {
      node {
        name
      }
    }
  }
`;

export const FeaturedImageFragment = gql`
  fragment FeaturedImageFragment on NodeWithFeaturedImage {
    featuredImage {
      node {
        id
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
  }
`;
