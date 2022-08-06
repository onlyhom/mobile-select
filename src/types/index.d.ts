export interface CallbackFn {
  (indexArr?: number[], curValue?: number[] | string[]): void;
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
  callback?: CallbackFn;
  cancel?: CallbackFn;
  transitionEnd?: CallbackFn;
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
    >
  >;
