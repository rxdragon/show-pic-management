<template>
  <div class="product-config">
    <!-- 基础设置 -->
    <div class="module-panel">
      <div class="panel-title">基础设置</div>
      <el-form ref="productObjOne" :model="productObj" :rules="productConfigRules" label-width="80px">
        <el-form-item label="名称:" prop="name">
          <el-input maxlength="10" v-model.trim="productObj.name" placeholder="产品名称,最多10个字符"  />
        </el-form-item>
      </el-form>
    </div>
    <!-- 价格设置 -->
    <div class="module-panel">
      <div class="panel-title">价格设置</div>
      <div class="form-item row">
        <span class="title">是否在产品层级配置价格:</span>
        <el-radio-group v-model="productObj.isSimple">
          <el-radio label="simple">是(将不可再配置修图风格&升级体验)</el-radio>
          <el-radio label="notSimple">否(需要在后续步骤配置修图风格&升级体验)</el-radio>
        </el-radio-group>
      </div>
    </div>
    <!-- 常规设置区域 -->
    <price-config ref="normalPriceConfig" v-if="productObj.isSimple === 'simple'"/>
    <!-- 其他设置 -->
    <div class="module-panel">
      <div class="panel-title">其他设置</div>
      <el-form ref="productObjTwo" :model="productObj" :rules="productConfigRules" label-width="120px">
        <el-form-item label="产品简介:" prop="description">
          <el-input class="long" maxlength="20" v-model.trim="productObj.description" placeholder="产品首页介绍,最多20个字符"  />
        </el-form-item>
        <el-form-item label="缩略图:" prop="thumbnailPath">
          <upload-pic v-model="productObj.thumbnailPath"/>
        </el-form-item>
        <el-form-item label="分享图:" prop="sharePath">
          <upload-pic v-model="productObj.sharePath"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-area">
      <el-button @click="submit" type="primary" size="small">下一步</el-button>
    </div>
  </div>
</template>

<script>
import UploadPic from './UploadPic'
import PriceConfig from './PriceConfig'

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
    productObj: { type: Object, required: true }
  },
  data() {
    return {
      productConfigRules
    }
  },
  methods: {
    /**
     * @description 提交到下一步
     */
    async submit() {
      let validateArr = [
        this.$refs.productObjOne.validate(),
        this.$refs.productObjTwo.validate()
      ]
      if (this.productObj.isSimple === 'simple') {
        validateArr.push(this.$refs.normalPriceConfig.formCheck())
      }
      try {
        await Promise.all(validateArr)
        // 跳转到下一个tab
        this.$emit('next', {
          aim: 'SubCategoryConfig'
        })
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

  .form-item {
    margin: 10px;
    font-size: 14px;
    color: #303133;

    .title {
      font-weight: 700;
    }
  }

  .el-radio-group {
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
