# AGENTS.md

These rules are mandatory for every change in the Weave repository.

## 0. Literal Execution Protocol — highest priority

For every user-requested implementation task:

1. Treat the user's literal wording as the complete design authority for the task.
2. Implement every explicitly stated requirement exactly as written.
3. Do not add, remove, reinterpret, simplify, generalize, "improve", normalize, or complete the design beyond what the user explicitly requested.
4. Do not infer missing visual, behavioral, API, architectural, spacing, sizing, motion, state, theme, or interaction decisions.
5. When any implementation choice is not explicitly determined by:
   - the user's current wording,
   - an already frozen project decision,
   - or an existing component that the user explicitly requires to reuse,
   stop and ask the user before choosing.
6. "Reuse X" means reuse X's actual existing implementation/theme/stylesheet/behavior where technically possible. It does not mean recreate something visually similar to X.
7. Never create a parallel implementation when an existing project implementation already covers the requested concept.
8. Never substitute a different component, visual source, interaction model, motion model, spacing rule, or theme source because it seems cleaner or more appropriate.
9. Never make an unrequested design decision in order to make the result "look better", "feel balanced", "be more conventional", or "be more complete".
10. Before editing, derive a literal requirement checklist from the user's message internally. Every code change must map to one of those requirements or be strictly necessary to make them function.
11. If a necessary change would exceed those requirements, ask first.
12. Validation must test the user's literal requirements, not merely implementation details.
13. Screenshots and observed UI defects are requirements evidence. If the screenshot contradicts the implementation, investigate the actual rendered result instead of assuming the code is correct.
14. Do not mark the task complete until every literal requirement has a corresponding implementation and validation result.
15. When uncertain: do not guess. Ask.

## 1. Reuse before implementation

Before creating or substantially changing a component, hook, renderer, stylesheet, theme resolver, interaction helper, positioning helper, selection model, motion helper, or other infrastructure:

1. Search the existing public components.
2. Search the existing internal helpers.
3. Search the renderer/theme layer.
4. Search existing tests and the authoritative design spec in `Weave UI.md`.

Reuse order:

1. Reuse an existing public component when its semantics and API fit.
2. Otherwise reuse an existing internal primitive/helper.
3. Otherwise rely on browser-native HTML/CSS/DOM behavior where appropriate.
4. Only create a new abstraction when the existing layers cannot express the required behavior.

Do not block valid reuse because of a "basic / composite" component-layer classification. If an existing public component already provides the required semantics or interaction, reuse it directly regardless of those labels.
Do not copy an existing component's implementation and rename or slightly modify it.
Do not create a new shared abstraction merely to avoid reusing an existing component.
Do not create parallel systems for overlay, positioning, presence, focus, selection, navigation, scrolling, layout, motion, theme, or form-control behavior when Weave already has one.

If a requested change would require a new architectural abstraction or would change an existing architectural boundary, stop and ask the user before implementing it.

## 2. Scope discipline

Implement the requested change only.

Do not broaden a task into an architectural refactor because it seems cleaner or more elegant.
If another architectural issue is discovered, report it separately unless fixing it is required for the requested change.

## 3. Repository design authority

`Weave UI.md` is the authoritative framework design specification.

When implementation and specification disagree:
- do not silently choose a new design;
- identify the mismatch;
- ask before changing an architectural decision.

Existing project decisions must be preserved unless the user explicitly changes them.

## 4. Mandatory completion gate

Every task that modifies repository files must follow this sequence:

1. Inspect fresh repository state with `git status --short --branch`.
2. Implement the requested change.
3. Run meaningful validation appropriate to the change.
4. Run typecheck and lint for code changes.
5. Run relevant tests; run the full suite when shared infrastructure or public API is affected.
6. Run build/package verification when public API, declarations, renderer/theme infrastructure, or package output is affected.
7. Run `git add -A`.
8. Commit the change in the same task.
9. Run `pnpm verify:task`.
10. Do not report the task as complete unless `pnpm verify:task` passes.

A modified working tree is an incomplete task.
A staged but uncommitted working tree is an incomplete task.
A failed commit is an incomplete task.
Do not defer the commit to a later task.
Do not push unless the user explicitly asks.

## 5. Truthfulness

Do not claim a command, test, build, commit, or cleanup succeeded unless its result was actually observed.
If tooling prevents completion, state exactly which completion gate remains unsatisfied.

## 6. Audit and review fidelity

When the user asks for an audit, review, inventory, defect list, architecture check, or similar examination, preserve every finding as an independent item.

Do not compress findings into categories, themes, tiers, summaries, "core problems", or a smaller derived list unless the user explicitly asks for that transformation.
Do not replace the complete finding set with a synthesized conclusion at the end.
Do not use a synthesized or grouped version as the basis for later implementation.
When subsequent work is based on an audit, use the original granular findings directly and keep their distinctions intact.
If the user explicitly says not to summarize, do not add any concluding summary, recap, grouping, or restatement.
