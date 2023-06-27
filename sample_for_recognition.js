const vosk = require("vosk"),
  fs = require("fs"),
  mic = require("mic");

const MODEL_PATH = "./vosk-model-ja-0.22",
  SAMPLE_RATE = 16000;

if (!fs.existsSync(MODEL_PATH)) {
  console.log(
    "Please download the model from https://alphacephei.com/vosk/models and unpack as " +
      MODEL_PATH +
      " in the current folder."
  );
  process.exit();
}

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH),
  rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });

const micInstance = mic({
  rate: String(SAMPLE_RATE),
  channels: "1",
  debug: false,
  device: "default",
});

const micInputStream = micInstance.getAudioStream();

micInputStream.on("data", (data) => {
  if (rec.acceptWaveform(data)) {
    const recognizedResult = rec.result();
    const recognizedText = recognizedResult.text;
    console.log(recognizedResult);
    console.log(recognizedText);
  } else console.log(rec.partialResult());
});

micInputStream.on("audioProcessExitComplete", function () {
  console.log("Cleaning up");
  console.log(rec.finalResult());
  rec.free();
  model.free();
});

process.on("SIGINT", function () {
  console.log("\nStopping");
  micInstance.stop();
});

micInstance.start();
