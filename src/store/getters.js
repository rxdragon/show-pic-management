const defaultGetters = {
  permission_routes: state => state.permission.routes,
  personage_routers: state => state.permission.personageRouters, // 个人有的路由
}

const userGetters = {
  userInfo: state => state.userStore, // 用户信息
  staffId: state => state.userStore.id, // 当前用户id
  nickname: state => state.userStore.nickname, // 昵称
  avatarImg: state => state.userStore.avatarImg, // 用户头像
  lineState: state => state.userStore.lineState, // 用户在线状态
  name: state => state.userStore.name // 真名
}

const getters = {
  ...defaultGetters,
  ...userGetters
}

export default getters
