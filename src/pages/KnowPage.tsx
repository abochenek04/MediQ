import { ArrowRight } from 'lucide-react';
import { VisitBreakdown } from '../components/ClinicComponents';
import { DemoBadge, SafetyNote } from '../components/UI';
import { useApp } from '../context/AppContext';
import { clinics } from '../data/mockData';
import { Link } from '../utils/navigation';

export function KnowPage() {
  const { t } = useApp();
  return <div className="page-space about-page"><div className="shell narrow-shell">
    <div className="page-heading"><div><span className="eyebrow">{t('About MediQ')}</span><h1>{t('heroTitle')}</h1><p>{t('Make room for care, with a clearer picture of your day.')}</p></div><DemoBadge /></div>
    <nav className="about-nav" aria-label={t('About sections')}>
      {[['why', 'Why MediQ'], ['journey', 'Patient Journey'], ['estimates', 'Wait Estimates'], ['reliability', 'Reliability']].map(([id, title]) => <a key={id} href={`#${id}`}>{t(title)}</a>)}
    </nav>
    <section id="why" className="about-section"><span className="eyebrow">01</span><h2>{t('Why MediQ')}</h2><p>{t('A visit can affect work, childcare, transport, and the rest of your day. MediQ brings clinic options, total visit estimates, and planning tools together so you can make a more informed plan.')}</p><Link className="text-link" to="/find">{t('findCare')} <ArrowRight aria-hidden="true" /></Link></section>
    <section id="journey" className="about-section"><span className="eyebrow">02</span><h2>{t('Patient Journey')}</h2><ol className="patient-journey">
      {[
        ['Search', 'Find clinics by your needs, language, insurance, and visit type.'],
        ['Compare', 'Compare the whole visit, clinic reviews, and estimate confidence.'],
        ['Plan', 'Save a visit to see leave-by, arrival, and expected finish times.'],
        ['Visit', 'Use your plan as a guide. Confirm arrangements with the clinic.'],
        ['Report', 'Share timing to help others understand the visit experience.'],
      ].map(([title, body], index) => <li key={title}><b>{index + 1}</b><div><h3>{t(title)}</h3><p>{t(body)}</p></div></li>)}
    </ol></section>
    <section id="estimates" className="about-section"><span className="eyebrow">03</span><h2>{t('Wait Estimates')}</h2><p>{t('The total estimate covers arrival through departure. Check in includes arrival and registration; Wait covers time before the provider; Care is time with the provider; Check out covers the final steps before leaving.')}</p>
      <div className="about-estimate"><strong>54 <small>{t('minutes · fictional example')}</small></strong><VisitBreakdown estimate={clinics[0].estimates[0]} /></div>
      <p>{t('A range leaves room for variation. Historical patterns help compare times of day. Every clinic and estimate in this prototype is fictional.')}</p>
    </section>
    <section id="reliability" className="about-section"><span className="eyebrow">04</span><h2>{t('Reliability')}</h2><p>{t('Confidence describes the timing evidence: how recent, plentiful, consistent, and varied the reports are. It is separate from a clinic’s star rating and does not measure medical quality or guarantee a finish time.')}</p>
      <p id="limitations">{t('Urgent cases, staffing changes, and different patient needs can change visit times. Confirm hours, insurance, and bookings directly with the clinic.')}</p>
      <details id="privacy"><summary>{t('Privacy and demo limitations')}</summary><p>{t('Saved visits, preferences, and reports stay in this browser. Location is optional and is not saved. Do not enter medical or identifying details. There is no live booking, email, Google rating, or clinic connection.')}</p></details>
      <details id="access"><summary>{t('Guest access and future accounts')}</summary><p>{t('All prototype tools are available as a guest. Account sync and any optional Plus features remain future concepts; no pricing or paid service is offered here.')}</p></details>
      <div id="safety"><SafetyNote /></div>
    </section>
  </div></div>;
}
