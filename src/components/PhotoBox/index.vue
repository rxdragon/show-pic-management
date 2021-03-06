<template>
  <div class="photo-box">
    <div class="image-box">
      <el-image v-if="!showCanvas" :src="photoSrc" :fit="fit" :preview-src-list="previewPhoto"></el-image>
      <preview-canvas-img contain-photo v-else-if="showCanvas" :file="fileData" />
    </div>
    <div class="handle-box" v-if="downing" @click.stop="">
      <div class="version-name">{{ version | toVersionCN }}</div>
      <el-button type="text" @click="downPhoto">下载照片</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PreviewCanvasImg from '@/components/PreviewCanvasImg'
import * as DownPhoto from '@/utils/DownPhoto.js'

export default {
  name: 'PhotoBox',
  components: { PreviewCanvasImg },
  props: {
    src: { type: String, required: true },
    version: { type: String, default: '' },
    downing: { type: Boolean, default: true },
    originalPhoto: { type: Boolean },
    preview: { type: Boolean },
    fit: { type: String, default: 'cover' },
    fileData: { type: Object, default: null },
  },
  data () {
    return {
      showCanvas: false
    }
  },
  computed: {
    ...mapGetters(['imgDomain', 'imgCompressDomain']),
    photoSrc () {
      if (this.fileData) return ''
      if (this.src.includes('http')) return this.src
      if (this.originalPhoto) {
        return this.imgDomain + this.src
      } else {
        return this.imgCompressDomain + this.src
      }
    },
    previewPhoto () {
      return this.preview ? [this.imgDomain + this.src] : []
    }
  },
  created () {
    if (!this.fileData) return
    this.showCanvas = true
  },
  methods: {
    /**
     * @description 下载图片
     */
    downPhoto () {
      DownPhoto.downOnePicture(this.src)
    }
  }
}
</script>

<style lang="less" scoped>
.photo-box {
  .image-box {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 4px;

    .el-image {
      position: absolute;
      width: 100%;
      height: 100%;

      img {
        -webkit-user-select: none;
        object-position: top;
      }
    }
  }

  .handle-box {
    display: flex;
    justify-content: space-between;
    padding: 12px 6px 6px;

    .version-name {
      font-size: 12px;
      font-weight: 400;
      color: #606266;
    }

    .el-button {
      padding: 0;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
    }

    .people-num {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #606266;
    }

    .joint-label {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #606266;
    }
  }
}
</style>
