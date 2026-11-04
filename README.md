# SalaryPush Web (上班加油器 · 网页版)

> 🚀 实时薪资跳动、带薪摸鱼计算与打工加油神器 (Web & PWA 版本)
>
> 🌐 **在线体验**：[https://salary-push-web.vercel.app](https://salary-push-web.vercel.app)  
> 🍎 **macOS 原生客户端 (.dmg)**：[前往 GitHub Releases 下载](https://github.com/SpaceSheepBoy/SalaryPush/releases/latest)

---

## ✨ 功能特性

- ⏱ **实时进账跳动**：工作时间内以 30fps 高频跳动显示当前分秒赚取的每一分钱（精确到小数点后两位）。
- 🌏 **多国社保与公积金**：
  - 🇨🇳 **中国**：住房公积金比例（5%~12%）与企业 1:1 双倍缴纳实时折算。
  - 🇫🇷 **法国**：Cadre / Non-cadre 社保分摊率 (~25% / 22%)、RTT 天数折算、Tickets Restaurant 饭补与 Navigo 交通补贴。
  - 🇺🇸 **美国 / 其他**：401(k) Employer Match 与自选福利配置。
- 🏖 **精密假期与工时换算**：自动联动法定节假日、带薪年休假，扣除假期后精确折算日薪、时薪与每秒进账。
- 🎁 **丰富实物激励与大件心愿单**：
  - 支持将今日已赚实时折算为：星巴克拿铁、喜茶/霸王茶姬、豪华午餐、IMAX电影票、10L汽车汽油、Steam 3A游戏、全身SPA等。
  - 大件目标与私人心愿单：AirPods Pro、iPhone 16 Pro、度假机票，实时显示今天赚出的百分比进度条！
- 🪟 **迷你便签模式 (Mini Mode)**：一键收起为极简窄卡片，放在屏幕角落不占视线。
- ⌨️ **ESC 老板键 (Stealth Mode)**：紧急情况下按 `ESC` 瞬间切换为极简黑白工作日历时钟，再按 ESC 或双击恢复。
- ☕️ **带薪摸鱼计时器**：内置摸鱼/如厕/咖啡计时，实时换算本次摸鱼赚取的老板薪水，并伴随庆祝动画。
- 📲 **支持 PWA 桌面独立运行**：支持离线运行，可在浏览器地址栏直接点击“安装到桌面”。
- 💾 **本地离线全自动记忆**：所有数据均存储在浏览器的本地 LocalStorage，退出刷新不丢失。

---

## 🛠 本地开发与构建

```bash
# 安装依赖
npm install

# 启动本地开发服务 (http://localhost:5173)
npm run dev

# 编译生产版本
npm run build
```

---

## 📄 开源许可

本项目遵循 [MIT License](LICENSE) 开源协议，欢迎自由下载、使用与二开。
