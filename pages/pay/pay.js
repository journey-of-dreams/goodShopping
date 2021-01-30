// pages/cart/cart.js
/*
 支付流程
 创建订单（获取订单编号） -》 准备预支付 -》 发起微信支付 -》 查询订单
 1.先判断缓存中是否有token，如果没有需要先跳到授权页面
 2.通过这个token获取订单编号*/
3.
import {
  getSetting,
  openSetting,
  chooseAddress,
  showModel,
  showToast,
  requestPayment
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  request
} from '../../request/index.js'

Page({
  data: {
    address: {},
    cart: {},
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取收货地址信息
    const address = wx.getStorageSync('address')
    // 获取购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    // 获取总价格和总数量并存入data中
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num
      totalNum++
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  // 点击支付
  async handleOrderPay() {
    try {
      // 获取token
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        })
      }
      // 创建订单
      // 请求头参数
      const header = {
        // 授权参数即为token
        Authorization: token
      }
      // 请求体参数
      const order_price = this.data.totalPrice //总价格
      const consignee_addr = this.data.address.all //详细地址
      const cart = this.data.cart
      let goods = [] //订单数组
      goods = cart.forEach(v => {
        goods_id: v.goods_id
        goods_number: v.num
        goods_price: v.goods_price
      })
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      const {
        order_number
      } = await request({
        url: '/my/orders/create',
        method: 'POST',
        data: orderParams,
        header
      })
      console.log(order_number)
      // 预支付
      const {
        pay
      } = await request({
        url: '/my/orders/req_unifiedorder',
        method: "POST",
        header,
        data: {
          order_number
        }
      })
      // 发起微信支付
      await requestPayment(pay)
      // 查询订单状态
      const res = await request({
        url: '/my/orders/chkOrder',
        method: "POST",
        header,
        data: {
          order_number
        }
      })
      await showToast('支付成功')
      // 删除缓存中已经被选中的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart)
      // 此时跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order',
      })
    } catch (error) {
      await showToast('支付失败')
    }
  }
})