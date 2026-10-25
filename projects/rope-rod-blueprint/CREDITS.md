# 制作与资源声明

- 项目：轻绳与轻杆 · 受力之间，2026-10-25。
- 视觉指导：用户指定的 `claude-opus-5-5-style` 技能，蓝图／工程制图。通过研读风格提示、制作说明和完整样片源码学习其视觉语法。
- 二维制图、时间线、播放器及交互：本项目原创实现，没有引入第三方JavaScript库、绘图引擎、网页字体或外部图片。
- 当前音乐：按用户要求采用《We Never (Remix)》0.9x，来源 Bilibili `https://www.bilibili.com/video/BV1mLWw6VEux/`，上传者“一支yuuu”，视频说明署名歌手“ZHENLOE”。采用已减速音源的开头60秒，加入淡入淡出及响度归一化，不再重复减速。详见 `assets/music.json`。音乐版权归相应权利人，本项目不主张音乐所有权或再分发许可。
- 历史配乐：《Between the Forces / 受力之间》原创合成配乐的生成脚本与报告予以保留，已不用于当前HTML。
- 中文字体：操作系统字体回退，未复制或分发字体文件。
- 教学内容：用户提供的本地备课课件，具体文件和页码见 `references/source-notes.md`。没有复制课件图片进入成品。
- 工具依赖：离线HTML无依赖；开发重建用Python/NumPy/SciPy/FFmpeg，自动验证使用Playwright Core及本机Chrome。
