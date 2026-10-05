import { CalendarDays, CircleHelp, House, MessageSquarePlus } from 'lucide-react';
import { internalEnabled, backendEnabled } from '../services/api';
import { useEffect, useRef, type ReactNode } from 'react';
import { languages } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ProductTour } from './ProductTour';
import { Brand } from './Brand';
import { Link } from '../utils/navigation';
const isActive=(path:string,target:string)=>path===target||(target==='/saved'&&path==='/appointments')||(target==='/know'&&path==='/about');
export function Layout({children,currentPath}:{children:ReactNode;currentPath:string}) {
 const {t,toasts,user,logout,isAdmin,accountReady}=useApp();const menu=useRef<HTMLDetailsElement>(null);
 const items=[{to:'/find',label:'Find Care',Icon:House},{to:'/saved',label:'Appointments',Icon:CalendarDays},{to:'/report',label:'Report a Wait',Icon:MessageSquarePlus},{to:'/know',label:'About',Icon:CircleHelp}];
 useEffect(()=>{if(menu.current)menu.current.open=false;},[currentPath,user?.id]);
 useEffect(()=>{const close=(event:PointerEvent)=>{if(menu.current&&!menu.current.contains(event.target as Node))menu.current.open=false;};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[]);
 const closeMenu=()=>{if(menu.current){menu.current.open=false;menu.current.querySelector('summary')?.focus();}};
 return <div className="site-shell">
  <header className="site-header"><div className="shell header-inner"><Brand/>
   <nav className="desktop-nav" aria-label={t('Primary navigation')}>{items.map(item=><Link key={item.to} data-tour={item.to==='/find'?'find':item.to==='/saved'?'appointments':item.to==='/report'?'report':undefined} to={item.to} className={isActive(currentPath,item.to)?'nav-link active':'nav-link'} aria-current={isActive(currentPath,item.to)?'page':undefined}>{t(item.label)}</Link>)}</nav>
   <div className="header-account"><LanguageSelector/>
    {accountReady&&user?<details ref={menu} className="account-menu" onKeyDown={event=>{if(event.key==='Escape')closeMenu();}}>
     <summary title={t('Hello, {name}',{name:user.firstName})}><span>{t('Hello, {name}',{name:user.firstName})}</span><span aria-hidden="true"> ▾</span></summary>
     <div className="account-menu-panel"><Link to="/settings" onClick={closeMenu}>{t('Settings')}</Link><button type="button" onClick={()=>{closeMenu();window.dispatchEvent(new Event('mediq:tour'));}}>{t('Product tour')}</button>{isAdmin&&internalEnabled&&<Link to="/admin" onClick={closeMenu}>{t('Administration')}</Link>}<button type="button" onClick={()=>{closeMenu();void logout();}}>{t('Log out')}</button></div>
    </details>:<Link className="account-entry" to="/login">{t('Log in / Sign up')}</Link>}
   </div>
  </div></header>
  <main id="main-content">{children}</main>
  <footer className="site-footer"><div className="shell footer-grid"><div><Brand compact/><p className="footer-promise">{t('Healthcare is unpredictable. Your schedule shouldn’t be.')}</p></div><div className="footer-note"><p><strong>{t('Prototype only.')}</strong> {t(backendEnabled?'Directory fixtures are fictional. Accepted reports are stored by the configured service.':'All clinics, people, reports, availability, and estimates are fictional.')}</p></div>
   <nav className="footer-links" aria-label={t('Footer navigation')}><Link to="/contact">{t('Contact Us')}</Link><Link to="/privacy">{t('Privacy')}</Link><Link to="/safety">{t('Safety')}</Link><Link to="/accessibility">{t('Accessibility')}</Link><Link to="/know#limitations">{t('Data limitations')}</Link><button className="text-button" type="button" onClick={()=>window.dispatchEvent(new Event('mediq:tour'))}>{t('Product tour')}</button></nav>
  </div></footer>
  <nav className="mobile-nav" aria-label={t('Mobile navigation')}>{items.map(({to,label,Icon})=><Link key={to} data-tour={to==='/find'?'find':to==='/saved'?'appointments':to==='/report'?'report':undefined} to={to} className={isActive(currentPath,to)?'active':''} aria-current={isActive(currentPath,to)?'page':undefined}><Icon aria-hidden="true"/><span>{t(label)}</span></Link>)}</nav>
  <ProductTour currentPath={currentPath}/><div className="toast-region" aria-live="polite" aria-atomic="false">{toasts.map(toast=><div className={`toast toast-${toast.tone||'default'}`} key={toast.id} role="status">{toast.message}</div>)}</div>
 </div>;
}
export function LanguageSelector(){const {language,setLanguage,t}=useApp();return <label className="language-control"><span className="sr-only">{t('language')}</span><select value={language} onChange={event=>setLanguage(event.target.value)}>{languages.map(item=><option key={item.code} value={item.code}>{item.label}</option>)}</select></label>;}
