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
import { reactive, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";

const store = useStore();

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

const currentRoom = computed(() => store.state.currentRoom);
const messages = computed(() => store.state.messages);

async function askChatGPT(purpose) {
  console.log("Messages:", store.state.messages);
  if (!state.prompt.trim()) {
    state.response = "⚠️ Please enter your question.";
    return;
  }

  const conversationHistory = messages.value
    .filter((msg) => msg && msg.text)
    .map((msg) => ({
      role:
        msg.user__username === store.state.currentUser.username
          ? "user"
          : "assistant",
      content: msg.text.replace(/<\/?p>/g, "").trim(),
    }))
    .filter((msg) => msg.content !== "");

  let requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      ...conversationHistory,
      {
        role: "user",
        content: generatePrompt(state.prompt, purpose, conversationHistory),
      },
    ],
    max_tokens: 256,
    temperature: 0.7,
  };

  console.log("Request Data:", JSON.stringify(requestData, null, 2));

  try {
    const result = await makeRequestWithRetry(
      "chat/completions",
      requestData,
      3,
      2000
    );
    state.response = result.data.choices[0].message.content;

    // ユーザーの質問をメッセージとして追加
    /* store.dispatch("addMessage", {
      content: state.prompt,
      sender: store.state.currentUser.username,
      room: currentRoom.value,
    }); */

    // ChatGPTの応答をrecordとして記録
    await axios.post(process.env.VUE_APP_BASE_URL + "record/", {
      username: store.state.currentUser.username,
      question: state.prompt,
      answer: state.response,
      purpose: purpose,
      room: currentRoom.value,
    });
  } catch (error) {
    console.error("Failed to get response from ChatGPT:", error);
    if (error.response && error.response.data && error.response.data.error) {
      state.response = `⚠️ An error occurred: ${error.response.data.error.message}. Please refer to OpenAI's documentation for details.`;
    } else if (error.message) {
      state.response = `⚠️ An error occurred: ${error.message}. Please try again later.`;
    } else {
      state.response = "⚠️ An unknown error occurred. Please contact support.";
    }
  }
}

function generatePrompt(input, purpose, history) {
  const context =
    history.length > 0
      ? history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")
      : "No previous conversation.";

  let basePrompt = "";

  switch (purpose) {
    case "translate":
      basePrompt = `You are a helpful assistant for non-native English speakers. Given the following conversation context:\n${context}\nPlease translate the following word or phrase into simple English: "${input}"\nIf it's already in English, provide a brief, clear explanation suitable for non-native speakers.`;
      break;

    case "decision":
      basePrompt = `You are a supportive assistant for a non-native English speaker in a group discussion. Based on this conversation:\n${context}\nThe speaker is seeking advice on: "${input}"\nPlease provide a structured response with:\n1. A clear recommendation\n2. 2-3 supporting reasons\n3. Potential counterarguments to consider\nUse simple language and avoid complex vocabulary.`;
      break;

    case "opinion":
      basePrompt = `You are helping a non-native English speaker express their opinion in a group discussion. Considering this conversation:\n${context}\nThe speaker wants to express this view: "${input}"\nPlease rephrase and expand on this opinion in simple, conversational English. Include:\n1. A clear statement of the opinion\n2. One or two supporting points\n3. A brief conclusion or call to action`;
      break;

    case "keywords":
      basePrompt = `You are assisting a non-native English speaker in a group discussion. In the context of this conversation:\n${context}\nThe speaker has provided these keywords: "${input}"\nPlease generate 2-3 short, simple sentences that:\n1. Incorporate these keywords\n2. Relate to the current conversation topic\n3. Could be easily used by the speaker in the discussion\nUse everyday language and avoid complex structures.`;
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
