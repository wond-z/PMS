import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['./views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['./views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['./views/main_components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },
        { path: 'order/:order_id', title: '订单详情', name: 'order_info', component: resolve => { require(['./views/advanced-router/component/order-info.vue'], resolve); } },  // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['./views/advanced-router/component/shopping-info.vue'], resolve); } },  // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['./views/message/message.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        give: '基础数据',
        path: '/goods_set',
        icon: 'ios-color-filter',
        title: '物品设置',
        name: 'goods_set',
        component: Main,
        children: [
            { path: 'material_set', icon: 'soup-can', title: '原辅料设置', name: 'material_set', component: resolve => { require(['./views/app/base-data/goods-set/material-set.vue'], resolve); } },
            { path: 'prod_set', icon: 'android-funnel', title: '产品设置', name: 'prod_set', component: resolve => { require(['./views/app/base-data/goods-set/prod-set.vue'], resolve); } }
        ]
    },
    {
        give: '基础数据',
        path: '/deptm_set',
        icon: 'ios-color-filter-outline',
        title: '部门单位设置',
        name: 'deptm_set',
        component: Main,
        children: [
            { path: 'index', icon: '', title: '部门单位设置', name: 'deptm_index', component: resolve => { require(['./views/app/base-data/deptm-set/deptm-set.vue'], resolve); } }
        ]
    },
    {
        give: '基础数据',
        path: '/other_set',
        icon: 'android-more-horizontal',
        title: '其它设置',
        name: 'other_set',
        component: Main,
        children: [
            { path: 'index', icon: '', title: '其它设置', name: 'other_index', component: resolve => { require(['./views/app/base-data/other-set/other-set.vue'], resolve); } }
        ]
    },
    {
        give: '物料中心',
        path: '/material_prod_mgmt',
        icon: 'steam',
        title: '产品管理',
        name: 'material_prod_mgmt',
        component: Main,
        children: [
            { path: 'prod_storage_mgmt', icon: 'key', title: '产品入库判定结果', name: 'prod_storage_mgmt', component: resolve => { require(['./views/app/material-center/prod-mgmt/prod-storage-mgmt.vue'], resolve); } },
            { path: 'material_output_note_mgmt', icon: 'clipboard', title: '产品出库单管理', name: 'material_output_note_mgmt', component: resolve => { require(['./views/app/material-center/prod-mgmt/output-note-mgmt.vue'], resolve); } },
            { path: 'prod_stock_stat', icon: 'stats-bars', title: '产品库存统计', name: 'prod_stock_stat', component: resolve => { require(['./views/app/material-center/prod-mgmt/prod-stock-stat.vue'], resolve); } },
            { path: 'car_set', icon: 'closed-captioning', title: '运输车号设置', name: 'car_set', component: resolve => { require(['./views/app/material-center/prod-mgmt/car-set.vue'], resolve); } },
            { path: 'prod_in_put_ledger', icon: 'calendar', title: '产品入出库台账', name: 'prod_in_put_ledger', component: resolve => { require(['./views/app/material-center/prod-mgmt/prod-in-put-ledger.vue'], resolve); } },
            { path: 'prod_storage_rcw_mgmt', icon: 'fireball', title: '产品入库冲红管理', name: 'prod_storage_rcw_mgmt', component: resolve => { require(['./views/app/material-center/prod-mgmt/prod-storage-rcw-mgmt.vue'], resolve); } },
            { path: 'prod_receive_send_stat', icon: 'arrow-graph-up-right', title: '产品收发存统计', name: 'prod_receive_send_stat', component: resolve => { require(['./views/app/material-center/prod-mgmt/prod-receive-send-stat.vue'], resolve); } },
            { path: 'storage_detail_collect', icon: 'shuffle', title: '入库明细汇总', name: 'storage_detail_collect', component: resolve => { require(['./views/app/material-center/prod-mgmt/storage-detail-collect.vue'], resolve); } },
            { path: 'storage_detail', icon: 'log-in', title: '入库明细', name: 'storage_detail', component: resolve => { require(['./views/app/material-center/prod-mgmt/storage-detail.vue'], resolve); } },
            { path: 'deliver_detail', icon: 'log-out', title: '发货明细', name: 'deliver_detail', component: resolve => { require(['./views/app/material-center/prod-mgmt/deliver-detail.vue'], resolve); } },
            { path: 'deliver_supply_detail', icon: 'reply-all', title: '发(供)货明细', name: 'deliver_supply_detail', component: resolve => { require(['./views/app/material-center/prod-mgmt/deliver-supply-detail.vue'], resolve); } }

        ]
    },
    {
        give: '物料中心',
        path: '/material_center',
        icon: 'gear-a',
        title: '原料管理',
        name: 'material_mgmt',
        component: Main,
        children: [
            { path: 'receive_record_mgmt', icon: 'forward', title: '原料到货记录管理', name: 'receive_record_mgmt', component: resolve => { require(['./views/app/material-center/material-mgmt/record-mgmt.vue'], resolve); } },
            { path: 'deliver_record_mgmt', icon: 'share', title: '原料发货记录管理', name: 'deliver_record_mgmt', component: resolve => { require(['./views/app/material-center/material-mgmt/deliver-mgmt.vue'], resolve); } },
            { path: 'store_record_mgmt', icon: 'arrow-swap', title: '原料入出库管理', name: 'store_record_mgmt', component: resolve => { require(['./views/app/material-center/material-mgmt/store-mgmt.vue'], resolve); } },
            { path: 'receive_send_store_stat', icon: 'arrow-graph-up-right', title: '原料收发存统计', name: 'receive_send_store_stat', component: resolve => { require(['./views/app/material-center/material-mgmt/receive-send-stat.vue'], resolve); } },
            { path: 'material_stock_search', icon: 'search', title: '原料库存查询', name: 'material_stock_search', component: resolve => { require(['./views/app/material-center/material-mgmt/material-stock-search.vue'], resolve); } },
            { path: 'dissent_material', icon: 'ios-settings-strong', title: '异议原料处理', name: 'dissent_material', component: resolve => { require(['./views/app/material-center/material-mgmt/dissent-material.vue'], resolve); } },
            { path: 'dissent_tub_material', icon: 'ios-pie-outline', title: '异议油管原料汇总', name: 'dissent_tub_material', component: resolve => { require(['./views/app/material-center/material-mgmt/dissent-tub-collect.vue'], resolve); } },
            { path: 'material_month_set', icon: 'calendar', title: '原料库存月设置', name: 'material_month_set', component: resolve => { require(['./views/app/material-center/material-mgmt/material-month-set.vue'], resolve); } }
        ]
    },
    {
        give: '物料中心',
        path: '/material_center',
        icon: 'fork-repo',
        title: '材料管理',
        name: 'stuff_mgmt',
        component: Main,
        children: [
            { path: 'stuff_variety_mgmt', icon: 'levels', title: '物料品种管理', name: 'stuff_variety_mgmt', component: resolve => { require(['./views/app/material-center/stuff-mgmt/stuff-variety-mgmt.vue'], resolve); } },
            { path: 'stuff_record_mgmt', icon: 'share', title: '材料到货登记管理', name: 'stuff_record_mgmt', component: resolve => { require(['./views/app/material-center/stuff-mgmt/stuff-record-mgmt.vue'], resolve); } },
            { path: 'stuff_stock_month_set', icon: 'calendar', title: '材料库存月设置', name: 'stuff_stock_month_set', component: resolve => { require(['./views/app/material-center/stuff-mgmt/stuff-stock-month-set.vue'], resolve); } },
            { path: 'stuff_in_put_mgmt', icon: 'arrow-swap', title: '材料入出库管理', name: 'stuff_in_put_mgmt', component: resolve => { require(['./views/app/material-center/stuff-mgmt/stuff-in-put-mgmt.vue'], resolve); } },
            { path: 'stuff_deliver_mgmt', icon: 'forward', title: '材料发货记录管理', name: 'stuff_deliver_mgmt', component: resolve => { require(['./views/app/material-center/stuff-mgmt/stuff-deliver-mgmt.vue'], resolve); } }
        ]
    },
    {
        give: '分厂管理',
        path: '/factory_mgmt',
        icon: 'social-buffer',
        title: '一分厂',
        name: 'first_factory',
        component: Main,
        children: [
            { path: 'storage_notice_mgmt', icon: 'android-clipboard', title: '入库通知书管理', name: 'storage_notice_mgmt', component: resolve => { require(['./views/app/factory-set/first-factory/storage-notice-mgmt.vue'], resolve); } },
            { path: 'daily_data_mgmt', icon: 'android-list', title: '日进度数据管理', name: 'daily_data_mgmt', component: resolve => { require(['./views/app/factory-set/first-factory/daily-data-mgmt.vue'], resolve); } },
            { path: 'prod_month_set', icon: 'ios-gear-outline', title: '生产月设置', name: 'prod_month_set', component: resolve => { require(['./views/app/factory-set/first-factory/prod-month-set.vue'], resolve); } },
            { path: 'daily_report_table', icon: 'android-sunny', title: '分厂日报表', name: 'daily_report_table', component: resolve => { require(['./views/app/factory-set/first-factory/daily-report-table.vue'], resolve); } },
            { path: 'lunar_report_table', icon: 'calendar', title: '分厂月报表', name: 'monthly_report_table', component: resolve => { require(['./views/app/factory-set/first-factory/monthly-report-table.vue'], resolve); } }
        ]
    },
    {
        give: '技术质量',
        path: '/oiltube_material_mgmt',
        icon: 'beaker',
        title: '油管原料管理',
        name: 'oil_material_mgmt',
        component: Main,
        children: [
            { path: 'oiltube-decide-mgmt', icon: '', title: '油管判定管理', name: 'oiltube_decide_mgmt', component: resolve => { require(['./views/app/technical-quality/oiltube-material-mgmt/oiltube-decide-mgmt.vue'], resolve); } }
            // { path: 'waste_notice', icon: '', title: '废品通知书', name: 'waste_notice' }
        ]
    },
    {
        give: '技术质量',
        path: '/drivepipe_material_mgmt',
        icon: 'ios-pulse-strong',
        title: '套管原料管理',
        name: 'drivepipe_material_mgmt',
        component: Main,
        children: [
            { path: 'drivepipe_decide_mgmt', icon: '', title: '套管判定管理', name: 'drivepipe_decide_mgmt', component: resolve => { require(['./views/app/technical-quality/drivepipe-material-mgmt/drivepipe-decide-mgmt.vue'], resolve); } }
        ]
    },
    {
        give: '技术质量',
        path: '/coupling_mgmt',
        icon: 'ios-cog',
        title: '接箍管理',
        name: 'coupling_mgmt',
        component: Main,
        children: [
            { path: 'outsourcing_coupling', icon: '', title: '外购接箍', name: 'outsourcing_coupling', component: resolve => { require(['./views/app/technical-quality/coupling-mgmt/outsourcing_coupling.vue'], resolve); } }
        ]
    },
    {
        give: '技术质量',
        path: '/prod_mgmt',
        icon: 'gear-a',
        title: '产品管理',
        name: 'prod_mgmt',
        component: Main,
        children: [
            { path: 'storage_decide_mgmt', icon: 'log-in', title: '入库判定管理', name: 'storage_decide_mgmt', component: resolve => { require(['./views/app/technical-quality/prod-mgmt/storage-decide-mgmt.vue'], resolve); } },
            { path: 'output_decide_mgmt', icon: 'log-out', title: '出库判定管理', name: 'output_decide_mgmt', component: resolve => { require(['./views/app/material-center/prod-mgmt/output-note-mgmt.vue'], resolve); } },
            { path: 'chemistry_param_mgmt', icon: 'magnet', title: '理化参数管理', name: 'chemistry_param_mgmt', component: resolve => { require(['./views/app/technical-quality/prod-mgmt/chemistry-param-mgmt.vue'], resolve); } },
            { path: 'arrival_furnace_search', icon: 'search', title: '到货炉号查询', name: 'arrival_furnace_search', component: resolve => { require(['./views/app/technical-quality/prod-mgmt/arrival-furnace-search.vue'], resolve); } },
            { path: 'quality_report_mgmt', icon: 'clipboard', title: '质保书管理', name: 'quality_report_mgmt', component: resolve => { require(['./views/app/technical-quality/prod-mgmt/quality-report-mgmt.vue'], resolve); } },
            { path: 'storage_rcw_decide_mgmt', icon: 'log-in', title: '产品入库冲红判定', name: 'storage_rcw_decide_mgmt', component: resolve => { require(['./views/app/technical-quality/prod-mgmt/storage-rcw-decide-mgmt.vue'], resolve); } }
        ]
    },
    {
        give: '销售管理',
        path: '/client_mgmt',
        icon: 'android-person',
        title: '客户管理',
        name: 'client_mgmt',
        component: Main,
        children: [
            { path: 'index', icon: '', title: '客户管理', name: 'customer_mgmt', component: resolve => { require(['./views/app/sales-mgmt/client-mgmt/customer-mgmt.vue'], resolve); } }
        ]
    },
    {
        give: '销售管理',
        path: '/compact_mgmt',
        icon: 'document-text',
        title: '合同管理',
        name: 'compact_mgmt',
        component: Main,
        children: [
            { path: 'index', icon: '', title: '合同管理', name: 'contract_mgmt', component: resolve => { require(['./views/app/sales-mgmt/compact-mgmt/contract-mgmt.vue'], resolve); } }
        ]
    },
    {
        give: '销售管理',
        path: '/prod-truck',
        icon: 'ios-list-outline',
        title: '产品装车单',
        name: 'prod-truck',
        component: Main,
        children: [
            { path: 'prod_truck_bill', icon: 'ios-list', title: '产品装车单', name: 'prod_truck_bill', component: resolve => { require(['./views/app/sales-mgmt/prod-truck/prod-truck-bill.vue'], resolve); } },
            { path: 'sales_output_note_mgmt', icon: 'ios-upload-outline', title: '产品出库单管理', name: 'sales_output_note_mgmt', component: resolve => { require(['./views/app/material-center/prod-mgmt/output-note-mgmt.vue'], resolve); } },
            { path: 'sales_receive_send_stat', icon: 'ios-upload', title: '产品收发存统计', name: 'sales_receive_send_stat', component: resolve => { require(['./views/app/sales-mgmt/prod-truck/sales-receive-send-stat.vue'], resolve); } }
        ]
    },
    {
        give: '设备机动',
        path: '/mechanical_equipment',
        icon: 'android-bulb',
        title: '设备管理',
        name: 'equipment_mgmt',
        component: Main,
        children: [
            { path: 'repairs_purchase_plan_mgmt', icon: 'ios-nutrition', title: '备件采购计划管理', name: 'repairs_purchase_plan_mgmt', component: resolve => { require(['./views/app/mechanical-equipment/equipment-mgmt/repairs-purchase-plan-mgmt.vue'], resolve); } },
            { path: 'repairs_purchase_approve_collect', icon: 'aperture', title: '备件批准汇总管理', name: 'repairs_purchase_approve_collect', component: resolve => { require(['./views/app/mechanical-equipment/equipment-mgmt/repairs-purchase-approve-collect.vue'], resolve); } }
        ]
    },
    {
        give: '系统管理',
        path: '/system',
        icon: 'wrench',
        title: '部门管理',
        name: 'deptm_mgmt',
        component: Main,
        children: [
            { path: 'deptm_mgmt_index', icon: '', title: '部门管理', name: 'deptm_mgmt_index', component: resolve => { require(['./views/app/system/deptm-mgmt/deptm-mgmt.vue'], resolve); } }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
