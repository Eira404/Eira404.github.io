import { _ as _sfc_main$c } from "./index.vue_vue_type_script_setup_true_lang-BI24m_Pg.js";
import { M as MyFooter } from "./index-DEuCoe8Z.js";
import { L as defineComponent, O as createElementBlock, o as openBlock, P as createBaseVNode, Q as createVNode, R as renderSlot, S as unref, T as toDisplayString, U as withCtx, V as location_default, W as ElIcon, a as resolveComponent, X as createCommentVNode, Y as createTextVNode, Z as arrow_right_default, f as computed, c as createBlock, $ as renderList, a0 as Fragment, a1 as video_play_default, a2 as magic_stick_default } from "./vendor-BgHGR-g1.js";
import { u as useElfland, _ as _export_sfc, P as Project } from "./index-DDpQ9fFd.js";
import { _ as _sfc_main$d } from "./index.vue_vue_type_script_setup_true_lang-o9vtC8FD.js";
import "./katex-BD1oMWSA.js";
import "./echarts-CzUZ8isT.js";
import "./zrender-B2Ai5H0D.js";
const _hoisted_1$a = { class: "fixed top-0 z-10 w-full box-content" };
const _hoisted_2$4 = { class: "h-14" };
const _hoisted_3$3 = { class: "max-w-[1200px] mx-auto" };
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "home",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("div", _hoisted_1$a, [
          createBaseVNode("div", _hoisted_2$4, [
            createVNode(_sfc_main$c)
          ])
        ]),
        createBaseVNode("div", _hoisted_3$3, [
          renderSlot(_ctx.$slots, "main")
        ]),
        createVNode(MyFooter)
      ]);
    };
  }
});
const _hoisted_1$9 = { class: "p-10 flex flex-col gap-5" };
const _hoisted_2$3 = { class: "flex justify-center items-center" };
const _hoisted_3$2 = ["src"];
const _hoisted_4$2 = { class: "flex flex-col items-center gap-4" };
const _hoisted_5$1 = { class: "text-3xl font-bold" };
const _hoisted_6$1 = { class: "flex gap-4 items-center" };
const _hoisted_7$1 = { class: "flex gap-1 items-center" };
const _hoisted_8$1 = ["href"];
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "welcome",
  setup(__props) {
    const elfland = useElfland();
    const about = elfland.about;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$9, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("img", {
            src: unref(about).avater.value,
            alt: "",
            class: "w-[120px] h-[120px] rounded-full"
          }, null, 8, _hoisted_3$2)
        ]),
        createBaseVNode("div", _hoisted_4$2, [
          createBaseVNode("div", null, [
            createBaseVNode("span", _hoisted_5$1, toDisplayString(unref(about).name.value), 1)
          ]),
          createBaseVNode("div", _hoisted_6$1, [
            createBaseVNode("div", _hoisted_7$1, [
              createVNode(unref(ElIcon), { size: 20 }, {
                default: withCtx(() => [
                  createVNode(unref(location_default))
                ]),
                _: 1
              }),
              createBaseVNode("span", null, toDisplayString(unref(about).position.value), 1)
            ]),
            createBaseVNode("a", {
              href: unref(about).github.value,
              target: "_blank",
              class: "flex gap-1 items-center hover:text-moonlight-500 transition-all duration-150"
            }, [
              createVNode(unref(ElIcon), { size: 20 }, {
                default: withCtx(() => _cache[0] || (_cache[0] = [
                  createBaseVNode("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24",
                    width: "24",
                    height: "24"
                  }, [
                    createBaseVNode("g", { fill: "currentColor" }, [
                      createBaseVNode("path", { d: "m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" }),
                      createBaseVNode("path", {
                        fill: "currentColor",
                        d: "M6.315 6.176c-.25-.638-.24-1.367-.129-2.034a6.8 6.8 0 0 1 2.12 1.07c.28.214.647.283.989.18A9.3 9.3 0 0 1 12 5c.961 0 1.874.14 2.703.391c.342.104.709.034.988-.18a6.8 6.8 0 0 1 2.119-1.07c.111.667.12 1.396-.128 2.033c-.15.384-.075.826.208 1.14C18.614 8.117 19 9.04 19 10c0 2.114-1.97 4.187-5.134 4.818c-.792.158-1.101 1.155-.495 1.726c.389.366.629.882.629 1.456v3a1 1 0 0 0 2 0v-3c0-.57-.12-1.112-.334-1.603C18.683 15.35 21 12.993 21 10c0-1.347-.484-2.585-1.287-3.622c.21-.82.191-1.646.111-2.28c-.071-.568-.17-1.312-.57-1.756c-.595-.659-1.58-.271-2.28-.032a9 9 0 0 0-2.125 1.045A11.4 11.4 0 0 0 12 3c-.994 0-1.953.125-2.851.356a9 9 0 0 0-2.125-1.045c-.7-.24-1.686-.628-2.281.031c-.408.452-.493 1.137-.566 1.719l-.005.038c-.08.635-.098 1.462.112 2.283C3.484 7.418 3 8.654 3 10c0 2.992 2.317 5.35 5.334 6.397A4 4 0 0 0 8 17.98l-.168.034c-.717.099-1.176.01-1.488-.122c-.76-.322-1.152-1.133-1.63-1.753c-.298-.385-.732-.866-1.398-1.088a1 1 0 0 0-.632 1.898c.558.186.944 1.142 1.298 1.566c.373.448.869.916 1.58 1.218c.682.29 1.483.393 2.438.276V21a1 1 0 0 0 2 0v-3c0-.574.24-1.09.629-1.456c.607-.572.297-1.568-.495-1.726C6.969 14.187 5 12.114 5 10c0-.958.385-1.881 1.108-2.684c.283-.314.357-.756.207-1.14"
                      })
                    ])
                  ], -1)
                ])),
                _: 1,
                __: [0]
              }),
              _cache[1] || (_cache[1] = createBaseVNode("span", null, "GitHub", -1))
            ], 8, _hoisted_8$1)
          ])
        ])
      ]);
    };
  }
});
const _hoisted_1$8 = { class: "flex flex-col gap-y-5 md:flex-row md:gap-y-0" };
const _hoisted_2$2 = { class: "text-xl font-semibold md:min-w-36" };
const _hoisted_3$1 = { class: "flex flex-1 flex-col gap-y-3" };
const _hoisted_4$1 = {
  key: 0,
  class: "flex items-center justify-end px-10"
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "default",
  props: {
    title: {
      type: String,
      required: true
    },
    more: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    prompt: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("section", _hoisted_1$8, [
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("h2", null, toDisplayString(__props.title), 1)
        ]),
        createBaseVNode("div", _hoisted_3$1, [
          renderSlot(_ctx.$slots, "main"),
          __props.more ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
            createVNode(_component_router_link, {
              to: { name: __props.name },
              class: "px-2 py-1 flex items-center gap-2 border border-black/30 dark:border-white/30 rounded-xl hover:bg-black/3 dark:hover:bg-white/5 hover:text-moonlight-500 transition-all duration-150"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(__props.prompt) + " ", 1),
                createVNode(unref(ElIcon), null, {
                  default: withCtx(() => [
                    createVNode(unref(arrow_right_default))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["to"])
          ])) : createCommentVNode("", true)
        ])
      ]);
    };
  }
});
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "articles",
  setup(__props) {
    const elfland = useElfland();
    const articlesIns = elfland.articles;
    const articles = computed(() => articlesIns.articles.value.slice(0, 10));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$9, {
        title: "Posts",
        more: true,
        name: "archives",
        prompt: "More posts"
      }, {
        main: withCtx(() => [
          createVNode(_sfc_main$d, { articles: articles.value }, null, 8, ["articles"])
        ]),
        _: 1
      });
    };
  }
});
const _hoisted_1$7 = { class: "px-10 pt-1 leading-5 flex flex-col gap-2" };
const _hoisted_2$1 = ["innerHTML"];
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "about",
  setup(__props) {
    const elfland = useElfland();
    const aboutIns = elfland.about;
    const about = aboutIns.about;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$9, {
        title: "About",
        more: false,
        name: "about",
        prompt: "More about me"
      }, {
        main: withCtx(() => [
          createBaseVNode("div", _hoisted_1$7, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(about), (a, i) => {
              return openBlock(), createElementBlock("p", {
                key: i,
                innerHTML: a
              }, null, 8, _hoisted_2$1);
            }), 128))
          ])
        ]),
        _: 1
      });
    };
  }
});
const _sfc_main$6 = {};
const _hoisted_1$6 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "32",
  height: "32",
  viewBox: "0 0 24 24"
};
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$6, _cache[0] || (_cache[0] = [
    createBaseVNode("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
    }, null, -1)
  ]));
}
const github = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$1]]);
const _sfc_main$5 = {};
const _hoisted_1$5 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "32",
  height: "32",
  viewBox: "0 0 24 24"
};
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$5, _cache[0] || (_cache[0] = [
    createBaseVNode("path", {
      fill: "currentColor",
      d: "M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
    }, null, -1)
  ]));
}
const web = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render]]);
const _hoisted_1$4 = ["href"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "icon",
  props: {
    type: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        href: __props.path,
        target: "_blank",
        class: "flex hover:bg-black/3 dark:hover:bg-white/5 border border-black/20 dark:border-white/20 rounded-full w-[40px] h-[40px] justify-center items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
      }, [
        createVNode(unref(ElIcon), { size: 24 }, {
          default: withCtx(() => [
            __props.type === "github" ? (openBlock(), createBlock(github, { key: 0 })) : __props.type === "url" ? (openBlock(), createBlock(web, { key: 1 })) : __props.type === "video" ? (openBlock(), createBlock(unref(video_play_default), { key: 2 })) : __props.type === "arxiv" ? (openBlock(), createBlock(unref(magic_stick_default), { key: 3 })) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ], 8, _hoisted_1$4);
    };
  }
});
const _hoisted_1$3 = { class: "flex flex-col gap-3 p-4 border border-black/20 dark:border-white/20 rounded-xl" };
const _hoisted_2 = ["innerHTML"];
const _hoisted_3 = { key: 0 };
const _hoisted_4 = ["innerHTML"];
const _hoisted_5 = {
  key: 1,
  class: "text-gray-600 dark:text-gray-400 text-sm flex flex-wrap gap-2"
};
const _hoisted_6 = ["innerHTML"];
const _hoisted_7 = {
  key: 2,
  class: "text-gray-600 dark:text-gray-400 text-sm break-words flex flex-wrap gap-2"
};
const _hoisted_8 = ["href"];
const _hoisted_9 = ["innerHTML"];
const _hoisted_10 = { key: 3 };
const _hoisted_11 = ["innerHTML"];
const _hoisted_12 = { class: "flex gap-2 items-center" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "item",
  props: {
    project: {
      type: Project,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", null, [
          createBaseVNode("span", {
            class: "text-xl",
            innerHTML: __props.project.name
          }, null, 8, _hoisted_2)
        ]),
        __props.project.author ? (openBlock(), createElementBlock("div", _hoisted_3, [
          createBaseVNode("span", {
            class: "text-gray-600 dark:text-gray-400 text-sm break-words",
            innerHTML: __props.project.author
          }, null, 8, _hoisted_4)
        ])) : createCommentVNode("", true),
        __props.project.role ? (openBlock(), createElementBlock("div", _hoisted_5, [
          _cache[0] || (_cache[0] = createBaseVNode("span", null, "角色:", -1)),
          createBaseVNode("span", {
            innerHTML: __props.project.role
          }, null, 8, _hoisted_6)
        ])) : createCommentVNode("", true),
        __props.project.contributors ? (openBlock(), createElementBlock("div", _hoisted_7, [
          _cache[1] || (_cache[1] = createBaseVNode("span", null, "贡献者:", -1)),
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.project.contributors, (c) => {
            return openBlock(), createElementBlock("a", {
              key: c,
              href: c,
              target: "_blank",
              class: "hover:underline hover:text-moonlight-500"
            }, toDisplayString(c), 9, _hoisted_8);
          }), 128))
        ])) : createCommentVNode("", true),
        createBaseVNode("div", null, [
          createBaseVNode("p", {
            class: "leading-5 text-sm",
            innerHTML: __props.project.description
          }, null, 8, _hoisted_9)
        ]),
        __props.project.notes ? (openBlock(), createElementBlock("div", _hoisted_10, [
          createBaseVNode("p", {
            class: "leading-5 text-sm text-gray-600 dark:text-gray-400",
            innerHTML: __props.project.notes
          }, null, 8, _hoisted_11)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_12, [
          __props.project.github ? (openBlock(), createBlock(_sfc_main$4, {
            key: 0,
            type: "github",
            path: __props.project.github
          }, null, 8, ["path"])) : createCommentVNode("", true),
          __props.project.url ? (openBlock(), createBlock(_sfc_main$4, {
            key: 1,
            type: "url",
            path: __props.project.url
          }, null, 8, ["path"])) : createCommentVNode("", true),
          __props.project.video ? (openBlock(), createBlock(_sfc_main$4, {
            key: 2,
            type: "video",
            path: __props.project.video
          }, null, 8, ["path"])) : createCommentVNode("", true),
          __props.project.arxiv ? (openBlock(), createBlock(_sfc_main$4, {
            key: 3,
            type: "arxiv",
            path: __props.project.arxiv
          }, null, 8, ["path"])) : createCommentVNode("", true)
        ])
      ]);
    };
  }
});
const _hoisted_1$2 = { class: "flex flex-col gap-4" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    projects: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.projects, (p) => {
          return openBlock(), createBlock(_sfc_main$3, {
            key: p.name,
            project: p
          }, null, 8, ["project"]);
        }), 128))
      ]);
    };
  }
});
const _hoisted_1$1 = { class: "px-10 pt-1 leading-5 flex flex-col gap-2" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "projects",
  setup(__props) {
    const elfland = useElfland();
    const projectsIns = elfland.projects;
    const projects = projectsIns.pinnedProjects;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$9, {
        title: "Projects",
        more: true,
        name: "about",
        prompt: "More projects"
      }, {
        main: withCtx(() => [
          createBaseVNode("div", _hoisted_1$1, [
            createVNode(_sfc_main$2, { projects: unref(projects) }, null, 8, ["projects"])
          ])
        ]),
        _: 1
      });
    };
  }
});
const _hoisted_1 = { class: "flex flex-col gap-4 w-full p-20" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$b, null, {
        main: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode(_sfc_main$a),
            createVNode(_sfc_main$7),
            createVNode(_sfc_main$8),
            createVNode(_sfc_main$1)
          ])
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CVwujSA1.js.map
