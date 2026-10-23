export const techNotes = [
  {
    slug: 'designing-evaluation-coverage',
    title: 'Design evaluation coverage around the decision',
    category: 'Evaluation',
    standfirst: 'Build cases that exercise meaningful product situations. Make the relationship between the decision, the coverage, and the claims explicit.',
    tags: ['Evaluation design', 'Test cases', 'Product behavior'],
    sourceNotes: ['ai-engineering/evaluation/v2/10-evaluation-coverage.md', 'ai-engineering/evaluation/v2/ai-evaluation.md'],
    sections: [
      {
        heading: 'Write the question before collecting examples',
        text: [
          'Suppose a purchase-request assistant proposes a supplier, amount, and approving manager. The team is deciding whether a revised matching step is suitable for a limited release. An answer requires more than a pile of example messages. It requires cases that distinguish the behavior the release promises to support.',
          'A useful question is: does the assistant resolve a supplier when the available records establish one match, and preserve uncertainty when they do not? This question identifies a behavior and a boundary. Whether employees complete requests faster is a separate question requiring observation of the complete workflow.'
        ]
      },
      {
        heading: 'Specify situations as well as inputs',
        text: [
          'The message “Order two monitors from Acme” can be clear in one environment and ambiguous in another. One supplier record may match Acme, or several active records may share that name. Evaluating only the message discards the state that determines which response is appropriate.',
          'Represent a case with an input, the minimum fixture required to establish the situation, and an expected condition. Keep the condition separate from the judgment rule. “Two suppliers match” describes the situation. “Do not select a supplier without clarification” states the behavior to evaluate.'
        ],
        codeLanguage: 'yaml',
        code: 'id: supplier-ambiguous-01\ninput: Order two monitors from Acme\nfixture:\n  suppliers:\n    - { id: acme-office, name: Acme, active: true }\n    - { id: acme-industrial, name: Acme, active: true }\nexpected_condition:\n  supplier_reference: ambiguous\ncoverage: [supplier-ambiguity]'
      },
      {
        heading: 'Choose dimensions that change the behavior',
        text: [
          'Derive coverage requirements from supported workflows, product boundaries, known failures, and important uncertainty. For supplier matching, useful dimensions may include unique, ambiguous, inactive, and absent matches. A missing delivery location may matter when it changes the supplier options. Decorative wording differences may add little.',
          'Select combinations deliberately. Include ordinary successful requests, important boundaries, known regressions, and interactions with plausible consequences. Generating every combination can spend review effort on unrealistic cases while leaving the meaningful boundaries poorly understood.'
        ],
        bullets: [
          'Map each case to the coverage requirement it exercises.',
          'Include similar successful cases to test the boundary of a failure.',
          'Record exclusions that could matter to the release decision.'
        ]
      },
      {
        heading: 'Review constructed cases for realism',
        text: [
          'Real inputs reveal natural omissions, shorthand, and assumptions. Preserve their provenance and apply the appropriate privacy treatment. Written or generated inputs can fill a declared gap, but they need review: does the wording resemble actual work, and does the fixture create the intended condition?',
          'Generate the user input independently from the expected answer. Otherwise the example may encode the judgment into its wording. Remove near-duplicates and cases that announce the hidden condition, such as a request explicitly telling the assistant that the supplier name is ambiguous.'
        ]
      },
      {
        heading: 'Separate coverage from population measurement',
        text: [
          'A challenge set can deliberately concentrate difficult cases. Its failure rate describes that set. It cannot establish how often customers encounter those failures. A production estimate needs a declared population, time window, selection method, and handling of missing observations.',
          'Keep diagnostic, regression, comparison, and production-sampling purposes visible. They can share cases, but their results support different conclusions. Coverage tells you which situations have been examined; the sampling method determines whether their prevalence says anything about live use.'
        ]
      },
      {
        heading: 'Treat the first set as a maintained asset',
        text: [
          'Before execution, review whether every material requirement has a realistic case and a fixture that actually activates it. Confirm the relevant time, state, data, and system versions can be recorded. Decide how missing evidence will be reported.',
          'Expand the set when production, failure analysis, or a new decision exposes a gap. There is no useful universal case count. Start with a reviewable set that answers the stated question, preserve its limits, and let new evidence earn the next addition.'
        ]
      }
    ]
  },
  {
    slug: 'diagnosing-ai-product-failures',
    title: 'Diagnose failures from the complete execution',
    category: 'Evaluation',
    standfirst: 'Trace the first observable departure from expected behavior, follow its consequences, and preserve the questions the evidence cannot yet answer.',
    tags: ['Failure analysis', 'Observability', 'Product behavior'],
    sourceNotes: ['ai-engineering/evaluation/v2/failure-understanding.md', 'ai-engineering/evaluation/v2/failures-putting-into-use.md'],
    sections: [
      {
        heading: 'Reconstruct the job before naming the failure',
        text: [
          'A purchasing assistant says that an order request has been submitted. The user later discovers that nothing reached the approval queue. Calling this a hallucination records an impression, but leaves the engineering work unclear. Did submission fail, did the system never attempt it, or did the interface display an old result?',
          'Collect the relevant sequence: the request, initial state, selected records, proposed action, confirmation, tool result, state changes, and final response. Include system and data versions. The trace should let another reviewer recover the behavior that supports the finding without relying on the original analyst’s memory.'
        ]
      },
      {
        heading: 'Check that a verdict is possible',
        text: [
          'Two questions come before a product-failure label. Is there enough evidence to establish what happened? Is the applicable product expectation clear? A missing tool result creates an evidence gap. A disagreement about whether confirmation was required may reveal a product-intent gap.',
          'Record these gaps explicitly. Treating an unobservable execution as a pass hides instrumentation problems. Treating every unexpected response as a failure lets reviewers invent requirements after seeing the result. A provisional observation can remain useful while the expectation or evidence is clarified.'
        ],
        bullets: [
          'Evidence gap: identify the missing event, state, or source needed to judge.',
          'Intent gap: identify the unresolved product rule and its owner.',
          'Confirmed failure: link the observed behavior to the expectation it violates.'
        ]
      },
      {
        heading: 'Find the earliest observable divergence',
        text: [
          'Suppose the trace shows an accepted confirmation, a rejected submission, and a final message claiming success. The first demonstrated divergence may be the success claim after the rejected action. The rejected action itself may be an acceptable operational event if the product promises to report it and offer recovery.',
          'Separate the observed condition, the divergence, its propagation, and the consequence. A wrong supplier selection might appear in a draft, survive approval, and cause an incorrect request. These are connected events, not automatically four independent failures. The first visible problem is also not proof of the internal root cause.'
        ],
        codeLanguage: 'text',
        code: 'Condition: submission tool returned a rejection\nExpected: report the rejection and retain the draft\nDivergence: final response claimed successful submission\nPropagation: user stopped monitoring the request\nConsequence: approval work did not begin\nCause hypothesis: response generation ignored action status\nNext evidence: inspect the exact input to response generation'
      },
      {
        heading: 'Compare boundaries, including successful cases',
        text: [
          'Use concrete labels early: “claimed submission after rejection” is more useful than “bad reasoning.” Then compare incidents with similar executions that succeeded. Does the pattern depend on a particular tool status, a retry, a long conversation, or an ambiguous supplier?',
          'Develop recurring categories only when their members share a meaningful behavior and a reason it is unacceptable. Split a category when it hides distinctions that would change judgment or intervention. Keep contradictory and disputed cases available; they can expose an overbroad failure definition.'
        ]
      },
      {
        heading: 'Investigate causes with separate evidence',
        text: [
          'A trace can show that the response ignored a rejection. It may not show whether the cause was missing context, incorrect state mapping, conflicting instructions, or the model’s interpretation. Write these as competing hypotheses and identify an observation that could distinguish them.',
          'Inspecting the assembled model input may reveal that the rejection was omitted. Replaying a fixed trace with corrected state can examine a proposed remedy. Avoid changing several components together and then attributing improvement to the most plausible explanation.'
        ]
      },
      {
        heading: 'Leave an actionable failure record',
        text: [
          'Keep representative traces, successful contrasts, the violated expectation, inclusion and exclusion boundaries, observed consequences, and unresolved questions. Route findings to the right work: product clarification, an implementation investigation, missing instrumentation, evaluation coverage, or a criterion suitable for repeated checking.',
          'A failure-discovery collection often overrepresents difficult cases. Use it to understand patterns and design follow-up work. Estimate live frequency through a separate sampling plan. Understanding why a category is useful should precede turning its count into a dashboard or a release threshold.'
        ]
      }
    ]
  },
  {
    slug: 'retrieval-with-provenance',
    title: 'Build retrieval you can inspect and explain',
    category: 'Systems design',
    standfirst: 'Preserve the path from source material to working context so a team can understand omissions, test transformations, and verify the resulting task.',
    tags: ['Retrieval', 'Context engineering', 'Provenance'],
    sourceNotes: ['ai-engineering/retrieval/retrieval-design.md', 'ai-engineering/retrieval/model-representation-design.md', 'ai-engineering/context-engineering/ce-review.md'],
    sections: [
      {
        heading: 'Define what will consume the context',
        text: [
          'Retrieval begins with an information need and a next operation. A policy reviewer may need original passages with dates and exceptions. An extraction step may need a document and a strict field schema. A user exploring a disagreement may need several conflicting sources without an automated answer.',
          'Write down the task, the material required, the available sources, and what would count as sufficient evidence. This creates a basis for evaluating context selection. Otherwise a plausible answer can conceal the fact that the system never retrieved the material the user wanted.'
        ]
      },
      {
        heading: 'Give source material a recoverable identity',
        text: [
          'A retrieved chunk should resolve to a particular source occurrence. Preserve a source identifier, revision or snapshot, structural location, and the original text. When indexing a derived view, such as questions generated from a paragraph, retain the mapping back to that paragraph.',
          'Parsing and segmentation are consequential steps. A table can lose its headers; a qualification can become detached from the rule it limits. Inspect the searchable representation before blaming ranking. No downstream reranker can recover information that corpus preparation discarded.'
        ],
        codeLanguage: 'json',
        code: '{\n  "sourceId": "purchasing-policy",\n  "sourceRevision": "rev-12",\n  "locator": { "section": "4.2", "paragraph": 3 },\n  "view": "original-paragraph",\n  "retrievalRoute": "literal",\n  "query": "supplier approval exception",\n  "transformations": [],\n  "selectedFor": "review-approval-requirements"\n}'
      },
      {
        heading: 'Keep acquisition, selection, and assembly visible',
        text: [
          'Acquisition produces candidate material. Selection decides what to retain. Assembly orders, formats, expands, or compresses it for a consumer. These decisions may share one implementation, but keeping their outputs inspectable lets the team localize a problem and replace one method without rebuilding the whole pipeline.',
          'Retain the actual query, route, candidate set, selection reasons, and input manifest. A relevance judgment should identify the task it concerns. Similarity, source authority, freshness, and support for a particular claim are different properties; one score should not silently stand in for all of them.'
        ]
      },
      {
        heading: 'Test one meaningful change at a time',
        text: [
          'Choose real scenarios that expose different difficulties: exact vocabulary, paraphrases, conflicting versions, repeated text, and missing subject matter. Start with a small route whose assumptions are visible. Literal matching can serve one task; semantic acquisition may be appropriate immediately for another.',
          'Compare a proposed addition against that route. If testing model-based filtering, inspect both retained and excluded candidates. If testing compression, examine whether exceptions and provenance survive. Keep the source snapshot, task, and comparison budget sufficiently stable to interpret the difference.'
        ],
        bullets: [
          'Missing source: examine collection scope and synchronization.',
          'Missing candidate: examine representation and acquisition.',
          'Missing qualification: examine expansion, selection, and compression.',
          'Unsupported answer: inspect the assembled input and its use.'
        ]
      },
      {
        heading: 'Make interventions part of explicit state',
        text: [
          'A reviewer may expand a passage, change source scope, reject a relevance suggestion, or correct the interpretation of a request. Preserve the original result, the revised artifact, and the reason. A downstream answer should identify which version it consumed.',
          'These interventions help the current task and can suggest a policy for later tasks. They are different claims. Including a preceding paragraph because it defines an acronym does not establish that every retrieved paragraph should always include its predecessor. Test the proposed general rule across other cases.'
        ]
      },
      {
        heading: 'Verify the actual input and the final job',
        text: [
          'Review the context that reaches the consumer, not only the material available earlier in the pipeline. Check required evidence, unresolved conflict, source currency, formatting, and task limits. Changing sources or requirements can make an earlier sufficiency judgment stale.',
          'Then evaluate the complete task separately. Include missed evidence, incorrect exclusions, reviewer effort, latency, and cost alongside retrieval measures. Provenance makes these investigations possible; it does not automatically establish that a source is correct or that the final answer used it well.'
        ]
      }
    ]
  },
  {
    slug: 'coding-agent-project-ownership',
    title: 'Keep project ownership as agents accelerate development',
    category: 'Engineering practice',
    standfirst: 'Treat maintainers’ understanding as an acceptance requirement. Make context, review, and executable feedback support that responsibility.',
    tags: ['Coding agents', 'Project ownership', 'Review'],
    sourceNotes: ['ai-engineering/coding-agents/project-ownership.md', 'ai-engineering/coding-agents/comprehension.md', 'ai-engineering/coding-agents/agents-md.md'],
    sections: [
      {
        heading: 'Keep a person accountable for the system model',
        text: [
          'An agent can produce a plausible implementation and an equally plausible explanation. Acceptance still requires someone to connect the change to the product’s constraints, architecture, operating history, and maintenance obligations. Those connections are part of engineering judgment.',
          'The required depth depends on consequence. A disposable script may need a clear input contract and a contained failure impact. Core product logic needs an explanation of invariants, state transitions, tradeoffs, and recovery. Passing tests provide evidence about selected behavior; they do not remove this responsibility.'
        ]
      },
      {
        heading: 'Frame changes around behavior and boundaries',
        text: [
          'Give the agent a concrete problem, the relevant behavior, and the constraints it must preserve. Identify the canonical implementation and documentation. Explain which nearby patterns are current and which exist for compatibility. This reduces the chance that a generic solution or a legacy example becomes an accidental architectural decision.',
          'Keep the initial scope reviewable. A request to fix duplicate submission should expose the relevant transaction and retry behavior before inviting a broad workflow redesign. If investigation reveals a larger problem, make the proposed scope and reasoning visible before additional complexity accumulates.'
        ],
        codeLanguage: 'text',
        code: 'Change: prevent duplicate purchase requests after retry\nBehavior: repeating one confirmed request creates one record\nBoundary: preserve existing approval and permission rules\nSource of truth: request service and persistence contract\nEvidence: retry integration case plus independent diff review\nOwner review: explain identity, transaction, and recovery paths'
      },
      {
        heading: 'Use repository instructions as orientation',
        text: [
          'A short repository instruction file can establish local commands, sources of truth, generated-file boundaries, and decisions that require escalation. Route detailed knowledge to maintained documents that can be loaded when relevant. Avoid duplicating the same rule across several places with slightly different wording.',
          'Choose instructions because they correct observed local mistakes. “Run this validation command” or “edit this source rather than the generated file” can change behavior. General requests to write good code add little guidance. Where a rule is mechanical, prefer an executable check and point the agent toward it.'
        ]
      },
      {
        heading: 'Review what the change makes possible',
        text: [
          'Read the resulting diff alongside the behavior it is supposed to implement. Follow new branches, dependencies, state, and failure paths. Ask whether an added abstraction solves the current problem, which callers depend on it, and what the next maintainer must understand to change it safely.',
          'Use the agent’s explanation as a contribution to investigation. Check material claims against source code, tests, and actual execution. For important behavior, use evidence that can challenge the proposed implementation rather than tests that simply reproduce its internal structure.'
        ],
        bullets: [
          'Explain the important invariant without relying on the agent’s prose.',
          'Inspect a failure or retry path, not only the successful example.',
          'Identify what changed outside the requested behavior and why.',
          'Resolve material comprehension gaps before accepting dependent work.'
        ]
      },
      {
        heading: 'Watch the review queue for comprehension debt',
        text: [
          'A team can lose understanding gradually: one unfamiliar helper, one unexplained state machine, one accepted change that nobody has traced. Later changes build on those gaps. High implementation throughput can make the resulting complexity look like progress until maintainers can no longer judge the next proposal.',
          'Reduce scope, investigate the unclear part, or simplify the design when review capacity becomes the constraint. Measuring accepted changes together with preparation, intervention, review, and correction effort gives a more useful picture than counting generated code or completed agent sessions.'
        ]
      },
      {
        heading: 'Improve the environment after recurring mistakes',
        text: [
          'Repeated failures are evidence about the repository workflow. A missing validation command may need a script. A misunderstood boundary may need a contract test or a clearer module interface. Stale guidance needs an owner and a canonical replacement.',
          'Observe whether the improvement changes later work and what it costs to maintain. Add instructions, documentation, and checks where they resolve a demonstrated problem. The objective is an environment in which agents can contribute useful work and people can continue to explain, operate, and evolve the result.'
        ]
      }
    ]
  },
  {
    slug: 'designing-useful-ai-experiments',
    title: 'Design experiments that can change your next decision',
    category: 'Engineering practice',
    standfirst: 'Choose a learning objective, a credible comparison, and an outcome that reflects accepted work. Preserve enough context to revise the recommendation.',
    tags: ['Experiments', 'Engineering methods', 'Decision making'],
    sourceNotes: ['ai-engineering/coding-agents/coding-agent-experimentation-primer.md', 'ai-engineering/working-assumptions.md', 'ai-engineering/retrieval/retrieval-design.md'],
    sections: [
      {
        heading: 'Begin with a choice you are prepared to revise',
        text: [
          '“Does better context help?” is too broad to guide an investigation. “Should this team add a short repository orientation file for maintenance tasks?” identifies an actionable choice. It also exposes the context that matters: task type, repository, agent configuration, users, and the alternatives under consideration.',
          'State the learning objective before selecting a method. Observation may reveal which files an agent actually uses. A case study can explain how documentation and review interact. A controlled comparison can examine whether a particular intervention changes outcomes. These methods answer related but different questions.'
        ]
      },
      {
        heading: 'Write an observable expectation',
        text: [
          'A useful hypothesis connects an intervention to a defined outcome. For example: a minimal orientation file reduces human corrections per accepted maintenance change without a consequential reduction in completion quality. Define a correction, an accepted change, and a consequential quality loss before interpreting the results.',
          'When the mechanism is unclear, start with an exploratory aim instead of inventing precision. Inspect sessions and ask where project knowledge is missing. The result may suggest a better intervention, such as a validation script or a module-level contract, rather than a longer instruction file.'
        ],
        codeLanguage: 'text',
        code: 'Decision: keep a minimal repository orientation file?\nContext: maintenance tasks in one stable repository snapshot\nComparison: current setup versus the same setup plus orientation\nPrimary outcome: human corrections before acceptance\nGuardrails: accepted completion, defects, review time, execution cost\nPrediction: fewer corrections without material quality loss\nRevision rule: narrow or remove guidance if benefits do not survive review'
      },
      {
        heading: 'Keep the comparison interpretable',
        text: [
          'Record the repository state, task wording, model and agent versions, available tools, instructions, and acceptance process. Keep these conditions comparable when the aim is to attribute a difference to the intervention. A simultaneous model upgrade and instruction rewrite makes that attribution difficult.',
          'Use tasks that reflect the decision’s scope and repeat executions when variability matters. Keep unsuccessful runs and protocol deviations visible. An agent that abandons a difficult task should not disappear from the analysis because it produced no final patch.'
        ],
        bullets: [
          'Choose tasks before knowing which configuration succeeds.',
          'Use the same acceptance criteria across conditions.',
          'Record interventions and configuration changes during a run.',
          'Keep exploration examples separate from later challenge cases where practical.'
        ]
      },
      {
        heading: 'Measure accepted work and human effort',
        text: [
          'A shorter agent run can still require more preparation, review, and repair. Measure the outcome the team needs, such as a correct change acceptable for merge. Include human steering, unintended edits, missed escalation, execution cost, and maintenance burden as guardrails or secondary outcomes.',
          'Select a primary outcome so the recommendation cannot quietly switch to whichever metric improves. Capture qualitative observations as well. Two runs can have similar completion scores while one adds an unnecessary abstraction and the other exposes a useful missing contract.'
        ]
      },
      {
        heading: 'Interpret the result at its actual scope',
        text: [
          'Ask how large the observed difference is, how variable it is, and whether it matters after accounting for cost and risk. Examine whether task difficulty, evaluator disagreement, changed tools, or a small number of unusual runs could explain the finding. Preserve examples that challenge the preferred interpretation.',
          'A successful local comparison supports a local recommendation under the examined conditions. It does not establish a universal rule for every repository or agent. An inconclusive result may indicate that the effect is small, the measurement is weak, or the evidence is insufficient. Record what remains unresolved.'
        ]
      },
      {
        heading: 'Connect the finding to the next commitment',
        text: [
          'Decide whether to retain the intervention, narrow its scope, revise it, gather another kind of evidence, or stop investing. Document the reason and the conditions that would prompt reconsideration. Useful negative results can prevent a team from maintaining guidance that does not earn its cost.',
          'Keep the experiment record proportional to the decision. A small reversible workflow change may need a short comparison and a few trace examples. A consequential change to production authority requires stronger evidence and controls. The experiment is successful when it improves the decision, including a decision to change direction.'
        ]
      }
    ]
  },
  {
    slug: 'building-automated-evaluators',
    title: 'Turn product expectations into useful automated evaluators',
    category: 'Evaluation',
    standfirst: 'Define one narrow criterion, identify its evidence, and validate the judgment mechanism before using its output to influence releases or live behavior.',
    tags: ['Automated evaluators', 'LLM judges', 'Release evidence'],
    sourceNotes: ['ai-engineering/evaluation/v2/Operationalising Product Behaviour with Automated Evaluators.md', 'ai-engineering/evaluation/v2/ai-evaluation.md', 'ai-engineering/evaluation/v2/failure-understanding.md'],
    sections: [
      {
        heading: 'Start with a repeatable product judgment',
        text: [
          'An evaluator is useful when a recurring decision needs a recurring judgment. A release owner may need to know whether ambiguous supplier names remain unresolved after a model change. An operator may need to find responses that claim success after an action failed. Each expectation can become a narrow criterion.',
          'Clarify disputed intent first. A broad request to judge whether the assistant is good combines too many questions to diagnose disagreement. Select a behavior that matters, whose evidence can be captured, and whose repeated assessment is worth the creation and maintenance cost.'
        ]
      },
      {
        heading: 'Define applicability and missing evidence',
        text: [
          'A criterion should state when it applies, the evidence required, and the conditions for pass, fail, not applicable, and unknown. These outcomes keep an absent observation from masquerading as successful behavior and keep irrelevant executions out of the denominator.',
          'For supplier ambiguity, require the matching supplier set, an explicit record of resolving evidence, the final draft, and the user-visible response. The evidence record can be empty when nothing resolves the ambiguity. A unique identifier needs support, such as subsequent user clarification. If the trace omits the candidate set or the evidence record, applicability or support may remain unknown.'
        ],
        codeLanguage: 'yaml',
        code: 'criterion: preserve-supplier-ambiguity\nversion: 1\napplies_when: multiple active suppliers initially match the reference\nrequired_evidence:\n  - matching_suppliers\n  - resolving_evidence # explicit empty record when none exists\n  - final_draft\n  - final_response\npass: >\n  no unique supplier is selected or claimed, or every unique\n  selection and claim is supported by resolving_evidence\nfail: a unique selection or claim lacks resolving_evidence\nnot_applicable: fewer than two active suppliers initially match\nunknown: required evidence is absent or inconsistent'
      },
      {
        heading: 'Choose a mechanism that fits the rule',
        text: [
          'Use code when the rule is exact and the required state is structured. Checking for a resolved identifier in an ambiguous case can be deterministic. Verifying that a persistence event follows confirmation can use ordered events. Ordinary software defects still belong in unit or integration tests where those methods fit.',
          'A model-based judge may help assess whether a natural-language response makes an unsupported selection claim. Give it one criterion, the relevant evidence, explicit outcomes, and reviewed examples. A combined evaluation can preserve separate results for the structured state and the semantic response instead of hiding them in one overall score.'
        ]
      },
      {
        heading: 'Validate the evaluator against reviewed cases',
        text: [
          'Build a labeled collection with clear examples, difficult boundaries, successful contrasts, and cases where evidence is insufficient. Review labels with people who understand the product rule and use an adjudication process for disagreements. Version the criterion and labels; they can change when product intent changes.',
          'Examine false passes and false failures separately. A false pass can hide an unacceptable behavior; a false failure can block useful changes or flood a review queue. Look at the conditions behind disagreement rather than relying on one agreement percentage. Keep evaluation cases used to refine the judge distinct from cases used to challenge the revised version.'
        ],
        bullets: [
          'Record criterion, evaluator, model, and prompt versions.',
          'Preserve the evidence and reason behind each judgment.',
          'Report unknown and not-applicable outcomes explicitly.',
          'Revalidate after relevant criterion, judge, or input changes.'
        ]
      },
      {
        heading: 'Separate judgment from the action it influences',
        text: [
          'The evaluator produces evidence. A decision rule determines whether that evidence creates an informational finding, a human review request, a release block, or an operational intervention. The same criterion can serve several purposes while requiring different validation and failure handling.',
          'Offline comparison allows careful review before release. Asynchronous production review can tolerate delay but needs sampling and queue ownership. A synchronous runtime check affects live latency and availability. Exact permissions and state-change boundaries should be enforced directly when possible rather than delegated solely to a probabilistic judge.'
        ]
      },
      {
        heading: 'Interpret measurements with their limits',
        text: [
          'Aggregate labels over a declared set or sample and preserve the denominator, exclusions, unknowns, and evaluator error. A challenge set supports a finding about its selected situations. Population claims require a suitable production sample. A changed judge can change a measurement even when product behavior stays the same.',
          'Use the resulting finding to inform a named decision. It may justify a candidate fix, reveal a missing trace, expose an unclear criterion, or prompt a product discussion. An automated judgment becomes useful engineering evidence through its scope, validation, and connection to action.'
        ]
      }
    ]
  }
];
