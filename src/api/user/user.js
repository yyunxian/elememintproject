import {
  getRequest,
  deleteRequest,
  putFormRequest,
  loginRequest,
  putJsonRequest,
  putRequest,
  postJsonRequest,
  postRequest,
  logoutRequest
} from '@/utils/api';
import {path} from '@/config/path'
/*
* 获取城市列表
* params
*
* */
export function login(params) {
   if(!params.username&&!params.username&&params.captcha_code){
     // Toast.fail('参数不合法');
     return
   }
  return new Promise((resolve,reject)=>{
    loginRequest(path.user.login,params).then(res=>{
      resolve(res)
    }).catch(error=>{
      reject(error)
    })
  })
}
