export const PENDING_MARK = "[POR COMPLETAR]";

export function isPending(value: string): boolean {
  return value.trim() === "" || value.includes(PENDING_MARK);
}

export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
