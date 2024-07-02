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
    state.response = "⚠️ 質問を入力してください。";
    return;
  }

  let requestData = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: state.prompt }],
    max_tokens: 256,
    temperature: 0.7,
  };

  // 目的に応じたリクエストデータの調整
  switch (purpose) {
    case "translate":
      requestData.messages[0].content =
        "Translate the given text into English: " + state.prompt;
      break;
    case "decision":
      requestData.messages[0].content =
        "Answer in English. Provide decision-making support based on the given input: " +
        state.prompt;
      break;
    case "opinion":
      requestData.messages[0].content =
        "Answer in English. Provide an opinion on the given topic: " +
        state.prompt;
      break;
    case "keywords":
      requestData.messages[0].content =
        "Answer in English. Extract only the important keywords from the given text: " +
        state.prompt;
      break;
  }

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
    console.error("ChatGPTからの応答の取得に失敗しました:", error);
    if (error.response && error.response.data && error.response.data.error) {
      state.response = `⚠️ エラーが発生しました: ${error.response.data.error.message}. 詳細はOpenAIのドキュメントを参照してください。`;
    } else {
      state.response =
        "⚠️ 不明なエラーが発生しました。サポートに連絡してください。";
    }
  }
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
