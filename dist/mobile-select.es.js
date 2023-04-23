/*
* mobile-select v1.4.0
* Homepage: https://github.com/onlyhom/mobile-select
* Released under the MIT License.
* (c) 2017-present
*/
var S = Object.defineProperty;
var D = (g, t, e) => t in g ? S(g, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : g[t] = e;
var h = (g, t, e) => (D(g, typeof t != "symbol" ? t + "" : t, e), e);
import "./style/mobile-select.css";
function w() {
  return !navigator.userAgent.toLowerCase().match(/ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/);
}
const l = class {
  constructor(t) {
    h(this, "mobileSelect");
    h(this, "trigger");
    h(this, "wheelList");
    h(this, "sliderList");
    h(this, "wheelsContain");
    h(this, "panel");
    h(this, "ensureBtn");
    h(this, "cancelBtn");
    h(this, "grayLayer");
    h(this, "popUp");
    h(this, "initPosition");
    h(this, "initColWidth");
    h(this, "wheelsData");
    h(this, "displayJson");
    h(this, "curValue");
    h(this, "curIndexArr");
    h(this, "isCascade");
    h(this, "isJsonType");
    h(this, "startY");
    h(this, "moveEndY");
    h(this, "moveY");
    h(this, "preMoveY");
    h(this, "offsetY");
    h(this, "offsetSum");
    h(this, "oversizeBorder");
    h(this, "enableClickStatus");
    h(this, "optionHeight");
    h(this, "curDistance");
    h(this, "cascadeJsonData");
    h(this, "eventHandleMap");
    h(this, "initDeepCount");
    h(this, "config");
    !l.checkRequiredConfig(t) || (this.config = Object.assign({}, l.defaultConfig, t), this.wheelsData = t.wheels, this.isJsonType = !1, this.cascadeJsonData = [], this.displayJson = [], this.curValue = [], this.curIndexArr = [], this.isCascade = !1, this.startY, this.moveEndY, this.moveY, this.preMoveY, this.offsetY = 0, this.offsetSum = 0, this.oversizeBorder, this.curDistance = [], this.enableClickStatus = !1, this.optionHeight = 0, this.initPosition = t.position || [], this.initColWidth = t.colWidth || [], this.init());
  }
  init() {
    if (!this.checkTriggerAvailable())
      return;
    const { config: t } = this;
    if (this.isJsonType = l.checkDataType(this.wheelsData), this.renderComponent(this.wheelsData), this.wheelList = this.mobileSelect.getElementsByClassName("ms-wheel"), this.sliderList = this.mobileSelect.getElementsByClassName("ms-select-container"), this.panel = this.mobileSelect.querySelector(".ms-panel"), this.wheelsContain = this.mobileSelect.querySelector(".ms-wheels"), this.ensureBtn = this.mobileSelect.querySelector(".ms-ensure"), this.cancelBtn = this.mobileSelect.querySelector(".ms-cancel"), this.grayLayer = this.mobileSelect.querySelector(".ms-gray-layer"), this.popUp = this.mobileSelect.querySelector(".ms-content"), this.optionHeight = this.mobileSelect.querySelector("li").offsetHeight, t.initValue && this.setTriggerInnerText(t.initValue), this.setStyle(t), this.isCascade = this.checkCascade(), this.isCascade && this.initCascade(), t.initValue && (this.initPosition = this.getPositionByInitValue()), this.initPosition.length < this.sliderList.length) {
      const e = this.sliderList.length - this.initPosition.length;
      for (let i = 0; i < e; i++)
        this.initPosition.push(0);
    }
    this.isCascade ? this.initPosition.forEach((e, i) => {
      this.checkRange(i, this.initPosition);
    }) : this.setCurDistance(this.initPosition), this.eventHandleMap = {
      cancelBtn: {
        event: "click",
        fn: () => {
          var e, i, s, n;
          this.hide(), (i = (e = this.config).cancel) == null || i.call(e, this.curIndexArr, this.curValue, this), (n = (s = this.config).onCancel) == null || n.call(s, this.curValue, this.curIndexArr, this);
        }
      },
      ensureBtn: {
        event: "click",
        fn: () => {
          var e, i, s, n;
          this.hide(), this.optionHeight || (this.optionHeight = this.mobileSelect.querySelector("li").offsetHeight), this.setTriggerInnerText(this.getConnectedString()), this.curIndexArr = this.getIndexArr(), this.curValue = this.getCurValue(), (i = (e = this.config).callback) == null || i.call(e, this.curIndexArr, this.curValue, this), (n = (s = this.config).onChange) == null || n.call(s, this.curValue, this.curIndexArr, this);
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
        fn: (e) => e.stopPropagation()
      },
      panel: {
        event: ["touchstart", "touchend", "touchmove"],
        fn: (e) => this.touch(e)
      }
    }, w() && (this.eventHandleMap.panel.event = ["mousedown", "mousemove", "mouseup"]), this.registerEvents("add"), this.fixRowStyle(), t.autoFocus && this.show();
  }
  static checkDataType(t) {
    var e, i;
    return typeof ((i = (e = t[0]) == null ? void 0 : e.data) == null ? void 0 : i[0]) == "object";
  }
  static checkRequiredConfig(t) {
    const e = l.REQUIRED_PARAMS;
    if (!t) {
      const i = e.map((s) => `'${s}'`);
      return l.log("error", `missing required param ${i.join(" and ")}.`), !1;
    }
    for (let i = 0; i < e.length; i++) {
      const s = e[i];
      if (!t[s])
        return l.log("error", `missing required param '${s}'.`), !1;
    }
    return !0;
  }
  static log(t, e) {
    var i;
    (i = console[t]) == null || i.call(console, `[mobile-select]: ${e}`);
  }
  checkTriggerAvailable() {
    const { config: t } = this;
    return this.trigger = t.trigger instanceof HTMLElement ? t.trigger : document.querySelector(t.trigger), this.trigger ? !0 : (l.log("error", "trigger HTMLElement does not found on your document."), !1);
  }
  getPositionByInitValue() {
    var n;
    const { keyMap: t, connector: e, initValue: i } = this.config, s = (i == null ? void 0 : i.split(e)) || [];
    if (this.isJsonType) {
      let o = (n = this.wheelsData[0]) == null ? void 0 : n.data;
      return s.reduce((r, c) => {
        var u;
        const a = o == null ? void 0 : o.findIndex((d) => d[t.value] == c);
        return r.push(a < 0 ? 0 : a), o = (u = o[a]) == null ? void 0 : u[t.childs], r;
      }, []);
    }
    return s.reduce((o, r, c) => {
      var u, d;
      const a = (d = (u = this.wheelsData[c]) == null ? void 0 : u.data) == null ? void 0 : d.findIndex((f) => f == r);
      return o.push(a < 0 ? 0 : a), o;
    }, []);
  }
  getConnectedString() {
    let t = "";
    for (let e = 0; e < this.wheelList.length; e++)
      e == this.wheelList.length - 1 ? t += this.getInnerText(e) : t += this.getInnerText(e) + this.config.connector;
    return t;
  }
  setTriggerInnerText(t) {
    this.config.triggerDisplayValue && (this.trigger.textContent = t);
  }
  setValue(t) {
    if (!t || !t.length)
      return;
    if (this.isJsonType && typeof t[0] != "object" || !this.isJsonType && typeof t[0] == "object") {
      l.log("error", `The setValue() input format should be same with getValue(), like: ${JSON.stringify(this.getValue())}`);
      return;
    }
    const { keyMap: e } = this.config;
    t.forEach((i, s) => {
      var r;
      const n = this.isCascade ? this.displayJson[s] : (r = this.wheelsData[s]) == null ? void 0 : r.data, o = n == null ? void 0 : n.findIndex((c) => this.isJsonType ? i[e.id] == c[e.id] || i[e.value] == c[e.value] : i == c);
      this.locatePosition(s, o);
    }), this.setTriggerInnerText(this.getConnectedString());
  }
  setTitle(t) {
    this.mobileSelect.querySelector(".ms-title").innerHTML = t;
  }
  setStyle(t) {
    if (t.ensureBtnColor && (this.ensureBtn.style.color = t.ensureBtnColor), t.cancelBtnColor && (this.cancelBtn.style.color = t.cancelBtnColor), t.titleColor) {
      const e = this.mobileSelect.querySelector(".ms-title");
      e.style.color = t.titleColor;
    }
    if (t.textColor && (this.panel = this.mobileSelect.querySelector(".ms-panel"), this.panel.style.color = t.textColor), t.titleBgColor) {
      const e = this.mobileSelect.querySelector(".ms-btn-bar");
      e.style.backgroundColor = t.titleBgColor;
    }
    if (t.bgColor) {
      this.panel = this.mobileSelect.querySelector(".ms-panel");
      const e = this.mobileSelect.querySelector(".ms-shadow-mask");
      this.panel.style.backgroundColor = t.bgColor, e.style.background = "linear-gradient(to bottom, " + t.bgColor + ", rgba(255, 255, 255, 0), " + t.bgColor + ")";
    }
    if (typeof t.maskOpacity == "number") {
      const e = this.mobileSelect.querySelector(".ms-gray-layer");
      e.style.background = "rgba(0, 0, 0, " + t.maskOpacity + ")";
    }
  }
  show() {
    var t, e, i;
    this.mobileSelect.classList.add("ms-show"), (t = document.querySelector("body")) == null || t.classList.add("ms-show"), typeof this.config.onShow == "function" && ((i = (e = this.config).onShow) == null || i.call(e, this.curValue, this.curIndexArr, this));
  }
  hide() {
    var t, e, i;
    this.mobileSelect.classList.remove("ms-show"), (t = document.querySelector("body")) == null || t.classList.remove("ms-show"), typeof this.config.onHide == "function" && ((i = (e = this.config).onHide) == null || i.call(e, this.curValue, this.curIndexArr, this));
  }
  registerEvents(t) {
    for (const [e, i] of Object.entries(this.eventHandleMap))
      typeof i.event == "string" ? this[e][`${t}EventListener`](i.event, i.fn, { passive: !1 }) : i.event.forEach((s) => {
        this[e][`${t}EventListener`](s, i.fn, { passive: !1 });
      });
  }
  destroy() {
    var t, e;
    this.registerEvents("remove"), (e = (t = this.mobileSelect) == null ? void 0 : t.parentNode) == null || e.removeChild(this.mobileSelect);
  }
  getOptionsHtmlStr(t) {
    const { keyMap: e } = this.config;
    let i = "";
    if (this.isJsonType)
      for (let s = 0; s < t.length; s++) {
        const n = t[s][e.id], o = t[s][e.value];
        i += `<li data-id="${n}">${o}</li>`;
      }
    else
      for (let s = 0; s < t.length; s++)
        i += "<li>" + t[s] + "</li>";
    return i;
  }
  renderComponent(t) {
    this.mobileSelect = document.createElement("div"), this.mobileSelect.className = "ms-mobile-select", this.mobileSelect.innerHTML = `<div class="ms-gray-layer"></div>
        <div class="ms-content">
          <div class="ms-btn-bar">
            <div class="ms-fix-width">
              <div class="ms-cancel">${this.config.cancelBtnText}</div>  
              <div class="ms-title">${this.config.title || ""}</div>
              <div class="ms-ensure">${this.config.ensureBtnText}</div>
            </div>
          </div>
          <div class="ms-panel">
            <div class="ms-fix-width">
            <div class="ms-wheels"></div>
            <div class="ms-select-line"></div>
            <div class="ms-shadow-mask"></div>
          </div>
        </div>`, document.body.appendChild(this.mobileSelect);
    let e = "";
    for (let i = 0; i < t.length; i++)
      e += `<div class="ms-wheel" data-index="${i}"><ul class="ms-select-container">`, e += this.getOptionsHtmlStr(t[i].data), e += "</ul></div>";
    this.mobileSelect.querySelector(".ms-wheels").innerHTML = e;
  }
  reRenderWheels() {
    const t = this.wheelList.length - this.displayJson.length;
    if (t > 0)
      for (let e = 0; e < t; e++)
        this.wheelsContain.removeChild(this.wheelList[this.wheelList.length - 1]);
    for (let e = 0; e < this.displayJson.length; e++)
      if (this.wheelList[e])
        this.sliderList[e].innerHTML = this.getOptionsHtmlStr(this.displayJson[e]);
      else {
        const i = document.createElement("div");
        i.className = "ms-wheel", i.innerHTML = `<ul class="ms-select-container">${this.getOptionsHtmlStr(this.displayJson[e])}</ul>`, i.setAttribute("data-index", e.toString()), this.wheelsContain.appendChild(i);
      }
  }
  checkCascade() {
    var e;
    const { keyMap: t } = this.config;
    if (this.isJsonType) {
      const i = this.wheelsData[0].data;
      for (let s = 0; s < i.length; s++)
        if (t.childs in i[s] && ((e = i[s][t.childs]) == null ? void 0 : e.length) > 0)
          return this.cascadeJsonData = this.wheelsData[0].data, !0;
    }
    return !1;
  }
  initCascade() {
    this.displayJson.push(this.cascadeJsonData), this.initPosition.length > 0 ? (this.initDeepCount = 0, this.initCheckArrDeep(this.cascadeJsonData[this.initPosition[0]])) : this.checkArrDeep(this.cascadeJsonData[0]), this.reRenderWheels();
  }
  initCheckArrDeep(t) {
    if (t) {
      const { keyMap: e } = this.config;
      if (e.childs in t && t[e.childs].length > 0) {
        this.displayJson.push(t[e.childs]), this.initDeepCount++;
        const i = t[e.childs][this.initPosition[this.initDeepCount]];
        i ? this.initCheckArrDeep(i) : this.checkArrDeep(t[e.childs][0]);
      }
    }
  }
  checkArrDeep(t) {
    if (!t)
      return;
    const { keyMap: e } = this.config;
    e.childs in t && t[e.childs].length > 0 && (this.displayJson.push(t[e.childs]), this.checkArrDeep(t[e.childs][0]));
  }
  checkRange(t, e) {
    var o;
    const i = this.displayJson.length - 1 - t, { keyMap: s } = this.config;
    for (let r = 0; r < i; r++)
      this.displayJson.pop();
    let n;
    for (let r = 0; r <= t; r++)
      n = r == 0 ? this.cascadeJsonData[e[0]] : (o = n == null ? void 0 : n[s.childs]) == null ? void 0 : o[e[r]];
    this.checkArrDeep(n), this.reRenderWheels(), this.fixRowStyle(), this.setCurDistance(this.resetPosition(t, e));
  }
  resetPosition(t, e) {
    const i = [...e];
    let s;
    if (this.sliderList.length > e.length) {
      s = this.sliderList.length - e.length;
      for (let n = 0; n < s; n++)
        i.push(0);
    } else if (this.sliderList.length < e.length) {
      s = e.length - this.sliderList.length;
      for (let n = 0; n < s; n++)
        i.pop();
    }
    for (let n = t + 1; n < i.length; n++)
      i[n] = 0;
    return i;
  }
  updateWheels(t) {
    if (this.isCascade) {
      if (this.cascadeJsonData = t, this.displayJson = [], this.initCascade(), this.initPosition.length < this.sliderList.length) {
        const e = this.sliderList.length - this.initPosition.length;
        for (let i = 0; i < e; i++)
          this.initPosition.push(0);
      }
      this.setCurDistance(this.initPosition), this.fixRowStyle();
    }
  }
  updateWheel(t, e) {
    if (this.isCascade) {
      l.log("error", "'updateWheel()' not support cascade json data, please use 'updateWheels()' instead to update the whole data source");
      return;
    }
    let i = "";
    i += this.getOptionsHtmlStr(e), this.wheelsData[t] = this.isJsonType ? { data: e } : e, this.sliderList[t].innerHTML = i;
  }
  fixRowStyle() {
    if (this.initColWidth.length && this.initColWidth.length === this.wheelList.length) {
      const e = this.initColWidth.reduce((i, s) => i + s, 0);
      this.initColWidth.forEach((i, s) => {
        this.wheelList[s].style.width = (i / e * 100).toFixed(2) + "%";
      });
      return;
    }
    const t = (100 / this.wheelList.length).toFixed(2);
    for (let e = 0; e < this.wheelList.length; e++)
      this.wheelList[e].style.width = t + "%";
  }
  getIndex(t) {
    return Math.round((2 * this.optionHeight - t) / this.optionHeight);
  }
  getIndexArr() {
    const t = [];
    for (let e = 0; e < this.curDistance.length; e++)
      t.push(this.getIndex(this.curDistance[e]));
    return t;
  }
  getCurValue() {
    const t = [], e = this.getIndexArr(), { keyMap: i } = this.config;
    if (this.isCascade)
      for (let s = 0; s < this.wheelList.length; s++) {
        const n = this.displayJson[s][e[s]];
        n && t.push({
          [i.id]: n[i.id],
          [i.value]: n[i.value]
        });
      }
    else if (this.isJsonType)
      for (let s = 0; s < this.curDistance.length; s++)
        t.push(this.wheelsData[s].data[this.getIndex(this.curDistance[s])]);
    else
      for (let s = 0; s < this.curDistance.length; s++)
        t.push(this.getInnerText(s));
    return t;
  }
  getValue() {
    return this.getCurValue();
  }
  calcDistance(t) {
    return 2 * this.optionHeight - t * this.optionHeight;
  }
  setCurDistance(t) {
    const e = [];
    for (let i = 0; i < this.sliderList.length; i++)
      e.push(this.calcDistance(t[i])), this.movePosition(this.sliderList[i], e[i]);
    this.curDistance = e;
  }
  fixPosition(t) {
    return -(this.getIndex(t) - 2) * this.optionHeight;
  }
  movePosition(t, e) {
    t.style.transform = "translate3d(0," + e + "px, 0)";
  }
  locatePosition(t, e) {
    t === void 0 || e === void 0 || e < 0 || (this.curDistance[t] = this.calcDistance(e), this.movePosition(this.sliderList[t], this.curDistance[t]), this.isCascade && this.checkRange(t, this.getIndexArr()));
  }
  updateCurDistance(t, e) {
    this.curDistance[e] = parseInt(t.style.transform.split(",")[1]);
  }
  getInnerText(t) {
    var s;
    const e = this.sliderList[t].getElementsByTagName("li").length;
    let i = this.getIndex(this.curDistance[t]);
    return i >= e ? i = e - 1 : i < 0 && (i = 0), ((s = this.sliderList[t].getElementsByTagName("li")[i]) == null ? void 0 : s.textContent) || "";
  }
  touch(t) {
    var o, r, c, a, u, d, f, v;
    const i = (t.composedPath && t.composedPath()).find((m) => {
      var p;
      return (p = m.classList) == null ? void 0 : p.contains("ms-wheel");
    });
    if (!i)
      return;
    const s = i.firstChild, n = parseInt(i.getAttribute("data-index") || "0");
    switch (t.type) {
      case "touchstart":
      case "mousedown":
        s.style.transition = "none 0s ease-out", this.startY = Math.floor(t instanceof TouchEvent ? t.touches[0].clientY : t.clientY), this.preMoveY = this.startY, t.type === "mousedown" && (this.enableClickStatus = !0);
        break;
      case "touchmove":
      case "mousemove":
        if (t.preventDefault(), t.type === "mousemove" && !this.enableClickStatus)
          break;
        this.moveY = Math.floor(t instanceof TouchEvent ? t.touches[0].clientY : t.clientY), this.offsetY = (this.moveY - this.preMoveY) * this.config.scrollSpeed, this.updateCurDistance(s, n), this.curDistance[n] = this.curDistance[n] + this.offsetY, this.movePosition(s, this.curDistance[n]), this.preMoveY = this.moveY;
        break;
      case "touchend":
      case "mouseup":
        if (s.style.transition = "transform 0.18s ease-out", this.moveEndY = Math.floor(t instanceof TouchEvent ? t.changedTouches[0].clientY : t.clientY), this.offsetSum = this.moveEndY - this.startY, this.oversizeBorder = -(s.getElementsByTagName("li").length - 3) * this.optionHeight, this.offsetSum == 0) {
          const m = Math.floor((window.innerHeight - this.moveEndY) / 40);
          if (m != 2) {
            const p = m - 2, C = this.curDistance[n] + p * this.optionHeight;
            C <= 2 * this.optionHeight && C >= this.oversizeBorder && (this.curDistance[n] = C, this.movePosition(s, this.curDistance[n]), (r = (o = this.config).transitionEnd) == null || r.call(o, this.getIndexArr(), this.getCurValue(), this), (a = (c = this.config).onTransitionEnd) == null || a.call(c, this.getCurValue(), this.getIndexArr(), this));
          }
        } else
          this.updateCurDistance(s, n), this.curDistance[n] = this.fixPosition(this.curDistance[n]), this.curDistance[n] > 2 * this.optionHeight ? this.curDistance[n] = 2 * this.optionHeight : this.curDistance[n] < this.oversizeBorder && (this.curDistance[n] = this.oversizeBorder), this.movePosition(s, this.curDistance[n]), (d = (u = this.config).transitionEnd) == null || d.call(u, this.getIndexArr(), this.getCurValue(), this), (v = (f = this.config).onTransitionEnd) == null || v.call(f, this.getCurValue(), this.getIndexArr(), this);
        t.type === "mouseup" && (this.enableClickStatus = !1), this.isCascade && this.checkRange(n, this.getIndexArr());
        break;
    }
  }
};
let y = l;
h(y, "defaultConfig", {
  keyMap: { id: "id", value: "value", childs: "childs" },
  position: [],
  colWidth: [],
  title: "",
  connector: " ",
  ensureBtnText: "\u786E\u8BA4",
  cancelBtnText: "\u53D6\u6D88",
  triggerDisplayValue: !0,
  scrollSpeed: 1
}), h(y, "REQUIRED_PARAMS", ["trigger", "wheels"]);
export {
  y as default
};
