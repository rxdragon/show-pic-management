<template>
  <div class="photo-version">
    <div class="photo-module" v-for="(photoItem, photoIndex) in photosData" :key="photoIndex">
      <template v-if="photoItem.src">
        <photo-box :src="photoItem.src" :version="photoItem.version" @click.native="showImageView(photoIndex)" />
      </template>
    </div>
    <image-view :z-index="zIndex" :photo-index="showPhotoIndex" v-if="showViewer" :show-viewer.sync="showViewer" :url-list="previewSrcList" />
  </div>
</template>

<script>
import PhotoBox from "@/components/PhotoBox"
import ImageView from "@/components/ImageView"
import { mapGetters } from 'vuex'

export default {
  name: 'PhotoVersion',
  components: { PhotoBox, ImageView },
  props: {
    photoVersion: { type: Array, required: true }
  },
  data () {
    return {
      zIndex: 1000,
      showViewer: false, // 显示加载组件
      previewSrcList: [],
      showPhotoIndex: 0
    }
  },
  computed: {
    ...mapGetters(['imgDomain']),
    photosData () {
      return this.photoVersion
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
      this.previewSrcList = this.photoVersion.map(item => this.imgDomain + item.src)
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
