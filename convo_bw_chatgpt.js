require("dotenv").config();

const env = process.env;

async function main() {
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello world" },
    ],
  });
  console.log(completion.data.choices[0].message);
}

async function gpt_request(messages) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
}
