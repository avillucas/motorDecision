import { DecisionEngine } from "./DecisionEngine";
import { cfp412Mockup } from "../data/cfp412Mockup";

describe("CFP 412 Decision Engine Flow", () => {
  let engine: DecisionEngine;

  beforeEach(() => {
    engine = new DecisionEngine(cfp412Mockup, "MSG_INICIAL");
  });

  it("should initialize at MSG_INICIAL", () => {
    const node = engine.getCurrentNode();
    expect(node.id).toBe("MSG_INICIAL");
    expect(node.extractData).toBe("Opcion_Elegida");
  });

  it("should flow to RESP_A and then MSG_CIERRE when selecting A", () => {
    const nodeA = engine.processAnswer("A");
    expect(nodeA?.id).toBe("RESP_A");

    // Any answer goes to MSG_CIERRE
    const nodeCierre = engine.processAnswer("Gracias");
    expect(nodeCierre?.id).toBe("MSG_CIERRE");
    expect(nodeCierre?.extractData).toBe("Accion_Reinicio");
  });

  it("should flow to RESP_B and then MSG_CIERRE when selecting B", () => {
    const nodeB = engine.processAnswer("B");
    expect(nodeB?.id).toBe("RESP_B");

    const nodeCierre = engine.processAnswer("OK");
    expect(nodeCierre?.id).toBe("MSG_CIERRE");
  });

  it("should complete the C flow (Lista de espera)", () => {
    const nodeC1 = engine.processAnswer("C");
    expect(nodeC1?.id).toBe("RESP_C_1");
    expect(nodeC1?.extractData).toBe("Nombre_y_Apellido");

    const nodeC2 = engine.processAnswer("Juan Perez");
    expect(nodeC2?.id).toBe("RESP_C_2");
    expect(nodeC2?.extractData).toBe("Telefono_WhatsApp_Email");

    const nodeC3 = engine.processAnswer("juan@email.com");
    expect(nodeC3?.id).toBe("RESP_C_3");
    expect(nodeC3?.extractData).toBe("Curso_Interes");

    const nodeCFin = engine.processAnswer("Mecánica");
    expect(nodeCFin?.id).toBe("RESP_C_FIN");

    const nodeCierre = engine.processAnswer("Gracias");
    expect(nodeCierre?.id).toBe("MSG_CIERRE");
  });

  it("should flow to RESP_D and then MSG_CIERRE when selecting D", () => {
    const nodeD = engine.processAnswer("D");
    expect(nodeD?.id).toBe("RESP_D");

    const nodeCierre = engine.processAnswer("Gracias");
    expect(nodeCierre?.id).toBe("MSG_CIERRE");
  });

  it("should flow to RESP_E and then MSG_CIERRE when selecting E", () => {
    const nodeE = engine.processAnswer("E");
    expect(nodeE?.id).toBe("RESP_E");

    const nodeCierre = engine.processAnswer("Gracias");
    expect(nodeCierre?.id).toBe("MSG_CIERRE");
  });

  it("should flow to RESP_F and then MSG_CIERRE when selecting F", () => {
    const nodeF = engine.processAnswer("F");
    expect(nodeF?.id).toBe("RESP_F");

    const nodeCierre = engine.processAnswer("Gracias");
    expect(nodeCierre?.id).toBe("MSG_CIERRE");
  });

  it("should complete the G flow (Consulta Personalizada)", () => {
    const nodeG1 = engine.processAnswer("G");
    expect(nodeG1?.id).toBe("RESP_G_1");
    expect(nodeG1?.extractData).toBe("Nombre_y_Apellido");

    const nodeG2 = engine.processAnswer("Maria Gomez");
    expect(nodeG2?.id).toBe("RESP_G_2");
    expect(nodeG2?.extractData).toBe("Telefono_WhatsApp_Email");

    const nodeG3 = engine.processAnswer("1123456789");
    expect(nodeG3?.id).toBe("RESP_G_3");
    expect(nodeG3?.extractData).toBe("Consulta_Personalizada");

    const nodeGFin = engine.processAnswer("Quería saber si hay vacantes en plomería");
    expect(nodeGFin?.id).toBe("RESP_G_FIN");

    const nodeCierre = engine.processAnswer("OK");
    expect(nodeCierre?.id).toBe("MSG_CIERRE");
  });

  it("should loop back to MSG_INICIAL from MSG_CIERRE when typing 'VER MENU'", () => {
    engine.processAnswer("A");
    engine.processAnswer("ok");
    // now we are at MSG_CIERRE
    expect(engine.getCurrentNode().id).toBe("MSG_CIERRE");

    const nodeInit = engine.processAnswer("VER MENU");
    expect(nodeInit?.id).toBe("MSG_INICIAL");
  });

  it("should stay at MSG_CIERRE when typing anything else", () => {
    engine.processAnswer("A");
    engine.processAnswer("ok");
    
    const nodeCierre2 = engine.processAnswer("Hola de nuevo");
    expect(nodeCierre2?.id).toBe("MSG_CIERRE");
  });

  it("should handle lowercase options like 'a' for flow A", () => {
    const nodeA = engine.processAnswer("a");
    expect(nodeA?.id).toBe("RESP_A");
  });

  it("should handle lowercase 'ver menu'", () => {
    engine.processAnswer("a");
    engine.processAnswer("ok");
    
    const nodeInit = engine.processAnswer("ver menu");
    expect(nodeInit?.id).toBe("MSG_INICIAL");
  });
});
