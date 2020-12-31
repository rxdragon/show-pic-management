<template>
  <div class="share-message-model">
    <div class="message">
      <div class="title">{{ config.activityShareTitle }}</div>
      <div class="info">
        <div class="desc">{{ config.activityShareDesc }}</div>
        <div class="share-photo">
          <img v-if="sharePhoto" :src="sharePhoto" alt="">
          <div v-else class="share-logo"></div>
        </div>
      </div>
    </div>
    <div class="user-portrait">
      <el-avatar :size="40" shape="square" :src="avatarImg">
        <img
          alt="备份图"
          src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
        />
      </el-avatar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ShareMessageModel',
  props: {
    config: { type: Object, default: () => ({
      fileList: [],
      activityShareTitle: '',
      activityShareDesc: ''
    }) }
  },
  computed: {
    ...mapGetters(['avatarImg', 'imgDomain']),
    sharePhoto () {
      const photoSrc = _.get(this.config, 'fileList[0].path') || ''
      if (photoSrc.includes('http')) return photoSrc
      return photoSrc ? this.imgDomain + photoSrc : ''
    }
  }
}
</script>

<style lang="less" scoped>
.share-message-model {
  display: flex;
  justify-content: space-between;
  width: 375px;
  height: 115px;
  padding: 10px 10px 10px 60px;
  background-color: #ededed;
  border-radius: 4px;

  .message {
    position: relative;
    width: 255px;
    height: 95px;
    padding: 10px;
    background: #fff;
    border-radius: 4px;

    &::before {
      position: absolute;
      top: 14px;
      right: -5px;
      width: 0;
      height: 0;
      content: "";
      border-color: transparent transparent transparent #fff;
      border-style: solid;
      border-width: 5px 0 5px 5px;
    }

    .title {
      height: 18px;
      margin-bottom: 6px;
      font-size: 16px;
      color: #1f1f1f;
    }

    .info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #bebebe;

      .desc {
        display: -webkit-box;
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3; //需要显示的行数
      }

      .share-photo {
        width: 50px;
        height: 50px;

        img {
          width: 100%;
          height: 100%;
          background-color: #e8e8e8;
        }
      }
    }
  }

  .user-portrait {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
}
</style>
