<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  // 导入头部组建，能不使用相对路径是因为在webpack.base.confi.js中配置了相对路径
  import MHeader from 'components/m-header/m-header'
  // 导入tab栏组件

  import Tab from 'components/tab/tab'
  export default{
    components: {
      MHeader,
      Tab
    }
  }
</script>

<style scoped lang="stylus">

</style>
