export type ArtifactRecord = {
  schema_version: '1.0.0';
  artifact_id: string;
  artifact_type: string;
  title: string;
  description: string;
  origin_project: 'spec-to-repo';
  created_by: { actor_type: 'service'; actor_id: 'spec-to-repo' };
  created_at: string;
  visibility: 'private' | 'internal' | 'public';
  status: 'draft' | 'active';
  storage: { storage_type: 'inline'; mime_type: string };
  content: { format: 'json' | 'markdown'; json?: Record<string, unknown>; text?: string; summary?: string };
  metadata: { project_id: 'spec-to-repo'; task_id: string; skill_id: string; tags: string[] };
  lineage: { source_task_ids: string[]; source_artifact_ids: string[] };
};

function makeArtifactId(prefix: string): string {
  return `artifact_${prefix}_${Date.now()}`;
}

export function emitArtifact(
  artifactType: string,
  title: string,
  taskId: string,
  skillId: string,
  payload: Record<string, unknown>,
  description = ''
): ArtifactRecord {
  return {
    schema_version: '1.0.0',
    artifact_id: makeArtifactId(artifactType.replace(/[^a-z0-9]+/gi, '_').toLowerCase()),
    artifact_type: artifactType,
    title,
    description,
    origin_project: 'spec-to-repo',
    created_by: { actor_type: 'service', actor_id: 'spec-to-repo' },
    created_at: new Date().toISOString(),
    visibility: 'private',
    status: 'active',
    storage: { storage_type: 'inline', mime_type: 'application/json' },
    content: { format: 'json', json: payload, summary: title },
    metadata: { project_id: 'spec-to-repo', task_id: taskId, skill_id: skillId, tags: ['bootstrap'] },
    lineage: { source_task_ids: [taskId], source_artifact_ids: [] }
  };
}
