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
import { accessibilityKeys } from '../types';
import { accessibilityLabels } from '../utils/accessibility';
import { EstimateEvidence, InsuranceNotice, EmergencyNotice, ConceptHelp, hasEstimate } from '../components/CareInformation';
import { TimePicker } from '../components/TimePicker';
import { DemoBadge, InfoNote, Modal, PageLoader, ReliabilityBadge, SafetyNote } from '../components/UI';
import { useApp } from '../context/AppContext';
import { backendEnabled } from '../services/api';
import { clinicService } from '../services/clinicService';
import type { Clinic, SavedAppointment, VisitMode } from '../types';
import { Link } from '../utils/navigation';
import { relativeReportTime, toLocalDateTimeInput } from '../utils/time';

export function ClinicPage({ clinicId }: { clinicId: string }) {
  const {
    t, language,
    savedClinicIds,
    submittedReports,
    toggleSavedClinic,
    saveAppointment,
    pushToast,
  } = useApp();
  const [clinic, setClinic] = useState<Clinic | undefined>();
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
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
    let active = true; setLoading(true); setLoadError(false);
    void clinicService.getClinicById(clinicId).then((result) => {
      if (!active) return;
      setClinic(result);
      if (result) setMode(result.visitModes[0]);
      setLoading(false);
    }, () => { if (active) { setLoadError(true); setLoading(false); } });
    return () => { active = false; };
  }, [clinicId, retry]);

  const visibleReports = useMemo(() => {
    if (!clinic) return [];
    return [
      ...submittedReports.filter((report) => report.clinicId === clinic.id),
      ...clinic.recentReports,
    ].filter((report, index, all) => report.moderationStatus !== 'review' && all.findIndex(item => item.id === report.id) === index).slice(0, 6);
  }, [clinic, submittedReports]);

  if (loading) return <div className="shell page-space"><PageLoader label={t("Loading clinic details")} /></div>;

  if (loadError) return <div className="shell page-space" role="alert"><p>{t('The service is unavailable. Please try again.')}</p><button className="button button-primary" onClick={() => setRetry(n => n + 1)}>{t('Try again')}</button></div>;
  if (!clinic) {
    return (
      <div className="shell page-space">
        <div className="empty-state">
          <span className="empty-icon"><MapPin aria-hidden="true" /></span>
          <h1>{t("We couldn’t find that clinic")}</h1>
          <p>{t("The clinic may have moved out of this fictional demo set.")}</p>
          <Link className="button button-primary" to="/find">{t("Back to care search")}</Link>
        </div>
      </div>
    );
  }

  const estimate = clinic.estimates.find((item) => item.mode === mode) || clinic.estimates[0];
  const reliability = estimate.reliability || clinic.reliability;
  const isSaved = savedClinicIds.includes(clinic.id);
  const averageRating = clinic.rating?.rating ?? 0;

  const handleSavePlan = async (event: FormEvent) => {
    event.preventDefault();
    if (savingPlan) return;
    setSavingPlan(true);
    const appointment: SavedAppointment = {
      id: `appointment-${Date.now()}`,
      clinicId: clinic.id,
      appointmentTime: new Date(planValues.appointmentTime).toISOString(),
      visitMode: mode,
      travelMinutes: planValues.travelMinutes,
      bufferMinutes: planValues.bufferMinutes,
    };
    try { await saveAppointment(appointment); setPlanOpen(false); }
    catch { pushToast(t('Your plan could not be saved. Please try again.'), 'info'); }
    finally { setSavingPlan(false); }
  };

  const handleBooking = (providerName?: string) => {
    pushToast(t('Booking is a demo placeholder. No appointment was booked.'), 'info');
  };

  const toggleQueueAlert = () => {
    setQueueAlertOn((current) => !current);
    pushToast(
      queueAlertOn
        ? t('Simulated estimate-change alert turned off.')
        : t('Simulated alert on. Production notifications require clinic queue data.'),
      'info',
    );
  };

  return (
    <div className="clinic-page">
      <div className="clinic-profile-top">
        <div className="shell">
          <nav className="breadcrumb" aria-label={t('Breadcrumb')}>
            <Link to="/find"><ArrowLeft aria-hidden="true" /> {t("Care near Durham")}</Link>
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
                  <DemoBadge label={t("Fictional clinic")} />
                </div>
                <h1>{clinic.name}</h1>
                <p><MapPin aria-hidden="true" /> {clinic.address} · {clinic.distanceMiles.toFixed(1)} {t("mi away")}</p>
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
                {isSaved ? t("Saved") : t("Save clinic")}
              </button>
              <button type="button" className="button button-coral" onClick={() => handleBooking()}> {t("Check availability")} <ExternalLink aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="clinic-facts">
            <div><span className={`status status-${clinic.status}`}><span /> {clinic.status === 'open' ? t('Open · Closes {time}', { time: clinic.closesAt || '' }) : t('Closed · Opens {time}', { time: clinic.opensAt || '' })}</span><small>{t("Today:")} {clinic.hours.today}</small></div>
            <div><Phone aria-hidden="true" /><span><strong>{clinic.phone}</strong><small>{t("Fictional number")}</small></span></div>
            <div><Languages aria-hidden="true" /><span><strong>{clinic.languages.join(', ')}</strong><small>{t("Languages listed")}</small></span></div>
            <div><ShieldCheck aria-hidden="true" /><span><strong>{clinic.insurance.length} {t("sample plans")}</strong><small>{t("Confirm coverage with clinic")}</small></span></div>
          </div>
        </div>
      </div>

      <div className="shell profile-content"><EmergencyNotice/>
        <section className="live-estimate-section" aria-labelledby="live-estimate-title">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">{t("Current planning snapshot")}</span>
              <h2 id="live-estimate-title">{t("What this visit may look like")}</h2>
              <p>{t("These minutes cover arrival through departure—not just the waiting room.")}</p>
            </div>
            {clinic.visitModes.length > 1 && (
              <div className="mode-toggle" aria-label={t('Visit type estimate')}>
                {clinic.visitModes.map((visitMode) => (
                  <button key={visitMode} type="button" className={mode === visitMode ? 'active' : ''} onClick={() => setMode(visitMode)} aria-pressed={mode === visitMode}>
                    {t(formatMode(visitMode))}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="live-estimate-card">
            <div className="live-number-panel">
              <span>{t(estimate.provenance?.fictional?'Fictional reference estimate':'Estimated total visit time')}</span><ConceptHelp label="About visit estimates" text="The estimated total time from arrival to departure, including check-in, waiting, care and check-out."/>
              <strong className={!hasEstimate(estimate)?"estimate-unavailable":undefined}>{hasEstimate(estimate)?new Intl.NumberFormat(language).format(estimate.totalMinutes):t('Unavailable')}{hasEstimate(estimate)&&<small> {t("min")}</small>}</strong>
              {hasEstimate(estimate)&&<p>{t('Usually {low}–{high} min',{low:estimate.range[0],high:estimate.range[1]})}</p>}
              <EstimateEvidence estimate={estimate}/>
            </div>
            <div className="live-breakdown-panel">
              <div className="estimate-card-topline">
                <span className="mode-pill">{t(formatMode(estimate.mode))}</span>
                <ReliabilityBadge score={reliability.score} level={reliability.level} />
              </div>
              {hasEstimate(estimate)&&<VisitBreakdown estimate={estimate}/>}
              {backendEnabled && <p className="info-note">{t(estimate.evidenceState === 'ready' ? 'Report-based total. Stage proportions are modeled, not measured.' : estimate.provenance?.fictional ? 'Not enough fresh reports. The displayed reference is fictional, not a live estimate.' : 'Not enough recent evidence for a current estimate.')}</p>}
              <ConceptHelp label="About confidence" text="Confidence describes the freshness, amount and consistency of timing evidence. It does not rate care quality."/>
            </div>
            <div className="live-action-panel">
              <CalendarPlus aria-hidden="true" />
              <h3>{t("Plan around your visit")}</h3>
              <p>{t("Add a time to see when to leave and when you may be finished.")}</p>
              <button type="button" className="button button-primary" onClick={() => setPlanOpen(true)}>{t("Plan this visit")} <ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
          <InfoNote>
            <strong>{t("Why the range?")}</strong> {t("Urgent cases, staffing, late arrivals, and visit complexity can all change timing. Confidence describes the data—not a guarantee.")} </InfoNote>
        </section>

        <div className="profile-grid profile-grid-main">
          <section className="profile-card history-section" aria-labelledby="history-title">
            <div className="section-heading split-heading compact-heading">
              <div>
                <span className="eyebrow">{t("Historical patterns")}</span>
                <h2 id="history-title">{t("Choose a steadier time")}</h2>
                <p>{t("Sample total-visit patterns from the last eight weeks.")}</p>
              </div>
              <span className="sample-chip">{t("Modeled history")}</span>
            </div>
            <ConceptHelp label="About historical patterns" text="Patterns show how visit times varied in the past. Fictional modeled history is labeled and does not predict your visit."/><HistoricalChart records={clinic.historicalWaits} takeaway={clinic.takeaway} />
          </section>

          <aside className="profile-card reliability-section" id="reliability" aria-labelledby="reliability-title">
            <span className="eyebrow">{t("Not a star rating")}</span>
            <h2 id="reliability-title">{t("Estimate confidence")}</h2>
            <div className={`confidence-score score-${reliability.level}`}>

              <b>{t(reliability.level)} {t("confidence")}</b>
            </div>
            <p>{t(reliability.summary)}</p>
            <div className="factor-list">
              {reliability.factors.map((factor) => (
                <div className="factor" key={t(factor.label)} title={t(factor.explanation)}>
                  <div><span>{t(factor.label)}</span><strong>{factor.score}</strong></div>
                  <div className="factor-track"><span style={{ width: `${factor.score}%` }} /></div>
                  <small>{t(factor.explanation)}</small>
                </div>
              ))}
            </div>
            <Link className="text-link" to="/know#reliability">{t("How confidence works")} <ArrowRight aria-hidden="true" /></Link>
          </aside>
        </div>

        <div className="profile-grid reports-provider-grid">
          <section className="profile-card reports-section" aria-labelledby="reports-title">
            <div className="section-heading split-heading compact-heading">
              <div>
                <span className="eyebrow">{t("Recent activity")}</span>
                <h2 id="reports-title">{t("Patient wait reports")}</h2>
              </div>
              <Link className="button button-secondary" to={`/report?clinic=${clinic.id}`}>{t("Add yours")}</Link>
            </div>
            <div className="report-feed">
              {visibleReports.map((report) => (
                <article className="report-row" key={report.id}>
                  <span className="report-source-icon"><UserRound aria-hidden="true" /></span>
                  <div>
                    <div className="report-row-title">
                      <strong>{report.reportKind === 'current-wait' ? `${report.elapsedMinutes} ${t('min waiting so far')}` : `${report.totalMinutes} ${t('min total')}`} </strong>
                      <span className="mode-pill subtle">{t(formatMode(report.visitMode))}</span>
                    </div>
                    <p>{report.source === 'patient report' ? t(backendEnabled ? 'Patient report' : 'Patient-submitted sample') : report.source} · {report.anonymous ? t("Anonymous") : t("Source labeled")}</p>
                    {report.note && <blockquote>“{report.note}”</blockquote>}
                  </div>
                  <time dateTime={report.submittedAt}>{relativeReportTime(report.submittedAt)}</time>
                </article>
              ))}
            </div>

          </section>

          <section className="profile-card providers-section" aria-labelledby="providers-title">
            <div className="section-heading compact-heading">
              <span className="eyebrow">{t("People at this clinic")}</span>
              <h2 id="providers-title">{t("Providers")}</h2>
              <p>{t("Ratings describe provider experience; confidence describes estimate quality.")}</p>
            </div>
            <div className="provider-list">
              {clinic.providers.map((provider) => (
                <article className="provider-card" key={provider.id}>
                  <div className="provider-avatar" style={{ background: provider.color }}>{provider.initials}</div>
                  <div className="provider-details">
                    <h3>{provider.name}</h3>
                    <p>{provider.role}</p>
                    <div className="provider-rating"><RatingStars value={provider.rating} label={`${provider.name} rating`} /><span>{provider.reviewCount} {t("sample reviews")}</span></div>
                    <blockquote>“{provider.reviewContext}”</blockquote>
                    <div className="availability"><Clock3 aria-hidden="true" /><span><small>{t("Next simulated availability")}</small><strong>{provider.nextAvailability}</strong></span></div>
                  </div>
                  <button className="button button-secondary" type="button" onClick={() => handleBooking(provider.name)}>{t("Booking placeholder")} <ExternalLink aria-hidden="true" /></button>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="reviews-section" aria-labelledby="reviews-title">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">{t("Structured context")}</span>
              <h2 id="reviews-title">{t("More than one rating")}</h2>
              <p>{t("Clinic experience and provider experience answer different questions.")}</p>
            </div>
            {clinic.rating&&<div className="overall-rating"><Star aria-hidden="true" fill="currentColor" /><strong>{averageRating.toFixed(1)}</strong><span>{t(clinic.rating?.source==='demo'?'Sample clinic experience':'Patient experience')}</span></div>}
          </div>
          <div className="review-grid">
            {clinic.reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-topline">
                  <div><span className="review-avatar"><MessageCircle aria-hidden="true" /></span><span><strong>{review.author}</strong><small>{review.date} · {t(formatMode(review.visitMode))}</small></span></div>
                  <RatingStars value={review.overall} label="Overall clinic experience" />
                </div>
                <blockquote>“{review.text}”</blockquote>
                <dl className="review-metrics">
                  <div><dt>{t("Provider")}</dt><dd>{review.providerExperience}/5</dd></div>
                  <div><dt>{t("Communication")}</dt><dd>{review.communication}/5</dd></div>
                  <div><dt>{t("Wait accuracy")}</dt><dd>{review.waitAccuracy}/5</dd></div>
                  <div><dt>{t("Accessibility")}</dt><dd>{review.accessibility}/5</dd></div>
                  <div><dt>{t("Felt rushed")}</dt><dd>{review.feltRushed ? t("Yes") : t("No")}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <button className="button button-ghost external-reviews" type="button" onClick={() => pushToast(t('External reviews are not connected in this prototype.'), 'info')}> {t("Compare external review sources")} <ExternalLink aria-hidden="true" />
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
            <div className="title-kicker-row"><span className="eyebrow light">{t("Future queue concept")}</span><span className="concept-tag">{t("Simulated")}</span></div>
            <h2 id="queue-title">{t("Know when conditions change")}</h2>
            <p> {t("A future clinic connection could notify you when the estimate shifts or when you’re approximately next. Urgent patient needs can change order quickly, so a queue position could never be a promise.")} </p>
          </div>
          <button className={queueAlertOn ? 'button button-light active' : 'button button-light'} type="button" onClick={toggleQueueAlert} aria-pressed={queueAlertOn}>
            <Bell aria-hidden="true" fill={queueAlertOn ? 'currentColor' : 'none'} /> {queueAlertOn ? t("Demo alert on") : t("Notify me of changes")}
          </button>
        </section>

        <div className="insurance-specialty-grid">
          <section className="profile-card">
            <h2>{t("Accepted insurance")} <small>{t("sample list")}</small></h2>
            <div className="tag-list">{clinic.insurance.map((item) => <span key={item}><Check aria-hidden="true" /> {item}</span>)}</div>
            <InsuranceNotice/>
          </section>
          <section className="profile-card">
            <h2>{t("Care offered")}</h2>
            <div className="tag-list">{clinic.specialties.map((item) => <span key={item}>{item}</span>)}</div>
            <p>{t("MediQ does not recommend a diagnosis or choose a specialty for you.")}</p>
          </section>
        </div>

        <section className="profile-card clinic-accessibility"><h2>{t('Clinic accessibility')}</h2><p>{t(clinic.fictional?'Fictional accessibility attributes. Confirm services directly with the clinic.':'Please confirm accessibility services directly with the clinic.')}</p><dl>{accessibilityKeys.map(key=><div key={key}><dt>{t(accessibilityLabels[key])}</dt><dd>{t(clinic.accessibility?.[key]==='available'?'Available':clinic.accessibility?.[key]==='unavailable'?'Not available':'Unknown')}</dd></div>)}</dl></section>
        <SafetyNote />
      </div>

      {planOpen && (
        <Modal title={t('Plan your visit')} onClose={() => setPlanOpen(false)}>
            <p>{t("Guest plans reset on reload. Signed-in plans are saved privately. A plan is not a booking.")}</p>
            <form onSubmit={handleSavePlan}>
              <label className="field-label">
                <span>{t("Appointment or planned arrival")}</span>
                <input required type="date" value={planValues.appointmentTime.slice(0,10)} onChange={event=>setPlanValues(current=>({...current,appointmentTime:event.target.value+'T'+current.appointmentTime.slice(11)}))}/>
              </label>
              <TimePicker label="Planned arrival time" value={planValues.appointmentTime.slice(11,16)} onChange={value=>setPlanValues(current=>({...current,appointmentTime:current.appointmentTime.slice(0,10)+'T'+(value||'00:00')}))}/>
              <div className="modal-fields-row">
                <label className="field-label">
                  <span>{t("Simulated travel time")}</span>
                  <select value={planValues.travelMinutes} onChange={(event) => setPlanValues((current) => ({ ...current, travelMinutes: Number(event.target.value) }))}>
                    <option value={10}>{t("10 minutes")}</option><option value={18}>{t("18 minutes")}</option><option value={25}>{t("25 minutes")}</option><option value={35}>{t("35 minutes")}</option>
                  </select>
                </label>
                <label className="field-label">
                  <span>{t("Arrival buffer")}</span>
                  <select value={planValues.bufferMinutes} onChange={(event) => setPlanValues((current) => ({ ...current, bufferMinutes: Number(event.target.value) }))}>
                    <option value={0}>{t("No buffer")}</option><option value={10}>{t("10 minutes")}</option><option value={15}>{t("15 minutes")}</option><option value={20}>{t("20 minutes")}</option>
                  </select>
                </label>
              </div>
              <div className="plan-form-summary">
                <Timer aria-hidden="true" />
                <span><strong>{hasEstimate(estimate)?t('{minutes} min',{minutes:estimate.totalMinutes}):t('Unavailable')}</strong><EstimateEvidence estimate={estimate}/></span>
              </div>
              <button className="button button-primary button-full" type="submit" disabled={savingPlan}>
                {savingPlan ? t("Saving your plan…") : t("Save visit & calculate plan")} <ArrowRight aria-hidden="true" />
              </button>
            </form>
        </Modal>
      )}
    </div>
  );
}
