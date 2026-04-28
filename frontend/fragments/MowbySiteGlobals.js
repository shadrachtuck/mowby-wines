import { gql } from '@apollo/client';

/** WPGraphQL for ACF: options page type for “Mowby Site”. */
export const MowbySiteGlobalsFragment = gql`
  fragment MowbySiteGlobalsFields on MowbySite {
    mowbySiteGlobals {
      header {
        navItems {
          label
          path
        }
        cta {
          label
          path
        }
      }
      footer {
        navHeading
        legalHeading
        socialHeading
        footerNavItems {
          label
          path
        }
        legalLinks {
          label
          url
        }
        newsletter {
          heading
          placeholder
          submitLabel
          successMessage
        }
        instagramUrl
        facebookUrl
        footerLogo {
          node {
            sourceUrl
            altText
          }
        }
        copyright
      }
    }
  }
`;

export const MOWBY_SITE_SHELL_QUERY = gql`
  ${MowbySiteGlobalsFragment}
  query MowbySiteShell {
    mowbySite {
      ...MowbySiteGlobalsFields
    }
  }
`;
