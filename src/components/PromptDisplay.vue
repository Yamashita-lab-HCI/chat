<template>
  <div class="prompt-display">
    <h2>🧑 ChatGPTに質問してみよう</h2>
    <div class="input-group">
      <input
        class="input"
        placeholder="ここに質問を入力してください。"
        v-model="state.prompt"
        @keyup.enter="askChatGPT"
      />
      <button @click="askChatGPT" class="btn">送信</button>
    </div>
    <div class="response">
      <pre>{{ state.response }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import axios from "axios";

const state = reactive({
  prompt: "",
  response: "✅ ChatGPTの回答がここに表示されます。",
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

async function askChatGPT() {
  if (!state.prompt.trim()) {
    state.response = "⚠️ 質問を入力してください。";
    return;
  }

  try {
    const result = await makeRequestWithRetry(
      "chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: state.prompt }],
        max_tokens: 256,
        temperature: 0.7,
      },
      3,
      2000
    ); // 最大3回のリトライ、リトライ間隔2000ミリ秒
    state.response = result.data.choices[0].message.content;
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
        ); // 指数的バックオフ
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
  gap: 20px;
}
.input-group {
  display: flex;
  gap: 10px;
}
.input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
}
</style>
