export const papers = [
  {
    slug: 'evaluation-as-decision-evidence',
    title: 'Production readiness and evaluation as decision evidence',
    category: 'Evaluation & decisions',
    tags: ['Production readiness', 'Evaluation', 'Product commitments'],
    standfirst: 'A position on connecting product promises, behavioral evidence, engineering controls, and the decisions that put AI systems into use.',
    abstract: 'Production readiness is a judgment about a specific commitment: what a team is prepared to provide, to whom, under which conditions, and with which response to failure. We argue that evaluation should produce evidence for that judgment while remaining distinct from the product and engineering responsibilities it informs. The proposed method connects a bounded promise to realistic cases, trustworthy judgments, operational controls, and observation after release. A hypothetical purchasing assistant illustrates how the same evaluation result can support a narrow release while leaving a broader commitment unjustified. This is a technical position and a practical method, not a report of measured improvement.',
    thesis: 'Treat production readiness as an evidence-supported decision about a defined product promise. Maintain evaluation as the capability that examines behavior and its limits, while engineering and product owners retain responsibility for the promise, controls, and consequences.',
    methodNote: 'Technical position paper developed from our working research and engineering notes. The workflow is a proposal for local evaluation. Examples are hypothetical; cited sources support specific background ideas and do not validate the complete method.',
    sourceNotes: ['ai/approach/evaluations.md', 'ai/operating-model/production-commitment.md', 'ai/operating-model/reference-example-is-not-ground-truth.md', 'ai-engineering/evaluation/v2/product-improvement-system.md', 'ai-engineering/evaluation/v2/ai-evaluation.md', 'ai-engineering/evaluation/v2/10-evaluation-coverage.md', 'ai-engineering/evaluation/v2/Operationalising Product Behaviour with Automated Evaluators.md'],
    sections: [
      {
        heading: '1. Readiness needs an object',
        text: [
          'A prototype has produced convincing answers. Its architecture is documented, a test set looks promising, and a team wants to ship. “Is it production ready?” sounds like a technical question with one answer. It is incomplete until the team states the commitment being considered. A draft assistant used by a small internal group and a service that commits business actions on customers’ behalf create different obligations.',
          'Our position is that readiness belongs to a specified product promise and operating arrangement. The same implementation can be adequate for one use and inadequate for another. The promise includes the supported work, expected behavior, affected actors, operating limits, and response to uncertainty. It also includes someone accepting responsibility for maintaining those conditions.',
          'This makes readiness revisable. A new source collection, broader user population, changed action authority, or different latency obligation can require another judgment even when the model is unchanged. Conversely, a model replacement need not change the promise, although it requires evidence that the replacement continues to support it.'
        ]
      },
      {
        heading: '2. Separate the promise, implementation, evidence, and decision',
        text: [
          'Four objects deserve separate treatment. Product intent states what should happen. The implementation describes how the current system attempts it. Evidence records observed behavior under particular conditions. A decision states what the team will do, which uncertainty it accepts, and who owns the consequences. Combining these objects makes it easy for current output to become its own definition of correctness.',
          'Consider an approved reference answer. It may demonstrate a useful style while leaving the underlying policy ambiguous. An evaluator that rewards similarity can favor that example without establishing whether it is appropriate in a changed situation. The team must decide which facts, rules, and judgments make the reference binding, illustrative, or open to revision.',
          'This broader engineering scope has precedent. Breck and colleagues’ ML Test Score proposes tests and monitoring needs for production ML beyond offline prediction performance. We draw on that distinction, without assuming its supervised-learning rubric transfers unchanged to language-model workflows or validates our proposed commitment record.'
        ],
        citations: ['ml-test-score']
      },
      {
        heading: '3. Why an evaluation result needs an evidence chain',
        text: [
          'A score becomes decision evidence through a chain of justified relationships. The cases must represent relevant situations. Executions must reflect the system under consideration. Captured artifacts must establish what happened. Criteria must express the applicable expectation. Evaluators must apply those criteria adequately. Finally, the interpretation must stay within the conditions examined.',
          'A weak link changes what the result can support. A diagnostic set may reveal a possible failure without measuring its frequency. A model-based judge may consistently reward a plausible response that violates a domain rule. A complete answer may still require so much verification that the proposed workflow provides little benefit.',
          'Evaluation should therefore preserve both findings and limitations. We propose attaching each material result to the decision it informs, relevant behavior, case or sample definition, implementation versions, criteria, judgment method, and unresolved uncertainty. This need not require a new platform. A small record can make the reasoning inspectable before automation becomes worthwhile.'
        ]
      },
      {
        heading: '4. Write a promise that engineering can support',
        text: [
          'Begin with the people and work in scope. Describe successful completion, supported situations, material ambiguity, unsupported requests, and failures that must be prevented or contained. State which actions require confirmation, which data sources govern, and what observation and recovery must exist. Distinguish desired business effects from behavior the team directly undertakes to provide.',
          'NIST’s AI Risk Management Framework 1.0 connects governance, context mapping, measurement, and management across the lifecycle. It supports treating measurement within a wider responsibility structure. It does not prescribe this paper’s particular production-promise format or establish a universal release threshold.',
          'A useful initial promise can be small. Reduce the situations supported before silently dropping the controls required within them. If the team cannot explain how uncertainty is exposed or a failed action is recovered, a polished interface does not resolve the gap. It only makes the unresolved commitment easier to distribute.'
        ],
        citations: ['nist-rmf']
      },
      {
        heading: '5. A hypothetical purchasing assistant',
        text: [
          'Imagine an internal assistant that turns an employee’s message into a purchase-request draft. The proposed initial scope covers ordinary office equipment from an approved supplier list. Employees inspect the draft and confirm submission. The assistant may recommend a matching supplier, but it must expose material ambiguity and report a submission failure accurately.',
          'The first investigation finds acceptable drafts for unique supplier references and unreliable behavior when two active suppliers share a name. These are hypothetical observations used to reason about a decision, not results from an engagement. They could support several next steps: improve matching, use a structured selector, narrow the initial scope, or reconsider the interaction.',
          'Suppose the team chooses the selector and a narrow release. The commitment must now include how ambiguous requests reach it, whether users notice unresolved fields, whether validation prevents unsupported identifiers, and what happens after the submission service rejects a request. An interpreter score alone cannot establish these end-to-end properties.'
        ]
      },
      {
        heading: '6. Design evidence for the proposed exposure',
        text: [
          'Coverage should follow that commitment. Include unique supplier matches, several matches, inactive records, missing fields, corrections, retries, and rejected submissions where they affect promised behavior. Pair the user input with the minimum state needed to create each situation. Identical wording can exercise different behavior under different supplier records.',
          'Use a comparison to examine the proposed change while retaining cases that protect existing behavior. Keep source snapshots, model configuration, tools, and relevant environment conditions sufficiently stable to interpret differences. Repeat executions when variability could affect the decision. Preserve unsuccessful and unjudgeable runs rather than making them disappear from the denominator.',
          'Observe user review separately. Can employees recognize a wrong supplier, correct the draft, and complete the request? The interaction might satisfy the behavioral rule while increasing effort. These findings concern different claims and may lead to different interventions. A technically successful selector is a candidate solution until the whole workflow is examined.'
        ]
      },
      {
        heading: '7. Use controls and evaluation for different responsibilities',
        text: [
          'Exact action boundaries should be implemented where they can be enforced. A submission service can require a valid confirmation token, validate supplier identity, and use an idempotency key. Those controls do work during execution. An evaluation can examine whether the system preserves them under relevant conditions, but observing past compliance does not itself prevent the next invalid action.',
          'Semantic behavior may require another judgment method. A structured event can establish that a tool rejected submission. Deciding whether a natural-language reply falsely implies success can require a reviewed criterion and a validated semantic evaluator. Keep those judgments separate so disagreement can be investigated.',
          'The placement also matters. A judge used asynchronously for monitoring has different latency and failure requirements from one blocking a live request. A release decision should account for evaluator uncertainty, missing evidence, the consequence of a false pass, and the operating response when a check cannot decide.'
        ]
      },
      {
        heading: '8. A practical decision record',
        text: [
          'We propose one short record per consequential commitment, with links to supporting evidence. The record should identify what would cause the team to reconsider. The purpose is to preserve a reviewable argument, not to complete a standard document regardless of relevance.',
          'After release, compare observed behavior and conditions with the promise. Route findings according to what needs to change: implementation, supported scope, product intent, criteria, or the capability to capture and judge evidence. Maintain the record as those decisions evolve.'
        ],
        bullets: [
          'Commitment: supported users, situations, behavior, and operating limits.',
          'Evidence: cases or samples, exact versions, criteria, findings, and limits.',
          'Controls: enforced boundaries, failure detection, fallback, and recovery.',
          'Decision: accepted uncertainty, accountable owners, and exposure policy.',
          'Reconsideration: signals that trigger investigation, restriction, or withdrawal.'
        ]
      },
      {
        heading: '9. Counterarguments: does this slow down learning?',
        text: [
          'One objection is that defining a promise before release adds process when rapid experimentation is needed. The objection is valid if every experiment receives a production-sized review. Our proposal is proportional: identify the actual commitment and choose the smallest credible evidence for it. A contained experiment can accept more uncertainty while retaining clear observation and failure handling.',
          'Another objection is that the expected behavior cannot be fully specified. We agree. The promise should make material expectations and uncertainty visible without pretending to enumerate every possible input. Cases and production observations can reveal that the intended behavior itself needs revision. That is a product finding rather than an embarrassment to remove from evaluation.',
          'A third objection is that a strong aggregate score is sufficient for a commercial decision. It may be sufficient evidence in a narrow, well-understood setting. The difficulty is explaining what the score covers, how it was produced, and whether material failure slices are hidden. A decision record can be short when those answers are already clear.'
        ]
      },
      {
        heading: '10. Limitations and a test of the proposal',
        text: [
          'This framework does not prove that a product is safe, valuable, or reliable in every situation. It does not replace security engineering, usability research, legal obligations, economic analysis, or ordinary software testing. It cannot create information that the team lacks, and documentation can become a ritual disconnected from actual authority.',
          'Its benefit therefore needs local evaluation. A team could examine whether the record exposes consequential assumptions earlier, changes a release or scope decision, or improves recovery after a failure. The cost includes preparation, review, maintenance, and delays caused by unclear ownership. Finding no useful effect would justify simplifying or abandoning parts of the method.',
          'Our concluding claim is deliberately bounded: production decisions become easier to examine when the promise, evidence, controls, and accepted uncertainty are explicit. Evaluation earns its place by improving those decisions and the product learning that follows. It remains a maintained engineering capability whose adequacy must itself be questioned.'
        ]
      }
    ],
    references: [
      { id: 'ml-test-score', title: 'Breck et al. (2017). The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction.', url: 'https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/', note: 'Primary research paper proposing production ML testing and monitoring practices. Supports the broader production-engineering scope; it does not validate this paper’s method for LLM products.' },
      { id: 'nist-rmf', title: 'NIST (2023). Artificial Intelligence Risk Management Framework (AI RMF 1.0).', url: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10', note: 'Primary institutional framework connecting governance, mapping, measurement, and management. A normative framework, not empirical proof of a release method.' }
    ]
  },
  {
    slug: 'diagnosing-ai-system-failures',
    title: 'Diagnosing failures across an AI system',
    category: 'Systems engineering',
    tags: ['Failure diagnosis', 'Causal reasoning', 'System behavior'],
    standfirst: 'A method for following a failed task through information, interpretation, state, tools, and outcomes without confusing a visible symptom with its cause.',
    abstract: 'A disappointing AI result can originate at several boundaries: the task frame, available evidence, source applicability, context assembly, interpretation, tool execution, state management, or the interaction that turns output into completed work. We propose investigating those boundaries through a concrete customer task, a reconstructable execution, competing explanations, and focused interventions. The stack is an inspection aid rather than a claim that every product follows one linear architecture. A hypothetical policy assistant illustrates the distinction between an observed mismatch, a plausible mechanism, an effective intervention, and a useful customer outcome. The method aims to make diagnosis more discriminating; its value and overhead require local evaluation.',
    thesis: 'Investigate a failed job through the actual system boundaries it crosses. Preserve observations separately from explanations, use interventions to distinguish plausible accounts, and verify both the proposed repair and its effect on the complete job.',
    methodNote: 'Technical position paper and proposed investigation method. The worked case is hypothetical. External studies motivate particular questions, while the local diagnostic sequence remains a proposal rather than a validated causal taxonomy.',
    sourceNotes: ['ai-engineering/causal-stack/_index.md', 'ai-engineering/causal-stack/debugging.md', 'ai-engineering/causal-stack/claims.md', 'ai-engineering/evaluation/v2/failure-understanding.md', 'ai-engineering/retrieval/retrieval-design.md'],
    sections: [
      {
        heading: '1. A final answer hides the route to failure',
        text: [
          'A policy assistant gives an outdated approval rule. The response is fluent, relevant, and accompanied by a citation. The team can call it a retrieval failure, a reasoning failure, or a hallucination, but those labels do not establish what to change. Several different paths could produce the same visible answer.',
          'The index might contain only an old document. Retrieval might find the current document while context assembly drops it. The current policy might apply to a different business unit. A cached summary could carry the old rule. The correct information might reach the model and still be misused. Each explanation implies a different inspection and a different repair.',
          'Our claim is methodological: diagnosis should follow the failed task through relevant boundaries and seek evidence that distinguishes explanations. We use a stack as a map of inspection questions. It is not a required classification system, a model of hidden neural computation, or a promise that every incident has one isolated cause.'
        ]
      },
      {
        heading: '2. The system is the appropriate unit of investigation',
        text: [
          'The user experiences a configured product: interface, sources, model inputs, business logic, tools, state, people, and external services. Investigating the model alone can exclude the component that introduced the problem. It can also overlook a boundary where a practical intervention would contain the consequence without changing model behavior.',
          'Sculley and colleagues describe system-level technical debt in ML, including data dependencies, entanglement, feedback, configuration, and undeclared consumers. Their analysis supports attention to interactions beyond model code. It does not establish that any one of these factors explains a particular language-model incident.',
          'The investigation should retain only distinctions that affect what the team inspects or does. A simple assistant may have no durable memory or external action. A complex workflow may revisit sources several times. Follow the architecture that exists and the job that failed rather than forcing both into a complete theoretical ladder.'
        ],
        citations: ['hidden-debt']
      },
      {
        heading: '3. Establish the task and the judgment basis',
        text: [
          'Start with the customer’s intended work, relevant scope and constraints, the actual outcome, and why the difference mattered. In the policy example, asking for today’s approval process and asking which process applied to a past purchase are different tasks. An old policy is not intrinsically the wrong source.',
          'Identify the applicable expectation before declaring failure. Was the product required to use a governing policy, report uncertainty, obtain confirmation, or preserve an earlier correction? If ownership or intent is disputed, record that gap and resolve it with someone accountable for the outcome. Otherwise the analyst risks inventing a requirement after observing an inconvenient result.',
          'Separate source fidelity from truth and applicability. A response can accurately summarize an obsolete source. It can also make a true statement without the evidence the product promises to provide. These differences matter when deciding whether the repair belongs in source governance, retrieval, response behavior, or the product promise.'
        ]
      },
      {
        heading: '4. Capture the artifacts needed to reconstruct the execution',
        text: [
          'Preserve the request and relevant interaction, selected object, initial state, available sources, retrieval results, exact assembled input, tool calls and responses, state changes, and final user-visible effects. Record the versions needed to interpret them. Capture only the detail relevant to the judgment while respecting access and retention constraints.',
          'The exact model input is especially useful when a system claims that it supplied a source. A retrieval log proves that an item was found, not that the item survived filtering, compression, formatting, or truncation. A final acknowledgment proves that a correction was mentioned, not that the corrected value reached the action.',
          'This method does not require access to private internal reasoning. Observable inputs, outputs, events, and state are the evidence. A model’s generated explanation can suggest a hypothesis, but it is not privileged testimony about the mechanism that produced its behavior. Missing artifacts should become an explicit evidence gap.'
        ]
      },
      {
        heading: '5. Use boundaries to locate a visible mismatch',
        text: [
          'Inspect the boundaries implicated by the case. Did the system attempt the right task? Did needed material reach the relevant operation? Was it governing and applicable? Did the output preserve quantities, qualifiers, and constraints? Did a tool execute the intended action? Did later state retain valid corrections? Did the customer complete the work?',
          'Locate the earliest mismatch that the available evidence demonstrates, then follow its propagation. A wrong account selection can enter a draft, survive review, and produce a wrong posting. The later events matter as consequences, but counting each as an independent initiating failure can obscure the leverage point.',
          'Earliest visible does not mean ultimate cause. The wrong selection could result from ambiguous input, stale state, an omitted record, or interpretation despite adequate evidence. Preserve those alternatives. Containment may be justified immediately when consequences are serious, while explanation proceeds through a separate investigation.'
        ],
        codeLanguage: 'text',
        code: 'Observed condition -> first demonstrated mismatch -> propagation -> outcome\n\nRecord separately:\n- applicable expectation\n- supporting artifact locations\n- explanation A and a plausible alternative\n- observation that would distinguish them\n- proposed intervention and its expected effect'
      },
      {
        heading: '6. Worked hypothetical case: the obsolete approval rule',
        text: [
          'Consider a fictional assistant answering an employee’s question about a current equipment purchase. The governing policy requires approval from a department owner. An older policy names a different role. The assistant names the old role, and the employee spends time rerouting the request. These details illustrate the reasoning method; they are not a measured customer case.',
          'The trace shows both policy versions among retrieved candidates. That weakens the explanation that the index lacked the current document, but it does not establish what the answering operation received. Inspecting the input shows that a compression step retained the old rule and omitted the current exception and effective date.',
          'The first demonstrated information loss is therefore at assembly. A focused repair could preserve the governing passage and its applicability metadata. However, selecting the newest document indiscriminately would fail historical questions. The intervention should express the actual requirement: choose material applicable to the requested situation and preserve the distinctions needed to interpret it.'
        ]
      },
      {
        heading: '7. Compare explanations with focused interventions',
        text: [
          'Replay the saved case with the verified applicable passage supplied directly. Compare it with the current assembly under controlled conditions, then examine historical questions, conflicting authority, missing sources, and cases requiring several documents. This can test whether the proposed assembly change improves the relevant behavior without eliminating needed evidence.',
          'A change in output supports a claim about that intervention under those conditions. It does not reveal a unique internal mechanism. If the prompt, model, document set, and answer template all change, a successful run cannot identify which change mattered. Keep the claim proportional to the comparison.',
          'Liu and colleagues found position-sensitive performance in the long-context tasks and models they studied. That motivates testing placement and context construction locally. It does not establish that placement caused this hypothetical incident, nor that every current model behaves the same way. Use research to generate a discriminating check rather than to skip it.'
        ],
        citations: ['lost-middle']
      },
      {
        heading: '8. Develop patterns without losing individual evidence',
        text: [
          'Across incidents, record concrete observations such as “replaced the corrected delivery address with the earlier value” or “claimed completion after a rejected submission.” Compare similar successes, disputed judgments, and cases where artifacts are missing. A recurring category should connect behaviors that fail for a common product reason.',
          'Keep boundaries and counterexamples with the category. “Losing a correction” differs from a legitimate update based on new information. “Unsupported claim” differs from a false claim. A broad label such as poor reasoning can group failures whose interventions are unrelated, making a dashboard tidy while making engineering work harder.',
          'A discovery collection may deliberately contain many difficult examples. Use it to form hypotheses, refine coverage, and develop criteria. Measuring how often a pattern occurs in production requires a suitable sample definition. The observed frequency in an incident queue reflects its selection process as well as the product’s behavior.'
        ]
      },
      {
        heading: '9. A practical investigation and release method',
        text: [
          'Keep the durable case small enough to use during actual work. Link the expected outcome, relevant trace, concrete mismatch, leading alternatives, chosen check, and resulting decision. A schema is useful only when it helps someone recover the reasoning or choose a better next step.',
          'After a candidate repair, protect the original failure and relevant contrasts with appropriate checks. Use an ordinary unit or integration test for an exact software defect. Use behavioral cases when semantic and contextual interaction matters. Then observe whether the live workflow improves, including review, delay, and recovery work.'
        ],
        bullets: [
          'Establish the task, consequence, and applicable expectation.',
          'Verify that the execution can be reconstructed.',
          'Locate the first demonstrated mismatch and its later effects.',
          'State competing explanations and a check that could distinguish them.',
          'Compare a focused change while preserving relevant contrasts.',
          'Decide, record limits, and follow the effect after release.'
        ]
      },
      {
        heading: '10. Counterarguments and limits of causal language',
        text: [
          'One objection is that a focused prompt adjustment can fix an incident faster than a structured investigation. Sometimes it can. The method should scale with consequence and recurrence. A reversible local fix may need a saved example and a quick comparison. A costly failure crossing several systems merits stronger reconstruction and attribution.',
          'Another objection is that nonlinear interactions make localization misleading. We agree that a boundary map is not proof of independence. Interventions can change other signals or expose a different failure. Preserve whole-task comparisons and inspect collateral effects. The aim is a useful next check, not a complete mechanistic explanation of every computation.',
          'Finally, calling the map causal can overstate its authority. We reserve causal explanations for claims with supporting comparisons and assumptions. Traces ordinarily establish sequence and observed dependencies. A repair can be useful even while its deeper mechanism remains uncertain. This paper does not provide a formal causal-identification procedure.'
        ]
      },
      {
        heading: '11. What would justify keeping this method?',
        text: [
          'The diagnostic method itself should face evidence. Does it change the next inspection, expose an unsupported attribution, distinguish a source problem from an interpretation problem, or prevent an ineffective intervention? Does that value exceed the cost of capturing artifacts and maintaining records? Compare fresh investigations when evaluating the method; repeatedly reclassifying a known incident confounds usefulness with familiarity.',
          'Our conclusion is a practical position: a failed output should open an investigation into the job and the system that produced it. Preserve what happened, what might explain it, what changed, and what improved as separate claims. The resulting discipline is worthwhile when it leads to better interventions and less unsupported certainty, at a cost the team can sustain.'
        ]
      }
    ],
    references: [
      { id: 'hidden-debt', title: 'Sculley et al. (2015). Hidden Technical Debt in Machine Learning Systems.', url: 'https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf', note: 'Primary systems paper describing ML-specific dependencies and maintenance risks. Supports system-level investigation; it does not establish causes in individual incidents.' },
      { id: 'lost-middle', title: 'Liu et al. (2023). Lost in the Middle: How Language Models Use Long Contexts.', url: 'https://arxiv.org/abs/2307.03172', note: 'Primary experiments on context-position effects in specified question-answering and retrieval tasks. Motivates local tests of context construction without establishing universal behavior or incident causality.' }
    ]
  },
  {
    slug: 'human-ai-work-and-ownership',
    title: 'Human–AI work allocation and accountable ownership',
    category: 'Work & ownership',
    tags: ['Human–AI collaboration', 'Work design', 'Ownership'],
    standfirst: 'A position on allocating information, execution, judgment, and authority across people, models, and software while keeping responsibility explicit.',
    abstract: 'AI assistance changes the work around an automated task: context must be supplied, proposals interpreted, decisions coordinated, and failures recovered. We argue that allocation should be designed at meaningful work boundaries rather than expressed as one global level of autonomy. Our proposed method distinguishes information access, execution, judgment, authority, and accountability, and connects them through shared artifacts, explicit handoffs, and evidence about the complete job. A hypothetical customer-support workflow illustrates how a system can prepare evidence and proposals while software enforces action boundaries and people retain defined decisions. A coding-agent example extends the argument to project ownership. These are design proposals requiring local evaluation, not claims of proven productivity gains.',
    thesis: 'Allocate contributions around the real job and its decision boundaries. Make the state of work inspectable, assign action authority separately from capability, and keep accountable people able to understand, challenge, and operate the resulting system.',
    methodNote: 'Technical position paper adapting our collaboration and engineering notes. The allocation method is a proposal. Worked examples are hypothetical, and cited human–automation research is used within its stated conceptual and interaction-design scope.',
    sourceNotes: ['ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md', 'ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices.md', 'ai-engineering/coding-agents/project-ownership.md', 'ai-engineering/coding-agents/comprehension.md', 'ai-engineering/coding-agents/agents-md.md', 'ai-engineering/retrieval/retrieval-design.md'],
    sections: [
      {
        heading: '1. Start with work rather than a persona',
        text: [
          'Calling a model a teammate does little to specify the relationship. It may suggest a helpful interaction style while leaving consequential questions unanswered. What information can it access? What can it change? Who checks the result? When does an interpretation become a commitment? Who responds when the work falls short?',
          'Our position starts with a job and its outcome. The participants may include a customer, an operator, a domain expert, a model-backed operation, deterministic software, and an external service. Their contributions differ. Giving them a common label does not make their capabilities, authority, or responsibilities interchangeable.',
          'We propose designing the relationship through observable work: inputs, artifacts, decisions, actions, dependencies, and recovery. This permits useful collaboration without requiring claims that the model understands responsibility as a person does. The product can coordinate contributions while an organization retains accountability for how that coordination is designed and used.'
        ]
      },
      {
        heading: '2. Separate five allocation questions',
        text: [
          'Information access concerns what a participant can know at a particular step. Execution concerns who performs a transformation or action. Judgment concerns who assesses whether a contribution is adequate. Authority concerns who may commit a change. Accountability concerns who must explain, maintain, and respond to the resulting behavior.',
          'These dimensions can vary independently. A model may inspect customer messages and draft a reply without authority to send it. A service may apply an approved refund while having no discretion to choose the amount. A reviewer may assess policy compliance while a manager owns an exception decision. A developer may use generated code while retaining responsibility for accepting the design.',
          'Capability therefore does not establish permission. Nor does access establish competence on the target cases. For each allocation, specify the information available, the intended output, the boundary of discretion, and the evidence that would support delegating that contribution. This is a design hypothesis until the complete workflow is examined.'
        ]
      },
      {
        heading: '3. Automation can differ across functions',
        text: [
          'Parasuraman, Sheridan, and Wickens propose distinguishing automation of information acquisition, analysis, decision selection, and action implementation, with different levels within each function. Their model also treats the consequences for human performance as part of the allocation question. This provides a useful conceptual foundation for avoiding one global autonomy setting.',
          'Our extension for AI product work is to make the concrete artifacts and authority boundaries explicit. The same product might automatically retrieve records, ask a model to propose interpretations, require a domain review for exceptions, and use software to enforce final action conditions. Increasing automation in one part need not increase discretion everywhere.',
          'This is not an empirical claim that this particular allocation is superior. It is a way to state alternatives precisely enough to compare them. One candidate may reduce routine reading while another reduces handoffs. The choice should reflect the job, observed capability, coordination cost, and consequence of error.'
        ],
        citations: ['automation-types']
      },
      {
        heading: '4. Shared artifacts make the relationship inspectable',
        text: [
          'A conversation can communicate intent, but the operative state of the work should be recoverable. A proposal, selected evidence set, pending decision, approved change, and completed action have different meanings. Store and display those distinctions where they affect what happens next.',
          'For example, a person might change a delivery address in a draft. The resulting state should make clear that the new address supersedes the earlier value and has not yet been submitted. A model’s acknowledgment in chat is insufficient evidence that every later tool call will use it. A shared artifact gives software and reviewers a concrete object to inspect.',
          'Shared storage does not itself establish common understanding. Show the operative interpretation, relevant source, status, and consequences at the decision point. Participants should be able to challenge an inference without rewriting the whole conversation or accidentally approving the action. Preserve rejected and deferred proposals when they explain later choices.'
        ]
      },
      {
        heading: '5. Worked hypothetical case: a support escalation',
        text: [
          'Imagine a support team handling delayed deliveries. A model-backed assistant reads the customer’s message, retrieves order events and applicable policy, and prepares a proposed response. Some cases qualify for a routine refund; others require an exception decision. The purpose is to resolve the customer’s request with acceptable effort and consequences.',
          'One allocation gives the assistant responsibility for assembling a review packet: the request, verified order state, relevant policy passages, unresolved conflicts, and a proposed action. The support agent checks the packet and chooses an allowed outcome. A separate service validates permissions and performs the approved action. A domain owner decides policy exceptions.',
          'The packet must expose what was retrieved, inferred, and left uncertain. If the customer mentions a replacement already arranged by another agent, that constraint should remain visible through the proposal and action. This is a fictional design example. Whether it improves actual resolution depends on evidence about review, corrections, delays, and customer outcomes.'
        ]
      },
      {
        heading: '6. Make handoffs convey a decision need',
        text: [
          'A handoff should explain why another contribution is required. “Needs human review” is too vague when the recipient must reconstruct the case from scratch. “Two policies appear applicable; choose which governs this customer’s order before a refund can be proposed” identifies an uncertainty, an authority, and the next useful action.',
          'Specify what happens while work is pending. Can the system gather more evidence? May it send a holding message? Can an approved routine path proceed? Who owns the queue and notices that a request has stalled? Handoffs create dependencies, and those dependencies belong in the product design.',
          'Amershi and colleagues’ interaction guidelines include support for correction, disambiguation, explanations, and user controls. We use that guidance to motivate visible and steerable contributions. Their evaluation of the guidelines does not establish that our hypothetical support packet or handoff policy improves operational performance.'
        ],
        citations: ['human-ai-guidelines']
      },
      {
        heading: '7. Give review the conditions it needs',
        text: [
          'An approval button does not by itself create effective review. The person needs relevant evidence, comprehensible differences, enough time, and authority to change or stop the work. Define what they are being asked to verify. Checking a policy exception differs from rereading every sentence for tone.',
          'Avoid assigning a person responsibility for a property they cannot observe or influence. If the reviewer cannot see which account will receive the action, they cannot reliably verify account selection. If rejection simply restarts the same opaque generation, the workflow may impose review cost without enabling repair.',
          'Test this arrangement with representative work. Observe what reviewers inspect, what they miss, which corrections recur, and whether another interface or boundary would reduce unnecessary effort. A review intervention can improve the current case while also revealing a policy to test later. Neither a click nor an edit automatically becomes a trustworthy training label.'
        ]
      },
      {
        heading: '8. Preserve ownership when an agent writes the code',
        text: [
          'The same allocation problem appears in software engineering. A coding agent can inspect files, propose a design, implement a patch, and run checks. The maintainers still need to relate the accepted change to the product’s invariants, architecture, operating constraints, and future evolution. A fluent explanation can assist that work without replacing it.',
          'Our proposed acceptance condition is proportional understanding. An isolated disposable script may require knowledge of its contract and failure impact. Core product code requires the relevant owner to explain important state transitions, tradeoffs, dependencies, and recovery. The agent’s ability to continue implementing does not establish that the team can continue maintaining.',
          'Use reviewable scope, canonical documentation, independent checks, and executable feedback to support this responsibility. When unfamiliar complexity accumulates faster than it can be examined, reduce scope or investigate before accepting dependent changes. Count preparation, intervention, review, and correction effort when assessing whether the agent improves accepted delivery.'
        ]
      },
      {
        heading: '9. A method for designing and revising allocation',
        text: [
          'Begin with real cases and the current alternative. Identify decisions where information, expertise, authority, or consequence changes. For each boundary, state candidate allocations and the assumptions they depend on. Keep the first implementation small enough to observe and revise.',
          'The resulting record should explain how contributions meet, not just who receives a task label. Evaluate the whole job alongside local accuracy and speed. A faster analysis step may create a larger approval queue; a more detailed packet may reduce uncertainty while increasing reading burden. These are product design findings.'
        ],
        bullets: [
          'Name the job, intended outcome, and present sources of effort or error.',
          'Identify the artifacts and decisions that connect participants.',
          'Allocate information access, execution, judgment, authority, and ownership.',
          'Define pending states, handoffs, correction, rejection, and recovery.',
          'Test representative cases and consequential boundaries.',
          'Revise the allocation using accepted outcomes and total effort.'
        ]
      },
      {
        heading: '10. Counterarguments: humans also fail and review can dominate',
        text: [
          'A reasonable objection is that human review can be slow and inconsistent. The proposal does not assume that humans are automatically accurate or require approval at every step. It requires a justified allocation. When software can enforce an exact constraint or an evaluated component can handle a bounded action, delegation may remove unnecessary work.',
          'Another objection favors an end-to-end agent over decomposition. That can be a useful candidate. Compare accepted completion, failure consequences, recovery, and human effort rather than rejecting it by architecture alone. An explicit contract and trace can make an end-to-end implementation inspectable without splitting every decision into a service.',
          'A further objection is that ownership language makes assistance too cautious. Ownership should enable useful discretion by defining the area within which it is supported. The problem is unexamined authority, not initiative itself. Evidence may justify expanding, shrinking, or rearranging the delegated work; it need not produce a one-way march toward greater autonomy.'
        ]
      },
      {
        heading: '11. Limitations and conclusion',
        text: [
          'This paper does not supply a universal human–AI division of labor or a theory of machine understanding. Allocation depends on the task, users, available information, operating conditions, and consequences. Additional state and handoff machinery can cost more than it provides, especially for short-lived, low-impact work. A record can become ceremonial if responsible people lack time or authority to act.',
          'The method itself should therefore be tested. Does it expose an unsupported assumption, make a handoff easier to resolve, improve correction, or preserve maintainability? Does the resulting work improve enough to justify its coordination cost? Keep counterexamples and revise the mechanism when the answer is weak.',
          'Our concluding position is that useful collaboration is designed through contributions and commitments. People, models, and software can perform different parts of a job while sharing inspectable artifacts and explicit boundaries. Accountable ownership gives the organization a place to integrate evidence, judgment, memory, and consequences as that allocation changes.'
        ]
      }
    ],
    references: [
      { id: 'automation-types', title: 'Parasuraman, Sheridan, and Wickens (2000). A Model for Types and Levels of Human Interaction with Automation.', url: 'https://doi.org/10.1109/3468.844354', note: 'Primary conceptual model separating automation functions and levels, with human-performance consequences as evaluative criteria. Supports allocation distinctions rather than validating an LLM workflow.' },
      { id: 'human-ai-guidelines', title: 'Amershi et al. (2019). Guidelines for Human-AI Interaction.', url: 'https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/', note: 'Primary interaction-design paper proposing and evaluating guidelines. Supports questions about correction, disambiguation, and control; it is not evidence for the particular work-allocation method proposed here.' }
    ]
  }
];
