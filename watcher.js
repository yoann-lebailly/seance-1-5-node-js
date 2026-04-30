import { spawn } from 'node:child_process';
import { watch } from 'node:fs/promises';
const [node, script, file] = process.argv;
/*console.log(process.argv);
exec('dsfger', (err, stdout, stderr) => {
  console.log(err, stdout, stderr);
    if (err) {
    console.error(err);
  } else {
    console.log(stdout);
  }
});*/

function spawnNode() {
  const pr = spawn(node, [file]);
  pr.stdout.pipe(process.stdout);
  pr.stderr.pipe(process.stderr);
  pr.on('close', (code) => {
    if (code !== null) {
      process.exit(code);
    }
  });
  return pr;
}

const watcher = watch('./', { recursive: true });
let childNodeProcess = spawnNode();

for await (const event of watcher) {
  if (event.filename.endsWith('.js')) {
    childNodeProcess.kill('SIGKILL');
    childNodeProcess = spawnNode();
  }
}
