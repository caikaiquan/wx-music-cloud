// components/lyric/lyric.js
let lyricHeight = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: (result) => {
          lyricHeight = result.screenWidth / 750 * 64
        },
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    nowLyricIndex: "-1"
  },

  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String,
  },

  observers: {
    lyric(lrc) {
      if (lrc == '暂无歌词') {
        this.setData({
          lrcList: {
            '-1':'暂无歌词'
          },
          nowLyricIndex: -1
        })
      } else {
        const list = lrc.split('\n')
        const lrcList = list.reduce((result, item) => {
          try {
            const tiemArr = item.match(/(\d{2,}):(\d{2})(?:\.(\d*))/)
            const tiemValue = tiemArr[1] * 60 * 1000 + tiemArr[2] * 1000 + tiemArr[3] * 1
            const value = item.match(/\](.*)/)[1]
            result[tiemValue] = value;
          } catch (err) {
            // console.log(item, '匹配失败的元素')
          }
          return result
        }, {})
        this.setData({
          lrcList,
        })
      }

    },
  },
  ready() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(time) {
      const lrcList = Object.keys(this.data.lrcList).map(item => Number(item))
      if (time > lrcList[lrcList - 1]) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lyricHeight * (lrcList.length)
          })
        }
      }
      for (let i in lrcList) {
        if (time <= lrcList[i]) {
          this.setData({
            nowLyricIndex: lrcList[i - 1],
            scrollTop: lyricHeight * (i - 1)
          })
          return
        }
      }
    }
  },
})
