<template>
  <view v-if="show" class="pub-nodata">
    <image :src="image" mode="aspectFit"></image>
    <view class="black6">{{ text }}</view>
  </view>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '暂无数据',
    },
    image: {
      type: String,
      default: '/static/image/noorder.png',
    },
  },
};
</script>

<style scoped>
/* 复用全局 .pub-nodata / .black6 的样式，这里不重复定义 */
</style>
