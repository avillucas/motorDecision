import { WhatsAppAdapter } from "./infrastructure/WhatsAppAdapter";
import { ConsoleAdapter } from "./infrastructure/ConsoleAdapter";
import { JsonFlowAdapter } from "./infrastructure/JsonFlowAdapter";
import { CsvLeadRepository } from "./data/CsvLeadRepository";
import { LeadRepository } from "./domain/LeadRepository";
import * as path from 'path';

// 1. Configuración desde Variables de Entorno (o valores por defecto)
const interfaceType = process.env.INTERFACE_TYPE || 'console'; // 'whatsapp' | 'console'
const flowFilePath = process.env.FLOW_FILE_PATH || path.join(__dirname, 'data', 'flow_cfp412.json');
const repoType = process.env.LEAD_REPO_TYPE || 'csv';          // 'csv'

console.log("\n=============================================");
console.log("=== INICIANDO MOTOR DE DECISIÓN           ===");
console.log("=============================================\n");
console.log(`[Config] Interfaz    : ${interfaceType}`);
console.log(`[Config] Archivo Flow: ${flowFilePath}`);
console.log(`[Config] Repositorio : ${repoType}\n`);

// 2. Instanciación de Dependencias Core
// a. Repositorio
let leadRepo: LeadRepository;
if (repoType === 'csv') {
  leadRepo = new CsvLeadRepository();
} else {
  // Aquí se podrían agregar casos para MySQL, MongoDB, Redis, etc.
  console.warn(`[!] Repositorio '${repoType}' no soportado nativamente. Cayendo a 'csv'.`);
  leadRepo = new CsvLeadRepository();
}

// b. Proveedor de Flujo
const flowProvider = new JsonFlowAdapter(flowFilePath, "MSG_INICIAL");

// 3. Selección y Arranque del Adaptador Principal
if (interfaceType === 'whatsapp') {
  const adapter = new WhatsAppAdapter(flowProvider, leadRepo);
  adapter.start().catch(err => {
      console.error("Error crítico al iniciar el bot de WhatsApp:", err);
  });
} else if (interfaceType === 'console') {
  const adapter = new ConsoleAdapter(flowProvider, leadRepo);
  adapter.start();
} else {
  console.error(`[Error] Tipo de interfaz desconocida: ${interfaceType}`);
  process.exit(1);
}
