export const clientRationale = {
  title: 'Why this work may be worth doing',
  summary: 'A recognizable symptom becomes a business priority when it has a material consequence, evidence in your own work, and a decision that investigation can improve. Use these three tests to decide where attention belongs and whether specialist support would add value.',
  criteria: [
    {
      id: 'material-consequence',
      title: 'A consequence that matters',
      text: 'Identify what the unresolved question puts at stake: development effort, a customer commitment, recovery work, release delay, or the ability to maintain a system. Follow the causal path from the observed problem to that consequence. Its importance depends on your exposure, alternatives, and the cost of acting.'
    },
    {
      id: 'client-evidence',
      title: 'Evidence in your own work',
      text: 'Look for representative cases, execution records, review effort, repeated decisions, or customer observations that establish the concern locally. Distinguish an isolated event from a recurring pattern. Where evidence is missing, first decide whether collecting it is justified by the consequence and the uncertainty it could resolve.'
    },
    {
      id: 'decision-leverage',
      title: 'A decision the work can improve',
      text: 'Name the choice that better understanding could change: invest, narrow scope, release, redesign, alter ownership, or stop. Define a useful result and an alternative response before beginning. An investigation earns its effort when its findings can improve that choice enough to justify preparation, implementation, and ongoing maintenance.'
    }
  ],
  situations: [
    {
      problemId: 'what-to-build',
      role: 'Founder, Head of Product, or CTO choosing the next investment',
      stakes: 'If a proposal improves an isolated AI task but leaves the complete job unchanged, development can consume capacity without relieving the customer’s constraint. Early investigation is valuable when it can redirect that commitment.',
      evidence: 'Examine current workflow observations, workarounds, customer requests, and where effort or delay occurs. Check which assumptions connect each candidate solution to the intended improvement and whether meaningful alternatives have been considered.',
      value: 'Compare the complete job against its baseline: accepted outcomes, user effort, elapsed time, and relevant operating cost. Before implementation, record which investment or scope decision changed because of the evidence and why.'
    },
    {
      problemId: 'production-readiness',
      role: 'CTO, engineering lead, or product owner responsible for launch',
      stakes: 'When people rely on behavior that has no clear support boundary, exceptions can become unplanned support work or broken commitments. The business question is which exposure the team can support with its current evidence and controls.',
      evidence: 'Inspect the proposed users and tasks, observed behavior outside demonstration cases, unresolved release questions, and the actual detection and recovery paths. Establish which gaps affect the intended release rather than treating every possible concern as equally urgent.',
      value: 'Evaluate readiness against a bounded promise. Track consequential failures, recovery effort, support load, and whether agreed release conditions hold. A narrower supported release can be a useful result when a broader one lacks evidence.'
    },
    {
      problemId: 'evaluation-and-decisions',
      role: 'AI engineering lead, product lead, or evaluation owner comparing changes',
      stakes: 'If a score rewards behavior unrelated to the user’s job, improving it can direct effort toward the wrong work. If its meaning remains disputed, maintaining the evaluation may leave the original release or architecture choice unresolved.',
      evidence: 'Review a recent decision alongside the scores, cases, criteria, and expert judgments used to make it. Look for consequential disagreements, hidden regressions, or conclusions stronger than the sample supports. Establish whether the mismatch actually changed a choice.',
      value: 'Assess whether revised evidence distinguishes the alternatives and changes prioritization. Follow relevant product behavior and complete-job outcomes alongside evaluator error, review effort, and maintenance cost. A higher aggregate score alone is insufficient evidence of benefit.'
    },
    {
      problemId: 'unexplained-failures',
      role: 'Engineering manager, technical lead, or service owner facing recurring incidents',
      stakes: 'When a fix targets the visible answer while the cause lies elsewhere, the same condition can survive and create further repair work. A more expensive redesign can also be misdirected if its explanation has not been tested.',
      evidence: 'Collect representative incidents, related successful executions, the applicable expectation, and the interventions already attempted. Determine whether the records support reconstruction, whether a pattern recurs, and which missing observations prevent competing explanations from being distinguished.',
      value: 'Track recurrence under comparable conditions, time spent diagnosing and recovering, and regressions introduced by intervention. Judge the improvement against confirmed failure behavior and user consequences; better instrumentation may initially reveal problems that were previously invisible.'
    },
    {
      problemId: 'quality-and-ownership',
      role: 'VP Engineering, Head of Product, or leader coordinating AI delivery',
      stakes: 'When a recurring decision has no clear owner or lacks necessary domain input, work can wait for escalation or restart after late disagreement. The consequence depends on which commitments are blocked and whose judgment is missing.',
      evidence: 'Trace recent delayed or reopened decisions. Identify participants, evidence requested, changing criteria, handoffs, and where authority became unclear. Separate legitimate new learning from avoidable repetition before attributing delay to the organization’s structure.',
      value: 'Observe time to a supported decision, repeated reviews, escalations, and whether material concerns are resolved before commitment. Preserve decision quality and domain participation as guardrails. A shorter meeting or fewer reviewers does not by itself establish improvement.'
    },
    {
      problemId: 'coding-agents-and-accepted-work',
      role: 'Engineering director, platform lead, or maintainer expanding coding-agent use',
      stakes: 'If implementation output grows faster than review and understanding, more work can remain unfinished or require correction. The investment question concerns accepted, maintainable changes and the human effort needed to produce them.',
      evidence: 'Follow comparable changes from task framing through acceptance and relevant rework. Record preparation, intervention, review, waiting, and validation. Check whether observed difficulties arise from the agent, repository context, task selection, or an existing workflow constraint.',
      value: 'Compare accepted completion, total human effort, review delay, unintended changes, and subsequent defects for the relevant task population. Include execution and tooling costs. Require accountable maintainers to retain enough understanding to operate and evolve the affected system.'
    }
  ],
  help: {
    title: 'When specialist support adds value',
    intro: 'Your team may already have the knowledge and access needed for the next step. An engagement is worth considering when it adds a specific capability or perspective to a material decision and leaves the reasoning usable by your team.',
    conditions: [
      'The decision crosses product, engineering, domain, and operational responsibilities, and needs someone to connect their evidence and constraints.',
      'The investigation requires unfamiliar evaluation, experimentation, or failure-analysis methods that would otherwise delay useful evidence.',
      'The team understands the issue but lacks capacity for a bounded investigation or implementation alongside existing commitments.',
      'A consequential release, architecture, or automation decision would benefit from an independent examination of its assumptions and evidence.'
    ],
    alternative: 'For a familiar, contained issue with clear ownership, a short internal review or experiment may be sufficient. Establish the next decision and the missing evidence first. If outside support is useful, scope it around that gap and the work required to resolve it.'
  },
  validation: {
    title: 'Start with your evidence',
    text: 'Use these situations to test applicability to your organization. Bring a decision, a few representative cases, and what you currently know. Together we can establish whether the consequence is material, which explanation needs testing, and what improvement would justify further work.'
  }
};
