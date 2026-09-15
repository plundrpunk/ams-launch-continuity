// Every visible string on the page lives here so it can be audited in one place
// against DESIGN.md section 0 (verified facts) and section 1 (binding rules).

export const links = {
  startFree: "https://automaton-memory.com/Automaton-Abots.html#free-tier",
  whitepaper: "https://automaton-memory.com/whitepaper.html",
  github: "https://github.com/plundrpunk/automaton-abotv2",
  discord: "https://discord.gg/8fsh4TUw4",
  site: "https://automaton-memory.com/",
} as const;

// One label per CTA intent, page-wide.
export const cta = {
  start: "Start free",
  docs: "Read the whitepaper",
  community: "Join the Discord",
  code: "View on GitHub",
} as const;

export const nav = {
  brand: "Automaton Memory System",
  skip: "Skip to content",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  items: [
    { label: "Memory", href: "#memory" },
    { label: "The loop", href: "#loop" },
    { label: "Evidence", href: "#evidence" },
    { label: "Pricing", href: "#pricing" },
  ],
} as const;

export const hero = {
  line1: "Every run starts from zero.",
  line2: "Until something remembers.",
  subtext:
    "Automaton Memory System gives agent teams durable memory: what happened, what it means, and how to do it again.",
} as const;

export const story = {
  ariaLabel: "How memory changes a run",
  captions: [
    {
      label: "Disconnected runs",
      text: "Each session starts cold, repeats the same investigation, and forgets what it learned.",
    },
    {
      label: "Durable memory",
      text: "Events, knowledge, and procedures are recorded, linked, and retrieved inside the right scope.",
    },
    {
      label: "One operating loop",
      text: "The next run starts from the last known position, not from nothing.",
    },
  ],
} as const;

export const tiers = {
  heading: "Three kinds of memory, kept distinct.",
  episodic: {
    name: "Episodic",
    body: "What happened. Sessions, events, decisions, and outcomes. Retained 730 days by default.",
    record: [
      ["memory_tier", "episodic"],
      ["entity_type", "event"],
      ["importance", "0.90"],
      ["ttl_days", "730"],
      ["tags", "deploy, receipts, rollback"],
      ["file_path", "02_Episodic_Log/2026-09-13_prod-deploy.md"],
    ],
    caption: "Record shape from the live schema. Values illustrative.",
  },
  semantic: {
    name: "Semantic",
    body: "What it means. Durable knowledge that gives the next agent a grounded starting point. Kept until superseded.",
  },
  procedural: {
    name: "Procedural",
    body: "How to do it again. Reviewed procedures and executable automata, each carrying a Wilson-score confidence interval.",
    // The single permitted middle dot on the page.
    figure: "vps_health_check_v2 · 22,422 executions · 99.97% success",
    caption: "Live automaton metrics, measured September 15, 2026.",
  },
} as const;

export const loop = {
  heading: "The operating loop.",
  cards: [
    {
      verb: "Recall",
      body: "A session bootstraps and searches memory before it acts. Vector plus keyword, fused by reciprocal rank, filtered by scope.",
      code: [
        'bootstrap_session({ project: "fleet-autonomy" })',
        'search_memories({ query: "dispatch timeout root cause", memory_tier: "procedural" })',
      ],
    },
    {
      verb: "Act",
      body: "The agent works with grounded context. Execution and permissions stay with your runtime or with AOS. Memory informs. It does not authorize.",
      code: ['execute_automaton({ name: "vps_health_check_v2" })'],
    },
    {
      verb: "Record",
      body: "Outcomes are written back through admission control. Seven checks before anything becomes durable.",
      code: [
        'create_memory({ memory_tier: "episodic", entity_type: "event", importance: 0.9 })',
        'create_memory_link({ relation: "decision" })',
      ],
    },
    {
      verb: "Resume",
      body: "A continuation hands the next session its goal, next action, blockers, and priority memories. The next session claims it and continues.",
      code: ["create_continuation({ next_action, blockers, priority_memories })", "claim_continuation()"],
    },
  ],
  note: "Tool names are the real MCP surface. Arguments are illustrative.",
} as const;

export const evidence = {
  heading: "Measured against raw long context. Same model. Same tasks.",
  vs: "vs",
  figures: [
    { value: "0.50", against: "0.30", label: "task success rate" },
    { value: "$33.28", against: "$41.46", label: "cost per run set" },
  ],
  benchmark: {
    columns: ["Condition", "Success", "Path score", "Cost"],
    rows: [
      ["AMS H-MEM", "0.50", "0.7764", "$33.28"],
      ["Pure long-context baseline", "0.30", "0.5532", "$41.46"],
      ["Delta", "+0.20", "+0.22", "19.7% lower"],
    ],
    caption:
      "MemoryArena held-out math tasks 10 to 19. Judge: claude-sonnet-4-6. March 25, 2026. Broader-domain claims are left off this page until they replicate.",
  },
  safety: {
    heading: "Memory-safety harness.",
    columns: ["Condition", "Poisoning", "Leakage", "Blocked"],
    rows: [
      ["Naive memory", "1.00", "1.00", "0.00"],
      ["User-scoped memory", "0.50", "0.00", "0.80"],
      ["Defended memory", "0.00", "0.00", "1.00"],
    ],
    caption: "Synthetic offline harness. No third-party audit or certification is implied.",
  },
} as const;

export const boundary = {
  statement: "Memory is not permission.",
  body: "Automaton Memory System holds context. AOS governs execution: policy, trust tiers, approvals, audit. A remembered procedure never grants the right to act.",
  caption:
    "Bayesian trust scoreboard in the Automaton dashboard. Wilson-score intervals tighten as repeated work runs. Dashboard snapshot, April 2026.",
} as const;

export const interfaces = {
  eyebrow: "MCP, REST, CLI",
  heading: "Headless by design. It meets your agents where they already work.",
  body: "Claude Code, Codex, Cursor, Slack agents, internal agents, custom ABots. Stable umbrella tools over MCP, REST, and CLI.",
  listLabel: "MCP tool names",
  tools: [
    "bootstrap_session",
    "search_memories",
    "create_memory",
    "create_memory_link",
    "get_memory_links",
    "create_continuation",
    "claim_continuation",
    "complete_continuation",
    "what_worked",
    "list_automata",
    "execute_automaton",
  ],
} as const;

export const pricing = {
  heading: "Start free. Grow into governed execution.",
  period: "per month",
  free: { name: "Free", price: "$0", includes: "2 custom ABots, 100 memories." },
  professional: { name: "Professional", price: "$199", includes: "100,000 memories, 500 automata." },
  runtime: { name: "Runtime add-on (AOS)", price: "+$299", includes: "Orchestration, approvals, traces." },
  enterprise: { name: "Enterprise", price: "from $999", includes: "Multi-tenancy, RBAC, self-host." },
  pilot: "Design-partner pilot: 3 slots, $500 per month for 90 days.",
} as const;

export const closing = {
  heading: "Stop starting over.",
  body: "Durable memory for agent teams, from Dead Reckoning Foundry.",
} as const;

export const footer = {
  copyright: "© 2026 Dead Reckoning Foundry",
  siteLabel: "automaton-memory.com",
} as const;

export const alt = {
  mark: "Automaton Memory System hexagonal mark",
  logo: "Automaton Memory System",
  layers: "Layered glass and steel plates with cool light passing through the gaps.",
  scoreboard:
    "Automaton dashboard showing the Smart Actions Bayesian trust scoreboard: totals, success rate, and per-category success percentages with confidence-interval widths.",
  hex: "Machined hexagonal steel component resting on dark basalt.",
} as const;
