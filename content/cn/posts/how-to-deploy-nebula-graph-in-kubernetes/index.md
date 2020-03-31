---
title: "Kubernetes 部署 Nebula 图数据库集群"
date: 2020-02-26
description: "数据库容器化是最近的一大热点，Kubernetes 能给数据库带来故障恢复、存储管理、负载均衡、水平拓展等好处。而它在图数据库 Nebula Graph 中可以发挥什么作用呢？"
tags: ["部署"]
author: 徐飞
---

## Kubernetes 是什么

Kubernetes 是一个开源的，用于管理云平台中多个主机上的容器化的应用，Kubernetes 的目标是让部署容器化的应用简单并且高效，Kubernetes 提供了应用部署，规划，更新，维护的一种机制。<br />Kubernetes 在设计结构上定义了一系列的构建模块，其目的是为了提供一个可以**部署、维护和扩展应用程序的机制**，组成 Kubernetes 的组件设计概念为**松耦合**和**可扩展**的，这样可以使之满足多种不同的工作负载。可扩展性在很大程度上由 Kubernetes
API 提供，此 API 主要被作为扩展的内部组件以及 Kubernetes 上运行的容器来使用。

![](https://nebula-blog.azureedge.net/nebula-blog/k8s01.png)

Kubernetes 主要由以下几个核心组件组成：

- `etcd`  保存了整个集群的状态
- `apiserver` 提供了资源操作的唯一入口，并提供认证、授权、访问控制、API注册和发现等机制
- `controller manager` 负责维护集群的状态，比如故障检测、自动扩展、滚动更新等
- `scheduler` 负责资源的调度，按照预定的调度策略将Pod调度到相应的机器上
- `kubelet` 负责维护容器的生命周期，同时也负责 Volume和网络的管理
- `Container runtime` 负责镜像管理以及 Pod 和容器的真正运行（CRI）
- `kube-proxy` 负责为 Service 提供 cluster 内部的服务发现和负载均衡

除了核心组件，还有一些推荐的 Add-ons：

- `kube-dns` 负责为整个集群提供 DNS 服务
- `Ingress Controller` 为服务提供外网入口
- `Heapster` 提供资源监控
- `Dashboard` 提供 GUI
- `Federation` 提供跨可用区的集群
- `Fluentd-elasticsearch` 提供集群日志采集、存储与查询

## Kubernetes 和数据库
数据库容器化是最近的一大热点，那么 Kubernetes 能为数据库带来什么好处呢？

- **故障恢复**: Kubernetes 提供故障恢复的功能，数据库应用如果宕掉，Kubernetes 可以将其**自动重启**，或者将数据库实例迁移到集群中其他节点上
- **存储管理**: Kubernetes 提供了丰富的存储接入方案，数据库应用能**透明地使用不同类型的存储系统**
- **负载均衡**: Kubernetes Service 提供负载均衡功能，能将外部访问平摊给不同的数据库实例副本上
- **水平拓展**: Kubernetes 可以根据当前数据库集群的资源利用率情况，缩放副本数目，从而提升资源的利用率

目前很多数据库，如：MySQL，MongoDB 和 TiDB 在 Kubernetes 集群中都能运行很良好。

## Nebula Graph在Kubernetes中的实践
Nebula Graph 是一个分布式的开源图数据库，主要组件有：Query Engine 的 graphd，数据存储的 storaged，和元数据的 meted。在 Kubernetes 实践过程中，它主要给图数据库 Nebula Graph 带来了以下的好处：

- Kubernetes 能分摊 nebula graphd，metad 和 storaged 不副本之间的负载。graphd，metad 和 storaged 可以通过 Kubernetes 的域名服务自动发现彼此。
- 通过 storageclass，pvc 和 pv 可以屏蔽底层存储细节，无论使用本地卷还是云盘，Kubernetes 均可以屏蔽这些细节。
- 通过 Kubernetes 可以在几秒内成功部署一套 Nebula 集群，Kubernetes 也可以无感知地实现 Nebula 集群的升级。
- Nebula 集群通过 Kubernetes 可以做到自我恢复，单体副本 crash，Kubernetes 可以重新将其拉起，无需运维人员介入。
- Kubernetes 可以根据当前 Nebula 集群的资源利用率情况水平伸缩 Nebula 集群，从而提供集群的性能。

下面来讲解下具体的实践内容。

### 集群部署

#### 硬件和软件要求
这里主要罗列下本文部署涉及到的机器、操作系统参数

- 操作系统使用的 CentOS-7.6.1810 x86_64
- 虚拟机配置
  - 4 CPU
  - 8G 内存
  - 50G 系统盘
  - 50G 数据盘A
  - 50G 数据盘B
- Kubernetes 集群版本 v1.16
- Nebula 版本为 v1.0.0-rc3
- 使用本地 PV 作为数据存储

#### kubernetes 集群规划
以下为集群清单

| 服务器 IP | nebula 实例 | role |
| --- | --- | --- |
| 192.168.0.1 |  | k8s-master |
| 192.168.0.2 | graphd, metad-0, storaged-0 | k8s-slave |
| 192.168.0.3 | graphd, metad-1, storaged-1 | k8s-slave |
| 192.168.0.4 | graphd, metad-2, storaged-2 | k8s-slave |

#### Kubernetes 待部署组件

- 安装 Helm
- 准备本地磁盘，并安装本地卷插件
- 安装 nebula 集群
- 安装 ingress-controller

### 安装 Helm

Helm 是 Kubernetes 集群上的包管理工具，类似 CentOS 上的 yum，Ubuntu 上的 apt-get。使用 Helm 可以极大地降低使用 Kubernetes 部署应用的门槛。由于本篇文章不做 Helm 详细介绍，有兴趣的小伙伴可自行阅读[《Helm 入门指南》](https://www.hi-linux.com/posts/21466.html)

#### 下载安装Helm
使用下面命令在终端执行即可安装 Helm
```bash
[root@nebula ~]# wget https://get.helm.sh/helm-v3.0.1-linux-amd64.tar.gz 
[root@nebula ~]# tar -zxvf helm/helm-v3.0.1-linux-amd64.tgz
[root@nebula ~]# mv linux-amd64/helm /usr/bin/helm
[root@nebula ~]# chmod +x /usr/bin/helm
```

#### 查看 Helm 版本

执行 `helm version` 命令即可查看对应的 Helm 版本，以文本为例，以下为输出结果：

```cpp
version.BuildInfo{
    Version:"v3.0.1", 
    GitCommit:"7c22ef9ce89e0ebeb7125ba2ebf7d421f3e82ffa", 
    GitTreeState:"clean", 
    GoVersion:"go1.13.4"
}
```

### 设置本地磁盘

在每台机器上做如下配置

#### 创建 mount 目录

```bash
[root@nebula ~]# sudo mkdir -p /mnt/disks
```

#### 格式化数据盘

```bash
[root@nebula ~]# sudo mkfs.ext4 /dev/diskA 
[root@nebula ~]# sudo mkfs.ext4 /dev/diskB
```

#### 挂载数据盘

```bash
[root@nebula ~]# DISKA_UUID=$(blkid -s UUID -o value /dev/diskA) 
[root@nebula ~]# DISKB_UUID=$(blkid -s UUID -o value /dev/diskB) 
[root@nebula ~]# sudo mkdir /mnt/disks/$DISKA_UUID
[root@nebula ~]# sudo mkdir /mnt/disks/$DISKB_UUID
[root@nebula ~]# sudo mount -t ext4 /dev/diskA /mnt/disks/$DISKA_UUID
[root@nebula ~]# sudo mount -t ext4 /dev/diskB /mnt/disks/$DISKB_UUID

[root@nebula ~]# echo UUID=`sudo blkid -s UUID -o value /dev/diskA` /mnt/disks/$DISKA_UUID ext4 defaults 0 2 | sudo tee -a /etc/fstab
[root@nebula ~]# echo UUID=`sudo blkid -s UUID -o value /dev/diskB` /mnt/disks/$DISKB_UUID ext4 defaults 0 2 | sudo tee -a /etc/fstab
```

### 部署本地卷插件

```bash
[root@nebula ~]# curl https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner/archive/v2.3.3.zip
[root@nebula ~]# unzip v2.3.3.zip
```

修改 v2.3.3/helm/provisioner/values.yaml

```
#
# Common options.
#
common:
  #
  # Defines whether to generate service account and role bindings.
  #
  rbac: true
  #
  # Defines the namespace where provisioner runs
  #
  namespace: default
  #
  # Defines whether to create provisioner namespace
  #
  createNamespace: false
  #
  # Beta PV.NodeAffinity field is used by default. If running against pre-1.10
  # k8s version, the `useAlphaAPI` flag must be enabled in the configMap.
  #
  useAlphaAPI: false
  #
  # Indicates if PVs should be dependents of the owner Node.
  #
  setPVOwnerRef: false
  #
  # Provisioner clean volumes in process by default. If set to true, provisioner
  # will use Jobs to clean.
  #
  useJobForCleaning: false
  #
  # Provisioner name contains Node.UID by default. If set to true, the provisioner
  # name will only use Node.Name.
  #
  useNodeNameOnly: false
  #
  # Resync period in reflectors will be random between minResyncPeriod and
  # 2*minResyncPeriod. Default: 5m0s.
  #
  #minResyncPeriod: 5m0s
  #
  # Defines the name of configmap used by Provisioner
  #
  configMapName: "local-provisioner-config"
  #
  # Enables or disables Pod Security Policy creation and binding
  #
  podSecurityPolicy: false
#
# Configure storage classes.
#
classes:
- name: fast-disks # Defines name of storage classe.
  # Path on the host where local volumes of this storage class are mounted
  # under.
  hostDir: /mnt/fast-disks
  # Optionally specify mount path of local volumes. By default, we use same
  # path as hostDir in container.
  # mountDir: /mnt/fast-disks
  # The volume mode of created PersistentVolume object. Default to Filesystem
  # if not specified.
  volumeMode: Filesystem
  # Filesystem type to mount.
  # It applies only when the source path is a block device,
  # and desire volume mode is Filesystem.
  # Must be a filesystem type supported by the host operating system.
  fsType: ext4
  blockCleanerCommand:
  #  Do a quick reset of the block device during its cleanup.
  #  - "/scripts/quick_reset.sh"
  #  or use dd to zero out block dev in two iterations by uncommenting these lines
  #  - "/scripts/dd_zero.sh"
  #  - "2"
  # or run shred utility for 2 iteration.s
     - "/scripts/shred.sh"
     - "2"
  # or blkdiscard utility by uncommenting the line below.
  #  - "/scripts/blkdiscard.sh"
  # Uncomment to create storage class object with default configuration.
  # storageClass: true
  # Uncomment to create storage class object and configure it.
  # storageClass:
    # reclaimPolicy: Delete # Available reclaim policies: Delete/Retain, defaults: Delete.
    # isDefaultClass: true # set as default class

#
# Configure DaemonSet for provisioner.
#
daemonset:
  #
  # Defines the name of a Provisioner
  #
  name: "local-volume-provisioner"
  #
  # Defines Provisioner's image name including container registry.
  #
  image: quay.io/external_storage/local-volume-provisioner:v2.3.3
  #
  # Defines Image download policy, see kubernetes documentation for available values.
  #
  #imagePullPolicy: Always
  #
  # Defines a name of the service account which Provisioner will use to communicate with API server.
  #
  serviceAccount: local-storage-admin
  #
  # Defines a name of the Pod Priority Class to use with the Provisioner DaemonSet
  #
  # Note that if you want to make it critical, specify "system-cluster-critical"
  # or "system-node-critical" and deploy in kube-system namespace.
  # Ref: https://k8s.io/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical
  #
  #priorityClassName: system-node-critical
  # If configured, nodeSelector will add a nodeSelector field to the DaemonSet PodSpec.
  #
  # NodeSelector constraint for local-volume-provisioner scheduling to nodes.
  # Ref: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector
  nodeSelector: {}
  #
  # If configured KubeConfigEnv will (optionally) specify the location of kubeconfig file on the node.
  #  kubeConfigEnv: KUBECONFIG
  #
  # List of node labels to be copied to the PVs created by the provisioner in a format:
  #
  #  nodeLabels:
  #    - failure-domain.beta.kubernetes.io/zone
  #    - failure-domain.beta.kubernetes.io/region
  #
  # If configured, tolerations will add a toleration field to the DaemonSet PodSpec.
  #
  # Node tolerations for local-volume-provisioner scheduling to nodes with taints.
  # Ref: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
  tolerations: []
  #
  # If configured, resources will set the requests/limits field to the Daemonset PodSpec.
  # Ref: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/
  resources: {}
#
# Configure Prometheus monitoring
#
prometheus:
  operator:
    ## Are you using Prometheus Operator?
    enabled: false

    serviceMonitor:
      ## Interval at which Prometheus scrapes the provisioner
      interval: 10s

      # Namespace Prometheus is installed in
      namespace: monitoring

      ## Defaults to whats used if you follow CoreOS [Prometheus Install Instructions](https://github.com/coreos/prometheus-operator/tree/master/helm#tldr)
      ## [Prometheus Selector Label](https://github.com/coreos/prometheus-operator/blob/master/helm/prometheus/templates/prometheus.yaml#L65)
      ## [Kube Prometheus Selector Label](https://github.com/coreos/prometheus-operator/blob/master/helm/kube-prometheus/values.yaml#L298)
      selector:
        prometheus: kube-prometheus
```

将`hostDir: /mnt/fast-disks` 改成`hostDir: /mnt/disks`<br />将`# storageClass: true` 改成 `storageClass: true`<br />然后执行：

```bash
#安装
[root@nebula ~]# helm install local-static-provisioner v2.3.3/helm/provisioner
#查看local-static-provisioner部署情况
[root@nebula ~]# helm list
```

### 部署 nebula 集群

#### 下载 nebula helm-chart 包
```bash
# 下载nebula
[root@nebula ~]# wget https://github.com/vesoft-inc/nebula/archive/master.zip 
# 解压
[root@nebula ~]# unzip master.zip 
```

#### 设置 Kubernetes slave 节点
下面是 Kubernetes 节点列表，我们需要设置 slave 节点的调度标签。可以将 _192.168.0.2_，_192.168.0.3_，_192.168.0.4_ 打上 nebula: "yes" 的标签。

| 服务器 IP | kubernetes roles | nodeName |
| --- | --- | --- |
| 192.168.0.1 | master | 192.168.0.1 |
| 192.168.0.2 | worker | 192.168.0.2 |
| 192.168.0.3 | worker | 192.168.0.3 |
| 192.168.0.4 | worker | 192.168.0.4 |

具体操作如下：
```bash
[root@nebula ~]# kubectl  label node 192.168.0.2 nebula="yes" --overwrite 
[root@nebula ~]# kubectl  label node 192.168.0.3 nebula="yes" --overwrite
[root@nebula ~]# kubectl  label node 192.168.0.4 nebula="yes" --overwrite
```

#### 调整 nebula helm chart 默认的 values 值
nebula helm-chart 包目录如下:

```bash
master/kubernetes/
└── helm
    ├── Chart.yaml
    ├── templates
    │   ├── configmap.yaml
    │   ├── deployment.yaml
    │   ├── _helpers.tpl
    │   ├── ingress-configmap.yaml\ 
    │   ├── NOTES.txt
    │   ├── pdb.yaml
    │   ├── service.yaml
    │   └── statefulset.yaml
    └── values.yaml

2 directories, 10 files
```
我们需要调整 `master/kubernetes/values.yaml`  里面的 MetadHosts 的值，将这个 IP List 替换本环境的 3 个 k8s worker 的 ip。
```yaml
MetadHosts:
  - 192.168.0.2:44500
  - 192.168.0.3:44500
  - 192.168.0.4:44500
```

#### 通过 helm 安装 nebula
```bash
# 安装
[root@nebula ~]# helm install nebula master/kubernetes/helm 
# 查看
[root@nebula ~]# helm status nebula
# 查看k8s集群上nebula部署情况
[root@nebula ~]# kubectl get pod  | grep nebula
nebula-graphd-579d89c958-g2j2c                   1/1     Running            0          1m
nebula-graphd-579d89c958-p7829                   1/1     Running            0          1m
nebula-graphd-579d89c958-q74zx                   1/1     Running            0          1m
nebula-metad-0                                   1/1     Running            0          1m
nebula-metad-1                                   1/1     Running            0          1m
nebula-metad-2                                   1/1     Running            0          1m
nebula-storaged-0                                1/1     Running            0          1m
nebula-storaged-1                                1/1     Running            0          1m
nebula-storaged-2                                1/1     Running            0          1m
```

### 部署 Ingress-controller

Ingress-controller 是 Kubernetes 的一个 Add-Ons。Kubernetes 通过 ingress-controller 将 Kubernetes 内部署的服务暴露给外部用户访问。Ingress-controller 还提供负载均衡的功能，可以将外部访问流量平摊给 k8s 中应用的不同的副本。

![](https://nebula-blog.azureedge.net/nebula-blog/k8s02.png)

### 选择一个节点部署 Ingress-controller

```bash
[root@nebula ~]# kubectl get node 
NAME              STATUS     ROLES    AGE   VERSION
192.168.0.1       Ready      master   82d   v1.16.1
192.168.0.2       Ready      <none>   82d   v1.16.1
192.168.0.3       Ready      <none>   82d   v1.16.1
192.168.0.4       Ready      <none>   82d   v1.16.1
[root@nebula ~]# kubectl label node 192.168.0.4 ingress=yes
```

编写 ingress-nginx.yaml 部署文件

```bash
apiVersion: v1
kind: Namespace
metadata:
  name: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
---
kind: ConfigMap
apiVersion: v1
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
---
kind: ConfigMap
apiVersion: v1
metadata:
  name: tcp-services
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
---
kind: ConfigMap
apiVersion: v1
metadata:
  name: udp-services
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nginx-ingress-serviceaccount
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx

---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: nginx-ingress-clusterrole
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
rules:
  - apiGroups:
      - ""
    resources:
      - configmaps
      - endpoints
      - nodes
      - pods
      - secrets
    verbs:
      - list
      - watch
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
  - apiGroups:
      - ""
    resources:
      - services
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - "extensions"
      - "networking.k8s.io"
    resources:
      - ingresses
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - ""
    resources:
      - events
    verbs:
      - create
      - patch
  - apiGroups:
      - "extensions"
      - "networking.k8s.io"
    resources:
      - ingresses/status
    verbs:
      - update
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: nginx-ingress-role
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
rules:
  - apiGroups:
      - ""
    resources:
      - configmaps
      - pods
      - secrets
      - namespaces
    verbs:
      - get
  - apiGroups:
      - ""
    resources:
      - configmaps
    resourceNames:
      # Defaults to "<election-id>-<ingress-class>"
      # Here: "<ingress-controller-leader>-<nginx>"
      # This has to be adapted if you change either parameter
      # when launching the nginx-ingress-controller.
      - "ingress-controller-leader-nginx"
    verbs:
      - get
      - update
  - apiGroups:
      - ""
    resources:
      - configmaps
    verbs:
      - create
  - apiGroups:
      - ""
    resources:
      - endpoints
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: nginx-ingress-role-nisa-binding
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: nginx-ingress-role
subjects:
  - kind: ServiceAccount
    name: nginx-ingress-serviceaccount
    namespace: ingress-nginx

---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: nginx-ingress-clusterrole-nisa-binding
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: nginx-ingress-clusterrole
subjects:
  - kind: ServiceAccount
    name: nginx-ingress-serviceaccount
    namespace: ingress-nginx

---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: nginx-ingress-controller
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: ingress-nginx
      app.kubernetes.io/part-of: ingress-nginx
  template:
    metadata:
      labels:
        app.kubernetes.io/name: ingress-nginx
        app.kubernetes.io/part-of: ingress-nginx
      annotations:
        prometheus.io/port: "10254"
        prometheus.io/scrape: "true"
    spec:
      hostNetwork: true
      tolerations:
        - key: "node-role.kubernetes.io/master"
          operator: "Exists"
          effect: "NoSchedule"
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: app.kubernetes.io/name
                    operator: In
                    values:
                      - ingress-nginx
              topologyKey: "ingress-nginx.kubernetes.io/master"
      nodeSelector:
        ingress: "yes"
      serviceAccountName: nginx-ingress-serviceaccount
      containers:
        - name: nginx-ingress-controller
          image: quay.io/kubernetes-ingress-controller/nginx-ingress-controller-amd64:0.26.1
          args:
            - /nginx-ingress-controller
            - --configmap=$(POD_NAMESPACE)/nginx-configuration
            - --tcp-services-configmap=default/graphd-services
            - --udp-services-configmap=$(POD_NAMESPACE)/udp-services
            - --publish-service=$(POD_NAMESPACE)/ingress-nginx
            - --annotations-prefix=nginx.ingress.kubernetes.io
            - --http-port=8000
          securityContext:
            allowPrivilegeEscalation: true
            capabilities:
              drop:
                - ALL
              add:
                - NET_BIND_SERVICE
            # www-data -> 33
            runAsUser: 33
          env:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
          ports:
            - name: http
              containerPort: 80
            - name: https
              containerPort: 443
          livenessProbe:
            failureThreshold: 3
            httpGet:
              path: /healthz
              port: 10254
              scheme: HTTP
            initialDelaySeconds: 10
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 10
          readinessProbe:
            failureThreshold: 3
            httpGet:
              path: /healthz
              port: 10254
              scheme: HTTP
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 10
```

部署 ingress-nginx

```bash
# 部署
[root@nebula ~]# kubectl create -f ingress-nginx.yaml
# 查看部署情况
[root@nebula ~]# kubectl get pod -n ingress-nginx 
NAME                             READY   STATUS    RESTARTS   AGE
nginx-ingress-controller-mmms7   1/1     Running   2          1m
```

### 访问 nebula 集群

查看 ingress-nginx 所在的节点：

```bash
[root@nebula ~]# kubectl get node -l ingress=yes -owide 
NAME            STATUS   ROLES    AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION          CONTAINER-RUNTIME
192.168.0.4     Ready    <none>   1d   v1.16.1    192.168.0.4    <none>        CentOS Linux 7 (Core)   7.6.1810.el7.x86_64     docker://19.3.3
```

访问 nebula 集群:

```bash
[root@nebula ~]# docker run --rm -ti --net=host vesoft/nebula-console:nightly --addr=192.168.0.4 --port=3699
```

## FAQ

>  如何搭建一套 Kubernetes 集群？

搭建高可用的 Kubernetes 可以参考社区文档：[https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)

你也可以通过 minikube 搭建本地的 Kubernetes 集群，参考文档：[https://kubernetes.io/docs/setup/learning-environment/minikube/](https://kubernetes.io/docs/setup/learning-environment/minikube/)

> 如何调整 nebula 集群的部署参数?

在使用 helm install 时，使用 --set 可以设置部署参数，从而覆盖掉 helm chart 中 values.yaml 中的变量。参考文档：[https://helm.sh/docs/intro/using_helm/](https://helm.sh/docs/intro/using_helm/)

> 如何查看 nebula 集群状况？

使用`kubectl get pod | grep nebula`命令，或者直接在 Kubernetes dashboard 上查看 nebula 集群的运行状况。

> 如何使用其他类型的存储？

参考文档：[https://kubernetes.io/zh/docs/concepts/storage/storage-classes/](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/)

## 参考资料

- [Helm 入门指南](https://www.hi-linux.com/posts/21466.html)
- [详解 k8s 组件 Ingress 边缘路由器并落地到微服务](http://www.aieve.cn/article/1571726983727)

## 附录

- Nebula Graph：一个开源的分布式图数据库
- GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula)
- 知乎：[zhihu.com/org/nebulagraph/posts](https://www.zhihu.com/org/nebulagraph/posts)
- 微博：[weibo.com/nebulagraph](https://weibo.com/nebulagraph)

## 推荐阅读

- [分布式图数据库 Nebula Graph 的 Index 实践](https://nebula-graph.io/cn/posts/how-indexing-works-in-nebula-graph/)
- [图数据库 Nebula Graph TTL 特性](https://nebula-graph.io/cn/posts/clean-stale-data-with-ttl-in-nebula-graph/)

