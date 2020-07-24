<template>
  <div id="phoneModel" class="iphone-model">
    <div class="iphone-div">
      <div class="phone-header"></div>
      <div class="phone-content">
        <img :src="bannerImg" class="banner" alt="" />
        <div class="price-area">
          <span>{{ productObj.name }}</span>
          <span class="price">¥{{ minimumPrice }}起</span>
        </div>
        <div class="title-box">
          <div class="icon-dot">
            <div class="dot yellow" />
            <div class="dot green" />
          </div>
          <div class="headline-text">
            <span class="title-content">产品介绍</span>
          </div>
          <div class="icon-dot">
            <div class="dot yellow-right" />
            <div class="dot green-right" />
          </div>
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
    minimumPrice: { type: String,default: ''},
    banner: { type: Array,default: () => []},
    productObj: { type: Object, default: () => ({}) }
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
      if (this.banner.length) img = `${this.imgDomain}${PhotoTool.handlePicPath(this.banner[0].path)}`
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

  .iphone-div {
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
    height: 53px;
    padding: 16px;
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: 700;
    color: #16161a;
    background: #fff;

    .price {
      color: red;
    }
  }

  .title-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    background: #fff;

    .title-content {
      margin: 0 16px;
      font-size: 17px;
      font-weight: 700;
    }

    .icon-dot {
      position: relative;
      width: 10px;
      height: 10px;

      .dot {
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }

      .yellow {
        top: 0;
        right: 0;
        background-color: #ffcf49;
      }

      .green {
        bottom: 0;
        left: 0;
        background-color: #0ee0c7;
      }

      .green-right {
        right: 0;
        bottom: 0;
        background-color: #0ee0c7;
      }

      .yellow-right {
        top: 0;
        left: 0;
        background-color: #ffcf49;
      }
    }
  }

  .phone-header {
    height: 83px;
    background: url(~@assetsDir/images/miniapp-header.png) no-repeat;
    background-size: contain;
  }

  .html-page {
    padding: 0 14px;
    background: var(--bkgColor);

    /deep/ img {
      display: block;
      width: 100%;
      margin-top: 12px;
    }

    /deep/ h1 {
      display: flex;
      align-items: center;
      height: 20px;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      color: #16161a;

      &::before {
        display: block;
        width: 2px;
        height: 12px;
        margin-right: 6px;
        content: "";
        background-color: #0ee0c7;
      }
    }

    /deep/ h2 {
      height: 17px;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: bold;
      line-height: 17px;
      color: #16161a;
    }

    /deep/ p {
      display: block;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 300;
      line-height: 19px;
      color: #45454d;
    }
  }
}
</style>
