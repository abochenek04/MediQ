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

// Straight-line distance to fictional coordinates. No routing or live clinic discovery.
export const distanceMiles = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLon = (b.longitude - a.longitude) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
};

const normalize = (value: string) => value.trim().toLocaleLowerCase();

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
    const query = normalize(filters.query);

    return clinics
      .map((clinic) => filters.origin ? { ...clinic, distanceMiles: distanceMiles(filters.origin, clinic.coordinates) } : clinic)
      .filter((clinic) => {
        const searchText = normalize(
          [
            clinic.name,
            clinic.type,
            clinic.neighborhood,
            clinic.address,
            ...clinic.specialties,
            ...clinic.symptoms,
            ...clinic.providers.map((provider) => provider.name),
          ].join(' '),
        );

        return (
          (!query || searchText.includes(query)) &&
          (!filters.insurance || clinic.insurance.includes(filters.insurance)) &&
          (!filters.language || clinic.languages.includes(filters.language)) &&
          (!filters.minimumRating || (clinic.rating?.rating ?? 0) >= filters.minimumRating) &&
          (!filters.specialty || clinic.specialties.includes(filters.specialty)) &&
          (filters.visitMode === 'all' || clinic.visitModes.includes(filters.visitMode)) &&
          (filters.timing !== 'open-now' || clinic.status === 'open') &&
          (!['morning', 'afternoon'].includes(filters.timing) || clinic.historicalWaits.some((record) => record[filters.timing as 'morning' | 'afternoon'] > 0)) &&
          clinic.distanceMiles <= filters.maxDistance
        );
      })
      .sort((a, b) => {
        if (filters.timing === 'morning' || filters.timing === 'afternoon') {
          const period = filters.timing;
          const typical = (clinic: Clinic) => {
            const records = clinic.historicalWaits.filter((record) => record[period] > 0);
            return records.reduce((sum, record) => sum + record[period], 0) / records.length;
          };
          return typical(a) - typical(b);
        }
        if (a.status !== b.status) return a.status === 'open' ? -1 : 1;
        return a.distanceMiles - b.distanceMiles;
      });
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
    const value = window.localStorage.getItem('mediq-appointments');
    return value ? (JSON.parse(value) as SavedAppointment[]) : [];
  },
};

// Production swap point. Implement ClinicDataService here with REST, GraphQL, or SQL-backed
// endpoints. Components import this adapter instead of reading mock data directly.
export const clinicService: ClinicDataService = mockClinicService;
