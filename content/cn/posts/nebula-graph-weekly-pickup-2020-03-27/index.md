---
title: "Pick of the Week'20 | 第 13 周看点--GitHub上的 defect-p2 标签"
date: 2020-03-27
description: "本周看点：存储层升级了依赖的 RocksDB 版本、job manager 支持提交 flush 任务…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 13 个工作周的周五，美股大涨的一周过去了你乘上这阵风了吗？🌝 下面来和情绪高涨的 Nebula 看看本周图数据库和 Nebula 有什么新看点~~

## Nebula 产品动态

Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- 存储层升级了依赖的 RocksDB 版本，标签： `Storage` ，pr 参见：[https://github.com/vesoft-inc/nebula/pull/1948](https://github.com/vesoft-inc/nebula/pull/1948)、[https://github.com/vesoft-inc/nebula/pull/1953](https://github.com/vesoft-inc/nebula/pull/1953)、[https://github.com/vesoft-inc/nebula/pull/1973](https://github.com/vesoft-inc/nebula/pull/1973)
- 对于不支持的系统，会退出编译过程，(感谢社区小伙伴的 pr)  ，标签： `编译` ，pr 参见：[https://github.com/vesoft-inc/nebula/pull/1951](https://github.com/vesoft-inc/nebula/pull/1951)
- job manager 支持提交 flush 任务，标签： `文档` ，示例如下，pr 参见：[https://github.com/vesoft-inc/nebula/pull/1957](https://github.com/vesoft-inc/nebula/pull/1957)

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW201301.png)


## 社区问答

Pick of the Week 每周会从官方论坛、微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @周游 提问
> 大佬们，有没有 docker 分布式部署的教程或链接，刚刚试了下官方的教程，发现是单机多节点，然后自己尝试改了下 docker compose.yaml 配置文件里的ip等，docker 就配置不起来了

**Nebula**：目前是这样，因为现在通过 DNS 来连接 Metad 的 PR 还没合入，所以暂时只能显示指定固定 ip 的方式。如果想在多节点上用 docker 部署，目前可以通过将每个 service 绑定到固定的结点上来做。现在还不能让容器编排的工具根据集群的状态自动拉起一个服务来，因为那样 ip 变更后就跟 graphd.conf 等配置中 meta 的 ip 不同了，会造成 nebula 服务不可用。

> 追问：那就是要手动配置启动不同docker了？不能使用自动部署


**Nebula**：嗯。应该说是 metad 还不能自动部署，其实 graphd 和 storaged 这两个服务是可以自动部署的。所以，你在用 docker 部署的时候，比如docker swarm，只要将 metad 的 service 绑定到固定的结点上即可，这样就限制了 metad 因为故障重启时被调度到其他节点从而造成其服务的 ip 地址改变的情况。

- @刘德林 提问
> 请问github上的issue标注了defect-p2的标签是什么意思？
> ![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW201302.png)

**Nebula**：p2 级别的 bug。我们把 bug 等级划分成了 3 档，每档可以获得对应的积分可用于兑换 Nebula 准备的礼品。

| 等级 | 描述 | 积分 |
| --- | --- | --- |
| P1 | 服务 Crash 或者数据丢失  | 10 个积分 |
| P2  | 未正确返回结果，或者严重文档错误 |  3 个积分 |
| P3 | 不严重的 Bug | 1 个积分 |

- @Anyzm 提问
> 连接池的问题请教：
> 假如定义一个全局变量 GraphClient client = new GraphClientImpl(“192.168.180.132”, 3699) client.connect(“user”,“password”);在高并发情况下，共用一个 client 对象执行增删改查是否会有性能或数据安全问题？请问有什么好的建议？

**Nebula**：目前看起来应该不是线程安全的，可以加个锁吧。如果单纯是性能问题的话，考虑一下 AsyncClient。

## 推荐阅读

- [图数据库 Nebula Graph TTL 特性](https://nebula-graph.io/cn/posts/clean-stale-data-with-ttl-in-nebula-graph/)
  - 推荐理由：如何提高数据中有效数据的利用率、将无效的过期数据清洗掉，是数据库领域的一个热点话题。在本文中我们将着重讲述如何在数据库中处理过期数据这一问题。
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 12 周看点--csv 数据导入你该知道的事项](https://nebula-graph.io/cn/posts/graph-database-knowledge-volume-2/)
  - [Pick of the Week'20 | 第 11 周看点--图数据库的蓄水池](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-03-13/)
  - [Pick of the Week'20 | 第 10 周看点--HN 热烈讨论的图查询语言](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-03-06/)


本期 Pick of the Week 就此完毕，如果你对本周看点或 Nebula Graph 有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) 或者官方论坛：[https://discuss.nebula-graph.io/](https://discuss.nebula-graph.io/) 向我们提出。若你想加入图数据库交流群，请添加 Nebula 小助手微信：NebulaGraphbot <br />

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《NGC 1333: Stellar Nursery in Perseus：英仙座的恒星育婴室》

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW2013Nebula.jpeg)


在可见光波段 NGC 1333 是个反射星云，其特征性的泛蓝色泽，源自星际尘埃反射星光所致。此星云在英仙座方向，座落在一个庞大、正在形成恒星的分子云之边缘，距离我们只有 1,000 光年远。这幅精彩的特写影像，大约涵盖了 2 个满月宽度的天区，以 NGC 1313 的距离来换算，其跨幅略大于 15 光年。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 March 27


![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
