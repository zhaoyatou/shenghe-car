import mainLayout from '@/layouts/mainLayout';

const componentsRouter = {
  name: 'components',
  path: '/components',
  component: mainLayout,
  redirect: '/components/vr',
  meta: {
    title: '延保业务',
    icon: 'component',
    role: 36
  },
  children: [
    {
      name: 'table',
      path: '/components/table',
      component: () => import('@/views/components/table/index'),
      meta: { title: '新建录单', role: 38 }
    },
  ]
};

export default componentsRouter;
