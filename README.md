# mobileSelect.js    




[![MIT License](https://img.shields.io/npm/l/express.svg)](https://github.com/onlyhom/mobileSelect.js/blob/master/LICENSE) [![downloads](https://img.shields.io/badge/downloads-1083-green.svg)]()  [![dependencies](https://img.shields.io/badge/dependencies-none-orange.svg)]() 




A multi-function mobile phone scrolling selector, support single to multi-select, support multi-level cascade, provide custom callback function, provide update function redraw, relocation function, compatible pc drag and so on.

[【中文文档】](https://github.com/onlyhom/mobileSelect.js/blob/master/docs/README-CN.md)

## Features


- A mobile phone select component with native js, do not rely on any library
- Can be passed to an ordinary array or json array
- According to the length of the parameters passed, automatically render the corresponding number of columns, support for individual to multiple options
- Automatic identification is cascading
- After successful selection, provide a custom callback function callback ()
- After each gesture sliding, it also provides a callback function transitionEnd ()
- Provide update () function, pass the other parameters to render again
- Provide relocation function



## Demo


![Image text](http://p1.bqimg.com/4851/0e072a9fae72e0a0.gif)

## Installation



```html
<link rel="stylesheet" type="text/css" href="css/mobileSelect.css">
<script src="js/mobileSelect.js" type="text/javascript"></script>
```

## Getting Started



#### ①Ordinary array format - Non-cascade
```html
<div id="day"></div>

<script type="text/javascript">
var mobileSelect1 = new MobileSelect({
    trigger: '#day', 
    title: '单项选择',  
    wheels: [
                {data:['周日','周一','周二','周三','周四','周五','周六']}
            ],
    position:[2] //Initialize positioning
});
</script>
```



#### ②Json format - Non-cascade
```html
<div id="area"></div>

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
        console.log(data); //Returns the selected json data
    } 
});
</script>
```
##### Example：
![Image text](http://p1.bqimg.com/567571/d4e4bac29a9c6e87.gif)


#### ③Json format - Cascade
```html
<div id="area2"></div>

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
          console.log(data); //Returns the selected json data
      } 
  });
  </script>
```
##### Example：
![Image text](https://raw.githubusercontent.com/onlyhom/img-folder/master/gif/%E7%BA%A7%E8%81%94.gif)



## Options


|Option|Default|Type|Description |
| ------ |------|-----|-----|
|trigger|Required parameter No default value|String| The id/class/tag of the trigger object |
|wheels|Required parameter No default value|Array|The data displayed on the wheel|
|title|`''`|String|Component title|
|position|[0,0,0,…]|Array|Initialize positioning|
| callback|function(indexArr, data){}|function | Select the callback function triggered after successful, return parameter (indexArr, data)|
|transitionEnd|function(indexArr, data){}|function|A callback function that after each gesture sliding, return parameter (indexArr, data)|




#### Tips: The meaning of the parameters returned in the callback function is as follows
 - **indexArr** is the currently selected index array, such as[0,0,1] 
 - **data** is the currently selected json array, such as[{id:'1',value:'hello'},{id:'2',value:'world'}]

## Functions：
|Function|Arguments| Description|
| ------ |------| -----|
|setTitle()| string |Set the title of the component|
|updateWheel()| sliderIndex, data | Re-render the specified wheel |
|locatePostion()|sliderIndex, posIndex|Pass the position array parameter, relocate the position of the wheel|

#### Tips: The function parameters need to be passed as follows
 - SliderIndex represents the index of the wheel to be modified
 - PosIndex represents the location index
 
#### Demo of use the function ：  
```html
<div id="day"></div>

var mySelect = new MobileSelect({
    trigger: '#day', 
    wheels: [
                {data:['周日','周一','周二','周三','周四','周五','周六']},
                {data:['08:00','09:00','10:00','11:00','12:00','13:00','14:00']}
            ],
    position:[1,1] //Initialize the positioning of both wheels are selected in the index 1 option
});

//----------------------------------------------
//After the basic instantiated, use the functions

mySelect.setTitle('啦啦啦(๑•̀ㅁ•́ฅ)'); 
// Set the title of the component

mySelect.updateWheel(0,['sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']);
// Update the 0th wheel of the data,the data from the Chinese week to the English week

mySelect.locatePostion(1,0);
// Reposition the position of the first wheel and change the 0th data of the first wheel to the current selection.
// (The first wheel is the right wheel, the left side of the wheel is the first 0)
```   
Base example → Function after operation  

![基础实例](https://github.com/onlyhom/img-folder/blob/master/QQscreenshot/before20170306234037.png?raw=true)
![功能函数操作后](https://github.com/onlyhom/img-folder/blob/master/QQscreenshot/after-20170306233954.png?raw=true)

##  Project demo：
Use the transitionEnd (), callback (), updateWheel (), locatePostion () functions to do the following:

- choose the date of the day, not more than today has been too.
- Select the time to take the car, the car must not exceed the time to take the car (including the date and time).

![Image text](https://github.com/onlyhom/img-folder/blob/master/gif/limit%E5%87%BD%E6%95%B0.gif?raw=true)


## Logs  
### 2017-04-20[update]    
As the input tag in the iphone, the cursor will flashing.    
As well as the input tag open in the iphone6P / iphone7P chrome will appear offset phenomenon.    
So do not use the input tag, instead by the ordinary div trigger.    
The value selected will be written in the div trigger‘s innerHTML.    
It is recommended to use the callback (indexArr, data) function to get the selected value.


## License


[MIT LICENSE](https://github.com/onlyhom/mobileSelect.js/blob/master/LICENSE)

Copyright (c) 2017-present, LIHONG OU(onlyhom)

