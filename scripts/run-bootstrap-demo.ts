import path from 'node:path';
import { handleTask } from '../src/contracts/task-handler.js';
import {
  ensureDir,
  loadBootstrapTask,
  loadRegistryBundle,
  resolveAgenticOsRoot,
  writeJson,
  writeText
} from '../src/load-agentic-os.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (!current.startsWith('--')) continue;
    const key = current.slice(2);
    const value = args[index + 1] && !args[index + 1].startsWith('--') ? args[++index] : 'true';
    parsed[key] = value;
  }

  return parsed;
}

const args = parseArgs();
const agenticOsRoot = resolveAgenticOsRoot(args['agentic-os']);
const task = loadBootstrapTask(agenticOsRoot, args.task);
const registry = loadRegistryBundle(agenticOsRoot);
const outputRoot = path.resolve(args.output ?? 'demo-output/bootstrap-spec-to-repo');

ensureDir(outputRoot);

const result = handleTask(task, registry as any);

writeJson(path.join(outputRoot, 'task.json'), task);
writeJson(path.join(outputRoot, 'artifacts', 'normalized-spec.artifact.json'), result.normalizedSpecArtifact);
writeJson(path.join(outputRoot, 'artifacts', 'implementation-plan.artifact.json'), result.implementationPlanArtifact);
writeJson(path.join(outputRoot, 'artifacts', 'repo-scaffold.artifact.json'), result.scaffoldArtifact);
writeJson(path.join(outputRoot, 'artifacts', 'bootstrap-issues.artifact.json'), result.issuePackArtifact);

for (const file of result.files) {
  writeText(path.join(outputRoot, 'generated-repo', file.path), file.content);
}

writeJson(path.join(outputRoot, 'generated-repo', 'issue-pack.json'), result.issues);
writeJson(path.join(outputRoot, 'summary.json'), {
  task_id: task.task_id,
  task_type: task.task_type,
  output_root: outputRoot,
  generated_files: result.files.map((file: { path: string }) => file.path),
  artifact_types: [
    result.normalizedSpecArtifact.artifact_type,
    result.implementationPlanArtifact.artifact_type,
    result.scaffoldArtifact.artifact_type,
    result.issuePackArtifact.artifact_type
  ]
});

console.log(JSON.stringify({
  ok: true,
  task_id: task.task_id,
  output_root: outputRoot,
  artifact_ids: [
    result.normalizedSpecArtifact.artifact_id,
    result.implementationPlanArtifact.artifact_id,
    result.scaffoldArtifact.artifact_id,
    result.issuePackArtifact.artifact_id
  ]
}, null, 2));
