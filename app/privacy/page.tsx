import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata = {
  title: 'Privacy — Kayla Orozco',
  description: 'Privacy information for kaylaorozco.com.',
};

export default function PrivacyPage() {
  return (
    <main id="top">
      <SiteHeader />
      <section className="privacy-page">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy policy</h1>
        <p>
          This page is reserved for the site&apos;s privacy policy. A complete policy
          will be published here.
        </p>
        <p>
          In the meantime, privacy questions can be sent to{' '}
          <a className="text-link" href="mailto:kaylamarieorozco@gmail.com">
            kaylamarieorozco@gmail.com
          </a>.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
