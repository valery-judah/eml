export const articles = [
  {
    slug: 'measure-the-whole-job',
    title: 'Measure the job, not just the model',
    category: 'Product & evaluation',
    readTime: '4 min read',
    standfirst: 'An impressive answer can still create more work. Evaluate the complete workflow to understand whether an AI product makes a useful difference.',
    sections: [
      {
        heading: 'Begin one level above the AI task',
        text: [
          'Consider an assistant that drafts replies for a customer support team. A natural starting point is to ask whether the drafts are accurate, relevant, and well written. Those questions matter. The broader job is to resolve a customer request with an appropriate outcome and a reasonable amount of effort.',
          'The draft sits inside that job. Someone may need to find an order, interpret an exception, check a policy, correct the response, approve a refund, and update another system. Improving the draft changes only part of the work. The product succeeds when the resulting workflow helps people complete the job.'
        ]
      },
      {
        heading: 'Establish a useful baseline',
        text: [
          'Before building, examine a small set of real cases. Follow each one from its trigger to its accepted outcome. Record where time goes, which judgments require expertise, how mistakes are discovered, and what happens after a correction. Include routine cases and situations that make the work difficult.',
          'This baseline gives an experiment something concrete to improve. For the support assistant, it might include time to resolution, reviewer effort, avoidable corrections, and whether the customer needs to contact the team again. The relevant measures depend on the workflow and the decision being made.'
        ]
      },
      {
        heading: 'Separate the claims you need to test',
        text: [
          'A product can produce valid text, apply policy correctly, help an agent finish a case, and reduce overall effort. Each is a different claim. A test of policy accuracy can support the second claim. It cannot establish the others without observing the conditions that make them true.',
          'Build an evaluation around the next decision. If the question is whether to change retrieval, compare the relevant behavior under controlled conditions. If the question is whether the assistant helps the team, observe people using it to complete representative cases. Record the limits of each finding alongside its result.'
        ]
      },
      {
        heading: 'Look for the work that moved',
        text: [
          'An AI intervention can move effort between steps. Faster drafting may increase the volume waiting for review. A helpful summary may still require opening every source. Automation may remove repetitive entry while creating a queue of ambiguous exceptions.',
          'Follow these changes through the workflow. Include review, corrections, coordination, model and infrastructure costs, and recovery from mistakes. A useful improvement should survive this fuller account. When a new constraint appears, it becomes the next design question rather than an inconvenient detail to exclude from the measurement.'
        ]
      },
      {
        heading: 'Keep the evidence close to the decision',
        text: [
          'Preserve the cases, system version, criteria, and observations behind a comparison. A single average can conceal an important difference between routine work and exceptions. Review those groups separately when that distinction affects what users can rely on.',
          'The next step may be a wider release, a narrower promise, another experiment, or a different solution. The purpose of evaluation is to make that choice better. Start with one job, one meaningful decision, and enough evidence to see whether the work actually improved.'
        ]
      }
    ]
  },
  {
    slug: 'from-demo-to-production',
    title: 'What changes after the demo?',
    category: 'Delivery & operations',
    readTime: '4 min read',
    standfirst: 'A prototype helps a team learn. A production product creates obligations. Make those obligations explicit before people begin depending on the system.',
    sections: [
      {
        heading: 'Name the commitment',
        text: [
          'A useful demo answers a question: can this interaction work, can these sources support an answer, or can a model perform a difficult step? Production asks another set of questions. What can users depend on? In which situations? Who responds when the product falls short?',
          'The transition begins with a decision to support defined behavior in real use. A polished interface, deployed endpoint, or successful example does not make that decision on its own. The team needs a shared description of the promise and the responsibilities that come with it.'
        ]
      },
      {
        heading: 'Choose a small, complete scope',
        text: [
          'An initial release can be narrow. An expense assistant might support common purchases in one currency before handling transfers, adjustments, and unusual accounting cases. That smaller scope gives the team a tractable set of situations to engineer, evaluate, and observe.',
          'Within that scope, the whole interaction still needs to work. Users should be able to inspect the proposed entry, correct it, confirm the change, and recover if persistence fails. The promise includes the path through uncertainty and failure as well as the successful output.'
        ]
      },
      {
        heading: 'Write down the boundaries',
        text: [
          'Describe supported inputs, expected outcomes, unacceptable failures, and operating constraints. Decide what happens when information is missing, sources disagree, a tool is unavailable, or the request falls outside the supported scope. These situations should lead to an intentional product response.',
          'Identify which rules can be enforced directly in software. Permissions, required confirmations, schema validation, and guarded changes to business state deserve explicit implementation. Model instructions and behavioral evaluation can support the system while those controls enforce the boundaries they are designed to protect.'
        ]
      },
      {
        heading: 'Make the evidence reviewable',
        text: [
          'Build cases from the situations the release promises to handle. Include ordinary work, important exceptions, and conditions that challenge the boundaries. Capture enough of each execution to understand the inputs, retrieved material, tool results, decisions, and final effects.',
          'Review the evidence against the stated promise. Keep product expectations separate from the current implementation so a convenient model output does not quietly become the definition of correctness. Record what was tested, what remains uncertain, and why the proposed exposure is reasonable.'
        ]
      },
      {
        heading: 'Prepare to operate the promise',
        text: [
          'Before release, establish observation, ownership, fallback, and recovery. Someone should be able to detect a consequential failure, understand which users and configurations were affected, limit further exposure, and restore a usable workflow. These arrangements can be simple when the scope is small.',
          'Release then becomes a controlled way to learn from actual conditions. Watch whether the behavior holds and whether the workflow provides the intended benefit. A production finding may call for an engineering change, better evaluation coverage, or a revised product promise. Reserve time and responsibility for making those decisions after launch.'
        ]
      }
    ]
  },
  {
    slug: 'context-is-part-of-the-system',
    title: 'Context is part of the system',
    category: 'Systems & context',
    readTime: '4 min read',
    standfirst: 'Useful AI behavior depends on the information available at each step. Treat retrieval, memory, tools, and working state as decisions you can inspect and evaluate.',
    sections: [
      {
        heading: 'Start with the consuming task',
        text: [
          'A model receives an information environment: instructions, a request, selected sources, conversation history, tool definitions, and sometimes a record of earlier work. Context engineering concerns how that environment is assembled and maintained for the task at hand.',
          'Begin by asking who or what will use the information next. A person investigating a disagreement may need original passages and their surrounding sections. A system extracting an invoice may need a small set of fields and validation rules. A broad answer is not always the useful next operation.'
        ]
      },
      {
        heading: 'Make the first route inspectable',
        text: [
          'Choose a bounded source collection and a few realistic tasks. Build a route that makes it clear what was searched, what matched, which material was selected, and what entered the next step. A simple starting point makes it easier to see which additional machinery would solve an actual problem.',
          'For an exact identifier, literal search and original source passages may be enough. A request expressed in different vocabulary may justify semantic retrieval. The useful baseline depends on the task. Preserve the intermediate results so a fluent final answer does not become the only indication that the information was found.'
        ]
      },
      {
        heading: 'Preserve meaning and provenance',
        text: [
          'Information changes as documents are parsed, split, indexed, ranked, selected, and compressed. Each transformation can affect what the next participant is able to know. A short excerpt may omit an exception. A summary may merge a proposal with an accepted decision. An old policy may look current after its date disappears.',
          'Keep useful links to original sources, versions, and surrounding context. Distinguish instructions, external evidence, generated interpretations, and unresolved hypotheses. Decide what belongs in temporary working context and what deserves durable storage. A retained statement should carry enough information to understand when it applies.'
        ]
      },
      {
        heading: 'Use failures to locate the next experiment',
        text: [
          'When an answer fails, inspect the route before changing the prompt. Was the source absent from the collection? Did parsing lose a relevant table? Did retrieval miss a passage? Did selection exclude it? Did compression remove the qualification? Or did the model misuse information that was present?',
          'These are different problems. Change one consequential choice and compare the result on cases that expose it. Keep source snapshots and surrounding conditions comparable when attributing an improvement. Examine what the change removes as well as what it adds, including review effort, latency, and cost.'
        ]
      },
      {
        heading: 'Evaluate the assembled context',
        text: [
          'Finding useful material does not guarantee that the actual model input is adequate. Check what survives selection, ordering, formatting, and compression. Then evaluate whether the resulting workflow completes its intended job. Retrieval quality and task success inform each other, but they answer different questions.',
          'Make interventions available where they resolve a meaningful uncertainty. A person may need to expand a passage, correct an interpretation, dispute a relevance judgment, or change source scope. Preserve the reason for that intervention. It can improve the current task and suggest a policy to test across future work.'
        ]
      }
    ]
  }
];
