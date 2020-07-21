<template>
  <div class="detail-config">
    <div class="module-box">
      <div class="panel-title">头图/封面图设置</div>
      <el-form ref="productObj" :model="productObj" :rules="detailRules" label-width="120px">
        <el-form-item label="头图/封面图:" prop="coverPath">
          <upload-pic v-model="productObj.coverPath"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="module-box">
      <div class="panel-title">产品介绍</div>
      <div class="edit-content">
        <div class="edit-content-left">
          <editor
            initialEditType="wysiwyg"
            @change="editorInput"
            height="100%"
            ref="toastuiEditor"
            :options="editorOptions"
          />
        </div>
        <iphone-model :product-obj="productObj" :banner="productObj.coverPath" :page-html="pageHtml" ></iphone-model>
      </div>
    </div>
    <div class="next-btn">
      <el-button type="primary" @click="nextPage">下一步</el-button>
    </div>
  </div>
</template>

<script>
import IphoneModel from './IphoneModel.vue'
import UploadPic from './UploadPic'
import defaultOptions from '../editorOption/index.js'
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'

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
  components: { IphoneModel, UploadPic, Editor },
  props: {
    productObj: { type: Object, required: true }
  },
  data() {
    return {
      detailRules,
      upyunConfig: '',
      pageHtml: '',
      editorOptions: defaultOptions,
    }
  },
  computed: {
    ...mapGetters(['imgDomain'])
  },
  created() {
    this.getUpyunSign()
  },
  mounted() {
    this.editor = this.$refs.toastuiEditor.editor
    this.editor.eventManager.removeEventHandler('addImageBlobHook')
    // 添加自定义监听事件
    this.editor.eventManager.listen('addImageBlobHook', (blob, callback) => {
      this.upload(blob, url => {
        callback(url)
      })
    })
    this.editor.setHtml(this.productObj.information)
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
     * @description 输入监听
     */
    editorInput () {
      const html = this.$refs.toastuiEditor.invoke('getHtml')
      this.pageHtml = html
      this.productObj.information = html
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
    min-width: 900px;
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

    .edit-content-left {
      width: 600px;
      margin-right: 48px;
    }

    /deep/ .iphone-model {
      transform: scale(0.8) translateY(-14%);
    }
  }

  .module-box {
    margin-bottom: 24px;
  }

  .panel-title {
    margin-bottom: 20px;
  }

  .next-btn {
    text-align: center;
  }
}
</style>
