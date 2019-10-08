import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const defaultPath = '' + '/record'

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '',
            beforeEnter(from, to, next) {
                next(defaultPath)
            }
        },
        {
            path: '/',
            name: 'layout',
            component: resolve => require(['./views/Layout.vue'], resolve),
            children: [
                {
                    path: '/record',
                    component: resolve =>
                        require(['./views/Record.vue'], resolve)
                },
                {
                    path: '/general',
                    component: resolve =>
                        require(['./views/General.vue'], resolve)
                }
            ]
        }
    ]
})
