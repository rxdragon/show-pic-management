<template>
  <div class="activity-h5-page module-panel">
    <div class="panel-title">活动页样式配置</div>
    <div class="main">
      <div class="config">
        <el-form ref="pageForm" :model="pageForm" :rules="pageRules" label-width="140px">
          <el-form-item label="页面标题：" prop="title">
            <el-input v-model.trim="pageForm.title" placeholder="请输入活动分享标题" />
          </el-form-item>
          <el-form-item label="页面头图：" prop="activityShareDesc">
            <el-input v-model.trim="pageForm.activityShareDesc" placeholder="请输入页面头图" />
          </el-form-item>
          <el-form-item label="页面背景色：" prop="bkgColor">
            <el-input v-model.trim="pageForm.bkgColor" placeholder="请输入页面背景色">
              <el-color-picker slot="append" v-model="pageForm.bkgColor"></el-color-picker>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码背景色：" prop="captchaBkgColor">
            <el-input v-model.trim="pageForm.captchaBkgColor" placeholder="请输入验证码背景色">
              <el-color-picker slot="append" v-model="pageForm.captchaBkgColor"></el-color-picker>
            </el-input>
          </el-form-item>
          <el-form-item label="活动说明：" prop="activityDesc">
            <div class="rules-box">
              <el-form-item
                v-for="(ruleItem, ruleKey) in  pageForm.activityDesc"
                :key="ruleItem.key"
                label-width="64px"
                :label="`规则${ruleKey + 1}：`"
                prop="activityDesc"
              >
                <el-input v-model.trim="ruleItem.value" placeholder="请输入规则说明" />
              </el-form-item>
              <el-button @click="addRules" icon="el-icon-plus" type="text">新增规则</el-button>
            </div>
          </el-form-item>
          <el-form-item label="说明字体颜色：" prop="activityShareDesc">
            <el-input v-model.trim="pageForm.rulesFontColor" placeholder="请输入说明字体颜色">
              <el-color-picker slot="append" v-model="pageForm.rulesFontColor"></el-color-picker>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="preview">
        <iphone-model />
      </div>
    </div>
  </div>
</template>

<script>
import * as uuid from 'uuid'
import IphoneModel from './IphoneModel'

const pageRules = {}
export default {
  name: 'ActivityH5Page',
  components: { IphoneModel },
  data () {
    return {
      pageRules,
      pageForm: {
        title: '',
        bkgColor: '',
        captchaBkgColor: '',
        activityDesc: [],
        rulesFontColor: ''
      }
    }
  },
  created () {
    this.initRules()
  },
  methods: {
    /**
     * @description 初始化规则
     */
    initRules () {
      this.pageForm.activityDesc = []
      this.addRules()
    },
    /**
     * @description 添加规则
     */
    addRules () {
      const lastIndex = this.pageForm.activityDesc.length - 1
      if (lastIndex >= 0 && !this.pageForm.activityDesc[lastIndex].value) {
        return this.$newMessage.warning('请输入填写规则后再添加')
      }
      this.pageForm.activityDesc.push({
        value: '',
        key: uuid.v4()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.activity-h5-page {
  margin-top: 20px;

  .el-input {
    width: 300px;
  }

  .el-textarea {
    width: 300px;
  }

  .panel-title {
    margin-bottom: 20px;
  }

  .rules-box {
    width: 388px;
    padding: 12px;
    border: 1px solid #eee;

    .el-form-item {
      margin-bottom: 12px;
    }
  }

  .main {
    display: flex;
    justify-content: space-between;

    .config {
      width: 50%;
    }

    .preview {
      width: 400px;
    }
  }

  & /deep/ .el-input-group__append {
    width: 80px;
    padding: 0;
  }

  & /deep/ .el-color-picker {
    width: 100%;
    height: 38px;
    vertical-align: top;

    & /deep/ .el-color-picker__trigger {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}
</style>
