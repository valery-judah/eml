import { clientProblems } from './client-problems.mjs';
import { workingTogether } from './engagements.mjs';
import { workProducts } from './work-products.mjs';

// Editorial connections are explicit: a shared topic alone does not establish
// which client decision, example, or engagement is useful after an article.
export const readerPaths = {
  'evaluation-as-decision-evidence': {
    problemId: 'evaluation-and-decisions', journeyId: 'investigate-an-existing-system', exampleSlug: 'release-readiness-review',
    heading: 'Make the evidence useful for your next decision.',
    text: 'Bring a release or investment choice and the evidence currently used to make it. A focused review can identify which conclusions are supported, what remains uncertain, and which gap deserves attention first.',
    exampleContext: 'See a readiness review connect individual claims, observed behavior, required controls, and a conditional release recommendation.'
  },
  'diagnosing-ai-system-failures': {
    problemId: 'unexplained-failures', journeyId: 'investigate-an-existing-system', exampleSlug: 'release-readiness-review',
    heading: 'Turn a recurring failure into a justified next action.',
    text: 'Start with a representative incident and what the system was expected to do. An investigation can separate demonstrated behavior, competing explanations, and the next observation or change needed.',
    exampleContext: 'Follow a synthetic action failure from the retained execution to a control finding, proposed intervention, and verification plan.'
  },
  'human-ai-work-and-ownership': {
    problemId: 'quality-and-ownership', journeyId: 'investigate-an-existing-system', exampleSlug: 'release-readiness-review',
    heading: 'Give the next consequential decision a clear owner.',
    text: 'Examine a handoff, review, or automation decision that repeatedly becomes unclear. Map the judgment, information, authority, and recovery each participant needs, then agree on a workable allocation.',
    exampleContext: 'The support-assistant review makes draft preparation, human approval, action authority, and operational ownership explicit.'
  },
  'ai-quality-needs-ownership': {
    problemId: 'quality-and-ownership', journeyId: 'investigate-an-existing-system', exampleSlug: 'release-readiness-review',
    heading: 'Resolve the quality decision that keeps reopening.',
    text: 'Bring a recent release discussion or disputed case. Reviewing who contributes, who decides, and what evidence the commitment requires can turn a recurring disagreement into a maintained decision practice.',
    exampleContext: 'See findings assigned to product, engineering, domain, and operations owners around one release commitment.'
  },
  'a-smaller-useful-experiment': {
    problemId: 'what-to-build', journeyId: 'choose-an-investment', exampleSlug: 'choosing-an-ai-investment',
    heading: 'Choose an experiment that can change the investment.',
    text: 'Bring the opportunity, the current workflow, and the choice you need to make. A short decision memo can expose the critical assumption and define an investigation with a useful stopping point.',
    exampleContext: 'The report-workflow memo compares alternatives, proposes a bounded experiment, and states what would change the recommendation.'
  },
  'the-interface-is-part-of-the-ai-system': {
    problemId: 'production-readiness', journeyId: 'build-a-defined-change', exampleSlug: 'release-readiness-review',
    heading: 'Make review and action boundaries work in the product.',
    text: 'When the interaction change is clear, scope it around inspectable evidence, meaningful correction, and enforced authority. Acceptance should cover what happens before and after a suggestion becomes a commitment.',
    exampleContext: 'The support-assistant review distinguishes an internal draft, a person sending a reply, and an account action enforced by the application.'
  },
  'a-faster-coding-agent-changes-the-work': {
    problemId: 'coding-agents-and-accepted-work', journeyId: 'investigate-an-existing-system', exampleSlug: 'choosing-an-ai-investment',
    heading: 'Find the constraint on accepted engineering work.',
    text: 'Follow representative changes through preparation, execution, review, acceptance, and rework. A workflow assessment can identify which intervention deserves a comparison before expanding agent throughput.',
    exampleContext: 'This example concerns reports. Adapt its complete-job effort map and conditional economics to accepted code changes; it does not establish results for coding agents.'
  },
  'measure-the-whole-job': {
    problemId: 'what-to-build', journeyId: 'choose-an-investment', exampleSlug: 'choosing-an-ai-investment',
    heading: 'Establish what would make the whole job better.',
    text: 'Map a representative workflow and its accepted outcome before choosing the intervention. Compare alternatives against total effort, relevant quality, and the capacity your team could actually use.',
    exampleContext: 'A synthetic effort map shows why faster report drafting can leave the investment case unresolved.'
  },
  'from-demo-to-production': {
    problemId: 'production-readiness', journeyId: 'investigate-an-existing-system', exampleSlug: 'release-readiness-review',
    heading: 'Define the release your evidence can support.',
    text: 'Bring the proposed users, supported tasks, and behavior people will depend on. A readiness review can identify a bounded commitment, the controls it needs, and the conditions that still block release.',
    exampleContext: 'Read a complete review that keeps customer-facing release blocked while defining conditions for an internal draft pilot.'
  },
  'context-is-part-of-the-system': {
    problemId: 'unexplained-failures', journeyId: 'investigate-an-existing-system', exampleSlug: 'release-readiness-review',
    heading: 'Locate the information problem before choosing a fix.',
    text: 'Use a representative execution to inspect source scope, transformations, selection, assembled context, and its use. Findings should distinguish missing information from an unsupported interpretation or a separate action-control problem.',
    exampleContext: 'The support-assistant review separates stale and missing policy evidence from the authority to execute an account action.'
  },
  'designing-evaluation-coverage': {
    problemId: 'production-readiness', journeyId: 'investigate-an-existing-system', exampleSlug: 'release-readiness-review',
    heading: 'Connect your case set to the release under review.',
    text: 'Bring the supported situations, current cases, and release question. Review which claims the coverage can examine, which observations are missing, and what the result can reasonably justify.',
    exampleContext: 'See an evidence matrix retain routine, uncertainty, access, and action-boundary claims separately.'
  },
  'diagnosing-ai-product-failures': {
    problemId: 'unexplained-failures', journeyId: 'investigate-an-existing-system', exampleSlug: 'release-readiness-review',
    heading: 'Leave the investigation with a useful next decision.',
    text: 'A trace-linked failure record can show whether the next step is a clarified expectation, better observation, a discriminating experiment, or a demonstrated engineering fix.',
    exampleContext: 'Inspect the synthetic ACTION-04 trace, its earliest demonstrated control failure, and the verification work that follows.'
  },
  'retrieval-with-provenance': {
    problemId: 'unexplained-failures', journeyId: 'build-a-defined-change', exampleSlug: 'release-readiness-review',
    heading: 'Build an information path the team can inspect.',
    text: 'When the retrieval change is sufficiently defined, implement it with source identity, visible transformations, representative cases, and acceptance checks for the consuming task. Keep unresolved diagnosis visible in the scope.',
    exampleContext: 'The policy-assistant example shows why current sources and recoverable evidence matter. It illustrates acceptance findings rather than a retrieval benchmark.'
  },
  'coding-agent-project-ownership': {
    problemId: 'coding-agents-and-accepted-work', journeyId: 'build-a-defined-change', exampleSlug: 'choosing-an-ai-investment',
    heading: 'Improve the environment around an accepted change.',
    text: 'Scope an observed repository or review constraint into a maintainable intervention: clearer orientation, an executable check, a contract, or a smaller task boundary. Include the maintainer’s ability to explain the result in acceptance.',
    exampleContext: 'The report memo offers a transferable way to compare preparation, review, and rework. Its synthetic numbers describe reports, not coding-agent performance.'
  },
  'designing-useful-ai-experiments': {
    problemId: 'what-to-build', journeyId: 'choose-an-investment', exampleSlug: 'choosing-an-ai-investment',
    heading: 'Make the next experiment earn its effort.',
    text: 'Agree on the choice, a credible comparison, the accepted outcome, and the finding that would change direction. Leave with a record the team can use to run or reconsider the experiment itself.',
    exampleContext: 'The investment memo develops a comparison, local decision criteria, an economic hypothesis, and continue, modify, or stop conditions.'
  },
  'building-automated-evaluators': {
    problemId: 'evaluation-and-decisions', journeyId: 'build-a-defined-change', exampleSlug: 'release-readiness-review',
    heading: 'Build a judgment mechanism the decision can use.',
    text: 'Begin with a clear criterion and the evidence it requires. Implement the evaluator, challenge it with reviewed cases, and define who handles disagreement, unknown outcomes, and the action its results may influence.',
    exampleContext: 'The readiness review connects behavioral judgments to a release decision while keeping exact permissions in application controls.'
  }
};

export function readerPathFor(slug) {
  const entry = readerPaths[slug];
  if (!entry) return null;
  const problem = clientProblems.problems.find(item => item.id === entry.problemId);
  const journey = workingTogether.journeys.find(item => item.id === entry.journeyId);
  const example = workProducts.find(item => item.slug === entry.exampleSlug);
  if (!problem || !journey || !example) throw new Error(`Unresolved reader path: ${slug}`);
  return { ...entry, problem, journey, example };
}
