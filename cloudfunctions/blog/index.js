// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()

const blogCollection = db.collection('blog')
const commentCollection = db.collection('blog-comment')


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  const reg = /(^\s*)|(\s*$)/g
  const keyword = event.keyword ? event.keyword.replace(reg, '') : ""
  let w = {}
  if (keyword) {
    w = {
      content: db.RegExp({
        regexp: keyword,
        options: 'i', // i 忽略大小写   m 跨行匹配   s .换行符在内的匹配
      })
    }
  }
  app.router('list', async (ctx, next) => {
    const start = event.start
    const limit = event.count
    const res = await blogCollection
      .where(w)
      .skip(start)
      .limit(limit)
      .orderBy('createTime', 'desc')
      .get()
    ctx.body = res.data
  })

  app.router('detail', async (ctx, next) => {
    const blogId = event.blogId
    ctx.body = await blogCollection
      .where({
        _id: blogId
      })
      .get()
  })

  app.router('comment', async (ctx, next) => {
    const blogId = event.blogId
    const start = event.start || 0
    const count = event.count || 20
      await commentCollection.where({ blogId })
        .skip(start) // 跳过指定数量的数据
        .limit(count) // 返回指定数量的数据
        .orderBy('createTime', 'desc')
        .get()
        .then(res => {
          ctx.body = { code: '0000', data: res.data}
        })
        .catch(err => {
          ctx.body = { code: '9999' , err }
        })
  })

  const { OPENID } = cloud.getWXContext()
  app.router('getListByOpenid', async(ctx, next) => {
    const start = event.start || 0
    const limit = event.count || 20
    // ctx.body = cloud.getWXContext()
    // return 
    ctx.body = await blogCollection.where({
      _openid: OPENID
    })
    .skip(start)
    .limit(limit)
    .orderBy('createTime','desc')
    .get()
  })

  return app.serve()
}