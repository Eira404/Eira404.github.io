import { L as defineComponent, f as computed, a as resolveComponent, c as createBlock, o as openBlock, ac as normalizeStyle, U as withCtx, P as createBaseVNode, T as toDisplayString, O as createElementBlock, a8 as withDirectives, a0 as Fragment, $ as renderList, S as unref, ab as vShow, Q as createVNode, a7 as sort_default, a4 as normalizeClass, W as ElIcon } from "./vendor-BgHGR-g1.js";
import { T as Tag, u as useElfland } from "./index-DDpQ9fFd.js";
import { _ as _sfc_main$3 } from "./index.vue_vue_type_script_setup_true_lang-o9vtC8FD.js";
import { _ as _sfc_main$4 } from "./default.vue_vue_type_script_setup_true_lang-DI8PXNdx.js";
import "./katex-BD1oMWSA.js";
import "./echarts-CzUZ8isT.js";
import "./zrender-B2Ai5H0D.js";
import "./index.vue_vue_type_script_setup_true_lang-BI24m_Pg.js";
import "./index-DEuCoe8Z.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "tag",
  props: {
    tag: {
      type: Tag,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const elfland = useElfland();
    const theme = elfland.theme;
    function calculateColor(min, max, startColor, endColor, currentValue) {
      if (currentValue <= min) return startColor;
      if (currentValue >= max) return endColor;
      function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) {
          throw new Error(`无效的颜色格式: ${hex}`);
        }
        return {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        };
      }
      function rgbToHex(r2, g2, b2) {
        return "#" + [r2, g2, b2].map((x) => {
          const hex = Math.round(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        }).join("");
      }
      const startRGB = hexToRgb(startColor);
      const endRGB = hexToRgb(endColor);
      const ratio = (currentValue - min) / (max - min);
      const r = startRGB.r + (endRGB.r - startRGB.r) * ratio;
      const g = startRGB.g + (endRGB.g - startRGB.g) * ratio;
      const b = startRGB.b + (endRGB.b - startRGB.b) * ratio;
      return rgbToHex(r, g, b);
    }
    function calculateFontSize(min, max, startSize, endSize, currentValue) {
      if (currentValue <= min) return startSize;
      if (currentValue >= max) return endSize;
      const ratio = (currentValue - min) / (max - min);
      return startSize + (endSize - startSize) * ratio;
    }
    const color = computed(() => {
      const t = theme.theme.value;
      if (t === "light") return calculateColor(1, 40, "#4a5565", "#4fadff", props.tag.size);
      else return calculateColor(1, 40, "#99a1af", "#4fadff", props.tag.size);
    });
    const size = computed(() => {
      return calculateFontSize(1, 40, 16, 32, props.tag.size) + "px";
    });
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createBlock(_component_router_link, {
        to: { name: "tags", query: { tag: __props.tag.tag } },
        style: normalizeStyle({ color: color.value, fontSize: size.value }),
        class: "p-2 hover:!text-moonlight-500 hover:underline transition-all duration-150"
      }, {
        default: withCtx(() => [
          createBaseVNode("span", null, toDisplayString(__props.tag.tag), 1)
        ]),
        _: 1
      }, 8, ["to", "style"]);
    };
  }
});
const _hoisted_1 = { class: "flex flex-col gap-4 p-12" };
const _hoisted_2 = { class: "p-8 pt-0 flex flex-wrap gap-2" };
const _hoisted_3 = { class: "flex justify-center items-center" };
const _hoisted_4 = ["title"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    const elfland = useElfland();
    const tagsIns = elfland.tags;
    const tags = tagsIns.tags;
    const sortedArticels = tagsIns.sortedArticels;
    const sortIsAsc = tagsIns.sortIsAsc;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(tags), (t) => {
            return openBlock(), createBlock(_sfc_main$2, {
              key: t.tag,
              tag: t
            }, null, 8, ["tag"]);
          }), 128))
        ]),
        withDirectives(createBaseVNode("div", _hoisted_3, [
          createBaseVNode("div", {
            class: "p-3 flex hover:text-moonlight-500 transition-all duration-150 border rounded-xl border-black/30 dark:border-white/30 select-none cursor-pointer",
            title: unref(sortIsAsc) ? "升序" : "降序",
            onClick: _cache[0] || (_cache[0] = ($event) => sortIsAsc.value = !unref(sortIsAsc))
          }, [
            createVNode(unref(ElIcon), {
              size: 20,
              class: normalizeClass(["transition-all duration-150", [{ "-scale-x-100": unref(sortIsAsc) }]])
            }, {
              default: withCtx(() => [
                createVNode(unref(sort_default))
              ]),
              _: 1
            }, 8, ["class"])
          ], 8, _hoisted_4)
        ], 512), [
          [vShow, unref(sortedArticels).length]
        ]),
        createBaseVNode("div", null, [
          createVNode(_sfc_main$3, { articles: unref(sortedArticels) }, null, 8, ["articles"])
        ])
      ]);
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$4, null, {
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
//# sourceMappingURL=index-Jyv-rpE2.js.map
