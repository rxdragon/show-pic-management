<template>
  <div class="sub-type">
    <el-button type="primary" size="small">+添加修图风格</el-button>
    <div class="submit-area">
      <el-button @click="submit" type="primary" size="small">保存,下一步</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SubCategoryConfig',
  components: {},
  props: {},
  data() {
    return {
      
    }
  },
  watch: {
   
  },
  methods: {
    /**
     * @description 提交到下一步
     */
    submit () {
      // 跳转到下一个tab
      this.$emit('next', {
        aim: 'detailConfig'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sub-type {
  .submit-area {
    display: flex;
    justify-content: center;
  }
}
</style>
