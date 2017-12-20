<p align="center"><img width="130" src="https://github.com/onlyhom/img-folder/blob/master/png/m_logo_orange.png?raw=true"></p>
<h1 align="center" >mobileSelect.js</h1>
<p align="center">
  <a href="https://github.com/onlyhom/mobileSelect.js/blob/master/LICENSE" title="LICENSE">
    <img src="https://img.shields.io/npm/l/express.svg" alt="MIT License">
  </a>
  <a href="" title="downloads">
    <img src="https://img.shields.io/badge/downloads-1083-green.svg" alt="downloads">
  </a>
  <a href="" title="dependencies">
    <img src="https://img.shields.io/badge/dependencies-none-orange.svg" alt="dependencies">
  </a>
</p>

A multi-function mobile phone scrolling selector, support single to multi-select, support multi-level cascade, provide custom callback function, provide update function redraw, relocation function, compatible pc drag and so on.

[【查看中文文档】](https://github.com/onlyhom/mobileSelect.js/blob/master/docs/README-CN.md)

## Features


- A mobile phone select component with native js, do not rely on any library
- Can be passed to an ordinary array or json array
- According to the length of the parameters passed, automatically render the corresponding number of columns, support for individual to multiple options
- Automatic identification is cascading
- After successful selection, provide a custom callback function callback ()
- After each gesture sliding, it also provides a callback function transitionEnd ()
- Provide update () function, pass the other parameters to render again
- Provide relocation function



## Preview

#### Use mobile phone scan code to preview: 
<img src="https://github.com/onlyhom/img-folder/blob/master/png/ms_code_url_480.png?raw=true" width="230">

#### Gif preview:   
![Image text](https://github.com/onlyhom/img-folder/blob/master/gif/ms_preview_all.gif?raw=true)


## Installation

#### Method1 tag import：
```html
<link rel="stylesheet" type="text/css" href="css/mobileSelect.css">
<script src="js/mobileSelect.js" type="text/javascript"></script>
```

#### Method2 npm install：

```
npm install mobile-select -D
```

Import in your js file：
```javascript
import MobileSelect from 'mobile-select'
```


## Getting Started



#### ①Ordinary array format - Non-cascade
```html
<div id="day"></div><!--Don't forget this trigger in your page-->

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
  var mobileSelect3 = new MobileSelect({
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


#### ④ajax asynchronous fill data

```html

<!-- ************ Non-cascade Format ************ -->

<div id="trigger4"></div>

<script type="text/javascript">
    var mobileSelect4 = new MobileSelect({
        trigger: '#trigger4',
        title: 'ajax fill data - non-cascade',
        wheels: [
                    {data:[
                        {id:'1',value:'choose area'},
                    ]},
                    {data:[
                        {id:'1',value:'choose distance'},
                    ]}
                ],        
        callback:function(indexArr, data){
            console.log(data);
        }
    });

    $.ajax({
        type: "POST",
        url: "xxxx",
        data: {},
        dataType: "json",
        success: function(res){
            //Assume that the obtained res.data.area is：
            // [
            //     {id:'1',value:'area1'},
            //     {id:'2',value:'area2'},
            //     {id:'3',value:'area3'},
            //     {id:'4',value:'area4'}
            // ]

            //Assume that the obtained res.data.distance is：
            // [
            //     {id:'1',value:'200 metres'},
            //     {id:'2',value:'300 metres'},
            //     {id:'3',value:'400 metres'}
            // ]
 
            mobileSelect4.updateWheel(0, res.data.area); //Update the 0th wheel
            mobileSelect4.updateWheel(1, res.data.distance); //Update the 1th wheel
        }
    });
</script>
</script>




<!-- ************ Cascade Format ************ -->

<div id="trigger4"></div>

<script type="text/javascript">
    var mobileSelect4 = new MobileSelect({
        trigger: '#trigger4',
        title: 'ajax fill data - cascade',
        wheels: [
                    {data:[
                        {
                            id:'1',
                            value:'',
                            childs:[
                                {id:'A1',value:''},
                            ]
                        }
                    ]}
                ],        
        callback:function(indexArr, data){
            console.log(data);
        }
    });

    $.ajax({
        type: "POST",
        url: "xxxx",
        data: {},
        dataType: "json",
        success: function(res){
            //Assume that the obtained res.data is：
            // [{
            //     id:'1',
            //     value:'after update',
            //     childs:[
            //         {id:'A1',value:'apple'},
            //         {id:'A2',value:'banana'},
            //         {id:'A3',value:'orange'}
            //     ]
            // }]
            mobileSelect4.updateWheels(res.data);
        }
    });
</script>
```

#### ⑤How to use in vue-cli   

```
npm install mobile-select -D
```

```html
<template>
    <div>
        <div id="trigger5">vue-cli-demo</div>
    </div>
</template>

<script>
    import MobileSelect from 'mobile-select'

    export default {
        mounted() {
            var mobileSelect5 = new MobileSelect({
                trigger: "#trigger5",
                title: "vue-cli-demo",
                wheels: [
                    {data: ["周日","周一","周二","周三","周四","周五","周六"]}
                ],
                callback:function(indexArr, data){
                    console.log(data);
                }
            });
        }
    }
</script>
```


#### ⑥Json format - Data field mapping    
```html
<div id="trigger6"></div>

<script type="text/javascript">
    // If your data field is named id, title, children
    // does not match the id, value, childs field name of mobileSelect
    // You can use the keyMap property for field name mapping
    var mobileSelect6 = new MobileSelect({
        trigger: '#trigger6',
        title: 'keyMap',
        wheels: [
                    {data:[
                        {
                            id:'1',
                            title:'A',
                            children:[
                                {id:'A1',title:'A-a'},
                                {id:'A2',title:'A-b'},
                                {id:'A3',title:'A-c'}
                            ]
                        },
                        {
                            id:'1',
                            title:'B',
                            children:[
                                {id:'B1',title:'B-a'},
                                {id:'B2',title:'B-b'},
                                {id:'B3',title:'B-c'}
                            ]
                        },
                    ]}
                ],
        keyMap: {
            id:'id',
            value: 'title',
            childs :'children'
        },         
        callback:function(indexArr, data){
            console.log(data);
        }
    });
</script>
```





## Options


|Option|Default|Type|Description |
| ------ |------|-----|-----|
|trigger|Required parameter. No default value|String| The id/class/tag of the trigger object |
|wheels|Required parameter. No default value|Array|The data displayed on the wheel|
|callback|function(indexArr, data){}|function | A callback function after successful selected, return parameter (indexArr, data) |
|transitionEnd|function(indexArr, data){}|function|A callback function that after each gesture sliding, return parameter (indexArr, data)|
|onShow|function(e){}|function | A callback when the window is show, return object itself as parameter |
|onHide|function(e){}|function | A callback when the window is hidden, return object itself as parameter|
|title|`''`|String|Component title|
|position|[0,0,0,…]|Array|Initialize positioning|
|connector|`' '`|String| When there are multiple wheels, set the connection to connect multiple values, the default value is a space |
|ensureBtnText|`'确认'`|String| The text content of comfirm button |
|cancelBtnText|`'取消'`|String| The text content of cancel button |
|ensureBtnColor|`'#1e83d3'`|String| The text color of the comfirm button|
|cancelBtnColor|`'#666666'`|String| The text color of the cancel button|
|titleColor|`'#000000'`|String| The text color of the component title |
|titleBgColor|`'#ffffff'`|String| The background color of the component title |
|textColor|`'#000000'`|String| The text color of the wheels |
|bgColor|`'#ffffff'`|String| The Wheels background color |
|keyMap|`{id:'id', value:'value', childs:'childs'`}|Object| Field name mapping, applies to field names that do not match id, value, childs |
|triggerDisplayData|`true`|Boolean| When the click is confirmed, the trigger's innerHtml becomes the selected data.<br>( If there are other elements in the trigger, you can set it to false. If you need to display data elsewhere, you can use the data returned by callback to stitch yourself )|


#### Tips: The meaning of the parameters returned in the callback function is as follows
 - **indexArr** is the currently selected index array, such as[0,0,1] 
 - **data** is the currently selected json array, such as[{id:'1',value:'hello'},{id:'2',value:'world'}]

## Functions：
|Function|Arguments| Description|
| ------ |------| -----|
|show()| no-argument | show the compontent  |
|hide()| no-argument | hide the compontent  |
|setTitle()| string |Set the title of the component|
|locatePosition()|sliderIndex, posIndex|Pass the position array parameter, relocate the position of the wheel|
|updateWheel()| sliderIndex, data | Re-render the specified wheel |
|updateWheels()| data | Re-render the all wheel(Only used in cascading data forma) |
|getValue()| no-argument | Gets the value selected by the component |


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

mySelect.locatePosition(1,0);
// Reposition the position of the first wheel and change the 0th data of the first wheel to the current selection.
// (The first wheel is the right wheel, the left side of the wheel is the first 0)
```   
Base example → Function after operation  

![基础实例](https://github.com/onlyhom/img-folder/blob/master/QQscreenshot/before20170306234037.png?raw=true)
![功能函数操作后](https://github.com/onlyhom/img-folder/blob/master/QQscreenshot/after-20170306233954.png?raw=true)

##  Project demo：
Use the transitionEnd (), callback (), updateWheel (), locatePosition () functions to do the following:

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

### 2017-07-27[bug fixed]
Repair the issues raised by [li362692680]:       
Cascade selection can not initially locate the secondary selection box.    
At the same time repair the init function of the entry array parameter length is less than the number of wheels can not move the problem.        


### 2017-07-30[bug fixed + update]       
Repair the issues raised by [leohgbs]:       
1. The update does not take into account the problem that the data is json.       
2. After the update, the cached data is not updated, resulting in a callback data source error.       

Change the variable name: jsonData → cascadeJsonData       
Change method name: updateWheels() → reRenderWheels()       
The updateWheel() method does not change.       
Add new API: updateWheels(data) is used to update the entire data source in cascading data format.       


### 2017-08-15[update]    
Repair in cascade state, single click failed.      
Delete the comment after the brace in the js file(In the php environment there will be js code failure situation).    
Fix ios potential bug.  
Add API: show()    
Add API: getValue()    
Add option style options(Modify the connector / button text / button color / background color and so on)：    
connector    
ensureBtnText    
ensureBtnColor    
cancelBtnText     
cancelBtnColor    
titleColor    
titleBgColor    
bgColor    
textColor    
Supports color formats such as #ff0000 rgba(0,255,255,0.5) orange.    


### 2017-09-07[update]    
Add keyMap function      
Update README     

### 2017-10-17[update]    
Add cancel callback 

### 2017-12-12[update]    
Remove cancel callback   
Thanks for [ngdly]:   
Add onshow callback   
Add onhide callback   
Add show function   
Add hide function   

## License


[MIT LICENSE](https://github.com/onlyhom/mobileSelect.js/blob/master/LICENSE)

Copyright (c) 2017-present, LIHONG OU(onlyhom)

