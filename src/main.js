import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import velocity from 'velocity-animate'
import './plugins/element.js'
import './plugins/echarts.js'
import { getUrlKey } from './common'

import toExcel from './excel/jsonExcel'
Vue.prototype.$toExcel = toExcel

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$velocity = velocity

Vue.prototype.vm = Vue.prototype

const id = getUrlKey('id')
const token = getUrlKey('token')
if (id) {
    sessionStorage.setItem('id', id)
}
if (token) {
    sessionStorage.setItem('token', token)
}

Vue.prototype.$http.interceptors.request.use((config) => {
    const id = sessionStorage.getItem('id')
    const token = sessionStorage.getItem('token')
    if (id && token) {
    // config.headers.Authorization = `Bearer ${token};${window.btoa(id)}`;
        config.headers.token = `${token};${window.btoa(id)}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
