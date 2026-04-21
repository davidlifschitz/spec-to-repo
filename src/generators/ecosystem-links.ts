type ProjectRecord = {
  id: string;
  name: string;
  repo: string;
  role: string;
  dependencies?: string[];
  description?: string;
};

type RegistryBundle = {
  projects: { projects: ProjectRecord[] };
};

export type EcosystemLink = {
  id: string;
  repo: string;
  role: string;
  reason: string;
};

const DEFAULT_BACKBONE_IDS = ['agentic-os', 'spec-to-repo', 'children-of-israel-agent-swarm', 'graphify'];

export function buildEcosystemLinks(registry: RegistryBundle, projectId: string): EcosystemLink[] {
  const allProjects = registry.projects.projects;
  const current = allProjects.find((project) => project.id === projectId);

  if (!current) {
    return allProjects
      .filter((project) => DEFAULT_BACKBONE_IDS.includes(project.id))
      .map((project) => ({
        id: project.id,
        repo: project.repo,
        role: project.role,
        reason:
          project.id === 'agentic-os'
            ? 'Control-plane source of truth for registries and contracts'
            : project.id === 'spec-to-repo'
              ? 'Bootstrap generator for the first ecosystem scaffold flow'
              : project.id === 'children-of-israel-agent-swarm'
                ? 'Delegated execution engine for long-running or wrapped tasks'
                : 'Shared memory and artifact retrieval layer for emitted outputs'
      }));
  }

  const dependencies = new Set(current.dependencies ?? []);

  return allProjects
    .filter((project) => project.id !== current.id)
    .filter((project) => dependencies.has(project.id) || (project.dependencies ?? []).includes(current.id))
    .map((project) => ({
      id: project.id,
      repo: project.repo,
      role: project.role,
      reason: dependencies.has(project.id)
        ? `Direct dependency for ${current.id}`
        : `${project.id} depends on ${current.id}`
    }));
}
