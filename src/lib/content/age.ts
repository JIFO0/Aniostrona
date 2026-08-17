export function ageFromBirth(birthYear: number, birthMonth: number, now = new Date()): number {
  let age = now.getFullYear() - birthYear;
  if (now.getMonth() + 1 < birthMonth) age -= 1;
  return age;
}
