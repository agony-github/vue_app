<template>
  <!--star_48 star_48on-->
  <span v-for="sclss in starClass" :class="sclss" track-by="$index"></span>
</template>
<script type="text/javascript">
export default {
  props: ['size', 'score'],
  computed: {
    starClass () {
      const starcls =  []
      const score = this.score
      const size = this.size
      const countInteger = Math.floor(score)
      // 添加满星
      for (var i = 0; i < countInteger; i++) {
        starcls.push(`star_${size} star_${size}on`)
      }
      // 添加半星
      if (score-countInteger >= 0.5) {
        starcls.push(`star_${size} star_${size}half`)
      }
      // 添加黑星
      while (starcls.length < 5) {
        starcls.push(`star_${size} star_${size}off`)
      }
      return starcls
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/minxin.styl"
  .star_36
    display inline-block
    width 15px
    height 15px
    margin:0 6px
    background-size 15px 15px
  .star_36on
    bg-star(star36_on)
  .star_36half
    bg-star(star36_half)
  .star_36off
    bg-star(star36_off)
  .star_48
    display inline-block
    width 20px
    height 20px
    margin:0 22px
    background-size 20px 20px
  .star_48on
    bg-star(star48_on)
  .star_48half
    bg-star(star48_half)
  .star_48off
    bg-star(star48_off)
  .star_24
    display inline-block
    width 10px
    height 10px
    margin:0 3px
    background-size 10px 10px
  .star_24on
    bg-star(star24_on)
  .star_24half
    bg-star(star24_half)
  .star_24off
    bg-star(star24_off)
</style>
