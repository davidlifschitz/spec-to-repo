import { generateIssuePack } from '../generators/issue-pack.js';
import { generateRepoScaffold } from '../generators/repo-scaffold.js';
import { emitArtifact } from './artifact-emitter.js';

type RegistryBundle = {
  projects: { projects: Array<Record<string, unknown>> };
  skills: { skills: Array<Record<string, unknown>> };
};

type BootstrapTask = {
  task_id: string;
  task_type: 'repo.bootstrap';
  routing: { skill_id?: string };
  payload: {
    project_name: string;
    project_role: string;
    template_id?: string;
    requested_files?: string[];
    include_issue_templates?: boolean;
    link_to_ecosystem?: boolean;
    summary?: string;
  };
};

export function isBootstrapTask(task: Record<string, any>): task is BootstrapTask {
  return task?.task_type === 'repo.bootstrap' && typeof task?.payload?.project_name === 'string';
}

export function handleTask(task: BootstrapTask, registry: RegistryBundle) {
  if (!isBootstrapTask(task)) {
    throw new Error('Unsupported task payload for spec-to-repo');
  }

  const projectId = String(task.payload.project_name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const scaffoldFiles = generateRepoScaffold({
    projectName: task.payload.project_name,
    projectId,
    projectRole: task.payload.project_role,
    summary: task.payload.summary ?? `Scaffold for ${task.payload.project_name}`,
    templateId: task.payload.template_id,
    requestedFiles: task.payload.requested_files,
    includeIssueTemplates: task.payload.include_issue_templates,
    linkToEcosystem: task.payload.link_to_ecosystem
  }, registry);

  const issues = generateIssuePack(task.payload.project_name, task.payload.project_role);

  return {
    normalizedSpecArtifact: emitArtifact(
      'normalized-spec',
      `${task.payload.project_name} normalized spec`,
      task.task_id,
      task.routing.skill_id ?? 'spec-parse',
      task.payload
    ),
    implementationPlanArtifact: emitArtifact(
      'implementation-plan',
      `${task.payload.project_name} implementation plan`,
      task.task_id,
      task.routing.skill_id ?? 'repo-scaffold-generate',
      {
        phases: [
          'Bootstrap registry-aware scaffold',
          'Wire task and artifact contracts',
          'Add first runnable workflow'
        ]
      }
    ),
    scaffoldArtifact: emitArtifact(
      'repo-scaffold',
      `${task.payload.project_name} scaffold`,
      task.task_id,
      task.routing.skill_id ?? 'repo-scaffold-generate',
      { files: scaffoldFiles }
    ),
    issuePackArtifact: emitArtifact(
      'bootstrap-issues',
      `${task.payload.project_name} issue pack`,
      task.task_id,
      task.routing.skill_id ?? 'repo-scaffold-generate',
      { issues }
    ),
    files: scaffoldFiles,
    issues
  };
}
