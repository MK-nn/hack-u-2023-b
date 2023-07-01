const { default: axios } = require("axios");
const fs = require("fs");
const player = require("node-wav-player");

const client = axios.create({ baseURL: "http://localhost:50021" });

async function speech_synthesis_with_voicevox(gpt_answer) {
  console.log("1");
  const client_for_voicevox = axios.create({
    baseURL: "http://localhost:50021",
  });

  console.log("2");
  client_for_voicevox
    .post(`audio_query?text=${gpt_answer}&speaker=46`)
    .then((audio_query) => {
      audio_query.data.prePhonemeLength = 1.0;
      client_for_voicevox
        .post("synthesis?speaker=46", JSON.stringify(audio_query.data), {
          responseType: "arraybuffer",
          headers: {
            accept: "audio/wav",
            "Content-Type": "application/json",
          },
        })
        .then((synthesis) => {
          fs.writeFileSync("output.wav", synthesis.data);
          player
            .play({
              path: "output.wav",
            })
            .then(() => {
              console.log("The wav file started to be played successfully.");
            })
            .catch((error) => {
              console.error(error);
            });
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

speech_synthesis_with_voicevox("こんにちは、今日はいい天気ですね。");
