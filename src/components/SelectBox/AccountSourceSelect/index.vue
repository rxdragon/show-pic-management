<template>
  <div class="account-source-select">
    <el-select v-bind="$attrs" :popper-append-to-body="false" clearable placeholder="请选择" v-on="$listeners">
      <el-option
        v-for="(optionItem, optionIndex) in options"
        :key="optionIndex"
        :label="optionItem.label"
        :value="optionItem.value"
      />
    </el-select>
  </div>
</template>

<script>
import { USER_FROM, userFromToCN } from '@/model/Enumerate.js'

const seachState = [
  USER_FROM.SHOW_PIC,
  USER_FROM.HIMO
]

export default {
  name: 'AccountSourceSelect',
  data () {
    const stateOption = seachState.map(item => {
      return {
        label: userFromToCN[item],
        value: item
      }
    })
    return {
      options: stateOption
    }
  }
}
</script>

<style lang="less" scoped>
.account-source-select {
  width: 164px;
}
</style>
