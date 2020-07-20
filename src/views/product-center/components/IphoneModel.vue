<template>
  <div id="phoneModel" class="iphone-model">
    <div class="iphone-view">
      <div class="phone-header"></div>
      <div class="phone-content">
        <img :src="bannerImg" class="banner" alt="" />
        <div class="price-area">
          <span>{{ productObj.name }}</span>
          <span class="price">¥120.00起</span>
        </div>
        <div class="html-page" v-html="pageHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as PhotoTool from '@/utils/photoTool'

export default {
  name: 'IphoneModel',
  props: {
    pageHtml: { type: String,default: ''},
    banner: { type: Array,default: () => []},
    productObj: { type: Object, required: true }
  },
  data () {
    return {
      activityDesc: []
    }
  },
  computed: {
    ...mapGetters(['imgDomain']),
    bannerImg() {
      let img = ''
      if (this.banner.length) {
        img = `${this.imgDomain}${PhotoTool.handlePicPath(this.banner[0].path)}`
      }
      return img
    }
  }
}
</script>

<style lang="less" scoped>
.iphone-model {
  ::-webkit-scrollbar {
    display: none;
  }

  --bkgColor: #fff;

  width: 422px;
  height: 858px;
  background: url(~@assetsDir/images/iPhone-frame.png);

  .iphone-view {
    width: 375px;
    height: 100%;
    padding: 22px 0;
    margin: 0 24.5px 0 22.5px;
    background: #f7f7f7;
    -webkit-mask-image: url(~@assetsDir/images/iPhone-mask.png);
    mask-image: url(~@assetsDir/images/iPhone-mask.png);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: top;
    mask-position: top;
  }

  .phone-content {
    height: 775px;
    overflow-y: auto;
  }

  .banner {
    width: 375px;
  }

  .price-area {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 375px;
    height: 60px;
    padding: 20px;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
    background: #fff;

    .price {
      color: red;
    }
  }

  .phone-header {
    height: 83px;
    background: url(~@assetsDir/images/miniapp-header.png) no-repeat;
    background-size: contain;
  }

  .html-page {
    background: var(--bkgColor);
  }
}
</style>
