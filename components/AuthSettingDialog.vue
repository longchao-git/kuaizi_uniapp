<template>
  <view>
    <view class="pubOpenSetting" v-if="show">
      <view class="cont">
        <view class="txt black6">{{ title }}</view>
        <view class="btn_box">
          <view class="btn cancel" @tap="$emit('cancel')">取消</view>
          <view class="btn confirm" @tap="$emit('confirm')">
            确定
            <button :open-type="openType"></button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AuthSettingDialog',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    openType: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '获取用户授权',
    },
  },
};
</script>

<style scoped>
/* 使用现有 .pubOpenSetting 等样式 */
</style>
