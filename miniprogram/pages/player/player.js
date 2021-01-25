// pages/player/player.js
let musiclist = [];
let nowPlayingIndex = 0;
// 获取全局位移的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    currentMusicItem: {},
    isPlaying: false, // 是否在播放
    resetImgRotate: false, // 是否要复位图片
    isLyricShow: false,
    lyric: "暂无歌词"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.index;
    // 获取storage里缓存的musiclist
    wx.getStorage({
      key: 'musiclist',
    }).then(res => {
      musiclist = [...res.data];
      this.ladMusicDetail(options.index)
    })
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
  ladMusicDetail(index) {
    this.setData({ isPlaying: false, resetImgRotate: false })
    const music = musiclist[index];
    // console.log('歌曲信息', music)
    this.setData({
      currentMusicItem: music
    })
    // 设置navbar
    wx.setNavigationBarTitle({
      title: music.name
    })
    app.setPlayMusicId(music.id)
    // 获取歌曲信息
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicurl',
        musicId: music.id
      }
    })
      .then(async res => {
        // console.log('歌曲地址', res)
        return new Promise(resolve => {
          setTimeout(() => { resolve(res) }, 300)
        })
      })
      .then(async (res) => {
        backgroundAudioManager.src = res.result.url
        backgroundAudioManager.title = music.ar[0].name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.al.name
        this.setData({ isPlaying: true })
        this.savePlayHistory(music)
        // backgroundAudioManager.pause()
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
      })

    // console.log('获取歌曲信息')
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'lyric',
        musicId: music.id
      }
    }).then(res => {
      try {
        const { result: { lrc: { lyric } } } = res;
        this.setData({
          lyric
        })
      } catch (err) {
        console.log(err)
      }
      // console.log('获取歌词信息', res)
    }).catch(err => {
      console.log('获取歌词信息失败', err)
    })
  },

  // 切换播放暂停
  togglePlaying() {
    let isPlaying = this.data.isPlaying
    if (isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({ isPlaying: !isPlaying })
  },
  // 上一首
  onPrev() {
    backgroundAudioManager.stop()
    if (nowPlayingIndex > 0) {
      nowPlayingIndex--
    } else {
      nowPlayingIndex = musiclist.length - 1
    }
    this.ladMusicDetail(nowPlayingIndex)
  },
  // 下一首
  onNext() {
    backgroundAudioManager.stop()
    if (nowPlayingIndex < musiclist.length - 1) {
      nowPlayingIndex++
    } else {
      nowPlayingIndex = 0
    }
    this.ladMusicDetail(nowPlayingIndex)
  },

  // 切换歌词显示
  onChangeLyricShow() {
    this.setData(
      { isLyricShow: !this.data.isLyricShow }
    )
  },
  // 获取歌词信息
  getLyric() {

  },

  // 更新时间
  timeUpdate(event) {
    this.selectComponent('.lyric').update(parseInt(event.detail.currentTime*1000))
  },
  // 播放
  onPlay(){
    this.setData({
      isPlaying: true
    })
  },
  // 暂停
  onPause(){
    this.setData({
      isPlaying: false
    })
  },

  // 保存播放历史
  savePlayHistory(music){
    const openid = app.globalData.openid
    let history = wx.getStorageSync(openid)
    history = history.reduce((result, item) => {
      if(item.id !== music.id){
        result.push(item)
      }
      return result
    }, [])
    history.unshift(music)
    history = history.splice(0,50)
    wx.setStorage({
      data: history,
      key: openid,
    })
  }
})