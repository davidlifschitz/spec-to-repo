import { runBootstrapTaskFromPaths } from '../src/bootstrap/run-bootstrap-task.js';

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
const result = runBootstrapTaskFromPaths({
  agenticOsRoot: args['agentic-os'],
  taskPath: args.task,
  outputRoot: args.output
});

console.log(JSON.stringify({
  ok: result.ok,
  task_id: result.task_id,
  output_root: result.output_root,
  artifact_ids: result.artifact_ids
}, null, 2));
