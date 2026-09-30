import type { Clinic } from '../src/types.ts';
// Server-only registry. Only approved adapters can be installed; never accept a URL/key from a browser.
export type IntegrationResult<T> = {status:'available';source:string;data:T}|{status:'unavailable';reason:string};
export interface ExternalAdapters {
 directory?: {refresh():Promise<IntegrationResult<Clinic[]>>};
 ratings?: {get(clinicId:string):Promise<IntegrationResult<{rating:number;reviewCount:number}>>};
 travel?: {get(clinicId:string):Promise<IntegrationResult<{minutes:number}>>};
 booking?: {availability(clinicId:string):Promise<IntegrationResult<{start:string}[]>>};
 notifications?: {send(userId:string,message:string):Promise<void>};
}
export const unavailable=():IntegrationResult<never>=>({status:'unavailable',reason:'INTEGRATION_UNAVAILABLE'});
export const adapters:ExternalAdapters={};
// Explicit consent plus configured delivery is required. No success is claimed otherwise.
export async function notifyWithConsent(userId:string,consented:boolean,message:string,registry=adapters) {
 if(!consented||!registry.notifications)return unavailable();
 await registry.notifications.send(userId,message);return {status:'available' as const,source:'configured notification provider',data:true};
}
