---
title: "Automating Your Project Processes with Github Actions"
date: 2020-03-17
author: Jerry
tags: ["best-practice", "test"]
description: "GitHub Action is a great free tool to help automate project workflows on GitHub. This post shares our experience using GitHub Action to automate our website release process."
---
# Automating Your Project Processes with Github Actions

![image](https://user-images.githubusercontent.com/38887077/76831941-482a3c80-6863-11ea-9795-009eaa50fc0e.png)

## Foreword

It's common in both company and personal projects to use tools to deal with replicated tasks  to improve efficiency.

This is especially true for the front-end development, because tackling with the repetitive tasks manually like building, deployment, unit testing is rather tedious and time-consuming.

This post introduces how we use Github Action to automatically deploy our front-end release in Nebula Graph.

## What is Github Action

Actions are tasks that can be triggered under certain conditions. You use a series of actions to form a workflow. Detailed information refer to its [Official Documentation](https://github.com/features/actions).

## Why Github Action

There are various solutions to automated front-end deployment, then why bother  switching to Github Action?

Because Github Action benefits you in the following ways:

- **It's free**.You can bind Github Action with your repository (shown in the picture below) then you can use it at once. This means you don't have to provide machines to run the tasks or care about how the workflows are connected. You simply learn the rules before running your project. Compared with Github Action, other tools are troublesome because when implementing function A, you have to complete steps B/C/D.

![image](https://user-images.githubusercontent.com/38887077/76831948-4e201d80-6863-11ea-9dee-be95cefb1ac1.png)

- **Multiple CI templates**. Github defines Action rules and provides multiple templates for all kinds of CI ([Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration)) configurations which make it extremely easy to get started. You can also create your own templates and publish them as actions on the [Github Marketplace](https://github.com/marketplace?type=actions). Our front-end deployment is based on various existing templates.
- **Built into Github**. Github Action is fully integrated into Github and therefore doesn't require any external tools like Travis. This means you can check CI/CD directly on GitHub.

Feel free to let us know if you find other benefits. :)

## Github Action in Nebula Graph

### Source Analysis

Since [Nebula Graph](https://github.com/vesoft-inc/nebula) is an open source graph database hosted on GitHub, it's natural for us to use the free Action to manage workflows like **continuous integration**. And front-end release is no exception.

For example, the Nebula Graph [official site](https://nebula-graph.io) templates are modified by developers while the contents on the site are maintained by the marketing team. The updates and maintenance are so frequent that it's a hassle to do that manually. Therefore, we need to automatically deploy the site. This is a typical Github Actions scenario.

### Getting Started With Github Action

Using Github Action is easy, as long as your repo source is associated with GitHub. After the association, you can automate your front-end deployment following the steps below.

1. You create a folder named `.github/workflows/` in the root directory of your repo to store workflows. One project can have multiple workflows. Here our workflow is the front-end release.

2. Then you create a `.yml` file under the `.github/workflows/` directory and name it as you wish. For example: publish.yml in our case.

3. Then you configure Action based on the GitHub workflow rules. Refer to the [Official Document](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions) if you feel like to. You can also try  the pre-configured workflow templates to gain a sense of how it works.

Below is a summary workflow file to automate our official site deployment. We add some comments to help you understand.

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
    # Each name here corresponds to an Action. 
    # The detailed execution logic has been encapsulated by the provider. 
    # Only what the user needs to care about is exposed.
    # Fetch the latest code from the master.
    - name: Checkout Github Action
      uses: actions/checkout@master

    # Our site is build with Hugo framework, 
    # we use the following code to download the related environment.
    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: '0.65.3'

    # To deploy sources to the cloud server, we need an ssh tool here.
    - name: Setup sshpass
      run: sudo apt-get install sshpass

    # Building the front-end sources.
    - name: Build
      run: hugo --minify -d nebula-website

    # Deployment.
    - name: Deploy
      uses: garygrossgarten/github-action-scp@release
      with:
          local: nebula-website
          remote: /home/vesoft/nebula-website
          # Don't include any security or personal information 
          # in case your repo is open to the public.
          # ${{ ... }} is applied in yor project settings. 
          # Configure the corresponding secrets key values to protect your privacy.
          host: ${{ secrets.HOST }}
          username: vesoft
          password: ${{ secrets.PASSWORD }}
          concurrency: 20
```

4. Finally, you commit the changes and push them to the origin. As long as the trigger rules are met in the workflow, corresponding operations are triggered. For example, we only allow that master to modify the code.

Now that you have finished the above steps, your workflow is ready to run. More details refer to the [Official Document](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#creating-a-workflow-file).

## Tips on GitHub Action

### Protecting Your Privacy

Don't include private information like account, password, IP, etc in the `.yml` file. If you have to, put this kind of information in your repo `Secrets` and use them via `${{ secrets.xxx }}` in your configuration file.

![image](https://user-images.githubusercontent.com/38887077/76831957-524c3b00-6863-11ea-9aeb-41d39dc70c70.png)

### Finding Your own GitHub Action

If you want an action, it doesn't necessarily mean that you need to write the action all by yourself, there is a chance that others have already created one and you can reuse their work. Github has built a [Marketplace](https://github.com/marketplace?type=actions) for these actions where people can find others' actions.

For Actions dealing with sensitive tasks, for example, passing accounts and passwords  when uploading servers, you'd better check how it is implemented before using it. By doing this, you can not only predicate the risks and but also know more about the rules and implementations. This helps a lot in your future work.

### Be Creative

Based on practical needs, our workflow involves various requirements. For example, when first using GitHub Action, I have to use VPN to access to the development server. I didn't understand how to connect it at first. Then I found the corresponding VPN command tool, using it in the calling process and achieved the desired effect quickly.

What I want to say here is that you are not alone as long as your demand is reasonable. There are two solutions here. One is that you are lucky enough to find the ready-made Actions and the other is to write your own one. Use your imagination, though.

### The Free Runner Performance

The runner is the environment for executing the configuration workflow. It is provided by GitHub to users for free. Of course, sometimes to being free means that the performance capacity is limited. For the workflow of some large projects, sometimes the free runner is too slow to meet the needs. Then you can consider using your own runner for integration. For example, a large project like [Nebula Graph](https://github.com/vesoft-inc/nebula) provides a runner environment itself. You can check the self-hosted runners [Official Guidelines](https://github.blog/2019-11-05-self-hosted-runners-for-github-actions-is-now-in-beta/) for detailed information.

## Conclusion

The above is my experience of using GitHub Action in daily front-end development. GitHub Action can also complete more different types of tasks, such as continuous integration. What GitHub Action can do is only limited by your imagination.

Workflows free us from the tedious and repetitive jobs so that we can dedicate ourselves to development. This is the ideal situation for me as an engineer. I hope my post can help you.

Welcome to try our open source graph database [Nebula Graph](https://github.com/vesoft-inc/nebula).
