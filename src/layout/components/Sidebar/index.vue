<template>
  <div>
    <logo @click.native="activeExperiment" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        :class="$isDev ? 'menuColor' : ''"
        :background-color="$isDev ? variables.devMenuBg : variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@assetsDir/styles/variables.less'
import Logo from './Logo'

export default {
  components: { SidebarItem, Logo },
  data () {
    return {
      experimentCounts: 0,
      expireTime: 0
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'personage_routers']),
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables () {
      return variables
    }
  },
  methods: {
    activeExperiment () {
      const time = 4 * 1000
      if (this.experimentCounts === 0) {
        this.expireTime = new Date().getTime() + time
      }
      this.experimentCounts++
      if (this.experimentCounts === 7) {
        const nowTime = new Date().getTime()
        if (nowTime < this.expireTime) {
          const hasExperiment = this.permission_routes.find(item => item.path.includes('experiment-view'))
          if (hasExperiment) return
          this.$store.commit('permission/SET_ROUTES', [...this.personage_routers])
          this.experimentCounts = 0
          this.expireTime = 0
        } else {
          this.experimentCounts = 0
          this.expireTime = 0
        }
      }
    }
  }
}
</script>
