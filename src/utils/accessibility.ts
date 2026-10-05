import { accessibilityKeys, type ClinicAccessibility } from '../types';
export const accessibilityLabels = {
 wheelchair: 'Wheelchair accessibility', parking: 'Accessible parking', elevator: 'Elevator',
 restroom: 'Accessible restroom', asl: 'ASL interpretation', languageServices: 'Language services', sensoryFriendly: 'Sensory-friendly options',
} as const;
export const unknownAccessibility = (): ClinicAccessibility => Object.fromEntries(accessibilityKeys.map(key => [key, 'unknown'])) as ClinicAccessibility;
// Deliberately fictional attributes: never reuse these as real clinic evidence.
export const demoAccessibility = (index: number): ClinicAccessibility => Object.fromEntries(accessibilityKeys.map((key, column) => [key, ['available', 'unavailable', 'unknown'][(index + column) % 3]])) as ClinicAccessibility;
