const { default: axios } = require("axios");
const fs = require("fs");
const player = require("node-wav-player");

const client = axios.create({ baseURL: "http://localhost:50021" });

async function speak(text) {
  client.post(
    `audio_query?text=${text}&speaker=1`
  ).then((audio_query) => {
    client.post(
      "synthesis?speaker=1",
      JSON.stringify(audio_query.data),
      {
        responseType: "arraybuffer",
        headers: {
          accept: "audio/wav",
          "Content-Type": "application/json",
        },
      }
    ).then((synthesis) => {
      fs.writeFileSync("voice.wav", synthesis.data);
      player
        .play({
          path: "voice.wav",
        })
        .then(() => {
          console.log("The wav file started to be played successfully.");
        })
        .catch((error) => {
          console.error(error);
        });
    })
  })
  .catch((error) => {
    console.log(error);
  });
}

speak("こんにちは、今日はいい天気ですね。");
