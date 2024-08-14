// 延保业务
import mainLayout from '@/layouts/mainLayout';

const businessRouter = {
  name: 'statistics',
  path: '/statistics',
  component: mainLayout,
  redirect: '/statistics/summarystatistics',
  meta: {
    role: 4,
    title: '汇总统计',
    icon: 'nest'
  },
  children: [
    {
      name: 'summarystatistics',
      path: '/statistics/summarystatistics',
      component: () => import('@/views/statistics/summaryStatistics/index'),
      meta: { title: '汇总统计', role: 4 },
    },
    {
      name: 'financialstatements',
      path: '/financial/statements',
      component: () => import('@/views/statistics/financial/index'),
      meta: { title: '财务报表', role: 5 }
    },
    {
      name: 'businessreport',
      path: '/business/sreport',
      component: () => import('@/views/statistics/businessreport/index'),
      meta: { title: '业务报表', role: 6 }
    },
  ]
};

export default businessRouter;
