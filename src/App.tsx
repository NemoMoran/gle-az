import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { LeistungenPage } from './pages/LeistungenPage'
import { UeberUnsPage } from './pages/UeberUnsPage'
import { SchulungenPage } from './pages/SchulungenPage'
import { KontaktPage } from './pages/KontaktPage'
import { ImpressumPage } from './pages/ImpressumPage'
import { DatenschutzPage } from './pages/DatenschutzPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="leistungen" element={<LeistungenPage />} />
        <Route path="ueber-uns" element={<UeberUnsPage />} />
        <Route path="schulungen" element={<SchulungenPage />} />
        <Route path="kontakt" element={<KontaktPage />} />
        <Route path="impressum" element={<ImpressumPage />} />
        <Route path="datenschutz" element={<DatenschutzPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
