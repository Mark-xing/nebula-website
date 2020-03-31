---
title: "Pick of the Week'20 | 第 1 周看点--Nebula Graph 上 DB-Engine 图数据库榜单"
date: 2020-01-03
description: "本周看点：Nebula 嘉年华直播视频发布，DB-Engine 图数据库榜上 Nebula Graph 榜上有名…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 1 个工作周的周五，🌝 美好的 2020 （2020 = 1024 + 996 & 2020 = 404 + 404 + 404 + 404 + 404）从这周开始。来和 Nebula 看下本周图数据库和 Nebula 有什么新看点~~

### 本周大事件

- [Nebula Graph 嘉年华活动回顾【视频实录】](https://space.bilibili.com/472621355/channel/detail?cid=96904)

本次嘉年华第一次采用线上直播同步线下的形式，我们将视频现场实录分为了 4 个部分：【图数据库简介】、【Nebula 架构介绍】、【如何为社区做贡献】和【将 CSV 数据导入图数据库】。下面摘录了【Nebula 架构介绍】部分的某个 Q&A

❓ 传统数据库通过设计良好的数据结构是不是可以实现图数据库的功能

**Nebula**：图数据库相对传统数据库优化点在于，数据模型。传统数据库是一个关系型，是一种表结构做 Join，但存储结构表明了很难支持多度拓展，比如一度好友，两度好友，一度还支持，使用一个 Select 和 Join 就可完成，但是二度查询开销成本较大，更别提多度 Join 查询开销更大。图数据库的存储结构为面向图存储，更利于查询多度关系。特别的，有些图上特有的操作，用关系型数据库比较难实现和表达，比如最短路径、子图、匹配特定规则的路径这些。

- [DB-Engine 2020 年 1 月图数据库趋势](https://db-engines.com/en/ranking/graph+dbms)

Nebula Graph 第一次参加“打榜”暂列图数据库表单第 28 名，整体来说图数据库前十名的排名变化不大，DGraph 新晋前十，TigerGraph 第十名位置不保。

提示：DB-Engine 的分值主要由搜索引擎搜索量、对应产品 LinkedIn 上员工数，对外招聘职位，社交媒体讨论度，Stack Overflow 讨论度构成。

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200101.png)

### Nebula 产品动态
Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- 极大的简化了编译流程，支持 2.6.32 以上内核的绝大部分 Linux 系统，比如：CentOS 6/7/8、Debian 7/8/9 和 Ubuntu 16.04/18.04/19.04，标签： `编译`  ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1332](https://github.com/vesoft-inc/nebula/pull/1332)
- dump_tool 支持导出数据库中指定条件的点/边数据，标签： `Tools` ，示例如下，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1479](https://github.com/vesoft-inc/nebula/pull/1479)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200102.png)

- 配置支持更改 heartbeat_interval_secs，Meta 客户端上报心跳的时间间隔，标签： `配置` ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1540](https://github.com/vesoft-inc/nebula/pull/1540)
- 支持通过 curl http://ip:port/status 获取 git_info_sha，binary 包的 commitID，标签： `FAQ` ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1573](https://github.com/vesoft-inc/nebula/pull/1573)

### 社区问答

Pick of the Week 每周会从微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @sky-天峰 提问
> Nebula 可以多 tag 吗？就像 Neo4j 里面的多标签

**Nebula**：支持多 Tag 的，可以参考文档 https://github.com/vesoft-inc/nebula/blob/master/docs/manual-CN/2.query-language/4.statement-syntax/2.data-query-and-manipulation-statements/insert-vertex-syntax.md。使用 CREATE TAG tag_name( ) 语法即**可创建一个 tag**，**可使用多个该语句创建多个 tag**，但是暂不支持使用 CREATE TAG tag_name1()，tag_name2() 语句一条语句创建多个 tag。 

- @不能倒流的时光 提问
> nebula 通过一个节点的特定边找目的节点是 o(2) 的复杂度么，先找边，然后找目的节点？

Nebula：给定 srcID，edgetype 找目的点，可以直接获取目的点 ID，参考 key 存储格式。

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200103.png)

- @小头针 提问
> 请问一下，nebula 目前是只支持命令行操作么


Nebula：有不同语言的客户端，可以在代码里调用，一月份我们会发布 UI 版，第一版 UI 会提供一个 Docker 运行的方式。

本期 Pick of the Week 就此完毕，如果你对本周看点有任何建议，欢迎在本文或者公众号后台及添加 Nebula 小助手微信号加群：NebulaGraphbot 

### 星云·小剧场
**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《 The Orion Nebula in Infrared from WISE：WISE 卫星拍摄的猎户座红外光影像》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2001Nebula.png)

猎户座大星云是一个很有趣的天体。肉眼即可见的猎户座大星云，外观像是猎户座里的一片模糊小光斑。这张合成自广域红外线巡天卫星(WISE)四个红外光波段数据的影像，证实猎户座星云是一个熙攘喧嚣的区域，蜂拥着最近形成的恒星、炙热气体及黝黑尘埃。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 January 02

🎊🎊欢迎你关注 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 了解我们更多动态~

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
