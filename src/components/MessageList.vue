<template>
  <div class="message-list">
    <VaCard
      v-for="msg in messages"
      :key="msg.id"
      class="mb-2 message-card"
      @mouseover="showQuoteButton[msg.id] = true"
      @mouseleave="showQuoteButton[msg.id] = false"
    >
      <VaCardTitle>
        <!-- Use mdicon component from mdi-vue -->
        <MdIcon
          :name="getIconName(msg.user__username)"
          class="message-icon"
          size="24"
        />
        <span class="message-user">{{ msg.user__username }}</span>
      </VaCardTitle>
      <VaCardContent>
        <div v-html="formatMessage(msg.text)"></div>
        <VaButton
          v-show="showQuoteButton[msg.id]"
          @click="quoteMessage(msg.text)"
        >
          <Return32 />
        </VaButton>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import { MdIcon } from "mdi-vue";
import { Return32 } from "@carbon/icons-vue";
import { marked } from "marked";

export default {
  name: "MessageList",
  components: {
    MdIcon,
    Return32,
  },
  props: {
    messages: Array,
  },
  data() {
    return {
      showQuoteButton: {},
    };
  },
  created() {
    this.messages.forEach((msg) => {
      this.$set(msg, "showQuoteButton", false);
    });
  },
  methods: {
    getIconName(username) {
      if (!username) {
        return "mdi-home";
      }
      const iconName = "mdi-" + username.toLowerCase();
      return iconName;
    },
    quoteMessage(messageText) {
      this.$emit("quote", messageText);
    },
    formatMessage(msg) {
      const renderer = new marked.Renderer();

      renderer.blockquote = function (quote) {
        return `<blockquote class="va-blockquote">${quote}</blockquote>`;
      };

      renderer.strong = function (text) {
        return `<span class="va-text-bold mr-2">${text}</span>`;
      };

      renderer.em = function (text) {
        return `<span class="va-text-highlighted">${text}</span>`;
      };

      renderer.list = function (body, ordered) {
        const type = ordered ? "ol" : "ul";
        return `<${type} class="va-${ordered ? "ordered" : "unordered"}">${body}</${type}>`;
      };

      renderer.listitem = function (text) {
        return `<li>${text}</li>\n`;
      };

      marked.setOptions({ renderer });

      return marked(String(msg));
    },
  },
};
</script>

<style>
.message-card {
  display: flex;
  align-items: center;
  padding: 16px;
}

.message-card:hover .va-button {
  display: block;
}

.message-icon {
  margin-right: 10px;
}

.message-user {
  font-weight: bold;
  margin-right: 10px;
}
</style>
