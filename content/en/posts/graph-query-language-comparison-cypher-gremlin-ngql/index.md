---
title: "Graph Query Language Comparison Series - Gremlin vs Cypher vs nGQL"
date: 2020-03-03
description: "Graph users have to learn different graph query languages using different graph databases due to the lack of international standard of the graph query language. Check this post out for a comparison of the basic operations among Cypher, Gremlin, and nGQL."
author: "Steam, Amber, Jude"
tags: ["Graph-Database", "Graph-Query-Language"]
---

In September 2019, [Graph Query Language](https://www.gqlstandards.org/home) is accepted as a new database query language in a vote by the International SQL Standards Committee, the unification of GQL takes time.  

![image](https://user-images.githubusercontent.com/38887077/75741236-f357d380-5d44-11ea-8c43-65283b49bbef.png)

In this post, we've selected some mainstream graph query languages and compared the CRUD usage in these languages respectively.

## Which Graph Query Languages to Be Compared

![image](https://user-images.githubusercontent.com/38887077/75741240-f5ba2d80-5d44-11ea-80f6-f44d39fff43a.png)

### Gremlin

[Gremlin](https://tinkerpop.apache.org/gremlin.html) is a graph traversal language developed by Apache TinkerPop and has been adopted by a lot of graph database solutions. It can be either **declarative** or **imperative**.

Gremlin is Groovy-based, but has many language variants that allow developers to **write Gremlin queries natively** in many modern programming languages such as Java, JavaScript, Python, Scala, Clojure and Groovy.

**Supported graph databases**: Janus Graph, InfiniteGraph, Cosmos DB, DataStax Enterprise(5.0+) and Amazon Neptune.

### Cypher

[Cypher](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=13&cad=rja&uact=8&ved=2ahUKEwi5-ZfEtfvnAhWSad4KHTDpClwQFjAMegQIBRAB&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCypher&usg=AOvVaw3rCtDns3Bbr5mIuBpSN4hr) is a declarative graph query language that allows expressive and efficient data querying in a property graph.

The language was designed with the power and capability of SQL. The keywords of the Cypher language are not case sensitive, but attributes, labels, relationship types and variables are case sensitive.

**Supported graph databases**: Neo4j, AgensGraph and RedisGraph

### nGQL

**Nebula Graph** introduces its own query language, [nGQL](https://github.com/vesoft-inc/nebula/blob/master/docs/manual-EN/1.overview/1.concepts/2.nGQL-overview.md), which is a declarative, textual query language like SQL, but designed for graphs.

The keywords of the nGQL language are case sensitive and it support statement composition so that there's no need for statement embedding.

**Support graph databases**: Nebula Graph

## Terms Comparison

Before comparing the three graph query languages, let's take a look at their terms and concepts first. The table below explains how these languages define nodes and edges:

| Graph Terms | Gremlin | Cypher | nGQL |
| --- | --- | --- | --- |
| Vertex | Vertex | Node | Vertex |
| Edge | Edge | Relationship | Edge |
| Vertex Type | Label | Label | Tag |
| Edge Type | label | RelationshipType | edge type |
| Vertex ID | vid | id(n) | vid |
| Edge ID | eid | id(r) | \ |
| Insert | add | create | insert |
| Delete | drop | delete | delete / drop |
| Update | setProperty | set | update |


## Syntax Comparison - CRUD

After understanding the common terms in Gremlin, Cypher, and nGQL, let's take a look at the general syntax of these graph query languages.

This section will walk you through the basic CRUD syntax for Gremlin, Cypher and nGQL respectively.

### Graph
Refer to the following example on how to create a graph space. We omitted Cypher since you don't need to create a graph space before you can add any data to the graph databases.

```shell
# Create a graph that Gremlin can traverse
g = TinkerGraph.open().traversal()

# Create a graph space in nGQL
CREATE SPACE gods
```

### Vertex

We all know that graph consists of nodes and edges. A node in Cypher is called a vertex in Gremlin and nGQL. And an edge is the connection among two nodes.

Refer to the following example on inserting new vertex in these query languages respectively.

```shell
# Insert vertex in Gremlin
g.addV(vertexLabel).property()

# Insert vertex in Cypher
CREATE (:nodeLabel {property})

# Insert vertex in nGQL
INSERT VERTEX tagName (propNameList) VALUES vid:(tagKey propValue)
```

#### Vertex Type

The nodes/vertices can have types. They are called `labels` in Gremlin and Cypher , and `tags` in nGQL.

A vertex type can have multiple properties. For example, vertex type _Person_ have two properties, i.e. _name_ and _age_.

![image](https://user-images.githubusercontent.com/38887077/75741241-f8b51e00-5d44-11ea-8a39-b02a88de44a3.png)

##### Create Vertex Type

Refer to the following example on vertex type creation. We omitted Cypher since you don't need a label before inserting data.

```shell
# Create vertex type in Gremlin
g.addV(vertexLabel).property()

# Create vertex type in nGQL
CREATE tagName(PropNameList)
```

Note that Gremlin and nGQL both support `IF NOT EXISTS`. This keyword automatically detects if the corresponding vertex type exists. If it does not exist, a new one is created. Otherwise, no vertex type is created.

##### Show Vertex Types

When the vertex types are created, you can show them with the following queries. They will list all the labels/tags rather than certain labels/tags.

```shell
# Show vertex types in Gremlin
g.V().label().dedup();

# Show vertex types in Cypher method 1
MATCH (n) 
RETURN DISTINCT labels(n)
# Show vertex types in Cypher method 2
CALL db.labels();

# Show vertex types in nGQL
SHOW TAGS
```

#### CRUD on Vertices

This section introduces the basic CRUD operations on vertices using the three query languages.

##### Insert Vertices

```shell
# Insert vertex of certain type in Gremlin
g.addV(String vertexLabel).property()

# Insert vertex of certain type in Cypher
CREATE (node:label) 

# Insert vertex of certain type in nGQL
INSERT VERTEX <tag_name> (prop_name_list) VALUES <vid>:(prop_value_list)
```

##### Get Vertices

```shell
# Fetch vertices in Gremlin
g.V(<vid>)

# Fetch vertices in Cypher
MATCH (n) 
WHERE condition
RETURN properties(n)

# Fetch vertices in nGQL
FETCH PROP ON <tag_name> <vid>
```

##### Delete Vertices

```shell
# Delete vertex in Gremlin
g.V(<vid>).drop()

# Delete a vertex in Cypher
MATCH (node:label) 
DETACH DELETE node

# Delete vertex in nGQL
DELETE VERTEX <vid>
```

##### Update a Vertex's Property

This section shows you how to update properties for vertex.

```shell
# Update vertex in Gremlin
g.V(<vid>).property()

# Update vertex in Cypher
SET n.prop = V

# Update vertex in nGQL
UPDATE VERTEX <vid> SET <update_columns>
```

Both Cypher and nGQL use keyword `SET` to set the vertex type, except that the `UPDATE` keyword is added in nGQL to identify the operation. The operation of Gremlin is similar to the above-mentioned fetching vertex, except that it adds operations for changing property.

### Edges

This section introduces the basic CRUD operations on edges.

#### Edge Types

Like vertices, edges can also have types.

```shell
# Create an edge type in Gremlin
g.edgeLabel()

# Create an edge type in nGQL
CREATE EDGE edgeTypeName(propNameList)
```

#### CRUD on Edges

##### Insert Edges of Certain Types

Inserting an edge is similar to inserting vertices. Cypher  uses `-[]->` and and nGQL uses `->` to represent edges respectively. Gremlin uses the keyword `to()` to indicate edge direction.

Edges are by default directed in the three languages. The chart on the left below is a directed edge while the one on the right is an undirected edge.

![image](https://user-images.githubusercontent.com/38887077/75741248-fbb00e80-5d44-11ea-9c80-0c11fd41a277.png)

```shell
# Insert edge of certain type in Gremlin
g.addE(String edgeLabel).from(v1).to(v2).property()

# Insert edge of certain type in Cypher
CREATE (<node1-name>:<label1-name>)-
  [(<relationship-name>:<relationship-label-name>)]
  ->(<node2-name>:<label2-name>)

# Insert edge of certain type in nGQL
INSERT EDGE <edge_name> ( <prop_name_list> ) VALUES <src_vid> -> <dst_vid>: ( <prop_value_list> )
```

##### Delete Edges

```shell
# Delete edge in Gremlin
g.E(<eid>).drop()

# Delete edge in Cypher
MATCH (<node1-name>:<label1-name>)-[r:relationship-label-name]->()
DELETE r

# Delete edge in nGQL
DELETE EDGE <edge_type> <src_vid> -> <dst_vid>
```

##### Fetch Edges

```shell
# Fetch edges in Gremlin
g.E(<eid>)

# Fetch edges in Cypher
MATCH (n)-[r:label]->()
WHERE condition
RETURN properties(r)

# Fetch edges in nGQL
FETCH PROP ON <edge_name> <src_vid> -> <dst_vid>
```

### Other Operations

In addition to the common CRUD on vertices and edges, we will also show you some combined queries in the three graph query languages.

#### Traverse edges

```shell
# Traverse edges with specified vertices in Gremlin
g.V(<vid>).outE(<edge>)

# Traverse edges with specified vertices in Cypher
Match (n)->[r:label]->[]
WHERE id(n) = vid
RETURN r

# Traverse edges with specified vertices in nGQL
GO FROM <vid> OVER <edge>
```

#### Traverse edges reversely

In reverse traverse, Gremlin uses `in` to indicate reversion, Cypher uses `<-`. nGQL uses keyword `REVERSELY`.

```shell
# Traverse edges reversely with specified vertices Gremlin
g.V(<vid>).in(<edge>)

# Traverse edges reversely with specified vertices Cypher
MATCH (n)<-[r:label]-()

# Traverse edges reversely with specified vertices nGQL
GO FROM <vid>  OVER <edge> REVERSELY
```

#### Traverse edges bidirectionally

If the edge direction is [irrelevant](https://www.google.com/search?q=irrelevant&spell=1&sa=X&ved=2ahUKEwjR1fPGovvnAhUsIDQIHXSzDRIQkeECKAB6BAgOECs) (either direction is acceptable),  Gremlin uses `bothE()`, Cypher use `-[]-`, and nGQL use keyword `BIDIRECT` .

```shell
# Traverse edges reversely with specified vertices Gremlin
g.V(<vid>).bothE(<edge>)

# Traverse edges reversely with specified vertices Cypher
MATCH (n)-[r:label]-()

# Traverse edges reversely with specified vertices nGQL
GO FROM <vid>  OVER <edge> BIDIRECT
```

#### Query N hops along specified edge

Gremlin and nGQL use `times` and `STEP` respectively to represent N hops. Cypher uses `relationship*N`.

```shell
# Query N hops along specified edge in Gremlin
g.V(<vid>).repeat(out(<edge>)).times(N)

# Query N hops along specified edge in Cypher
MATCH (n)-[r:label*N]->()
WHERE condition
RETURN r

# Query N hops along specified edge in nGQL
GO N STEPS FROM <vid> OVER <edge>
```

#### Find paths between two vertices

```shell
# Find paths between two vertices in Gremlin
g.V(<vid>).repeat(out()).until(<vid>).path()

# Find paths between two vertices in Cypher
MATCH p =(a)-[.*]->(b)
WHERE condition
RETURN p

# Find paths between two vertices in nGQL
FIND ALL PATH FROM <vid> TO <vid> OVER *
```

## Example queries

This section introduces some demonstration queries.

### Demo model: The Graphs of Gods

The examples in this section make extensive use of the toy graph distributed with [Janus Graph](https://janusgraph.org/) called _[The Graphs of Gods](https://docs.janusgraph.org/#getting-started), _as diagrammed below_._

This example describes the relationships between the beings and places of the Roman pantheon.

![image](https://user-images.githubusercontent.com/38887077/75741255-ffdc2c00-5d44-11ea-9da6-b15327f03ad4.png)

### Inserting data

```bash
# Inserting vertices
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

# Inserting edges
## nGQL
nebula> INSERT EDGE father() VALUES hash("jupiter")->hash("saturn"):();
## Gremlin
gremlin> g.addE("father").from(jupiter).to(saturn).property(T.id, 13);
==>e[13][2-father->1]
## Cypher
cypher> CREATE (src)-[rel:father]->(dst)
```

### Deleting

```bash
# nGQL
nebula> DELETE VERTEX hash("prometheus");
# Gremlin
gremlin> g.V(prometheus).drop();
# Cypher
cypher> MATCH (n:character {name:"prometheus"}) DETACH DELETE n 
```

### Updating

```bash
# nGQL
nebula> UPDATE VERTEX hash("jesus") SET character.type = 'titan';
# Gremlin
gremlin> g.V(jesus).property('age', 6000);
==>v[32]
# Cypher
cypher> MATCH (n:character {name:"jesus"}) SET n.type = 'titan';
```

### Fetching/Reading

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

### Finding the name of Hercules's Father

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

### Finding the name of Hercules's Grandfather

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

### Find the characters with age > 100

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

### Find who are Pluto's cohabitants, excluding Pluto himself

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

### Pluto's Brothers

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

In addition to the basic operations in the three graph query languages, we will work on another piece of comparison of advanced operations in these languages. Stay tuned!
