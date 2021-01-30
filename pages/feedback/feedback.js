/*
点击按钮时，调用小程序选择图片的内置api */
Page({
  data: {
    tabs: [{
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    isActived: [false, false, false, false],
    // 被选中图片的路径数组
    chooseImgs: [],
    // 文本域内容
    textVal: ""
  },
  // 外网图片的路径数组
  UpLoadImgs: [],
  // 控制tab选项的选中状态
  handleTabsItemChange(e) {
    const index = e.detail
    let tabs = this.data.tabs
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 点击选择添加图片
  handleChoose() {
    // 调用内置api chooseImage选择添加图片
    wx.chooseImage({
      // 同时选中图片的最大数量
      count: 9,
      // 图片格式：原图/压缩图
      sizeType: ['original', 'compressed'],
      // 图片来源：相册/照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        let chooseImgs = [...this.data.chooseImgs, ...result.tempFilePaths]
        this.setData({
          chooseImgs
        })
      }
    })
  },
  // 点击图片上的小叉叉删除该图片
  handleYourIndex(e) {
    let index = e.detail
    let chooseImgs = this.data.chooseImgs
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs
    })
  },
  // 为问题种类选项添加选中状态
  handleIsActive(e) {
    // 获取被选中选项的索引
    let index = e.currentTarget.dataset.index
    // 将被选中选项的状态取反
    let isIndexActived = this.data.isActived[index]
    isIndexActived = !isIndexActived
    // 使用新数组替换原数组
    let isActived = this.data.isActived
    isActived.splice(index, 1, isIndexActived)
    this.setData({
      isActived
    })
  },
  // 获取文本域输入内容
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮
  handleFormSubmit() {
    let {
      textVal,
      chooseImgs
    } = this.data
    // 合法性验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '不合法输入',
        icon: 'none',
        mask: true,
        duration: 1000
      })
      return
    }
    // 如果有图片需要上传
    if (chooseImgs.length !== 0) {
      // 显示加载中弹窗
      wx.showLoading({
        title: '正在上传中...',
      })
      // 上传文件的api不支持同时上传多个文件，只能遍历数组逐个上传
      chooseImgs.forEach((v, i) => {
        // 将图片上传到服务器
        wx.uploadFile({
          // 被上传的文件路径
          filePath: v,
          // 被上传的文件名称，自定义
          name: 'file',
          // 图片要上传的路径，要上传到哪
          url: 'https://www.superbed.cn/upload',
          // 顺带的文本信息
          formData: {
            detail: 'textVal'
          },
          success: (result) => {
            let url = JSON.parse(result.data).url
            this.UpLoadImgs.push(url)
            console.log(this.UpLoadImgs);
            if (i === chooseImgs.length - 1) {
              wx.hideLoading()
              // 上传完毕，重置页面
              textVal = ""
              chooseImgs = []
              // 返回上一个页面
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      })
    } else {
      console.log('提交文本，同样需要写要提交的路径，这里没写');
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})