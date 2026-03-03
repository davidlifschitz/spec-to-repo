#!/usr/bin/env python3
"""
Spec-to-Repo Scaffolder
Converts product specs into full GitHub repo scaffolds with structure, README, and issues.

Usage:
    python spec_to_repo.py --spec spec.md --repo-name my-project
    python spec_to_repo.py --spec spec.txt --repo-name my-project --org my-org
"""

import os
import sys
import argparse
import json
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from github import Github, GithubException
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

@dataclass
class RepoStructure:
    """Represents the scaffold structure for a repository."""
    folders: List[str] = field(default_factory=list)
    files: Dict[str, str] = field(default_factory=dict)
    readme_content: str = ""
    issues: List[Dict[str, str]] = field(default_factory=list)

class SpecParser:
    """Uses LLM to parse product spec and generate scaffold structure."""
    
    def __init__(self, api_key: str, model: str = "openai/gpt-4o"):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
            default_headers={"HTTP-Referer": "https://github.com/spec-to-repo"}
        )
        self.model = model
    
    def parse_spec(self, spec_content: str) -> RepoStructure:
        """Parse product spec and generate repo structure."""
        
        prompt = f"""Analyze this product specification and generate a repository scaffold.

Spec:
{spec_content}

Generate a JSON response with:
1. "folders": array of folder paths (e.g. ["src", "tests", "docs", "scripts"])
2. "files": object mapping file paths to initial content (e.g. {{"src/__init__.py": "", ".gitignore": "*.pyc\n__pycache__/"}})
3. "readme": complete README.md content based on spec
4. "issues": array of GitHub issues with "title" and "body" fields

For issues:
- Break down the spec into actionable tasks
- Create 5-10 issues that cover architecture, core features, testing, and documentation
- Make titles descriptive (e.g. "Implement authentication system" not "Auth")
- Include acceptance criteria in body

Return ONLY valid JSON, no markdown fences."""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a technical architect generating repo scaffolds from specs. Output valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=4000
            )
            
            content = response.choices[0].message.content.strip()
            
            # Remove markdown fences if present
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            data = json.loads(content.strip())
            
            return RepoStructure(
                folders=data.get("folders", []),
                files=data.get("files", {}),
                readme_content=data.get("readme", ""),
                issues=data.get("issues", [])
            )
            
        except json.JSONDecodeError as e:
            print(f"Error parsing LLM response as JSON: {e}")
            print(f"Response content: {content[:500]}")
            sys.exit(1)
        except Exception as e:
            print(f"Error calling LLM: {e}")
            sys.exit(1)

class RepoScaffolder:
    """Manages GitHub repo creation and scaffolding."""
    
    def __init__(self, github_token: str, owner: str, org: Optional[str] = None):
        self.gh = Github(github_token)
        self.owner = owner
        self.org = org
    
    def create_repo(self, name: str, description: str, private: bool = False):
        """Create GitHub repository."""
        try:
            if self.org:
                org = self.gh.get_organization(self.org)
                repo = org.create_repo(
                    name=name,
                    description=description,
                    private=private,
                    auto_init=True
                )
            else:
                user = self.gh.get_user()
                repo = user.create_repo(
                    name=name,
                    description=description,
                    private=private,
                    auto_init=True
                )
            
            print(f"✓ Repository created: {repo.html_url}")
            return repo
            
        except GithubException as e:
            if e.status == 422:
                print(f"Error: Repository '{name}' already exists")
            else:
                print(f"Error creating repository: {e}")
            sys.exit(1)
    
    def scaffold_repo(self, repo_name: str, structure: RepoStructure, description: str):
        """Create repo and populate with scaffold."""
        
        # Create repository
        repo = self.create_repo(repo_name, description)
        
        # Create folder structure with .gitkeep files
        print(f"\nCreating folder structure...")
        for folder in structure.folders:
            try:
                repo.create_file(
                    f"{folder}/.gitkeep",
                    f"Create {folder} directory",
                    ""
                )
                print(f"  ✓ {folder}/")
            except GithubException:
                print(f"  ⚠ {folder}/ already exists")
        
        # Create files
        print(f"\nCreating files...")
        for file_path, content in structure.files.items():
            try:
                repo.create_file(
                    file_path,
                    f"Add {file_path}",
                    content
                )
                print(f"  ✓ {file_path}")
            except GithubException:
                print(f"  ⚠ {file_path} already exists")
        
        # Update README
        if structure.readme_content:
            print(f"\nUpdating README...")
            try:
                readme = repo.get_contents("README.md")
                repo.update_file(
                    "README.md",
                    "Update README from spec",
                    structure.readme_content,
                    readme.sha
                )
                print(f"  ✓ README.md updated")
            except GithubException as e:
                print(f"  ⚠ Error updating README: {e}")
        
        # Create issues
        if structure.issues:
            print(f"\nCreating issues...")
            for issue_data in structure.issues:
                try:
                    issue = repo.create_issue(
                        title=issue_data["title"],
                        body=issue_data.get("body", "")
                    )
                    print(f"  ✓ Issue #{issue.number}: {issue.title}")
                except GithubException as e:
                    print(f"  ⚠ Error creating issue: {e}")
        
        print(f"\n🚀 Repo scaffold complete: {repo.html_url}")
        return repo

def main():
    parser = argparse.ArgumentParser(
        description="Generate GitHub repo scaffold from product spec"
    )
    parser.add_argument(
        "--spec",
        required=True,
        help="Path to spec file (.md or .txt)"
    )
    parser.add_argument(
        "--repo-name",
        required=True,
        help="Name for the new repository"
    )
    parser.add_argument(
        "--org",
        help="Organization name (optional, defaults to personal account)"
    )
    parser.add_argument(
        "--private",
        action="store_true",
        help="Create private repository"
    )
    parser.add_argument(
        "--model",
        default="openai/gpt-4o",
        help="OpenRouter model to use (default: openai/gpt-4o)"
    )
    
    args = parser.parse_args()
    
    # Load environment variables
    github_token = os.getenv("GITHUB_TOKEN")
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    
    if not github_token:
        print("Error: GITHUB_TOKEN not found in environment")
        sys.exit(1)
    
    if not openrouter_key:
        print("Error: OPENROUTER_API_KEY not found in environment")
        sys.exit(1)
    
    # Read spec file
    spec_path = Path(args.spec)
    if not spec_path.exists():
        print(f"Error: Spec file not found: {args.spec}")
        sys.exit(1)
    
    print(f"Reading spec from {args.spec}...")
    spec_content = spec_path.read_text()
    
    # Parse spec with LLM
    print(f"\nParsing spec with {args.model}...")
    parser_obj = SpecParser(openrouter_key, args.model)
    structure = parser_obj.parse_spec(spec_content)
    
    print(f"\n📋 Scaffold plan:")
    print(f"  Folders: {len(structure.folders)}")
    print(f"  Files: {len(structure.files)}")
    print(f"  Issues: {len(structure.issues)}")
    
    # Get authenticated user
    gh = Github(github_token)
    user = gh.get_user()
    
    # Create and scaffold repo
    print(f"\nScaffolding repository '{args.repo_name}'...")
    scaffolder = RepoScaffolder(github_token, user.login, args.org)
    
    # Generate description from spec (first paragraph or fallback)
    description = spec_content.split('\n\n')[0][:100] if spec_content else "Generated from spec"
    
    scaffolder.scaffold_repo(args.repo_name, structure, description)

if __name__ == "__main__":
    main()
