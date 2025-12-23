#!/usr/bin/env python3

"""
github_push.py

Creates a GitHub repository and pushes static site content to it.
Automatically enables GitHub Pages.

Usage: python3 github_push.py <SITE_DIR> <REPO_NAME>
Example: python3 github_push.py "./dist" "myorg/my-static-site"
"""

import os
import sys
import json
import subprocess
import time
from pathlib import Path
from urllib.parse import quote

def print_header(text):
    """Print a formatted header"""
    print("=" * 60)
    print(text)
    print("=" * 60)

def print_error(text):
    """Print an error message"""
    print(f"❌ Error: {text}", file=sys.stderr)

def print_success(text):
    """Print a success message"""
    print(f"✅ {text}")

def print_info(text):
    """Print an info message"""
    print(f"ℹ️  {text}")

def run_command(cmd, cwd=None, check=True):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            check=check
        )
        return result
    except subprocess.CalledProcessError as e:
        if check:
            print_error(f"Command failed: {cmd}")
            print_error(f"Error: {e.stderr}")
            sys.exit(1)
        return e

def get_github_token():
    """Get GitHub token from environment or credentials file"""
    # Try environment variable first
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        return token
    
    # Try git credentials file
    git_credentials_path = Path.home() / '.git-credentials'
    if git_credentials_path.exists():
        try:
            with open(git_credentials_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if 'github.com' in line:
                        # Parse format: https://username:token@github.com
                        if '@github.com' in line:
                            parts = line.split('@')[0].split(':')
                            if len(parts) >= 3:
                                token = parts[2]
                                return token
        except Exception as e:
            print_info(f"Could not read git credentials: {e}")
    
    return None

def check_gh_cli():
    """Check if GitHub CLI is available"""
    result = run_command('gh --version', check=False)
    return result.returncode == 0

def create_repo_with_gh_cli(repo_name, description):
    """Create repository using GitHub CLI"""
    print_info("Creating repository using GitHub CLI...")
    
    # Parse org/repo or user/repo
    if '/' in repo_name:
        org, repo = repo_name.split('/', 1)
        cmd = f'gh repo create {repo_name} --public --description "{description}"'
    else:
        cmd = f'gh repo create {repo_name} --public --description "{description}"'
    
    result = run_command(cmd, check=False)
    
    if result.returncode == 0:
        print_success(f"Repository created: {repo_name}")
        return True
    else:
        # Repo might already exist
        if 'already exists' in result.stderr.lower():
            print_info(f"Repository {repo_name} already exists, will push to it")
            return True
        print_error(f"Failed to create repository: {result.stderr}")
        return False

def create_repo_with_api(repo_name, description, token):
    """Create repository using GitHub API"""
    print_info("Creating repository using GitHub API...")
    
    # Parse org/repo or user/repo
    if '/' in repo_name:
        org, repo = repo_name.split('/', 1)
        url = f'https://api.github.com/orgs/{org}/repos'
    else:
        url = 'https://api.github.com/user/repos'
        repo = repo_name
    
    data = {
        'name': repo,
        'description': description,
        'private': False,
        'auto_init': False
    }
    
    cmd = f'''curl -X POST -H "Authorization: token {token}" \
        -H "Accept: application/vnd.github.v3+json" \
        {url} -d '{json.dumps(data)}' '''
    
    result = run_command(cmd, check=False)
    
    if result.returncode == 0:
        response = json.loads(result.stdout)
        if 'html_url' in response:
            print_success(f"Repository created: {response['html_url']}")
            return True
    
    # Check if error is because repo exists
    if 'already exists' in result.stdout.lower() or 'already exists' in result.stderr.lower():
        print_info(f"Repository {repo_name} already exists, will push to it")
        return True
    
    print_error(f"Failed to create repository via API")
    return False

def init_git_repo(site_dir):
    """Initialize git repository in site directory"""
    print_info("Initializing git repository...")
    
    git_dir = Path(site_dir) / '.git'
    if git_dir.exists():
        print_info("Git repository already initialized")
        return True
    
    result = run_command('git init', cwd=site_dir)
    result = run_command('git branch -M main', cwd=site_dir)
    print_success("Git repository initialized")
    return True

def commit_files(site_dir):
    """Stage and commit all files"""
    print_info("Committing files...")
    
    # Add all files
    run_command('git add .', cwd=site_dir)
    
    # Check if there are changes to commit
    result = run_command('git status --porcelain', cwd=site_dir)
    if not result.stdout.strip():
        print_info("No changes to commit")
        return True
    
    # Commit
    commit_msg = "Static site export"
    run_command(f'git commit -m "{commit_msg}"', cwd=site_dir)
    print_success("Files committed")
    return True

def push_to_github(site_dir, repo_name):
    """Push to GitHub repository"""
    print_info("Pushing to GitHub...")
    
    # Set remote
    remote_url = f'https://github.com/{repo_name}.git'
    
    # Check if remote already exists
    result = run_command('git remote', cwd=site_dir, check=False)
    if 'origin' in result.stdout:
        run_command(f'git remote set-url origin {remote_url}', cwd=site_dir)
    else:
        run_command(f'git remote add origin {remote_url}', cwd=site_dir)
    
    # Push to main
    result = run_command('git push -u origin main --force', cwd=site_dir, check=False)
    
    if result.returncode == 0:
        print_success("Code pushed to GitHub")
        return True
    else:
        print_error(f"Failed to push: {result.stderr}")
        return False

def enable_github_pages(repo_name, token):
    """Enable GitHub Pages using GitHub CLI or API"""
    print_info("Enabling GitHub Pages...")
    
    # Try with GitHub CLI first
    if check_gh_cli():
        cmd = f'gh api repos/{repo_name}/pages -X POST -f source[branch]=main -f source[path]=/'
        result = run_command(cmd, check=False)
        
        if result.returncode == 0:
            print_success("GitHub Pages enabled")
            return True
        elif 'already exists' in result.stderr.lower():
            print_info("GitHub Pages already enabled")
            return True
    
    # Try with API
    if token:
        url = f'https://api.github.com/repos/{repo_name}/pages'
        data = {
            'source': {
                'branch': 'main',
                'path': '/'
            }
        }
        
        cmd = f'''curl -X POST -H "Authorization: token {token}" \
            -H "Accept: application/vnd.github.v3+json" \
            {url} -d '{json.dumps(data)}' '''
        
        result = run_command(cmd, check=False)
        
        if result.returncode == 0:
            print_success("GitHub Pages enabled")
            return True
    
    print_info("Could not enable GitHub Pages automatically")
    print_info("Please enable it manually in repository settings")
    return True

def get_pages_url(repo_name):
    """Get the GitHub Pages URL"""
    if '/' in repo_name:
        org, repo = repo_name.split('/', 1)
        return f'https://{org}.github.io/{repo}/'
    return None

def main():
    """Main function"""
    # Parse arguments
    if len(sys.argv) < 3:
        print_error("Missing required arguments")
        print("Usage: python3 github_push.py <SITE_DIR> <REPO_NAME>")
        print('Example: python3 github_push.py "./dist" "myorg/my-static-site"')
        sys.exit(1)
    
    site_dir = sys.argv[1]
    repo_name = sys.argv[2]
    
    # Validate site directory
    if not os.path.isdir(site_dir):
        print_error(f"Directory does not exist: {site_dir}")
        sys.exit(1)
    
    # Validate repo name format
    if '/' not in repo_name:
        print_error("Repository name must be in format: owner/repo-name")
        sys.exit(1)
    
    print_header("GitHub Deployment Tool")
    print(f"Site Directory: {site_dir}")
    print(f"Target Repository: {repo_name}")
    print_header("")
    
    # Get GitHub credentials
    token = get_github_token()
    has_gh_cli = check_gh_cli()
    
    if not token and not has_gh_cli:
        print_error("No GitHub credentials found")
        print_info("Set GITHUB_TOKEN environment variable or configure GitHub CLI")
        sys.exit(1)
    
    # Create repository
    description = "Static site export"
    success = False
    
    if has_gh_cli:
        success = create_repo_with_gh_cli(repo_name, description)
    elif token:
        success = create_repo_with_api(repo_name, description, token)
    
    if not success:
        print_error("Failed to create repository")
        sys.exit(1)
    
    # Initialize git
    if not init_git_repo(site_dir):
        sys.exit(1)
    
    # Commit files
    if not commit_files(site_dir):
        sys.exit(1)
    
    # Push to GitHub
    if not push_to_github(site_dir, repo_name):
        sys.exit(1)
    
    # Enable GitHub Pages
    enable_github_pages(repo_name, token)
    
    # Print summary
    print("\n" + "=" * 60)
    print_success("Deployment completed!")
    print("=" * 60)
    print(f"Repository: https://github.com/{repo_name}")
    
    pages_url = get_pages_url(repo_name)
    if pages_url:
        print(f"GitHub Pages URL: {pages_url}")
        print_info("Note: It may take a few minutes for the site to be available")
    
    print("=" * 60)

if __name__ == '__main__':
    main()
