# Lantern in the Mist

<p align="center">
  <img src="public/lantern-logo.svg" alt="Lantern in the Mist logo" width="112" />
</p>

<p align="center">
  <strong>Create beautiful, useful, mechanics-first Mist Engine content for session prep and play.</strong>
</p>

<p align="center">
  Lantern in the Mist is a fan-made unofficial local-first web app for game masters who want to quickly build useful, polished, interoperable content for Son of Oak's tabletop roleplaying games <strong>City of Mist</strong>, <strong>Legend in the Mist</strong>, and <strong>:Otherscape</strong>.
</p>

<p align="center">
  No account. No server dependency. Your work stays in your browser and can be exported when you need it.
</p>

## Overview

Lantern focuses on one practical goal: helping GMs turn rough notes into clean, game-ready material without fighting layout tools.

The app is built around reusable template editors so each supported game object can offer:

- structured editing
- live visual preview
- TOML import/export for tool interoperability
- PNG export for universal sharing and printing
- local browser persistence with no account required

Lantern is designed for Mist Engine games by Son of Oak, with support growing template by template over time and with a strong focus on interoperability between tools.

## Screenshots

| City of Mist                                                      | Legend in the Mist                                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------- |
| ![City of Mist danger screenshot](docs/assets/screenshot-com.png) | ![Legend in the Mist challenge screenshot](docs/assets/screenshot-litm.png) |

## Why TOML

Lantern uses **TOML as a global exchange format** so content can move between tools cleanly instead of being trapped inside one editor.

This work aligns with the shared schema effort in [schema-in-the-mist](https://github.com/4rtamis/schema-in-the-mist), with the goal of maximizing compatibility across the Mist Engine ecosystem.

That shared format is meant to support interoperability with tools such as:

- **Foundry VTT systems** for Mist Engine games, when implemented
- [**Brumes**](https://github.com/4rtamis/obsidian-brumes), an Obsidian plugin for Mist Engine systems
- **Mistdraw**, an upcoming ultra-simple whiteboard VTT for Legend in the Mist
- other community tools, scripts, converters, and publishing workflows

In practice, TOML gives Lantern a stable import/export layer for structured data, while **PNG export** makes sure the final result can still be used anywhere: session notes, player handouts, VTT journals, chat, print, or PDFs assembled elsewhere.

## Local-First Workflow

- Everything is stored locally in your browser.
- No account is needed.
- You can start from a blank template, an example document, or imported TOML.
- Implemented templates support exporting structured `.toml` files and rendered `.png` images.
- The goal is fast creation of clean GM-facing content that can still move across the wider Mist Engine toolchain.

## Supported Content

### Implemented now

- **City of Mist**: Danger Profile
- **Legend in the Mist**: Challenges
- **:Otherscape**: _Nothing yet_

### Planned support

- **City of Mist**: Custom Moves, Icebergs, Theme Kits
- **Legend in the Mist**: Journeys and Vignettes, Story Themes, Theme Kits
- **:Otherscape**: Challenges, Theme Kits

## Current Status

> [!WARNING]
> **Early Development Notice**
>
> This app is an early development version and may contain breaking changes in future updates.
>
> It includes material that is copyright Son of Oak Game Studio LLC and/or other authors. It must only be used for personal playtesting purposes and must not be shared for the time being.

Expect active iteration, incomplete template coverage, and format adjustments while the project and the shared schemas stabilize.

## Developer Docs

If you want to work on the editor itself, start here:

- [Codebase Architecture](docs/codebase-architecture.md)
- [Adding a Template](docs/adding-a-template.md)

## Run Locally

Use a recent Node.js LTS release and `npm`.

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run preview
```

Then open the local Vite URL shown in the terminal.

## Project Notes

- The app is built with React, TypeScript, Vite, Zod, Tailwind CSS, and a shared template runtime.
- Workspace tabs are persisted in browser `localStorage`, which keeps editing local and account-free.
- Implemented templates already expose TOML import/export hooks and image export through the shared shell.

## License

The source code in this repository is licensed under the **MIT License**.

This project also contains or references game-specific visual and textual material that is **not covered by MIT**. In particular:

> This work contains material that is copyright of Son of Oak Game Studio LLC and/or other authors.

That includes, for example, certain icons, background images, and other setting- or game-related assets. Those materials remain the property of their respective copyright holders and must be treated separately from the open-source code.

## Acknowledgements

Lantern in the Mist is an unofficial fan-made project inspired by the fantastic work of PixelTable for Darrington Press' [Daggerheart Card Creator](https://cardcreator.daggerheart.com/).
