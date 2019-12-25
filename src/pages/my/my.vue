<template>
  <div class="my">
    <van-button type="primary" @click="goToLogin">登录</van-button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    data(){
      return{

      }
    },

  methods: {
    goToLogin(){
      wx.navigateTo({url:'/pages/personCenter/login'})
    }
  }
}
</script>

<style lang="less" scoped>
.my{





}
</style>
