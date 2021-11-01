export const routes = [
	{ path: "/", component: () => import("./pages/Home.vue") },
	{path: "/:pathMatch(.*)*", component: () => import("./pages/NotFound.vue")}
]