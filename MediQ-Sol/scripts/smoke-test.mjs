import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer as createViteServer } from 'vite';

const port = 43190;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['scripts/serve-dist.mjs'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'inherit', 'inherit'],
});

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

try {
  let ready = false;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(base);
      ready = response.ok;
      if (ready) break;
    } catch {
      // The server may still be starting.
    }
    await pause(100);
  }

  if (!ready) throw new Error('Preview server did not become ready.');

  const routes = ['/', '/find', '/clinic/brightwell-urgent-care', '/saved', '/report', '/know'];
  for (const route of routes) {
    const response = await fetch(`${base}${route}`);
    const body = await response.text();
    if (!response.ok || !body.includes('<div id="root"></div>')) {
      throw new Error(`SPA route failed: ${route} (${response.status})`);
    }
    process.stdout.write(`✓ ${route} refresh fallback\n`);
  }

  const index = await readFile('dist/index.html', 'utf8');
  const assets = [...index.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
  if (assets.length < 2) throw new Error('Built CSS/JavaScript assets were not found.');

  for (const asset of assets) {
    const response = await fetch(`${base}${asset}`);
    const bytes = await response.arrayBuffer();
    if (!response.ok || bytes.byteLength === 0) {
      throw new Error(`Built asset failed: ${asset}`);
    }
    process.stdout.write(`✓ ${asset} available\n`);
  }

  const dataSource = await readFile('src/data/mockData.ts', 'utf8');
  const requiredClinicIds = [
    'brightwell-urgent-care',
    'juniper-family-health',
    'little-oak-pediatrics',
    'solace-womens-health',
    'bull-city-community-clinic',
    'eno-quickcare',
  ];
  for (const clinicId of requiredClinicIds) {
    if (!dataSource.includes(`id: '${clinicId}'`)) throw new Error(`Missing clinic fixture: ${clinicId}`);
  }
  process.stdout.write('✓ six fictional clinic fixtures present\n');

  globalThis.window = {
    setTimeout,
    localStorage: { getItem: () => null },
  };
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });
  try {
    const { clinicService } = await vite.ssrLoadModule('/src/services/clinicService.ts');
    const baseFilters = {
      query: '', insurance: '', specialty: '', visitMode: 'all', timing: 'all', maxDistance: 25,
    };
    const filterChecks = [
      [{ ...baseFilters, insurance: 'Medicaid' }, 3, 'insurance'],
      [{ ...baseFilters, specialty: 'Pediatrics' }, 1, 'specialty'],
      [{ ...baseFilters, visitMode: 'walk-in' }, 5, 'visit mode'],
      [{ ...baseFilters, timing: 'open-now' }, 4, 'open now'],
      [{ ...baseFilters, maxDistance: 3 }, 2, 'distance'],
      [{ ...baseFilters, query: 'cardiology' }, 0, 'empty state'],
    ];
    for (const [filters, expected, label] of filterChecks) {
      const results = await clinicService.searchClinics(filters);
      if (results.length !== expected) {
        throw new Error(`${label} filter expected ${expected} results, received ${results.length}.`);
      }
    }
    process.stdout.write('✓ search filters and empty state data verified\n');
  } finally {
    await vite.close();
  }
  process.stdout.write('Smoke checks passed.\n');
} finally {
  server.kill('SIGTERM');
}
