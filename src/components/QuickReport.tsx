import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import type { Clinic, VisitMode } from '../types';
import { initialDraft, reportRanges, validateReport } from '../utils/report';
import { Link } from '../utils/navigation';
import { Modal } from './UI';

export function QuickReport({ clinic, mode, onClose }: { clinic: Clinic; mode: VisitMode; onClose: () => void }) {
  const { t, submitReport } = useApp();
  const [draft, setDraft] = useState(() => ({ ...initialDraft(clinic.id), visitMode: mode }));
  const [kind, setKind] = useState<'current' | 'range'>('current');
  const [minutes, setMinutes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...draft, reportKind: kind === 'current' ? 'current-wait' as const : 'completed-visit' as const, elapsedMinutes: minutes === '' ? NaN : Number(minutes) };
    const errors = validateReport(payload, kind, false);
    if (Object.keys(errors).length) { setError(Object.values(errors)[0]); return; }
    setBusy(true); setError('');
    try { await submitReport(payload); setDone(true); }
    catch { setError('Your report could not be saved. Please try again.'); }
    finally { setBusy(false); }
  };
  return <Modal title={t(done ? 'Sample report added' : 'Report a wait')} onClose={onClose}>
    {done ? <div className="quick-confirmation" role="status">
      <p>{t('Thank you. Your report is saved on this device and appears in the clinic feed.')}</p>
      <p>{kind === 'current' && t('An ongoing wait is kept separate from completed visit totals.')}</p>
      <button className="button button-primary button-full" onClick={onClose}>{t('Back to Find Care')}</button>
    </div> : <form onSubmit={submit} noValidate>
      <p className="demo-badge">{t('Prototype data')}</p>
      <label className="field-label"><span>{t('Clinic')}</span><input value={clinic.name} readOnly /></label>
      <label className="field-label"><span>{t('Visit type')}</span><select value={draft.visitMode} onChange={e => setDraft({ ...draft, visitMode: e.target.value as VisitMode })}>
        {clinic.visitModes.map(value => <option key={value} value={value}>{t(value === 'walk-in' ? 'Walk-in' : value === 'urgent' ? 'Urgent visit' : 'Scheduled')}</option>)}
      </select></label>
      <fieldset className="choice-fieldset"><legend>{t('Visit status')}</legend><div className="choice-row compact-choices">
        <label><input name="quick-status" type="radio" checked={kind === 'current'} onChange={() => { setKind('current'); setError(''); }} /><span>{t('Still waiting')}</span></label>
        <label><input name="quick-status" type="radio" checked={kind === 'range'} onChange={() => { setKind('range'); setError(''); }} /><span>{t('Visit finished')}</span></label>
      </div></fieldset>
      {kind === 'current' ? <label className="field-label"><span>{t('Minutes waiting so far')}</span><input type="number" min="0" max="1440" step="1" value={minutes} onChange={e => setMinutes(e.target.value)} aria-invalid={Boolean(error)} /></label> : <label className="field-label"><span>{t('Approximate total visit time')}</span><select value={draft.totalRange} onChange={e => setDraft({ ...draft, totalRange: e.target.value })} aria-invalid={Boolean(error)}>
        <option value="">{t('Choose a range')}</option>{reportRanges.map(value => <option key={value} value={value}>{t(value)}</option>)}
      </select></label>}
      <p className="field-hint">{t('For today’s visit. Use the full report for earlier visits or detailed times.')}</p>
      <label className="checkbox-line"><input type="checkbox" checked={draft.anonymous} onChange={e => setDraft({ ...draft, anonymous: e.target.checked })} />{t('Submit anonymously')}</label>
      {error && <p className="field-error" role="alert">{t(error)}</p>}
      <button disabled={busy} className="button button-primary button-full" type="submit">{t(busy ? 'Checking report…' : 'Submit sample report')}</button>
      <div className="modal-actions"><button className="text-button" type="button" onClick={onClose}>{t('Cancel')}</button><Link to={`/report?clinic=${clinic.id}`}>{t('Open full report')}</Link></div>
    </form>}
  </Modal>;
}
