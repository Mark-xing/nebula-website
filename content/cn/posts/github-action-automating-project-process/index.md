---
title: "使用 Github Action 进行前端自动化发布"
date: 2020-03-17
description: "说起自动化，无论是在公司还是我们个人的项目中，都会用到或者编写一些工具来帮助我们去处理琐碎重复的工作，以节约时间提升效率…"
tags: ["开发日志"]
author: Jerry
---

![image.png](https://nebula-blog.azureedge.net/nebula-blog/Action01.png)

## 前言

说起自动化，无论是在公司还是我们个人的项目中，都会用到或者编写一些工具来帮助我们去处理琐碎重复的工作，以节约时间提升效率，尤其是我们做前端开发会涉及诸如构建、部署、单元测试等这些开发工作流中重复的事项，本篇文章就是介绍如何利用 GitHub 提供的 Actions 来完成我们前端的发布自动化。

## Github Actions

### 什么是 Actions

笔者个人理解为在某种条件下可被触发的任务，利用一个个任务（Action）就可组建成我们的工作流，想要更详细的介绍定义的同学可以移步 [官方Action定义](https://github.com/features/actions)，有助获取更多的信息，这里就不搬运啦~

### 使用 Actions 的好处

前端自动化部署方案有多种，那么 GitHub 推出的 Actions 有什么魅力呢？在笔者看来，Action 在前端自动化发布有下面 3 点亮点：

  - **免费**，Action 可与 GitHub 中的 Repo 进行绑定（下图所示，具体操作见下文），**开箱即用**：这就意味着我们不需要提供跑任务的机器，也不用管怎么把任务流对接起来，只要简单地熟悉规则，就能将项目 run 起来。而我们大部分觉得某个工具麻烦，是因为使用步骤繁琐，若要实现功能 A，还需做 B/C/D 操作才行，这时候我们要么放弃要么转向操作更简单的工具，毕竟省时省事才是开发第一要务~
  
  ![image.png](https://nebula-blog.azureedge.net/nebula-blog/Action02.png)

  - **任务插件化**，持续丰富的插件开源市场：得益于 Github 定义了 Actions 规范，让我们使用的 Actions 时都是按某种已知规则开发，这使得 Actions 更易于装配复用，很多优秀的开发者在制作完成工作流后，将自己开发的 Actions 放到 GitHub 的 [Actions 集市](https://github.com/marketplace?type=actions)上去，这样尚未完成自己常规工作流的开发，不需要额外开发这些已有重复逻辑直接使用现成的他人 Actions 即可。在笔者的实践过程中，前端的构建部署工作流，就是用的各类现有的 Actions 组合实现的。
  - **和 GitHub 集成好**，可避免因为使用 Travis 等第三方工具引起额外的心智负担，在 GitHub 上可直接查看 CI/CD 的情况。

当然 Actions 还有许多其他好处，还待各位亲自尝试，至少使用过 Actions 的人都说好 😬

## Actions 在业务场景下的实践

### 分析来源

因为 Nebula Graph 是一家做开源的分布式图数据库（[Nebula Graph](https://github.com/vesoft-inc/nebula)：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula)），项目均依托 GitHub 来管理，所以很自然地使用由 GitHub 免费提供的 Actions 来完成我们日常的**持续集成**等工作流，在前端业务上自然也不例外。

举个例子，笔者开发了一个专门介绍图数据库  Nebula Graph 的官网，除了根据需求修改站点主题模板的开发人员，网站日常维护主要由运营同学来管理内置的博客内容，而内容更新这个动作比较高频，基本上每一天运营同学就会发布一篇技术性相关的博客文章。为了让内容更新这个动作完全不依赖于开发同学，站点实现实时部署更新，这就要求将内容发布过程自动化，这也是我们前端日常使用 Github Actions 的主要场景之一。

### Actions 快速开始

要使用 Actions 是件容易的事情，前提只要你的 Repo 源同 GitHub 关联，关联之后根据以下操作就能实现你的前端部署自动化。

在 Repo 的根目录中，创建一个名为 `.github/workflows/` 的文件夹，用来存放工作流的描述文件，一个项目可以有多个工作流，这里我们的工作流为前端的发布。

然后，在创建好的 `.github/workflows/` 目录中，以 `.yml` 为扩展名创建对应该工作流的描述文件，命名可自定义，例如：publish.yml。

接下来，参考 GitHub 提供的工作流描述规则进行任务 Actions 配置，详细可以看[官方文档](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions)，当然觉得文档冗长可在网上随便搜个简单的例子直接复制试试，亲测下很快就能摸清 Actions 配置套路。

下面是我们自己实现官网自动发布工作流的配置摘要，加了少量注释帮助大家理解：

```yaml
name:
on:
  push:
    branches:
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    # 此处每一个name对应着一个Action，具体执行逻辑已被提供者进行封装，暴露给用户的只是需要用户需要关心和配置的
    # 从master上获取最新代码
    - name: Checkout Github Action
      uses: actions/checkout@master
    
    # 我们的站点使用Hugo框架进行构建，此处是下载相关环境
    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: '0.65.3'
    
    # 为了将资源部署到云服务器，此处下载一个ssh传资料的工具
    - name: Setup sshpass
      run: sudo apt-get install sshpass

    # 进行前端资源的构建
    - name: Build
      run: hugo --minify -d nebula-website

    # 部署
    - name: Deploy
      uses: garygrossgarten/github-action-scp@release
      with:
          local: nebula-website
          remote: /home/vesoft/nebula-website
          # 涉及偏安全隐私的信息，不要明文暴露在此文件中，因为repo很可能是公开的，会被所有人看见
          # ${{ ... }} 会应用你在对应项目设置中，配置的对应serets的键值信息，从而保护私密信息不被看到
          host: ${{ secrets.HOST }}
          username: vesoft
          password: ${{ secrets.PASSWORD }}
          concurrency: 20
```

最后，便是提交相应改动，将分支推到远端，只要符合工作流中我们预先定义好的触发规则，对应的操作即可被触发，比如，在笔者的实践中定义了官网仅限 master 代码变动。

完成以上步骤，就能使你的工作流 run 起来，更详细的介绍，可以看下 GitHub 提供的[帮助文档](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#creating-a-workflow-file)，此处就不再赘述。

### Actions 使用注意事项

#### 私密信息保护

 `.yml` 工作流配置文件中，不要出现私密信息，诸如：账号、密码、ip 等等，具体实操过程中你可将这类信息通通放到 Repo 的 secrets 设置中添加，并以 `${{ secrets.xxx }}` 的变量访问形式在配置文件中使用。<br /> 

![image.png](https://nebula-blog.azureedge.net/nebula-blog/Action03.png)

#### 寻找合适 Action

在配置我们的工作流中，基于我们的目的是为了快速高效地完成工作，因此不大可能亲自去开发每一个需要用到的 Action，一般操作是去现成的 [Actions 市场](https://github.com/marketplace?type=actions) 找寻已有的 Actions 直接使用。

对于一些处理敏感任务的 Actions，比如，上传服务器时若需将账号、密码传给此 Actions，使用前最好查看下这个 Actions 的具体实现，一来能预知其中是否存在的风险，二来也能满足好奇心了解相应的 Actions 规范和实现机制，帮助自己下次开发 Actions 做技术积累。

#### 发挥想象力

根据实际的需要，我们的工作流搭配可能会有各类形形色色的需要，比如，笔者最开始使用 GitHub Actions 时，需要连接 VPN 才能访问开发服务器，刚开始没太理解如何连接怕麻烦弄不了，后面慢慢找到对应的 VPN 命令工具做实验并理解这个调用过程后，很快地实现了想要的效果。

这里想说的就是，只要需求合理，肯定不只你一个人会遇到，而此时就会有两种对应的解决办法，一是运气好地有现成的 Actions 等你使用，二是麻烦点自己用脚本来描述，总之要有想象力~

#### 考虑免费 runner 的性能

runner 就是执行配置工作流的环境，是由 GitHub 免费提供给用户使用，当然免费大概率意味着性能容量有限，对于一些大型项目的工作流来说，有时候免费的 runner 跑起来有些慢不满足需求，此时可考虑自己提供 runner 来集成，比如像我们的 [Nebula ](https://github.com/vesoft-inc/nebula) 这样大的项目就自己提供了 runner 环境，这里不赘述，感兴趣的可查看 [Self-hosted runners 官方指引](https://github.blog/2019-11-05-self-hosted-runners-for-github-actions-is-now-in-beta/)。


## Actions 实践小结

以上便是笔者在日常前端开发中使用 GitHub Action 的心得体会，Actions 还能完成更多不同类型的任务流程，比如持续集成，应该只有想不到没有做不到的道理。

通过项目下的一个个工作流，能从各个方面避免重复琐碎的工作，让我们更专注于实现逻辑本身，我想这是工程师最希望达到的状态。希望这里的简短介绍能给各位带来帮助，另外欢迎大家关注和使用我们的 [Nebula开源图数据库](https://github.com/vesoft-inc/nebula)，谢谢🤝

## 附录

- Nebula Graph：一个开源的分布式图数据库
- GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula)
- 官方论坛：[https://discuss.nebula-graph.io](https://discuss.nebula-graph.io)
- 知乎：[zhihu.com/org/nebulagraph/posts](https://www.zhihu.com/org/nebulagraph/posts)
- 微博：[weibo.com/nebulagraph](https://weibo.com/nebulagraph)

> 作者有话说：Hi，我是 Jerry，是图数据 Nebula Graph 前端工程师，在前端平台工具开发及工程化方面有些小心得，希望写的经验分享能给大家带来帮助，如有不当之处也希望能帮忙纠正，谢谢~
