import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Car,
  Check,
  Clock3,
  MapPin,
  Navigation,
  Route,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DemoBadge, SafetyNote } from '../components/UI';
import { useApp } from '../context/AppContext';
import { clinicService } from '../services/clinicService';
import type { Clinic } from '../types';
import { Link } from '../utils/navigation';
import { formatDateTime, formatTime, getVisitPlan } from '../utils/time';

export function SavedPage() {
  const { savedAppointments, savedClinicIds, removeAppointment, toggleSavedClinic } = useApp();
  const [clinicMap, setClinicMap] = useState<Record<string, Clinic>>({});

  useEffect(() => {
    const ids = [...new Set([...savedAppointments.map((item) => item.clinicId), ...savedClinicIds])];
    void Promise.all(ids.map((id) => clinicService.getClinicById(id))).then((items) => {
      const nextMap: Record<string, Clinic> = {};
      items.forEach((clinic) => {
        if (clinic) nextMap[clinic.id] = clinic;
      });
      setClinicMap(nextMap);
    });
  }, [savedAppointments, savedClinicIds]);

  const savedClinics = savedClinicIds.map((id) => clinicMap[id]).filter(Boolean);

  return (
    <div className="saved-page page-space">
      <div className="shell narrow-shell">
        <div className="page-heading">
          <div>
            <span className="eyebrow">Your care plan</span>
            <h1>Saved visits</h1>
            <p>Keep the parts of your day in one place—appointment, travel, buffer, and expected visit time.</p>
          </div>
          <DemoBadge label="Stored on this device" />
        </div>

        {savedAppointments.length === 0 ? (
          <div className="empty-state saved-empty">
            <span className="empty-icon"><CalendarDays aria-hidden="true" /></span>
            <h2>No visits are saved</h2>
            <p>Open a clinic and choose “Plan this visit” to create a leave-by suggestion.</p>
            <Link className="button button-primary" to="/find">Find care <ArrowRight aria-hidden="true" /></Link>
          </div>
        ) : (
          <div className="appointment-list">
            {savedAppointments.map((appointment) => {
              const clinic = clinicMap[appointment.clinicId];
              if (!clinic) return <div className="appointment-skeleton" key={appointment.id} />;
              const plan = getVisitPlan(appointment, clinic);
              return (
                <article className="appointment-card" key={appointment.id}>
                  <div className="appointment-card-head">
                    <div className="appointment-date-block">
                      <span>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(appointment.appointmentTime))}</span>
                      <strong>{new Date(appointment.appointmentTime).getDate()}</strong>
                      <small>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(appointment.appointmentTime))}</small>
                    </div>
                    <div className="appointment-identity">
                      <div className="title-kicker-row">
                        <span className="mode-pill">{appointment.visitMode === 'walk-in' ? 'Walk-in plan' : appointment.visitMode === 'urgent' ? 'Urgent visit plan' : 'Scheduled visit'}</span>
                        {appointment.isSample && <span className="sample-chip">Sample</span>}
                      </div>
                      <h2>{clinic.name}</h2>
                      <p><MapPin aria-hidden="true" /> {clinic.address}</p>
                      <p><CalendarDays aria-hidden="true" /> {formatDateTime(appointment.appointmentTime)}</p>
                    </div>
                    <div className="appointment-live">
                      <span>Current demo estimate</span>
                      <strong>{plan.estimate.totalMinutes} min</strong>
                      <small>Updated {plan.estimate.updatedMinutesAgo}m ago</small>
                    </div>
                  </div>

                  <div className="plan-timeline" aria-label="Visit planning timeline">
                    <div className="plan-stop leave-stop">
                      <span className="plan-stop-icon"><Navigation aria-hidden="true" /></span>
                      <span><small>Leave by</small><strong>{formatTime(plan.leaveBy.toISOString())}</strong></span>
                    </div>
                    <div className="plan-connector"><span /><small>{appointment.travelMinutes} min travel</small></div>
                    <div className="plan-stop">
                      <span className="plan-stop-icon"><MapPin aria-hidden="true" /></span>
                      <span><small>Arrive by</small><strong>{formatTime(new Date(new Date(appointment.appointmentTime).getTime() - appointment.bufferMinutes * 60000).toISOString())}</strong></span>
                    </div>
                    <div className="plan-connector"><span /><small>{appointment.bufferMinutes} min buffer</small></div>
                    <div className="plan-stop">
                      <span className="plan-stop-icon"><Clock3 aria-hidden="true" /></span>
                      <span><small>Visit begins</small><strong>{formatTime(appointment.appointmentTime)}</strong></span>
                    </div>
                    <div className="plan-connector visit"><span /><small>about {plan.estimate.totalMinutes} min</small></div>
                    <div className="plan-stop finish-stop">
                      <span className="plan-stop-icon"><Check aria-hidden="true" /></span>
                      <span><small>Likely finish</small><strong>{formatTime(plan.likelyFinish.toISOString())}</strong></span>
                    </div>
                  </div>

                  <div className="plan-explanation">
                    <div><Car aria-hidden="true" /><span><strong>{appointment.travelMinutes} min</strong><small>Simulated travel</small></span></div>
                    <div><Route aria-hidden="true" /><span><strong>{appointment.bufferMinutes} min</strong><small>Your arrival buffer</small></span></div>
                    <div><ShieldCheck aria-hidden="true" /><span><strong>{clinic.reliability.score}% · {clinic.reliability.level}</strong><small>Estimate confidence</small></span></div>
                  </div>

                  <div className="appointment-note">
                    This uses your appointment time minus travel and buffer for “leave by.” The likely finish adds the current {plan.estimate.totalMinutes}-minute visit estimate. Both are planning aids, not guarantees.
                  </div>

                  <div className="appointment-actions">
                    <Link className="button button-primary" to={`/clinic/${clinic.id}`}>View updated clinic info <ArrowRight aria-hidden="true" /></Link>
                    <Link className="button button-secondary" to={`/report?clinic=${clinic.id}`}>Report after visit</Link>
                    <button className="button button-ghost danger" type="button" onClick={() => removeAppointment(appointment.id)}><Trash2 aria-hidden="true" /> Remove visit</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {savedClinics.length > 0 && (
          <section className="saved-clinics-section" aria-labelledby="saved-clinics-title">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">Shortlist</span>
                <h2 id="saved-clinics-title">Saved clinics</h2>
              </div>
              <Link className="text-link" to="/find">Browse more <ArrowRight aria-hidden="true" /></Link>
            </div>
            <div className="saved-clinic-grid">
              {savedClinics.map((clinic) => (
                <article key={clinic.id}>
                  <div className="saved-clinic-icon" style={{ background: `${clinic.accent}22`, color: clinic.accent }}><Bookmark aria-hidden="true" fill="currentColor" /></div>
                  <div><span>{clinic.type}</span><h3>{clinic.name}</h3><p>{clinic.distanceMiles.toFixed(1)} mi · {clinic.estimates[0].totalMinutes} min demo visit</p></div>
                  <Link to={`/clinic/${clinic.id}`} aria-label={`View ${clinic.name}`}><ArrowRight aria-hidden="true" /></Link>
                  <button type="button" onClick={() => toggleSavedClinic(clinic.id)}>Remove</button>
                </article>
              ))}
            </div>
          </section>
        )}

        <SafetyNote />
      </div>
    </div>
  );
}
