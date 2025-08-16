import { L as defineComponent, O as createElementBlock, o as openBlock, a0 as Fragment, $ as renderList, ai as useRoute, a as resolveComponent, Q as createVNode, U as withCtx, Y as createTextVNode, T as toDisplayString, a4 as normalizeClass, S as unref, a8 as withDirectives, ab as vShow, W as ElIcon, aq as sunny_default, ar as moon_default, P as createBaseVNode } from "./vendor-BgHGR-g1.js";
import { u as useElfland, _ as _export_sfc } from "./index-DDpQ9fFd.js";
const _hoisted_1$3 = { class: "h-full flex gap-4 items-center" };
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "links",
  setup(__props) {
    const route = useRoute();
    const navList = [
      ["主页", "/", "home"],
      ["归档", "/archives", "archives"],
      ["标签", "/tags", "tags"],
      ["分类", "/categories", "categories"],
      ["关系图", "/links", "links"]
      // ['关于', '/about', 'about']
    ];
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        (openBlock(), createElementBlock(Fragment, null, renderList(navList, (nav, i) => {
          return createVNode(_component_router_link, {
            key: i,
            to: nav[1],
            class: normalizeClass(["hover:text-moonlight-500 transition-all h-full flex items-center box-border border-b-2 border-transparent", { "border-b-2 !border-moonlight-500": unref(route).matched.find((item) => item.name === nav[2]) !== void 0 }])
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(nav[0]), 1)
            ]),
            _: 2
          }, 1032, ["to", "class"]);
        }), 64))
      ]);
    };
  }
});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "theme",
  setup(__props) {
    const elfland = useElfland();
    const ins = elfland.theme;
    const theme = elfland.theme.theme;
    function change() {
      ins.toggle();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: "flex items-center cursor-pointer",
        onClick: change
      }, [
        withDirectives(createVNode(unref(ElIcon), { size: "24" }, {
          default: withCtx(() => [
            createVNode(unref(sunny_default))
          ]),
          _: 1
        }, 512), [
          [vShow, unref(theme) === "light"]
        ]),
        withDirectives(createVNode(unref(ElIcon), { size: "24" }, {
          default: withCtx(() => [
            createVNode(unref(moon_default))
          ]),
          _: 1
        }, 512), [
          [vShow, unref(theme) === "dark"]
        ])
      ]);
    };
  }
});
const _sfc_main$2 = {};
const _hoisted_1$2 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24"
};
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createBaseVNode("path", {
      fill: "currentColor",
      "fill-rule": "evenodd",
      d: "M11.999 1C5.926 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437c.55.102.75-.238.75-.53c0-.26-.009-.952-.014-1.87c-3.06.664-3.706-1.475-3.706-1.475c-.5-1.27-1.221-1.61-1.221-1.61c-.999-.681.075-.668.075-.668c1.105.078 1.685 1.134 1.685 1.134c.981 1.68 2.575 1.195 3.202.914c.1-.71.384-1.195.698-1.47c-2.442-.278-5.01-1.222-5.01-5.437c0-1.2.428-2.183 1.132-2.952c-.114-.278-.491-1.397.108-2.91c0 0 .923-.297 3.025 1.127A10.5 10.5 0 0 1 12 6.32a10.5 10.5 0 0 1 2.754.37c2.1-1.424 3.022-1.128 3.022-1.128c.6 1.514.223 2.633.11 2.911c.705.769 1.13 1.751 1.13 2.952c0 4.226-2.572 5.156-5.022 5.428c.395.34.747 1.01.747 2.037c0 1.47-.014 2.657-.014 3.017c0 .295.199.637.756.53C19.851 20.979 23 16.859 23 12c0-6.075-4.926-11-11.001-11"
    }, null, -1)
  ]));
}
const githubIcon = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render]]);
const _hoisted_1$1 = {
  href: "https://github.com/Eira404/Eira404.github.io",
  target: "_blank",
  class: "hover:text-moonlight-500 transition-all"
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "github",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", _hoisted_1$1, [
        createVNode(githubIcon)
      ]);
    };
  }
});
const _hoisted_1 = { class: "w-full h-full flex items-center justify-center pr-6 pl-6 border-b border-black/20 dark:border-white/20 backdrop-blur-lg" };
const _hoisted_2 = { class: "flex items-center justify-between w-full max-w-[1200px] h-full" };
const _hoisted_3 = { class: "flex items-center gap-4 h-full" };
const _hoisted_4 = { class: "flex items-center gap-4 select-none" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createVNode(_sfc_main$4)
          ]),
          createBaseVNode("div", _hoisted_4, [
            createVNode(_sfc_main$3),
            createVNode(_sfc_main$1)
          ])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as _
};
//# sourceMappingURL=index.vue_vue_type_script_setup_true_lang-BI24m_Pg.js.map
