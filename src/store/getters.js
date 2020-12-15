const getters = {
  sidebar: state => state.app.sidebar,
  cachedViews: state => state.tagsView.cachedViews,
  device: state => state.app.device,
  token: state => state.user.token,
  isLogin: state => state.user.isLogin,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  currentOldId: state => state.datashow.currentOldId,
  currentOldName: state => state.datashow.currentOldName,
  currentDeviceId: state => state.device.currentDeviceId
}
export default getters
