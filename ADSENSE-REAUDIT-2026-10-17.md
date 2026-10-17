# GeometryDashSpam.cc 全站复查（2026-10-17 UTC / 上海 10 月 18 日）

本报告是工程与编辑审查，不是 Google 的逐页判定。Google 未公布本次拒审涉及的具体页面，不能把测试通过写成 AdSense 已达标。

## 范围与证据

- 线上基线：`de3560d8a22e2ebd2a0c6f5da12f8c0e3ff6c3b4`（deploy-status 实取）。
- 逐页检查 60 份导出 HTML：58 个正常页面 + 2 个错误模板；所有正常页面实取 HTTP 200。首次 4 次代理超时已补查，不视为网站故障。随机不存在的地址返回 404；直接访问 `/404` 与 `/_not-found` 的静态模板返回 200，但为 noindex 且无广告。
- 46 个可索引页面与 XML sitemap 对应；12 个辅助工具为 noindex；另 2 个错误模板 noindex。noindex 是搜索策略，并不使页面免于 AdSense 政策审查。
- 40 个允许广告的页面各有一个指定发布商加载器；18 个正常无广告页面和 2 个错误模板无加载器。ads.txt 仅授权指定 Google 发布商。
- 导出校验覆盖 H1、唯一 title/description、canonical、结构化数据、资源与内部链接、robots、sitemap 日期及广告脚本。线上邮件正文差异为 Cloudflare 邮箱编码，不当作旧部署。
- 本轮直接交互抽样：首页可见界面、Clicker 键盘失败复现、CPS 一秒单击结果。不是对所有工具、所有设备的穷举交互测试。

## 本轮实际修复

1. Clicker：补键盘/辅助技术触发，保留指针计分并防止同一次鼠标点击重复计数。
2. Hardest Level：补精确关卡身份和独立选关解释；不再把榜单收录日写成验证完成日。
3. Jitter / Butterfly：各补不同的实用流程和原创数学算例，明确没有伪造实测结果。
4. Difficulty Faces：修正 Easy 蓝色、Normal 绿色的卡片视觉对应。
5. 所有文章：元信息容器允许换行，缓解窄屏日期/阅读时间挤压；七篇文章修正阅读时间估计。
6. Sitemap：对来源检查日与内容修改日取较新日期，避免后续自动数据更新被旧编辑日覆盖；新增未来日期回归测试，覆盖较新来源、较新编辑和独立工具日期。

本轮未新增搜索落地页，未删除原有关键词 URL，未扩大 noindex 范围。

## 逐页结果

“保留”表示本轮未发现足以要求删页的明确问题，不代表 Google 承诺批准。辅助工具按用途判断，不用字数设门槛。

| 页面 | 搜索 / 广告 | 本轮结论与限制 |
|---|---|---|
| `/` | index / 广告允许 | 核心工具与训练入口；本轮首页桌面界面可见。实际手机触控仍需验收。 |
| `/404` | noindex / 无广告 | 错误模板：noindex、无广告；随机未知 URL 已验证返回 404。 |
| `/_not-found` | noindex / 无广告 | 错误模板：noindex、无广告；随机未知 URL 已验证返回 404。 |
| `/about` | index / 无广告 | 有工具方法、编辑责任、来源与更正政策；不把匿名编辑身份包装成外部专家。 |
| `/aim-trainer` | index / 广告允许 | 可交互的独立瞄准练习，明确不直接等同 Wave 技能；建议后续补可导出的多次命中/失误记录，属增强项。 |
| `/blog` | index / 无广告 | 导航页，不加载广告；11 篇文章入口与摘要。七篇阅读时间本轮同步修正。 |
| `/blog/30-day-spam-challenge` | index / 广告允许 | 已有 30 天具体任务、本地完成/笔记和 CSV；本轮将 3 分钟阅读估计调为 8 分钟。 |
| `/blog/best-mouse-for-spam-geometry-dash` | index / 广告允许 | 有比较维度与空白实测表；不含虚构型号排行榜。阅读时间调为 4 分钟。 |
| `/blog/common-spam-mistakes` | index / 广告允许 | 十项症状/改法/复测案例；阅读时间由 2 分钟调为 4 分钟。 |
| `/blog/evaluate-geometry-dash-spam-advice` | index / 广告允许 | 有可追溯 SCL 主张和测量能力界限案例；阅读时间调为 4 分钟。 |
| `/blog/how-to-improve-cps-geometry-dash` | index / 广告允许 | 基线、方法对比与同设备复测；与单纯定义页有不同任务。 |
| `/blog/mobile-vs-pc-spam` | index / 广告允许 | 有输入位置、保持/释放比较；没有把未实测设备写成优胜结论。阅读时间调为 4 分钟。 |
| `/blog/notable-wave-spam-levels` | index / 广告允许 | 已有三种关卡分段分析和不同训练任务；阅读时间调为 4 分钟。 |
| `/blog/science-of-clicking` | index / 广告允许 | 有公式、滚动峰值/固定桶、间隔算例和工具定义；不包装成实验室研究。 |
| `/blog/top-spam-levels-2026` | index / 广告允许 | 有 SCL/全关卡榜/训练参考区别和具体条目；阅读时间调为 4 分钟。 |
| `/blog/wave-vs-ufo-spam` | index / 广告允许 | 有模式间不同输入任务与练习设计；未声称本站模拟器复制全部官方物理。 |
| `/blog/what-is-spam-geometry-dash-guide` | index / 广告允许 | 解释定义、输入控制与工具选择，适合作为基础入口。 |
| `/bpm-tapper` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/butterfly-click` | index / 广告允许 | 本轮补强：新增两指交接、完整释放、同平均间隔的不同节奏算例和逐步排查。 |
| `/chimp-test` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/contact` | index / 无广告 | 短但完成联络任务，不按文章字数要求凑字；线上邮箱被 Cloudflare 编码，需在真实浏览器解码后可见。 |
| `/cps-test` | index / 广告允许 | 本轮实测 1 秒单击：平均/峰值均 1.00，间隔与一致性为 N/A，历史和重试入口正常。 |
| `/dashboard` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/dashmetry` | index / 广告允许 | 已有更名与模式比较；本轮未对全部模式实玩，不把预告模式说成可用。 |
| `/demon-list` | index / 广告允许 | 有来源、日期和排名快照；依赖自动更新，不能当作永久排名或 spam 强度榜。 |
| `/demon-list/spam-demons` | index / 广告允许 | 已有精确 ID、永久参考链接和分段训练任务；与 SCL 区分。 |
| `/demon-list/wave-demons` | index / 广告允许 | 已有入门路径、同名关卡区分和分段练习；不把 Extreme 关卡当入门要求。 |
| `/double-click` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/drag-click` | index / 广告允许 | 已有桶统计与滚动峰值的不同算例；不靠平均 CPS 猜测物理手法。 |
| `/easiest-demons` | index / 广告允许 | 五个精确 ID 与各自检查点任务；不声称每位玩家的固定难度顺序。 |
| `/geometry-dash-breeze` | index / 广告允许 | 已有维护者版本来源与版本比较；本轮未执行 Windows/Android 安装。 |
| `/geometry-dash-clicker` | index / 广告允许 | 本轮修复：原方块按钮按 Enter 不计分；新增键盘/辅助技术激活，鼠标事件不重复计数。 |
| `/geometry-dash-codes` | index / 广告允许 | 按房间区分的代码与来源；动态口令需持续更新，不承诺永久有效。 |
| `/geometry-dash-difficulty-faces` | index / 广告允许 | 本轮修复：Easy、Normal 卡片配色与真实图标/正文相反；统一蓝/绿配色。 |
| `/geometry-dash-stuttering-high-end-pc` | index / 广告允许 | 有逐项对照排查与记录方法；没有假称真实 PC 跑分，特定硬件仍需用户复测。 |
| `/geometry-dash-vault-of-secrets-codes` | index / 广告允许 | 已有完整房间步骤和独立数列计算例；保留与总览页不同的操作价值。 |
| `/geometry-dash-wave` | index / 广告允许 | 已有运动示意、真实参数和分项练习；保留原创工具价值。 |
| `/hardest-level` | index / 广告允许 | 本轮补强：原页主要重复 #1、前五和 FAQ；新增关卡身份、排名解释和选关方法，并分开榜单收录日与验证完成日。 |
| `/how-to-get-diamonds-geometry-dash` | index / 广告允许 | 有不同资源来源与钻石/货币区分；未实际登录游戏验证当日任务。 |
| `/how-to-get-gold-keys-geometry-dash` | index / 广告允许 | 有资源获取与解锁说明；不提供作弊或外部生成器。 |
| `/jitter-click` | index / 广告允许 | 本轮补强：新增三次测量的中位数/范围算例，区分爆发峰值和可重复收益。算例明确不是实测玩家数据。 |
| `/key-rollover` | index / 广告允许 | 独立的预期组合与同时观测快照测试；补足仅观察已收到按键的盲区。 |
| `/keyboard-ghosting` | index / 广告允许 | 可视化浏览器收到的组合键；不会证明没有漏键，需对照原本按下的组合。 |
| `/keyboard-latency` | index / 广告允许 | 真实标题为 Key Timing，有 20 次 hold/release 练习；URL 保留，未冒称开关延迟。 |
| `/leaderboard` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/mouse-acceleration` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/polling-rate` | index / 广告允许 | 显示事件/时间/窗口样本，解释事件合并限制；不能据此认证 USB 轮询率。 |
| `/privacy` | index / 无广告 | 有广告数据类别、Google 链接与本地数据说明；代码无法证明后台 CMP 已发布或地区行为正确。 |
| `/reaction-test` | index / 广告允许 | 明确浏览器提示到输入的时间；不是设备延迟认证，本轮未重跑全部随机提示分支。 |
| `/refresh-rate` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/right-click` | index / 广告允许 | 已有同设备左右键三次对照流程与空白记录表；不是默认游戏按键表现预测。 |
| `/scroll-test` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/sitemap` | index / 无广告 | HTML 导航页无广告；XML 另含 46 个可索引地址。 |
| `/sound-reaction` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/spacebar-counter` | index / 广告允许 | 有专用输入计数、测试时长和解释；与鼠标 CPS 的输入路径不同。 |
| `/spam-challenge-list` | index / 广告允许 | 已有三条独立日期的实核条目与证据、规则字段；首页健康检查日期不代表条目已重新核实。 |
| `/system-info` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/terms` | index / 无广告 | 支持性说明页，无广告；篇幅本身不是拒审证据。 |
| `/typing-test` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |
| `/visual-memory` | noindex / 无广告 | 辅助功能页：保留原 noindex、无广告策略；本轮检查结构/资源/链接与 HTTP，未逐项穷举全部交互。 |

## 尚不能据此确认的事项

- **真实手机验收未完成。** 本轮改了文章元信息换行，但当前浏览器未提供手机视口/触控仿真控制，不能声称 iOS/Android 都已通过；需验证触控开始/释放、滚动、重试和横竖屏。
- **AdSense/CMP 后台未核实。** 只有代码与公开页面证据，不能判断后台是否还有别的拒审项或自动广告实际覆盖位置。
- **Search Console 收录与抓取记录未读取。** 两个已连接 GSC Wizard 账户均返回订阅到期错误，不能据此断言未收录或抓取失败。
- **游戏安装、手部技巧与设备表现未做实验室/真人实测。** 原创算例与流程增加可用价值，但不冒称已实测游戏通关或硬件延迟。
- **图片署名不等于授权证明。** 难度图标保留 RobTop 权利归属说明；本轮没有取得新的权利文件。

## 判断依据

Google 关注原创价值、导航、体验，以及低价值/复制内容的广告问题；没有发布通用字数或文章数量的保证门槛。优先展示本站可运行的原创训练工具、准确的方法和可复现解释。

- https://support.google.com/adsense/answer/7299563?hl=en
- https://support.google.com/adsense/answer/10502938?hl=en
- 本轮 GRIEF 身份核对：https://pointercrate.com/demonlist/1/ （此链接按排名变化，打开需重新确认名称）

验证命令：`npm run check`、`npm run build`、`npm run verify`。本轮最终代码需在生产部署后验证键盘 Enter/Space 与单击各计一次、内容新段落及 sitemap 日期。
