// 延保业务
import mainLayout from '@/layouts/mainLayout';

const businessRouter = {
  name: 'system',
  path: '/system',
  component: mainLayout,
  redirect: '/system/management',
  meta: {
    role: 6,
    title: '系统配置',
    icon: 'nest'
  },
  children: [
    {
      name: 'systemmanagement',
      path: '/system/management',
      component: () => import('@/views/system/management/index'),
      meta: { title: '人员管理', role: 9 },
    },
    {
      name: 'storemanagement',
      path: '/system/storemanagement',
      component: () => import('@/views/system/storemanagement/index'),
      meta: { title: '门店管理', role: 7 }
    },
    {
      name: 'commoditymanagement',
      path: '/system/commoditymanagement',
      component: () => import('@/views/system/commoditymanagement/index'),
      meta: { title: '数据管理', role: 8 }
    },
    {
      name: 'product',
      path: '/system/product',
      component: () => import('@/views/system/product/index'),
      meta: { title: '产品管理', role: 12 }
    },
    {
      name: 'price',
      path: '/system/price',
      component: () => import('@/views/system/pricemanagement/index'),
      meta: { title: '价格管理', role: 13 }
    },
  ]
};

export default businessRouter;
