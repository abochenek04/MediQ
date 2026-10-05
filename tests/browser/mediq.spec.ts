import { test,expect,type Page } from '@playwright/test';
import { readFileSync,readdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
const password='Browser-test-password-2026';
async function dismissTour(page:Page){const button=page.getByRole('button',{name:'Skip tour',exact:true}).first();if(await button.isVisible())await button.click();}
async function visit(page:Page,path='/find'){await page.goto(path);await expect(page.getByRole('main')).toBeVisible();await dismissTour(page);}
function otp(email:string){return readdirSync('.data/e2e/mail').map(n=>JSON.parse(readFileSync(`.data/e2e/mail/${n}`,'utf8'))).filter(m=>m.to===email).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0]?.otp;}
async function signup(page:Page,email:string){
 await visit(page,'/signup');await page.getByLabel('First name',{exact:true}).fill('Browser');await page.getByLabel('Last name',{exact:true}).fill('Tester');await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'Create a free account',exact:true}).click();
 await expect(page).toHaveURL(/\/verify/);await expect.poll(()=>otp(email)).toBeTruthy();await page.getByLabel('Verification code',{exact:true}).fill(otp(email));await page.getByRole('button',{name:'Verify your email',exact:true}).click();await expect(page).toHaveURL(/\/find/);await expect(page.getByRole('dialog',{name:'Product tour'})).toBeVisible();await dismissTour(page);
}
async function logout(page:Page){await page.locator('.account-menu summary').click();await page.getByRole('button',{name:'Log out',exact:true}).click();}
async function login(page:Page,email:string){await visit(page,'/login');await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).toHaveURL(/\/find/);await expect(page.locator('.account-menu summary')).toContainText('Hello, Browser');await dismissTour(page);}
function clearTestLimits(){const db=new DatabaseSync('.data/e2e/mediq.sqlite');db.exec('DELETE FROM rate_limits');db.close();}
test.beforeEach(()=>clearTestLimits());

test('guest navigation, search, strict filters, map, profile, chart, reporting and temporary saves',async({page,context})=>{
 await visit(page,'/');await page.getByRole('link',{name:'Explore as a guest'}).click();await dismissTour(page);
 const search=page.getByRole('textbox',{name:'What kind of care are you looking for?',exact:true});await search.fill('Brightwel urgent car');await expect(page.locator('.clinic-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Map',exact:true}).click();await expect(page.locator('.map-side-list')).toContainText('Brightwell');
 await page.getByRole('button',{name:'List',exact:true}).click();await page.getByRole('link',{name:'View clinic',exact:true}).click();await expect(page.getByRole('heading',{name:'Brightwell Urgent Care',exact:true})).toBeVisible();
 await expect(page.locator('.history-chart')).toBeVisible();await page.locator('.chart-controls').getByRole('button').last().click();await expect(page.locator('.provider-card').first()).toBeVisible();
 await page.getByRole('button',{name:'Save clinic',exact:true}).click();await page.getByRole('button',{name:'Plan this visit',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Save visit & calculate plan'}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.locator('.desktop-nav').getByRole('link',{name:'Appointments',exact:true}).click();await expect(page.locator('.appointment-list')).toContainText('Brightwell');
 await page.reload();await dismissTour(page);await expect(page.locator('.appointment-list')).toHaveCount(0);await expect(page.getByRole('heading',{name:'No visits are saved'})).toBeVisible();await expect(page.locator('.saved-clinic-grid')).toHaveCount(0);
 const tab=await context.newPage();await visit(tab,'/saved');await expect(tab.locator('.appointment-list')).toHaveCount(0);await tab.close();
 await visit(page,'/find?q=Brightwell');await page.getByRole('button',{name:'Report a Wait',exact:true}).click();await page.getByLabel('Minutes waiting so far').fill('27');await page.getByRole('button',{name:'Submit report',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('Report accepted');await page.getByRole('button',{name:'Back to Find Care'}).click();await visit(page,'/clinic/brightwell-urgent-care');await expect(page.locator('.report-feed')).toContainText('27');
});

test('real signup, private settings, second device persistence and multi-tab logout',async({page,browser,context})=>{
 const email=`browser-${Date.now()}@example.test`;await signup(page,email);
 await visit(page,'/clinic/brightwell-urgent-care');await page.getByRole('button',{name:'Save clinic',exact:true}).click();
 await page.getByRole('button',{name:'Plan this visit',exact:true}).click();await page.getByRole('button',{name:'Save visit & calculate plan'}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
 await visit(page,'/settings');await expect(page.getByLabel('Weight (lb)',{exact:true})).toHaveValue('');await page.getByLabel('Weight (lb)',{exact:true}).selectOption('154');await page.getByRole('button',{name:'Save settings',exact:true}).click();await expect(page.getByText('Settings saved.',{exact:true})).toBeVisible();await page.reload();await expect(page.getByLabel('Weight (lb)',{exact:true})).toHaveValue('154');
 const second=await browser.newContext();const device=await second.newPage();await login(device,email);await visit(device,'/saved');await expect(device.locator('.saved-clinic-grid')).toContainText('Brightwell');await expect(device.locator('.appointment-list')).toContainText('Brightwell');
 const sibling=await context.newPage();await visit(sibling,'/settings');await expect(sibling.getByLabel('Weight (lb)',{exact:true})).toHaveValue('154');await logout(page);await expect(sibling.getByText('Sign in to manage your account.',{exact:true})).toBeVisible();await expect(sibling.getByLabel('Weight (lb)',{exact:true})).toHaveCount(0);
 await login(page,email);await visit(page,'/settings');await page.getByRole('button',{name:'Delete account',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('dialog').getByLabel('Current password',{exact:true}).fill(password);await page.getByLabel('Type DELETE').fill('DELETE');await page.getByRole('button',{name:'Permanently delete account',exact:true}).click();await expect(page).toHaveURL(/\/find/);await device.reload();await expect(device.getByRole('link',{name:'Log in / Sign up'})).toBeVisible();await second.close();
});

test('seven languages keep clinic filters independent and Arabic RTL',async({page})=>{
 await visit(page);const language=page.locator('.language-control select');
 const expected:{[key:string]:string}={"es": "Encuentra atenci\u00f3n que se adapte a tu horario", "zh": "\u5bfb\u627e\u9002\u5408\u60a8\u65f6\u95f4\u5b89\u6392\u7684\u533b\u7597\u670d\u52a1", "ar": "\u0627\u0639\u062b\u0631 \u0639\u0644\u0649 \u0631\u0639\u0627\u064a\u0629 \u062a\u0646\u0627\u0633\u0628 \u0648\u0642\u062a\u0643", "pl": "Znajd\u017a opiek\u0119 dopasowan\u0105 do Twojego planu dnia", "gu": "\u0aa4\u0aae\u0abe\u0ab0\u0abe \u0ab8\u0aae\u0aaf\u0aaa\u0aa4\u0acd\u0ab0\u0a95\u0aa8\u0ac7 \u0a85\u0aa8\u0ac1\u0ab0\u0ac2\u0aaa \u0ab8\u0a82\u0aad\u0abe\u0ab3 \u0ab6\u0acb\u0aa7\u0acb", "hi": "\u0905\u092a\u0928\u0947 \u0938\u092e\u092f \u0915\u0947 \u0905\u0928\u0941\u0915\u0942\u0932 \u0926\u0947\u0916\u092d\u093e\u0932 \u0916\u094b\u091c\u0947\u0902", "en": "Find care that fits your schedule"};
 for(const code of ['en','es','zh','ar','pl','gu','hi']){await language.selectOption(code);await expect(page.locator('html')).toHaveAttribute('lang',code);await expect(page.locator('html')).toHaveAttribute('dir',code==='ar'?'rtl':'ltr');await expect(page.locator('.find-hero h1')).toHaveText(expected[code]);await expect(page.locator('.clinic-card')).toHaveCount(6);}
 await language.selectOption('pl');await page.locator('.quick-filters button').nth(3).click();await expect(page.locator('.clinic-card')).toHaveCount(1);await expect(page.locator('.filter-panel select').nth(2)).toHaveValue('Pediatrics');
 await language.selectOption('en');await page.getByRole('button',{name:'Clear all',exact:true}).click();
 for(const spoken of ['Polish','Gujarati','Hindi']){await page.locator('.filter-panel select').nth(3).selectOption(spoken);await expect(page.locator('.clinic-card').first()).toBeVisible();await expect(page.locator('.clinic-card')).not.toHaveCount(6);}
 await page.reload();await dismissTour(page);await expect(language).toHaveValue('en');
 await page.evaluate(()=>{localStorage.setItem('mediq-saved-clinics','["brightwell-urgent-care"]');localStorage.setItem('unrelated-key','keep');});await visit(page,'/saved');await expect(page.locator('.saved-clinic-grid')).toHaveCount(0);expect(await page.evaluate(()=>localStorage.getItem('unrelated-key'))).toBe('keep');
});

test('search intent, explicit sorts, stale responses and genuine error retry',async({page})=>{
 await visit(page);const search=page.getByRole('textbox',{name:'What kind of care are you looking for?',exact:true});
 await search.fill('head pain');await expect(page.locator('.clinic-card')).toHaveCount(2);
 await page.getByLabel('Sort results').selectOption('shortest');const durations=await page.locator('.clinic-card .estimate-number').allTextContents();expect(durations).toHaveLength(2);expect(durations.map(s=>parseInt(s))).toEqual(durations.map(s=>parseInt(s)).sort((a,b)=>a-b));
 await search.fill('unsupported xzqv');await expect(page.getByText('No clinics match everything yet',{exact:true})).toBeVisible();
 let delayed=false;await page.route('**/api/clinics?**',async route=>{if(decodeURIComponent(route.request().url()).includes('Brightwell')){delayed=true;await new Promise(r=>setTimeout(r,500));}await route.continue();});
 await search.fill('Brightwell');await expect.poll(()=>delayed).toBe(true);await search.fill('Juniper');await expect(page.locator('.clinic-card')).toHaveCount(1);await expect(page.locator('.clinic-card')).toContainText('Juniper');await page.waitForTimeout(650);await expect(page.locator('.clinic-card')).toContainText('Juniper');
 await page.unroute('**/api/clinics?**');await page.route('**/api/clinics?**',route=>route.fulfill({status:503,contentType:'application/json',body:'{"code":"SERVICE_UNAVAILABLE"}'}));await search.fill('fever');await expect(page.getByRole('button',{name:'Try again',exact:true})).toBeVisible();await page.unroute('**/api/clinics?**');await page.getByRole('button',{name:'Try again',exact:true}).click();await expect(page.locator('.clinic-card')).toHaveCount(2);
});

test('admin denied to normal accounts; trusted bootstrap enables directory, metrics and persistent checklist',async({page})=>{
 const email=`admin-${Date.now()}@example.test`;await signup(page,email);await visit(page,'/admin');await expect(page.getByRole('heading',{name:'Access restricted'})).toBeVisible();expect((await page.request.get('/api/admin/accounts')).status()).toBe(403);
 const db=new DatabaseSync('.data/e2e/mediq.sqlite');const user=db.prepare('SELECT id FROM user WHERE email=?').get(email)!;db.prepare('INSERT INTO administrators VALUES (?,?)').run(user.id,Date.now());db.close();
 await page.reload();await expect(page.locator('.admin-tabs')).toBeVisible();await page.getByRole('button',{name:'Accounts',exact:true}).click();await page.getByLabel('Search accounts').fill(email);await expect(page.locator('tbody')).toContainText(email);await expect(page.locator('tbody')).not.toContainText(password);
 await page.getByRole('button',{name:'Launch checklist',exact:true}).click();const task=page.locator('form').filter({has:page.getByRole('heading',{name:'Verify the email sender',exact:true})});await task.getByLabel('Status').selectOption('doing');await task.getByLabel('Notes').fill('Browser verified persistent change');await task.getByRole('button',{name:'Save changes'}).click();await page.reload();await page.getByRole('button',{name:'Launch checklist',exact:true}).click();
 await expect(page.locator('textarea').filter({hasText:'Browser verified persistent change'})).toHaveCount(1);
});

test('direct routes, responsive layout, translated forms, keyboard and dialog focus',async({page})=>{
 for(const path of ['/find','/saved','/report','/know','/contact','/login','/signup','/verify','/reset-password','/settings','/clinic/brightwell-urgent-care','/clinic/missing','/not-found']){await visit(page,path);await expect(page.locator('main')).toBeVisible();await expect(page.locator('h1')).toBeVisible();}
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});await visit(page,'/find');await expect(page.locator('.clinic-card').first()).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await visit(page,'/signup');await page.locator('.language-control select').selectOption('gu');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await expect(page.locator('h1')).toHaveText('મફત ખાતું બનાવો');await page.screenshot({path:`test-results/signup-${width}.png`,fullPage:true});}
 await page.setViewportSize({width:390,height:844});await visit(page,'/clinic/brightwell-urgent-care');const opener=page.getByRole('button',{name:'Plan this visit',exact:true});await opener.click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement?.closest('dialog')!==null)).toBe(true);await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(opener).toBeFocused();
});

test('delayed account refresh cannot undo a save or restore private data after logout; account switching stays isolated',async({page})=>{
 const email=`race-${Date.now()}@example.test`;await signup(page,email);
 await visit(page,'/clinic/brightwell-urgent-care');
 let release:(()=>void)|undefined;let captured=false;
 await page.route('**/api/me',async route=>{if(captured){await route.continue();return;}captured=true;const response=await route.fetch();await new Promise<void>(resolve=>{release=resolve;});await route.fulfill({response});});
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await expect.poll(()=>!!release).toBe(true);
 await page.getByRole('button',{name:'Save clinic',exact:true}).click();await expect(page.getByRole('button',{name:'Saved',exact:true})).toBeVisible();release!();await page.waitForTimeout(150);await expect(page.getByRole('button',{name:'Saved',exact:true})).toBeVisible();
 await page.unroute('**/api/me');captured=false;release=undefined;
 await page.route('**/api/me',async route=>{if(captured){await route.continue();return;}captured=true;const response=await route.fetch();await new Promise<void>(resolve=>{release=resolve;});await route.fulfill({response});});
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await expect.poll(()=>!!release).toBe(true);await logout(page);await expect(page.getByRole('link',{name:'Log in / Sign up'})).toBeVisible();release!();await page.waitForTimeout(150);await expect(page.getByRole('button',{name:'Save clinic',exact:true})).toBeVisible();await page.unroute('**/api/me');
 clearTestLimits();await signup(page,`other-${Date.now()}@example.test`);await visit(page,'/saved');await expect(page.locator('.saved-clinic-grid')).toHaveCount(0);await expect(page.locator('.appointment-list')).toHaveCount(0);
 await logout(page);await login(page,email);await visit(page,'/saved');await expect(page.locator('.saved-clinic-grid')).toContainText('Brightwell');
});
