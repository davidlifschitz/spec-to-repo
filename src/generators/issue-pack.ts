export type BootstrapIssue = {
  title: string;
  body: string;
  labels: string[];
};

export function generateIssuePack(projectName: string, projectRole: string): BootstrapIssue[] {
  return [
    {
      title: `Bootstrap ${projectName} core scaffold`,
      body: `Create the initial file structure and align it to the ${projectRole} role.`,
      labels: ['bootstrap', 'scaffold']
    },
    {
      title: `Wire ${projectName} into agentic-os contracts`,
      body: 'Consume the shared task and artifact contracts from agentic-os.',
      labels: ['contracts', 'integration']
    },
    {
      title: `Add first end-to-end task flow`,
      body: 'Implement one representative task and emit a schema-valid artifact.',
      labels: ['execution', 'artifact']
    }
  ];
}
