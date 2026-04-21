# Scaffold modes

## Current sprint mode: bootstrap backbone demo

The current runnable path is intentionally narrow. It proves that `spec-to-repo` can:

- load registry contracts from `agentic-os`
- consume the shared `repo.bootstrap` task example
- generate ecosystem-aware scaffold files
- emit standard bootstrap artifacts for downstream execution and memory indexing

## Output buckets

### Generated repo files

Starter files written under `generated-repo/` for the target project.

### Bootstrap artifacts

Schema-aligned artifact payloads written under `artifacts/`.

### Summary surface

A compact `summary.json` that downstream tools can wrap or register.

## Future modes

- interactive spec ingestion
- remote repo creation
- template family expansion
- human review checkpoints
- multi-project scaffold plans

Those can be added after the backbone loop is proven end to end.
