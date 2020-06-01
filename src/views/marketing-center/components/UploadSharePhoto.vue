<template>
  <div class="upload-share-photo">
    <div v-for="(photoItem, photoIndex) in uploadPhoto" :key="photoItem.uid" class="list-photo-item">
      <transition name="el-zoom-in-center" mode="out-in">
        <photo-box
          v-if="photoItem.status === 'success' && finishPhoto[photoItem.uid]"
          :downing="false"
          :src="finishPhoto[photoItem.uid].path"
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
  </div>
</template>

<script>
import PhotoBox from "@/components/PhotoBox"
import variables from '@/assets/styles/variables.less'
import { mapGetters } from 'vuex'
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
    prop: 'finishPhoto',
    event: 'change'
  },
  props: {
    finishPhoto: { type: Object, required: true }
  },
  data () {
    return {
      upyunConfig: {},
      uploadPhoto: []
    }
  },
  computed: {
    ...mapGetters(['updateDomain'])
  },
  created () {
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
    beforeUpload (file) {
      // TODO 验证上传
    },
    /**
     * @description 上传中
     */
    handleProgress (event, file, fileList) {
      this.uploadPhoto = fileList
    },
    /**
     * @description 上传成功
     */
    handleSuccess (response, file, fileList) {
      this.uploadPhoto = fileList
      const filePath = file.response ? PhotoTool.handlePicPath(file.response.url) : ''
      const uploadedName = PhotoTool.fileNameFormat(file.name)
      const newPhoto = {
        path: filePath,
        orginPhotoName: uploadedName,
        file
      }
      const uid = file.uid
      this.$set(this.finishPhoto, uid, newPhoto)
      this.$emit('change', this.finishPhoto)
    },
    /**
     * @description 移除文件
     */
    deleteUploadPhoto (photoItem, index) {
      const isPending = !photoItem.response
      if (isPending) { this.$refs.uploadButton.abort(this.uploadPhoto[index]) }
      this.uploadPhoto.splice(index, 1)
      const uid = photoItem.uid
      this.$delete(this.finishPhoto, uid)
      this.$emit('change', this.finishPhoto)
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
}
</style>
