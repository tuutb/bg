/**

 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import { login } from '@/api/index'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title } from '@/config'

const state = () => ({
  accessToken: getAccessToken(),//token
})
const getters = {
  accessToken: (state) => state.accessToken,
}
const mutations = {

  // 设置token
  setAccessToken (state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },

}
const actions = {
  async login ({ commit }, userInfo) {
    let res = await login(userInfo)
    if (res.status == 200) {
      const accessToken = res.data.token
      if (accessToken) {
        commit('setAccessToken', accessToken)//token
        localStorage.setItem("userInfo", JSON.stringify(res.data))
        const hour = new Date().getHours()
        const thisTime = hour < 8 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
        Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
      }
    }
  },
  // 退出登录
  async logout ({ dispatch }) {
    localStorage.clear()
    await dispatch('resetAccessToken')
    await resetRouter()

  },
  resetAccessToken ({ commit }) {
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default { state, getters, mutations, actions }
