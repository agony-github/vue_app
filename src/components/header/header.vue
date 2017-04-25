<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟到达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="supports_count" @click="toggle(true)" v-if="seller.supports">
        <span class="count">{{seller.supports.length}}个</span>
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right" @click="toggle(true)"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar">
    </div>
    <div class="detail" v-show="detailShow" transition="fade">
      <div class="detail-wrapper">
        <div class="detail-main clearfix">
          <div class="name">{{seller.name}}</div>
          <div class="star-wrapper">
            <v-star :size="48" :score="seller.score"></v-star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul class="supports">
            <li class="support" v-for="support in seller.supports">
              <span class="icon" :class="classMap[support.type]"></span>
              <span class="text">{{support.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="content">
            <p>{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close">
        <span class="icon-close" @click="toggle(false)"></span>
      </div>
    </div>
  </div>
</template>
<script>
  import star from '../star/star'
  export default {
    props: ['seller'],
    data () {
      return {
        detailShow: false,
        classMap: ["decrease", "discount", "special", "invoice", "guarantee"]
      }
    },
    methods: {
      toggle (isShow) {
        this.detailShow = isShow
      }
    },
    components: {
      'v-star': star
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/minxin.styl"
  .header
    position relative
    background-color rgba(7,17,27,.5)
    color #fff
    font-size 0
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      .avatar
        display inline-block
        vertical-align top
        img
          width 64px
          height 64px
          border-radius 4px
      .content
        display inline-block
        overflow hidden
        margin-left 16px
        .title
          margin: 2px 0 8px
          .brand
            display inline-block
            margin-right 6px
            width 30px
            height 18px
            bg-image(brand)
            background-size 30px 18px
            background-repeat no-repeat
          .name
            font-size 16px
            line-height 18px
            font-weight bold
        .description
          font-size 12px
          line-height 12px
          font-weight 200
          margin 8px 0 10px
        .support
          margin: 10px 0 2px
          .icon
            display inline-block
            margin-right 4px
            width 12px
            height 12px
            bg-image(decrease_1)
            background-size 12px 12px
            &.discount
              bg-image(discount_1)
            &.guarantee
              bg-image(guarantee_1)
            &.invoice
              bg-image(invoice_1)
            &.special_1
              bg-image(special_1)
          .text
            font-size 10px
            line-height 12px
            font-weight 200
      .supports_count
        position absolute
        right 12px
        bottom 18px
        padding 7px 8px
        margin-right 12px
        border-radius 8px
        background-color rgba(0,0,0,.2)
        float right
        .count
          color rgb(255,255,255)
          font-size 10px
          font-weight 200
          line-height 12px
    .bulletin-wrapper
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      position relative
      background-color rgba(7,17,27,0.2)
      height 28px
      padding 0 12px
      .bulletin-title
        display inline-block
        width 22px
        height 12px
        bg-image(bulletin)
        background-size 22px 12px
      .bulletin-text
        margin-left 4px
        font-size 10px
        line-height 28px
        font-weight 200
      .icon-keyboard_arrow_right
        position: absolute
        right: 0px;
        bottom: 7px;
        font-size: 10px
    .background
      position absolute
      top: 0
      left 0
      width 100%
      height 100%
      z-index -1
      img
        width 100%
        height 100%
        filter blur(10px)
        -wibkit-filter-blur 10px
    .detail
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index 666
      background-color rgba(7,17,27,.8)
      &.fade-transition
        transition all .5s linear
        opacity 1
      &.fade-enter, &.fade-leave
        opacity 0
      .detail-wrapper
        width: 100%;
        min-height: 100%;
        .detail-main
          color rgb #fff
          .name
            padding 64px 0 16px
            font-size 16px
            font-weight 700
            line-height 16px
            text-align center
          .star-wrapper
            height 24px
            margin-top 16px
            text-align center
            line-height 24px
          .title
            display flex
            width 80%
            margin 28px auto 24px
            .line
              flex 1
              position relative
              top: 5px
              width 112px
              height 1px
              background-color rgba(255,255,255,.2)
            .text
              display inline-block
              font-size 14px
              margin 0 12px
              text-align center
          .supports
            width 80%
            margin 0 auto
            display flex
            flex-direction column
            justify-content space-between
            font-size 12px
            font-weight 200
            line-height 24px
            .support
              margin 0 12px
              .icon
                display inline-block
                margin-right 6px
                width 16px
                height 16px
                background-size 12px 12px
                background-repeat no-repeat
                vertical-align middle
                &.decrease
                  bg-image(decrease_2)
                &.discount
                  bg-image(discount_2)
                &.invoice
                  bg-image(invoice_2)
                &.guarantee
                  bg-image(guarantee_2)
                &.special
                  bg-image(special_2)
          .content
            width 80%
            margin 0 auto
            font-size 12px
            line-height 24px
            font-weight 200
            p
              margin 0 12px
      .detail-close
        margin-top -64px
        text-align: center
        .icon-close
          display inline-block
          font-size 32px

</style>
