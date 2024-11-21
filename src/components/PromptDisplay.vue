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
      <VaButton class="mr-6 mb-2" @click="() => askChatGPT('LanguageSupport')">
        Language Support
      </VaButton>
      <VaButton class="mr-6 mb-2" @click="() => askChatGPT('LogicalSupport')">
        Logical Support
      </VaButton>
      <VaButton class="mr-6 mb-2" @click="() => askChatGPT('ElaborateSupport')">
        Elaborate Support
      </VaButton>
      <VaButton class="mr-6 mb-2" @click="showContext">
        Show Context
      </VaButton>
      <!-- <VaButton class="mr-6 mb-2" @click="() => askChatGPT('keywords')">
        Keyword
      </VaButton> -->
      <!-- context表示用エリアを追加 -->
    <div v-if="state.showDebug" class="debug-info">
      <h3>Debug Information:</h3>
      <pre>{{ state.contextDebug }}</pre>
    </div>
    </div>
    <div class="response relative">
      <button 
        class="va-button va-button--small absolute right-2 top-2"
        @click="copyToClipboard(state.response)"
      >
        <span class="va-button__content">Copy</span>
      </button>
      <pre>{{ state.response }}</pre>
    </div>

    <div v-if="state.showDebug" class="debug-info relative">
      <button 
        class="va-button va-button--small absolute right-2 top-2"
        @click="copyToClipboard(state.contextDebug)"
      >
        <span class="va-button__content">Copy</span>
      </button>
      <h3>Debug Information:</h3>
      <pre>{{ state.contextDebug }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // オプション: コピー成功を通知
    console.log('Copied to clipboard');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

const store = useStore();

const state = reactive({
  prompt: "",
  response:
    "✅ Answer from ChatGPT will appear here. You can type in any languages!",
  isCollapsed: false,
  showDebug: false,
  contextDebug: ""
});

// context確認用の関数を追加
function showContext() {
  const conversationHistory = messages.value
    .filter((msg) => msg && msg.text)
    .map((msg) => ({
      role: msg.user__username === store.state.currentUser.username ? "user" : "assistant",
      content: msg.text.replace(/<\/?p>/g, "").trim(),
    }))
    .filter((msg) => msg.content !== "");

  state.contextDebug = JSON.stringify({
    messages: messages.value,
    conversationHistory: conversationHistory,
    currentRoom: currentRoom.value,
    currentUser: store.state.currentUser.username
  }, null, 2);
  
  state.showDebug = true;
}

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
    model: "gpt-4-turbo-preview",
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
  const background = `We are playing a desert survival game where participants rank essential items and work towards a unified team decision.`;
  const selfIntroduction = `I am a non-native speaker participating in this discussion.`;

  const context =
    history.length > 0
      ? history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")
      : "No previous conversation.";

  // 言語レベルを固定値として設定
  const userJapaneseLevel = "intermediate";

  let basePrompt = "";

  switch (purpose) {
    case "languageSupport":
      return `You are a Japanese language assistant for non-native speakers. Context:\n${context}\n
Given this input: "${input}"

REQUIRED FORMAT:
1. If input is English:
   - Provide natural Japanese translation
   - Add pronunciation (furigana) for kanji
   - Suggest common phrases used in Japanese discussions
   
2. If input is Japanese:
   - Confirm the meaning in simple English
   - Explain key grammar points
   - Provide cultural context for business/group discussion

3. Additional Support:
   - Suggest polite alternatives if needed
   - Explain any context-specific vocabulary
   - Highlight common mistakes to avoid

Keep explanations clear and suitable for ${userJapaneseLevel} Japanese learners.`;

    case "logicalSupport":
      return `You are helping structure opinions for a Japanese discussion. Context:\n${context}\n
Given this input: "${input}"

Please help format the opinion in Japanese business style:
1. 結論から言う (Start with conclusion)
2. 理由を挙げる (Give reasons)
3. 具体例を示す (Provide examples)
4. まとめる (Summarize)

Include:
- Simple Japanese patterns for each section
- Key phrases for expressing opinions politely
- Cultural notes about Japanese discussion style`;

    case "elaborateSupport":
      return `You are helping develop ideas in Japanese. Context:\n${context}\n
Starting point: "${input}"

Please provide:
1. Simple Japanese expressions to expand the idea
2. Common team discussion phrases
3. Polite ways to agree/disagree
4. Cultural context about Japanese group decision-making

Include pronunciation help and example sentences.`;
  }

  return `${background}\n\n${selfIntroduction}\n\n${basePrompt}`;
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
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.right-2 {
  right: 0.5rem;
}

.top-2 {
  top: 0.5rem;
}

.va-button--small {
  padding: 4px 8px;
  font-size: 0.875rem;
  border-color: transparent;
  color: rgb(21, 78, 193);
  background: transparent;
  --va-background-color: #154EC1;
  --va-background-color-opacity: 0;
  --va-background-mask-color: transparent;
  --va-background-mask-opacity: 0;
  cursor: pointer;
  z-index: 1;
}

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
  padding-right: 60px;
  border-radius: 5px;
  word-wrap: break-word;
}
.response > pre {
  white-space: pre-wrap;
}

.debug-info {
  background-color: #f0f0f0;
  padding: 15px;
  padding-right: 60px;
  border-radius: 5px;
  margin-top: 20px;
  overflow-x: auto;
}

.debug-info pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
