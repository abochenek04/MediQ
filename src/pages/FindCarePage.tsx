import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronDown,
  Clock3,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Search,
  SlidersHorizontal,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ClinicCard, MapView } from '../components/ClinicComponents';
import { DemoBadge, InfoNote, PageLoader, SafetyNote } from '../components/UI';
import { useApp } from '../context/AppContext';
import { insurancePlans, specialtyOptions } from '../data/mockData';
import { clinicService } from '../services/clinicService';
import type { Clinic, SearchFilters, VisitMode } from '../types';
import { Link, navigate } from '../utils/navigation';
import { formatDateTime, formatTime, getVisitPlan } from '../utils/time';

const defaultFilters: SearchFilters = {
  query: '',
  insurance: '',
  specialty: '',
  visitMode: 'all',
  timing: 'all',
  maxDistance: 10,
};

type ViewMode = 'list' | 'map';
type SortMode = 'distance' | 'shortest' | 'reliability';

export function FindCarePage() {
  const { savedAppointments, pushToast, t } = useApp();
  const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
  const [filters, setFilters] = useState<SearchFilters>({ ...defaultFilters, query: initialQuery });
  const [results, setResults] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<ViewMode>('list');
  const [sort, setSort] = useState<SortMode>('distance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState('');
  const [upcomingClinic, setUpcomingClinic] = useState<Clinic | undefined>();
  const upcoming = savedAppointments[0];

  const loadResults = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await clinicService.searchClinics(filters);
      setResults(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadResults();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (results.length && !results.some((clinic) => clinic.id === selectedClinicId)) {
      setSelectedClinicId(results[0].id);
    }
  }, [results, selectedClinicId]);

  useEffect(() => {
    if (!upcoming) {
      setUpcomingClinic(undefined);
      return;
    }
    void clinicService.getClinicById(upcoming.clinicId).then(setUpcomingClinic);
  }, [upcoming]);

  const sortedResults = useMemo(() => {
    const copy = [...results];
    if (sort === 'shortest') {
      return copy.sort((a, b) => a.estimates[0].totalMinutes - b.estimates[0].totalMinutes);
    }
    if (sort === 'reliability') {
      return copy.sort((a, b) => b.reliability.score - a.reliability.score);
    }
    return copy.sort((a, b) => a.distanceMiles - b.distanceMiles);
  }, [results, sort]);

  const activeFilterCount = [
    filters.insurance,
    filters.specialty,
    filters.visitMode !== 'all' ? filters.visitMode : '',
    filters.timing !== 'all' ? filters.timing : '',
    filters.maxDistance !== 10 ? filters.maxDistance : '',
  ].filter(Boolean).length;

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const runSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = filters.query.trim();
    navigate(query ? `/find?q=${encodeURIComponent(query)}` : '/find', { replace: true });
    document.getElementById('clinic-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const applyQuickFilter = (key: 'walk-in' | 'scheduled' | 'open' | 'pediatrics' | 'medicaid') => {
    if (key === 'walk-in') updateFilter('visitMode', filters.visitMode === 'walk-in' ? 'all' : 'walk-in');
    if (key === 'scheduled') updateFilter('visitMode', filters.visitMode === 'scheduled' ? 'all' : 'scheduled');
    if (key === 'open') updateFilter('timing', filters.timing === 'open-now' ? 'all' : 'open-now');
    if (key === 'pediatrics') updateFilter('specialty', filters.specialty === 'Pediatrics' ? '' : 'Pediatrics');
    if (key === 'medicaid') updateFilter('insurance', filters.insurance === 'Medicaid' ? '' : 'Medicaid');
  };

  const useLocation = () => {
    pushToast('Using a simulated downtown Durham location for this prototype.', 'info');
  };

  const clearFilters = () => {
    setFilters({ ...defaultFilters, query: filters.query });
  };

  const upcomingPlan = upcoming && upcomingClinic ? getVisitPlan(upcoming, upcomingClinic) : null;

  return (
    <>
      <section className="find-hero">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="shell find-hero-inner">
          <div className="find-hero-copy">
            <DemoBadge label="Durham demo · fictional data" />
            <span className="eyebrow light">{t('heroEyebrow')}</span>
            <h1>{t('heroTitle')}</h1>
            <p>{t('heroBody')}</p>
          </div>

          <form className="care-search" onSubmit={runSearch} role="search">
            <label htmlFor="care-search-input">Search for care</label>
            <div className="care-search-row">
              <Search aria-hidden="true" />
              <input
                id="care-search-input"
                value={filters.query}
                onChange={(event) => updateFilter('query', event.target.value)}
                placeholder={t('searchPlaceholder')}
              />
              {filters.query && (
                <button className="clear-search" type="button" onClick={() => updateFilter('query', '')} aria-label="Clear search">
                  <X aria-hidden="true" />
                </button>
              )}
              <button className="button button-coral" type="submit">Search <ArrowRight aria-hidden="true" /></button>
            </div>
            <div className="search-location">
              <span><MapPin aria-hidden="true" /> Near Durham, North Carolina</span>
              <button type="button" onClick={useLocation}><LocateFixed aria-hidden="true" /> Use my location</button>
            </div>
          </form>

          <div className="quick-filters" aria-label="Quick filters">
            <span>Quick picks</span>
            <button type="button" className={filters.visitMode === 'walk-in' ? 'active' : ''} onClick={() => applyQuickFilter('walk-in')}>Walk-in care</button>
            <button type="button" className={filters.visitMode === 'scheduled' ? 'active' : ''} onClick={() => applyQuickFilter('scheduled')}>Scheduled visits</button>
            <button type="button" className={filters.timing === 'open-now' ? 'active' : ''} onClick={() => applyQuickFilter('open')}>Open now</button>
            <button type="button" className={filters.specialty === 'Pediatrics' ? 'active' : ''} onClick={() => applyQuickFilter('pediatrics')}>Pediatrics</button>
            <button type="button" className={filters.insurance === 'Medicaid' ? 'active' : ''} onClick={() => applyQuickFilter('medicaid')}>Medicaid accepted</button>
          </div>
        </div>
      </section>

      <div className="shell find-layout">
        {upcoming && upcomingClinic && upcomingPlan && (
          <section className="upcoming-visit-card" aria-labelledby="upcoming-title">
            <div className="upcoming-date-tile" aria-hidden="true">
              <span>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(upcoming.appointmentTime))}</span>
              <strong>{new Date(upcoming.appointmentTime).getDate()}</strong>
            </div>
            <div className="upcoming-main">
              <div className="upcoming-kicker"><CalendarClock aria-hidden="true" /> {upcoming.isSample ? 'Sample upcoming visit' : 'Upcoming visit'}</div>
              <h2 id="upcoming-title">{upcomingClinic.name}</h2>
              <p>{formatDateTime(upcoming.appointmentTime)} · {upcomingClinic.address}</p>
            </div>
            <div className="upcoming-plan">
              <div>
                <span>Suggested leave-by</span>
                <strong>{formatTime(upcomingPlan.leaveBy.toISOString())}</strong>
              </div>
              <div>
                <span>Current visit estimate</span>
                <strong>{upcomingPlan.estimate.totalMinutes} min</strong>
              </div>
            </div>
            <Link className="button button-secondary" to="/saved">View plan <ArrowRight aria-hidden="true" /></Link>
          </section>
        )}

        <section className="find-main" id="clinic-results" aria-labelledby="results-title">
          <aside className={filtersOpen ? 'filter-panel open' : 'filter-panel'} aria-label="Search filters">
            <div className="filter-heading">
              <div><SlidersHorizontal aria-hidden="true" /><h2>Filter care</h2></div>
              {activeFilterCount > 0 && <button type="button" onClick={clearFilters}>Clear all</button>}
            </div>

            <label className="field-label">
              <span>Location</span>
              <div className="field-with-icon readonly-field"><MapPin aria-hidden="true" /><span>Durham, NC</span></div>
            </label>
            <label className="field-label">
              <span>Within</span>
              <div className="select-wrap">
                <select value={filters.maxDistance} onChange={(event) => updateFilter('maxDistance', Number(event.target.value))}>
                  <option value={3}>3 miles</option>
                  <option value={5}>5 miles</option>
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                </select>
                <ChevronDown aria-hidden="true" />
              </div>
            </label>
            <label className="field-label">
              <span>Insurance</span>
              <div className="select-wrap">
                <select value={filters.insurance} onChange={(event) => updateFilter('insurance', event.target.value)}>
                  <option value="">Any insurance</option>
                  {insurancePlans.map((plan) => <option key={plan.id} value={plan.name}>{plan.name}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </div>
            </label>
            <label className="field-label">
              <span>Specialty</span>
              <div className="select-wrap">
                <select value={filters.specialty} onChange={(event) => updateFilter('specialty', event.target.value)}>
                  <option value="">Any specialty</option>
                  {specialtyOptions.map((specialty) => <option key={specialty} value={specialty}>{specialty}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </div>
            </label>
            <fieldset className="filter-fieldset">
              <legend>Visit type</legend>
              {(['all', 'scheduled', 'walk-in', 'urgent'] as const).map((mode) => (
                <label key={mode}>
                  <input type="radio" name="visit-mode" checked={filters.visitMode === mode} onChange={() => updateFilter('visitMode', mode)} />
                  <span>{mode === 'all' ? 'Any visit type' : mode === 'walk-in' ? 'Walk-in' : mode[0].toUpperCase() + mode.slice(1)}</span>
                </label>
              ))}
            </fieldset>
            <fieldset className="filter-fieldset">
              <legend>When</legend>
              {([
                ['all', 'Any time'],
                ['open-now', 'Open now'],
                ['morning', 'Morning'],
                ['afternoon', 'Afternoon'],
              ] as const).map(([value, label]) => (
                <label key={value}>
                  <input type="radio" name="timing" checked={filters.timing === value} onChange={() => updateFilter('timing', value)} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            <InfoNote>Time-of-day filters use historical patterns in this prototype.</InfoNote>
          </aside>

          <div className="results-column">
            <div className="mobile-filter-row">
              <button className="button button-secondary" type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>
                <SlidersHorizontal aria-hidden="true" /> Filters {activeFilterCount > 0 && <b>{activeFilterCount}</b>}
              </button>
              {activeFilterCount > 0 && <button className="text-button" type="button" onClick={clearFilters}>Clear</button>}
            </div>

            <div className="results-toolbar">
              <div>
                <span className="eyebrow">Care near Durham</span>
                <h2 id="results-title">{loading ? 'Finding options…' : `${sortedResults.length} clinic${sortedResults.length === 1 ? '' : 's'} fit your plan`}</h2>
                <p>Every time shown is a total-visit estimate with a separate confidence signal.</p>
              </div>
              <div className="toolbar-actions">
                <label className="sort-control">
                  <span className="sr-only">Sort results</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
                    <option value="distance">Nearest first</option>
                    <option value="shortest">Shortest visit</option>
                    <option value="reliability">Highest confidence</option>
                  </select>
                  <ChevronDown aria-hidden="true" />
                </label>
                <div className="view-toggle" aria-label="Results view">
                  <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'}>
                    <Navigation aria-hidden="true" /> List
                  </button>
                  <button type="button" className={view === 'map' ? 'active' : ''} onClick={() => setView('map')} aria-pressed={view === 'map'}>
                    <Map aria-hidden="true" /> Map
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <PageLoader />
            ) : error ? (
              <div className="empty-state" role="alert">
                <span className="empty-icon"><Timer aria-hidden="true" /></span>
                <h3>We couldn’t load the demo clinics</h3>
                <p>The sample service had a problem. Your filters are still here.</p>
                <button className="button button-primary" type="button" onClick={loadResults}>Try again</button>
              </div>
            ) : sortedResults.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><Search aria-hidden="true" /></span>
                <h3>No clinics match everything yet</h3>
                <p>Try a wider distance or remove one filter. You won’t lose your search text.</p>
                <button className="button button-primary" type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            ) : view === 'map' ? (
              <MapView
                clinics={sortedResults}
                selectedId={selectedClinicId}
                onSelect={setSelectedClinicId}
                preferredMode={filters.visitMode}
              />
            ) : (
              <div className="clinic-list">
                {sortedResults.map((clinic) => (
                  <ClinicCard clinic={clinic} key={clinic.id} preferredMode={filters.visitMode} />
                ))}
              </div>
            )}

            {!loading && sortedResults.length > 0 && (
              <div className="results-end-note">
                <Sparkles aria-hidden="true" />
                <div>
                  <strong>Why confidence matters</strong>
                  <p>A 45-minute estimate with low confidence may be harder to plan around than a 55-minute estimate backed by fresh, consistent reports.</p>
                </div>
                <Link to="/know#reliability">Learn more <ArrowRight aria-hidden="true" /></Link>
              </div>
            )}
          </div>
        </section>
        <SafetyNote />
      </div>
    </>
  );
}
