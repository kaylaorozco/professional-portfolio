import { BackNavigationLink } from './work-room-transition';

export function SiteHeader({ staticLogo = false }: { staticLogo?: boolean }) {
  return (
    <header className={`site-header${staticLogo ? ' site-header-static' : ''}`}>
      <BackNavigationLink
        className="wordmark"
        href="/#top"
        aria-label="Kayla Orozco, home"
      >
        <span className="wordmark-name" aria-hidden="true">
          <span className="brand-glyph glyph-k morph-anchor" />
          <span className="brand-glyph glyph-a morph-away morph-1" />
          <span className="brand-glyph glyph-y morph-away morph-2" />
          <span className="brand-glyph glyph-l morph-away morph-3" />
          <span className="brand-glyph glyph-a morph-away morph-4" />
          <span className="morph-gap"> </span>
          <span className="brand-glyph glyph-o morph-o" />
          <span className="brand-glyph glyph-r morph-away morph-5" />
          <span className="brand-glyph glyph-o morph-away morph-6" />
          <span className="brand-glyph glyph-z morph-away morph-7" />
          <span className="brand-glyph glyph-c morph-away morph-8" />
          <span className="brand-glyph glyph-o morph-away morph-9" />
        </span>
        <span className="wordmark-reference" aria-hidden="true">
          <span className="logo-final-layer logo-final-swoosh" />
          <span className="logo-final-layer logo-final-stars" />
        </span>
      </BackNavigationLink>
    </header>
  );
}
