---
title: "An Introduction to Snapshot in Nebula Graph"
date: 2020-01-21
description: "Nebula Graph supports creating cluster snapshots to rebuild cluster and reimport data upon failures. This article introduces its design."
author: "sky"
tags: ["Features"]
---

## 1. Overview

### 1.1 Terms
| Names | Descriptions |
| --- | --- |
| Storage Engine | **Nebula Graph**'s smallest physical storage unit, currently supports RocksDB and Hbase, this document is only for RocksDB. |
| Partition | **Nebula Graph**'s smallest logical storage unit. A StorageEngine contains multiple partitions. A partition is divided into a leader and multiple followers, and Raft protocol is used to ensure data consistency between the leader and the followers. |
| Graph Space | Each graph space is an isolated graph unit that has its own tags and edges. A **Nebula Graph** cluster contains many graph spaces. |
| checkpoint | Checkpoints can be used as a point in time snapshot for the storage engine. Checkpoint can be used for full backup. Checkpoint file is a hard link for the sst file. |
| snapshot | The snapshot in this document refers to a snapshot that captures a point-in-time view of **Nebula Graph** cluster, i.e. a collection of the checkpoints for all the storage engines in the cluster. A cluster can be restored to the state when a certain snapshot is created via the snapshot. |
| wal | Write-ahead Log (wal) is used by Raft to ensure the consistency between leaders and followers. |


### 1.2 Background

In production, **Nebula Graph** handles massive data and high frequency business requests, therefore, faults caused by human, hardware or processing are inevitable. Some fatal faults even lead to abnormal operation or data failure in the cluster. When such situation occurs, rebuilding cluster and reimporting data becomes rather time-consuming.

As a solution to this problem, **Nebula Graph** supports creating snapshot for the clusters. You first create a snapshot then use it to to restore the cluster to an available state when catastrophic failures take place.

## 2. Architecture

### 2.1 Architecture Overview

![image](https://user-images.githubusercontent.com/56643819/70290011-89955f80-1811-11ea-8a15-a898ec902fd4.png)

### 2.2 Storage System Structure

![image](https://user-images.githubusercontent.com/56643819/70290034-99ad3f00-1811-11ea-97dd-f6a814c5624d.png)

### 2.3 Storage System File Structure
```bash
[bright2star@hp-server storage]$ tree
.
└── nebula
    └── 1
        ├── checkpoints
        │   ├── SNAPSHOT_2019_12_04_10_54_42
        │   │   ├── data
        │   │   │   ├── 000006.sst
        │   │   │   ├── 000008.sst
        │   │   │   ├── CURRENT
        │   │   │   ├── MANIFEST-000007
        │   │   │   └── OPTIONS-000005
        │   │   └── wal
        │   │       ├── 1
        │   │       │   └── 0000000000000000233.wal
        │   │       ├── 2
        │   │       │   └── 0000000000000000233.wal
        │   │       ├── 3
        │   │       │   └── 0000000000000000233.wal
        │   │       ├── 4
        │   │       │   └── 0000000000000000233.wal
        │   │       ├── 5
        │   │       │   └── 0000000000000000233.wal
        │   │       ├── 6
        │   │       │   └── 0000000000000000233.wal
        │   │       ├── 7
        │   │       │   └── 0000000000000000233.wal
        │   │       ├── 8
        │   │       │   └── 0000000000000000233.wal
        │   │       └── 9
        │   │           └── 0000000000000000233.wal
        │   └── SNAPSHOT_2019_12_04_10_54_44
        │       ├── data
        │       │   ├── 000006.sst
        │       │   ├── 000008.sst
        │       │   ├── 000009.sst
        │       │   ├── CURRENT
        │       │   ├── MANIFEST-000007
        │       │   └── OPTIONS-000005
        │       └── wal
        │           ├── 1
        │           │   └── 0000000000000000236.wal
        │           ├── 2
        │           │   └── 0000000000000000236.wal
        │           ├── 3
        │           │   └── 0000000000000000236.wal
        │           ├── 4
        │           │   └── 0000000000000000236.wal
        │           ├── 5
        │           │   └── 0000000000000000236.wal
        │           ├── 6
        │           │   └── 0000000000000000236.wal
        │           ├── 7
        │           │   └── 0000000000000000236.wal
        │           ├── 8
        │           │   └── 0000000000000000236.wal
        │           └── 9
        │               └── 0000000000000000236.wal
        ├── data
```

## 3. Logic Analysis Processing

![image](https://user-images.githubusercontent.com/38887077/75141584-3b1aa180-572c-11ea-93b6-78fdc1e6874a.png)

The `CREATE SNAPSHOT` is triggered with the client api or the console. The graph server parses the AST of the `CREATE SNAPSHOT` and sends the creation request to the meta server via the meta client. After receiving the request, the meta server first obtains all the active hosts and creates requests required by the adminClient. The creation requests are sent to each storage engine through the adminClient. After receiving the requests, the storage engine traverses all the storage engines of the specified spaces and creates checkpoint, then hard links the wals of all the partitions in storage engine. When creating checkpoint and the wal hard links, the database is read-only because the `write blocking` requests have been sent to all the leader partitions in advance.

Because the snapshot names are generated automatically with the system timestamp, you do not need to worry about renaming the snapshots. If you created unnecessary snapshots, you can delete them with the `DROP SNAPSHOT` command.

### 3.1 Create Snapshot

![image](https://user-images.githubusercontent.com/56643819/70290076-c1040c00-1811-11ea-88dd-d66eb2e47ddf.png)

### 3.2 Create Checkpoint

![image](https://user-images.githubusercontent.com/56643819/70290079-c3fefc80-1811-11ea-86e3-fbe0ddcf3d19.png)

## 4. Key Code Implementation

### 4.1 Create Snapshot
```cpp
folly::Future<Status> AdminClient::createSnapshot(GraphSpaceID spaceId, const std::string& name) {
    // Get all the hosts of storage engine
    auto allHosts = ActiveHostsMan::getActiveHosts(kv_);
    storage::cpp2::CreateCPRequest req;
    
    // Specify spaceId, creates a checkpoint for all graph spaces, list spaces 
    // is executed in the calling function
    req.set_space_id(spaceId);
    
    // Specify snapshot name, generated by the meta server timestamp
    // For example: SNAPSHOT_2019_12_04_10_54_44
    req.set_name(name);
    folly::Promise<Status> pro;
    auto f = pro.getFuture();
    
    // Send requests to all the storage engines via the getResponse interface
    getResponse(allHosts, 0, std::move(req), [] (auto client, auto request) {
        return client->future_createCheckpoint(request);
    }, 0, std::move(pro), 1 /*The snapshot operation only needs to be retried twice*/);
    return f;
}
```

### 4.2 Create Checkpoint

```cpp
ResultCode NebulaStore::createCheckpoint(GraphSpaceID spaceId, const std::string& name) {
    auto spaceRet = space(spaceId);
    if (!ok(spaceRet)) {
        return error(spaceRet);
    }
    auto space = nebula::value(spaceRet);
    
    // Traverse through all the StorageEngines in the space
    for (auto& engine : space->engines_) {
        
        // First create a checkpoint fot the storage engie
        auto code = engine->createCheckpoint(name);
        if (code != ResultCode::SUCCEEDED) {
            return code;
        }
        
        // Then hard link the last wal of all the partitions in the storage engine
        auto parts = engine->allParts();
        for (auto& part : parts) {
            auto ret = this->part(spaceId, part);
            if (!ok(ret)) {
                LOG(ERROR) << "Part not found. space : " << spaceId << " Part : " << part;
                return error(ret);
            }
            auto walPath = folly::stringPrintf("%s/checkpoints/%s/wal/%d",
                                                      engine->getDataRoot(), name.c_str(), part);
            auto p = nebula::value(ret);
            if (!p->linkCurrentWAL(walPath.data())) {
                return ResultCode::ERR_CHECKPOINT_ERROR;
            }
        }
    }
    return ResultCode::SUCCEEDED;
}
```

## 5. User Guide

### 5.1 CREATE SNAPSHOT

The `CREATE SNAPSHOT` command creates a snapshot at the current point in time for the whole cluster. The snapshot name is composed of the timestamp of the meta server.

If snapshot creation fails in the current version, you must use the `DROP SNAPSHOT` to clear the invalid snapshots. The current version does not support creating snapshot for the specified graph spaces, and executing `CREATE SNAPSHOT` creates a snapshot for all graph spaces in the cluster. For example:

```ngql
nebula> CREATE SNAPSHOT;
Execution succeeded (Time spent: 22892/23923 us)
```

### 5.2 Show Snapshots

The command `SHOW SNAPSHOT` looks at the states (VALID or INVALID), names and the IP addresses of all storage servers when the snapshots are created in the cluster. For example:

```ngql
nebula> SHOW SNAPSHOTS;
===========================================================
| Name                         | Status | Hosts           |
===========================================================
| SNAPSHOT_2019_12_04_10_54_36 | VALID  | 127.0.0.1:77833 |
-----------------------------------------------------------
| SNAPSHOT_2019_12_04_10_54_42 | VALID  | 127.0.0.1:77833 |
-----------------------------------------------------------
| SNAPSHOT_2019_12_04_10_54_44 | VALID  | 127.0.0.1:77833 |
-----------------------------------------------------------
```

### 5.3 Delete Snapshot

The `DROP SNAPSHOT` command deletes a snapshot with the specified name, the syntax is:

```ngql
DROP SNAPSHOT <snapshot-name>
```

You can get the snapshot names with the command `SHOW SNAPSHOTS`. `DROP SNAPSHOT` can delete both valid snapshots and invalid snapshots that failed during creation. For example:

```ngql
nebula> DROP SNAPSHOT SNAPSHOT_2019_12_04_10_54_36;
nebula> SHOW SNAPSHOTS;
===========================================================
| Name                         | Status | Hosts           |
===========================================================
| SNAPSHOT_2019_12_04_10_54_42 | VALID  | 127.0.0.1:77833 |
-----------------------------------------------------------
| SNAPSHOT_2019_12_04_10_54_44 | VALID  | 127.0.0.1:77833 |
-----------------------------------------------------------
```

Now the deletes snapshot is not in the show snapshots list.

## 6. Tips

- When the system structure changes, it is better to create a snapshot immediately. For example, when you add host, drop host, create space, drop space or balance.
- The current version does not support automatic garbage collection for the failed snapshots in creation. We will develop cluster checker in meta server to check the cluster state via asynchronous threads and automatically collect the garbage files in failure snapshot creation.
- The current version does not support customized snapshot directory. The snapshots are created in the `data_path/nebula` directory by default.
- The current version does not support snapshot restore. Users need to write a shell script based on their actual productions to restore snapshots. The implementation logic is rather simple, you copy the snapshots of the engine servers to the specified folder, set this folder to `data_path/`, then start the cluster.
