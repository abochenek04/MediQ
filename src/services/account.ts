import type { SavedAppointment } from '../types';
export interface AccountUser {id:string;email:string;firstName:string;lastName:string;createdAt:string;}
export interface PrivateProfile {sex:'female'|'male'|'intersex'|null;weightKg:number|null;heightCm:number|null;age:number|null;language:string;notifications:boolean;}
export interface AccountState {user:AccountUser|null;admin:boolean;tourState?:'pending'|'started'|'complete';profile?:PrivateProfile;savedClinicIds?:string[];savedAppointments?:SavedAppointment[];}
