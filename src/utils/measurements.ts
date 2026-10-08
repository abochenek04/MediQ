// Existing kg/cm are canonical and are preserved exactly until a user changes a selection.
export const poundsToKg=(pounds:number)=>pounds*0.45359237;
export const kgToPounds=(kg:number)=>kg/0.45359237;
export const inchesToCm=(inches:number)=>inches*2.54;
export const cmToInches=(cm:number)=>cm/2.54;
