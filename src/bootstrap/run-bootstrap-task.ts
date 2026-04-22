import path from 'node:path';
import { handleTask } from '../contracts/task-handler.js';
import {
  ensureDir,
  loadBootstrapTask,
  loadRegistryBundle,
  resolveAgenticOsRoot,
  writeJson,
  writeText
} from '../load-agentic-os.js';

type BootstrapTaskInput = Parameters<typeof handleTask>[0];
type BootstrapRegistryBundle = Parameters<typeof handleTask>[1];

type BootstrapArtifact = {
  artifact_id: string;
  artifact_type: string;
};

export type BootstrapRunSummary = {
  task_id: string;
  task_type: string;
  output_root: string;
  generated_files: string[];
  artifact_types: string[];
};

export type BootstrapRunResult = BootstrapRunSummary & {
  ok: true;
  artifact_ids: string[];
};

export type BootstrapPathOptions = {
  agenticOsRoot?: string;
  taskPath?: string;
  outputRoot?: string;
};

function toSummary(task: BootstrapTaskInput, outputRoot: string, files: Array<{ path: string }>, artifacts: BootstrapArtifact[]): BootstrapRunSummary {
  return {
    task_id: task.task_id,
    task_type: task.task_type,
    output_root: outputRoot,
    generated_files: files.map((file) => file.path),
    artifact_types: artifacts.map((artifact) => artifact.artifact_type)
  };
}

export function runBootstrapTask(
  task: BootstrapTaskInput,
  registry: BootstrapRegistryBundle,
  outputRoot: string
): BootstrapRunResult {
  ensureDir(outputRoot);

  const result = handleTask(task, registry);
  const artifacts = [
    result.normalizedSpecArtifact,
    result.implementationPlanArtifact,
    result.scaffoldArtifact,
    result.issuePackArtifact
  ];

  writeJson(path.join(outputRoot, 'task.json'), task);
  writeJson(path.join(outputRoot, 'artifacts', 'normalized-spec.artifact.json'), result.normalizedSpecArtifact);
  writeJson(path.join(outputRoot, 'artifacts', 'implementation-plan.artifact.json'), result.implementationPlanArtifact);
  writeJson(path.join(outputRoot, 'artifacts', 'repo-scaffold.artifact.json'), result.scaffoldArtifact);
  writeJson(path.join(outputRoot, 'artifacts', 'bootstrap-issues.artifact.json'), result.issuePackArtifact);

  for (const file of result.files) {
    writeText(path.join(outputRoot, 'generated-repo', file.path), file.content);
  }

  writeJson(path.join(outputRoot, 'generated-repo', 'issue-pack.json'), result.issues);

  const summary = toSummary(task, outputRoot, result.files, artifacts);
  writeJson(path.join(outputRoot, 'summary.json'), summary);

  return {
    ok: true,
    ...summary,
    artifact_ids: artifacts.map((artifact) => artifact.artifact_id)
  };
}

export function runBootstrapTaskFromPaths(options: BootstrapPathOptions = {}): BootstrapRunResult {
  const agenticOsRoot = resolveAgenticOsRoot(options.agenticOsRoot);
  const task = loadBootstrapTask(agenticOsRoot, options.taskPath) as BootstrapTaskInput;
  const registry = loadRegistryBundle(agenticOsRoot) as BootstrapRegistryBundle;
  const outputRoot = path.resolve(options.outputRoot ?? 'demo-output/bootstrap-spec-to-repo');

  return runBootstrapTask(task, registry, outputRoot);
}
