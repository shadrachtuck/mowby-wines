import { WordPressTemplate } from '@faustwp/core';

/**
 * Faust preview page - renders draft/pending WordPress content client-side.
 * Uses getServerSideProps to ensure the page is always server-rendered,
 * enabling auth cookies and preview params to be available on first load.
 */
export default function Preview(props) {
  return <WordPressTemplate {...props} />;
}

export function getServerSideProps(context) {
  return {
    props: {
      previewPathname: context.query.previewPathname || null,
      previewId: context.query.p || null,
    },
  };
}
