import { DecisionEngine, DecisionNode } from "./src/domain/DecisionEngine";

const mockupData: DecisionNode[] = [
  {
    id: "start",
    text: "Hola! Soy tu asistente virtual. ¿Sobre qué necesitas información?\n1) Horarios\n2) Ubicación",
    options: [
      { match: "1", nextId: "horarios" },
      { match: "2", nextId: "ubicacion" },
      { match: "*", nextId: "invalido" }
    ]
  },
  {
    id: "horarios",
    text: "Nuestros horarios de atención son de Lunes a Viernes de 9:00 AM a 6:00 PM.",
    options: [
      { match: "*", nextId: "start" }
    ]
  },
  {
    id: "ubicacion",
    text: "Nos encontramos en la Avenida Principal 1234, Ciudad Central.",
    options: [
      { match: "*", nextId: "start" }
    ]
  },
  {
    id: "invalido",
    text: "Disculpa, no entendí tu respuesta. Por favor responde con '1' o '2'.",
    options: [
      { match: "1", nextId: "horarios" },
      { match: "2", nextId: "ubicacion" },
      { match: "*", nextId: "invalido" }
    ]
  }
];

// Inicializar la carga de los mensajes en relación a los contenidos
const engine = new DecisionEngine(mockupData, "start");

console.log("=== INICIO DE LA SIMULACIÓN ===\n");

function printBot(text: string) {
  console.log(`🤖 Bot: ${text}`);
}

function sendUserReply(reply: string) {
  console.log(`👤 Usuario: ${reply}`);
  const nextNode = engine.processAnswer(reply);
  if (nextNode) {
    printBot(nextNode.text);
  }
}

// 1. Muestra el mensaje inicial
printBot(engine.getCurrentNode().text);

// 2. El usuario envía algo inválido
sendUserReply("Quiero hablar con un humano");

// 3. El usuario elige la opción 1 (Horarios)
sendUserReply("1");

// 4. El usuario envía cualquier cosa para volver al inicio
sendUserReply("Gracias");

console.log("\n=== FIN DE LA SIMULACIÓN ===");
