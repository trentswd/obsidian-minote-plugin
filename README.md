# Obsidian Minote Plugin

[![](https://github.com/emac/obsidian-minote-plugin/actions/workflows/CI.yml/badge.svg)](https://github.com/emac/obsidian-minote-plugin/actions/workflows/CI.yml)
[![Release Obsidian plugin](https://github.com/emac/obsidian-minote-plugin/actions/workflows/release.yml/badge.svg)](https://github.com/emac/obsidian-minote-plugin/actions/workflows/release.yml)
[![GitHub license](https://badgen.net/github/license/Naereen/Strapdown.js)](https://github.com/emac/obsidian-minote-plugin/blob/main/LICENSE)
[![Github all releases](https://img.shields.io/github/downloads/emac/obsidian-minote-plugin/total.svg)](https://GitHub.com/emac/obsidian-minote-plugin/releases)
[![GitLab latest release](https://badgen.net/github/release/emac/obsidian-minote-plugin/)](https://github.com/emac/obsidian-minote-plugin/releases)

Obsidian 小米笔记插件是一个社区插件，用来将小米笔记转换为 Markdown 格式保存到 Obsidian 指定的文件夹中。首次使用，如果笔记数量较多，更新会比较慢，后面再去更新的时候只会增量更新有变化的笔记，一般速度很快。

## 更新历史
https://github.com/emac/obsidian-minote-plugin/releases


## 功能
- 按文件夹存放笔记
- 自动下载笔记中的图片，并将引用方式替换成 Markdown 格式
- 替换 `<background>` 标签为 `<span>` 标签，以支持文字高亮
- 去除多余的 `<text>` 标签
- 兼容旧版本无标题笔记（根据首行内容和笔记 ID 自动生成标题）
- 支持强制同步模式，即全量覆盖更新


## 安装方法
插件市场直接搜索 `minote`，找到 `Minote Plugin`点击`install`安装，安装完成后点击`Enable`使插件启用，也可以直接在[release](https://github.com/emac/obsidian-minote-plugin/releases)页面手动下载。


## 设置
1. 打开 Obsidian 点击 `设置` 进入设置界面，找到 `Minote` 进入到插件设置页面
2. 点击右侧 `登录` 按钮，在弹出的登录页面扫码登录，登录完成后，会显示个人昵称
3. 注销登录可以清除插件的 Cookie 信息，注销方法和网页版小米云服务一样，右上角点击头像，点击退出
4. 设置笔记保存位置，默认保存到 `/minote` 文件夹，可以修改为其他位置


## 使用
⚠️ 本插件是覆盖式更新，请不要在同步的文件里修改内容。

点击左侧 Ribbon上的小米笔记按钮，或者command+P(windows ctrl+P)调出Command Pattle 输入Minote 找到`同步小米笔记`即可同步。


## 已知问题
- 一段时间不使用本插件，Cookie 可能会失效，需要到插件设置页面手动刷新Cookie。
- 偶尔可能会有网络连接问题，重新点击同步即可，已同步的笔记不会再次更新。


## TODO
- [ ] 支持思维笔记
- [ ] 支持移动端


## 赞赏
<img src="https://cloud.githubusercontent.com/assets/758420/20865022/55350f8c-ba41-11e6-8207-02657ddfd437.png" width=30% />


## 免责声明
所有笔记内容均来自小米云服务，用户登录即授权本插件同步用户的笔记内容到本地。


## 感谢
- [Weread Plugin](https://github.com/zhaohongxuan/obsidian-weread-plugin)
- [minote-Obsidian](https://github.com/yulittlemoon/minote-Obsidian)
- [Obsidian Plugin Developer Docs](https://marcus.se.net/obsidian-plugin-docs/)
