// pages/user/user.js
import {
  chooseAddress,
  showModel,
  showToast
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    userInfo: {},
    // 被收藏的商品数量
    collectNums: 0
  },
  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    const collect = wx.getStorageSync('collect') || []
    this.setData({
      userInfo,
      collectNums: collect.length
    })
  },
  // 点击添加收货地址
  async handleChooseAddress(e) {
    try {
      // 获取收货地址
      let address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 将收货地址存入缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
  },
})