---
title: "图数据库 Nebula Graph RC1 Release Note"
date: 2019-11-05
description: "本次 RC1 主要增强了 nGQL，新增 LIMIT, GROUP BY 等语句；算法方面增加了最短路径，全路径搜索…"
tags: ["Release-Note"]
author: Jude
---

![rc1](https://nebula-blog.azureedge.net/nebula-blog/RC101.png)

> [Nebula Graph](https://github.com/vesoft-inc/nebula)：一个开源的分布式图数据库。作为唯一能够存储万亿个带属性的节点和边的在线图数据库，Nebula Graph 不仅能够在高并发场景下满足毫秒级的低时延查询要求，还能够实现服务高可用且保障数据安全性。

## 图数据库 Nebula RC1 主要更新

本次 RC1 主要增强了 nGQL，新增 `LIMIT` , `GROUP BY` 等语句；算法方面增加了最短路径，全路径搜索。 Storage 层新增 PUT/GET 接口，支持 scale out/in，以及新增了 Golang 客户端以及多线程 Golang 数据导入工具。

### nGQL

- 新增 `LIMIT` 指定返回的记录数。([#750](https://github.com/vesoft-inc/nebula/pull/750))
- 管道操作中支持 `YIELD` 指定返回类型。([#745](https://github.com/vesoft-inc/nebula/pull/745))
- 新增 `ORDER BY` 对结果集进行排序 (#537)
- 新增 `udf_is_in` 来查询特定集合的数据。([#1096](https://github.com/vesoft-inc/nebula/pull/1096))
- 新增 `DELETE VERTEX` 删除指定的 vertex 和相关联的出入边。 ([#868](https://github.com/vesoft-inc/nebula/pull/868))
- 新增 `UUID()` 函数生成唯一值. ([#958](https://github.com/vesoft-inc/nebula/pull/958), [#961](https://github.com/vesoft-inc/nebula/pull/961), [#1031](https://github.com/vesoft-inc/nebula/pull/1031))
- 支持逻辑运算符 `XOR`、`OR`、`AND` 和 `NOT`. ([#858](https://github.com/vesoft-inc/nebula/pull/858))
- 支持 `TIMESTAMP` 数据类型. ([#843](https://github.com/vesoft-inc/nebula/pull/843))
- 针对 `STRING` 数据类型，支持更多函数操作，比如 `upper()`, `trim()`, `lower()`, `substr()` 等. ([#841](https://github.com/vesoft-inc/nebula/pull/841))
- 逻辑运算中支持类型转换 ([#964](https://github.com/vesoft-inc/nebula/pull/964))
- 新增 `SHOW CONFIGS` 获取指定服务 [meta/storage/graph] 的配置项, `GET CONFIGS` 获取指定配置项值 and `UPDATE CONFIGS` 修改配置项值. ([#504](https://github.com/vesoft-inc/nebula/pull/504))
- `SHOW HOSTS` 新增 Leader 信息。([#918](https://github.com/vesoft-inc/nebula/pull/918))
- 支持 `FIND PATH` 最短路径、全路径搜索 ([#847](https://github.com/vesoft-inc/nebula/pull/847))
- `GO` 支持多个 edge types 的图查询。([#699](https://github.com/vesoft-inc/nebula/pull/699))
- 优化了源代码的编译流程。 ([#1047](https://github.com/vesoft-inc/nebula/pull/1047), [#948](https://github.com/vesoft-inc/nebula/pull/948), [#1083](https://github.com/vesoft-inc/nebula/pull/1083))

### Storage

- 新增 PUT/GET 接口. ([#977](https://github.com/vesoft-inc/nebula/pull/977))
- 支持 Leader balance. ([#731](https://github.com/vesoft-inc/nebula/pull/731), [#881](https://github.com/vesoft-inc/nebula/pull/881))
- 支持 HTTP API 获取性能指标。(比如 QPS, Latency AVG/ P99/ P999 等)  ([#872](https://github.com/vesoft-inc/nebula/pull/872), [#1136](https://github.com/vesoft-inc/nebula/pull/1136))
- 支持 Scaling out/in。 ([#421](https://github.com/vesoft-inc/nebula/pull/421), [#444](https://github.com/vesoft-inc/nebula/pull/444), [#795](https://github.com/vesoft-inc/nebula/pull/795), [#881](https://github.com/vesoft-inc/nebula/pull/881), [#998](https://github.com/vesoft-inc/nebula/pull/998))
- Meta client 支持重试, 默认是 3 次. ([#814](https://github.com/vesoft-inc/nebula/pull/814))

### Tools

- 新增 Golang Importer 工具，支持多线程从 CSV 导入数据.

### Change

- 更改了 `storaged` 的配置模板

### Others

- 将 `metad` ,  `storaged`  和 `graphd`  拆到不同 Image 中。增加 Dockerfiles 创建镜像。 ([#923](https://github.com/vesoft-inc/nebula/pull/923))
- 新增 Golang 客户端，将客户端移到各自的 Repositories 下（vesoft-inc/nebula-go 和 vesoft-inc/nebula-java）。

### Coming Soon

- 支持数据 Snapshot, 数据回滚功能
- 增强从 Hive 数据导入功能
- Storage 层支持集群缩容
- 引入 CI/CD

### 附录

最后是 Nebula 的 GitHub 地址，欢迎大家试用，有什么问题可以向我们提 issue。GitHub 地址：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula)； 加入 Nebula Graph 交流群，请联系 Nebula Graph 官方小助手微信号：NebulaGraphbot

### 推荐阅读

- [图数据库 Nebula Graph v.1.0.0-beta 已上线](https://nebula-graph.io/cn/posts/nebula-graph-beta-release-note/)
- [分布式图数据库 Nebula RC2 发布：增强了 CSV Importer 功能](https://nebula-graph.io/cn/posts/nebula-graph-rc2-release-note/)
- [图数据库 Nebula Graph RC3 Release Note](https://nebula-graph.io/cn/posts/nebula-graph-rc3-release-note/)
