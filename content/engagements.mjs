import { pricing } from './pricing.mjs';

export const workingTogether = {
  route: '/working-together/',
  title: 'Working together',
  description: 'Choose a useful starting point for AI product and engineering work. See the decisions, deliverables, client inputs, and boundaries of an EML Systems engagement.',
  headline: 'Your next decision.',
  emphasis: 'A useful way forward.',
  intro: 'You may be deciding where to invest, know exactly what needs building, or have a system that needs a clearer diagnosis. Start with that situation. We agree on the question, the work, and a result your team can use.',
  journeys: [
    {
      id: 'choose-an-investment',
      label: 'FIND THE DIRECTION',
      title: 'Choose the next investment.',
      summary: 'Connect a promising AI idea to a problem worth solving and the evidence needed to commit.',
      question: 'What should we pursue, and what would change our mind?',
      motivation: 'Several ideas may look plausible while capacity is limited. You need to understand the complete job, compare meaningful alternatives, and identify the assumption that could make an investment worthwhile—or unnecessary.',
      work: 'We examine representative work, map the constraints and alternatives, and design the smallest investigation that can improve the investment decision. Where a prototype is useful, its learning objective comes first.',
      inputs: 'A product or workflow owner, examples of current work, available observations, and the constraints on investment. Customer or domain input matters when the proposal depends on how people actually work.',
      outputs: ['A concise decision memo connecting the problem, alternatives, evidence, and remaining uncertainty.', 'A ranked set of assumptions and a bounded experiment or implementation recommendation.'],
      boundary: 'The assessment addresses an agreed investment question. A production build, broad organizational audit, and unexamined roadmap commitments require their own scope.',
      completion: 'Your team can explain the proposed next step, why it is justified, what could invalidate it, and who owns the decision.',
      next: 'Continue with a bounded experiment, undertake the next step internally, change direction, or stop. Further consulting is useful only when it adds something the next decision needs.',
      problemIds: ['what-to-build'],
      exampleSlugs: ['choosing-an-ai-investment'],
      enquiry: 'Choose the next investment'
    },
    {
      id: 'build-a-defined-change',
      label: 'MAKE THE CHANGE',
      title: 'Build a defined change.',
      summary: 'Turn a sufficiently clear need into working software, useful evidence, and a maintainable handoff.',
      question: 'Can we deliver this with clear acceptance and ownership?',
      motivation: 'The intervention may already be clear: an application, a retrieval path, an evaluation capability, an integration, or a change to the engineering workflow. You need someone who can connect the design to implementation and work alongside the people who will maintain it.',
      work: 'We agree on supported behavior and acceptance criteria, inspect the relevant constraints, and implement in reviewable increments. Demonstrations and evaluation findings inform changes to scope as the system becomes better understood.',
      inputs: 'A decision owner and accountable maintainer, access to the relevant environment, representative inputs, domain review, and time for acceptance and handoff. Access and deployment responsibilities are agreed before implementation.',
      outputs: ['Working implementation with the checks and evidence appropriate to the agreed behavior.', 'An engineering handoff covering design decisions, supported limits, operation, recovery, and remaining work.'],
      boundary: 'The scope names the interfaces, supported cases, dependencies, and exclusions. Newly discovered requirements are reviewed together before they become commitments. A separate discovery engagement is unnecessary when the work is already sufficiently defined.',
      completion: 'The agreed behavior is demonstrated against acceptance criteria, remaining limits are recorded, and the receiving team can operate and change the affected system.',
      next: 'Your team takes ownership. A further iteration or advisory arrangement can follow a defined need; the implementation should leave a usable result in its own right.',
      problemIds: [],
      exampleSlugs: ['release-readiness-review'],
      enquiry: 'Build a defined change'
    },
    {
      id: 'investigate-an-existing-system',
      label: 'UNDERSTAND & IMPROVE',
      title: 'Investigate an existing system.',
      summary: 'Find what a release, recurring failure, evaluation, or delivery bottleneck needs next.',
      question: 'What should change first, and what supports that choice?',
      motivation: 'A convincing demo may be hard to release. Failures can recur despite patches. Evaluation scores may leave the important decision unresolved, or coding agents may produce changes faster than the team can accept them. A useful diagnosis connects the observation to a justified intervention.',
      work: 'We reconstruct representative cases, examine product expectations and system behavior, and separate observations from competing explanations. Findings identify the next useful action: a product clarification, better evidence, a targeted experiment, or an engineering change. In operational distress, immediate containment and recovery come first.',
      inputs: 'The decision or incident in question, relevant traces or changes, affected workflow examples, the people who know the domain, and a system owner. Missing evidence becomes an explicit finding rather than an invitation to guess.',
      outputs: ['Evidence-linked findings, competing explanations, and the scope and limits of the investigation.', 'Prioritized interventions or release conditions, with owners, validation steps, and an explicit next decision.'],
      boundary: 'The investigation covers an agreed question and a defined set of cases or system paths. It establishes what the evidence supports; it does not imply a comprehensive certification of every possible behavior.',
      completion: 'The team can distinguish demonstrated problems from hypotheses, identify what needs attention first, and assess the proposed next action.',
      next: 'Make a targeted change, narrow the supported scope, collect a missing observation, adjust ownership, or take the work forward internally. Hands-on support can implement a justified intervention.',
      problemIds: ['production-readiness', 'evaluation-and-decisions', 'unexplained-failures', 'quality-and-ownership', 'coding-agents-and-accepted-work'],
      exampleSlugs: ['release-readiness-review'],
      enquiry: 'Investigate an existing system'
    }
  ],
  formats: pricing.offers.map(offer => ({ id: offer.id, title: offer.title, text: offer.summary, price: offer.price }))
};

export function journeyForProblem(problemId) {
  const journey = workingTogether.journeys.find(item => item.problemIds.includes(problemId));
  if (!journey) throw new Error(`No engagement starting point for client problem: ${problemId}`);
  return journey;
}
