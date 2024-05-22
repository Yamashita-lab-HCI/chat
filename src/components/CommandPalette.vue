<template>
  <div class="command-palette">
    <div v-if="quotedMessage" class="quoted-message">
      <blockquote>{{ quotedMessage }}</blockquote>
      <button @click="clearQuote">x</button>
    </div>
    <ckeditor
      :editor="editor"
      v-model="content"
      :config="editorConfig"
    ></ckeditor>
    <div class="va-title">Type your Message:</div>
    <VaButton @click="sendMessage">Send</VaButton>
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  name: "CommandPalette",
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
    quotedMessage: String,
  },
  data() {
    return {
      editor: ClassicEditor,
      content: "",
      editorConfig: {
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "|",
            "link",
            "uploadImage",
            "blockQuote",
            "|",
            "bulletedList",
            "numberedList",
          ],
          shouldNotGroupWhenFull: false,
        },
      },
    };
  },
  methods: {
    sendMessage() {
      if (this.content.trim() !== "") {
        let messageContent = this.content;
        if (this.quotedMessage) {
          messageContent = `<blockquote>${this.quotedMessage}</blockquote>${messageContent}`;
        }
        this.$emit("send", messageContent);
        this.content = ""; // 送信後にエディタをクリア
        this.$emit("clear-quote");
      }
    },
    clearQuote() {
      this.$emit("clear-quote");
    },
  },
};
</script>

<style>
.command-palette {
  border: 1px solid #ccc;
  padding: 10px;
}
.ck-content {
  padding: 20px;
}
.va-title {
  margin-top: 10px;
  font-weight: bold;
}
button {
  cursor: pointer;
}
.quoted-message {
  border-left: 4px solid #ccc;
  padding-left: 10px;
  margin-bottom: 10px;
  position: relative;
}
.quoted-message button {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
</style>
