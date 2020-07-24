<template>
  <div class="upgrade-config">
    <el-button class="del-btn" @click="delUpgradeItem" type="danger">删除</el-button>
    <el-form ref="upgradeForm" :model="upgradeForm" :rules="upgradeRules" label-width="150px">
      <el-form-item label="名称:" prop="name">
        <el-input maxlength="10" v-model.trim="upgradeForm.name" placeholder="升级体验名称,最多10个字符" />
      </el-form-item>
      <el-form-item label="缩略图:" prop="thumbnailList">
        <upload-pic :option="thumbnailOption" v-model="upgradeForm.thumbnailList" />
      </el-form-item>
      <el-form-item label="下单说明(非必填):">
        <el-input class="long" maxlength="30" v-model.trim="upgradeForm.desc" placeholder="下单说明,最多30个字符" />
      </el-form-item>
    </el-form>
    <price-config :price-obj="upgradeForm.priceObj" ref="normalPriceConfig" />
  </div>
</template>

<script>
import UploadPic from './UploadPic'
import PriceConfig from './PriceConfig'
import SkuRule from '../rules/skuRule.js'
import { thumbnailOption } from '../config/imgOption.js'

const upgradeRules = new SkuRule('upgrade')

export default {
  name: 'UpgradeConfig',
  components: { UploadPic, PriceConfig },
  props: {
    upgradeForm: { type: Object, required: true },
    upgradeIndex: { type: Number, required: true }
  },
  data() {
    return {
      upgradeRules,
      thumbnailOption
    }
  },
  methods: {
    /**
     * @description 删除升级体验
     */
    delUpgradeItem () {
      this.$emit('del', { index: this.upgradeIndex })
    },
    /**
     * @description 校验
     */
    formCheck () {
      let tempArr = []
      tempArr.push(this.$refs.upgradeForm.validate())
      tempArr = tempArr.concat(this.$refs.normalPriceConfig.formCheck())
      return tempArr
    }
  }
}
</script>

<style lang="less" scoped>
.upgrade-config {
  position: relative;
  margin-bottom: 20px;
  border-bottom: 1px solid black;

  .del-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
