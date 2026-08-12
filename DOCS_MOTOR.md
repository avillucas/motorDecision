# Estructura de Datos: Motor de Decisión

El motor de decisión (`DecisionEngine`) se alimenta de un arreglo de nodos (Array de objetos `DecisionNode`). Cada nodo representa un "estado" o "mensaje" del bot dentro de la conversación.

## Definición de Interfaces (TypeScript)

Para que el objeto sea válido, debe cumplir con las siguientes interfaces:

```typescript
// Define cada una de las opciones de respuesta válidas para un nodo.
export interface DecisionOption {
  // El texto exacto (o regex en el futuro) que el usuario debe enviar para activar esta opción.
  // Un asterisco "*" funciona como un "catch-all" (atrapa cualquier respuesta que no haya coincidido con otra).
  match: string;
  
  // El ID del siguiente nodo al cual saltar si el usuario selecciona esta opción.
  nextId: string;
}

// Representa un estado/mensaje dentro del flujo.
export interface DecisionNode {
  // Un identificador único para este nodo (ej: "MSG_INICIAL", "RESP_A").
  id: string;
  
  // El texto que el bot le enviará al usuario cuando llegue a este nodo.
  text: string;
  
  // Lista de opciones posibles que el usuario puede elegir.
  options: DecisionOption[];
  
  // (Opcional) Indica que la respuesta a este nodo debe guardarse. 
  // El valor asignado aquí será la 'clave' (key) devuelta por el motor.
  extractData?: string; 
}
```

---

## Ejemplo Práctico de Estructura

A continuación se muestra un ejemplo claro de cómo debe estructurarse este arreglo, utilizando un flujo en el que el bot solicita el nombre del usuario y luego el curso de su interés.

```typescript
import { DecisionNode } from "./src/domain/DecisionEngine";

export const miFlujoDeEjemplo: DecisionNode[] = [
  // 1. NODO INICIAL
  {
    id: "SALUDO_INICIAL",
    text: "¡Hola! Bienvenido. ¿Qué deseas hacer hoy?\n1. Ver cursos\n2. Inscribirme",
    options: [
      { match: "1", nextId: "VER_CURSOS" },
      { match: "2", nextId: "PEDIR_NOMBRE" },
      { match: "*", nextId: "SALUDO_INICIAL" } // Si responde algo inválido, repite este nodo
    ]
  },

  // 2. NODO SIMPLE (Solo muestra info)
  {
    id: "VER_CURSOS",
    text: "Nuestros cursos son: Mecánica, Informática y Plomería.",
    options: [
      { match: "*", nextId: "DESPEDIDA" } // Cualquier cosa que responda luego lo lleva a despedirse
    ]
  },

  // 3. NODO DE EXTRACCIÓN (Extrae el Nombre)
  {
    id: "PEDIR_NOMBRE",
    text: "Para inscribirte, por favor dime tu Nombre y Apellido:",
    // Al llegar a este nodo, lo próximo que el usuario responda se guardará bajo la clave 'NombreCompleto'
    extractData: "NombreCompleto",
    options: [
      { match: "*", nextId: "PEDIR_CURSO" } // Sea cual sea su nombre, avanza a pedir curso
    ]
  },

  // 4. NODO DE EXTRACCIÓN (Extrae el Curso)
  {
    id: "PEDIR_CURSO",
    text: "¡Gracias! Ahora dime qué curso quieres hacer:",
    // La respuesta del usuario se guardará bajo la clave 'CursoElegido'
    extractData: "CursoElegido",
    options: [
      { match: "*", nextId: "DESPEDIDA" } 
    ]
  },

  // 5. NODO FINAL
  {
    id: "DESPEDIDA",
    text: "¡Gracias por comunicarte! Si deseas volver a empezar, escribe 'MENU'.",
    options: [
      { match: "MENU", nextId: "SALUDO_INICIAL" },
      { match: "*", nextId: "DESPEDIDA" } // Se queda en este nodo hasta que diga "MENU"
    ]
  }
];
```

## Reglas y Buenas Prácticas
1. **Unicidad:** Cada `id` dentro del arreglo debe ser único.
2. **Nodo Inicial:** Al instanciar `DecisionEngine(nodos, "SALUDO_INICIAL")`, debes pasar el ID del nodo en el que quieres que inicie el flujo; ese ID **debe** existir en el arreglo.
3. **El comodín `*`:** Siempre es buena idea incluir una opción `{ match: "*", nextId: "OTRO_ID" }` al final de la lista de `options` para capturar cualquier respuesta inesperada (Fallback) y evitar errores.
4. **`extractData` actúa sobre la respuesta del usuario:** Cuando un nodo define `extractData`, le indica al motor: *"La respuesta que el usuario envíe a este nodo es importante, guárdala usando esta clave"*.
