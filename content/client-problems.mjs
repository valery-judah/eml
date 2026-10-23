// sourceNotes is a private editorial ledger; it is not public page content.
export const clientProblems = {
  title: 'Problems we work on',
  description: 'Why teams seek help with AI products: choosing worthwhile work, establishing release evidence, understanding failures, connecting quality ownership, and turning implementation speed into accepted outcomes.',
  headline: 'Important AI decisions.',
  emphasis: 'A clearer way forward.',
  intro: [
    'You may have a promising capability, a product already in use, or a team under pressure to deliver more with AI. The immediate question is usually concrete: what should we invest in, can we release this, why does it fail, or how do we make progress without losing control of the system?',
    'These questions connect product behavior, architecture, evidence, and the people responsible for the work. We start with the decision you need to make and investigate the parts of that system that matter. The situations below are starting points for a conversation. Similar symptoms can have different causes; understanding your conditions comes before prescribing an intervention.'
  ],
  motivation: {
    heading: 'Why EML works across the whole system',
    text: [
      'Our motivation is to help organizations become more capable of engineering useful AI products while the practice itself continues to develop. An isolated fix can address an immediate failure. Understanding why the failure was possible can also improve how a team frames problems, designs systems, evaluates behavior, and learns from real use. Both levels matter.',
      'Evaluation is central because claims about behavior need evidence. That evidence becomes useful when it can change a product decision, an architectural choice, a release commitment, or an operating practice. We bring these concerns together around the client’s work. The aim is a better decision now and a reusable capability afterward, with reasoning your team can examine, challenge, and maintain.'
    ]
  },
  problems: [
    {
      id: 'what-to-build',
      title: 'We need to invest in AI, but the right product is unclear.',
      trigger: 'Leadership wants an AI initiative. Several ideas have convincing demos, yet the team cannot explain which customer or operational condition each would improve, or what would justify a larger investment.',
      motivation: 'You want a direction that earns development effort. The decision may concern a new product, an internal workflow, or an existing feature. You need a credible connection between the proposed capability and useful change.',
      diagnosis: [
        'One possibility is that the solution was chosen before the problem was understood. Another is that the task looks easy to automate while the surrounding job still depends on exceptions, tacit knowledge, or downstream coordination. A successful generated answer establishes only part of the case for a product.',
        'We examine the current work, meaningful alternatives, and assumptions connecting the intervention to the intended result. For example, faster report drafting may contribute little if verifying the report remains the dominant effort. Leaving those assumptions implicit can commit the team to an architecture and roadmap before it knows which improvement matters.'
      ],
      questions: [
        'Who experiences the problem, and what happens in their current workflow?',
        'What should change, and what observation would show that it changed?',
        'Which assumption could invalidate this proposal before substantial implementation?'
      ],
      work: [
        'Map the complete job, its current constraints, and the baseline against which an improvement would be judged.',
        'Compare meaningful solution options, including simpler software or changes to the work where relevant.',
        'Produce an assumption map, a small experiment plan, and a written continue, change, or stop recommendation.'
      ],
      outcome: 'First useful decision: which uncertainty deserves the next investment, and what result would change direction. A focused product assessment fits this stage. Hands-on work can follow when a bounded experiment or prototype is the credible next source of evidence.',
      reading: ['/blog/a-smaller-useful-experiment/', '/writing/measure-the-whole-job/', '/papers/evaluation-as-decision-evidence/']
    },
    {
      id: 'production-readiness',
      title: 'The demo is convincing. We cannot yet justify a release.',
      trigger: 'A pilot is attracting interest, a launch date is approaching, or colleagues have begun relying on a prototype. Selected examples look good, but supported situations, unacceptable failures, and operational responsibilities remain unclear.',
      motivation: 'You want to make a release commitment the team can actually support. That means knowing where the system is useful, where its limits belong, and what happens when real use departs from the demonstration.',
      diagnosis: [
        'The gap may be missing evidence, an overly broad product promise, or a system whose controls do not match the consequences of its actions. A prompt describing the desired behavior does not establish that permissions, confirmations, or state changes are enforced. Each important claim needs an appropriate mechanism and evidence.',
        'We make the proposed production scope explicit and inspect the path through success, uncertainty, and failure. A narrow release may be supportable even when the larger ambition is not. Letting the prototype become a service by gradual reliance can otherwise create obligations before ownership, observation, recovery, and support are ready.'
      ],
      questions: [
        'Which users, tasks, inputs, and operating conditions are we committing to support?',
        'What evidence challenges the promise beyond the examples used to build it?',
        'Who detects a consequential failure, limits exposure, and restores a usable workflow?'
      ],
      work: [
        'Write a bounded production commitment covering supported behavior, limits, failure responses, and responsibilities.',
        'Review critical architecture and action boundaries; identify controls, observations, and recovery paths that need implementation.',
        'Build a coverage and evidence plan, prioritized readiness findings, and a release recommendation with explicit remaining uncertainty.'
      ],
      outcome: 'First useful decision: release a defined scope, constrain the promise, or investigate a named gap. A readiness assessment can establish that decision. A hands-on engagement fits when the team needs evaluation, instrumentation, or system changes to make the commitment supportable.',
      reading: ['/writing/from-demo-to-production/', '/notes/designing-evaluation-coverage/', '/papers/evaluation-as-decision-evidence/']
    },
    {
      id: 'evaluation-and-decisions',
      title: 'We have evaluations, but important decisions still rely on intuition.',
      trigger: 'A dashboard improves after a model or prompt change, yet reviewers disagree about whether the product is better. Benchmarks, automated judges, and test sets exist, but release and investment discussions keep returning to isolated examples.',
      motivation: 'You need evidence that helps choose between alternatives, prioritize work, and explain a release decision. Maintaining more evaluations is difficult to justify when their results do not resolve the questions the team actually faces.',
      diagnosis: [
        'Possible causes include a convenient metric standing in for the product objective, cases that miss supported situations, or a judge whose errors are poorly understood. An overall improvement can conceal a consequential regression in one workflow. A correct answer can also leave the complete user job slower or harder.',
        'We trace an important decision backward through its claims, criteria, cases, observations, and judgment mechanism. The issue may require better coverage, clearer product intent, stronger measurement, or a different kind of experiment. Leaving the connection unresolved can reward optimization of a score while the team remains unable to defend what changed for users.'
      ],
      questions: [
        'Which decision should this evaluation inform, and what result could change it?',
        'Do the criteria reflect intended behavior independently of the current implementation?',
        'Where do reviewer disagreement, evaluator error, exclusions, and unknown outcomes appear?'
      ],
      work: [
        'Map decisions to claims and evidence; identify unsupported conclusions and measures that need qualification.',
        'Review representative traces, important segments, case selection, and judge behavior against relevant domain judgment.',
        'Deliver a revised evaluation design, an interpretable comparison, and guidance connecting results to release or development decisions.'
      ],
      outcome: 'First useful decision: which existing evidence can be trusted for the next choice, and which gap needs attention first. A focused evaluation assessment fits. An implementation engagement can establish a maintained evaluation system; advisory can keep its findings connected to recurring decisions.',
      reading: ['/papers/evaluation-as-decision-evidence/', '/notes/building-automated-evaluators/', '/writing/measure-the-whole-job/']
    },
    {
      id: 'unexplained-failures',
      title: 'Important failures keep appearing, and fixes do not explain them.',
      trigger: 'Users report failures the team cannot reproduce, a prompt patch helps one example and breaks another, or an incident discussion ends with a broad label such as hallucination rather than an actionable account of what happened.',
      motivation: 'You want to identify what needs to change and avoid repeatedly treating the same symptom. You also need to distinguish demonstrated failures from plausible explanations before committing to a model migration, architecture rewrite, or growing collection of exceptions.',
      diagnosis: [
        'The visible answer may be the end of a longer failure path involving source data, retrieval, state, tool results, or interface behavior. Missing execution evidence can prevent a verdict. An unclear product expectation can make reasonable reviewers disagree about whether the observed behavior was unacceptable at all.',
        'We reconstruct representative executions and locate the earliest divergence the evidence supports. Competing cause hypotheses remain separate from observed behavior. Successful contrast cases help identify the boundary of a pattern. Without that work, local patches can accumulate while the underlying condition survives, and the team may invest in the wrong layer of the system.'
      ],
      questions: [
        'Can another reviewer reconstruct the relevant inputs, state, actions, and consequences?',
        'Which expectation was violated, and where does the trace first demonstrate the departure?',
        'What evidence would distinguish the competing explanations for this pattern?'
      ],
      work: [
        'Assemble trace-linked failure records, successful contrasts, and explicit evidence or product-intent gaps.',
        'Develop application-specific failure categories with inclusion boundaries, consequences, and unresolved cause hypotheses.',
        'Produce a prioritized investigation and intervention plan, with targeted regression cases and instrumentation changes where justified.'
      ],
      outcome: 'First useful decision: whether the next action is a product clarification, better observation, a discriminating experiment, or a demonstrated fix. A failure-analysis assessment fits an unclear pattern. Hands-on engineering fits a well-supported intervention and the feedback loop needed to assess it.',
      reading: ['/papers/diagnosing-ai-system-failures/', '/notes/diagnosing-ai-product-failures/', '/notes/retrieval-with-provenance/']
    },
    {
      id: 'quality-and-ownership',
      title: 'Every team has a different definition of quality, and decisions stall.',
      trigger: 'Product, engineering, and domain experts repeatedly reopen the same questions. An evaluation team reports scores, but nobody has clear authority over supported behavior, acceptable failure, or the evidence required for a release.',
      motivation: 'You want decisions to move without depending on repeated escalation to a few specialists. The organization needs appropriate expertise in the conversation, clear responsibility for the commitment, and learning that survives beyond the people present in one meeting.',
      diagnosis: [
        'This may be a language problem, missing domain participation, fragmented decision ownership, or a handoff that turns evaluation into a reporting service. The same word can conceal several claims: technical reliability, policy correctness, usability, and workflow benefit. Assigning all of them to one function can leave important knowledge outside the decision.',
        'We begin with recurring decisions and examine who contributes, who decides, and which artifacts carry the evidence. Responsibilities follow the actual work. Continuing with vague ownership can create duplicated reviews, delayed releases, unexamined assumptions, and recurring debates whose conclusions never become part of how the product is developed.'
      ],
      questions: [
        'Which decisions recur, and who is accountable for each resulting commitment?',
        'Where does domain knowledge enter product design, evaluation, and failure review?',
        'How do production observations change scope, architecture, criteria, or working practices?'
      ],
      work: [
        'Map decision ownership, necessary contributors, evidence requirements, and gaps across the product lifecycle.',
        'Use shared case review to clarify disputed behavior, operational definitions, and unresolved product choices.',
        'Establish lightweight decision records, review routines, and a production-learning path with named responsibility.'
      ],
      outcome: 'First useful decision: which recurring decision needs clearer ownership and a shared evidence path. An operating-practice assessment fits cross-team friction. Principal advisory can support the new routines as real decisions expose where the arrangement needs to change.',
      reading: ['/blog/ai-quality-needs-ownership/', '/papers/evaluation-as-decision-evidence/', '/papers/human-ai-work-and-ownership/']
    },
    {
      id: 'coding-agents-and-accepted-work',
      title: 'Coding agents produce changes faster than we can confidently accept them.',
      trigger: 'Implementation drafts arrive quickly, while review queues, corrections, or unfamiliar complexity grow. The team is being asked to expand agent use but cannot yet explain its effect on accepted work, human effort, or maintainability.',
      motivation: 'You want faster delivery of useful changes with people who can still understand and evolve the system. You need to know which improvements to the agent, repository, or workflow will actually relieve the current constraint.',
      diagnosis: [
        'The bottleneck may have moved from writing code to framing tasks, supplying context, validation, or review. An agent can also expose existing weaknesses in documentation, ownership, or tests. Faster implementation does not establish which of these explanations applies, and a plausible explanation of a patch is only a starting point for investigation.',
        'We follow representative changes through preparation, execution, intervention, acceptance, and relevant rework. Core product changes need a maintained understanding of the constraints and design. If changes keep building on unresolved comprehension gaps, the team can lose the basis for judging the next proposal while throughput appears healthy.'
      ],
      questions: [
        'What counts as an accepted change, and how much human work precedes it?',
        'Which context, tools, or checks are repeatedly missing when the agent struggles?',
        'Can accountable maintainers explain the affected behavior, constraints, and failure paths?'
      ],
      work: [
        'Map the change workflow and distinguish execution speed, waiting time, human effort, and acceptance quality.',
        'Review repository orientation, task boundaries, validation, and ownership against concrete sessions and resulting changes.',
        'Run a scoped comparison of a proposed improvement and deliver maintainable guidance, tooling changes, and acceptance criteria.'
      ],
      outcome: 'First useful decision: which constraint to address before increasing agent throughput or authority. A focused workflow assessment fits. Hands-on work can improve the repository environment and validation; ongoing advisory can help maintain acceptance standards as tools and tasks change.',
      reading: ['/blog/a-faster-coding-agent-changes-the-work/', '/notes/coding-agent-project-ownership/', '/papers/human-ai-work-and-ownership/']
    }
  ],
  engagement: {
    heading: 'Start with the decision that matters next.',
    text: [
      'A useful engagement begins with your situation, the commitment under consideration, and the evidence already available. You do not need to arrive with a diagnosis. A specific concern, a representative workflow, or a decision that keeps getting postponed is enough to establish a starting point.',
      'We agree on the question, the scope, and reviewable outputs before expanding the work. Findings can justify implementation, a smaller experiment, a narrower promise, or stopping an approach. The engagement should leave your team able to understand the reasoning and use what it learns.'
    ],
    steps: [
      { title: 'Focused assessment', text: 'Investigate a bounded product, architecture, evaluation, or operating question. Receive evidence-linked findings, explicit uncertainties, and a prioritized recommendation for the next decision.' },
      { title: 'Hands-on engagement', text: 'Work through a justified intervention alongside your team: a prototype, system change, evaluation capability, or production-learning path, with implementation and knowledge transfer shaped to the scope.' },
      { title: 'Principal advisory', text: 'Bring an independent perspective to recurring consequential decisions. Review evidence, assumptions, ownership, and tradeoffs as the product develops, while keeping responsibility for the system clear.' }
    ]
  },
  sourceNotes: [
    'var/consulting/problems-we-solve.md',
    'var/consulting/problems-prevention.md',
    'var/consulting/my-product.md',
    'var/consulting/evals-not-box.md',
    'var/consulting/capacity-perspective.md',
    'var/consulting/reality-filter.md',
    'ai-engineering/working-assumptions.md',
    'ai-engineering/coding-agents/project-ownership.md',
    'ai-engineering/coding-agents/coding-agent-experimentation-primer.md'
  ]
};
