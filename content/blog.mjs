// Private editorial provenance is retained in sourceNotes. Do not render those paths publicly.
export const blogPosts = [
  {
    "slug": "ai-quality-needs-ownership",
    "title": "AI quality needs an owner, and more than one perspective",
    "category": "Teams & practice",
    "standfirst": "Product quality crosses team boundaries. Give consequential decisions clear ownership while making room for the people who understand different kinds of failure.",
    "tags": [
      "AI quality",
      "Operating models",
      "Evaluation",
      "Team ownership"
    ],
    "sourceNotes": [
      "var/consulting/problems-we-solve.md",
      "var/consulting/evals-not-box.md",
      "ai/operating-model/operating-model.md",
      "ai/operating-model/evaluation-and-production-learning.md"
    ],
    "sections": [
      {
        "heading": "The disagreement may be about the product",
        "text": [
          "Imagine a team building an assistant that suggests replies to customer questions. Engineering sees successful requests and acceptable response times. A support lead notices that some replies promise exceptions the company cannot offer. Product sees that agents keep rewriting the suggestions. Each person is observing something important. A green dashboard can coexist with a product that creates extra work or makes the wrong promise.",
          "Asking one team to own quality does not settle these differences. The first task is to describe the behavior the product is meant to support. Which requests does it handle? What may it promise? When should it ask for help? What should a support agent be able to inspect? Until these expectations are explicit, people can use the same word, quality, while judging different products."
        ]
      },
      {
        "heading": "Why a score cannot own the decision",
        "text": [
          "A score summarizes observations under a chosen rule. Deciding which observations matter and which tradeoffs are acceptable requires a product commitment. A team might improve average helpfulness while increasing a rare but consequential kind of policy error. Whether that is acceptable depends on the intended use, the people affected, and the controls around the answer. The average contains none of that authority. Asking an evaluation specialist to settle the release through a threshold can hide the underlying choice rather than resolve it.",
          "This is the reason for distributing participation while keeping decisions explicit. Domain knowledge supplies distinctions the measurement may miss. Engineering establishes what the implementation can enforce and observe. Product connects the behavior to a supported task. The decision owner brings those contributions together and accepts the resulting commitment. Ownership becomes ineffective when it means merely receiving the report. An owner must also be able to narrow scope, request an investigation, delay a change, or accept a stated limitation. Responsibility without those options leaves the important decision somewhere else."
        ]
      },
      {
        "heading": "Assign ownership to decisions",
        "text": [
          "A useful starting point is a small set of actual decisions. Who can change the supported scope? Who defines whether a reply applies a policy correctly? Who decides that a model change has enough evidence for release? Who responds when production exposes a failure? Different decisions can have different owners. Each needs a clear place where the evidence, authority, and consequences come together.",
          "For the support assistant, a domain expert might define policy interpretation, an engineer might own system controls, and a product lead might own the proposed release scope. The release decision needs their relevant findings, along with a named person accountable for the commitment. Write down the decision, its owner, the necessary contributors, and the evidence expected. This is more useful than assigning a broad responsibility that everyone interprets differently."
        ]
      },
      {
        "heading": "Treat disagreement as information",
        "text": [
          "Bring a few realistic interactions to the people who know the work. Ask them to judge the same cases independently before discussing the results. A disagreement may reveal an unclear criterion, missing context, a policy exception, or a product choice that has never been made. Preserve the reason for disagreement instead of immediately turning it into a majority vote.",
          "Suppose one reviewer accepts a reply because it quotes the policy accurately, while another rejects it because that policy applies to a different customer tier. The useful result is a sharper condition: the system must establish which tier applies before offering the remedy. Update the expected behavior and examples accordingly. Some disagreements require an authoritative domain decision; others remain unresolved and should limit what the product currently promises."
        ]
      },
      {
        "heading": "Work through a disputed release",
        "text": [
          "Return to the hypothetical support assistant. The proposed release adds answers about account refunds. Reviewers agree that the generated wording is usually clear, but disagree about a case involving a customer whose subscription changed halfway through the billing period. Treating the dispute as an annotation problem would invite a corrected label and another evaluation run. First establish whether the applicable refund rule is actually defined. If the rule is unresolved, changing the label would manufacture certainty that the organization does not have.",
          "The domain owner could resolve the rule, or the release owner could exclude this situation from supported automated replies. Suppose the team chooses the second option. The commitment becomes specific: provide policy-backed drafts for unambiguous refund cases; identify a mid-period plan change and route it to a support specialist. Engineering then needs an observable way to recognize the condition, and evaluation needs both cases that should be routed and nearby cases that should remain answerable. The record should also explain the cost: more human handling and a narrower feature. A successful release is now judged against that explicit agreement, not against a larger promise the evidence never supported."
        ]
      },
      {
        "heading": "Give evaluation a route into the work",
        "text": [
          "An evaluation function needs more than a dataset and a reporting deadline. Its findings must arrive where they can change discovery, implementation, and release decisions. A recurring policy error might require a clearer user interaction, different source selection, a software control, or a narrower supported task. The appropriate response depends on how the failure arose.",
          "Keep the cases and observations close to those decisions. A useful finding explains what happened, under which conditions, why it matters, and what remains unknown. Preserve the relevant product and system versions so the team can revisit the evidence. Evaluation specialists can maintain sound measurement and investigation practices while product, domain, and engineering contributors remain involved in the judgments that require their knowledge."
        ]
      },
      {
        "heading": "Keep the learning loop owned as well",
        "text": [
          "Production will introduce requests and conditions the team did not anticipate. Decide who examines these observations, how consequential failures are escalated, and who can change scope, implementation, or evaluation coverage. A collected trace creates little value if it never reaches someone able to act on it. A support complaint becomes useful engineering knowledge when its circumstances and consequences are understood.",
          "Begin with one important decision and one shared review of real cases. A small team may need a short discussion and a clear written record. A larger organization may need explicit handoffs between functions. Scale the arrangement to the work. The aim is to make quality a capability that people can exercise together, with enough ownership that difficult questions lead to a decision and enough perspective that important failures remain visible."
        ]
      },
      {
        "heading": "Choose the lightest arrangement that can decide",
        "text": [
          "There are legitimate alternatives to a separate evaluation function. A small product team may combine domain review, implementation, and evaluation in a shared working session. A larger organization may need specialists to maintain sampling methods and common tooling across products. Centralizing those capabilities can reduce duplicated work, but it can also distance the evaluator from the actual task. Embedding every evaluator can improve context while making methods inconsistent. The useful design question is where judgment depends on local knowledge and where shared expertise makes that judgment stronger.",
          "The recommendation would change if the decisions were already clear and the recurring failures came entirely from a narrow technical defect. In that situation, rebuilding the operating model would add work around a problem that needs an engineering fix. Similarly, familiar reversible changes rarely justify a new committee. Examine whether the arrangement shortens unresolved decisions, preserves important dissent, and turns production findings into changes. If it mainly produces meetings and ownership charts, simplify it. The point of explicit ownership is an exercised decision right with visible reasoning, not a larger organizational structure."
        ]
      }
    ]
  },
  {
    "slug": "a-smaller-useful-experiment",
    "title": "The useful next step is often a smaller experiment",
    "category": "Product thinking",
    "standfirst": "Before committing to an AI feature, identify the uncertainty that could change your direction. Then choose the smallest investigation that can credibly address it.",
    "tags": [
      "Discovery",
      "Experiments",
      "Product decisions",
      "Uncertainty"
    ],
    "sourceNotes": [
      "ai/operating-model/operating-model.md",
      "ai/discovery/uncertainty-ladder.md",
      "ai-engineering/approach/experimentation.md",
      "var/consulting/capacity-perspective.md"
    ],
    "sections": [
      {
        "heading": "A feature proposal contains several bets",
        "text": [
          "Consider a company exploring an assistant for employees who need to find internal policies. The proposal sounds straightforward: let people ask a question and receive an answer. Behind it are several assumptions. Employees must have a problem worth addressing. The necessary information must exist and be accessible. The system must distinguish current policy from old guidance. People must be able to use its answer without spending the same effort checking everything themselves.",
          "Building a complete assistant tests these assumptions together at considerable cost. A more useful opening question is which uncertainty could change the decision to proceed. If the company has conflicting policy documents and no way to identify the authoritative version, an interface prototype will not resolve the central issue. Investigate the condition that could invalidate the approach before elaborating the surrounding product."
        ]
      },
      {
        "heading": "Investigate the assumption that blocks the next move",
        "text": [
          "The order of investigation follows the consequence of being wrong. A difficult assumption is not automatically the most important one. A technically impressive capability may be irrelevant if employees already solve the task easily, while a mundane permissions problem may make the entire proposal unusable. Ask what work would be wasted, what obligation would become impossible, or what harm could follow if each assumption failed. Give attention to uncertainties that could change the next commitment and for which additional evidence is obtainable.",
          "This reasoning also explains why the smallest experiment is not always the right experiment. A tiny convenience sample may only confirm that the system works on the questions its builders expected. A more demanding investigation may be necessary to expose a dependency on missing information or unusual operating conditions. Economize on construction that does not contribute evidence. Preserve the variety, realism, and independent assessment needed to challenge the claim. Reducing the scope of the claim is often more honest and useful than weakening the investigation while leaving a broad claim in place."
        ]
      },
      {
        "heading": "Name the decision before the method",
        "text": [
          "A question such as whether AI works for policy search is too broad to guide an experiment. A narrower decision might be whether to invest in a prototype that answers one category of leave-policy questions. The critical assumption could be that the available documents contain enough unambiguous information for those answers. Now the team can choose an appropriate investigation: examine representative questions and trace each expected answer to its source.",
          "Write down what a result would change. Consistent source coverage might justify testing an answering workflow. Missing policy decisions might send the work back to the document owners. Frequent exceptions might suggest a tool that helps people locate and interpret passages rather than producing a final answer. The result should have a route into the next commitment, including a route that stops the proposed solution."
        ]
      },
      {
        "heading": "Small still has to be credible",
        "text": [
          "The smallest useful experiment preserves the conditions needed to answer its question. Convenient examples can make an approach look promising while avoiding the reason it might fail. For the policy assistant, include ambiguous wording, recently changed documents, and questions whose answers depend on employee circumstances. The selection should reflect the proposed scope and the consequences of getting it wrong.",
          "Some questions can be explored manually. Others need a running interaction, controlled comparisons, or observation of people doing real work. An interview can uncover a frustrating search experience; it cannot establish that a generated answer will reduce checking effort. Choose the cheapest credible evidence for the particular claim. Record what the investigation leaves unknown so that an encouraging result does not quietly become permission for a much broader product."
        ]
      },
      {
        "heading": "A worked decision for the policy assistant",
        "text": [
          "Suppose the immediate decision is whether to spend the next development cycle on leave-policy assistance. Before building an answering service, the team examines a deliberately varied set of recent, appropriately de-identified questions with a policy specialist. For each question, they record the relevant employee conditions, the authoritative passage, any unresolved exception, and the action the employee needs to take. This is a diagnostic exercise: it can reveal why answers are difficult, but it is not yet an estimate of how frequently each difficulty occurs across the workforce.",
          "Imagine three patterns emerge. Some questions have a clear answer that is hard to locate. Others require facts only the employee can supply. A third group exposes conflicting internal guidance. These observations support different next steps: compare source navigation with generated explanations for the first group; test a short clarification flow for the second; obtain a policy decision for the third. A prototype covering the first two groups should state that boundary and preserve routing for the third. If almost all useful questions instead depended on unresolved guidance, the sensible decision could be to pause the assistant. The investigation earns its cost by changing the shape or timing of the work."
        ]
      },
      {
        "heading": "Keep alternatives alive long enough to learn",
        "text": [
          "An assistant is one possible response to the policy problem. A better document index, a structured eligibility form, or clearer policy ownership might address part of it. Comparing meaningful alternatives can expose where the value actually comes from. The useful comparison follows the work employees need to complete, including finding the answer, checking its applicability, and taking the next action.",
          "Suppose people can locate the relevant policy quickly but struggle to understand which exception applies. Improving retrieval alone may contribute little. A source-backed explanation with visible conditions could be worth exploring. If the difficulty is an unresolved company rule, the next step may be a policy decision. An experiment is valuable when it helps distinguish these explanations, even when the most useful response turns out to be simple software or a change in the work itself."
        ]
      },
      {
        "heading": "Let evidence set the next commitment",
        "text": [
          "After an experiment, separate what was observed from what was inferred. Keep the cases, conditions, criteria, and important counterexamples. A small trial may justify another investigation or a limited prototype. It rarely settles every question about usage, operating cost, reliability, or long-term benefit. As exposure and consequences grow, the evidence needed for the next decision should grow with them.",
          "Give the learning a concrete consequence: continue with a bounded scope, change the design, investigate a different assumption, or stop. Revisit the original problem when observations challenge its explanation. This makes experimentation part of product development rather than an activity alongside it. The next useful artifact might be a sharper question or a rejected approach. When it saves the team from building on a weak assumption, that is tangible progress."
        ]
      },
      {
        "heading": "Know when to build, and when to revise the claim",
        "text": [
          "Sometimes a small implementation is itself the cheapest credible investigation. Existing infrastructure, reversible behavior, and easily checked outcomes may make building faster than arranging a separate study. A familiar text transformation with a clear acceptance rule might need a short technical comparison and ordinary engineering validation. The argument for smaller experiments is strongest when uncertainty could invalidate substantial work. It does not imply that every feature needs a discovery phase or that more analysis always improves the decision.",
          "Define a stopping point for investigation as carefully as for implementation. Continue learning while another observation could reasonably change the choice and is worth its cost. Commit when the remaining uncertainty fits the scope and consequences of the next step, with a way to observe what happens. Reverse the recommendation if a supposedly cheaper experiment removes the conditions that matter, repeatedly produces inconclusive findings, or delays an easy-to-reverse trial that would answer the question directly. Evidence should make a decision more defensible. If the study becomes an excuse to postpone a decision indefinitely, its design has lost that purpose."
        ]
      }
    ]
  },
  {
    "slug": "the-interface-is-part-of-the-ai-system",
    "title": "The interface is part of the AI system",
    "category": "Building AI",
    "standfirst": "People need to inspect, correct, and steer AI-assisted work. The interface determines whether those interventions are possible and what happens when a suggestion becomes an action.",
    "tags": [
      "Human–AI collaboration",
      "Interface design",
      "Draft state",
      "System boundaries"
    ],
    "sourceNotes": [
      "ai/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui.md",
      "ai/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop.md",
      "ai/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates.md",
      "ai/dialogue-approach/02-draft-pipeline/09-workflow-evolution-and-autonomy.md"
    ],
    "sections": [
      {
        "heading": "An answer is only one part of the interaction",
        "text": [
          "Imagine an expense application that accepts a short request: record yesterday’s train ticket. Interpreting the sentence is useful, but it leaves several questions. Which date does yesterday refer to? What was the amount and currency? Which account paid? Is the ticket already recorded? The application must help the person resolve these questions and understand what will change.",
          "A conversational answer can explain the proposed entry. A visible form can make the date, amount, account, and category easier to check and edit. A confirmation control can distinguish reviewing the proposal from saving it. These are engineering decisions about the system’s behavior. The interface determines which misunderstandings are exposed, which corrections are practical, and how much control the person retains during the task."
        ]
      },
      {
        "heading": "Give the work a visible draft",
        "text": [
          "Maintain a draft that can be enriched and corrected over several steps. It should show what is known, what is missing, and which values came from an inference or default. If the application guessed the account, the person should be able to see and change that choice without restating the entire request. A correction should update the same work in progress.",
          "The draft also creates a stable object for the rest of the system. A tool can identify matching accounts, a validator can reject an invalid amount, and the person can supply missing information. Those changes should be reflected in one coherent state. Distinguish a draft that is complete enough to review from an action that is authorized to execute. Filling every field does not by itself establish the person’s intent to save it."
        ]
      },
      {
        "heading": "Follow one draft through a correction",
        "text": [
          "In a hypothetical expense flow, the person types, “Train ticket yesterday, 24 euros, paid with my travel card.” The application can propose a date, amount, currency, and account, but these fields have different grounds. The amount was explicit; the date depends on the relevant timezone; the account must be matched to an actual account the person can use. Showing the same confidence treatment for every field would conceal these differences. A compact draft can expose the interpreted date and matched account while keeping the original request available for inspection.",
          "Now suppose the person changes the amount to 42. The draft must carry that correction into validation and execution. A background model response based on the earlier message must not silently restore 24, and a confirmation of the earlier draft must not authorize the new amount. One possible implementation uses draft versions: updates apply to a known version, and confirmation identifies the reviewed version. Other implementations can enforce the same invariant. The important property is that a person can trace their correction to the proposed change and then to the stored result. Without it, an editable interface can create an impression of control that the underlying system fails to preserve."
        ]
      },
      {
        "heading": "Match the interaction to the operation",
        "text": [
          "Language is useful for an open request or a question that needs clarification. A list is useful for choosing among accounts. A form supports precise edits. A comparison view can reveal differences between several proposed changes. The interaction can move among these forms while preserving the person’s goal and the current draft.",
          "Consider a request to update several recurring expenses. Reading a paragraph that describes every change may make mistakes hard to spot. A table can show the current and proposed amounts together, allow individual rows to be excluded, and keep the remaining changes visible before confirmation. Evaluate whether people can understand and correct the proposal in realistic conditions. A fluent explanation contributes little if the interface makes the consequential details difficult to inspect."
        ]
      },
      {
        "heading": "Structure has a cost as well as a benefit",
        "text": [
          "A structured draft makes known fields inspectable, but the schema can also constrain what the person is able to express. An expense may involve a split payment, a refund, or a reimbursement that the current form cannot represent. Forcing that request into the nearest familiar shape produces a tidy wrong answer. Keep a path for clarification, unsupported requests, and a change of task. The system should be able to say that its current action type does not capture the intended work.",
          "An open conversational workspace is a reasonable alternative for exploration where the output is an idea, explanation, or rough document. A compact form may be enough when the task and required fields are stable. A hybrid design earns its complexity when people need both expressive input and precise control of application state. Test that choice with actual corrections: locating a mistaken value, changing it, understanding what else changed, and completing the task. A beautiful confirmation surface is not evidence of effective review if the relevant fields are difficult to find or the person cannot explain the resulting action."
        ]
      },
      {
        "heading": "Make authority an application property",
        "text": [
          "The system needs an explicit boundary between proposing a change and making it. For the expense example, application rules can check the amount, confirm that an account belongs to the user, and require approval of the current draft. If a consequential field changes after approval, the prior approval should not silently cover the revised action. The accepted proposal and executed change need to remain connected.",
          "The amount of intervention should fit the consequence and the authority the person has granted. Requiring repetitive confirmation for every harmless operation can make useful signals disappear into routine clicking. At the same time, broad conversational agreement should not be stretched to cover an unexpected action. Define what the application may do, under which conditions, and how the person can inspect, interrupt, or revoke that authority."
        ]
      },
      {
        "heading": "Design the path after uncertainty and failure",
        "text": [
          "The interface should distinguish a suggestion, a pending operation, a completed change, and a failed attempt using application state. A generated sentence saying that an expense was saved does not establish that persistence succeeded. If a request times out, the person needs a way to find out whether the entry exists before retrying and potentially creating a duplicate.",
          "Include these conditions in evaluation. Can people correct the wrong account? Can they resume an unfinished draft? Do they understand when a change has actually happened? Can they recover without repeating the entire task? Follow the effort through review, correction, and completion. An AI interface works well when it gives people useful leverage over the whole job, with enough visibility and control to intervene where their knowledge matters."
        ]
      },
      {
        "heading": "Increase autonomy through explicit task boundaries",
        "text": [
          "Repeated review can become a burden when the application handles familiar, low-consequence work under well-established rules. A person might choose to allow an import to categorize recurring transactions automatically while keeping unusual cases for review. That permission should describe the task, relevant limits, and a way to inspect and undo the result where reversal is possible. The system can then distinguish work within the granted authority from a new decision. Model confidence alone does not establish that authority or guarantee that the person would accept the consequence.",
          "The appropriate interaction would change if observations showed that the review step adds substantial effort without helping people detect meaningful errors. Possible responses include a clearer comparison, a narrower task, stronger application checks, or bounded automation with visible history. Conversely, repeated unnoticed corrections or uncertainty about completed actions argues for more visibility and a more explicit execution boundary. Evaluate these possibilities against the whole task, including accessibility and recovery. The design claim is conditional: visible drafts and structured control help when they make consequential state understandable and correctable. They should be simplified or replaced when evidence shows a better way to preserve those properties."
        ]
      }
    ]
  },
  {
    "slug": "a-faster-coding-agent-changes-the-work",
    "title": "A faster coding agent changes the work around it",
    "category": "Teams & practice",
    "standfirst": "When implementation gets faster, specification, review, and project understanding may become the constraint. Measure the accepted change and improve the workflow around it.",
    "tags": [
      "Coding agents",
      "Engineering practice",
      "Project understanding",
      "Evaluation"
    ],
    "sourceNotes": [
      "ai-engineering/working-assumptions.md",
      "ai-engineering/coding-agents/coding-agent-experimentation-primer.md",
      "ai-engineering/coding-agents/project-ownership.md",
      "ai-engineering/coding-agents/comprehension.md"
    ],
    "sections": [
      {
        "heading": "Follow the change beyond code generation",
        "text": [
          "Imagine a coding agent that can produce a plausible implementation of a maintenance request much faster than the team previously could. The draft change arrives quickly. A maintainer still has to clarify the intended behavior, check its fit with the surrounding system, assess the tests, and decide whether to accept it. If that review reveals misunderstood requirements, the team also needs to reconstruct the problem and revise the implementation.",
          "The useful job is a software change that can be accepted, operated, and maintained. Generating code is one part of it. Faster generation can improve that job, but the size of the improvement depends on what happens around it. Observe the complete path before treating an agent’s execution time or volume of output as a measure of engineering progress."
        ]
      },
      {
        "heading": "Notice where the constraint moves",
        "text": [
          "A team may find that implementation used to dominate small changes. Once drafts become plentiful, review queues, ambiguous requests, unreliable local setup, or slow validation can become more visible. The work has changed shape. Adding more generation may increase unfinished work if maintainers cannot understand and assess the incoming changes at the same pace.",
          "Take a representative change and record the effort spent framing it, supplying context, supervising execution, reviewing the result, and correcting mistakes. Include integration and later rework when those matter to the decision. Separate time spent waiting from human effort. A long unattended operation and a short operation requiring constant intervention place different demands on the team. These observations help identify the next workflow improvement instead of assuming that every delay belongs inside the agent."
        ]
      },
      {
        "heading": "Work through a seemingly small invoice change",
        "text": [
          "Consider a hypothetical request to add a branch prefix to invoice numbers. An agent quickly updates the formatter and its unit tests. A reviewer then discovers that invoice identifiers also appear in exports, a customer search endpoint, and an integration that assumes the old format. Concurrent requests may depend on a database constraint unrelated to display formatting. The original draft could be locally correct while the accepted product change remains unfinished. The relevant missing work is identifying the contract and checking its dependents.",
          "A better task boundary might separate the displayed reference from the internal identifier, state which external formats must remain compatible, and identify the evidence needed for concurrent creation. The team can then ask the agent to investigate those paths before proposing a patch. That investigation takes time, so code may arrive later. The approach is worthwhile if it reduces misunderstanding and total acceptance effort while preserving the required behavior. If the change genuinely affects only presentation, the extra investigation can be shortened. The lesson is to follow the actual dependencies of the request rather than assuming either that every change is simple or that every change requires an architectural exercise."
        ]
      },
      {
        "heading": "Make the repository easier to investigate",
        "text": [
          "Useful repository context explains how to run the project, where important behavior lives, and which constraints a change must preserve. Keep it accurate enough that both a person and an agent can use it to investigate. An instruction file can point to relevant documentation and validation commands; it should not become a growing substitute for clear code, dependable tools, and maintained design decisions.",
          "For example, a change to invoice numbering may depend on a uniqueness rule, a migration convention, and behavior under concurrent requests. A task description that mentions only the visible formatting change leaves important context unstated. Expose those constraints and make the relevant evidence accessible. The goal is to improve the user–repository–agent system. Whether a new instruction, document, or tool helps is a question to examine against actual tasks."
        ]
      },
      {
        "heading": "Keep acceptance connected to understanding",
        "text": [
          "A confident explanation can help a maintainer investigate a change, but acceptance still needs evidence appropriate to the behavior. Inspect the affected path, compare it with the intended outcome, and examine failure conditions. Tests should challenge the requirement and important constraints. Tests that repeat an implementation’s assumptions can pass while leaving the underlying misunderstanding intact.",
          "For core product code, someone accountable for the system needs enough understanding to explain why the change belongs and how it can evolve. That understanding can be distributed across maintainers, tests, documentation, and operational evidence. Agents can help build and retrieve it. Accepting changes while repeatedly postponing comprehension allows complexity to accumulate beyond the team’s ability to judge the next proposal. Keep changes small enough that the acceptance decision remains meaningful."
        ]
      },
      {
        "heading": "Make understanding an acceptance capability",
        "text": [
          "Understanding does not require a maintainer to memorize every line. It requires enough of a working model to assess the important invariants, dependencies, and failure consequences of the proposed change. For the invoice example, the reviewer should be able to explain what makes an identifier unique, which clients observe it, and what happens when creation is retried. A focused explanation linked to code, tests, and observed behavior can help establish that model. An agent can assemble those references, but its explanation should remain a hypothesis to check against the repository.",
          "The required depth depends on the future obligation. An isolated conversion script with a saved input and a checkable output may be acceptable with a narrow contract and careful inspection of the result. A change to shared payment logic creates a continuing obligation to diagnose failures and evolve the behavior. Requiring the same comprehension ritual for both wastes attention; accepting both on output alone ignores the second obligation. Make review depth proportional to the role of the code, the reversibility of errors, and the strength of independent checks. Distributed understanding is workable when ownership makes the relevant knowledge reachable for the next decision."
        ]
      },
      {
        "heading": "Test workflow improvements as local claims",
        "text": [
          "Suppose the team believes a shorter instruction file will reduce unnecessary agent work. Define the comparison before trying it: the kinds of maintenance tasks, the repository conditions, the expected improvement, and the quality that must be preserved. Observe accepted task completion, human corrections, unintended changes, and relevant execution cost. Keep task wording, tool access, and agent version as comparable as practical when attributing an effect.",
          "A useful result may support the change for a narrow task category, expose a tradeoff, or leave the question unresolved. Repeated runs can reveal variability that a single successful session hides. Preserve counterexamples and revisit the recommendation when the workflow changes. The durable improvement comes from turning faster implementation into a better engineering system: clearer tasks, accessible evidence, proportionate validation, and maintainers who can still understand what they accept."
        ]
      },
      {
        "heading": "What would change the workflow recommendation",
        "text": [
          "The bottleneck claim is conditional. Some teams already have clear requests, strong validation, and review capacity, so faster implementation may translate directly into shorter delivery. Other teams will find that environment setup or waiting for decisions dominates the work. A recommendation to slow generation or add documentation would be misplaced in either case unless the observations justify it. Start with the constraint that is actually limiting accepted changes. Possible responses include better task boundaries, smaller patches, dependable local tooling, a different review arrangement, or more parallel implementation.",
          "Keep a few counterexamples alongside the successful tasks. If additional repository instructions reduce corrections but increase irrelevant investigation, decide whether the tradeoff is acceptable for the target work. If a proposed review step rarely changes a decision and duplicates strong automated checks, simplify it. If supposedly independent tests share the agent’s mistaken interpretation, strengthen acceptance evidence. Revisit the conclusion when the model, task mix, repository, or maintainers change. A workflow improvement is a claim about that combined system under particular conditions. Its credibility comes from exposing how it could fail and checking whether the complete engineering job actually improved."
        ]
      }
    ]
  }
];
