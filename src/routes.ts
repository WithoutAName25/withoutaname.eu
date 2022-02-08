import { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
	{ path: "/", component: () => import("./pages/Home.vue"), meta: { title: "Home" } },
	{
		path: "/tools/digital-electronics/basics",
		component: () => import("./pages/tools/digital-electronics/Basics.vue"),
		meta: { title: "Digital electronics" }
	},
	{ path: "/:pathMatch(.*)*", component: () => import("./pages/NotFound.vue"), meta: { title: "Page not found" } }
]