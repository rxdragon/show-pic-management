<template>
  <div class="photo-version">
    <template  v-for="(photoItem, photoIndex) in photosData">
      <div class="photo-module" v-if="photoItem.src" :key="photoIndex">
        <photo-box :src="photoItem.src" :version="photoItem.version" @click.native="showImageView(photoIndex)" />
      </div>
    </template>
    <image-view
      :z-index="zIndex"
      :photo-index="showPhotoIndex"
      v-if="showViewer"
      :show-viewer.sync="showViewer"
      :url-list="previewSrcList"
    />
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
      zIndex: 2000,
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
      const filterSrcList = this.photoVersion.filter(item => item.src)
      this.previewSrcList = filterSrcList.map(item => this.imgDomain + item.src)
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
