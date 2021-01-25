const formatTime = (date, fmt = "yyyy-MM-dd hh:mm:ss") => {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  // 处理年份 RegExp.$1正则表达式第一个括号里的内容
  if(/(\y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1, date.getFullYear())
  }
  // 循环处理 月日时分秒    并且是一位的进行补0 
  for(let key in o){
    if(new RegExp(`(${key})`).test(fmt)){
      fmt = fmt.replace(RegExp.$1, o[key].toString().length === 1 ? `0${o[key]}` : o[key])
    }
  }
  return fmt
}
export default formatTime