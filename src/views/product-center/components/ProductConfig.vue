<template>
  <div class="product-config">
    <!-- 基础设置 -->
    <div class="module-panel">
      <div class="panel-title">基础设置</div>
      <el-form ref="baseForm" :model="baseForm" :rules="baseRules" label-width="80px">
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="baseForm.name" placeholder="产品名称,最多10个字符"  />
        </el-form-item>
      </el-form>
    </div>
    <!-- 价格设置 -->
    <div class="module-panel">
      <div class="panel-title">价格设置</div>
      <div class="form-item row">
        <span class="title">是否在产品层级配置价格:</span>
        <el-radio-group v-model="isSimple">
          <el-radio label="simple">是(将不可再配置修图风格&升级体验)</el-radio>
          <el-radio label="notSimple">否(需要在后续步骤配置修图风格&升级体验)</el-radio>
        </el-radio-group>
      </div>
      <div class="form-item" v-if="isSimple === 'simple'">
        <el-radio-group class="column" v-model="simplePrice">
          <el-radio label="contact">联系客服(针对特殊产品需要顾客联系客服下单)</el-radio>
          <el-radio label="normal">常规设置</el-radio>
        </el-radio-group>
      </div>
    </div>
    <!-- 常规设置区域 -->
    <price-config
      ref="normalPriceConfig"
      v-if="simplePrice === 'normal' && isSimple === 'simple'"
    />
    <!-- 其他设置 -->
    <div class="module-panel">
      <div class="panel-title">其他设置</div>
      <el-form ref="otherForm" :model="otherForm" :rules="otherRules" label-width="120px">
        <el-form-item label="产品简介:" prop="desc">
          <el-input class="long" v-model.trim="otherForm.desc" placeholder="产品首页介绍,最多20个字符"  />
        </el-form-item>
        <el-form-item label="缩略图(非必填):">
          <upload-pic v-model="otherForm.thumbnailList"/>
        </el-form-item>
        <el-form-item label="分享图(非必填):">
          <upload-pic v-model="otherForm.shareList"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-area">
      <el-button @click="submit" type="primary" size="small">保存,下一步</el-button>
    </div>
  </div>
</template>

<script>
import UploadPic from './UploadPic'
import PriceConfig from './PriceConfig'

// 基础配置
const baseRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { max: 10, message: '最多10个字符', trigger: 'blur' }
  ],
}
// 其他配置
const otherRules = {
  desc: [
    { required: true, message: '请输入产品首页介绍', trigger: 'blur' },
    { max: 20, message: '最多20个字符', trigger: 'blur' }
  ],
}

export default {
  name: 'ProductConfig',
  components: { UploadPic,PriceConfig },
  props: {},
  data() {
    return {
      baseRules,
      otherRules,
      baseForm: {
        name: ''
      },
      otherForm: {
        desc: '',
        thumbnailList: [],
        shareList: []
      },
      isSimple: 'simple',
      simplePrice: 'normal'
    }
  },
  methods: {
    /**
     * @description 提交到下一步
     */
    async submit() {
      let validateArr = [
        this.$refs.baseForm.validate(),
        this.$refs.otherForm.validate(),
        this.$refs.normalPriceConfig.formCheck()
      ]
      try {
        await Promise.all(validateArr)
        // 跳转到下一个tab
        this.$emit('next', {
          aim: 'subCategoryConfig'
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
