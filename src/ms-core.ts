import {
  MobileSelectConfig,
  CustomConfig,
  CascadeData,
  OptionData,
} from "./types";
import { checkIsPC } from "./utils/tools";
import "./style/mobile-select.less";

export default class MobileSelect {
  mobileSelect!: HTMLDivElement;
  trigger!: HTMLElement;
  wheelList!: HTMLCollectionOf<HTMLElement>;
  sliderList!: HTMLCollectionOf<HTMLElement>;
  wheelsContain!: HTMLDivElement;
  panel!: HTMLDivElement;
  ensureBtn!: HTMLDivElement;
  cancelBtn!: HTMLDivElement;
  grayLayer!: HTMLDivElement;
  popUp!: HTMLDivElement;
  /** 初始化滚动位置 由position 或 initValue计算决定 */
  initPosition!: number[];
  /** 轮子宽度比例 */
  initColWidth!: number[];
  /** 数据源 */
  wheelsData!: CascadeData[];
  /** 显示json */
  displayJson!: CascadeData[];
  /** 当前数值 */
  curValue!: string[] | number[] | CascadeData[];
  /** 当前索引位置 */
  curIndexArr!: number[];
  /** 是否级联 */
  isCascade!: boolean;
  /** 是否JSON格式 */
  isJsonType!: boolean;
  /** 开始 Y轴位置 */
  startY!: number;
  /** 结束 Y轴位置 */
  moveEndY!: number;
  /** 当前 Y轴位置 */
  moveY!: number;
  /** 上一次 Y轴位置 */
  preMoveY!: number;
  /** Y轴新旧位移差值 */
  offsetY!: number;
  /** 差值总和? */
  offsetSum!: number;
  /** 最大Border? */
  oversizeBorder!: number;
  /** 是否启用点击状态 */
  enableClickStatus!: boolean;
  /** 选项高度(li元素的高度) */
  optionHeight!: number;
  /** 存放滚动距离的数组 */
  curDistance!: number[];
  /** 级联数据 相当于wheels[0].data的别名 */
  cascadeJsonData!: CascadeData[];
  /** 事件监听 */
  eventHandleMap!: {
    [x: string]: { event: string | string[]; fn: Function };
  };
  /** 级联数据 级联深度 */
  initDeepCount!: number;
  /** 用户配置项 */
  config!: MobileSelectConfig;
  /** 默认配置 */
  static defaultConfig = {
    keyMap: { id: "id", value: "value", childs: "childs" },
    position: [],
    colWidth: [],
    title: "",
    connector: " ",
    ensureBtnText: "确认",
    cancelBtnText: "取消",
    triggerDisplayValue: true,
    scrollSpeed: 1,
  };

  constructor(config: CustomConfig) {
    if (!MobileSelect.checkRequiredConfig(config)) return;
    this.config = Object.assign(
      {},
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
    this.optionHeight = 0;
    this.initPosition = config.position || [];
    this.initColWidth = config.colWidth || [];
    this.init();
  }

  init(): void {
    if (!this.checkTriggerAvailable()) return;

    const { config } = this;
    this.isJsonType = MobileSelect.checkDataType(this.wheelsData);
    this.renderComponent(this.wheelsData);

    // 这里使用getElementsByClassName(不使用querySelectorAll)的原因：返回一个实时的 HTMLCollection, DOM的更改将在更改发生时反映在数组中
    this.wheelList = this.mobileSelect.getElementsByClassName(
      "ms-wheel"
    ) as HTMLCollectionOf<HTMLElement>;
    this.sliderList = this.mobileSelect.getElementsByClassName(
      "ms-select-container"
    ) as HTMLCollectionOf<HTMLElement>;

    this.panel = this.mobileSelect.querySelector(".ms-panel")!;
    this.wheelsContain = this.mobileSelect.querySelector(".ms-wheels")!;
    this.ensureBtn = this.mobileSelect.querySelector(".ms-ensure")!;
    this.cancelBtn = this.mobileSelect.querySelector(".ms-cancel")!;
    this.grayLayer = this.mobileSelect.querySelector(".ms-gray-layer")!;
    this.popUp = this.mobileSelect.querySelector(".ms-content")!;
    this.optionHeight = this.mobileSelect.querySelector("li")!.offsetHeight;
    // 复显初始值
    config.initValue && this.setTriggerInnerText(config.initValue);

    this.setStyle(config);
    this.isCascade = this.checkCascade();
    this.isCascade && this.initCascade();

    // 在设置之前就被已生成了displayjson
    if (config.initValue) {
      this.initPosition = this.getPositionByInitValue();
    }
    // 补全initPosition
    if (this.initPosition.length < this.sliderList.length) {
      const diff = this.sliderList.length - this.initPosition.length;
      for (let i = 0; i < diff; i++) {
        this.initPosition.push(0);
      }
    }
    if (this.isCascade) {
      this.initPosition.forEach((_, index) => {
        this.checkRange(index, this.initPosition);
      });
    } else {
      this.setCurDistance(this.initPosition);
    }

    // dom事件
    this.eventHandleMap = {
      cancelBtn: {
        event: "click",
        fn: () => {
          this.hide();
          this.config.cancel?.(this.curIndexArr, this.curValue, this);
          this.config.onCancel?.(this.curValue, this.curIndexArr, this);
        },
      },
      ensureBtn: {
        event: "click",
        fn: () => {
          this.hide();
          if (!this.optionHeight) {
            this.optionHeight =
              this.mobileSelect.querySelector("li")!.offsetHeight;
          }
          this.setTriggerInnerText(this.getConnectedString());
          this.curIndexArr = this.getIndexArr();
          this.curValue = this.getCurValue();
          this.config.callback?.(this.curIndexArr, this.curValue, this);
          this.config.onChange?.(this.curValue, this.curIndexArr, this);
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

    checkIsPC() &&
      (this.eventHandleMap.panel.event = ["mousedown", "mousemove", "mouseup"]);

    this.registerEvents("add");
    this.fixRowStyle(); // 修正列数
    config.autoFocus && this.show();
  }

  static checkDataType(wheelsData: CascadeData): boolean {
    return typeof wheelsData[0]?.data?.[0] === "object";
  }

  static REQUIRED_PARAMS = ["trigger", "wheels"] as (keyof CustomConfig)[];

  static checkRequiredConfig(config: CustomConfig): boolean {
    const requiredParams = MobileSelect.REQUIRED_PARAMS;
    if (!config) {
      const singleQuotesParams = requiredParams.map((item) => `'${item}'`);
      MobileSelect.log(
        "error",
        `missing required param ${singleQuotesParams.join(" and ")}.`
      );
      return false;
    }
    for (let i = 0; i < requiredParams.length; i++) {
      const key = requiredParams[i];
      if (!config[key]) {
        MobileSelect.log("error", `missing required param '${key}'.`);
        return false;
      }
    }
    return true;
  }
  static log(type: "error" | "info", tips: string): void {
    console[type]?.(`[mobile-select]: ${tips}`);
  }

  checkTriggerAvailable() {
    const { config } = this;
    // @ts-ignore
    this.trigger =
      config.trigger instanceof HTMLElement
        ? config.trigger
        : document.querySelector(config.trigger);
    if (!this.trigger) {
      MobileSelect.log(
        "error",
        "trigger HTMLElement does not found on your document."
      );
      return false;
    }
    return true;
  }

  /** 根据initValue 获取initPostion 需要区分级联和非级联情况 注意此时displayJson还没生成 */
  getPositionByInitValue(): number[] {
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

  getConnectedString() {
    let connectedStr = "";
    for (let i = 0; i < this.wheelList.length; i++) {
      i == this.wheelList.length - 1
        ? (connectedStr += this.getInnerText(i))
        : (connectedStr += this.getInnerText(i) + this.config.connector);
    }
    return connectedStr;
  }

  setTriggerInnerText(value: string) {
    if (this.config.triggerDisplayValue) {
      this.trigger.textContent = value;
    }
  }

  setValue(valList: string[] | number[] | CascadeData[]) {
    if (!valList || !valList.length) return;
    if (
      (this.isJsonType && typeof valList[0] !== "object") ||
      (!this.isJsonType && typeof valList[0] === "object")
    ) {
      MobileSelect.log(
        "error",
        `The setValue() input format should be same with getValue(), like: ${JSON.stringify(
          this.getValue()
        )}`
      );
      return;
    }
    const { keyMap } = this.config;
    valList.forEach((targetVal, sliderIndex) => {
      const sliderData = this.isCascade
        ? this.displayJson[sliderIndex]
        : this.wheelsData[sliderIndex]?.data;
      const targetIndex = sliderData?.findIndex(
        (item: string | number | CascadeData) => {
          return this.isJsonType
            ? (targetVal as CascadeData)[keyMap.id] ==
                (item as CascadeData)[keyMap.id] ||
                (targetVal as CascadeData)[keyMap.value] ==
                  (item as CascadeData)[keyMap.value]
            : targetVal == item;
        }
      );
      this.locatePosition(sliderIndex, targetIndex);
    });
    this.setTriggerInnerText(this.getConnectedString());
  }

  setTitle(title: string): void {
    this.mobileSelect.querySelector(".ms-title")!.innerHTML = title;
  }

  setStyle(config: MobileSelectConfig): void {
    if (config.ensureBtnColor) {
      this.ensureBtn.style.color = config.ensureBtnColor;
    }
    if (config.cancelBtnColor) {
      this.cancelBtn.style.color = config.cancelBtnColor;
    }
    if (config.titleColor) {
      const titleDom =
        this.mobileSelect.querySelector<HTMLDivElement>(".ms-title")!;
      titleDom.style.color = config.titleColor;
    }
    if (config.textColor) {
      this.panel = this.mobileSelect.querySelector(".ms-panel")!;
      this.panel.style.color = config.textColor;
    }
    if (config.titleBgColor) {
      const btnBar =
        this.mobileSelect.querySelector<HTMLDivElement>(".ms-btn-bar")!;
      btnBar.style.backgroundColor = config.titleBgColor;
    }
    if (config.bgColor) {
      this.panel = this.mobileSelect.querySelector(".ms-panel")!;
      const shadowMask =
        this.mobileSelect.querySelector<HTMLDivElement>(".ms-shadow-mask")!;
      this.panel.style.backgroundColor = config.bgColor;
      shadowMask.style.background =
        "linear-gradient(to bottom, " +
        config.bgColor +
        ", rgba(255, 255, 255, 0), " +
        config.bgColor +
        ")";
    }
    if (typeof config.maskOpacity === "number") {
      const grayMask =
        this.mobileSelect.querySelector<HTMLDivElement>(".ms-gray-layer")!;
      grayMask.style.background = "rgba(0, 0, 0, " + config.maskOpacity + ")";
    }
  }

  show(): void {
    this.mobileSelect.classList.add("ms-show");
    document.querySelector("body")?.classList.add("ms-show");
    if (typeof this.config.onShow === "function") {
      this.config.onShow?.(this.curValue, this.curIndexArr, this);
    }
  }

  hide(): void {
    this.mobileSelect.classList.remove("ms-show");
    document.querySelector("body")?.classList.remove("ms-show");
    if (typeof this.config.onHide === "function") {
      this.config.onHide?.(this.curValue, this.curIndexArr, this);
    }
  }

  registerEvents(type: "add" | "remove"): void {
    for (const [domName, item] of Object.entries(this.eventHandleMap)) {
      if (typeof item.event === "string") {
        (this[domName as keyof MobileSelect] as HTMLElement)[
          `${type}EventListener`
        ](item.event, item.fn as EventListener, { passive: false });
      } else {
        // 数组
        item.event.forEach((eventName) => {
          (this[domName as keyof MobileSelect] as HTMLElement)[
            `${type}EventListener`
          ](eventName, item.fn as EventListener, { passive: false });
        });
      }
    }
  }

  destroy(): void {
    this.registerEvents("remove");
    this.mobileSelect?.parentNode?.removeChild(this.mobileSelect);
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
        </div>`;
    document.body.appendChild(this.mobileSelect);

    // 根据数据来渲染wheels
    let tempHTML = "";
    for (let i = 0; i < wheelsData.length; i++) {
      // 列
      tempHTML += `<div class="ms-wheel" data-index="${i}"><ul class="ms-select-container">`;
      tempHTML += this.getOptionsHtmlStr(wheelsData[i].data);
      tempHTML += "</ul></div>";
    }
    this.mobileSelect.querySelector(".ms-wheels")!.innerHTML = tempHTML;
  }

  // 级联数据滚动时 右侧列数据的变化
  reRenderWheels(): void {
    const diff = this.wheelList.length - this.displayJson.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.wheelsContain.removeChild(
          this.wheelList[this.wheelList.length - 1]
        );
      }
    }
    for (let i = 0; i < this.displayJson.length; i++) {
      if (this.wheelList[i]) {
        this.sliderList[i].innerHTML = this.getOptionsHtmlStr(
          this.displayJson[i]
        );
      } else {
        const tempWheel = document.createElement("div");
        tempWheel.className = "ms-wheel";
        tempWheel.innerHTML = `<ul class="ms-select-container">${this.getOptionsHtmlStr(
          this.displayJson[i]
        )}</ul>`;
        tempWheel.setAttribute("data-index", i.toString());
        this.wheelsContain.appendChild(tempWheel);
      }
    }
  }

  checkCascade(): boolean {
    const { keyMap } = this.config;
    if (this.isJsonType) {
      const node = this.wheelsData[0].data;
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
        const nextNode =
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
    const deleteNum = this.displayJson.length - 1 - index;
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
    const tempPosArr = [...posIndexArr];
    let tempCount;
    if (this.sliderList.length > posIndexArr.length) {
      tempCount = this.sliderList.length - posIndexArr.length;
      for (let i = 0; i < tempCount; i++) {
        tempPosArr.push(0);
      }
    } else if (this.sliderList.length < posIndexArr.length) {
      tempCount = posIndexArr.length - this.sliderList.length;
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
      if (this.initPosition.length < this.sliderList.length) {
        const diff = this.sliderList.length - this.initPosition.length;
        for (let i = 0; i < diff; i++) {
          this.initPosition.push(0);
        }
      }
      this.setCurDistance(this.initPosition);
      this.fixRowStyle();
    }
  }

  updateWheel(
    sliderIndex: number,
    data: Omit<OptionData, "CascadeData">[]
  ): void {
    if (this.isCascade) {
      MobileSelect.log(
        "error",
        "'updateWheel()' not support cascade json data, please use 'updateWheels()' instead to update the whole data source"
      );
      return;
    }
    let tempHTML = "";
    tempHTML += this.getOptionsHtmlStr(data);
    this.wheelsData[sliderIndex] = this.isJsonType ? { data } : data;
    this.sliderList[sliderIndex].innerHTML = tempHTML;
  }

  fixRowStyle(): void {
    // 自定义列宽度比例 用width不用flex的原因是可以做transition过渡
    if (
      this.initColWidth.length &&
      this.initColWidth.length === this.wheelList.length
    ) {
      const widthSum = this.initColWidth.reduce((cur, pre) => cur + pre, 0);
      this.initColWidth.forEach((item, index) => {
        this.wheelList[index].style.width =
          ((item / widthSum) * 100).toFixed(2) + "%";
      });
      return;
    }
    const width = (100 / this.wheelList.length).toFixed(2);
    for (let i = 0; i < this.wheelList.length; i++) {
      this.wheelList[i].style.width = width + "%";
    }
  }

  getIndex(distance: number): number {
    return Math.round((2 * this.optionHeight - distance) / this.optionHeight);
  }

  getIndexArr(): number[] {
    const temp = [];
    for (let i = 0; i < this.curDistance.length; i++) {
      temp.push(this.getIndex(this.curDistance[i]));
    }
    return temp;
  }

  getCurValue(): string[] | number[] | CascadeData[] {
    const temp = [];
    const positionArr = this.getIndexArr();
    const { keyMap } = this.config;
    if (this.isCascade) {
      for (let i = 0; i < this.wheelList.length; i++) {
        const tempObj = this.displayJson[i][positionArr[i]];
        if (tempObj) {
          temp.push({
            [keyMap.id]: tempObj[keyMap.id],
            [keyMap.value]: tempObj[keyMap.value],
          });
        }
      }
    } else if (this.isJsonType) {
      for (let i = 0; i < this.curDistance.length; i++) {
        temp.push(this.wheelsData[i].data[this.getIndex(this.curDistance[i])]);
      }
    } else {
      for (let i = 0; i < this.curDistance.length; i++) {
        temp.push(this.getInnerText(i));
      }
    }
    return temp;
  }

  getValue(): string[] | number[] | CascadeData[] {
    return this.getCurValue();
  }

  calcDistance(index: number): number {
    return 2 * this.optionHeight - index * this.optionHeight;
  }

  setCurDistance(indexArr: number[]): void {
    const temp = [];
    for (let i = 0; i < this.sliderList.length; i++) {
      temp.push(this.calcDistance(indexArr[i]));
      this.movePosition(this.sliderList[i], temp[i]);
    }
    this.curDistance = temp;
  }

  fixPosition(distance: number): number {
    return -(this.getIndex(distance) - 2) * this.optionHeight;
  }

  movePosition(theSlider: HTMLElement, distance: number): void {
    theSlider.style.transform = "translate3d(0," + distance + "px, 0)";
  }

  locatePosition(sliderIndex: number, posIndex: number): void {
    if (sliderIndex === undefined || posIndex === undefined || posIndex < 0)
      return;

    this.curDistance[sliderIndex] = this.calcDistance(posIndex);
    this.movePosition(
      this.sliderList[sliderIndex],
      this.curDistance[sliderIndex]
    );
    if (this.isCascade) {
      this.checkRange(sliderIndex, this.getIndexArr());
    }
  }

  updateCurDistance(theSlider: HTMLElement, index: number): void {
    this.curDistance[index] = parseInt(theSlider.style.transform.split(",")[1]);
  }

  getInnerText(sliderIndex: number): string {
    const lengthOfList =
      this.sliderList[sliderIndex].getElementsByTagName("li").length;
    let index = this.getIndex(this.curDistance[sliderIndex]);

    if (index >= lengthOfList) {
      index = lengthOfList - 1;
    } else if (index < 0) {
      index = 0;
    }
    return (
      this.sliderList[sliderIndex].getElementsByTagName("li")[index]
        ?.textContent || ""
    );
  }

  touch(event: TouchEvent | MouseEvent): void {
    const path = event.composedPath && event.composedPath();
    const currentCol = path.find((domItem) => {
      return (domItem as HTMLElement).classList?.contains("ms-wheel");
    }) as HTMLElement;
    if (!currentCol) return;

    const theSlider = currentCol.firstChild as HTMLElement; // ul.select-container
    const index = parseInt(currentCol.getAttribute("data-index") || "0");
    switch (event.type) {
      case "touchstart":
      case "mousedown":
        theSlider.style.transition = "none 0s ease-out";
        this.startY = Math.floor(
          event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
        );
        this.preMoveY = this.startY;
        if (event.type === "mousedown") {
          this.enableClickStatus = true;
        }
        break;

      case "touchmove":
      case "mousemove":
        event.preventDefault();
        if (event.type === "mousemove" && !this.enableClickStatus) break;
        this.moveY = Math.floor(
          event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
        );
        this.offsetY = (this.moveY - this.preMoveY) * this.config.scrollSpeed;
        this.updateCurDistance(theSlider, index);
        this.curDistance[index] = this.curDistance[index] + this.offsetY;
        this.movePosition(theSlider, this.curDistance[index]);
        this.preMoveY = this.moveY;
        break;

      case "touchend":
      case "mouseup":
        theSlider.style.transition = "transform 0.18s ease-out";
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
          // offsetSum为0, 相当于点击事件 点击了中间的选项
          const clickOffetNum = Math.floor(
            (window.innerHeight - this.moveEndY) / 40
          );
          if (clickOffetNum != 2) {
            const tempOffset = clickOffetNum - 2;
            const newDistance =
              this.curDistance[index] + tempOffset * this.optionHeight;
            if (
              newDistance <= 2 * this.optionHeight &&
              newDistance >= this.oversizeBorder
            ) {
              this.curDistance[index] = newDistance;
              this.movePosition(theSlider, this.curDistance[index]);
              this.config.transitionEnd?.(
                this.getIndexArr(),
                this.getCurValue(),
                this
              );
              this.config.onTransitionEnd?.(
                this.getCurValue(),
                this.getIndexArr(),
                this
              );
            }
          }
        } else {
          // 修正位置
          this.updateCurDistance(theSlider, index);
          this.curDistance[index] = this.fixPosition(this.curDistance[index]);
          if (this.curDistance[index] > 2 * this.optionHeight) {
            this.curDistance[index] = 2 * this.optionHeight;
          } else if (this.curDistance[index] < this.oversizeBorder) {
            this.curDistance[index] = this.oversizeBorder;
          }
          this.movePosition(theSlider, this.curDistance[index]);

          this.config.transitionEnd?.(
            this.getIndexArr(),
            this.getCurValue(),
            this
          );
          this.config.onTransitionEnd?.(
            this.getCurValue(),
            this.getIndexArr(),
            this
          );
        }

        if (event.type === "mouseup") {
          this.enableClickStatus = false;
        }
        if (this.isCascade) {
          this.checkRange(index, this.getIndexArr());
        }

        break;
    }
  }
}
