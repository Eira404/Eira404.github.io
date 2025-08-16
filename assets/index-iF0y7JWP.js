import { _ as _sfc_main$c } from "./index.vue_vue_type_script_setup_true_lang-BI24m_Pg.js";
import { M as MyFooter } from "./index-DEuCoe8Z.js";
import { L as defineComponent, O as createElementBlock, P as createBaseVNode, Q as createVNode, R as renderSlot, U as withCtx, S as unref, o as openBlock, ag as ElScrollbar, d as ref, a4 as normalizeClass, T as toDisplayString, f as computed, w as watch, ae as onMounted, af as onBeforeUnmount, ac as normalizeStyle, a0 as Fragment, $ as renderList, c as createBlock, W as ElIcon, ah as user_default, a3 as document_add_default, a5 as document_default, ai as useRoute, a as resolveComponent, aj as arrow_left_default, Z as arrow_right_default, Y as createTextVNode, ak as link_default, al as price_tag_default, am as collection_default, an as connection_default, ao as back_default, ap as right_default, X as createCommentVNode } from "./vendor-BgHGR-g1.js";
import { u as useElfland, f as formatDate, _ as _export_sfc } from "./index-DDpQ9fFd.js";
import "./katex-BD1oMWSA.js";
import "./echarts-CzUZ8isT.js";
import "./zrender-B2Ai5H0D.js";
const _hoisted_1$a = { class: "sticky top-0 z-10 w-full box-content" };
const _hoisted_2$7 = { class: "h-14" };
const _hoisted_3$7 = { class: "w-[340px] fixed top-0 bottom-0 left-0 h-full" };
const _hoisted_4$6 = { class: "pl-[340px] block" };
const _hoisted_5$3 = { class: "flex w-full" };
const _hoisted_6$3 = { style: { "width": "calc(100% - 340px)" } };
const _hoisted_7 = { class: "w-[340px]" };
const _hoisted_8 = {
  style: { "height": "calc(100vh - 56px)" },
  class: "sticky top-16"
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "article",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("div", _hoisted_1$a, [
          createBaseVNode("div", _hoisted_2$7, [
            createVNode(_sfc_main$c)
          ])
        ]),
        createBaseVNode("div", _hoisted_3$7, [
          renderSlot(_ctx.$slots, "left")
        ]),
        createBaseVNode("main", _hoisted_4$6, [
          createBaseVNode("div", _hoisted_5$3, [
            createBaseVNode("div", _hoisted_6$3, [
              renderSlot(_ctx.$slots, "main")
            ]),
            createBaseVNode("div", _hoisted_7, [
              createBaseVNode("div", _hoisted_8, [
                createVNode(unref(ElScrollbar), { height: "100%" }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "right")
                  ]),
                  _: 3
                })
              ])
            ])
          ]),
          createBaseVNode("div", null, [
            createVNode(MyFooter)
          ])
        ])
      ]);
    };
  }
});
const _hoisted_1$9 = ["href", "title"];
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "item",
  props: {
    data: {},
    active: { type: Boolean }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const pld = [
      "pl-0",
      // 0
      "pl-0",
      "pl-4",
      "pl-8",
      "pl-12",
      "pl-16",
      "pl-20"
    ];
    const pl = pld[props.data.l] || "pl-20";
    const a = ref(null);
    const top = () => {
      return a.value ? a.value.offsetTop : 0;
    };
    __expose({ top });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        ref_key: "a",
        ref: a,
        href: _ctx.data.a,
        class: normalizeClass([[_ctx.active ? "text-moonlight-500" : "", unref(pl)], "hover:text-moonlight-500 transition-all duration-150 cursor-pointer truncate py-1"]),
        title: _ctx.data.n
      }, toDisplayString(_ctx.data.n), 11, _hoisted_1$9);
    };
  }
});
const _hoisted_1$8 = { class: "flex flex-col relative p-12" };
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    const elfland = useElfland();
    const articleIns = elfland.article;
    const toc = articleIns.rendererMdToc;
    const activePath = ref("");
    const activeIndex = ref(-1);
    const tocItemRefs = ref([]);
    const activePromptDisplay = computed(() => {
      return activeIndex.value !== -1;
    });
    const activePromptTop = computed(() => {
      if (activePromptDisplay.value === false) return 50;
      const item2 = tocItemRefs.value[activeIndex.value];
      if (!item2) return 50;
      return item2.top() + 4 + 2;
    });
    const watchHandle = watch(toc, () => {
      setTimeout(() => {
        refresh();
        handleScroll();
      }, 0);
    });
    let headings = [];
    const refresh = () => {
      headings = Array.from(document.querySelectorAll(".markdown-body :is(h1,h2,h3,h4,h5,h6)[id]")).map((el) => el.childNodes[0]).filter((el) => el instanceof HTMLAnchorElement);
    };
    const handleScroll = () => {
      let closest = null;
      let index = -1;
      const min = 90;
      headings.forEach((h, i) => {
        const top = h.getBoundingClientRect().top;
        if (top < min) {
          closest = h;
          index = i;
        }
      });
      activePath.value = closest !== null ? closest.getAttribute("href") : "";
      activeIndex.value = index;
    };
    onMounted(() => {
      refresh();
      handleScroll();
      window.addEventListener("scroll", handleScroll);
    });
    onBeforeUnmount(() => {
      watchHandle();
      window.removeEventListener("scroll", handleScroll);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$8, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "mb-4" }, [
          createBaseVNode("span", null, "Content")
        ], -1)),
        createBaseVNode("div", {
          class: "absolute w-[4px] h-[20px] bg-moonlight-500 transition-all duration-150 rounded-2xl pointer-none left-[30px]",
          style: normalizeStyle({ top: activePromptTop.value + "px", opacity: activePromptDisplay.value ? 1 : 0 })
        }, null, 4),
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(toc), (t, i) => {
          return openBlock(), createBlock(_sfc_main$a, {
            ref_for: true,
            ref_key: "tocItemRefs",
            ref: tocItemRefs,
            key: i,
            data: t,
            active: t.a === activePath.value
          }, null, 8, ["data", "active"]);
        }), 128))
      ]);
    };
  }
});
const _hoisted_1$7 = { class: "flex flex-col p-12 gap-4 cursor-default pb-0" };
const _hoisted_2$6 = { class: "text-3xl text-center font-bold font-[kaiti,serif]" };
const _hoisted_3$6 = {
  class: "text-lg flex gap-2 items-center justify-center font-bold font-[kaiti,serif]",
  title: "作者"
};
const _hoisted_4$5 = { class: "flex gap-4 items-center justify-center" };
const _hoisted_5$2 = {
  class: "flex gap-1 items-center",
  title: "创建时间"
};
const _hoisted_6$2 = {
  class: "flex gap-1 items-center",
  title: "修改时间"
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "articleHeader",
  setup(__props) {
    const elfland = useElfland();
    const articleIns = elfland.article;
    const article = articleIns.article;
    if (article.value === null) throw new Error("article is null");
    const title = computed(() => article.value.title);
    const author = computed(() => article.value.author);
    const created = computed(() => new Date(article.value.created));
    const modified = computed(() => new Date(article.value.modified));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createBaseVNode("div", _hoisted_2$6, [
          createBaseVNode("span", null, toDisplayString(title.value), 1)
        ]),
        createBaseVNode("div", _hoisted_3$6, [
          createVNode(unref(ElIcon), null, {
            default: withCtx(() => [
              createVNode(unref(user_default))
            ]),
            _: 1
          }),
          createBaseVNode("span", null, toDisplayString(author.value), 1)
        ]),
        createBaseVNode("div", _hoisted_4$5, [
          createBaseVNode("div", _hoisted_5$2, [
            createVNode(unref(ElIcon), null, {
              default: withCtx(() => [
                createVNode(unref(document_add_default))
              ]),
              _: 1
            }),
            createBaseVNode("span", null, toDisplayString(unref(formatDate)(created.value)), 1)
          ]),
          createBaseVNode("div", _hoisted_6$2, [
            createVNode(unref(ElIcon), null, {
              default: withCtx(() => [
                createVNode(unref(document_default))
              ]),
              _: 1
            }),
            createBaseVNode("span", null, toDisplayString(unref(formatDate)(modified.value)), 1)
          ])
        ])
      ]);
    };
  }
});
const _sfc_main$7 = {};
const _hoisted_1$6 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 496 512"
};
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$6, _cache[0] || (_cache[0] = [
    createBaseVNode("path", {
      fill: "currentColor",
      d: "M245.8 214.9l-33.2 17.3c-9.4-19.6-25.2-20-27.4-20-22.2 0-33.3 14.6-33.3 43.9 0 23.5 9.2 43.8 33.3 43.8 14.4 0 24.6-7 30.5-21.3l30.6 15.5a73.2 73.2 0 01-65.1 39c-22.6 0-74-10.3-74-77 0-58.7 43-77 72.6-77 30.8-.1 52.7 11.9 66 35.8zm143 0l-32.7 17.3c-9.5-19.8-25.7-20-27.9-20-22.1 0-33.2 14.6-33.2 43.9 0 23.5 9.2 43.8 33.2 43.8 14.5 0 24.7-7 30.5-21.3l31 15.5c-2 3.8-21.3 39-65 39-22.7 0-74-9.9-74-77 0-58.7 43-77 72.6-77C354 179 376 191 389 214.8zM247.7 8C104.7 8 0 123 0 256c0 138.4 113.6 248 247.6 248C377.5 504 496 403 496 256 496 118 389.4 8 247.6 8zm.8 450.8c-112.5 0-203.7-93-203.7-202.8 0-105.5 85.5-203.3 203.8-203.3A201.7 201.7 0 01451.3 256c0 121.7-99.7 202.9-202.9 202.9z"
    }, null, -1)
  ]));
}
const c = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render]]);
const _hoisted_1$5 = { class: "flex flex-col p-12 gap-8 cursor-default pt-0" };
const _hoisted_2$5 = { class: "flex flex-col gap-2 p-4 px-8 rounded-r-2xl border-l-4 border-elysia-500 bg-elysia-500/10 relative overflow-hidden" };
const _hoisted_3$5 = ["href"];
const _hoisted_4$4 = { class: "flex justify-between items-center" };
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "articleFooter",
  setup(__props) {
    const route = useRoute();
    const elfland = useElfland();
    const articleIns = elfland.article;
    const article = articleIns.article;
    if (article.value === null) throw new Error("article is null");
    const title = computed(() => article.value.title);
    const author = computed(() => article.value.author);
    const prev = computed(() => article.value.prev);
    const next = computed(() => article.value.next);
    const path = computed(() => window.location.protocol + "//" + window.location.host + route.path);
    const srollToTop = () => {
      window.scrollTo(0, 0);
    };
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        createBaseVNode("div", _hoisted_2$5, [
          createBaseVNode("div", null, [
            _cache[0] || (_cache[0] = createBaseVNode("span", null, "本文作者：", -1)),
            createBaseVNode("span", null, toDisplayString(author.value), 1)
          ]),
          createBaseVNode("div", null, [
            _cache[1] || (_cache[1] = createBaseVNode("span", null, "本文题目：", -1)),
            createBaseVNode("span", null, toDisplayString(title.value), 1)
          ]),
          createBaseVNode("div", null, [
            _cache[2] || (_cache[2] = createBaseVNode("span", null, "本文链接：", -1)),
            createBaseVNode("a", {
              href: path.value,
              target: "_blank"
            }, toDisplayString(decodeURIComponent(path.value)), 9, _hoisted_3$5)
          ]),
          _cache[3] || (_cache[3] = createBaseVNode("div", null, [
            createBaseVNode("span", null, "版权声明："),
            createBaseVNode("span", null, "本博客所有文章除特别声明外，均默认采用 CC BY-NC-SA 许可协议。")
          ], -1)),
          createVNode(c, { class: "absolute -z-10 h-[120%] right-[-20px] top-1/2 -translate-y-1/2 text-elysia-500/80" })
        ]),
        createBaseVNode("div", _hoisted_4$4, [
          createBaseVNode("div", {
            class: "flex justify-center items-center",
            onClick: srollToTop
          }, [
            createVNode(_component_router_link, {
              to: { name: "article", params: { articlePath: prev.value.path } },
              title: prev.value.title,
              class: "px-[12px] py-[6px] flex justify-center items-center gap-2 border border-black/40 dark:border-white/40 rounded-lg hover:border-moonlight-500 transition-all duration-150 hover:text-moonlight-500"
            }, {
              default: withCtx(() => [
                createVNode(unref(ElIcon), null, {
                  default: withCtx(() => [
                    createVNode(unref(arrow_left_default))
                  ]),
                  _: 1
                }),
                _cache[4] || (_cache[4] = createBaseVNode("span", { class: "text-lg" }, "Prev", -1))
              ]),
              _: 1,
              __: [4]
            }, 8, ["to", "title"])
          ]),
          createBaseVNode("div", {
            class: "flex justify-center items-center",
            onClick: srollToTop
          }, [
            createVNode(_component_router_link, {
              to: { name: "article", params: { articlePath: next.value.path } },
              title: next.value.title,
              class: "px-[12px] py-[6px] flex justify-center items-center gap-2 border border-black/40 dark:border-white/40 rounded-lg hover:border-moonlight-500 transition-all duration-150 hover:text-moonlight-500"
            }, {
              default: withCtx(() => [
                _cache[5] || (_cache[5] = createBaseVNode("span", { class: "text-lg" }, "Next", -1)),
                createVNode(unref(ElIcon), null, {
                  default: withCtx(() => [
                    createVNode(unref(arrow_right_default))
                  ]),
                  _: 1
                })
              ]),
              _: 1,
              __: [5]
            }, 8, ["to", "title"])
          ])
        ])
      ]);
    };
  }
});
const _hoisted_1$4 = { class: "relative" };
const _hoisted_2$4 = { class: "markdown-body" };
const _hoisted_3$4 = ["innerHTML"];
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    const elfland = useElfland();
    const articleIns = elfland.article;
    const md = articleIns.renderedMd;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        createVNode(_sfc_main$8),
        createBaseVNode("div", _hoisted_2$4, [
          createBaseVNode("article", { innerHTML: unref(md) }, null, 8, _hoisted_3$4)
        ]),
        createVNode(_sfc_main$6)
      ]);
    };
  }
});
const _hoisted_1$3 = { class: "mb-4" };
const _hoisted_2$3 = {
  key: 0,
  class: "flex items-center justify-between"
};
const _hoisted_3$3 = { class: "text-gray-600 dark:text-gray-400" };
const _hoisted_4$3 = {
  key: 1,
  class: "flex items-center justify-between"
};
const _hoisted_5$1 = { class: "text-gray-600 dark:text-gray-400" };
const _hoisted_6$1 = { class: "flex flex-col gap-2" };
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "links",
  props: {
    in: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const props = __props;
    const elfland = useElfland();
    const articleIns = elfland.article;
    const linksIns = elfland.links;
    const article = articleIns.article;
    if (article.value === null) throw new Error("article is null");
    const links = computed(() => linksIns.getLinks(article.value.id));
    if (links.value === void 0) throw new Error("links is undefined");
    const linksOut = computed(() => links.value.out);
    const linksIn = computed(() => links.value.in);
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("div", _hoisted_1$3, [
          props.in ? (openBlock(), createElementBlock("div", _hoisted_2$3, [
            _cache[0] || (_cache[0] = createBaseVNode("span", null, "链接当前笔记", -1)),
            createBaseVNode("span", _hoisted_3$3, toDisplayString(linksIn.value.length), 1)
          ])) : (openBlock(), createElementBlock("div", _hoisted_4$3, [
            _cache[1] || (_cache[1] = createBaseVNode("span", null, "当前笔记中的链接", -1)),
            createBaseVNode("span", _hoisted_5$1, toDisplayString(linksOut.value.length), 1)
          ]))
        ]),
        createBaseVNode("div", _hoisted_6$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(props.in ? linksIn.value : linksOut.value, (d, i) => {
            return openBlock(), createElementBlock("div", {
              key: i,
              class: "text-sm text-gray-600 dark:text-gray-400 hover:text-moonlight-500 transition-all duration-150",
              onClick: scrollToTop
            }, [
              createVNode(_component_router_link, {
                to: d.path,
                class: "w-full flex items-center gap-2"
              }, {
                default: withCtx(() => [
                  createVNode(unref(ElIcon), null, {
                    default: withCtx(() => [
                      createVNode(unref(link_default))
                    ]),
                    _: 1
                  }),
                  createTextVNode(" " + toDisplayString(d.title), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ]);
          }), 128))
        ])
      ]);
    };
  }
});
const _hoisted_1$2 = { class: "mb-4" };
const _hoisted_2$2 = { class: "flex items-center justify-between" };
const _hoisted_3$2 = { class: "text-gray-600 dark:text-gray-400" };
const _hoisted_4$2 = { class: "flex flex-col gap-2" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "tags",
  setup(__props) {
    const elfland = useElfland();
    const articleIns = elfland.article;
    const article = articleIns.article;
    if (article.value === null) throw new Error("article is null");
    const tags = computed(() => article.value.tags);
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("div", _hoisted_1$2, [
          createBaseVNode("div", _hoisted_2$2, [
            _cache[0] || (_cache[0] = createBaseVNode("span", null, "当前笔记的标签", -1)),
            createBaseVNode("span", _hoisted_3$2, toDisplayString(tags.value.length), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_4$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(tags.value, (t, i) => {
            return openBlock(), createElementBlock("div", {
              key: i,
              class: "text-sm text-gray-600 dark:text-gray-400 hover:text-moonlight-500 transition-all duration-150"
            }, [
              createVNode(_component_router_link, {
                to: { name: "tags", query: { tag: t.tag } },
                class: "w-full flex items-center gap-2"
              }, {
                default: withCtx(() => [
                  createVNode(unref(ElIcon), null, {
                    default: withCtx(() => [
                      createVNode(unref(price_tag_default))
                    ]),
                    _: 1
                  }),
                  createTextVNode(" " + toDisplayString(t.tag), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ]);
          }), 128))
        ])
      ]);
    };
  }
});
const _hoisted_1$1 = { class: "mb-4" };
const _hoisted_2$1 = { class: "flex items-center justify-between" };
const _hoisted_3$1 = { class: "text-gray-600 dark:text-gray-400" };
const _hoisted_4$1 = { class: "flex flex-col gap-2" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "categories",
  setup(__props) {
    const elfland = useElfland();
    const articleIns = elfland.article;
    const article = articleIns.article;
    if (article.value === null) throw new Error("article is null");
    const categories = computed(() => article.value.categories);
    const categoriesList = computed(() => {
      const res = [];
      let path = "";
      const dfs = (category) => {
        path += category.category + "/";
        res.push({
          category: category.category,
          path
        });
        if (category.child) dfs(category.child);
      };
      dfs(categories.value);
      res[res.length - 1].path = res[res.length - 1].path.slice(0, -1);
      return res;
    });
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("div", _hoisted_1$1, [
          createBaseVNode("div", _hoisted_2$1, [
            _cache[0] || (_cache[0] = createBaseVNode("span", null, "当前笔记的分类", -1)),
            createBaseVNode("span", _hoisted_3$1, toDisplayString(categoriesList.value.length), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_4$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(categoriesList.value, (c2, i) => {
            return openBlock(), createElementBlock("div", {
              key: i,
              class: "text-sm text-gray-600 dark:text-gray-400 hover:text-moonlight-500 transition-all duration-150"
            }, [
              createVNode(_component_router_link, {
                to: { name: "categories", query: { category: c2.path } },
                class: "w-full flex items-center gap-2"
              }, {
                default: withCtx(() => [
                  createVNode(unref(ElIcon), null, {
                    default: withCtx(() => [
                      createVNode(unref(collection_default))
                    ]),
                    _: 1
                  }),
                  createTextVNode(" " + toDisplayString(c2.category), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ]);
          }), 128))
        ])
      ]);
    };
  }
});
const _hoisted_1 = { class: "pt-18 h-full" };
const _hoisted_2 = { class: "h-full" };
const _hoisted_3 = { class: "flex w-full items-center justify-center" };
const _hoisted_4 = { class: "w-[24px] h-[24px] relative block" };
const _hoisted_5 = { class: "w-[24px] h-[24px] relative block" };
const _hoisted_6 = { class: "p-12 pt-8" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    const elfland = useElfland();
    const articleIns = elfland.article;
    const article = articleIns.article;
    if (article.value === null) throw new Error("文章不存在");
    const activeName = ref("in");
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createVNode(_component_router_link, {
              class: "flex cursor-pointer items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out",
              to: { name: "links" },
              title: "文章关系图谱"
            }, {
              default: withCtx(() => [
                createVNode(unref(ElIcon), { size: 24 }, {
                  default: withCtx(() => [
                    createVNode(unref(connection_default))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createBaseVNode("div", {
              class: normalizeClass(["flex cursor-pointer items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out", { "text-moonlight-500": activeName.value === "in" }]),
              title: "反向链接",
              onClick: _cache[0] || (_cache[0] = ($event) => activeName.value = "in")
            }, [
              createBaseVNode("div", _hoisted_4, [
                createVNode(unref(ElIcon), { size: 24 }, {
                  default: withCtx(() => [
                    createVNode(unref(link_default))
                  ]),
                  _: 1
                }),
                createVNode(unref(ElIcon), {
                  size: 12,
                  class: "!absolute left-[14px] bottom-[-2px]"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(back_default))
                  ]),
                  _: 1
                })
              ])
            ], 2),
            createBaseVNode("div", {
              class: normalizeClass(["flex cursor-pointer relative items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out", { "text-moonlight-500": activeName.value === "out" }]),
              title: "出链",
              onClick: _cache[1] || (_cache[1] = ($event) => activeName.value = "out")
            }, [
              createBaseVNode("div", _hoisted_5, [
                createVNode(unref(ElIcon), { size: 24 }, {
                  default: withCtx(() => [
                    createVNode(unref(link_default))
                  ]),
                  _: 1
                }),
                createVNode(unref(ElIcon), {
                  size: 12,
                  class: "!absolute left-[14px] bottom-[-2px]"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(right_default))
                  ]),
                  _: 1
                })
              ])
            ], 2),
            createBaseVNode("div", {
              class: normalizeClass(["flex cursor-pointer relative items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out", { "text-moonlight-500": activeName.value === "tags" }]),
              title: "标签",
              onClick: _cache[2] || (_cache[2] = ($event) => activeName.value = "tags")
            }, [
              createVNode(unref(ElIcon), { size: 24 }, {
                default: withCtx(() => [
                  createVNode(unref(price_tag_default))
                ]),
                _: 1
              })
            ], 2),
            createBaseVNode("div", {
              class: normalizeClass(["flex cursor-pointer relative items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out", { "text-moonlight-500": activeName.value === "categories" }]),
              title: "分类",
              onClick: _cache[3] || (_cache[3] = ($event) => activeName.value = "categories")
            }, [
              createVNode(unref(ElIcon), { size: 24 }, {
                default: withCtx(() => [
                  createVNode(unref(collection_default))
                ]),
                _: 1
              })
            ], 2)
          ]),
          createVNode(unref(ElScrollbar), { height: "100%" }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_6, [
                activeName.value === "in" ? (openBlock(), createBlock(_sfc_main$4, {
                  key: 0,
                  in: true
                })) : activeName.value === "out" ? (openBlock(), createBlock(_sfc_main$4, {
                  key: 1,
                  in: false
                })) : activeName.value === "tags" ? (openBlock(), createBlock(_sfc_main$3, { key: 2 })) : activeName.value === "categories" ? (openBlock(), createBlock(_sfc_main$2, { key: 3 })) : createCommentVNode("", true)
              ])
            ]),
            _: 1
          })
        ])
      ]);
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$b, null, {
        left: withCtx(() => [
          createVNode(_sfc_main$1)
        ]),
        main: withCtx(() => [
          createVNode(_sfc_main$5)
        ]),
        right: withCtx(() => [
          createVNode(_sfc_main$9)
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=index-iF0y7JWP.js.map
