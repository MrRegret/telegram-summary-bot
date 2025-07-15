# Pexels Video Wallpaper Widget

一个基于 Forward Widget 开发规范的高质量视频壁纸组件，支持随机获取和搜索 Pexels 优质视频内容。

## ✨ 功能特性

### 核心功能
- 🎥 **随机视频获取**: 从 Pexels 获取高质量随机视频
- 🔍 **智能搜索**: 支持关键词搜索特定主题视频
- 🔑 **API 密钥管理**: 安全的 API 密钥存储和管理
- ⚙️ **丰富设置**: 视频质量、自动刷新、刷新间隔等可配置选项

### 用户体验
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🎨 **现代 UI**: 采用 Glassmorphism 设计风格
- 🌙 **深色模式**: 支持深色主题
- ⌨️ **快捷键**: 空格键播放/暂停等便捷操作

### 视频控制
- ▶️ **完整播放控制**: 播放/暂停、静音、全屏
- 📥 **视频下载**: 支持直接下载当前视频
- 🔄 **自动刷新**: 可配置的自动视频更新
- 🎛️ **质量选择**: 标清/高清/超高清三种质量选项

## 🚀 快速开始

### 1. 获取 Pexels API 密钥

1. 访问 [Pexels API](https://www.pexels.com/api/)
2. 创建免费账户并获取 API 密钥
3. 在 widget 中输入您的 API 密钥

### 2. 部署 Widget

#### 方法一：直接使用
```bash
# 克隆或下载文件到本地
# 在支持 Forward Widget 的环境中加载 widget.json
```

#### 方法二：本地测试
```bash
# 启动本地服务器
python3 -m http.server 8000

# 在浏览器中访问
http://localhost:8000
```

### 3. 配置 Widget

1. **首次启动**: 输入您的 Pexels API 密钥
2. **基础设置**: 点击设置按钮配置自动刷新、视频质量等
3. **开始使用**: 点击刷新按钮获取随机视频，或使用搜索功能

## 📁 文件结构

```
pexels-video-wallpaper/
├── widget.json          # Widget 配置文件
├── index.html           # 主入口文件
├── script.js            # 核心 JavaScript 逻辑
├── style.css            # 样式文件
├── icon.svg             # Widget 图标
├── preview.svg          # 预览图
├── research_findings.md # 开发研究报告
└── README.md            # 说明文档
```

## ⚙️ 配置选项

### widget.json 设置
- `apiKey`: Pexels API 密钥（必需）
- `autoRefresh`: 是否启用自动刷新（默认：true）
- `refreshInterval`: 刷新间隔，分钟（默认：5）
- `videoQuality`: 视频质量（sd/hd/uhd，默认：hd）

### 本地存储
Widget 使用 localStorage 保存用户设置：
- API 密钥
- 用户偏好设置
- 播放历史

## 🎛️ 使用说明

### 基本操作
- **获取新视频**: 点击刷新按钮或等待自动刷新
- **搜索视频**: 在搜索框输入关键词，按回车或点击搜索
- **清空搜索**: 点击"清空"按钮返回随机模式
- **播放控制**: 使用底部控制栏或空格键

### 快捷键
- `空格键`: 播放/暂停
- `Enter`: 在搜索框中执行搜索

### 视频质量说明
- **标清 (SD)**: 较小文件，加载快速
- **高清 (HD)**: 平衡质量与加载速度（推荐）
- **超高清 (UHD)**: 最高质量，需要良好网络

## 🔧 技术实现

### 技术栈
- **前端**: HTML5, CSS3, ES6+ JavaScript
- **API**: Pexels Video API
- **设计**: Glassmorphism, 响应式布局
- **存储**: localStorage
- **模块化**: ES6 Class 组件架构

### 核心类
```javascript
class PexelsVideoWidget {
    // 初始化和配置管理
    // API 集成和错误处理
    // 用户界面交互
    // 设置和存储管理
}
```

### API 集成
- 支持随机视频获取和关键词搜索
- 错误处理和重试机制
- 请求频率控制
- 多种视频格式支持

## 🐛 常见问题

### Q: API 密钥无效
**A**: 确保从 Pexels 官网获取的密钥正确，检查网络连接

### Q: 视频加载失败
**A**: 检查网络连接，尝试降低视频质量设置

### Q: 搜索无结果
**A**: 尝试使用英文关键词，或更换搜索词

### Q: 自动刷新不工作
**A**: 检查设置中是否启用自动刷新，确认间隔时间设置

## 📝 开发说明

### Forward Widget 规范兼容
本 widget 严格遵循 Forward Widget 开发规范：
- 标准的 widget.json 配置格式
- 模块化的文件组织结构  
- 统一的错误处理机制
- 国际化支持

### 扩展开发
如需扩展功能，可以：
1. 修改 `widget.json` 添加新的配置项
2. 在 `script.js` 中扩展 `PexelsVideoWidget` 类
3. 更新 `style.css` 适配新的 UI 元素
4. 保持与 Forward Widget API 的兼容性

## 📄 许可证

本项目遵循项目根目录下的 LICENSE 文件条款。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个 widget！

---

**注意**: 使用本 widget 需要有效的 Pexels API 密钥。请遵守 Pexels 的使用条款和 API 限制。
