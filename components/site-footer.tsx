import { ArrowUpRight } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="eyebrow">Have something interesting in mind?</p>
        <h2>Let&apos;s build the thoughtful version.</h2>
      </div>
      <div className="footer-links">
        <a href="mailto:kaylamarieorozco@gmail.com">
          Email <ArrowUpRight aria-hidden="true" size={17} />
        </a>
        <a href="https://www.linkedin.com/in/kaylaorozco/" target="_blank" rel="noreferrer">
          LinkedIn <ArrowUpRight aria-hidden="true" size={17} />
        </a>
        <a href="/kayla-orozco-resume.pdf" target="_blank">
          Résumé <ArrowUpRight aria-hidden="true" size={17} />
        </a>
      </div>
      <p className="footer-note">Designed and built by Kayla Orozco · Texas</p>
    </footer>
  );
}
