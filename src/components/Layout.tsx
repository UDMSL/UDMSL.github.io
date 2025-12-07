import { useEffect, useState, type ReactNode } from 'react'
import { Menu, X, Mail, Phone } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { generalInfo } from '../data/general'
import { professorProfile } from '../data/professor'
import WebpImage from './WebpImage'

interface TabItem {
  id: string
  label: string
  path: string
}

// Central tab definition keeps navigation and routing aligned
const tabs: TabItem[] = [
  { id: 'Home', label: 'Home', path: '/' },
  { id: 'Jeongho Kim', label: 'Jeongho Kim', path: '/professor' },
  { id: 'Group Members', label: 'Group Members', path: '/members' },
  { id: 'Research', label: 'Research', path: '/research' },
  { id: 'Publications', label: 'Publications', path: '/publications' },
  { id: 'Gallery', label: 'Gallery', path: '/gallery' },
  { id: 'News', label: 'News', path: '/news' },
]

// NavLink에서 재사용하는 스타일 함수
const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'text-primary bg-blue-50 shadow-sm'
      : 'text-gray-600 hover:text-primary hover:bg-gray-50 hover:-translate-y-[1px] hover:shadow'
  }`

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Ensure each tab change starts at top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center cursor-pointer gap-3">
              <WebpImage src="/img/Emblem.png" alt="UDMS Lab Emblem" className="w-10 h-10 object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-primary leading-none">{generalInfo.labShortName}</span>
                <span className="text-xs text-gray-500 hidden md:block">{generalInfo.labName}</span>
              </div>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1 h-full items-center">
              {tabs.map((tab) => (
                <NavLink key={tab.id} to={tab.path} className={linkClass} end={tab.path === '/'}>
                  {tab.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-primary p-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown: 클릭 시 자동 닫히도록 onClick 처리 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  end={tab.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-dark text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 space-y-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-white font-bold text-lg">{generalInfo.labName}</h4>
              <a
                href="https://chemistry.inha.ac.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:text-white transition-colors"
              >
                {generalInfo.affiliation}
              </a>
              <p className="text-sm text-gray-400">{generalInfo.address}</p>
            </div>
            <a
              href="https://www.inha.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 md:self-start"
            >
              <WebpImage
                src="/img/Signature.png"
                alt="Signature"
                className="w-auto opacity-100 pointer-events-none select-none"
                style={{
                  height: '3.5rem',
                  filter: 'grayscale(1) invert(1) brightness(1.45)',
                  mixBlendMode: 'screen',
                  opacity: 0.9,
                }}
              />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-400">
            <div className="flex flex-wrap items-center gap-3">
              <span>Office: {professorProfile.office[0]}</span>
              <span className="hidden sm:inline">|</span>
              <span>Lab: {professorProfile.office[1]}</span>
            </div>
            {professorProfile.email && (
              <a href={`mailto:${professorProfile.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail size={14} /> {professorProfile.email}
              </a>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              <Phone size={14} /> {professorProfile.phone}
            </p>
            <p className="text-sm text-gray-500">© 2025 UDMS Lab. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
