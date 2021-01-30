// pages/goods_detail/goods_detail.js
/*
点击加入购物车
1.先绑定点击事件
2.获取缓存中的购物车数据数组格式
3.先判断当前商品是否已存在于购物车中
  已经存在，修改商品数据，执行该商品数量加1，重新把购物车数组填充回缓存中
  不存在，直接给购物车添加一个新元素，新元素带上购买数量属性
4.弹出用户提示 */
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    goodsObj: {},
    isCollect: false //商品默认未收藏
  },
  // 当前商品对象
  GoodsInfo: {},
  onShow: function () {
    let pages = getCurrentPages()
    let options = pages[pages.length - 1].options
    const {
      goods_id
    } = options
    this.getGoodsDetail(goods_id)
  },
  async getGoodsDetail(goods_id) {
    const res = await request({
      url: '/goods/detail?goods_id=' + goods_id
    })
    this.GoodsInfo = res
    // 获取缓存中的商品数组
    let collect = wx.getStorageSync("collect") || []
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      // 由于拿到的goodsObj中有很多数据不需要用，因此我们将需要用到的数据拿出来，这样可以很好的节约性能
      goodsObj: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        // iphone部分手机无法识别webp图片格式，临时自己将webp格式改成jpg
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.pics
      },
      isCollect
    })
  },
  // 点击轮播图方法预览
  handlePreviewImage(e) {
    const current = e.currentTarget.dataset.url
    // console.log(url)
    // 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    wx.previewImage({
      current,
      urls
    })
  },
  // 加入购物车
  handleCartAdd(e) {
    let cart = wx.getStorageSync('cart') || []
    // 判断该商品是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 不存在，第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
      wx.showToast({
        title: '成功添加新商品',
        duration: 1500,
        mask: true,
      })
    } else {
      // 已经存在，该商品数量加一
      cart[index].num++
      wx.showToast({
        title: '商品数量加一',
        duration: 1500,
        mask: true,
      })
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart)
  },
  // 点击收藏商品
  handleCollect() {
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || []
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index !== -1) {
      // 已经存在于商品收藏数组中了，取消收藏，从数组中删除该商品
      collect.splice(index, 1)
      wx.showToast({
        title: '取消收藏',
        mask: true,
        duration:1000
      })
    } else {
      collect.push(this.GoodsInfo)
      wx.showToast({
        title: '收藏成功',
        mask: true
      })
    }
    // 存入缓存
    wx.setStorageSync("collect", collect)
    // 修改图标属性isCollect
    let isCollect = this.data.isCollect
    this.setData({
      isCollect: !isCollect
    })
  }
})