<template>
  <div class="upload-share-photo">
    <div v-for="(photoItem, photoIndex) in uploadPhoto" :key="photoItem.uid" class="list-photo-item">
      <transition name="el-zoom-in-center" mode="out-in">
        <photo-box
          v-if="photoItem.status === 'success' && photoItem.path"
          original-photo
          preview
          :downing="false"
          :src="photoItem.path"
        />
        <div v-else-if="photoItem.status !== 'fail'" class="progress">
          <el-progress
            type="circle"
            :width="100"
            :percentage="photoItem.percentage | formatProgress"
            :color="photoItem.percentage | filterPercentageColor"
            :status="photoItem.percentage | filterPercentage"
          />
        </div>
        <div v-else class="error-photo progress">
          <i class="el-icon-warning-outline">上传失败</i>
        </div>
      </transition>
      <span class="delete-button" @click="deleteUploadPhoto(photoItem, photoIndex)">
        <i class="el-icon-error" />
      </span>
    </div>
    <el-upload
      v-if="uploadPhoto.length < 1"
      v-on="$listeners"
      v-bind="$attrs"
      :action="updateDomain"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :file-list="uploadPhoto"
      :limit="1"
      :data="upyunConfig"
    >
      <div class="avatar-upload">
        <i class="el-icon-plus" />
      </div>
    </el-upload>
    <div class="upload-tips">
      <div class="tip">{{ option.tip }}</div>
    </div>
  </div>
</template>

<script>
import PhotoBox from "@/components/PhotoBox"
import variables from '@/assets/styles/variables.less'
import { mapGetters } from 'vuex'
import { getImagePx } from '@/utils/photoExif.js'
import * as Commonality from '@/api/commonality'
import * as PhotoTool from '@/utils/photoTool'

export default {
  name: 'UploadSharePhoto',
  components: { PhotoBox },
  filters: {
    // 过滤进度条
    formatProgress (value) {
      return Number(value.toFixed(0))
    },
    // 进度到100 改变状态
    filterPercentage (value) {
      return value === 100 ? 'success' : null
    },
    // 设置进度颜色
    filterPercentageColor (value) {
      const colorClass = [variables.orange, variables.orange, variables.blue, variables.green]
      const colorIndex = Number((value / 30).toFixed(0))
      return colorClass[colorIndex]
    }
  },
  model: {
    prop: 'uploadPhoto',
    event: 'change'
  },
  props: {
    uploadPhoto: { type: Array, required: true },
    option: { type: Object, required: true }
  },
  data () {
    return {
      upyunConfig: {}
    }
  },
  computed: {
    ...mapGetters(['updateDomain'])
  },
  activated () {
    this.getUpyunSign()
  },
  methods: {
    /**
     * @description 获取又拍云
     */
    async getUpyunSign () {
      this.upyunConfig = await Commonality.getSignature()
    },
    /**
     * @description 上传前回调
     */
    async beforeUpload (file) {
      try {
        const { width, height } = this.option
        const data = await getImagePx(file)
        if (data.colorSpace !== 'SRGB') throw new Error('not SRGB 色彩空间')
        if (width && height) {
          if (data.width !== width || data.height !== height) throw new Error(`请上传${width}px * ${height}px 的图片`)
        }
        if (width) {
          if (data.width !== width) throw new Error(`请上传宽度为${width}px的图片`)
        }
        if (height) {
          if (data.height !== height) throw new Error(`请上传高度为${height}px的图片`)
        }
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') throw new Error(`请上传jpg/png的图片`)
        return Promise.resolve()
      } catch (error) {
        this.$newMessage({
          dangerouslyUseHTMLString: true,
          message: error.message || error,
          type: 'warning',
          duration: 3000
        })
        return Promise.reject()
      }
    },
    /**
     * @description 上传中
     */
    handleProgress (event, file, fileList) {
      this.$emit('change', fileList)
    },
    /**
     * @description 上传成功
     */
    handleSuccess (response, file, fileList) {
      const path = file.response ? PhotoTool.handlePicPath(file.response.url) : ''
      const uploadedName = PhotoTool.fileNameFormat(file.name)
      this.$set(fileList[0], 'path', path)
      this.$set(fileList[0], 'uploadedName', uploadedName)
      this.$emit('change', fileList)
    },
    /**
     * @description 移除文件
     */
    deleteUploadPhoto (photoItem, index) {
      const isPending = !photoItem.response
      if (isPending) { this.$refs.uploadButton.abort(this.uploadPhoto[index]) }
      this.$emit('change', [])
    }
  }
}
</script>

<style lang="less" scoped>
.upload-share-photo {
  display: flex;

  .avatar-upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100px;
    height: 100px;
    color: #606266;
    -webkit-user-select: none;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    transition: all 0.3;

    &:hover {
      color: #00b1b7;
      border-color: #00b1b7;
    }
  }

  .list-photo-item {
    position: relative;
    width: 100px;
    height: 100px;
    margin-right: 12px;

    .delete-button {
      position: absolute;
      top: -5px;
      right: -5px;
      display: none;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
    }

    .progress {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    &:hover {
      .delete-button {
        display: block;
      }
    }
  }

  .upload-tips {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-left: 16px;

    .tip {
      font-size: 12px;
      line-height: 1.5;
      color: #909399;
    }
  }
}
</style>
