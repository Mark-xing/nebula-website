---
title: "Pick of the Week'20 | 第 10 周看点--Hacker News 热烈讨论的图查询语言"
date: 2020-03-06
description: "本周看点：Hacker News 热帖：Graph query languages: Cypher vs. Gremlin vs. nGQL，产品方面：GO  支持关键词 BIDIRECT  进行双向遍历提供。"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 10 个工作周的周五，三月除了有变暖的天气还有研发们对图数据库高涨的热情，你可以在本周的大事件中感受到 🌝 下面来和 Nebula 看看本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

- **Hacker News 热帖：Graph query languages: Cypher vs. Gremlin vs. nGQL**

这是图数据库 Nebula Graph 第二次发的帖成为 Hacker News 当日热帖，第一次是我们在 Hacker News 发了 Nebula Graph 的介绍引起了热烈讨论，这一次我们发的图数据库查询语言对比帖再次成为了当日热榜，你可以通过下面的截图感受下国内外研发人员对图数据库查询语言的看法：有人吐槽 Neo4j，有人表达对 Cypher 的爱，有人 diss Gremlin…Hacker News 阅读传送门：[https://news.ycombinator.com/item?id=22482665](https://news.ycombinator.com/item?id=22482665)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW201001.png)

## Nebula 产品动态
Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- `GO`  支持关键词 `BIDIRECT`  进行双向遍历提供，标签：`nGQL`，示例如下，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1740](https://github.com/vesoft-inc/nebula/pull/1740)、[https://github.com/vesoft-inc/nebula/pull/1752](https://github.com/vesoft-inc/nebula/pull/1752)

```
# syntax
GO FROM <node_list> OVER <edge_type_list> BIDIRECT WHERE (expression [ AND | OR expression ...])  
  YIELD [DISTINCT] <return_list>
# example
nebula> GO FROM 102 OVER follow BIDIRECT;
===============
| follow._dst |
===============
| 101         |
---------------
| 103         |
---------------
| 135         |
---------------
```

- Storage multiGet 接口支持只返回部分存在的结果，标签： `OLAP` ，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1840](https://github.com/vesoft-inc/nebula/pull/1840)

- 修改 RocksDB block cache 的方法，标签： `文档` ，示例如下，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1829](https://github.com/vesoft-inc/nebula/pull/1829)

```
# Change rocksdb_block_cache to 1024 MB
--rocksdb_block_cache = 1024
# Stop storaged and restart
/usr/local/nebula/scripts/nebula.service stop storaged
/usr/local/nebula/scripts/nebula.service start storaged
```

## 社区问答

Pick of the Week 每周会从官方论坛、微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @雷仕洪 提问
> Nebulagraph 有批量导入数据，etl 工具这些吗？比如，从关系型数据库导入

**Nebula**：目前我们支持数据导入的方式有 Spark Writer 和 Nebula Importer ，如果是关系型数据的话，你可以从关系型数据中先导出 csv 文件，然后使用 Nebula Importer 导入 nebula，Nebula Importer 的链接：[https://github.com/vesoft-inc/nebula-importer](https://github.com/vesoft-inc/nebula-importer)

- @enriucllguo 提问
> nebula 可以管理一台机器上多个硬盘吗，我有个 ssd 128G，一个 ssd 256G

**Nebula**：可以，Nebula Graph storaged 中的参数：data_path 可用来实现多硬盘管理，不同的目录记得用 ’,' 隔开。

- @Agent 提问
> Hi 有个问题咨询一下，我们如果要实现 Nebula 数据的跨机房主备同步，目前想到的是两个方案：
> 1. 使用 databalance 做数据均衡，但是 databalace 好像没有机房感知和 balance 的流量控制；
> 2. 使用快照，主集群定时生成快照，使用同步工具将快照同步到异地备集群，这里有个问题是，快照在备集群怎么导入？备集群是否要保持跟主集群一样机器数量的规模？

**Nebula**：第一个问题： balance 目前还没做机房感知和机架感知的特性，balance 流量控制这块我们正在设计这个特性。第二个问题：当前版本暂未提供 snapshot 恢复功能，需要用户根据实际的生产环境编写 shell 脚本实现。实现逻辑也比较简单，拷贝各 engineServer 的 snapshot 到指定的文件夹下，并将此文件夹设置为 data_path，启动集群即可。创建 snapshot 参见链接：[https://github.com/vesoft-inc/nebula/blob/e34d9cb50f9e659f27dbc67603156effca937e82/docs/manual-CN/3.build-develop-and-administration/3.deploy-and-administrations/server-administration/storage-service-administration/cluster-snapshot.md](https://github.com/vesoft-inc/nebula/blob/e34d9cb50f9e659f27dbc67603156effca937e82/docs/manual-CN/3.build-develop-and-administration/3.deploy-and-administrations/server-administration/storage-service-administration/cluster-snapshot.md)

## 推荐阅读

- [一文了解各大图数据库查询语言（Gremlin vs Cypher vs nGQL）| 操作入门篇](https://nebula-graph.io/cn/posts/graph-query-language-comparison-cypher-gremlin-ngql/)
  - 推荐理由：介于市面上没有统一的图查询语言标准，在本文中我们选取市面上主流的几款图查询语言来分析一波用法，方便你了解到各类图查询语言的区别。
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 9 周看点--2020 H1 RoadMap 发布](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-28/)
  - [Pick of the Week'20 | 第 8 周看点--索引、属性查询已上线](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-21/)
  - [Pick of the Week'20 | 第 7 周看点--Nebula 论坛上线](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-14/)

本期 Pick of the Week 就此完毕，如果你对本周看点或 Nebula Graph 有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) 或者官方论坛：[https://discuss.nebula-graph.io/](https://discuss.nebula-graph.io/) 向我们提出。若你想加入图数据库交流群，请添加 Nebula 小助手微信：NebulaGraphbot 

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《Sharpless 249 and the Jellyfish Nebula 夏普勒斯249与水母星云》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2010Nebula.jpeg)

这张迷人的望远镜影像，捕捉到通常黯淡而且难以捉摸的水母星云。在这幅由二张窄波段数据拼接而成的影像里，来自硫、氢和氧等原子的辐射，分别以红、绿及蓝等色泽来呈现，位在影像左上角的发射星云，则是夏普勒斯 249。 水母星云离我们约 5,000 千光年远，以此距离来换算，这幅影像大约涵盖 300 光年的区域。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 March 07

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)

