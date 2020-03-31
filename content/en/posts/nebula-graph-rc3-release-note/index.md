---
title: "Nebula Graph RC3 Release Note"
date: 2020-02-07
description: "Check what’s new in Nebula Graph’s RC3 release: Nebula Graph Studio 1.0 Beta for data visualization, index, Spark Writer, and much more."
author: "Jude"
tags: ["Release-Notes"]
---

![Release note](https://user-images.githubusercontent.com/56643819/74008741-96befe00-49bc-11ea-8a68-3a2d2dd42182.png)


Main features and fixes for this release include  `dump_tools` to export data by specific filters, graph data exploring tool Nebula Graph Studio, and vertex/edge scan interface for OLAP scenarios.  

Below is a list of details.

### Query engine

- Support fetching all props of a given vertex [#1486](https://github.com/vesoft-inc/nebula/pull/1486)
- Support `DELETE EDGE` to delete the given edge [#1063](https://github.com/vesoft-inc/nebula/pull/1063)
- Add `IF EXISTS` to conditionally drop a tag/edgetype only if  it exists. [#1505](https://github.com/vesoft-inc/nebula/pull/1505)
- Add `IF NOT EXISTS` to conditionally create a space/tag/edge only if  it not exists [#1379](https://github.com/vesoft-inc/nebula/pull/1379)
- Export graphd metrics [#1451](https://github.com/vesoft-inc/nebula/pull/1451)

### Storage

- Add scan edge/vertex interface to retrieve data from storage for OLAP, [#1381](https://github.com/vesoft-inc/nebula/pull/1381)
- Support `heartbeat_interval_secs` option to config heartbeat interval between storage/graph and meta [#1540](https://github.com/vesoft-inc/nebula/pull/1540)
- Pushdown filter to minimize data transfer and improve query performance [#947](https://github.com/vesoft-inc/nebula/pull/947)
- Support local conf mode, using local conf rather than config in meta server [#1411](https://github.com/vesoft-inc/nebula/pull/1411)
- Add timeout for storage/meta clients, the default value is 60s and configured by `meta_client_timeout_ms` option [#1399](https://github.com/vesoft-inc/nebula/pull/1399)
- Support creating a snapshot for the whole cluster [#1199](https://github.com/vesoft-inc/nebula/pull/1199) [#1372](https://github.com/vesoft-inc/nebula/pull/1372)
- Both support reading from leader/follow and support only read from the leader  [#1363](https://github.com/vesoft-inc/nebula/pull/1363)
- Add check step for each balance task during balancing process. [#1378](https://github.com/vesoft-inc/nebula/pull/1378)

### Build

- Simplify the build process, support most of Linux Kernel 2.6.32+ system [#1332](https://github.com/vesoft-inc/nebula/pull/1332)

### Index

- Support create an index，get a list of all indexes in the space and drop an index [#1459](https://github.com/vesoft-inc/nebula/pull/1459)  [#1360](https://github.com/vesoft-inc/nebula/pull/1360)

### Tools

- `dump_tools` , an off-line data dumping tool that can be used to dump or count data with specified conditions. [#1479](https://github.com/vesoft-inc/nebula/pull/1479)  [#1554](https://github.com/vesoft-inc/nebula/pull/1554)
- `Spark Writer` adopts async client，add hash and uuid support，support load data into the same schema from different data source [#1405](https://github.com/vesoft-inc/nebula/pull/1405) [#1512](https://github.com/vesoft-inc/nebula/pull/1512).
- `Spark Writer` supports configuring Spark partition，more numerous partitions allow work to be distributed among more workers, however, fewer partitions allow work to be done in larger chunks (and often quicker). [#1412](https://github.com/vesoft-inc/nebula/pull/1412)

### UI

- Nebula Graph Studio is the graphical user interface for working with Nebula. Query, visualize nebula and import CSV data to Nebula. Visualize and explore graph data via the interface; an editor with syntax highlighting feature enables users to design queries fast and view query results in a structured manner; support data import via GUI. Here's the repo of this tool (including documentation and deployment files): https://github.com/vesoft-inc/nebula-web-docker
