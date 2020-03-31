---
title: "图数据库 Nebula Graph RC3 Release Note"
date: 2020-02-07
description: "本次 RC3 主要新增 dump_tools 工具，导出指定条件的数据；发布 GUI 工具 Nebula Graph Studio；新增扫描点边接口，对接 OLAP…"
tags: ["Release-Note"]
author: Jude
---

![Release note](https://nebula-blog.azureedge.net/nebula-blog/RC301.png)

本次 RC3 主要新增 `dump_tools` 工具，导出指定条件的数据；发布 GUI 工具 Nebula Graph Studio，支持可视化探索，数据导入等功能；新增扫描点边接口，对接 OLAP。

## Query engine

- 支持获取给定点的全部属性 [#1486](https://github.com/vesoft-inc/nebula/pull/1486)
- 新增 `DELETE EDGE` ， 删除指定点 [#1063](https://github.com/vesoft-inc/nebula/pull/1063)
- 支持 `IF EXISTS` ，可防止删除不存在 tag/edgetype 的错误 [#1505](https://github.com/vesoft-inc/nebula/pull/1505)
- 支持 `IF NOT EXISTS` ，可防止创建已存在 space/tag/edgetype 的错误 [#1379](https://github.com/vesoft-inc/nebula/pull/1379)
- 输出 graphd metrics [#1451](https://github.com/vesoft-inc/nebula/pull/1451)

## Storage

- 对于 OLAP，storage 新增扫描点边接口  [#1381](https://github.com/vesoft-inc/nebula/pull/1381)
- 配置支持更改 `heartbeat_interval_secs` ，Meta 客户端上报心跳的时间间隔 [#1540](https://github.com/vesoft-inc/nebula/pull/1540)
- 本地测试时，支持使用本地 gflags 配置，而非去 meta 上获取，避免本地修改参数没起作用的问题 [#1411](https://github.com/vesoft-inc/nebula/pull/1411)
- 增强了 balancer，balance 的每个步骤加入了检查. [#1378](https://github.com/vesoft-inc/nebula/pull/1378)
- 支持对整个集群创建快照 #1199 [#1372](https://github.com/vesoft-inc/nebula/pull/1372)
- 优化过滤条件下推 [#947](https://github.com/vesoft-inc/nebula/pull/947)
- 每个 raft group 支持从 leader/follow 读取数据或只从 leader 读取数据 [#1363](https://github.com/vesoft-inc/nebula/pull/1363)
- Storage / Meta Clients 增加了超时时间设置，可通过 meta_client_timeout_ms 配置，默认 60s [#1399](https://github.com/vesoft-inc/nebula/pull/1399)

## Build

- 极大的简化了编译流程，支持 2.6.32 以上内核的绝大部分 Linux 系统 [#1332](https://github.com/vesoft-inc/nebula/pull/1332)

## Index

- 支持对点边的属性建立索引，显示所有索引，查看索引详情、删除索引等操作 [#1459 ](https://github.com/vesoft-inc/nebula/pull/1459) [#1360](https://github.com/vesoft-inc/nebula/pull/1360)

## Tools

- `dump_tools` , 一个单机离线数据导出工具，可以用于导出或统计指定条件的数据. [#1479](https://github.com/vesoft-inc/nebula/pull/1479)  [#1554](https://github.com/vesoft-inc/nebula/pull/1554)
- `Spark Writer` 采用异步客户端，新增对 hash、uuid 的支持，支持从不同数据源导入数据 [#1405](https://github.com/vesoft-inc/nebula/pull/1405) [#1512](https://github.com/vesoft-inc/nebula/pull/1512)
- `Spark Writer` 支持配置 Spark partition，Partition的数量决定了task的数量，影响着程序的并行度 [#1412](https://github.com/vesoft-inc/nebula/pull/1412)

## UI

- Nebula Graph Studio 是 Nebula GUI 工具。支持可视化图探索；含有语法高亮功能的编辑器，能帮助用户快速地设计查询，结构化的方式查看结果；支持可视化数据导入。图形界面工具地址（包含文档和部署配置文件）公测地址：[https://github.com/vesoft-inc/nebula-web-docker](https://github.com/vesoft-inc/nebula-web-docker)


## Coming soon

- 功能
  - profiling
  - execution plan
  - 子图
  - bidirectional query
  - clone space schema info
  - 支持更多 OLAP Interface
  - 权限管理
  - sampling
- Tools
  - 容器部署
- 增强 Nebula Graph Studio 功能

最后是 Nebula 的 GitHub 地址，欢迎大家试用，有什么问题可以向我们提 issue。GitHub 地址：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github)；加入 Nebula Graph 交流群，请联系 Nebula Graph 官方小助手微信号：NebulaGraphbot

## 推荐阅读

- [图数据库 Nebula Graph v.1.0.0-beta 已上线](https://nebula-graph.io/cn/posts/nebula-graph-beta-release-note/)
- [图数据库 Nebula Graph RC1 Release Note](https://nebula-graph.io/cn/posts/nebula-graph-rc1-release-note/)
- [分布式图数据库 Nebula RC2 发布：增强了 CSV Importer 功能](https://nebula-graph.io/cn/posts/nebula-graph-rc2-release-note/)