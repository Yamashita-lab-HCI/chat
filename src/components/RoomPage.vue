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
      <va-button class="mt-4" @click="showJapaneseSurvivalInfo = true">
        サバイバルタスクの情報
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

        <h4 class="va-h4">Experiment Flow</h4>
        <p>
          This experiment consists of 1 practice task and 2 main tasks. The flow
          for each task is as follows:
        </p>
        <ol>
          <li>Reading task introduction: 2 minutes</li>
          <li>Individual ranking: 3 minutes</li>
          <li>
            Group discussion:
            <ul>
              <li>Practice task: 5 minutes</li>
              <li>Main tasks: 10 minutes each</li>
            </ul>
          </li>
        </ol>

        <h4 class="va-h4">Arctic Survival Task (Practice Task)</h4>
        <p>
          Your plane has crash-landed in the Arctic. Before the plane caught
          fire, your group salvaged several items. Your task is to rank these 4
          items in order of importance for survival:
        </p>
        <ul>
          <li>A loaded .45-caliber pistol</li>
          <li>Cigarette lighter (with fluid)</li>
          <li>Extra shirt and pants for each survivor</li>
          <li>A compass</li>
        </ul>

        <h4 class="va-h4">Ocean Survival Task (Main Task)</h4>
        <p>
          You and two companions were sailing across the Atlantic Ocean when
          your yacht sank. You managed to board a life raft, but you're
          approximately 150 miles away from the nearest land. The weather is
          clear, but the sea is rough. Your radio is broken, and you must decide
          whether to wait for rescue or attempt to reach land on your own. You
          were only able to salvage six items from the yacht before it sank.
          Your task is to rank these 6 items in order of importance for your
          survival:
        </p>
        <ul>
          <li>5 liters of fresh water</li>
          <li>Signal flares</li>
          <li>Fishing kit</li>
          <li>Waterproof tarpaulin</li>
          <li>Solar-powered handheld GPS navigator</li>
          <li>First aid kit</li>
        </ul>

        <h4 class="va-h4">Desert Survival Task (Main Task)</h4>
        <p>
          It's mid-July at 10 am, and your plane has crash-landed in the desert.
          The pilot died in the crash, but you and two other passengers survived
          uninjured. Your location is 65 miles off-course, approximately 70
          miles southeast of the nearest known inhabited area. Your task is to
          rank these 6 items in order of importance for survival:
        </p>
        <ul>
          <li>Folding knife</li>
          <li>Torch with 4 battery-cells</li>
          <li>Magnetic compass</li>
          <li>2 liters of water per person</li>
          <li>Sunglasses (for everyone)</li>
          <li>First-aid kit</li>
        </ul>

        <p>
          After each task, you will be asked to complete a short survey.
          Following the entire experiment, there will be an interview lasting
          approximately 30 minutes.
        </p>
      </template>
      <template #footer>
        <va-button @click="showSurvivalInfo = false">Close</va-button>
      </template>
    </va-modal>

    <va-modal v-model="showJapaneseSurvivalInfo" ok-text="了解">
      <template #content>
        <h3 class="va-h3">サバイバルタスク</h3>

        <h4 class="va-h4">実験の流れ</h4>
        <p>
          この実験では、1つの練習タスクと2つのメインタスクを行います。各タスクの流れは以下の通りです：
        </p>
        <ol>
          <li>タスク紹介の読み込み：2分間</li>
          <li>個人でのランキング：3分間</li>
          <li>
            グループディスカッション：
            <ul>
              <li>練習タスク：5分間</li>
              <li>メインタスク：10分間</li>
            </ul>
          </li>
        </ol>

        <h4 class="va-h4">北極サバイバルタスク（練習タスク）</h4>
        <p>
          あなたの飛行機が北極で不時着しました。飛行機が炎上する前に、グループはいくつかのアイテムを回収しました。あなたの課題は、これらの4つのアイテムを生存のために重要な順に並べることです：
        </p>
        <ul>
          <li>装填済みの.45口径ピストル</li>
          <li>ライター（燃料あり）</li>
          <li>各生存者用の予備のシャツとズボン</li>
          <li>コンパス</li>
        </ul>

        <h4 class="va-h4">海洋サバイバルタスク（メインタスク）</h4>
        <p>
          あなたと2人の仲間が大西洋を横断中にヨットが沈没しました。救命いかだに乗り込みましたが、最も近い陸地まで約240km離れています。天気は晴れていますが、海は荒れています。無線は故障しており、救助を待つか自力で陸地に向かうかを決めなければなりません。ヨットが沈む前に6つのアイテムだけを回収できました。あなたの課題は、これらの6つのアイテムを生存のために重要な順に並べることです：
        </p>
        <ul>
          <li>5リットルの真水</li>
          <li>信号用フレア</li>
          <li>釣り道具セット</li>
          <li>防水タープ</li>
          <li>ソーラー充電式のハンドヘルドGPSナビゲーター</li>
          <li>救急キット</li>
        </ul>

        <h4 class="va-h4">砂漠サバイバルタスク（メインタスク）</h4>
        <p>
          7月中旬の午前10時、あなたの飛行機が砂漠に不時着しました。パイロットは事故で亡くなりましたが、あなたと他の2人の乗客は無傷で生き残りました。あなたたちの位置は予定のコースから105km外れており、最も近い既知の居住地から約110km南東にあります。あなたの課題は、これらの6つのアイテムを生存のために重要な順に並べることです：
        </p>
        <ul>
          <li>折りたたみナイフ</li>
          <li>4本の電池付き懐中電灯</li>
          <li>磁気コンパス</li>
          <li>1人あたり2リットルの水</li>
          <li>サングラス（全員分）</li>
          <li>救急キット</li>
        </ul>

        <p>
          各タスク終了後、短いアンケートにご回答いただきます。実験全体の終了後、約30分間のインタビューを行います。
        </p>
      </template>
      <template #footer>
        <va-button @click="showJapaneseSurvivalInfo = false">閉じる</va-button>
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
      showJapaneseSurvivalInfo: false,
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
