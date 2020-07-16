<template>
  <div class="detail-config">
    123
  </div>
</template>

<script>

export default {
  name: 'DetailConfig',
  components: {},
  props: {},
  data() {
    return {
      upgradeForm: {
        name: '',
        thumbnailList: [],
        desc: ''
      }
    }
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
