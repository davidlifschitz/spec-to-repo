import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export type RegistryBundle = {
  projects: { version: string; projects: Array<Record<string, unknown>> };
  skills: { version: string; skills: Array<Record<string, unknown>> };
};

export type FetchRegistryOptions = {
  localAgenticOsRoot?: string;
  projectRegistryPath?: string;
  skillRegistryPath?: string;
  remoteBaseUrl?: string;
  githubToken?: string;
};

async function fetchText(url: string, token?: string): Promise<string> {
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function readLocal(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export async function fetchAgenticRegistry(options: FetchRegistryOptions = {}): Promise<RegistryBundle> {
  const localRoot = options.localAgenticOsRoot ?? process.env.AGENTIC_OS_LOCAL_ROOT;
  const projectRegistryPath = options.projectRegistryPath ?? 'registry/projects.yaml';
  const skillRegistryPath = options.skillRegistryPath ?? 'registry/skills.yaml';

  if (localRoot) {
    const projectText = readLocal(path.join(localRoot, projectRegistryPath));
    const skillText = readLocal(path.join(localRoot, skillRegistryPath));

    return {
      projects: YAML.parse(projectText),
      skills: YAML.parse(skillText)
    };
  }

  const baseUrl = options.remoteBaseUrl
    ?? process.env.AGENTIC_OS_BASE_URL
    ?? 'https://raw.githubusercontent.com/davidlifschitz/agentic-os/main';

  const token = options.githubToken ?? process.env.GITHUB_TOKEN;
  const [projectText, skillText] = await Promise.all([
    fetchText(`${baseUrl}/${projectRegistryPath}`, token),
    fetchText(`${baseUrl}/${skillRegistryPath}`, token)
  ]);

  return {
    projects: YAML.parse(projectText),
    skills: YAML.parse(skillText)
  };
}
