// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }

  const res =  await cloud.openapi.wxacode.getUnlimited({
    scene: OPENID
  })

  const upload = await cloud.uploadFile({
    cloudPath: `qrcode/${Date.now()}-${Math.random()}.png`,
    fileContent: res.buffer
  })
  return upload
}