# Spec-to-Repo Scaffolder

**LLM-powered tool that converts product specs into complete GitHub repository scaffolds.**

Paste a product spec, get a full repo with folder structure, README, initial files, and pre-populated GitHub Issues — all pushed live in seconds.

## Features

- 🤖 **LLM-Powered Parsing** - Uses OpenRouter to interpret specs intelligently
- 📁 **Smart Scaffolding** - Generates appropriate folder structure (src, tests, docs, scripts)
- 📝 **Auto-README** - Creates comprehensive README from spec content
- 🎯 **Issue Generation** - Breaks spec into actionable GitHub Issues with acceptance criteria
- 🏢 **Org Support** - Create repos in personal account or organization
- 🔒 **Privacy Control** - Public or private repo creation

## Stack

- **Python 3.8+**
- **PyGithub** - GitHub API wrapper
- **OpenRouter** - Unified LLM API access
- **OpenAI SDK** - Client for OpenRouter API

## Installation

```bash
# Clone the repository
git clone https://github.com/davidlifschitz/spec-to-repo.git
cd spec-to-repo

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys
```

## Configuration

Create a `.env` file:

```env
GITHUB_TOKEN=ghp_your_github_personal_access_token
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key
```

### Getting API Keys

**GitHub Token:**
1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. Required scopes: `repo` (full control of private repositories)

**OpenRouter Key:**
1. Sign up at [openrouter.ai](https://openrouter.ai/)
2. Generate API key at [openrouter.ai/keys](https://openrouter.ai/keys)

## Usage

### Basic Usage

```bash
python spec_to_repo.py --spec my-spec.md --repo-name awesome-project
```

### Create in Organization

```bash
python spec_to_repo.py --spec spec.md --repo-name team-project --org my-org
```

### Create Private Repo

```bash
python spec_to_repo.py --spec spec.txt --repo-name secret-project --private
```

### Use Different Model

```bash
python spec_to_repo.py --spec spec.md --repo-name my-project --model anthropic/claude-3.5-sonnet
```

## Spec Format

Your spec can be plain text or markdown. The LLM will interpret:

**Example spec.md:**
```markdown
# AI Code Editor

A next-generation code editor with deep AI integration.

## Architecture
- Anti-monolith design
- Pattern-driven development
- Clean code principles

## Core Features
- Real-time AI suggestions
- Spec-driven workflow
- Pattern graveyard tracking

## Tech Stack
- Frontend: TypeScript, React
- Backend: Python, FastAPI
- Storage: PostgreSQL
```

## What Gets Generated

### 1. Folder Structure
Based on mentioned tech stack and architecture:
```
├── src/
├── tests/
├── docs/
├── scripts/
└── examples/
```

### 2. Initial Files
- `.gitignore` (language-appropriate)
- `src/__init__.py` or `src/index.ts`
- `requirements.txt` or `package.json`
- `LICENSE` (MIT default)
- Configuration files

### 3. README.md
Generated from spec with:
- Project overview
- Features list
- Tech stack
- Getting started instructions
- Contributing guidelines

### 4. GitHub Issues
Actionable tasks like:
- "Set up project architecture and folder structure"
- "Implement core authentication system"
- "Create API endpoint for user management"
- "Write unit tests for core functionality"
- "Set up CI/CD pipeline"

Each issue includes:
- Descriptive title
- Detailed body with context from spec
- Acceptance criteria

## Architecture

```
Spec File (spec.md)
    ↓
SpecParser (LLM)
    ↓
RepoStructure (folders, files, README, issues)
    ↓
RepoScaffolder (GitHub API)
    ↓
Live GitHub Repository
```

## Example Output

```bash
$ python spec_to_repo.py --spec ai-editor-spec.md --repo-name ai-code-editor

Reading spec from ai-editor-spec.md...

Parsing spec with openai/gpt-4o...

📋 Scaffold plan:
  Folders: 5
  Files: 8
  Issues: 7

Scaffolding repository 'ai-code-editor'...
✓ Repository created: https://github.com/davidlifschitz/ai-code-editor

Creating folder structure...
  ✓ src/
  ✓ tests/
  ✓ docs/
  ✓ scripts/
  ✓ examples/

Creating files...
  ✓ .gitignore
  ✓ src/__init__.py
  ✓ requirements.txt
  ✓ setup.py

Updating README...
  ✓ README.md updated

Creating issues...
  ✓ Issue #1: Set up project architecture
  ✓ Issue #2: Implement AI integration layer
  ✓ Issue #3: Create pattern graveyard system
  ✓ Issue #4: Build clean code analyzer
  ✓ Issue #5: Set up testing framework
  ✓ Issue #6: Write documentation
  ✓ Issue #7: Configure CI/CD pipeline

🚀 Repo scaffold complete: https://github.com/davidlifschitz/ai-code-editor
```

## Error Handling

The tool handles:
- Missing API keys (exits with clear error)
- Invalid spec files (file not found)
- LLM parsing failures (JSON decode errors)
- GitHub API errors (repo already exists, insufficient permissions)
- Rate limiting (PyGithub built-in handling)

## Advanced Usage

### Custom Prompts

Modify `SpecParser.parse_spec()` prompt to customize scaffold generation:
- Change folder naming conventions
- Adjust issue breakdown granularity
- Add specific file templates
- Include org-specific patterns

### Post-Processing

After scaffold creation:
```bash
# Clone the new repo
git clone https://github.com/davidlifschitz/awesome-project
cd awesome-project

# Set up virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start building!
```

## Limitations

- No local git operations (uses GitHub API only)
- Rate limited by GitHub API (5000 requests/hour authenticated)
- LLM interpretation quality depends on spec clarity
- Sequential file creation (not parallelized)
- No branch creation (creates in default branch)

## Roadmap

- [ ] Support for custom templates/blueprints
- [ ] Project board creation with issues
- [ ] Label auto-assignment on issues
- [ ] Milestone generation from spec phases
- [ ] Branch protection rules setup
- [ ] CI/CD workflow file generation (.github/workflows)
- [ ] Integration with Jira/Linear for issue sync

## Contributing

Pull requests welcome! Key areas:
- Better spec parsing prompts
- Language-specific scaffold templates
- Error recovery and retry logic
- Parallel file creation
- Interactive mode (confirm before pushing)

## License

MIT License - see LICENSE file for details

## Related Projects

- [ml-job-autopilot](https://github.com/davidlifschitz/ml-job-autopilot) - Automated ML job application pipeline
- [PyGithub](https://github.com/PyGithub/PyGithub) - Python GitHub API library
- [OpenRouter](https://openrouter.ai) - Unified LLM API

---

**Built to eliminate the friction between spec and implementation. Write the spec, run one command, start coding.**
