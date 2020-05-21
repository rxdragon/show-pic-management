# cloud-picture-centring

## 项目起始
```
yarn install
```

### 开启服务
```
yarn serve // 预发环境
yarn serve-release // release环境
```

### 构建项目
```
yarn build // 打包vue文件
```

### eslint
```
yarn run lint
```

### stylelint
```
yarn run stylelint
```

### commitlint
```
yarn run cz
```

### 项目结构

```
├── CHANGELOG.md
├── README.md
├── babel.config.js
├── commitlint.config.js
├── package.json
├── public
│   ├── demo.json
│   ├── favicon.ico
│   ├── index.html
│   ├── loader.css
│   ├── login.html
│   ├── login.js
│   └── logo.png
├── src
│   ├── App.vue
│   ├── api
│   │   ├── clients.js                  // 修修兽用户相关接口
│   │   ├── invoice.js                  // 发票相关接口
│   │   ├── order.js                    // 订单相关接口
│   │   └── user.js                     // 用户相关接口
│   ├── assets
│   │   ├── 401_images
│   │   ├── 404_images
│   │   ├── images
│   │   ├── logo.png
│   │   └── styles
│   │       ├── font.less               // 字体样式
│   │       ├── index.less              // 入口样式
│   │       ├── lessmap.less            // 雪碧图样式
│   │       ├── nprogress.less          // 进度条样式
│   │       ├── sidebar.less            // 边框样式
│   │       ├── themeClass.less         // 主题样式
│   │       ├── transition.less         // 动画样式
│   │       └── variables.less          // 变量样式
│   ├── components
│   │   ├── Breadcrumb                  // 面包屑组件
│   │   ├── DatePicker                  // 日期组件
│   │   ├── ImageView                   // 预览组件
│   │   ├── NoData                      // 没有数据组件
│   │   ├── OrderInfo                   // 订单信息组件
│   │   ├── OrderRequire                // 订单要求组件
│   │   ├── PhotoBox                    // 照片组件
│   │   ├── PhotoVersion                // 照片版本组件
│   │   └── SelectBox
│   │       ├── AccountSourceSelect     // 用户来源选择框
│   │       ├── InvoiceStateSelect      // 发票状态组件
│   │       ├── OrderSourceSelect       // 订单来源组件
│   │       └── OrderStateSelect        // 订单状态组件
│   ├── directive
│   │   ├── clipboard                   // 剪切板指令
│   │   ├── index.js                    // 入口文件
│   │   ├── limit-decimal               // 输入小数指令
│   │   ├── limit-length                // 限制长度指令
│   │   ├── limit-num                   // 只能输入数字指令
│   │   └── no-special-char             // 没有特殊符号指令
│   ├── filters
│   │   └── index.js                    // 过滤函数
│   ├── guards.js                       // 路由守护
│   ├── layout                          // 布局模块
│   │   ├── components
│   │   │   ├── AppMain.vue             // 主文件
│   │   │   ├── Sidebar                 // 菜单栏组件
│   │   │   ├── UserTab.vue             // 用户组件
│   │   └── index.vue                   // 布局组件
│   ├── main.js                         // 入口文件
│   ├── model
│   │   ├── Enumerate.js                // 枚举值
│   │   ├── InvoiceModel.js             // 发票数据模型
│   │   ├── OrderModel.js               // 订单数据模型
│   │   ├── PhotoModel.js               // 照片数据模型
│   │   ├── StreamModel.js              // 流水模型
│   │   └── UserModel.js                // 用户信息
│   ├── plugins
│   │   ├── axios.js
│   │   ├── element.js
│   │   ├── errorCode.js                // 接口错误码
│   │   ├── icon-font
│   │   └── individuation-element-ui
│   │       ├── elementChangeUi.less    // element ui
│   │       ├── fonts
│   │       │   ├── element-icons.ttf
│   │       │   └── element-icons.woff
│   │       └── index.css
│   ├── router
│   │   ├── index.js
│   │   └── modules
│   │       ├── financeCenter.js        // 财务模块路由
│   │       ├── orderManagement.js      // 订单模块路由
│   │       └── userManagement.js       // 用户管理模块
│   ├── store
│   │   ├── getters.js                  // 数据状态获取
│   │   ├── index.js
│   │   └── modules
│   │       ├── permission.js           // 权限管理
│   │       ├── setting.js              // 设置
│   │       └── userStore.js            // 用户模块数据
│   ├── utils
│   │   ├── DownPhoto.js                // 下载照片工具
│   │   ├── exportExcelUtil.js          // 导出表格工具
│   │   ├── getPageTitle.js             // 获取标题工具
│   │   ├── index.js                    // 基本工具
│   │   ├── jszip.js                    // js打包工具
│   │   ├── message.js                  // element封装信息
│   │   ├── sessionTool.js              // 缓存工具
│   │   ├── timeUtil.js                 // 时间相关工具
│   │   ├── validate.js                 // 验证工具 element-form表单使用
│   │   ├── validator.js                // 验证工具
│   │   └── zip-stream.js               // zip流下载工具
│   └── views
│       ├── error-page
│       ├── finance-center
│       │   ├── components
│       │   │   └── InvoiceInfo.vue     // 发票信息模块
│       │   ├── finance-index.vue       // 财务模块
│       │   ├── invoice-center.vue      // 发票管理模块
│       │   ├── invoice-issue.vue       // 开票模块
│       │   └── invoiceMock.js          // 发票模块-方便测试
│       ├── home
│       │   └── home.vue                // 首页组件
│       ├── login
│       │   └── login.vue               // 登录组件
│       ├── order-management
│       │   ├── order-detail.vue        // 订单详情组件
│       │   └── order-management.vue    // 订单管理组件
│       ├── redirect
│       │   └── index.vue               // 刷新组件
│       └── user-management
│           ├── components
│           │   └── UserInfo.vue        // 用户信息组件
│           ├── user-detail.vue         // 用户详情模块
│           └── user-management.vue     // 用户管理模块
├── vue.config.js
├── yarn-error.log
└── yarn.lock
```

日期|版本号|描述|开发人员|链接
:--:|:--:|:--:|:--:|:--:|
2020-05-21 |1.2.0|发票管理|崔佛|[prd](https://lanhuapp.com/web/#/item/project/product?pid=8bc3ebd2-b2a7-498b-b320-b10034d3f0f1&docId=320c77f3-08bd-4ab0-a467-f850414de26b&docType=axure&pageId=fe26e5f841764cb2bd03cd2eb2f9d1eb&image_id=320c77f3-08bd-4ab0-a467-f850414de26b&parentId=814ba23a-a2e6-492e-84d8-04001d414cf5)
[设计稿](https://lanhuapp.com/web/#/item/project/board?pid=336a1138-5cf3-4a8a-b98e-c2afd15ecea9)
2020-05-21 |1.0.0|订单管理，用户管理|崔佛|[prd](https://lanhuapp.com/web/#/item/project/product?pid=8bc3ebd2-b2a7-498b-b320-b10034d3f0f1&docId=0f1a5bb6-94c9-4a04-a368-85e7795e12e4&docType=axure&pageId=61a13da19fc345d58774b01cf25fcf99&image_id=0f1a5bb6-94c9-4a04-a368-85e7795e12e4&parentId=afa1b7da-2a85-4ea2-872a-016c17909ac6)[设计稿](https://lanhuapp.com/web/#/item/project/board?pid=336a1138-5cf3-4a8a-b98e-c2afd15ecea9)