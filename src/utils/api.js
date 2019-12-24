import axios from 'axios'
import { Message } from 'element-ui'
import {BASE_URL, LOGIN_URL, SHOW_WAY} from '@/config/env.url'
import cookieHelp from '@/utils/jsCookies'
import Toast from '@/utils/toast'
import router from '@/router'
import store from '@/store'
let login_url = LOGIN_URL
function getPrefix(middleware, BASE_URL = BASE_URL ,prefix = '') {
  return middleware ? prefix : BASE_URL
}

const contentTypeMap = {
  json: 'application/json;charset=UTF-8',
  form: 'application/x-www-form-urlencoded;charset=UTF-8'
}

// 兼容不支持map的情况
const codeJson = {
  '-1': '未知错误!',
  '200': 'success',
  '401': '登录超时，请重新登录',
  '404': '找不到接口⊙﹏⊙∥',
  '403': '权限不足,请联系管理员!',
  '500': '服务器异常',
  '402': '参数异常',
  '302': '登录超时，请重新登录',
  '504': '服务器被吃了⊙﹏⊙∥',
  'error': '权限不足,请联系管理员!'
}

const codeMap = new Map([
  [-1, ['后台出现未知错误!']],
  [401, ['登录超时，请重新登录']],
  [404, ['找不到接口⊙﹏⊙∥']],
  [403, ['登录超时啦⊙﹏⊙∥']],
  [500, ['服务器异常']],
  [402, ['参数异常']],
  [400, ['参数异常']],
  [302, ['登录超时，请重新登录']],
  [504, ['服务器被吃了⊙﹏⊙∥']],
  ['error', ['权限不足,请联系管理员!']],
  ['default', ['响应出现未知错误']]
])

/**
 * @Description: 状态操作
 */
const initPlantStatus = () => {
  store.commit('CLEAR_USERINFO')
  // window.location.href = '/'
  router.push({path: '/'})
  // 清除缓存，重新跳登录，不然会导致登录不了
  cookieHelp.removeCookie(cookieHelp.systemToken);
  cookieHelp.removeCookie(cookieHelp.systemUser);
}
const codeMapTip = ( status ) => {
  let action = codeMap.get(status) || codeMap.get('default')

  Toast.show({
    message: action[0],
    type:'error'
  })
  if (status === 401) {
    initPlantStatus()
  }
  if(status === 403){
    initPlantStatus()
  }
}

/**
 * @Description: 请求头处理，判断是否有token
 * @content-type ：application/json
 */

const getHeader = () => {
  try {
    let token = cookieHelp.getCookie(cookieHelp.systemToken);
    if (token) {
      return {
        'Authorization': token,   //设置在请求的token字段
        'content-type': contentTypeMap.json // 默认是json格式的数据
      }
    }
    return {
      'content-type': contentTypeMap.json // 默认是json格式的数据
    }
  } catch (e) {
    return {
      'content-type': contentTypeMap.json  // 默认是json格式的数据
    }
  }
};

/**
 * @Description:  设置content-type  为 application/x-www-form-urlencoded
 */

const getFormHeader = () => {
  try {
    let token = cookieHelp.getCookie(cookieHelp.systemToken);
    if (token) {
      return {
        'Authorization': token ,
        'Content-Type': contentTypeMap.form // 默认是json格式的数据
      }
    }
    return {
      'Content-Type': contentTypeMap.form // 默认是json格式的数据
    }
  } catch (e) {
    return {
      'Content-Type': contentTypeMap.form  // 默认是json格式的数据
    }
  }
};

// 对get拼在链接上的请求的参数进行转码,截取第一个问号后面的参数  进行转码
function EnCodeString( url ) {
  let newurl = ''
  if(url.indexOf('?')!==-1){
    //将参数转码后拼接
    url.substring(url.indexOf('?')+1).split('&').map((val,i)=>{
      if(val){
        newurl += encodeURIComponent(val.split('=')[0])+'='+encodeURIComponent(val.split('=')[1]) + '&'
      }
    });
    //去掉最后个&
    if(newurl !== ''){
      newurl = newurl.substr(0, newurl.lastIndexOf('&'));
      newurl = url.substring(0,url.indexOf('?')) + '?' + newurl;
    }
    return newurl;
  }else{
    return url;
  }
}

/**
 * @Description:   如果token  过期，将返回的新token设置在请求头里
 * @effect    判断是否再重新去请求这个接口
 */

const isExpire = function ( res ) {
  let bool = false;
  //判断是本地是否有token
  const token = cookieHelp.getCookie(cookieHelp.systemToken);
  if(token){

    //判断 s后台是否有返回token
    if(res.headers && res.headers.authorization){
      //判断两次token是否相等，相等的话证明未过期
      if(token === res.headers.authorization){
        return bool
      }else{
        //重新设置token的值
        cookieHelp.setCookie(cookieHelp.systemToken,res.headers.authorization);
        bool = true;
        return bool
      }
    }else{
      return bool
    }
  }else{
    return bool
  }
};

// 请求拦截配置
axios.interceptors.request.use(config=> {

  return config;

}, err=> {
  Toast.show({
    message:err || '请求超时',
    type:'error'
  })

  return Promise.reject(err.toString());

});

// 响应的拦截
axios.interceptors.response.use(data=> {

  return data;

}, err=> {

  codeMapTip(err.response.status);

  return Promise.reject(err.toString());
});

export const global = {
  //json  格式
  http:function ({url,method, data,contentType,rootData,transformRequest}) {
    let axiosParams = {
      url: `${url}`,
      method: method,
    };
    //设置请求头的格式,form or json
    if(contentType === 'json'){
      axiosParams.headers = getHeader()
    }else{
      axiosParams.headers = getFormHeader()
      axiosParams.transformRequest = [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    }
    //判断是否是get请求或者是否是delete请求
    if(method === 'get' || method === 'delete'){
      url = EnCodeString(url)
      if(data){
        axiosParams.params = data;
        axiosParams.transformRequest = [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      }
      axiosParams.url = url;
    }else{
      axiosParams.data = data
    }
    return new Promise((resolve, reject)=>{
      axios(axiosParams).then(resp =>{
        //判断是否有token  ，并且判断是否过期，过期的话替换token
        if(isExpire(resp)) {  //为true证明过期,重新带上新的token请求后台

          global.http({url,method, data,contentType,rootData}).then(resopnse=>{
            resolve(resopnse)
          }).catch(err=>{
            reject(err.toString())
          })

        }else{
          // 判断是否要处理根数据,默认处理根数据
          if (!rootData) {
            if (resp.data.status === 1) {
              resolve(resp.data)
            } else {
              reject(resp.data.msg)
            }
          } else {
            resolve(resp)
          }

        }
      }).catch(err=>{
        reject(err.toString())
      });
    })
  },
};


/**
 * @Description:  封装api 请求
 * @param url 请求的url
 * @param params 请求的参数
 * @param middleware 是否取消前缀配置
 * @param rootData 是否自己处理状态码
 */

let defaultConfig = {
  middleware: false,
  loadingMessage: '请求中···',
  rootData: false
}

export const loginRequest = function (url = '', params ,{middleware,rootData} = defaultConfig) {
  login_url = middleware ? '' : login_url ;
  return axios({
    method: 'post',
    url: `${login_url}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  });
}

export const logoutRequest = (url = '', params,{ middleware, rootData} = defaultConfig) => {
  login_url = middleware ? '' : login_url ;
  return global.http({
    method: 'post',
    url: `${login_url}${url}`,
    data: params,
    contentType:'form',
    rootData
  });
}

export const getRequest = (url,params = {},{rootData,middleware} = defaultConfig) => {

  let base = getPrefix(middleware,BASE_URL)

  if(Object.keys(params).length > 0){
    return global.http({
      method: 'get',
      url: `${base}${url}`,
      data:params,
      contentType:'json',
      rootData
    });
  }else{
    return global.http({
      method: 'get',
      url: `${base}${url}`,
      contentType:'json',
      rootData
    });
  }
};

export const postFormRequest = (url, params,{middleware,rootData} = defaultConfig) => {

  let base = getPrefix(middleware,BASE_URL)

  return global.http({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    contentType:'form',
    rootData
  });
}

export const postJsonRequest = (url, params, {middleware,rootData} = defaultConfig) => {

  let base = getPrefix(middleware,BASE_URL)

  return global.http({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    contentType:'json',
    rootData
  });
};

export const putFormRequest = (url, params,{middleware,rootData} = defaultConfig) => {

  let base = getPrefix(middleware,BASE_URL)

  return global.http({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    contentType:'form',
    rootData
  });
}

export const putJsonRequest = (url, params,{middleware, rootData} = defaultConfig) => {

  let base = getPrefix(middleware,BASE_URL)

  return global.http({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    contentType:'json',
    rootData
  });
}

export const deleteRequest = (url, params,{middleware,rootData} = defaultConfig) => {

  let base = getPrefix(middleware,BASE_URL)

  return global.http({
    method: 'delete',
    url: `${base}${url}`,
    data: params,
    contentType:'json',
    rootData
  });
};






