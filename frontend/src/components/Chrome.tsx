import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CATALOG_PATH } from '../lib/challenge.ts'
import { COURSE_PATH } from '../lib/course.ts'
import { POSTGRES_PATH } from '../lib/encyclopedia.ts'
import { PLAYBOOK_PATH } from '../lib/playbook.ts'
import { useAuth } from '../lib/session.tsx'

function shortName(email: string): string {
  const name = email.split('@')[0] ?? email
  if (name.length <= 14) return name
  return `${name.slice(0, 13)}…`
}

function BrandMark() {
  return <img className="brand-logo" src="/kula-logo.png" alt="" />
}

function initialOf(email: string): string {
  const letter = shortName(email).trim().charAt(0)
  return letter ? letter.toLocaleUpperCase('id') : '?'
}

function AppSwitcherIcon() {
  return (
    <svg className="switcher-icon" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="3.5" cy="3.5" r="1.35" />
      <circle cx="9" cy="3.5" r="1.35" />
      <circle cx="14.5" cy="3.5" r="1.35" />
      <circle cx="3.5" cy="9" r="1.35" />
      <circle cx="9" cy="9" r="1.35" />
      <circle cx="14.5" cy="9" r="1.35" />
      <circle cx="3.5" cy="14.5" r="1.35" />
      <circle cx="9" cy="14.5" r="1.35" />
      <circle cx="14.5" cy="14.5" r="1.35" />
    </svg>
  )
}

function XpBolt() {
  return (
    <svg className="xp-bolt" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M9.2 1.2 3.4 9.1h3.7L6.6 14.8l6.1-8.2H8.8L9.2 1.2Z" />
    </svg>
  )
}

export function Chrome() {
  const { pathname, search } = useLocation()
  const { user, progress, openAuth, logout } = useAuth()
  const [desktop, setDesktop] = useState(() =>
    window.matchMedia('(min-width: 840px)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(min-width: 840px)')
    const onChange = () => setDesktop(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const path = pathname.replace(/\/+$/, '') || '/'
  const onRamp = path === '/kulasql'
  const prose =
    path === '/kulasql/syarat' ||
    (!path.startsWith('/kulasql') && !path.startsWith('/functions'))
  const onCatalog = pathname === CATALOG_PATH
  const onCourse = pathname === COURSE_PATH
  const onPlaybook = pathname === PLAYBOOK_PATH
  const onBoard = pathname === '/kulasql/leaderboard'
  // A trailing slash still matches the index route. That slash is not a function slug.
  const onEncyclopedia = path.startsWith('/functions/sql/')
  const onFunction = onEncyclopedia && path.slice('/functions/sql/'.length).includes('/')
  const inTantangan = onCatalog || pathname.startsWith(`${CATALOG_PATH}/`)
  const inSql = onRamp || path.startsWith('/kulasql') || onEncyclopedia
  const onSheet = path.startsWith('/spreadsheet')
  const moduleName = onSheet ? 'Spreadsheet' : 'kulaSQL'
  const skipEditor = !onRamp || desktop
  const skipHref = onBoard
    ? '#papan'
    : onFunction
      ? '#fungsi'
      : onCatalog || onPlaybook || onEncyclopedia
        ? '#daftar'
        : onCourse
          ? '#materi'
          : prose
            ? '#isi'
            : skipEditor
              ? '#kerja'
              : '#mulai'
  const skipLabel = onBoard
    ? 'Loncat ke papan'
    : onFunction
      ? 'Loncat ke fungsi'
      : onCatalog || onPlaybook || onEncyclopedia
        ? 'Loncat ke daftar'
        : onCourse
          ? 'Loncat ke materi'
          : prose
            ? 'Loncat ke isi'
            : skipEditor
              ? 'Loncat ke editor'
              : 'Loncat ke tantangan'

  function onSkipClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!skipEditor) return
    const editor = document.querySelector<HTMLElement>('.cm-content')
    if (!editor) return
    event.preventDefault()
    editor.focus()
    editor.scrollIntoView({ block: 'nearest' })
  }

  return (
    <header className="chrome">
      <a
        className="skip-link"
        href={skipHref}
        onClick={onSkipClick}
      >
        {skipLabel}
      </a>
      <div className="chrome-inner">
        <div className="chrome-brand">
          <Link className="wordmark" to="/kulasql">
            {onSheet ? (
              <span className="mark" aria-hidden="true">
                s
              </span>
            ) : (
              <BrandMark />
            )}
            {moduleName}
          </Link>
          <details className="switcher">
            <summary>
              <AppSwitcherIcon />
              <span className="visually-hidden">Pindah modul</span>
            </summary>
            <div className="switcher-menu">
              <Link to="/kulasql" aria-current={inSql ? 'page' : undefined}>
                kulaSQL
              </Link>
              <Link to="/spreadsheet" aria-current={onSheet ? 'page' : undefined}>
                Spreadsheet
              </Link>
              <Link to={POSTGRES_PATH} aria-current={onEncyclopedia ? 'page' : undefined}>
                Ensiklopedia
              </Link>
              <Link to="/beranda" aria-current={path === '/beranda' ? 'page' : undefined}>
                Beranda
              </Link>
            </div>
          </details>
        </div>
        <nav className="site-nav" aria-label="Utama">
          <Link to={COURSE_PATH} aria-current={onCourse ? 'page' : undefined}>
            Belajar
          </Link>
          <Link
            to={inTantangan ? { pathname: CATALOG_PATH, search } : CATALOG_PATH}
            aria-current={inTantangan ? 'page' : undefined}
          >
            Tantangan
          </Link>
          <Link to={PLAYBOOK_PATH} aria-current={onPlaybook ? 'page' : undefined}>
            Playbook
          </Link>
          <Link to="/kulasql/leaderboard" aria-current={onBoard ? 'page' : undefined}>
            Leaderboard
          </Link>
        </nav>
        <div className="chrome-status">
          {user ? (
            <details className="account">
              <summary>
                <span className="avatar" aria-hidden="true">
                  {initialOf(user.email)}
                </span>
                <span className="account-name">{shortName(user.email)}</span>
                <span className="pill-sep" aria-hidden="true">
                  ·
                </span>
                <span className="account-level">Lv {progress.level}</span>
                <span className="pill-sep" aria-hidden="true">
                  ·
                </span>
                <span className="account-xp">
                  <XpBolt />
                  {progress.xp} XP
                </span>
              </summary>
              <div className="account-menu">
                <p className="account-email">{user.email}</p>
                <button type="button" className="btn-secondary account-logout" onClick={() => void logout()}>
                  Keluar
                </button>
              </div>
            </details>
          ) : (
            <button type="button" className="masuk" onClick={openAuth}>
              Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
