---
title: "图数据库爱好者的聚会在谈论什么？"
date: 2019-09-12
description: "本次分享主要介绍了 Nebula Graph 的特性，以及新上线的[《使用 Docker 构建 Nebula Graph》"
---

# 图数据库爱好者的聚会在谈论什么？

![graph database](https://nebula-blog.azureedge.net/nebula-blog/FansChat01.png)

> [Nebula Graph](https://github.com/vesoft-inc/nebula)：一个开源的分布式图数据库。作为唯一能够存储万亿个带属性的节点和边的在线图数据库，Nebula Graph 不仅能够在高并发场景下满足毫秒级的低时延查询要求，还能够实现服务高可用且保障数据安全性。

### 聚会概述

在上周六的聚会中，Nebula Graph Committer 吴敏给爱好者们介绍了整体架构和特性，并随后被各位大佬~~轮番蹂躏~~（划掉）。

本次分享主要介绍了 Nebula Graph 的特性，以及新上线的[《使用 Docker 构建 Nebula Graph》](https://zhuanlan.zhihu.com/p/81316517)功能。

下面是现场的 Topic ( 以下简称：T ) & Discussion ( 以下简称：D ) 速记：

### 讨论话题目录

- 算法和语言
    - 图库的 builtin 只搞在线查询可以吗？有必要搞传播算法和最短路径吗？Nebula 怎么实现对图分析算法的支持？
    - 为什么要新开发一种查询语言 nGQL？做了哪些优化？
    - 对于超大点，有啥优化的办法吗，或者对于构图有什么建议嘛？
    - 图库相比其它系统和数据库未来发展趋势，比如相比文档和关系型，它的核心价值是什么？
- 架构和工程
    - key 为什么选择用 hash 而不是 range？
    - gRPC，bRPC，fbthrift 为什么这么选 rpc？有没有打算自己写一个？
    - 图库在设计上趋同化和同质化，架构上还有哪些创新值得尝试？
- 关于生态
    - 图的生态怎么打造？和周边其它系统怎么集成融合？

#### 算法和语言

🙋 T: 图库的 builtin 只搞在线查询可以吗？有必要搞传播算法和最短路径吗？Nebula 怎么实现对图分析算法的支持？

🎙️D：Nebula 目前阶段侧重 OLTP，现在支持的算法是 `全路径` 和 `最短路径` 。在图库 builtin LPA 有不少工作要做（当然其实市面上也有产品），Nebula 现阶段的考虑是采用 `存储计算分离架构` ，用户可以将图结构或者子图抽取到 GraphX 这种图计算框架，在图计算框架中实现传播算法。如果 OLTP 这块工作完成比较多了，再考虑向 OLAP 这个方向走。

🙋 T：为什么要新开发一种查询语言 nGQL？做了哪些优化？

🎙️ D：其实目前市场上没有统一的图查询语言，可能 Cypher 和 Gremlin 影响力要大一些，当然要说图语言类的其实更多，比如还有 GraphQL，SPARQL。nGQL 与 SQL 接近，比较容易上手，但不用 SQL 那样嵌套（embedding)。

我感觉描述性的语言，大家的总体风格还是挺类似的，上手学习成本其实真没有想象那么高，花个十几分钟看看大概也明白了。有点类似中国各地方言（~~温州话~~除外，划掉），或者欧洲的各语言，共通的部分挺多的，连蒙带猜基本也能用。当然特别复杂的逻辑还是得看看手册才行。

优化方面：为避免存储层将过多数据回传到计算层，占用宝贵带宽，Nebula 做了 `计算下沉` ，条件过滤会随查询条件一同下发到存储层节点。如果不带这个过滤，传 100% 和 1% 的数据，性能是数量级的差异。

对图查询的执行计划优化也进行了一定的探索，包括 `执行计划缓存` 和上下文无关语句的 `并发执行` 。当然其实查询优化挺难做的，我感觉 `更能有效提升速度的是如何构图` 。因为图的自由度还是挺大的，同一个东西，其实既可以构图成点、边也可以做成属性，其实对大多数目前的使用者来说，构图对性能的影响应该会比 DB 优化更明显更快。当然构图其实是和 DB 怎么实现也挺有关系的，比如减少网络传输（比如过滤）、用好 SSD 和 cache（比如减少随机读）、增加各种并发（多线程、多机）。

还有不要构造一个超大点出来，不然热点太明显了。回到语言，我们也考虑是不是 nGQL 上面加一层 Driver 支持 Cypher 和 Gremlin，比如 80% 的常见功能。还有就是考虑在 webconsole 上增加一些流程图的功能模块，CRUD 操作用图形化支持，复杂的就写 query，对长尾用户上手也有帮助。

🙋 T：刚才聊到超大点，有啥优化的办法吗，或者对于构图有什么建议嘛？

🎙️ D：对于超大点建议还是构图和查询时，想办法处理（分解）比较好，这个和 SQL 分库分表差不多。比如：遍历过程中 touch 到的交易对手很大（比如：美团），那最好能给这种大点打标，遍历时候过滤掉。当然打标可能要离线 count 一下才知道。

比方说，根据业务类型、时间片段，把一个超大点最好能拆成多个小点，这样操作点一般不会落在一个 partition 上，再把当中热点的 partition 迁移到不同的机器上。举例来说，遍历太深的话，通常性能都不会太好，所以可以把属性放在起点和终点上。像 ` (Subject1)->(Predicate1)->(Object1) ` 这样， (Subject1)、(Predicate1)、(Object1) 三个节点，两跳深度，可能要走一次网络，但改成 `(Subject1)-[Predicate1]->(Object1) ` 这样 `-[Predicate1]->`  改成一种类型的边，那就不走网络，特别当查询深度更深时，这种构图对性能优化很明显。类似的，还有属性值处理，如：起点的 Name(string)，不要作为边属性，不然同一个点出去的所有边上都冗余了这个 Name(string)，更新的时候也巨麻烦。

🙋 T：图库相比其它系统和数据库未来发展趋势，比如相比文档和关系型，它的核心价值是什么？

🎙️ D: `Everything is connected.` 图数据库天生适合表达 connection，或者说多对多的关系。

图数据库可以很高效的查询几度关系，而传统关系型数据库不擅长，一般都需要做表连接，表连接是一个很昂贵的操作，涉及到大量的 IO 操作及内存消耗。

但我觉得其实文档、关系和图相互还是借鉴非常多的，我记得《DesigningData-Intensive Applications》里面有章就是做它们之间的比较。

#### 架构和工程

🙋 T：key 为什么选择用 hash 而不是 range？

🎙️ D：其实并不是一定要 hash，只是要求 vid 是定长的 64 bit。定长主要是出于对齐性能考虑，还可以用上 prefix bloomfilter。那么变长 id 一般 hash 成 64 bit 最简单，当然用户自己指定 vid 也是支持的，一般这个时候，需要把原始 id 放到点的属性里。

🙋 T：gRPC，bRPC，fbthrift 为什么这么选 rpc？有没有打算自己写一个？

🎙️ D：从使用体验上看，fbthrift 易读性不错。gRPC 之前用过也挺多。当然写个好的 rpc 还是挺不容易的，这个轮子暂时不是很急迫。

🙋 T：图库在设计上趋同化和同质化，架构上还有哪些创新值得尝试？

🎙️ D：其实图产品有很多，我觉得这些产品不能说都是趋同，毕竟从几个知名竞品的架构看，彼此之间相差还是蛮大的 :)。因为功能集和架构出发点主要还是针对业务目标，Nebula 设计目标是实现 `万亿级别关联关系` 和 `大并发` `低时延` ，所以选择了存储计算分离，存储层采用 raft 一致协议，数据 partition 到不同机器上。这样设计主要考虑到存储和计算两者的业务特点和增长速度不一样，比如 learner 可以拿来给一些 throughput 优先的场景使用，原集群给 latency 优先的场景使用。

说到大的架构创新，主要看长期的硬件更新速度。当然 DB 可做的优化的事情已经很多的，刚才 PPT 里面有提及。

🙋 T：在测试方面，Nebula 做了哪些工作？

🎙️ D：一个是集成测试框架，包括 `混沌工程` 、 `错误注入` 这些，等完善之后也会开放出来。还有是关于测试集和数据集，对于 DB 来说，这部分的价值是最大的，不过图领域可参考的数据集较少，都是大家自己积累的。

#### 关于生态

🙋 T：图的生态怎么打造？和周边其它系统怎么集成融合？

🎙️ D：在查询语言方面，增加对 Gremlin、Cypher 的支持。

在工具方面，提供数据批量导入和导出的工具，比如 GraphX，Yarn，Spark 等。还有，就是对机器学习的需求支持，存储计算相分离的架构使得 Nebula 非常容易集成图计算框架。因为 Nebula 是开源产品，这些工具欢迎大家一起参与:)

> Nebula Graph：一个开源的分布式图数据库。

> GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula)

> 知乎：https://www.zhihu.com/org/nebulagraph/posts

> 微博：https://weibo.com/nebulagraph

