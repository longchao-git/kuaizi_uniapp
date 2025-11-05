<template name="pubset">
	<view class="pubOpenSetting" v-if="OpenSettingShow">
		<view class="cont">
			<view class="txt black6">获取用户授权</view>
			<view class="btn_box">
				<view class="btn cancel" @tap="closeSetting">取消</view>
				<view class="btn confirm" @tap="closeSetting">确定<button :open-type="OpenSettingType"></button></view>
			</view>
		</view>
	</view>
</template>