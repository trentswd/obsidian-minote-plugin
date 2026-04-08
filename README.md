# Obsidian Plugin: 小米笔记同步插件 (Fork 版)

> 本项目是 [emac/obsidian-minote-plugin](https://github.com/emac/obsidian-minote-plugin) 的个人 Fork 版本，在同步策略上采用了不同的技术路线。感谢原作者 [Emac Shen](https://github.com/emac) 的出色工作。

Obsidian 小米笔记同步插件是一个社区插件，用来将[小米笔记](https://i.mi.com/note/h5#/)转换为 Markdown 格式保存到 Obsidian 指定的文件夹中。首次使用，如果笔记数量较多，更新会比较慢，后面再去更新的时候只会增量更新有变化的笔记，一般速度很快。

## 与原版的路线差异

本 Fork 在同步策略上与原版采用了不同的设计思路，适合不同的使用习惯：

| 特性 | 原版 | Fork 版 (本项目) |
|---|---|---|
| **文件命名** | 使用笔记标题作为文件名 | 使用笔记 ID 作为文件名 |
| **文件夹结构** | 按小米笔记的文件夹创建物理目录 | 所有笔记存放在同一目录，文件夹映射为 Obsidian 标签 |
| **富文本转换** | 正则替换 | 基于 Turndown 引擎 |
| **附件处理** | 下载图片到 `img` 子目录 | 使用 Obsidian 附件管理 API |
| **元数据** | 无 frontmatter | 生成 YAML frontmatter（aliases、type、tags、created、modified） |
| **包管理** | npm | pnpm |

## 功能
- 使用笔记 ID 作为文件名
- 将小米笔记的文件夹结构转换为 Obsidian 标签
- 支持普通笔记、手写笔记、思维导图和待办事项列表的同步
- 自动转换斜体、下划线、高亮、待办列表等格式
- 针对独立的待办事项支持以多级嵌套 Checkbox 的结构生成，并自动附加状态标签
- 下载笔记中的图片和音频，使用 Obsidian 嵌入语法
- 同步后的文件保持小米笔记的创建和修改时间
- 增量更新：只同步有变化的笔记
- 支持强制同步模式（全量覆盖更新）
- 支持非中国区的小米云服务

## 安装方法
本 Fork 版本未发布到 Obsidian 社区插件市场。如需使用，请从本仓库的 [Releases](../../releases) 页面下载 `main.js` 和 `manifest.json`，手动放入 Obsidian 的 `.obsidian/plugins/minote-sync/` 目录中。

也可以使用 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件通过本仓库地址直接安装。

## 设置
1. 打开 Obsidian 的设置页面，找到 `Minote Sync` 进入到插件设置页面
2. 点击右侧 `登录` 按钮，在弹出的登录页面扫码登录
3. 设置笔记保存位置，默认保存到 `/minote` 文件夹

## 使用
⚠️ 本插件是覆盖式更新，请不要在同步的文件里修改内容。

点击左侧 Ribbon 上的小米笔记按钮(![](/cloud-download.png))，或者 `command+P(windows ctrl+P)` 调出 Command Palette 输入 `Minote` 找到`同步小米笔记`即可同步。

## 已知问题
- 一段时间不使用本插件，Cookie 可能会失效，需要到插件设置页面手动刷新 Cookie。
- 偶尔可能会有网络连接问题，重新点击同步即可，已同步的笔记不会再次更新。

## TODO
- [ ] 支持移动端
- [ ] 支持删除同步

## 免责声明
所有笔记内容均来自小米云服务，用户登录即授权本插件同步用户的笔记内容到本地。

## 致谢
- [emac/obsidian-minote-plugin](https://github.com/emac/obsidian-minote-plugin) — 原版插件
- [Weread Plugin](https://github.com/zhaohongxuan/obsidian-weread-plugin)
- [minote-Obsidian](https://github.com/yulittlemoon/minote-Obsidian)
- [Obsidian Plugin Developer Docs](https://marcus.se.net/obsidian-plugin-docs/)

---

# Obsidian Plugin: Minote Sync Plugin (Fork)

> This is a personal fork of [emac/obsidian-minote-plugin](https://github.com/emac/obsidian-minote-plugin) with a different synchronization strategy. Thanks to [Emac Shen](https://github.com/emac) for the original work.

This plugin syncs your [Xiaomi notes](https://i.mi.com/note/h5#/) to Obsidian by converting them to Markdown format. The initial sync might be slow if you have many notes, but subsequent syncs will only update changed notes incrementally.

## Differences from the Original

This fork takes a different approach to note synchronization, suitable for different workflows:

| Feature | Original | This Fork |
|---|---|---|
| **File naming** | Uses note title as filename | Uses note ID as filename |
| **Folder structure** | Creates physical directories matching Xiaomi folders | Flat storage with Obsidian tags mapped from folders |
| **Rich text conversion** | Regex replacement | Turndown engine based |
| **Attachments** | Downloads images to `img` subdirectory | Uses Obsidian attachment management API |
| **Metadata** | No frontmatter | YAML frontmatter (aliases, type, tags, created, modified) |
| **Package manager** | npm | pnpm |

## Features
- Uses note ID as filename
- Converts Xiaomi notes folder structure to Obsidian tags
- Supports regular notes, handwritten notes, mind maps, and todo lists
- Converts italic, underline, highlight, checklists, etc.
- Standalone todo tasks are grouped into hierarchical multi-level checklists with automatic status tags
- Downloads images and audio using Obsidian embed syntax
- Preserves creation and modification timestamps
- Incremental updates: only syncs changed notes
- Force sync mode for full overwrite updates
- Supports Xiaomi Cloud Services in non-Chinese regions

## Installation
This fork is not published in the Obsidian Community Plugin marketplace. To use it, download `main.js` and `manifest.json` from the [Releases](../../releases) page and place them in `.obsidian/plugins/minote-sync/` in your vault.

You can also install via [BRAT](https://github.com/TfTHacker/obsidian42-brat) using this repository URL.

## Usage
⚠️ This plugin uses overwrite-based updates. Please don't modify content in synced files.

Click the Xiaomi notes button(![](/cloud-download.png)) in the left Ribbon, or use `command+P (windows ctrl+P)` to open Command Palette and search for `Minote`.

## Known Issues
- Cookie may expire after periods of inactivity, requiring manual refresh in plugin settings
- Occasional network connection issues may occur; simply retry sync

## TODO
- [ ] Support mobile devices
- [ ] Support deletion sync

## Disclaimer
All note content comes from Xiaomi Cloud Services. User login authorizes this plugin to sync notes to local storage.

## Acknowledgments
- [emac/obsidian-minote-plugin](https://github.com/emac/obsidian-minote-plugin) — Original plugin
- [Weread Plugin](https://github.com/zhaohongxuan/obsidian-weread-plugin)
- [minote-Obsidian](https://github.com/yulittlemoon/minote-Obsidian)
- [Obsidian Plugin Developer Docs](https://marcus.se.net/obsidian-plugin-docs/)
