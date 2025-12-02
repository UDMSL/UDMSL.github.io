import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Professor from './components/Professor'
import Members from './components/Members'
import Research from './components/Research'
import Publications from './components/Publications'
import Gallery from './components/Gallery'
import News from './components/News'

function App() {
  return (
    <>
      {/* Hash router is required for GitHub Pages routing support */}
      <Router>
        <Layout>
          <Routes>
            {/* Routes map 1:1 with tabs to keep navigation in sync */}
            <Route path="/" element={<Home />} />
            <Route path="/professor" element={<Professor />} />
            <Route path="/members" element={<Members />} />
            <Route path="/research" element={<Research />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            {/* Fallback keeps unknown paths from breaking the SPA */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default App
