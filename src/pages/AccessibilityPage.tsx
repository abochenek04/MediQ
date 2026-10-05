import { useApp } from '../context/AppContext';
import { Link } from '../utils/navigation';
export function AccessibilityPage(){const {t}=useApp();return <article className="shell page-space reading-page"><h1>{t('Accessibility')}</h1><p>{t('We work to make MediQ usable by more people. This statement describes current support, not formal conformance certification.')}</p>
 <h2>{t('Keyboard navigation')}</h2><p>{t('Use Tab and Shift+Tab to move between controls, Enter or Space to activate them, and Escape to close dialogs. A skip link takes you to the main content.')}</p>
 <h2>{t('Screen-reader support')}</h2><p>{t('Controls have visible labels. Visit stages pair each label with its time. Dialogs have names, contain keyboard focus and return focus when closed. Status and error messages are announced.')}</p>
 <h2>{t('Language support')}</h2><p>{t('MediQ supports English, Spanish, Chinese, Arabic, Polish, Gujarati and Hindi. Arabic uses right-to-left layout. Translation drafts still need native-speaker review.')}</p>
 <h2>{t('Text resizing')}</h2><p>{t('You can use browser zoom and text resizing. Layouts reflow on small screens; charts and tables may use horizontal scrolling.')}</p>
 <h2>{t('Reduced motion')}</h2><p>{t('MediQ follows your device’s reduced-motion preference for animations, transitions and scrolling.')}</p>
 <h2>{t('Report an accessibility issue')}</h2><p>{t('Describe the page, control and difficulty without including personal or medical information. The accessibility feedback form saves your message for the MediQ team.')}</p><Link className="button button-primary" to="/contact#accessibility-feedback">{t('Report an accessibility issue')}</Link>
 <h2>{t('Clinic accessibility information')}</h2><p>{t('Clinic accessibility is listed as available, not available or unknown. Demo attributes are fictional. Please confirm services directly with the clinic.')}</p>
 </article>;}
