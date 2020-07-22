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
          <upload-pic :option="thumbnailOption" v-model="styleForm.thumbnailList"/>
        </el-form-item>
        <el-form-item label="价格设置:">
          <el-radio-group v-model="styleForm.isSimple">
            <el-radio label="simple">是(将不可再配置修图风格&升级体验)</el-radio>
            <el-radio label="notSimple">否(需要在后续步骤配置修图风格&升级体验)</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <price-config :price-obj="styleForm.priceObj" ref="normalPriceConfig" v-if="styleForm.isSimple === 'simple'"/>
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
import * as uuid from 'uuid'
import UploadPic from './UploadPic'
import PriceConfig from './PriceConfig'
import UpgradeConfig from './UpgradeConfig'
import SkuRule from '../rules/skuRule.js'
import { UpgradeObj } from '../objManage/index.js'
import cloneDeep from 'lodash/cloneDeep.js'

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
      styleForm: {
        uuid: uuid.v4(),
        name: '',
        thumbnailList: [],
        desc: '',
        isSimple: 'notSimple',
        priceObj: {
          simplePriceText: '',
          simplePrice: 'normal',
          standerPrice: [],
          psStandard: []
        }
      },
      upgradeForms: [],
      thumbnailOption: {
        width: 220,
        height: 220,
        tip: '只能上传220x220的png/jpg图片'
      }
    }
  },
  activated() {
    if (!this.createInfo.isNew) {
      this.styleForm = cloneDeep(this.productSkus[this.createInfo.index].styleForm)
      this.upgradeForms = cloneDeep(this.productSkus[this.createInfo.index].upgradeForms)
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
      if (this.styleForm.isSimple === 'simple') { // 风格设置
        validateArr = validateArr.concat(this.$refs.normalPriceConfig.formCheck())
      }
      if (this.styleForm.isSimple === 'notSimple') { // 升级体验设置
        this.upgradeForms.forEach((item, index) => {
          validateArr = validateArr.concat(this.$refs[`upgradeConfig${index}`][0].formCheck())
        })
      }
      try {
        await Promise.all(validateArr)
        // 发送给编辑界面
        const tempObj = {
          type: 'create',
          styleForm: this.styleForm,
          upgradeForms: this.upgradeForms,
          isNew: this.createInfo.isNew,
          index: this.createInfo.index
        }
        this.$emit('next', tempObj)
      } catch (error) {
        console.error(error)
        this.$newMessage.warning(error.message || error || '请输入相关配置')
      }
      
    },
    /**
     * @description 添加升级体验
     */
    addUpgrade () {
      this.upgradeForms.push(new UpgradeObj())
    },
    /**
     * @description 删除升级体验
     */
    delUpgradeItem (obj) {
      this.upgradeForms.splice(obj.index, 1)
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
      // 跳转到下一个tab
      this.$emit('next', { type: 'create' })
    }
  }
}
</script>

<style lang="less" scoped>
.sub-category-create {
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
