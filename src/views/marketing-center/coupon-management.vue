<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'CouponManagement',
  data () {
    return {
      cachedViews: ['CouponList']
    }
  },
  computed: {
    key () {
      return this.$route.path
    }
  },
}
</script>
