---
title: "Dev Log | How to Release jar Package to the Maven Central Repository"
date: 2019-12-16
description: "This post is a step-by-step guide showing you how to release a Jar package to the Maven central repository."
author: "Jude"
tags: ["Dev-Log"]
---

## Summary

The Maven Central Repository does not support uploading jar packages directly, so you need to release them to some designated third-party Maven repositories, such as the Sonatype OSSRH repository, and then synchronize the jar packages to Maven through this repository. This article details the entire release, synchronization process.

## Create a Sonatype Account

Click [here](https://issues.sonatype.org/secure/Signup!default.jspa) to create an Sonatype account. Sonatype uses JIRA, a project management software provided by Atlassian, to manage the OSSRH repository.

## Creating a New Project Issue to Release Components

The first step to  commit a "component release request" is to create an issue on the [JIRA Dashborad](https://issues.sonatype.org/secure/Dashboard.jspa). Click the `Create` button shown is the picture:

![image](https://user-images.githubusercontent.com/56643819/72579532-54058b00-3914-11ea-9457-ccf381bea0ba.png)

Choose/type the project you want to create. Then choose an Issue Type. Put your Group ID in the summary and groupId fields.

Please be very careful with the Group ID which generally comes with a domain, because it will affect other components. Here we use domain com.vesoft.

Sonatype requests domain verification, so please verify via one of the following methods:

- Add a JIRA number record to your DNS
- Setup a redirect to your Github page

If you do not have any domains, please refer to this link: [http://central.sonatype.org/pages/choosing-your-coordinates.html](http://central.sonatype.org/pages/choosing-your-coordinates.html)

- Choose a Group ID with project hosting information, such as io.github.facebook or com.github.facebook
- Another recommended way is to use the free managed security reporting services
  - Use [https://hackerone.com/central-security-project/reports/new](https://hackerone.com/central-security-project/reports/new) as the security protection of your project. Then the Sonatype staffs will take care the left things for you.


## Waiting for Someone From Sonatype to Reply

It will take some time to review the issue due to the time difference. If your issue is approved, you will receive an email notification and a comment from the Sonatype staff under your issue. The comment looks like the follows:

> Configuration has been prepared, now you can:
> Deploy snapshot artifacts into repository [https://oss.sonatype.org/content/repositories/snapshots](https://oss.sonatype.org/content/repositories/snapshots)
> Deploy release artifacts into the staging repository [https://oss.sonatype.org/service/local/staging/](https://oss.sonatype.org/service/local/staging/) deploy/maven2
> Promote staged artifacts into repository 'Releases'
> Download snapshot and release artifacts from group [https://oss.sonatype.org/content/groups/public](https://oss.sonatype.org/content/groups/public)
> Download snapshot, release and staged artifacts from staging group [https://oss.sonatype.org/content/groups/staging](https://oss.sonatype.org/content/groups/staging)
> please comment on this ticket when you promoted your first release, thanks

## Use GPG to Create Key

### Creating a GPG Key

```bash
> gpg --gen-key
```

Select the encryption method:

- RSA and RSA (default)
- DSA and Elgamal
- DSA (sign only)
- RSA (sign only)

The first is selected by default. After selection, you need to enter the user name, email address, and Passphase, it's equivalent to the keystore password.

### View Public Key

```bash
> gpg --list-keys

xxx/.gnupg/pubring.gpg
---------------------------------
pub   2048R/xxxx 2019-12-02
uid   $YOUR_UID <$YOUR_EMAIL>
sub   2048R/**** 2019-12-02
```

The public key ID is XXXXXX. You will use it soon.

### Upload the Public Key to the PGP Key Server

```bash
gpg --keyserver hkp://keys.gnupg.net:11371 --send-keys xxxx
```

Check if the upload is successful.

```bash
> gpg --keyserver hkp://keys.gnupg.net:11371 --recv-keys xxxx

gpg: 下载密钥‘xxxx’，从 hkp 服务器 keys.gnupg.net
gpg: 密钥 xxxx：“$YOUR_UID <$YOUR_EMAIL>”未改变
gpg: 合计被处理的数量：1
gpg: 未改变：1
```

NOTE:

- Fill in the public key ID based on your situation
- Key server `pool.sks-keyservers.net` does not works well due to the failure in verification and the obtainment. Maven supports two key servers:  [http://keys.gnupg.net:11371](http://keys.gnupg.net:11371/) and [http://pool.sks-keyservers.net:11371](http://pool.sks-keyservers.net:11371/)
- We use hkp protocol instead of HTTP protocol
- **You also need to add the port number**

The local private key is used to digitally sign the uploaded component, and the user downloading the component can verify the signature through the uploaded public key. It is necessary to verify whether the component was uploaded by the account holder himself, because there is a possibility that the component can be modified.

## Modify the Maven Configuration Files

Modify the Maven Configuration File. To modify Maven, you need to modify the `setting.xml` file and the `pom.xml` file of your project.

### Configure the setting. xml File

Modify the `~/.m2/setting.xml` file.

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <servers>
      ...
        <server>
            <id>snapshots</id>
            <username>$USER_NAME</username>
            <password>$YOUR_PASSWORD</password>
        </server>
        <server>
            <id>release</id>
            <username>$USER_NAME</username>
            <password>$YOUR_PASSWORD</password>
        </server>
    </servers>

</settings>
```

Replace the  `USER_NAME` and `YOUR_PASSWORD` to your own Sonatype user name and password. You will use the ID here in the `pom.xml` file.

### Configure the pom. xml File

```xml
<project>
    ...

    <!-- More Project Information -->
    <name>nebula-java</name>
    <description>Nebula Java Client</description>
    <url>https://github.com/vesoft-inc/nebula-java</url>
    <scm>
        <connection>scm:git:https://github.com/vesoft-inc/nebula</connection>
        <url>https://github.com/vesoft-inc/nebula</url>
        <developerConnection>scm:git:https://github.com/vesoft-inc/nebula</developerConnection>
    </scm>
    <licenses>
        <license>
            <name>Apache License, Version 2.0</name>
            <url>https://www.apache.org/licenses/LICENSE-2.0.txt</url>
            <distribution>repo</distribution>
            <comments>license</comments>
        </license>
    </licenses>

    ...
    <profiles>
        <profile>
            <id>release</id>
            <build>
                <plugins>
                    <!-- Source -->
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-source-plugin</artifactId>
                        <executions>
                            <execution>
                                <id>attach-sources</id>
                                <goals>
                                    <goal>jar</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                    <!-- Javadoc -->
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-javadoc-plugin</artifactId>
                        <version>3.1.1</version>
                        <configuration>
                            <excludePackageNames>com.facebook.thrift:com.facebook.thrift.*</excludePackageNames>
                        </configuration>
                        <executions>
                            <execution>
                                <id>attach-javadocs</id>
                                <phase>package</phase>
                                <goals>
                                    <goal>jar</goal>
                                </goals>
                                <configuration>
                                    <doclint>none</doclint>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                    <!-- GPG -->
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-gpg-plugin</artifactId>
                        <version>1.6</version>
                        <executions>
                            <execution>
                                <phase>verify</phase>
                                <goals>
                                    <goal>sign</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
            <distributionManagement>
                <repository>
                    <id>release</id>
                    <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
                </repository>
                <snapshotRepository>
                    <id>snapshots</id>
                    <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
                </snapshotRepository>
            </distributionManagement>
        </profile>
    </profiles>
    ...
</project>
```

- The `pom.xml` file must include basic information like: `name`, `description`, `url`, `licenses`, `developers`, `scm`
- **To publish maven, you must have a documentation package and a source package in addition to the jar.** Therefore, pom needs to add `maven-javadoc-plugin` and `maven-source-plugin`. For example:

```xml
com-vesoft-client
|-- pom.xml
|-- src\
`-- target
    `-- attach-source-javadoc-1.0-SNAPSHOT.jar
    `-- attach-source-javadoc-1.0-SNAPSHOT-javadoc.jar
    `-- attach-source-javadoc-1.0-SNAPSHOT-sources.jar
```

- The release and building request key encryption, so pom needs to add the `maven-gpg-plugin`.

### Multi-Module Project Configuration

`nebula-java` is a multi-module project.

```xml
<modules>
    <module>client</module>
    <module>examples</module>
</modules>
```

To upload Client, please upload the parent `pom.xl` or the Client cannot find the dependencies. However, we don't want to upload the examples module thus making the following changes:

- Project information like `name`, `description`, `url`, `licenses`, `developers`, `scm` and `maven-gpg-plugin` are placed in the parent's `pom.xml` file.

```xml
<project>
  ...
    <name>nebula-java</name>
    <description>Nebula Java Client</description>
    <url>https://github.com/vesoft-inc/nebula-java</url>
    <scm>
        <connection>scm:git:https://github.com/vesoft-inc/nebula</connection>
        <url>https://github.com/vesoft-inc/nebula</url>
        <developerConnection>scm:git:https://github.com/vesoft-inc/nebula</developerConnection>
    </scm>
    <licenses>
        <license>
            <name>Apache License, Version 2.0</name>
            <url>https://www.apache.org/licenses/LICENSE-2.0.txt</url>
            <distribution>repo</distribution>
            <comments>license</comments>
        </license>
    </licenses>

    <developers>
        <developer>
            <id>$ID</id>
            <name>$NAME</name>
            <email>$EMAIL</email>
            <organization>vesoft</organization>
            <roles>
                <role>architect</role>
                <role>developer</role>
            </roles>
        </developer>
    </developers>

    <distributionManagement>
        <repository>
            <id>release</id>
            <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
        </repository>
        <snapshotRepository>
            <id>snapshots</id>
            <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
        </snapshotRepository>
    </distributionManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>1.6</version>
                <executions>
                    <execution>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
  </project>
```

- Add `maven-javadoc-plugin`, `maven-source-plugin` and `maven-deploy-plugin` in Java Client's `pom.xml` file.

```xml
<plugins>
  ......
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-source-plugin</artifactId>
        <executions>
            <execution>
                <id>attach-sources</id>
                <goals>
                    <goal>jar</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-javadoc-plugin</artifactId>
        <version>3.1.1</version>
        <configuration>
            <excludePackageNames>com.facebook.thrift:com.facebook.thrift.*</excludePackageNames>
        </configuration>
        <executions>
            <execution>
                <id>attach-javadocs</id>
                <phase>package</phase>
                <goals>
                    <goal>jar</goal>
                </goals>
                <configuration>
                    <doclint>none</doclint>
                </configuration>
            </execution>
        </executions>
    </plugin>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-deploy-plugin</artifactId>
        <executions>
            <execution>
                <id>default-deploy</id>
                <phase>deploy</phase>
            </execution>
        </executions>
    </plugin>
</plugins>
```

Declare skip deploy in example module's `pom.xml` file.

```xml
<plugins>
  ......
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-deploy-plugin</artifactId>
        <configuration>
            <skip>true</skip>
        </configuration>
    </plugin>
</plugins>
```

Q: Why is `maven-gpg-plugin` placed in the parent's `pom.xml`, while<br />`maven-javadoc-plugin` and `maven-source-plugin` plugins are placed in the client's `pom.xml`?

A: Because all the uploaded components need to be encrypted, including the parent's `pom.xml`; and only the client needs to upload javadoc and source, so `maven-javadoc-plugin` and `maven-source-plugin` plugins are put in Client.

## Upload Components to the OSS Cloud

Run the following command in the `nebula-java/` directory:

```xml
> mvn clean deploy -DpomFile=pom.xml
```

> NOTE: If you do not add -DpomFile, there will be no `pom.xml` of parent in the uploaded file.

## Publish Components in the OSS Cloud

Sign in [https://oss.sonatype.org/#stagingRepositories](https://oss.sonatype.org/#stagingRepositories) with your Sonatype account to check the uploaded components. They are currently placed in the Staging repository. You can perform fuzzy searches to locate the components you uploaded.

At this moment, the status of the component is `open`, choose it then click the `close` button. The system will automatically verify wether the component meets the requested needs. (Happy persons are all alike, every unhappy person is unhappy in his own way. You may encounter with various errors, so good luck!)

When the verification is done, the status turns to `Closed`.

![image](https://user-images.githubusercontent.com/56643819/72579626-9f1f9e00-3914-11ea-80a8-f21d7a40ac22.png)

Finally, click `Release` to release the component.

![image](https://user-images.githubusercontent.com/56643819/72579649-afd01400-3914-11ea-92e4-0892fca416e9.png)

Refresh your page to view the latest status.

## Notifying Sonatype That the Components Have Been Published Successfully

Add a comment under the JIRA issue mentioned above to inform the Sonatype staffs that the components are released successfully so they can review them. Once released, the issue will be closed.

## Waiting for Component Approval

You just wait for the approval.

## Search for Components From the Central Warehouse

After about ten minutes, you can find the newly released component here [https://repo1.maven.org/maven2](https://repo1.maven.org/maven2), which can be used directly in the `pom.xml` file. ~~ 👏👏

Your central repository (link: [http://search.maven.org/](http://search.maven.org/)) becomes accessible after the synchronization is completed in about 2 hours.

Once you have successfully released the components for the first time. You don't need to bother to repeat the whole process again, rather, you can use the Group ID directly to implement new releases.

## New Release Guide

Process on releasing components with the same Group ID:

- Edit the `settings.xml` file and the `pom.xml` file according to the preceding session;
- Upload Your Deployment;
- Close and release the components at [https://oss.sonatype.org/;](https://oss.sonatype.org/;)
- Wait for the sync (about 2 hours)

Tips: Modification and deletion are not supported in the published releases.

## GitHub Repository

More details on **Nebula Graph** please refer to our GitHub [Repository](https://github.com/vesoft-inc/nebula). We appreciate your issues or prs. If you like us, please give us a star.
