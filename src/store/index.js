// import Vue from "vue";
import { createStore } from "vuex";
import axios from "axios"; // Axios をインポート
// import dummyData from "@/dummyData";

export default createStore({
  state() {
    return {
      messages: [],
      rooms: [],
      currentRoom: null,
      currentUser: null,
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
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    updateMessage(state, newMessage) {
      state.messages.push(newMessage);
    },
    setMessages(state, messages) {
      state.messages = messages;
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
    fetchCurrentUser({ commit }) {
      console.log("fetchMessages action called");
      axios
        .get(process.env.VUE_APP_BASE_URL + "get_current_user/")
        .then((response) => {
          commit("setCurrentUser", response.data);
          localStorage.setItem("username", response.data.username);
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
    },
    fetchMessages({ commit }) {
      axios
        .get(process.env.VUE_APP_BASE_URL + "messages/")
        .then((response) => {
          commit("setMessages", response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    },
    addMessage({ commit }, newMessage) {
      const username = localStorage.getItem("username");
      if (!username) {
        console.error("Username is not set");
        return;
      }
      axios
        .post(process.env.VUE_APP_BASE_URL + "messages/", {
          username: username,
          message: newMessage,
        })
        .then(() => {
          console.log("Message posted successfully");
          commit("addMessage", newMessage);
        })
        .catch((error) => {
          console.error("Failed to post message:", error);
          console.error("Detailed error:", error.response.data);
          alert(`Error: ${error.response.data.message}`);
        });
    },
    logIn({ commit }) {
      commit("setLoggedIn", true);
    },
    logOut({ commit }) {
      commit("setLoggedIn", false);
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
