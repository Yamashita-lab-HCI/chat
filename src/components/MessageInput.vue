<template>
  <div class="message-input">
    <textarea
      :rows="computedRows"
      v-model="message"
      style="width: 500px; height: 200px"
    ></textarea>
    <div class="va-title">Type your Message:</div>
    <VaButton @click="sendMessage">Send</VaButton>
  </div>
</template>

<script>
export default {
  name: "MessageInput",
  props: ["value"],
  data() {
    return {
      message: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.message = newVal;
    },
  },
  computed: {
    computedRows() {
      const lines = this.message.split("\n");
      let totalLines = 0;
      lines.forEach((line) => {
        totalLines += Math.ceil(line.length / 40);
      });
      return totalLines;
    },
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== "") {
        this.$store.dispatch("addMessage", this.message); // Vuexストアのアクションを呼び出す
        // メッセージをクリア
        this.message = "";
      }
    },
  },
};
</script>

<style>
.message-input textarea {
  /*width: 70%; */
  padding: 10px;
  margin-right: 10px;
}

.message-input button {
  padding: 10px 20px;
}
</style>
