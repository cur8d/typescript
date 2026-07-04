import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { spawnSync } from 'node:child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

function getGitConfig(key: string): string {
  try {
    const result = spawnSync('git', ['config', '--get', key], {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf-8',
    });

    if (result.status !== 0) {
      return '';
    }

    return result.stdout.trim();
  } catch {
    return '';
  }
}

async function main() {
  console.log('🚀 cur8d Template Initialization');
  console.log('This script will customize the template for your new project.\n');

  try {
    const defaultName = path.basename(process.cwd())
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .trim();

    let defaultGithubUser = getGitConfig('github.user');
    if (!defaultGithubUser) {
      const nameConfig = getGitConfig('user.name');
      if (nameConfig) {
        defaultGithubUser = nameConfig
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    }

    const defaultRepoName = defaultName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');

    const defaultRepo = defaultGithubUser ? `${defaultGithubUser}/${defaultRepoName}` : `username/${defaultRepoName}`;

    const nameInput = await question(`Project Name [${defaultName}]: `);
    const name = nameInput.trim() || defaultName;

    const description = await question('Project Description (e.g., My Awesome App): ');

    const repoInput = await question(`GitHub Repository [${defaultRepo}]: `);
    const repo = repoInput.trim() || defaultRepo;

    if (!name || !repo) {
      console.error('❌ Project name and repository are required.');
      process.exit(1);
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const [githubUser, githubRepo] = repo.split('/');
    if (!githubUser || !githubRepo) {
      console.error('❌ Repository must be in the format username/repo');
      process.exit(1);
    }

    console.log('\nProcessing files...');

    const filesToProcess = [
      'package.json',
      'docs/package.json',
      'README.md',
      'LICENSE',
      'CHANGELOG.md',
      'app/components/Navbar/index.tsx',
      'app/page.tsx',
      '.firebaserc',
      'docs/app/[[...mdxPath]]/layout.tsx',
      'docs/theme.config.jsx',
      'docs/next.config.mjs',
      'AGENTS.md',
      'CONTRIBUTING.md',
      'tests/e2e/navbar.spec.ts',
      'sonar-project.properties',
    ];

    const getAllMdxFiles = async (dir: string): Promise<string[]> => {
      const results: string[] = [];
      const walk = async (currentDir: string): Promise<void> => {
        try {
          const list = await fs.promises.readdir(currentDir, { withFileTypes: true });
          const tasks: Promise<void>[] = [];

          for (const dirent of list) {
            const filePath = path.join(currentDir, dirent.name);
            if (dirent.isDirectory()) {
              tasks.push(walk(filePath));
            } else if (dirent.name.endsWith('.mdx')) {
              results.push(filePath);
            }
          }

          if (tasks.length > 0) {
            await Promise.all(tasks);
          }
        } catch {
          // Ignore errors as per original implementation
        }
      };

      await walk(dir);
      return results;
    };

    filesToProcess.push(...(await getAllMdxFiles('docs/content')));

    await Promise.all(
      filesToProcess.map(async (file) => {
        const filePath = path.join(process.cwd(), file);
        try {
          await fs.promises.access(filePath);
          let content = await fs.promises.readFile(filePath, 'utf8');

          // Order matters for replacements
          // 1. GitHub full URLs
          content = content.replace(/https:\/\/github\.com\/cur8d\/typescript/g, `https://github.com/${repo}`);

          // 2. Documentation URLs
          content = content.replace(/https:\/\/cur8d\.dev\/typescript/g, `https://${githubUser}.github.io/${githubRepo}`);

          // 3. Package name in JSON
          if (file.endsWith('package.json')) {
            content = content.replace(/"name": "cur8d"/, `"name": "${slug}"`);
            content = content.replace(/"name": "docs"/, `"name": "${slug}-docs"`);
          }

          // 4. Firebase project IDs
          if (file === '.firebaserc') {
            content = content.replace(/cur8d-vibe/g, `${slug}`);
            content = content.replace(/cur8d-site/g, `${slug}-site`);
            content = content.replace(/cur8d-docs/g, `${slug}-docs`);
          }

          // 5. Descriptions (must happen before general cur8d replacement)
          if (description) {
            content = content.replace(/a production-ready Next\.js starter/g, description);
            content = content.replace(
              /an extremely opinionated, production-ready Next\.js template designed for speed and reliability\./g,
              description
            );
          }

          // 6. General "cur8d" replacement (Brand name)
          content = content.replace(/cur8d/g, name);

          await fs.promises.writeFile(filePath, content, 'utf8');
          console.log(`✅ Updated ${file}`);
        } catch {
          // File does not exist, skip
        }
      })
    );

    const deleteScript = await question('\nDo you want to delete this initialization script? (y/N): ');
    if (deleteScript.toLowerCase() === 'y') {
      await fs.promises.unlink(__filename);
      console.log('✅ Deleted initialization script.');

      // Also remove from package.json
      const pkgPath = path.join(process.cwd(), 'package.json');
      const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf8'));
      if (pkg.scripts && pkg.scripts['init']) {
        delete pkg.scripts['init'];
        await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
        console.log('✅ Removed init script from package.json.');
      }
    }

    console.log('\n✨ Project initialized successfully!');
    console.log(`Next steps:
  1. mise install
  2. pnpm install
  3. pnpm dev`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ An error occurred:', errorMessage);
  } finally {
    rl.close();
  }
}

main();
