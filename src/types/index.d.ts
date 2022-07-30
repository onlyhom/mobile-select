export interface CallbackFn {
  (indexArr?: number[], curValue?: number[] | string[]): void;
}

export type KeyMap = { id: string; value: string; childs: string };

export type CascadeData = {
  [k: string]: any;
};

export type OptionData = CascadeData | string | number;

export type MobileSelectConfig = {
  trigger: string | HTMLElement;
  wheels: CascadeData[];
  /** 兼容旧版本 */
  callback?: CallbackFn;
  cancel?: CallbackFn;
  transitionEnd?: CallbackFn;
  /** 新版本事件回调 */
  onChange?: CallbackFn;
  onCancel?: CallbackFn;
  onTransitionEnd?: CallbackFn;
  /** *********** */
  onShow?: CallbackFn;
  onHide?: CallbackFn;
  initValue: string;
  position?: number[];
  colWidth?: number[];
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
  triggerDisplayData?: boolean;
};
