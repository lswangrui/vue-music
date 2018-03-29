<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <!-- 利用值是否相等来判断是否激活active -->
      <span class="dot" v-for="(item, index) in dots"
      :class="{active: currentPageIndex === index}"
      :key="index"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted () {
      // 利用定时器延迟加载，初始化
      setTimeout(() => {
        // 初始化宽度
        this._setSliderWidth()
        // 初始化指示点
        this._initDots()
        // 初始化轮播插件
        this._initSlider()
        // 是否开启轮播
        if (this.autoPlay) {
          this._paly()
        }
      }, 20)
      // 监听窗口改变事件
      window.addEventListener('resize', () => {
        // 插件未初始化返回
        if (!this.slider) {
          return
        }
        // 重新初始化宽度
        this._setSliderWidth(true)
        // 调用slider的api重新加载轮播图组建
        this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth (isResize) {
        // 这里是通过实例对象vue的$refs方法，再通过标签上绑定同样ref值就能够获取到这些标签
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          // 设定每张图片宽度
          child.style.width = sliderWidth + 'px'
          // 计算包裹图片盒子的宽度
          width += sliderWidth
        }
        // 这里开启无缝轮播后会增加两个图片宽度
        // 初始化过，宽度已经多加了两张图片宽度，窗口改变的时候就不要再去多加2个图片宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on('scrollEnd', () => {
          // 获取滚动结束后的页面index
          let pageIndex = this.slider.getCurrentPage().pageX
          // 如果是无缝滚动，要减去一
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          // 如果自动轮播，清除定时器，再去自动播放
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._paly()
          }
        })
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _paly () {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          // 利用slider自带api跳转，指定index页面，0是y轴index
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed () {
      clearTimeout(this.timer)
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height :1px
    .slider-group
      position :relative
      overflow :hidden
      white-space :nowrap
      .slider-item
        float :left
        box-sizing :border-box
        overflow :hidden
        text-align :center
        a
          display :block
          width :100%
          overflow :hidden
          text-decoration :none
        img
          display :block
          width :100%
    .dots
      position :absolute
      right :0
      left: 0
      bottom :12px
      text-align :center
      font-size :0
      .dot
        display :inline-block
        margin :0 4px
        width :8px
        height :8px
        border-radius :50%
        background :$color-text-l
        &.active
          width 20px
          border-radius :5px
          background :$color-text-ll
</style>

