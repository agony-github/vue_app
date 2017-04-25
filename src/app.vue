<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <a v-link="{path: '/goods'}">商品</a>
      </div>
      <div class="tab-item">
        <a v-link="{path: '/ratings'}">评论</a>
      </div>
      <div class="tab-item">
        <a v-link="{path: '/seller'}">商家</a>
      </div>
    </div>
    <!--用来将当前路由组件渲染到页面上-->
    <router-view :seller="seller"></router-view>
  </div>
</template>
<script>
  import header from './components/header/header'
  export default {
    data () {
      return {
        seller: {}
      }
    },
    components: {
      'v-header': header
    },
    created (){
      setTimeout(() => {
        this.$http.get('/api/seller')
          .then(
            response => {
              console.log(response.body)
              const result = response.body
              if (result.errno === 0) {
                this.seller = result.data
              }
            })
      }, 500)
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/minxin.styl"
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    bg-line(rgba(7,17,27,.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
