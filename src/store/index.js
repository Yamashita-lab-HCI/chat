// import Vue from "vue";
import { createStore } from "vuex";
// import { getCookie } from ".//../../utils.js";
import axios from "axios"; // Axios をインポート
// import dummyData from "@/dummyData";
// import { stringify } from "flatted";

const store = createStore({
  state() {
    return {
      messages: [],
      rooms: [],
      currentRoom: null,
      currentUser: null,
      filteredMessages: [],
      isUsernameValid: false,
      isPasswordValid: false,
      isLoggedIn: false,
      socket: new WebSocket(process.env.VUE_APP_WS_URL),
      showQuoteButton: {},
      roomId: null,
      iconColor: null,
    };
  },
  mutations: {
    setIconColor(state, color) {
      state.iconColor = color;
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    },
    setLoggedIn(state, status) {
      state.isLoggedIn = status; // ログイン状態を更新
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setCurrentRoom(state, room) {
      state.currentRoom = room;
    },
    updateMessage(state, newMessage) {
      const transformedMessage = {
        user__username: newMessage.username,
        text: newMessage.message,
      };
      state.messages = [...state.messages, transformedMessage];
      console.log("Updated messages:", state.messages);
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
    setSocket(state, socket) {
      state.socket = socket;
    },
    addRoom(state, room) {
      state.rooms = [...state.rooms, room];
    },
    updateUsernameValidation(state, isValid) {
      state.isUsernameValid = isValid;
    },
    updatePasswordValidation(state, isValid) {
      state.isPasswordValid = isValid;
    },
    SET_ROOM_ID(state, roomId) {
      state.roomId = roomId;
    },
  },
  actions: {
    fetchIconColor({ commit, state }) {
      axios
        .get(process.env.VUE_APP_BASE_URL + "get_icon_color/", {
          params: {
            username: state.currentUser.username,
          },
        })
        .then((response) => {
          commit("setIconColor", response.data.color);
          return response.data.color;
        })
        .catch((error) => {
          console.error("Error fetching icon color:", error);
        });
    },
    updateIconColor({ commit, state }, color) {
      const username = state.currentUser.username;
      console.log(username);
      console.log(color);
      axios
        .post(process.env.VUE_APP_BASE_URL + "update_icon_color/", {
          username: username,
          color: color,
        })
        .then(() => {
          commit("setIconColor", color);
        })
        .catch((error) => {
          console.error("Error updating icon color:", error);
        });
    },
    fetchRooms({ commit }) {
      axios
        .get(process.env.VUE_APP_BASE_URL + "room/")
        .then((response) => {
          console.log(response.data);
          const rooms = response.data.map((room) => ({
            id: room.id,
            name: room.name,
          }));
          commit("setRooms", rooms);
        })
        .catch((error) => {
          console.error("Error fetching rooms:", error);
        });
    },
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
          console.log("Current user:", response.data);
          commit("setCurrentUser", response.data);
          localStorage.setItem("username", response.data.username);
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
    },
    fetchMessages({ state, commit }) {
      console.log(state.currentRoom);
      if (state.currentRoom === null) {
        console.error("currentRoom is not set");
        return Promise.reject("currentRoom is not set");
      }
      axios
        .get(process.env.VUE_APP_BASE_URL + "messages/", {
          params: {
            room_id: state.currentRoom,
          },
        })
        .then((response) => {
          commit("setMessages", response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    },
    addMessage({ commit, state }, messageData) {
      return new Promise((resolve, reject) => {
        console.log("messageData:", messageData);
        const username = localStorage.getItem("username");
        if (!username) {
          console.error("Username is not set");
          reject("Username is not set");
          return;
        }
        if (!messageData) {
          console.error("Message is empty");
          reject("Message is empty");
          return;
        }
        const newMessage = {
          username: username,
          message: messageData,
          room_id: state.currentRoom,
        };
        console.log("New message:", newMessage);
        state.socket.send(JSON.stringify(newMessage));
        axios
          .post(process.env.VUE_APP_BASE_URL + "messages/", newMessage)
          .then((response) => {
            console.log("Message posted successfully");
            const returnedMessage = response.data.new_message;
            commit("updateMessage", returnedMessage);
            if (!(returnedMessage.id in state.showQuoteButton)) {
              state.showQuoteButton[returnedMessage.id] = false;
            }
            resolve(returnedMessage);
          })
          .catch((error) => {
            console.error("Failed to post message:", error);
            console.error("Detailed error:", error.response.data);
            alert(`Error: ${error.response.data.message}`);
            reject(error);
          });
      });
    },
    logIn({ commit }) {
      commit("setLoggedIn", true);
    },
    logOut({ commit }) {
      commit("setLoggedIn", false);
    },
    addRoom({ commit }, room) {
      commit("addRoom", room);
    },
    selectRoom({ commit }, room) {
      commit("setCurrentRoom", room);
    },
    updateUsernameValidation({ commit }, isValid) {
      commit("updateUsernameValidation", isValid);
    },
    updatePasswordValidation({ commit }, isValid) {
      commit("updatePasswordValidation", isValid);
    },
    setRoomId({ commit }, roomId) {
      commit("SET_ROOM_ID", roomId);
    },
  },
});

// WebSocketの接続が開始されたときにメッセージを取得
store.state.socket.onopen = function () {
  store.state.socket.send(
    JSON.stringify({
      type: "fetchMessages",
    })
  );
};

// 新しいメッセージがWebSocketを通じて受信されたときに、それをstateに追加
store.state.socket.onmessage = function (event) {
  console.log("WebSocket message received:", event.data);
  let data;
  if (event.data instanceof ArrayBuffer) {
    const decoder = new TextDecoder("utf-8");
    data = JSON.parse(decoder.decode(event.data));
  } else {
    data = JSON.parse(event.data);
  }
  if (
    data.type === "message" &&
    data.message &&
    data.message.text &&
    data.message.text.trim() !== ""
  ) {
    console.log("Received message data:", data.message);
    store.commit("updateMessage", data.message);
  }
};

export default store;
