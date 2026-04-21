# Ecosystem Integration Plan

## Role in the ecosystem

[spec-to-repo](https://github.com/davidlifschitz/spec-to-repo) should be the repo factory and bootstrap layer for the ecosystem. Its job is to convert product specs into initial GitHub repo scaffolds with structure, README content, and pre-populated issues so new ideas can enter the ecosystem in a standardized way.

## Why this repo matters

This repo is one of the highest-leverage pieces in the ecosystem because it shortens the path from idea to structured implementation. Instead of manually creating each new repo, `spec-to-repo` can generate the first version in a way that already aligns with the ecosystem contracts and conventions.

## Connected repos

- [agentic-os](https://github.com/davidlifschitz/agentic-os) — source of shared schemas, repo registry, and ecosystem standards
- [children-of-israel-agent-swarm](https://github.com/davidlifschitz/children-of-israel-agent-swarm) — can take generated scaffolds and continue implementation work
- [ScheduleOS](https://github.com/davidlifschitz/ScheduleOS) — operator shell that should be able to trigger spec-to-repo generation flows
- [graphify](https://github.com/davidlifschitz/graphify) — should graphify generated repos and help validate scaffold completeness
- [davidlifschitz.github.io](https://github.com/davidlifschitz/davidlifschitz.github.io) — can later showcase products that began here
- [autoresearch-genealogy](https://github.com/davidlifschitz/autoresearch-genealogy) — model for turning structured domain concepts into reusable repo templates
- [workout-planner](https://github.com/davidlifschitz/workout-planner) — example of a product repo that could have been scaffolded from a spec
- [Bttr](https://github.com/davidlifschitz/Bttr) — example of a product repo that could have been scaffolded from a spec
- [fastest-growing-finance-repos](https://github.com/davidlifschitz/fastest-growing-finance-repos) — example of a publishable pipeline repo that can inform scaffold patterns

## How this repo should connect

### 1. Consume ecosystem standards from agentic-os

This repo should eventually read from [agentic-os](https://github.com/davidlifschitz/agentic-os), especially:

- shared task contracts
- shared artifact contracts
- repo registry conventions
- product and skill-pack playbooks

Purpose:

- ensure newly created repos already fit the ecosystem
- avoid generating one-off project structures that need cleanup later

### 2. Generate ecosystem-aware repo scaffolds

Generated repos should optionally include:

- `docs/ECOSYSTEM_PLAN.md`
- starter README
- standard issue templates or pre-populated issues
- directories for docs, integrations, schemas, or artifacts where relevant
- links to connected repos based on the spec type

### 3. Hand off generated repos to downstream systems

After scaffold generation:

- [children-of-israel-agent-swarm](https://github.com/davidlifschitz/children-of-israel-agent-swarm) can continue implementation
- [ScheduleOS](https://github.com/davidlifschitz/ScheduleOS) can track status and operator workflows
- [graphify](https://github.com/davidlifschitz/graphify) can analyze the new repo structure

### 4. Support multiple scaffold modes

Useful scaffold types:

- product app
- research/skill pack
- publishing pipeline
- internal tool
- mobile companion
- static GitHub Pages site

## Files to add next

- `docs/scaffold-modes.md`
- `templates/product/`
- `templates/skill-pack/`
- `templates/pipeline/`
- `templates/pages-site/`
- `templates/internal-tool/`
- `docs/agentic-os-integration.md`

## Example flow

1. operator submits a product spec through [ScheduleOS](https://github.com/davidlifschitz/ScheduleOS)
2. `spec-to-repo` parses the spec and selects the correct scaffold mode
3. the new repo is generated with ecosystem-aware defaults
4. [agentic-os](https://github.com/davidlifschitz/agentic-os) records the new repo in the registry
5. [children-of-israel-agent-swarm](https://github.com/davidlifschitz/children-of-israel-agent-swarm) continues implementation
6. [graphify](https://github.com/davidlifschitz/graphify) analyzes the new repo once initialized

## Acceptance criteria

- this repo can generate scaffolds that align with ecosystem conventions
- generated repos can include ecosystem plan docs and connected-repo links automatically
- `spec-to-repo` is documented as the intake/bootstrap layer for new products and internal tools
