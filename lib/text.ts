// Utilidades de texto sin dependencias: sirven en servidor y en cliente.

export const PENDING_MARK = "[POR COMPLETAR]";

/** Un valor de content/*.json está pendiente si está vacío o lleva la marca [POR COMPLETAR]. */
export function isPending(value: string): boolean {
  return value.trim() === "" || value.includes(PENDING_MARK);
}

/** Rellena plantillas del JSON: fillTemplate("Mostrando {count}", { count: 2 }) → "Mostrando 2". */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
