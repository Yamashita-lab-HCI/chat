<template>
  <div class="home">
    <div class="header-container">
      <VaAlert
        color="primary"
        border="top"
        border-color="primary"
        class="mb-6 alert-partial-width"
      >
        Chatting Room
      </VaAlert>
      <va-button class="mt-4" @click="showSurvivalInfo = true">
        Survival Tasks Info
      </va-button>
    </div>
    <div class="chat-container">
      <div class="chat-section">
        <message-list
          :messages="messages"
          @quote="quoteMessage"
          @update-messages="updateMessages"
        ></message-list>
      </div>
      <prompt-display v-if="userType === 'NNS'"></prompt-display>
    </div>
    <va-modal v-model="showSurvivalInfo" ok-text="Understand">
      <template #content>
        <h3 class="va-h3">Survival Tasks</h3>
        <h4 class="va-h4">Arctic Survival Task</h4>
        <p>
          Your plane has crash-landed in the Arctic. Before the plane caught
          fire, your group salvaged several items. Your task is to rank these
          items in order of importance for survival:
        </p>
        <ul>
          <li>A loaded .45-caliber pistol</li>
          <li>Newspapers (one per person)</li>
          <li>Cigarette lighter (without fluid)</li>
          <li>Extra shirt and pants for each survivor</li>
          <li>A compass</li>
        </ul>

        <h4 class="va-h4">Ocean Survival Task</h4>
        <p>
          You and two companions were sailing across the Atlantic Ocean when
          your yacht sank. You managed to board a life raft, but you're
          approximately 150 miles away from the nearest land. The weather is
          clear, but the sea is rough. Your radio is broken, and you must decide
          whether to wait for rescue or attempt to reach land on your own. You
          were only able to salvage six items from the yacht before it sank.
          Your task is to rank these items in order of importance for your
          survival. Ocean Survival Task Items:
        </p>
        <ul>
          <li>5 liters of fresh water</li>
          <li>Signal flares</li>
          <li>Fishing kit</li>
          <li>Waterproof tarpaulin</li>
          <li>Solar-powered handheld GPS navigator</li>
          <li>First aid kit</li>
        </ul>

        <h4 class="va-h4">Desert Survival Task</h4>
        <p>
          It's mid-July at 10 am, and your plane has crash-landed in the desert.
          The pilot died in the crash, but you and two other passengers survived
          uninjured. Your location is 65 miles off-course, approximately 70
          miles southeast of the nearest known inhabited area. Your task is to
          rank these items in order of importance for survival:
        </p>
        <ul>
          <li>Folding knife</li>
          <li>Torch with 4 battery-cells</li>
          <li>Magnetic compass</li>
          <li>2 litres of water per person</li>
          <li>Sunglasses (for everyone)</li>
          <li>First-aid kit</li>
        </ul>
      </template>
      <template #footer>
        <va-button @click="showSurvivalInfo = false">Close</va-button>
      </template>
    </va-modal>
  </div>
</template>

<script>
import MessageList from "@/components/MessageList.vue";
// import MessageInput from "@/components/MessageInput.vue"; // MessageInput コンポーネントをインポート
import PromptDisplay from "@/components/PromptDisplay.vue";
import { mapState, mapActions } from "vuex";
import { VaButton, VaModal } from "vuestic-ui";

export default {
  name: "RoomPage",
  components: {
    MessageList,
    PromptDisplay,
    VaButton,
    VaModal,
  },
  data() {
    return {
      inputMessage: "",
      showSurvivalInfo: false,
    };
  },
  computed: {
    ...mapState([
      "messages",
      "currentRoom",
      "currentUser",
      "iconColor",
      "userType",
    ]),
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        this.initializeRoom(newId);
      },
    },
  },
  methods: {
    ...mapActions([
      "fetchMessages",
      "fetchCurrentUser",
      "initWebSocket",
      "addMessage",
      "closeWebSocket",
    ]),
    async initializeRoom(roomId) {
      await this.closeWebSocket();
      this.$store.commit("setMessages", []);
      await this.$store.commit("setCurrentRoom", roomId);
      await this.fetchMessages(roomId);
      await this.fetchCurrentUser();
      this.initWebSocket();
    },
    sendMessage() {
      if (this.inputMessage.trim()) {
        this.addMessage(this.inputMessage);
        this.inputMessage = "";
      }
    },
    quoteMessage(message) {
      this.inputMessage = `> ${message}\n`;
    },
    updateMessages(newMessages) {
      this.$store.commit("SET_MESSAGES", newMessages);
    },
  },
  async created() {
    await this.$store.dispatch("fetchIconColor");
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      this.$store.commit("setUserType", storedUserType);
    }
  },
  async mounted() {
    try {
      await this.fetchCurrentUser();
      if (this.currentUser) {
        console.log("Current user:", this.currentUser);
        console.log("User type:", this.userType);
        await this.initializeRoom(this.$route.params.id);
        this.initWebSocket();
      } else {
        console.error("Current user is null");
      }
    } catch (error) {
      console.error("Error in mounted hook:", error);
    }
  },
  beforeUnmount() {
    this.closeWebSocket();
  },
};
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.alert-partial-width {
  flex-grow: 1;
  margin-right: 1rem;
}

.arctic-info-button {
  white-space: nowrap;
}

.chat-container {
  display: flex;
  flex-direction: row;
}

.chat-section {
  max-height: 500px;
  flex: 1;
}

.mt-4 {
  margin-top: 1rem;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
}

li {
  margin-bottom: 5px;
}
</style>
