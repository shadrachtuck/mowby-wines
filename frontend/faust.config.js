import { setConfig, hooks } from '@faustwp/core';
import templates from './wp-templates';
import possibleTypes from './possibleTypes.json';

// Do not assign to process.env.NEXT_PUBLIC_WORDPRESS_URL — Next inlines NEXT_PUBLIC_* as string
// literals at build time, so reassignment becomes `"http://..." = ...` and breaks Terser/webpack.
// Faust's getWpUrl() uses lodash trim(..., '/') which does not remove spaces; normalize here.
hooks.addFilter('wpUrl', 'mowby-wines/normalize-base-url', (wpUrl) => {
  if (!wpUrl || typeof wpUrl !== 'string') return wpUrl;
  return wpUrl.trim().replace(/\/+$/, '');
});

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  plugins: [],
  experimentalToolbar: false,
  possibleTypes,
});
