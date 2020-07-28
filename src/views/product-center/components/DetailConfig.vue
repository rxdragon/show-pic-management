<template>
  <div class="detail-config">
    <div class="module-box">
      <div class="panel-title">头图/封面图设置</div>
      <el-form ref="productObj" :model="productObj" :rules="detailRules" label-width="120px">
        <el-form-item label="头图/封面图:" prop="coverPath">
          <upload-pic :option="coverOption" v-model="productObj.coverPath" />
        </el-form-item>
      </el-form>
    </div>
    <div class="module-box">
      <div class="panel-title">产品介绍</div>
      <div class="edit-content">
        <div class="edit-content-left">
          <div ref="toastuiEditor"></div>
        </div>
        <iphone-model :minimum-price="minimumPrice" :product-obj="productObj" :banner="productObj.coverPath" :page-html="productObj.information" />
      </div>
    </div>
    <div class="next-btn">
      <el-button type="primary" @click="check('next')">下一步</el-button>
    </div>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import '@toast-ui/editor/dist/toastui-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
 
import IphoneModel from './IphoneModel.vue'
import UploadPic from './UploadPic'
import defaultOptions from '../editorOption/index.js'
import Tool from '../tools/index.js'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import Editor from '@toast-ui/editor'


import * as Commonality from '@/api/commonality'
import * as Product from '@/api/product'

import { coverOption } from '../config/imgOption.js'
import { PRODUCT_IS_SIMPLE } from '@/model/Enumerate.js'
import { mapGetters } from 'vuex'
import { getImagePx } from '@/utils/photoExif.js'

const detailRules = {
  coverPath: [
    { required: true, message: '请上传产品缩略图', trigger: 'change' }
  ]
}

export default {
  name: 'DetailConfig',
  components: { IphoneModel, UploadPic },
  props: {
    productObj: { type: Object, required: true },
    checkStatus: { type: Object, required: true },
    productSkus: { type: Array, required: true },
    createInfo: { type: Object, required: true }
  },
  data () {
    return {
      detailRules,
      upyunConfig: '',
      coverOption,
      minimumPrice: '--',
      checkedFail: false, // 表示页面校验不通过
      colorSyntax
    }
  },
  computed: {
    ...mapGetters(['imgDomain'])
  },
  activated () {
    this.editor.setHtml(this.productObj.information)
    this.updateMinimumPrice()
    if (this.checkStatus.DetailConfig) {
      this.check()
      this.$emit('finalCheck', {
        type: 'del',
        tab: 'DetailConfig'
      })
    }
    if (this.checkedFail) {
      this.resetData()
    }
  },
  mounted() {
    this.editor = new Editor({
      plugins: [colorSyntax],
      el: this.$refs.toastuiEditor,
      ...defaultOptions
    })
    this.editor.eventManager.removeEventHandler('addImageBlobHook')
    this.editor.eventManager.removeEventHandler('change')
    // 添加自定义监听事件
    this.editor.eventManager.listen('addImageBlobHook', (file, callback) => {
      this.upload(file, url => {
        callback(url)
        this.$loadingClose()
      })
    })
    this.editor.eventManager.listen('change', () => {
      this.editorInput()
    })
  },
  methods: {
    /**
     * @description 下一步
     */
    async check (type) {
      try {
        await this.$refs.productObj.validate()
        if (!this.productObj.information) throw new Error('产品介绍还没填写')
        if (type === 'next') this.$emit('next', { aim: 'OtherConfig' })
      } catch (error) {
        this.checkedFail = true
        this.$newMessage.warning(error.message || error || '请输入相关配置')
      }
    },
    /**
     * @description 重置校验状态
     */
    resetData () {
      this.$refs.productObj.clearValidate()
      this.checkedFail = false
    },
    /**
     * @description 输入监听
     */
    editorInput () {
      const html = this.editor.getHtml()
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
    async upload (file, cb) {
      try {
        this.$loading()
        const data = await getImagePx(file)
        if (data.colorSpace !== 'SRGB') throw new Error('not SRGB 色彩空间')
        if (data.width !== 750) throw new Error(`请上传宽度为750px的图片`)
        await this.getUpyunSign()
        const { token } = this.upyunConfig
        const req = { file, token }
        const url = await Product.uploadPhotoData(req)
        cb(`${this.imgDomain}${url}`)
      } catch (error) {
        this.$newMessage.warning(error.message || '上传失败')
        this.$loadingClose()
        throw new Error(error)
      }
    },
    /**
     * @description 更新设置的最低价格
     */
    updateMinimumPrice () {
      const { productObj, productSkus } = this
      let priceArr = []
      if (productObj.isSimple === PRODUCT_IS_SIMPLE.SIMPLE) {
        priceArr = priceArr.concat(Tool.findPrice(productObj.priceObj))
      } else {
        productSkus.forEach(skuItem => {
          if (skuItem.styleForm.isSimple === PRODUCT_IS_SIMPLE.SIMPLE) {
            priceArr = priceArr.concat(Tool.findPrice(skuItem.styleForm.priceObj))
          } else {
            skuItem.upgradeForms.forEach((upgradeFormitem) => {
              priceArr = priceArr.concat(Tool.findPrice(upgradeFormitem.priceObj))
            })
          }
        })
      }
      priceArr.sort((a,b) => a - b)
      this.minimumPrice = priceArr[0] ? Number(priceArr[0]).toFixed(2): '--'
    }
  }
}
</script>
<style lang="less" scoped>
.detail-config {
  .edit-content {
    display: flex;
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
    margin-top: 100px;
    text-align: center;
  }
}
</style>
