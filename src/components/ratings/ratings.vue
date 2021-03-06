<template>
  <div class="ratings" v-el:ratings >
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect
        :ratings="ratings"
        :desc="desc"
        :only-content="onlyContent"
        :select-type="selectType">
      </ratingselect>

      <div class="rating-wrapper" v-if="ratings.length">
        <ul>
          <li class="rating-item" v-for="rating in filterRatings">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <star :size="24" :score="rating.score"></star>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import split from '../split/split'
  import star from '../star/star'
  import ratingselect from '../ratingselect/ratingselect'
    export default {
      props: ['seller'],
      data () {
        return {
          ratings: [],
          onlyContent: false,
          selectType: 2
        }
      },
      created () {
        this.desc = {
          all:"全部",
          negative:"不满意",
          positive:"满意"
        },
        this.$http.get('/api/ratings')
          .then(response => {
            var result = response.body
            if (result.errno === 0) {
              this.ratings = result.data
            }
          })
      },
      computed: {
        filterRatings () { // 计算得到需要遍历的ratings数组
          // 创建bscroll对象，开启click，实现刷新
           this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$els.ratings, {
                click: true
              })
            } else {
              this.scroll.refresh() //当内容高度形成滚动
            }
          })
          // 遍历得到新数组
          return this.ratings.filter(rating => {
            const text = rating.text
            const type = rating.rateType
            const selectType = this.selectType
            const onlyContent = this.onlyContent

            if (selectType === 2 && onlyContent) {
              return !!text
            } else if (selectType === 2 && !onlyContent) {
              return true
            }

            if (onlyContent) {
              // 为true时，状态属性相同的情况下，显示文本和不显示文本
              return type === selectType && text
            } else {
              return type === selectType
            }
          })
        }
      },
      // 收到子组件传过来的消息，并且处理消息
      events: {
        'set_selectType' (type) {
          this.selectType = type
        },
        'set_onlyContent' () {
          this.onlyContent = !this.onlyContent
        }
      },
      components: {
        split,
        star,
        ratingselect
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/minxin.styl"
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        bg-line(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .icon-thumb_down, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: #93999f;
            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>

