// components/blog-ctrl/blog-ctrl.js
import { getUserInfo } from '../../utils/user'

let userInfo = {} // 用户信息

const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: {
      type: String
    },
    blog: {
      type: Object
    },
    refresh: {
      type: String,
      value: ""
    }
  },
  // externalClasses: ['iconfont', 'icon-pinglun' , 'icon-fenxiang' , 'icon'],

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false, // 登录提示框
    modalShow: false, // 评论区域
    content: '', // 评论的内容
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async onComment() {
      const res = await getUserInfo()
      if (!res) {
        this.setData({
          loginShow: true
        })
      } else {
        userInfo = res
        this.setData({
          modalShow: true
        })
      }
    },
    // 登录成功
    onLoginsuccess(event) {
      userInfo = event.detail
      this.setData(
        { loginShow: false },
        () => {
          this.setData({
            modalShow: true
          })
        }
      )
    },
    // 登录失败
    onLoginfail(res) {
      wx.showModal({
        title: "授权用户才能发表评论"
      })
    },
    // 发表评论
    onSend(event) {
      const content = event.detail.value.content
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }
      // 隐藏评论区域
      this.setData({
        modalShow: false,
        content: ''
      })
      wx.showLoading({
        title: '评论中',
        mask: true,
      })
      const blogId = this.data.blogId
      const { nickName, avatarUrl } = userInfo
      db.collection("blog-comment").add({
        data: {
          content,
          blogId,
          nickName,
          avatarUrl,
          createTime: db.serverDate()
        }
      })
        .then(res => {
          console.log({
            blogId,
            nickName,
            content
          })
          wx.hideLoading()
          if(this.data.refresh === 'blog-comment'){
            this.triggerEvent('refreshCommentList')
          } else if(this.data.refresh === 'push-message'){
            wx.showModal({
              title: '评论成功',
              content: '是否选择推送消息',
              success: (res) => {
                this.WXPushMessage({
                  blogId,
                  nickName,
                  content
                })
              }
            })
          }
        })
        .catch(err => {

        })
    },
    // 小程序订阅消息
    async WXPushMessage(data) {
      // 获取订阅消息的权限
      const res = await new Promise(resolve => {
        wx.getSetting({
          withSubscriptions: true,
          success: (res) => {
            resolve(res)
          }
        })
      })
      const status = res.subscriptionsSetting['DULx5_1HiUZEwQ5NxR11Shk5ebaejdzzRrorPOhkw4w'] === "accept"
      console.log(status, 'status')
      if (!status) {
        wx.requestSubscribeMessage({
          tmplIds: ['DULx5_1HiUZEwQ5NxR11Shk5ebaejdzzRrorPOhkw4w'],
          success(res) {
            console.log(res, 'success')
            wx.cloud.callFunction({
              data: data,
              name: 'sendMessage',
            }).then(res => {
              wx.showToast({
                title: "消息推送成功"
              })
            })
          },
          fail(err) {
            console.log(err, 'fail')
          }
        })
      } else {
        wx.cloud.callFunction({
          data,
          name: 'sendMessage',
        }).then(res => {
          console.log('调用云函数发送推荐', res)
          wx.showToast({
            title: "消息推送成功"
          })
        })
      }
      console.log('res', res)
    }
  },
})
