<template>
  <div class="edit-activity">
    <div class="module-panel base-form">
      <div class="panel-title">基础配置</div>
      <el-form ref="baseForm" :model="baseForm" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="baseForm.activityName" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <date-picker v-model="baseForm.activityTime" />
        </el-form-item>
      </el-form>
    </div>
    <div class="module-panel base-form">
      <div class="panel-title">分享链接配置</div>
      <el-form ref="shareForm" :model="shareForm" label-width="140px">
        <el-form-item label="活动分享图(可选)：">
          <upload-share-photo v-model="shareForm.fileList" />
        </el-form-item>
        <el-form-item label="活动分享标题：">
          <date-picker v-model="shareForm.activityShareTitle" />
        </el-form-item>
        <el-form-item label="活动分享描述：">
          <date-picker v-model="shareForm.activityShareDesc" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import UploadSharePhoto from './components/UploadSharePhoto'

export default {
  name: 'EditActivity',
  components: { DatePicker, UploadSharePhoto },
  data () {
    return {
      baseForm: {
        activityName: '',
        activityTime: null
      },
      shareForm: {
        fileList: {},
        activityShareTitle: '',
        activityShareDesc: ''
      },
    }
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.edit-activity {
  .module-panel {
    margin-top: 20px;

    .el-input {
      width: 300px;
    }

    .panel-title {
      margin-bottom: 20px;
    }
  }

  .base-form {
    padding-bottom: 2px;
  }

  & /deep/ .el-upload-list--picture-card {
    .el-upload-list__item-thumbnail {
      object-fit: contain;
    }
  }
}
</style>
