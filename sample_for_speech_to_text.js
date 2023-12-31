const speech = require("@google-cloud/speech"),
  fs = require("fs");

async function main() {
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  const fileName = "./voice.wav";

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString("base64");

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  // https://cloud.google.com/speech-to-text/docs/reference/rest/v1/RecognitionConfig
  const config = {
    enableAutomaticPunctuation: true,
    encoding: "LINEAR16",
    languageCode: "ja-JP",
    model: "default",
  };
  const request = {
    audio: {
      content: audioBytes,
    },
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  console.log(response);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}

if (!module.parent) {
  main().catch(console.error);
}
