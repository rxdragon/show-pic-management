<template>
  <el-image class="preview-canvas-img" :src="src" :fit="containPhoto ? 'contain' : 'cover'">
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline" />
      <span>加载失败...</span>
    </div>
  </el-image>
</template>

<script>
export default {
  name: 'PreviewCanvasImg',
  props: {
    file: { type: Object, required: true },
    containPhoto: { type: Boolean }
  },
  data () {
    return {
      fileData: null,
      quality: 0.8,
      width: 700,
      src: ''
    }
  },
  created () {
    this.fileData = this.file.raw
    this.pressImg()
  },
  methods: {
    /**
     * @param {二进制文件流} file
     */
    changeFileToBaseURL (file) {
      return URL.createObjectURL(file)
    },
    /**
     * @description 压缩图片
     */
    async pressImg () {
      // 得到文件类型
      const fileType = this.fileData.type
      const imgSrc = this.changeFileToBaseURL(this.fileData)
      const image = new Image()
      image.src = imgSrc
      image.onload = () => {
        const scale = image.width / image.height
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = this.width
        canvas.height = parseInt(this.width / scale)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blobData) => {
          this.src = URL.createObjectURL(blobData)
        }, fileType, this.quality)
      }
    }
  }

}
</script>

<style lang="less" scoped>
.preview-canvas-img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-position: top;
  object-fit: cover;

  & /deep/ img {
    object-position: center !important;
  }
}
</style>
