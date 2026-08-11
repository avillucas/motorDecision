import * as readline from 'readline';
import { DecisionEngine } from "./src/domain/DecisionEngine";
import { cfp412Mockup } from "./src/data/cfp412Mockup";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const engine = new DecisionEngine(cfp412Mockup, "MSG_INICIAL");

console.log("\n=============================================");
console.log("=== SIMULADOR DE CHATBOT - CFP 412       ===");
console.log("=============================================\n");
console.log("Escribe 'salir' en cualquier momento para terminar.\n");

function printBot(text: string) {
  console.log(`\n🤖 Bot:\n${text}\n`);
}

function promptUser() {
  rl.question('👤 Tú: ', (answer) => {
    if (answer.toLowerCase().trim() === 'salir') {
      console.log("\n¡Hasta luego! 👋\n");
      rl.close();
      return;
    }

    const nextNode = engine.processAnswer(answer.trim());
    if (nextNode) {
      if (nextNode.extractData) {
        console.log(`\n[Sistema: Dato extraído esperado en este paso -> '${nextNode.extractData}']`);
      }
      printBot(nextNode.text);
    } else {
      console.log(`\n[Sistema: No se encontró una ruta válida para '${answer}']`);
      // Vuelve a mostrar el mensaje actual para que intente de nuevo
      printBot(engine.getCurrentNode().text);
    }

    promptUser();
  });
}

// Inicia la conversación mostrando el primer mensaje
const currentNode = engine.getCurrentNode();
if (currentNode.extractData) {
  console.log(`[Sistema: Dato extraído esperado en este paso -> '${currentNode.extractData}']`);
}
printBot(currentNode.text);

promptUser();
