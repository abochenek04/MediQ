import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppProvider, useApp } from './context/AppContext';
import { ContactPage } from './pages/ContactPage';
import { ClinicPage } from './pages/ClinicPage';
import { FindCarePage } from './pages/FindCarePage';
import { KnowPage } from './pages/KnowPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ReportPage } from './pages/ReportPage';
import { SavedPage } from './pages/SavedPage';
import { Link, useLocationPath } from './utils/navigation';

const pageTitle = (path: string) => {
  if (path === '/') return 'MediQ — Know before you go';
  if (path === '/find') return 'Find care — MediQ';
  if (path.startsWith('/clinic/')) return 'Clinic details — MediQ';
  if (path === '/saved') return 'Appointments — MediQ';
  if (path === '/report') return 'Report your visit — MediQ';
  if (path === '/know') return 'About — MediQ';
  if (path === '/contact') return 'Contact Us — MediQ';
  return 'Page not found — MediQ';
};

function AppRoutes() {
  const { t } = useApp();
  const location = useLocationPath();

  useEffect(() => {
    document.title = pageTitle(location.pathname);
  }, [location.pathname]);

  if (location.pathname === '/') return <OnboardingPage />;

  let page: React.ReactNode;
  if (location.pathname === '/find') page = <FindCarePage />;
  else if (location.pathname === '/saved') page = <SavedPage />;
  else if (location.pathname === '/report') page = <ReportPage />;
  else if (location.pathname === '/contact') page = <ContactPage />;
  else if (location.pathname === '/know') page = <KnowPage />;
  else if (location.pathname.startsWith('/clinic/')) {
    page = <ClinicPage clinicId={decodeURIComponent(location.pathname.split('/')[2] || '')} />;
  } else {
    page = (
      <div className="shell page-space">
        <div className="empty-state">
          <span className="empty-code">404</span>
          <h1>{t("This page isn’t in the care plan.")}</h1>
          <p>{t("Let’s get you back to the fictional Durham clinic guide.")}</p>
          <Link className="button button-primary" to="/find">{t("Find care")}</Link>
        </div>
      </div>
    );
  }

  return <Layout currentPath={location.pathname}>{page}</Layout>;
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
