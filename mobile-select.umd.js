/*
* mobile-select v1.2.0-beta.5
* Homepage: https://github.com/onlyhom/mobile-select
* Released under the MIT License.
* (c) 2017-present
*/
(function(c,o){typeof exports=="object"&&typeof module<"u"?module.exports=o(require("./style/mobile-select.css")):typeof define=="function"&&define.amd?define(["./style/mobile-select.css"],o):(c=typeof globalThis<"u"?globalThis:c||self,c.MobileSelect=o())})(this,function(){"use strict";var C=Object.defineProperty;var D=(c,o,g)=>o in c?C(c,o,{enumerable:!0,configurable:!0,writable:!0,value:g}):c[o]=g;var n=(c,o,g)=>(D(c,typeof o!="symbol"?o+"":o,g),g);const o=class{constructor(t){n(this,"mobileSelect");n(this,"trigger");n(this,"wheel");n(this,"slider");n(this,"wheels");n(this,"panel");n(this,"ensureBtn");n(this,"cancelBtn");n(this,"grayLayer");n(this,"popUp");n(this,"initPosition");n(this,"initColWidth");n(this,"connector");n(this,"wheelsData");n(this,"displayJson");n(this,"curValue");n(this,"curIndexArr");n(this,"isCascade");n(this,"isJsonType");n(this,"startY");n(this,"moveEndY");n(this,"moveY");n(this,"preMoveY");n(this,"offsetY");n(this,"offsetSum");n(this,"oversizeBorder");n(this,"enableClickStatus");n(this,"isPC");n(this,"optionHeight");n(this,"curDistance");n(this,"cascadeJsonData");n(this,"keyMap");n(this,"eventHandleMap");n(this,"initDeepCount");n(this,"config");!o.checkRequiredConfig(t)||(this.config=Object.assign({},o.defaultConfig,t),this.wheelsData=t.wheels,this.isJsonType=!1,this.cascadeJsonData=[],this.displayJson=[],this.curValue=[],this.curIndexArr=[],this.isCascade=!1,this.startY,this.moveEndY,this.moveY,this.preMoveY,this.offsetY=0,this.offsetSum=0,this.oversizeBorder,this.curDistance=[],this.enableClickStatus=!1,this.isPC=!0,this.optionHeight=0,this.initPosition=t.position||[],this.initColWidth=t.colWidth||[],this.init())}init(){const{config:t}=this;if(this.isJsonType=o.checkDataType(this.wheelsData),this.renderComponent(this.wheelsData),!!this.checkTriggerAvailable()){if(this.wheel=this.mobileSelect.getElementsByClassName("ms-wheel"),this.slider=this.mobileSelect.getElementsByClassName("ms-select-container"),this.panel=this.mobileSelect.querySelector(".ms-panel"),this.wheels=this.mobileSelect.querySelector(".ms-wheels"),this.ensureBtn=this.mobileSelect.querySelector(".ms-ensure"),this.cancelBtn=this.mobileSelect.querySelector(".ms-cancel"),this.grayLayer=this.mobileSelect.querySelector(".ms-gray-layer"),this.popUp=this.mobileSelect.querySelector(".ms-content"),this.optionHeight=this.mobileSelect.querySelector("li").offsetHeight,t.initValue&&t.triggerDisplayValue&&(this.trigger.innerText=t.initValue),this.setStyle(t),this.isPC=o.checkIsPC(),this.isCascade=this.checkCascade(),this.isCascade&&this.initCascade(),t.initValue&&(this.initPosition=this.getPositionByValue()),this.initPosition.length<this.slider.length){const e=this.slider.length-this.initPosition.length;for(let i=0;i<e;i++)this.initPosition.push(0)}this.isCascade?this.initPosition.forEach((e,i)=>{this.checkRange(i,this.initPosition)}):this.setCurDistance(this.initPosition),this.eventHandleMap={cancelBtn:{event:"click",fn:()=>{var e,i,s,h;this.hide(),(i=(e=this.config).cancel)==null||i.call(e,this.curIndexArr,this.curValue,this),(h=(s=this.config).onCancel)==null||h.call(s,this.curValue,this.curIndexArr,this)}},ensureBtn:{event:"click",fn:()=>{var i,s,h,r;this.hide(),this.optionHeight||(this.optionHeight=this.mobileSelect.querySelector("li").offsetHeight);let e="";for(let l=0;l<this.wheel.length;l++)l==this.wheel.length-1?e+=this.getInnerText(l):e+=this.getInnerText(l)+this.config.connector;t.triggerDisplayValue&&(this.trigger.innerText=e),this.curIndexArr=this.getIndexArr(),this.curValue=this.getCurValue(),(s=(i=this.config).callback)==null||s.call(i,this.curIndexArr,this.curValue,this),(r=(h=this.config).onChange)==null||r.call(h,this.curValue,this.curIndexArr,this)}},trigger:{event:"click",fn:()=>{this.show()}},grayLayer:{event:"click",fn:()=>this.hide()},popUp:{event:"click",fn:e=>e.stopPropagation()},panel:{event:["touchstart","touchend","touchmove"],fn:e=>this.touch(e)}},this.isPC&&(this.eventHandleMap.panel.event=["mousedown","mousemove","mouseup"]),this.registerEvents("add"),this.fixRowStyle(),t.autoFocus&&this.show()}}static checkIsPC(){return!navigator.userAgent.toLowerCase().match(/ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/)}static checkDataType(t){var e,i;return typeof((i=(e=t[0])==null?void 0:e.data)==null?void 0:i[0])=="object"}static checkRequiredConfig(t){const e=o.REQUIRED_PARAMS;if(!t){const i=e.map(s=>`'${s}'`);return o.log("error",`missing required param ${i.join(" and ")}.`),!1}for(let i=0;i<e.length;i++){const s=e[i];if(!t[s])return o.log("error",`missing required param '${s}'.`),!1}return!0}static log(t,e){var i;(i=console[t])==null||i.call(console,`[mobile-select]: ${e}`)}checkTriggerAvailable(){const{config:t}=this;return this.trigger=t.trigger instanceof HTMLElement?t.trigger:document.querySelector(t.trigger),this.trigger?!0:(o.log("error","trigger HTMLElement does not found on your document."),!1)}getPositionByValue(){var h;const{keyMap:t,connector:e,initValue:i}=this.config,s=(i==null?void 0:i.split(e))||[];if(this.isJsonType){let r=(h=this.wheelsData[0])==null?void 0:h.data;return s.reduce((l,f)=>{var u;const a=r==null?void 0:r.findIndex(d=>d[t.value]==f);return l.push(a<0?0:a),r=(u=r[a])==null?void 0:u[t.childs],l},[])}return s.reduce((r,l,f)=>{var u,d;const a=(d=(u=this.wheelsData[f])==null?void 0:u.data)==null?void 0:d.findIndex(m=>m==l);return r.push(a<0?0:a),r},[])}setTitle(t){this.mobileSelect.querySelector(".ms-title").innerHTML=t}setStyle(t){if(t.ensureBtnColor&&(this.ensureBtn.style.color=t.ensureBtnColor),t.cancelBtnColor&&(this.cancelBtn.style.color=t.cancelBtnColor),t.titleColor){const e=this.mobileSelect.querySelector(".ms-title");e.style.color=t.titleColor}if(t.textColor&&(this.panel=this.mobileSelect.querySelector(".ms-panel"),this.panel.style.color=t.textColor),t.titleBgColor){const e=this.mobileSelect.querySelector(".ms-btn-bar");e.style.backgroundColor=t.titleBgColor}if(t.bgColor){this.panel=this.mobileSelect.querySelector(".ms-panel");const e=this.mobileSelect.querySelector(".ms-shadow-mask");this.panel.style.backgroundColor=t.bgColor,e.style.background="linear-gradient(to bottom, "+t.bgColor+", rgba(255, 255, 255, 0), "+t.bgColor+")"}if(typeof t.maskOpacity=="number"){const e=this.mobileSelect.querySelector(".ms-gray-layer");e.style.background="rgba(0, 0, 0, "+t.maskOpacity+")"}}show(){var t,e,i;this.mobileSelect.classList.add("ms-show"),(t=document.querySelector("body"))==null||t.classList.add("ms-show"),typeof this.config.onShow=="function"&&((i=(e=this.config).onShow)==null||i.call(e))}hide(){var t,e,i;this.mobileSelect.classList.remove("ms-show"),(t=document.querySelector("body"))==null||t.classList.remove("ms-show"),typeof this.config.onHide=="function"&&((i=(e=this.config).onHide)==null||i.call(e))}registerEvents(t){for(const[e,i]of Object.entries(this.eventHandleMap))typeof i.event=="string"?this[e][`${t}EventListener`](i.event,i.fn,{passive:!1}):i.event.forEach(s=>{this[e][`${t}EventListener`](s,i.fn,{passive:!1})})}destroy(){var t,e;this.registerEvents("remove"),(e=(t=this.mobileSelect)==null?void 0:t.parentNode)==null||e.removeChild(this.mobileSelect)}getOptionsHtmlStr(t){const{keyMap:e}=this.config;let i="";if(this.isJsonType)for(let s=0;s<t.length;s++){const h=t[s][e.id],r=t[s][e.value];i+=`<li data-id="${h}">${r}</li>`}else for(let s=0;s<t.length;s++)i+="<li>"+t[s]+"</li>";return i}renderComponent(t){this.mobileSelect=document.createElement("div"),this.mobileSelect.className="ms-mobile-select",this.mobileSelect.innerHTML=`<div class="ms-gray-layer"></div>
        <div class="ms-content">
          <div class="ms-btn-bar">
            <div class="ms-fix-width">
              <div class="ms-cancel">${this.config.cancelBtnText}</div>  
              <div class="ms-title">${this.config.title||""}</div>
              <div class="ms-ensure">${this.config.ensureBtnText}</div>
            </div>
          </div>
          <div class="ms-panel">
            <div class="ms-fix-width">
            <div class="ms-wheels"></div>
            <div class="ms-select-line"></div>
            <div class="ms-shadow-mask"></div>
          </div>
        </div>`,document.body.appendChild(this.mobileSelect);let e="";for(let i=0;i<t.length;i++)e+=`<div class="ms-wheel"><ul class="ms-select-container" data-index="${i}">`,e+=this.getOptionsHtmlStr(t[i].data),e+="</ul></div>";this.mobileSelect.querySelector(".ms-wheels").innerHTML=e}reRenderWheels(){const t=this.wheel.length-this.displayJson.length;if(t>0)for(let e=0;e<t;e++)this.wheels.removeChild(this.wheel[this.wheel.length-1]);for(let e=0;e<this.displayJson.length;e++)if(this.wheel[e])this.slider[e].innerHTML=this.getOptionsHtmlStr(this.displayJson[e]);else{const i=document.createElement("div");i.className="ms-wheel",i.innerHTML=`<ul class="ms-select-container" data-index="${e}">${this.getOptionsHtmlStr(this.displayJson[e])}</ul>`,this.wheels.appendChild(i)}}checkCascade(){var e;const{keyMap:t}=this.config;if(this.isJsonType){const i=this.wheelsData[0].data;for(let s=0;s<i.length;s++)if(t.childs in i[s]&&((e=i[s][t.childs])==null?void 0:e.length)>0)return this.cascadeJsonData=this.wheelsData[0].data,!0}return!1}initCascade(){this.displayJson.push(this.cascadeJsonData),this.initPosition.length>0?(this.initDeepCount=0,this.initCheckArrDeep(this.cascadeJsonData[this.initPosition[0]])):this.checkArrDeep(this.cascadeJsonData[0]),this.reRenderWheels()}initCheckArrDeep(t){if(t){const{keyMap:e}=this.config;if(e.childs in t&&t[e.childs].length>0){this.displayJson.push(t[e.childs]),this.initDeepCount++;const i=t[e.childs][this.initPosition[this.initDeepCount]];i?this.initCheckArrDeep(i):this.checkArrDeep(t[e.childs][0])}}}checkArrDeep(t){if(!t)return;const{keyMap:e}=this.config;e.childs in t&&t[e.childs].length>0&&(this.displayJson.push(t[e.childs]),this.checkArrDeep(t[e.childs][0]))}checkRange(t,e){var r;const i=this.displayJson.length-1-t,{keyMap:s}=this.config;for(let l=0;l<i;l++)this.displayJson.pop();let h;for(let l=0;l<=t;l++)h=l==0?this.cascadeJsonData[e[0]]:(r=h==null?void 0:h[s.childs])==null?void 0:r[e[l]];this.checkArrDeep(h),this.reRenderWheels(),this.fixRowStyle(),this.setCurDistance(this.resetPosition(t,e))}resetPosition(t,e){const i=[...e];let s;if(this.slider.length>e.length){s=this.slider.length-e.length;for(let h=0;h<s;h++)i.push(0)}else if(this.slider.length<e.length){s=e.length-this.slider.length;for(let h=0;h<s;h++)i.pop()}for(let h=t+1;h<i.length;h++)i[h]=0;return i}updateWheels(t){if(this.isCascade){if(this.cascadeJsonData=t,this.displayJson=[],this.initCascade(),this.initPosition.length<this.slider.length){const e=this.slider.length-this.initPosition.length;for(let i=0;i<e;i++)this.initPosition.push(0)}this.setCurDistance(this.initPosition),this.fixRowStyle()}}updateWheel(t,e){if(this.isCascade){o.log("error","'updateWheel()' not support cascade json data, please use 'updateWheels()' instead to update the whole data source");return}let i="";i+=this.getOptionsHtmlStr(e),this.wheelsData[t]=this.isJsonType?{data:e}:e,this.slider[t].innerHTML=i}fixRowStyle(){if(this.initColWidth.length&&this.initColWidth.length===this.wheel.length){const e=this.initColWidth.reduce((i,s)=>i+s,0);this.initColWidth.forEach((i,s)=>{this.wheel[s].style.width=(i/e*100).toFixed(2)+"%"});return}const t=(100/this.wheel.length).toFixed(2);for(let e=0;e<this.wheel.length;e++)this.wheel[e].style.width=t+"%"}getIndex(t){return Math.round((2*this.optionHeight-t)/this.optionHeight)}getIndexArr(){const t=[];for(let e=0;e<this.curDistance.length;e++)t.push(this.getIndex(this.curDistance[e]));return t}getCurValue(){const t=[],e=this.getIndexArr(),{keyMap:i}=this.config;if(this.isCascade)for(let s=0;s<this.wheel.length;s++){const h=this.displayJson[s][e[s]];h&&t.push({[i.id]:h[i.id],[i.value]:h[i.value]})}else if(this.isJsonType)for(let s=0;s<this.curDistance.length;s++)t.push(this.wheelsData[s].data[this.getIndex(this.curDistance[s])]);else for(let s=0;s<this.curDistance.length;s++)t.push(this.getInnerText(s));return t}getValue(){return this.curValue}calcDistance(t){return 2*this.optionHeight-t*this.optionHeight}setCurDistance(t){const e=[];for(let i=0;i<this.slider.length;i++)e.push(this.calcDistance(t[i])),this.movePosition(this.slider[i],e[i]);this.curDistance=e}fixPosition(t){return-(this.getIndex(t)-2)*this.optionHeight}movePosition(t,e){t.style.transform="translate3d(0,"+e+"px, 0)"}locatePosition(t,e){this.curDistance[t]=this.calcDistance(e),this.movePosition(this.slider[t],this.curDistance[t]),this.isCascade&&this.checkRange(t,this.getIndexArr())}updateCurDistance(t,e){this.curDistance[e]=parseInt(t.style.transform.split(",")[1])}getInnerText(t){var s;const e=this.slider[t].getElementsByTagName("li").length;let i=this.getIndex(this.curDistance[t]);return i>=e?i=e-1:i<0&&(i=0),((s=this.slider[t].getElementsByTagName("li")[i])==null?void 0:s.innerText)||""}touch(t){var h,r,l,f,a,u,d,m;const i=(t.composedPath&&t.composedPath())[1];if(!i.hasAttribute("data-index"))return;const s=parseInt(i.getAttribute("data-index")||"0");switch(t.type){case"touchstart":case"mousedown":i.style.transition="none 0s ease-out",this.startY=Math.floor(t instanceof TouchEvent?t.touches[0].clientY:t.clientY),this.preMoveY=this.startY,t.type==="mousedown"&&(this.enableClickStatus=!0);break;case"touchend":case"mouseup":if(i.style.transition="transform 0.18s ease-out",this.moveEndY=Math.floor(t instanceof TouchEvent?t.changedTouches[0].clientY:t.clientY),this.offsetSum=this.moveEndY-this.startY,this.oversizeBorder=-(i.getElementsByTagName("li").length-3)*this.optionHeight,this.offsetSum==0){const y=Math.floor((window.innerHeight-this.moveEndY)/40);if(y!=2){const v=y-2,p=this.curDistance[s]+v*this.optionHeight;p<=2*this.optionHeight&&p>=this.oversizeBorder&&(this.curDistance[s]=p,this.movePosition(i,this.curDistance[s]),(r=(h=this.config).transitionEnd)==null||r.call(h,this.getIndexArr(),this.getCurValue(),this),(f=(l=this.config).onTransitionEnd)==null||f.call(l,this.getCurValue(),this.getIndexArr(),this))}}else this.updateCurDistance(i,s),this.curDistance[s]=this.fixPosition(this.curDistance[s]),this.movePosition(i,this.curDistance[s]),this.curDistance[s]+this.offsetSum>2*this.optionHeight?(this.curDistance[s]=2*this.optionHeight,setTimeout(()=>{this.movePosition(i,this.curDistance[s])},100)):this.curDistance[s]+this.offsetSum<this.oversizeBorder&&(this.curDistance[s]=this.oversizeBorder,setTimeout(()=>{this.movePosition(i,this.curDistance[s])},100)),(u=(a=this.config).transitionEnd)==null||u.call(a,this.getIndexArr(),this.getCurValue(),this),(m=(d=this.config).onTransitionEnd)==null||m.call(d,this.getCurValue(),this.getIndexArr(),this);t.type==="mouseup"&&(this.enableClickStatus=!1),this.isCascade&&this.checkRange(s,this.getIndexArr());break;case"touchmove":case"mousemove":if(t.preventDefault(),t.type==="mousemove"&&!this.enableClickStatus)break;this.moveY=Math.floor(t instanceof TouchEvent?t.touches[0].clientY:t.clientY),this.offsetY=(this.moveY-this.preMoveY)*this.config.scrollSpeed,this.updateCurDistance(i,s),this.curDistance[s]=this.curDistance[s]+this.offsetY,this.movePosition(i,this.curDistance[s]),this.preMoveY=this.moveY;break}}};let c=o;return n(c,"defaultConfig",{keyMap:{id:"id",value:"value",childs:"childs"},position:[],colWidth:[],title:"",connector:" ",ensureBtnText:"\u786E\u8BA4",cancelBtnText:"\u53D6\u6D88",triggerDisplayValue:!0,scrollSpeed:1}),n(c,"REQUIRED_PARAMS",["trigger","wheels"]),c});
