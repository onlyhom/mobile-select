"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var __defProp = Object.defineProperty;

var __defNormalProp = function __defNormalProp(obj, key, value) {
  return key in obj ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: value
  }) : obj[key] = value;
};

var __publicField = function __publicField(obj, key, value) {
  __defNormalProp(obj, _typeof(key) !== "symbol" ? key + "" : key, value);

  return value;
};

var MobileSelect = function () {
  "use strict";

  var MobileSelect2 = /*#__PURE__*/function () {
    function MobileSelect2(config) {
      _classCallCheck(this, MobileSelect2);

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
      this.keyMap = {
        id: "id",
        value: "value",
        childs: "childs"
      };
      this.initPosition = config.position || [];
      this.initColWidth = config.colWidth || [];
      this.titleText = config.title || "";
      this.connector = config.connector || " ";
      this.config = config;
      this.init(config);
    }

    _createClass(MobileSelect2, [{
      key: "init",
      value: function init(config) {
        var _this = this;

        this.keyMap = config.keyMap ? config.keyMap : {
          id: "id",
          value: "value",
          childs: "childs"
        };
        this.isJsonType = MobileSelect2.checkDataType(this.wheelsData);
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
        this.isPC = MobileSelect2.checkIsPC();
        this.isCascade = this.checkCascade();

        if (this.isCascade) {
          this.initCascade();
        }

        if (config.initValue) {
          this.initPosition = this.getPositionByValue();
        }

        if (this.initPosition.length < this.slider.length) {
          var diff = this.slider.length - this.initPosition.length;

          for (var i = 0; i < diff; i++) {
            this.initPosition.push(0);
          }
        }

        this.setCurDistance(this.initPosition);
        this.eventHandleMap = {
          cancelBtn: {
            event: "click",
            fn: function fn() {
              var _a, _b, _c, _d;

              _this.hide();

              (_b = (_a = _this.config).cancel) == null ? void 0 : _b.call(_a, _this.curIndexArr, _this.curValue);
              (_d = (_c = _this.config).onCancel) == null ? void 0 : _d.call(_c, _this.curIndexArr, _this.curValue);
            }
          },
          ensureBtn: {
            event: "click",
            fn: function fn() {
              var _a, _b, _c, _d;

              _this.hide();

              if (!_this.optionHeight) {
                _this.optionHeight = _this.mobileSelect.querySelector("li").offsetHeight;
              }

              var tempValue = "";

              for (var _i = 0; _i < _this.wheel.length; _i++) {
                _i == _this.wheel.length - 1 ? tempValue += _this.getInnerHtml(_i) : tempValue += _this.getInnerHtml(_i) + _this.connector;
              }

              if (config.triggerDisplayData == void 0 || config.triggerDisplayData) {
                _this.trigger.innerHTML = tempValue;
              }

              _this.curIndexArr = _this.getIndexArr();
              _this.curValue = _this.getCurValue();
              (_b = (_a = _this.config).callback) == null ? void 0 : _b.call(_a, _this.curIndexArr, _this.curValue);
              (_d = (_c = _this.config).onChange) == null ? void 0 : _d.call(_c, _this.curIndexArr, _this.curValue);
            }
          },
          trigger: {
            event: "click",
            fn: function fn() {
              _this.show();
            }
          },
          grayLayer: {
            event: "click",
            fn: function fn() {
              return _this.hide();
            }
          },
          popUp: {
            event: "click",
            fn: function fn(event) {
              return event.stopPropagation();
            }
          },
          panel: {
            event: ["touchstart", "touchend", "touchmove"],
            fn: function fn(event) {
              return _this.touch(event);
            }
          }
        };

        if (this.isPC) {
          this.eventHandleMap.panel.event = ["mousedown", "mousemove", "mouseup"];
        }

        this.registerEvents("add");
        this.fixRowStyle();
      }
    }, {
      key: "getPositionByValue",
      value: function getPositionByValue() {
        var _this2 = this;

        var _a;

        var valueArr = this.config.initValue.split(this.connector);

        if (this.isJsonType) {
          var childList = (_a = this.wheelsData[0]) == null ? void 0 : _a.data;
          return valueArr.reduce(function (result, cur) {
            var _a2;

            var posIndex = childList == null ? void 0 : childList.findIndex(function (item) {
              return item[_this2.keyMap.value] == cur;
            });
            result.push(posIndex < 0 ? 0 : posIndex);
            childList = (_a2 = childList[posIndex]) == null ? void 0 : _a2[_this2.keyMap.childs];
            return result;
          }, []);
        }

        return valueArr.reduce(function (result, cur, index) {
          var _a2, _b;

          var posIndex = (_b = (_a2 = _this2.wheelsData[index]) == null ? void 0 : _a2.data) == null ? void 0 : _b.findIndex(function (item) {
            return item == cur;
          });
          result.push(posIndex < 0 ? 0 : posIndex);
          return result;
        }, []);
      }
    }, {
      key: "setTitle",
      value: function setTitle(title) {
        this.mobileSelect.querySelector(".ms-title").innerHTML = title;
      }
    }, {
      key: "setStyle",
      value: function setStyle(config) {
        if (config.ensureBtnColor) {
          this.ensureBtn.style.color = config.ensureBtnColor;
        }

        if (config.cancelBtnColor) {
          this.cancelBtn.style.color = config.cancelBtnColor;
        }

        if (config.titleColor) {
          var titleDom = this.mobileSelect.querySelector(".ms-title");
          titleDom.style.color = config.titleColor;
        }

        if (config.textColor) {
          this.panel = this.mobileSelect.querySelector(".ms-panel");
          this.panel.style.color = config.textColor;
        }

        if (config.titleBgColor) {
          var btnBar = this.mobileSelect.querySelector(".ms-btn-bar");
          btnBar.style.backgroundColor = config.titleBgColor;
        }

        if (config.bgColor) {
          this.panel = this.mobileSelect.querySelector(".ms-panel");
          var shadowMask = this.mobileSelect.querySelector(".ms-shadow-mask");
          this.panel.style.backgroundColor = config.bgColor;
          shadowMask.style.background = "linear-gradient(to bottom, " + config.bgColor + ", rgba(255, 255, 255, 0), " + config.bgColor + ")";
        }

        if (typeof config.maskOpacity === "number") {
          var grayMask = this.mobileSelect.querySelector(".ms-gray-layer");
          grayMask.style.background = "rgba(0, 0, 0, " + config.maskOpacity + ")";
        }
      }
    }, {
      key: "show",
      value: function show() {
        var _a, _b;

        this.mobileSelect.classList.add("ms-show");

        if (typeof this.config.onShow === "function") {
          (_b = (_a = this.config).onShow) == null ? void 0 : _b.call(_a);
        }
      }
    }, {
      key: "hide",
      value: function hide() {
        var _a, _b;

        this.mobileSelect.classList.remove("ms-show");

        if (typeof this.config.onHide === "function") {
          (_b = (_a = this.config).onHide) == null ? void 0 : _b.call(_a);
        }
      }
    }, {
      key: "registerEvents",
      value: function registerEvents(type) {
        var _this3 = this;

        var _loop = function _loop() {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
              domName = _Object$entries$_i[0],
              item = _Object$entries$_i[1];

          if (typeof item.event === "string") {
            _this3[domName]["".concat(type, "EventListener")](item.event, item.fn);
          } else {
            item.event.forEach(function (eventName) {
              _this3[domName]["".concat(type, "EventListener")](eventName, item.fn);
            });
          }
        };

        for (var _i2 = 0, _Object$entries = Object.entries(this.eventHandleMap); _i2 < _Object$entries.length; _i2++) {
          _loop();
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.registerEvents("remove");
        this.mobileSelect.parentNode.removeChild(this.mobileSelect);
      }
    }, {
      key: "getOptionsHtmlStr",
      value: function getOptionsHtmlStr(childs) {
        var tempHTML = "";

        if (this.isJsonType) {
          for (var j = 0; j < childs.length; j++) {
            var id = childs[j][this.keyMap.id];
            var val = childs[j][this.keyMap.value];
            tempHTML += "<li data-id=\"".concat(id, "\">").concat(val, "</li>");
          }
        } else {
          for (var _j = 0; _j < childs.length; _j++) {
            tempHTML += "<li>" + childs[_j] + "</li>";
          }
        }

        return tempHTML;
      }
    }, {
      key: "renderComponent",
      value: function renderComponent(wheelsData) {
        this.mobileSelect = document.createElement("div");
        this.mobileSelect.className = "ms-mobile-select";
        this.mobileSelect.innerHTML = "<div class=\"ms-gray-layer\"></div>\n        <div class=\"ms-content\">\n          <div class=\"ms-btn-bar\">\n            <div class=\"ms-fix-width\">\n              <div class=\"ms-cancel\">".concat(this.config.cancelBtnText || "\u53D6\u6D88", "</div>  \n              <div class=\"ms-title\">").concat(this.config.title || "", "</div>\n              <div class=\"ms-ensure\">").concat(this.config.ensureBtnText || "\u786E\u8BA4", "</div>\n            </div>\n          </div>\n          <div class=\"ms-panel\">\n            <div class=\"ms-fix-width\">\n            <div class=\"ms-wheels\"></div>\n            <div class=\"ms-select-line\"></div>\n            <div class=\"ms-shadow-mask\"></div>\n          </div>\n        </div>");
        document.body.appendChild(this.mobileSelect);
        var tempHTML = "";

        for (var i = 0; i < wheelsData.length; i++) {
          tempHTML += "<div class=\"ms-wheel\"><ul class=\"ms-select-container\" data-index=\"".concat(i, "\">");
          tempHTML += this.getOptionsHtmlStr(wheelsData[i].data);
          tempHTML += "</ul></div>";
        }

        this.mobileSelect.querySelector(".ms-wheels").innerHTML = tempHTML;
      }
    }, {
      key: "reRenderWheels",
      value: function reRenderWheels() {
        var diff = this.wheel.length - this.displayJson.length;

        if (diff > 0) {
          for (var i = 0; i < diff; i++) {
            this.wheels.removeChild(this.wheel[this.wheel.length - 1]);
          }
        }

        for (var _i3 = 0; _i3 < this.displayJson.length; _i3++) {
          if (this.wheel[_i3]) {
            this.slider[_i3].innerHTML = this.getOptionsHtmlStr(this.displayJson[_i3]);
          } else {
            var tempWheel = document.createElement("div");
            tempWheel.className = "ms-wheel";
            tempWheel.innerHTML = "<ul class=\"ms-select-container\" data-index=\"".concat(_i3, "\">").concat(this.getOptionsHtmlStr(this.displayJson[_i3]), "</ul>");
            this.wheels.appendChild(tempWheel);
          }
        }
      }
    }, {
      key: "checkCascade",
      value: function checkCascade() {
        var _a;

        if (this.isJsonType) {
          var node = this.wheelsData[0].data;

          for (var i = 0; i < node.length; i++) {
            if (this.keyMap.childs in node[i] && ((_a = node[i][this.keyMap.childs]) == null ? void 0 : _a.length) > 0) {
              this.cascadeJsonData = this.wheelsData[0].data;
              return true;
            }
          }
        }

        return false;
      }
    }, {
      key: "initCascade",
      value: function initCascade() {
        this.displayJson.push(this.cascadeJsonData);

        if (this.initPosition.length > 0) {
          this.initDeepCount = 0;
          this.initCheckArrDeep(this.cascadeJsonData[this.initPosition[0]]);
        } else {
          this.checkArrDeep(this.cascadeJsonData[0]);
        }

        this.reRenderWheels();
      }
    }, {
      key: "initCheckArrDeep",
      value: function initCheckArrDeep(parent) {
        if (parent) {
          if (this.keyMap.childs in parent && parent[this.keyMap.childs].length > 0) {
            this.displayJson.push(parent[this.keyMap.childs]);
            this.initDeepCount++;
            var nextNode = parent[this.keyMap.childs][this.initPosition[this.initDeepCount]];

            if (nextNode) {
              this.initCheckArrDeep(nextNode);
            } else {
              this.checkArrDeep(parent[this.keyMap.childs][0]);
            }
          }
        }
      }
    }, {
      key: "checkArrDeep",
      value: function checkArrDeep(parent) {
        if (!parent) return;

        if (this.keyMap.childs in parent && parent[this.keyMap.childs].length > 0) {
          this.displayJson.push(parent[this.keyMap.childs]);
          this.checkArrDeep(parent[this.keyMap.childs][0]);
        }
      }
    }, {
      key: "checkRange",
      value: function checkRange(index, posIndexArr) {
        var deleteNum = this.displayJson.length - 1 - index;

        for (var i = 0; i < deleteNum; i++) {
          this.displayJson.pop();
        }

        var resultNode;

        for (var _i4 = 0; _i4 <= index; _i4++) {
          resultNode = _i4 == 0 ? this.cascadeJsonData[posIndexArr[0]] : resultNode[this.keyMap.childs][posIndexArr[_i4]];
        }

        this.checkArrDeep(resultNode);
        this.reRenderWheels();
        this.fixRowStyle();
        this.setCurDistance(this.resetPosition(index, posIndexArr));
      }
    }, {
      key: "resetPosition",
      value: function resetPosition(index, posIndexArr) {
        var tempPosArr = posIndexArr;
        var tempCount;

        if (this.slider.length > posIndexArr.length) {
          tempCount = this.slider.length - posIndexArr.length;

          for (var i = 0; i < tempCount; i++) {
            tempPosArr.push(0);
          }
        } else if (this.slider.length < posIndexArr.length) {
          tempCount = posIndexArr.length - this.slider.length;

          for (var _i5 = 0; _i5 < tempCount; _i5++) {
            tempPosArr.pop();
          }
        }

        for (var _i6 = index + 1; _i6 < tempPosArr.length; _i6++) {
          tempPosArr[_i6] = 0;
        }

        return tempPosArr;
      }
    }, {
      key: "updateWheels",
      value: function updateWheels(data) {
        if (this.isCascade) {
          this.cascadeJsonData = data;
          this.displayJson = [];
          this.initCascade();

          if (this.initPosition.length < this.slider.length) {
            var diff = this.slider.length - this.initPosition.length;

            for (var i = 0; i < diff; i++) {
              this.initPosition.push(0);
            }
          }

          this.setCurDistance(this.initPosition);
          this.fixRowStyle();
        }
      }
    }, {
      key: "updateWheel",
      value: function updateWheel(sliderIndex, data) {
        var tempHTML = "";

        if (this.isCascade) {
          console.error("\u7EA7\u8054\u683C\u5F0F\u4E0D\u652F\u6301updateWheel(),\u8BF7\u4F7F\u7528updateWheels()\u66F4\u65B0\u6574\u4E2A\u6570\u636E\u6E90");
          return;
        }

        tempHTML += this.getOptionsHtmlStr(data);
        this.wheelsData[sliderIndex] = this.isJsonType ? {
          data: data
        } : data;
        this.slider[sliderIndex].innerHTML = tempHTML;
      }
    }, {
      key: "fixRowStyle",
      value: function fixRowStyle() {
        var _this4 = this;

        if (this.initColWidth.length && this.initColWidth.length === this.wheel.length) {
          var widthSum = this.initColWidth.reduce(function (cur, pre) {
            return cur + pre;
          }, 0);
          this.initColWidth.forEach(function (item, index) {
            _this4.wheel[index].style.width = (item / widthSum * 100).toFixed(2) + "%";
          });
          return;
        }

        var width = (100 / this.wheel.length).toFixed(2);

        for (var i = 0; i < this.wheel.length; i++) {
          this.wheel[i].style.width = width + "%";
        }
      }
    }, {
      key: "getIndex",
      value: function getIndex(distance) {
        return Math.round((2 * this.optionHeight - distance) / this.optionHeight);
      }
    }, {
      key: "getIndexArr",
      value: function getIndexArr() {
        var temp = [];

        for (var i = 0; i < this.curDistance.length; i++) {
          temp.push(this.getIndex(this.curDistance[i]));
        }

        return temp;
      }
    }, {
      key: "getCurValue",
      value: function getCurValue() {
        var temp = [];
        var positionArr = this.getIndexArr();

        if (this.isCascade) {
          for (var i = 0; i < this.wheel.length; i++) {
            temp.push(this.displayJson[i][positionArr[i]]);
          }
        } else if (this.isJsonType) {
          for (var _i7 = 0; _i7 < this.curDistance.length; _i7++) {
            temp.push(this.wheelsData[_i7].data[this.getIndex(this.curDistance[_i7])]);
          }
        } else {
          for (var _i8 = 0; _i8 < this.curDistance.length; _i8++) {
            temp.push(this.getInnerHtml(_i8));
          }
        }

        return temp;
      }
    }, {
      key: "getValue",
      value: function getValue() {
        return this.curValue;
      }
    }, {
      key: "calcDistance",
      value: function calcDistance(index) {
        return 2 * this.optionHeight - index * this.optionHeight;
      }
    }, {
      key: "setCurDistance",
      value: function setCurDistance(indexArr) {
        var temp = [];

        for (var i = 0; i < this.slider.length; i++) {
          temp.push(this.calcDistance(indexArr[i]));
          this.movePosition(this.slider[i], temp[i]);
        }

        this.curDistance = temp;
      }
    }, {
      key: "fixPosition",
      value: function fixPosition(distance) {
        return -(this.getIndex(distance) - 2) * this.optionHeight;
      }
    }, {
      key: "movePosition",
      value: function movePosition(theSlider, distance) {
        theSlider.style.transform = "translate3d(0," + distance + "px, 0)";
      }
    }, {
      key: "locatePosition",
      value: function locatePosition(index, posIndex) {
        this.curDistance[index] = this.calcDistance(posIndex);
        this.movePosition(this.slider[index], this.curDistance[index]);

        if (this.isCascade) {
          this.checkRange(index, this.getIndexArr());
        }
      }
    }, {
      key: "updateCurDistance",
      value: function updateCurDistance(theSlider, index) {
        this.curDistance[index] = parseInt(theSlider.style.transform.split(",")[1]);
      }
    }, {
      key: "getInnerHtml",
      value: function getInnerHtml(sliderIndex) {
        var lengthOfList = this.slider[sliderIndex].getElementsByTagName("li").length;
        var index = this.getIndex(this.curDistance[sliderIndex]);

        if (index >= lengthOfList) {
          index = lengthOfList - 1;
        } else if (index < 0) {
          index = 0;
        }

        return this.slider[sliderIndex].getElementsByTagName("li")[index].innerHTML;
      }
    }, {
      key: "touch",
      value: function touch(event) {
        var _this5 = this;

        var _a, _b, _c, _d, _e, _f, _g, _h;

        var path = event.composedPath && event.composedPath();
        var theSlider = path[1];
        var index = parseInt(theSlider.getAttribute("data-index") || "0");

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
              var clickOffetNum = Math.floor((document.documentElement.clientHeight - this.moveEndY) / 40);

              if (clickOffetNum != 2) {
                var tempOffset = clickOffetNum - 2;
                var newDistance = this.curDistance[index] + tempOffset * this.optionHeight;

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
                setTimeout(function () {
                  _this5.movePosition(theSlider, _this5.curDistance[index]);
                }, 100);
              } else if (this.curDistance[index] + this.offsetSum < this.oversizeBorder) {
                this.curDistance[index] = this.oversizeBorder;
                setTimeout(function () {
                  _this5.movePosition(theSlider, _this5.curDistance[index]);
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
            if (event.type === "mousemove" && !this.enableClickStatus) break;
            this.moveY = Math.floor(event instanceof TouchEvent ? event.touches[0].clientY : event.clientY);
            this.offsetY = this.moveY - this.preMoveY;
            this.updateCurDistance(theSlider, index);
            this.curDistance[index] = this.curDistance[index] + this.offsetY;
            this.movePosition(theSlider, this.curDistance[index]);
            this.preMoveY = this.moveY;
            break;
        }
      }
    }], [{
      key: "checkIsPC",
      value: function checkIsPC() {
        return !Boolean(navigator.userAgent.toLowerCase().match(/ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/));
      }
    }, {
      key: "checkDataType",
      value: function checkDataType(wheelsData) {
        var _a, _b;

        return _typeof((_b = (_a = wheelsData[0]) == null ? void 0 : _a.data) == null ? void 0 : _b[0]) === "object";
      }
    }]);

    return MobileSelect2;
  }();

  return MobileSelect2;
}();
