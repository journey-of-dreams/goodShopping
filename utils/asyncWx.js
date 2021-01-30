//获取权限
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withSubscriptions: true,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 添加地址
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

//设置权限
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
// 弹出一个提示框showModel
export const showModel = (content) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
// 弹出一个提示框showModel
export const showToast = (title) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon: 'none',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 登录
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}
// 发起微信支付
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result) => {
        resolve(result)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}