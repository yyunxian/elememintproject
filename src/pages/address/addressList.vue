<template>
  <div class="counter-warp">

    <van-index-bar :index-list="indexList">
      <van-index-anchor index="1">标题1</van-index-anchor>
      <van-cell title="文本" />
      <van-cell title="文本" />
      <van-cell title="文本" />

    </van-index-bar>
  </div>
</template>

<script>

export default {
  data(){
    return{
      hotCity:[],
      cityList:[],
      currentCity:{},
      indexList:[]
    }
  },
   mounted(){
    this.categoryCity('hot')
    this.categoryCity('group')
    this.categoryCity('guess')
   },
  methods: {
   categoryCity(type){
     wx.request({
       url: `https://elm.cangdu.org/v1/cities?type=${type}`,
       methods:'GET',
       success (res) {
         if(type==='hot'){
           this.hotCity=res.data
         }
         if(type==='group'){
           this.cityList=res.data
         }
         if(type==='guess'){
           this.currentCity=res.data
         }
         console.log(res.data)
       }
     })
   }


  }
}
</script>

<style lang="less" scoped>

</style>
