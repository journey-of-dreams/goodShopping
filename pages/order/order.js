// pages/order/order.js
/*
 根据url上的type去发送请求获取订单数据*/
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    orders: [],
    tabs: [{
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      },
    ]
  },
  onShow(options) {
    // 判断缓存中是否存在token
    const token = wx.getStorageSync("token")
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
    }
    // 获取当前小程序的页面栈数组，长度最大是10的页面
    // 数组索引最大的就是当前页面，通过当前页面就可以拿到options，以此拿到url传递过来的参数
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    // 拿到url上的type参数
    const {
      type
    } = currentPage.options
    // 根据传过来的type值控制tab选项的状态
    this.changeTitleByIndex(parseInt(type) - 1)
    this.getOrderList(type)
  },
  // 获取订单列表
  async getOrderList(type) {
    const res = await request({
      url: '/my/orders/all',
      data: {
        type
      },
    })
    // 成功拿到订单数组
    // this.setData({
    //   orders: res.orders || []
    // })

    // 假装拿到了orders
    this.setData({
      orders: [{
        order_id: 1104,
        user_id: 23,
        order_number: "HMDD20210128000000001066",
        order_price: 1361,
        consignee_addr: "广东省广州市海珠区新港中路397号",
        create_time: '2021/01/28 下午10:28:28',
        goods: {
          goods_id: 12345,
          goods_number: 1,
          goods_price: 210
        }
      }]
    })
  },
  // 根据标题索引来选中激活状态
  changeTitleByIndex(index) {
    let tabs = this.data.tabs
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 点击控制tab选项选中状态
  handleTabsItemChange(e) {
    const index = e.detail
    this.changeTitleByIndex(index)
    this.getOrderList(index + 1)
  }
})