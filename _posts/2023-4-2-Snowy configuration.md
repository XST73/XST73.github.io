---
layout: article
title: Snowy2.0 环境配置 & 初步启动
tags: ["works","java","others"]
lightbox: true
show_author_profile: true
key: the_snowy2_environment_configuration
author: X73
mode: immersive
header:
  theme: dark
article_header:
  type: overlay
  theme: dark
  background_color: '#203028'
  background_image:
    gradient: 'linear-gradient(135deg, rgba(67, 203, 255, .4), rgba(151, 8, 204, .4))'
---

-🧐仅供参考-

<!--more-->

tips: 本文章为本次使用的推荐配置和启动方式，仅供参考。官方启动文档👉 [文档 - 小诺开源技术](https://xiaonuo.vip/doc?catalogueId=1574674577108783105&menuId=1576974833302994946&lineIndex=1){:.button.button--outline-info.button--rounded}
{:.info}

# 环境准备

|  插件   |   版本    |                          安装&配置                           |                           下载地址                           |
| :-----: | :-------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| node.js |  最新版   |                         下载安装即可                         | [19.8.1 (nodejs.org)](https://nodejs.org/dist/v19.8.1/node-v19.8.1-x64.msi){:.button.button--outline-info.button--rounded} |
|   jdk   | 11 / 1.8  | [安装与环境变量配置](https://zhuanlan.zhihu.com/p/487499045){:.button.button--outline-success.button--rounded} | [Java 1.8 Downloads](https://www.oracle.com/java/technologies/downloads/#java8-windows){:.button.button--outline-info.button--rounded} |
| lombok  | idea默认  |                           idea自带                           |                              -                               |
|  maven  |  最新版   | [Maven 环境配置](https://www.runoob.com/maven/maven-setup.html){:.button.button--outline-success.button--rounded} | [apache-maven-3.9.1](https://dlcdn.apache.org/maven/maven-3/3.9.1/binaries/apache-maven-3.9.1-bin.zip){:.button.button--outline-info.button--rounded} |
|  redis  |  最新版   | [Redis 安装](https://www.runoob.com/redis/redis-install.html){:.button.button--outline-success.button--rounded} | [Redis-x64-5.0.14.1.msi](https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.msi){:.button.button--outline-info.button--rounded} |
|  mysql  | 8.0 / 5.7 | [MySQL安装与配置](https://www.runoob.com/w3cnote/windows10-mysql-installer.html){:.button.button--outline-success.button--rounded} | [MySQL 8.0 Installer](https://dev.mysql.com/downloads/installer/){:.button.button--outline-info.button--rounded} |

PS: **MySQL**安装文档中版本与提供的下载版虽本不同，但步骤大体一致（基本一直下一步就好，该设置账号密码时设置即可）；建议使用默认安装方式，防止后期出现奇怪的问题。
{:.warning}



# 代码下载与导入

## 代码下载

登录 [Gitee](https://gitee.com/login?redirect_to_url=%2Fdashboard){:.button.button--outline-primary.button--pill} 后，通过以下链接下载到本地，保存到一个合适的地方即可。

[下载地址 - Gitee](https://gitee.com/xiaonuobase/snowy/repository/archive/master.zip){:.button.button--outline-info.button--rounded}

## 导入项目

### 后端导入

打开idea，点击`file（文件）` -> `open（打开）`，选择下载的项目文件夹，点击`ok`即可导入。

导入成功后IDEA显示如下：

![ieda_open_snowy.jpg](https://siteapi.xiaonuo.vip/dev/file/download?id=1576977461625847810)



### 前端导入

打开vscode，点击`file(文件)`->`Open floder...(打开文件夹...)`,选择项目文件夹下的`snowy-admin-web`,点击`选择文件夹`导入即可。

导入成功之后vscode显示如下：

![image.png](https://s2.loli.net/2023/04/03/G6Mr5nUev7yOD3t.png)



# 启动项目

## 前端启动

1. 在vscode的控制台中输入

    ```shell
    npm install
    ```

    ![image.png](https://s2.loli.net/2023/04/03/uMGEocTKZtqlRdP.png)

    等待所需文件加载完成后，即出现类似于 `added 732 packages in 2m`{:.success} 的提示，便可进行下一步。

    > PS: 若加载过于缓慢，可以先进行换源：
    >
    > ```shell
    > npm config set registry https://registry.npm.taobao.org
    > ```

2. 在控制台输入

   ```shell
   npm run serve
   ```

   出现以下画面即为运行成功：

   ![image.png](https://s2.loli.net/2023/04/03/8JvXe4QRTKul536.png)

   PS:若长时间（大约5~10min）未出现，请稍加等待，不排除还未加载完成的可能（如果真的很长时间还没反应，大概是卡住了...
   {:.warning}

   打开浏览器，访问[http://localhost:81](http://localhost:81)，即可看到登录界面，至此前端启动完成。



## 后端启动

### 运行SQL文件

1. 打开 `Navicat`{:.success}，并连接到本地MySQL；

   ![image-20230405151047562](https://s2.loli.net/2023/04/05/Gz6hkVZdaeICObi.png)

   ![image-20230405151347602](https://s2.loli.net/2023/04/05/Vudf2PMkcjotBlK.png)   <img src="https://s2.loli.net/2023/04/05/cXbef3tPw4kYdJ6.png" alt="image-20230405151537796" style="zoom: 50%;" />

2. 新建一个`database`,名称随意（自己能辨认就行，建议`snowy_test`,方便后续操作）

   1. 点击<img src="https://s2.loli.net/2023/04/05/jWZP6mAdwuYS7Xt.png" alt="image-20230405152802552" style="zoom: 67%;" />

   2. 新建`database`

      ```sql
      CREATE DATABASE `snowy_test`;
      ```

   3. 选择刚刚输入的命令，并点击![image-20230405153112124](https://s2.loli.net/2023/04/05/FcVtYln35zvh92e.png)

3. 运行SQL文件

![image-20230405153953275](https://s2.loli.net/2023/04/05/7KhyE85oWJRikMS.png)

   文件路径为：`%你的项目文件夹路径%\snowy-web-app\src\main\resources\_sql\snowy_mysql.sql`![image-20230405154829241](https://s2.loli.net/2023/04/05/UT3dvbO4w8rmlQR.png)
   {:.info}



### 确认JDK版本

项目导入后，在`IDEA`中， 使用快捷键`Ctrl+Alt+Shift+S`打开项目结构菜单，确认你的JDK版本是JDK1.8 ~ 11，其他版本均不可行

![image.png](https://siteapi.xiaonuo.vip/dev/file/download?id=1575406038334136321)

### 修改配置文件

打开`snowy-web-app`的`resources`目录下的`aplication.properties`，放开对应的数据库配置，并修改数据库的连接信息

```properties
#########################################
# mysql configuration
#########################################
spring.datasource.dynamic.datasource.master.driver-class-name=com.mysql.cj.jdbc.Driver
# jdbc:mysql://localhost:3306/%你的数据库名称%?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&nullCatalogMeansCurrent=true&useInformationSchema=true
spring.datasource.dynamic.datasource.master.url=jdbc:mysql://localhost:3306/snowy_test?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&nullCatalogMeansCurrent=true&useInformationSchema=true
# 你的MySQL账户，默认为root
spring.datasource.dynamic.datasource.master.username=root
# 你的MySQL密码
spring.datasource.dynamic.datasource.master.password=123456
spring.datasource.dynamic.strict=true
```

### 启动项目

maven环境如若就绪，项目会自动刷新后加载`Application`启动项，在`\snowy-web-app\src\main\java\vip.xiaonuo\`下找到`Application`，点击第一个![image-20230405161651315](https://s2.loli.net/2023/04/05/6l8o5ILabYSzpJf.png)，选择![image-20230405161721705](https://s2.loli.net/2023/04/05/LvpjZXzFmGnOJ2T.png)。

项目开始启动，控制台最后一行打印如下信息表示项目启动成功。

```
2023-04-05 16:19:05.798  INFO 11188 --- [           main] vip.xiaonuo.Application                  : >>> APPLICATION STARTING SUCCESS
```

打开浏览器，访问[http://localhost:82](http://localhost:82)，出现下图表示后端启动成功

![image.png](https://siteapi.xiaonuo.vip/dev/file/download?id=1575407101971881985)

至此，后端启动完成。

此时可通过前端提供的链接[http://localhost:81](http://localhost:81)， 进入登录界面，点击登录，即可进入系统👌



<h2 style="text-align: center">The End.</h2>
---

<div>
   <iframe src="https://ghbtns.com/github-btn.html?user=XST73&repo=XST73.github.io&type=star&count=true" frameborder="0" scrolling="0" width="150" height="20" title="GitHub"></iframe>
</div>
<div>
    <iframe src="https://ghbtns.com/github-btn.html?user=XST73&repo=XST73.github.io&type=follow&count=true" frameborder="0" scrolling="0" width="150" height="20" title="GitHub"></iframe>
</div>
