import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { DB } from './database.ts';
export class HttpError extends Error { constructor(public status:number,public code:string){super(code);} }
export const hash=(secret:string,value:string)=>createHmac('sha256',secret).update(value).digest('hex');
export function limit(db:DB,key:string,max:number,windowMs:number,now=Date.now()) {
 const result=db.prepare('INSERT INTO rate_limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN resets_at<=? THEN 1 ELSE count+1 END,resets_at=CASE WHEN resets_at<=? THEN excluded.resets_at ELSE resets_at END RETURNING count').get(key,now+windowMs,now,now) as {count:number};
 if(result.count>max)throw new HttpError(429,'RATE_LIMITED');
}
export function anonymousIdentity(cookie:string,secret:string) {
 const raw=cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith('mediq-anon='))?.slice(11)||'';
 const [id,signature]=raw.split('.');
 const expected=hash(secret,id||'');
 const valid=id&&/^[\da-f-]{36}$/.test(id)&&signature?.length===64&&timingSafeEqual(Buffer.from(signature),Buffer.from(expected));
 const next=valid?id:randomUUID();
 return {id:next,cookie:valid?undefined:`mediq-anon=${next}.${hash(secret,next)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`};
}
