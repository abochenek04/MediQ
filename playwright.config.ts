import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'tests/browser',fullyParallel:false,workers:1,timeout:45000,expect:{timeout:10000},
 reporter:[['list'],['html',{open:'never'}]],use:{baseURL:'http://localhost:4173',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:[
  {command:'node --import tsx scripts/e2e-server.ts',url:'http://127.0.0.1:3001/api/health',reuseExistingServer:false,timeout:30000},
  {command:'npm run dev -- --host localhost --strictPort',url:'http://localhost:4173',reuseExistingServer:false,env:{VITE_DATA_MODE:'backend',VITE_APP_ENV:'staging'},timeout:30000},
 ],
});
