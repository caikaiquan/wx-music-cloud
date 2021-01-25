// components/buttom-modal/buttom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  options: {
    styleIsolation: "apply-shared", // 可以使用component外部的样式
    multipleSlots: true, // 使用具名插槽
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击关闭弹框
    onClose(){
      console.log('点击关闭弹框')
      this.setData({
        modalShow: false,
      })
    }
  }
})
