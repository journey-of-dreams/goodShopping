// pages/auth/auth.js
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  login
} from '../../utils/asyncWx.js'

Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 获取小程序登录成功后的五个必须参数，code
      // const {
      //   encryptedData,
      //   rawData,
      //   iv,
      //   signature
      // } = e.detail
      // const {
      //   code
      // } = await login()
      // const loginParams = {
      //   encryptedData,
      //   rawData,
      //   iv,
      //   signature,
      //   code
      // }
      // 获取token
      // const {
      //   token
      // } = await request({
      //   url: '/users/wxlogin',
      //   data: loginParams,
      //   method: 'post'
      // })
      const newToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
      // 将token存入缓存中，同时跳转到上一个页面
      wx.setStorageSync('token', newToken)
      wx.navigateBack({
        // delta表示返回的层级，1表示返回上一层，2表示返回上两层
        delta: 1,
      })
    } catch (error) {
      console.log(error)
    }
  }
})