<template>
  <div>
    <foot />
    <router-view />
  </div>
</template>

<script>
import Foot from './components/foot'
export default {
  name: 'App',
  components: {
    Foot
  }
}
</script>

<style lang="stylus">
@import "common/stylus/index.styl";
#app
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  bgColor(background_color_main)
</style>
