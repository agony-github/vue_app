
import Mock from 'mockjs'
import apiDate from './data.json'
Mock.mock('/api2/seller', {
  errno: 0,   // 正确的数据
  data: apiDate.seller
})
Mock.mock('/api2/goods', {
  erron: 0,
  data: apiDate.goods
})
Mock.mock('/api2/ratings', {
  errno: 0,
  data: apiDate.ratings
})

