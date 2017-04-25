<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <!--动态绑定属性，记得属性值是表达式-->
          <div class="logo" :class="{highlight: totalCount}">
            <i class="icon-shopping_cart" :class="{highlight: totalCount}"></i>
          </div>
          <div class="num" v-show="totalCount">
            {{totalCount}}
          </div>
        </div>
        <div class="price">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click="pay">
        <!--用总价格和最小价格做对比，得到合适添加的属性值-->
        <div class="pay" :class="{'not-enough': totalPrice<minPrice,enough: totalPrice>minPrice}">
          {{showText}}
        </div>
      </div>
    </div>
    <!--小图路径，待定完成-->
    <div class="ball-container">
      <div class="ball" transition="drop" v-for="ball in balls" v-show="ball.show">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <!--购物车列表显示-->
    <div class="shopcart-list" transition="fold" v-show="isShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="clear">清空</span>
      </div>
      <div class="list-content" v-el:list-content>
        <ul>
          <li class="food" v-for="food in foods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{totalPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartconstrol :food="food"></cartconstrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!--点击浮层，隐藏   listItem是-->
  <div class="list-mask" transition="fade" @click="hide($event)" v-show="listItem"></div>
</template>
<script>
  import BScroll from 'better-scroll'
  import cartconstrol from '../cartconstrol/cartconstrol'
  export default {
    // 需要从父组件中得到所有food的数组foods，得到seller中的两个属性，
    // 在定义数据的组件中，定义方法来操作数据，将数据出给子组件
    props: ['foods', 'deliveryPrice', 'minPrice'],
    data () {
      return {
        isShow: false,
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: []
      }
    },
    methods: {
      hide (event) {
        if (!event._constructed) {
          return
        }
        this.isShow = false
      },
      clear () {
        this.foods.forEach(food => {
          food.count = 0
        })
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.isShow = !this.isShow
      },
      pay () {
        if (this.totalPrice >= this.minPrice) {
          alert('前去支付')
        }
      },
      drop (el) {
        // 找出一个用于显示小球所对应的ball对象，并且添加到数组中
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      }
    },
    // 在配置对象里面配置过渡动画
    transitions: {
      drop: {
        // 指定小球开始时的动画
        beforeEnter (el) {// 发生动画的小球元素外面的元素
          // 得到x，y的偏移量
          const ball = this.dropBalls.shift()// 拿到数组中的第一个对象
          const rect = ball.el.getBoundingClientRect()
          const x = rect.left - 32
          const y = -(window.innerHeight - rect.top - 16 - 22)
          // 通过el/inner瞬间偏移到指定位置
          el.style.transform = `translate3D(0, ${y}px, 0)`
          el.style.weblitTransform = `translate3D(0, ${y}px, 0)`
          const inner = el.children[0]
          inner.style.transform = `translate3D(${x}px, 0, 0)`
          inner.style.weblitTransform = `translate3D(${x}px, 0, 0)`

          el.ball = ball //将ball保存在当前变化的el上面
        },
        // 指定动画结束时的样式状态
        enter (el) {
          // 强制页面刷新
          const rf = el.offsetHeight
          this.$nextTick(() => {
            el.style.transform = `translate3D(0, 0, 0)`
            el.style.weblitTransform = `translate3D(0, 0, 0)`
            const inner = el.children[0]
            inner.style.transform = `translate3D(0, 0, 0)`
            inner.style.weblitTransform = `translate3D(0, 0, 0)`
          })
        },
        // 动画结束之后的样式
        afterEnter (el) {
          el.ball.show = false
          el.style.display = 'none'
        }
      }
    },
    computed: {
      // 计算得到选中数量
      totalCount () { //计算有缓存, 反复读取只执行一次
        return this.foods.reduce((preVal, food) => {
          return preVal + food.count
        }, 0)
      },
      // 计算得到总价格
      totalPrice () { //计算有缓存, 反复读取只执行一次
        return this.foods.reduce((preVal, food) => {
          return preVal + food.price * food.count
        }, 0)
      },
      listItem () {
        if (!this.totalCount) {
          this.isShow = false
          return false
        }
        if (this.isShow) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$els.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh() //当内容高度形成滚动
            }
          })
        }
        return this.isShow
      },
      showText () {
        let minPrice = this.minPrice
        if (!this.totalPrice) {
          return `￥${minPrice}元起送`
        } else if (minPrice > this.totalPrice) {
          return `还差￥${minPrice - this.totalPrice}元起送`
        } else {
          return '去结算'
        }
      }
    },
    components: {
      cartconstrol
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/minxin.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-transition
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160, 220)
            transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      &.fold-transition
        transition: all 0.5s
        transform: translate3d(0, -100%, 0)
      &.fold-enter, &.fold-leave
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          bg-line(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    &.fade-transition
      transition: all 0.5s
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter, &.fade-leave
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>

