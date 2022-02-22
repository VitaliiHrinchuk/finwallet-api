export function dateToPgdate(date: Date) {
  return new Date(date).toISOString().replace('T',' ').replace('Z','');
}
