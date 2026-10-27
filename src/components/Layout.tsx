import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Menu, X, Mail, Phone, Moon, Sun, Timer } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { generalInfo } from '../data/general';
import { professorProfile } from '../data/professor';
import WebpImage from './WebpImage';
import { useThemePreview } from '../hooks/useThemePreview';
interface TabItem {
    id: string;
    label: string;
    path: string;
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
];
// NavLink에서 재사용하는 스타일 함수
const linkClass = ({ isActive }: {
    isActive: boolean;
}): string => `navigation-link ${isActive ? 'is-active' : ''}`;
interface LayoutProps {
    children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
    const { palette, mode, setMode } = useThemePreview();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isClockPage = location.pathname === '/exam-clock';
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    // Ensure each tab change starts at top of page
    useEffect(() => {
        const target = location.hash
            ? document.getElementById(location.hash.slice(1))
            : null;
        if (target) {
            target.focus({ preventScroll: true });
            target.scrollIntoView({ block: 'start', behavior: 'instant' });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
        const tab = tabs.find((item) => item.path === location.pathname);
        document.title = `${tab?.label ?? (isClockPage ? 'Exam Clock' : 'Home')} | ${generalInfo.labShortName}`;
    }, [location.pathname, location.hash, location.key, isClockPage]);
    useEffect(() => {
        if (!mobileMenuOpen)
            return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [mobileMenuOpen]);
    return (<div data-palette={isClockPage ? undefined : palette} data-mode={isClockPage ? undefined : mode} className={`site-shell min-h-screen flex flex-col bg-white text-gray-900 ${isClockPage ? 'exam-clock-layout' : ''}`}>
      <a href="#main-content" onClick={(event) => {
            event.preventDefault();
            document.getElementById('main-content')?.focus();
        }} className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:p-3 focus:rounded-md">{"본문 바로가기"}</a>
      {/* Navbar */}
      <nav aria-label={"주 메뉴"} className="site-navigation bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="nav-container">
          <div className="nav-inner flex justify-between">
            {/* Logo */}
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center cursor-pointer gap-3">
              <WebpImage src="/img/Emblem.png" alt="UDMS Lab Emblem" loading="eager" width={40} height={40} className="w-10 h-10 object-contain"/>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-primary leading-none">{generalInfo.labShortName}</span>
                <span className="brand-subtitle">{generalInfo.labName}</span>
              </div>
            </NavLink>

            {/* Desktop Menu */}
            <div className="desktop-navigation hidden lg:flex h-full items-center">
              {tabs.map((tab) => (<NavLink key={tab.id} to={tab.path} className={linkClass} end={tab.path === '/'}>
                  {tab.label}
                </NavLink>))}
            </div>

            <div className="nav-tools">

              <button className="nav-icon" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} aria-label={mode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'} title={mode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}>{mode === 'light' ? <Sun size={19}/> : <Moon size={19}/>}</button>
              <NavLink to="/exam-clock" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-icon ${isActive ? 'is-active' : ''}`} aria-label="Exam Clock" title="Exam Clock"><Timer size={20}/></NavLink>
            </div>
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button ref={menuButtonRef} type="button" aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-primary p-2">
                {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown: 클릭 시 자동 닫히도록 onClick 처리 */}
        {mobileMenuOpen && (<div id="mobile-navigation" className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => (<NavLink key={tab.id} to={tab.path} end={tab.path === '/'} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}>
                  {tab.label}
                </NavLink>))}
            </div>
          </div>)}
      </nav>



      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="flex-grow">{children}</main>

      {/* Footer */}
      {!isClockPage && <footer className="site-footer">
        <div className="site-container space-y-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-white font-bold text-lg">{generalInfo.labName}</h4>
              <a href="https://chemistry.inha.ac.kr" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:text-white transition-colors">{generalInfo.affiliation}</a>

            </div>
            <a href="https://www.inha.ac.kr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 md:self-start">
              <WebpImage src="/img/Signature.png" alt="Signature" className="w-auto opacity-100 pointer-events-none select-none" style={{
                height: '3.5rem',
                filter: 'grayscale(1) invert(1) brightness(1.45)',
                mixBlendMode: 'screen',
                opacity: 0.9,
            }}/>
            </a>
          </div>

          <p className="footer-address">{generalInfo.address}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-400">
            <div className="flex flex-wrap items-center gap-3">
              <span>{'교수실'}: {professorProfile.office[0]}</span>
              <span className="hidden sm:inline">|</span>
              <span>{'실험실'}: {professorProfile.office[1]}</span>
            </div>
            {professorProfile.email && (<a href={`mailto:${professorProfile.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail size={14}/> {professorProfile.email}
              </a>)}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              <Phone size={14}/> {professorProfile.phone}
            </p>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} UDMS Lab. All Rights Reserved.</p>
          </div>
        </div>
      </footer>}
    </div>);
};
export default Layout;
