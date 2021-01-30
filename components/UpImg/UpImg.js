// components/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: ""
    },
    imgIndex: {
      type: Number,
      value: -1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleRemoveImg(e) {
      let index = e.currentTarget.dataset.imgindex
      this.triggerEvent("yourIndex", index)
    }
  }
})