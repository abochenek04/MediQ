import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BrainCircuit,
  Building2,
  CalendarCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  CloudCog,
  Database,
  Fingerprint,
  HeartHandshake,
  Landmark,
  LockKeyhole,
  MapPinned,
  MessageSquareText,
  Network,
  Route,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  UserRound,
  Users,
} from 'lucide-react';
import { DemoBadge, SafetyNote } from '../components/UI';
import { Link } from '../utils/navigation';

const guideNav = [
  ['overview', 'Why MediQ'],
  ['journey', 'Patient journey'],
  ['estimates', 'Wait estimates'],
  ['reliability', 'Reliability'],
  ['data', 'Data & integrity'],
  ['privacy', 'Privacy'],
  ['comparison', 'Product comparison'],
  ['roadmap', 'Pilot & roadmap'],
  ['architecture', 'Architecture'],
  ['questions', 'Open questions'],
  ['safety', 'Safety'],
];

export function KnowPage() {
  return (
    <div className="know-page">
      <section className="know-hero">
        <div className="shell know-hero-inner">
          <div>
            <DemoBadge label="Product guide · Sep 2026" />
            <span className="eyebrow light">What you need to know</span>
            <h1>The thinking behind MediQ.</h1>
            <p>
              A transparent guide to the patient problem, the meaning of every estimate, the data we would need, and the questions a responsible pilot must answer.
            </p>
            <div className="know-hero-actions">
              <Link className="button button-coral" to="/find">Explore the prototype <ArrowRight aria-hidden="true" /></Link>
              <a className="button button-light" href="#overview">Read the guide</a>
            </div>
          </div>
          <div className="know-hero-visual" aria-label="MediQ connects visit timing, data confidence, and personal planning">
            <div className="orbit-card center-card"><Clock3 aria-hidden="true" /><span><strong>54 min</strong><small>Total visit</small></span></div>
            <div className="orbit-card top-card"><ShieldCheck aria-hidden="true" /><span><strong>91%</strong><small>Confidence</small></span></div>
            <div className="orbit-card bottom-card"><Route aria-hidden="true" /><span><strong>2:42 PM</strong><small>Leave by</small></span></div>
            <svg aria-hidden="true" viewBox="0 0 400 340"><path d="M204 42C292 42 350 98 350 175C350 254 289 301 201 301C112 301 52 252 52 174C52 97 115 42 204 42Z" /><path d="M204 73C274 73 319 113 319 175C319 237 271 270 201 270C131 270 83 236 83 174C83 113 134 73 204 73Z" /></svg>
          </div>
        </div>
      </section>

      <div className="shell guide-layout">
        <aside className="guide-nav" aria-label="Guide sections">
          <span>On this page</span>
          <nav>
            {guideNav.map(([id, label], index) => (
              <a href={`#${id}`} key={id}><b>{String(index + 1).padStart(2, '0')}</b>{label}</a>
            ))}
          </nav>
          <div className="guide-nav-card">
            <CircleHelp aria-hidden="true" />
            <strong>A working hypothesis</strong>
            <p>This guide separates what exists in the prototype from what still needs evidence.</p>
          </div>
        </aside>

        <div className="guide-content">
          <section id="overview" className="guide-section overview-section">
            <div className="guide-section-label"><span>01</span> Why MediQ</div>
            <div className="guide-section-heading">
              <span className="eyebrow">The problem & promise</span>
              <h2>Medical visits are hard to plan around.</h2>
              <p>
                Patients often know an appointment time but not the waiting-room delay, time with a provider, or total time away from work and family. For people with hourly jobs, childcare, transportation constraints, or caregiving duties, that uncertainty can become a barrier to care.
              </p>
            </div>
            <blockquote className="promise-quote">“Know before you go.”<small>MediQ’s central product promise</small></blockquote>
            <div className="benefit-grid">
              <article><Clock3 aria-hidden="true" /><span><strong>See the likely visit</strong><p>One total estimate, a useful range, and the stages inside it.</p></span></article>
              <article><ShieldCheck aria-hidden="true" /><span><strong>Understand the signal</strong><p>Confidence is separate from ratings and visibly explained.</p></span></article>
              <article><Route aria-hidden="true" /><span><strong>Protect your time</strong><p>Plan work, childcare, travel, and the rest of your day.</p></span></article>
            </div>
            <div className="target-users-block">
              <div><Users aria-hidden="true" /><span><strong>Designed first for people whose time has little slack.</strong><p>Parents, hourly workers, caregivers, people new to an area, and anyone comparing or returning to a clinic.</p></span></div>
              <div className="user-tags"><span>Parents</span><span>Hourly workers</span><span>Caregivers</span><span>New patients</span><span>Established patients</span><span>Transit-limited patients</span></div>
            </div>
          </section>

          <section id="journey" className="guide-section">
            <div className="guide-section-label"><span>02</span> Patient journey</div>
            <div className="guide-section-heading">
              <span className="eyebrow">A short path, not a dashboard</span>
              <h2>From uncertainty to a practical plan.</h2>
            </div>
            <ol className="journey-steps">
              <li><span>1</span><div><Search aria-hidden="true" /><strong>Search or browse</strong><p>Start as a guest. Filter by location, insurance, specialty, visit type, and time.</p></div></li>
              <li><span>2</span><div><MapPinned aria-hidden="true" /><strong>Compare with context</strong><p>See total-visit estimates, historical patterns, providers, reports, and confidence.</p></div></li>
              <li><span>3</span><div><CalendarCheck aria-hidden="true" /><strong>Save a plan</strong><p>Add an appointment or intended arrival to calculate travel, buffer, and likely finish.</p></div></li>
              <li><span>4</span><div><MessageSquareText aria-hidden="true" /><strong>Report the visit</strong><p>Share operational timing in about one minute, anonymously if preferred.</p></div></li>
            </ol>
          </section>

          <section id="estimates" className="guide-section">
            <div className="guide-section-label"><span>03</span> Wait estimates</div>
            <div className="guide-section-heading">
              <span className="eyebrow">What the numbers mean</span>
              <h2>Show the whole visit—not one vague “wait.”</h2>
              <p>A MediQ estimate should say which visit mode it describes and whether it covers the waiting room or the full arrival-to-departure journey.</p>
            </div>
            <div className="estimate-definition-card">
              <div className="definition-total"><span>Example total</span><strong>54<small> min</small></strong><p>Likely range 43–68 min</p></div>
              <div className="definition-stages">
                <div><span style={{ width: '13%' }} /><b>7m</b><small>Check in</small></div>
                <div><span style={{ width: '44%' }} /><b>24m</b><small>Wait</small></div>
                <div><span style={{ width: '31%' }} /><b>17m</b><small>Care</small></div>
                <div><span style={{ width: '12%' }} /><b>6m</b><small>Wrap up</small></div>
              </div>
            </div>
            <div className="live-history-grid">
              <article><span className="data-type-icon coral"><Timer aria-hidden="true" /></span><div><h3>Current estimate</h3><p>A recent, changing snapshot built from the newest available signals. The prototype uses fictional samples and never calls them genuinely live.</p><ul><li><Check /> Updated time</li><li><Check /> Visit mode</li><li><Check /> Contributing reports</li></ul></div></article>
              <article><span className="data-type-icon blue"><Clock3 aria-hidden="true" /></span><div><h3>Historical pattern</h3><p>A planning reference for typical days and times, with a range that shows variation. Older data should gradually lose influence.</p><ul><li><Check /> Day of week</li><li><Check /> Time of day</li><li><Check /> Typical range</li></ul></div></article>
            </div>
            <div className="visit-mode-comparison">
              <div><span className="mode-pill">Scheduled</span><h3>Anchored to an appointment</h3><p>Compare arrival, appointment time, provider start, and total visit. Late arrivals and earlier overruns can still affect timing.</p></div>
              <div><span className="mode-pill coral-pill">Walk-in / urgent</span><h3>Anchored to current demand</h3><p>Report arrival and triage timing. Patient acuity can change order, so queue position must remain adaptive and qualified.</p></div>
            </div>
          </section>

          <section id="reliability" className="guide-section">
            <div className="guide-section-label"><span>04</span> Reliability</div>
            <div className="guide-section-heading">
              <span className="eyebrow">Confidence ≠ quality</span>
              <h2>How trustworthy is the estimate?</h2>
              <p>The reliability score describes the strength of the timing evidence. It does not rate the clinic, guarantee a wait, or imply better medical care.</p>
            </div>
            <div className="reliability-explainer">
              <div className="score-demo"><ShieldCheck aria-hidden="true" /><strong>91</strong><span>/100</span><b>High confidence</b></div>
              <div className="reliability-factors-guide">
                {[
                  ['Data freshness', 'How recently useful signals arrived', 96],
                  ['Report volume', 'How many relevant samples contribute', 92],
                  ['Report agreement', 'How closely recent reports align', 88],
                  ['Historical consistency', 'How stable similar periods have been', 86],
                  ['Source diversity', 'Whether patient, clinic, and modeled sources contribute', 90],
                ].map(([label, text, score]) => (
                  <div key={String(label)}><span><strong>{label}</strong><small>{text}</small></span><div><i style={{ width: `${score}%` }} /></div><b>{score}</b></div>
                ))}
              </div>
            </div>
            <p className="guide-callout"><BadgeCheck aria-hidden="true" /><span><strong>Production rule:</strong> expose the ingredients and uncertainty. Never let a polished score suggest certainty that the underlying data cannot support.</span></p>
          </section>

          <section id="data" className="guide-section">
            <div className="guide-section-label"><span>05</span> Data & integrity</div>
            <div className="guide-section-heading">
              <span className="eyebrow">Potential inputs</span>
              <h2>Useful estimates require more than crowdsourcing.</h2>
              <p>The prototype demonstrates the experience. A pilot must compare patient-reported operational timing against clinic timestamps and clearly label every source.</p>
            </div>
            <div className="source-grid">
              <article><MessageSquareText aria-hidden="true" /><h3>Patient reports</h3><p>Arrival, check-in, provider start, departure, and experience context—without medical details.</p><span>Implemented with sample data</span></article>
              <article><Building2 aria-hidden="true" /><h3>Clinic operations</h3><p>Queue state, appointment events, check-in timestamps, and aggregate capacity signals.</p><span>Future integration</span></article>
              <article><Database aria-hidden="true" /><h3>Historical models</h3><p>Weighted patterns by day, time, visit mode, and clinic, with older records losing influence.</p><span>Modeled in prototype</span></article>
              <article><MapPinned aria-hidden="true" /><h3>Travel providers</h3><p>GPS location, route time, traffic, and accessible transportation planning.</p><span>Simulated in prototype</span></article>
            </div>

            <div id="limitations" className="limitations-card">
              <div><span className="eyebrow">Data limitations</span><h3>What could make an estimate wrong?</h3></div>
              <ul>
                <li>Urgent patient acuity changes queue order.</li>
                <li>Staffing or room availability shifts suddenly.</li>
                <li>Reports may be sparse, delayed, or imprecise.</li>
                <li>Scheduled and walk-in demand interact.</li>
                <li>Visit complexity differs from one patient to another.</li>
                <li>A clinic system may record events differently.</li>
              </ul>
            </div>

            <div id="integrity" className="integrity-guide">
              <div className="integrity-intro"><Fingerprint aria-hidden="true" /><span><span className="eyebrow">Fraud & spam prevention</span><h3>Trust should come from layered controls.</h3><p>No single device, patient, clinic, or competitor should be able to move an estimate unchecked.</p></span></div>
              <div className="integrity-control-grid">
                {['Rate limiting', 'Duplicate detection', 'Verified-visit prompts', 'Source weighting', 'Device & account reputation', 'Statistical anomaly checks', 'Clinic-gaming detection', 'Competitor-sabotage detection', 'Manual moderation'].map((item) => <span key={item}><Check aria-hidden="true" /> {item}</span>)}
              </div>
              <p>A Python-based scoring service may become useful at scale, but only after pilot data shows which patterns actually indicate abuse.</p>
            </div>
          </section>

          <section id="privacy" className="guide-section">
            <div className="guide-section-label"><span>06</span> Privacy</div>
            <div className="guide-section-heading">
              <span className="eyebrow">Collect less by default</span>
              <h2>Planning a visit should not require sharing a medical history.</h2>
              <p>MediQ can deliver core value from operational data. Diagnoses, symptoms, medications, clinical notes, and medical records are not needed for guest browsing or a wait report.</p>
            </div>
            <div className="privacy-grid">
              <article className="do-card"><h3><Check aria-hidden="true" /> Prototype does</h3><ul><li>Work without an account</li><li>Store guest preferences on-device</li><li>Offer anonymous reporting</li><li>Use fictional clinic and person data</li><li>Separate operational from medical information</li></ul></article>
              <article className="dont-card"><h3><LockKeyhole aria-hidden="true" /> Prototype does not</h3><ul><li>Claim HIPAA compliance</li><li>Collect medical histories</li><li>Store protected health information</li><li>Connect to real patient portals</li><li>Sell identifiable patient data</li></ul></article>
            </div>
            <p className="hipaa-note"><ShieldCheck aria-hidden="true" /><span><strong>HIPAA readiness is future work.</strong> Before production, legal, privacy, security, consent, retention, vendor, access-control, and incident-response reviews would be required. “HIPAA-ready” is not the same as certified or compliant.</span></p>
          </section>

          <section id="access" className="guide-section access-section">
            <div className="guide-section-label"><span>07</span> Access model</div>
            <div className="guide-section-heading">
              <span className="eyebrow">Guest first</span>
              <h2>Core patient value stays accessible.</h2>
            </div>
            <div className="access-grid">
              <article className="featured"><span>Available now</span><UserRound aria-hidden="true" /><h3>Guest</h3><p>Search, filter, compare, view reviews, save locally, plan visits, and report anonymously.</p><strong>Free prototype access</strong></article>
              <article><span>Integration placeholder</span><CloudCog aria-hidden="true" /><h3>Free account</h3><p>Could sync saved clinics, visits, and preferences across devices. No medical history required.</p><strong>Definition needs testing</strong></article>
              <article><span>Future concept</span><Sparkles aria-hidden="true" /><h3>Optional Plus</h3><p>Advanced planning is a hypothesis only. Research must show demand without restricting essential access.</p><strong>Pricing not decided</strong></article>
            </div>
          </section>

          <section id="comparison" className="guide-section">
            <div className="guide-section-label"><span>08</span> Product comparison</div>
            <div className="guide-section-heading">
              <span className="eyebrow">Category-level hypothesis</span>
              <h2>Where MediQ could fit.</h2>
              <p>This is a product hypothesis—not a researched claim about any named company.</p>
            </div>
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <thead><tr><th scope="col">Option</th><th scope="col">Usually helps with</th><th scope="col">Common planning gap</th><th scope="col">MediQ hypothesis</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Provider search & booking directories</th><td>Discovery, availability, booking</td><td>Total visit-time context may be limited</td><td>Pair discovery with current and historical visit timing</td></tr>
                  <tr><th scope="row">General review websites</th><td>Broad patient opinions</td><td>Reviews are not structured for planning</td><td>Separate provider, communication, accessibility, and wait accuracy</td></tr>
                  <tr><th scope="row">Calling a clinic</th><td>Direct, situational information</td><td>Time-consuming and difficult to compare</td><td>Provide a quick first look with source confidence</td></tr>
                  <tr><th scope="row">Clinic-owned patient portals</th><td>Records, messages, clinic appointments</td><td>Typically limited to one health system</td><td>Offer cross-clinic planning without requiring medical records</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="roadmap" className="guide-section">
            <div className="guide-section-label"><span>09</span> Pilot & roadmap</div>
            <div className="guide-section-heading">
              <span className="eyebrow">Earn the right to scale</span>
              <h2>One useful clinic partnership first.</h2>
            </div>
            <ol className="pilot-timeline">
              <li><span>1</span><div><strong>Prototype</strong><p>Build with fictional or manually collected data.</p></div></li>
              <li><span>2</span><div><strong>Patient test</strong><p>Watch people search, compare, plan, and report.</p></div></li>
              <li><span>3</span><div><strong>Small clinic partner</strong><p>Choose one clinic type and define a limited pilot.</p></div></li>
              <li><span>4</span><div><strong>Validate timing</strong><p>Compare reports against clinic timestamps.</p></div></li>
              <li><span>5</span><div><strong>Improve trust rules</strong><p>Tune confidence, freshness, and integrity logic.</p></div></li>
              <li><span>6</span><div><strong>Share evidence</strong><p>Use measured patient and clinic outcomes.</p></div></li>
              <li><span>7</span><div><strong>Expand locally</strong><p>Add one geographic area at a time.</p></div></li>
            </ol>

            <div className="roadmap-grid">
              <article><Bell aria-hidden="true" /><span><b>Prototype concept</b><h3>Queue-change alerts</h3><p>Clickable now; real notifications require queue feeds and consent.</p></span></article>
              <article><MapPinned aria-hidden="true" /><span><b>Prototype concept</b><h3>GPS travel planning</h3><p>Simulated now; production requires a mapping provider.</p></span></article>
              <article><CalendarCheck aria-hidden="true" /><span><b>Future</b><h3>Booking & check-in</h3><p>Direct scheduling and online check-in through clinic integrations.</p></span></article>
              <article><BrainCircuit aria-hidden="true" /><span><b>Future</b><h3>AI visit support</h3><p>Pre-visit preparation and post-visit summaries only after privacy and clinical-safety review.</p></span></article>
              <article><Landmark aria-hidden="true" /><span><b>Future</b><h3>Clinic analytics</h3><p>Aggregated operational benchmarking with clear governance.</p></span></article>
              <article><Smartphone aria-hidden="true" /><span><b>Future</b><h3>Native notifications</h3><p>Push alerts for meaningful estimate changes, not engagement spam.</p></span></article>
            </div>

            <div className="business-card">
              <HeartHandshake aria-hidden="true" />
              <div><span className="eyebrow">Ethical monetization hypotheses</span><h3>Revenue cannot undermine trust.</h3><p>Keep core patient access free; test clinic partnerships and aggregated operational benchmarking; clearly label any sponsored placement; never sell identifiable patient data. An optional planning tier should exist only if users value it and essential access remains free.</p></div>
            </div>
          </section>

          <section id="architecture" className="guide-section">
            <div className="guide-section-label"><span>10</span> Architecture</div>
            <div className="guide-section-heading">
              <span className="eyebrow">Built to swap mock data cleanly</span>
              <h2>A thin adapter between experience and infrastructure.</h2>
              <p>The prototype keeps typed data, service interfaces, and UI components separate. Real integrations replace the mock service rather than forcing a redesign.</p>
            </div>
            <div className="architecture-diagram" role="img" aria-label="Data sources connect through service adapters to the MediQ experience and local guest preferences">
              <div className="architecture-layer"><span>Data sources</span><div><b><MessageSquareText /> Patient reports</b><b><Building2 /> Clinic feeds</b><b><MapPinned /> Travel API</b></div></div>
              <ChevronRight aria-hidden="true" />
              <div className="architecture-layer highlighted"><span>Service adapters</span><div><b><Network /> Typed API layer</b><b><ShieldCheck /> Integrity checks</b></div></div>
              <ChevronRight aria-hidden="true" />
              <div className="architecture-layer"><span>Product</span><div><b><Smartphone /> React interface</b><b><Database /> Guest storage</b></div></div>
            </div>
            <div className="architecture-notes">
              <div><strong>Now</strong><p>React + TypeScript + Vite, centralized fictional data, async mock service, browser storage.</p></div>
              <div><strong>Later</strong><p>SQL-backed records, authentication, clinic scheduling, travel, reviews, queue feeds, and notification providers.</p></div>
            </div>
          </section>

          <section id="questions" className="guide-section">
            <div className="guide-section-label"><span>11</span> Open questions</div>
            <div className="guide-section-heading">
              <span className="eyebrow">What the prototype should help test</span>
              <h2>The most important decisions still need evidence.</h2>
            </div>
            <div className="questions-grid">
              {[
                'How many reports make an estimate useful?',
                'How quickly should old reports lose influence?',
                'What should count as a verified visit?',
                'How should clinic and patient data be weighted?',
                'How should patient acuity affect queue estimates?',
                'What motivates patients to report a visit?',
                'What motivates clinics to share operational data?',
                'Which features truly need an account?',
                'Would anyone pay for advanced planning?',
                'What can be collected without unnecessary privacy risk?',
                'Which clinic type is best for the first pilot?',
                'What unique value remains after existing tools improve?',
              ].map((question, index) => <article key={question}><span>{String(index + 1).padStart(2, '0')}</span><p>{question}</p></article>)}
            </div>
          </section>

          <section id="safety" className="guide-section safety-guide-section">
            <div className="guide-section-label"><span>12</span> Safety</div>
            <div className="guide-section-heading">
              <span className="eyebrow">A planning tool has boundaries</span>
              <h2>MediQ does not diagnose, triage, or delay urgent care.</h2>
            </div>
            <SafetyNote />
            <ul className="safety-boundaries">
              <li><Check aria-hidden="true" /> Estimates are not medical advice.</li>
              <li><Check aria-hidden="true" /> Shorter waits do not imply better care.</li>
              <li><Check aria-hidden="true" /> A queue position can change with patient acuity.</li>
              <li><Check aria-hidden="true" /> Users should confirm insurance, hours, and booking directly.</li>
            </ul>
            <Link className="button button-primary" to="/find">Find care in the demo <ArrowRight aria-hidden="true" /></Link>
          </section>
        </div>
      </div>
    </div>
  );
}
