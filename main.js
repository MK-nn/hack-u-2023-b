const fs = require("fs");
const { default: axios } = require("axios");
const speech = require("@google-cloud/speech");
const player = require("node-wav-player");

require("dotenv").config();

const env = process.env;

async function main() {
  messages = [
    { role: "system", content: '以降の会話は以下の項目に従って20文字以内で答えてください。\
- あなたはおばあちゃん、おじいちゃんが大好きです。\
- あなたは2人の健康を心配しています。\
- あなたは元気で心優しい女の子です。\
- あなたは語尾にわんをつけて喋ります。' }
  ];

  flag = true;
  while (true) {
    var flag = false;
    console.log("recording...");
    const execSync = require("child_process").execSync;
    await execSync("python3 rec.py")
    console.log("recording finished");

    console.log("speech to text...");
    var input_text = await speech_to_text();
    messages.push({ role: "user", content: input_text })
    console.log(`speech to text finished: ${input_text}`);

    console.log("requesting to GPT...");
    var gpt_answer = await gpt_request(input_text);
    messages.push({ role: "system", content: gpt_answer })
    console.log(`requesting to GPT finished: ${gpt_answer}`);
    if (gpt_answer.length > 20) {
      let array = gpt_answer.split(/！|。/);
      console.log(array);
      tmp = "";
      first = array[0];
      while (tmp.length < 20) {
        tmp += array.shift();
      }
      if (tmp.length > 30) {
        tmp = first;
      }
      gpt_answer = tmp;
    }


    console.log("converting to voice...");
    await speech_synthesis_with_voicevox(gpt_answer);
    console.log("converting to voice finished");

    for(var i = 0; i < messages.length; i++){
      console.log(messages[i]);
    }

    await sleep(8000);
  }
}

function sleep(waitSec) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, waitSec);
  });
} 

async function speech_to_text() {
  const client_for_speech_to_text = new speech.SpeechClient();

  const request = {
    audio: {
      content: fs.readFileSync("./input.wav").toString("base64"),
    },
    config: {
      enableAutomaticPunctuation: true,
      encoding: "LINEAR16",
      languageCode: "ja-JP",
      model: "default",
    },
  };

  const [response] = await client_for_speech_to_text.recognize(request);
  console.log(response);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
  return transcription;
}

async function gpt_request(input_text) {
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  console.log(completion.data.choices[0].message.content);
  return completion.data.choices[0].message.content;
}

async function speech_synthesis_with_voicevox(gpt_answer, flag) {
  const audio_query = await axios.post(
    `http://localhost:50021/audio_query?text=${gpt_answer}&speaker=46`
  )

  const synthesis = await axios.post(
    "http://localhost:50021/synthesis?speaker=46",
    JSON.stringify(audio_query.data),
    {
      responseType: "arraybuffer",
      headers: {
        accept: "audio/wav",
        "Content-Type": "application/json",
      },
    }
  )

  await fs.writeFileSync("output.wav", synthesis.data);
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


  // await axios
  //   .post(`http://localhost:50021/audio_query?text=${gpt_answer}&speaker=46`)
  //   .then((audio_query) => {
  //     await axios
  //       .post(
  //         "http://localhost:50021synthesis?speaker=46",
  //         JSON.stringify(audio_query.data),
  //         {
  //           responseType: "arraybuffer",
  //           headers: {
  //             accept: "audio/wav",
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       )
  //       .then((synthesis) => {
  //         fs.writeFileSync("output.wav", synthesis.data);
  //         player
  //           .play({
  //             path: "output.wav",
  //           })
  //           .then(() => {
  //             console.log("The wav file started to be played successfully.");
  //           })
  //           .catch((error) => {
  //             console.error(error);
  //           });
  //       });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
}

main()