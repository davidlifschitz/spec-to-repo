import { buildEcosystemLinks } from './ecosystem-links.js';

export type GenerateScaffoldInput = {
  projectName: string;
  projectId: string;
  projectRole: string;
  summary: string;
  templateId?: string;
  requestedFiles?: string[];
  includeIssueTemplates?: boolean;
  linkToEcosystem?: boolean;
};

export type GeneratedFile = {
  path: string;
  content: string;
};

type RegistryBundle = {
  projects: {
    projects: Array<{
      id: string;
      name: string;
      role: string;
      repo: string;
      dependencies?: string[];
    }>;
  };
};

function chooseTemplateDirectory(role: string): string {
  switch (role) {
    case 'platform-core':
    case 'repo-factory-bootstrap-layer':
      return 'templates/platform-core';
    case 'wellness-product-surface':
    case 'product-surface':
      return 'templates/product-surface';
    case 'genealogy-research-skill-pack':
    case 'vertical-skill-pack':
      return 'templates/vertical-skill-pack';
    case 'public-finance-intelligence-pipeline':
    case 'public-pipeline':
      return 'templates/public-pipeline';
    default:
      return 'templates/product-surface';
  }
}

export function generateRepoScaffold(input: GenerateScaffoldInput, registry: RegistryBundle): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const templateDirectory = chooseTemplateDirectory(input.projectRole);
  const links = input.linkToEcosystem ? buildEcosystemLinks(registry, input.projectId) : [];

  files.push({
    path: 'README.md',
    content: `# ${input.projectName}\n\n${input.summary}\n\nTemplate: ${input.templateId ?? templateDirectory}\n`
  });

  files.push({
    path: 'docs/ECOSYSTEM_PLAN.md',
    content: [
      '# Ecosystem Integration Plan',
      '',
      `## Role in the ecosystem`,
      '',
      `${input.projectName} is being scaffolded as a ${input.projectRole}.`,
      '',
      '## Connected repos',
      '',
      ...links.map((link) => `- [${link.id}](https://github.com/${link.repo}) — ${link.reason}`)
    ].join('\n')
  });

  for (const requestedFile of input.requestedFiles ?? []) {
    if (requestedFile === 'README.md' || requestedFile === 'docs/ECOSYSTEM_PLAN.md') continue;
    files.push({
      path: requestedFile,
      content: `// TODO: scaffold ${requestedFile} for ${input.projectName}\n`
    });
  }

  files.push({
    path: 'scaffold-manifest.json',
    content: JSON.stringify({
      project_name: input.projectName,
      project_id: input.projectId,
      project_role: input.projectRole,
      template_directory: templateDirectory,
      linked_repos: links
    }, null, 2) + '\n'
  });

  return files;
}
