// pages/search/search.js
// 输入框绑定input事件，类似于vue双向绑定
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    goods: [],
    // 是否显示按钮
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  // 定时器
  TimeId: -1,
  // 输入框值改变时触发
  handleInput(e) {
    let value = e.detail.value
    // 检测合法性
    if (!value.trim()) {
      // 不合法
      this.setData({
        goods: [],
        isFocus: false
      })
      return
    }
    // 此时将按钮显示
    this.setData({
      isFocus: true
    })
    // 准备发送请求获取数据
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 500);
  },
  // 发送请求获取搜索建议
  // 防抖：避免频繁刷新，一般用于搜索（节流：一般用于上拉下拉刷新）
  async qsearch(query) {
    const res = await request({
      url: "/goods/search",
      data: {
        query
      }
    })
    const goods = res.goods
    this.setData({
      goods
    })
  },
  // 点击取消按钮清除搜索值
  handleCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  }
})