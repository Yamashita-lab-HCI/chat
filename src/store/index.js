import { createStore } from 'vuex';
import dummyData from '@/dummyData'; // dummyDataのインポート

export default createStore({
  state() {
    return {
      messages: dummyData.messages // dummyDataからの初期メッセージリスト
    };
  },
  mutations: {
    addMessage(state, newMessage) {
      state.messages.push({
        id: state.messages.length + 1,
        user: 'currentUser',
        text: newMessage,
        icon: 'mdi-send' // または適切なアイコン
      });
    }
  },
  actions: {
    addMessage({ commit }, newMessage) {
      commit('addMessage', newMessage);
    }
  }
});
