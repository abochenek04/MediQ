import type { Clinic, SavedAppointment } from '../types';

export const formatDate = (iso: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(typeof document === 'undefined' ? 'en-US' : document.documentElement.lang || 'en-US', options || {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat(typeof document === 'undefined' ? 'en-US' : document.documentElement.lang || 'en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(iso));

export const formatDateTime = (iso: string) => `${formatDate(iso)} · ${formatTime(iso)}`;

export const relativeReportTime = (iso: string) => {
  const difference = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.round(difference / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export const getVisitPlan = (appointment: SavedAppointment, clinic: Clinic) => {
  const appointmentDate = new Date(appointment.appointmentTime);
  const leaveBy = new Date(
    appointmentDate.getTime() - (appointment.travelMinutes + appointment.bufferMinutes) * 60000,
  );
  const estimate =
    clinic.estimates.find((item) => item.mode === appointment.visitMode) || clinic.estimates[0];
  const likelyFinish = new Date(appointmentDate.getTime() + estimate.totalMinutes * 60000);

  return { leaveBy, likelyFinish, estimate };
};

export const toLocalDateTimeInput = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};
