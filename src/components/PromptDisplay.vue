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
      <!-- <VaButton class="mr-6 mb-2" @click="() => askChatGPT('keywords')">
        Keyword
      </VaButton> -->
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
  const background = `We are playing a desert survival game where participants rank essential items and work towards a unified team decision.`;
  const selfIntroduction = `I am a non-native speaker participating in this discussion.`;

  const context =
    history.length > 0
      ? history.map((msg) => `${msg.role}: ${msg.content}`).join("\n")
      : "No previous conversation.";

  // 言語レベルを固定値として設定
  const userLanguageLevel = "intermediate";

  let basePrompt = "";

  switch (purpose) {
    case "translate":
      basePrompt = `You are a helpful assistant for language learners. Given this conversation:\n${context}\n
1. Identify the source language of: "${input}"
2. If it's Japanese, translate it to simple English suitable for a ${userLanguageLevel} level speaker.
3. If it's English, translate it to natural Japanese.
4. If it's neither, translate to both simple English and natural Japanese.
5. Provide a brief explanation of any idiomatic expressions or cultural nuances.

Based on the above steps, provide a single, most appropriate response that includes:
- The identified source language
- The translation (to English if source is Japanese, to Japanese if source is English, or both if source is neither)
- A brief explanation of any idiomatic expressions or cultural nuances (if applicable)

Format your response as a concise paragraph, focusing on the most relevant information for the language learner.`;
      break;

    case "decision":
      basePrompt = `You are assisting a non-native English speaker in a group discussion about desert survival. Based on this conversation:\n${context}\n
The group is considering the following decision: "${input}"
Please provide a structured response (2-3 sentences) that includes:
1. A clear statement supporting or opposing this decision
2. Two main reasons or factors to consider for this group decision
3. A potential alternative or compromise, if applicable
Use simple language suitable for a ${userLanguageLevel} level English speaker and focus on facilitating group consensus.`;
      break;

    case "opinion":
      basePrompt = `You're helping a non-native English speaker express their personal view in a group discussion. Context:\n${context}\n
The speaker wants to express this opinion: "${input}"
Please rephrase and elaborate on this opinion in simple, conversational English (2-3 sentences):
1. A clear statement of the personal opinion
2. One main supporting point or example
3. A brief conclusion or call for consideration from others
Use language suitable for a ${userLanguageLevel} level English speaker and focus on individual perspective.`;
      break;

    /* case "keywords":
      basePrompt = `You're assisting a non-native English speaker in a group discussion. Context:\n${context}\n
The speaker provided these keywords: "${input}"
Generate 2-3 short, simple sentences that:
1. Use these keywords
2. Relate to the desert survival topic
3. Are easy for a ${userLanguageLevel} level English speaker to use in the discussion`;
      break; */
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
