<template>
  <div class="message-list">
    <VaCard v-for="msg in messages" :key="msg.id" class="mb-2 message-card">
      <VaCardTitle>
        <!-- Use mdicon component from mdi-vue -->
        <MdIcon :name="getIconName(msg.icon)" class="message-icon" size="24" />
        <span class="message-user">{{ msg.user }}</span>
      </VaCardTitle>
      <VaCardContent>
        {{ msg.text }}
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import axios from "axios";
import { MdIcon } from "mdi-vue";

export default {
  name: "MessageList",
  components: {
    MdIcon,
  },
  data() {
    return {
      messages: [],
    };
  },
  mounted() {
    this.fetchMessages();
  },
  methods: {
    getIconName(iconName) {
      return iconName.replace(/mdi-/, "");
    },
    fetchMessages() {
      axios
        .get("/api/messages/")
        .then((response) => {
          this.messages = response.data;
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
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

.message-icon {
  margin-right: 10px;
}

.message-user {
  font-weight: bold;
  margin-right: 10px;
}
</style>
