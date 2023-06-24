/*
* mobile-select v1.4.0
* Homepage: https://github.com/onlyhom/mobile-select
* Released under the MIT License.
* (c) 2017-present
*/
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

var MobileSelect = function () {
  "use strict";

  var v = Object.defineProperty;

  var S = function S(m, a, r) {
    return a in m ? v(m, a, {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: r
    }) : m[a] = r;
  };

  var o = function o(m, a, r) {
    return S(m, _typeof(a) != "symbol" ? a + "" : a, r), r;
  };

  function m() {
    return !navigator.userAgent.toLowerCase().match(/ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/);
  }

  function a(C) {
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    return (Math.floor(C * 100) / 100).toFixed(t);
  }

  var c = /*#__PURE__*/function () {
    function c(t) {
      _classCallCheck(this, c);

      o(this, "mobileSelect");
      o(this, "trigger");
      o(this, "wheelList");
      o(this, "sliderList");
      o(this, "wheelsContain");
      o(this, "panel");
      o(this, "ensureBtn");
      o(this, "cancelBtn");
      o(this, "grayLayer");
      o(this, "popUp");
      o(this, "initPosition");
      o(this, "initColWidth");
      o(this, "wheelsData");
      o(this, "displayJson");
      o(this, "curValue");
      o(this, "curIndexArr");
      o(this, "isCascade");
      o(this, "isJsonType");
      o(this, "startY");
      o(this, "moveEndY");
      o(this, "moveY");
      o(this, "preMoveY");
      o(this, "offsetY");
      o(this, "offsetSum");
      o(this, "oversizeBorder");
      o(this, "enableClickStatus");
      o(this, "optionHeight");
      o(this, "curDistance");
      o(this, "cascadeJsonData");
      o(this, "eventHandleMap");
      o(this, "initDeepCount");
      o(this, "config");
      !c.checkRequiredConfig(t) || (this.config = Object.assign({}, c.defaultConfig, t), this.wheelsData = t.wheels, this.isJsonType = !1, this.cascadeJsonData = [], this.displayJson = [], this.curValue = [], this.curIndexArr = [], this.isCascade = !1, this.startY, this.moveEndY, this.moveY, this.preMoveY, this.offsetY = 0, this.offsetSum = 0, this.oversizeBorder, this.curDistance = [], this.enableClickStatus = !1, this.optionHeight = 0, this.initPosition = t.position || [], this.initColWidth = t.colWidth || [], this.init());
    }

    _createClass(c, [{
      key: "init",
      value: function init() {
        var _this = this;

        if (!this.checkTriggerAvailable()) return;
        var t = this.config;

        if (this.isJsonType = c.checkDataType(this.wheelsData), this.renderComponent(this.wheelsData), this.wheelList = this.mobileSelect.getElementsByClassName("ms-wheel"), this.sliderList = this.mobileSelect.getElementsByClassName("ms-select-container"), this.panel = this.mobileSelect.querySelector(".ms-panel"), this.wheelsContain = this.mobileSelect.querySelector(".ms-wheels"), this.ensureBtn = this.mobileSelect.querySelector(".ms-ensure"), this.cancelBtn = this.mobileSelect.querySelector(".ms-cancel"), this.grayLayer = this.mobileSelect.querySelector(".ms-gray-layer"), this.popUp = this.mobileSelect.querySelector(".ms-content"), this.optionHeight = this.mobileSelect.querySelector("li").offsetHeight, t.initValue && this.setTriggerInnerText(t.initValue), this.setStyle(t), this.isCascade = this.checkCascade(), this.isCascade && this.initCascade(), t.initValue && (this.initPosition = this.getPositionByInitValue()), this.initPosition.length < this.sliderList.length) {
          var e = this.sliderList.length - this.initPosition.length;

          for (var i = 0; i < e; i++) {
            this.initPosition.push(0);
          }
        }

        this.isCascade ? this.initPosition.forEach(function (e, i) {
          _this.checkRange(i, _this.initPosition);
        }) : this.setCurDistance(this.initPosition), this.eventHandleMap = {
          cancelBtn: {
            event: "click",
            fn: function fn() {
              var e, i, s, n;
              _this.hide(), (i = (e = _this.config).cancel) == null || i.call(e, _this.curIndexArr, _this.curValue, _this), (n = (s = _this.config).onCancel) == null || n.call(s, _this.curValue, _this.curIndexArr, _this);
            }
          },
          ensureBtn: {
            event: "click",
            fn: function fn() {
              var e, i, s, n;
              _this.hide(), _this.optionHeight || (_this.optionHeight = _this.mobileSelect.querySelector("li").offsetHeight), _this.setTriggerInnerText(_this.getConnectedString()), _this.curIndexArr = _this.getIndexArr(), _this.curValue = _this.getCurValue(), (i = (e = _this.config).callback) == null || i.call(e, _this.curIndexArr, _this.curValue, _this), (n = (s = _this.config).onChange) == null || n.call(s, _this.curValue, _this.curIndexArr, _this);
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
            fn: function fn(e) {
              return e.stopPropagation();
            }
          },
          panel: {
            event: ["touchstart", "touchend", "touchmove"],
            fn: function fn(e) {
              return _this.touch(e);
            }
          }
        }, m() && (this.eventHandleMap.panel.event = ["mousedown", "mousemove", "mouseup"]), this.registerEvents("add"), this.fixRowStyle(), t.autoFocus && this.show();
      }
    }, {
      key: "checkTriggerAvailable",
      value: function checkTriggerAvailable() {
        var t = this.config;
        return this.trigger = t.trigger instanceof HTMLElement ? t.trigger : document.querySelector(t.trigger), this.trigger ? !0 : (c.log("error", "trigger HTMLElement does not found on your document."), !1);
      }
    }, {
      key: "getPositionByInitValue",
      value: function getPositionByInitValue() {
        var _this2 = this;

        var n;
        var _this$config = this.config,
            t = _this$config.keyMap,
            e = _this$config.connector,
            i = _this$config.initValue,
            s = (i == null ? void 0 : i.split(e)) || [];

        if (this.isJsonType) {
          var h = (n = this.wheelsData[0]) == null ? void 0 : n.data;
          return s.reduce(function (l, u) {
            var f;
            var d = h == null ? void 0 : h.findIndex(function (g) {
              return g[t.value] == u;
            });
            return l.push(d < 0 ? 0 : d), h = (f = h[d]) == null ? void 0 : f[t.childs], l;
          }, []);
        }

        return s.reduce(function (h, l, u) {
          var f, g;
          var d = (g = (f = _this2.wheelsData[u]) == null ? void 0 : f.data) == null ? void 0 : g.findIndex(function (p) {
            return p == l;
          });
          return h.push(d < 0 ? 0 : d), h;
        }, []);
      }
    }, {
      key: "getConnectedString",
      value: function getConnectedString() {
        var t = "";

        for (var e = 0; e < this.wheelList.length; e++) {
          e == this.wheelList.length - 1 ? t += this.getInnerText(e) : t += this.getInnerText(e) + this.config.connector;
        }

        return t;
      }
    }, {
      key: "setTriggerInnerText",
      value: function setTriggerInnerText(t) {
        this.config.triggerDisplayValue && (this.trigger.textContent = t);
      }
    }, {
      key: "setValue",
      value: function setValue(t) {
        var _this3 = this;

        if (!t || !t.length) return;

        if (this.isJsonType && _typeof(t[0]) != "object" || !this.isJsonType && _typeof(t[0]) == "object") {
          c.log("error", "The setValue() input format should be same with getValue(), like: ".concat(JSON.stringify(this.getValue())));
          return;
        }

        var e = this.config.keyMap;
        t.forEach(function (i, s) {
          var l;
          var n = _this3.isCascade ? _this3.displayJson[s] : (l = _this3.wheelsData[s]) == null ? void 0 : l.data,
              h = n == null ? void 0 : n.findIndex(function (u) {
            return _this3.isJsonType ? i[e.id] == u[e.id] || i[e.value] == u[e.value] : i == u;
          });

          _this3.locatePosition(s, h);
        }), this.setTriggerInnerText(this.getConnectedString());
      }
    }, {
      key: "setTitle",
      value: function setTitle(t) {
        this.mobileSelect.querySelector(".ms-title").innerHTML = t;
      }
    }, {
      key: "setStyle",
      value: function setStyle(t) {
        if (t.ensureBtnColor && (this.ensureBtn.style.color = t.ensureBtnColor), t.cancelBtnColor && (this.cancelBtn.style.color = t.cancelBtnColor), t.titleColor) {
          var e = this.mobileSelect.querySelector(".ms-title");
          e.style.color = t.titleColor;
        }

        if (t.textColor && (this.panel = this.mobileSelect.querySelector(".ms-panel"), this.panel.style.color = t.textColor), t.titleBgColor) {
          var _e = this.mobileSelect.querySelector(".ms-btn-bar");

          _e.style.backgroundColor = t.titleBgColor;
        }

        if (t.bgColor) {
          this.panel = this.mobileSelect.querySelector(".ms-panel");

          var _e2 = this.mobileSelect.querySelector(".ms-shadow-mask");

          this.panel.style.backgroundColor = t.bgColor, _e2.style.background = "linear-gradient(to bottom, " + t.bgColor + ", rgba(255, 255, 255, 0), " + t.bgColor + ")";
        }

        if (typeof t.maskOpacity == "number") {
          var _e3 = this.mobileSelect.querySelector(".ms-gray-layer");

          _e3.style.background = "rgba(0, 0, 0, " + t.maskOpacity + ")";
        }
      }
    }, {
      key: "show",
      value: function show() {
        var t, e, i;
        this.mobileSelect.classList.add("ms-show"), (t = document.querySelector("body")) == null || t.classList.add("ms-show"), typeof this.config.onShow == "function" && ((i = (e = this.config).onShow) == null || i.call(e, this.curValue, this.curIndexArr, this));
      }
    }, {
      key: "hide",
      value: function hide() {
        var t, e, i;
        this.mobileSelect.classList.remove("ms-show"), (t = document.querySelector("body")) == null || t.classList.remove("ms-show"), typeof this.config.onHide == "function" && ((i = (e = this.config).onHide) == null || i.call(e, this.curValue, this.curIndexArr, this));
      }
    }, {
      key: "registerEvents",
      value: function registerEvents(t) {
        var _this4 = this;

        var _loop = function _loop() {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              e = _Object$entries$_i[0],
              i = _Object$entries$_i[1];

          typeof i.event == "string" ? _this4[e]["".concat(t, "EventListener")](i.event, i.fn, {
            passive: !1
          }) : i.event.forEach(function (s) {
            _this4[e]["".concat(t, "EventListener")](s, i.fn, {
              passive: !1
            });
          });
        };

        for (var _i = 0, _Object$entries = Object.entries(this.eventHandleMap); _i < _Object$entries.length; _i++) {
          _loop();
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var t, e;
        this.registerEvents("remove"), (e = (t = this.mobileSelect) == null ? void 0 : t.parentNode) == null || e.removeChild(this.mobileSelect);
      }
    }, {
      key: "getOptionsHtmlStr",
      value: function getOptionsHtmlStr(t) {
        var e = this.config.keyMap;
        var i = "";
        if (this.isJsonType) for (var s = 0; s < t.length; s++) {
          var n = t[s][e.id],
              h = t[s][e.value];
          i += "<li data-id=\"".concat(n, "\">").concat(h, "</li>");
        } else for (var _s2 = 0; _s2 < t.length; _s2++) {
          i += "<li>" + t[_s2] + "</li>";
        }
        return i;
      }
    }, {
      key: "renderComponent",
      value: function renderComponent(t) {
        this.mobileSelect = document.createElement("div"), this.mobileSelect.className = "ms-mobile-select", this.mobileSelect.innerHTML = "<div class=\"ms-gray-layer\"></div>\n        <div class=\"ms-content\">\n          <div class=\"ms-btn-bar\">\n            <div class=\"ms-fix-width\">\n              <div class=\"ms-cancel\">".concat(this.config.cancelBtnText, "</div>  \n              <div class=\"ms-title\">").concat(this.config.title || "", "</div>\n              <div class=\"ms-ensure\">").concat(this.config.ensureBtnText, "</div>\n            </div>\n          </div>\n          <div class=\"ms-panel\">\n            <div class=\"ms-fix-width\">\n            <div class=\"ms-wheels\"></div>\n            <div class=\"ms-select-line\"></div>\n            <div class=\"ms-shadow-mask\"></div>\n          </div>\n        </div>"), document.body.appendChild(this.mobileSelect);
        var e = "";

        for (var i = 0; i < t.length; i++) {
          e += "<div class=\"ms-wheel\" data-index=\"".concat(i, "\"><ul class=\"ms-select-container\">"), e += this.getOptionsHtmlStr(t[i].data), e += "</ul></div>";
        }

        this.mobileSelect.querySelector(".ms-wheels").innerHTML = e;
      }
    }, {
      key: "reRenderWheels",
      value: function reRenderWheels() {
        var t = this.wheelList.length - this.displayJson.length;
        if (t > 0) for (var e = 0; e < t; e++) {
          this.wheelsContain.removeChild(this.wheelList[this.wheelList.length - 1]);
        }

        for (var _e4 = 0; _e4 < this.displayJson.length; _e4++) {
          if (this.wheelList[_e4]) this.sliderList[_e4].innerHTML = this.getOptionsHtmlStr(this.displayJson[_e4]);else {
            var i = document.createElement("div");
            i.className = "ms-wheel", i.innerHTML = "<ul class=\"ms-select-container\">".concat(this.getOptionsHtmlStr(this.displayJson[_e4]), "</ul>"), i.setAttribute("data-index", _e4.toString()), this.wheelsContain.appendChild(i);
          }
        }
      }
    }, {
      key: "checkCascade",
      value: function checkCascade() {
        var e;
        var t = this.config.keyMap;

        if (this.isJsonType) {
          var i = this.wheelsData[0].data;

          for (var s = 0; s < i.length; s++) {
            if (t.childs in i[s] && ((e = i[s][t.childs]) == null ? void 0 : e.length) > 0) return this.cascadeJsonData = this.wheelsData[0].data, !0;
          }
        }

        return !1;
      }
    }, {
      key: "initCascade",
      value: function initCascade() {
        this.displayJson.push(this.cascadeJsonData), this.initPosition.length > 0 ? (this.initDeepCount = 0, this.initCheckArrDeep(this.cascadeJsonData[this.initPosition[0]])) : this.checkArrDeep(this.cascadeJsonData[0]), this.reRenderWheels();
      }
    }, {
      key: "initCheckArrDeep",
      value: function initCheckArrDeep(t) {
        if (t) {
          var e = this.config.keyMap;

          if (e.childs in t && t[e.childs].length > 0) {
            this.displayJson.push(t[e.childs]), this.initDeepCount++;
            var i = t[e.childs][this.initPosition[this.initDeepCount]];
            i ? this.initCheckArrDeep(i) : this.checkArrDeep(t[e.childs][0]);
          }
        }
      }
    }, {
      key: "checkArrDeep",
      value: function checkArrDeep(t) {
        if (!t) return;
        var e = this.config.keyMap;
        e.childs in t && t[e.childs].length > 0 && (this.displayJson.push(t[e.childs]), this.checkArrDeep(t[e.childs][0]));
      }
    }, {
      key: "checkRange",
      value: function checkRange(t, e) {
        var h;
        var i = this.displayJson.length - 1 - t,
            s = this.config.keyMap;

        for (var l = 0; l < i; l++) {
          this.displayJson.pop();
        }

        var n;

        for (var _l = 0; _l <= t; _l++) {
          n = _l == 0 ? this.cascadeJsonData[e[0]] : (h = n == null ? void 0 : n[s.childs]) == null ? void 0 : h[e[_l]];
        }

        this.checkArrDeep(n), this.reRenderWheels(), this.fixRowStyle(), this.setCurDistance(this.resetPosition(t, e));
      }
    }, {
      key: "resetPosition",
      value: function resetPosition(t, e) {
        var i = _toConsumableArray(e);

        var s;

        if (this.sliderList.length > e.length) {
          s = this.sliderList.length - e.length;

          for (var n = 0; n < s; n++) {
            i.push(0);
          }
        } else if (this.sliderList.length < e.length) {
          s = e.length - this.sliderList.length;

          for (var _n2 = 0; _n2 < s; _n2++) {
            i.pop();
          }
        }

        for (var _n3 = t + 1; _n3 < i.length; _n3++) {
          i[_n3] = 0;
        }

        return i;
      }
    }, {
      key: "updateWheels",
      value: function updateWheels(t) {
        if (this.isCascade) {
          if (this.cascadeJsonData = t, this.displayJson = [], this.initCascade(), this.initPosition.length < this.sliderList.length) {
            var e = this.sliderList.length - this.initPosition.length;

            for (var i = 0; i < e; i++) {
              this.initPosition.push(0);
            }
          }

          this.setCurDistance(this.initPosition), this.fixRowStyle();
        }
      }
    }, {
      key: "updateWheel",
      value: function updateWheel(t, e) {
        if (this.isCascade) {
          c.log("error", "'updateWheel()' not support cascade json data, please use 'updateWheels()' instead to update the whole data source");
          return;
        }

        var i = "";
        i += this.getOptionsHtmlStr(e), this.wheelsData[t] = this.isJsonType ? {
          data: e
        } : e, this.sliderList[t].innerHTML = i;
      }
    }, {
      key: "fixRowStyle",
      value: function fixRowStyle() {
        var _this5 = this;

        if (this.initColWidth.length && this.initColWidth.length === this.wheelList.length) {
          var e = this.initColWidth.reduce(function (i, s) {
            return i + s;
          }, 0);
          this.initColWidth.forEach(function (i, s) {
            _this5.wheelList[s].style.width = a(i / e) + "%";
          });
          return;
        }

        var t = a(100 / this.wheelList.length) + "%";

        for (var _e5 = 0; _e5 < this.wheelList.length; _e5++) {
          this.wheelList[_e5].style.width = t;
        }
      }
    }, {
      key: "getIndex",
      value: function getIndex(t) {
        return Math.round((2 * this.optionHeight - t) / this.optionHeight);
      }
    }, {
      key: "getIndexArr",
      value: function getIndexArr() {
        var t = [];

        for (var e = 0; e < this.curDistance.length; e++) {
          t.push(this.getIndex(this.curDistance[e]));
        }

        return t;
      }
    }, {
      key: "getCurValue",
      value: function getCurValue() {
        var t = [],
            e = this.getIndexArr(),
            i = this.config.keyMap;
        if (this.isCascade) for (var s = 0; s < this.wheelList.length; s++) {
          var _t$push;

          var n = this.displayJson[s][e[s]];
          n && t.push((_t$push = {}, _defineProperty(_t$push, i.id, n[i.id]), _defineProperty(_t$push, i.value, n[i.value]), _t$push));
        } else if (this.isJsonType) for (var _s3 = 0; _s3 < this.curDistance.length; _s3++) {
          t.push(this.wheelsData[_s3].data[this.getIndex(this.curDistance[_s3])]);
        } else for (var _s4 = 0; _s4 < this.curDistance.length; _s4++) {
          t.push(this.getInnerText(_s4));
        }
        return t;
      }
    }, {
      key: "getValue",
      value: function getValue() {
        return this.getCurValue();
      }
    }, {
      key: "calcDistance",
      value: function calcDistance(t) {
        return 2 * this.optionHeight - t * this.optionHeight;
      }
    }, {
      key: "setCurDistance",
      value: function setCurDistance(t) {
        var e = [];

        for (var i = 0; i < this.sliderList.length; i++) {
          e.push(this.calcDistance(t[i])), this.movePosition(this.sliderList[i], e[i]);
        }

        this.curDistance = e;
      }
    }, {
      key: "fixPosition",
      value: function fixPosition(t) {
        return -(this.getIndex(t) - 2) * this.optionHeight;
      }
    }, {
      key: "movePosition",
      value: function movePosition(t, e) {
        t.style.transform = "translate3d(0," + e + "px, 0)";
      }
    }, {
      key: "locatePosition",
      value: function locatePosition(t, e) {
        t === void 0 || e === void 0 || e < 0 || (this.curDistance[t] = this.calcDistance(e), this.movePosition(this.sliderList[t], this.curDistance[t]), this.isCascade && this.checkRange(t, this.getIndexArr()));
      }
    }, {
      key: "updateCurDistance",
      value: function updateCurDistance(t, e) {
        this.curDistance[e] = parseInt(t.style.transform.split(",")[1]);
      }
    }, {
      key: "getInnerText",
      value: function getInnerText(t) {
        var s;
        var e = this.sliderList[t].getElementsByTagName("li").length;
        var i = this.getIndex(this.curDistance[t]);
        return i >= e ? i = e - 1 : i < 0 && (i = 0), ((s = this.sliderList[t].getElementsByTagName("li")[i]) == null ? void 0 : s.textContent) || "";
      }
    }, {
      key: "touch",
      value: function touch(t) {
        var l, u, d, f;
        var i = (t.composedPath && t.composedPath()).find(function (g) {
          var p;
          return (p = g.classList) == null ? void 0 : p.contains("ms-wheel");
        });
        if (!i) return;
        var s = !1;
        var n = i.firstChild,
            h = parseInt(i.getAttribute("data-index") || "0");

        switch (t.type) {
          case "touchstart":
          case "mousedown":
            n.style.transition = "none 0s ease-out", this.startY = Math.floor(t instanceof TouchEvent ? t.touches[0].clientY : t.clientY), this.preMoveY = this.startY, t.type === "mousedown" && (this.enableClickStatus = !0);
            break;

          case "touchmove":
          case "mousemove":
            if (t.preventDefault(), t.type === "mousemove" && !this.enableClickStatus) break;
            this.moveY = Math.floor(t instanceof TouchEvent ? t.touches[0].clientY : t.clientY), this.offsetY = (this.moveY - this.preMoveY) * this.config.scrollSpeed, this.updateCurDistance(n, h), this.curDistance[h] = this.curDistance[h] + this.offsetY, this.movePosition(n, this.curDistance[h]), this.preMoveY = this.moveY;
            break;

          case "touchend":
          case "mouseup":
            if (n.style.transition = "transform 0.18s ease-out", this.moveEndY = Math.floor(t instanceof TouchEvent ? t.changedTouches[0].clientY : t.clientY), this.offsetSum = this.moveEndY - this.startY, this.oversizeBorder = -(n.getElementsByTagName("li").length - 3) * this.optionHeight, this.offsetSum == 0) {
              var g = Math.floor((window.innerHeight - this.moveEndY) / 40);

              if (g != 2) {
                var p = g - 2,
                    y = this.curDistance[h] + p * this.optionHeight;
                y <= 2 * this.optionHeight && y >= this.oversizeBorder && (this.curDistance[h] = y, this.movePosition(n, this.curDistance[h]), s = !0);
              }
            } else this.updateCurDistance(n, h), this.curDistance[h] = this.fixPosition(this.curDistance[h]), this.curDistance[h] > 2 * this.optionHeight ? this.curDistance[h] = 2 * this.optionHeight : this.curDistance[h] < this.oversizeBorder && (this.curDistance[h] = this.oversizeBorder), this.movePosition(n, this.curDistance[h]), s = !0;

            t.type === "mouseup" && (this.enableClickStatus = !1), this.isCascade && this.checkRange(h, this.getIndexArr()), s && ((u = (l = this.config).transitionEnd) == null || u.call(l, this.getIndexArr(), this.getCurValue(), this), (f = (d = this.config).onTransitionEnd) == null || f.call(d, this.getCurValue(), this.getIndexArr(), this));
        }
      }
    }], [{
      key: "checkDataType",
      value: function checkDataType(t) {
        var e, i;
        return _typeof((i = (e = t[0]) == null ? void 0 : e.data) == null ? void 0 : i[0]) == "object";
      }
    }, {
      key: "checkRequiredConfig",
      value: function checkRequiredConfig(t) {
        var e = c.REQUIRED_PARAMS;

        if (!t) {
          var i = e.map(function (s) {
            return "'".concat(s, "'");
          });
          return c.log("error", "missing required param ".concat(i.join(" and "), ".")), !1;
        }

        for (var _i2 = 0; _i2 < e.length; _i2++) {
          var s = e[_i2];
          if (!t[s]) return c.log("error", "missing required param '".concat(s, "'.")), !1;
        }

        return !0;
      }
    }, {
      key: "log",
      value: function log(t, e) {
        var i;
        (i = console[t]) == null || i.call(console, "[mobile-select]: ".concat(e));
      }
    }]);

    return c;
  }();

  var r = c;
  return o(r, "defaultConfig", {
    keyMap: {
      id: "id",
      value: "value",
      childs: "childs"
    },
    position: [],
    colWidth: [],
    title: "",
    connector: " ",
    ensureBtnText: "\u786E\u8BA4",
    cancelBtnText: "\u53D6\u6D88",
    triggerDisplayValue: !0,
    scrollSpeed: 1
  }), o(r, "REQUIRED_PARAMS", ["trigger", "wheels"]), r;
}();
