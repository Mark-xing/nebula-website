---
title: "一文了解各大图数据库查询语言 | 操作入门篇"
date: 2020-03-03
description: "介于市面上没有统一的图查询语言标准，在本文中我们选取市面上主流的几款图查询语言来分析一波用法"
tags: ["图数据库知识","查询语言"]
author: "清蒸, 张莹, Jude"
---

文章的开头我们先来看下什么是图数据库，根据维基百科的定义：**图数据库是使用图结构进行语义查询的数据库，它使用节点、边和属性来表示和存储数据**。

虽然和关系型数据库存储的结构不同（关系型数据库为表结构，图数据库为图结构），但不计各自的性能问题，关系型数据库可以通过递归查询或者组合其他 SQL 语句（Join）完成图查询语言查询节点关系操作。得益于 1987 年 SQL 成为国际标准化组织（ISO）标准，关系型数据库行业得到了很好的发展。同 60、70 年代的关系型数据库类似，图数据库这个领域的查询语言目前也没有统一标准，虽然 19 年 9 月经过国际 SQL 标准委员会投票表决，决定将图查询语言（Graph Query Language）纳为一种新的数据库查询语言，但 GQL 的制定仍需要一段时间。

![image](https://nebula-blog.azureedge.net/nebula-blog/GraphQueryLanguage01.png)

介于市面上没有统一的图查询语言标准，在本文中我们选取市面上主流的几款图查询语言来分析一波用法，由于篇幅原因本文旨在简单介绍图查询语言和常规用法，更详细的内容将在进阶篇中讲述。

## 图查询语言·介绍

![image](https://nebula-blog.azureedge.net/nebula-blog/GraphQueryLanguage02.png)

### 图查询语言 Gremlin

[Gremlin](https://tinkerpop.apache.org/gremlin.html) 是 Apache ThinkerPop 框架下的图遍历语言。Gremlin 可以是**声明性**的也可以是**命令性**的。虽然 Gremlin 是基于 Groovy 的，但具有许多语言变体，允许开发人员以 Java、JavaScript、Python、Scala、Clojure 和 Groovy 等许多现代编程语言**原生编写 Gremlin 查询**。

支持图数据库：Janus Graph、InfiniteGraph、Cosmos DB、DataStax Enterprise(5.0+)	、Amazon Neptune

### 图查询语言 Cypher

Cypher 是一个描述性的图形查询语言，允许不必编写图形结构的遍历代码对图形存储有表现力和效率的查询，和 SQL 很相似，Cypher 语言的关键字不区分大小写，但是属性值，标签，关系类型和变量是区分大小写的。

支持图数据库： Neo4j、RedisGraph

### 图查询语言 nGQL

[nGQL](https://github.com/vesoft-inc/nebula/blob/master/docs/manual-CN/1.overview/1.concepts/2.nGQL-overview.md) 是一种类 SQL 的声明型的文本查询语言，nGQL 同样是关键词大小写不敏感的查询语言，目前支持模式匹配、聚合运算、图计算，可无嵌入组合语句。

支持图数据库：Nebula Graph

## 图查询语言·术语篇

在比较这 3 个图查询语言之前，我们先来看看他们各自的术语，如果你翻阅他们的文档会经常见到下面这些“关键字”，在这里我们不讲用法，只看这些图数据库常用概念在这 3 个图数据库文档中的叫法。

| 术语 | Gremlin | Cypher | nGQL |
| --- | --- | --- | --- |
| 点 | Vertex | Node | Vertex |
| 边 | Edge | Relationship | Edge |
| 点类型 | Label | Label | Tag |
| 边类型 | label | RelationshipType | edge type |
| 点 ID | vid | id(n) | vid |
| 边 ID | eid | id(r) | 无 |
| 插入 | add | create | insert |
| 删除 | drop | delete | delete / drop |
| 更新属性 | setProperty | set | update |


我们可以看到大体上对点和边的叫法类似，只不过 Cypher 中直接使用了 Relationship 关系一词代表边。其他的术语基本都非常直观。

## 图查询语言·语法篇

了解过 Gremlin、Cypher、nGQL 中常见的术语之后，我们来看看使用这 3 个图查询语言过程中会需要了解的常规语法。

### 图

```shell
# Gremlin 创建图
g = TinkerGraph.open().traversal()

# nGQL 创建图空间
CREATE SPACE gods
```

### 点
图结构由点和边组成，一条边连接两个点。在 Gremlin 和 nGQL 中称之为 Vertex，Cypher 则称之为 Node。如何在图数据库中新建一个点呢？可以参考下面的语法

```shell
# Gremlin 创建/插入点
g.addV(vertexLabel).property()

# Cypher 创建点
CREATE (:nodeLabel {property})

# nGQL 创建/插入点
INSERT VERTEX tagName (propNameList) VALUES vid:(tagKey propValue)
```

#### 点类型

点允许有对应的类型，在 Gremlin 和 Cypher 叫 `label` ，在 nGQL 中为 `tag` 。点类型可对应有多种属性（Property），例如 _Person _可以有 _name_、_age _等属性。

![image](https://nebula-blog.azureedge.net/nebula-blog/GraphQueryLanguage03.png)

##### 创建点类型

点类型相关的语法示例如下：

```shell
# Gremlin 创建点类型
g.addV(vertexLabel).property()

# nGQL 创建点类型
CREATE tagName(PropNameList)
```

这里说明下，无论在 Gremlin 和 nGQL 中存在类似 `IF NOT EXISTS`  用法，即：如果不存在则创建，存在则直接返回。

##### 查看点类型

创建好点之后如何查看点类型呢，可以参考以下方式。 

```shell
# Gremlin 查看（获取）点类型
g.V().label().dedup();

# Cypher 查看点类型方法 1
MATCH (n) 
RETURN DISTINCT labels(n)
# Cypher 查看点类型方法 2
CALL db.labels();

# nGQL 查看点类型
SHOW TAGS
```

#### 点的 CRUD

上面简单介绍了点、点类型，下面进入数据库基本 DML——CRUD，在上文介绍点时顺便介绍了点的创建和插入，这里说下如何插入特定类型的点，和点的获取、删除和更新。

##### 插入特定类型点

和插入点的操作类似，只不过需要指定某种点类型。语法参考：
```shell
# Gremlin 插入特定类型点
g.addV(String vertexLabel).property()

# Cypher 插入特定类型点
CREATE (node:label) 

# nGQL 插入特定类型点
INSERT VERTEX <tag_name> (prop_name_list) VALUES <vid>:(prop_value_list)
```

##### 查看点

```shell
# Gremlin 查看点
g.V(<vid>)

# Cypher 查看点
MATCH (n) 
WHERE condition
RETURN properties(n)

# nGQL 查看点
FETCH PROP ON <tag_name> <vid>
```

##### 删除点

术语篇中提过 nGQL 中删除操作对应单词有 `Delete` 和 `Drop` ，在 nGQL 中 Delete 一般用于点边，Drop 用于 Schema 删除，这点和 SQL 的设计思路是一样的。
```shell
# Gremlin 删除点
g.V(<vid>).drop()

# Cypher 删除点
MATCH (node:label) 
DETACH DELETE node

# nGQL 删除点
DELETE VERTEX <vid>
```

##### 更新点

用数据库的小伙伴都知道数据的常态是数据变更，来瞅瞅这 3 个图查询是使用什么语法来更新点数据的吧

```shell
# Gremlin 更新点
g.V(<vid>).property()

# Cypher 更新点
SET n.prop = V

# nGQL 更新点
UPDATE VERTEX <vid> SET <update_columns>
```

可以看到 Cypher 和 nGQL 都使用 SET 关键词来设置点对应的类型值，只不过 nGQL 中多了 UPDATE 关键词来标识操作，Gremlin 的操作和上文提到的查看点类似，只不过增加了变更 property 值操作。

### 边

在 Gremlin 和 nGQL 称呼边为 Edge，而 Cypher 称之为 Relationship。下面进入到边相关的语法内容

#### 边类型 

和点一样，边也可以有对应的类型

```shell
# Gremlin 创建边类型
g.edgeLabel()

# nGQL 创建边类型
CREATE EDGE edgeTypeName(propNameList)
```

#### 边的 CRUD

说完边类型应该进入到边的常规操作部分了

##### 插入指定边类型的边

可以看到和点的使用语法类似，只不过在 Cypher 和 nGQL 中分别使用 `-[]->` 和 `->` 来表示关系，而 Gremlin 则用 `to()` 关键词来标识指向关系，在使用这 3 种图查询语言的图数据库中的边均为有向边，下图左边为有向边，右边为无向边。

![image](https://nebula-blog.azureedge.net/nebula-blog/GraphQueryLanguage04.png)


```shell
# Gremlin 插入指定边类型的边
g.addE(String edgeLabel).from(v1).to(v2).property()

# Cypher 插入指定边类型的边
CREATE (<node1-name>:<label1-name>)-
  [(<relationship-name>:<relationship-label-name>)]
  ->(<node2-name>:<label2-name>)

# nGQL 插入指定边类型的边
INSERT EDGE <edge_name> (<prop_name_list>) VALUES <src_vid> -> <dst_vid>: \
(<prop_value_list>)
```

##### 删除边

```shell
# Gremlin 删除边
g.E(<eid>).drop()

# Cypher 删除边
MATCH (<node1-name>:<label1-name>)-[r:relationship-label-name]->()
DELETE r

# nGQL 删除边
DELETE EDGE <edge_type> <src_vid> -> <dst_vid>
```

##### 查看指定边

```shell
# Gremlin 查看指定边
g.E(<eid>)

# Cypher 查看指定边
MATCH (n)-[r:label]->()
WHERE condition
RETURN properties(r)

# nGQL 查看指定边
FETCH PROP ON <edge_name> <src_vid> -> <dst_vid>
```

### 其他操作

除了常规的点、边 CRUD 外，我们可以简单看看这 3 种图查询语言的组合查询。

#### 指定点查指定边

```shell
# Gremlin 指定点查指定边
g.V(<vid>).outE(<edge>)

# Cypher 指定点查指定边
Match (n)->[r:label]->[]
WHERE id(n) = vid
RETURN r

# nGQL 指定点查指定边
GO FROM <vid> OVER <edge>
```

#### 沿指定点反向查询指定边

在反向查询中，Gremlin 使用了 in 来表示反向关系，而 Cypher 则更直观的将指向箭头反向变成 `<-` 来表示反向关系，nGQL 则用关键词 `REVERSELY` 来标识反向关系。
```shell
# Gremlin 沿指定点反向查询指定边
g.V(<vid>).inE(<edge>)

# Cypher 沿指定点反向查询指定边
MATCH (n)<-[r:label]-()

# nGQL 沿指定点反向查询指定边
GO FROM <vid> OVER <edge> REVERSELY
```

#### 无向遍历

如果在图中，边的方向不重要（正向、反向都可以），那 Gremlin 使用 `both()` ，Cypher 使用 `-[]-` ，nGQL使用关键词 `BIDIRECT` 。

```shell
# Traverse edges with specified vertices Gremlin
g.V(<vid>).bothE(<edge>)

# Traverse edges with specified vertices Cypher
MATCH (n)-[r:label]-()

# Traverse edges with specified vertices nGQL
GO FROM <vid>  OVER <edge> BIDIRECT
```

#### 沿指定点查询指定边 N 跳

Gremlin 和 nGQL 分别用 times 和 step 来表示 N 跳关系，而 Cypher 用 `relationship*1..N` 来表示 N 跳关系。
```shell
# Gremlin 沿指定点查询指定边 N 跳
g.V(<vid>).repeat(out(<edge>)).times(N)

# Cypher 沿指定点查询指定边 N 跳
MATCH (n)-[r:label*N]->()
WHERE condition
RETURN r

# nGQL 沿指定点查询指定边 N 跳
GO N STEPS FROM <vid> OVER <edge>
```

#### 返回指定两点路径

```shell
# Gremlin 返回指定两点路径
g.V(<vid>).repeat(out()).until(<vid>).path()

# Cypher 返回指定两点路径
MATCH p =(a)-[.*]->(b)
WHERE condition
RETURN p

# nGQL 返回指定两点路径
FIND ALL PATH FROM <vid> TO <vid> OVER *
```

## 图查询语言·实操篇

说了一通语法之后，是时候展示真正的技术了——来个具体一点的例子。

### 示例图：The Graphs of Gods

实操示例使用了 [Janus Graph](https://janusgraph.org/) 的示例图 [_The Graphs of Gods_](https://docs.janusgraph.org/#getting-started)。该图结构如下图所示，描述了罗马万神话中诸神关系。

![image](https://nebula-blog.azureedge.net/nebula-blog/GraphQueryLanguage05.png)

### 插入数据

```bash
# 插入点
## nGQL
nebula> INSERT VERTEX character(name, age, type) VALUES hash("saturn"):("saturn", 10000, "titan"), hash("jupiter"):("jupiter", 5000, "god");
## Gremlin
gremlin> saturn = g.addV("character").property(T.id, 1).property('name', 'saturn').property('age', 10000).property('type', 'titan').next();
==>v[1]
gremlin> jupiter = g.addV("character").property(T.id, 2).property('name', 'jupiter').property('age', 5000).property('type', 'god').next();
==>v[2]
gremlin> prometheus = g.addV("character").property(T.id, 31).property('name',  'prometheus').property('age', 1000).property('type', 'god').next();
==>v[31]
gremlin> jesus = g.addV("character").property(T.id, 32).property('name',  'jesus').property('age', 5000).property('type', 'god').next();
==>v[32]
## Cypher
cypher> CREATE (src:character {name:"saturn", age: 10000, type:"titan"})
cypher> CREATE (dst:character {name:"jupiter", age: 5000, type:"god"})

# 插入边
## nGQL
nebula> INSERT EDGE father() VALUES hash("jupiter")->hash("saturn"):();
## Gremlin
gremlin> g.addE("father").from(jupiter).to(saturn).property(T.id, 13);
==>e[13][2-father->1]
## Cypher
cypher> CREATE (src)-[rel:father]->(dst)
```

### 删除数据

```bash
# nGQL
nebula> DELETE VERTEX hash("prometheus");
# Gremlin
gremlin> g.V(prometheus).drop();
# Cypher
cypher> MATCH (n:character {name:"prometheus"}) DETACH DELETE n 
```

### 更新数据

```bash
# nGQL
nebula> UPDATE VERTEX hash("jesus") SET character.type = 'titan';
# Gremlin
gremlin> g.V(jesus).property('age', 6000);
==>v[32]
# Cypher
cypher> MATCH (n:character {name:"jesus"}) SET n.type = 'titan';
```

### 查看数据

```bash
# nGQL
nebula> FETCH PROP ON character hash("saturn");
===================================================
| character.name | character.age | character.type |
===================================================
| saturn         | 10000         | titan          |
---------------------------------------------------
# Gremlin
gremlin> g.V(saturn).valueMap();
==>[name:[saturn],type:[titan],age:[10000]]
# Cypher
cypher> MATCH (n:character {name:"saturn"}) RETURN properties(n)
  ╒════════════════════════════════════════════╕
  │"properties(n)"                             │
  ╞════════════════════════════════════════════╡
  │{"name":"saturn","type":"titan","age":10000}│
  └────────────────────────────────────────────┘
```

### 查询 hercules 的父亲

```bash
# nGQL
nebula>  LOOKUP ON character WHERE character.name == 'hercules' | \
      -> GO FROM $-.VertexID OVER father YIELD $$.character.name;
=====================
| $$.character.name |
=====================
| jupiter           |
---------------------
# Gremlin
gremlin> g.V().hasLabel('character').has('name','hercules').out('father').values('name');
==>jupiter
# Cypher
cypher> MATCH (src:character{name:"hercules"})-[:father]->(dst:character) RETURN dst.name
      ╒══════════╕
      │"dst.name"│
      ╞══════════╡
      │"jupiter" │
      └──────────┘
```

### 查询 hercules 的祖父

```bash
# nGQL
nebula> LOOKUP ON character WHERE character.name == 'hercules' | \
     -> GO 2 STEPS FROM $-.VertexID OVER father YIELD $$.character.name;
=====================
| $$.character.name |
=====================
| saturn            |
---------------------
# Gremlin
gremlin> g.V().hasLabel('character').has('name','hercules').out('father').out('father').values('name');
==>saturn
# Cypher
cypher> MATCH (src:character{name:"hercules"})-[:father*2]->(dst:character) RETURN dst.name
      ╒══════════╕
      │"dst.name"│
      ╞══════════╡
      │"saturn"  │
      └──────────┘
```

### 查询年龄大于 100 的人物

```bash
# nGQL
nebula> LOOKUP ON character WHERE character.age > 100 YIELD character.name, character.age;
=========================================================
| VertexID             | character.name | character.age |
=========================================================
| 6761447489613431910  | pluto          | 4000          |
---------------------------------------------------------
| -5860788569139907963 | neptune        | 4500          |
---------------------------------------------------------
| 4863977009196259577  | jupiter        | 5000          |
---------------------------------------------------------
| -4316810810681305233 | saturn         | 10000         |
---------------------------------------------------------
# Gremlin
gremlin> g.V().hasLabel('character').has('age',gt(100)).values('name');
==>saturn
==>jupiter
==>neptune
==>pluto
# Cypher
cypher> MATCH (src:character) WHERE src.age > 100 RETURN src.name
      ╒═══════════╕
      │"src.name" │
      ╞═══════════╡
      │  "saturn" │
      ├───────────┤
      │ "jupiter" │
      ├───────────┤
      │ "neptune" │
      │───────────│
      │  "pluto"  │
      └───────────┘
```

### 从一起居住的人物中排除 pluto 本人

```bash
# nGQL
nebula>  GO FROM hash("pluto") OVER lives YIELD lives._dst AS place | GO FROM $-.place OVER lives REVERSELY WHERE \
$$.character.name != "pluto" YIELD $$.character.name AS cohabitants;
===============
| cohabitants |
===============
| cerberus    |
---------------
# Gremlin
gremlin> g.V(pluto).out('lives').in('lives').where(is(neq(pluto))).values('name');
==>cerberus
# Cypher
cypher> MATCH (src:character{name:"pluto"})-[:lives]->()<-[:lives]-(dst:character) RETURN dst.name
      ╒══════════╕
      │"dst.name"│
      ╞══════════╡
      │"cerberus"│
      └──────────┘
```

### Pluto 的兄弟们

```bash
# which brother lives in which place?
## nGQL
nebula> GO FROM hash("pluto") OVER brother YIELD brother._dst AS god | \
GO FROM $-.god OVER lives YIELD $^.character.name AS Brother, $$.location.name AS Habitations;
=========================
| Brother | Habitations |
=========================
| jupiter | sky         |
-------------------------
| neptune | sea         |
-------------------------
## Gremlin
gremlin> g.V(pluto).out('brother').as('god').out('lives').as('place').select('god','place').by('name');
==>[god:jupiter, place:sky]
==>[god:neptune, place:sea]
## Cypher
cypher> MATCH (src:Character{name:"pluto"})-[:brother]->(bro:Character)-[:lives]->(dst)
RETURN bro.name, dst.name
      ╒═════════════════════════╕
      │"bro.name"    │"dst.name"│
      ╞═════════════════════════╡
      │ "jupiter"    │  "sky"   │
      ├─────────────────────────┤
      │ "neptune"    │ "sea"    │
      └─────────────────────────┘
```

## 推荐阅读

- [聊聊图数据库和图数据库的小知识](https://nebula-graph.io/cn/posts/graph-database-knowledge-volume-1/)
- [Nebula Graph 技术总监陈恒：图数据库怎么和深度学习框架进行结合？](https://nebula-graph.io/cn/posts/integrate-graph-database-with-deep-learning-framework/)
- [聊聊图数据库和图数据库的小知识 Vol.02](https://nebula-graph.io/cn/posts/graph-database-knowledge-volume-2/)
- [图数据库爱好者的聚会在谈论什么？](https://nebula-graph.io/cn/posts/graph-database-fans-chat/)