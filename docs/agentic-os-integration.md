# agentic-os integration

## Purpose

`spec-to-repo` consumes the control-plane contracts defined in `agentic-os` and turns a shared `repo.bootstrap` task into runnable bootstrap outputs.

## Inputs pulled from agentic-os

- `registry/projects.yaml`
- `registry/skills.yaml`
- `examples/tasks/bootstrap-spec-to-repo.task.json`

## Runnable demo

```bash
npm install
npm run bootstrap:demo
```

Optional flags:

```bash
npm run bootstrap:demo -- --agentic-os ../agentic-os --output demo-output/bootstrap-spec-to-repo
```

## Outputs

The demo writes:

- `artifacts/normalized-spec.artifact.json`
- `artifacts/implementation-plan.artifact.json`
- `artifacts/repo-scaffold.artifact.json`
- `artifacts/bootstrap-issues.artifact.json`
- `generated-repo/` scaffold files
- `summary.json`

## Integration rule

Cross-repo links in the generated scaffold should come from the project registry rather than hardcoded repo maps.
