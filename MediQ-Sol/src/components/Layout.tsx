import {
  CalendarDays,
  CircleHelp,
  House,
  Languages,
  MapPin,
  MessageSquarePlus,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { languages } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Brand } from './Brand';
import { Link } from '../utils/navigation';

const isActive = (currentPath: string, target: string) =>
  target === '/find' ? currentPath === target : currentPath.startsWith(target);

export function Layout({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  const { language, setLanguage, t, toasts } = useApp();
  const navItems = [
    { to: '/find', label: t('findCare') },
    { to: '/saved', label: t('saved') },
    { to: '/report', label: t('reportWait') },
    { to: '/know', label: t('howItWorks') },
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={isActive(currentPath, item.to) ? 'nav-link active' : 'nav-link'}
                aria-current={isActive(currentPath, item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <label className="language-control">
            <Languages aria-hidden="true" size={17} />
            <span className="sr-only">{t('language')}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((item) => (
                <option value={item.code} key={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main id="main-content">{children}</main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div>
            <Brand compact />
            <p className="footer-promise">Healthcare is unpredictable. Your schedule shouldn’t be.</p>
          </div>
          <div className="footer-note">
            <span className="demo-dot" />
            <p>
              <strong>Prototype only.</strong> All clinics, people, reports, availability, and estimates are fictional.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/know#privacy">Privacy approach</Link>
            <Link to="/know#limitations">Data limitations</Link>
            <Link to="/know#safety">Safety</Link>
          </div>
        </div>
      </footer>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <Link to="/find" className={isActive(currentPath, '/find') ? 'active' : ''}>
          <House aria-hidden="true" />
          <span>{t('findCare')}</span>
        </Link>
        <Link to="/saved" className={isActive(currentPath, '/saved') ? 'active' : ''}>
          <CalendarDays aria-hidden="true" />
          <span>{t('saved')}</span>
        </Link>
        <Link to="/report" className={isActive(currentPath, '/report') ? 'active' : ''}>
          <MessageSquarePlus aria-hidden="true" />
          <span>{t('reportWait')}</span>
        </Link>
        <Link to="/know" className={isActive(currentPath, '/know') ? 'active' : ''}>
          <CircleHelp aria-hidden="true" />
          <span>{t('howItWorks')}</span>
        </Link>
      </nav>

      <div className="toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.tone || 'default'}`} key={toast.id} role="status">
            <MapPin aria-hidden="true" size={18} />
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
