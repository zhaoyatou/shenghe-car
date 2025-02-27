const roleData = [
  {
    id: parseInt(Math.random() * 1000000000000),
    roleString: '管理员',
    text: '系统管理员，拥有所有权限',
    key: 'admin',
    role: 'admin',
    roleIds: '1,27,28,100,101,102,103,104,105,106,107,108,109,110,111'
  },
  {
    id: parseInt(Math.random() * 1000000000000),
    roleString: '管理员',
    text: '系统管理员，拥有所有权限',
    key: 'admin1',
    role: 'admin1',
    roleIds: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36'
  },
  {
    id: parseInt(Math.random() * 1000000000000),
    roleString: '普通用户',
    text: '普通用户，拥有大部分权限',
    key: 'test1',
    role: 'test1',
    roleIds: '1,2,4,5,6,7,11,12,13,17,18,19,35,36,23,24,25,26,27,28,29,30,31,32,33'
  },
  {
    id: parseInt(Math.random() * 1000000000000),
    roleString: '编辑者',
    text: '文档管理人员，只能看富文本页面',
    key: 'editor1',
    role: 'editor1',
    roleIds: '36,24,25,3,11,12,13'
  },
  {
    id: parseInt(Math.random() * 1000000000000),
    roleString: '其他',
    text: '其他角色权限',
    key: 'custom',
    role: 'custom',
    roleIds: '1,2,4,5,6,7,8,9'
  }
];

const userData = [
  {
    id: parseInt(Math.random() * 1000000000000),
    username: 'admin',
    password: '123456',
    role: 'admin',
    date: '2022-04-28',
    text: '系统管理员',
    key: 'admin',
    location: 'Wuhan',
    position: '汽车服务中心',
    label: '汽车服务中心',
    skill: '汽车服务中心'
  },
  {
    id: parseInt(Math.random() * 1000000000000),
    username: 'admin1',
    password: '123456',
    role: 'admin1',
    date: '2020-10-13',
    text: '系统管理员，拥有所有权限',
    key: 'admin1',
    location: 'Wuhan',
    position: '混元太极门掌门人',
    label: '年轻人不讲武德',
    skill: '闪电五连鞭'
  },
  {
    id: parseInt(Math.random() * 1000000000000),
    username: 'test1',
    password: '123456',
    role: 'test1',
    date: '2020-10-13',
    text: '不知名体验者，峡谷最快乐的男人',
    key: 'test1',
    location: 'Wuhan',
    position: '四皇',
    label: '给我一个面子',
    skill: '面子果实'
  },
  {
    id: parseInt(Math.random() * 1000000000000),
    username: 'editor1',
    password: '123456',
    role: 'editor1',
    date: '2020-10-13',
    text: 'admin签约金牌作家--马老师',
    key: 'editor1',
    location: 'Wuhan',
    position: '金牌作者',
    label: '暂无',
    skill: '暂无'
  }
];

module.exports = {
  roleData,
  userData
};
