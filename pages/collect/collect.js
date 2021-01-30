// pages/collect/collect.js
Page({
  data: {
    tabs: [{
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌关注',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        value: '我的足迹',
        isActive: false
      },
    ],
    collect: []
  },
  onShow() {
    const collect = wx.getStorageSync('collect') || []
    this.setData({
      collect
    })
    let pages = getCurrentPages()
    let index = pages[pages.length - 1].options.type
    this.changeTitleByIndex(index - 1)
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
  }
})