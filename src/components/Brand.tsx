import { Link } from '../utils/navigation';

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="15" fill="#F47A63" />
      <circle cx="21" cy="22" r="12.5" fill="#FFF9F2" stroke="#143F3A" strokeWidth="2.5" />
      <path d="M21 12.5V15.5M30.5 22H27.5M21 31.5V28.5" stroke="#143F3A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 22L16.8 17.8M21 22L20 27.2" stroke="#143F3A" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="21" cy="22" r="2" fill="#143F3A" />
      <circle cx="34" cy="31.5" r="2.7" fill="#143F3A" />
      <circle cx="39.3" cy="33.2" r="2.1" fill="#143F3A" />
      <path d="M30.4 38V36.3C30.4 34.6 31.8 33.2 33.5 33.2H34.6C36.3 33.2 37.7 34.6 37.7 36.3V38M37.7 38V37.1C37.7 35.7 38.8 34.6 40.2 34.6C41.6 34.6 42.7 35.7 42.7 37.1V38" stroke="#143F3A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" to="/find" aria-label="MediQ home">
      <LogoMark size={compact ? 34 : 40} />
      <span className="brand-word">MediQ</span>
    </Link>
  );
}
