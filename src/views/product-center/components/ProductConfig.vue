<template>
  <div class="product-config">
    <!-- 基础设置 -->
    <div class="module-box">
      <div class="panel-title">基础设置</div>
      <el-form ref="productObjOne" :model="productObj" :rules="productConfigRules" label-width="100px">
        <el-form-item label="名称:" prop="name">
          <el-input class="product-name" maxlength="10" v-model.trim="productObj.name" placeholder="产品名称,最多10个字符"  />
        </el-form-item>
      </el-form>
    </div>
    <!-- 价格设置 -->
    <div class="module-box">
      <div class="panel-title">价格设置</div>
      <div class="form-item row">
        <span class="title">是否在产品层级配置价格:</span>
        <el-radio-group v-model="productObj.isSimple">
          <el-radio label="simple">是（将不可再配置修图风格&升级体验）</el-radio>
          <el-radio label="notSimple">否（需要在后续步骤配置修图风格&升级体验）</el-radio>
          <div class="fake-change-area">
            <div @click="changeIsSimple('simple')" class="fake-change-item left"></div>
            <div @click="changeIsSimple('notSimple')" class="fake-change-item right"></div>
          </div>
        </el-radio-group>
      </div>
    </div>
    <!-- 常规设置区域 -->
    <price-config :price-obj="productObj.priceObj" ref="normalPriceConfig" v-if="productObj.isSimple === 'simple'"/>
    <!-- 其他设置 -->
    <div class="module-box">
      <div class="panel-title">其他设置</div>
      <el-form ref="productObjTwo" :model="productObj" :rules="productConfigRules" label-width="100px">
        <el-form-item label="产品简介:" prop="description">
          <el-input class="long" maxlength="30" v-model.trim="productObj.description" placeholder="产品首页介绍,最多30个字符"  />
        </el-form-item>
        <el-form-item label="缩略图:" prop="thumbnailPath">
          <upload-pic :option="thumbnailOption" v-model="productObj.thumbnailPath"/>
        </el-form-item>
        <el-form-item label="分享图:" prop="sharePath">
          <upload-pic :option="shareOption" v-model="productObj.sharePath"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-area">
      <el-button @click="check('next')" type="primary" size="small">下一步</el-button>
    </div>
  </div>
</template>

<script>
import UploadPic from './UploadPic'
import PriceConfig from './PriceConfig'
import { thumbnailOption, shareOption } from '../config/imgOption.js'
// 基础配置
const productConfigRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入产品首页介绍', trigger: 'blur' }
  ],
  thumbnailPath: [
    { required: true, message: '请上传产品缩略图', trigger: 'change' }
  ],
  sharePath: [
    { required: true, message: '请上传产品分享图', trigger: 'change' }
  ]
}

export default {
  name: 'ProductConfig',
  components: { UploadPic,PriceConfig },
  props: {
    productObj: { type: Object, required: true },
    productSkus: { type: Array, required: true },
    checkStatus: { type: Object, required: true }
  },
  data() {
    return {
      productConfigRules,
      thumbnailOption,
      shareOption
    }
  },
  activated() {
    if (this.checkStatus.ProductConfig) {
      this.check()
      this.$emit('finalCheck', {
        type: 'del',
        tab: 'ProductConfig'
      })
    }
  },
  methods: {
    /**
     * @description 是否单层产品配置
     */
    async changeIsSimple (type) {
      const { isSimple } = this.productObj
      if (type === isSimple) return
      if (this.productSkus.length && type === 'simple') { // 已有子品类的情况下
        await this.$confirm(`变更配置会清空子品类已有配置`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.productObj.isSimple = type
        this.$emit('next', { type: 'emptySubCategory' })
        return
      }
      this.productObj.isSimple = type
      if (type === 'simple') this.$emit('next', { type: 'emptySubCategory' }) // 没有配置好的子品类,但是可能存在子品类正在配置ing,切换的话也会将配置中清空
    },
    /**
     * @description 提交到下一步
     */
    async check(type) {
      const aim = this.productObj.isSimple === 'simple' ? 'DetailConfig' : 'SubCategoryConfig'
      let validateArr = [
        this.$refs.productObjOne.validate(),
        this.$refs.productObjTwo.validate()
      ]
      if (this.productObj.isSimple === 'simple') validateArr = validateArr.concat(this.$refs.normalPriceConfig.formCheck())
      try {
        await Promise.all(validateArr)
        if (type === 'next') this.$emit('next', { aim })
      } catch (error) {
        console.error(error)
        this.$newMessage.warning(error.message || error || '请输入相关配置')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.product-config {
  .el-input {
    width: 180px;
    margin-right: 10px;

    &.long {
      width: 300px;
    }
  }

  .module-box {
    margin-bottom: 24px;
  }

  .panel-title {
    margin-bottom: 20px;
  }

  .form-item {
    margin: 10px;
    font-size: 14px;
    color: #303133;

    .fake-change-area {
      position: absolute;
      top: 0;
      left: 0;
      width: 615px;
      height: 18px;

      .fake-change-item {
        display: inline-block;
        height: 100%;

        &.left {
          width: 300px;
        }

        &.right {
          width: 305px;
        }
      }
    }

    .title {
      margin-right: 20px;
      font-weight: 700;
    }
  }

  .product-name {
    width: 300px;
  }

  .el-radio-group {
    position: relative;

    &.column {
      display: flex;
      flex-direction: column;
    }
  }

  .submit-area {
    display: flex;
    justify-content: center;
  }
}
</style>
