// eslint-disable-next-line no-unused-vars
import { asyncRoutes, constantRoutes } from '@/router'
import { toCapitalHump } from '@/utils/index.js'

/**
 * @param roles // 权限
 * @param route // 路由
 */
function hasPermission (roles, route) {
  return roles.includes(route.name)
}

/**
 * 过滤含有权限路由
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  personageRouters: [],
  roles: [],
  showPartnerPerformance: false, // 是否显示伙伴绩效
  showOverallPerformance: false, // 是否显示总体绩效
  showAuditPerformance: false, // 是否显示审核绩效
  showTimeStatistics: false, // 是否显示用时统计
  showCheckerEvaluate: false, // 是否显示看片评价
  showFlowInfo: false, // 是否显示浏览看板
  showRetouchStreamList: false, // 是否显示修图队列
  showReviewStreamList: false, // 是否显示审核队列
  showStreamList: false, // 是否显示浏览加急查询
  showUrgentStream: false, // 是否显示加急按钮
  isRetoucher: false, // 是否是修片师
  showWorkInfo: false // 是否可以查看工作看板详情按钮
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERSONAGE_ROUTES: (state, routes) => {
    state.personageRouters = routes
  }
}

const actions = {
  // 判断动态路由
  generateRoutes ({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      const newRoles = roles
      let newRolesArr = []
      const newPermissionArr = []
      newRoles.forEach(roleItem => {
        if (roleItem.name) {
          const nameArr = roleItem.name.split('.')
          nameArr.length = nameArr.length - 1
          // 全部权限列表
          newPermissionArr.push(toCapitalHump(roleItem.name))
          const componentNames = nameArr.map(item => toCapitalHump(item))
          newRolesArr = [...newRolesArr, ...componentNames]
        }
      })
      commit('SET_ROLES', newPermissionArr)
      newRolesArr = [...new Set(newRolesArr)]
      accessedRoutes = [...filterAsyncRoutes(asyncRoutes, newRolesArr)]
      commit('SET_PERSONAGE_ROUTES', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
