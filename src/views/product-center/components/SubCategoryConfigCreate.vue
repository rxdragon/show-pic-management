<template>
  <div class="sub-category-create">
    <!-- 风格设置 -->
    <div class="module-box">
      <div class="panel-title">修图风格设置</div>
      <el-form ref="styleForm" :model="styleForm" :rules="styleRules" label-width="150px">
        <el-form-item label="名称:" prop="name">
          <el-input maxlength="10" v-model.trim="styleForm.name" placeholder="修图风格名称,最多10个字符" />
        </el-form-item>
        <el-form-item label="下单说明(非必填):">
          <el-input maxlength="30" class="long" v-model.trim="styleForm.desc" placeholder="下单说明,最多30个字符" />
        </el-form-item>
        <el-form-item label="缩略图:" prop="thumbnailList">
          <upload-pic :option="thumbnailOption" v-model="styleForm.thumbnailList" />
        </el-form-item>
        <el-form-item label="价格设置:">
          <el-radio-group @change="changeIsSimple" v-model="styleForm.isSimple">
            <el-radio label="simple">是(将不可再配置修图风格&升级体验)</el-radio>
            <el-radio label="notSimple">否(需要在后续步骤配置修图风格&升级体验)</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <price-config
      :price-obj="styleForm.priceObj"
      ref="normalPriceConfig"
      v-if="styleForm.isSimple === PRODUCT_IS_SIMPLE.SIMPLE"
    />
    <!-- 升级体验设置 -->
    <div class="module-box" v-else>
      <div class="panel-title">升级体验设置</div>
      <el-button @click="addUpgrade" type="primary" size="small">添加升级体验</el-button>
      <upgrade-config
        :ref="`upgradeConfig${index}`"
        @del="delUpgradeItem"
        :upgrade-form="item"
        :upgrade-index="index"
        v-for="(item, index) in upgradeForms"
        :key="item.uuid"
      />
    </div>
    <div class="submit-area">
      <el-button @click="back" size="small">返回</el-button>
      <el-button @click="configOver" type="primary" size="small">配置完成</el-button>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep.js'
import UploadPic from './UploadPic'
import PriceConfig from './PriceConfig'
import UpgradeConfig from './UpgradeConfig'
import SkuRule from '../rules/skuRule.js'
import { UpgradeObj,StyleObj } from '../objManage/index.js'
import { thumbnailOption } from '../config/imgOption.js'
import { PRODUCT_IS_SIMPLE } from '@/model/Enumerate.js'


const styleRules = new SkuRule('style')

export default {
  name: 'SubCategoryConfigCreate',
  components: { UploadPic, PriceConfig, UpgradeConfig },
  props: {
    createInfo: { type: Object, required: true },
    productSkus: { type: Array, required: true }
  },
  data() {
    return {
      styleRules,
      styleForm: new StyleObj(),
      upgradeForms: [],
      thumbnailOption,
      PRODUCT_IS_SIMPLE
    }
  },
  activated() {
    if (this.createInfo.needInit && this.createInfo.isNew) {
      this.upgradeForms = []
      this.styleForm = new StyleObj()
      this.$emit('next', { type: 'noNeedInit' })
    }
    if (!this.createInfo.isNew && this.createInfo.needInit) { // 编辑情况下,并且需要初始化才会去初始化
      this.styleForm = cloneDeep(this.productSkus[this.createInfo.index].styleForm)
      this.upgradeForms = cloneDeep(this.productSkus[this.createInfo.index].upgradeForms)
      this.$emit('next', { type: 'noNeedInit' })
    }
  },
  methods: {
    /**
     * @description 配置完成
     */
    async configOver () {
      let validateArr = [
        this.$refs.styleForm.validate()
      ]
      if (this.styleForm.isSimple === PRODUCT_IS_SIMPLE.SIMPLE) validateArr = validateArr.concat(this.$refs.normalPriceConfig.formCheck()) // 风格设置
      if (this.styleForm.isSimple === PRODUCT_IS_SIMPLE.NOTSIMPLE) { // 升级体验设置
        this.upgradeForms.forEach((item, index) => {
          validateArr = validateArr.concat(this.$refs[`upgradeConfig${index}`][0].formCheck())
        })
      }
      if (!this.upgradeForms.length && this.styleForm.isSimple === PRODUCT_IS_SIMPLE.NOTSIMPLE) {
        this.$newMessage.warning('请添加升级体验')
        return
      }
      try {
        await Promise.all(validateArr)
        // 发送给编辑界面
        const tempObj = {
          type: 'create',
          styleForm: cloneDeep(this.styleForm),
          upgradeForms: cloneDeep(this.upgradeForms),
          isNew: this.createInfo.isNew,
          index: this.createInfo.index
        }
        this.resetData()
        this.$emit('next', tempObj)
      } catch (error) {
        console.error(error)
        this.$newMessage.warning(error.message || error || '请输入相关配置')
      }
      
    },
    /**
     * @description 重置页面数据
     */
    resetData () {
      // this.styleForm = new StyleObj()
      // this.upgradeForms = []
    },
    /**
     * @description 升级体验有无的切换
     */
    changeIsSimple (value) {
      if (value === 'simple') {
        this.upgradeForms = []
      }
    },
    /**
     * @description 添加升级体验
     */
    addUpgrade () {
      this.upgradeForms.unshift(new UpgradeObj())
    },
    /**
     * @description 删除升级体验
     */
    delUpgradeItem (obj) {
      this.upgradeForms.splice(obj.index, 1)
      if (!this.upgradeForms.length) this.upgradeForms.unshift(new UpgradeObj())
    },
    /**
     * @description 返回上一页
     */
    async back () {
      await this.$confirm(`返回将不会保存单前的子品类配置`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      this.resetData()
      this.$emit('next', { type: 'create' })
    }
  }
}
</script>

<style lang="less" scoped>
.sub-category-create {
  height: 1000px;
  overflow-y: auto;

  &::-webkit-scrollbar-thumb {
    display: none;
  }

  /deep/ .el-input {
    width: 300px;

    &.long {
      width: 300px;
    }
  }

  .panel-title {
    margin-bottom: 20px;
  }

  .submit-area {
    margin-top: 24px;
  }
}
</style>
