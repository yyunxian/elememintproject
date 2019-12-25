<template>
<div class="homePage">
  首页








</div>
</template>

<script>
import {getCityData} from '@/api/address/address'

export default {
  mpType: 'page',

  data () {
    return {

    }
  },

  components: {

  },
  mounted(){
  this.init()
  },
  methods: {
    init(){


    },

  },

}
</script>

<style scoped lang="less">
.homepage{

}
</style>
