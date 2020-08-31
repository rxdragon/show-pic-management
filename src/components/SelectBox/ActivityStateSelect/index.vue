<template>
  <div class="activity-state-select">
    <el-select
      v-bind="$attrs"
      :popper-append-to-body="false"
      clearable
      placeholder="请选择"
      v-on="$listeners"
    >
      <el-option v-for="(optionItem, optionIndex) in options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"/>
    </el-select>
  </div>
</template>

<script>
import { ACTIVITY_STATE, activityToCN } from '@/model/Enumerate.js'

const seachState = [
  ACTIVITY_STATE.WAITING,
  ACTIVITY_STATE.STARTED,
  ACTIVITY_STATE.FINISHED,
  ACTIVITY_STATE.END_EARLY
]

export default {
  name: 'ActivityStateSelect',
  data () {
    const stateOption = seachState.map(item => {
      return {
        label: activityToCN[item],
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
.activity-state-select {
  width: 164px;
}
</style>
