// apps/api/entrypoint.js
import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';

const prisma = new PrismaClient();

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function runCommand(cmd, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    // Use shell so npx works reliably inside minimal images
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    p.on('error', (err) => reject(err));
    p.on('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`Command ${cmd} ${args.join(' ')} exited with code ${code} signal ${signal}`));
    });
  });
}

async function main() {
  console.log('[entrypoint] Waiting for database...');
  while (true) {
    try {
      await prisma.$connect();
      console.log('[entrypoint] Database connected!');
      break;
    } catch (err) {
      console.log('[entrypoint] Database not ready, retry in 2s...', err?.message || err);
      await wait(2000);
    }
  }

  console.log('[entrypoint] Running Prisma migrate deploy...');
  try {
    await runCommand('npx', ['prisma', 'migrate', 'deploy']);
    console.log('[entrypoint] Migrations applied');
  } catch (err) {
    console.error('[entrypoint] Migration failed:', err);
    // If migrations fail, exit so container is marked unhealthy and we can inspect logs
    process.exit(1);
  }

  console.log('[entrypoint] Starting server...');
  const server = spawn('node', ['dist/server.js'], { stdio: 'inherit', shell: false });

  // Forward signals to the server process
  const forwardSignal = (sig) => {
    console.log(`[entrypoint] Forwarding ${sig} to server`);
    try {
      server.kill(sig);
    } catch (e) {
      console.warn('[entrypoint] Failed to forward signal', e);
    }
  };

  process.on('SIGINT', () => forwardSignal('SIGINT'));
  process.on('SIGTERM', () => forwardSignal('SIGTERM'));

  server.on('exit', async (code, signal) => {
    console.log('[entrypoint] Server process exited', { code, signal });
    try {
      await prisma.$disconnect();
    } catch (e) {}
    // exit with the server exit code
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error('[entrypoint] Fatal error', err);
  process.exit(1);
});
