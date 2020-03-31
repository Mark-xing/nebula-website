---
title: "分布式图数据库 Nebula RC2 发布：增强了 CSV Importer 功能 "
date: 2019-12-05
description: "本次 RC2 主要新增 GO FROM ... REVERSELY 和 GROUP BY 等语句，Storage Engine 也更灵活…"
tags: ["Release-Note"]
author: Jude
---

![r2](https://nebula-blog.azureedge.net/nebula-blog/RC201.png)

> Nebula Graph 是开源的分布式图数据库，可应用于知识图谱、社交推荐、风控、IoT 等场景。

本次 RC2 主要新增 `GO FROM ... REVERSELY` 和 `GROUP BY` 等语句，Storage Engine 也更灵活，用户可以通过 Console 或 Http 获取配置信息，触发 compaction；客户端目前支持 Python，Java，Go；在工具方面，增强了 CSV Importer 功能

## Query Engine

- 支持 `GROUP BY` 语句用于聚合函数，根据一个或多个属性对结果集进行分组。 [#749](https://github.com/vesoft-inc/nebula/issues/749)
- `UPDATE CONFIGS` 增加对表达式的支持 [#1273](https://github.com/vesoft-inc/nebula/issues/1273)
- 支持通过 Console 更改日志级别 [#1273](https://github.com/vesoft-inc/nebula/issues/1273)
- 新增 “IF...RETURN...”，条件成立时返回对应结果，提供一定的 **if else** 逻辑能力 [#1233](https://github.com/vesoft-inc/nebula/issues/1233) 、[#1246](https://github.com/vesoft-inc/nebula/issues/1246)
- `String`  数据类型支持无限长度 [#1103](https://github.com/vesoft-inc/nebula/issues/1103)
- 插入点边时，和 SQL一样，允许按用户输入的属性名顺序来插入（而不是 Schema 的属性名顺序）[#1219](https://github.com/vesoft-inc/nebula/issues/1219)
- `Tag/Edgetype` 属性支持设置默认值 [#860](https://github.com/vesoft-inc/nebula/issues/860)
- 新增 `GO FROM ... REVERSELY` ，查询反向关系 [#1349](https://github.com/vesoft-inc/nebula/issues/1349)

## Storage

- 新增 `SHOW PARTS` 获取当前 SPACE 的 partition 详情 [#1086](https://github.com/vesoft-inc/nebula/issues/1086)
- 新增 `BALANCE STOP` 暂停 load balance [#1238](https://github.com/vesoft-inc/nebula/issues/1238)
- 支持通过手动触发 RocksDB compaction 和 flush [#677](https://github.com/vesoft-inc/nebula/issues/677)、[ #1240](https://github.com/vesoft-inc/nebula/issues/1240)
- RocksDB 默认 `BlockBasedTable` 大小从 4 MB 改成 1024 MB [#1248](https://github.com/vesoft-inc/nebula/issues/1248)
- gflags 中新增 `max_edge_returned_per_vertex` 选项，限制超级顶点返回边数量 [#1221](https://github.com/vesoft-inc/nebula/issues/1221)
- Storage 增加对点的缓存[ #1294](https://github.com/vesoft-inc/nebula/issues/1294) [#1268](https://github.com/vesoft-inc/nebula/issues/1268)
- 升级依赖库 folly、fbthrift [#1161](https://github.com/vesoft-inc/nebula/issues/1161)

## Tools

- 优化 CSV Importer，新增 CSV Importer 镜像，用户可以使用 Docker 导入 CSV 数据，详情请见 [https://github.com/vesoft-inc/nebula-importer](https://github.com/vesoft-inc/nebula-importer)

## Client

- 新增 Python 客户端，已上传 PyPI，使用及示例请参见 [https://github.com/vesoft-inc/nebula-python](https://github.com/vesoft-inc/nebula-python)
- Golang 客户端，使用及示例请参见 [https://github.com/vesoft-inc/nebula-go](https://github.com/vesoft-inc/nebula-go)
- Java 客户端上传官方 Repo，使用及示例参见 [https://github.com/vesoft-inc/nebula-java](https://github.com/vesoft-inc/nebula-java)

## Changed/Removed

- 命令 `ADD/REMOVE HOSTS` 不再支持，hosts 会被自动发现，用户不再需要手动添加

## RC3 Roadmap

- Query Engine
  - 子图
- Storage
  - Snapshot
  - 索引
  - Remove / Scan Interface
  - Jepsen
- Tools
  - DumpTool
- Test Framework
  - 回归测试
  - 混沌测试
- UI
  - 查询
  - CSV 数据导入
  - Hash 工具
  - Graph Exploration


最后是 Nebula 的 GitHub 地址，欢迎大家试用，有什么问题可以向我们提 issue。GitHub 地址：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula)；加入 Nebula Graph 交流群，请联系 Nebula Graph 官方小助手微信号：NebulaGraphbot

## 推荐阅读

- [图数据库 Nebula Graph v.1.0.0-beta 已上线](https://nebula-graph.io/cn/posts/nebula-graph-beta-release-note/)
- [图数据库 Nebula Graph RC1 Release Note](https://nebula-graph.io/cn/posts/nebula-graph-rc1-release-note/)
- [图数据库 Nebula Graph RC3 Release Note](https://nebula-graph.io/cn/posts/nebula-graph-rc3-release-note/)