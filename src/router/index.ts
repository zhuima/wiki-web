import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// // 路由登录拦截
// router.beforeEach((to, from, next) => {
//     // 要不要对meta.loginRequire属性做监控拦截
//     if (to.matched.some(function (item) {
//         console.log(item, "是否需要登录校验：", item.meta.loginRequire);
//         return item.meta.loginRequire
//     })) {
//         const loginUser = store.state.user;
//         if (Tool.isEmpty(loginUser)) {
//             console.log("用户未登录！");
//             next('/');
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// });

export default router
