const defaultGetters = {
  permission_routes: state => state.permission.routes,
  personage_routers: state => state.permission.personageRouters, // 个人有的路由
  updateDomain: state => state.setting.updateDomain, // 上传后的照片域名
  shareDomain: state => state.setting.shareDomain, // 分享域名
  imgDomain: state => state.setting.imgDomain, // 上传后的照片域名
  imgCompressDomain: state => state.setting.imgCompressDomain // 上传后自动压缩图域名
  
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
