# CG → SVG · 逐笔成型

静态作品站。首页展示封面、原图与 SVG 对照；点击“开始观看逐笔动画”才会加载完整矢量文件。动画支持暂停、调速、进度拖动和查看每笔 SVG 路径代码。

## GitHub Pages

创建公开仓库 `cg-svg-replay`，把本目录作为仓库根目录。在 Settings → Pages 中选择 Deploy from a branch、`main`、`/(root)`。入口是 `index.html`，项目网址通常是 `https://<用户名>.github.io/cg-svg-replay/`。

本网站由程序辅助描摹生成 SVG；逐笔效果是按路径顺序模拟绘制，并非人工手绘录像。
