import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Check,
  Clock3,
  LockKeyhole,
  MapPin,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { Brand } from '../components/Brand';
import { DemoBadge, SafetyNote } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Link, navigate } from '../utils/navigation';

export function OnboardingPage() {
  const { pushToast } = useApp();
  const [accountNoteOpen, setAccountNoteOpen] = useState(false);

  const enterAsGuest = () => {
    window.localStorage.setItem('mediq-onboarded', 'guest');
    navigate('/find');
  };

  const enterAccountPreview = () => {
    window.localStorage.setItem('mediq-onboarded', 'account-preview');
    pushToast('Account features are simulated; you’re browsing privately on this device.', 'info');
    navigate('/find');
  };

  return (
    <main id="main-content" className="onboarding-page">
      <section className="onboarding-intro">
        <div className="onboarding-brand-row">
          <Brand />
          <DemoBadge />
        </div>

        <div className="onboarding-copy">
          <span className="eyebrow light">Healthcare planning, made human</span>
          <h1>Know before<br />you go.</h1>
          <p>
            See how long a visit may take, how reliable that estimate is, and when to leave—before your day gets away from you.
          </p>
        </div>

        <div className="preview-card" aria-label="Example MediQ visit estimate">
          <div className="preview-card-header">
            <span><MapPin aria-hidden="true" /> Durham, NC</span>
            <span className="status status-open"><span /> Open now</span>
          </div>
          <div className="preview-time-row">
            <div>
              <small>Estimated total visit</small>
              <strong>54 <span>min</span></strong>
            </div>
            <div className="preview-confidence">
              <BadgeCheck aria-hidden="true" />
              <span><b>91%</b> confidence</span>
            </div>
          </div>
          <div className="preview-timeline" aria-hidden="true">
            <span style={{ flex: 7 }} />
            <span style={{ flex: 24 }} />
            <span style={{ flex: 17 }} />
            <span style={{ flex: 6 }} />
          </div>
          <div className="preview-labels">
            <span>Check in</span><span>Wait</span><span>Care</span><span>Wrap up</span>
          </div>
        </div>

        <p className="onboarding-data-note"><LockKeyhole aria-hidden="true" /> No medical history is needed to browse.</p>
      </section>

      <section className="onboarding-options" aria-labelledby="start-title">
        <div className="onboarding-options-inner">
          <span className="eyebrow">Welcome to MediQ</span>
          <h2 id="start-title">How would you like to start?</h2>
          <p className="section-intro">You can explore the full care-finding experience without an account.</p>

          <div className="entry-options">
            <article className="entry-card recommended">
              <span className="recommended-tag">Fastest · recommended</span>
              <div className="entry-icon"><Clock3 aria-hidden="true" /></div>
              <div>
                <h3>Continue as a guest</h3>
                <p>Search clinics, compare estimates, save visits on this device, and report a wait anonymously.</p>
                <ul>
                  <li><Check aria-hidden="true" /> No sign-up</li>
                  <li><Check aria-hidden="true" /> No health information</li>
                  <li><Check aria-hidden="true" /> Full prototype access</li>
                </ul>
              </div>
              <button className="button button-primary button-large" type="button" onClick={enterAsGuest}>
                Explore as a guest <ArrowRight aria-hidden="true" />
              </button>
            </article>

            <article className="entry-card">
              <div className="entry-icon soft"><UserRound aria-hidden="true" /></div>
              <div>
                <h3>Create a free account</h3>
                <p>Future accounts will sync saved clinics, appointments, and language preferences across devices.</p>
              </div>
              {accountNoteOpen ? (
                <div className="integration-callout" role="status">
                  <strong>Authentication isn’t connected yet.</strong>
                  <span>This demo will preview account features without collecting personal or medical information.</span>
                  <button className="button button-secondary" type="button" onClick={enterAccountPreview}>
                    Continue with preview
                  </button>
                </div>
              ) : (
                <button className="button button-secondary button-large" type="button" onClick={() => setAccountNoteOpen(true)}>
                  Preview free account
                </button>
              )}
            </article>

            <article className="entry-card plus-card">
              <div className="entry-icon gold"><Sparkles aria-hidden="true" /></div>
              <div>
                <div className="entry-title-row">
                  <h3>Explore future Plus</h3>
                  <span>Concept</span>
                </div>
                <p>See the questions MediQ must answer before any optional planning tier is defined.</p>
              </div>
              <Link className="button button-ghost button-large" to="/know#access">
                View the concept <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          </div>

          <div className="guest-capabilities">
            <Bookmark aria-hidden="true" />
            <p><strong>Guest-first by design.</strong> Your saved items stay in this browser. Nothing here stores diagnoses, medications, or medical records.</p>
          </div>
          <SafetyNote compact />
        </div>
      </section>
    </main>
  );
}
