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

export function buildEcosystemLinks(registry: RegistryBundle, projectId: string): EcosystemLink[] {
  const allProjects = registry.projects.projects;
  const current = allProjects.find((project) => project.id === projectId);

  if (!current) {
    throw new Error(`Unknown project: ${projectId}`);
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
