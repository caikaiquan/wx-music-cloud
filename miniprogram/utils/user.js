export const isLogin = () => {
  return new Promise(resolve => {
    wx.getSetting({
      success: (res) => {
        const islogin = res.authSetting['scope.userInfo']
        resolve(islogin)
      }
    })
  })
}

export const getUserInfo = async () => {
  const islogin = await isLogin()
  if (islogin) {
    return new Promise(resolve => {
      wx.getUserInfo({
        success: (res) => {
          resolve(res.userInfo)
        },
        error: () => {
          resolve(false)
        }
      })
    })
  } else {
    return false
  }
}

// 小程序订阅消息
export const getMainSwitch = () => {
  return new Promise(resolve => {
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        resolve(res)
      }
    })
  })
}

export const requestSubscribeMessage = async () => {
  const res = await getMainSwitch()
  console.log(res, 'requestSubscribeMessage')
}

