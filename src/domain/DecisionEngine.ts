export interface DecisionOption {
  match: string;
  nextId: string;
}

export interface DecisionNode {
  id: string;
  text: string;
  options: DecisionOption[];
  extractData?: string; // Nombre del campo a extraer de la respuesta del usuario (opcional)
}

export class DecisionEngine {
  private currentNodeId: string;
  private nodesMap: Map<string, DecisionNode>;

  constructor(nodes: DecisionNode[], initialState: string) {
    this.nodesMap = new Map(nodes.map(n => [n.id, n]));
    if (!this.nodesMap.has(initialState)) {
      throw new Error(`Initial state node '${initialState}' not found.`);
    }
    this.currentNodeId = initialState;
  }

  getCurrentNode(): DecisionNode {
    const node = this.nodesMap.get(this.currentNodeId);
    if (!node) {
      throw new Error(`Current node '${this.currentNodeId}' not found in configuration.`);
    }
    return node;
  }

  processAnswer(answer: string): DecisionNode | null {
    const currentNode = this.getCurrentNode();
    
    for (const option of currentNode.options) {
      if (option.match === '*' || option.match.toLowerCase() === answer.toLowerCase()) {
        const nextNode = this.nodesMap.get(option.nextId);
        if (nextNode) {
          this.currentNodeId = nextNode.id;
          return nextNode;
        }
      }
    }
    
    // No match found
    return null;
  }
}
