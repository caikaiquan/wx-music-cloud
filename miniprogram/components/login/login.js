// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: {
      type: Boolean,
      value: false
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
    onGotUserInfo(event){
      const userInfo = event.detail.userInfo
      if(userInfo){
        this.triggerEvent('loginsuccess', userInfo)
      } else {
        this.triggerEvent('loginfail', userInfo)
      }
    }
  }
})
