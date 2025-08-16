const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CVwujSA1.js","assets/index.vue_vue_type_script_setup_true_lang-BI24m_Pg.js","assets/vendor-BgHGR-g1.js","assets/katex-BD1oMWSA.js","assets/vendor-BnHerdAp.css","assets/index-DEuCoe8Z.js","assets/index.vue_vue_type_script_setup_true_lang-o9vtC8FD.js","assets/echarts-CzUZ8isT.js","assets/zrender-B2Ai5H0D.js","assets/index-OBWDFH6D.js","assets/default.vue_vue_type_script_setup_true_lang-DI8PXNdx.js","assets/index-BOYaEA6F.js","assets/index-Jyv-rpE2.js","assets/index-DBW4qZU3.js","assets/AboutView-qxLs32CJ.js","assets/index-iF0y7JWP.js"])))=>i.map(i=>d[i]);
import { a as resolveComponent, c as createBlock, o as openBlock, E as EventEmitter, b as ElMessage, d as ref, w as watch, e as reactive, f as computed, g as container_plugin, h as emoji_plugin, i as b, M as MarkdownItTocDoneRight, j as footnote_plugin, k as abbr_plugin, s as sub_plugin, l as sup_plugin, m as ee, H as HighlightJS, n as javascript, t as typescript, p as css, x as xml, q as c, u as cmake, v as cpp, y as markdown, z as json, A as latex, B as python, C as yaml, D as hljsDefineVue, F as MarkdownIt, G as Clipboard, N as NProgress, I as createRouter, J as createWebHistory, K as createApp } from "./vendor-BgHGR-g1.js";
import { u as use, i as init$1, a as install, b as install$1, c as install$2, d as install$3, e as install$4, f as install$5 } from "./echarts-CzUZ8isT.js";
import { M as MarkdownItKatex } from "./katex-BD1oMWSA.js";
import "./zrender-B2Ai5H0D.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {};
function _sfc_render(_ctx, _cache) {
  const _component_router_view = resolveComponent("router-view");
  return openBlock(), createBlock(_component_router_view);
}
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p$1) => Promise.resolve(p$1).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
class RouterPromise {
  static getQueryData(to, queryList) {
    const res = [];
    queryList.forEach((key) => {
      res.push([key, to.query[key]]);
    });
    return res;
  }
  static checkQueryData(queryData, checkList, func) {
    return false;
  }
  __promises = [];
  __checkFunctions = [];
  __precheckFunctions = [];
  __postcheckFunctions = [];
  router;
  constructor(router2) {
    this.router = router2;
  }
  /**
   * 注册一个每次路由跳转前都会执行的函数
   * 返回一个Promise代表是否需要加载数据
   *
   * @param func 函数
   * @param context 函数上下文
   * @param level 运行顺序，越大越靠后
   */
  addCheck(func, context, level = 0) {
    const fd = {
      func,
      context,
      level
    };
    this.__checkFunctions.push(fd);
    this.__checkFunctions.sort((a, b2) => a.level - b2.level);
  }
  /**
   * 预检查函数
   * @param func
   * @param context
   * @param level
   */
  addPrecheck(func, context, level = 0) {
    const fd = {
      func,
      context,
      level
    };
    this.__precheckFunctions.push(fd);
    this.__precheckFunctions.sort((a, b2) => a.level - b2.level);
  }
  /**
   * 后检查函数
   * @param func
   * @param context
   * @param level
   */
  addPostcheck(func, context, level = 0) {
    const fd = {
      func,
      context,
      level
    };
    this.__postcheckFunctions.push(fd);
    this.__postcheckFunctions.sort((a, b2) => a.level - b2.level);
  }
  /**
   * 移除一个注册的函数
   *
   * @param func 函数
   * @param context 函数上下文
   */
  removeCheck(func, context) {
    this.__checkFunctions = this.__checkFunctions.filter(
      (fd) => fd.func !== func || fd.context !== context
    );
  }
  removePrecheck(func, context) {
    this.__precheckFunctions = this.__precheckFunctions.filter(
      (fd) => fd.func !== func || fd.context !== context
    );
  }
  removePostcheck(func, context) {
    this.__postcheckFunctions = this.__postcheckFunctions.filter(
      (fd) => fd.func !== func || fd.context !== context
    );
  }
  /**
   * 为下次路由跳转添加一个需要等待的Promise
   *
   * @param p Promise对象
   */
  addPromise(p) {
    this.__promises.push(p);
  }
  /**
   * 路由跳转前守卫触发
   * 接收跳转信息
   * 返回Promise等待跳转
   *
   * @param to 路由信息
   * @param from 路由信息
   * @param next next
   */
  async check(to, from, next) {
    this.__checkFunctions.forEach((fd) => {
      this.__promises.push(fd.func.call(fd.context, to, from));
    });
    try {
      const resList = await Promise.all(this.__promises);
      for (let i = 0; i < resList.length; i++) {
        const res = resList[i];
        if (res) {
          this.__promises = [];
          next(res);
          return false;
        }
      }
    } catch (err) {
      throw new Error("Error " + err);
    }
    return true;
  }
  /**
   * 路由进入触发，在wait之前
   * @param to
   * @param from
   * @param next
   * @returns
   */
  precheck(to, from, next) {
    const resList = [];
    this.__precheckFunctions.forEach((fd) => {
      resList.push(fd.func.call(fd.context, to, from));
    });
    return this.syncFuncCheck(resList, next);
  }
  /**
   * 路由跳转后守卫触发
   * 清空所有添加的Promise
   *
   */
  postcheck(to, from) {
    this.__postcheckFunctions.forEach((fd) => {
      fd.func.call(fd.context, to, from);
    });
    this.__promises = [];
  }
  syncFuncCheck(resList, next) {
    for (let i = 0; i < resList.length; i++) {
      const res = resList[i];
      if (res) {
        if (res[0] === "success") {
          continue;
        } else if (res[0] === "redirect") {
          next(res[1]);
          return false;
        }
      }
    }
    return true;
  }
}
function localGet(key, defaultValue, checkFunc, type) {
  type = type || "default";
  type = type.toLocaleLowerCase();
  if (defaultValue !== void 0 && defaultValue !== null && window.localStorage.getItem(key) === null) {
    localSet(key, defaultValue, type);
  }
  switch (type) {
    case "default":
      return window.localStorage.getItem(key);
    case "json":
      return JSON.parse(window.localStorage.getItem(key) || "");
    default:
      throw new Error(`不可接受的type:${type}`);
  }
}
function localSet(key, value, type) {
  type = type || "default";
  type = type.toLocaleLowerCase();
  switch (type) {
    case "default":
      return window.localStorage.setItem(key, value);
    case "json":
      return window.localStorage.setItem(key, JSON.stringify(value).toString());
    default:
      throw new Error(`不可接受的type:${type}`);
  }
}
class LRUCache extends Map {
  capacity;
  deleteCallback;
  constructor(capacity, deleteCallback) {
    super();
    this.capacity = capacity || 100;
    this.deleteCallback = deleteCallback || null;
  }
  set(key, value) {
    if (this.has(key)) {
      this.delete(key);
    } else {
      if (this.size >= this.capacity) {
        this.delete(this.keys().next().value);
      }
    }
    return super.set(key, value);
  }
  get(key) {
    if (this.has(key)) {
      const value = super.get(key);
      super.delete(key);
      super.set(key, value);
      return value;
    } else return void 0;
  }
  delete(key) {
    if (this.deleteCallback && this.has(key)) this.deleteCallback(key, super.get(key));
    return super.delete(key);
  }
}
const defaultSelectorListOptions = {
  childrenEvent: false
};
class SelectorItem extends EventEmitter {
  selector;
  element;
  select;
  event;
  trigger;
  option;
  onEvent_;
  constructor(selector, element, select, event, trigger, option) {
    super();
    this.selector = selector;
    this.element = element;
    this.select = select;
    this.event = event;
    this.trigger = trigger;
    this.option = option || defaultSelectorListOptions;
    this.onEvent_ = this.onEvent.bind(this);
    this.element.addEventListener(this.event, this.onEvent_);
  }
  onEvent(e) {
    if (e.target !== this.element && !this.option.childrenEvent) return;
    e.preventDefault();
    this.selector.onEvent(this.element, this.event, this.select, e, this.trigger);
  }
  destroy() {
    this.element.removeEventListener(this.event, this.onEvent_);
  }
}
class Selector extends EventEmitter {
  selectList;
  root;
  /**
   * 校验
   * 防止reselect事件回调触发
   */
  destroyed = false;
  map;
  observer;
  config;
  constructor(selectList, root, config) {
    super();
    const MutationObserver2 = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    this.selectList = selectList || [];
    this.root = root || document.body;
    this.map = /* @__PURE__ */ new Map();
    this.observer = new MutationObserver2((mutationsList, observer) => {
      this.reselect(false);
    });
    this.config = config || { childList: true, subtree: true };
    this.observer.observe(this.root, this.config);
    this.select();
  }
  /**
   * 更新选择列表，并重新选择
   * @param {Array} selectList 选择列表
   */
  updateSelectList(selectList) {
    this.selectList = selectList;
    this.reselect(true);
  }
  /**
   * 销毁选择器实例
   */
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    const selectorItemLists = Array.from(this.map.values());
    selectorItemLists.forEach((selectorItemList) => {
      selectorItemList.forEach((selectorItem) => {
        selectorItem.destroy();
      });
    });
    this.observer.disconnect();
    this.map.clear();
    this.removeAllListeners();
  }
  /**
   * 选择标签
   */
  select() {
    setTimeout(() => {
      if (this.destroyed) return;
      this.selectList.forEach((item) => {
        const event = item[0];
        const select = item[1];
        const trigger = item[2];
        const options = item[3];
        const elements = Array.from(document.querySelectorAll(select));
        elements.forEach((element) => {
          const selectorItem = new SelectorItem(this, element, select, event, trigger, options);
          if (!this.map.has(element)) this.map.set(element, []);
          this.map.get(element)?.push(selectorItem);
        });
      });
    }, 0);
  }
  /**
   * 重新选择
   */
  reselect(force = false) {
    setTimeout(() => {
      if (this.destroyed) {
        return;
      }
      if (force === true) {
        const selectorItemLists = Array.from(this.map.values());
        selectorItemLists.forEach((selectorItemList) => {
          selectorItemList.forEach((selectorItem) => {
            selectorItem.destroy();
          });
        });
        this.map.clear();
      }
      const tempMap = /* @__PURE__ */ new Map();
      const visitedElements = /* @__PURE__ */ new Set();
      this.selectList.forEach((item) => {
        const event = item[0];
        const select = item[1];
        const trigger = item[2];
        const options = item[3];
        const elements2 = Array.from(document.querySelectorAll(select));
        elements2.forEach((element) => {
          visitedElements.add(element);
          if (this.map.has(element)) return;
          const selectorItem = new SelectorItem(this, element, select, event, trigger, options);
          if (!tempMap.has(element)) tempMap.set(element, []);
          tempMap.get(element).push(selectorItem);
        });
      });
      this.map = new Map([...this.map, ...tempMap]);
      const elements = Array.from(this.map.keys());
      elements.forEach((element) => {
        if (!document.contains(element) || !visitedElements.has(element)) {
          const selectorItemList = this.map.get(element) || [];
          selectorItemList.forEach((selectorItem) => {
            selectorItem.destroy();
          });
          this.map.delete(element);
        }
      });
    }, 0);
  }
  /**
   * SelectorItem实例触发后的回调函数
   *
   * @param {HTMLElement} element html元素
   * @param {String} event 事件触发名字
   * @param {String} select querySelectorAll对应的选择方法
   * @param {Object} e 事件获取的事件对象
   * @param {String} trigger 触发器名字
   */
  onEvent(element, event, select, e, trigger) {
    const data = { element, event, select, e };
    this.emit(trigger, data);
  }
}
function message(msg, type, duration) {
  type = type || "error";
  duration = duration || (type === "error" ? 4e3 : 3e3);
  ElMessage({
    message: msg,
    type,
    duration
  });
}
function deepClone(target, stack) {
  function getType(obj) {
    const map = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regExp",
      "[object Undefined]": "undefined",
      "[object Null]": "null",
      "[object Object]": "object"
    };
    if (obj instanceof Element) {
      return "element";
    }
    return map[Object.prototype.toString.call(obj)] || "unknown";
  }
  const type = getType(target);
  if (type === "array" || type === "object") {
    stack || (stack = /* @__PURE__ */ new WeakMap());
    const stacked = stack.get(target);
    if (stacked) {
      return stacked;
    }
    if (type === "array") {
      const _clone = [];
      target.forEach((element) => {
        _clone.push(deepClone(element, stack));
      });
      stack.set(target, _clone);
      return _clone;
    }
    if (type === "object") {
      const _clone = {};
      for (const key in target) {
        if (Object.hasOwnProperty.call(target, key)) {
          const element = target[key];
          _clone[key] = deepClone(element, stack);
        }
      }
      stack.set(target, _clone);
      return _clone;
    }
  } else {
    return target;
  }
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function generateRandomStringBase(characters_) {
  const idMap = /* @__PURE__ */ new Map();
  idMap.set("", true);
  return function(length = 10) {
    let result = "";
    const length_ = length;
    const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;
    while (idMap.get(result) === true) {
      for (let i = 0; i < length_; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    }
    idMap.set(result, true);
    return result;
  };
}
class ElflandAddon {
  __elfland;
  constructor(elfland2) {
    this.__elfland = elfland2;
    elfland2.on("logout", this.logoutCallback, this);
  }
  /**
   * 去往的页面的name是否是输入的name
   * @param to RouteLocationNormalized
   * @param name string
   * @returns boolean
   */
  is(to, name) {
    return to.name === name;
  }
  /**
   * 去往的页面的路由是否包含输入的name
   * @param to RouteLocationNormalized
   * @param name string
   * @returns boolean
   */
  includes(to, name) {
    return to.matched.find((item) => item.name === name) !== void 0;
  }
}
class Theme extends ElflandAddon {
  static KEY = "THEME";
  theme = ref("light");
  constructor(elfland2) {
    super(elfland2);
    let t = localGet(Theme.KEY, "light");
    t = t === "light" ? "light" : "dark";
    localSet("THEME", t);
    this.theme.value = t;
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      this.__elfland.emit("theme-change", "dark");
    }
    watch(this.theme, (newValue) => {
      newValue = newValue === "light" ? "light" : "dark";
      this.__elfland.emit("theme-change", newValue);
      if (newValue === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localSet(Theme.KEY, newValue);
    });
  }
  toggle() {
    this.theme.value = this.theme.value === "light" ? "dark" : "light";
  }
  logoutCallback() {
  }
}
class DefPromiseHelper {
  __promise;
  __ee;
  __state = 0;
  /**
   * 无实际意义
   */
  get state() {
    return this.__state;
  }
  /**
   * 校验promise
   */
  get promise() {
    return this.__promise;
  }
  constructor() {
    this.__ee = new EventEmitter();
    this.__promise = new Promise((resolve, reject) => {
      this.__ee.on("resolve", () => {
        resolve();
      });
      this.__ee.on("reject", () => {
        reject();
      });
    });
    this.__state = 1;
  }
  /**
   * 用resolve来解决所有的情况
   */
  resolve() {
    this.__ee.emit("resolve");
    this.__state = 2;
  }
  /**
   * 禁用reject，否则await可能会抛出异常
   */
  reject() {
    this.__ee.emit("reject");
    this.__state = 3;
  }
}
class Data extends ElflandAddon {
  __dataIsGotten = false;
  __dataPromise = new DefPromiseHelper();
  __data = null;
  get waitingDataGet() {
    return this.__dataPromise.promise;
  }
  get data() {
    return this.__data;
  }
  constructor(elfland2) {
    super(elfland2);
    elfland2.routerPromise.addCheck(this.check, this);
  }
  logoutCallback() {
  }
  async check(to, from) {
    if (this.__dataIsGotten) return;
    try {
      const res = await fetch("/data/RES.json");
      const json2 = await res.json();
      this.__data = json2;
      this.__dataPromise.resolve();
      this.__dataIsGotten = true;
    } catch (e) {
      console.error(e);
    }
  }
}
let Category$1 = class Category {
  category;
  child = null;
  constructor(categories) {
    this.category = categories[0] || "未分组";
    categories.shift();
    if (categories.length > 0) this.child = new Category(categories);
  }
};
let Tag$1 = class Tag {
  tag;
  constructor(tag) {
    this.tag = tag;
  }
};
let Link$1 = class Link {
  id;
  title;
  path;
  constructor(id, title, path) {
    this.id = id;
    this.title = title;
    this.path = path;
  }
};
let Article$1 = class Article {
  id;
  title;
  titlePinYin;
  path;
  time;
  author;
  body;
  categories;
  tags;
  links;
  created;
  modified;
  prev;
  next;
  constructor(data, articles) {
    data = deepClone(data);
    this.id = data.id;
    this.title = data.title;
    this.titlePinYin = data.titlePinYin;
    this.path = data.path;
    this.time = data.time;
    this.author = data.author;
    this.body = data.body;
    this.created = new Date(data.created);
    this.modified = new Date(data.modified);
    this.categories = new Category$1(data.categories);
    this.tags = Array.from(new Set(data.tags)).map((t) => new Tag$1(t));
    this.links = data.links.map((l) => {
      const { id, path } = articles.getIdAndPath(l);
      return new Link$1(id, l, path);
    });
    const pn = articles.getPrevAndNextById(data.id);
    this.prev = pn.prev;
    this.next = pn.next;
  }
};
class Articles extends ElflandAddon {
  __articlesIsGotten = false;
  __articlesPromise = new DefPromiseHelper();
  __id2article = reactive(/* @__PURE__ */ new Map());
  __id2path = /* @__PURE__ */ new Map();
  __path2id = /* @__PURE__ */ new Map();
  __id2title = /* @__PURE__ */ new Map();
  __title2id = /* @__PURE__ */ new Map();
  __articles = computed(() => {
    const list = Array.from(this.__id2article.values());
    list.sort((a, b2) => b2.created.getTime() - a.created.getTime());
    return list;
  });
  archivesSortMethodSelected = ref("ByCreated");
  archivesSortMethodOptions = computed(() => {
    return [
      "ByCreated",
      "ByModified",
      "ByTitlePinYin"
    ];
  });
  __sortMethodIsAsc = reactive({
    ByCreated: false,
    ByModified: false,
    ByTitlePinYin: true
  });
  archivesSortMethodIsAsc = computed({
    get: () => this.__sortMethodIsAsc[this.archivesSortMethodSelected.value],
    set: (val) => {
      this.__sortMethodIsAsc[this.archivesSortMethodSelected.value] = val;
    }
  });
  sortedArchives = computed(() => {
    const list = Array.from(this.__id2article.values());
    list.sort((a, b2) => {
      switch (this.archivesSortMethodSelected.value) {
        case "ByCreated":
          return this.archivesSortMethodIsAsc.value ? a.created.getTime() - b2.created.getTime() : b2.created.getTime() - a.created.getTime();
        case "ByModified":
          return this.archivesSortMethodIsAsc.value ? a.modified.getTime() - b2.modified.getTime() : b2.modified.getTime() - a.modified.getTime();
        case "ByTitlePinYin":
          return this.archivesSortMethodIsAsc.value ? a.titlePinYin.localeCompare(b2.titlePinYin) : b2.titlePinYin.localeCompare(a.titlePinYin);
      }
    });
    return list;
  });
  get articles() {
    return this.__articles;
  }
  get waitingDataGet() {
    return this.__articlesPromise.promise;
  }
  constructor(elfland2) {
    super(elfland2);
    elfland2.routerPromise.addCheck(this.check, this);
  }
  logoutCallback() {
  }
  async check(to, from) {
    if (this.__articlesIsGotten) return;
    try {
      await this.__elfland.data.waitingDataGet;
      const data = this.__elfland.data.data;
      if (data === null) return;
      data.docs.forEach((d) => {
        this.__id2path.set(d.id, d.path);
        this.__path2id.set(d.path, d.id);
        this.__id2title.set(d.id, d.title);
        this.__title2id.set(d.title, d.id);
      });
      data.docs.forEach((d) => {
        this.__id2article.set(d.id, new Article$1(d, this));
      });
      this.__articlesIsGotten = true;
      this.__articlesPromise.resolve();
    } catch (e) {
      console.error(e);
    }
  }
  getIdAndPath(title) {
    const id = this.__title2id.get(title) || -1;
    const path = this.__id2path.get(id) || "";
    return { id, path };
  }
  getPrevAndNextById(id) {
    const list = Array.from(this.__id2path.keys());
    const i = list.indexOf(id);
    if (i === -1) return { prev: { path: "", title: "" }, next: { path: "", title: "" } };
    const pi = i - 1 < 0 ? list.length - 1 : i - 1;
    const ni = i + 1 >= list.length ? 0 : i + 1;
    const pid = list[pi];
    const nid = list[ni];
    const prev = {
      path: this.__id2path.get(pid),
      title: this.__id2title.get(pid)
    };
    const next = {
      path: this.__id2path.get(nid),
      title: this.__id2title.get(nid)
    };
    return { prev, next };
  }
  getArticleByPath(path) {
    const id = this.__path2id.get(path);
    if (id === void 0) return null;
    const art = this.__id2article.get(id);
    if (art === void 0) return null;
    return art;
  }
}
class Link2 {
  id;
  path;
  title;
  in = [];
  out = [];
  constructor(id, path, title) {
    this.id = id;
    this.path = path;
    this.title = title;
  }
}
use([
  install,
  install$1,
  install$2,
  install$3,
  install$4,
  install$5
]);
class Links extends ElflandAddon {
  __linksIsGotten = false;
  __linksData = /* @__PURE__ */ new Map();
  __linksRenderData = {
    nodes: [],
    links: []
  };
  __chartElement = null;
  __myChart = null;
  __watchHandleTheme = null;
  __windowResizeFunc;
  constructor(elfland2) {
    super(elfland2);
    elfland2.routerPromise.addCheck(this.check, this);
    this.__windowResizeFunc = this.resize.bind(this);
  }
  logoutCallback() {
  }
  async check(to, from) {
    if (this.__linksIsGotten) return;
    try {
      await this.__elfland.articles.waitingDataGet;
      const articles = this.__elfland.articles.articles.value;
      articles.forEach((a) => {
        const linkIns = new Link2(a.id, a.path, a.title);
        this.__linksData.set(a.id, linkIns);
        this.__linksRenderData.nodes.push({
          id: a.id.toString(),
          name: a.title,
          path: a.path,
          category: "A"
        });
      });
      articles.forEach((a) => {
        const nLink = this.__linksData.get(a.id);
        a.links.forEach((l) => {
          const link = this.__linksData.get(l.id);
          if (link) {
            link.in.push(nLink);
            nLink.out.push(link);
            const sid = Math.min(nLink.id, link.id);
            const tid = Math.max(nLink.id, link.id);
            this.__linksRenderData.links.push({
              source: sid.toString(),
              target: tid.toString()
            });
          }
        });
      });
      this.__linksRenderData.links = this.__linksRenderData.links.filter((l, i, arr) => {
        return arr.findIndex((l2) => l2.source === l.source && l2.target === l.target) === i;
      });
      this.__linksIsGotten = true;
    } catch (e) {
      console.error(e);
    }
  }
  getLinks(id) {
    return this.__linksData.get(id);
  }
  render(chartElement) {
    this.__chartElement = chartElement;
    if (this.__watchHandleTheme) this.__watchHandleTheme.stop();
    this.distory();
    const res = this.renderChart();
    this.__watchHandleTheme = watch(this.__elfland.theme.theme, (newVal) => {
      if (this.__myChart) {
        this.__myChart.dispose();
        this.__myChart = null;
      }
      this.renderChart();
    });
    return res;
  }
  distory() {
    window.removeEventListener("resize", this.__windowResizeFunc);
    if (this.__myChart) {
      this.__myChart.dispose();
      this.__myChart = null;
    }
    if (this.__watchHandleTheme) {
      this.__watchHandleTheme.stop();
    }
  }
  renderChart() {
    if (this.__chartElement === null) return;
    const theme = this.__elfland.theme.theme.value;
    const data = this.__linksRenderData;
    const option = {
      title: {
        text: "关系图谱",
        subtext: "点击结点以跳转文章",
        top: "20px",
        left: "20px"
      },
      tooltip: {
        show: false
      },
      backgroundColor: "rgba(0, 0, 0, 0)",
      series: [
        {
          type: "graph",
          layout: "force",
          // 使用自定义布局
          symbolSize: 20,
          roam: true,
          label: {
            show: true,
            color: theme === "dark" ? "#fff" : "#000",
            fontSize: 12,
            position: "bottom"
          },
          force: {
            repulsion: 5e3
          },
          edgeSymbol: ["none", "none"],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            show: false
          },
          data: data.nodes,
          links: data.links,
          categories: [{ name: "A", itemStyle: { color: "#4fadff" } }],
          lineStyle: {
            opacity: 0.9,
            width: 2
          },
          emphasis: {
            focus: "adjacency"
          },
          draggable: true
          // 允许节点拖动
        }
      ]
    };
    this.__myChart = init$1(this.__chartElement, theme === "light" ? void 0 : "dark");
    this.__myChart.setOption(option);
    this.__myChart.on("click", (params) => {
      if (params.dataType === "node" && params.data) {
        const data2 = params.data;
        this.__elfland.routerPromise.router.push({
          name: "article",
          params: {
            articlePath: data2.path
          }
        });
      }
    });
    window.addEventListener("resize", this.__windowResizeFunc);
    return true;
  }
  resize() {
    if (this.__myChart) {
      this.__myChart.resize();
    }
  }
}
function initContainers(md) {
  const list = ["warning", "tip", "info", "success"];
  list.forEach((item) => {
    md.use(container_plugin, item, {
      render: function(tokens, idx) {
        if (tokens[idx].nesting === 1) {
          return '<div class="md-c-c md-c-c--' + item + '"><p>' + item.toLocaleUpperCase() + "</p>\n";
        } else {
          return "</div>\n";
        }
      }
    });
  });
}
function initMarkdownItContainer(md) {
  initContainers(md);
  md.use(container_plugin, "details", {
    validate: function(params) {
      return params.trim().match(/^details\s+(.*)$/);
    },
    render: function(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
      if (tokens[idx].nesting === 1 && m) {
        return "<details><summary>" + md.utils.escapeHtml(m[1]) + "</summary>\n";
      } else {
        return "</details>\n";
      }
    }
  });
  md.use(container_plugin, "image", {
    validate: function(params) {
      return params.trim().match(/^image\s+(.*)$/);
    },
    render: function(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^image\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        return '<div class="md-c-img">\n';
      } else {
        if (m === null) return "</div>";
        return "<span>" + (m[1] === "null" ? "" : md.utils.escapeHtml(m[1])) + "</span></div>\n";
      }
    }
  });
}
const Container = [initMarkdownItContainer];
function initMarkdownItEmoji(md) {
  md.use(emoji_plugin);
}
function initMarkdownItAnchor(md) {
  md.use(b, {
    permalink: b.permalink.linkInsideHeader({
      placement: "before"
    })
  });
}
function initMarkdownItTocDoneRight(md, elflandRenderer) {
  md.use(MarkdownItTocDoneRight, {
    listType: "ul",
    level: [1],
    callback: (html, ast) => {
      elflandRenderer.renderToc(html, ast);
    }
  });
}
function initMarkdownItKatex(md) {
  md.use(MarkdownItKatex, {
    throwOnError: false,
    errorColor: "#cc0000"
  });
}
const EmojiAnchorTocKatex = [
  initMarkdownItEmoji,
  initMarkdownItAnchor,
  initMarkdownItTocDoneRight,
  initMarkdownItKatex
];
function initMarkdownItFootnote(md) {
  md.use(footnote_plugin);
}
function initMarkdownItAbbr(md) {
  md.use(abbr_plugin);
}
function initMarkdownItSub(md) {
  md.use(sub_plugin);
}
function initMarkdownItSup(md) {
  md.use(sup_plugin);
}
function initMarkdownItPlantuml(md) {
  md.use(ee);
}
const FootnoteAbbrSubSupUml = [
  initMarkdownItFootnote,
  initMarkdownItAbbr,
  initMarkdownItSub,
  initMarkdownItSup,
  initMarkdownItPlantuml
];
function initImage(md, elflandRenderer, meta) {
  const baseUrl = meta ? meta.baseUrl || "" : "";
  const defaultImage = md.renderer.rules.image;
  function image(tokens, idx, options, env, slf) {
    const url = tokens[idx].attrGet("src") || "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image") || url.startsWith("file://") || url.startsWith("blob:")) {
      if (defaultImage === void 0) return "";
      return defaultImage(tokens, idx, options, env, slf);
    } else {
      tokens[idx].attrSet("src", baseUrl + "/data/assets/" + url);
      if (defaultImage === void 0) return "";
      return defaultImage(tokens, idx, options, env, slf);
    }
  }
  md.renderer.rules.image = image;
}
const Image = [initImage];
function LayoutPlugin(md, name, options) {
  function renderDefault(tokens, idx, _options, env, slf) {
    if (tokens[idx].nesting === 1) {
      tokens[idx].attrJoin("class", name);
    }
    return slf.renderToken(tokens, idx, _options, env, slf);
  }
  options = options || {};
  const markerBegin = "{(";
  const markerEnd = ")}";
  const layoutBegin = options.begin || "begin";
  const layoutEnd = options.end || "end";
  const indent = options.indent || false;
  options.indentSize || 4;
  const className = options.className || "";
  const render = options.render || renderDefault;
  function findMarker(state, start, max, line) {
    let pos;
    if (markerBegin !== state.src.slice(start, start + 2)) {
      return false;
    }
    let find = false;
    for (pos = start + 2; pos < max; pos++) {
      if (state.src.slice(pos, pos + 2) === markerEnd) {
        find = true;
        break;
      }
    }
    if (!find) {
      return false;
    }
    const dataStr = state.src.slice(start + 2, pos);
    const data = dataStr.split("|").map((item) => item.trim());
    const markup = markerBegin + dataStr + markerEnd;
    let self = false;
    let markerType;
    if (data[0] === layoutBegin) {
      markerType = 1;
      if (data[1] === name) {
        self = true;
      }
    } else if (data[0] === layoutEnd) {
      markerType = -1;
    } else {
      return false;
    }
    return {
      markerType,
      data,
      markup,
      line,
      self
    };
  }
  function findPairOfMarkers(state, startLine, endLine, silent) {
    let markerLevel = 0;
    let line = startLine;
    let markerBegin2 = null;
    let markerEnd2 = null;
    for (; line < endLine; line++) {
      const start = state.bMarks[line] + state.tShift[line];
      const max = state.eMarks[line];
      const marker = findMarker(state, start, max, line);
      if (marker) {
        if (marker.markerType === 1) {
          if (markerBegin2 === null && marker.self) {
            markerBegin2 = marker;
            if (silent) {
              return true;
            }
          } else {
            if (markerBegin2 === null) {
              return false;
            }
            markerLevel++;
          }
        } else {
          if (markerLevel === 0 && markerBegin2 !== null) {
            markerEnd2 = marker;
            break;
          } else {
            markerLevel--;
          }
        }
      } else {
        if (markerBegin2 === null) {
          return false;
        } else {
          continue;
        }
      }
    }
    if (markerBegin2 && markerEnd2) {
      return {
        markerBegin: markerBegin2,
        markerEnd: markerEnd2
      };
    } else {
      return false;
    }
  }
  function subtractIndent(state, startLine, endLine) {
  }
  function layout(state, startLine, endLine, silent) {
    const markers = findPairOfMarkers(state, startLine, endLine, silent);
    if (!markers) return false;
    if (markers === true) return true;
    if (indent) {
      subtractIndent(state, markers.markerBegin.line, markers.markerEnd.line);
    }
    const oldParent = state.parentType;
    const oldLineMax = state.lineMax;
    state.parentType = "layout";
    state.lineMax = markers.markerEnd.line;
    const token_o = state.push("layout_" + name + "_open", "div", 1);
    token_o.markup = markers.markerBegin.markup;
    token_o.block = true;
    token_o.meta = {
      data: markers.markerBegin.data,
      className
    };
    token_o.map = [markers.markerBegin.line, markers.markerEnd.line];
    state.md.block.tokenize(state, startLine + 1, markers.markerEnd.line);
    const token_c = state.push("layout_" + name + "_close", "div", -1);
    token_c.markup = markers.markerEnd.markup;
    token_c.block = true;
    token_c.meta = {
      data: markers.markerEnd.data
    };
    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.line = markers.markerEnd.line + 1;
    return true;
  }
  md.block.ruler.before("fence", "layout_" + name, layout, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });
  md.renderer.rules["layout_" + name + "_open"] = render;
  md.renderer.rules["layout_" + name + "_close"] = render;
}
function initLayoutPlugin(md) {
  md.use(LayoutPlugin, "container", {
    className: "md-layout-c",
    render: function(tokens, idx) {
      const ALLOW_STYLE_ATTR = [
        ["w", "width"],
        ["h", "height"],
        ["style", "style"],
        ["class", "class"]
      ];
      if (tokens[idx].nesting === 1) {
        let styleStr = "";
        let classStr = tokens[idx].meta.className + " ";
        tokens[idx].meta.data.forEach((data) => {
          const key = data.split("=")[0];
          const left = data.indexOf("=");
          const value = data.slice(left + 1, data.length);
          const item = ALLOW_STYLE_ATTR.find((i) => i[0] === key);
          if (item) {
            if (item[1] === "style") {
              styleStr += value;
            } else if (item[1] === "class") {
              classStr += value;
            } else {
              styleStr += item[1] + ":" + value + ";";
            }
          }
        });
        return '<div class="' + (classStr === " " ? "" : classStr) + '" style="' + styleStr + '">\n';
      } else {
        return "</div>\n";
      }
    }
  });
  md.use(LayoutPlugin, "item", {
    className: "md-layout-i",
    render: function(tokens, idx) {
      const ALLOW_STYLE_ATTR = [
        ["w", "width"],
        ["h", "height"],
        ["style", "style"],
        ["class", "class"]
      ];
      if (tokens[idx].nesting === 1) {
        let styleStr = "";
        let classStr = tokens[idx].meta.className + " ";
        tokens[idx].meta.data.forEach((data) => {
          const key = data.split("=")[0];
          const left = data.indexOf("=");
          const value = data.slice(left + 1, data.length);
          const item = ALLOW_STYLE_ATTR.find((i) => i[0] === key);
          if (item) {
            if (item[1] === "style") {
              styleStr += value;
            } else if (item[1] === "class") {
              classStr += value;
            } else {
              styleStr += item[1] + ":" + value + ";";
            }
          }
        });
        return '<div class="' + (classStr === " " ? "" : classStr) + '" style="' + styleStr + '">\n';
      } else {
        return "</div>\n";
      }
    }
  });
}
const Layout = [initLayoutPlugin];
function componentPlugin(md, name, options) {
  if (typeof name !== "string" || name === "") return;
  const defaultName = Array.isArray(name) ? name[0] : name;
  const namesSet = new Set(Array.isArray(name) ? name : [name]);
  function renderDefault(tokens, idx, _options, env, slf) {
    if (tokens[idx].nesting === 1) {
      tokens[idx].attrJoin("class", defaultName);
    }
    return slf.renderToken(tokens, idx, _options);
  }
  function renderDivisionDefault(tokens, idx, _options, env, slf) {
    return slf.renderToken(tokens, idx, _options);
  }
  options = options || {};
  const markerBegin = options.markerBegin || "{|";
  const markerEnd = options.markerEnd || "|}";
  const dataDivision = options.dataDivision || "|-";
  const configDivision = options.configDivision || "|";
  options.useEqual || true;
  const useIndex = options.useIndex || false;
  const configKeys = options.configKeys || [];
  const confMap = buildConfMap(configKeys);
  const render = options.render || renderDefault;
  const renderDivision = options.renderDivision || renderDivisionDefault;
  if (options.init instanceof Function) options.init(options);
  function buildConfMap(configKeys2) {
    const map = /* @__PURE__ */ new Map();
    configKeys2.forEach((conf) => {
      if (Array.isArray(conf)) {
        const base = conf[0];
        conf.forEach((c2) => {
          map.set(base, c2);
        });
      } else {
        map.set(conf, conf);
      }
    });
    return map;
  }
  function isComponentBegin(state, start) {
    const l = markerBegin.length;
    if (markerBegin !== state.src.slice(start, start + l)) {
      return {
        check: false
      };
    }
    const p = state.src.indexOf(configDivision, start + l);
    const n = state.src.slice(start + l, p).trim();
    if (!namesSet.has(n)) {
      return {
        check: true,
        name: false
      };
    }
    return {
      check: true,
      name: true,
      pos: start + l + name.length
    };
  }
  function isComponentEnd(state, start) {
    if (markerEnd !== state.src.slice(start, start + markerEnd.length)) {
      return {
        check: false
      };
    }
    return {
      check: true,
      pos: start
    };
  }
  function isDataDivision(state, start) {
    if (dataDivision !== state.src.slice(start, start + dataDivision.length)) {
      return {
        check: false
      };
    }
    return {
      check: true,
      pos: start
    };
  }
  function analyseData(state, startLine, endLine, silent) {
    let markerLevel = 0;
    let line = startLine;
    let markerBeginData = null;
    let markerEndData = null;
    let lastDataDivisionLine = -1;
    const dataList = [];
    let configList = null;
    for (; line < endLine; line++) {
      const start = state.bMarks[line] + state.tShift[line];
      state.eMarks[line];
      const res1 = isComponentBegin(state, start);
      if (res1.check) {
        if (res1.name) {
          if (markerBeginData) {
            markerLevel++;
          } else {
            markerBeginData = {
              markup: markerBegin,
              pos: res1.pos,
              line
            };
            if (silent) {
              return {
                check: true,
                silent: true
              };
            }
          }
        } else {
          markerLevel++;
        }
      } else {
        if (markerBeginData === null) {
          return {
            check: false
          };
        }
        const res2 = isComponentEnd(state, start);
        if (res2.check) {
          if (markerLevel === 0) {
            markerEndData = {
              markup: markerEnd,
              line
            };
            if (lastDataDivisionLine !== -1) {
              dataList.push({
                lineBegin: lastDataDivisionLine + 1,
                lineEnd: line
              });
            }
            return {
              configList: configList || [],
              dataList,
              check: true,
              markerBeginData,
              markerEndData
            };
          } else {
            markerLevel--;
          }
        } else {
          const res3 = isDataDivision(state, start);
          if (res3.check && markerLevel === 0) {
            if (configList === null) {
              const configStr = state.src.slice(markerBeginData.pos, res3.pos);
              configList = configStr.split(configDivision).map((conf) => conf.trim()).filter((conf) => conf !== "");
              lastDataDivisionLine = line;
            } else {
              if (line - lastDataDivisionLine <= 1) ;
              else {
                dataList.push({
                  lineBegin: lastDataDivisionLine + 1,
                  lineEnd: line
                });
              }
              lastDataDivisionLine = line;
            }
          } else {
            continue;
          }
        }
      }
    }
    return {
      check: false
    };
  }
  function analyseConfig(config, configs, i) {
    const equalRegexp = new RegExp("(?<!\\\\)=", "g");
    const commaRegexp = new RegExp("(?<!\\\\),", "g");
    const equalRes = equalRegexp.exec(config);
    equalRegexp.lastIndex = 0;
    const equalIndex = equalRes === null ? -1 : equalRes.index;
    const key = equalIndex === -1 ? i.toString() : config.slice(0, equalIndex).trim();
    const value_ = equalIndex === -1 ? config : config.slice(equalIndex + 1).trim();
    const value = [];
    let commaRes = commaRegexp.exec(value_);
    let from = 0;
    while (commaRes !== null) {
      value.push(value_.slice(from, commaRes.index).trim());
      from = commaRes.index + 1;
      commaRes = commaRegexp.exec(value_);
    }
    value.push(value_.slice(from).trim());
    commaRegexp.lastIndex = 0;
    if (equalIndex !== -1 && Number.isNaN(Number(key))) {
      const trueKey = confMap.get(key);
      if (trueKey === void 0) {
        return;
      } else {
        configs[trueKey] = value;
        return;
      }
    }
    if (useIndex && !Number.isNaN(Number(key))) {
      const index = Number(key);
      if (configKeys[index] !== void 0) {
        if (Array.isArray(configKeys[index])) {
          configs[configKeys[index][0]] = value;
        } else {
          configs[configKeys[index]] = value;
        }
      } else {
        configs[key] = value;
      }
      return;
    }
  }
  function analyseConfigList(configList) {
    const configs = {};
    configList.forEach((config, i) => {
      analyseConfig(config, configs, i);
    });
    return configs;
  }
  function component(state, startLine, endLine, silent) {
    const res = analyseData(state, startLine, endLine, silent);
    if (!res.check) return false;
    if (res.silent !== void 0) return true;
    const oldParent = state.parentType;
    const oldLineMax = state.lineMax;
    state.parentType = "blockquote";
    state.lineMax = res.markerEndData.line;
    const token_o = state.push("component_" + name + "_open", "div", 1);
    token_o.markup = markerBegin;
    token_o.block = true;
    token_o.meta = {
      configs: analyseConfigList(res.configList)
    };
    token_o.map = [res.markerBeginData.line, res.markerEndData.line];
    res.dataList.forEach((data, i) => {
      const start = state.bMarks[data.lineBegin] + state.tShift[data.lineBegin];
      const end = state.bMarks[data.lineEnd] + state.tShift[data.lineEnd];
      state.src.slice(start, end);
      if (i > 0) {
        const token_d = state.push("component_" + name + "_division", "div", 0);
        token_d.markup = dataDivision;
        token_d.meta = {
          index: i
        };
      }
      state.md.block.tokenize(state, data.lineBegin, data.lineEnd);
    });
    const token_c = state.push("component_" + name + "_close", "div", -1);
    token_c.markup = markerEnd;
    token_c.block = true;
    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.line = res.markerEndData.line + 1;
    return true;
  }
  md.block.ruler.before("fence", "component_" + name, component, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });
  md.renderer.rules["component_" + name + "_open"] = render;
  md.renderer.rules["component_" + name + "_close"] = render;
  md.renderer.rules["component_" + name + "_division"] = renderDivision;
}
function initClassifyComponentPlugin(md) {
  md.use(componentPlugin, "classify", {
    render: function(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const name = Math.floor(Math.random() * 1e6).toString();
        const configs = token.meta.configs;
        const classifies = configs.classifies || [];
        let inputs = "";
        classifies.forEach((c2, i) => {
          const t = '<div><label><input type="radio" name="' + name + '" value="' + i.toString() + '" hidden ' + (i === 0 ? "checked" : "") + "> " + c2 + "</label></div>";
          inputs += t;
        });
        return '<div class="markdown-it-component-classify-container">\n<div class="markdown-it-component-classify">\n<div head>\n' + inputs + "\n</div>\n<div body>\n<div>\n";
      } else {
        return "</div>\n</div>\n</div>\n</div>\n";
      }
    },
    renderDivision: function(tokens, idx) {
      return "</div>\n<div>\n";
    },
    init: function(options) {
      const size = 10;
      const styleId = "markdown-it-classify-style";
      let styleBase = `
.markdown-it-component-classify-container {
  border-radius: 8px;
  border: 1px solid var(--bl-color-base-border);
  overflow: hidden;
  margin-bottom: 1rem;
}
.markdown-it-component-classify > div > div {
  position: relative;
}
.markdown-it-component-classify > div[body] > div {
  display: none;
  padding: 0.5rem;
}
.markdown-it-component-classify > div[head] {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--bl-color-light-fill);
}
.markdown-it-component-classify > div[head] > div > label {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: color 0.2s;
  box-sizing: border-box;
  display: block;
  font-weight: bold;
  color: var(--bl-color-secondary-text);
}
.markdown-it-component-classify > div[head] > div:nth-child(n + 2)::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 1px;
  height: 40%;
  background-color: var(--bl-color-primary-text);
}
.markdown-it-component-classify > div[head] > div > label:has(input:checked) {
  transition: color 0.2s;
  color: var(--bl-color-primary-text);
}
.markdown-it-component-classify > div[head] > div > label:hover {
  transition: color 0.2s;
  color: var(--bl-color-primary-text);
}
.markdown-it-component-classify > div[body] > div > *:last-child {
  margin-bottom: 0 !important;
}

      `;
      for (let i = 1; i <= size; i++) {
        if (i > 1) styleBase += ",\n";
        styleBase += `.markdown-it-component-classify:has( > div[head] > div:nth-child(${i}) > label > input:checked) > div[body] > div:nth-child(${i})`;
      }
      styleBase += ` {
  display: block;
}
      `;
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.setAttribute("id", styleId);
        style.setAttribute("type", "text/css");
        style.innerHTML = styleBase.trim();
        const head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(style);
      }
    },
    configKeys: ["classifies"]
  });
}
const Component = [initClassifyComponentPlugin];
function templatePlugin(md, name, options) {
  function renderDefault(tokens, idx, _options, env, slf) {
    return slf.renderToken(tokens, idx, _options);
  }
  function renderDivisionDefault(tokens, idx, _options, env, slf) {
    return slf.renderToken(tokens, idx, _options);
  }
  options = options || {};
  const defaultName = Array.isArray(name) ? name[0] : name;
  const namesSet = new Set(Array.isArray(name) ? name : [name]);
  const tokenizePos = options.tokenizePos || [1];
  const markerBegin = options.markerBegin || "{{";
  const markerEnd = options.markerEnd || "}}";
  const markerDivision = options.markerDivision || "|";
  options.useEqual || true;
  const useIndex = options.useIndex || false;
  const configKeys = options.configKeys || [];
  const confMap = buildConfMap(configKeys);
  const render = options.render || renderDefault;
  const renderDivision = options.renderDivision || renderDivisionDefault;
  function buildConfMap(configKeys2) {
    const map = /* @__PURE__ */ new Map();
    configKeys2.forEach((conf) => {
      if (Array.isArray(conf)) {
        const base = conf[0];
        conf.forEach((c2) => {
          map.set(base, c2);
        });
      } else {
        map.set(conf, conf);
      }
    });
    return map;
  }
  function findEnd(state) {
    const max = state.posMax;
    let pos = state.pos + markerBegin.length;
    let level = 0;
    let lastDivisionPos = pos;
    const divisionDataList = [];
    while (pos < max) {
      if (markerBegin === state.src.slice(pos, pos + markerBegin.length)) {
        level++;
      } else if (markerEnd === state.src.slice(pos, pos + markerEnd.length)) {
        if (level === 0) {
          divisionDataList.push({
            begin: lastDivisionPos,
            end: pos
          });
          return {
            check: true,
            pos,
            divisionDataList
          };
        } else level--;
      } else if (markerDivision === state.src.slice(pos, pos + markerDivision.length)) {
        if (level === 0) {
          divisionDataList.push({
            begin: lastDivisionPos,
            end: pos
          });
          lastDivisionPos = pos + 1;
        }
      }
      pos++;
    }
    return {
      check: false
    };
  }
  function analyseConfig(config, configs, i) {
    const equalRegexp = new RegExp("(?<!\\\\)=", "g");
    const commaRegexp = new RegExp("(?<!\\\\),", "g");
    const equalRes = equalRegexp.exec(config);
    equalRegexp.lastIndex = 0;
    const equalIndex = equalRes === null ? -1 : equalRes.index;
    const key = equalIndex === -1 ? i.toString() : config.slice(0, equalIndex).trim();
    const value_ = equalIndex === -1 ? config : config.slice(equalIndex + 1).trim();
    const value = [];
    let commaRes = commaRegexp.exec(value_);
    let from = 0;
    while (commaRes !== null) {
      value.push(value_.slice(from, commaRes.index).trim());
      from = commaRes.index + 1;
      commaRes = commaRegexp.exec(value_);
    }
    value.push(value_.slice(from).trim());
    commaRegexp.lastIndex = 0;
    if (equalIndex !== -1 && Number.isNaN(Number(key))) {
      const trueKey = confMap.get(key);
      if (trueKey === void 0) {
        return;
      } else {
        configs[trueKey] = value;
        return;
      }
    }
    if (useIndex && !Number.isNaN(Number(key))) {
      const index = Number(key);
      if (configKeys[index] !== void 0) {
        if (Array.isArray(configKeys[index])) {
          configs[configKeys[index][0]] = value;
        } else {
          configs[configKeys[index]] = value;
        }
      } else {
        configs[key] = value;
      }
      return;
    }
  }
  function template(state, slient) {
    const max = state.posMax;
    const start = state.pos;
    if (markerBegin !== state.src.slice(start, start + markerBegin.length)) {
      return false;
    }
    const endRes = findEnd(state);
    if (!endRes.check) {
      return false;
    }
    const end = endRes.pos;
    const divisionDataList = endRes.divisionDataList;
    if (divisionDataList.length < 1 || !namesSet.has(state.src.slice(divisionDataList[0].begin, divisionDataList[0].end).trim())) {
      return false;
    }
    const tStart = start + markerBegin.length;
    const tEnd = end;
    const configs = {};
    let tokenizeAmount = 0;
    if (!slient) {
      state.pos = tStart;
      state.posMax = tEnd;
      const token_o = state.push("template_" + defaultName + "_open", "span", 1);
      let configIndex = 0;
      divisionDataList.forEach((data, i) => {
        if (i === 0) return;
        state.pos = data.begin;
        state.posMax = data.end;
        if (tokenizePos === true || Array.isArray(tokenizePos) && tokenizePos.indexOf(i) !== -1) {
          if (tokenizeAmount > 0) state.push("template_" + defaultName + "_division", "", 0);
          state.md.inline.tokenize(state);
          tokenizeAmount++;
        } else {
          analyseConfig(state.src.slice(data.begin, data.end), configs, configIndex++);
        }
      });
      token_o.meta = {
        configs
      };
      state.push("template_" + defaultName + "_close", "span", -1);
    }
    state.pos = end + markerEnd.length;
    state.posMax = max;
    return true;
  }
  md.inline.ruler.after("emphasis", "template_" + defaultName, template);
  md.renderer.rules["template_" + defaultName + "_open"] = render;
  md.renderer.rules["template_" + defaultName + "_close"] = render;
  md.renderer.rules["template_" + defaultName + "_division"] = renderDivision;
}
function initUnderlineTemplatePlugin(md) {
  md.use(templatePlugin, "und", {
    useIndex: true,
    configKeys: ["type"],
    render: function(tokens, idx) {
      const token = tokens[idx];
      const colorDict = {
        default: "transparent",
        warning: "#f89898D0",
        success: "#95d475D0",
        r: "var(--bl-color-md-plugin-underline-r)",
        g: "var(--bl-color-md-plugin-underline-g)",
        b: "var(--bl-color-md-plugin-underline-b)",
        y: "var(--bl-color-md-plugin-underline-y)"
      };
      if (token.nesting === 1) {
        const configs = token.meta.configs;
        const colorType = configs["type"] && configs["type"][0] || "default";
        const color = colorDict[colorType.trim()] || colorType.trim();
        const style = `background: linear-gradient(transparent 70%, ${color} 0%);`;
        return `<span style="${style}">`;
      } else {
        return "</span>";
      }
    }
  });
}
function initBackgroundTemplatePlugin(md) {
  md.use(templatePlugin, "bgc", {
    useIndex: true,
    configKeys: ["type"],
    render: function(tokens, idx) {
      const token = tokens[idx];
      const colorDict = {
        default: "transparent",
        warning: "#f89898D0",
        success: "#95d475D0",
        r: "var(--bl-color-md-plugin-underline-r)",
        g: "var(--bl-color-md-plugin-underline-g)",
        b: "var(--bl-color-md-plugin-underline-b)",
        y: "var(--bl-color-md-plugin-underline-y)"
      };
      if (token.nesting === 1) {
        const configs = token.meta.configs;
        const colorType = configs["type"] && configs["type"][0] || "default";
        const color = colorDict[colorType.trim()] || colorType.trim();
        const style = `background-color: ${color};`;
        return `<span style="${style}">`;
      } else {
        return "</span>";
      }
    }
  });
}
function initTranslateTemplatePlugin(md) {
  md.use(templatePlugin, "tran", {
    useIndex: true,
    configKeys: ["from", "to"],
    render: function(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const name = Math.floor(Math.random() * 1e6).toString();
        const configs = token.meta.configs;
        const from = configs["from"] && configs["from"][0] || "原文:";
        const to = configs["to"] && configs["to"][0] || "译文:";
        const input = `<label data-from="${from}" data-to="${to}" class="md-template-translate__label"><input type="checkbox" name="${name}" hidden ></label>`;
        return '<span class="md-template-translate">' + input + "<span>";
      } else {
        return "</span></span>";
      }
    },
    renderDivision: function(token, idx) {
      return "</span><span>";
    },
    tokenizePos: [1, 2]
  });
}
function initObsidianLinkTemplatePlugin(md, elflandRenderer) {
  md.use(templatePlugin, "link", {
    useIndex: true,
    configKeys: ["name"],
    render: function(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const configs = token.meta.configs;
        const name = configs["name"] && configs["name"][0] || "Error";
        const path = elflandRenderer.article.getPathByTitle(name);
        const className = path === "" ? "" : "cursor-pointer text-moonlight-500 hover:underline";
        const title = path === "" ? "" : window.location.protocol + "//" + window.location.host + "/blog/" + path;
        return `<span class="${className}" md="obsidian-link" path="${path}" title=${title}>` + name;
      } else {
        return "</span>";
      }
    },
    renderDivision: function(token, idx) {
      return "</span><span>";
    },
    tokenizePos: []
  });
}
const Template = [
  initUnderlineTemplatePlugin,
  initBackgroundTemplatePlugin,
  initTranslateTemplatePlugin,
  initObsidianLinkTemplatePlugin
];
function initTemplateTestPlugin1(md, elflandRenderer) {
  md.use(templatePlugin, "template-name-1", {
    configKeys: ["type"],
    render: function(tokens, idx) {
      const token = tokens[idx];
      const colorDict = {
        default: "transparent",
        warning: "#F56C6C",
        success: "#67C23A"
      };
      if (token.nesting === 1) {
        const configs = token.meta.configs;
        console.log("template-name-1 configs", configs);
        const colorType = configs["type"] && configs["type"][0] || "default";
        const color = colorDict[colorType.trim()] || colorType.trim();
        const style = `background-color: ${color};`;
        return `<span style="${style}">`;
      } else {
        return "</span>";
      }
    }
  });
}
function initTemplateTestPlugin2(md, elflandRenderer) {
  md.use(templatePlugin, "template-name-2", {
    configKeys: ["chars", "color"],
    render: function(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const configs = token.meta.configs;
        console.log("template-name-2 configs", configs);
        const charsConf = configs["chars"] || [];
        const color = configs["color"] || "";
        const chars = charsConf.join("-");
        return `<span style="color: ${color}">${chars}`;
      } else {
        return "</span>";
      }
    }
  });
}
function initTemplateTestPlugin3(md, elflandRenderer) {
  md.use(templatePlugin, "template-name-3", {
    configKeys: ["chars", "color"],
    useIndex: true,
    render: function(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const configs = token.meta.configs;
        console.log("template-name-3 configs", configs);
        const charsConf = configs["chars"] || [];
        const color = configs["color"] || "";
        const chars = charsConf.join("-");
        return `<span style="color: ${color}">${chars}`;
      } else {
        return "</span>";
      }
    }
  });
}
function initTemplateTestPlugin4(md, elflandRenderer) {
  md.use(templatePlugin, "template-name-4", {
    configKeys: ["chars", "color"],
    tokenizePos: [],
    // 全部禁止解析
    useIndex: true,
    render: function(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const configs = token.meta.configs;
        console.log("template-name-4 configs", configs);
        const charsConf = configs["chars"] || [];
        const color = configs["color"] || "";
        const chars = charsConf.join("-");
        return `<span style="color: ${color}">${chars}`;
      } else {
        return "</span>";
      }
    }
  });
}
const TemplateForTest = [
  initTemplateTestPlugin1,
  initTemplateTestPlugin2,
  initTemplateTestPlugin3,
  initTemplateTestPlugin4
];
const plugins = [
  ...Container,
  ...EmojiAnchorTocKatex,
  ...FootnoteAbbrSubSupUml,
  ...Image,
  ...Layout,
  ...Component,
  ...Template,
  ...TemplateForTest
];
function init(md, elflandRenderer, meta) {
  plugins.forEach((func) => {
    func(md, elflandRenderer, meta);
  });
}
HighlightJS.registerLanguage("javascript", javascript);
HighlightJS.registerLanguage("typescript", typescript);
HighlightJS.registerLanguage("css", css);
HighlightJS.registerLanguage("xml", xml);
HighlightJS.registerLanguage("c", c);
HighlightJS.registerLanguage("cmake", cmake);
HighlightJS.registerLanguage("cpp", cpp);
HighlightJS.registerLanguage("markdown", markdown);
HighlightJS.registerLanguage("json", json);
HighlightJS.registerLanguage("latex", latex);
HighlightJS.registerLanguage("python", python);
HighlightJS.registerLanguage("yaml", yaml);
hljsDefineVue(HighlightJS);
HighlightJS.registerLanguage("html", xml);
class MdRenderer {
  static CODE_SCROLL_KEY = "md-code-scroll";
  md;
  article;
  generateRandomString = generateRandomStringBase();
  codeScroll = localGet(MdRenderer.CODE_SCROLL_KEY, false) === "true";
  svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ><path fill="currentColor" d="M128 320v576h576V320zm-32-64h640a32 32 0 0 1 32 32v640a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V288a32 32 0 0 1 32-32M960 96v704a32 32 0 0 1-32 32h-96v-64h64V128H384v64h-64V96a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32M256 672h320v64H256zm0-192h320v64H256z"></path></svg>';
  svgCodeScroll = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ><path fill="currentColor" d="M511.552 128c-35.584 0-64.384 28.8-64.384 64.448v516.48L274.048 570.88a94.272 94.272 0 0 0-112.896-3.456 44.416 44.416 0 0 0-8.96 62.208L332.8 870.4A64 64 0 0 0 384 896h512V575.232a64 64 0 0 0-45.632-61.312l-205.952-61.76A96 96 0 0 1 576 360.192V192.448C576 156.8 547.2 128 511.552 128M359.04 556.8l24.128 19.2V192.448a128.448 128.448 0 1 1 256.832 0v167.744a32 32 0 0 0 22.784 30.656l206.016 61.76A128 128 0 0 1 960 575.232V896a64 64 0 0 1-64 64H384a128 128 0 0 1-102.4-51.2L101.056 668.032A108.416 108.416 0 0 1 128 512.512a158.272 158.272 0 0 1 185.984 8.32z"></path></svg>';
  constructor(article) {
    this.article = article;
    this.md = new MarkdownIt({
      breaks: true,
      linkify: true,
      highlight: (str, lang) => {
        lang = lang.trim();
        const spaceI = lang.indexOf(":");
        const detail = spaceI === -1 ? "" : lang.slice(spaceI + 1);
        lang = spaceI === -1 ? lang : lang.slice(0, spaceI);
        const codeIndex = this.generateRandomString();
        const button = `<span class="md-code-btn md-copy-btn select-none" title="点击复制" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">${this.svg}</span>`;
        const codeScroll = `<span class="md-code-btn select-none" md="codeScroll" title="调整代码块最大高度" ${this.codeScroll ? "checked" : ""}>${this.svgCodeScroll}</span>`;
        const showLang = "<span>" + this.getLang(lang) + "</span>";
        const showDetail = `<span>${detail}</span>`;
        const code = this.md.utils.escapeHtml(str);
        let codeHtml = code;
        if (lang && HighlightJS.getLanguage(lang)) {
          try {
            codeHtml = HighlightJS.highlight(str, { language: lang, ignoreIllegals: true }).value;
          } catch (_) {
          }
        }
        const headLeft = `<div>${showLang}${showDetail}</div>`;
        const headRight = `<div>${codeScroll}${button}</div>`;
        const codeLable = `<pre class="hljs">${codeHtml}<code></code></pre>`;
        const headLabel = `<div>${headLeft}${headRight}</div>`;
        const copyCode = `<textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${code}</textarea>`;
        const codeAll = `<div class="hljs-container">${headLabel}${codeLable}${copyCode}</div>`;
        return codeAll;
      }
    });
    this.init();
  }
  /**
   * md to html
   * @param str md文档字符串
   * @returns md解析出来的结果
   */
  render(str) {
    function scrollToHash() {
      const hash = location.hash.slice(1);
      if (!hash) return;
      requestAnimationFrame(() => {
        const el = document.getElementById(hash) || document.querySelector(`[id="${hash}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
    scrollToHash();
    return this.md.render(str);
  }
  getLang(lang) {
    lang = lang || "";
    if (lang === "") return lang;
    const dict = {
      // Javascript: 'JS',
      // Js: 'JS',
      // Css: 'CSS',
      // Md: 'markdown',
      // Cpp: 'CPP'
    };
    return dict[lang] || lang;
  }
  init() {
    init(this.md, this, {
      baseUrl: window.location.protocol + "//" + window.location.host
    });
  }
  renderToc(tocHtml, ast) {
    this.article.mdTocString = JSON.stringify(ast);
  }
}
class Article2 extends ElflandAddon {
  __path = ref("");
  __articleLRUCache = new LRUCache(20);
  __mdRenderer = new MdRenderer(this);
  __mdTocString = ref("");
  __clipboard;
  __selector;
  get article() {
    return computed(() => {
      return this.__articleLRUCache.get(this.__path.value) || null;
    });
  }
  get renderedMd() {
    return computed(() => {
      const article = this.article.value;
      if (article === null) return "";
      return this.__mdRenderer.render(article.body);
    });
  }
  get mdTocString() {
    return this.__mdTocString.value;
  }
  set mdTocString(str) {
    this.__mdTocString.value = str;
  }
  get rendererMdToc() {
    return computed(() => {
      const titleMap = /* @__PURE__ */ new Map();
      const tocString = this.__mdTocString.value;
      const tocJson = JSON.parse(tocString);
      const res = [];
      const dfs = (toc) => {
        let title = encodeURIComponent(toc.n.trim().replace(/\ /g, "-").toLowerCase());
        if (!titleMap.has(toc.n)) titleMap.set(toc.n, 1);
        else {
          title += `-${titleMap.get(toc.n)}`;
          titleMap.set(toc.n, titleMap.get(toc.n) + 1);
        }
        const r = {
          l: toc.l,
          n: toc.n.trim(),
          a: "#" + title
        };
        res.push(r);
        toc.c.forEach((n) => dfs(n));
      };
      dfs(tocJson);
      res.shift();
      return res;
    });
  }
  constructor(elfland2) {
    super(elfland2);
    elfland2.routerPromise.addCheck(this.check, this);
    elfland2.routerPromise.addPostcheck(this.postcheck, this);
    this.__clipboard = new Clipboard(".md-copy-btn");
    this.__clipboard.on("success", (e) => {
      message("复制成功", "success");
    });
    this.__clipboard.on("error", (e) => {
      message("复制失败");
    });
    this.__selector = new Selector([
      ["click", '.markdown-body span[md="codeScroll"]', "clickCodeScroll", { childrenEvent: true }],
      ["touchstart", '.markdown-body span[md="codeScroll"]', "clickCodeScroll", { childrenEvent: true }],
      ["click", '.markdown-body span[md="obsidian-link"]', "clickObsidianLink", { childrenEvent: true }],
      ["touchstart", '.markdown-body span[md="obsidian-link"]', "clickObsidianLink", { childrenEvent: true }]
    ]);
    this.__selector.on("clickCodeScroll", (e) => {
      const codeScroll = localGet(MdRenderer.CODE_SCROLL_KEY, false) === "true";
      localSet(MdRenderer.CODE_SCROLL_KEY, !codeScroll);
      const eles = document.querySelectorAll('.markdown-body span[md="codeScroll"]');
      for (let i = 0; i < eles.length; i++) {
        if (codeScroll) eles[i].removeAttribute("checked");
        else eles[i].setAttribute("checked", "");
      }
    });
    this.__selector.on("clickObsidianLink", (e) => {
      const ele = e.element;
      const path = ele.getAttribute("path");
      if (path === "") return;
      window.scrollTo(0, 0);
      this.__elfland.routerPromise.router.push(path);
    });
  }
  logoutCallback() {
  }
  getPathByTitle(title) {
    const art = this.__elfland.articles.getIdAndPath(title);
    return art.path;
  }
  async check(to, from) {
    if (!this.is(to, "article")) return;
    const path = to.params.articlePath;
    if (typeof path !== "string") return { name: "404" };
    await this.__elfland.articles.waitingDataGet;
    const art = this.__elfland.articles.getArticleByPath(path);
    if (art === null) return { name: "404" };
    this.__articleLRUCache.set(path, art);
  }
  postcheck(to, from) {
    if (!this.is(to, "article")) return;
    const path = to.params.articlePath;
    if (typeof path !== "string") return;
    this.__path.value = path;
  }
}
class Project {
  name;
  category;
  author;
  contributors;
  role;
  description;
  notes;
  url;
  github;
  video;
  arxiv;
  constructor(data) {
    this.name = data.name;
    this.category = data.category;
    this.author = data.author;
    this.contributors = data.contributors;
    this.role = data.role;
    this.description = data.description;
    this.notes = data.notes;
    this.url = data.url;
    this.github = data.github;
    this.video = data.video;
    this.arxiv = data.arxiv;
  }
}
class ProjectsDatabase {
  category;
  projects = [];
  constructor(category) {
    this.category = category;
  }
  addProject(project) {
    this.projects.push(project);
  }
}
class Projects extends ElflandAddon {
  __projectsIsGotten = false;
  __projectsCategorySorted = reactive([]);
  __pinnedProjects = reactive([]);
  pinnedProjects = computed(() => this.__pinnedProjects);
  projectsCategorySorted = computed(() => this.__projectsCategorySorted);
  constructor(elfland2) {
    super(elfland2);
    elfland2.routerPromise.addCheck(this.check, this);
  }
  logoutCallback() {
  }
  async check(to, from) {
    if (this.__projectsIsGotten) return;
    try {
      await this.__elfland.data.waitingDataGet;
      const data = this.__elfland.data.data;
      if (data === null) return;
      const projects = data.projects.slice(2);
      const sortedData = data.projects[0].Sorted;
      sortedData.forEach((s) => {
        this.__projectsCategorySorted.push(new ProjectsDatabase(s));
      });
      projects.forEach((p) => {
        const pins = new Project(p);
        if (p.pinned) this.__pinnedProjects.push(pins);
        const db = this.__projectsCategorySorted.find((d) => d.category === p.category);
        if (!db) {
          const ndb = new ProjectsDatabase(p.category);
          ndb.addProject(pins);
          this.__projectsCategorySorted.push(ndb);
        } else {
          db.addProject(pins);
        }
      });
      this.__projectsIsGotten = true;
    } catch (e) {
      console.error(e);
    }
  }
}
class Tag2 {
  tag;
  articles = [];
  get size() {
    return this.articles.length;
  }
  constructor(tag) {
    this.tag = tag;
  }
  addArticle(article) {
    this.articles.push(article);
  }
}
class Tags extends ElflandAddon {
  __tagsIsGotten = false;
  __tags = reactive(/* @__PURE__ */ new Map());
  __selectedTag = ref("");
  sortIsAsc = ref(false);
  sortedArticels = computed(() => {
    const tag = this.__selectedTag.value;
    if (tag === "") return [];
    const list = this.__tags.get(tag);
    if (!list) return [];
    return list.articles.sort((a, b2) => {
      if (this.sortIsAsc.value) return a.created.getTime() - b2.created.getTime();
      else return b2.created.getTime() - a.created.getTime();
    });
  });
  tags = computed(() => {
    return Array.from(this.__tags.values());
  });
  constructor(elfland2) {
    super(elfland2);
    elfland2.routerPromise.addCheck(this.check, this);
    elfland2.routerPromise.addPostcheck(this.postcheck, this);
  }
  logoutCallback() {
  }
  async check(to, from) {
    if (this.__tagsIsGotten) return;
    try {
      await this.__elfland.articles.waitingDataGet;
      const articles = this.__elfland.articles.articles.value;
      articles.forEach((a) => {
        a.tags.forEach((t) => {
          if (!this.__tags.has(t.tag)) this.__tags.set(t.tag, new Tag2(t.tag));
          const tag = this.__tags.get(t.tag);
          tag.addArticle(a);
        });
      });
      this.__tagsIsGotten = true;
    } catch (e) {
      console.error(e);
    }
  }
  postcheck(to, from) {
    if (!this.is(to, "tags")) return;
    const tag = to.query.tag;
    this.__selectedTag.value = tag ? typeof tag === "string" ? tag : tag[0] : "";
  }
}
class Category2 {
  category;
  children = /* @__PURE__ */ new Map();
  allArts = [];
  selfArts = [];
  parent = null;
  fold = true;
  get categories() {
    return Array.from(this.children.values());
  }
  get path() {
    if (this.category === "ROOT" || this.parent === null) return "";
    return this.parent.path + "/" + this.category;
  }
  constructor(category, parent) {
    this.category = category || "ROOT";
    this.parent = parent || null;
  }
  addArticle(art, cate) {
    this.allArts.push(art);
    const category = cate.category;
    if (!this.children.has(category)) this.children.set(category, new Category2(category, this));
    const categoryIns = this.children.get(category);
    if (cate.child === null) {
      categoryIns.allArts.push(art);
      categoryIns.selfArts.push(art);
    } else {
      categoryIns.addArticle(art, cate.child);
    }
  }
}
class Categories extends ElflandAddon {
  __categoriesIsGotten = false;
  __category = reactive(new Category2());
  __selcetedCategory = ref("");
  __displayArticlesList = computed(() => {
    if (this.__selcetedCategory.value === "") return [];
    const cates = this.__selcetedCategory.value.split("/").filter((c2) => c2 !== "");
    let res = [];
    let cate = this.__category;
    while (cates.length > 0) {
      cate = cate.children.get(cates.shift() || "");
      if (!cate) return [];
      res = cate.allArts;
    }
    return res;
  });
  get categories() {
    return this.__category.categories.sort((a, b2) => a.category === "未分组" ? 1 : -1);
  }
  sortIsAsc = ref(false);
  sortedArticels = computed(() => {
    return this.__displayArticlesList.value.sort((a, b2) => {
      if (this.sortIsAsc.value) return a.created.getTime() - b2.created.getTime();
      else return b2.created.getTime() - a.created.getTime();
    });
  });
  constructor(elfland2) {
    super(elfland2);
    elfland2.routerPromise.addCheck(this.check, this);
    elfland2.routerPromise.addPostcheck(this.postcheck, this);
  }
  logoutCallback() {
  }
  async check(to, from) {
    if (this.__categoriesIsGotten) return;
    try {
      await this.__elfland.articles.waitingDataGet;
      const articles = this.__elfland.articles.articles.value;
      articles.forEach((a) => {
        this.__category.addArticle(a, a.categories);
      });
      this.__categoriesIsGotten = true;
    } catch (e) {
      console.error(e);
    }
  }
  postcheck(to, from) {
    if (!this.is(to, "categories")) return;
    const category = to.query.category;
    this.__selcetedCategory.value = category ? typeof category === "string" ? category : category[0] : "";
    if (this.__selcetedCategory.value === "") return;
    const cates = this.__selcetedCategory.value.split("/").filter((c2) => c2 !== "");
    let cate = this.__category;
    while (cates.length > 0) {
      cate = cate.children.get(cates.shift() || "");
      if (!cate) return;
      cate.fold = false;
    }
  }
}
class About extends ElflandAddon {
  __aboutIsGotten = false;
  name = ref("");
  position = ref("");
  avater = ref("");
  about = reactive([]);
  github = ref("");
  links = reactive([]);
  skills = reactive([]);
  constructor(elfland2) {
    super(elfland2);
    elfland2.routerPromise.addCheck(this.check, this);
  }
  logoutCallback() {
  }
  async check(to, from) {
    if (this.__aboutIsGotten) return;
    try {
      await this.__elfland.data.waitingDataGet;
      const data = this.__elfland.data.data;
      if (data === null) return;
      const about = data.about;
      this.name.value = about.name;
      this.position.value = about.position;
      this.avater.value = about.avater;
      about.about.forEach((a) => {
        this.about.push(a);
      });
      this.github.value = about.github;
      about.links.forEach((l) => {
        this.links.push(l);
      });
      about.skills.forEach((s) => {
        this.skills.push(s);
      });
      this.__aboutIsGotten = true;
    } catch (e) {
      console.error(e);
    }
  }
}
class Elfland extends EventEmitter {
  static instance = null;
  static getInstance(router2) {
    if (!Elfland.instance && router2) {
      Elfland.instance = new Elfland(router2);
    }
    return Elfland.instance;
  }
  routerPromise;
  theme;
  about;
  data;
  articles;
  article;
  links;
  projects;
  tags;
  categories;
  constructor(router2) {
    super();
    this.routerPromise = new RouterPromise(router2);
    this.theme = new Theme(this);
    this.about = new About(this);
    this.data = new Data(this);
    this.articles = new Articles(this);
    this.article = new Article2(this);
    this.links = new Links(this);
    this.projects = new Projects(this);
    this.tags = new Tags(this);
    this.categories = new Categories(this);
  }
}
function useElfland() {
  return Elfland.getInstance();
}
NProgress.configure({ showSpinner: false });
const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => __vitePreload(() => import("./index-CVwujSA1.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8]) : void 0)
    },
    {
      path: "/archives",
      name: "archives",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => __vitePreload(() => import("./index-OBWDFH6D.js"), true ? __vite__mapDeps([9,6,2,3,4,10,1,5,7,8]) : void 0)
    },
    {
      path: "/categories",
      name: "categories",
      component: () => __vitePreload(() => import("./index-BOYaEA6F.js"), true ? __vite__mapDeps([11,2,3,4,6,10,1,5,7,8]) : void 0)
    },
    {
      path: "/tags",
      name: "tags",
      component: () => __vitePreload(() => import("./index-Jyv-rpE2.js"), true ? __vite__mapDeps([12,2,3,4,6,10,1,5,7,8]) : void 0)
    },
    {
      path: "/links",
      name: "links",
      component: () => __vitePreload(() => import("./index-DBW4qZU3.js"), true ? __vite__mapDeps([13,1,2,3,4,7,8]) : void 0)
    },
    {
      path: "/search",
      name: "search",
      component: () => __vitePreload(() => import("./AboutView-qxLs32CJ.js"), true ? __vite__mapDeps([14,2,3,4,7,8]) : void 0)
    },
    {
      path: "/blog/:articlePath",
      name: "article",
      component: () => __vitePreload(() => import("./index-iF0y7JWP.js"), true ? __vite__mapDeps([15,1,2,3,4,5,7,8]) : void 0)
    },
    {
      path: "/about",
      name: "about",
      component: () => __vitePreload(() => import("./AboutView-qxLs32CJ.js"), true ? __vite__mapDeps([14,2,3,4,7,8]) : void 0)
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      redirect: "/"
    }
  ]
});
const elfland = Elfland.getInstance(router);
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (!elfland.routerPromise.precheck(to, from, next)) return;
  if (!await elfland.routerPromise.check(to, from, next)) return;
  next();
});
router.afterEach((to, from, failure) => {
  elfland.routerPromise.postcheck(to, from);
  NProgress.done();
});
const app = createApp(App);
app.use(router);
app.mount("#app");
export {
  Article$1 as A,
  Category2 as C,
  Project as P,
  Tag2 as T,
  _export_sfc as _,
  formatDate as f,
  useElfland as u
};
//# sourceMappingURL=index-DDpQ9fFd.js.map
