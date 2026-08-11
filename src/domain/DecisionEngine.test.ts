import { DecisionEngine } from './DecisionEngine';

describe('DecisionEngine', () => {
  const nodes = [
    {
      id: 'start',
      text: 'What kind of issue are you facing?',
      options: [
        { match: 'technical', nextId: 'tech_support' },
        { match: 'billing', nextId: 'billing_support' },
      ],
    },
    {
      id: 'tech_support',
      text: 'Have you tried turning it off and on again?',
      options: [
        { match: 'yes', nextId: 'tech_escalate' },
        { match: 'no', nextId: 'tech_restart' },
      ],
    },
    {
      id: 'billing_support',
      text: 'Please provide your invoice number.',
      options: [
        { match: '*', nextId: 'billing_escalate' }, // catch all
      ],
    },
    {
      id: 'tech_restart',
      text: 'Please restart your device and try again.',
      options: [],
    },
    {
      id: 'billing_escalate',
      text: 'We are escalating your billing issue.',
      options: [],
    }
  ];

  it('should initialize and return the first node', () => {
    const engine = new DecisionEngine(nodes, 'start');
    const currentNode = engine.getCurrentNode();
    expect(currentNode.id).toBe('start');
    expect(currentNode.text).toBe('What kind of issue are you facing?');
  });

  it('should transition to the next node based on exact match', () => {
    const engine = new DecisionEngine(nodes, 'start');
    const nextNode = engine.processAnswer('technical');
    expect(nextNode).toBeDefined();
    expect(nextNode?.id).toBe('tech_support');
    expect(engine.getCurrentNode().id).toBe('tech_support');
  });

  it('should handle catch-all option', () => {
    const engine = new DecisionEngine(nodes, 'billing_support');
    const nextNode = engine.processAnswer('INV-12345');
    expect(nextNode?.id).toBe('billing_escalate');
  });

  it('should return null or throw if invalid answer and no catch-all', () => {
    const engine = new DecisionEngine(nodes, 'start');
    const nextNode = engine.processAnswer('sales');
    expect(nextNode).toBeNull(); // or handle differently, maybe stay on current
    expect(engine.getCurrentNode().id).toBe('start'); // state should not change
  });
});
