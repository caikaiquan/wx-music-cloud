// pages/profile-bloghistory/profile-bloghistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBlogList()
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
    this.getBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogid=${blog._id}`
    }
  },
  // 获取用户blog列表
  async getBlogList(start=0){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const res = await wx.cloud.callFunction({
      name: "blog",
      data: {
        start,
        count: 3,
        $url: 'getListByOpenid',
      }
    })
    wx.hideLoading()
    try{
      const {result:{data}} = res
      this.setData({
        blogList: !start ? data : this.data.blogList.concat(data)
      })
    }catch(err){
      console.log('获取个人博客列表失败', err)
    }
  },
  // 跳转blog详情
  goComment(event){
    const blogid = event.target.dataset.blogid
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogid=${blogid}`,
    })
  }
})