# Codebase Architecture

## High-level flow

Lantern is structured around a shared template shell plus template modules.

1. The left sidebar lists templates from `src/core/templates/registry.tsx`.
2. Clicking a template creates a workspace tab in `src/core/workspace/store.ts`.
3. The app shell in `src/App.tsx` renders a shared landing screen or editing layout.
4. Implemented templates provide preview, editor, appearance, and export panels through the `TemplateDefinition` contract in `src/core/templates/types.ts`.
5. Workspace tabs persist to local storage as `{ doc, view, sheet }`, which makes autosave generic across templates.

## Core subsystems

### Template contract

`TemplateDefinition` is the main extension API.

Each template owns:

- document schema and import/export adapters
- blank/example factories
- initial `view` and `sheet` state
- tab title logic
- preview renderer
- editor panel renderer
- appearance panel renderer
- export actions

The app shell owns:

- routing
- tab lifecycle
- landing workflow
- layout
- mobile/desktop inspector behavior
- shared export tab chrome

### Workspace

`src/core/workspace/store.ts` is the single source of truth.

Every open tab stores:

- `doc`: template data
- `view`: appearance/export preferences
- `sheet`: editor selection/open state

The workspace store also handles:

- persistence to `localStorage`
- active tab selection
- tab close/open behavior
- legacy migration from the old challenge autosave key

`src/core/workspace/selectors.ts` exposes generic typed selectors like `useActiveTemplateTab(...)` so templates can read typed state without forcing the workspace to know each template’s schema.

### Shared shell

Shared UI lives under `src/core/templates/shell/`.

- `TemplateLanding.tsx`: blank/example/import launcher
- `TemplateInspector.tsx`: right sidebar shell
- `TemplateExportPanel.tsx`: shared export action tabs

These files should stay template-agnostic. If a feature is only valid for one template, put it in that template module and expose it through the contract.

## Challenge template layout

The reference implementation lives in `src/templates/legend/challenge/`.

- `definition.tsx`: registry entry and export actions
- `model.ts`: document/view/sheet types
- `schema.ts`: Zod validation
- `sample.ts`: example document
- `toml.ts`: TOML import/export
- `hooks.ts`: workspace-backed template hooks
- `editor/`: challenge editor panels/forms
- `preview/`: challenge preview components and stylesheet

The challenge module is the model to follow when adding new templates.

## Data flow

### Preview click to editor

1. A preview block calls `openSheet(...)` from the template hook layer.
2. That updates the active tab’s `sheet` state in the workspace store.
3. The shared inspector stays mounted and the template editor panel reacts to the new `sheet.target`.
4. Form edits update the active tab’s `doc`.
5. The preview re-renders from the same workspace state.

### Import/export

Import:

1. The shared landing dialog calls `template.io.importToml(...)`.
2. The template validates and normalizes the document.
3. The workspace tab’s `doc` is replaced and the tab switches to editing mode.

Export:

1. The shared export panel renders the template’s registered export actions.
2. Each action receives `{ doc, view, sheet, fileStem, getPreviewNode }`.
3. Template actions decide how to serialize or capture the current state.

## Contribution rules

- Treat `TemplateDefinition` as the public boundary. Don’t add template-specific branches in `App.tsx` or the shared shell unless the capability is truly cross-template.
- Keep workspace state generic. Template-specific selectors belong in the template module, not in `src/core/workspace/store.ts`.
- Put template-specific styles, forms, and preview blocks inside the template folder.
- Prefer deleting replaced glue instead of leaving parallel implementations behind.
- Keep comments short and structural: explain ownership boundaries, data flow, or tricky invariants.
