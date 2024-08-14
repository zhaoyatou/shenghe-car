import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Layout from '@/layouts';
import mainLayout from '@/layouts/mainLayout';
// 延保业务
import businessRouter from './modulesCar/ewBusiness';
// 系统配置
import systemConfiguration from './modulesCar/systemConfiguration';
// 统计汇总
import summaryStatistics from './modulesCar/summaryStatistics';
//基础路由
export const baseRoute = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error/403'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/views/error/500'),
    hidden: true
  }
];

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/ewbusiness/newfrom',
    hidden: true,
    children: [
      businessRouter,
      summaryStatistics,
      systemConfiguration,
      {
        name: 'error',
        path: '/error',
        component: mainLayout,
        redirect: '/error/403',
        meta: { title: '错误页面', icon: 'error', role: 1119 },
        children: [
          {
            name: '403',
            path: '/error/403',
            component: () => import('@/views/error/403'),
            meta: { title: '403', role: 1120 }
          },
          {
            name: '404',
            path: '/error/404',
            component: () => import('@/views/error/404'),
            meta: { title: '404', role: 1121 }
          },
          {
            name: '500',
            path: '/error/500',
            component: () => import('@/views/error/500'),
            meta: { title: '500', role: 1122 }
          },
        ]
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = function () {
  return new VueRouter({
    routes: baseRoute,
    scrollBehavior: () => ({ y: 0 })
  });
};

const router = createRouter();

export function resetRouter() {
  router.matcher = createRouter().matcher;
}

//重定向时报错，用这个不让他报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export default router;
