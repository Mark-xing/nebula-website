---
title: Jepsen 测试框架在图数据库 Nebula Graph 中的实践
date: 2020-01-09
description: "在本篇文章中主要介绍图数据库 Nebula Graph 在 Jepsen 这块的实践"
tags: ["系统测试"]
author: 王扶摇
---

​![产品细节](https://nebula-blog.azureedge.net/nebula-blog/Jepsen01.png)

在本篇文章中主要介绍图数据库 Nebula Graph 在 Jepsen 这块的实践。

## Jepsen 简介

Jepsen 是一款用于系统测试的开源软件库，致力于提高分布式数据库、队列、共识系统等的安全性。作者 Kyle Kingsbury 使用函数式编程语言 Clojure 编写了这款测试框架，并对多个著名的分布式系统和数据库进行了一致性测试。目前 Jepsen 仍在 GitHub 保持活跃，能否通过 Jepsen 的测试已经成为各个分布式数据库对自身检验的一个标杆。

## Jepsen 的测试流程

![流程图](https://nebula-blog.azureedge.net/nebula-blog/Jepsen02.png)

Jepsen 测试推荐使用 Docker 搭建集群。默认情况下由 6 个 container 组成，其中一个是控制节点（control node），另外 5 个是数据库的节点（默认为 n1-n5）。控制节点在测试程序开始后会启用多个 worker 进程，并发地通过 SSH 登入数据库节点进行读写操作。

测试开始后，控制节点会创建一组进程，进程包含了待测试分布式系统的客户端。另一个 Generator 进程产生每个客户端执行的操作，并将操作应用于待测试的分布式系统。每个操作的开始和结束以及操作结果记录在历史记录中。同时，一个特殊进程 Nemesis 将故障引入系统。

测试结束后，Checker 分析历史记录是否正确，是否符合一致性。用户可以使用 Jepsen 的 [knossos](https://github.com/jepsen-io/knossos) 中提供的验证模型，也可以自己定义符合需求的模型对测试结果进行验证。同时，还可以在测试中注入错误对集群进行干扰测试。

最后根据本次测试所规定的验证模型对结果进行分析。

## 如何使用 Jepsen

使用 Jepsen 过程中可能会遇到一些问题，可以参考一下使用 Tips：
1. 在 Jepsen 框架中，用户需要在 DB 接口中对自己的数据库定义下载，安装，启动与终止操作。在终止后，可以将 log 文件清除，同时也可以指定 log 的存储位置，Jepsen 会将其拷贝至 Jepsen 的 log 文件夹中，以便连同 Jepsen 自身的 log 进行分析。
1. 用户还需要提供访问自己数据库的客户端，这个客户端可以是你用 Clojure 实现的，比如 etcd 的[verschlimmbesserung](https://github.com/aphyr/verschlimmbesserung)，也可以是 JDBC，等等。然后需要定义 Client 接口，告诉 Jepsen 如何对你的数据库进行操作。
1. 在 Checker 中，你可以选择需要的测试模型，比如，性能测试（checker/perf）将会生成 latency 和整个测试过程的图表，时间轴（timeline/html）会生成一个记录着所有操作时间轴的 html 页面。
1. 另外一个不可或缺的组件就是在 nemesis 中注入想要测试的错误了。网络分区（nemesis/partition-random-halves）和杀掉数据节点（kill-node）是比较常见的注入错误。
1. 在 Generator 中，用户可以告知 worker 进程需要生成哪些操作，每一次操作的时间间隔，每一次错误注入的时间间隔等等。

## 用 Jepsen 测试图数据库 Nebula Graph

分布式图数据库 Nebula Graph 主要由 3 部分组成，分别是 meta 层，graph 层和 storage 层。

![architecture](https://nebula-blog.azureedge.net/nebula-blog/Jepsen03.png)

我们在使用 Jepsen 对 kv 存储接口进行的测试中，搭建了一个由 8 个 container 组成的集群：一个 Jepsen 的控制节点，一个 meta 节点，一个 graph 节点，和 5 个 storage 节点，集群由 Docker-compose 启动。需要注意的是，要建立一个集群的 subnet 网络，使集群可以连通，另外要安装 ssh 服务，并为 control node 与 5 个 storage 节点配置免密登入。

测试中使用了 Java 编写的客户端程序，生成 jar 包并加入到 Clojure 程序依赖，来对 DB 进行 put，get 和 cas (compare-and-set) 操作。另外 **Nebula Graph 的客户端有自动重试逻辑**，当遇到错误导致操作失败时，客户端会启用适当的重试机制以尽力确保操作成功。

Nebula-Jepsen 的测试程序目前分为三种常见的测试模型和三种常见的错误注入。

### Jepsen 测试模型

#### single-register
模拟一个寄存器，程序并发地对数据库进行读写操作，每次成功的写入操作都会使寄存器中存储的值发生变化，然后通过对比每次从数据库读出的值是否和寄存器中记录的值一致，来验证结果是否满足线性要求。由于寄存器是单一的，所以在此处我们生成唯一的 key，随机的 value 进行操作。

#### multi-register

一个可以存不同键的寄存器。和单一寄存器的效果一样，但此处我们可以使 key 也随机生成了。

```shell
4       :invoke :write  [[:w 9 1]]
4       :ok     :write  [[:w 9 1]]
3       :invoke :read   [[:r 5 nil]]
3       :ok     :read   [[:r 5 3]]
0       :invoke :read   [[:r 7 nil]]
0       :ok     :read   [[:r 7 2]]
0       :invoke :write  [[:w 7 1]]
0       :ok     :write  [[:w 7 1]]
1       :invoke :read   [[:r 1 nil]]
1       :ok     :read   [[:r 1 4]]
0       :invoke :read   [[:r 8 nil]]
0       :ok     :read   [[:r 8 3]]
:nemesis        :info   :start  nil
:nemesis        :info   :start  [:isolated {"n5" #{"n2" "n1" "n4" "n3"}, "n2" #{"n5"}, "n1" #{"n5"}, "n4" #{"n5"}, "n3" #{"n5"}}]
1       :invoke :write  [[:w 4 2]]
1       :ok     :write  [[:w 4 2]]
2       :invoke :read   [[:r 5 nil]]
3       :invoke :write  [[:w 1 2]]
2       :ok     :read   [[:r 5 3]]
3       :ok     :write  [[:w 1 2]]
0       :invoke :read   [[:r 4 nil]]
0       :ok     :read   [[:r 4 2]]
1       :invoke :write  [[:w 6 4]]
1       :ok     :write  [[:w 6 4]]
```

以上片段是截取的测试中一小部分不同的读写操作示例，

![format](https://nebula-blog.azureedge.net/nebula-blog/Jepsen04.png)

其中**最左边的数字是执行这次操作的 worker**，也就是**进程号**。每发起一次操作，标志都是 invoke，接下来一列会指出是 write 还是 read操作，而之后一列的中括号内，则显示了具体的操作，比如

- `:invoke :read   [[:r 1 nil]]`就是读取 key 为 1 的值，因为是 invoke，操作刚刚开始，还不知道值是什么，所以后面是 nil。
- `:ok     :read   [[:r 1 4]]` 中的 ok 则表示操作成功，可以看到读取到键 1 对应的值是 4。

在这个片段中，还可以看到一次 nemesis 被注入的时刻。

- `:nemesis   :info   :start  nil` 标志着 nemesis 的开始，后面的的内容 `（:isolated ...）` 表示了节点 n5 从整个集群中被隔离，无法与其他 DB 节点进行网络通信。

#### cas-register

这是一个验证 CAS 操作的寄存器。除了读写操作外，这次我们还加入了随机生成的 CAS 操作，cas-register 将会对结果进行线性分析。

```shell
0		:invoke	:read		nil
0		:ok			:read		0
1		:invoke	:cas		[0 2]
1		:ok			:cas		[0 2]
4		:invoke	:read		nil
4		:ok			:read		2
0		:invoke	:read		nil
0		:ok			:read		2
2		:invoke	:write	0
2		:ok			:write	0
3		:invoke	:cas		[2 2]
:nemesis		:info		:start	nil
0		:invoke	:read		nil
0		:ok			:read		0
1		:invoke	:cas		[1 3]
:nemesis		:info		:start	{"n1" ""}
3		:fail		:cas		[2 2]
1		:fail		:cas		[1 3]
4		:invoke	:read		nil
4		:ok			:read		0
```
同样的，在这次测试中，我们采用唯一的键值，比如所有写入和读取操作都是对键 "f" 执行，在显示上省略了中括号中的键，只显示是什么值。

- `:invoke	:read  nil` 表示开始一次读取 “f” 的值的操作，因为刚开始操作，所以结果是 nil（空）。
- `:ok  	:read  0` 表示成功读取到了键 “f” 的值为 0。
- `:invoke	:cas  [1 2]` 意思是进行 CAS 操作，当读到的值为 1 时，将值改为 2。

在第二行可以看到，当保存的 value 是 0 时，在第 4 行 `cas[0 2]` 会将 value 变为 2。在第 14 行当值为 0时，17 行的 cas[2 2] 就失败了。

第 16 行显示了 n1 节点被杀掉的操作，第 17、18 行会有两个 cas 失败（fail）

### Jepsen 错误注入

#### kill-node

Jepsen 的控制节点会在整个测试过程中，多次随机 kill 某一节点中的数据库服务而使服务停止。此时集群中就少了一个节点。然后在一定时间后再将该节点的数据库服务启动，使之重新加入集群。

#### partition-random-node

Jepsen 会在测试过程中，多次随机将某一节点与其他节点网络隔离，使该节点无法与其他节点通信，其他节点也无法和它通信。然后在一定时间后再恢复这一网络隔离，使集群恢复原状。

#### partition-random-halves
在这种常见的网络分区情景下，Jepsen 控制节点会将 5 个 DB 节点随机分成两部分，一部分为两个节点，另一部分为三个。一定时间后恢复通信。如下图所示。

![partition](https://nebula-blog.azureedge.net/nebula-blog/Jepsen05.png)

## 测试结束后

Jepsen 会根据需求对测试结果进行分析，并得出本次测试的结果，可以看到控制台的输出，本次测试是通过的。
```shell
2020-01-08 03:24:51,742{GMT}	INFO	[jepsen test runner] jepsen.core: {:timeline {:valid? true},
 :linear
 {:valid? true,
  :configs
  ({:model {:value 0},
    :last-op
    {:process 0,
     :type :ok,
     :f :write,
     :value 0,
     :index 597,
     :time 60143184600},
    :pending []}),
  :analyzer :linear,
  :final-paths ()},
 :valid? true}


Everything looks good! ヽ(‘ー`)ノ
```

### 自动生成的 timeline.html 文件

Jepsen 在测试执行过程中会自动生成一个名为 timeline.html 文件，以下为本次实践生成的 timeline.html 文件部分截图

![timeline](https://nebula-blog.azureedge.net/nebula-blog/Jepsen06.png)


上面的图片展示了测试中执行操作的时间轴片段，每个执行块有对应的执行信息，Jepsen 会将整个时间轴生成一个 HTML 文件。

Jepsen 就是这样按照顺序的历史操作记录进行 Linearizability 一致性验证，这也是 Jepsen 的核心。我们也可以通过这个 HTML 文件来帮助我们溯源错误。

### Jepsen 生成的性能分析图
下面是一些 Jepsen 生成的性能分析图表，本次实践项目名为「basic-test」各位读者阅读时请自行脑补为你项目名。

![latency](https://nebula-blog.azureedge.net/nebula-blog/Jepsen07.png)

可以看到，这一张图表展示了 Nebula Graph 的读写操作延时。其中上方灰色的区域是错误注入的时段，在本次测试我们注入了随机 kill node。

![rate](https://nebula-blog.azureedge.net/nebula-blog/Jepsen08.png)

而在这一张图展示了读写操作的成功率，我们可以看出，最下方红色集中突出的地方为出现失败的地方，这是因为 control node 在杀死节点时终止了某个 partition 的 leader 中的 nebula 服务。集群此时需要重新选举，在选举出新的 leader 之后，读写操作也恢复到正常了。

通过观察测试程序运行结果和分析图表，可以看到 Nebula Graph 完成了本次在单寄存器模型中注入 kill-node 错误的测试，读写操作延时也均处于正常范围。

## 小结

Jepsen 本身也存在一些不足，比如测试无法长时间运行，因为大量数据在校验阶段会造成 Out of Memory。

但在实际场景中，许多 bug 需要长时间的压力测试、故障模拟才能发现，同时系统的稳定性也需要长时间的运行才能被验证。但与此同时，在使用 Jepsen 对 Nebula Graph 进行测试的过程中，我们也发现了一些之前没有遇到过的 Bug，甚至其中一些在使用中可能永远也不会出现。

目前，我们已经在日常开发过程中使用 Jepsen 对 Nebula Graph 进行测试。Nebula Graph 有代码更新后，每晚都将编译好的项目发布在 Docker Hub 中，Nebula-Jepsen 将自动下拉最新的镜像进行持续测试。

最后是 Nebula 的 GitHub 地址，欢迎大家试用，有什么问题可以向我们提 issue。GitHub 地址：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula)， 加入 Nebula Graph 交流群，请联系 Nebula Graph 官方小助手微信号：NebulaGraphbot

## 参考文献

- Jepsen 主页：[https://jepsen.io/](https://jepsen.io/)
- Jepsen GitHub：[https://github.com/jepsen-io/jepsen](https://github.com/jepsen-io/jepsen)
- [Raft Understandable Distributed Consensus](http://thesecretlivesofdata.com/raft/)
- [The Raft Consensus Algorithm](https://raft.github.io/)
- Nebula Graph GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula)

## 推荐阅读

- [应用 AddressSanitizer 发现程序内存错误(https://nebula-graph.io/cn/posts/introduction-to-google-memory-detect-tool-addresssanitizer/)


