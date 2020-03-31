---
title: "How to Reduce Docker Image Size"
date: 2020-02-11
description: "This post shows you several ways to reduce Docker image size. These tips helped Nebula Graph devs reduce the image from 1.3G to 0.3G."
author: "Jerry"
tags: ["Performance"]
---

![Docker](https://user-images.githubusercontent.com/56643819/74205747-8dcb7680-4cb3-11ea-97c0-7c8bf36dd0e1.png)

If there are top ten buzzwords in the technology industry in the year of 2019, **container** is sure to be one of them. With the popularity of Docker, more and more scenarios are using Docker in the front-end field. This article shows how do we use Docker in the visualization interface of **Nebula Graph**, a distributed open source graph database.

## Why Using Docker

Docker is widely used in daily front-end development. [Nebula Graph Studio](https://github.com/vesoft-inc/nebula-web-docker/blob/master/README.md) (A visualization tool for **Nebula Graph**) uses Docker based on the following considerations:

- **Unified operating environment**: There are several services behind our tools, such as existing services from different technology stacks, and pure front-end static resources.<br />
- **Low user cost**: Currently, cloud services are under development. We want a smooth experience of the combined services, and Docker makes this possible with the ability of starting and applying all the services locally just in one step.
- **Quick deployment**: This front-end project is inspired by the [Nebula Graph Docker Image](https://github.com/vesoft-inc/nebula-docker-compose).

## Building Docker Image

We need to build an image first before hosing our services with Docker. Here we need a configuration file named [Dockerfile](https://docs.docker.com/engine/reference/builder/) that contains descriptions of the building steps. To be brief, we need to copy the project into the image and set the startup method:

```shell
# Select base image
FROM node:10
# Set work directory
WORKDIR /nebula-web-console
# Copy the current project to the /nebula-web-console directory of the image
ADD . /nebula-web-console
# Download front-end dependency in the image
RUN npm install
# Run the building
RUN npm run build
EXPOSE 7001
# Deployment commands executed when the image starts
CMD ["npm", "run", "docker-start"]
```

## Reducing Docker Image

The above configuration file will build a Docker image with a size of about 1.3GB, which looks a bit scary because downloading is too time-consuming even with a fast network. That is totally unacceptable.

After some research, we learned some tips that help reduce Docker image size.

### Using Smaller Base Image

Docker base image (for example, the above mentioned `node:10`) is the basic image on which you add layers and create a final image containing your applications. There are **multiple versions** of the Node.js image on [DockerHub](https://hub.docker.com/_/node), and each of them share a different **internal environment**. For example, the [alpine](https://yeasy.gitbooks.io/docker_practice/cases/os/alpine.html) version is a more simplified Linux system image that removes some tools like bash, curl etc. to decrease size.

Based on our needs, we change the base image to [alpine](https://yeasy.gitbooks.io/docker_practice/cases/os/alpine.html) and rebuild to reduce the docker image from 1.3GB to 500MB+. So if the docker image you are building is too large, you can **replace the basic image**.

### Multi-stage Build

[Multi-stage](https://docs.docker.com/develop/develop-images/multistage-build/) build in docker is a new feature introduced in docker 17.05. It is a method to reduce the image size, create a better organization of docker commands, and improve the performance while keeping the dockerfile easy to read and understand.

#### Docker Building Principle

In short, multi-stage build is dividing the dockerfile into multiple stages to pass the required artifact from one stage to another and eventually deliver the final artifact in the last stage. This way, our final image won't have any unnecessary content except our required artifact. Let's consider an example:

```shell
# Set up the image generated in the first step and name it builder
FROM node:10-alpine as builder
WORKDIR /nebula-web-console
# Copy the current project to the image
ADD . /nebula-web-console
# Start building
RUN npm install
RUN npm run build
....

# Start the second step build
FROM node:10-alpine
WORKDIR /nebula-web-console
# Copy the product of the first step image to the current image. Only one image layer is used here, which saves the number of image layers in the previous building step.

COPY --from=builder . /nebula-web-console
CMD ["npm", "run", "docker-start"]
```

### .dockerignore

Similar to the well known `.gitignore` that ignores unnecessary (such as document files, git files, node_modules, etc) files when using `COPY` or `ADD` command to copy or add files, we can use [.dockerignore](https://docs.docker.com/engine/reference/builder/#dockerignore-file) to specify files to be ignored.

### Merging Multiple Layers Into One

When building a Docker image with a Dockerfile, each operation adds a new layer based on the previous step image. We can use `&` to merge multiple operations to reduce layers. For example:

```shell
# The two operations represent two layers
RUN npm install
RUN npm run build
```

Merge the above command to one:

```shell
# It becomes a single layer with &
RUN npm install && npm run build
```

### Regular Front-End Optimization

- Compress ugly code and remove source code<br />
Finish this step when building image so that the image size is further reduced.
- Only downloading code needed for production with node_modules<br />
Finish this step when deploying, be sure to download only third party dependence code for production: `npm install --production`
- Place public source on CDN<br />
If the image is expected to run in network environment, place large public files ( pictures and third party libraries, etc.) on the the CDN server so that some resources are separated and the image size is further reduced.
- ...

The above suggestions are only for your reference. You can migrate more regular front-end optimizations to the image given that image building itself is an environment for running code.

## Summary

The above is our experience on reducing the Docker image of the [Nebula Graph Studio](https://github.com/vesoft-inc/nebula-web-docker/blob/master/README.md). Please leave us a comment if you have any questions. Welcome try Nebula Graph Studio on [GitHub](https://github.com/vesoft-inc/nebula-web-docker).

## References

- [How to reduce Docker Image sizes using multi-stage builds](https://blog.logrocket.com/reduce-docker-image-sizes-using-multi-stage-builds/)
- [Nebula Graph Docker](https://github.com/vesoft-inc/nebula-docker-compose)
- [Nebula Graph Studio](https://github.com/vesoft-inc/nebula-web-docker)
