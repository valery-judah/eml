// Public teaching examples. All organizations, observations, traces, and numbers
// in these scenarios are synthetic; none are presented as client results.
export const workProducts = [
  {
    slug: 'choosing-an-ai-investment',
    route: '/examples/choosing-an-ai-investment/',
    type: 'INVESTMENT DECISION MEMO',
    title: 'Should we automate the report?',
    description: 'An illustrative AI investment memo: compare complete-job effort, alternatives, uncertainty, and a bounded experiment before committing to a build.',
    standfirst: 'A faster first draft can leave the expensive part of the job untouched. This worked memo shows how to choose the next investment when the demonstration is ahead of the evidence.',
    notice: 'Synthetic example. The organization, observations, and numbers below are invented to demonstrate the method. They are not client work, measured results, or a forecast of savings.',
    question: 'Authorize a full report-drafting build, run a narrower experiment, or improve the existing workflow?',
    recommendation: 'Test source-linked verification first. Defer the full drafting build until an experiment shows a useful improvement in accepted reports.',
    owner: 'The hypothetical service lead owns the investment decision; report reviewers define what an acceptable report requires.',
    journeyId: 'choose-an-investment',
    problemId: 'what-to-build',
    reading: ['/writing/measure-the-whole-job/', '/notes/designing-useful-ai-experiments/', '/papers/evaluation-as-decision-evidence/'],
    sections: [
      {
        heading: '1. The situation and the decision',
        text: [
          'Imagine a professional-services team preparing 80 recurring internal reports each month. Each combines records from several systems, a short narrative, and checks by a domain reviewer. Leadership has seen an AI draft appear in seconds and is considering a broader implementation.',
          'The proposed business outcome is less human effort per accepted report, with factual accuracy and accountable approval preserved. The decision concerns the next development commitment. It does not yet concern autonomous publication or replacing the reviewer.',
          'The available capacity is one bounded investigation before the next planning decision. A useful output must distinguish a promising intervention from an attractive demonstration and leave the team with an actionable next step.'
        ]
      },
      {
        heading: '2. What the available observations establish',
        text: [
          'For this synthetic scenario, assume the team has mapped ten recent routine reports and tried a general drafting assistant on three of them. The table uses rounded illustrative minutes for one comparable accepted report. The assisted column is a working estimate drawn from that tiny exploratory set, not a reliable estimate of the production average.'
        ],
        table: {
          caption: 'Synthetic effort map — active human minutes per accepted routine report',
          columns: ['Work', 'Current workflow', 'Drafting assistant'],
          rows: [
            ['Prepare and reconcile source records', '12 min', '14 min'],
            ['Write the initial narrative', '18 min', '5 min'],
            ['Verify facts, correct, and resolve inconsistencies', '20 min', '30 min'],
            ['Final review and approval', '10 min', '10 min'],
            ['Total active human effort', '60 min', '59 min']
          ]
        },
        after: [
          'The draft appears sooner, but the reviewer spends longer tracing unsupported statements and reconciling sources. In these illustrative cases, 13 minutes less writing is accompanied by 12 minutes more preparation and checking. Elapsed turnaround and waiting for approval have not been measured.',
          'These observations challenge the assumption that writing is the main constraint. They do not establish that AI cannot help, that the one-minute difference is repeatable, or that unusual reports behave like the routine examples.'
        ]
      },
      {
        heading: '3. Compare the actual alternatives',
        text: ['A useful decision includes the current process and simpler interventions. The options below address different possible constraints. Their relative value remains a hypothesis.'],
        table: {
          caption: 'Options and the assumption each would need to justify',
          columns: ['Option', 'Potential benefit', 'Main uncertainty'],
          rows: [
            ['Keep the workflow; clarify templates and source responsibilities', 'Reduce ambiguity and repeated reconciliation with little new software', 'How much checking is caused by inconsistent inputs?'],
            ['Build the general drafting assistant', 'Reduce initial narrative effort', 'Will verification and maintenance consume the gain?'],
            ['Try source-linked extraction and a reviewer checklist', 'Make important facts easier to inspect before drafting', 'Can evidence links reduce total checking effort without increasing omissions?']
          ]
        },
        after: ['The recommendation favors testing verification because the illustrative observations locate substantial effort there. If source inconsistency is the dominant issue, fixing ownership and input structure may be more useful than adding AI. The experiment should keep that alternative visible.']
      },
      {
        heading: '4. The smallest discriminating experiment',
        text: [
          'Use twelve historical reports with accessible source records: eight routine cases and four selected for known exceptions. Keep those groups separate in the analysis; this selection is designed to reveal problems, not estimate their production prevalence. Define the required facts and approval criteria before testing the intervention.',
          'Compare the existing method with a source-linked evidence view on the same underlying cases. Balance reviewer assignment and order where practical; a reviewer who has already solved a case may otherwise make the second method appear easier. Record that learning effect as a limitation if the team cannot control it.'
        ],
        bullets: [
          'Record preparation, verification, correction, approval, and any later rework. Count unsuccessful attempts and the work spent recovering from them.',
          'Have a domain reviewer check required facts against the records. Treat an accepted report, rather than a generated draft, as the unit of completion.',
          'Keep the output in an internal draft environment. Report approval remains with the authorized person; no external delivery is part of this experiment.',
          'Compare the evidence view with the simpler template and source-ownership improvements. Explain which part of an observed gain each could account for.'
        ]
      },
      {
        heading: '5. Decide in advance what would change the plan',
        text: [
          'For this hypothetical planning decision, suppose the service lead considers a repeatable reduction of at least ten human minutes per routine report worth a larger trial. That is a local investigation threshold chosen for this example, not a general rule or a statistical acceptance test.',
          'The quality condition is equally explicit: required facts remain covered, known exceptions are visible, and the reviewer can trace material statements to the relevant record. Any material unsupported statement prompts investigation before expansion. A small sample with no observed failures cannot establish that production failure risk is negligible.'
        ],
        bullets: [
          'Continue to a limited live trial if the effort reduction is consistent enough to investigate further, the quality conditions hold in reviewed cases, and ownership is workable.',
          'Modify the approach if effort merely moves between stages, source preparation dominates, or the benefit depends on a narrow subset of reports.',
          'Stop this implementation direction if review becomes less reliable, source access cannot be provided appropriately, or ongoing costs exceed the plausible benefit.'
        ]
      },
      {
        heading: '6. Bound the economic claim',
        text: [
          'If a future representative trial supported ten minutes less human effort across all 80 monthly reports, the gross recovered capacity would be about 13.3 hours per month: 80 × 10 ÷ 60. With three human hours of monthly maintenance, the illustrative net would be about 10.3 hours before accounting for implementation effort and monetary operating costs.',
          'This is a conditional calculation. The current observations do not support those inputs, and an exception-heavy workload might have a different result. Tooling and inference charges, access and integration work, reviewer training, and the cost of errors belong in the investment decision.',
          'Recovered hours have value only if the team can use them. They may improve turnaround, reduce overtime, or free capacity for another task; they do not automatically become a cash saving. Establish the expected use of that capacity with the decision owner.'
        ]
      },
      {
        heading: '7. Recommendation, ownership, and handoff',
        text: [
          'Recommend the verification experiment and defer the full drafting build. The hypothetical service lead owns the continue, modify, or stop decision. A domain reviewer defines and checks acceptance; an engineer prepares the limited evidence view and records its operating assumptions.',
          'The handoff consists of this memo, the case list and inclusion rationale, the effort log, the acceptance checklist, and the results with unresolved questions. Set the review for when the agreed cases have been examined, with a time limit agreed before work begins. If access or reviewer capacity is unavailable, report that constraint and revisit the plan.',
          'The client can run the next experiment internally with these artefacts. Additional engineering support becomes useful when there is an agreed implementation task or an evidence gap that the team cannot reasonably address itself.'
        ]
      },
      {
        heading: '8. What this memo cannot conclude',
        text: [
          'Every observation in this example is synthetic. Even in a real engagement, a short investigation of selected cases would provide evidence for the next bounded decision, not a validated annual return or a production-readiness certification.',
          'Before expanding, examine a broader workload, important exceptions, source changes, the actual maintenance burden, and how the intervention affects the people responsible for the complete report. The method is useful when it makes those commitments more explicit and directs the next investment toward evidence that could change the decision.'
        ]
      }
    ]
  },
  {
    slug: 'release-readiness-review',
    route: '/examples/release-readiness-review/',
    type: 'RELEASE-READINESS REVIEW',
    title: 'What would justify this release?',
    description: 'An illustrative AI release-readiness review: supported scope, synthetic evidence, a failure investigation, enforced action boundaries, and release conditions.',
    standfirst: 'A support assistant answers familiar questions well, but that alone cannot justify connecting it to customer actions. This review turns an open-ended readiness concern into specific conditions and a bounded recommendation.',
    notice: 'Synthetic example. This fictional support assistant, its traces, and all counts are invented for teaching. This is an illustrative work product, not a client case study or evidence of product safety.',
    question: 'Release autonomous customer support, allow an internal draft pilot, or keep the system in development?',
    recommendation: 'Keep customer-facing release blocked. Consider a draft-only internal pilot only after access, abstention, and approval controls pass the agreed checks.',
    owner: 'The hypothetical product owner makes the release commitment with engineering, support-domain, and operational owners.',
    journeyId: 'investigate-an-existing-system',
    problemId: 'production-readiness',
    reading: ['/writing/from-demo-to-production/', '/notes/diagnosing-ai-product-failures/', '/notes/designing-evaluation-coverage/'],
    sections: [
      {
        heading: '1. Define the commitment being reviewed',
        text: [
          'Imagine a support assistant that retrieves internal policy, drafts a response, and can call a tool to change an account. A demonstration handles common questions, and the team would like to make it available to customers. The first useful distinction is between helping a support agent prepare an answer and making an external commitment on its own.',
          'For this review, the candidate internal pilot supports authenticated staff preparing answers to routine policy questions. Material policy statements need a current supporting source. Questions requiring an account judgment or unsupported policy interpretation must be escalated.',
          'Autonomous outbound messages, refunds, account changes, and access to unrelated customer records are outside the proposed pilot. The corresponding capabilities must be absent or denied in its runtime configuration. A prompt asking the model to avoid them is insufficient.'
        ]
      },
      {
        heading: '2. Inspect evidence against each claim',
        text: [
          'Assume the fictional team reviewed 24 selected executions in a staging environment. Reviewers recorded behavior against explicit expectations and retained links to input, retrieval, action, and output records. The cases deliberately emphasize boundaries, so these counts describe this constructed review set rather than the distribution of customer traffic.'
        ],
        table: {
          caption: 'Synthetic review set — evidence for the proposed internal pilot',
          columns: ['Situation', 'Observed in selected cases', 'Implication'],
          rows: [
            ['Routine policy questions — 10 cases', '9 supported drafts; 1 uses a stale policy', 'Source freshness is an unresolved release condition'],
            ['Missing or conflicting policy — 6 cases', '4 escalate; 2 give a confident unsupported answer', 'Abstention behavior needs correction and wider review'],
            ['Requests involving another account — 4 cases', 'Application access checks deny all 4 attempts', 'Some boundary evidence; authorization coverage remains incomplete'],
            ['Account-change requests — 4 cases', '3 stop for review; 1 invokes a tool without confirmation', 'Action approval is not reliably enforced']
          ]
        },
        after: [
          'A single overall pass rate would obscure the significance of the action failure. The review keeps routine usefulness, policy support, access control, and action authority as distinct claims. Consequences and required mechanisms differ.',
          'Unreviewed conditions include new policy versions, timeouts, concurrent sessions, prompt injection in retrieved content, and the complete staff recovery path. Record these as gaps. Absence from the sample gives no evidence that the system handles them.'
        ]
      },
      {
        heading: '3. Reconstruct one consequential failure',
        text: [
          'In synthetic case ACTION-04, the authenticated requester asks to close an account. The expected behavior is a draft explaining the next step, with any consequential action requiring a separately authorized confirmation. The retained execution shows the following sequence.'
        ],
        table: {
          caption: 'Synthetic trace ACTION-04 — observation separated from explanation',
          columns: ['Stage', 'Retained evidence', 'What it supports'],
          rows: [
            ['Input', 'Requester asks for immediate account closure', 'The request includes a consequential state change'],
            ['Retrieval', 'A policy excerpt describes eligibility for closure', 'The excerpt supplies policy context, not permission to act'],
            ['Tool proposal', 'The assistant proposes close_account(account_id)', 'The model attempts an action outside draft preparation'],
            ['Application execution', 'The dispatcher invokes the tool without an approval token', 'The execution path lacks the required confirmation check'],
            ['Result', 'The staging account state changes; a confirmation answer follows', 'The failure is an executed state change, not just problematic wording']
          ]
        },
        after: [
          'The earliest demonstrated control failure is the dispatcher accepting an action without the required authorization state. Possible contributors include an over-permissive tool configuration and inadequate separation between retrieved policy and executable authority. This trace alone cannot establish why the model chose the call.',
          'The intervention therefore begins at the action boundary. A prompt edit may affect proposals, but it cannot establish that an unauthorized proposal will be rejected. Preserve this case as a regression and add contrast cases for confirmed, expired, replayed, and differently scoped approvals.'
        ]
      },
      {
        heading: '4. Separate a draft pilot from action authority',
        text: ['The pilot policy below is a proposed application contract. Engineering must implement and test its enforcement; this table itself grants no permission.'],
        table: {
          caption: 'Proposed internal-pilot action and information boundaries',
          columns: ['Capability', 'Pilot rule', 'Enforcement and evidence'],
          rows: [
            ['Read policy', 'Use approved, current policy available to the staff role', 'Server-side source selection, version metadata, and retrieval records'],
            ['Read account context', 'Only the account and fields authorized for this case', 'Authorization at the data service, with denied-access tests'],
            ['Prepare an answer', 'Create an internal draft with sources and unresolved questions', 'Staff-only destination and reviewable execution record'],
            ['Send to the customer', 'An authorized person reviews and sends separately', 'No outbound-send capability in the pilot runtime'],
            ['Change account or issue refund', 'Unavailable in the pilot', 'Action tools removed or denied independently of model instructions']
          ]
        },
        after: ['If actions are introduced later, scope authorization to the authenticated person, intended resource, exact operation, and confirmation state. Enforce it at execution time. Review replay protection, expiration, idempotency where relevant, and the recovery path as part of that separate release decision.']
      },
      {
        heading: '5. Prioritize the work needed for a decision',
        text: ['Each finding needs an owner, an intervention, and an observation that could show whether it worked. The following assignments belong to the fictional team.'],
        table: {
          caption: 'Proposed work before considering the bounded internal pilot',
          columns: ['Finding and owner', 'Required change', 'Verification'],
          rows: [
            ['Action authority — engineering lead', 'Remove or deny state-changing and outbound tools in the pilot', 'Exercise actual dispatcher paths, including direct unauthorized calls'],
            ['Unsupported answers — product and support-domain owners', 'Define escalation expectations and correct the relevant retrieval and response behavior', 'Review missing, conflicting, and adversarial source cases against agreed expectations'],
            ['Stale policy — source owner', 'Select current approved policy and retain the version used', 'Test superseded documents, updates, and unavailable-version behavior'],
            ['Evidence and recovery — operations owner', 'Provide usable traces, staff reporting, a stop mechanism, and a manual fallback', 'Reconstruct a failed execution and rehearse reverting to the existing workflow']
          ]
        },
        after: ['Some changes may be independently useful even if the pilot is postponed. Better source ownership and a reproducible action boundary improve the team’s ability to investigate later proposals. New capabilities remain outside scope until their additional commitments are reviewed.']
      },
      {
        heading: '6. State the release conditions and the next review',
        text: [
          'The current evidence does not justify customer-facing release. A draft-only internal pilot becomes a candidate after the named controls are implemented, critical regression and boundary checks pass, and the owners accept the remaining limits. The decision record must link to that new evidence rather than treating planned changes as completed work.',
          'The initial pilot would involve a defined staff group and task population, with every draft reviewed. The existing support workflow remains available. Review representative routine and exception cases, including unsuccessful attempts; observe accepted answers, total human effort, unsupported statements, escalation, and recovery work.'
        ],
        bullets: [
          'Pause immediately for unauthorized access or an executed action outside the pilot boundary. Investigate the path and assess any consequence before resuming.',
          'Investigate material unsupported policy claims and narrow or pause the affected scope when the team cannot reliably contain the consequence.',
          'Continue only while ownership, evidence capture, staff review, and the manual fallback remain workable. A reviewer approval rate alone does not establish answer quality.',
          'Choose the next review date and exposure limit before launch. Expansion requires a separate review of the new scope, evidence, and authority.'
        ]
      },
      {
        heading: '7. What the client receives and can do next',
        text: [
          'A complete handoff contains the supported-scope statement, claim-to-evidence matrix, trace-linked failure records, prioritized findings, required controls, regression cases, owners, and the release recommendation. Links should let a reviewer inspect the basis of a conclusion without relying on the consultant’s recollection.',
          'The hypothetical product owner can use that package to hold the release, authorize the bounded pilot after the conditions are met, or assign the work internally. An implementation engagement is appropriate when the team needs help delivering the agreed controls, evaluation, or operational changes.',
          'The receiving engineer and operations owner must understand the affected paths and how to disable the pilot. Knowledge transfer is part of completion; a polished report by itself cannot substitute for an operable system.'
        ]
      },
      {
        heading: '8. Limits of this review',
        text: [
          'The scenario and every observation above are synthetic. In real work, a bounded readiness review still establishes only what its scope, cases, access, and judgment support. Selected examples cannot estimate rare-event risk or certify the entire product.',
          'The review would need additional work for broader customer access, new data classes, autonomous tools, a different model, or materially changed sources and operating conditions. The recommendation remains conditional on evidence that the agreed controls actually work and on a team able to own the resulting commitment.'
        ]
      }
    ]
  }
];
