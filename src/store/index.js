import { createStore } from 'vuex';
import dummyData from '@/dummyData'; // dummyDataのインポート

export default createStore({
  state() {
    return {
      messages: dummyData.messages,
      isUsernameValid: false,
      isPasswordValid: false,
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
    },
    updateUsernameValidation(state, isValid) {
      state.isUsernameValid = isValid;
    },
    updatePasswordValidation(state, isValid) {
      state.isPasswordValid = isValid;
    },
  },
  actions: {
    addMessage({ commit }, newMessage) {
      commit('addMessage', newMessage);
    },
    updateUsernameValidation({ commit }, isValid) {
      commit('updateUsernameValidation', isValid);
    },
    updatePasswordValidation({ commit }, isValid) {
      commit('updatePasswordValidation', isValid);
    }
  }
});
