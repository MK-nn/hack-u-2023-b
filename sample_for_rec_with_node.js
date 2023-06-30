// timers/promisesをロード
function sleep(waitSec) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, waitSec);
  });
} 

async function start() {
  const execSync = require("child_process").execSync;
  execSync("node sample_for_voicevox.js");
  await sleep(3000);
  console.log("2秒経過しました");
  execSync("ctrl+c");

  await sleep(1000);
  console.log("1秒経過しました");
}

start();
