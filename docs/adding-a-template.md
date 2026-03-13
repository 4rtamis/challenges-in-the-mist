# Adding a Template

This project expects every new template to be implemented as a self-contained module and then registered once.

## Folder layout

Create a new folder:

```text
src/templates/<game>/<template>/
```

Recommended files:

```text
definition.tsx
model.ts
schema.ts
sample.ts
toml.ts
hooks.ts
editor/
preview/
```

Use the Legend challenge module at `src/templates/legend/challenge/` as the reference implementation.

## Required implementation steps

### 1. Define the template state

In `model.ts`, define:

- the document type
- the template-specific `view` type
- the template-specific `sheet` type
- blank/default factories

Keep `view` limited to appearance/export concerns and `sheet` limited to editor selection state.

### 2. Add validation and sample data

In `schema.ts`:

- build a Zod schema for import/export validation
- normalize loose input where needed

In `sample.ts`:

- export one rich example object for the landing screen

### 3. Add import/export helpers

In `toml.ts`:

- implement TOML import and export
- validate through the schema
- return warnings for soft issues that should not block import

If the template needs extra exports beyond TOML/image, implement those as export actions in `definition.tsx`.

### 4. Build template hooks

In `hooks.ts`:

- use `useActiveTemplateTab(...)` from `src/core/workspace/selectors.ts`
- expose template-friendly hooks that read/write the active tab’s `doc`, `view`, and `sheet`
- keep all writes going through `useWorkspaceStore`

Do not create a second persistence store. The workspace store is the source of truth.

### 5. Build preview and editor UI

In `preview/`:

- create the preview renderer
- keep section click handlers routed through the template sheet hook

In `editor/`:

- create the editor panel that resolves `sheet.target`
- add the form components it needs
- create the appearance panel for template-specific appearance settings

Every clickable preview section should have a matching editor target.

### 6. Register the template

In `definition.tsx`, export a `TemplateDefinition` that wires together:

- identity and labels
- schema
- blank/example creators
- initial view/sheet state
- tab title logic
- landing copy
- section list
- preview renderer
- editor panel
- appearance panel
- export actions

Then add the module to `src/core/templates/registry.tsx`.

## Export actions

Export actions are the extension point for anything beyond basic shell behavior.

Each action should declare:

- `id`
- `label`
- `description`
- optional `renderSettings`
- `run(context)`

Use the provided `context` instead of reaching back into global app state.

## Verification checklist

Before considering a template complete, verify:

- it appears in the left sidebar
- it opens a tab
- landing supports blank/example/import as intended
- preview renders from example data
- clicking preview sections opens the right editor
- editor changes update the preview immediately
- template `view` settings only affect the active tab
- TOML import/export round-trips
- image export works if registered
- reloading restores the tab from workspace local storage
- `npm run build` passes
- `npm run lint` passes

## Rules for humans and LLMs

- Do not add template-specific logic directly in `App.tsx` unless it belongs to all templates.
- Do not recreate the deleted legacy challenge stores.
- If you need a new cross-template capability, extend `TemplateDefinition` first, then update the shared shell.
- Keep the module cohesive: data model, validation, preview, editor, appearance, and export should live together.
