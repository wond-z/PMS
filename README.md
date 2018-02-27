# PMS 产品管理系统
Production Management System

## 安装

```bush
npm install
or
cnpm install(recommend)
```

## 运行
### 开发运行
```bush
npm run dev
```
### 产品创建
```bush
npm run build
```

## 项目说明
项目基于 vue+iview 开发

## 功能模块

- 登录/登出
- 栏目列表
    - 基础数据
        - 物品设置
            - 产品设置
        - 部门单位设置
        - 其它设置
    - 物料中心
        - 原料管理
- 收缩侧边栏
- tag标签导航
- 全屏/退出全屏
- 个人中心

## 文件结构
```shell
.
├── access  权限管理
├── advanced-router
│   └── component
├── app  栏目列表
│   ├── base-data  基本数据
│   │   ├── deptm-set  部门设置
│   │   ├── goods-set  物品设置
│   │   └── other-set  其它设置
│   └── material-center  物料中心
│       └── record-mgmt  原料管理
├── demo  案例展示
├── error_page
├── form
│   ├── article-publish
│   └── work-flow
├── home
│   ├── components
│   │   └── styles
│   └── map-data
├── international
├── main_components
├── message
├── my_components
│   ├── area-linkage
│   │   ├── components
│   │   └── util
│   ├── count-to
│   ├── draggable-list
│   ├── file-upload
│   ├── image-editor
│   ├── markdown-editor
│   └── text-editor
├── own-space
├── screen-shorts
└── tables
    ├── components
    └── data
```
