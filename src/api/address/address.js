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
* params type:  guess：定位城市， hot：热门城市， group：所有城市
*  type:1 定位城市，2热门城市  3.所有城市
* */
export function getCityData(type) {
   if(!type){
     Toast.fail('参数为空');
     return
   }
  return new Promise((resolve,reject)=>{
    getRequest(path.address.getCityList+`/?type=${type}`).then(res=>{
      resolve(res)
      console.log(res,'res')
    }).catch(error=>{
      reject(error)
    })
  })
}









