window.MobileSelect = (function() {
    function getID(string){
    	return document.getElementById(string);
    }
	function getClass(dom,string) {
		return dom.getElementsByClassName(string);
	}
	function getTag(dom,string) {
		return dom.getElementsByTagName(string);
	}

	//构造器
	function MobileSelect(config) {
		this.mobileSelect;
		this.wheelsData = config.wheels;
	    this.jsonType =  false;
	    this.jsonData = [];
	    this.checkDataType();
		this.renderWheels(this.wheelsData);
		this.trigger = document.querySelector(config.trigger);
	    this.wheel = getClass(this.mobileSelect,'wheel');   //wheel 数组
	    this.slider = getClass(this.mobileSelect,'selectContainer'); // slider 数组
	    this.wheels = this.mobileSelect.querySelector('.wheels');   //wheels
	    this.liHeight = this.mobileSelect.querySelector('li').offsetHeight;
	    this.ensureBtn = this.mobileSelect.querySelector('.ensure');
    	this.closeBtn = this.mobileSelect.querySelector('.cancel');
	    this.grayLayer = this.mobileSelect.querySelector('.grayLayer');
	    this.popUp = this.mobileSelect.querySelector('.content');
	    this.startY;
	    this.moveEndY;
	    this.moveY;
	    this.oldMoveY;
	    this.offset = 0;
	    this.offsetSum = 0;
	    this.oversizeBorder;
	    this.curDistance = [];
	    this.clickStatus = false;

	    this.deepArr = [];
	    this.displayJson = []; 

	    this.callback = config.callback ? config.callback : function(){};
	    this.limit = config.limit ? config.limit : function(){};
	    this.initPosition = config.position ? config.position : [];
	    this.titleText = config.title ? config.title : '';
	    this.cascade = config.cascade ? config.cascade && this.jsonType : false; //是否级联
	    this.init(config);
		this.fixRowStyle(); //修正列数
	}
	
	MobileSelect.prototype = {
		constructor: MobileSelect,
		init: function(config){
			var _this = this; 
			_this.trigger.readOnly=true;
			_this.trigger.style.cursor='pointer';
			_this.setTitle(_this.titleText);

			if (_this.cascade) {
				_this.initCascade();
			}

			//定位 初始位置
			if(_this.initPosition.length == 0){
				for(var i=0; i<_this.slider.length; i++){
					_this.initPosition.push(0);
				}
			}
			_this.initCurDistance(_this.initPosition);
			//初始位置 END

			_this.addListenerAll();


			//按钮监听
		    _this.closeBtn.addEventListener('click',function(){
		    	_this.mobileSelect.classList.remove('mobileSelect-show');
		    });

		    _this.ensureBtn.addEventListener('click',function(){
		    	_this.mobileSelect.classList.remove('mobileSelect-show');
		    	if(_this.cascade){

		    	}else{
			    	var tempValue ='';
			    	for(var i=0; i<_this.wheel.length; i++){
			    		i==_this.wheel.length-1 ? tempValue += _this.getValue(i) : tempValue += _this.getValue(i)+' ';
			    	}
			    	_this.trigger.value = tempValue;
			    	_this.callback(_this.getIndexArr(),_this.getJson());
		    	}
		    });

		    _this.trigger.addEventListener('click',function(){
		    	_this.mobileSelect.classList.add('mobileSelect-show');
		    });

		    _this.grayLayer.addEventListener('click',function(){
		    	_this.mobileSelect.classList.remove('mobileSelect-show');
		    });

		    _this.popUp.addEventListener('click',function(){ //阻止冒泡
		    	event.stopPropagation(); 
		    });
		},

		setTitle: function(string){
			var _this = this;
			_this.titleText = string;
			_this.mobileSelect.querySelector('.title').innerHTML = _this.titleText;
		},

		renderWheels: function(wheelsData){
			var _this = this;
			_this.mobileSelect = document.createElement("div");
			_this.mobileSelect.className = "mobileSelect";
			_this.mobileSelect.innerHTML = 
		    	'<div class="grayLayer"></div>'+
		        '<div class="content">'+
		            '<div class="btnBar">'+
		                '<div class="fixWidth">'+
		                    '<div class="cancel">取消</div>'+
		                    '<div class="title"></div>'+
		                    '<div class="ensure">选择</div>'+
		                '</div>'+
		            '</div>'+
		            '<div class="panel">'+
		                '<div class="fixWidth">'+
		                	'<div class="wheels">'+
			                '</div>'+
		                    '<div class="selectLine"></div>'+
		                    '<div class="shadowMask"></div>'+
		                '</div>'+
		            '</div>'+
		        '</div>';
		    document.body.appendChild(_this.mobileSelect);

			//根据数据长度来渲染

			var tempHTML='';
			for(var i=0; i<wheelsData.length; i++){ //列
				tempHTML += '<div class="wheel"><ul class="selectContainer">';
				if(_this.jsonType){
					for(var j=0; j<wheelsData[i].data.length; j++){ //行
						tempHTML += '<li data-id="'+wheelsData[i].data[j].id+'">'+wheelsData[i].data[j].value+'</li>';
					}
				}else{
					for(var j=0; j<wheelsData[i].data.length; j++){ //行
						tempHTML += '<li>'+wheelsData[i].data[j]+'</li>';
					}
				}
				tempHTML += '</ul></div>';
			}
			_this.mobileSelect.querySelector('.wheels').innerHTML = tempHTML;
		},

		addListenerAll: function(){
			var _this = this;
			for(var i=0; i<_this.slider.length; i++){
				//手势监听
				(function (i) {
					_this.wheel[i].addEventListener('touchstart', function () {
						_this.touch(event,_this,this.firstChild,i);
					},false);
					_this.wheel[i].addEventListener('touchend', function () {
						_this.touch(event,_this,this.firstChild,i);
					},false);
					_this.wheel[i].addEventListener('touchmove', function () {
						_this.touch(event,_this,this.firstChild,i);
					},false);

					//PC拖拽监听
					_this.wheel[i].addEventListener('mousedown', function () {
						_this.dragClick(event,_this,this.firstChild,i);
					},false);
					_this.wheel[i].addEventListener('mousemove', function () {
						_this.dragClick(event,_this,this.firstChild,i);
					},false);
					_this.wheel[i].addEventListener('mouseup', function () {
						_this.dragClick(event,_this,this.firstChild,i);
					},true); 

					var curWheelLi = _this.slider[i].getElementsByTagName('li');
					for(var j=0; j<curWheelLi.length;j++){
						(function (j,i) {
							curWheelLi[j].addEventListener('click',function(){
								_this.singleClick(event,_this,this,j,i);
							},false);
						})(j,i);
					}

				})(i);
			}
		},

		updateListenerLi:function(sliderIndex){
			//console.log('监听每个单项点击');
			var _this = this;
			//监听每个单项点击
			var curWheelLi = _this.slider[sliderIndex].getElementsByTagName('li');
			for(var j=0; j<curWheelLi.length;j++){
				(function (j) {
					curWheelLi[j].addEventListener('click',function(){
						_this.singleClick(event,_this,this,j,sliderIndex);
					},false);
				})(j);
			}
		},

		checkDataType: function(){ 
			var _this = this;
			if(typeof(_this.wheelsData[0].data[0])=='object'){
				_this.jsonType = true;
				_this.jsonData = _this.wheelsData[0].data;
			}
		},

		initCascade: function(){
			var _this = this;
			_this.displayJson.push(_this.generateArrData(_this.jsonData));
			_this.checkArrDeep(_this.jsonData[0]);
			console.log('将要显示的json:'); 
			console.log(_this.displayJson);

			_this.updateWheels();
		},

		generateArrData: function (targetArr) {
			var tempArr = [];
			for(var i=0; i<targetArr.length; i++){
				tempArr.push({
					"id": targetArr[i].id,
					"value": targetArr[i].value
				});	
			}
			return tempArr;
		},

		checkArrDeep: function (parent) { //检测子节点深度  修改 displayJson
			var _this = this;
			if ('childs' in parent && parent.childs.length > 0) {
				_this.displayJson.push(_this.generateArrData(parent.childs)) ; //生成子节点数组
				_this.checkArrDeep(parent.childs[0]);//检测下一个子节点
			}
		},

		checkRange: function(index, posIndexArr){ //改变的第几个、 位置索引数组
			var _this = this;
			var deleteNum = _this.displayJson.length-1-index;
			for(var i=0; i<deleteNum; i++){
				_this.displayJson.pop(); //修改 displayJson
			}

			switch (index){
				case 0:
					//console.log('改变第1个');
					_this.checkArrDeep(_this.jsonData[posIndexArr[0]]);
				break;

				case 1:
					//console.log('改变第2个');
					_this.checkArrDeep(_this.jsonData[posIndexArr[0]].childs[posIndexArr[1]]);
				break;

				case 2:
					//console.log('改变第3个');
					_this.checkArrDeep(_this.jsonData[posIndexArr[0]].childs[posIndexArr[1]].childs[posIndexArr[2]]);
				break;

				case 3:
					_this.checkArrDeep(_this.jsonData[posIndexArr[0]].childs[posIndexArr[1]].childs[posIndexArr[2]].childs[posIndexArr[3]]);
				break;
			}

			console.log(_this.displayJson);
			_this.updateWheels();
			_this.fixRowStyle();

			//复原位置*********************
			var tempPosArr = posIndexArr;
			if(_this.slider.length > posIndexArr.length){
				for(var i=0; i<_this.slider.length - posIndexArr.length; i++){
					tempPosArr.push(0);
				}	
			}else if(_this.slider.length < posIndexArr.length){
				for(var i=0; i<posIndexArr.length - _this.slider.length; i++){
					tempPosArr.pop();
				}	
			}
			_this.initCurDistance(tempPosArr);

		},

		updateWheels: function(){
			var _this = this;

			//删除多余的wheel
			if(_this.wheel.length > _this.displayJson.length){
				var count = _this.wheel.length - _this.displayJson.length;
				for(var i=0; i<count; i++){
					_this.wheels.removeChild(_this.wheel[_this.wheel.length-1]);
				}
			}

			for(var i=0; i<_this.displayJson.length; i++){ //列
				(function (i) {
					_this.updateWheel2(i,_this.displayJson[i]);
				})(i);
			}
		},

		updateWheel2: function(sliderIndex, data){ 
			var _this = this;
			var tempHTML='';

			if(_this.wheel[sliderIndex]){
				//console.log('插入Li');
				for(var j=0; j<data.length; j++){ //行
					tempHTML += '<li data-id="'+data[j].id+'">'+data[j].value+'</li>';
				}
				_this.slider[sliderIndex].innerHTML = tempHTML;

			}else{
				var tempWheel = document.createElement("div");
				tempWheel.className = "wheel";

				tempHTML = '<ul class="selectContainer">';
				for(var j=0; j<data.length; j++){ //行
					tempHTML += '<li data-id="'+data[j].id+'">'+data[j].value+'</li>';
				}
				tempHTML += '</ul>';
				tempWheel.innerHTML = tempHTML;

				//给wheel添加监听
				tempWheel.addEventListener('touchstart', function () {
					_this.touch(event,_this,this.firstChild,sliderIndex);
				},false);
				tempWheel.addEventListener('touchend', function () {
					_this.touch(event,_this,this.firstChild,sliderIndex);
				},false);
				tempWheel.addEventListener('touchmove', function () {
					_this.touch(event,_this,this.firstChild,sliderIndex);
				},false);

				tempWheel.addEventListener('mousedown', function () {
					_this.dragClick(event,_this,this.firstChild,sliderIndex);
				},false);
				tempWheel.addEventListener('mousemove', function () {
					_this.dragClick(event,_this,this.firstChild,sliderIndex);
				},false);
				tempWheel.addEventListener('mouseup', function () {
					_this.dragClick(event,_this,this.firstChild,sliderIndex);
				},false);

		    	_this.wheels.appendChild(tempWheel); 
			}
			_this.updateListenerLi(sliderIndex);
		},

		updateWheel: function(sliderIndex, data){
			var _this = this;
			var tempHTML='';
			for(var j=0; j<data.length; j++){
				tempHTML += '<li>'+data[j]+'</li>'
			}
			_this.slider[sliderIndex].innerHTML = tempHTML;
			_this.updateListenerLi(sliderIndex);
		},

		fixRowStyle: function(){
			var _this = this;
			var width = (100/_this.wheel.length).toFixed(2);
			for(var i=0; i<_this.wheel.length; i++){
				_this.wheel[i].style.width = width+'%';
			}
		},

	    getIndex: function(distance){
	        return Math.round((80-distance)/this.liHeight);
	    },

	    getIndexArr: function(){
	    	var _this = this;
	    	var temp = [];
	    	for(var i=0; i<_this.curDistance.length; i++){
	    		temp.push(_this.getIndex(_this.curDistance[i]));
	    	}
	    	return temp;
	    },

	    getJson: function(){
	    	var _this = this;
	    	var temp = [];
	    	if(typeof(_this.wheelsData[0].data[0])=='object'){
		    	for(var i=0; i<_this.curDistance.length; i++){
		    		temp.push(_this.wheelsData[i].data[_this.getIndex(_this.curDistance[i])]);
		    	}
	    	}
	    	return temp;
	    },

	    calcDistance: function(index){
			return 80-index*this.liHeight;
	    },

	    initCurDistance: function(indexArr){
	    	var _this = this;
	    	var temp = [];
	    	for(var i=0; i<_this.slider.length; i++){
	    		temp.push(_this.calcDistance(indexArr[i]));
	    		_this.movePosition(_this.slider[i],temp[i]);
	    	}
	    	_this.curDistance = temp;
	    },


	    fixPosition: function(distance){
	        return -(this.getIndex(distance)-2)*this.liHeight;
	    },

	    movePosition: function(theSlider, distance){
	        theSlider.style.webkitTransform = 'translate3d(0,' + distance + 'px, 0)';
	        theSlider.style.transform = 'translate3d(0,' + distance + 'px, 0)';
	    },

	    locatePostion: function(index, posIndex){
	    	this.curDistance[index] = this.calcDistance(posIndex);
	    	this.movePosition(this.slider[index],this.curDistance[index]);
	    },

	    updateCurDistance: function(theSlider, index){
	        this.curDistance[index] = parseInt(theSlider.style.transform.split(',')[1]);
	    },

	    getDistance:function(theSlider){
	    	return parseInt(theSlider.style.transform.split(',')[1]);
	    },

	    getValue: function(sliderIndex){
	    	var _this = this;
	    	var index = _this.getIndex(_this.curDistance[sliderIndex]);
	    	return _this.slider[sliderIndex].getElementsByTagName('li')[index].innerHTML;
	    },

	    touch: function(event, _this, theSlider, index){
	    	event = event || window.event;
	    	switch(event.type){
	    		case "touchstart":
			        _this.startY = event.touches[0].clientY;
			        _this.oldMoveY = _this.startY;
	    			break;

	    		case "touchend":

			        _this.moveEndY = event.changedTouches[0].clientY;
			        _this.offsetSum = _this.moveEndY - _this.startY;

					//修正位置
			        _this.updateCurDistance(theSlider, index);
			        _this.curDistance[index] = _this.fixPosition(_this.curDistance[index]);
			        _this.movePosition(theSlider, _this.curDistance[index]);
			        _this.oversizeBorder = -(theSlider.getElementsByTagName('li').length-3)*_this.liHeight; 


			        //反弹
			        if(_this.curDistance[index] + _this.offsetSum > 2*_this.liHeight){
			            _this.curDistance[index] = 2*_this.liHeight;
			            setTimeout(function(){
			                _this.movePosition(theSlider, _this.curDistance[index]);
			            }, 100);

			        }else if(_this.curDistance[index] + _this.offsetSum < _this.oversizeBorder){
			            _this.curDistance[index] = _this.oversizeBorder;
			            setTimeout(function(){
			                _this.movePosition(theSlider, _this.curDistance[index]);
			            }, 100);
			        }


			        _this.limit(_this.getIndexArr());

			        if(_this.cascade){
				        var tempPosArr = _this.getIndexArr();
				        tempPosArr[index] = _this.getIndex(_this.curDistance[index]);
			        	_this.checkRange(index, tempPosArr);
			        }

	    			break;

	    		case "touchmove":
			        event.preventDefault();
			        _this.moveY = event.touches[0].clientY;
			        _this.offset = _this.moveY - _this.oldMoveY;

			        _this.updateCurDistance(theSlider, index);
			        _this.curDistance[index] = _this.curDistance[index] + _this.offset;
			        _this.movePosition(theSlider, _this.curDistance[index]);
			        _this.oldMoveY = _this.moveY;
	    			break;
	    	}
	    },

	    dragClick: function(event, _this, theSlider, index){
	    	event = event || window.event;
	    	switch(event.type){
	    		case "mousedown":
			        _this.startY = event.clientY;
			        _this.oldMoveY = _this.startY;
			        _this.clickStatus = true;
	    			break;

	    		case "mouseup":

			        _this.moveEndY = event.clientY;
			        _this.offsetSum = _this.moveEndY - _this.startY;

					//修正位置
			        _this.updateCurDistance(theSlider, index);
			        _this.curDistance[index] = _this.fixPosition(_this.curDistance[index]);
			        _this.movePosition(theSlider, _this.curDistance[index]);
			        _this.oversizeBorder = -(theSlider.getElementsByTagName('li').length-3)*_this.liHeight; 


			        //反弹
			        if(_this.curDistance[index] + _this.offsetSum > 2*_this.liHeight){
			            _this.curDistance[index] = 2*_this.liHeight;
			            setTimeout(function(){
			                _this.movePosition(theSlider, _this.curDistance[index]);
			            }, 100);

			        }else if(_this.curDistance[index] + _this.offsetSum < _this.oversizeBorder){
			            _this.curDistance[index] = _this.oversizeBorder;
			            setTimeout(function(){
			                _this.movePosition(theSlider, _this.curDistance[index]);
			            }, 100);
			        }

			        _this.clickStatus = false;
			        _this.limit(_this.getIndexArr());
			        if(_this.cascade){
				        var tempPosArr = _this.getIndexArr();
				        tempPosArr[index] = _this.getIndex(_this.curDistance[index]);
			        	_this.checkRange(index, tempPosArr);
			        }
	    			break;

	    		case "mousemove":
			        event.preventDefault();
			        if(_this.clickStatus){
				        _this.moveY = event.clientY;
				        _this.offset = _this.moveY - _this.oldMoveY;

				        _this.updateCurDistance(theSlider, index);
				        _this.curDistance[index] = _this.curDistance[index] + _this.offset;
				        _this.movePosition(theSlider, _this.curDistance[index]);
				        _this.oldMoveY = _this.moveY;
			        }
	    			break;
	    	}
	    },

	    singleClick: function(event, _this, theLi, index, sliderIndex){
	        _this.curDistance[sliderIndex] = (2-index)*_this.liHeight;
	        _this.movePosition(theLi.parentNode, _this.curDistance[sliderIndex]);
	        if(_this.cascade){
		        var tempPosArr = _this.getIndexArr();
		        tempPosArr[sliderIndex] = _this.getIndex(_this.curDistance[sliderIndex]);
	        	_this.checkRange(sliderIndex, tempPosArr);
	        }
	    }

	};

	return MobileSelect;
})();