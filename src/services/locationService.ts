import type { SearchOrigin } from '../types';

// Permission is requested only when the user invokes Use my location.
// This adapter never stores or returns precise coordinates and never contacts a map API.
export const requestApproximateLocation = (geolocation: Geolocation | undefined): Promise<SearchOrigin> =>
  new Promise((resolve, reject) => {
    if (!geolocation) { reject(new Error('Location unavailable')); return; }
    geolocation.getCurrentPosition(
      position => resolve({ latitude: Math.round(position.coords.latitude * 100) / 100, longitude: Math.round(position.coords.longitude * 100) / 100 }),
      reject,
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });
