import Vue from 'vue'
import {getRequest,loginRequest, postFormRequest, postJsonRequest, putJsonRequest, deleteRequest, putFormRequest} from './utils/api' // 浅封装的axios方法


// 挂载原型链
Vue.prototype.elm = {
  getRequest,
  loginRequest,
  postFormRequest,
  postJsonRequest,
  putJsonRequest,
  deleteRequest,
  putFormRequest,

};
