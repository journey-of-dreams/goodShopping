// pages/test/test.js
Page({
  handleSlider(e) {
    const sliderValue = e.detail.value
    this.setData({
      sliderValue
    })
  }
})