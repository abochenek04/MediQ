import { api, backendEnabled, ApiError } from './api';
import { searchDirectory } from './search';
export { distanceMiles } from './search';
import { validateReport } from '../utils/report';
import { clinics } from '../data/mockData';
import type {
  Clinic,
  HistoricalWaitRecord,
  LiveWaitEstimate,
  PatientReport,
  SavedAppointment,
  SearchFilters,
  VisitMode,
  WaitReportDraft,
} from '../types';

export interface ClinicDataService {
  searchClinics(filters: SearchFilters): Promise<Clinic[]>;
  getClinicById(id: string): Promise<Clinic | undefined>;
  getLiveEstimate(clinicId: string, visitType: VisitMode): Promise<LiveWaitEstimate | undefined>;
  getHistoricalWaits(clinicId: string): Promise<HistoricalWaitRecord[]>;
  submitWaitReport(report: WaitReportDraft): Promise<PatientReport>;
  saveAppointment(appointment: SavedAppointment): Promise<SavedAppointment>;
  getSavedAppointments(): Promise<SavedAppointment[]>;
}

const delay = (milliseconds = 140) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

export const defaultSearchFilters: SearchFilters = {
  query: '', insurance: '', specialty: '', language: '', minimumRating: 0,
  visitMode: 'all', timing: 'all', maxDistance: 10,
};

const getMinutesBetween = (start: string, end: string) => {
  if (!start || !end) return 0;
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const result = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  return result < 0 ? result + 24 * 60 : result;
};

const rangeMidpoint = (range: string) => {
  const numbers = range.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return numbers[0];
  return Math.round((numbers[0] + numbers[1]) / 2);
};

export const mockClinicService: ClinicDataService = {
  async searchClinics(filters) {
    await delay();
    return searchDirectory(clinics, filters);
  },

  async getClinicById(id) {
    await delay(90);
    return clinics.find((clinic) => clinic.id === id);
  },

  async getLiveEstimate(clinicId, visitType) {
    await delay(80);
    return clinics
      .find((clinic) => clinic.id === clinicId)
      ?.estimates.find((estimate) => estimate.mode === visitType);
  },

  async getHistoricalWaits(clinicId) {
    await delay(80);
    return clinics.find((clinic) => clinic.id === clinicId)?.historicalWaits ?? [];
  },

  async submitWaitReport(draft) {
    await delay(260);
    const errors = validateReport(draft, draft.reportKind === 'current-wait' ? 'current' : draft.totalRange ? 'range' : 'exact', false);
    const clinic = clinics.find((item) => item.id === draft.clinicId);
    if (Object.keys(errors).length || !clinic || !clinic.visitModes.includes(draft.visitMode)) throw new Error('Invalid report');
    const exactMinutes = getMinutesBetween(draft.arrivalTime, draft.departureTime);
    const totalMinutes = draft.reportKind === 'current-wait' ? 0 : exactMinutes || rangeMidpoint(draft.totalRange);

    return {
      id: `guest-${crypto.randomUUID()}`,
      clinicId: draft.clinicId,
      submittedAt: new Date().toISOString(),
      visitMode: draft.visitMode,
      totalMinutes,
      source: 'patient report',
      anonymous: draft.anonymous,
      accuracy: draft.accuracy || undefined,
      communication: draft.communication || undefined,
      reportKind: draft.reportKind || 'completed-visit',
      elapsedMinutes: draft.reportKind === 'current-wait' ? draft.elapsedMinutes : undefined,
      visitDate: draft.visitDate,
      timing: { arrivalTime: draft.arrivalTime, checkInTime: draft.checkInTime, providerTime: draft.providerTime, departureTime: draft.departureTime, totalRange: draft.totalRange },
      rushed: draft.rushed ? draft.rushed === 'yes' : undefined,
      note: draft.note || undefined,
    };
  },

  async saveAppointment(appointment) {
    await delay(100);
    return appointment;
  },

  async getSavedAppointments() {
    await delay(80);
    return []; // Guest plans live only in AppContext memory.
  },
};

const reportKeys = new Map<string, string>();
export const clearReportRequests = () => reportKeys.clear();
export const backendClinicService: ClinicDataService = {
  searchClinics: filters => api(`/clinics?filters=${encodeURIComponent(JSON.stringify(filters))}`),
  async getClinicById(id) { try { return await api<Clinic>(`/clinics/${encodeURIComponent(id)}`); } catch(error) { if(error instanceof ApiError && error.status === 404) return undefined; throw error; } },
  async getLiveEstimate(id,mode) { return (await this.getClinicById(id))?.estimates.find(e => e.mode === mode); },
  async getHistoricalWaits(id) { return (await this.getClinicById(id))?.historicalWaits || []; },
  submitWaitReport(draft) { const serialized = JSON.stringify(draft); const key = reportKeys.get(serialized) || crypto.randomUUID(); if (reportKeys.size > 100) reportKeys.clear(); reportKeys.set(serialized,key); return api('/reports','POST',draft,{'Idempotency-Key':key}); },
  saveAppointment: appointment => api('/plans','PUT',appointment),
  async getSavedAppointments() { return (await api<{savedAppointments:SavedAppointment[]}>('/me')).savedAppointments || []; },
};
// Configured mode never falls back to fictional data after a failed request.
export const clinicService: ClinicDataService = backendEnabled ? backendClinicService : mockClinicService;
