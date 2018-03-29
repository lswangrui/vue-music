import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  // 判断url后面有没有问号，找不到就加上问号，有的话就直接加&
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 拼接参数到url上面
function param (data) {
  let url = ''
  for (var k in data) {
    // 这里后台不能接收undefined，所以给个空值
    let value = data[k] !== undefined ? data[k] : ''
    // es6的模板字符串方法，encodeURIComponent编码处理
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
