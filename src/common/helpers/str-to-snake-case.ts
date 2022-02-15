export function strToSnakeCase(str: string): string {
  return str.split(' ').map(str=> str.toLowerCase()).join('_');
}
