import MobileSelect from "../src/index";

describe("add", () => {
  document.body.innerHTML = '<div id="trigger"></div>';

  const msInstance = new MobileSelect({
    trigger: "#trigger",
    wheels: [
      { data: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] },
    ],
    initValue: "周一",
  });

  test("config initValue is workable", () => {
    expect(msInstance.getPositionByValue()).toEqual([1]);
  });
});
