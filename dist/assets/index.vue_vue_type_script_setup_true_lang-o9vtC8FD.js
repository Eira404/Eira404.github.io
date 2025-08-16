import { L as defineComponent, a as resolveComponent, c as createBlock, o as openBlock, U as withCtx, P as createBaseVNode, T as toDisplayString, Q as createVNode, S as unref, W as ElIcon, ad as arrow_right_bold_default, O as createElementBlock, a0 as Fragment, $ as renderList } from "./vendor-BgHGR-g1.js";
const _hoisted_1$1 = { class: "flex gap-4 items-cente" };
const _hoisted_2 = { class: "flex gap-1 items-center text-gray-600 dark:text-gray-400" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "item",
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const MONTHS_3L = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createBlock(_component_router_link, {
        class: "py-3 px-4 flex justify-between items-center text-sm border border-black/20 dark:border-white/20 hover:bg-black/3 dark:hover:bg-white/5 hover:text-moonlight-500 rounded-xl transition-all duration-150",
        to: { name: "article", params: { articlePath: __props.article.path } }
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$1, [
            createBaseVNode("div", _hoisted_2, toDisplayString(MONTHS_3L[__props.article.created.getMonth()]) + " " + toDisplayString(__props.article.created.getDate()) + " , " + toDisplayString(__props.article.created.getFullYear()), 1),
            createBaseVNode("div", null, toDisplayString(__props.article.title), 1)
          ]),
          createBaseVNode("div", null, [
            createVNode(unref(ElIcon), null, {
              default: withCtx(() => [
                createVNode(unref(arrow_right_bold_default))
              ]),
              _: 1
            })
          ])
        ]),
        _: 1
      }, 8, ["to"]);
    };
  }
});
const _hoisted_1 = { class: "flex flex-col gap-4 px-10 w-full" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    articles: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.articles, (a) => {
          return openBlock(), createBlock(_sfc_main$1, {
            key: a.id,
            article: a
          }, null, 8, ["article"]);
        }), 128))
      ]);
    };
  }
});
export {
  _sfc_main as _
};
//# sourceMappingURL=index.vue_vue_type_script_setup_true_lang-o9vtC8FD.js.map
