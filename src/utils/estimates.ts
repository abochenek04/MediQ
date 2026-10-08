import type {LiveWaitEstimate} from '../types';
export const hasEstimate=(value:LiveWaitEstimate)=>!value.provenance||value.evidenceState==='ready'||value.provenance.fictional;
