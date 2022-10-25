---
layout: article
title: 运用selenium+bs4实现课程表的爬取
tags: ["study","python","crawler"]
lightbox: true
show_author_profile: true
key: schedule_python
author: X73
mode: immersive
header:
  theme: dark
article_header:
  type: overlay
  theme: dark
  background_color: '#203028'
  background_image:
    gradient: 'linear-gradient(135deg, rgba(34, 139, 87 , .4), rgba(139, 34, 139, .4))'
---

锵锵✨

<!--more-->

为了解决每天忘记课程而需要不停进入教务系统查课表的烦恼（不是

刚刚学了一点点爬虫的x73决定写一个爬虫项目来爬取课表信息用来导入本地课表软件！

# 准备工作

## 用到的模块

| 模块              | 版本     |
| ----------------- | -------- |
| selenium          | `>= 4.0` |
| webdriver-manager | `3.8.4`  |
| bs4               | `4.11.1` |
| re                | `all`    |

## 用到的工具

PyCharm、 `Edge`{:.warning}

tips：Edge 为 selenium所需的浏览器，需保证最新版本，*可以是其他浏览器，但要保证代码中调整为相应的驱动*
{:.warning}

# 开始！！

## provider -- 获取课表页面源代码

### step1. 获取登录状态cookie

~~课表界面都没看到，怎么获取嘛~~ 

我们想要见到我们亲爱的课表同学，就先要保证我们处于登录状态，这样我们才能顺利的见到课表~

所以我们要先通过`selenium`{:.info}模拟登录行为，获取到登录状态下的cookie。

```python
def get_cookie(url):
    option = webdriver.EdgeOptions()
    option.add_argument('headless')
    option.add_argument('disable-gpu')
    service = EdgeService(executable_path=EdgeChromiumDriverManager().install())
    driver = webdriver.Edge(service=service, options=option)

    driver.get(url)
    driver.find_element(By.ID, 'username').send_keys('******') # your username/id
    driver.find_element(By.ID, 'passWord').send_keys('******') # your password
    driver.find_element(By.ID, 'loginButton').click()
    return driver.get_cookies()
```

> #### 小插曲
>
> 这里浅浅的讲一下 `selenium`{:.info} 的使用方法~
>
> step0. 设置隐藏浏览器，即使用**无头模式**进行，可以酌情删掉哦（不是
>
> ~~~python
> option = webdriver.EdgeOptions()
> option.add_argument('headless')
> option.add_argument('disable-gpu')
> ~~~
>
> step1. 使用 `install()` 获取管理器使用的位置, 并将其传递到服务类中
>
> ```python
> service = EdgeService(executable_path=EdgeChromiumDriverManager().install())
> ```
>
> step2. 使用 `Service` 实例并初始化驱动程序
>
> ```python
> driver = webdriver.Edge(service=service, options=option)
> ```
>
> 
>
> tips: 详情参考 [Install browser drivers - Selenium](https://www.selenium.dev/documentation/webdriver/getting_started/install_drivers/){:.button.button--outline-info.button--rounded}
> {:.info} 



### step2. 启动 Edge-Driver

接下来就可以启动 **`新的`** edgeDriver, 步骤和之前一样哦~

```python
def html_provider():
    print('[INFO] Get URL and Cookie')
    url = "http://jwglxt.hncj.edu.cn:8061/admin/indexMain/M140202"  # 课表页面url
    url_login = "http://jwglxt.hncj.edu.cn:8061/admin/login"  # 登录界面url
    cookies = get_cookie(url_login)

    print('[INFO] Start Edge Driver')
    option = webdriver.EdgeOptions()
    option.add_argument('headless')
    option.add_argument('disable-gpu')
    service = EdgeService(executable_path=EdgeChromiumDriverManager().install())
    driver = webdriver.Edge(service=service, options=option)
```



### step3. 添加Cookie

添加前需要先使用`driver.get(url)  `访问一次目的url, 让selenium识别到需要添加cookie的作用域，不然会报错哦！

```python
    print('[INFO] Getting HTML from URL')
    driver.get(url)  
    driver.delete_all_cookies()  # 这个也是必要的，不然cookie会添加失败，但不会报错！
    for i in cookies:
        driver.add_cookie(i)

    driver.get(url)
    driver.refresh()
```



### step4. 进入`iframe`

获取到页面`html`后，我们需要进入`iframe`中，因为课表信息是藏在里面的，不进入的话只能获取到框架的源码！

```python
    print('[INFO] Getting HTML from iframe')
    frame = driver.find_element(By.XPATH, '//*[@id="iframeCon"]/div/div/iframe')
    driver.switch_to.frame(frame)
```



### step5. 获取课表源码

```python
    soup = BeautifulSoup(driver.page_source, 'lxml')
    dataForm = soup.find('div', id='dataForm')
    # print(dataForm.prettify())

    print('[INFO] provider finished')
    return dataForm
```

就是这个页面的所有内容啦！

![image-20221025161807919](https://files.catbox.moe/bkl704.png)



## parser -- 提取信息并格式化

获取到课表的源码后我们就可以开始分析提取并进行格式化啦！

### step6. 处理单节课存在两种课程的情况

![123](https://files.catbox.moe/1og4qm.png)

我们发现一个单元格中，会出现存在两种课程的情况，即如上图，我们可以借用正则表达式通过提取周数的方式界定不同课程，以此保证不漏掉任何一节课。

```python
def html_parser(dataForm):
    print('[INFO] Start parsing HTML')
    result = []
    cells = dataForm.find_all('td', class_='cell')
    reg = re.compile(r'(([0-9-]+(\([单双]\))?,?)+(?=周))')
    for cell in cells:
        if len(cell.contents) < 1:
            continue
        tmp_ow = re.findall(reg, cell.text)
        originWeeks = [i[0] for i in tmp_ow]
        # print(originWeeks)
```



### step7. 一次提取每节课的信息

接下来我们就可以根据获取到的周数列表提取每节课的信息啦！

```python
    for i in range(len(originWeeks)):
        res = {'sections': [], 'weeks': []}
        aaa = cell.find_all('a')
```

#### day - 课程所在的星期（1~7）

根据单元格的`id`，我们可以轻松获取到星期数~~（感谢学校~~

```python
        # day
        res['day'] = cell['id'][4]
```

#### section - 节次

同上，根据单元格`id`，以及`rowspan`属性，也可以轻松获取课程节次

```python
        # section
        be = int(cell['id'][5])
        cl = int(cell['rowspan'])
        for j in range(be, be + cl):
            res['sections'].append(j)
```

#### name, teacher, position - 课程，教师，上课地点

这就更简单了，直接就在`text`中有了，直接按顺序获取就行

```python
        # name, teacher, position
        res['name'] = aaa[i * 3].text
        res['teacher'] = aaa[i * 3 + 1].text
        res['position'] = aaa[i * 3 + 2].text
```

tips：由于存在单个单元格多种课程的情况，索引中要加上前面`for`循环中的周次索引！
{:.warning}

#### weeks - 周次

这个有一点点复杂，也不是很复杂，~~只要先这样，再这样，就可以了！~~

看代码吧，灰常好~~李姐~~理解~

```python
        # weeks
        week = originWeeks[i].split(',')
        for w in week:
            try:
                be = int(w.split('-')[0])
                if len(w.split('-')) > 1:
                    cl = w.split('-')[1]
                else:
                    cl = be
                ds = w.split('(')
                if len(ds) > 1:
                    if ds[1] == '双)':
                        if be % 2 != 0:
                            be += 1
                        for j in range(be, int(cl.split('(')[0]) + 1, 2):
                            res['weeks'].append(j)
                    elif ds[1] == '单)':
                        if be % 2 == 0:
                            be += 1
                        for j in range(be, int(cl.split('(')[0]) + 1, 2):
                            res['weeks'].append(j)
                else:
                    for j in range(be, int(cl) + 1):
                        res['weeks'].append(j)
            except:
                print('Error: ', w + ' 周数无法分析')
```

### step8. 输出，搞定

```python
            result.append(res)
    print('[INFO] Finish parsing HTML')
    print('=' * 50)
    return result
```

### step-1. main

```python
from parser import html_parser
from provider import html_provider

if __name__ == '__main__':
    html = html_provider()
    # print(html)
    res = html_parser(html)
    for i in range(len(res)):
        print(f'{i}: {res[i]}')
```



# 最终结果

```shell
E:\anaconda3\envs\study\python.exe D:\source\PycharmProjects\study\crawler\main.py 
[INFO] Get URL and Cookie
[INFO] Start Edge Driver
[INFO] Getting HTML from URL
[INFO] Getting HTML from iframe
[INFO] provider finished
[INFO] Start parsing HTML
[INFO] Finish parsing HTML
==================================================
0: {'sections': [1, 2], 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 'day': '1', 'name': '数据导入与预处理', 'teacher': '薛冰', 'position': '筑美楼10#A514'}
1: {'sections': [1, 2], 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 'day': '2', 'name': '计算机组成原理', 'teacher': '仝瑞阳', 'position': '筑美楼10#A514'}
2: {'sections': [1, 2], 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 'day': '3', 'name': '分布式数据库原理及应用', 'teacher': '新进人员2', 'position': '筑美楼10#A513'}
3: {'sections': [1, 2], 'weeks': [1, 3, 5, 7, 9, 11, 13], 'day': '4', 'name': '计算机组成原理', 'teacher': '仝瑞阳', 'position': '筑美楼10#A514'}
4: {'sections': [1, 2], 'weeks': [2, 4, 6, 10, 12, 14], 'day': '4', 'name': '准职业人导向训练(5)', 'teacher': '刘源源', 'position': '筑美楼10#A413'}
5: {'sections': [1, 2], 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 'day': '5', 'name': 'Hadoop大数据技术', 'teacher': '新进人员1', 'position': '筑美楼10#A407'}
6: {'sections': [3, 4], 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 'day': '1', 'name': '分布式数据库原理及应用', 'teacher': '新进人员2', 'position': '筑美楼10#A513'}
7: {'sections': [3, 4], 'weeks': [1, 3, 5, 7, 9, 11, 13], 'day': '2', 'name': 'VIP创新项目(3)', 'teacher': '张军', 'position': '筑美楼10#A407'}
8: {'sections': [3, 4], 'weeks': [2, 4, 6, 8, 10, 12, 14], 'day': '2', 'name': 'Hadoop大数据技术', 'teacher': '新进人员1', 'position': '筑美楼10#A407'}
9: {'sections': [3, 4], 'weeks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 'day': '3', 'name': '数据导入与预处理', 'teacher': '薛冰', 'position': '筑美楼10#A514'}
10: {'sections': [3, 4], 'weeks': [8], 'day': '4', 'name': '准职业人导向训练(5)', 'teacher': '刘源源', 'position': '筑美楼10#A409'}
```

接下来就可以将结果导入到软件中进行进一步操作啦，这就是另外一件事了，下班！

# One More Thing.

没事了（

---

<div>
   <iframe src="https://ghbtns.com/github-btn.html?user=XST73&repo=XST73.github.io&type=star&count=true" frameborder="0" scrolling="0" width="150" height="20" title="GitHub"></iframe>
</div>
<div>
    <iframe src="https://ghbtns.com/github-btn.html?user=XST73&repo=XST73.github.io&type=follow&count=true" frameborder="0" scrolling="0" width="150" height="20" title="GitHub"></iframe>
</div>
