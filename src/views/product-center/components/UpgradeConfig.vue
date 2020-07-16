<template>
  <div class="upgrade-config">
    <el-form ref="upgradeForm" :model="upgradeForm" :rules="upgradeRules" label-width="150px">
      <el-form-item label="名称:" prop="name">
        <el-input maxlength="10" v-model.trim="upgradeForm.name" placeholder="升级体验名称,最多10个字符" />
      </el-form-item>
      <el-form-item label="缩略图:">
        <upload-pic v-model="upgradeForm.thumbnailList"/>
      </el-form-item>
      <el-form-item label="下单说明:" prop="desc">
        <el-input class="long" maxlength="30" v-model.trim="upgradeForm.desc" placeholder="下单说明,最多30个字符" />
      </el-form-item>
    </el-form>
    <price-config :price-obj="upgradeForm.priceObj" ref="normalPriceConfig"/>
  </div>
</template>

<script>
import UploadPic from './UploadPic'
import PriceConfig from './PriceConfig'

const upgradeRules = {
  name: [
    { required: true, message: '请输入升级体验名称', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入下单说明', trigger: 'blur' }
  ],
  thumbnailList: [
    { required: true, message: '请上传缩略图', trigger: 'change' }
  ]
}

export default {
  name: 'UpgradeConfig',
  components: { UploadPic, PriceConfig },
  props: {
    upgradeForm: { type: Object, required: true }
  },
  data() {
    return {
      upgradeRules,
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.upgrade-config {
  border-bottom: 1px solid black;
}
</style>
