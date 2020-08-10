import Mock from 'mockjs';

const domain = 'http://test.com/api/';

// 提交数据
Mock.mock(`${domain}/getData/`, 'get', {
  code: 200,
  msg: 'successful!',
  data: {},
});
