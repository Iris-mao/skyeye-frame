import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isCollapse: false
    },
    mutations: {
        TOGGLE_SIDEBAR_COLLAPSE(state) {
            state.isCollapse = !state.isCollapse
        }
    },
    actions: {}
})
