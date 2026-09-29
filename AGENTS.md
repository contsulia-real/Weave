# AGENTS.md

These rules are mandatory for every change in the Weave repository.

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
