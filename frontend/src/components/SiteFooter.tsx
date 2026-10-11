import { Link } from 'react-router-dom'
import { SITE_FOOTER } from '../lib/legal.ts'

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <nav aria-label="Legal">
        <Link to={SITE_FOOTER.termsHref}>{SITE_FOOTER.termsLabel}</Link>
        <Link to={SITE_FOOTER.privacyHref}>{SITE_FOOTER.privacyLabel}</Link>
      </nav>
      <p>{SITE_FOOTER.identity}</p>
      <p>
        <a href={`mailto:${SITE_FOOTER.supportEmail}`}>{SITE_FOOTER.supportEmail}</a>
      </p>
    </footer>
  )
}
