export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" id="contact">
      <div>
        <h2>Have something interesting in mind? Let&apos;s connect.</h2>
      </div>
      <nav className="footer-links" aria-label="Contact">
        <a href="mailto:kaylamarieorozco@gmail.com">Email</a>
        <a
          href="https://www.linkedin.com/in/kaylaorozco/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <a href="/kayla-orozco-resume.pdf" target="_blank">
          Résumé
        </a>
      </nav>
      <div className="footer-meta">
        <p>© 2020–{currentYear} Kayla Orozco</p>
      </div>
    </footer>
  );
}
