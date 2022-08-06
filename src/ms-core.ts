import {
  MobileSelectConfig,
  CustomConfig,
  KeyMap,
  CascadeData,
  OptionData,
} from "./types";
import "./style/mobile-select.less";

export default class MobileSelect {
  mobileSelect: any;
  trigger!: HTMLElement;
  wheel!: HTMLCollectionOf<HTMLElement>;
  slider!: HTMLCollectionOf<HTMLElement>;
  wheels!: HTMLDivElement;
  panel!: HTMLDivElement;
  ensureBtn!: HTMLDivElement;
  cancelBtn!: HTMLDivElement;
  grayLayer!: HTMLDivElement;
  popUp!: HTMLDivElement;
  initPosition: number[];
  initColWidth: number[];
  /** 拼接值的连接符 */
  connector!: string;
  /** 数据源 */
  wheelsData: CascadeData[];
  /** 显示json */
  displayJson: CascadeData[];
  /** 当前数值 */
  curValue!: string[] | number[];
  /** 当前索引位置 */
  curIndexArr: number[];
  /** 是否级联 */
  isCascade: boolean;
  /** 是否JSON格式 */
  isJsonType: boolean;
  /** 开始 Y轴位置 */
  startY!: number;
  /** 结束 Y轴位置 */
  moveEndY!: number;
  /** 当前 Y轴位置 */
  moveY!: number;
  /** 上一次 Y轴位置 */
  preMoveY!: number;
  /** Y轴新旧位移差值 */
  offsetY: number;
  /** 差值总和? */
  offsetSum: number;
  /** 最大Border? */
  oversizeBorder!: number;
  /** 是否启用点击状态 */
  enableClickStatus: boolean;
  /** 是否是PC端 */
  isPC: boolean;
  /** 选项高度(li元素的高度) */
  optionHeight: number;
  /** 存放滚动距离的数组 */
  curDistance: number[];
  /** 级联数据 相当于wheels[0].data的别名 */
  cascadeJsonData: CascadeData[];
  /** 用户自定义key */
  keyMap!: KeyMap;

  eventHandleMap!: {
    [x: string]: { event: string | string[]; fn: Function };
  };

  initDeepCount!: number;

  config: MobileSelectConfig;

  static checkIsPC() {
    return !Boolean(
      navigator.userAgent
        .toLowerCase()
        .match(
          /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/
        )
    );
  }
  static checkDataType(wheelsData: CascadeData): boolean {
    return typeof wheelsData[0]?.data?.[0] === "object";
  }
  static defaultConfig = {
    keyMap: { id: "id", value: "value", childs: "childs" },
    position: [],
    colWidth: [],
    title: "",
    connector: " ",
    ensureBtnText: "确认",
    cancelBtnText: "取消",
    triggerDisplayValue: true,
  };
  constructor(config: CustomConfig) {
    this.config = Object.assign(
      MobileSelect.defaultConfig,
      config
    ) as MobileSelectConfig;
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
    this.initPosition = config.position || [];
    this.initColWidth = config.colWidth || [];
    this.init();
  }

  init(): void {
    const { config } = this;
    this.isJsonType = MobileSelect.checkDataType(this.wheelsData);
    this.renderComponent(this.wheelsData);

    // 兼容旧版传入string的写法
    if (typeof config.trigger === "string") {
      //@ts-ignore
      this.trigger = document.querySelector(config.trigger);
    } else {
      this.trigger = config.trigger;
    }
    if (!this.trigger) {
      console.error(
        "mobile-select has been successfully installed, but no trigger found on your page."
      );
      return;
    }

    this.wheel = this.mobileSelect.getElementsByClassName("ms-wheel");
    this.slider = this.mobileSelect.getElementsByClassName(
      "ms-select-container"
    );
    this.panel = this.mobileSelect.querySelector(".ms-panel");
    this.wheels = this.mobileSelect.querySelector(".ms-wheels");
    this.ensureBtn = this.mobileSelect.querySelector(".ms-ensure");
    this.cancelBtn = this.mobileSelect.querySelector(".ms-cancel");
    this.grayLayer = this.mobileSelect.querySelector(".ms-gray-layer");
    this.popUp = this.mobileSelect.querySelector(".ms-content");
    this.optionHeight = this.mobileSelect.querySelector("li").offsetHeight;
    // 复显初始值
    if (config.initValue && config.triggerDisplayValue) {
      this.trigger.innerText = config.initValue;
    }
    this.setStyle(config);
    this.isPC = MobileSelect.checkIsPC();

    this.isCascade = this.checkCascade();
    if (this.isCascade) {
      this.initCascade();
    }

    // 在设置之前就被修改了displayjson
    if (config.initValue) {
      this.initPosition = this.getPositionByValue();
    }

    // 定位初始位置
    if (this.initPosition.length < this.slider.length) {
      let diff = this.slider.length - this.initPosition.length;
      for (let i = 0; i < diff; i++) {
        this.initPosition.push(0);
      }
    }
    this.setCurDistance(this.initPosition);

    // dom事件监听, 方便移除
    this.eventHandleMap = {
      cancelBtn: {
        event: "click",
        fn: () => {
          this.hide();
          this.config.cancel?.(this.curIndexArr, this.curValue);
          this.config.onCancel?.(this.curIndexArr, this.curValue);
        },
      },
      ensureBtn: {
        event: "click",
        fn: () => {
          this.hide();
          if (!this.optionHeight) {
            this.optionHeight =
              this.mobileSelect.querySelector("li").offsetHeight;
          }
          let tempValue = "";
          for (let i = 0; i < this.wheel.length; i++) {
            i == this.wheel.length - 1
              ? (tempValue += this.getInnerHtml(i))
              : (tempValue += this.getInnerHtml(i) + this.config.connector);
          }
          if (config.triggerDisplayValue) {
            this.trigger.innerText = tempValue;
          }
          this.curIndexArr = this.getIndexArr();
          this.curValue = this.getCurValue();
          this.config.callback?.(this.curIndexArr, this.curValue);
          this.config.onChange?.(this.curIndexArr, this.curValue);
        },
      },
      trigger: {
        event: "click",
        fn: () => {
          this.show();
        },
      },
      grayLayer: {
        event: "click",
        fn: () => this.hide(),
      },
      popUp: {
        event: "click",
        fn: (event: Event) => event.stopPropagation(),
      },
      panel: {
        event: ["touchstart", "touchend", "touchmove"],
        fn: (event: TouchEvent | MouseEvent) => this.touch(event),
      },
    };

    if (this.isPC) {
      this.eventHandleMap.panel.event = ["mousedown", "mousemove", "mouseup"];
    }

    this.registerEvents("add");
    this.fixRowStyle(); // 修正列数
  }

  // TODO 写单测
  /** 根据initValue 获取initPostion 需要区分级联和非级联情况 注意 此时displayJson还没生成 */
  getPositionByValue(): number[] {
    const { keyMap, connector, initValue } = this.config;
    const valueArr = initValue?.split(connector) || [];
    if (this.isJsonType) {
      let childList = this.wheelsData[0]?.data;
      return valueArr.reduce((result, cur) => {
        const posIndex = childList?.findIndex(
          (item: CascadeData) => item[keyMap.value] == cur // 此处使用弱等 因为value有可能是数字类型
        );
        result.push(posIndex < 0 ? 0 : posIndex);
        childList = childList[posIndex]?.[keyMap.childs];
        return result;
      }, [] as unknown as number[]);
    }
    return valueArr.reduce((result, cur, index) => {
      const posIndex = this.wheelsData[index]?.data?.findIndex(
        (item: string | number) => item == cur // 此处使用弱等 因为value有可能是数字类型
      );
      result.push(posIndex < 0 ? 0 : posIndex);
      return result;
    }, [] as unknown as number[]);
  }

  setTitle(title: string): void {
    this.mobileSelect.querySelector(".ms-title").innerHTML = title;
  }

  setStyle(config: MobileSelectConfig): void {
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
      shadowMask.style.background =
        "linear-gradient(to bottom, " +
        config.bgColor +
        ", rgba(255, 255, 255, 0), " +
        config.bgColor +
        ")";
    }
    if (typeof config.maskOpacity === "number") {
      const grayMask = this.mobileSelect.querySelector(".ms-gray-layer");
      grayMask.style.background = "rgba(0, 0, 0, " + config.maskOpacity + ")";
    }
  }

  show(): void {
    this.mobileSelect.classList.add("ms-show");
    if (typeof this.config.onShow === "function") {
      this.config.onShow?.();
    }
  }

  hide(): void {
    this.mobileSelect.classList.remove("ms-show");
    if (typeof this.config.onHide === "function") {
      this.config.onHide?.();
    }
  }

  registerEvents(type: "add" | "remove"): void {
    for (const [domName, item] of Object.entries(this.eventHandleMap)) {
      if (typeof item.event === "string") {
        this[domName as keyof MobileSelect][`${type}EventListener`](
          item.event,
          item.fn
        );
      } else {
        // 数组
        item.event.forEach((eventName) => {
          this[domName as keyof MobileSelect][`${type}EventListener`](
            eventName,
            item.fn
          );
        });
      }
    }
  }

  destroy(): void {
    this.registerEvents("remove");
    this.mobileSelect.parentNode.removeChild(this.mobileSelect);
  }

  getOptionsHtmlStr(childs: CascadeData): string {
    const { keyMap } = this.config;
    let tempHTML = "";
    if (this.isJsonType) {
      for (let j = 0; j < childs.length; j++) {
        // 行
        const id = childs[j][keyMap.id];
        const val = childs[j][keyMap.value];
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

  renderComponent(wheelsData: CascadeData[]): void {
    this.mobileSelect = document.createElement("div");
    this.mobileSelect.className = "ms-mobile-select";
    this.mobileSelect.innerHTML = `<div class="ms-gray-layer"></div>
        <div class="ms-content">
          <div class="ms-btn-bar">
            <div class="ms-fix-width">
              <div class="ms-cancel">${
                this.config.cancelBtnText || "取消"
              }</div>  
              <div class="ms-title">${this.config.title || ""}</div>
              <div class="ms-ensure">${
                this.config.ensureBtnText || "确认"
              }</div>
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

    // 根据数据来渲染wheels
    let tempHTML = "";
    for (let i = 0; i < wheelsData.length; i++) {
      //列
      tempHTML += `<div class="ms-wheel"><ul class="ms-select-container" data-index="${i}">`;
      tempHTML += this.getOptionsHtmlStr(wheelsData[i].data);
      tempHTML += "</ul></div>";
    }
    this.mobileSelect.querySelector(".ms-wheels").innerHTML = tempHTML;
  }

  // 级联数据滚动时 右侧列数据的变化
  reRenderWheels(): void {
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
        tempWheel.innerHTML = `<ul class="ms-select-container" data-index="${i}">${this.getOptionsHtmlStr(
          this.displayJson[i]
        )}</ul>`;
        this.wheels.appendChild(tempWheel);
      }
    }
  }

  // TODO 需要遍历 不能只判断第一位
  checkCascade(): boolean {
    const { keyMap } = this.config;
    if (this.isJsonType) {
      let node = this.wheelsData[0].data;
      for (let i = 0; i < node.length; i++) {
        if (keyMap.childs in node[i] && node[i][keyMap.childs]?.length > 0) {
          this.cascadeJsonData = this.wheelsData[0].data;
          return true;
        }
      }
    }
    return false;
  }

  initCascade(): void {
    this.displayJson.push(this.cascadeJsonData);
    if (this.initPosition.length > 0) {
      this.initDeepCount = 0;
      this.initCheckArrDeep(this.cascadeJsonData[this.initPosition[0]]);
    } else {
      this.checkArrDeep(this.cascadeJsonData[0]);
    }
    this.reRenderWheels();
  }

  initCheckArrDeep(parent: CascadeData): void {
    if (parent) {
      const { keyMap } = this.config;
      if (keyMap.childs in parent && parent[keyMap.childs].length > 0) {
        this.displayJson.push(parent[keyMap.childs]);
        this.initDeepCount++;
        let nextNode =
          parent[keyMap.childs][this.initPosition[this.initDeepCount]];
        if (nextNode) {
          this.initCheckArrDeep(nextNode);
        } else {
          this.checkArrDeep(parent[keyMap.childs][0]);
        }
      }
    }
  }

  checkArrDeep(parent: CascadeData): void {
    // 检测子节点深度  修改displayJson
    if (!parent) return;
    const { keyMap } = this.config;
    if (keyMap.childs in parent && parent[keyMap.childs].length > 0) {
      this.displayJson.push(parent[keyMap.childs]); // 生成子节点数组
      this.checkArrDeep(parent[keyMap.childs][0]); // 检测下一个子节点
    }
  }

  checkRange(index: number, posIndexArr: number[]): void {
    let deleteNum = this.displayJson.length - 1 - index;
    const { keyMap } = this.config;
    for (let i = 0; i < deleteNum; i++) {
      this.displayJson.pop(); // 修改 displayJson
    }
    let resultNode;
    for (let i = 0; i <= index; i++) {
      resultNode =
        i == 0
          ? this.cascadeJsonData[posIndexArr[0]]
          : (resultNode as unknown as CascadeData)?.[keyMap.childs]?.[
              posIndexArr[i]
            ];
    }
    this.checkArrDeep(resultNode);
    this.reRenderWheels();
    this.fixRowStyle();
    this.setCurDistance(this.resetPosition(index, posIndexArr));
  }

  resetPosition(index: number, posIndexArr: number[]): number[] {
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

  updateWheels(data: CascadeData[]): void {
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

  // TODO 需测试
  updateWheel(
    sliderIndex: number,
    data: Omit<OptionData, "CascadeData">[]
  ): void {
    let tempHTML = "";
    if (this.isCascade) {
      console.error(
        "级联格式不支持updateWheel(),请使用updateWheels()更新整个数据源"
      );
      return;
    }
    tempHTML += this.getOptionsHtmlStr(data);
    this.wheelsData[sliderIndex] = this.isJsonType ? { data } : data;
    this.slider[sliderIndex].innerHTML = tempHTML;
  }

  fixRowStyle(): void {
    // 自定义列宽度比例 用width不用flex的原因是可以做transition过渡
    if (
      this.initColWidth.length &&
      this.initColWidth.length === this.wheel.length
    ) {
      let widthSum = this.initColWidth.reduce((cur, pre) => cur + pre, 0);
      this.initColWidth.forEach((item, index) => {
        this.wheel[index].style.width =
          ((item / widthSum) * 100).toFixed(2) + "%";
      });
      return;
    }
    let width = (100 / this.wheel.length).toFixed(2);
    for (let i = 0; i < this.wheel.length; i++) {
      this.wheel[i].style.width = width + "%";
    }
  }

  getIndex(distance: number): number {
    return Math.round((2 * this.optionHeight - distance) / this.optionHeight);
  }

  getIndexArr(): number[] {
    let temp = [];
    for (let i = 0; i < this.curDistance.length; i++) {
      temp.push(this.getIndex(this.curDistance[i]));
    }
    return temp;
  }

  getCurValue(): string[] | number[] {
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

  getValue(): string[] | number[] {
    return this.curValue;
  }

  calcDistance(index: number): number {
    return 2 * this.optionHeight - index * this.optionHeight;
  }

  setCurDistance(indexArr: number[]): void {
    let temp = [];
    for (let i = 0; i < this.slider.length; i++) {
      temp.push(this.calcDistance(indexArr[i]));
      this.movePosition(this.slider[i], temp[i]);
    }
    this.curDistance = temp;
  }

  fixPosition(distance: number): number {
    return -(this.getIndex(distance) - 2) * this.optionHeight;
  }

  movePosition(theSlider: HTMLElement, distance: number): void {
    theSlider.style.transform = "translate3d(0," + distance + "px, 0)";
  }

  locatePosition(index: number, posIndex: number): void {
    this.curDistance[index] = this.calcDistance(posIndex);
    this.movePosition(this.slider[index], this.curDistance[index]);
    if (this.isCascade) {
      this.checkRange(index, this.getIndexArr());
    }
  }

  updateCurDistance(theSlider: HTMLElement, index: number): void {
    this.curDistance[index] = parseInt(theSlider.style.transform.split(",")[1]);
  }

  getInnerHtml(sliderIndex: number): string {
    let lengthOfList =
      this.slider[sliderIndex].getElementsByTagName("li").length;
    let index = this.getIndex(this.curDistance[sliderIndex]);

    if (index >= lengthOfList) {
      index = lengthOfList - 1;
    } else if (index < 0) {
      index = 0;
    }
    // TODO 需要优化
    return this.slider[sliderIndex].getElementsByTagName("li")[index].innerHTML;
  }

  touch(event: TouchEvent | MouseEvent): void {
    const path = event.composedPath && event.composedPath();
    const theSlider = path[1] as HTMLElement; // dom --> selectContainer
    const index = parseInt(
      (theSlider as HTMLUListElement).getAttribute("data-index") || "0"
    );
    switch (event.type) {
      case "touchstart":
      case "mousedown":
        this.startY = Math.floor(
          event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
        );
        this.preMoveY = this.startY;
        if (event.type === "mousedown") {
          this.enableClickStatus = true;
        }
        break;

      case "touchend":
      case "mouseup":
        this.moveEndY = Math.floor(
          event instanceof TouchEvent
            ? event.changedTouches[0].clientY
            : event.clientY
        );
        this.offsetSum = this.moveEndY - this.startY;
        this.oversizeBorder =
          -(theSlider.getElementsByTagName("li").length - 3) *
          this.optionHeight;

        if (this.offsetSum == 0) {
          // offsetSum为0, 相当于点击事件
          // 0 1 [2] 3 4
          let clickOffetNum = Math.floor(
            (document.documentElement.clientHeight - this.moveEndY) / 40
          );
          if (clickOffetNum != 2) {
            let tempOffset = clickOffetNum - 2;
            let newDistance =
              this.curDistance[index] + tempOffset * this.optionHeight;
            if (
              newDistance <= 2 * this.optionHeight &&
              newDistance >= this.oversizeBorder
            ) {
              this.curDistance[index] = newDistance;
              this.movePosition(theSlider, this.curDistance[index]);
              this.config.transitionEnd?.(
                this.getIndexArr(),
                this.getCurValue()
              );
              this.config.onTransitionEnd?.(
                this.getIndexArr(),
                this.getCurValue()
              );
            }
          }
        } else {
          // 修正位置
          this.updateCurDistance(theSlider, index);
          this.curDistance[index] = this.fixPosition(this.curDistance[index]);
          this.movePosition(theSlider, this.curDistance[index]);

          // 反弹
          if (
            this.curDistance[index] + this.offsetSum >
            2 * this.optionHeight
          ) {
            this.curDistance[index] = 2 * this.optionHeight;
            setTimeout(() => {
              this.movePosition(theSlider, this.curDistance[index]);
            }, 100);
          } else if (
            this.curDistance[index] + this.offsetSum <
            this.oversizeBorder
          ) {
            this.curDistance[index] = this.oversizeBorder;
            setTimeout(() => {
              this.movePosition(theSlider, this.curDistance[index]);
            }, 100);
          }
          this.config.transitionEnd?.(this.getIndexArr(), this.getCurValue());
          this.config.onTransitionEnd?.(this.getIndexArr(), this.getCurValue());
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
        this.moveY = Math.floor(
          event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
        );
        this.offsetY = this.moveY - this.preMoveY;
        this.updateCurDistance(theSlider, index);
        this.curDistance[index] = this.curDistance[index] + this.offsetY;
        this.movePosition(theSlider, this.curDistance[index]);
        this.preMoveY = this.moveY;
        break;
    }
  }
}
