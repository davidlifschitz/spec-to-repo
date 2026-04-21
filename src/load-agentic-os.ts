import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export type RegistryBundle = {
  projects: { projects: Array<Record<string, unknown>> };
  skills: { skills: Array<Record<string, unknown>> };
};

export type BootstrapTask = Record<string, any>;

function readText(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function resolveAgenticOsRoot(explicitRoot?: string) {
  if (explicitRoot) return explicitRoot;
  if (process.env.AGENTIC_OS_ROOT) return process.env.AGENTIC_OS_ROOT;
  return path.resolve(process.cwd(), '..', 'agentic-os');
}

export function loadRegistryBundle(agenticOsRoot: string): RegistryBundle {
  return {
    projects: YAML.parse(readText(path.join(agenticOsRoot, 'registry', 'projects.yaml'))),
    skills: YAML.parse(readText(path.join(agenticOsRoot, 'registry', 'skills.yaml')))
  } as RegistryBundle;
}

export function loadBootstrapTask(agenticOsRoot: string, taskPath?: string): BootstrapTask {
  const resolvedTaskPath = taskPath
    ? path.resolve(taskPath)
    : path.join(agenticOsRoot, 'examples', 'tasks', 'bootstrap-spec-to-repo.task.json');

  return JSON.parse(readText(resolvedTaskPath));
}

export function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

export function writeText(filePath: string, value: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, value, 'utf8');
}
