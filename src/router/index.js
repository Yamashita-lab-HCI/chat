import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import UserProfile from "@/components/UserProfile.vue";
import RoomPage from "@/components/RoomPage.vue";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/home", component: HomePage },
  { path: "/room/:id", component: RoomPage, props: true },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/user-profile", component: UserProfile },
];

const router = createRouter({
  history: createWebHistory(process.env.STATIC_URL),
  routes,
});

export default router;
