export interface CallbackFn {
  (curValue?: number[] | string[], indexArr?: number[], context?: any): void;
}
export interface OldCallbackFn {
  (indexArr?: number[], curValue?: number[] | string[], context?: any): void;
}

export type KeyMap = { id: string; value: string; childs: string };

export type CascadeData = {
  [k: string]: any;
};

export type OptionData = CascadeData | string | number;

export type CustomConfig = {
  trigger: string | HTMLElement;
  wheels: CascadeData[];
  /** 兼容旧版本 */
  callback?: OldCallbackFn;
  cancel?: OldCallbackFn;
  transitionEnd?: OldCallbackFn;
  triggerDisplayData?: boolean;
  /** 新版本 */
  onChange?: CallbackFn;
  onCancel?: CallbackFn;
  onTransitionEnd?: CallbackFn;
  /** *********** */
  onShow?: CallbackFn;
  onHide?: CallbackFn;
  initValue?: string;
  position?: number[];
  colWidth?: number[];
  /** 组件标题 */
  title?: string;
  /** 拼接值的连接符 */
  connector?: string;
  ensureBtnText?: string;
  cancelBtnText?: string;
  ensureBtnColor?: string;
  cancelBtnColor?: string;
  titleColor?: string;
  titleBgColor?: string;
  textColor?: string;
  bgColor?: string;
  maskOpacity?: number;
  keyMap?: KeyMap;
  triggerDisplayValue?: boolean;
  autoFocus?: boolean;
  scrollSpeed?: number;
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
