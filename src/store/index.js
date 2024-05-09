import { createStore } from "vuex";
import axios from "axios"; // Axios をインポート
import dummyData from "@/dummyData";

export default createStore({
  state() {
    return {
      messages: dummyData.messages,
      rooms: [],
      currentRoom: null,
      filteredMessages: [],
      isUsernameValid: false,
      isPasswordValid: false,
      isLoggedIn: false, // ログイン状態
    };
  },
  mutations: {
    setLoggedIn(state, status) {
      state.isLoggedIn = status; // ログイン状態を更新
    },
    addMessage(state, newMessage) {
      state.messages.push({
        id: state.messages.length + 1,
        user: "currentUser",
        text: newMessage,
        icon: "mdi-send",
      });
    },
    addRoom(state, roomName) {
      state.rooms.push({ name: roomName });
    },
    updateUsernameValidation(state, isValid) {
      state.isUsernameValid = isValid;
    },
    updatePasswordValidation(state, isValid) {
      state.isPasswordValid = isValid;
    },
  },
  actions: {
    fetchAuthentication({ commit }) {
      axios
        .get(process.env.VUE_APP_BASE_URL + "check_login_status/")
        .then((response) => {
          commit("setLoggedIn", response.data.isLoggedIn);
        })
        .catch((error) => {
          console.error("Error fetching authentication status:", error);
          commit("setLoggedIn", false); // エラーが発生した場合、ログイン状態を false に設定
        });
    },
    logIn({ commit }) {
      commit("setLoggedIn", true);
    },
    logOut({ commit }) {
      commit("setLoggedIn", false);
    },
    addMessage({ commit }, newMessage) {
      commit("addMessage", newMessage);
    },
    addRoom({ commit }, roomName) {
      commit("addRoom", roomName);
    },
    selectRoom({ commit }, room) {
      commit("selectRoom", room);
    },
    updateUsernameValidation({ commit }, isValid) {
      commit("updateUsernameValidation", isValid);
    },
    updatePasswordValidation({ commit }, isValid) {
      commit("updatePasswordValidation", isValid);
    },
  },
});
