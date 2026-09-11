import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  Info,
  LockKeyhole,
  MessageSquarePlus,
  ShieldCheck,
  Sparkles,
  Timer,
  UserRoundCheck,
} from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { DemoBadge, InfoNote, SafetyNote } from '../components/UI';
import { useApp } from '../context/AppContext';
import { clinicService } from '../services/clinicService';
import type { Clinic, VisitMode, WaitReportDraft } from '../types';
import { Link } from '../utils/navigation';

const today = new Date().toISOString().slice(0, 10);

const initialDraft = (clinicId = ''): WaitReportDraft => ({
  clinicId,
  visitMode: 'scheduled',
  visitDate: today,
  arrivalTime: '',
  checkInTime: '',
  providerTime: '',
  departureTime: '',
  totalRange: '',
  accuracy: '',
  communication: 0,
  rushed: '',
  note: '',
  anonymous: true,
});

const toMinutes = (value: string) => {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
};

export function ReportPage() {
  const { submitReport } = useApp();
  const queryClinicId = new URLSearchParams(window.location.search).get('clinic') || '';
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [draft, setDraft] = useState<WaitReportDraft>(() => initialDraft(queryClinicId));
  const [durationMode, setDurationMode] = useState<'exact' | 'range'>('exact');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ totalMinutes: number; clinicId: string } | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void clinicService.searchClinics({
      query: '', insurance: '', specialty: '', visitMode: 'all', timing: 'all', maxDistance: 25,
    }).then((items) => {
      setClinics(items);
      const selected = items.find((clinic) => clinic.id === queryClinicId);
      if (selected && !selected.visitModes.includes(draft.visitMode)) {
        setDraft((current) => ({ ...current, visitMode: selected.visitModes[0] }));
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedClinic = clinics.find((clinic) => clinic.id === draft.clinicId);

  const updateDraft = <K extends keyof WaitReportDraft>(key: K, value: WaitReportDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const selectClinic = (clinicId: string) => {
    const clinic = clinics.find((item) => item.id === clinicId);
    setDraft((current) => ({
      ...current,
      clinicId,
      visitMode: clinic?.visitModes.includes(current.visitMode) ? current.visitMode : clinic?.visitModes[0] || 'scheduled',
    }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!draft.clinicId) nextErrors.clinicId = 'Choose the clinic you visited.';
    if (!draft.visitDate) nextErrors.visitDate = 'Add the visit date.';
    if (durationMode === 'range' && !draft.totalRange) nextErrors.totalRange = 'Choose an approximate total time.';
    if (durationMode === 'exact') {
      if (!draft.arrivalTime) nextErrors.arrivalTime = 'Add your approximate arrival time.';
      if (!draft.providerTime) nextErrors.providerTime = 'Add when the provider arrived.';
      if (!draft.departureTime) nextErrors.departureTime = 'Add your approximate departure time.';
      const orderedTimes = [draft.arrivalTime, draft.checkInTime, draft.providerTime, draft.departureTime]
        .filter(Boolean)
        .map(toMinutes);
      if (orderedTimes.some((value, index) => index > 0 && value < orderedTimes[index - 1])) {
        nextErrors.times = 'Times should follow the visit order: arrival, check-in, provider, departure.';
      }
    }
    if (!draft.accuracy) nextErrors.accuracy = 'Tell us how the estimate compared.';
    if (!draft.communication) nextErrors.communication = 'Rate communication from 1 to 5.';
    if (!draft.rushed) nextErrors.rushed = 'Choose whether the visit felt rushed.';
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setSubmitting(true);
    const payload = durationMode === 'range'
      ? { ...draft, arrivalTime: '', checkInTime: '', providerTime: '', departureTime: '' }
      : { ...draft, totalRange: '' };
    const result = await submitReport(payload);
    setSubmitting(false);
    setConfirmation({ totalMinutes: result.totalMinutes, clinicId: result.clinicId });
  };

  const reset = () => {
    setDraft(initialDraft(queryClinicId));
    setDurationMode('exact');
    setErrors({});
    setConfirmation(null);
  };

  if (confirmation) {
    const clinic = clinics.find((item) => item.id === confirmation.clinicId);
    return (
      <div className="report-page page-space">
        <div className="shell report-shell">
          <section className="report-confirmation">
            <div className="confirmation-mark"><Check aria-hidden="true" /></div>
            <DemoBadge label="Sample report added" />
            <h1>That’s one more useful signal.</h1>
            <p>
              Your {confirmation.totalMinutes}-minute report for <strong>{clinic?.name}</strong> now appears in this prototype’s recent report feed.
            </p>
            <div className="confirmation-summary">
              <div><Clock3 aria-hidden="true" /><span><strong>{confirmation.totalMinutes} min</strong><small>Reported total visit</small></span></div>
              <div><ShieldCheck aria-hidden="true" /><span><strong>{draft.anonymous ? 'Anonymous' : 'Source labeled'}</strong><small>Reporting preference</small></span></div>
              <div><LockKeyhole aria-hidden="true" /><span><strong>No medical details</strong><small>Operational data only</small></span></div>
            </div>
            <div className="confirmation-actions">
              <Link className="button button-primary" to={`/clinic/${confirmation.clinicId}`}>See clinic report feed <ArrowRight aria-hidden="true" /></Link>
              <button className="button button-secondary" type="button" onClick={reset}>Report another visit</button>
            </div>
          </section>
          <SafetyNote />
        </div>
      </div>
    );
  }

  return (
    <div className="report-page page-space">
      <div className="shell report-shell">
        <Link className="back-link" to={draft.clinicId ? `/clinic/${draft.clinicId}` : '/find'}><ArrowLeft aria-hidden="true" /> Back</Link>
        <div className="report-heading">
          <div>
            <span className="eyebrow">About one minute</span>
            <h1>Report your visit</h1>
            <p>Your timing helps make the next person’s day easier. Share only operational details—never diagnoses or medical records.</p>
          </div>
          <div className="report-time-badge"><Timer aria-hidden="true" /><span><strong>≈ 1 minute</strong><small>7 quick answers</small></span></div>
        </div>

        <form className="report-form" onSubmit={handleSubmit} noValidate>
          {Object.keys(errors).length > 0 && (
            <div className="form-error-summary" role="alert" tabIndex={-1} ref={errorRef}>
              <Info aria-hidden="true" />
              <div><strong>Please check {Object.keys(errors).length} answer{Object.keys(errors).length === 1 ? '' : 's'}.</strong><p>{Object.values(errors)[0]}</p></div>
            </div>
          )}

          <section className="form-section" aria-labelledby="visit-basics-title">
            <div className="form-section-number">1</div>
            <div className="form-section-content">
              <div className="form-section-heading">
                <div><h2 id="visit-basics-title">Which visit?</h2><p>Choose a clinic and the kind of visit.</p></div>
                <span>Required</span>
              </div>
              <div className="form-grid two-col">
                <label className="field-label">
                  <span>Clinic</span>
                  <select value={draft.clinicId} onChange={(event) => selectClinic(event.target.value)} aria-invalid={Boolean(errors.clinicId)}>
                    <option value="">Choose a clinic</option>
                    {clinics.map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}
                  </select>
                  {errors.clinicId && <small className="field-error">{errors.clinicId}</small>}
                </label>
                <label className="field-label">
                  <span>Visit date</span>
                  <input type="date" max={today} value={draft.visitDate} onChange={(event) => updateDraft('visitDate', event.target.value)} aria-invalid={Boolean(errors.visitDate)} />
                  {errors.visitDate && <small className="field-error">{errors.visitDate}</small>}
                </label>
              </div>
              <fieldset className="choice-fieldset">
                <legend>Visit type</legend>
                <div className="choice-row compact-choices">
                  {(selectedClinic?.visitModes || ['scheduled', 'walk-in', 'urgent']).map((visitMode) => (
                    <label key={visitMode}>
                      <input type="radio" name="report-visit-mode" value={visitMode} checked={draft.visitMode === visitMode} onChange={() => updateDraft('visitMode', visitMode)} />
                      <span>{visitMode === 'walk-in' ? 'Walk-in' : visitMode === 'urgent' ? 'Urgent visit' : 'Scheduled'}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          <section className="form-section" aria-labelledby="visit-time-title">
            <div className="form-section-number">2</div>
            <div className="form-section-content">
              <div className="form-section-heading">
                <div><h2 id="visit-time-title">How long did it take?</h2><p>Approximate times are completely fine.</p></div>
                <span>Required</span>
              </div>
              <div className="duration-mode-toggle" aria-label="How to report visit duration">
                <button type="button" className={durationMode === 'exact' ? 'active' : ''} onClick={() => setDurationMode('exact')} aria-pressed={durationMode === 'exact'}>I know the times</button>
                <button type="button" className={durationMode === 'range' ? 'active' : ''} onClick={() => setDurationMode('range')} aria-pressed={durationMode === 'range'}>Use a total range</button>
              </div>
              {durationMode === 'exact' ? (
                <>
                  <div className="time-fields">
                    <label className="field-label"><span>Arrived</span><input type="time" value={draft.arrivalTime} onChange={(event) => updateDraft('arrivalTime', event.target.value)} aria-invalid={Boolean(errors.arrivalTime || errors.times)} />{errors.arrivalTime && <small className="field-error">{errors.arrivalTime}</small>}</label>
                    <span className="time-arrow" aria-hidden="true">→</span>
                    <label className="field-label"><span>Checked in <small>optional</small></span><input type="time" value={draft.checkInTime} onChange={(event) => updateDraft('checkInTime', event.target.value)} aria-invalid={Boolean(errors.times)} /></label>
                    <span className="time-arrow" aria-hidden="true">→</span>
                    <label className="field-label"><span>Provider arrived</span><input type="time" value={draft.providerTime} onChange={(event) => updateDraft('providerTime', event.target.value)} aria-invalid={Boolean(errors.providerTime || errors.times)} />{errors.providerTime && <small className="field-error">{errors.providerTime}</small>}</label>
                    <span className="time-arrow" aria-hidden="true">→</span>
                    <label className="field-label"><span>Departed</span><input type="time" value={draft.departureTime} onChange={(event) => updateDraft('departureTime', event.target.value)} aria-invalid={Boolean(errors.departureTime || errors.times)} />{errors.departureTime && <small className="field-error">{errors.departureTime}</small>}</label>
                  </div>
                  {errors.times && <p className="field-error standalone">{errors.times}</p>}
                </>
              ) : (
                <label className="field-label range-field">
                  <span>Approximate total visit time</span>
                  <select value={draft.totalRange} onChange={(event) => updateDraft('totalRange', event.target.value)} aria-invalid={Boolean(errors.totalRange)}>
                    <option value="">Choose a range</option>
                    <option value="0–30 minutes">Under 30 minutes</option>
                    <option value="30–60 minutes">30–60 minutes</option>
                    <option value="60–90 minutes">1–1.5 hours</option>
                    <option value="90–120 minutes">1.5–2 hours</option>
                    <option value="120–180 minutes">2–3 hours</option>
                    <option value="180 minutes">More than 3 hours</option>
                  </select>
                  {errors.totalRange && <small className="field-error">{errors.totalRange}</small>}
                </label>
              )}
            </div>
          </section>

          <section className="form-section" aria-labelledby="experience-title">
            <div className="form-section-number">3</div>
            <div className="form-section-content">
              <div className="form-section-heading">
                <div><h2 id="experience-title">A little context</h2><p>This helps people understand more than the minutes.</p></div>
                <span>Required</span>
              </div>
              <fieldset className="choice-fieldset">
                <legend>Compared with the MediQ estimate, your visit was…</legend>
                <div className="choice-row">
                  {([
                    ['shorter', 'Shorter', 'Finished sooner'],
                    ['about-right', 'About right', 'Close to estimate'],
                    ['longer', 'Longer', 'Took more time'],
                  ] as const).map(([value, label, detail]) => (
                    <label key={value}>
                      <input type="radio" name="accuracy" value={value} checked={draft.accuracy === value} onChange={() => updateDraft('accuracy', value)} />
                      <span><strong>{label}</strong><small>{detail}</small></span>
                    </label>
                  ))}
                </div>
                {errors.accuracy && <small className="field-error">{errors.accuracy}</small>}
              </fieldset>

              <fieldset className="choice-fieldset rating-fieldset">
                <legend>How clear was communication about delays or next steps?</legend>
                <div className="number-rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value}>
                      <input type="radio" name="communication" value={value} checked={draft.communication === value} onChange={() => updateDraft('communication', value)} />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
                <div className="rating-ends"><span>Not clear</span><span>Very clear</span></div>
                {errors.communication && <small className="field-error">{errors.communication}</small>}
              </fieldset>

              <fieldset className="choice-fieldset">
                <legend>Did the provider portion of your visit feel rushed?</legend>
                <div className="choice-row compact-choices">
                  <label><input type="radio" name="rushed" checked={draft.rushed === 'no'} onChange={() => updateDraft('rushed', 'no')} /><span>No</span></label>
                  <label><input type="radio" name="rushed" checked={draft.rushed === 'yes'} onChange={() => updateDraft('rushed', 'yes')} /><span>Yes</span></label>
                </div>
                {errors.rushed && <small className="field-error">{errors.rushed}</small>}
              </fieldset>

              <label className="field-label note-field">
                <span>Optional non-medical note</span>
                <textarea maxLength={240} value={draft.note} onChange={(event) => updateDraft('note', event.target.value)} placeholder="Example: Staff explained that an emergency changed the timing." />
                <small>{draft.note.length}/240 · Please don’t include symptoms, diagnoses, medications, or names.</small>
              </label>
            </div>
          </section>

          <section className="form-section privacy-form-section" aria-labelledby="privacy-choice-title">
            <div className="form-section-number"><LockKeyhole aria-hidden="true" /></div>
            <div className="form-section-content">
              <div className="form-section-heading">
                <div><h2 id="privacy-choice-title">Your privacy choice</h2><p>This prototype does not require an account.</p></div>
              </div>
              <label className="toggle-row">
                <span><strong>Submit anonymously</strong><small>No name or account label will appear with this report.</small></span>
                <input type="checkbox" checked={draft.anonymous} onChange={(event) => updateDraft('anonymous', event.target.checked)} />
                <i aria-hidden="true" />
              </label>
              <InfoNote>
                Reports may be checked for duplication, unusual timing, device rate limits, or other suspicious patterns. A production system would require privacy, legal, and security review.
              </InfoNote>
            </div>
          </section>

          <div className="report-submit-row">
            <div><UserRoundCheck aria-hidden="true" /><span><strong>Ready to help the next patient?</strong><small>You can review every answer before submitting.</small></span></div>
            <button className="button button-coral button-large" type="submit" disabled={submitting}>
              {submitting ? 'Checking report…' : 'Submit sample report'} <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </form>

        <section className="integrity-explainer">
          <div><ShieldCheck aria-hidden="true" /></div>
          <div><span className="eyebrow">Future integrity controls</span><h2>Useful reports—not a popularity contest</h2><p>MediQ would combine multiple controls before a report can meaningfully shift an estimate.</p></div>
          <ul>
            <li><BadgeCheck aria-hidden="true" /> Duplicate-report detection</li>
            <li><BadgeCheck aria-hidden="true" /> Source weighting</li>
            <li><BadgeCheck aria-hidden="true" /> Statistical anomaly review</li>
            <li><BadgeCheck aria-hidden="true" /> Clinic-gaming safeguards</li>
          </ul>
          <Link className="text-link" to="/know#integrity">Read the approach <ArrowRight aria-hidden="true" /></Link>
        </section>
        <SafetyNote />
      </div>
    </div>
  );
}
