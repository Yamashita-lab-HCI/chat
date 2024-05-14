<template>
  <div class="register">
    <VaInput
      v-model="username"
      @input="checkUsername"
      :success="isUsernameValid && !usernameError"
      :error="usernameError.length > 0"
      :error-messages="usernameError"
      label="Username"
      placeholder="Enter your username"
    />
    <VaInput
      v-model="password"
      @input="checkPassword"
      :success="isPasswordValid && !passwordError"
      :error="passwordError.length > 0"
      :error-messages="passwordError"
      label="Password(at least 6 characters)"
      placeholder="Enter your password"
      type="password"
    />
    <div></div>
    <VaButton v-if="isFormValid" @click="registerUser">Register</VaButton>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import dummyData from '@/dummyData';
import axios from "axios";

export default {
  name: "RegisterPage",
  data() {
    return {
      username: "",
      password: "",
      usernameError: "",
      passwordError: "",
    };
  },
  computed: {
    ...mapState(["isUsernameValid", "isPasswordValid"]),
    isFormValid() {
      return this.isUsernameValid && this.isPasswordValid;
    },
  },
  methods: {
    ...mapActions(["updateUsernameValidation", "updatePasswordValidation"]),
    checkUsername() {
      /*
      const userExists = dummyData.users.some(user => user.username === this.username);
      if (userExists || !this.username) {
        this.usernameError = 'This username is already taken or invalid.';
        this.updateUsernameValidation(false);
      } else {
        this.usernameError = '';
        this.updateUsernameValidation(true);
      }
      */
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "check_username/",
          { username: this.username },
          {
            headers: {
              "X-CSRFToken": window.csrfToken,
            },
          }
        )
        .then((response) => {
          if (!response.data.isValid) {
            this.usernameError = "This username is already taken or invalid.";
            this.updateUsernameValidation(false);
          } else {
            this.usernameError = "";
            this.updateUsernameValidation(true);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            this.usernameError = error.response.data.message;
          } else {
            this.usernameError = "Network error or server is unreachable.";
          }
        });
    },
    checkPassword() {
      if (this.password.length < 6) {
        this.passwordError = "Password must be at least 6 characters long.";
        this.updatePasswordValidation(false);
      } else {
        this.passwordError = "";
        this.updatePasswordValidation(true);
      }
    },
    registerUser() {
      /*
      if (this.isFormValid) {
        dummyData.users.push({ username: this.username, password: this.password });
        this.$router.push('/login');
      }
      */
      if (this.isFormValid) {
        axios
          .post(
            process.env.VUE_APP_BASE_URL + "register/",
            {
              username: this.username,
              password: this.password,
            },
            {
              headers: {
                "X-CSRFToken": window.csrfToken,
              },
            }
          )
          .then(() => {
            this.$router.push("/login");
          })
          .catch((error) => {
            this.passwordError =
              "Registration failed: " +
              (error.response ? error.response.data.message : "Server error");
          });
      }
    },
  },
};
</script>

<style>
.div {
  margin-top: 10px;
}
</style>
