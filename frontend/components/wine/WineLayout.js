import { useQuery } from '@apollo/client';
import WineNavigation from './WineNavigation';
import WineFooter from './WineFooter';
import { MOWBY_SITE_SHELL_QUERY } from '../../fragments/MowbySiteGlobals';

export default function WineLayout({ children }) {
  const { data } = useQuery(MOWBY_SITE_SHELL_QUERY, { fetchPolicy: 'cache-first' });
  const siteGlobals = data?.mowbySite?.mowbySiteGlobals ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-mowby-cream">
      <WineNavigation siteGlobals={siteGlobals} />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <WineFooter siteGlobals={siteGlobals} />
    </div>
  );
}
