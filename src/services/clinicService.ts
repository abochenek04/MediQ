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
      .filter((clinic) => {
        const searchText = normalize(
          [
            clinic.name,
            clinic.type,
            clinic.neighborhood,
            ...clinic.specialties,
            ...clinic.symptoms,
            ...clinic.providers.map((provider) => provider.name),
          ].join(' '),
        );

        return (
          (!query || searchText.includes(query)) &&
          (!filters.insurance || clinic.insurance.includes(filters.insurance)) &&
          (!filters.specialty || clinic.specialties.includes(filters.specialty)) &&
          (filters.visitMode === 'all' || clinic.visitModes.includes(filters.visitMode)) &&
          (filters.timing !== 'open-now' || clinic.status === 'open') &&
          clinic.distanceMiles <= filters.maxDistance
        );
      })
      .sort((a, b) => {
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
    const exactMinutes = getMinutesBetween(draft.arrivalTime, draft.departureTime);
    const totalMinutes = exactMinutes || rangeMidpoint(draft.totalRange) || 60;

    return {
      id: `guest-${Date.now()}`,
      clinicId: draft.clinicId,
      submittedAt: new Date().toISOString(),
      visitMode: draft.visitMode,
      totalMinutes,
      source: 'patient report',
      anonymous: draft.anonymous,
      accuracy: draft.accuracy || undefined,
      communication: draft.communication,
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
