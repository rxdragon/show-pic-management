<template>
  <div class="photo-version">
    <div class="photo-module" v-for="(photoItem, photoIndex) in photoVersion" :key="photoIndex">
      <photo-box :src="photoItem.src" :version="photoItem.version" @click.native="showImageView(photoIndex)" />
    </div>
    <image-view :z-index="zIndex" :photo-index="showPhotoIndex" v-if="showViewer" :show-viewer.sync="showViewer" :url-list="previewSrcList" />
  </div>
</template>

<script>
import PhotoBox from "@/components/PhotoBox"
import ImageView from "@/components/ImageView"

export default {
  name: 'PhotoVersion',
  components: { PhotoBox, ImageView },
  data () {
    return {
      photoVersion: [
        {
          version: '原片',
          src: 'https://cloud.cdn-qn.hzmantu.com/compress/2020/05/01/Fh_ng-dn42IKZY5-6gBunCtzVt28.jpg'
        },
        {
          version: '云端成片',
          src: 'https://cloud.cdn-qn.hzmantu.com/compress/2020/05/01/Fsgr3VQAuzewZ3xA--Vp-GbrbYGC.jpg'
        },
        {
          version: '顾客满意照片',
          src: 'https://cloud.cdn-qn.hzmantu.com/compress/2020/05/01/Fsgr3VQAuzewZ3xA--Vp-GbrbYGC.jpg'
        }
      ],
      zIndex: 1000,
      showViewer: false, // 显示加载组件
      previewSrcList: [],
      showPhotoIndex: 0
    }
  },
  created () {
    this.initPreviewList()
  },
  methods: {
    /**
     * @description 初始化预览组件
     */
    initPreviewList () {
      this.previewSrcList = this.photoVersion.map(item => item.src)
    },
    /**
     * @description 显示图片预览
     */
    showImageView (photoIndex) {
      this.showPhotoIndex = photoIndex
      this.showViewer = true
    }
  }
}
</script>

<style lang="less" scoped>
.photo-version {
  display: flex;
  flex-wrap: wrap;

  .photo-module {
    width: 253px;
    margin-right: 12px;
    cursor: pointer;
  }
}
</style>
