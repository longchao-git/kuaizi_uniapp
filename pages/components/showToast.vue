<template name="showToast">
	<block v-if="showToast.isShow? showToast.isShow: false">
		<!-- <view class="toast-bg" wx:if="{{showToast.mask==false? false : true}}"></view>   -->
		<view class="toast-center">
			<view class="toast">
				<image class="toast-icon" :src="showToast.icon" mode="scaleToFill" v-if="showToast.icon"></image>
				<text class="toast-text">{{showToast.title}}</text>
			</view>
		</view>
	</block>
</template>
<script>
	export default {
		props: []
	}
</script>