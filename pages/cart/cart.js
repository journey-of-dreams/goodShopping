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
  chooseAddress,
  showModel,
  showToast
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    address: {},
    cart: {},
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取收货地址信息
    const address = wx.getStorageSync('address')
    // 获取购物车数据
    const cart = wx.getStorageSync('cart') || []
    // 计算全选
    // every数组注意点：如果调用它的是空数组，那么返回值是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false
    this.setData({
      address
    })
    this.setCart(cart)
  },
  // 添加收货地址
  async handleChooseAddress(e) {
    try {
      // 获取权限状态
      // const res1 = await getSetting()
      // const scopeAddress = res1.authSetting["scope.address"]
      // // 判断权限状态
      // if (scopeAddress === false) {
      //   // 诱惑用户打开授权页面
      //   await openSetting()
      // }
      // 获取收货地址
      let address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 将收货地址存入缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
  },
  // 商品的选中
  // 获取到被修改的商品对象，商品对象状态取反，重新填充回data和缓存中，重新计算总价格和数量
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id
    let cart = this.data.cart
    let index = cart.findIndex(v => v.goods_id === goods_id)
    cart[index].checked = !cart[index].checked

    this.setCart(cart)
  },

  // 设置购物车状态，重新计算底部工具栏数据
  setCart(cart) {
    // 计算总价格和总数量，并将修改后的cart存入缓存和data中
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num
        totalNum++
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length === 0 ? false : allChecked
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  },

  // 全选功能
  handleItemAllCheck() {
    let {
      cart,
      allChecked
    } = this.data
    allChecked = !allChecked
    cart.map(v => v.checked = allChecked)
    this.setCart(cart)
  },

  // 商品数量编辑
  // "+"、"-"按钮绑定同一个点击事件，区分的关键是自定义属性，传递的是被点击商品的goods_id
  async handleItemNumEdit(e) {
    const {
      operation,
      id
    } = e.currentTarget.dataset
    let cart = this.data.cart
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 判断是否要删除商品
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModel('是否要删除该商品')
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      cart[index].num += operation
      this.setCart(cart)
    }
  },

  // 点击结算
  async handlePay() {
    const {
      address,
      totalNum
    } = this.data
    // 判断是否有选中商品
    if (totalNum === 0) {
      await showToast('未选中任何商品')
      // 判断是否收货地址
    } else if (!address.userName) {
      await showToast('未添加收货地址')
    } else {
      // 跳转到支付页面
      wx.navigateTo({
        url: '/pages/pay/pay',
      })
    }
  },
  // 长按删除商品
  async handleLongPress(e) {
    await showModel('是否删除该商品？').then(res => {
      if (!res.cancel) {
        let index = e.currentTarget.dataset.index
        let cart = this.data.cart
        cart.splice(index, 1)
        wx.setStorageSync('cart', cart)
        this.setData({
          cart
        })
      }
    })
  }
})