# 袁野 & 吴倩金 · 婚礼邀请函 H5

手机竖滑请柬。根据工作区参考视频还原各段比例、照片布局、文案、花体字和手绘图案。原有字形和插图保存在单独的透明素材中，正文也提供文本供辅助功能读取。照片全部来自工作区的 `原图` 文件夹。

## 更新个人信息

在 `src/data.js` 更新姓名、日期、农历日期、场地和三项流程时间。预览采用 2027 年 1 月 15 日（星期五）、绍兴苏宁希尔顿酒店。三个时间都保留为待定。酒店地址以[希尔顿中国官网](https://www.hilton.com.cn/zh-CN/hotel/shaoxing/hilton-shaoxing-HGHSXHI/maps-directions.html)为准。

封面下两个圆框已放入双方童年照。需要更换时可替换 `public/reference/photos/groom.webp` 和 `public/reference/photos/bride.webp`。其他照片搭配在 `src/App.vue` 中维护。背景音乐为 [10CM 的《Spring Snow》](https://music.apple.com/us/song/1745664127)，取自参考视频前 111 秒，由右上角音符开启和暂停。

## 本地运行和导出

使用 Node.js 22 或更新版本。

```sh
npm install
npm run dev
npm run build
node scripts/export-preview.mjs /path/to/invitation.html
```

导出的单文件 HTML 携带照片、字形素材、纸张纹理和音频，可本地离线预览。高德地图跳转需要联网。需要公开网址时可将 `dist/` 部署到 HTTPS 静态网站托管。

地图底图来自 [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)。替换文字所用的 Noto Serif SC 字体子集遵循 `public/reference/font-license.txt`。
