<template>
  <view>
    <view class="toast-center" v-if="showToast && (showToast.isShow ? showToast.isShow : false)">
      <view class="toast">
        <image
          class="toast-icon"
          :src="showToast.icon"
          mode="scaleToFill"
          v-if="showToast.icon"
        ></image>
        <text class="toast-text">{{ showToast.title }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    showToast: {
      type: Object,
      default() {
        return { isShow: false };
      }
    }
  }
};
</script>

<style scoped>
/* 使用现有的 .toast-center / .toast / .toast-icon / .toast-text 全局样式 */
</style>
