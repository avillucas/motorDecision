# Motor de Decisión (WhatsApp Bot)

Este proyecto es un monorepo basado en TypeScript y npm workspaces que implementa un bot de WhatsApp modular y escalable. Utiliza **Clean Architecture** (Arquitectura Limpia) y principios de **Diseño Guiado por el Dominio (DDD)** para separar la lógica de negocio del flujo de conversación de las implementaciones tecnológicas (como WhatsApp o Redis).

## 🏗 Arquitectura del Proyecto

El proyecto está dividido en dos partes principales usando npm workspaces:

### 1. `packages/bot-flow` (Core / Dominio y Aplicación)
Este paquete contiene la lógica central del motor de decisión. Es agnóstico a la plataforma de mensajería y a la base de datos.
- **Dominio (`src/domain`)**: Define los tipos de datos (`UserSession`, `UserMessage`, etc.) y los puertos/interfaces (`SessionRepositoryInterface`, `MessageProviderInterface`) que deben ser implementados.
- **Aplicación (`src/application/flowMachine.ts`)**: Contiene la máquina de estados (`FlowMachine`) que maneja el flujo de la conversación, cambiando entre estados como `idle`, `awaiting_input` y `processing`.

### 2. `services/whatsapp-adapter` (Infraestructura / Adaptadores)
Este servicio es la capa de infraestructura que conecta el mundo real con el core del bot.
- Utiliza la librería `@adiwajshing/baileys` para conectarse a WhatsApp de forma independiente (sin navegador).
- Implementa los puertos definidos en `bot-flow`:
  - `RedisSessionRepository`: Guarda y recupera el estado de las sesiones en **Redis**.
  - `WhatsAppMessageProvider`: Envía los mensajes reales a través de WhatsApp.
  - `ConsoleEventDispatcher`: Despacha eventos del sistema.

## 🚀 Tecnologías Principales

- **TypeScript** & **Node.js**
- **npm Workspaces** (para la gestión del monorepo)
- **@adiwajshing/baileys** (Librería de WhatsApp Web)
- **Redis** & **ioredis** (Manejo de estado y sesiones de usuario)
- **Docker & Docker Compose** (Contenerización)

## 📁 Estructura del Repositorio

```text
motorDecision/
├── docker-compose.yml     # Configuración de servicios Docker (Redis y whatsapp-adapter)
├── package.json           # Configuración del monorepo
├── packages/
│   └── bot-flow/          # Lógica central del bot (estado y respuestas)
└── services/
    └── whatsapp-adapter/  # Conexión con Baileys (WhatsApp) y Redis
```

## 🛠 Cómo ejecutar el proyecto

### Prerrequisitos
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) instalados.
- Node.js (opcional si solo quieres usar Docker).

### Ejecutar con Docker
El proyecto ya cuenta con un entorno Dockerizado que levanta Redis y el adaptador de WhatsApp automáticamente.

1. Construye y levanta los contenedores:
   ```bash
   npm run docker:up
   ```
   *(O alternativamente: `docker compose up --build`)*

2. En la terminal verás que se imprime un **código QR**. Escanéalo desde la aplicación de WhatsApp en tu teléfono (Dispositivos Vinculados) para iniciar sesión.

3. Para detener los contenedores:
   ```bash
   npm run docker:down
   ```

### Scripts útiles (Desarrollo local)
Desde la raíz del proyecto, puedes usar:
- `npm run build`: Compila todos los paquetes del monorepo usando TypeScript.
- `npm run build:bot-flow`: Compila solo el paquete central del bot.
- `npm run build:whatsapp-adapter`: Compila solo el servicio del adaptador.

## 📝 Flujo de Conversación (Actual)
El `FlowMachine` actual implementa un flujo básico:
1. **Estado `idle`**: Cuando un usuario escribe por primera vez, el bot responde: *"Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?"* y pasa al estado `awaiting_input`.
2. **Estado `awaiting_input`**: Al recibir el siguiente mensaje, el bot acusa recibo y pasa al estado `processing`.
3. **Estado `processing`**: Avisa que la solicitud está siendo procesada y finaliza el flujo (`finished`).
