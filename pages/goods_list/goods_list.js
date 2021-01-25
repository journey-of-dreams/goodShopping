// pages/goods_list/goods_list.js
/*
用户上滑页面，开始加载下一页
1.找到滚动条触底事件
2.判断是否有下一页数据，如果没有弹出一个提示框，如果有数据，要注意的是：要对data中的数组进行拼接，而不是全部替换！！！！！
*/
/*
下拉刷新
1.触发下拉刷新事件，在页面的json文件中开启配置
2.重置数据数组
3.重置页码为1 
4.数据请求成功手动关闭等待效果
*/
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    tabs: [{
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      },
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    // 关键字
    query: '',
    // 分类id
    cid: '',
    // 页码
    pagenum: 1,
    // 页容量
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()


  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    const total = res.total
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)

    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },
  handleTabsItemChange(e) {
    const index = e.detail
    let tabs = this.data.tabs
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 页面上滑，滚动条触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有页数了
      wx.showToast({
        title: '没有数据了',
      })
    } else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  //下拉刷新事件
  onPullDownRefresh() {
    // 重置商品数组
    this.setData({
      goodsList: [],
    })
    // 重置页码
    this.QueryParams.pagenum = 1
    // 重新请求商品
    this.getGoodsList()
  }
})