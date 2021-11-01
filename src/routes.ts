import { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
	{ path: "/", component: () => import("./pages/Home.vue"), meta: { title: "Home" } },
	{ path: "/:pathMatch(.*)*", component: () => import("./pages/NotFound.vue"), meta: { title: "Page not found" } }
]