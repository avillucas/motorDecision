import * as readline from 'readline';
import { DecisionEngine } from "./src/domain/DecisionEngine";
import { cfp412Mockup } from "./src/data/cfp412Mockup";
import { CsvLeadRepository } from "./src/data/CsvLeadRepository";
import { SessionLeadManager } from "./src/application/SessionLeadManager";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const engine = new DecisionEngine(cfp412Mockup, "MSG_INICIAL");

// Instanciamos el repositorio y el manejador de la sesión
const leadRepo = new CsvLeadRepository();
const leadManager = new SessionLeadManager(leadRepo);
const sessionId = "sesion_mockup_123"; // ID simulado para esta terminal

console.log("\n=============================================");
console.log("=== SIMULADOR DE CHATBOT - CFP 412       ===");
console.log("=============================================\n");
console.log("Escribe 'salir' en cualquier momento para terminar.\n");

function printBot(text: string) {
  console.log(`\n🤖 Bot:\n${text}\n`);
}

async function promptUser() {
  rl.question('👤 Tú: ', async (answer) => {
    if (answer.toLowerCase().trim() === 'salir') {
      console.log("\n[Sistema: Guardando datos recolectados (Lead) antes de salir...]");
      await leadManager.finalizeSession(sessionId);
      console.log("\n¡Hasta luego! 👋\n");
      rl.close();
      return;
    }

    const { nextNode, extractedData, error } = engine.processAnswer(answer.trim());
    
    if (nextNode) {
      if (extractedData) {
        console.log(`\n✅ [Sistema: Dato extraído: { clave: '${extractedData.key}', valor: '${extractedData.value}' }]`);
        // Guardamos el dato temporalmente en el manejador
        leadManager.addData(sessionId, extractedData.key, extractedData.value);
      }
      
      if (nextNode.extractData) {
        console.log(`\n[Sistema: Dato extraído esperado en el próximo paso -> '${nextNode.extractData}']`);
      }
      printBot(nextNode.text);

      // Si el próximo nodo es un cierre natural, guardamos el lead.
      if (nextNode.id.includes("FIN") || nextNode.id.includes("CIERRE")) {
         console.log("\n[Sistema: Fin de flujo detectado. Guardando el Lead...]");
         await leadManager.finalizeSession(sessionId);
      }
    } else {
      console.log(`\n❌ [Sistema: Error - ${error}]`);
      printBot(engine.getCurrentNode().text);
    }

    promptUser();
  });
}

// Inicia la conversación
const currentNode = engine.getCurrentNode();
if (currentNode.extractData) {
  console.log(`[Sistema: Dato extraído esperado en el próximo paso -> '${currentNode.extractData}']`);
}
printBot(currentNode.text);

promptUser();
