# mobileSelect.js    

一款多功能的移动端滚动选择器，支持单选到多选、支持多级级联、提供自定义回调函数、提供update函数二次渲染、重定位函数、兼容pc端拖拽等等..



##Features


- 原生js移动端选择控件，不依赖任何库  
- 可传入普通数组或者json数组
- 可根据传入的参数长度，自动渲染出对应的列数，支持单项到多项选择
- 自动识别是否级联
- 选择成功后，提供自定义回调函数callback()  返回当前选择索引位置、以及选择的数据（数组/json）
- 每次手势滑动结束后，也提供一个回调函数limit()  返回当前选择索引位置、以及选择的数据（数组/json）
- 能够在已经实例化控件后，提供update函数，传其他参数再次渲染   
- 提供重定位函数   



##Demo


![Image text](http://p1.bqimg.com/4851/0e072a9fae72e0a0.gif)

##Installation



```html
<link rel="stylesheet" type="text/css" href="css/mobileSelect.css">
<script src="js/mobileSelect.js" type="text/javascript"></script>
```

##Getting Started



####普通数组格式-非联动
```html
<input type="text" id="day">

<script type="text/javascript">
var mobileSelect1 = new MobileSelect({
    trigger: '#day', 
    title: '单项选择',  
    wheels: [
                {data:['周日','周一','周二','周三','周四','周五','周六']}
            ],
    position:[2] //初始化定位
});
</script>
```





####json格式-非联动
```html
<input type="text" id="area">

<script type="text/javascript">
var mobileSelect2 = new MobileSelect({
    trigger: '#area',
    title: '地区选择',
    wheels: [
                {data:[
                    {id:'1',value:'附近'},
                    {id:'2',value:'上城区'},
                    {id:'3',value:'下城区'},
                    {id:'4',value:'江干区'},
                    {id:'5',value:'拱墅区'},
                    {id:'6',value:'西湖区'}
                ]},
                {data:[
                    {id:'1',value:'1000米'},
                    {id:'2',value:'2000米'},
                    {id:'3',value:'3000米'},
                    {id:'4',value:'5000米'},
                    {id:'5',value:'10000米'}
                ]}
            ],
    callback:function(indexArr, data){
        console.log(data); //返回选中的json数据
    } 
});
</script>
```



####json格式-联动
```html
<input type="text" id="area2">

<script type="text/javascript">
  var addressLocation = new MobileSelect({
      trigger: '#area2',
      title: '地区选择-联动',
      wheels: [
                  {data:[
                      {
                          id:'1',
                          value:'附近',
                          childs:[
                              {id:'1',value:'1000米'},
                              {id:'2',value:'2000米'},
                              {id:'3',value:'3000米'},
                              {id:'4',value:'5000米'},
                              {id:'5',value:'10000米'}
                          ]
                      },
                      {id:'2',value:'上城区'},
                      {id:'3',value:'下城区'},
                      {id:'4',value:'江干区'},
                      {id:'5',value:'拱墅区'},
                      {id:'6',value:'西湖区'}
                  ]}
              ],
      position:[0,1],
      callback:function(indexArr, data){
          console.log(data); //返回选中的json数据
      } 
  });
  </script>
```


##API

###功能函数：
|Function|Arguments| Description|
| ------ |------| -----|
|setTitle()| string |设置控件的标题|
|updateWheel()| sliderIndex, data | 重新渲染指定的轮子 |
|locatePostion()|sliderIndex, posIndex|传入位置数组，重定位轮子的位置|

###回调函数：
|Function|Arguments| Description|
| ------ |------| -----|
| callback() | indexArr, data | 点击-选择 后执行的回调函数，返回当前选择的索引位置、以及选择的数据（数组/json）|
|limit()|indexArr, data |每一次手势滑动结束后执行的回调函数,返回当前选择的索引位置、以及选择的数据（数组/json）|




##项目demo：
使用limit()、callback()、updateWheel()、locatePostion()函数实现如下功能：

- 选择当天日期时，不得超过今天已过时辰。
- 选择取车时间后，还车时间不得超过取车时间（包括日期和时间）。

![Image text](http://p1.bqimg.com/4851/a3a6b83fe0f43169.gif)