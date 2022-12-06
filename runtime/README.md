# DBA runtime

## info

### route

`hide`或者`some.hide`文件夹表示不会在路由路径上显示，里面的`hide.html`是必不可少的(习惯使用模板的人
可以把它当作layout理解，表示内部的路由使用相同的`hide.html`模板)，这样做的好处是尽可能多的分割复用模
块减少不必要的更新

url -----> home
url/a ---> page1
url/b ---> page2
url/a/c -> page1 + child1
url/a/d -> page1 + child2

新的模板模式：`some.hide`文件夹表示内部页面使用相同的`layout.html`模板

+---------------------+
| page1  |            |
|        |    compt1  |
+---------------------+

+---------------------+
| page2  |            |
|        |    compt1  |
+---------------------+

+---------------------+
| page1               |
| page2               |
| page3               |
|                     |
|---------------------|
|    bottom bar       |
+---------------------+

## TODO

[x] router
[ ] reactive
[ ] global state(notice)
[ ] svg icon
[ ] sever side data
[ ] animation
[ ] slots
[ ] html control(loop/if)
[ ] component `self` and `use`