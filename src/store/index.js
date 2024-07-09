import { createStore } from "vuex";
import axios from "axios";

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
      socket: null,
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
      state.isLoggedIn = status;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setCurrentRoom(state, room) {
      state.currentRoom = room;
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
    addMessage(state, message) {
      state.messages.unshift(message);
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
      return axios
        .get(process.env.VUE_APP_BASE_URL + "get_icon_color/", {
          params: { username: state.currentUser.username },
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
      return axios
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
      return axios
        .get(process.env.VUE_APP_BASE_URL + "room/")
        .then((response) => {
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
      return axios
        .get(process.env.VUE_APP_BASE_URL + "check_login_status/")
        .then((response) => {
          commit("setLoggedIn", response.data.isLoggedIn);
        })
        .catch((error) => {
          console.error("Error fetching authentication status:", error);
          commit("setLoggedIn", false);
        });
    },
    fetchCurrentUser({ commit }) {
      return axios
        .get(process.env.VUE_APP_BASE_URL + "get_current_user/")
        .then((response) => {
          commit("setCurrentUser", response.data);
          localStorage.setItem("username", response.data.username);
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
    },
    fetchMessages({ state, commit }) {
      if (state.currentRoom === null) {
        console.error("currentRoom is not set");
        return Promise.reject("currentRoom is not set");
      }
      return axios
        .get(process.env.VUE_APP_BASE_URL + "messages/", {
          params: { room_id: state.currentRoom },
        })
        .then((response) => {
          commit("setMessages", response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    },
    initWebSocket({ commit, state, dispatch }) {
      if (state.currentRoom === null) {
        console.error("currentRoom is not set");
        return;
      }

      const socket = new WebSocket(
        `${process.env.VUE_APP_WS_URL}/ws/chat/${state.currentRoom}/`
      );

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
          commit("addMessage", data.message);
          dispatch("fetchIconColor", data.message.user__username);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setTimeout(() => dispatch("initWebSocket"), 5000);
      };

      commit("setSocket", socket);
    },
    sendMessage({ state }, messageData) {
      return new Promise((resolve, reject) => {
        if (state.socket && state.socket.readyState === WebSocket.OPEN) {
          const message = {
            message: messageData,
            username: state.currentUser.username,
            room_id: state.currentRoom,
          };
          state.socket.send(JSON.stringify(message));
          resolve();
        } else {
          console.error("WebSocket is not open");
          reject("WebSocket is not open");
        }
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
    selectRoom({ commit, dispatch }, room) {
      commit("setCurrentRoom", room);
      dispatch("initWebSocket");
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

export default store;
