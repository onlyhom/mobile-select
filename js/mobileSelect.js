window.MobileSelect = (function() {

//兼容性做好
//优化好getValue


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
		this.renderWheel(config.wheels);
		this.trigger = document.querySelector(config.trigger);
	    this.wheel = getClass(this.mobileSelect,'wheel');   //wheel 数组
	    this.slider = getClass(this.mobileSelect,'selectContainer'); // slider 数组
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

	    config.callback ? this.callback = config.callback : this.callback = function(){};
	    config.limit ? this.limit = config.limit : this.limit = function(){};
	    config.position ? this.initPosition = config.position : this.initPosition = [];
	    config.title ? this.titleText = config.title : this.titleText = '';

	    this.init(config);
		this.fixRowStyle();

	}
	
	MobileSelect.prototype = {
		constructor: MobileSelect,

		init: function(config){
			var _this = this; 
			_this.trigger.readOnly=true;
			_this.trigger.style.cursor='pointer';
			_this.mobileSelect.querySelector('.title').innerHTML = this.titleText;

			//定位 初始位置
			if(_this.initPosition.length == 0){
				for(var i=0; i<_this.slider.length; i++){
					_this.initPosition.push(0);
					_this.initCurDistance(_this.initPosition); 
				}
			}else{
				_this.initCurDistance(_this.initPosition);
			}


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
					},false); 

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

			//_this.addListenerAll();

			//按钮监听
		    _this.closeBtn.addEventListener('click',function(){
		    	_this.mobileSelect.classList.remove('mobileSelect-show');
		    });

		    _this.ensureBtn.addEventListener('click',function(){
		    	_this.mobileSelect.classList.remove('mobileSelect-show');
		    	var tempValue ='';
		    	for(var i=0; i<_this.wheel.length; i++){
		    		i==_this.wheel.length-1 ? tempValue += _this.getValue(i) : tempValue += _this.getValue(i)+' ';
		    	}
		    	_this.trigger.value = tempValue;
		    	_this.callback(_this.getIndexArr());
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

		updateListenerLi:function(sliderIndex){
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

		renderWheel: function(wheels){
			var _this = this;
			_this.mobileSelect = document.createElement("div");
			_this.mobileSelect.className = "mobileSelect";
			_this.mobileSelect.innerHTML = 
		    '<div class="grayLayer">'+
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
		        '</div>'+
		    '</div>';
		    document.body.appendChild(_this.mobileSelect);

			//根据数据长度来渲染
			var tempHtml='';
			for(var i=0; i<wheels.length; i++){
				tempHtml += '<div class="wheel"><ul class="selectContainer">';
				for(var j=0; j<wheels[i].data.length; j++){
					//wheels[i].data[j];
					tempHtml += '<li>'+wheels[i].data[j]+'</li>'
				}
				tempHtml += '</ul></div>'
				_this.mobileSelect.querySelector('.wheels').innerHTML = tempHtml;
			}
		},

		updateWheel: function(sliderIndex,data){
			var _this = this;
			var tempHtml='';
			for(var j=0; j<data.length; j++){
				tempHtml += '<li>'+data[j]+'</li>'
			}
			_this.slider[sliderIndex].innerHTML = tempHtml;
			_this.updateListenerLi(sliderIndex);
		},

		fixRowStyle: function(length){
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

			        _this.limit(_this.getIndexArr());
			        _this.clickStatus = false;
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
	    }

	};

	return MobileSelect;
})();