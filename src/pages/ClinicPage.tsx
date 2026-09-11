import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  Bookmark,
  CalendarPlus,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Heart,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Timer,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  formatMode,
  HistoricalChart,
  RatingStars,
  VisitBreakdown,
} from '../components/ClinicComponents';
import { DemoBadge, InfoNote, PageLoader, ReliabilityBadge, SafetyNote } from '../components/UI';
import { useApp } from '../context/AppContext';
import { clinicService } from '../services/clinicService';
import type { Clinic, SavedAppointment, VisitMode } from '../types';
import { Link } from '../utils/navigation';
import { relativeReportTime, toLocalDateTimeInput } from '../utils/time';

export function ClinicPage({ clinicId }: { clinicId: string }) {
  const {
    savedClinicIds,
    submittedReports,
    toggleSavedClinic,
    saveAppointment,
    pushToast,
  } = useApp();
  const [clinic, setClinic] = useState<Clinic | undefined>();
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<VisitMode>('scheduled');
  const [planOpen, setPlanOpen] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [queueAlertOn, setQueueAlertOn] = useState(false);
  const [planValues, setPlanValues] = useState(() => ({
    appointmentTime: toLocalDateTimeInput(new Date(Date.now() + 1000 * 60 * 60 * 24)),
    travelMinutes: 18,
    bufferMinutes: 15,
  }));

  useEffect(() => {
    setLoading(true);
    void clinicService.getClinicById(clinicId).then((result) => {
      setClinic(result);
      if (result) setMode(result.visitModes[0]);
      setLoading(false);
    });
  }, [clinicId]);

  const visibleReports = useMemo(() => {
    if (!clinic) return [];
    return [
      ...submittedReports.filter((report) => report.clinicId === clinic.id),
      ...clinic.recentReports,
    ].slice(0, 6);
  }, [clinic, submittedReports]);

  if (loading) return <div className="shell page-space"><PageLoader label="Loading clinic details" /></div>;

  if (!clinic) {
    return (
      <div className="shell page-space">
        <div className="empty-state">
          <span className="empty-icon"><MapPin aria-hidden="true" /></span>
          <h1>We couldn’t find that clinic</h1>
          <p>The clinic may have moved out of this fictional demo set.</p>
          <Link className="button button-primary" to="/find">Back to care search</Link>
        </div>
      </div>
    );
  }

  const estimate = clinic.estimates.find((item) => item.mode === mode) || clinic.estimates[0];
  const isSaved = savedClinicIds.includes(clinic.id);
  const averageRating = clinic.reviews.reduce((sum, review) => sum + review.overall, 0) / clinic.reviews.length;

  const handleSavePlan = async (event: FormEvent) => {
    event.preventDefault();
    setSavingPlan(true);
    const appointment: SavedAppointment = {
      id: `appointment-${Date.now()}`,
      clinicId: clinic.id,
      appointmentTime: new Date(planValues.appointmentTime).toISOString(),
      visitMode: mode,
      travelMinutes: planValues.travelMinutes,
      bufferMinutes: planValues.bufferMinutes,
    };
    await saveAppointment(appointment);
    setSavingPlan(false);
    setPlanOpen(false);
  };

  const handleBooking = (providerName?: string) => {
    pushToast(
      providerName
        ? `Integration placeholder: booking for ${providerName} would open here.`
        : 'Integration placeholder: the clinic’s scheduling system would open here.',
      'info',
    );
  };

  const toggleQueueAlert = () => {
    setQueueAlertOn((current) => !current);
    pushToast(
      queueAlertOn
        ? 'Simulated estimate-change alert turned off.'
        : 'Simulated alert on. Production notifications require clinic queue data.',
      'info',
    );
  };

  return (
    <div className="clinic-page">
      <div className="clinic-profile-top">
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/find"><ArrowLeft aria-hidden="true" /> Care near Durham</Link>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{clinic.name}</span>
          </nav>

          <div className="clinic-profile-heading">
            <div className="clinic-title-group">
              <span className="profile-clinic-icon" style={{ backgroundColor: `${clinic.accent}22`, color: clinic.accent }}>
                <Heart aria-hidden="true" fill="currentColor" />
              </span>
              <div>
                <div className="title-kicker-row">
                  <span className="eyebrow">{clinic.type}</span>
                  <DemoBadge label="Fictional clinic" />
                </div>
                <h1>{clinic.name}</h1>
                <p><MapPin aria-hidden="true" /> {clinic.address} · {clinic.distanceMiles.toFixed(1)} mi away</p>
              </div>
            </div>
            <div className="profile-actions">
              <button
                type="button"
                className={isSaved ? 'button button-secondary saved' : 'button button-secondary'}
                onClick={() => toggleSavedClinic(clinic.id)}
                aria-pressed={isSaved}
              >
                <Bookmark aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved' : 'Save clinic'}
              </button>
              <button type="button" className="button button-coral" onClick={() => handleBooking()}>
                Check availability <ExternalLink aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="clinic-facts">
            <div><span className={`status status-${clinic.status}`}><span /> {clinic.status === 'open' ? `Open · Closes ${clinic.closesAt}` : `Closed · Opens ${clinic.opensAt}`}</span><small>Today: {clinic.hours.today}</small></div>
            <div><Phone aria-hidden="true" /><span><strong>{clinic.phone}</strong><small>Fictional number</small></span></div>
            <div><Languages aria-hidden="true" /><span><strong>{clinic.languages.join(', ')}</strong><small>Languages listed</small></span></div>
            <div><ShieldCheck aria-hidden="true" /><span><strong>{clinic.insurance.length} sample plans</strong><small>Confirm coverage with clinic</small></span></div>
          </div>
        </div>
      </div>

      <div className="shell profile-content">
        <section className="live-estimate-section" aria-labelledby="live-estimate-title">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Current planning snapshot</span>
              <h2 id="live-estimate-title">What this visit may look like</h2>
              <p>These minutes cover arrival through departure—not just the waiting room.</p>
            </div>
            {clinic.visitModes.length > 1 && (
              <div className="mode-toggle" aria-label="Visit type estimate">
                {clinic.visitModes.map((visitMode) => (
                  <button key={visitMode} type="button" className={mode === visitMode ? 'active' : ''} onClick={() => setMode(visitMode)} aria-pressed={mode === visitMode}>
                    {formatMode(visitMode)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="live-estimate-card">
            <div className="live-number-panel">
              <span>Demo total visit estimate</span>
              <strong>{estimate.totalMinutes}<small> min</small></strong>
              <p>Likely range: {estimate.range[0]}–{estimate.range[1]} minutes</p>
              <div className="live-update"><Clock3 aria-hidden="true" /> Updated {estimate.updatedMinutesAgo} minutes ago</div>
            </div>
            <div className="live-breakdown-panel">
              <div className="estimate-card-topline">
                <span className="mode-pill">{formatMode(estimate.mode)}</span>
                <ReliabilityBadge score={clinic.reliability.score} level={clinic.reliability.level} />
              </div>
              <VisitBreakdown estimate={estimate} />
              <p className="estimate-source-line"><Users aria-hidden="true" /> {estimate.contributingReports} recent sample reports contribute to this view.</p>
            </div>
            <div className="live-action-panel">
              <CalendarPlus aria-hidden="true" />
              <h3>Plan around your visit</h3>
              <p>Add a time to see when to leave and when you may be finished.</p>
              <button type="button" className="button button-primary" onClick={() => setPlanOpen(true)}>Plan this visit <ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
          <InfoNote>
            <strong>Why the range?</strong> Urgent cases, staffing, late arrivals, and visit complexity can all change timing. Confidence describes the data—not a guarantee.
          </InfoNote>
        </section>

        <div className="profile-grid profile-grid-main">
          <section className="profile-card history-section" aria-labelledby="history-title">
            <div className="section-heading split-heading compact-heading">
              <div>
                <span className="eyebrow">Historical patterns</span>
                <h2 id="history-title">Choose a steadier time</h2>
                <p>Sample total-visit patterns from the last eight weeks.</p>
              </div>
              <span className="sample-chip">Modeled history</span>
            </div>
            <HistoricalChart records={clinic.historicalWaits} takeaway={clinic.takeaway} />
          </section>

          <aside className="profile-card reliability-section" id="reliability" aria-labelledby="reliability-title">
            <span className="eyebrow">Not a star rating</span>
            <h2 id="reliability-title">Estimate confidence</h2>
            <div className={`confidence-score score-${clinic.reliability.level}`}>
              <div><strong>{clinic.reliability.score}</strong><span>/100</span></div>
              <b>{clinic.reliability.level} confidence</b>
            </div>
            <p>{clinic.reliability.summary}</p>
            <div className="factor-list">
              {clinic.reliability.factors.map((factor) => (
                <div className="factor" key={factor.label} title={factor.explanation}>
                  <div><span>{factor.label}</span><strong>{factor.score}</strong></div>
                  <div className="factor-track"><span style={{ width: `${factor.score}%` }} /></div>
                  <small>{factor.explanation}</small>
                </div>
              ))}
            </div>
            <Link className="text-link" to="/know#reliability">How confidence works <ArrowRight aria-hidden="true" /></Link>
          </aside>
        </div>

        <div className="profile-grid reports-provider-grid">
          <section className="profile-card reports-section" aria-labelledby="reports-title">
            <div className="section-heading split-heading compact-heading">
              <div>
                <span className="eyebrow">Recent activity</span>
                <h2 id="reports-title">Patient wait reports</h2>
              </div>
              <Link className="button button-secondary" to={`/report?clinic=${clinic.id}`}>Add yours</Link>
            </div>
            <div className="report-feed">
              {visibleReports.map((report) => (
                <article className="report-row" key={report.id}>
                  <span className="report-source-icon"><UserRound aria-hidden="true" /></span>
                  <div>
                    <div className="report-row-title">
                      <strong>{report.totalMinutes} min total</strong>
                      <span className="mode-pill subtle">{formatMode(report.visitMode)}</span>
                    </div>
                    <p>{report.source === 'patient report' ? 'Patient-submitted sample' : report.source} · {report.anonymous ? 'Anonymous' : 'Source labeled'}</p>
                    {report.note && <blockquote>“{report.note}”</blockquote>}
                  </div>
                  <time dateTime={report.submittedAt}>{relativeReportTime(report.submittedAt)}</time>
                </article>
              ))}
            </div>
            <p className="integrity-line"><BadgeCheck aria-hidden="true" /> Future reports may be rate-limited, deduplicated, weighted, or reviewed for suspicious patterns.</p>
          </section>

          <section className="profile-card providers-section" aria-labelledby="providers-title">
            <div className="section-heading compact-heading">
              <span className="eyebrow">People at this clinic</span>
              <h2 id="providers-title">Providers</h2>
              <p>Ratings describe provider experience; confidence describes estimate quality.</p>
            </div>
            <div className="provider-list">
              {clinic.providers.map((provider) => (
                <article className="provider-card" key={provider.id}>
                  <div className="provider-avatar" style={{ background: provider.color }}>{provider.initials}</div>
                  <div className="provider-details">
                    <h3>{provider.name}</h3>
                    <p>{provider.role}</p>
                    <div className="provider-rating"><RatingStars value={provider.rating} label={`${provider.name} rating`} /><span>{provider.reviewCount} sample reviews</span></div>
                    <blockquote>“{provider.reviewContext}”</blockquote>
                    <div className="availability"><Clock3 aria-hidden="true" /><span><small>Next simulated availability</small><strong>{provider.nextAvailability}</strong></span></div>
                  </div>
                  <button className="button button-secondary" type="button" onClick={() => handleBooking(provider.name)}>Booking placeholder <ExternalLink aria-hidden="true" /></button>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="reviews-section" aria-labelledby="reviews-title">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Structured context</span>
              <h2 id="reviews-title">More than one rating</h2>
              <p>Clinic experience and provider experience answer different questions.</p>
            </div>
            <div className="overall-rating"><Star aria-hidden="true" fill="currentColor" /><strong>{averageRating.toFixed(1)}</strong><span>Sample clinic experience</span></div>
          </div>
          <div className="review-grid">
            {clinic.reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-topline">
                  <div><span className="review-avatar"><MessageCircle aria-hidden="true" /></span><span><strong>{review.author}</strong><small>{review.date} · {formatMode(review.visitMode)}</small></span></div>
                  <RatingStars value={review.overall} label="Overall clinic experience" />
                </div>
                <blockquote>“{review.text}”</blockquote>
                <dl className="review-metrics">
                  <div><dt>Provider</dt><dd>{review.providerExperience}/5</dd></div>
                  <div><dt>Communication</dt><dd>{review.communication}/5</dd></div>
                  <div><dt>Wait accuracy</dt><dd>{review.waitAccuracy}/5</dd></div>
                  <div><dt>Accessibility</dt><dd>{review.accessibility}/5</dd></div>
                  <div><dt>Felt rushed</dt><dd>{review.feltRushed ? 'Yes' : 'No'}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <button className="button button-ghost external-reviews" type="button" onClick={() => pushToast('Integration placeholder: verified external review sources would appear here.', 'info')}>
            Compare external review sources <ExternalLink aria-hidden="true" />
          </button>
        </section>

        <section className="queue-concept" aria-labelledby="queue-title">
          <div className="queue-visual" aria-hidden="true">
            <span className="queue-person done"><Check /></span>
            <span className="queue-line active" />
            <span className="queue-person current">2</span>
            <span className="queue-line" />
            <span className="queue-person">3</span>
          </div>
          <div>
            <div className="title-kicker-row"><span className="eyebrow light">Future queue concept</span><span className="concept-tag">Simulated</span></div>
            <h2 id="queue-title">Know when conditions change</h2>
            <p>
              A future clinic connection could notify you when the estimate shifts or when you’re approximately next. Urgent patient needs can change order quickly, so a queue position could never be a promise.
            </p>
          </div>
          <button className={queueAlertOn ? 'button button-light active' : 'button button-light'} type="button" onClick={toggleQueueAlert} aria-pressed={queueAlertOn}>
            <Bell aria-hidden="true" fill={queueAlertOn ? 'currentColor' : 'none'} /> {queueAlertOn ? 'Demo alert on' : 'Notify me of changes'}
          </button>
        </section>

        <div className="insurance-specialty-grid">
          <section className="profile-card">
            <h2>Accepted insurance <small>sample list</small></h2>
            <div className="tag-list">{clinic.insurance.map((item) => <span key={item}><Check aria-hidden="true" /> {item}</span>)}</div>
            <p>Coverage and network status can change. Confirm directly before booking.</p>
          </section>
          <section className="profile-card">
            <h2>Care offered</h2>
            <div className="tag-list">{clinic.specialties.map((item) => <span key={item}>{item}</span>)}</div>
            <p>MediQ does not recommend a diagnosis or choose a specialty for you.</p>
          </section>
        </div>

        <SafetyNote />
      </div>

      {planOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPlanOpen(false)}>
          <section className="plan-modal" role="dialog" aria-modal="true" aria-labelledby="plan-modal-title">
            <button className="modal-close" type="button" onClick={() => setPlanOpen(false)} aria-label="Close visit planner"><X aria-hidden="true" /></button>
            <span className="eyebrow">Guest planning tool</span>
            <h2 id="plan-modal-title">Plan your {formatMode(mode).toLowerCase()} visit</h2>
            <p>We’ll save this only in your browser. No medical details are needed.</p>
            <form onSubmit={handleSavePlan}>
              <label className="field-label">
                <span>Appointment or planned arrival</span>
                <input
                  required
                  type="datetime-local"
                  value={planValues.appointmentTime}
                  onChange={(event) => setPlanValues((current) => ({ ...current, appointmentTime: event.target.value }))}
                />
              </label>
              <div className="modal-fields-row">
                <label className="field-label">
                  <span>Simulated travel time</span>
                  <select value={planValues.travelMinutes} onChange={(event) => setPlanValues((current) => ({ ...current, travelMinutes: Number(event.target.value) }))}>
                    <option value={10}>10 minutes</option><option value={18}>18 minutes</option><option value={25}>25 minutes</option><option value={35}>35 minutes</option>
                  </select>
                </label>
                <label className="field-label">
                  <span>Arrival buffer</span>
                  <select value={planValues.bufferMinutes} onChange={(event) => setPlanValues((current) => ({ ...current, bufferMinutes: Number(event.target.value) }))}>
                    <option value={0}>No buffer</option><option value={10}>10 minutes</option><option value={15}>15 minutes</option><option value={20}>20 minutes</option>
                  </select>
                </label>
              </div>
              <div className="plan-form-summary">
                <Timer aria-hidden="true" />
                <span><strong>{estimate.totalMinutes} min estimated visit</strong><small>Likely range {estimate.range[0]}–{estimate.range[1]} minutes</small></span>
              </div>
              <button className="button button-primary button-full" type="submit" disabled={savingPlan}>
                {savingPlan ? 'Saving your plan…' : 'Save visit & calculate plan'} <ArrowRight aria-hidden="true" />
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
