// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: {
      type: Object
    },
  },

  observers: {
    ['blog.createTime'](val){
      if(val){
        const _createTime = formatTime(new Date(val))
        this.setData({
          _createTime
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: "00:00"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event){
      const { currentTarget: {dataset: {imgs, imgsrc}}} = event;
      wx.previewImage({
        urls: imgs,
        current: imgsrc
      })
    }
  }
})
