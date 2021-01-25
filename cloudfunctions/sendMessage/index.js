// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  try{
    const res =  await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      templateId: "DULx5_1HiUZEwQ5NxR11Shk5ebaejdzzRrorPOhkw4w",
      page: `/pages/blog-common/blog-common?blogId=${event.blogId}`,
      data: {
        phrase1: {
          value: `${event.nickName}`
        },
        thing4: {
          value: `${event.content}`
        },
      },
      miniprogram_state: "developer"
    })
    console.log('cloud',res)
    return res
  }catch(err){
    console.log(err)
  }
  
}