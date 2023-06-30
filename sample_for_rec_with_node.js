const { exec } = require("child_process");

exec("sudo arecord test.wav", (err, stdout, stderr) => {
  if (err) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
