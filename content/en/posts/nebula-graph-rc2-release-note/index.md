---
title: "Nebula Graph RC2 Release Note"
date: 2019-12-09
description: "New features re Nebula Graph’s Query Engine, Storage Engine, and OM tools have come in the RC2 version of Nebula Graph. Check what’s coming."
author: "Jude"
tags: ["Release-Notes"]
---


![rc2](https://user-images.githubusercontent.com/56643819/72578859-51099b00-3912-11ea-8435-3f4d412d004e.png)

In our RC2 version, we have made several improvements re the nGQL query language, our Storage Engine, CSV Importer, as well as added Java, Python, and Go Clients.

Below is a detailed rundown of the newly added features:

## Query engine

- Support `GROUP BY ` to group items that have the same values, often used with aggregate functions (COUNT, MAX, MIN, SUM, AVG, etc.) to group the result-set by one or more property field. [#749](https://github.com/vesoft-inc/nebula/issues/749)
- UPDATE CONFIGS supports expression  [#1273](https://github.com/vesoft-inc/nebula/issues/1273)
- Support changing log severity level and verbose level from console  [#1273](https://github.com/vesoft-inc/nebula/issues/1273)
- Support IF...RETURN... to return the result if a specified condition is true [#1233](https://github.com/vesoft-inc/nebula/issues/1233) 、[#1246](https://github.com/vesoft-inc/nebula/issues/1246)
- String properties could have unlimited length  [#1103](https://github.com/vesoft-inc/nebula/issues/1103)
- When insert vertices and edges, users can specify properties order instead of following the schema defined order [#1219](https://github.com/vesoft-inc/nebula/issues/1219)
- tag/edge type properties can have explicit default values.  [#860](https://github.com/vesoft-inc/nebula/issues/860)
- GO FROM ... REVERSELY to implement reverse query [#1349](https://github.com/vesoft-inc/nebula/issues/1349)

## Storage engine

- Support SHOW PARTS to fetch the partition information of current space [#1086](https://github.com/vesoft-inc/nebula/issues/1086)
- Support BALANCE STOP to stop load balance process [#1238](https://github.com/vesoft-inc/nebula/issues/1238)
- Support triggering the compaction and flush manually [#677](https://github.com/vesoft-inc/nebula/issues/677)、[ #1240](https://github.com/vesoft-inc/nebula/issues/1240)
- Change BlockBasedTable default block cache size from 4MB to 1024MB  [#1248](https://github.com/vesoft-inc/nebula/issues/1248)
- Change default partition from 1024 number to 100 [#1330](https://github.com/vesoft-inc/nebula/issues/1330)
- Add max_edge_returned_per_vertex gflags option to limit the return size of supper vertex [#1221](https://github.com/vesoft-inc/nebula/issues/1221)
- Add cache for vertex [ #1294](https://github.com/vesoft-inc/nebula/issues/1294) [#1268](https://github.com/vesoft-inc/nebula/issues/1268)
- Upgrade dependencies folly and fbthrift [#1161](https://github.com/vesoft-inc/nebula/issues/1161)

## Tools

- Enhance CSV Importer, user can import CSV using docker image. See [Nebula Importer]((https://github.com/vesoft-inc/nebula-importer)) for more details.

## Client

- Add Python client, see Python Client for more details.
- For Golang client, see Go Client.
- Java client has been uploaded to Nexus Repository, see Java Client for more details.

## Changed/Removed

- Remove commands ADD/REMOVE HOSTS , the hosts could be discovered automatically [#1172](https://github.com/vesoft-inc/nebula/issues/1172)

## Coming soon

See our [roadmap for RC3](https://github.com/vesoft-inc/nebula/wiki/Nebula-Graph-Roadmap-RC3) for the features coming soon.
