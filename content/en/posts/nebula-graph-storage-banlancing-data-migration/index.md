---
title: "Storage Balance and Data Migration"
date: 2020-02-04
description: "This post explains in detail how Nebula Graph handles data balancing and data migration at the storage layer."
author: "Heng Chen"
tags: ["Features"]
---

![image](https://user-images.githubusercontent.com/56643819/73818163-b7098400-4827-11ea-90b9-239d4e1c1285.png)

In our post [_Storage Design_](https://github.com/vesoft-inc/nebula/blob/master/docs/manual-EN/1.overview/3.design-and-architecture/2.storage-design.md) we mentioned the distributed kv store is managed by the meta service. Both the partition distribution and machine status can be found in the meta service. Users can ~~input~~ use commands in the console to add or remove machines to execute a balance plan for the storage service.

**Nebula Graph**'s service is composed of three parts: graph, storage and meta. In this post, we will introduce how to implement data (partition) and work-load balance in the storage service.

The storage service can be scaled in or out horizontally by the `BALANCE` commands below: 

- `BALANCE DATA`  is used to migrate data from old machines to new machines
- `BALANCE LEADER` only changes the distribution of leader partition to balance the work load without moving data

## Table of Contents

- Intro to the balance mechanism
- Cluster data migration
  - Step 1: Prerequisites
    - Step 1.1 Show the current cluster status
    - Step 1.2 Create graph spaces
  - Step 2 Add new hosts
  - Step 3 Data migration
  - Step 4 If stop data balance halfway, ...
  - Step 5 Data migration is done
  - Step 6 Next, balance leader
- Batch scale in
- Conclution

## Intro to the balance mechanism

In **Nebula Graph** balance means to balance both the raft leader and partition data. But the balance** does not change the numbers of leaders or partitions**.

When you add a new machine with Nebula service, the (new) storage will automatically register to the Meta service. Meta calculates an equally partition distribution, and then uses **remove partition** and **add partition** to make those partitions distributed evenly. The corresponding command is `BALANCE DATA`. Usually, the data migration is a time-consuming process.

However, `BALANCE DATA` only changes the replica distribution among the machines. But the leaders (corresponding work load) will not be changed. Next, you need to use the `BALANCE LEADER` command to achieve load balance. This process is also implemented through the meta service.

## Cluster data migration

The following example will show how to expand the cluster from three instances to eight instances.

### Step 1 Prerequisites

Suppose you've already start a cluster with three replicas.

#### Step 1.1 Show the current cluster status

Show the current status with command `SHOW HOSTS:`

```bash
nebula> SHOW HOSTS
================================================================================================
| Ip            | Port  | Status | Leader count | Leader distribution | Partition distribution |
================================================================================================
| 192.168.8.210 | 34600 | online | 0            | No valid partition  | No valid partition     |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34700 | online | 0            | No valid partition  | No valid partition     |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34500 | online | 0            | No valid partition  | No valid partition     |
------------------------------------------------------------------------------------------------
Got 3 rows (Time spent: 5886/6835 us)
```

**_Explanations on the returned results:_**

- **_IP_** and **_Port_** are the storage instance. The cluster has three storaged instances (192.168.8.210:34600, 192.168.8.210:34700, 192.168.8.210:34500) without any data.
- **_Status_** shows the state of each instance. There are two kinds of states, i.e. online/offline. When a host crashed, metad will turn it to offline after its heart beat timed out. The default heart beat threshold is 10 minutes (You can find parameter `expired_threshold_sec` meta's config file).
- **_Leader count_** shows the number of raft leader of the instance served.
- **_Leader distribution_** shows how the leader distributed in each graph space. For now there are no spaces  created.  (You can regard space as an independent name space -- similar to the Database in MySQL.)
- **_Partition distribution_** shows the partition number of different spaces.

![image](https://user-images.githubusercontent.com/56643819/73815505-26c84080-4821-11ea-8cfa-46fa202462f5.png)<br />We can see there is no data in the _Leader distribution_ and _Partition distribution_ for the time.

#### Step 1.2 Create a graph space

Create a graph space named `**test`** with 100 partition and 3 replicas.

```bash
nebula> CREATE SPACE test(PARTITION_NUM=100, REPLICA_FACTOR=3)
```

After a few seconds, run the command `SHOW HOSTS`again:

```
nebula> SHOW HOSTS
================================================================================================
| Ip            | Port  | Status | Leader count | Leader distribution | Partition distribution |
================================================================================================
| 192.168.8.210 | 34600 | online | 0            | test: 0             | test: 100              |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34700 | online | 52           | test: 52            | test: 100              |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34500 | online | 48           | test: 48            | test: 100              |
------------------------------------------------------------------------------------------------
```

![image](https://user-images.githubusercontent.com/56643819/73818168-bcff6500-4827-11ea-9924-b12919acd489.png)<br />After we created the space `test` with 100  _partitio_ns and 3 replicas, the host192.168.8.210:34600 serves NO leader, while 192.168.8.210:34700 serves 52 leaders and 192.168.8.210 serves 48 leaders。The leaders are not equilly distributed.

### Step 2 Add five new instances

Now, let's add five new instances into the cluster.

Again, show the new status using statement `SHOW HOSTS`. You can see there are already eight instances in serving. But no partition is running on the new instances.

```cpp
nebula> SHOW HOSTS
================================================================================================
| Ip            | Port  | Status | Leader count | Leader distribution | Partition distribution |
================================================================================================
| 192.168.8.210 | 34600 | online | 0            | test: 0             | test: 100              |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34900 | online | 0            | No valid partition  | No valid partition     |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 35940 | online | 0            | No valid partition  | No valid partition     |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34920 | online | 0            | No valid partition  | No valid partition     |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 44920 | online | 0            | No valid partition  | No valid partition     |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34700 | online | 52           | test: 52            | test: 100              |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34500 | online | 48           | test: 48            | test: 100              |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34800 | online | 0            | No valid partition  | No valid partition     |
------------------------------------------------------------------------------------------------
```


![image](https://user-images.githubusercontent.com/56643819/73815823-12387800-4822-11ea-8ee9-f0071d60fd7c.png)

In the above picture, the five blue icons are the newly added ones. However, since we just add them, they serve no parititons.

### Step 3 Data migration

Run command `BALANCE DATA`: 

```ngql
nebula> BALANCE DATA
==============
| ID         |
==============
| 1570761786 |
--------------
```

This command will generate a new plan and start a migration process if the partitions are not equally distributed. For a balanced cluster, re-run `BALANCE DATA` will not cause any new operations.<br />You can check the running progress of the plan by command `BALANCE DATA $id`.

```bash
nebula> BALANCE DATA 1570761786
===============================================================================
| balanceId, spaceId:partId, src->dst                           | status      |
===============================================================================
| [1570761786, 1:1, 192.168.8.210:34600->192.168.8.210:44920]   | succeeded   |
-------------------------------------------------------------------------------
| [1570761786, 1:1, 192.168.8.210:34700->192.168.8.210:34920]   | succeeded   |
-------------------------------------------------------------------------------
| [1570761786, 1:1, 192.168.8.210:34500->192.168.8.210:34800]   | succeeded   |
-------------------------------------------------------------------------------
...//We omitted some examples here.
-------------------------------------------------------------------------------
| [1570761786, 1:88, 192.168.8.210:34700->192.168.8.210:35940]  | succeeded   |
-------------------------------------------------------------------------------
| Total:189, Succeeded:170, Failed:0, In Progress:19, Invalid:0 | 89.947090%  |
-------------------------------------------------------------------------------
Got 190 rows (Time spent: 5454/11095 us)
```

**_Explanations on the returned results:_**

- The first column is a specific task. 

     Take 1570761786, 1:88, 192.168.8.210:34700->192.168.8.210:35940 for example

  - **1570761786** is the balance ID
  - **1:88**, 1 is the spaceId (i.e., space `test`), 88 is the partition id which is now being moved
  - **192.168.8.210:34700->192.168.8.210:3594**, moving data from the source instance to the destination instance. The useless data on the source instance will be garbage collected after the migration is finished.
- The second column shows the state (result) of the task, there are four states:
  - Succeeded
  - Failed
  - In progress
  - Invalid

The last row is the summary of the tasks. Some partitions are yet to be migrated.

### Step 4 If stop data balance halfway, ...

`BALANCE DATA STOP` command will stop the running plan and return this plan ID. If there is no running balance plan, an error is thrown. 

> Since a balance plan includes several balance (sub)tasks, `BALANCE DATA STOP` doesn't stop the running tasks, but rather cancel the subsequent tasks. The running tasks will continue until the executions are completed.


You can run `BALANCE DATA $id` to show the status of a stopped balance plan.

After all the running (sub)tasks are completed, you can re-run the `BALANCE DATA` command again to resume the previous balance plan (if applicable). If there are failed tasks in the stopped plan, the plan will retry. Otherwise, if all the tasks are succeed (and e.g., a new machine is added the cluster), a new balance plan will be created and executed.

### Step 5 Data Migration is Done

In some cases, the data migration will take hours or even days. During the migration, **Nebula Graph** online services are not affected. Once migration is done, the progress will show 100%. You can retry `BALANCE DATA` to fix those failed tasks. If it can't be fixed after several attempts, please contact us at [GitHub](https://github.com/vesoft-inc/nebula/issues).<br />Finally, use the `SHOW HOSTS` to check the final partition distribution.

```
nebula> SHOW HOSTS
================================================================================================
| Ip            | Port  | Status | Leader count | Leader distribution | *Partition distribution* |
================================================================================================
| 192.168.8.210 | 34600 | online | 3            | test: 3             | test: 37               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34900 | online | 0            | test: 0             | test: 38               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 35940 | online | 0            | test: 0             | test: 37               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34920 | online | 0            | test: 0             | test: 38               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 44920 | online | 0            | test: 0             | test: 38               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34700 | online | 35           | test: 35            | test: 37               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34500 | online | 24           | test: 24            | test: 37               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34800 | online | 38           | test: 38            | test: 38               |
------------------------------------------------------------------------------------------------
Got 8 rows (Time spent: 5074/6488 us)
```

![image](https://user-images.githubusercontent.com/56643819/73815873-33996400-4822-11ea-8ad4-eb6072faee94.png)

As you can tell from the `Partition pistribution` column, The numbers are close to each other (37 or 38 for an instance), and total partition number is 300. But ...

### Step 6 Balance leader

Statement `BALANCE DATA` only migrates partitions (with the data). But the leader distribution remains unbalanced, which means old hosts are overloaded-working, while the new ones are not fully used. We can re-distribute raft leader using the command `BALANCE LEADER`.

```ngql
nebula> BALANCE LEADER
```

Seconds later, show the results using the statement `SHOW HOSTS`.

```bash
nebula> SHOW HOSTS
================================================================================================
| Ip            | Port  | Status | Leader count | *Leader distribution* | Partition distribution |
================================================================================================
| 192.168.8.210 | 34600 | online | 13           | test: 13            | test: 37               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34900 | online | 12           | test: 12            | test: 38               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 35940 | online | 12           | test: 12            | test: 37               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34920 | online | 12           | test: 12            | test: 38               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 44920 | online | 13           | test: 13            | test: 38               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34700 | online | 12           | test: 12            | test: 37               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34500 | online | 13           | test: 13            | test: 37               |
------------------------------------------------------------------------------------------------
| 192.168.8.210 | 34800 | online | 13           | test: 13            | test: 38               |
------------------------------------------------------------------------------------------------
```

According to the `Leader distribution` column, the RAFT leaders are distributed evenly over all the hosts in the cluster.

![image](https://user-images.githubusercontent.com/56643819/73815914-5166c900-4822-11ea-8c68-1cd32d5cc4fe.png)

As the above picture indicates, when `BALANCE LEADER` runs successfully, the number of _Leader distribution_ on the newly added (the blue icon) and the original instances (the black icon) are close to each other (12 or 13 for an instance). Besides, as there are no change to the `Partition distribution` number, it indicates that `balance leader` only involves the re-distribution of leaders from instances.

## Batch Scale in

**Nebula Graph** also supports to go offline a host (and scale in the cluster) during service. The command is<br />`BALANCE DATA REMOVE $host_list`.<br />For example, command<br /> `BALANCE DATA REMOVE 192.168.0.1:50000,192.168.0.2:50000`<br />removes two hosts, i.e. 192.168.0.1:50000，192.168.0.2:50000, from the cluster.

> If replica number cannot meet the quorum requirement after the remove (e.g., remote two machines from a three machine cluster), **Nebula Graph** will reject the request and return an error code.

## Conclusion

In this post, we showed how to balance data and balance work load on a raft-cluster. If you have any questions, please leave your comment. Finally we tak a glance of the data migration process of instance _192.168.8.210:34600_.

![image](https://user-images.githubusercontent.com/56643819/73818243-e4563200-4827-11ea-815f-178ccdcc19ae.png)

The red number indicates a change happend after a command is executed.

## Appendix

This is the [GitHub Repo](https://github.com/vesoft-inc/nebula) for **Nebula Graph**. Welcome to try nebula. IF you have any problems please send us an [issue](https://github.com/vesoft-inc/nebula/issues).
