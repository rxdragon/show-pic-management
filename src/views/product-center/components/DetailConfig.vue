<template>
  <div class="detail-config">
    <div class="module-panel">
      <div class="panel-title">头图/封面图设置</div>
      <el-form ref="productObj" :model="productObj" :rules="detailRules" label-width="150px">
        <el-form-item label="头图/封面图:" prop="coverPath">
          <upload-pic v-model="productObj.coverPath"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="module-panel">
      <div class="panel-title">产品介绍</div>
      <p>产品详情配置：</p>
      <div class="edit-content">
        <div class="edit-content-left">
          <div ref="toastuiEditor" class="toastui-editor"></div>
          <el-button type="primary" @click="preview">保存并预览</el-button>
        </div>
        <iphone-model :banner="productObj.coverPath" :page-html="pageHtml" ></iphone-model>
      </div>
    </div>
    <el-button type="primary" @click="nextPage">下一步</el-button>
  </div>
</template>

<script>
import IphoneModel from './IphoneModel.vue'
import UploadPic from './UploadPic'
import defaultOptions from '../editorOption/index.js'
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import '@toast-ui/editor/dist/toastui-editor.css'
import Editor from '@toast-ui/editor'
import * as Commonality from '@/api/commonality'
import { mapGetters } from 'vuex'
import * as qiniu from 'qiniu-js'
import * as PhotoTool from '@/utils/photoTool'

const detailRules = {
  coverPath: [
    { required: true, message: '请上传产品缩略图', trigger: 'change' }
  ]
}
export default {
  name: 'DetailConfig',
  components: { IphoneModel, UploadPic },
  props: {
    productObj: { type: Object, required: true }
  },
  data() {
    return {
      detailRules,
      upyunConfig: '',
      pageHtml: ''
    }
  },
  computed: {
    ...mapGetters(['imgDomain'])
  },
  created() {
    this.getUpyunSign()
  },
  mounted() {
    const options = { ...defaultOptions, el: this.$refs.toastuiEditor }
    this.editor = new Editor(options)
    this.editor.eventManager.removeEventHandler('addImageBlobHook')
    // 添加自定义监听事件
    this.editor.eventManager.listen('addImageBlobHook', (blob, callback) => {
      this.upload(blob, url => {
        callback(url)
      })
    })
  },
  methods: {
    /**
     * @description 下一步
     */
    nextPage () {
      this.$emit('next', {
        aim: 'OtherConfig'
      })
    },
    /**
     * @description 预览
     */
    preview () {
      const temptHtml = this.editor.getHtml()
      this.pageHtml = temptHtml
      this.productObj.information = temptHtml
    },
    /**
     * @description 提交到下一步
     */
    submit () {
      // 跳转到下一个tab
      this.$emit('next', {
        aim: 'detailConfig'
      })
    },
    /**
     * @description 获取又拍云
     */
    async getUpyunSign () {
      this.upyunConfig = await Commonality.getSignature()
    },
    /**
     * @description 上传
     */
    upload (blob, cb) {
      const { upyunConfig, imgDomain } = this
      const observable = qiniu.upload(blob, undefined, upyunConfig.token) // key传undefined,是为了忽略key
      // 上传事件 lifeCycle
      const observer = {
        complete (res) {
          const url = `${imgDomain}${PhotoTool.handlePicPath(res.url)}`
          cb(url)
        }
      }
      observable.subscribe(observer)
    }
  }
}
</script>
<style lang="less" scoped>
.detail-config {
  .edit-content {
    display: flex;
    width: 900px;
    height: 600px;

    /deep/ .toastui-editor {
      width: 100%;

      blockquote {
        padding: 5px 15px;
        font-size: 16px;
        font-weight: 900;
        background-color: #efeeee;
        border-color: #42b983;
        border-left-style: solid;
        border-left-width: 4px;

        p {
          color: #545454;
        }
      }
    }
  }
}
</style>
