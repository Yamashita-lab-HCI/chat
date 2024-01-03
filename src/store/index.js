import { createStore } from 'vuex';
import dummyData from '@/dummyData';

export default createStore({
  state() {
    return {
      messages: dummyData.messages,
      rooms: [],
      currentRoom: null,
      filteredMessages: [],
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
        icon: 'mdi-send'
      });
    },
    addRoom(state, roomName) {
      state.rooms.push({ name: roomName }); // チャットルームを追加
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
    addRoom({ commit }, roomName) {
      commit('addRoom', roomName); // チャットルームを追加するアクション
    },
    selectRoom({ commit }, room) {
      commit('selectRoom', room);
    },
    updateUsernameValidation({ commit }, isValid) {
      commit('updateUsernameValidation', isValid);
    },
    updatePasswordValidation({ commit }, isValid) {
      commit('updatePasswordValidation', isValid);
    }
  }
});
