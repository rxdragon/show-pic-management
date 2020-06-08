<template>
  <div id="phoneModel" class="iphone-model">
    <div class="iphone-view">
      <div class="phone-header"></div>
      <div class="wx-header">
        <i class="el-icon-close"></i>
        <span>{{ config.title }}</span>
        <i class="el-icon-more"></i>
      </div>
      <div class="html-page">
        <div class="page-header-image">
          <img :src="config.headerImg" alt="">
        </div>
        <div class="page-main">
          <div class="phone-input-box">
            <el-input placeholder="请输入手机号"></el-input>
            <el-input placeholder="请输入验证码"><span slot="suffix">获取验证码</span></el-input>
            <button>领取优惠券</button>
          </div>
          <div class="rules-page">
            <div class="rules-title">活动说明</div>
            <template v-for="(ruleItem, ruleIndex) in activityDesc">
              <div class="rules-item" :key="ruleItem.key">{{ ruleIndex + 1 }}、{{ ruleItem.value }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IphoneModel',
  props: {
    config: { type: Object, default: () => ({
      title: '',
      headerImg: '',
      bkgColor: '#06134C',
      captchaBkgColor: '#FFFFFF',
      captchaTextColor: '#00c7af',
      activityDesc: [],
      receiveBkgStart: '#0ee0c7',
      receiveBkgEnd: '#13c2c2',
      receiveBkgAngle: '270',
      receiveBkgColor: 'linear-gradient(270deg, #0ee0c7 0%, #13c2c2 100%)',
      rulesFontColor: '#FFFFFF'
    }) }
  },
  data () {
    return {
      activityDesc: []
    }
  },
  watch: {
    config: {
      handler (configValue) {
        this.activityDesc = configValue.activityDesc
        const phoneModelDom = document.getElementById('phoneModel')
        phoneModelDom.style.setProperty('--bkgColor', configValue.bkgColor)
        phoneModelDom.style.setProperty('--captchaBkgColor', configValue.captchaBkgColor)
        phoneModelDom.style.setProperty('--captchaTextColor', configValue.captchaTextColor)
        phoneModelDom.style.setProperty('--rulesFontColor', configValue.rulesFontColor)
        phoneModelDom.style.setProperty('--receiveBkgColor', configValue.receiveBkgColor)
      },
      deep: true
    }
  },
  mounted () {
    this.activityDesc = this.config.activityDesc
    const phoneModelDom = document.getElementById('phoneModel')
    phoneModelDom.style.setProperty('--bkgColor', this.config.bkgColor)
    phoneModelDom.style.setProperty('--captchaBkgColor', this.config.captchaBkgColor)
    phoneModelDom.style.setProperty('--captchaTextColor', this.config.captchaTextColor)
    phoneModelDom.style.setProperty('--rulesFontColor', this.config.rulesFontColor)
    phoneModelDom.style.setProperty('--rulesFontColor', this.config.receiveBkgColor)
  }
}
</script>

<style lang="less" scoped>
.iphone-model {
  --bkgColor: #06134c;
  --captchaBkgColor: #fff;
  --rulesFontColor: #fff;
  --captchaTextColor: #00c7af;
  --receiveBkgColor: linear-gradient(270deg, #0ee0c7 0%, #13c2c2 100%);

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

  .phone-header {
    height: 41px;
    background: url(~@assetsDir/images/phone-header.png);
    background-color: #fff;
  }

  .wx-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 43px;
    padding: 0 16px 0 20px;
    color: #000;
    background-color: #ededed;

    .el-icon-close {
      margin-right: 10px;
      font-size: 16px;
    }

    .el-icon-more {
      font-size: 16px;
    }
  }

  .html-page {
    height: calc(100% - 83px);
    overflow-y: overlay;
    background: var(--bkgColor);

    .page-header-image {
      position: relative;
      height: 604px;
      overflow: hidden;
      background-color: #e8e8e8;

      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        content: '页面头图';
        transform: translate(-50%);
      }

      img {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 604px;
      }
    }

    .page-main {
      position: relative;
      margin-top: -353px;

      .phone-input-box {
        position: relative;
        z-index: 3;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 343px;
        height: 220px;
        padding: 32px 32px 24px;
        margin: 0 auto 0;
        background-color: var(--captchaBkgColor);
        border-radius: 20px;

        .el-input {
          overflow: hidden;
          border: 1px solid #ebebeb;
          border-radius: 20px;

          & /deep/ .el-input__inner {
            height: 38px;
            border: none;
          }

          & /deep/ .el-input__suffix {
            right: 20px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: var(--captchaTextColor);
          }
        }

        button {
          width: 188px;
          height: 40px;
          margin: 0 auto;
          color: #fff;
          background: var(--receiveBkgColor);
          border: none;
          border-radius: 24px;

          &:focus {
            outline-color: transparent;
          }
        }
      }

      .rules-page {
        position: relative;
        padding: 0 16px;
        margin-top: 40px;
        color: var(--rulesFontColor);

        .rules-title {
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 600;
          line-height: 18px;
        }

        .rules-item {
          font-size: 12px;
          font-weight: 400;
          line-height: 22px;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
