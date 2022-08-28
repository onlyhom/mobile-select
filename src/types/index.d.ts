import MobileSelect from "../ms-core";

export type CascadeData = {
  [k: string]: any;
};
export interface CallbackFn {
  (
    curValue: string[] | number[] | CascadeData[],
    indexArr: number[],
    context: MobileSelect
  ): void;
}
export interface OldCallbackFn {
  (
    indexArr: number[],
    curValue: string[] | number[] | CascadeData[],
    context: MobileSelect
  ): void;
}

export type KeyMap = { id: string; value: string; childs: string };

export type OptionData = CascadeData | string | number;

export type CustomConfig = {
  /** 触发面板弹出的元素 */
  trigger: string | HTMLElement;

  /** 数据源 */
  wheels: CascadeData[];

  /** 选择完毕的回调函数 */
  onChange?: CallbackFn;

  /** 取消面板的回调函数 */
  onCancel?: CallbackFn;

  /** 滚动滚动完毕的回调函数 */
  onTransitionEnd?: CallbackFn;

  /** 显示面板 回调函数 */
  onShow?: CallbackFn;

  /** 隐藏面板 回调函数 */
  onHide?: CallbackFn;

  /** 初始值 传入后会自动计算出初始化滚动位置 */
  initValue?: string;

  /** 初始化滚动位置 */
  position?: number[];

  /** 轮子宽度比例 */
  colWidth?: number[];

  /** 组件标题 */
  title?: string;

  /** 拼接值的连接符 默认是空格 */
  connector?: string;

  /** 确认按钮 文案 */
  ensureBtnText?: string;

  /** 取消按钮 文案 */
  cancelBtnText?: string;

  /** 确认按钮 文字颜色 */
  ensureBtnColor?: string;

  /** 取消按钮 文字颜色 */
  cancelBtnColor?: string;

  /** 组件标题 文字颜色 */
  titleColor?: string;

  /** 组件标题 背景颜色 */
  titleBgColor?: string;

  /** 选项文字颜色 */
  textColor?: string;

  /** 遮罩背景色 */
  bgColor?: string;

  /** 遮罩层透明度 */
  maskOpacity?: number;

  /** 数据源, 用户自定义key */
  keyMap?: KeyMap;

  /** onChange后 是否修改trigger的innerText */
  triggerDisplayValue?: boolean;

  /** 是否自动拉起面板 */
  autoFocus?: boolean;

  /** 轮子滚动速度 默认为1 */
  scrollSpeed?: number;

  /** (即将废弃) 选择完毕的回调函数 */
  callback?: OldCallbackFn;

  /** (即将废弃) 取消面板的回调函数  */
  cancel?: OldCallbackFn;

  /** (即将废弃) 滚动滚动完毕的回调函数  */
  transitionEnd?: OldCallbackFn;

  /** (即将废弃) onChange后 是否修改trigger的innerText */
  triggerDisplayData?: boolean;
};

export type MobileSelectConfig = CustomConfig &
  Required<
    Pick<
      CustomConfig,
      | "keyMap"
      | "position"
      | "colWidth"
      | "title"
      | "connector"
      | "ensureBtnText"
      | "cancelBtnText"
      | "triggerDisplayValue"
      | "scrollSpeed"
    >
  >;
