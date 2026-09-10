import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { sampleAppointment } from '../data/mockData';
import { clinicService } from '../services/clinicService';
import type { AppToast, PatientReport, SavedAppointment, WaitReportDraft } from '../types';

type ToastTone = AppToast['tone'];

interface AppContextValue {
  savedClinicIds: string[];
  savedAppointments: SavedAppointment[];
  submittedReports: PatientReport[];
  language: string;
  toasts: AppToast[];
  toggleSavedClinic: (clinicId: string) => void;
  saveAppointment: (appointment: SavedAppointment) => Promise<void>;
  removeAppointment: (appointmentId: string) => void;
  submitReport: (draft: WaitReportDraft) => Promise<PatientReport>;
  setLanguage: (language: string) => void;
  pushToast: (message: string, tone?: ToastTone) => void;
  t: (key: TranslationKey) => string;
}

type TranslationKey =
  | 'findCare'
  | 'saved'
  | 'reportWait'
  | 'howItWorks'
  | 'language'
  | 'heroEyebrow'
  | 'heroTitle'
  | 'heroBody'
  | 'searchPlaceholder';

const translations: Record<string, Record<TranslationKey, string>> = {
  en: {
    findCare: 'Find care',
    saved: 'Saved',
    reportWait: 'Report wait',
    howItWorks: 'How it works',
    language: 'Language',
    heroEyebrow: 'Care planning for real life',
    heroTitle: 'Know before you go.',
    heroBody: 'Compare total visit times, understand confidence, and make a plan that respects your day.',
    searchPlaceholder: 'Clinic, provider, specialty, or symptom',
  },
  es: {
    findCare: 'Buscar atención',
    saved: 'Guardado',
    reportWait: 'Reportar espera',
    howItWorks: 'Cómo funciona',
    language: 'Idioma',
    heroEyebrow: 'Planificación para la vida real',
    heroTitle: 'Infórmate antes de ir.',
    heroBody: 'Compara la duración de las visitas, comprende la confianza y planifica tu día.',
    searchPlaceholder: 'Clínica, proveedor, especialidad o síntoma',
  },
  zh: {
    findCare: '寻找医疗服务',
    saved: '已保存',
    reportWait: '报告等待时间',
    howItWorks: '使用说明',
    language: '语言',
    heroEyebrow: '贴近生活的就医规划',
    heroTitle: '出发前，心中有数。',
    heroBody: '比较就诊总时长，了解数据可信度，合理安排一天。',
    searchPlaceholder: '诊所、医生、专科或症状',
  },
  ar: {
    findCare: 'ابحث عن رعاية',
    saved: 'المحفوظات',
    reportWait: 'الإبلاغ عن الانتظار',
    howItWorks: 'كيف يعمل',
    language: 'اللغة',
    heroEyebrow: 'تخطيط للرعاية يناسب حياتك',
    heroTitle: 'اعرف قبل أن تذهب.',
    heroBody: 'قارن مدة الزيارة وافهم موثوقية التقدير وخطط ليومك.',
    searchPlaceholder: 'عيادة أو مقدم خدمة أو تخصص أو عرض',
  },
};

const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedClinicIds, setSavedClinicIds] = useState<string[]>(() =>
    readStored('mediq-saved-clinics', []),
  );
  const [savedAppointments, setSavedAppointments] = useState<SavedAppointment[]>(() =>
    readStored('mediq-appointments', [sampleAppointment]),
  );
  const [submittedReports, setSubmittedReports] = useState<PatientReport[]>(() =>
    readStored('mediq-reports', []),
  );
  const [language, updateLanguage] = useState(() =>
    window.localStorage.getItem('mediq-language') || 'en',
  );
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    window.localStorage.setItem('mediq-saved-clinics', JSON.stringify(savedClinicIds));
  }, [savedClinicIds]);

  useEffect(() => {
    window.localStorage.setItem('mediq-appointments', JSON.stringify(savedAppointments));
  }, [savedAppointments]);

  useEffect(() => {
    window.localStorage.setItem('mediq-reports', JSON.stringify(submittedReports));
  }, [submittedReports]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const pushToast = useCallback((message: string, tone: ToastTone = 'default') => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4200);
  }, []);

  const toggleSavedClinic = useCallback(
    (clinicId: string) => {
      setSavedClinicIds((current) => {
        const isSaved = current.includes(clinicId);
        pushToast(isSaved ? 'Clinic removed from saved care.' : 'Clinic saved for later.', isSaved ? 'default' : 'success');
        return isSaved ? current.filter((id) => id !== clinicId) : [...current, clinicId];
      });
    },
    [pushToast],
  );

  const saveAppointment = useCallback(
    async (appointment: SavedAppointment) => {
      const saved = await clinicService.saveAppointment(appointment);
      setSavedAppointments((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
      pushToast('Visit saved. Your planning window is ready.', 'success');
    },
    [pushToast],
  );

  const removeAppointment = useCallback(
    (appointmentId: string) => {
      setSavedAppointments((current) => current.filter((item) => item.id !== appointmentId));
      pushToast('Saved visit removed.');
    },
    [pushToast],
  );

  const submitReport = useCallback(
    async (draft: WaitReportDraft) => {
      const result = await clinicService.submitWaitReport(draft);
      setSubmittedReports((current) => [result, ...current]);
      pushToast('Thank you—your sample report was added.', 'success');
      return result;
    },
    [pushToast],
  );

  const setLanguage = useCallback(
    (nextLanguage: string) => {
      updateLanguage(nextLanguage);
      window.localStorage.setItem('mediq-language', nextLanguage);
      document.documentElement.lang = nextLanguage;
      document.documentElement.dir = nextLanguage === 'ar' ? 'rtl' : 'ltr';
      pushToast(
        nextLanguage === 'en'
          ? 'Language set to English.'
          : 'Language preference saved. Key prototype content is translated.',
        'info',
      );
    },
    [pushToast],
  );

  const t = useCallback(
    (key: TranslationKey) => (translations[language] || translations.en)[key],
    [language],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      savedClinicIds,
      savedAppointments,
      submittedReports,
      language,
      toasts,
      toggleSavedClinic,
      saveAppointment,
      removeAppointment,
      submitReport,
      setLanguage,
      pushToast,
      t,
    }),
    [
      savedClinicIds,
      savedAppointments,
      submittedReports,
      language,
      toasts,
      toggleSavedClinic,
      saveAppointment,
      removeAppointment,
      submitReport,
      setLanguage,
      pushToast,
      t,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
