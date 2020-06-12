<template>
  <div class="activity-h5-page module-panel">
    <div class="panel-title">活动页样式配置</div>
    <div class="main">
      <div class="config">
        <el-form ref="pageForm" :model="pageForm" :rules="pageRules" label-width="140px">
          <el-form-item label="页面标题：" prop="title">
            <el-input v-model.trim="pageForm.title" placeholder="请输入活动分享标题" />
          </el-form-item>
          <el-form-item class="header-img" label="页面头图：" prop="headerImg">
            <el-link
              class="upload-photo-src"
              type="primary"
              :href="pageForm.headerImg"
              :disabled="!pageForm.headerImg"
              target="_blank"
            >
              {{ pageForm.headerImg ? '图片链接' : '暂无图片' }}
            </el-link>
            <el-tooltip v-if="pageForm.headerImg" effect="dark" :content="pageForm.headerImg" placement="top-start">
              <i class="el-icon-warning"></i>
            </el-tooltip>
            <el-upload
              class="upload-demo"
              :action="updateDomain"
              :data="upyunConfig"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :limit="1"
              :file-list="fileList"
            >
              <el-button size="small" :disabled="Boolean(pageForm.headerImg)" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传SRGB色彩空间，750px * 1208px的图片</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="页面背景色：" prop="bkgColor">
            <el-input v-model.trim="pageForm.bkgColor" placeholder="请输入页面背景色">
              <el-color-picker slot="append" v-model="pageForm.bkgColor"></el-color-picker>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码文字颜色：" prop="captchaTextColor">
            <el-input v-model.trim="pageForm.captchaTextColor" placeholder="请输入验证码背景色">
              <el-color-picker slot="append" v-model="pageForm.captchaTextColor"></el-color-picker>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码背景色：" prop="captchaBkgColor">
            <el-input v-model.trim="pageForm.captchaBkgColor" placeholder="请输入验证码背景色">
              <el-color-picker slot="append" v-model="pageForm.captchaBkgColor"></el-color-picker>
            </el-input>
          </el-form-item>
          <!-- 领取按钮背景色 -->
          <template>
            <el-form-item label="领取按钮背景色：" prop="receiveBkgStart">
              <el-input v-model.trim="pageForm.receiveBkgStart" placeholder="请输入按钮背景色前置">
                <el-color-picker slot="append" v-model="pageForm.receiveBkgStart" @change="setReceiveBkgColor"></el-color-picker>
              </el-input>
            </el-form-item>
            <el-form-item prop="receiveBkgEnd">
              <el-input v-model.trim="pageForm.receiveBkgEnd" placeholder="请输入按钮背景色后置">
                <el-color-picker slot="append" v-model="pageForm.receiveBkgEnd" @change="setReceiveBkgColor"></el-color-picker>
              </el-input>
            </el-form-item>
            <el-form-item prop="receiveBkgAngle">
              <el-slider
                v-model="pageForm.receiveBkgAngle"
                show-stops
                :max="360"
                :step="45"
                show-input
                @change="setReceiveBkgColor"
              />
            </el-form-item>
          </template>

          <el-form-item label="活动说明：" prop="activityDesc">
            <div class="rules-box">
              <el-form-item
                v-for="(ruleItem, ruleKey) in pageForm.activityDesc"
                :key="ruleItem.key"
                label-width="70px"
                :label="`规则${ruleKey + 1}：`"
              >
                <el-input v-model.trim="ruleItem.value" placeholder="请输入规则说明" />
                <el-button class="delete" type="text" @click="deleteRulue(ruleItem.key)">删除</el-button>
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
        <iphone-model :config="pageForm" />
      </div>
    </div>
  </div>
</template>

<script>
import * as uuid from 'uuid'
import * as Commonality from '@/api/commonality'
import * as PhotoTool from '@/utils/photoTool'
import IphoneModel from './IphoneModel'
import { mapGetters } from 'vuex'
import { getImagePx } from '@/utils/photoExif.js'
import { validateColor, validateRules } from '@/utils/validator.js'

const pageRules = {
  title: [{ required: true, message: '请输入活动分享标题', trigger: 'blur' }],
  headerImg: [{ required: true, message: '请上传页面头图', trigger: ['blur', 'change'] }],
  bkgColor: [{ required: true, validator: validateColor, trigger: 'blur' }],
  captchaBkgColor: [{ required: true, validator: validateColor, trigger: 'blur' }],
  captchaTextColor: [{ required: true, validator: validateColor, trigger: 'blur' }],
  receiveBkgStart: [{ required: true, validator: validateColor, trigger: 'blur' }],
  receiveBkgEnd: [{ required: true, validator: validateColor, trigger: 'blur' }],
  activityDesc: [{ required: true, validator: validateRules }],
  rulesFontColor: [{ required: true, validator: validateColor, trigger: 'blur' }]
}

export default {
  name: 'ActivityH5Page',
  components: { IphoneModel },
  data () {
    return {
      pageRules,
      pageForm: {
        title: '', // 活动分享标题
        headerImg: '', // 页面头图
        bkgColor: '#06134C', // 页面背景色
        captchaBkgColor: '#FFFFFF', // 验证码背景色
        captchaTextColor: '#00c7af', // 验证码输入颜色
        activityDesc: [], // 活动说明
        receiveBkgStart: '#0ee0c7', // 渐变前置颜色
        receiveBkgEnd: '#13c2c2', // 渐变后置颜色
        receiveBkgAngle: 270, // 渐变角度
        receiveBkgColor: 'linear-gradient(270deg, #0ee0c7 0%, #13c2c2 100%)', // 领取按钮颜色
        rulesFontColor: '#FFFFFF' // 说明字体颜色
      },
      fileList: [],
      upyunConfig: {}
    }
  },
  computed: {
    ...mapGetters(['updateDomain', 'imgDomain'])
  },
  created () {
    this.getUpyunSign()
    this.initRules()
  },
  methods: {
    /**
     * @description 获取又拍云
     */
    async getUpyunSign () {
      this.upyunConfig = await Commonality.getSignature()
    },
    /**
     * @description 设置头部图片
     */
    setHeaderImg (path, isNowUpload = true) {
      this.pageForm.headerImg = isNowUpload ? this.imgDomain + path : path
    },
    /**
     * @description 上传前钩子
     */
    async beforeUpload (file) {
      try {
        const data = await getImagePx(file)
        if (data.colorSpace !== 'SRGB') throw new Error('not SRGB 色彩空间')
        // if (data.width !== 750 || data.height !== 1208) throw new Error('请上传750px * 1208px 的图片')
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
    setReceiveBkgColor () {
      this.pageForm.receiveBkgColor = `linear-gradient(${this.pageForm.receiveBkgAngle}deg, ${this.pageForm.receiveBkgStart} 0%, ${this.pageForm.receiveBkgEnd} 100%)`
    },
    /**
     * @description 上传成功钩子
     */
    handleSuccess (response, file, fileList) {
      const path = file.response ? PhotoTool.handlePicPath(file.response.url) : ''
      this.setHeaderImg(path)
    },
    /**
     * @description 移除钩子
     */
    handleRemove () {
      this.fileList = []
      this.pageForm.headerImg = ''
    },
    /**
     * @description 超出图片限制文件数量
     */
    handleExceed () {
      this.$newMessage.warning('请删除原有的头部图片')
    },
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
    },
    /**
     * @description 删除规则
     */
    deleteRulue (key) {
      if (this.pageForm.activityDesc.length === 1) return this.$newMessage.warning('必须添加一条规则')
      const findDeleteRuleIndex = this.pageForm.activityDesc.findIndex(item => item.key === key)
      if (findDeleteRuleIndex > -1) {
        this.pageForm.activityDesc.splice(findDeleteRuleIndex, 1)
      }
    },
    /**
     * @description 校验表单
     */
    async validatePageForm () {
      try {
        await this.$refs.pageForm.validate()
      } catch (error) {
        console.error(error)
        throw new Error('请填写活动优惠券配置')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.activity-h5-page {
  margin-top: 20px;
  overflow: hidden;

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
    width: 394px;
    padding: 12px;
    border: 1px solid #eee;

    .el-form-item {
      margin-bottom: 12px;

      & /deep/ .el-form-item__content {
        display: flex;

        .delete {
          margin-left: 12px;
          color: #e64049;
        }
      }
    }
  }

  .header-img {
    .el-icon-warning {
      margin-left: 6px;
      color: #00c7af;
      vertical-align: middle;
    }
  }

  .main {
    display: flex;

    .config {
      width: 600px;
    }

    .preview {
      width: 430px;
      margin-left: 40px;
      transform: scale(0.8) translateY(-14%);
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
