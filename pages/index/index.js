// index.js
// 微信小程序，引入的路径一定要补全
import {
  request
} from '../../request/index'

Page({
  data: {
    swiperList: [],
    cateList: [],
    floorList:[]
  },
  onLoad(options) {
    // 发送异步请求获取轮播图数据
    this.getSwperList(),
    this.getCateList(),
    this.getFloorList()
  },
  // 轮播图数据
  getSwperList() {
    request({
      url: '/home/swiperdata',
    }).then(result => this.setData({
      swiperList: result
    }))
  },
  // 分类导航数据
  getCateList(){
    request({
      url: '/home/catitems',
    }).then(result => this.setData({
      cateList: result
    }))
  },
  // 楼层数据
  getFloorList(){
    request({
      url: '/home/floordata',
    }).then(result => this.setData({
      floorList: result
    }))
  }
})