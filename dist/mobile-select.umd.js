/*
* mobile-select v1.2.0-beta.4
* Homepage: https://github.com/onlyhom/mobile-select
* Released under the MIT License.
* (c) 2017-present
*/
(function(a,o){typeof exports=="object"&&typeof module<"u"?module.exports=o(require("./style/mobile-select.css")):typeof define=="function"&&define.amd?define(["./style/mobile-select.css"],o):(a=typeof globalThis<"u"?globalThis:a||self,a.MobileSelect=o())})(this,function(){"use strict";var C=Object.defineProperty;var D=(a,o,g)=>o in a?C(a,o,{enumerable:!0,configurable:!0,writable:!0,value:g}):a[o]=g;var h=(a,o,g)=>(D(a,typeof o!="symbol"?o+"":o,g),g);const o=class{constructor(e){h(this,"mobileSelect");h(this,"trigger");h(this,"wheel");h(this,"slider");h(this,"wheels");h(this,"panel");h(this,"ensureBtn");h(this,"cancelBtn");h(this,"grayLayer");h(this,"popUp");h(this,"initPosition");h(this,"initColWidth");h(this,"connector");h(this,"wheelsData");h(this,"displayJson");h(this,"curValue");h(this,"curIndexArr");h(this,"isCascade");h(this,"isJsonType");h(this,"startY");h(this,"moveEndY");h(this,"moveY");h(this,"preMoveY");h(this,"offsetY");h(this,"offsetSum");h(this,"oversizeBorder");h(this,"enableClickStatus");h(this,"isPC");h(this,"optionHeight");h(this,"curDistance");h(this,"cascadeJsonData");h(this,"keyMap");h(this,"eventHandleMap");h(this,"initDeepCount");h(this,"config");!o.checkRequiredConfig(e)||(this.config=Object.assign({},o.defaultConfig,e),this.wheelsData=e.wheels,this.isJsonType=!1,this.cascadeJsonData=[],this.displayJson=[],this.curValue=[],this.curIndexArr=[],this.isCascade=!1,this.startY,this.moveEndY,this.moveY,this.preMoveY,this.offsetY=0,this.offsetSum=0,this.oversizeBorder,this.curDistance=[],this.enableClickStatus=!1,this.isPC=!0,this.optionHeight=0,this.initPosition=e.position||[],this.initColWidth=e.colWidth||[],this.init())}init(){const{config:e}=this;if(this.isJsonType=o.checkDataType(this.wheelsData),this.renderComponent(this.wheelsData),!!this.checkTriggerAvailable()){if(this.wheel=this.mobileSelect.getElementsByClassName("ms-wheel"),this.slider=this.mobileSelect.getElementsByClassName("ms-select-container"),this.panel=this.mobileSelect.querySelector(".ms-panel"),this.wheels=this.mobileSelect.querySelector(".ms-wheels"),this.ensureBtn=this.mobileSelect.querySelector(".ms-ensure"),this.cancelBtn=this.mobileSelect.querySelector(".ms-cancel"),this.grayLayer=this.mobileSelect.querySelector(".ms-gray-layer"),this.popUp=this.mobileSelect.querySelector(".ms-content"),this.optionHeight=this.mobileSelect.querySelector("li").offsetHeight,e.initValue&&e.triggerDisplayValue&&(this.trigger.innerText=e.initValue),this.setStyle(e),this.isPC=o.checkIsPC(),this.isCascade=this.checkCascade(),this.isCascade&&this.initCascade(),e.initValue&&(this.initPosition=this.getPositionByValue()),this.initPosition.length<this.slider.length){let t=this.slider.length-this.initPosition.length;for(let i=0;i<t;i++)this.initPosition.push(0)}this.isCascade?this.initPosition.forEach((t,i)=>{this.checkRange(i,this.initPosition)}):this.setCurDistance(this.initPosition),this.eventHandleMap={cancelBtn:{event:"click",fn:()=>{var t,i,s,n;this.hide(),(i=(t=this.config).cancel)==null||i.call(t,this.curIndexArr,this.curValue,this),(n=(s=this.config).onCancel)==null||n.call(s,this.curValue,this.curIndexArr,this)}},ensureBtn:{event:"click",fn:()=>{var i,s,n,r;this.hide(),this.optionHeight||(this.optionHeight=this.mobileSelect.querySelector("li").offsetHeight);let t="";for(let l=0;l<this.wheel.length;l++)l==this.wheel.length-1?t+=this.getInnerText(l):t+=this.getInnerText(l)+this.config.connector;e.triggerDisplayValue&&(this.trigger.innerText=t),this.curIndexArr=this.getIndexArr(),this.curValue=this.getCurValue(),(s=(i=this.config).callback)==null||s.call(i,this.curIndexArr,this.curValue,this),(r=(n=this.config).onChange)==null||r.call(n,this.curValue,this.curIndexArr,this)}},trigger:{event:"click",fn:()=>{this.show()}},grayLayer:{event:"click",fn:()=>this.hide()},popUp:{event:"click",fn:t=>t.stopPropagation()},panel:{event:["touchstart","touchend","touchmove"],fn:t=>this.touch(t)}},this.isPC&&(this.eventHandleMap.panel.event=["mousedown","mousemove","mouseup"]),this.registerEvents("add"),this.fixRowStyle(),e.autoFocus&&this.show()}}static checkIsPC(){return!Boolean(navigator.userAgent.toLowerCase().match(/ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/))}static checkDataType(e){var t,i;return typeof((i=(t=e[0])==null?void 0:t.data)==null?void 0:i[0])=="object"}static checkRequiredConfig(e){const t=o.REQUIRED_PARAMS;if(!e){const i=t.map(s=>`'${s}'`);return o.log("error",`missing required param ${i.join(" and ")}.`),!1}for(let i=0;i<t.length;i++){const s=t[i];if(!e[s])return o.log("error",`missing required param '${s}'.`),!1}return!0}static log(e,t){var i;(i=console[e])==null||i.call(console,`[mobile-select]: ${t}`)}checkTriggerAvailable(){const{config:e}=this;return this.trigger=e.trigger instanceof HTMLElement?e.trigger:document.querySelector(e.trigger),this.trigger?!0:(o.log("error","trigger HTMLElement does not found on your document."),!1)}getPositionByValue(){var n;const{keyMap:e,connector:t,initValue:i}=this.config,s=(i==null?void 0:i.split(t))||[];if(this.isJsonType){let r=(n=this.wheelsData[0])==null?void 0:n.data;return s.reduce((l,f)=>{var u;const c=r==null?void 0:r.findIndex(d=>d[e.value]==f);return l.push(c<0?0:c),r=(u=r[c])==null?void 0:u[e.childs],l},[])}return s.reduce((r,l,f)=>{var u,d;const c=(d=(u=this.wheelsData[f])==null?void 0:u.data)==null?void 0:d.findIndex(m=>m==l);return r.push(c<0?0:c),r},[])}setTitle(e){this.mobileSelect.querySelector(".ms-title").innerHTML=e}setStyle(e){if(e.ensureBtnColor&&(this.ensureBtn.style.color=e.ensureBtnColor),e.cancelBtnColor&&(this.cancelBtn.style.color=e.cancelBtnColor),e.titleColor){const t=this.mobileSelect.querySelector(".ms-title");t.style.color=e.titleColor}if(e.textColor&&(this.panel=this.mobileSelect.querySelector(".ms-panel"),this.panel.style.color=e.textColor),e.titleBgColor){const t=this.mobileSelect.querySelector(".ms-btn-bar");t.style.backgroundColor=e.titleBgColor}if(e.bgColor){this.panel=this.mobileSelect.querySelector(".ms-panel");const t=this.mobileSelect.querySelector(".ms-shadow-mask");this.panel.style.backgroundColor=e.bgColor,t.style.background="linear-gradient(to bottom, "+e.bgColor+", rgba(255, 255, 255, 0), "+e.bgColor+")"}if(typeof e.maskOpacity=="number"){const t=this.mobileSelect.querySelector(".ms-gray-layer");t.style.background="rgba(0, 0, 0, "+e.maskOpacity+")"}}show(){var e,t;this.mobileSelect.classList.add("ms-show"),typeof this.config.onShow=="function"&&((t=(e=this.config).onShow)==null||t.call(e))}hide(){var e,t;this.mobileSelect.classList.remove("ms-show"),typeof this.config.onHide=="function"&&((t=(e=this.config).onHide)==null||t.call(e))}registerEvents(e){for(const[t,i]of Object.entries(this.eventHandleMap))typeof i.event=="string"?this[t][`${e}EventListener`](i.event,i.fn,{passive:!1}):i.event.forEach(s=>{this[t][`${e}EventListener`](s,i.fn,{passive:!1})})}destroy(){var e,t;this.registerEvents("remove"),(t=(e=this.mobileSelect)==null?void 0:e.parentNode)==null||t.removeChild(this.mobileSelect)}getOptionsHtmlStr(e){const{keyMap:t}=this.config;let i="";if(this.isJsonType)for(let s=0;s<e.length;s++){const n=e[s][t.id],r=e[s][t.value];i+=`<li data-id="${n}">${r}</li>`}else for(let s=0;s<e.length;s++)i+="<li>"+e[s]+"</li>";return i}renderComponent(e){this.mobileSelect=document.createElement("div"),this.mobileSelect.className="ms-mobile-select",this.mobileSelect.innerHTML=`<div class="ms-gray-layer"></div>
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
        </div>`,document.body.appendChild(this.mobileSelect);let t="";for(let i=0;i<e.length;i++)t+=`<div class="ms-wheel"><ul class="ms-select-container" data-index="${i}">`,t+=this.getOptionsHtmlStr(e[i].data),t+="</ul></div>";this.mobileSelect.querySelector(".ms-wheels").innerHTML=t}reRenderWheels(){const e=this.wheel.length-this.displayJson.length;if(e>0)for(let t=0;t<e;t++)this.wheels.removeChild(this.wheel[this.wheel.length-1]);for(let t=0;t<this.displayJson.length;t++)if(this.wheel[t])this.slider[t].innerHTML=this.getOptionsHtmlStr(this.displayJson[t]);else{let i=document.createElement("div");i.className="ms-wheel",i.innerHTML=`<ul class="ms-select-container" data-index="${t}">${this.getOptionsHtmlStr(this.displayJson[t])}</ul>`,this.wheels.appendChild(i)}}checkCascade(){var t;const{keyMap:e}=this.config;if(this.isJsonType){let i=this.wheelsData[0].data;for(let s=0;s<i.length;s++)if(e.childs in i[s]&&((t=i[s][e.childs])==null?void 0:t.length)>0)return this.cascadeJsonData=this.wheelsData[0].data,!0}return!1}initCascade(){this.displayJson.push(this.cascadeJsonData),this.initPosition.length>0?(this.initDeepCount=0,this.initCheckArrDeep(this.cascadeJsonData[this.initPosition[0]])):this.checkArrDeep(this.cascadeJsonData[0]),this.reRenderWheels()}initCheckArrDeep(e){if(e){const{keyMap:t}=this.config;if(t.childs in e&&e[t.childs].length>0){this.displayJson.push(e[t.childs]),this.initDeepCount++;let i=e[t.childs][this.initPosition[this.initDeepCount]];i?this.initCheckArrDeep(i):this.checkArrDeep(e[t.childs][0])}}}checkArrDeep(e){if(!e)return;const{keyMap:t}=this.config;t.childs in e&&e[t.childs].length>0&&(this.displayJson.push(e[t.childs]),this.checkArrDeep(e[t.childs][0]))}checkRange(e,t){var r;let i=this.displayJson.length-1-e;const{keyMap:s}=this.config;for(let l=0;l<i;l++)this.displayJson.pop();let n;for(let l=0;l<=e;l++)n=l==0?this.cascadeJsonData[t[0]]:(r=n==null?void 0:n[s.childs])==null?void 0:r[t[l]];this.checkArrDeep(n),this.reRenderWheels(),this.fixRowStyle(),this.setCurDistance(this.resetPosition(e,t))}resetPosition(e,t){let i=[...t],s;if(this.slider.length>t.length){s=this.slider.length-t.length;for(let n=0;n<s;n++)i.push(0)}else if(this.slider.length<t.length){s=t.length-this.slider.length;for(let n=0;n<s;n++)i.pop()}for(let n=e+1;n<i.length;n++)i[n]=0;return i}updateWheels(e){if(this.isCascade){if(this.cascadeJsonData=e,this.displayJson=[],this.initCascade(),this.initPosition.length<this.slider.length){let t=this.slider.length-this.initPosition.length;for(let i=0;i<t;i++)this.initPosition.push(0)}this.setCurDistance(this.initPosition),this.fixRowStyle()}}updateWheel(e,t){if(this.isCascade){o.log("error","'updateWheel()' not support cascade json data, please use 'updateWheels()' instead to update the whole data source");return}let i="";i+=this.getOptionsHtmlStr(t),this.wheelsData[e]=this.isJsonType?{data:t}:t,this.slider[e].innerHTML=i}fixRowStyle(){if(this.initColWidth.length&&this.initColWidth.length===this.wheel.length){let t=this.initColWidth.reduce((i,s)=>i+s,0);this.initColWidth.forEach((i,s)=>{this.wheel[s].style.width=(i/t*100).toFixed(2)+"%"});return}let e=(100/this.wheel.length).toFixed(2);for(let t=0;t<this.wheel.length;t++)this.wheel[t].style.width=e+"%"}getIndex(e){return Math.round((2*this.optionHeight-e)/this.optionHeight)}getIndexArr(){let e=[];for(let t=0;t<this.curDistance.length;t++)e.push(this.getIndex(this.curDistance[t]));return e}getCurValue(){let e=[],t=this.getIndexArr();const{keyMap:i}=this.config;if(this.isCascade)for(let s=0;s<this.wheel.length;s++){const n=this.displayJson[s][t[s]];n&&e.push({[i.id]:n[i.id],[i.value]:n[i.value]})}else if(this.isJsonType)for(let s=0;s<this.curDistance.length;s++)e.push(this.wheelsData[s].data[this.getIndex(this.curDistance[s])]);else for(let s=0;s<this.curDistance.length;s++)e.push(this.getInnerText(s));return e}getValue(){return this.curValue}calcDistance(e){return 2*this.optionHeight-e*this.optionHeight}setCurDistance(e){let t=[];for(let i=0;i<this.slider.length;i++)t.push(this.calcDistance(e[i])),this.movePosition(this.slider[i],t[i]);this.curDistance=t}fixPosition(e){return-(this.getIndex(e)-2)*this.optionHeight}movePosition(e,t){e.style.transform="translate3d(0,"+t+"px, 0)"}locatePosition(e,t){this.curDistance[e]=this.calcDistance(t),this.movePosition(this.slider[e],this.curDistance[e]),this.isCascade&&this.checkRange(e,this.getIndexArr())}updateCurDistance(e,t){this.curDistance[t]=parseInt(e.style.transform.split(",")[1])}getInnerText(e){var s;let t=this.slider[e].getElementsByTagName("li").length,i=this.getIndex(this.curDistance[e]);return i>=t?i=t-1:i<0&&(i=0),((s=this.slider[e].getElementsByTagName("li")[i])==null?void 0:s.innerText)||""}touch(e){var n,r,l,f,c,u,d,m;const i=(e.composedPath&&e.composedPath())[1];if(!i.hasAttribute("data-index"))return;const s=parseInt(i.getAttribute("data-index")||"0");switch(e.type){case"touchstart":case"mousedown":i.style.transition="none 0s ease-out",this.startY=Math.floor(e instanceof TouchEvent?e.touches[0].clientY:e.clientY),this.preMoveY=this.startY,e.type==="mousedown"&&(this.enableClickStatus=!0);break;case"touchend":case"mouseup":if(i.style.transition="transform 0.18s ease-out",this.moveEndY=Math.floor(e instanceof TouchEvent?e.changedTouches[0].clientY:e.clientY),this.offsetSum=this.moveEndY-this.startY,this.oversizeBorder=-(i.getElementsByTagName("li").length-3)*this.optionHeight,this.offsetSum==0){let y=Math.floor((window.innerHeight-this.moveEndY)/40);if(y!=2){let v=y-2,p=this.curDistance[s]+v*this.optionHeight;p<=2*this.optionHeight&&p>=this.oversizeBorder&&(this.curDistance[s]=p,this.movePosition(i,this.curDistance[s]),(r=(n=this.config).transitionEnd)==null||r.call(n,this.getIndexArr(),this.getCurValue(),this),(f=(l=this.config).onTransitionEnd)==null||f.call(l,this.getCurValue(),this.getIndexArr(),this))}}else this.updateCurDistance(i,s),this.curDistance[s]=this.fixPosition(this.curDistance[s]),this.movePosition(i,this.curDistance[s]),this.curDistance[s]+this.offsetSum>2*this.optionHeight?(this.curDistance[s]=2*this.optionHeight,setTimeout(()=>{this.movePosition(i,this.curDistance[s])},100)):this.curDistance[s]+this.offsetSum<this.oversizeBorder&&(this.curDistance[s]=this.oversizeBorder,setTimeout(()=>{this.movePosition(i,this.curDistance[s])},100)),(u=(c=this.config).transitionEnd)==null||u.call(c,this.getIndexArr(),this.getCurValue(),this),(m=(d=this.config).onTransitionEnd)==null||m.call(d,this.getCurValue(),this.getIndexArr(),this);e.type==="mouseup"&&(this.enableClickStatus=!1),this.isCascade&&this.checkRange(s,this.getIndexArr());break;case"touchmove":case"mousemove":if(e.preventDefault(),e.type==="mousemove"&&!this.enableClickStatus)break;this.moveY=Math.floor(e instanceof TouchEvent?e.touches[0].clientY:e.clientY),this.offsetY=(this.moveY-this.preMoveY)*this.config.scrollSpeed,this.updateCurDistance(i,s),this.curDistance[s]=this.curDistance[s]+this.offsetY,this.movePosition(i,this.curDistance[s]),this.preMoveY=this.moveY;break}}};let a=o;return h(a,"defaultConfig",{keyMap:{id:"id",value:"value",childs:"childs"},position:[],colWidth:[],title:"",connector:" ",ensureBtnText:"\u786E\u8BA4",cancelBtnText:"\u53D6\u6D88",triggerDisplayValue:!0,scrollSpeed:1}),h(a,"REQUIRED_PARAMS",["trigger","wheels"]),a});
