<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <li class="menu-item" v-for="good in goods" :class="{current: $index===currentIndex}"
              @click="checkItem($index,$event)">
          <span class="text border-1px">
            <span class="icon" :class="classMap[good.type]" v-if="good.type>0"></span>
            {{good.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li class="food-list food-list-hook" v-for="good in goods" >
          <h1 class="title ">{{good.name}}</h1>
          <ul>
            <!--在父组件上注册一个子组件的索引，便于直接访问-->
            <li class="food-item border-1px" v-for="food in good.foods"
                @click="showFood(food,$event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartconstrol :food="food"></cartconstrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物车组件-->
    <shopcart :foods="selectFoods"
              :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice"
              v-ref:shopcart></shopcart>
  </div>
  <!--食物组件-->
  <food :food="selectFood" v-ref:food></food>
</template>
<script>
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import cartconstrol from '../cartconstrol/cartconstrol'
  import shopcart from '../shopcart/shopcart'
  import food from '../food/food'
    export default {
      props:['seller'],
      data () {
        return {
          goods: [],
          tops: [],
          scrollY: 0,
          selectFoods: {},
          selectFood: {}
        }
      },
      methods: {
        _initScroll () {
          // 滑动回弹menu
          new BScroll(this.$els.menuWrapper, {
            click: true
          }),
          // 滑动回弹foods
          this.foodscroll = new BScroll(this.$els.foodsWrapper, {
            probeType: 3,
            click: true
          }),
          // 滚动时触发
          this.foodscroll.on('scroll', pos => {
            this.scrollY = Math.abs(pos.y)
          })
        },
        _initTops () {
          var  tops = this.tops
          const foodsList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook')
          let top = 0
          tops.push(top)
          for (var i = 0, len=foodsList.length; i < len; i++) {
            top += foodsList[i].clientHeight
            tops.push(top)
          }
          console.log(tops)
        },
        checkItem (index, event) {
          if (!event._constructed) {
            return
          }
          const foodsList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook')
          let li = foodsList[index]
          // 滚动到li处，scrollToElement(el, time, offsetX, offsetY, easing)
          // 滚动到  某个元素，el（必填）表示 dom 元素，time 表示动画
          this.foodscroll.scrollToElement(li, 300)
        },
        showFood (food, event) {
          if (!event._constructed) {
            return
          }
          this.selectFood = food
          this.$refs.food.show(true)
        }
      },
      created () {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
        this.$http.get('/api/goods')
          .then(
            response => {
            const result = response.body
            if (result.errno === 0) {
              this.goods = result.data
              // 将回调延迟到下次DOM更新循环之后执行
              this.$nextTick(() => {
                // 需要等到所有的资源加载完成之后才可以滑动
                this._initScroll()
                // 初始化所有li的top坐标
                this._initTops()
              })
            }
          }
        )
      },
      computed: {
        currentIndex () {
          // 回调函数返回true
          // findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。
          return this.tops.findIndex((top,index) => {
            return this.scrollY >= top && this.scrollY < this.tops[index+1]
          })
        },
        selectFoods () {
          const foods = []
          this.goods.forEach(good => {
            good.foods.forEach(food => {
              if (food.count) {
                foods.push(food)
              }
            })
          })
          return foods
        }
      },
      events: {
        update_item ({isShow, food, el}) {
          if (isShow) {
            if (food.count) {
              food.count++
            } else {
              // 第一次添加count
              /*设置对象的属性。如果对象是响应的，将触发视图更新。
              这个方法主要用于解决 不能检测到属性添加的限制。*/
              Vue.set(food, 'count', 1)
            }
            // 通过小球来启动动画
            this.$refs.shopcart.drop(el)
          } else {
            if (food.count) {
              food.count--
            }
          }
        }
      },
      components: {
        cartconstrol,
        shopcart,
        food
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/minxin.styl"
  .goods
    display: flex
    position: absolute
    top: 179px
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      width 80px
      .menu-item
        display flex
        flex-direction column
        justify-content space-around
        width 56px
        height 53px
        padding 0 12px
        background-color #f3f5f7
        bg-line(rgba(7, 17, 27, 0.1))
        &.current
          background-color #fff
        .text
          font-size 12px
          line-height 14px
          font-weight 200
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            background-size 12px 12px
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex 1
      .title
        height 26px
        padding-left 14px
        line-height 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display flex
        margin 18px
        bg-line(rgba(7, 17, 27, 0.1))
        .icon
          margin-right 10px
        .content
          flex 1
          position relative
          .name
            margin-top 2px
            color rgb(7,17,27)
            font-size 14px
            line-height 14px
          .desc, .extra
            color rgb(147,153,159)
            font-size 10px
            line-height 10px
          .desc
            padding 8px 0
          .extra
            .count
              margin-right 12px
          .price
            .now
              font-size 14px
              line-height 24px
              color rgb(240,20,20)
              font-weight 700
              margin-right 8px
            .old
              font-size 10px
              line-height 24px
              text-decoration line-through
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 10px
</style>
