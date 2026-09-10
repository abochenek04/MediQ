import { CircleAlert, Info, ShieldCheck } from 'lucide-react';
import type { ConfidenceLevel } from '../types';

export function DemoBadge({ label = 'Prototype data' }: { label?: string }) {
  return (
    <span className="demo-badge">
      <span aria-hidden="true" />
      {label}
    </span>
  );
}

export function ReliabilityBadge({ score, level }: { score: number; level: ConfidenceLevel }) {
  return (
    <span className={`reliability-badge reliability-${level}`} aria-label={`${score} percent reliability, ${level} confidence`}>
      <ShieldCheck aria-hidden="true" size={15} />
      {score}% · {level}
    </span>
  );
}

export function SafetyNote({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'safety-note compact' : 'safety-note'}>
      <CircleAlert aria-hidden="true" />
      <p>
        Wait estimates are planning information, not medical advice or guarantees. If you believe you are
        experiencing a medical emergency, contact emergency services.
      </p>
    </div>
  );
}

export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="info-note">
      <Info aria-hidden="true" size={18} />
      <div>{children}</div>
    </div>
  );
}

export function PageLoader({ label = 'Loading care information' }: { label?: string }) {
  return (
    <div className="page-loader" role="status">
      <span className="loader-ring" aria-hidden="true" />
      <p>{label}…</p>
    </div>
  );
}
