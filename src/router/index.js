import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {path: '/detail', component: _import('order/detail'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/index')
    }]
  },
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/article',
    name: '功能模块',
    meta: {title: '辅助功能', icon: 'tree'},
    children: [
      {
        path: 'article',
        name: '公告',
        component: _import('article/article'),
        meta: {title: '公告', icon: 'table'},
        menu: 'article'
      },
      {
        path: 'sysconfig',
        name: '系统参数管理',
        component: _import('sysconfig/sysconfig'),
        meta: {title: '系统参数管理', icon: 'table'},
        menu: 'sysconfig'
      },

    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    name: '用户及权限',
    meta: {title: '用户及权限', icon: 'tree'},
    children: [
      {
        path: '',
        name: '用户列表',
        component: _import('user/user'),
        meta: {title: '用户列表', icon: 'table'},
        menu: 'user'
      },
      {
        path: 'role',
        name: '权限管理',
        component: _import('user/role'),
        meta: {title: '权限管理', icon: 'table'},
        menu: 'role'
      },
      {
        path: 'member',
        name: '会员列表',
        component: _import('user/member'),
        meta: {title: '会员列表', icon: 'table'},
        menu: 'member'
      },
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/order',
    name: '订单及库存',
    meta: {title: '订单及库存', icon: 'tree'},
    children: [
      {
        path: 'order',
        name: '订单列表',
        component: _import('order/order'),
        meta: {title: '订单列表', icon: 'table'},
        menu: 'order'
      },
      {
        path: 'sale',
        name: '销售详情',
        component: _import('order/sale'),
        meta: {title: '销售详情', icon: 'table'},
        menu: 'sale'
      },
      {
        path: 'goods',
        name: '商品信息管理',
        component: _import('goods/goods'),
        meta: {title: '商品信息管理', icon: 'table'},
        menu: 'goods'
      },
    ]
  },
  {
    path: '/safe',
    component: Layout,
    redirect: '/safe/actionLog',
    name: '安全审计',
    meta: {title: '安全审计', icon: 'tree'},
    children: [
      {
        path: 'actionLog',
        name: '操作日志',
        component: _import('safe/actionLog'),
        meta: {title: '系统操作日志', icon: 'table'},
        menu: 'actionLog'
      },
      {
        path: 'loginLog',
        name: '访问日志',
        component: _import('safe/loginLog'),
        meta: {title: '系统访问日志', icon: 'table'},
        menu: 'loginLog'
      },
    ]
  },
  {
    path: '/org',
    component: Layout,
    redirect: '/org/org',
    name: '连锁店',
    meta: {title: '连锁店', icon: 'tree'},
    children: [
      {
        path: 'org',
        name: '操作日志',
        component: _import('org/org'),
        meta: {title: '连锁店信息', icon: 'table'},
        menu: 'org'
      },
    ]
  },
  {path: '*', redirect: '/404', hidden: true}

]
