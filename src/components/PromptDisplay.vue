<template>
  <div class="prompt-display">
    <h2>🧑 Ask ChatGPT!</h2>
    <div class="input-group">
      <textarea
        class="input"
        placeholder="Please type in your questions."
        v-model="state.prompt"
      ></textarea>
    </div>
    <div class="va-title">
      Please click the button that best suits your purpose:
    </div>
    <div class="input-group">
      <VaButton class="mr-6 mb-2" @click="() => askChatGPT('translate')">
        Translation
      </VaButton>
      <VaButton class="mr-6 mb-2" @click="() => askChatGPT('decision')">
        Decision
      </VaButton>
      <VaButton class="mr-6 mb-2" @click="() => askChatGPT('opinion')">
        Opinion
      </VaButton>
      <VaButton class="mr-6 mb-2" @click="() => askChatGPT('keywords')">
        Keyword
      </VaButton>
    </div>
    <div class="response">
      <pre>{{ state.response }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import axios from "axios";
import { useStore } from "vuex";

const state = reactive({
  prompt: "",
  response:
    "✅ Answer from ChatGPT will appear here. You can type in any languages!",
  isCollapsed: false,
});

const API_KEY = process.env.VUE_APP_API_KEY;
const http = axios.create({
  baseURL: "https://api.openai.com/v1/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

const store = useStore();

async function askChatGPT(purpose) {
  if (!state.prompt.trim()) {
    state.response = "⚠️ Please enter your question.";
    return;
  }

  let requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: generatePrompt(state.prompt, purpose) },
    ],
    max_tokens: 256,
    temperature: 0.7,
  };

  try {
    const result = await makeRequestWithRetry(
      "chat/completions",
      requestData,
      3,
      2000
    );
    state.response = result.data.choices[0].message.content;

    await axios.post(process.env.VUE_APP_BASE_URL + "record/", {
      username: store.state.currentUser,
      question: state.prompt,
      answer: state.response,
    });
  } catch (error) {
    console.error("Failed to get response from ChatGPT:", error);
    if (error.response && error.response.data && error.response.data.error) {
      state.response = `⚠️ An error occurred: ${error.response.data.error.message}. Please refer to OpenAI's documentation for details.`;
    } else {
      state.response = "⚠️ An unknown error occurred. Please contact support.";
    }
  }
}

function generatePrompt(input, purpose) {
  let basePrompt = "";
  switch (purpose) {
    case "translate":
      basePrompt = `Please translate the following word or phrase into the specified language (if no language is specified, translate into English): ${input}`;
      break;
    case "decision":
      basePrompt = `Please provide decision-making support based on the following information (if no language is specified, respond in English): ${input}`;
      break;
    case "opinion":
      basePrompt = `Please provide your opinion on the following topic (if no language is specified, respond in English): ${input}`;
      break;
    case "keywords":
      basePrompt = `Please provide ideas or suggestions related to the following keyword (if no language is specified, respond in English): ${input}`;
      break;
  }
  return basePrompt;
}

async function makeRequestWithRetry(url, data, retries, delay) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await http.post(url, data);
    } catch (error) {
      if (i < retries && error.response && error.response.status === 429) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      } else {
        throw error;
      }
    }
  }
}
</script>

<style scoped>
.prompt-display {
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 20px;
}
.input-group {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}
.input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height: 100px;
  resize: vertical;
}
.btn {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
.btn:hover {
  background-color: #0056b3;
}
.response {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  word-wrap: break-word;
}
.response > pre {
  white-space: pre-wrap;
}
</style>
