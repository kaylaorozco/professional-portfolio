export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="/#top" aria-label="Kayla Orozco, home">
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
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="/about">About</a>
        <a href="/work">Work</a>
        <a className="nav-contact" href="mailto:kaylamarieorozco@gmail.com">
          Let&apos;s Chat
        </a>
      </nav>
      <details className="mobile-nav">
        <summary aria-label="Open navigation menu">
          <span className="mobile-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </summary>
        <nav className="mobile-nav-panel" aria-label="Mobile navigation">
          <a href="/about">About</a>
          <a href="/work">Work</a>
          <a href="mailto:kaylamarieorozco@gmail.com">
            Let&apos;s Chat
          </a>
        </nav>
      </details>
    </header>
  );
}
