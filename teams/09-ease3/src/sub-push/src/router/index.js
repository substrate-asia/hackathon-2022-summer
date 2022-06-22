import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
    path: '/',
    name: 'Layout',
    redirect: { name: 'moonPush' },
    component: () =>
        import ('@/views/Layout'),
    children: [{
        path: 'subPush',
        name: 'moonPush',
        redirect: { name: 'moonPushHome' },
        component: () =>
            import ('@/views/moonPush'),
        children: [{
            path: 'home',
            name: 'moonPushHome',
            component: () =>
                import ('@/views/moonPush/home')
        }, {
            path: 'menu',
            name: 'moonPushMenu',
            component: () =>
                import ('@/views/moonPush/menu')
        }, {
            path: 'edit',
            name: 'moonPushEdit',
            component: () =>
                import ('@/views/moonPush/edit')
        }, {
            path: 'myMonitor',
            name: 'moonPushMyMonitor',
            component: () =>
                import ('@/views/moonPush/myMonitor')
        }]
    }],
}, ]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router