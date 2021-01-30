// pages/category/category.js
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    leftMenuList: [],
    rightContent: [],
    // 被点击时的左侧菜单
    currentIndex: 0,
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  onLoad() {
    // 使用缓存技术
    // 没有旧数据直接发送请求，有旧数据并且旧数据没有过期，直接拿取本地存储数据
    // 1.获取本地存储数据getStorageSync('key')
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      this.getCates()
    } else {
      // 有旧数据，定义过期时间
      if (Date.now - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates()
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 使用es7的async await来发送请求
  async getCates(index=0) {
    const result = await request({
      url: '/categories'
    })
    this.Cates = result
    // 把接口数据存入本地存储
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    })
    // 左侧大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 右侧商品数据
    let rightContent = this.Cates[index].children
    this.setData({
      leftMenuList,
      rightContent
    })
    // 关闭刷新
    wx.stopPullDownRefresh()
  },
  // 左侧菜单的点击事件
  handleItemTab(e) {
    const index = e.target.dataset.index
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签距离顶部的距离
      scrollTop: 0
    })
    console.log(this.data.currentIndex)
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.Cates = []
    this.getCates(this.data.currentIndex)
  }
})