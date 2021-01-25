// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime.js'
let blogId = ''
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    blogDetail: {},
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    blogId = options.blogid
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getBlogDetail()
    this.getBlogComment()
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
    this.showLoading(
      {
        title: "刷新"
      }
    )
    this.getBlogComment(0 , 'clear')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBlogComment(this.data.commentList.length , 'clear')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const blog = this.data.blogDetail
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogid=${blog._id}`,
    }
  },

  // 获取blog信息
  async getBlogDetail(){
    const res = await wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId,
        $url:'detail'
      }
    })

    if(res.result.data)

    try{
      const {result: {data}} = res
      if(data.length) {
        this.setData({
          blogDetail: {...data[0]}
        })
      }
    } catch(err){
      console.log('获取blog详情失败', err)
    }
    console.log('获取blog详情', this.data.blogDetail)
  },

  // 获取评论详情
  async getBlogComment(start=0, clear){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const res = await wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId,
        start,
        count: 10,
        $url:'comment'
      }
    })
    wx.hideLoading()
    try{
      const {result: {data}} = res
      if(data.length){
        const list = data.reduce((result, item) => {
          item.createTime = formatTime(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss')
          result.push(item)
          return result
        }, [])
        if(clear){
          this.setData({
            commentList: list
          })
        } else {
          this.setData({
            commentList: this.data.commentList.concat(list)
          })
        }
        
      }
    }catch(err){
      console.log('获取评论失败', err)
    }
    console.log('获取blog评论详情', this.data.commentList)
  },

  // 刷新评论
  refreshCommentList(){
    this.getBlogComment(0, 'clear')
  }
})