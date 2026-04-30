declare module "@bangladeshi/bangladesh-address" {
  export function allDistricts(): string[];
  export function upazilaNamesOf(district: string): string[];
  export function thanaNamesOf(district: string): string[];
}

declare module "@bangladeshi/bangladesh-address/build/src/index.js" {
  export function allDistricts(): string[];
  export function upazilaNamesOf(district: string): string[];
  export function thanaNamesOf(district: string): string[];
}
