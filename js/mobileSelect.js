/*!
 * mobile-select
 * (c) 2017-present onlyhom
 * Released under the MIT License.
 */

// TODO优化: 优化less 优化其他函数 引入TS 可视化单元测试

(function () {
  function getClass(dom, string) {
    return dom.getElementsByClassName(string);
  }

  function checkIsPC() {
    return !Boolean(
      navigator.userAgent
        .toLowerCase()
        .match(
          /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/
        )
    );
  }

  //构造器
  class MobileSelect {
    constructor(config) {
      this.mobileSelect;
      this.wheelsData = config.wheels;
      this.isJsonType = false;
      this.cascadeJsonData = [];
      this.displayJson = [];
      this.curValue = null;
      this.curIndexArr = [];
      this.isCascade = false;
      this.startY;
      this.moveEndY;
      this.moveY;
      this.oldMoveY;
      this.offset = 0;
      this.offsetSum = 0;
      this.oversizeBorder;
      this.curDistance = [];
      this.clickStatus = false;
      this.isPC = true;
      this.init(config);
    }

    init(config) {
      this.keyMap = config.keyMap
        ? config.keyMap
        : { id: "id", value: "value", childs: "childs" };
      this.isJsonType = MobileSelect.checkDataType(this.wheelsData);
      this.renderComponent(
        this.wheelsData,
        config.cancelBtnText,
        config.ensureBtnText
      );
      this.trigger = document.querySelector(config.trigger);
      if (!this.trigger) {
        console.error(
          "mobile-select has been successfully installed, but no trigger found on your page."
        );
        return false;
      }
      this.wheel = getClass(this.mobileSelect, "wheel");
      this.slider = getClass(this.mobileSelect, "selectContainer");
      this.panel = this.mobileSelect.querySelector(".panel");
      this.panel = this.mobileSelect.querySelector(".panel");
      this.wheels = this.mobileSelect.querySelector(".wheels");
      this.liHeight = this.mobileSelect.querySelector("li").offsetHeight;
      this.ensureBtn = this.mobileSelect.querySelector(".ensure");
      this.cancelBtn = this.mobileSelect.querySelector(".cancel");
      this.grayLayer = this.mobileSelect.querySelector(".grayLayer");
      this.popUp = this.mobileSelect.querySelector(".content");
      this.callback = config.callback || function () {};
      this.transitionEnd = config.transitionEnd || function () {};
      this.onShow = config.onShow || function () {};
      this.onHide = config.onHide || function () {};
      this.initPosition = config.position || [];
      this.initColWidth = config.colWidth || [];
      this.titleText = config.title || "";
      this.connector = config.connector || " ";
      this.triggerDisplayData = !(
        typeof config.triggerDisplayData == "undefined"
      )
        ? config.triggerDisplayData
        : true;
      this.trigger.style.cursor = "pointer";
      this.setStyle(config);
      this.setTitle(this.titleText);
      this.isPC = checkIsPC();
      this.checkCascade();

      if (this.isCascade) {
        this.initCascade();
      }

      //定位 初始位置
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
          fn: () => this.hide(),
        },
        ensureBtn: {
          event: "click",
          fn: () => {
            this.hide();
            if (!this.liHeight) {
              this.liHeight =
                this.mobileSelect.querySelector("li").offsetHeight;
            }
            let tempValue = "";
            for (let i = 0; i < this.wheel.length; i++) {
              i == this.wheel.length - 1
                ? (tempValue += this.getInnerHtml(i))
                : (tempValue += this.getInnerHtml(i) + this.connector);
            }
            if (this.triggerDisplayData) {
              this.trigger.innerHTML = tempValue;
            }
            this.curIndexArr = this.getIndexArr();
            this.curValue = this.getCurValue();
            this.callback(this.curIndexArr, this.curValue);
          },
        },
        trigger: {
          event: "click",
          fn: () => this.show(),
        },
        grayLayer: {
          event: "click",
          fn: () => this.hide(),
        },
        popUp: {
          event: "click",
          fn: (event) => event.stopPropagation(),
        },
        panel: {
          event: [
            "touchstart",
            "touchend",
            "touchmove",
            "mousedown",
            "mousemove",
            "mouseup",
          ],
          fn: (event) => this.touch(event),
        },
      };

      this.registerEvents("add");
      this.fixRowStyle(); // 修正列数
    }

    setTitle(string) {
      this.titleText = string;
      this.mobileSelect.querySelector(".title").innerHTML = this.titleText;
    }

    setStyle(config) {
      if (config.ensureBtnColor) {
        this.ensureBtn.style.color = config.ensureBtnColor;
      }
      if (config.cancelBtnColor) {
        this.cancelBtn.style.color = config.cancelBtnColor;
      }
      if (config.titleColor) {
        this.title = this.mobileSelect.querySelector(".title");
        this.title.style.color = config.titleColor;
      }
      if (config.textColor) {
        this.panel = this.mobileSelect.querySelector(".panel");
        this.panel.style.color = config.textColor;
      }
      if (config.titleBgColor) {
        this.btnBar = this.mobileSelect.querySelector(".btnBar");
        this.btnBar.style.backgroundColor = config.titleBgColor;
      }
      if (config.bgColor) {
        this.panel = this.mobileSelect.querySelector(".panel");
        this.shadowMask = this.mobileSelect.querySelector(".shadowMask");
        this.panel.style.backgroundColor = config.bgColor;
        this.shadowMask.style.background =
          "linear-gradient(to bottom, " +
          config.bgColor +
          ", rgba(255, 255, 255, 0), " +
          config.bgColor +
          ")";
      }
      if (!isNaN(config.maskOpacity)) {
        this.grayMask = this.mobileSelect.querySelector(".grayLayer");
        this.grayMask.style.background =
          "rgba(0, 0, 0, " + config.maskOpacity + ")";
      }
    }

    show() {
      this.mobileSelect.classList.add("mobileSelect-show");
      if (typeof this.onShow === "function") {
        this.onShow(this);
      }
    }

    hide() {
      this.mobileSelect.classList.remove("mobileSelect-show");
      if (typeof this.onHide === "function") {
        this.onHide(this);
      }
    }

    registerEvents(type) {
      // type = 'add' | 'remove'
      for (const [domHandleName, item] of Object.entries(this.eventHandleMap)) {
        if (typeof item.event === "string") {
          this[domHandleName][`${type}EventListener`](item.event, item.fn);
        } else {
          // 数组
          item.event.forEach((eventName) => {
            this[domHandleName][`${type}EventListener`](eventName, item.fn);
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
          // 行
          const id = childs[j][this.keyMap.id];
          const val = childs[j][this.keyMap.value];
          tempHTML += `<li data-id="${id}">${val}</li>`;
        }
      } else {
        for (let j = 0; j < childs.length; j++) {
          // 行
          tempHTML += "<li>" + childs[j] + "</li>";
        }
      }
      return tempHTML;
    }

    renderComponent(wheelsData, cancelBtnText, ensureBtnText) {
      let cancelText = cancelBtnText ? cancelBtnText : "取消";
      let ensureText = ensureBtnText ? ensureBtnText : "确认";
      this.mobileSelect = document.createElement("div");
      this.mobileSelect.className = "mobileSelect";
      this.mobileSelect.innerHTML = `<div class="grayLayer"></div>
        <div class="content">
          <div class="btnBar">
            <div class="fixWidth">
              <div class="cancel">${cancelText}</div>  
              <div class="title"></div>
              <div class="ensure">${ensureText}</div>
            </div>
          </div>
          <div class="panel">
            <div class="fixWidth">
            <div class="wheels"></div>
            <div class="selectLine"></div>
            <div class="shadowMask"></div>
          </div>
        </div>`;
      document.body.appendChild(this.mobileSelect);

      // 根据数据来渲染wheels
      let tempHTML = "";
      for (let i = 0; i < wheelsData.length; i++) {
        //列
        tempHTML += `<div class="wheel"><ul class="selectContainer" data-index="${i}">`;
        tempHTML += this.getOptionsHtmlStr(wheelsData[i].data);
        tempHTML += "</ul></div>";
      }
      this.mobileSelect.querySelector(".wheels").innerHTML = tempHTML;
    }

    // 级联数据滚动时 右侧列数据的变化
    reRenderWheels() {
      const diff = this.wheel.length - this.displayJson.length;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          this.wheels.removeChild(this.wheel[this.wheel.length - 1]);
        }
      }
      for (let i = 0; i < this.displayJson.length; i++) {
        if (this.wheel[i]) {
          this.slider[i].innerHTML = this.getOptionsHtmlStr(
            this.displayJson[i]
          );
        } else {
          let tempWheel = document.createElement("div");
          tempWheel.className = "wheel";
          tempWheel.innerHTML = `<ul class="selectContainer" data-index="${i}">${this.getOptionsHtmlStr(
            this.displayJson[i]
          )}</ul>`;
          this.wheels.appendChild(tempWheel);
        }
      }
    }

    static checkDataType(wheelsData) {
      return typeof wheelsData[0].data[0] === "object";
    }

    checkCascade() {
      if (this.isJsonType) {
        let node = this.wheelsData[0].data;
        for (let i = 0; i < node.length; i++) {
          if (
            this.keyMap.childs in node[i] &&
            node[i][this.keyMap.childs].length > 0
          ) {
            this.isCascade = true;
            this.cascadeJsonData = this.wheelsData[0].data;
            break;
          }
        }
      } else {
        this.isCascade = false;
      }
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
        if (
          this.keyMap.childs in parent &&
          parent[this.keyMap.childs].length > 0
        ) {
          this.displayJson.push(parent[this.keyMap.childs]);
          this.initDeepCount++;
          let nextNode =
            parent[this.keyMap.childs][this.initPosition[this.initDeepCount]];
          if (nextNode) {
            this.initCheckArrDeep(nextNode);
          } else {
            this.checkArrDeep(parent[this.keyMap.childs][0]);
          }
        }
      }
    }

    checkArrDeep(parent) {
      // 检测子节点深度  修改displayJson
      if (!parent) return;
      if (
        this.keyMap.childs in parent &&
        parent[this.keyMap.childs].length > 0
      ) {
        this.displayJson.push(parent[this.keyMap.childs]); // 生成子节点数组
        this.checkArrDeep(parent[this.keyMap.childs][0]); // 检测下一个子节点
      }
    }

    checkRange(index, posIndexArr) {
      let deleteNum = this.displayJson.length - 1 - index;
      for (let i = 0; i < deleteNum; i++) {
        this.displayJson.pop(); // 修改 displayJson
      }
      let resultNode;
      for (let i = 0; i <= index; i++) {
        if (i == 0) resultNode = this.cascadeJsonData[posIndexArr[0]];
        else {
          resultNode = resultNode[this.keyMap.childs][posIndexArr[i]];
        }
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
        this.setCurDistance(_this.initPosition);
        this.fixRowStyle();
      }
    }

    updateWheel(sliderIndex, data) {
      let tempHTML = "";
      if (this.isCascade) {
        console.error(
          "级联格式不支持updateWheel(),请使用updateWheels()更新整个数据源"
        );
        return false;
      } else if (this.isJsonType) {
        for (let j = 0; j < data.length; j++) {
          const id = data[j][this.keyMap.id];
          const value = data[j][this.keyMap.value];
          tempHTML += `<li data-id="${id}">${value}</li>`;
        }
        this.wheelsData[sliderIndex] = { data: data };
      } else {
        for (let j = 0; j < data.length; j++) {
          tempHTML += `<li>${data[j]}</li>`;
        }
        this.wheelsData[sliderIndex] = data;
      }
      this.slider[sliderIndex].innerHTML = tempHTML;
    }

    fixRowStyle() {
      // 自定义列宽度比例
      if (
        this.initColWidth.length &&
        this.initColWidth.length === this.wheel.length
      ) {
        let widthSum = this.initColWidth.reduce((cur, pre) => cur + pre, 0);
        this.initColWidth.forEach((item, index) => {
          this.wheel[index].style.width =
            ((item / widthSum) * 100).toFixed(2) + "%";
        });

        return false;
      }
      let width = (100 / this.wheel.length).toFixed(2);
      for (let i = 0; i < this.wheel.length; i++) {
        this.wheel[i].style.width = width + "%";
      }
    }

    getIndex(distance) {
      return Math.round((2 * this.liHeight - distance) / this.liHeight);
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
          temp.push(
            this.wheelsData[i].data[this.getIndex(this.curDistance[i])]
          );
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
      return 2 * this.liHeight - index * this.liHeight;
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
      return -(this.getIndex(distance) - 2) * this.liHeight;
    }

    movePosition(theSlider, distance) {
      theSlider.style.webkitTransform = "translate3d(0," + distance + "px, 0)";
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
      this.curDistance[index] = parseInt(
        theSlider.style.transform.split(",")[1]
      );
    }

    getInnerHtml(sliderIndex) {
      let lengthOfList =
        this.slider[sliderIndex].getElementsByTagName("li").length;
      let index = this.getIndex(this.curDistance[sliderIndex]);

      if (index >= lengthOfList) {
        index = lengthOfList - 1;
      } else if (index < 0) {
        index = 0;
      }
      return this.slider[sliderIndex].getElementsByTagName("li")[index]
        .innerHTML;
    }

    touch(event) {
      const theSlider = event.path[1]; // dom --> selectContainer
      const index = parseInt(theSlider.getAttribute("data-index"));
      const _this = this;
      event = event || window.event;
      switch (event.type) {
        case "touchstart":
        case "mousedown":
          this.startY = Math.floor(
            event.type === "touchstart"
              ? event.touches[0].clientY
              : event.clientY
          );
          this.oldMoveY = this.startY;
          if (event.type === "mousedown") {
            this.clickStatus = true;
          }
          break;

        case "touchend":
        case "mouseup":
          this.moveEndY = Math.floor(
            event.type === "touchend"
              ? event.changedTouches[0].clientY
              : event.clientY
          );
          this.offsetSum = this.moveEndY - this.startY;
          this.oversizeBorder =
            -(theSlider.getElementsByTagName("li").length - 3) * this.liHeight;

          if (this.offsetSum == 0) {
            // offsetSum为0, 相当于点击事件
            // 0 1 [2] 3 4
            let clickOffetNum = Math.floor(
              (document.documentElement.clientHeight - this.moveEndY) / 40
            );
            if (clickOffetNum != 2) {
              let offset = clickOffetNum - 2;
              let newDistance =
                this.curDistance[index] + offset * this.liHeight;
              if (
                newDistance <= 2 * this.liHeight &&
                newDistance >= this.oversizeBorder
              ) {
                this.curDistance[index] = newDistance;
                this.movePosition(theSlider, this.curDistance[index]);
                this.transitionEnd(this.getIndexArr(), this.getCurValue());
              }
            }
          } else {
            // 修正位置
            this.updateCurDistance(theSlider, index);
            this.curDistance[index] = this.fixPosition(this.curDistance[index]);
            this.movePosition(theSlider, this.curDistance[index]);

            // 反弹
            if (this.curDistance[index] + this.offsetSum > 2 * this.liHeight) {
              this.curDistance[index] = 2 * this.liHeight;
              setTimeout(function () {
                _this.movePosition(theSlider, _this.curDistance[index]);
              }, 100);
            } else if (
              this.curDistance[index] + this.offsetSum <
              this.oversizeBorder
            ) {
              this.curDistance[index] = this.oversizeBorder;
              setTimeout(function () {
                _this.movePosition(theSlider, _this.curDistance[index]);
              }, 100);
            }
            this.transitionEnd(this.getIndexArr(), this.getCurValue());
          }

          if (event.type === "mouseup") {
            this.clickStatus = false;
          }
          if (this.isCascade) {
            this.checkRange(index, this.getIndexArr());
          }

          break;

        case "touchmove":
        case "mousemove":
          event.preventDefault();
          if (event.type === "mousemove" && !this.clickStatus) break;
          this.moveY = Math.floor(
            event.type === "touchmove"
              ? event.touches[0].clientY
              : event.clientY
          );
          this.offset = this.moveY - this.oldMoveY;
          this.updateCurDistance(theSlider, index);
          this.curDistance[index] = this.curDistance[index] + this.offset;
          this.movePosition(theSlider, this.curDistance[index]);
          this.oldMoveY = this.moveY;
          break;
      }
    }
  }

  if (typeof exports == "object") {
    module.exports = MobileSelect;
  } else if (typeof define == "function" && define.amd) {
    define([], function () {
      return MobileSelect;
    });
  } else {
    window.MobileSelect = MobileSelect;
  }
})();
