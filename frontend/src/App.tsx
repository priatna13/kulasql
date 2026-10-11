import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthPanel } from './components/AuthPanel.tsx'
import { Chrome } from './components/Chrome.tsx'
import { PLAYBOOK_PATH } from './lib/playbook.ts'
import { AuthProvider } from './lib/session.tsx'
import { SiteFooter } from './components/SiteFooter.tsx'
import { Challenge } from './pages/Challenge.tsx'
import { Catalog } from './pages/Catalog.tsx'
import { Course } from './pages/Course.tsx'
import { Dataset } from './pages/Dataset.tsx'
import { Encyclopedia } from './pages/Encyclopedia.tsx'
import { Hub } from './pages/Hub.tsx'
import { Landing } from './pages/Landing.tsx'
import { Leaderboard } from './pages/Leaderboard.tsx'
import { Playbook } from './pages/Playbook.tsx'
import { Privacy } from './pages/Privacy.tsx'
import { SignIn } from './pages/SignIn.tsx'
import { Spreadsheet } from './pages/Spreadsheet.tsx'
import { Store } from './pages/Store.tsx'
import { Terms } from './pages/Terms.tsx'
import { Warmindo } from './pages/Warmindo.tsx'

export default function App() {
  return (
    <AuthProvider>
      <Chrome />
      <AuthPanel />
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/kulasql" element={<Landing />} />
        <Route path="/spreadsheet" element={<Spreadsheet />} />
        <Route path="/dataset" element={<Dataset />} />
        <Route path="/dataset/warmindo-lite" element={<Warmindo />} />
        <Route path="/store" element={<Store />} />
        <Route path="/tos" element={<Terms />} />
        <Route path="/privasi" element={<Privacy />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/kulasql/syarat" element={<Terms />} />
        <Route path="/kulasql/belajar" element={<Course />} />
        <Route path={PLAYBOOK_PATH} element={<Playbook />} />
        <Route path="/functions/sql/:dialect" element={<Encyclopedia />} />
        <Route path="/functions/sql/:dialect/:fn" element={<Encyclopedia />} />
        <Route path="/kulasql/challenges" element={<Catalog />} />
        <Route path="/kulasql/challenges/:slug" element={<Challenge />} />
        <Route path="/kulasql/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/kulasql" replace />} />
      </Routes>
      <SiteFooter />
    </AuthProvider>
  )
}
