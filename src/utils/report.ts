import type { WaitReportDraft } from '../types';

export const localToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
export const initialDraft = (clinicId = ''): WaitReportDraft => ({
  clinicId, visitMode: 'scheduled', visitDate: localToday(), arrivalTime: '', checkInTime: '',
  providerTime: '', departureTime: '', totalRange: '', accuracy: '', communication: 0,
  rushed: '', note: '', anonymous: true,
});
export const reportRanges = ['0–30 minutes', '30–60 minutes', '60–90 minutes', '90–120 minutes', '120–180 minutes', '180 minutes'];
const toMinutes = (value: string) => { const [h, m] = value.split(':').map(Number); return h * 60 + m; };
export function validateReport(draft: WaitReportDraft, mode: 'exact' | 'range' | 'current', full = true) {
  const errors: Record<string, string> = {};
  if (!draft.clinicId) errors.clinicId = 'Choose the clinic you visited.';
  if (!draft.visitDate) errors.visitDate = 'Add the visit date.';
  else if (draft.visitDate > localToday()) errors.visitDate = 'Visit date cannot be in the future.';
  if (mode === 'current') {
    if (!Number.isFinite(draft.elapsedMinutes) || draft.elapsedMinutes! < 0 || draft.elapsedMinutes! > 1440)
      errors.elapsedMinutes = 'Enter minutes between 0 and 1440.';
  } else if (mode === 'range') {
    if (!reportRanges.includes(draft.totalRange)) errors.totalRange = 'Choose an approximate total time.';
  } else {
    if (!draft.arrivalTime) errors.arrivalTime = 'Add your approximate arrival time.';
    if (!draft.providerTime) errors.providerTime = 'Add when the provider arrived.';
    if (!draft.departureTime) errors.departureTime = 'Add your approximate departure time.';
    const ordered = [draft.arrivalTime, draft.checkInTime, draft.providerTime, draft.departureTime].filter(Boolean).map(toMinutes);
    if (ordered.some((value, index) => index > 0 && value < ordered[index - 1]))
      errors.times = 'Times should follow the visit order: arrival, check-in, provider, departure.';
    else if (draft.arrivalTime && draft.departureTime && toMinutes(draft.departureTime) <= toMinutes(draft.arrivalTime))
      errors.times = 'Departure must be after arrival. For overnight visits, use a total range.';
  }
  if (full) {
    if (!draft.accuracy) errors.accuracy = 'Tell us how the estimate compared.';
    if (!draft.communication) errors.communication = 'Rate communication from 1 to 5.';
    if (!draft.rushed) errors.rushed = 'Choose whether the visit felt rushed.';
  }
  return errors;
}
