import { _ as _sfc_main$3 } from "./index.vue_vue_type_script_setup_true_lang-BI24m_Pg.js";
import { L as defineComponent, O as createElementBlock, P as createBaseVNode, Q as createVNode, R as renderSlot, o as openBlock, d as ref, ae as onMounted, af as onBeforeUnmount, c as createBlock, U as withCtx } from "./vendor-BgHGR-g1.js";
import { u as useElfland } from "./index-DDpQ9fFd.js";
import "./katex-BD1oMWSA.js";
import "./echarts-CzUZ8isT.js";
import "./zrender-B2Ai5H0D.js";
const _hoisted_1 = { class: "w-full h-screen" };
const _hoisted_2 = { class: "sticky top-0 z-10 w-full box-content" };
const _hoisted_3 = { class: "h-14" };
const _hoisted_4 = {
  class: "w-full",
  style: { "height": "calc(100vh - 56px)" }
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "links",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createVNode(_sfc_main$3)
          ])
        ]),
        createBaseVNode("div", _hoisted_4, [
          renderSlot(_ctx.$slots, "main")
        ])
      ]);
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    const elfland = useElfland();
    const links = elfland.links;
    const chart = ref(null);
    onMounted(() => {
      if (chart.value) links.render(chart.value);
    });
    onBeforeUnmount(() => {
      links.distory();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "chart",
        ref: chart,
        class: "w-full h-full"
      }, null, 512);
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$2, null, {
        main: withCtx(() => [
          createVNode(_sfc_main$1)
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DBW4qZU3.js.map
