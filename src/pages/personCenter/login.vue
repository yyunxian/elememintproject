<template>
  <div class="login">
    <van-cell-group>
      <van-field
        v-model="userInfo.username"
        label="用户名"
        placeholder="请输入用户名"
        required
        clearable
      />
      <van-field
        v-model="userInfo.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
        clearable
      />
     <div class="code">
       <van-field
         size="small"
         v-model="userInfo.captcha_code"
         required
         clearable
         label="验证码"
         placeholder="请输入验证码"
       >
       </van-field>
       <img :src="codeData" alt="">
       <span @click="getCode" >换一换</span>
     </div>
    </van-cell-group>

    <van-button type="info"
                @click="submit"
                :loading="loading"
                :loading-text="loadingText"  size="large">
                登录
    </van-button>
    <input type="text" v-model="aa">
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {login} from '@/api/user/user'

export default {
    data(){
      return{
        userInfo:{
          username:'',
          password:'',
          captcha_code:'',
        },
        loadingText:'登录中...',//只有登录中才会显示
        loading:false,
        codeData:'',
        aa:'333'


      }
    },
   mounted(){

      this.getCode()
   },
   methods: {
      getCode(){
        wx.request({
          url:'https://elm.cangdu.org/v1/captchas',
          method:'POST',
          success: (res)=>{
            this.codeData=res.data.code
          }
        })
      },
    submit(){
        console.log(this.aa,'aaa')
        console.log(this.userInfo,'username')
//      this.loadingText='登录中...'
//      this.loading=true
//      wx.request({
//        url:'https://elm.cangdu.org/v2/login',
//        method:'POST',
//        data:this.userInfo,
//        success: (res)=>{
//          console.log(res,'denglu')
//        }
//      })

    }
  }
}
</script>

<style lang="less" scoped>
.login{
.code{
  display: flex;
  img{
    padding-top: 10px;
    width: 60px;
    height: 25px;
  }
  span{
    padding-left: 10px;
    color: #0086ce;
    line-height: 50px;
  }
}


 }
</style>
