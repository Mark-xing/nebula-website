---
title: "Nebula Contributor | How to Be a GitHub Contributor in Five Minutes"
date: 2020-02-04
description: "This article shows you how to contribute to your first open source project in just five minutes."
author: "Amber"
tags: ["Community"]
---

Contribute to your first open source project in just five minutes with the help of **Nebula Graph**.

## Preface

If you don't have a [GitHub](https://github.com/) account, or aren't sure what [Git](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F) is, please refer to the official website first.

## How to Be a GitHub Contributor

### Fork

![image](https://user-images.githubusercontent.com/38887077/75140348-add64d80-5729-11ea-97ac-07e7ab61fff7.png)

Fork the **Nebula Graph** repo by clicking on the fork button on the top of the main page. This will create a copy of this repository in your account.

### Fork Completed

You can see `nebula` repository is in your repository list. Please be noted the information `This branch is 117 commits behind vesoft-inc:master.`, which indicates the deference between your branch and the master. If you just forked the repository, the information is `This branch is even with vesoft-inc:master.`

![image](https://user-images.githubusercontent.com/38887077/75140375-bc246980-5729-11ea-9aea-df24ce4bb9f2.png)

### Clone the Repository

Clone the repository to your local machine. Click the `Clone or download` button then click the _copy to clipboard_ icon. Your remote repo on Github is called origin.

![image](https://user-images.githubusercontent.com/38887077/75140380-bfb7f080-5729-11ea-950c-cabedad3bfc3.png)

Open a terminal and run the following git command:

```bash
~ git clone "url you just copied"
```

where “url you just copied” (without the quote marks) is the url to the **Nebula Graph** repository. See the previous picture to obtain the url. For example:

```bash
~  git clone git@https://github.com/nebula-package/nebula.git
```

where `nebula-package` is the user name.

```bash
# Add upstream
~ cd $working_dir/nebula
~ git remote add upstream https://github.com/vesoft-inc/nebula.git

# Never push to the upstream master since your don't have the write access
~ git remote set-url --push upstream no_push

# Confirm that your remotes make sense:
# The right format is:
# origin    git@github.com:$(user)/nebula.git (fetch)
# origin    git@github.com:$(user)/nebula.git (push)
# upstream  https://github.com/vesoft-inc/nebula (fetch)
# upstream  no_push (push)
~ git remote -v
```

### Define a Pre-Commit Hook

Please link the **Nebula Graph** pre-commit hook into your `.git` directory. This hook checks your commits for formatting, building, doc generation, etc.

```bash
~ cd $working_dir/nebula/.git/hooks
~ ln -s ../../cpplint/bin/pre-commit.sh .
```

### Create a Branch

Switch to the **Nebula Graph** repository directory and create a new branch named `myfeature` to work on!

```bash
~  cd nebula

// If you created your fork a while ago be sure to pull upstream changes into your local repository.
~ git fetch upstream
~ git checkout master
~ git rebase upstream/master

// Create a branch from master and switch to your branch
~ git checkout -b myfeature
```

### Code and Documentation Style

You can implement/fix your feature, comment your code in your `myfeature` branch now. Please follow the  [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html) style and [Documentation Style Guide](https://github.com/vesoft-inc/nebula/blob/master/docs/manual-CN/4.contributions/developer-documentation-style-guide.md).

We are using the [clang-format](https://clang.llvm.org/docs/ClangFormatStyleOptions.html) to format the code. It is recommended that you configure it according to the IDE/editor you use. The following links show how to configure clang-format with vim/emacs/vscode.<br />vim:

[https://github.com/rhysd/vim-clang-format](https://github.com/rhysd/vim-clang-format)

emacs:

[https://github.com/llvm-mirror/clang/blob/master/tools/clang-format/clang-format.el](https://github.com/llvm-mirror/clang/blob/master/tools/clang-format/clang-format.el)

vscode:

[https://code.visualstudio.com/docs/cpp/cpp-ide#_code-formatting](https://code.visualstudio.com/docs/cpp/cpp-ide#_code-formatting)

### Develop

Edit your code and commit the changes with the following command.

```bash
~ git commit -m 'new feature'
```

### Push Changes to GitHub

When ready to review (or just to establish an offsite backup or your work), push your branch to your fork on `github.com`:

```bash
~  git push -f origin myfeature
```

### Create Pull Request

1. Visit your fork at `https://github.com/$user/nebula` (replace $user obviously).
1. Click the `Compare & pull request` button next to your `myfeature` branch.

### Get a Code Review

Once your pull request has been opened, it will be assigned to at least two reviewers. Those reviewers will do a thorough code review to ensure the changes meet the repository's contributing guidelines and other quality standards.

Once the pull request is approved and merged you can pull the changes from upstream to your local repo and delete your extra branch(es).

## How to be Nebula Graph Contributor

You can become a **Nebula Graph** contributor by contributing code or documentation. This section shows you how to raise doc pr to be our contributor. The follow picture shows the doc toc and you can make changes in any of the `.md` doc files. Consider the _Get Started_ doc as example.

### Example: Get Started

![image](https://user-images.githubusercontent.com/38887077/75140418-d78f7480-5729-11ea-9a97-7fb861d9e03e.png)

The above picture shows the change log of the doc. You can add details, fix errors or even rewrite the whole doc to make it more organized and readable.

Please refer to the [Documentation Toc](https://github.com/vesoft-inc/nebula/blob/master/docs/manual-EN/README.md) to see all the **Nebula Graph** docs.

Last but not least, you are welcome to try **Nebula Graph** at our [GitHub Repository](https://github.com/vesoft-inc/nebula). If you have any problems or suggestions please raise us an issue.
