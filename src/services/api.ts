export const backendEnabled = import.meta.env.VITE_DATA_MODE === 'backend';
export const internalEnabled = import.meta.env.VITE_APP_ENV === 'staging' || import.meta.env.VITE_APP_ENV === 'development';
export class ApiError extends Error { constructor(public code:string,public status:number){super(code);} }
let expectedAccount:string|null=null;
export function setExpectedAccount(id:string|null){expectedAccount=id;}
export async function api<T>(path:string,method='GET',body?:unknown,headers:Record<string,string>={}):Promise<T> {
 const owner=expectedAccount;
 const response=await fetch(`/api${path}`,{method,credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json',...(owner?{'X-MediQ-Account':owner}:{}),...headers},...(method==='GET'?{}:{body:JSON.stringify(body||{})})});
 const data=await response.json().catch(()=>({code:'SERVICE_UNAVAILABLE'}));
 if(!response.ok){if((response.status===401||data.code==='ACCOUNT_CHANGED')&&!path.startsWith('/auth/'))window.dispatchEvent(new Event('mediq:session-expired'));throw new ApiError(data.code||'REQUEST_FAILED',response.status);}
 return data as T;
}
export const authRequest=<T=unknown>(path:string,body?:unknown)=>api<T>(`/auth${path}`,'POST',body);
export function announceAccountChange(){window.dispatchEvent(new Event('mediq:account-change'));try{const channel=new BroadcastChannel('mediq-account');channel.postMessage('changed');channel.close();localStorage.setItem('mediq-account-signal',crypto.randomUUID());localStorage.removeItem('mediq-account-signal');}catch{/* Focus/poll restoration remains available. */}}
export function errorKey(error:unknown){
 if(error instanceof ApiError){
  if(error.status===429)return 'Too many attempts. Wait a minute and try again.';
  if(['INVALID_EMAIL_OR_PASSWORD','INVALID_PASSWORD','AUTHENTICATION_FAILED'].includes(error.code))return 'Check your email and password, or reset your password.';
  if(error.code==='EMAIL_NOT_VERIFIED')return 'Verify your email before signing in.';
  if(['INVALID_OTP','OTP_EXPIRED','TOO_MANY_ATTEMPTS','INVALID_OTP_LENGTH'].includes(error.code))return 'The code is invalid or expired. Request a new code.';
  if(error.status===400)return 'Check the form and try again.';
  if(error.status===403)return 'You do not have access to this page.';
 }
 return 'The service is unavailable. Please try again.';
}
