// 延保业务
import mainLayout from '@/layouts/mainLayout';

const businessRouter = {
  name: 'ewbusiness',
  path: '/ewbusiness',
  component: mainLayout,
  redirect: '/ewbusiness/newfrom',
  meta: {
    role: 1,
    title: '延保业务',
    icon: 'nest'
  },
  children: [
    {
      name: 'newfrom',
      path: '/ewbusiness/newfrom',
      component: () => import('@/views/ewbusiness/newBusiness/index'),
      meta: { title: '新建录单', role: 1 }
    },
    {
      name: 'orderList',
      path: '/order/list',
      component: () => import('@/views/orderList/index'),
      meta: { title: '订单列表', role: 2 }
    },
    {
      name: 'retreatSingle',
      path: '/order/retreatsingle',
      component: () => import('@/views/retreatSingle/index'),
      meta: { title: '退单列表', role: 3 }
    },
    {
      name: 'aduitResult',
      path: '/aduit/result',
      component: () => import('@/views/findingsaudit/result'),
      meta: { title: '审核结果', hidden: true },
      hidden: true
    },
    {
      name: 'viewcon',
      path: '/view/contract',
      component: () => import('@/views/viewContract/index'),
      meta: { title: '查看合同', hidden: true },
      hidden: true
    },
    {
      name: 'collectDetail',
      path: '/collect/detail',
      component: () => import('@/views/statistics/collectDetail/index'),
      meta: { title: '统计详情', hidden: true },
      hidden: true
    },
  ]
};

export default businessRouter;
