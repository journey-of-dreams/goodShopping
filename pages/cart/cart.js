// pages/cart/cart.js
/*
添加收货地址
1.绑定点击事件
2.获取用户对小程序所授予的地址权限scope，wx.getSetting
  点击地址提示框为确定，scope为true，直接调用收货地址
  点击地址提示框为取消，scope为false，诱惑用户打开授权设置页面wx.openSetting()
  用户没有点击过，scope为undefined，直接调用收货地址
3.把获取到的收货地址存入到本地存储中 */
import {
  getSetting,
  openSetting,
  chooseAddress
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {

  },
  onLoad: function (options) {

  },
  // 添加收货地址
  async handleChooseAddress(e) {
    try {
      // 获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"]
      // 判断权限状态
      if (scopeAddress === false) {
        // 诱惑用户打开授权页面
        await openSetting()
      }
      // 获取收货地址
      const address = await chooseAddress()
      // console.log(res2)
      // 将收货地址存入缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
  }
})