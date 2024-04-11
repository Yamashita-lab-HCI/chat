<template>
  <div class="prompt-display">
    <h2>🧑 ChatGPTに質問してみよう</h2>
    <div class="input-group">
      <input
        class="input"
        placeholder="ここに質問を入力してください。"
        v-model="prompt"
        @keyup.enter="askChatGPT"
      />
      <button @click="askChatGPT" class="btn">送信</button>
    </div>
    <div class="response">
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const prompt = ref('');
const response = ref('✅ ChatGPTの回答がここに表示されます。');
const API_KEY = process.env.VUE_APP_API_KEY;

const http = axios.create({
  baseURL: 'https://api.openai.com/v1/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

async function askChatGPT() {
  try {
    const result = await http.post('chat/completions', {
      model: 'gpt-3.5-turbo',
      prompt: prompt.value,
      max_tokens: 256,
      temperature: 0.7,
    });
    response.value = result.data.choices[0].text;
  } catch (error) {
    console.error('ChatGPTからの応答の取得に失敗しました:', error);
    response.value = '⚠️ エラーが発生しました。後ほど再試行してください。';
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
