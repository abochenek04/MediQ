import { readdirSync,readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const environment=process.argv[2];
if(!['staging','production'].includes(environment))throw new Error('Choose staging or production');
for(const args of [['node_modules/typescript/bin/tsc','-b'],['node_modules/vite/bin/vite.js','build','--mode',environment]]){
 const result=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,VITE_DATA_MODE:'backend',VITE_APP_ENV:environment}});
 if(result.status!==0)process.exit(result.status||1);
}

const assets=readdirSync('dist/assets').filter(name=>name.endsWith('.js'));
const hasAdmin=assets.some(name=>name.startsWith('AdminPage-'));
assert.equal(hasAdmin,environment==='staging','Internal admin chunk must exist only in staging builds');
if(environment==='production')for(const name of assets){const js=readFileSync(`dist/assets/${name}`,'utf8');assert(!js.includes('/admin/accounts')&&!js.includes('/admin/checklist'),'Internal endpoint code leaked into public assets');}
console.log(`Verified ${environment} build isolation.`);
