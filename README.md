# 游戏门户后台管理系统（admin-management-system）

一个基于 **React 18 + Ant Design + Express + MySQL** 的前后端分离游戏资讯门户项目，包含前台展示页面和后台管理系统。

---

## 功能一览

### 前台（用户访问）
- 游戏轮播 / 热门推荐 / 关注列表
- 游戏导航分类（客户端游戏、手机游戏、游戏平台）
- 图片内容浏览

### 后台（管理员访问）
- 管理员登录（JWT）
- 图片内容管理（审核、增删改）
- 游戏导航管理（分类、链接、审核）
- 管理员账号管理
- 操作日志 / 审核日志

---

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18、React Router 6、Ant Design 5、Ant Design Pro Components |
| 后端 | Node.js、Express 5、multer（文件上传）、jsonwebtoken |
| 数据库 | MySQL 8.x（mysql2 驱动） |
| 构建 | Create React App（react-scripts） |

---

## 项目结构

```
wmei/
├── public/                     # 前端静态资源（图片、图标）
├── src/
│   ├── home/                   # 前台页面
│   │   ├── popular/            # 热门推荐
│   │   ├── following/          # 关注列表
│   │   ├── middle/             # 轮播
│   │   └── header/             # 头部导航（GameMenu）
│   ├── features/Backend/       # 后台管理页面
│   │   ├── login/              # 登录
│   │   ├── middlebackend/     # 图片管理
│   │   ├── gameNavTable/       # 游戏导航管理
│   │   ├── AdminUserManage/    # 管理员账号
│   │   └── AdminLog/           # 日志
│   ├── services/
│   │   └── photo-server/        # Express 后端服务
│   │       ├── server.js        # 入口
│   │       ├── db.js            # MySQL 连接池
│   │       ├── routes/          # 路由（login / photo / gameNav / adminUser / adminLog）
│   │       └── uploads/        # 上传的图片
│   ├── App.js
│   └── index.js
├── admin-management-system/
│   └── sql/
│       └── photo_db_init.sql    # 数据库初始化脚本
├── package.json
└── .gitignore
```

---

## 环境要求

- **Node.js** ≥ 16（推荐 18 LTS）
- **MySQL** ≥ 5.7（推荐 8.x）
- **npm** ≥ 8

---

## 快速启动

### 第 1 步：初始化数据库

确保 MySQL 服务已启动（默认端口 3306），然后在项目根目录执行：

```bash
# 一行命令直接导入（会提示输入 MySQL root 密码）
mysql -u root -p < admin-management-system/sql/photo_db_init.sql
```

或者先登录再执行：

```bash
mysql -u root -p
```

```sql
SOURCE 项目路径/admin-management-system/sql/photo_db_init.sql;
```

执行完成后会自动创建数据库 `photo_db`、6 张表，并写入初始数据（管理员账号、示例图片、游戏导航等）。

> 如果你本机 MySQL 的 root 密码不是 `123456`，需要修改 `src/services/photo-server/db.js` 里的 `password` 字段。

### 第 2 步：启动后端

```bash
# 进入后端目录
cd src/services/photo-server

# 安装依赖（首次运行需要）
npm install

# 启动服务
node server.js
```

看到下面这行就说明后端启动成功：

```
后端服务启动：http://localhost:3000
```

### 第 3 步：启动前端

**新开一个终端**，回到项目根目录：

```bash
cd 项目根目录

# 安装依赖（首次运行需要）
npm install

# 启动前端
npm start
```

前端默认会在 **3001** 端口启动（因为 3000 已被后端占用），浏览器自动打开：

```
http://localhost:3001
```

---

## 默认账号

导入 SQL 后，系统内置了 3 个管理员账号：

| 用户名 | 密码 | 角色 | 说明 |
|---|---|---|---|
| `admin` | `123456` | 超级管理员 | 权限最全 |
| `admin1` | `123456` | 普通用户 | 测试用 |
| `321` | `321` | 管理员 | 测试用 |

后台管理入口：登录 `http://localhost:3001` 后进入。

---

## 数据库表说明

| 表名 | 说明 |
|---|---|
| `admin_user` | 管理员账号 |
| `admin_log` | 后台操作日志 |
| `audit_log` | 审核日志 |
| `game_nav` | 已发布的游戏导航 |
| `game_nav_apply` | 游戏导航申请（待审核） |
| `photo_info` | 图片内容（前台展示） |

---

## 常见问题

**1. 前端打开是白屏 / 报 `Element type is invalid`**
- 关掉前端终端重新 `npm start`
- 确认后端（3000 端口）已经在跑

**2. 页面能打开但图片 / 列表是空的**
- 按 F12 看 Network，确认请求 `http://localhost:3000/api/...` 是否返回 200
- 如果请求失败，检查 MySQL 是否启动、`photo_db` 库是否已导入

**3. 端口被占用**
- 后端默认 3000，前端检测到 3000 被占会自动用 3001
- 如果 3000 被别的程序占了，先关掉那个程序，或者修改 `src/services/photo-server/server.js` 里的 `port`

**4. 上传的图片在哪**
- 存在 `src/services/photo-server/uploads/` 目录
- 通过 `http://localhost:3000/uploads/文件名` 访问

---

## 部署说明

本项目当前为本地开发配置。若要部署到服务器：

1. 前端执行 `npm run build`，把 `build/` 目录丢到 Nginx / Vercel / Netlify
2. 后端用 PM2 常驻：`pm2 start server.js`
3. 前端 API 地址需要从 `http://localhost:3000` 改为后端公网地址
4. MySQL 建议使用云数据库或服务器本地 MySQL

---

## License

ISC
