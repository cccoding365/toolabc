import { createRouter, createWebHistory } from 'vue-router';
import { h } from 'vue';

/* ---------- 1. 工具函数 ---------- */
// 批量导入 views 目录下的 .vue 文件
const views = import.meta.glob('../views/**/*.vue', { eager: true });
const layouts = import.meta.glob('../layouts/**/*.vue', { eager: true });

// 文件名转标题名
const upperFirst = str => str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

// 将文件路径转成路由路径
const pathToRoute = path => {
    let routePath = path
        .replace('../views', '')      // 去掉前缀
        .replace(/\.vue$/, '')        // 去掉扩展名
        .replace(/\/index$/i, '')     // index 当成文件夹默认页
        .toLowerCase();

    // 处理动态路由 [id].vue -> :id
    routePath = routePath.replace(/\[(\w+)\]/g, ':$1');
    return routePath || '/';
};

// 将文件路径转成路由 name
const pathToName = path => {
    return path
        .replace('../views/', '')
        .replace(/\.vue$/, '')
        .replace(/\//g, '-')
        .replace(/-index$/, '');
};

/* ---------- 2. 自动构造路由表 ---------- */
const routes = [];

routes.unshift({
    path: '/',
    redirect: '/home'
});

Object.entries(views).forEach(([file, mod]) => {
    const component = mod.default;
    const routePath = pathToRoute(file);
    const name = pathToName(file);

    // 读取自定义路由配置（在 <route> 自定义块中）
    const customRoute = mod.default?.route || {};

    // 布局处理：优先取自定义，再按路径规则，最后兜底 Default
    let layoutName = customRoute.layout || 'default';
    if (typeof layoutName === 'string') {
        layoutName = layouts[`../layouts/${layoutName}.vue`]?.default;
    }
    if (!layoutName) layoutName = layouts['../layouts/default.vue']?.default;

    routes.push({
        path: routePath,
        name,
        component: layoutName
            ? { render: () => h(layoutName, () => h(component)) }
            : component,
        meta: {
            title: component.title || upperFirst(name),
            requiresAuth: customRoute.requiresAuth ?? false,
            ...customRoute.meta
        }
    });
});

/* ---------- 3. 404 页面 ---------- */
routes.push({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue')
});

/* ---------- 4. 路由实例 ---------- */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

/* ---------- 5. 全局前置守卫 ---------- */
router.beforeEach(async (to, from, next) => {
    // 1. 动态修改标题
    document.title = (to.meta.title ? to.meta.title + ' - ' : '') + 'Toolabc';

    // 2. 简单登录拦截示例（根据业务调整）
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next({ path: '/login', query: { redirect: to.fullPath } });
        return;
    }

    next();
});

export default router;