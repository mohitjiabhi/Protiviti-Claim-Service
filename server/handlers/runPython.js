import {spawn} from 'child_process'

export function runPythonScript(pythonExec, scriptPath, baseString) {
  console.log(baseString);
  return new Promise((resolve, reject) => {
    const proc = spawn(pythonExec, [scriptPath, baseString], {
      cwd: process.cwd(),
    });

    let responded = false;

    proc.stdout.on("data", (data) => {
      if (!responded) {
        responded = true;
        resolve({ success: true, output: data.toString() });
      }
    });

    proc.stderr.on("data", (data) => {
      if (!responded) {
        responded = true;
        reject({ success: false, error: data.toString() });
      }
    });

    proc.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
    });
  });
}