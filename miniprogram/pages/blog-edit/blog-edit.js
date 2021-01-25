// miniprogram/pages/blog-edit/blog-edit.js
const MAX_IMG_NUM = 9;
// 文字内容
let content = '';

// 云数据库
const db = wx.cloud.database()

// 用户信息
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0, // 输入的文字数
    selectPhoto: true,
    footerBottom: 0, // 发布按钮距离底部的距离
    images: [], // 已经选择的图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 输入事件
  onInput(event) {
    const value = event.detail.value
    content = value
    this.setData({
      wordsNum: value.length
    })
  },

  // 失去焦点事件
  onBlur(event) {
    this.setData({
      footerBottom: 0,
    })
  },
  // 获取焦点事件
  onFocus(event) {
    const footerBottom = event.detail.height
    this.setData({
      footerBottom,
    })
  },
  // 选择图片
  onChooseImage() {
    const imgs = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: imgs,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.setData({
          images,
          selectPhoto: images.length !== 9
        })
      }
    })
  },

  // 删除图片
  onDelImage(event) {
    const index = event.currentTarget.dataset.index;
    let images = this.data.images;
    images.splice(index, 1)
    this.setData({
      images,
      selectPhoto: images.length !== 9
    })
  },
  // 点击预览
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.currentTarget.dataset.imgsrc
    })
  },

  // 点击发布
  async send () {
    // 判断内容
    if(content.trim() === ''){
      wx.showModal({
        title: '提示',
        content: '发布内容不能为空'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true,
    })
    // 图片上传
    const images = this.data.images
    const fileIdList = []
    for(let i in images){
      const res = await this.handleUploadCloud(images[i])
      if(res.code === '0000'){
        const { res: {fileID}} = res
        fileIdList.push(fileID)
      }
    }
    // 写入到云数据库
    db.collection('blog')
    .add({
      data: {
        ...userInfo,
        content,
        img: fileIdList,
        createTime: db.serverDate()
      }
    })
    .then(res => {
      wx.hideLoading()
      // wx.showToast({
      //   title: '发布成功',
      // })
      // 发布成功返回blog页面
      wx.navigateBack()
      const pages = getCurrentPages()
      // 取上一个页面
      const prevPage = pages[pages.length - 2];
      if(prevPage){
        prevPage.onPullDownRefresh()
      }
    })
    .catch(err => {
      wx.showToast({
        title: '发布失败',
      })
      wx.hideLoading()
      console.log('发布存储失败', err)
    })
  },

  // 图片上传云存储
  handleUploadCloud(imgUrl) {
    return new Promise(resolve => {
      const suffix = /\.\w+$/.exec(imgUrl)[0]
      const cloudPath = `blog/${Date.now()}-${Math.floor(Math.random()*10000000)}${suffix}`
      wx.cloud.uploadFile({
        cloudPath, // 云存储地址
        filePath: imgUrl, // 图片地址
        success: (res) => {
          resolve({code: '0000' , res})
        },
        fail: (err) => {
          resolve({code: '9999' , err})
        }
      })
    })
  }
})