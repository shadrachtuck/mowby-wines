import { setConfig } from '@faustwp/core';
import templates from './wp-templates';
import possibleTypes from './possibleTypes.json';

// Faust's getWpUrl() uses lodash trim(..., '/') which does not remove spaces. A trailing space in
// NEXT_PUBLIC_WORDPRESS_URL yields an invalid URL: "http://host /index.php?graphql".
if (process.env.NEXT_PUBLIC_WORDPRESS_URL) {
  process.env.NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL.trim().replace(
    /\/+$/,
    '',
  );
}

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  plugins: [],
  experimentalToolbar: false,
  possibleTypes,
});
