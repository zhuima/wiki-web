import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'
import About from '../views/About.vue'
import Doc from '../views/Doc.vue'
import AdminUser from '../views/admin/AdminUser.vue'
import AdminEbook from '../views/admin/AdminEbook.vue'
import AdminCategory from '../views/admin/AdminCategory.vue'
import AdminDoc from '../views/admin/AdminDoc.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/doc',
    name: 'Doc',
    component: Doc,
  },
  {
    path: '/admin/user',
    name: 'AdminUser',
    component: AdminUser,
  },
  {
    path: '/admin/ebook',
    name: 'AdminEbook',
    component: AdminEbook,
  },
  {
    path: '/admin/category',
    name: 'AdminCategory',
    component: AdminCategory,
  },
  {
    path: '/admin/doc',
    name: 'AdminDoc',
    component: AdminDoc,
  },
]

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
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
