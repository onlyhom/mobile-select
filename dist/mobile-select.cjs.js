"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
require("./style/mobile-select.css");
class MobileSelect {
  constructor(config) {
    __publicField(this, "mobileSelect");
    __publicField(this, "trigger");
    __publicField(this, "wheel");
    __publicField(this, "slider");
    __publicField(this, "wheels");
    __publicField(this, "panel");
    __publicField(this, "ensureBtn");
    __publicField(this, "cancelBtn");
    __publicField(this, "grayLayer");
    __publicField(this, "popUp");
    __publicField(this, "initPosition");
    __publicField(this, "initColWidth");
    __publicField(this, "titleText");
    __publicField(this, "connector");
    __publicField(this, "wheelsData");
    __publicField(this, "displayJson");
    __publicField(this, "curValue");
    __publicField(this, "curIndexArr");
    __publicField(this, "isCascade");
    __publicField(this, "isJsonType");
    __publicField(this, "startY");
    __publicField(this, "moveEndY");
    __publicField(this, "moveY");
    __publicField(this, "preMoveY");
    __publicField(this, "offsetY");
    __publicField(this, "offsetSum");
    __publicField(this, "oversizeBorder");
    __publicField(this, "enableClickStatus");
    __publicField(this, "isPC");
    __publicField(this, "optionHeight");
    __publicField(this, "curDistance");
    __publicField(this, "cascadeJsonData");
    __publicField(this, "keyMap");
    __publicField(this, "eventHandleMap");
    __publicField(this, "initDeepCount");
    __publicField(this, "config");
    this.wheelsData = config.wheels;
    this.isJsonType = false;
    this.cascadeJsonData = [];
    this.displayJson = [];
    this.curValue = [];
    this.curIndexArr = [];
    this.isCascade = false;
    this.startY;
    this.moveEndY;
    this.moveY;
    this.preMoveY;
    this.offsetY = 0;
    this.offsetSum = 0;
    this.oversizeBorder;
    this.curDistance = [];
    this.enableClickStatus = false;
    this.isPC = true;
    this.optionHeight = 0;
    this.keyMap = { id: "id", value: "value", childs: "childs" };
    this.initPosition = config.position || [];
    this.initColWidth = config.colWidth || [];
    this.titleText = config.title || "";
    this.connector = config.connector || " ";
    this.config = config;
    this.init(config);
  }
  init(config) {
    this.keyMap = config.keyMap ? config.keyMap : { id: "id", value: "value", childs: "childs" };
    this.isJsonType = MobileSelect.checkDataType(this.wheelsData);
    this.renderComponent(this.wheelsData);
    if (typeof config.trigger === "string") {
      this.trigger = document.querySelector(config.trigger);
    } else {
      this.trigger = config.trigger;
    }
    if (!this.trigger) {
      console.error("mobile-select has been successfully installed, but no trigger found on your page.");
      return;
    }
    this.wheel = this.mobileSelect.getElementsByClassName("ms-wheel");
    this.slider = this.mobileSelect.getElementsByClassName("ms-select-container");
    this.panel = this.mobileSelect.querySelector(".ms-panel");
    this.wheels = this.mobileSelect.querySelector(".ms-wheels");
    this.ensureBtn = this.mobileSelect.querySelector(".ms-ensure");
    this.cancelBtn = this.mobileSelect.querySelector(".ms-cancel");
    this.grayLayer = this.mobileSelect.querySelector(".ms-gray-layer");
    this.popUp = this.mobileSelect.querySelector(".ms-content");
    this.optionHeight = this.mobileSelect.querySelector("li").offsetHeight;
    this.trigger.style.cursor = "pointer";
    this.setStyle(config);
    this.isPC = MobileSelect.checkIsPC();
    this.isCascade = this.checkCascade();
    if (this.isCascade) {
      this.initCascade();
    }
    if (config.initValue) {
      this.initPosition = this.getPositionByValue();
    }
    if (this.initPosition.length < this.slider.length) {
      let diff = this.slider.length - this.initPosition.length;
      for (let i = 0; i < diff; i++) {
        this.initPosition.push(0);
      }
    }
    this.setCurDistance(this.initPosition);
    this.eventHandleMap = {
      cancelBtn: {
        event: "click",
        fn: () => {
          var _a, _b, _c, _d;
          this.hide();
          (_b = (_a = this.config).cancel) == null ? void 0 : _b.call(_a, this.curIndexArr, this.curValue);
          (_d = (_c = this.config).onCancel) == null ? void 0 : _d.call(_c, this.curIndexArr, this.curValue);
        }
      },
      ensureBtn: {
        event: "click",
        fn: () => {
          var _a, _b, _c, _d;
          this.hide();
          if (!this.optionHeight) {
            this.optionHeight = this.mobileSelect.querySelector("li").offsetHeight;
          }
          let tempValue = "";
          for (let i = 0; i < this.wheel.length; i++) {
            i == this.wheel.length - 1 ? tempValue += this.getInnerHtml(i) : tempValue += this.getInnerHtml(i) + this.connector;
          }
          if (config.triggerDisplayData == void 0 || config.triggerDisplayData) {
            this.trigger.innerHTML = tempValue;
          }
          this.curIndexArr = this.getIndexArr();
          this.curValue = this.getCurValue();
          (_b = (_a = this.config).callback) == null ? void 0 : _b.call(_a, this.curIndexArr, this.curValue);
          (_d = (_c = this.config).onChange) == null ? void 0 : _d.call(_c, this.curIndexArr, this.curValue);
        }
      },
      trigger: {
        event: "click",
        fn: () => {
          this.show();
        }
      },
      grayLayer: {
        event: "click",
        fn: () => this.hide()
      },
      popUp: {
        event: "click",
        fn: (event) => event.stopPropagation()
      },
      panel: {
        event: ["touchstart", "touchend", "touchmove"],
        fn: (event) => this.touch(event)
      }
    };
    if (this.isPC) {
      this.eventHandleMap.panel.event = ["mousedown", "mousemove", "mouseup"];
    }
    this.registerEvents("add");
    this.fixRowStyle();
  }
  getPositionByValue() {
    var _a;
    const valueArr = this.config.initValue.split(this.connector);
    if (this.isJsonType) {
      let childList = (_a = this.wheelsData[0]) == null ? void 0 : _a.data;
      return valueArr.reduce((result, cur) => {
        var _a2;
        const posIndex = childList == null ? void 0 : childList.findIndex((item) => item[this.keyMap.value] == cur);
        result.push(posIndex < 0 ? 0 : posIndex);
        childList = (_a2 = childList[posIndex]) == null ? void 0 : _a2[this.keyMap.childs];
        return result;
      }, []);
    }
    return valueArr.reduce((result, cur, index) => {
      var _a2, _b;
      const posIndex = (_b = (_a2 = this.wheelsData[index]) == null ? void 0 : _a2.data) == null ? void 0 : _b.findIndex((item) => item == cur);
      result.push(posIndex < 0 ? 0 : posIndex);
      return result;
    }, []);
  }
  setTitle(title) {
    this.mobileSelect.querySelector(".ms-title").innerHTML = title;
  }
  setStyle(config) {
    if (config.ensureBtnColor) {
      this.ensureBtn.style.color = config.ensureBtnColor;
    }
    if (config.cancelBtnColor) {
      this.cancelBtn.style.color = config.cancelBtnColor;
    }
    if (config.titleColor) {
      const titleDom = this.mobileSelect.querySelector(".ms-title");
      titleDom.style.color = config.titleColor;
    }
    if (config.textColor) {
      this.panel = this.mobileSelect.querySelector(".ms-panel");
      this.panel.style.color = config.textColor;
    }
    if (config.titleBgColor) {
      const btnBar = this.mobileSelect.querySelector(".ms-btn-bar");
      btnBar.style.backgroundColor = config.titleBgColor;
    }
    if (config.bgColor) {
      this.panel = this.mobileSelect.querySelector(".ms-panel");
      const shadowMask = this.mobileSelect.querySelector(".ms-shadow-mask");
      this.panel.style.backgroundColor = config.bgColor;
      shadowMask.style.background = "linear-gradient(to bottom, " + config.bgColor + ", rgba(255, 255, 255, 0), " + config.bgColor + ")";
    }
    if (typeof config.maskOpacity === "number") {
      const grayMask = this.mobileSelect.querySelector(".ms-gray-layer");
      grayMask.style.background = "rgba(0, 0, 0, " + config.maskOpacity + ")";
    }
  }
  show() {
    var _a, _b;
    this.mobileSelect.classList.add("ms-show");
    if (typeof this.config.onShow === "function") {
      (_b = (_a = this.config).onShow) == null ? void 0 : _b.call(_a);
    }
  }
  hide() {
    var _a, _b;
    this.mobileSelect.classList.remove("ms-show");
    if (typeof this.config.onHide === "function") {
      (_b = (_a = this.config).onHide) == null ? void 0 : _b.call(_a);
    }
  }
  registerEvents(type) {
    for (const [domName, item] of Object.entries(this.eventHandleMap)) {
      if (typeof item.event === "string") {
        this[domName][`${type}EventListener`](item.event, item.fn);
      } else {
        item.event.forEach((eventName) => {
          this[domName][`${type}EventListener`](eventName, item.fn);
        });
      }
    }
  }
  destroy() {
    this.registerEvents("remove");
    this.mobileSelect.parentNode.removeChild(this.mobileSelect);
  }
  getOptionsHtmlStr(childs) {
    let tempHTML = "";
    if (this.isJsonType) {
      for (let j = 0; j < childs.length; j++) {
        const id = childs[j][this.keyMap.id];
        const val = childs[j][this.keyMap.value];
        tempHTML += `<li data-id="${id}">${val}</li>`;
      }
    } else {
      for (let j = 0; j < childs.length; j++) {
        tempHTML += "<li>" + childs[j] + "</li>";
      }
    }
    return tempHTML;
  }
  renderComponent(wheelsData) {
    this.mobileSelect = document.createElement("div");
    this.mobileSelect.className = "ms-mobile-select";
    this.mobileSelect.innerHTML = `<div class="ms-gray-layer"></div>
        <div class="ms-content">
          <div class="ms-btn-bar">
            <div class="ms-fix-width">
              <div class="ms-cancel">${this.config.cancelBtnText || "\u53D6\u6D88"}</div>  
              <div class="ms-title">${this.config.title || ""}</div>
              <div class="ms-ensure">${this.config.ensureBtnText || "\u786E\u8BA4"}</div>
            </div>
          </div>
          <div class="ms-panel">
            <div class="ms-fix-width">
            <div class="ms-wheels"></div>
            <div class="ms-select-line"></div>
            <div class="ms-shadow-mask"></div>
          </div>
        </div>`;
    document.body.appendChild(this.mobileSelect);
    let tempHTML = "";
    for (let i = 0; i < wheelsData.length; i++) {
      tempHTML += `<div class="ms-wheel"><ul class="ms-select-container" data-index="${i}">`;
      tempHTML += this.getOptionsHtmlStr(wheelsData[i].data);
      tempHTML += "</ul></div>";
    }
    this.mobileSelect.querySelector(".ms-wheels").innerHTML = tempHTML;
  }
  reRenderWheels() {
    const diff = this.wheel.length - this.displayJson.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.wheels.removeChild(this.wheel[this.wheel.length - 1]);
      }
    }
    for (let i = 0; i < this.displayJson.length; i++) {
      if (this.wheel[i]) {
        this.slider[i].innerHTML = this.getOptionsHtmlStr(this.displayJson[i]);
      } else {
        let tempWheel = document.createElement("div");
        tempWheel.className = "ms-wheel";
        tempWheel.innerHTML = `<ul class="ms-select-container" data-index="${i}">${this.getOptionsHtmlStr(this.displayJson[i])}</ul>`;
        this.wheels.appendChild(tempWheel);
      }
    }
  }
  static checkIsPC() {
    return !Boolean(navigator.userAgent.toLowerCase().match(/ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/));
  }
  static checkDataType(wheelsData) {
    var _a, _b;
    return typeof ((_b = (_a = wheelsData[0]) == null ? void 0 : _a.data) == null ? void 0 : _b[0]) === "object";
  }
  checkCascade() {
    var _a;
    if (this.isJsonType) {
      let node = this.wheelsData[0].data;
      for (let i = 0; i < node.length; i++) {
        if (this.keyMap.childs in node[i] && ((_a = node[i][this.keyMap.childs]) == null ? void 0 : _a.length) > 0) {
          this.cascadeJsonData = this.wheelsData[0].data;
          return true;
        }
      }
    }
    return false;
  }
  initCascade() {
    this.displayJson.push(this.cascadeJsonData);
    if (this.initPosition.length > 0) {
      this.initDeepCount = 0;
      this.initCheckArrDeep(this.cascadeJsonData[this.initPosition[0]]);
    } else {
      this.checkArrDeep(this.cascadeJsonData[0]);
    }
    this.reRenderWheels();
  }
  initCheckArrDeep(parent) {
    if (parent) {
      if (this.keyMap.childs in parent && parent[this.keyMap.childs].length > 0) {
        this.displayJson.push(parent[this.keyMap.childs]);
        this.initDeepCount++;
        let nextNode = parent[this.keyMap.childs][this.initPosition[this.initDeepCount]];
        if (nextNode) {
          this.initCheckArrDeep(nextNode);
        } else {
          this.checkArrDeep(parent[this.keyMap.childs][0]);
        }
      }
    }
  }
  checkArrDeep(parent) {
    if (!parent)
      return;
    if (this.keyMap.childs in parent && parent[this.keyMap.childs].length > 0) {
      this.displayJson.push(parent[this.keyMap.childs]);
      this.checkArrDeep(parent[this.keyMap.childs][0]);
    }
  }
  checkRange(index, posIndexArr) {
    let deleteNum = this.displayJson.length - 1 - index;
    for (let i = 0; i < deleteNum; i++) {
      this.displayJson.pop();
    }
    let resultNode;
    for (let i = 0; i <= index; i++) {
      resultNode = i == 0 ? this.cascadeJsonData[posIndexArr[0]] : resultNode[this.keyMap.childs][posIndexArr[i]];
    }
    this.checkArrDeep(resultNode);
    this.reRenderWheels();
    this.fixRowStyle();
    this.setCurDistance(this.resetPosition(index, posIndexArr));
  }
  resetPosition(index, posIndexArr) {
    let tempPosArr = posIndexArr;
    let tempCount;
    if (this.slider.length > posIndexArr.length) {
      tempCount = this.slider.length - posIndexArr.length;
      for (let i = 0; i < tempCount; i++) {
        tempPosArr.push(0);
      }
    } else if (this.slider.length < posIndexArr.length) {
      tempCount = posIndexArr.length - this.slider.length;
      for (let i = 0; i < tempCount; i++) {
        tempPosArr.pop();
      }
    }
    for (let i = index + 1; i < tempPosArr.length; i++) {
      tempPosArr[i] = 0;
    }
    return tempPosArr;
  }
  updateWheels(data) {
    if (this.isCascade) {
      this.cascadeJsonData = data;
      this.displayJson = [];
      this.initCascade();
      if (this.initPosition.length < this.slider.length) {
        let diff = this.slider.length - this.initPosition.length;
        for (let i = 0; i < diff; i++) {
          this.initPosition.push(0);
        }
      }
      this.setCurDistance(this.initPosition);
      this.fixRowStyle();
    }
  }
  updateWheel(sliderIndex, data) {
    let tempHTML = "";
    if (this.isCascade) {
      console.error("\u7EA7\u8054\u683C\u5F0F\u4E0D\u652F\u6301updateWheel(),\u8BF7\u4F7F\u7528updateWheels()\u66F4\u65B0\u6574\u4E2A\u6570\u636E\u6E90");
      return;
    }
    tempHTML += this.getOptionsHtmlStr(data);
    this.wheelsData[sliderIndex] = this.isJsonType ? { data } : data;
    this.slider[sliderIndex].innerHTML = tempHTML;
  }
  fixRowStyle() {
    if (this.initColWidth.length && this.initColWidth.length === this.wheel.length) {
      let widthSum = this.initColWidth.reduce((cur, pre) => cur + pre, 0);
      this.initColWidth.forEach((item, index) => {
        this.wheel[index].style.width = (item / widthSum * 100).toFixed(2) + "%";
      });
      return;
    }
    let width = (100 / this.wheel.length).toFixed(2);
    for (let i = 0; i < this.wheel.length; i++) {
      this.wheel[i].style.width = width + "%";
    }
  }
  getIndex(distance) {
    return Math.round((2 * this.optionHeight - distance) / this.optionHeight);
  }
  getIndexArr() {
    let temp = [];
    for (let i = 0; i < this.curDistance.length; i++) {
      temp.push(this.getIndex(this.curDistance[i]));
    }
    return temp;
  }
  getCurValue() {
    let temp = [];
    let positionArr = this.getIndexArr();
    if (this.isCascade) {
      for (let i = 0; i < this.wheel.length; i++) {
        temp.push(this.displayJson[i][positionArr[i]]);
      }
    } else if (this.isJsonType) {
      for (let i = 0; i < this.curDistance.length; i++) {
        temp.push(this.wheelsData[i].data[this.getIndex(this.curDistance[i])]);
      }
    } else {
      for (let i = 0; i < this.curDistance.length; i++) {
        temp.push(this.getInnerHtml(i));
      }
    }
    return temp;
  }
  getValue() {
    return this.curValue;
  }
  calcDistance(index) {
    return 2 * this.optionHeight - index * this.optionHeight;
  }
  setCurDistance(indexArr) {
    let temp = [];
    for (let i = 0; i < this.slider.length; i++) {
      temp.push(this.calcDistance(indexArr[i]));
      this.movePosition(this.slider[i], temp[i]);
    }
    this.curDistance = temp;
  }
  fixPosition(distance) {
    return -(this.getIndex(distance) - 2) * this.optionHeight;
  }
  movePosition(theSlider, distance) {
    theSlider.style.transform = "translate3d(0," + distance + "px, 0)";
  }
  locatePosition(index, posIndex) {
    this.curDistance[index] = this.calcDistance(posIndex);
    this.movePosition(this.slider[index], this.curDistance[index]);
    if (this.isCascade) {
      this.checkRange(index, this.getIndexArr());
    }
  }
  updateCurDistance(theSlider, index) {
    this.curDistance[index] = parseInt(theSlider.style.transform.split(",")[1]);
  }
  getInnerHtml(sliderIndex) {
    let lengthOfList = this.slider[sliderIndex].getElementsByTagName("li").length;
    let index = this.getIndex(this.curDistance[sliderIndex]);
    if (index >= lengthOfList) {
      index = lengthOfList - 1;
    } else if (index < 0) {
      index = 0;
    }
    return this.slider[sliderIndex].getElementsByTagName("li")[index].innerHTML;
  }
  touch(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const path = event.composedPath && event.composedPath();
    const theSlider = path[1];
    const index = parseInt(theSlider.getAttribute("data-index") || "0");
    switch (event.type) {
      case "touchstart":
      case "mousedown":
        this.startY = Math.floor(event instanceof TouchEvent ? event.touches[0].clientY : event.clientY);
        this.preMoveY = this.startY;
        if (event.type === "mousedown") {
          this.enableClickStatus = true;
        }
        break;
      case "touchend":
      case "mouseup":
        this.moveEndY = Math.floor(event instanceof TouchEvent ? event.changedTouches[0].clientY : event.clientY);
        this.offsetSum = this.moveEndY - this.startY;
        this.oversizeBorder = -(theSlider.getElementsByTagName("li").length - 3) * this.optionHeight;
        if (this.offsetSum == 0) {
          let clickOffetNum = Math.floor((document.documentElement.clientHeight - this.moveEndY) / 40);
          if (clickOffetNum != 2) {
            let tempOffset = clickOffetNum - 2;
            let newDistance = this.curDistance[index] + tempOffset * this.optionHeight;
            if (newDistance <= 2 * this.optionHeight && newDistance >= this.oversizeBorder) {
              this.curDistance[index] = newDistance;
              this.movePosition(theSlider, this.curDistance[index]);
              (_b = (_a = this.config).transitionEnd) == null ? void 0 : _b.call(_a, this.getIndexArr(), this.getCurValue());
              (_d = (_c = this.config).onTransitionEnd) == null ? void 0 : _d.call(_c, this.getIndexArr(), this.getCurValue());
            }
          }
        } else {
          this.updateCurDistance(theSlider, index);
          this.curDistance[index] = this.fixPosition(this.curDistance[index]);
          this.movePosition(theSlider, this.curDistance[index]);
          if (this.curDistance[index] + this.offsetSum > 2 * this.optionHeight) {
            this.curDistance[index] = 2 * this.optionHeight;
            setTimeout(() => {
              this.movePosition(theSlider, this.curDistance[index]);
            }, 100);
          } else if (this.curDistance[index] + this.offsetSum < this.oversizeBorder) {
            this.curDistance[index] = this.oversizeBorder;
            setTimeout(() => {
              this.movePosition(theSlider, this.curDistance[index]);
            }, 100);
          }
          (_f = (_e = this.config).transitionEnd) == null ? void 0 : _f.call(_e, this.getIndexArr(), this.getCurValue());
          (_h = (_g = this.config).onTransitionEnd) == null ? void 0 : _h.call(_g, this.getIndexArr(), this.getCurValue());
        }
        if (event.type === "mouseup") {
          this.enableClickStatus = false;
        }
        if (this.isCascade) {
          this.checkRange(index, this.getIndexArr());
        }
        break;
      case "touchmove":
      case "mousemove":
        event.preventDefault();
        if (event.type === "mousemove" && !this.enableClickStatus)
          break;
        this.moveY = Math.floor(event instanceof TouchEvent ? event.touches[0].clientY : event.clientY);
        this.offsetY = this.moveY - this.preMoveY;
        this.updateCurDistance(theSlider, index);
        this.curDistance[index] = this.curDistance[index] + this.offsetY;
        this.movePosition(theSlider, this.curDistance[index]);
        this.preMoveY = this.moveY;
        break;
    }
  }
}
module.exports = MobileSelect;
