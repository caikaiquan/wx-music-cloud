
// pages/blog/blog.js
const count = 10 // 分页的条数
let keyword = '' // 查询的关键字
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false, // 控制底部弹框是否显示
    blogList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getBlogList()
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
    this.getBlogList(0, 'clear')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 滚动触底加载
    this.getBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogid=${blog._id}`,
    }
  },

  // 点击发布
  onPublish() {
    wx.getSetting({
      // withSubscriptions: true,
      success: (result) => {
        if (result.authSetting && result.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (result) => {
              this.onLoginSuccess(result.userInfo)
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },

  // 授权成功
  onLoginSuccess(userInfo) {
    this.setData({
      modalShow: false
    }, () => {
      wx.navigateTo({
        url: `../blog-edit/blog-edit?nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`,
      })
    })
  },

  // 授权失败
  onLoginFail() {
    wx.showModal({
      title: "授权用户才能发布",
      content: ''
    })
  },

  // 获取blog列表
  getBlogList(start = 0, clear) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        $url: "list",
        count: 10,
      }
    })
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        this.setData({
          blogList: !clear ? this.data.blogList.concat(res.result) : res.result
        })
      })
      .catch(err => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
  // 跳转到博客详情
  goComment(event) {
    const blogid = event.currentTarget.dataset.blogid
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogid=${blogid}`,
    })
  },

  // 点击查询
  onSearch(event) {
    keyword = event.detail;
    this.setData({
      blogList: []
    })
    this.getBlogList()
  }
})