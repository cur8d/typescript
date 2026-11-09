import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

if (process.env.OPEN_NEXT_BUILDING || process.env.VERCEL || !existsSync('open-next.config.ts')) {
  execSync('next build', { stdio: 'inherit' });
} else {
  execSync('opennextjs-cloudflare build', {
    stdio: 'inherit',
    env: { ...process.env, OPEN_NEXT_BUILDING: 'true' },
  });
}
