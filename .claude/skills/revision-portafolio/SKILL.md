---
name: revision-portafolio
description: Revisa el portafolio al terminar una etapa. Úsala cuando el usuario pida revisar, auditar o cerrar una etapa del portafolio, o antes de hacer commit.
---

# Revisión del portafolio

Revisa solo los archivos modificados en la etapa actual (usa git status y git diff). Responde con una lista corta por categoría y no corrijas nada hasta que el usuario lo apruebe.

## Qué comprobar

1. Accesibilidad: navegación con teclado, foco visible, etiquetas y alt en las imágenes, contraste mínimo de 4.5:1 en texto.
2. Movimiento: toda animación respeta prefers-reduced-motion y nada parpadea rápido.
3. Textos: cada texto visible está en content/es.json y ninguno está escrito dentro de un componente.
4. Confidencialidad: no hay nombres de clientes, sistemas internos ni datos de trabajo. Lista aparte los textos marcados con [POR COMPLETAR].
5. Sitio estático: no hay server actions, rutas de API ni middleware.
6. Secretos: no hay claves, tokens ni archivos .env en el cambio.
7. Calidad: corre npm run lint y npm run build y reporta el resultado.

## Formato de la respuesta

- Una sección por categoría: escribe Cumple, o la lista de problemas con archivo y línea.
- Al final, un resumen de una línea: si la etapa está lista para commit o qué falta.
