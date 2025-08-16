import { i as isString, m as map$1, a as isArray, b as isObject$2, c as createHashMap, e as each$4, d as indexOf, f as isNumber, g as isStringSafe, h as assert, j as env, k as inherits, l as extend, n as isFunction, o as isArrayLike, p as keys, P as Path, q as liftColor, r as retrieve2, Z as ZRImage, s as createFromString, t as mergePath$1, u as subPixelOptimize$1, v as hasOwn, w as defaults, T as Transformable, x as invert, y as applyTransform$1, z as extendFromString, A as subPixelOptimizeLine$1, B as subPixelOptimizeRect$1, C as identity, D as mul, E as BoundingRect, F as copy, G as create, H as clone$1, I as Circle, J as Ellipse, S as Sector, R as Ring, K as Polygon, L as Polyline, M as Rect, N as Line$1, O as BezierCurve, Q as Arc, U as CompoundPath, V as Group$2, W as IncrementalDisplayable, X as LinearGradient, Y as OrientedBoundingRect, _ as Point, $ as RadialGradient, a0 as ZRText, a1 as trim, a2 as normalizeCssArray$1, a3 as retrieve3, a4 as merge, a5 as mixin, a6 as encodeHTML, a7 as curry$1, a8 as modifyHSL, a9 as isTypedArray, aa as filter, ab as bind$1, ac as setAsPrimitive, ad as reduce, ae as concatArray, af as noop, ag as calculateTextPosition, ah as WeakMap, ai as LRU, aj as platformApi, ak as brushSingle, al as Eventful, am as init$1, an as sort, ao as slice, ap as parsePercent$1, aq as eqNaN, ar as registerPainter, as as getBoundingRect, at as rotate, au as retrieve, av as copyTransform, aw as find, ax as isMiddleOrRightButtonOnMouseUpDown, ay as stop, az as copy$1, aA as clone$2, aB as normalize$2, aC as scale$1, aD as create$1, aE as sub, aF as len, aG as scaleAndAdd$1, aH as set$1, aI as fromPoints, aJ as quadraticSubdivide, aK as quadraticAt$1, aL as distSquare, aM as translate, aN as isDom, aO as normalizeEvent, aP as transformLocalCoord, aQ as transformLocalCoordClear, aR as parse, aS as stringify, aT as CanvasPainter } from "./zrender-B2Ai5H0D.js";
import { _ as __extends } from "./vendor-BgHGR-g1.js";
var RADIAN_EPSILON = 1e-4;
var ROUND_SUPPORTED_PRECISION_MAX = 20;
function _trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}
var mathMin = Math.min;
var mathMax = Math.max;
var mathAbs$1 = Math.abs;
function linearMap(val, domain, range, clamp2) {
  var d0 = domain[0];
  var d1 = domain[1];
  var r0 = range[0];
  var r1 = range[1];
  var subDomain = d1 - d0;
  var subRange = r1 - r0;
  if (subDomain === 0) {
    return subRange === 0 ? r0 : (r0 + r1) / 2;
  }
  if (clamp2) {
    if (subDomain > 0) {
      if (val <= d0) {
        return r0;
      } else if (val >= d1) {
        return r1;
      }
    } else {
      if (val >= d0) {
        return r0;
      } else if (val <= d1) {
        return r1;
      }
    }
  } else {
    if (val === d0) {
      return r0;
    }
    if (val === d1) {
      return r1;
    }
  }
  return (val - d0) / subDomain * subRange + r0;
}
var parsePercent = parsePositionOption;
function parsePositionOption(option, percentBase, percentOffset) {
  switch (option) {
    case "center":
    case "middle":
      option = "50%";
      break;
    case "left":
    case "top":
      option = "0%";
      break;
    case "right":
    case "bottom":
      option = "100%";
      break;
  }
  return parsePositionSizeOption(option, percentBase, percentOffset);
}
function parsePositionSizeOption(option, percentBase, percentOffset) {
  if (isString(option)) {
    if (_trim(option).match(/%$/)) {
      return parseFloat(option) / 100 * percentBase + (percentOffset || 0);
    }
    return parseFloat(option);
  }
  return option == null ? NaN : +option;
}
function round(x, precision, returnStr) {
  if (precision == null) {
    precision = 10;
  }
  precision = Math.min(Math.max(0, precision), ROUND_SUPPORTED_PRECISION_MAX);
  x = (+x).toFixed(precision);
  return returnStr ? x : +x;
}
function getPrecision(val) {
  val = +val;
  if (isNaN(val)) {
    return 0;
  }
  if (val > 1e-14) {
    var e = 1;
    for (var i = 0; i < 15; i++, e *= 10) {
      if (Math.round(val * e) / e === val) {
        return i;
      }
    }
  }
  return getPrecisionSafe(val);
}
function getPrecisionSafe(val) {
  var str = val.toString().toLowerCase();
  var eIndex = str.indexOf("e");
  var exp = eIndex > 0 ? +str.slice(eIndex + 1) : 0;
  var significandPartLen = eIndex > 0 ? eIndex : str.length;
  var dotIndex = str.indexOf(".");
  var decimalPartLen = dotIndex < 0 ? 0 : significandPartLen - 1 - dotIndex;
  return Math.max(0, decimalPartLen - exp);
}
function getPixelPrecision(dataExtent, pixelExtent) {
  var log = Math.log;
  var LN10 = Math.LN10;
  var dataQuantity = Math.floor(log(dataExtent[1] - dataExtent[0]) / LN10);
  var sizeQuantity = Math.round(log(mathAbs$1(pixelExtent[1] - pixelExtent[0])) / LN10);
  var precision = Math.min(Math.max(-dataQuantity + sizeQuantity, 0), 20);
  return !isFinite(precision) ? 20 : precision;
}
function addSafe(val0, val1) {
  var maxPrecision = Math.max(getPrecision(val0), getPrecision(val1));
  var sum = val0 + val1;
  return maxPrecision > ROUND_SUPPORTED_PRECISION_MAX ? sum : round(sum, maxPrecision);
}
function remRadian(radian) {
  var pi2 = Math.PI * 2;
  return (radian % pi2 + pi2) % pi2;
}
function isRadianAroundZero(val) {
  return val > -RADIAN_EPSILON && val < RADIAN_EPSILON;
}
var TIME_REG = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;
function parseDate(value) {
  if (value instanceof Date) {
    return value;
  } else if (isString(value)) {
    var match = TIME_REG.exec(value);
    if (!match) {
      return /* @__PURE__ */ new Date(NaN);
    }
    if (!match[8]) {
      return new Date(+match[1], +(match[2] || 1) - 1, +match[3] || 1, +match[4] || 0, +(match[5] || 0), +match[6] || 0, match[7] ? +match[7].substring(0, 3) : 0);
    } else {
      var hour = +match[4] || 0;
      if (match[8].toUpperCase() !== "Z") {
        hour -= +match[8].slice(0, 3);
      }
      return new Date(Date.UTC(+match[1], +(match[2] || 1) - 1, +match[3] || 1, hour, +(match[5] || 0), +match[6] || 0, match[7] ? +match[7].substring(0, 3) : 0));
    }
  } else if (value == null) {
    return /* @__PURE__ */ new Date(NaN);
  }
  return new Date(Math.round(value));
}
function quantity(val) {
  return Math.pow(10, quantityExponent(val));
}
function quantityExponent(val) {
  if (val === 0) {
    return 0;
  }
  var exp = Math.floor(Math.log(val) / Math.LN10);
  if (val / Math.pow(10, exp) >= 10) {
    exp++;
  }
  return exp;
}
function nice(val, round2) {
  var exponent = quantityExponent(val);
  var exp10 = Math.pow(10, exponent);
  var f = val / exp10;
  var nf;
  {
    if (f < 1.5) {
      nf = 1;
    } else if (f < 2.5) {
      nf = 2;
    } else if (f < 4) {
      nf = 3;
    } else if (f < 7) {
      nf = 5;
    } else {
      nf = 10;
    }
  }
  val = nf * exp10;
  return exponent >= -20 ? +val.toFixed(exponent < 0 ? -exponent : 0) : val;
}
function numericToNumber(val) {
  var valFloat = parseFloat(val);
  return valFloat == val && (valFloat !== 0 || !isString(val) || val.indexOf("x") <= 0) ? valFloat : NaN;
}
function isNumeric(val) {
  return !isNaN(numericToNumber(val));
}
function getRandomIdBase() {
  return Math.round(Math.random() * 9);
}
function getGreatestCommonDividor(a, b) {
  if (b === 0) {
    return a;
  }
  return getGreatestCommonDividor(b, a % b);
}
function getLeastCommonMultiple(a, b) {
  if (a == null) {
    return b;
  }
  if (b == null) {
    return a;
  }
  return a * b / getGreatestCommonDividor(a, b);
}
var ECHARTS_PREFIX = "[ECharts] ";
var hasConsole = typeof console !== "undefined" && console.warn && console.log;
function outputLog(type, str, onlyOnce) {
  if (hasConsole) {
    console[type](ECHARTS_PREFIX + str);
  }
}
function error(str, onlyOnce) {
  outputLog("error", str);
}
function throwError(msg) {
  throw new Error(msg);
}
var DUMMY_COMPONENT_NAME_PREFIX = "series\0";
var INTERNAL_COMPONENT_ID_PREFIX = "\0_ec_\0";
function normalizeToArray(value) {
  return value instanceof Array ? value : value == null ? [] : [value];
}
function defaultEmphasis(opt, key, subOpts) {
  if (opt) {
    opt[key] = opt[key] || {};
    opt.emphasis = opt.emphasis || {};
    opt.emphasis[key] = opt.emphasis[key] || {};
    for (var i = 0, len2 = subOpts.length; i < len2; i++) {
      var subOptName = subOpts[i];
      if (!opt.emphasis[key].hasOwnProperty(subOptName) && opt[key].hasOwnProperty(subOptName)) {
        opt.emphasis[key][subOptName] = opt[key][subOptName];
      }
    }
  }
}
var TEXT_STYLE_OPTIONS = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "rich", "tag", "color", "textBorderColor", "textBorderWidth", "width", "height", "lineHeight", "align", "verticalAlign", "baseline", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY", "backgroundColor", "borderColor", "borderWidth", "borderRadius", "padding"];
function getDataItemValue(dataItem) {
  return isObject$2(dataItem) && !isArray(dataItem) && !(dataItem instanceof Date) ? dataItem.value : dataItem;
}
function isDataItemOption(dataItem) {
  return isObject$2(dataItem) && !(dataItem instanceof Array);
}
function mappingToExists(existings, newCmptOptions, mode) {
  var isNormalMergeMode = mode === "normalMerge";
  var isReplaceMergeMode = mode === "replaceMerge";
  var isReplaceAllMode = mode === "replaceAll";
  existings = existings || [];
  newCmptOptions = (newCmptOptions || []).slice();
  var existingIdIdxMap = createHashMap();
  each$4(newCmptOptions, function(cmptOption, index) {
    if (!isObject$2(cmptOption)) {
      newCmptOptions[index] = null;
      return;
    }
  });
  var result = prepareResult(existings, existingIdIdxMap, mode);
  if (isNormalMergeMode || isReplaceMergeMode) {
    mappingById(result, existings, existingIdIdxMap, newCmptOptions);
  }
  if (isNormalMergeMode) {
    mappingByName(result, newCmptOptions);
  }
  if (isNormalMergeMode || isReplaceMergeMode) {
    mappingByIndex(result, newCmptOptions, isReplaceMergeMode);
  } else if (isReplaceAllMode) {
    mappingInReplaceAllMode(result, newCmptOptions);
  }
  makeIdAndName(result);
  return result;
}
function prepareResult(existings, existingIdIdxMap, mode) {
  var result = [];
  if (mode === "replaceAll") {
    return result;
  }
  for (var index = 0; index < existings.length; index++) {
    var existing = existings[index];
    if (existing && existing.id != null) {
      existingIdIdxMap.set(existing.id, index);
    }
    result.push({
      existing: mode === "replaceMerge" || isComponentIdInternal(existing) ? null : existing,
      newOption: null,
      keyInfo: null,
      brandNew: null
    });
  }
  return result;
}
function mappingById(result, existings, existingIdIdxMap, newCmptOptions) {
  each$4(newCmptOptions, function(cmptOption, index) {
    if (!cmptOption || cmptOption.id == null) {
      return;
    }
    var optionId = makeComparableKey(cmptOption.id);
    var existingIdx = existingIdIdxMap.get(optionId);
    if (existingIdx != null) {
      var resultItem = result[existingIdx];
      assert(!resultItem.newOption, 'Duplicated option on id "' + optionId + '".');
      resultItem.newOption = cmptOption;
      resultItem.existing = existings[existingIdx];
      newCmptOptions[index] = null;
    }
  });
}
function mappingByName(result, newCmptOptions) {
  each$4(newCmptOptions, function(cmptOption, index) {
    if (!cmptOption || cmptOption.name == null) {
      return;
    }
    for (var i = 0; i < result.length; i++) {
      var existing = result[i].existing;
      if (!result[i].newOption && existing && (existing.id == null || cmptOption.id == null) && !isComponentIdInternal(cmptOption) && !isComponentIdInternal(existing) && keyExistAndEqual("name", existing, cmptOption)) {
        result[i].newOption = cmptOption;
        newCmptOptions[index] = null;
        return;
      }
    }
  });
}
function mappingByIndex(result, newCmptOptions, brandNew) {
  each$4(newCmptOptions, function(cmptOption) {
    if (!cmptOption) {
      return;
    }
    var resultItem;
    var nextIdx = 0;
    while (
      // Be `!resultItem` only when `nextIdx >= result.length`.
      (resultItem = result[nextIdx]) && (resultItem.newOption || isComponentIdInternal(resultItem.existing) || // In mode "replaceMerge", here no not-mapped-non-internal-existing.
      resultItem.existing && cmptOption.id != null && !keyExistAndEqual("id", cmptOption, resultItem.existing))
    ) {
      nextIdx++;
    }
    if (resultItem) {
      resultItem.newOption = cmptOption;
      resultItem.brandNew = brandNew;
    } else {
      result.push({
        newOption: cmptOption,
        brandNew,
        existing: null,
        keyInfo: null
      });
    }
    nextIdx++;
  });
}
function mappingInReplaceAllMode(result, newCmptOptions) {
  each$4(newCmptOptions, function(cmptOption) {
    result.push({
      newOption: cmptOption,
      brandNew: true,
      existing: null,
      keyInfo: null
    });
  });
}
function makeIdAndName(mapResult) {
  var idMap = createHashMap();
  each$4(mapResult, function(item) {
    var existing = item.existing;
    existing && idMap.set(existing.id, item);
  });
  each$4(mapResult, function(item) {
    var opt = item.newOption;
    assert(!opt || opt.id == null || !idMap.get(opt.id) || idMap.get(opt.id) === item, "id duplicates: " + (opt && opt.id));
    opt && opt.id != null && idMap.set(opt.id, item);
    !item.keyInfo && (item.keyInfo = {});
  });
  each$4(mapResult, function(item, index) {
    var existing = item.existing;
    var opt = item.newOption;
    var keyInfo = item.keyInfo;
    if (!isObject$2(opt)) {
      return;
    }
    keyInfo.name = opt.name != null ? makeComparableKey(opt.name) : existing ? existing.name : DUMMY_COMPONENT_NAME_PREFIX + index;
    if (existing) {
      keyInfo.id = makeComparableKey(existing.id);
    } else if (opt.id != null) {
      keyInfo.id = makeComparableKey(opt.id);
    } else {
      var idNum = 0;
      do {
        keyInfo.id = "\0" + keyInfo.name + "\0" + idNum++;
      } while (idMap.get(keyInfo.id));
    }
    idMap.set(keyInfo.id, item);
  });
}
function keyExistAndEqual(attr, obj1, obj2) {
  var key1 = convertOptionIdName(obj1[attr], null);
  var key2 = convertOptionIdName(obj2[attr], null);
  return key1 != null && key2 != null && key1 === key2;
}
function makeComparableKey(val) {
  return convertOptionIdName(val, "");
}
function convertOptionIdName(idOrName, defaultValue) {
  if (idOrName == null) {
    return defaultValue;
  }
  return isString(idOrName) ? idOrName : isNumber(idOrName) || isStringSafe(idOrName) ? idOrName + "" : defaultValue;
}
function isNameSpecified(componentModel) {
  var name = componentModel.name;
  return !!(name && name.indexOf(DUMMY_COMPONENT_NAME_PREFIX));
}
function isComponentIdInternal(cmptOption) {
  return cmptOption && cmptOption.id != null && makeComparableKey(cmptOption.id).indexOf(INTERNAL_COMPONENT_ID_PREFIX) === 0;
}
function setComponentTypeToKeyInfo(mappingResult, mainType, componentModelCtor) {
  each$4(mappingResult, function(item) {
    var newOption = item.newOption;
    if (isObject$2(newOption)) {
      item.keyInfo.mainType = mainType;
      item.keyInfo.subType = determineSubType(mainType, newOption, item.existing, componentModelCtor);
    }
  });
}
function determineSubType(mainType, newCmptOption, existComponent, componentModelCtor) {
  var subType = newCmptOption.type ? newCmptOption.type : existComponent ? existComponent.subType : componentModelCtor.determineSubType(mainType, newCmptOption);
  return subType;
}
function queryDataIndex(data, payload) {
  if (payload.dataIndexInside != null) {
    return payload.dataIndexInside;
  } else if (payload.dataIndex != null) {
    return isArray(payload.dataIndex) ? map$1(payload.dataIndex, function(value) {
      return data.indexOfRawIndex(value);
    }) : data.indexOfRawIndex(payload.dataIndex);
  } else if (payload.name != null) {
    return isArray(payload.name) ? map$1(payload.name, function(value) {
      return data.indexOfName(value);
    }) : data.indexOfName(payload.name);
  }
}
function makeInner() {
  var key = "__ec_inner_" + innerUniqueIndex++;
  return function(hostObj) {
    return hostObj[key] || (hostObj[key] = {});
  };
}
var innerUniqueIndex = getRandomIdBase();
function parseFinder(ecModel, finderInput, opt) {
  var _a2 = preParseFinder(finderInput, opt), mainTypeSpecified = _a2.mainTypeSpecified, queryOptionMap = _a2.queryOptionMap, others = _a2.others;
  var result = others;
  var defaultMainType = opt ? opt.defaultMainType : null;
  if (!mainTypeSpecified && defaultMainType) {
    queryOptionMap.set(defaultMainType, {});
  }
  queryOptionMap.each(function(queryOption, mainType) {
    var queryResult = queryReferringComponents(ecModel, mainType, queryOption, {
      useDefault: defaultMainType === mainType,
      enableAll: opt && opt.enableAll != null ? opt.enableAll : true,
      enableNone: opt && opt.enableNone != null ? opt.enableNone : true
    });
    result[mainType + "Models"] = queryResult.models;
    result[mainType + "Model"] = queryResult.models[0];
  });
  return result;
}
function preParseFinder(finderInput, opt) {
  var finder;
  if (isString(finderInput)) {
    var obj = {};
    obj[finderInput + "Index"] = 0;
    finder = obj;
  } else {
    finder = finderInput;
  }
  var queryOptionMap = createHashMap();
  var others = {};
  var mainTypeSpecified = false;
  each$4(finder, function(value, key) {
    if (key === "dataIndex" || key === "dataIndexInside") {
      others[key] = value;
      return;
    }
    var parsedKey = key.match(/^(\w+)(Index|Id|Name)$/) || [];
    var mainType = parsedKey[1];
    var queryType = (parsedKey[2] || "").toLowerCase();
    if (!mainType || !queryType || opt && opt.includeMainTypes && indexOf(opt.includeMainTypes, mainType) < 0) {
      return;
    }
    mainTypeSpecified = mainTypeSpecified || !!mainType;
    var queryOption = queryOptionMap.get(mainType) || queryOptionMap.set(mainType, {});
    queryOption[queryType] = value;
  });
  return {
    mainTypeSpecified,
    queryOptionMap,
    others
  };
}
var SINGLE_REFERRING = {
  useDefault: true,
  enableAll: false,
  enableNone: false
};
function queryReferringComponents(ecModel, mainType, userOption, opt) {
  opt = opt || SINGLE_REFERRING;
  var indexOption = userOption.index;
  var idOption = userOption.id;
  var nameOption = userOption.name;
  var result = {
    models: null,
    specified: indexOption != null || idOption != null || nameOption != null
  };
  if (!result.specified) {
    var firstCmpt = void 0;
    result.models = opt.useDefault && (firstCmpt = ecModel.getComponent(mainType)) ? [firstCmpt] : [];
    return result;
  }
  if (indexOption === "none" || indexOption === false) {
    if (opt.enableNone) {
      result.models = [];
      return result;
    } else {
      indexOption = -1;
    }
  }
  if (indexOption === "all") {
    if (opt.enableAll) {
      indexOption = idOption = nameOption = null;
    } else {
      indexOption = -1;
    }
  }
  result.models = ecModel.queryComponents({
    mainType,
    index: indexOption,
    id: idOption,
    name: nameOption
  });
  return result;
}
function setAttribute(dom, key, value) {
  dom.setAttribute ? dom.setAttribute(key, value) : dom[key] = value;
}
function getAttribute(dom, key) {
  return dom.getAttribute ? dom.getAttribute(key) : dom[key];
}
function getTooltipRenderMode(renderModeOption) {
  if (renderModeOption === "auto") {
    return env.domSupported ? "html" : "richText";
  } else {
    return renderModeOption || "html";
  }
}
var TYPE_DELIMITER = ".";
var IS_CONTAINER = "___EC__COMPONENT__CONTAINER___";
var IS_EXTENDED_CLASS = "___EC__EXTENDED_CLASS___";
function parseClassType(componentType) {
  var ret = {
    main: "",
    sub: ""
  };
  if (componentType) {
    var typeArr = componentType.split(TYPE_DELIMITER);
    ret.main = typeArr[0] || "";
    ret.sub = typeArr[1] || "";
  }
  return ret;
}
function checkClassType(componentType) {
  assert(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(componentType), 'componentType "' + componentType + '" illegal');
}
function isExtendedClass(clz) {
  return !!(clz && clz[IS_EXTENDED_CLASS]);
}
function enableClassExtend(rootClz, mandatoryMethods) {
  rootClz.$constructor = rootClz;
  rootClz.extend = function(proto) {
    var superClass = this;
    var ExtendedClass;
    if (isESClass(superClass)) {
      ExtendedClass = /** @class */
      function(_super) {
        __extends(class_1, _super);
        function class_1() {
          return _super.apply(this, arguments) || this;
        }
        return class_1;
      }(superClass);
    } else {
      ExtendedClass = function() {
        (proto.$constructor || superClass).apply(this, arguments);
      };
      inherits(ExtendedClass, this);
    }
    extend(ExtendedClass.prototype, proto);
    ExtendedClass[IS_EXTENDED_CLASS] = true;
    ExtendedClass.extend = this.extend;
    ExtendedClass.superCall = superCall;
    ExtendedClass.superApply = superApply;
    ExtendedClass.superClass = superClass;
    return ExtendedClass;
  };
}
function isESClass(fn) {
  return isFunction(fn) && /^class\s/.test(Function.prototype.toString.call(fn));
}
function mountExtend(SubClz, SupperClz) {
  SubClz.extend = SupperClz.extend;
}
var classBase = Math.round(Math.random() * 10);
function enableClassCheck(target) {
  var classAttr = ["__\0is_clz", classBase++].join("_");
  target.prototype[classAttr] = true;
  target.isInstance = function(obj) {
    return !!(obj && obj[classAttr]);
  };
}
function superCall(context, methodName) {
  var args = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  return this.superClass.prototype[methodName].apply(context, args);
}
function superApply(context, methodName, args) {
  return this.superClass.prototype[methodName].apply(context, args);
}
function enableClassManagement(target) {
  var storage = {};
  target.registerClass = function(clz) {
    var componentFullType = clz.type || clz.prototype.type;
    if (componentFullType) {
      checkClassType(componentFullType);
      clz.prototype.type = componentFullType;
      var componentTypeInfo = parseClassType(componentFullType);
      if (!componentTypeInfo.sub) {
        storage[componentTypeInfo.main] = clz;
      } else if (componentTypeInfo.sub !== IS_CONTAINER) {
        var container = makeContainer(componentTypeInfo);
        container[componentTypeInfo.sub] = clz;
      }
    }
    return clz;
  };
  target.getClass = function(mainType, subType, throwWhenNotFound) {
    var clz = storage[mainType];
    if (clz && clz[IS_CONTAINER]) {
      clz = subType ? clz[subType] : null;
    }
    if (throwWhenNotFound && !clz) {
      throw new Error(!subType ? mainType + ".type should be specified." : "Component " + mainType + "." + (subType || "") + " is used but not imported.");
    }
    return clz;
  };
  target.getClassesByMainType = function(componentType) {
    var componentTypeInfo = parseClassType(componentType);
    var result = [];
    var obj = storage[componentTypeInfo.main];
    if (obj && obj[IS_CONTAINER]) {
      each$4(obj, function(o, type) {
        type !== IS_CONTAINER && result.push(o);
      });
    } else {
      result.push(obj);
    }
    return result;
  };
  target.hasClass = function(componentType) {
    var componentTypeInfo = parseClassType(componentType);
    return !!storage[componentTypeInfo.main];
  };
  target.getAllClassMainTypes = function() {
    var types = [];
    each$4(storage, function(obj, type) {
      types.push(type);
    });
    return types;
  };
  target.hasSubTypes = function(componentType) {
    var componentTypeInfo = parseClassType(componentType);
    var obj = storage[componentTypeInfo.main];
    return obj && obj[IS_CONTAINER];
  };
  function makeContainer(componentTypeInfo) {
    var container = storage[componentTypeInfo.main];
    if (!container || !container[IS_CONTAINER]) {
      container = storage[componentTypeInfo.main] = {};
      container[IS_CONTAINER] = true;
    }
    return container;
  }
}
function makeStyleMapper(properties, ignoreParent) {
  for (var i = 0; i < properties.length; i++) {
    if (!properties[i][1]) {
      properties[i][1] = properties[i][0];
    }
  }
  ignoreParent = ignoreParent || false;
  return function(model, excludes, includes) {
    var style = {};
    for (var i2 = 0; i2 < properties.length; i2++) {
      var propName = properties[i2][1];
      if (excludes && indexOf(excludes, propName) >= 0 || includes && indexOf(includes, propName) < 0) {
        continue;
      }
      var val = model.getShallow(propName, ignoreParent);
      if (val != null) {
        style[properties[i2][0]] = val;
      }
    }
    return style;
  };
}
var AREA_STYLE_KEY_MAP = [
  ["fill", "color"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["opacity"],
  ["shadowColor"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
];
var getAreaStyle = makeStyleMapper(AREA_STYLE_KEY_MAP);
var AreaStyleMixin = (
  /** @class */
  function() {
    function AreaStyleMixin2() {
    }
    AreaStyleMixin2.prototype.getAreaStyle = function(excludes, includes) {
      return getAreaStyle(this, excludes, includes);
    };
    return AreaStyleMixin2;
  }()
);
var getECData = makeInner();
var setCommonECData = function(seriesIndex, dataType, dataIdx, el) {
  if (el) {
    var ecData = getECData(el);
    ecData.dataIndex = dataIdx;
    ecData.dataType = dataType;
    ecData.seriesIndex = seriesIndex;
    ecData.ssrType = "chart";
    if (el.type === "group") {
      el.traverse(function(child) {
        var childECData = getECData(child);
        childECData.seriesIndex = seriesIndex;
        childECData.dataIndex = dataIdx;
        childECData.dataType = dataType;
        childECData.ssrType = "chart";
      });
    }
  }
};
var _highlightNextDigit = 1;
var _highlightKeyMap = {};
var getSavedStates = makeInner();
var getComponentStates = makeInner();
var HOVER_STATE_NORMAL = 0;
var HOVER_STATE_BLUR = 1;
var HOVER_STATE_EMPHASIS = 2;
var SPECIAL_STATES = ["emphasis", "blur", "select"];
var DISPLAY_STATES = ["normal", "emphasis", "blur", "select"];
var Z2_EMPHASIS_LIFT = 10;
var Z2_SELECT_LIFT = 9;
var HIGHLIGHT_ACTION_TYPE = "highlight";
var DOWNPLAY_ACTION_TYPE = "downplay";
var SELECT_ACTION_TYPE = "select";
var UNSELECT_ACTION_TYPE = "unselect";
var TOGGLE_SELECT_ACTION_TYPE = "toggleSelect";
var SELECT_CHANGED_EVENT_TYPE = "selectchanged";
function hasFillOrStroke(fillOrStroke) {
  return fillOrStroke != null && fillOrStroke !== "none";
}
function doChangeHoverState(el, stateName, hoverStateEnum) {
  if (el.onHoverStateChange && (el.hoverState || 0) !== hoverStateEnum) {
    el.onHoverStateChange(stateName);
  }
  el.hoverState = hoverStateEnum;
}
function singleEnterEmphasis(el) {
  doChangeHoverState(el, "emphasis", HOVER_STATE_EMPHASIS);
}
function singleLeaveEmphasis(el) {
  if (el.hoverState === HOVER_STATE_EMPHASIS) {
    doChangeHoverState(el, "normal", HOVER_STATE_NORMAL);
  }
}
function singleEnterBlur(el) {
  doChangeHoverState(el, "blur", HOVER_STATE_BLUR);
}
function singleLeaveBlur(el) {
  if (el.hoverState === HOVER_STATE_BLUR) {
    doChangeHoverState(el, "normal", HOVER_STATE_NORMAL);
  }
}
function singleEnterSelect(el) {
  el.selected = true;
}
function singleLeaveSelect(el) {
  el.selected = false;
}
function updateElementState(el, updater, commonParam) {
  updater(el, commonParam);
}
function traverseUpdateState(el, updater, commonParam) {
  updateElementState(el, updater, commonParam);
  el.isGroup && el.traverse(function(child) {
    updateElementState(child, updater, commonParam);
  });
}
function getFromStateStyle(el, props, toStateName, defaultValue) {
  var style = el.style;
  var fromState = {};
  for (var i = 0; i < props.length; i++) {
    var propName = props[i];
    var val = style[propName];
    fromState[propName] = val == null ? defaultValue && defaultValue[propName] : val;
  }
  for (var i = 0; i < el.animators.length; i++) {
    var animator = el.animators[i];
    if (animator.__fromStateTransition && animator.__fromStateTransition.indexOf(toStateName) < 0 && animator.targetName === "style") {
      animator.saveTo(fromState, props);
    }
  }
  return fromState;
}
function createEmphasisDefaultState(el, stateName, targetStates, state) {
  var hasSelect = targetStates && indexOf(targetStates, "select") >= 0;
  var cloned = false;
  if (el instanceof Path) {
    var store = getSavedStates(el);
    var fromFill = hasSelect ? store.selectFill || store.normalFill : store.normalFill;
    var fromStroke = hasSelect ? store.selectStroke || store.normalStroke : store.normalStroke;
    if (hasFillOrStroke(fromFill) || hasFillOrStroke(fromStroke)) {
      state = state || {};
      var emphasisStyle = state.style || {};
      if (emphasisStyle.fill === "inherit") {
        cloned = true;
        state = extend({}, state);
        emphasisStyle = extend({}, emphasisStyle);
        emphasisStyle.fill = fromFill;
      } else if (!hasFillOrStroke(emphasisStyle.fill) && hasFillOrStroke(fromFill)) {
        cloned = true;
        state = extend({}, state);
        emphasisStyle = extend({}, emphasisStyle);
        emphasisStyle.fill = liftColor(fromFill);
      } else if (!hasFillOrStroke(emphasisStyle.stroke) && hasFillOrStroke(fromStroke)) {
        if (!cloned) {
          state = extend({}, state);
          emphasisStyle = extend({}, emphasisStyle);
        }
        emphasisStyle.stroke = liftColor(fromStroke);
      }
      state.style = emphasisStyle;
    }
  }
  if (state) {
    if (state.z2 == null) {
      if (!cloned) {
        state = extend({}, state);
      }
      var z2EmphasisLift = el.z2EmphasisLift;
      state.z2 = el.z2 + (z2EmphasisLift != null ? z2EmphasisLift : Z2_EMPHASIS_LIFT);
    }
  }
  return state;
}
function createSelectDefaultState(el, stateName, state) {
  if (state) {
    if (state.z2 == null) {
      state = extend({}, state);
      var z2SelectLift = el.z2SelectLift;
      state.z2 = el.z2 + (z2SelectLift != null ? z2SelectLift : Z2_SELECT_LIFT);
    }
  }
  return state;
}
function createBlurDefaultState(el, stateName, state) {
  var hasBlur = indexOf(el.currentStates, stateName) >= 0;
  var currentOpacity = el.style.opacity;
  var fromState = !hasBlur ? getFromStateStyle(el, ["opacity"], stateName, {
    opacity: 1
  }) : null;
  state = state || {};
  var blurStyle = state.style || {};
  if (blurStyle.opacity == null) {
    state = extend({}, state);
    blurStyle = extend({
      // Already being applied 'emphasis'. DON'T mul opacity multiple times.
      opacity: hasBlur ? currentOpacity : fromState.opacity * 0.1
    }, blurStyle);
    state.style = blurStyle;
  }
  return state;
}
function elementStateProxy(stateName, targetStates) {
  var state = this.states[stateName];
  if (this.style) {
    if (stateName === "emphasis") {
      return createEmphasisDefaultState(this, stateName, targetStates, state);
    } else if (stateName === "blur") {
      return createBlurDefaultState(this, stateName, state);
    } else if (stateName === "select") {
      return createSelectDefaultState(this, stateName, state);
    }
  }
  return state;
}
function setDefaultStateProxy(el) {
  el.stateProxy = elementStateProxy;
  var textContent = el.getTextContent();
  var textGuide = el.getTextGuideLine();
  if (textContent) {
    textContent.stateProxy = elementStateProxy;
  }
  if (textGuide) {
    textGuide.stateProxy = elementStateProxy;
  }
}
function enterEmphasisWhenMouseOver(el, e) {
  !shouldSilent(el, e) && !el.__highByOuter && traverseUpdateState(el, singleEnterEmphasis);
}
function leaveEmphasisWhenMouseOut(el, e) {
  !shouldSilent(el, e) && !el.__highByOuter && traverseUpdateState(el, singleLeaveEmphasis);
}
function enterEmphasis(el, highlightDigit) {
  el.__highByOuter |= 1 << (highlightDigit || 0);
  traverseUpdateState(el, singleEnterEmphasis);
}
function leaveEmphasis(el, highlightDigit) {
  !(el.__highByOuter &= ~(1 << (highlightDigit || 0))) && traverseUpdateState(el, singleLeaveEmphasis);
}
function enterBlur(el) {
  traverseUpdateState(el, singleEnterBlur);
}
function leaveBlur(el) {
  traverseUpdateState(el, singleLeaveBlur);
}
function enterSelect(el) {
  traverseUpdateState(el, singleEnterSelect);
}
function leaveSelect(el) {
  traverseUpdateState(el, singleLeaveSelect);
}
function shouldSilent(el, e) {
  return el.__highDownSilentOnTouch && e.zrByTouch;
}
function allLeaveBlur(api) {
  var model = api.getModel();
  var leaveBlurredSeries = [];
  var allComponentViews = [];
  model.eachComponent(function(componentType, componentModel) {
    var componentStates = getComponentStates(componentModel);
    var isSeries2 = componentType === "series";
    var view = isSeries2 ? api.getViewOfSeriesModel(componentModel) : api.getViewOfComponentModel(componentModel);
    !isSeries2 && allComponentViews.push(view);
    if (componentStates.isBlured) {
      view.group.traverse(function(child) {
        singleLeaveBlur(child);
      });
      isSeries2 && leaveBlurredSeries.push(componentModel);
    }
    componentStates.isBlured = false;
  });
  each$4(allComponentViews, function(view) {
    if (view && view.toggleBlurSeries) {
      view.toggleBlurSeries(leaveBlurredSeries, false, model);
    }
  });
}
function blurSeries(targetSeriesIndex, focus, blurScope, api) {
  var ecModel = api.getModel();
  blurScope = blurScope || "coordinateSystem";
  function leaveBlurOfIndices(data, dataIndices) {
    for (var i = 0; i < dataIndices.length; i++) {
      var itemEl = data.getItemGraphicEl(dataIndices[i]);
      itemEl && leaveBlur(itemEl);
    }
  }
  if (targetSeriesIndex == null) {
    return;
  }
  if (!focus || focus === "none") {
    return;
  }
  var targetSeriesModel = ecModel.getSeriesByIndex(targetSeriesIndex);
  var targetCoordSys = targetSeriesModel.coordinateSystem;
  if (targetCoordSys && targetCoordSys.master) {
    targetCoordSys = targetCoordSys.master;
  }
  var blurredSeries = [];
  ecModel.eachSeries(function(seriesModel) {
    var sameSeries = targetSeriesModel === seriesModel;
    var coordSys = seriesModel.coordinateSystem;
    if (coordSys && coordSys.master) {
      coordSys = coordSys.master;
    }
    var sameCoordSys = coordSys && targetCoordSys ? coordSys === targetCoordSys : sameSeries;
    if (!// Not blur other series if blurScope series
    (blurScope === "series" && !sameSeries || blurScope === "coordinateSystem" && !sameCoordSys || focus === "series" && sameSeries)) {
      var view = api.getViewOfSeriesModel(seriesModel);
      view.group.traverse(function(child) {
        if (child.__highByOuter && sameSeries && focus === "self") {
          return;
        }
        singleEnterBlur(child);
      });
      if (isArrayLike(focus)) {
        leaveBlurOfIndices(seriesModel.getData(), focus);
      } else if (isObject$2(focus)) {
        var dataTypes = keys(focus);
        for (var d = 0; d < dataTypes.length; d++) {
          leaveBlurOfIndices(seriesModel.getData(dataTypes[d]), focus[dataTypes[d]]);
        }
      }
      blurredSeries.push(seriesModel);
      getComponentStates(seriesModel).isBlured = true;
    }
  });
  ecModel.eachComponent(function(componentType, componentModel) {
    if (componentType === "series") {
      return;
    }
    var view = api.getViewOfComponentModel(componentModel);
    if (view && view.toggleBlurSeries) {
      view.toggleBlurSeries(blurredSeries, true, ecModel);
    }
  });
}
function blurComponent(componentMainType, componentIndex, api) {
  if (componentMainType == null || componentIndex == null) {
    return;
  }
  var componentModel = api.getModel().getComponent(componentMainType, componentIndex);
  if (!componentModel) {
    return;
  }
  getComponentStates(componentModel).isBlured = true;
  var view = api.getViewOfComponentModel(componentModel);
  if (!view || !view.focusBlurEnabled) {
    return;
  }
  view.group.traverse(function(child) {
    singleEnterBlur(child);
  });
}
function blurSeriesFromHighlightPayload(seriesModel, payload, api) {
  var seriesIndex = seriesModel.seriesIndex;
  var data = seriesModel.getData(payload.dataType);
  if (!data) {
    return;
  }
  var dataIndex = queryDataIndex(data, payload);
  dataIndex = (isArray(dataIndex) ? dataIndex[0] : dataIndex) || 0;
  var el = data.getItemGraphicEl(dataIndex);
  if (!el) {
    var count = data.count();
    var current = 0;
    while (!el && current < count) {
      el = data.getItemGraphicEl(current++);
    }
  }
  if (el) {
    var ecData = getECData(el);
    blurSeries(seriesIndex, ecData.focus, ecData.blurScope, api);
  } else {
    var focus_1 = seriesModel.get(["emphasis", "focus"]);
    var blurScope = seriesModel.get(["emphasis", "blurScope"]);
    if (focus_1 != null) {
      blurSeries(seriesIndex, focus_1, blurScope, api);
    }
  }
}
function findComponentHighDownDispatchers(componentMainType, componentIndex, name, api) {
  var ret = {
    focusSelf: false,
    dispatchers: null
  };
  if (componentMainType == null || componentMainType === "series" || componentIndex == null || name == null) {
    return ret;
  }
  var componentModel = api.getModel().getComponent(componentMainType, componentIndex);
  if (!componentModel) {
    return ret;
  }
  var view = api.getViewOfComponentModel(componentModel);
  if (!view || !view.findHighDownDispatchers) {
    return ret;
  }
  var dispatchers = view.findHighDownDispatchers(name);
  var focusSelf;
  for (var i = 0; i < dispatchers.length; i++) {
    if (getECData(dispatchers[i]).focus === "self") {
      focusSelf = true;
      break;
    }
  }
  return {
    focusSelf,
    dispatchers
  };
}
function handleGlobalMouseOverForHighDown(dispatcher, e, api) {
  var ecData = getECData(dispatcher);
  var _a2 = findComponentHighDownDispatchers(ecData.componentMainType, ecData.componentIndex, ecData.componentHighDownName, api), dispatchers = _a2.dispatchers, focusSelf = _a2.focusSelf;
  if (dispatchers) {
    if (focusSelf) {
      blurComponent(ecData.componentMainType, ecData.componentIndex, api);
    }
    each$4(dispatchers, function(dispatcher2) {
      return enterEmphasisWhenMouseOver(dispatcher2, e);
    });
  } else {
    blurSeries(ecData.seriesIndex, ecData.focus, ecData.blurScope, api);
    if (ecData.focus === "self") {
      blurComponent(ecData.componentMainType, ecData.componentIndex, api);
    }
    enterEmphasisWhenMouseOver(dispatcher, e);
  }
}
function handleGlobalMouseOutForHighDown(dispatcher, e, api) {
  allLeaveBlur(api);
  var ecData = getECData(dispatcher);
  var dispatchers = findComponentHighDownDispatchers(ecData.componentMainType, ecData.componentIndex, ecData.componentHighDownName, api).dispatchers;
  if (dispatchers) {
    each$4(dispatchers, function(dispatcher2) {
      return leaveEmphasisWhenMouseOut(dispatcher2, e);
    });
  } else {
    leaveEmphasisWhenMouseOut(dispatcher, e);
  }
}
function toggleSelectionFromPayload(seriesModel, payload, api) {
  if (!isSelectChangePayload(payload)) {
    return;
  }
  var dataType = payload.dataType;
  var data = seriesModel.getData(dataType);
  var dataIndex = queryDataIndex(data, payload);
  if (!isArray(dataIndex)) {
    dataIndex = [dataIndex];
  }
  seriesModel[payload.type === TOGGLE_SELECT_ACTION_TYPE ? "toggleSelect" : payload.type === SELECT_ACTION_TYPE ? "select" : "unselect"](dataIndex, dataType);
}
function updateSeriesElementSelection(seriesModel) {
  var allData = seriesModel.getAllData();
  each$4(allData, function(_a2) {
    var data = _a2.data, type = _a2.type;
    data.eachItemGraphicEl(function(el, idx) {
      seriesModel.isSelected(idx, type) ? enterSelect(el) : leaveSelect(el);
    });
  });
}
function getAllSelectedIndices(ecModel) {
  var ret = [];
  ecModel.eachSeries(function(seriesModel) {
    var allData = seriesModel.getAllData();
    each$4(allData, function(_a2) {
      _a2.data;
      var type = _a2.type;
      var dataIndices = seriesModel.getSelectedDataIndices();
      if (dataIndices.length > 0) {
        var item = {
          dataIndex: dataIndices,
          seriesIndex: seriesModel.seriesIndex
        };
        if (type != null) {
          item.dataType = type;
        }
        ret.push(item);
      }
    });
  });
  return ret;
}
function enableHoverEmphasis(el, focus, blurScope) {
  setAsHighDownDispatcher(el, true);
  traverseUpdateState(el, setDefaultStateProxy);
  enableHoverFocus(el, focus, blurScope);
}
function disableHoverEmphasis(el) {
  setAsHighDownDispatcher(el, false);
}
function toggleHoverEmphasis(el, focus, blurScope, isDisabled) {
  isDisabled ? disableHoverEmphasis(el) : enableHoverEmphasis(el, focus, blurScope);
}
function enableHoverFocus(el, focus, blurScope) {
  var ecData = getECData(el);
  if (focus != null) {
    ecData.focus = focus;
    ecData.blurScope = blurScope;
  } else if (ecData.focus) {
    ecData.focus = null;
  }
}
function setAsHighDownDispatcher(el, asDispatcher) {
  var disable = asDispatcher === false;
  var extendedEl = el;
  if (el.highDownSilentOnTouch) {
    extendedEl.__highDownSilentOnTouch = el.highDownSilentOnTouch;
  }
  if (!disable || extendedEl.__highDownDispatcher) {
    extendedEl.__highByOuter = extendedEl.__highByOuter || 0;
    extendedEl.__highDownDispatcher = !disable;
  }
}
function isHighDownDispatcher(el) {
  return !!(el && el.__highDownDispatcher);
}
function getHighlightDigit(highlightKey) {
  var highlightDigit = _highlightKeyMap[highlightKey];
  if (highlightDigit == null && _highlightNextDigit <= 32) {
    highlightDigit = _highlightKeyMap[highlightKey] = _highlightNextDigit++;
  }
  return highlightDigit;
}
function isSelectChangePayload(payload) {
  var payloadType = payload.type;
  return payloadType === SELECT_ACTION_TYPE || payloadType === UNSELECT_ACTION_TYPE || payloadType === TOGGLE_SELECT_ACTION_TYPE;
}
function isHighDownPayload(payload) {
  var payloadType = payload.type;
  return payloadType === HIGHLIGHT_ACTION_TYPE || payloadType === DOWNPLAY_ACTION_TYPE;
}
function savePathStates(el) {
  var store = getSavedStates(el);
  store.normalFill = el.style.fill;
  store.normalStroke = el.style.stroke;
  var selectState = el.states.select || {};
  store.selectFill = selectState.style && selectState.style.fill || null;
  store.selectStroke = selectState.style && selectState.style.stroke || null;
}
var transitionStore = makeInner();
function getAnimationConfig(animationType, animatableModel, dataIndex, extraOpts, extraDelayParams) {
  var animationPayload;
  if (animatableModel && animatableModel.ecModel) {
    var updatePayload = animatableModel.ecModel.getUpdatePayload();
    animationPayload = updatePayload && updatePayload.animation;
  }
  var animationEnabled = animatableModel && animatableModel.isAnimationEnabled();
  var isUpdate = animationType === "update";
  if (animationEnabled) {
    var duration = void 0;
    var easing = void 0;
    var delay = void 0;
    if (extraOpts) {
      duration = retrieve2(extraOpts.duration, 200);
      easing = retrieve2(extraOpts.easing, "cubicOut");
      delay = 0;
    } else {
      duration = animatableModel.getShallow(isUpdate ? "animationDurationUpdate" : "animationDuration");
      easing = animatableModel.getShallow(isUpdate ? "animationEasingUpdate" : "animationEasing");
      delay = animatableModel.getShallow(isUpdate ? "animationDelayUpdate" : "animationDelay");
    }
    if (animationPayload) {
      animationPayload.duration != null && (duration = animationPayload.duration);
      animationPayload.easing != null && (easing = animationPayload.easing);
      animationPayload.delay != null && (delay = animationPayload.delay);
    }
    if (isFunction(delay)) {
      delay = delay(dataIndex, extraDelayParams);
    }
    if (isFunction(duration)) {
      duration = duration(dataIndex);
    }
    var config = {
      duration: duration || 0,
      delay,
      easing
    };
    return config;
  } else {
    return null;
  }
}
function animateOrSetProps(animationType, el, props, animatableModel, dataIndex, cb, during) {
  var isFrom = false;
  var removeOpt;
  if (isFunction(dataIndex)) {
    during = cb;
    cb = dataIndex;
    dataIndex = null;
  } else if (isObject$2(dataIndex)) {
    cb = dataIndex.cb;
    during = dataIndex.during;
    isFrom = dataIndex.isFrom;
    removeOpt = dataIndex.removeOpt;
    dataIndex = dataIndex.dataIndex;
  }
  var isRemove = animationType === "leave";
  if (!isRemove) {
    el.stopAnimation("leave");
  }
  var animationConfig = getAnimationConfig(animationType, animatableModel, dataIndex, isRemove ? removeOpt || {} : null, animatableModel && animatableModel.getAnimationDelayParams ? animatableModel.getAnimationDelayParams(el, dataIndex) : null);
  if (animationConfig && animationConfig.duration > 0) {
    var duration = animationConfig.duration;
    var animationDelay = animationConfig.delay;
    var animationEasing = animationConfig.easing;
    var animateConfig = {
      duration,
      delay: animationDelay || 0,
      easing: animationEasing,
      done: cb,
      force: !!cb || !!during,
      // Set to final state in update/init animation.
      // So the post processing based on the path shape can be done correctly.
      setToFinal: !isRemove,
      scope: animationType,
      during
    };
    isFrom ? el.animateFrom(props, animateConfig) : el.animateTo(props, animateConfig);
  } else {
    el.stopAnimation();
    !isFrom && el.attr(props);
    during && during(1);
    cb && cb();
  }
}
function updateProps$1(el, props, animatableModel, dataIndex, cb, during) {
  animateOrSetProps("update", el, props, animatableModel, dataIndex, cb, during);
}
function initProps(el, props, animatableModel, dataIndex, cb, during) {
  animateOrSetProps("enter", el, props, animatableModel, dataIndex, cb, during);
}
function isElementRemoved(el) {
  if (!el.__zr) {
    return true;
  }
  for (var i = 0; i < el.animators.length; i++) {
    var animator = el.animators[i];
    if (animator.scope === "leave") {
      return true;
    }
  }
  return false;
}
function removeElement(el, props, animatableModel, dataIndex, cb, during) {
  if (isElementRemoved(el)) {
    return;
  }
  animateOrSetProps("leave", el, props, animatableModel, dataIndex, cb, during);
}
function fadeOutDisplayable(el, animatableModel, dataIndex, done) {
  el.removeTextContent();
  el.removeTextGuideLine();
  removeElement(el, {
    style: {
      opacity: 0
    }
  }, animatableModel, dataIndex, done);
}
function removeElementWithFadeOut(el, animatableModel, dataIndex) {
  function doRemove() {
    el.parent && el.parent.remove(el);
  }
  if (!el.isGroup) {
    fadeOutDisplayable(el, animatableModel, dataIndex, doRemove);
  } else {
    el.traverse(function(disp) {
      if (!disp.isGroup) {
        fadeOutDisplayable(disp, animatableModel, dataIndex, doRemove);
      }
    });
  }
}
function saveOldStyle(el) {
  transitionStore(el).oldStyle = el.style;
}
var _customShapeMap = {};
var XY$1 = ["x", "y"];
var WH$1 = ["width", "height"];
function extendShape(opts) {
  return Path.extend(opts);
}
var extendPathFromString = extendFromString;
function extendPath(pathData, opts) {
  return extendPathFromString(pathData, opts);
}
function registerShape(name, ShapeClass) {
  _customShapeMap[name] = ShapeClass;
}
function getShapeClass(name) {
  if (_customShapeMap.hasOwnProperty(name)) {
    return _customShapeMap[name];
  }
}
function makePath(pathData, opts, rect, layout2) {
  var path = createFromString(pathData, opts);
  if (rect) {
    if (layout2 === "center") {
      rect = centerGraphic(rect, path.getBoundingRect());
    }
    resizePath(path, rect);
  }
  return path;
}
function makeImage(imageUrl, rect, layout2) {
  var zrImg = new ZRImage({
    style: {
      image: imageUrl,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    onload: function(img) {
      if (layout2 === "center") {
        var boundingRect = {
          width: img.width,
          height: img.height
        };
        zrImg.setStyle(centerGraphic(rect, boundingRect));
      }
    }
  });
  return zrImg;
}
function centerGraphic(rect, boundingRect) {
  var aspect = boundingRect.width / boundingRect.height;
  var width = rect.height * aspect;
  var height;
  if (width <= rect.width) {
    height = rect.height;
  } else {
    width = rect.width;
    height = width / aspect;
  }
  var cx = rect.x + rect.width / 2;
  var cy = rect.y + rect.height / 2;
  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height
  };
}
var mergePath = mergePath$1;
function resizePath(path, rect) {
  if (!path.applyTransform) {
    return;
  }
  var pathRect = path.getBoundingRect();
  var m = pathRect.calculateTransform(rect);
  path.applyTransform(m);
}
function subPixelOptimizeLine(shape, lineWidth) {
  subPixelOptimizeLine$1(shape, shape, {
    lineWidth
  });
  return shape;
}
function subPixelOptimizeRect(shape, style) {
  subPixelOptimizeRect$1(shape, shape, style);
  return shape;
}
var subPixelOptimize = subPixelOptimize$1;
function getTransform(target, ancestor) {
  var mat = identity([]);
  while (target && target !== ancestor) {
    mul(mat, target.getLocalTransform(), mat);
    target = target.parent;
  }
  return mat;
}
function applyTransform(target, transform, invert$1) {
  if (transform && !isArrayLike(transform)) {
    transform = Transformable.getLocalTransform(transform);
  }
  if (invert$1) {
    transform = invert([], transform);
  }
  return applyTransform$1([], target, transform);
}
function transformDirection(direction, transform, invert2) {
  var hBase = transform[4] === 0 || transform[5] === 0 || transform[0] === 0 ? 1 : mathAbs$1(2 * transform[4] / transform[0]);
  var vBase = transform[4] === 0 || transform[5] === 0 || transform[2] === 0 ? 1 : mathAbs$1(2 * transform[4] / transform[2]);
  var vertex = [direction === "left" ? -hBase : direction === "right" ? hBase : 0, direction === "top" ? -vBase : direction === "bottom" ? vBase : 0];
  vertex = applyTransform(vertex, transform, invert2);
  return mathAbs$1(vertex[0]) > mathAbs$1(vertex[1]) ? vertex[0] > 0 ? "right" : "left" : vertex[1] > 0 ? "bottom" : "top";
}
function isNotGroup(el) {
  return !el.isGroup;
}
function isPath(el) {
  return el.shape != null;
}
function groupTransition(g1, g2, animatableModel) {
  if (!g1 || !g2) {
    return;
  }
  function getElMap(g) {
    var elMap = {};
    g.traverse(function(el) {
      if (isNotGroup(el) && el.anid) {
        elMap[el.anid] = el;
      }
    });
    return elMap;
  }
  function getAnimatableProps(el) {
    var obj = {
      x: el.x,
      y: el.y,
      rotation: el.rotation
    };
    if (isPath(el)) {
      obj.shape = clone$1(el.shape);
    }
    return obj;
  }
  var elMap1 = getElMap(g1);
  g2.traverse(function(el) {
    if (isNotGroup(el) && el.anid) {
      var oldEl = elMap1[el.anid];
      if (oldEl) {
        var newProp = getAnimatableProps(el);
        el.attr(getAnimatableProps(oldEl));
        updateProps$1(el, newProp, animatableModel, getECData(el).dataIndex);
      }
    }
  });
}
function clipPointsByRect(points, rect) {
  return map$1(points, function(point) {
    var x = point[0];
    x = mathMax(x, rect.x);
    x = mathMin(x, rect.x + rect.width);
    var y = point[1];
    y = mathMax(y, rect.y);
    y = mathMin(y, rect.y + rect.height);
    return [x, y];
  });
}
function clipRectByRect(targetRect, rect) {
  var x = mathMax(targetRect.x, rect.x);
  var x2 = mathMin(targetRect.x + targetRect.width, rect.x + rect.width);
  var y = mathMax(targetRect.y, rect.y);
  var y2 = mathMin(targetRect.y + targetRect.height, rect.y + rect.height);
  if (x2 >= x && y2 >= y) {
    return {
      x,
      y,
      width: x2 - x,
      height: y2 - y
    };
  }
}
function createIcon(iconStr, opt, rect) {
  var innerOpts = extend({
    rectHover: true
  }, opt);
  var style = innerOpts.style = {
    strokeNoScale: true
  };
  rect = rect || {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  };
  if (iconStr) {
    return iconStr.indexOf("image://") === 0 ? (style.image = iconStr.slice(8), defaults(style, rect), new ZRImage(innerOpts)) : makePath(iconStr.replace("path://", ""), innerOpts, rect, "center");
  }
}
function linePolygonIntersect(a1x, a1y, a2x, a2y, points) {
  for (var i = 0, p2 = points[points.length - 1]; i < points.length; i++) {
    var p = points[i];
    if (lineLineIntersect(a1x, a1y, a2x, a2y, p[0], p[1], p2[0], p2[1])) {
      return true;
    }
    p2 = p;
  }
}
function lineLineIntersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
  var mx = a2x - a1x;
  var my = a2y - a1y;
  var nx = b2x - b1x;
  var ny = b2y - b1y;
  var nmCrossProduct = crossProduct2d(nx, ny, mx, my);
  if (nearZero(nmCrossProduct)) {
    return false;
  }
  var b1a1x = a1x - b1x;
  var b1a1y = a1y - b1y;
  var q = crossProduct2d(b1a1x, b1a1y, mx, my) / nmCrossProduct;
  if (q < 0 || q > 1) {
    return false;
  }
  var p = crossProduct2d(b1a1x, b1a1y, nx, ny) / nmCrossProduct;
  if (p < 0 || p > 1) {
    return false;
  }
  return true;
}
function crossProduct2d(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}
function nearZero(val) {
  return val <= 1e-6 && val >= -1e-6;
}
function expandOrShrinkRect(rect, delta, shrinkOrExpand, noNegative, minSize) {
  if (delta == null) {
    return rect;
  } else if (isNumber(delta)) {
    _tmpExpandRectDelta[0] = _tmpExpandRectDelta[1] = _tmpExpandRectDelta[2] = _tmpExpandRectDelta[3] = delta;
  } else {
    _tmpExpandRectDelta[0] = delta[0];
    _tmpExpandRectDelta[1] = delta[1];
    _tmpExpandRectDelta[2] = delta[2];
    _tmpExpandRectDelta[3] = delta[3];
  }
  if (noNegative) {
    _tmpExpandRectDelta[0] = mathMax(0, _tmpExpandRectDelta[0]);
    _tmpExpandRectDelta[1] = mathMax(0, _tmpExpandRectDelta[1]);
    _tmpExpandRectDelta[2] = mathMax(0, _tmpExpandRectDelta[2]);
    _tmpExpandRectDelta[3] = mathMax(0, _tmpExpandRectDelta[3]);
  }
  if (shrinkOrExpand) {
    _tmpExpandRectDelta[0] = -_tmpExpandRectDelta[0];
    _tmpExpandRectDelta[1] = -_tmpExpandRectDelta[1];
    _tmpExpandRectDelta[2] = -_tmpExpandRectDelta[2];
    _tmpExpandRectDelta[3] = -_tmpExpandRectDelta[3];
  }
  expandRectOnOneDimension(rect, _tmpExpandRectDelta, "x", "width", 3, 1, minSize && minSize[0] || 0);
  expandRectOnOneDimension(rect, _tmpExpandRectDelta, "y", "height", 0, 2, minSize && minSize[1] || 0);
  return rect;
}
var _tmpExpandRectDelta = [0, 0, 0, 0];
function expandRectOnOneDimension(rect, delta, xy, wh, ltIdx, rbIdx, minSize) {
  var deltaSum = delta[rbIdx] + delta[ltIdx];
  var oldSize = rect[wh];
  rect[wh] += deltaSum;
  minSize = mathMax(0, mathMin(minSize, oldSize));
  if (rect[wh] < minSize) {
    rect[wh] = minSize;
    rect[xy] += delta[ltIdx] >= 0 ? -delta[ltIdx] : delta[rbIdx] >= 0 ? oldSize + delta[rbIdx] : mathAbs$1(deltaSum) > 1e-8 ? (oldSize - minSize) * delta[ltIdx] / deltaSum : 0;
  } else {
    rect[xy] -= delta[ltIdx];
  }
}
function setTooltipConfig(opt) {
  var itemTooltipOption = opt.itemTooltipOption;
  var componentModel = opt.componentModel;
  var itemName = opt.itemName;
  var itemTooltipOptionObj = isString(itemTooltipOption) ? {
    formatter: itemTooltipOption
  } : itemTooltipOption;
  var mainType = componentModel.mainType;
  var componentIndex = componentModel.componentIndex;
  var formatterParams = {
    componentType: mainType,
    name: itemName,
    $vars: ["name"]
  };
  formatterParams[mainType + "Index"] = componentIndex;
  var formatterParamsExtra = opt.formatterParamsExtra;
  if (formatterParamsExtra) {
    each$4(keys(formatterParamsExtra), function(key) {
      if (!hasOwn(formatterParams, key)) {
        formatterParams[key] = formatterParamsExtra[key];
        formatterParams.$vars.push(key);
      }
    });
  }
  var ecData = getECData(opt.el);
  ecData.componentMainType = mainType;
  ecData.componentIndex = componentIndex;
  ecData.tooltipConfig = {
    name: itemName,
    option: defaults({
      content: itemName,
      encodeHTMLContent: true,
      formatterParams
    }, itemTooltipOptionObj)
  };
}
function traverseElement(el, cb) {
  var stopped;
  if (el.isGroup) {
    stopped = cb(el);
  }
  if (!stopped) {
    el.traverse(cb);
  }
}
function traverseElements(els, cb) {
  if (els) {
    if (isArray(els)) {
      for (var i = 0; i < els.length; i++) {
        traverseElement(els[i], cb);
      }
    } else {
      traverseElement(els, cb);
    }
  }
}
function isBoundingRectAxisAligned(transform) {
  return !transform || mathAbs$1(transform[1]) < AXIS_ALIGN_EPSILON && mathAbs$1(transform[2]) < AXIS_ALIGN_EPSILON || mathAbs$1(transform[0]) < AXIS_ALIGN_EPSILON && mathAbs$1(transform[3]) < AXIS_ALIGN_EPSILON;
}
var AXIS_ALIGN_EPSILON = 1e-5;
function ensureCopyRect(target, source) {
  return target ? BoundingRect.copy(target, source) : source.clone();
}
function ensureCopyTransform(target, source) {
  return source ? copy(target || create(), source) : void 0;
}
function retrieveZInfo(model) {
  return {
    z: model.get("z") || 0,
    zlevel: model.get("zlevel") || 0
  };
}
function calcZ2Range(el) {
  var max = -Infinity;
  var min = Infinity;
  traverseElement(el, function(el2) {
    visitEl(el2);
    visitEl(el2.getTextContent());
    visitEl(el2.getTextGuideLine());
  });
  function visitEl(el2) {
    if (!el2 || el2.isGroup) {
      return;
    }
    var currentStates = el2.currentStates;
    if (currentStates.length) {
      for (var idx = 0; idx < currentStates.length; idx++) {
        calcZ2(el2.states[currentStates[idx]]);
      }
    }
    calcZ2(el2);
  }
  function calcZ2(entity) {
    if (entity) {
      var z2 = entity.z2;
      if (z2 > max) {
        max = z2;
      }
      if (z2 < min) {
        min = z2;
      }
    }
  }
  if (min > max) {
    min = max = 0;
  }
  return {
    min,
    max
  };
}
function traverseUpdateZ(el, z, zlevel) {
  doUpdateZ(el, z, zlevel, -Infinity);
}
function doUpdateZ(el, z, zlevel, maxZ2) {
  if (el.ignoreModelZ) {
    return maxZ2;
  }
  var label = el.getTextContent();
  var labelLine = el.getTextGuideLine();
  var isGroup = el.isGroup;
  if (isGroup) {
    var children = el.childrenRef();
    for (var i = 0; i < children.length; i++) {
      maxZ2 = mathMax(doUpdateZ(children[i], z, zlevel, maxZ2), maxZ2);
    }
  } else {
    el.z = z;
    el.zlevel = zlevel;
    maxZ2 = mathMax(el.z2 || 0, maxZ2);
  }
  if (label) {
    label.z = z;
    label.zlevel = zlevel;
    isFinite(maxZ2) && (label.z2 = maxZ2 + 2);
  }
  if (labelLine) {
    var textGuideLineConfig = el.textGuideLineConfig;
    labelLine.z = z;
    labelLine.zlevel = zlevel;
    isFinite(maxZ2) && (labelLine.z2 = maxZ2 + (textGuideLineConfig && textGuideLineConfig.showAbove ? 1 : -1));
  }
  return maxZ2;
}
registerShape("circle", Circle);
registerShape("ellipse", Ellipse);
registerShape("sector", Sector);
registerShape("ring", Ring);
registerShape("polygon", Polygon);
registerShape("polyline", Polyline);
registerShape("rect", Rect);
registerShape("line", Line$1);
registerShape("bezierCurve", BezierCurve);
registerShape("arc", Arc);
const graphic = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Arc,
  BezierCurve,
  BoundingRect,
  Circle,
  CompoundPath,
  Ellipse,
  Group: Group$2,
  Image: ZRImage,
  IncrementalDisplayable,
  Line: Line$1,
  LinearGradient,
  OrientedBoundingRect,
  Path,
  Point,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Ring,
  Sector,
  Text: ZRText,
  WH: WH$1,
  XY: XY$1,
  applyTransform,
  calcZ2Range,
  clipPointsByRect,
  clipRectByRect,
  createIcon,
  ensureCopyRect,
  ensureCopyTransform,
  expandOrShrinkRect,
  extendPath,
  extendShape,
  getShapeClass,
  getTransform,
  groupTransition,
  initProps,
  isBoundingRectAxisAligned,
  isElementRemoved,
  lineLineIntersect,
  linePolygonIntersect,
  makeImage,
  makePath,
  mergePath,
  registerShape,
  removeElement,
  removeElementWithFadeOut,
  resizePath,
  retrieveZInfo,
  setTooltipConfig,
  subPixelOptimize,
  subPixelOptimizeLine,
  subPixelOptimizeRect,
  transformDirection,
  traverseElements,
  traverseUpdateZ,
  updateProps: updateProps$1
}, Symbol.toStringTag, { value: "Module" }));
var EMPTY_OBJ = {};
function setLabelText(label, labelTexts) {
  for (var i = 0; i < SPECIAL_STATES.length; i++) {
    var stateName = SPECIAL_STATES[i];
    var text = labelTexts[stateName];
    var state = label.ensureState(stateName);
    state.style = state.style || {};
    state.style.text = text;
  }
  var oldStates = label.currentStates.slice();
  label.clearStates(true);
  label.setStyle({
    text: labelTexts.normal
  });
  label.useStates(oldStates, true);
}
function getLabelText(opt, stateModels, interpolatedValue) {
  var labelFetcher = opt.labelFetcher;
  var labelDataIndex = opt.labelDataIndex;
  var labelDimIndex = opt.labelDimIndex;
  var normalModel = stateModels.normal;
  var baseText;
  if (labelFetcher) {
    baseText = labelFetcher.getFormattedLabel(labelDataIndex, "normal", null, labelDimIndex, normalModel && normalModel.get("formatter"), interpolatedValue != null ? {
      interpolatedValue
    } : null);
  }
  if (baseText == null) {
    baseText = isFunction(opt.defaultText) ? opt.defaultText(labelDataIndex, opt, interpolatedValue) : opt.defaultText;
  }
  var statesText = {
    normal: baseText
  };
  for (var i = 0; i < SPECIAL_STATES.length; i++) {
    var stateName = SPECIAL_STATES[i];
    var stateModel = stateModels[stateName];
    statesText[stateName] = retrieve2(labelFetcher ? labelFetcher.getFormattedLabel(labelDataIndex, stateName, null, labelDimIndex, stateModel && stateModel.get("formatter")) : null, baseText);
  }
  return statesText;
}
function setLabelStyle(targetEl, labelStatesModels, opt, stateSpecified) {
  opt = opt || EMPTY_OBJ;
  var isSetOnText = targetEl instanceof ZRText;
  var needsCreateText = false;
  for (var i = 0; i < DISPLAY_STATES.length; i++) {
    var stateModel = labelStatesModels[DISPLAY_STATES[i]];
    if (stateModel && stateModel.getShallow("show")) {
      needsCreateText = true;
      break;
    }
  }
  var textContent = isSetOnText ? targetEl : targetEl.getTextContent();
  if (needsCreateText) {
    if (!isSetOnText) {
      if (!textContent) {
        textContent = new ZRText();
        targetEl.setTextContent(textContent);
      }
      if (targetEl.stateProxy) {
        textContent.stateProxy = targetEl.stateProxy;
      }
    }
    var labelStatesTexts = getLabelText(opt, labelStatesModels);
    var normalModel = labelStatesModels.normal;
    var showNormal = !!normalModel.getShallow("show");
    var normalStyle = createTextStyle(normalModel, stateSpecified, opt, false, !isSetOnText);
    normalStyle.text = labelStatesTexts.normal;
    if (!isSetOnText) {
      targetEl.setTextConfig(createTextConfig(normalModel, opt, false));
    }
    for (var i = 0; i < SPECIAL_STATES.length; i++) {
      var stateName = SPECIAL_STATES[i];
      var stateModel = labelStatesModels[stateName];
      if (stateModel) {
        var stateObj = textContent.ensureState(stateName);
        var stateShow = !!retrieve2(stateModel.getShallow("show"), showNormal);
        if (stateShow !== showNormal) {
          stateObj.ignore = !stateShow;
        }
        stateObj.style = createTextStyle(stateModel, stateSpecified, opt, true, !isSetOnText);
        stateObj.style.text = labelStatesTexts[stateName];
        if (!isSetOnText) {
          var targetElEmphasisState = targetEl.ensureState(stateName);
          targetElEmphasisState.textConfig = createTextConfig(stateModel, opt, true);
        }
      }
    }
    textContent.silent = !!normalModel.getShallow("silent");
    if (textContent.style.x != null) {
      normalStyle.x = textContent.style.x;
    }
    if (textContent.style.y != null) {
      normalStyle.y = textContent.style.y;
    }
    textContent.ignore = !showNormal;
    textContent.useStyle(normalStyle);
    textContent.dirty();
    if (opt.enableTextSetter) {
      labelInner(textContent).setLabelText = function(interpolatedValue) {
        var labelStatesTexts2 = getLabelText(opt, labelStatesModels, interpolatedValue);
        setLabelText(textContent, labelStatesTexts2);
      };
    }
  } else if (textContent) {
    textContent.ignore = true;
  }
  targetEl.dirty();
}
function getLabelStatesModels(itemModel, labelName) {
  labelName = labelName || "label";
  var statesModels = {
    normal: itemModel.getModel(labelName)
  };
  for (var i = 0; i < SPECIAL_STATES.length; i++) {
    var stateName = SPECIAL_STATES[i];
    statesModels[stateName] = itemModel.getModel([stateName, labelName]);
  }
  return statesModels;
}
function createTextStyle(textStyleModel, specifiedTextStyle, opt, isNotNormal, isAttached) {
  var textStyle = {};
  setTextStyleCommon(textStyle, textStyleModel, opt, isNotNormal, isAttached);
  specifiedTextStyle && extend(textStyle, specifiedTextStyle);
  return textStyle;
}
function createTextConfig(textStyleModel, opt, isNotNormal) {
  opt = opt || {};
  var textConfig = {};
  var labelPosition;
  var labelRotate = textStyleModel.getShallow("rotate");
  var labelDistance = retrieve2(textStyleModel.getShallow("distance"), isNotNormal ? null : 5);
  var labelOffset = textStyleModel.getShallow("offset");
  labelPosition = textStyleModel.getShallow("position") || (isNotNormal ? null : "inside");
  labelPosition === "outside" && (labelPosition = opt.defaultOutsidePosition || "top");
  if (labelPosition != null) {
    textConfig.position = labelPosition;
  }
  if (labelOffset != null) {
    textConfig.offset = labelOffset;
  }
  if (labelRotate != null) {
    labelRotate *= Math.PI / 180;
    textConfig.rotation = labelRotate;
  }
  if (labelDistance != null) {
    textConfig.distance = labelDistance;
  }
  textConfig.outsideFill = textStyleModel.get("color") === "inherit" ? opt.inheritColor || null : "auto";
  if (opt.autoOverflowArea != null) {
    textConfig.autoOverflowArea = opt.autoOverflowArea;
  }
  if (opt.layoutRect != null) {
    textConfig.layoutRect = opt.layoutRect;
  }
  return textConfig;
}
function setTextStyleCommon(textStyle, textStyleModel, opt, isNotNormal, isAttached) {
  opt = opt || EMPTY_OBJ;
  var ecModel = textStyleModel.ecModel;
  var globalTextStyle = ecModel && ecModel.option.textStyle;
  var richItemNames = getRichItemNames(textStyleModel);
  var richResult;
  if (richItemNames) {
    richResult = {};
    var richInheritPlainLabelOptionName = "richInheritPlainLabel";
    var richInheritPlainLabel = retrieve2(textStyleModel.get(richInheritPlainLabelOptionName), ecModel ? ecModel.get(richInheritPlainLabelOptionName) : void 0);
    for (var name_1 in richItemNames) {
      if (richItemNames.hasOwnProperty(name_1)) {
        var richTextStyle = textStyleModel.getModel(["rich", name_1]);
        setTokenTextStyle(richResult[name_1] = {}, richTextStyle, globalTextStyle, textStyleModel, richInheritPlainLabel, opt, isNotNormal, isAttached, false, true);
      }
    }
  }
  if (richResult) {
    textStyle.rich = richResult;
  }
  var overflow = textStyleModel.get("overflow");
  if (overflow) {
    textStyle.overflow = overflow;
  }
  var lineOverflow = textStyleModel.get("lineOverflow");
  if (lineOverflow) {
    textStyle.lineOverflow = lineOverflow;
  }
  var labelTextStyle = textStyle;
  var minMargin = textStyleModel.get("minMargin");
  if (minMargin != null) {
    minMargin = !isNumber(minMargin) ? 0 : minMargin / 2;
    labelTextStyle.margin = [minMargin, minMargin, minMargin, minMargin];
    labelTextStyle.__marginType = LabelMarginType.minMargin;
  } else {
    var textMargin = textStyleModel.get("textMargin");
    if (textMargin != null) {
      labelTextStyle.margin = normalizeCssArray$1(textMargin);
      labelTextStyle.__marginType = LabelMarginType.textMargin;
    }
  }
  setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, null, null, opt, isNotNormal, isAttached, true, false);
}
function getRichItemNames(textStyleModel) {
  var richItemNameMap;
  while (textStyleModel && textStyleModel !== textStyleModel.ecModel) {
    var rich = (textStyleModel.option || EMPTY_OBJ).rich;
    if (rich) {
      richItemNameMap = richItemNameMap || {};
      var richKeys = keys(rich);
      for (var i = 0; i < richKeys.length; i++) {
        var richKey = richKeys[i];
        richItemNameMap[richKey] = 1;
      }
    }
    textStyleModel = textStyleModel.parentModel;
  }
  return richItemNameMap;
}
var TEXT_PROPS_WITH_GLOBAL = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"];
var TEXT_PROPS_SELF = ["align", "lineHeight", "width", "height", "tag", "verticalAlign", "ellipsis"];
var TEXT_PROPS_BOX = ["padding", "borderWidth", "borderRadius", "borderDashOffset", "backgroundColor", "borderColor", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"];
function setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, plainTextModel, richInheritPlainLabel, opt, isNotNormal, isAttached, isBlock, inRich) {
  globalTextStyle = !isNotNormal && globalTextStyle || EMPTY_OBJ;
  var inheritColor = opt && opt.inheritColor;
  var fillColor = textStyleModel.getShallow("color");
  var strokeColor = textStyleModel.getShallow("textBorderColor");
  var opacity = retrieve2(textStyleModel.getShallow("opacity"), globalTextStyle.opacity);
  if (fillColor === "inherit" || fillColor === "auto") {
    if (inheritColor) {
      fillColor = inheritColor;
    } else {
      fillColor = null;
    }
  }
  if (strokeColor === "inherit" || strokeColor === "auto") {
    if (inheritColor) {
      strokeColor = inheritColor;
    } else {
      strokeColor = null;
    }
  }
  if (!isAttached) {
    fillColor = fillColor || globalTextStyle.color;
    strokeColor = strokeColor || globalTextStyle.textBorderColor;
  }
  if (fillColor != null) {
    textStyle.fill = fillColor;
  }
  if (strokeColor != null) {
    textStyle.stroke = strokeColor;
  }
  var textBorderWidth = retrieve2(textStyleModel.getShallow("textBorderWidth"), globalTextStyle.textBorderWidth);
  if (textBorderWidth != null) {
    textStyle.lineWidth = textBorderWidth;
  }
  var textBorderType = retrieve2(textStyleModel.getShallow("textBorderType"), globalTextStyle.textBorderType);
  if (textBorderType != null) {
    textStyle.lineDash = textBorderType;
  }
  var textBorderDashOffset = retrieve2(textStyleModel.getShallow("textBorderDashOffset"), globalTextStyle.textBorderDashOffset);
  if (textBorderDashOffset != null) {
    textStyle.lineDashOffset = textBorderDashOffset;
  }
  if (!isNotNormal && opacity == null && !inRich) {
    opacity = opt && opt.defaultOpacity;
  }
  if (opacity != null) {
    textStyle.opacity = opacity;
  }
  if (!isNotNormal && !isAttached) {
    if (textStyle.fill == null && opt.inheritColor) {
      textStyle.fill = opt.inheritColor;
    }
  }
  for (var i = 0; i < TEXT_PROPS_WITH_GLOBAL.length; i++) {
    var key = TEXT_PROPS_WITH_GLOBAL[i];
    var val = richInheritPlainLabel !== false && plainTextModel ? retrieve3(textStyleModel.getShallow(key), plainTextModel.getShallow(key), globalTextStyle[key]) : retrieve2(textStyleModel.getShallow(key), globalTextStyle[key]);
    if (val != null) {
      textStyle[key] = val;
    }
  }
  for (var i = 0; i < TEXT_PROPS_SELF.length; i++) {
    var key = TEXT_PROPS_SELF[i];
    var val = textStyleModel.getShallow(key);
    if (val != null) {
      textStyle[key] = val;
    }
  }
  if (textStyle.verticalAlign == null) {
    var baseline = textStyleModel.getShallow("baseline");
    if (baseline != null) {
      textStyle.verticalAlign = baseline;
    }
  }
  if (!isBlock || !opt.disableBox) {
    for (var i = 0; i < TEXT_PROPS_BOX.length; i++) {
      var key = TEXT_PROPS_BOX[i];
      var val = textStyleModel.getShallow(key);
      if (val != null) {
        textStyle[key] = val;
      }
    }
    var borderType = textStyleModel.getShallow("borderType");
    if (borderType != null) {
      textStyle.borderDash = borderType;
    }
    if ((textStyle.backgroundColor === "auto" || textStyle.backgroundColor === "inherit") && inheritColor) {
      textStyle.backgroundColor = inheritColor;
    }
    if ((textStyle.borderColor === "auto" || textStyle.borderColor === "inherit") && inheritColor) {
      textStyle.borderColor = inheritColor;
    }
  }
}
function getFont(opt, ecModel) {
  var gTextStyleModel = ecModel && ecModel.getModel("textStyle");
  return trim([
    // FIXME in node-canvas fontWeight is before fontStyle
    opt.fontStyle || gTextStyleModel && gTextStyleModel.getShallow("fontStyle") || "",
    opt.fontWeight || gTextStyleModel && gTextStyleModel.getShallow("fontWeight") || "",
    (opt.fontSize || gTextStyleModel && gTextStyleModel.getShallow("fontSize") || 12) + "px",
    opt.fontFamily || gTextStyleModel && gTextStyleModel.getShallow("fontFamily") || "sans-serif"
  ].join(" "));
}
var labelInner = makeInner();
var LabelMarginType = {
  minMargin: 1,
  textMargin: 2
};
var PATH_COLOR = ["textStyle", "color"];
var textStyleParams = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "padding", "lineHeight", "rich", "width", "height", "overflow"];
var tmpText = new ZRText();
var TextStyleMixin = (
  /** @class */
  function() {
    function TextStyleMixin2() {
    }
    TextStyleMixin2.prototype.getTextColor = function(isEmphasis) {
      var ecModel = this.ecModel;
      return this.getShallow("color") || (!isEmphasis && ecModel ? ecModel.get(PATH_COLOR) : null);
    };
    TextStyleMixin2.prototype.getFont = function() {
      return getFont({
        fontStyle: this.getShallow("fontStyle"),
        fontWeight: this.getShallow("fontWeight"),
        fontSize: this.getShallow("fontSize"),
        fontFamily: this.getShallow("fontFamily")
      }, this.ecModel);
    };
    TextStyleMixin2.prototype.getTextRect = function(text) {
      var style = {
        text,
        verticalAlign: this.getShallow("verticalAlign") || this.getShallow("baseline")
      };
      for (var i = 0; i < textStyleParams.length; i++) {
        style[textStyleParams[i]] = this.getShallow(textStyleParams[i]);
      }
      tmpText.useStyle(style);
      tmpText.update();
      return tmpText.getBoundingRect();
    };
    return TextStyleMixin2;
  }()
);
var LINE_STYLE_KEY_MAP = [
  ["lineWidth", "width"],
  ["stroke", "color"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "type"],
  ["lineDashOffset", "dashOffset"],
  ["lineCap", "cap"],
  ["lineJoin", "join"],
  ["miterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
];
var getLineStyle = makeStyleMapper(LINE_STYLE_KEY_MAP);
var LineStyleMixin = (
  /** @class */
  function() {
    function LineStyleMixin2() {
    }
    LineStyleMixin2.prototype.getLineStyle = function(excludes) {
      return getLineStyle(this, excludes);
    };
    return LineStyleMixin2;
  }()
);
var ITEM_STYLE_KEY_MAP = [
  ["fill", "color"],
  ["stroke", "borderColor"],
  ["lineWidth", "borderWidth"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "borderType"],
  ["lineDashOffset", "borderDashOffset"],
  ["lineCap", "borderCap"],
  ["lineJoin", "borderJoin"],
  ["miterLimit", "borderMiterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
];
var getItemStyle = makeStyleMapper(ITEM_STYLE_KEY_MAP);
var ItemStyleMixin = (
  /** @class */
  function() {
    function ItemStyleMixin2() {
    }
    ItemStyleMixin2.prototype.getItemStyle = function(excludes, includes) {
      return getItemStyle(this, excludes, includes);
    };
    return ItemStyleMixin2;
  }()
);
var Model = (
  /** @class */
  function() {
    function Model2(option, parentModel, ecModel) {
      this.parentModel = parentModel;
      this.ecModel = ecModel;
      this.option = option;
    }
    Model2.prototype.init = function(option, parentModel, ecModel) {
    };
    Model2.prototype.mergeOption = function(option, ecModel) {
      merge(this.option, option, true);
    };
    Model2.prototype.get = function(path, ignoreParent) {
      if (path == null) {
        return this.option;
      }
      return this._doGet(this.parsePath(path), !ignoreParent && this.parentModel);
    };
    Model2.prototype.getShallow = function(key, ignoreParent) {
      var option = this.option;
      var val = option == null ? option : option[key];
      if (val == null && !ignoreParent) {
        var parentModel = this.parentModel;
        if (parentModel) {
          val = parentModel.getShallow(key);
        }
      }
      return val;
    };
    Model2.prototype.getModel = function(path, parentModel) {
      var hasPath = path != null;
      var pathFinal = hasPath ? this.parsePath(path) : null;
      var obj = hasPath ? this._doGet(pathFinal) : this.option;
      parentModel = parentModel || this.parentModel && this.parentModel.getModel(this.resolveParentPath(pathFinal));
      return new Model2(obj, parentModel, this.ecModel);
    };
    Model2.prototype.isEmpty = function() {
      return this.option == null;
    };
    Model2.prototype.restoreData = function() {
    };
    Model2.prototype.clone = function() {
      var Ctor = this.constructor;
      return new Ctor(clone$1(this.option));
    };
    Model2.prototype.parsePath = function(path) {
      if (typeof path === "string") {
        return path.split(".");
      }
      return path;
    };
    Model2.prototype.resolveParentPath = function(path) {
      return path;
    };
    Model2.prototype.isAnimationEnabled = function() {
      if (!env.node && this.option) {
        if (this.option.animation != null) {
          return !!this.option.animation;
        } else if (this.parentModel) {
          return this.parentModel.isAnimationEnabled();
        }
      }
    };
    Model2.prototype._doGet = function(pathArr, parentModel) {
      var obj = this.option;
      if (!pathArr) {
        return obj;
      }
      for (var i = 0; i < pathArr.length; i++) {
        if (!pathArr[i]) {
          continue;
        }
        obj = obj && typeof obj === "object" ? obj[pathArr[i]] : null;
        if (obj == null) {
          break;
        }
      }
      if (obj == null && parentModel) {
        obj = parentModel._doGet(this.resolveParentPath(pathArr), parentModel.parentModel);
      }
      return obj;
    };
    return Model2;
  }()
);
enableClassExtend(Model);
enableClassCheck(Model);
mixin(Model, LineStyleMixin);
mixin(Model, ItemStyleMixin);
mixin(Model, AreaStyleMixin);
mixin(Model, TextStyleMixin);
var base = Math.round(Math.random() * 10);
function getUID(type) {
  return [type || "", base++].join("_");
}
function enableSubTypeDefaulter(target) {
  var subTypeDefaulters = {};
  target.registerSubTypeDefaulter = function(componentType, defaulter) {
    var componentTypeInfo = parseClassType(componentType);
    subTypeDefaulters[componentTypeInfo.main] = defaulter;
  };
  target.determineSubType = function(componentType, option) {
    var type = option.type;
    if (!type) {
      var componentTypeMain = parseClassType(componentType).main;
      if (target.hasSubTypes(componentType) && subTypeDefaulters[componentTypeMain]) {
        type = subTypeDefaulters[componentTypeMain](option);
      }
    }
    return type;
  };
}
function enableTopologicalTravel(entity, dependencyGetter) {
  entity.topologicalTravel = function(targetNameList, fullNameList, callback, context) {
    if (!targetNameList.length) {
      return;
    }
    var result = makeDepndencyGraph(fullNameList);
    var graph = result.graph;
    var noEntryList = result.noEntryList;
    var targetNameSet = {};
    each$4(targetNameList, function(name) {
      targetNameSet[name] = true;
    });
    while (noEntryList.length) {
      var currComponentType = noEntryList.pop();
      var currVertex = graph[currComponentType];
      var isInTargetNameSet = !!targetNameSet[currComponentType];
      if (isInTargetNameSet) {
        callback.call(context, currComponentType, currVertex.originalDeps.slice());
        delete targetNameSet[currComponentType];
      }
      each$4(currVertex.successor, isInTargetNameSet ? removeEdgeAndAdd : removeEdge);
    }
    each$4(targetNameSet, function() {
      var errMsg = "";
      throw new Error(errMsg);
    });
    function removeEdge(succComponentType) {
      graph[succComponentType].entryCount--;
      if (graph[succComponentType].entryCount === 0) {
        noEntryList.push(succComponentType);
      }
    }
    function removeEdgeAndAdd(succComponentType) {
      targetNameSet[succComponentType] = true;
      removeEdge(succComponentType);
    }
  };
  function makeDepndencyGraph(fullNameList) {
    var graph = {};
    var noEntryList = [];
    each$4(fullNameList, function(name) {
      var thisItem = createDependencyGraphItem(graph, name);
      var originalDeps = thisItem.originalDeps = dependencyGetter(name);
      var availableDeps = getAvailableDependencies(originalDeps, fullNameList);
      thisItem.entryCount = availableDeps.length;
      if (thisItem.entryCount === 0) {
        noEntryList.push(name);
      }
      each$4(availableDeps, function(dependentName) {
        if (indexOf(thisItem.predecessor, dependentName) < 0) {
          thisItem.predecessor.push(dependentName);
        }
        var thatItem = createDependencyGraphItem(graph, dependentName);
        if (indexOf(thatItem.successor, dependentName) < 0) {
          thatItem.successor.push(name);
        }
      });
    });
    return {
      graph,
      noEntryList
    };
  }
  function createDependencyGraphItem(graph, name) {
    if (!graph[name]) {
      graph[name] = {
        predecessor: [],
        successor: []
      };
    }
    return graph[name];
  }
  function getAvailableDependencies(originalDeps, fullNameList) {
    var availableDeps = [];
    each$4(originalDeps, function(dep) {
      indexOf(fullNameList, dep) >= 0 && availableDeps.push(dep);
    });
    return availableDeps;
  }
}
function inheritDefaultOption(superOption, subOption) {
  return merge(merge({}, superOption, true), subOption, true);
}
const langEN = {
  time: {
    month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayOfWeekAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  legend: {
    selector: {
      all: "All",
      inverse: "Inv"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "Box Select",
        polygon: "Lasso Select",
        lineX: "Horizontally Select",
        lineY: "Vertically Select",
        keep: "Keep Selections",
        clear: "Clear Selections"
      }
    },
    dataView: {
      title: "Data View",
      lang: ["Data View", "Close", "Refresh"]
    },
    dataZoom: {
      title: {
        zoom: "Zoom",
        back: "Zoom Reset"
      }
    },
    magicType: {
      title: {
        line: "Switch to Line Chart",
        bar: "Switch to Bar Chart",
        stack: "Stack",
        tiled: "Tile"
      }
    },
    restore: {
      title: "Restore"
    },
    saveAsImage: {
      title: "Save as Image",
      lang: ["Right Click to Save Image"]
    }
  },
  series: {
    typeNames: {
      pie: "Pie chart",
      bar: "Bar chart",
      line: "Line chart",
      scatter: "Scatter plot",
      effectScatter: "Ripple scatter plot",
      radar: "Radar chart",
      tree: "Tree",
      treemap: "Treemap",
      boxplot: "Boxplot",
      candlestick: "Candlestick",
      k: "K line chart",
      heatmap: "Heat map",
      map: "Map",
      parallel: "Parallel coordinate map",
      lines: "Line graph",
      graph: "Relationship graph",
      sankey: "Sankey diagram",
      funnel: "Funnel chart",
      gauge: "Gauge",
      pictorialBar: "Pictorial bar",
      themeRiver: "Theme River Map",
      sunburst: "Sunburst",
      custom: "Custom chart",
      chart: "Chart"
    }
  },
  aria: {
    general: {
      withTitle: 'This is a chart about "{title}"',
      withoutTitle: "This is a chart"
    },
    series: {
      single: {
        prefix: "",
        withName: " with type {seriesType} named {seriesName}.",
        withoutName: " with type {seriesType}."
      },
      multiple: {
        prefix: ". It consists of {seriesCount} series count.",
        withName: " The {seriesId} series is a {seriesType} representing {seriesName}.",
        withoutName: " The {seriesId} series is a {seriesType}.",
        separator: {
          middle: "",
          end: ""
        }
      }
    },
    data: {
      allData: "The data is as follows: ",
      partialData: "The first {displayCnt} items are: ",
      withName: "the data for {name} is {value}",
      withoutName: "{value}",
      separator: {
        middle: ", ",
        end: ". "
      }
    }
  }
};
const langZH = {
  time: {
    month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthAbbr: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    dayOfWeek: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayOfWeekAbbr: ["日", "一", "二", "三", "四", "五", "六"]
  },
  legend: {
    selector: {
      all: "全选",
      inverse: "反选"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "矩形选择",
        polygon: "圈选",
        lineX: "横向选择",
        lineY: "纵向选择",
        keep: "保持选择",
        clear: "清除选择"
      }
    },
    dataView: {
      title: "数据视图",
      lang: ["数据视图", "关闭", "刷新"]
    },
    dataZoom: {
      title: {
        zoom: "区域缩放",
        back: "区域缩放还原"
      }
    },
    magicType: {
      title: {
        line: "切换为折线图",
        bar: "切换为柱状图",
        stack: "切换为堆叠",
        tiled: "切换为平铺"
      }
    },
    restore: {
      title: "还原"
    },
    saveAsImage: {
      title: "保存为图片",
      lang: ["右键另存为图片"]
    }
  },
  series: {
    typeNames: {
      pie: "饼图",
      bar: "柱状图",
      line: "折线图",
      scatter: "散点图",
      effectScatter: "涟漪散点图",
      radar: "雷达图",
      tree: "树图",
      treemap: "矩形树图",
      boxplot: "箱型图",
      candlestick: "K线图",
      k: "K线图",
      heatmap: "热力图",
      map: "地图",
      parallel: "平行坐标图",
      lines: "线图",
      graph: "关系图",
      sankey: "桑基图",
      funnel: "漏斗图",
      gauge: "仪表盘图",
      pictorialBar: "象形柱图",
      themeRiver: "主题河流图",
      sunburst: "旭日图",
      custom: "自定义图表",
      chart: "图表"
    }
  },
  aria: {
    general: {
      withTitle: "这是一个关于“{title}”的图表。",
      withoutTitle: "这是一个图表，"
    },
    series: {
      single: {
        prefix: "",
        withName: "图表类型是{seriesType}，表示{seriesName}。",
        withoutName: "图表类型是{seriesType}。"
      },
      multiple: {
        prefix: "它由{seriesCount}个图表系列组成。",
        withName: "第{seriesId}个系列是一个表示{seriesName}的{seriesType}，",
        withoutName: "第{seriesId}个系列是一个{seriesType}，",
        separator: {
          middle: "；",
          end: "。"
        }
      }
    },
    data: {
      allData: "其数据是——",
      partialData: "其中，前{displayCnt}项是——",
      withName: "{name}的数据是{value}",
      withoutName: "{value}",
      separator: {
        middle: "，",
        end: ""
      }
    }
  }
};
var LOCALE_ZH = "ZH";
var LOCALE_EN = "EN";
var DEFAULT_LOCALE = LOCALE_EN;
var localeStorage = {};
var localeModels = {};
var SYSTEM_LANG = !env.domSupported ? DEFAULT_LOCALE : function() {
  var langStr = (
    /* eslint-disable-next-line */
    (document.documentElement.lang || navigator.language || navigator.browserLanguage || DEFAULT_LOCALE).toUpperCase()
  );
  return langStr.indexOf(LOCALE_ZH) > -1 ? LOCALE_ZH : DEFAULT_LOCALE;
}();
function registerLocale(locale, localeObj) {
  locale = locale.toUpperCase();
  localeModels[locale] = new Model(localeObj);
  localeStorage[locale] = localeObj;
}
function createLocaleObject(locale) {
  if (isString(locale)) {
    var localeObj = localeStorage[locale.toUpperCase()] || {};
    if (locale === LOCALE_ZH || locale === LOCALE_EN) {
      return clone$1(localeObj);
    } else {
      return merge(clone$1(localeObj), clone$1(localeStorage[DEFAULT_LOCALE]), false);
    }
  } else {
    return merge(clone$1(locale), clone$1(localeStorage[DEFAULT_LOCALE]), false);
  }
}
function getLocaleModel(lang) {
  return localeModels[lang];
}
function getDefaultLocaleModel() {
  return localeModels[DEFAULT_LOCALE];
}
registerLocale(LOCALE_EN, langEN);
registerLocale(LOCALE_ZH, langZH);
var _impl$1 = null;
function getScaleBreakHelper() {
  return _impl$1;
}
var ONE_SECOND = 1e3;
var ONE_MINUTE = ONE_SECOND * 60;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24;
var ONE_YEAR = ONE_DAY * 365;
var primaryTimeUnitFormatterMatchers = {
  year: /({yyyy}|{yy})/,
  month: /({MMMM}|{MMM}|{MM}|{M})/,
  day: /({dd}|{d})/,
  hour: /({HH}|{H}|{hh}|{h})/,
  minute: /({mm}|{m})/,
  second: /({ss}|{s})/,
  millisecond: /({SSS}|{S})/
};
var defaultFormatterSeed = {
  year: "{yyyy}",
  month: "{MMM}",
  day: "{d}",
  hour: "{HH}:{mm}",
  minute: "{HH}:{mm}",
  second: "{HH}:{mm}:{ss}",
  millisecond: "{HH}:{mm}:{ss} {SSS}"
};
var defaultFullFormatter = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss} {SSS}";
var fullDayFormatter = "{yyyy}-{MM}-{dd}";
var fullLeveledFormatter = {
  year: "{yyyy}",
  month: "{yyyy}-{MM}",
  day: fullDayFormatter,
  hour: fullDayFormatter + " " + defaultFormatterSeed.hour,
  minute: fullDayFormatter + " " + defaultFormatterSeed.minute,
  second: fullDayFormatter + " " + defaultFormatterSeed.second,
  millisecond: defaultFullFormatter
};
var primaryTimeUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
var timeUnits = ["year", "half-year", "quarter", "month", "week", "half-week", "day", "half-day", "quarter-day", "hour", "minute", "second", "millisecond"];
function parseTimeAxisLabelFormatter(formatter) {
  return !isString(formatter) && !isFunction(formatter) ? parseTimeAxisLabelFormatterDictionary(formatter) : formatter;
}
function parseTimeAxisLabelFormatterDictionary(dictOption) {
  dictOption = dictOption || {};
  var dict = {};
  var canAddHighlight = true;
  each$4(primaryTimeUnits, function(lowestUnit) {
    canAddHighlight && (canAddHighlight = dictOption[lowestUnit] == null);
  });
  each$4(primaryTimeUnits, function(lowestUnit, lowestUnitIdx) {
    var upperDictOption = dictOption[lowestUnit];
    dict[lowestUnit] = {};
    var lowerTpl = null;
    for (var upperUnitIdx = lowestUnitIdx; upperUnitIdx >= 0; upperUnitIdx--) {
      var upperUnit = primaryTimeUnits[upperUnitIdx];
      var upperDictItemOption = isObject$2(upperDictOption) && !isArray(upperDictOption) ? upperDictOption[upperUnit] : upperDictOption;
      var tplArr = void 0;
      if (isArray(upperDictItemOption)) {
        tplArr = upperDictItemOption.slice();
        lowerTpl = tplArr[0] || "";
      } else if (isString(upperDictItemOption)) {
        lowerTpl = upperDictItemOption;
        tplArr = [lowerTpl];
      } else {
        if (lowerTpl == null) {
          lowerTpl = defaultFormatterSeed[lowestUnit];
        } else if (!primaryTimeUnitFormatterMatchers[upperUnit].test(lowerTpl)) {
          lowerTpl = dict[upperUnit][upperUnit][0] + " " + lowerTpl;
        }
        tplArr = [lowerTpl];
        if (canAddHighlight) {
          tplArr[1] = "{primary|" + lowerTpl + "}";
        }
      }
      dict[lowestUnit][upperUnit] = tplArr;
    }
  });
  return dict;
}
function pad(str, len2) {
  str += "";
  return "0000".substr(0, len2 - str.length) + str;
}
function getPrimaryTimeUnit(timeUnit) {
  switch (timeUnit) {
    case "half-year":
    case "quarter":
      return "month";
    case "week":
    case "half-week":
      return "day";
    case "half-day":
    case "quarter-day":
      return "hour";
    default:
      return timeUnit;
  }
}
function isPrimaryTimeUnit(timeUnit) {
  return timeUnit === getPrimaryTimeUnit(timeUnit);
}
function getDefaultFormatPrecisionOfInterval(timeUnit) {
  switch (timeUnit) {
    case "year":
    case "month":
      return "day";
    case "millisecond":
      return "millisecond";
    default:
      return "second";
  }
}
function format(time, template, isUTC, lang) {
  var date = parseDate(time);
  var y = date[fullYearGetterName(isUTC)]();
  var M = date[monthGetterName(isUTC)]() + 1;
  var q = Math.floor((M - 1) / 3) + 1;
  var d = date[dateGetterName(isUTC)]();
  var e = date["get" + (isUTC ? "UTC" : "") + "Day"]();
  var H = date[hoursGetterName(isUTC)]();
  var h = (H - 1) % 12 + 1;
  var m = date[minutesGetterName(isUTC)]();
  var s = date[secondsGetterName(isUTC)]();
  var S = date[millisecondsGetterName(isUTC)]();
  var a = H >= 12 ? "pm" : "am";
  var A = a.toUpperCase();
  var localeModel = lang instanceof Model ? lang : getLocaleModel(lang || SYSTEM_LANG) || getDefaultLocaleModel();
  var timeModel = localeModel.getModel("time");
  var month = timeModel.get("month");
  var monthAbbr = timeModel.get("monthAbbr");
  var dayOfWeek = timeModel.get("dayOfWeek");
  var dayOfWeekAbbr = timeModel.get("dayOfWeekAbbr");
  return (template || "").replace(/{a}/g, a + "").replace(/{A}/g, A + "").replace(/{yyyy}/g, y + "").replace(/{yy}/g, pad(y % 100 + "", 2)).replace(/{Q}/g, q + "").replace(/{MMMM}/g, month[M - 1]).replace(/{MMM}/g, monthAbbr[M - 1]).replace(/{MM}/g, pad(M, 2)).replace(/{M}/g, M + "").replace(/{dd}/g, pad(d, 2)).replace(/{d}/g, d + "").replace(/{eeee}/g, dayOfWeek[e]).replace(/{ee}/g, dayOfWeekAbbr[e]).replace(/{e}/g, e + "").replace(/{HH}/g, pad(H, 2)).replace(/{H}/g, H + "").replace(/{hh}/g, pad(h + "", 2)).replace(/{h}/g, h + "").replace(/{mm}/g, pad(m, 2)).replace(/{m}/g, m + "").replace(/{ss}/g, pad(s, 2)).replace(/{s}/g, s + "").replace(/{SSS}/g, pad(S, 3)).replace(/{S}/g, S + "");
}
function leveledFormat(tick, idx, formatter, lang, isUTC) {
  var template = null;
  if (isString(formatter)) {
    template = formatter;
  } else if (isFunction(formatter)) {
    var extra = {
      time: tick.time,
      level: tick.time.level
    };
    var scaleBreakHelper = getScaleBreakHelper();
    if (scaleBreakHelper) {
      scaleBreakHelper.makeAxisLabelFormatterParamBreak(extra, tick["break"]);
    }
    template = formatter(tick.value, idx, extra);
  } else {
    var tickTime = tick.time;
    if (tickTime) {
      var leveledTplArr = formatter[tickTime.lowerTimeUnit][tickTime.upperTimeUnit];
      template = leveledTplArr[Math.min(tickTime.level, leveledTplArr.length - 1)] || "";
    } else {
      var unit = getUnitFromValue(tick.value, isUTC);
      template = formatter[unit][unit][0];
    }
  }
  return format(new Date(tick.value), template, isUTC, lang);
}
function getUnitFromValue(value, isUTC) {
  var date = parseDate(value);
  var M = date[monthGetterName(isUTC)]() + 1;
  var d = date[dateGetterName(isUTC)]();
  var h = date[hoursGetterName(isUTC)]();
  var m = date[minutesGetterName(isUTC)]();
  var s = date[secondsGetterName(isUTC)]();
  var S = date[millisecondsGetterName(isUTC)]();
  var isSecond = S === 0;
  var isMinute = isSecond && s === 0;
  var isHour = isMinute && m === 0;
  var isDay = isHour && h === 0;
  var isMonth = isDay && d === 1;
  var isYear = isMonth && M === 1;
  if (isYear) {
    return "year";
  } else if (isMonth) {
    return "month";
  } else if (isDay) {
    return "day";
  } else if (isHour) {
    return "hour";
  } else if (isMinute) {
    return "minute";
  } else if (isSecond) {
    return "second";
  } else {
    return "millisecond";
  }
}
function roundTime(date, timeUnit, isUTC) {
  switch (timeUnit) {
    case "year":
      date[monthSetterName(isUTC)](0);
    case "month":
      date[dateSetterName(isUTC)](1);
    case "day":
      date[hoursSetterName(isUTC)](0);
    case "hour":
      date[minutesSetterName(isUTC)](0);
    case "minute":
      date[secondsSetterName(isUTC)](0);
    case "second":
      date[millisecondsSetterName(isUTC)](0);
  }
  return date;
}
function fullYearGetterName(isUTC) {
  return isUTC ? "getUTCFullYear" : "getFullYear";
}
function monthGetterName(isUTC) {
  return isUTC ? "getUTCMonth" : "getMonth";
}
function dateGetterName(isUTC) {
  return isUTC ? "getUTCDate" : "getDate";
}
function hoursGetterName(isUTC) {
  return isUTC ? "getUTCHours" : "getHours";
}
function minutesGetterName(isUTC) {
  return isUTC ? "getUTCMinutes" : "getMinutes";
}
function secondsGetterName(isUTC) {
  return isUTC ? "getUTCSeconds" : "getSeconds";
}
function millisecondsGetterName(isUTC) {
  return isUTC ? "getUTCMilliseconds" : "getMilliseconds";
}
function fullYearSetterName(isUTC) {
  return isUTC ? "setUTCFullYear" : "setFullYear";
}
function monthSetterName(isUTC) {
  return isUTC ? "setUTCMonth" : "setMonth";
}
function dateSetterName(isUTC) {
  return isUTC ? "setUTCDate" : "setDate";
}
function hoursSetterName(isUTC) {
  return isUTC ? "setUTCHours" : "setHours";
}
function minutesSetterName(isUTC) {
  return isUTC ? "setUTCMinutes" : "setMinutes";
}
function secondsSetterName(isUTC) {
  return isUTC ? "setUTCSeconds" : "setSeconds";
}
function millisecondsSetterName(isUTC) {
  return isUTC ? "setUTCMilliseconds" : "setMilliseconds";
}
function addCommas(x) {
  if (!isNumeric(x)) {
    return isString(x) ? x : "-";
  }
  var parts = (x + "").split(".");
  return parts[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (parts.length > 1 ? "." + parts[1] : "");
}
function toCamelCase(str, upperCaseFirst) {
  str = (str || "").toLowerCase().replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}
var normalizeCssArray = normalizeCssArray$1;
function makeValueReadable(value, valueType, useUTC) {
  var USER_READABLE_DEFUALT_TIME_PATTERN = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}";
  function stringToUserReadable(str) {
    return str && trim(str) ? str : "-";
  }
  function isNumberUserReadable(num) {
    return !!(num != null && !isNaN(num) && isFinite(num));
  }
  var isTypeTime = valueType === "time";
  var isValueDate = value instanceof Date;
  if (isTypeTime || isValueDate) {
    var date = isTypeTime ? parseDate(value) : value;
    if (!isNaN(+date)) {
      return format(date, USER_READABLE_DEFUALT_TIME_PATTERN, useUTC);
    } else if (isValueDate) {
      return "-";
    }
  }
  if (valueType === "ordinal") {
    return isStringSafe(value) ? stringToUserReadable(value) : isNumber(value) ? isNumberUserReadable(value) ? value + "" : "-" : "-";
  }
  var numericResult = numericToNumber(value);
  return isNumberUserReadable(numericResult) ? addCommas(numericResult) : isStringSafe(value) ? stringToUserReadable(value) : typeof value === "boolean" ? value + "" : "-";
}
var TPL_VAR_ALIAS = ["a", "b", "c", "d", "e", "f", "g"];
var wrapVar = function(varName, seriesIdx) {
  return "{" + varName + (seriesIdx == null ? "" : seriesIdx) + "}";
};
function formatTpl(tpl, paramsList, encode) {
  if (!isArray(paramsList)) {
    paramsList = [paramsList];
  }
  var seriesLen = paramsList.length;
  if (!seriesLen) {
    return "";
  }
  var $vars = paramsList[0].$vars || [];
  for (var i = 0; i < $vars.length; i++) {
    var alias = TPL_VAR_ALIAS[i];
    tpl = tpl.replace(wrapVar(alias), wrapVar(alias, 0));
  }
  for (var seriesIdx = 0; seriesIdx < seriesLen; seriesIdx++) {
    for (var k = 0; k < $vars.length; k++) {
      var val = paramsList[seriesIdx][$vars[k]];
      tpl = tpl.replace(wrapVar(TPL_VAR_ALIAS[k], seriesIdx), encode ? encodeHTML(val) : val);
    }
  }
  return tpl;
}
function getTooltipMarker(inOpt, extraCssText) {
  var opt = isString(inOpt) ? {
    color: inOpt,
    extraCssText
  } : inOpt || {};
  var color2 = opt.color;
  var type = opt.type;
  extraCssText = opt.extraCssText;
  var renderMode = opt.renderMode || "html";
  if (!color2) {
    return "";
  }
  if (renderMode === "html") {
    return type === "subItem" ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:' + encodeHTML(color2) + ";" + (extraCssText || "") + '"></span>' : '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + encodeHTML(color2) + ";" + (extraCssText || "") + '"></span>';
  } else {
    var markerId = opt.markerId || "markerX";
    return {
      renderMode,
      content: "{" + markerId + "|}  ",
      style: type === "subItem" ? {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color2
      } : {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color2
      }
    };
  }
}
function convertToColorString(color2, defaultColor) {
  defaultColor = defaultColor || "transparent";
  return isString(color2) ? color2 : isObject$2(color2) ? color2.colorStops && (color2.colorStops[0] || {}).color || defaultColor : defaultColor;
}
function windowOpen(link, target) {
  if (target === "_blank" || target === "blank") {
    var blank = window.open();
    blank.opener = null;
    blank.location.href = link;
  } else {
    window.open(link, target);
  }
}
var nonSeriesBoxCoordSysCreators = {};
var normalCoordSysCreators = {};
var CoordinateSystemManager = (
  /** @class */
  function() {
    function CoordinateSystemManager2() {
      this._normalMasterList = [];
      this._nonSeriesBoxMasterList = [];
    }
    CoordinateSystemManager2.prototype.create = function(ecModel, api) {
      this._nonSeriesBoxMasterList = dealCreate(nonSeriesBoxCoordSysCreators);
      this._normalMasterList = dealCreate(normalCoordSysCreators);
      function dealCreate(creatorMap, canBeNonSeriesBox) {
        var coordinateSystems = [];
        each$4(creatorMap, function(creator, type) {
          var list = creator.create(ecModel, api);
          coordinateSystems = coordinateSystems.concat(list || []);
        });
        return coordinateSystems;
      }
    };
    CoordinateSystemManager2.prototype.update = function(ecModel, api) {
      each$4(this._normalMasterList, function(coordSys) {
        coordSys.update && coordSys.update(ecModel, api);
      });
    };
    CoordinateSystemManager2.prototype.getCoordinateSystems = function() {
      return this._normalMasterList.concat(this._nonSeriesBoxMasterList);
    };
    CoordinateSystemManager2.register = function(type, creator) {
      if (type === "matrix" || type === "calendar") {
        nonSeriesBoxCoordSysCreators[type] = creator;
        return;
      }
      normalCoordSysCreators[type] = creator;
    };
    CoordinateSystemManager2.get = function(type) {
      return normalCoordSysCreators[type] || nonSeriesBoxCoordSysCreators[type];
    };
    return CoordinateSystemManager2;
  }()
);
function canBeNonSeriesBoxCoordSys(coordSysType) {
  return !!nonSeriesBoxCoordSysCreators[coordSysType];
}
var BoxCoordinateSystemCoordFrom = {
  // By default fetch coord from `model.get('coord')`.
  coord: 1,
  // Some model/series, such as pie, is allowed to also get coord from `model.get('center')`,
  // if cannot get from `model.get('coord')`. But historically pie use `center` option, but
  // geo use `layoutCenter` option to specify layout center; they are not able to be unified.
  // Therefor it is not recommended.
  coord2: 2
};
var coordSysUseMap = createHashMap();
function getCoordForBoxCoordSys(model) {
  var coord = model.getShallow("coord", true);
  var from = BoxCoordinateSystemCoordFrom.coord;
  if (coord == null) {
    var store = coordSysUseMap.get(model.type);
    if (store && store.getCoord2) {
      from = BoxCoordinateSystemCoordFrom.coord2;
      coord = store.getCoord2(model);
    }
  }
  return {
    coord,
    from
  };
}
var CoordinateSystemUsageKind = {
  none: 0,
  dataCoordSys: 1,
  boxCoordSys: 2
};
function decideCoordSysUsageKind(model, printError) {
  var coordSysType = model.getShallow("coordinateSystem");
  var coordSysUsageOption = model.getShallow("coordinateSystemUsage", true);
  var kind = CoordinateSystemUsageKind.none;
  if (coordSysType) {
    var isSeries2 = model.mainType === "series";
    if (coordSysUsageOption == null) {
      coordSysUsageOption = isSeries2 ? "data" : "box";
    }
    if (coordSysUsageOption === "data") {
      kind = CoordinateSystemUsageKind.dataCoordSys;
      if (!isSeries2) {
        kind = CoordinateSystemUsageKind.none;
      }
    } else if (coordSysUsageOption === "box") {
      kind = CoordinateSystemUsageKind.boxCoordSys;
      if (!isSeries2 && !canBeNonSeriesBoxCoordSys(coordSysType)) {
        kind = CoordinateSystemUsageKind.none;
      }
    }
  }
  return {
    coordSysType,
    kind
  };
}
function injectCoordSysByOption(opt) {
  var targetModel = opt.targetModel, coordSysType = opt.coordSysType, coordSysProvider = opt.coordSysProvider, isDefaultDataCoordSys = opt.isDefaultDataCoordSys;
  opt.allowNotFound;
  var _a2 = decideCoordSysUsageKind(targetModel), kind = _a2.kind, declaredType = _a2.coordSysType;
  if (isDefaultDataCoordSys && kind !== CoordinateSystemUsageKind.dataCoordSys) {
    kind = CoordinateSystemUsageKind.dataCoordSys;
    declaredType = coordSysType;
  }
  if (kind === CoordinateSystemUsageKind.none || declaredType !== coordSysType) {
    return false;
  }
  var coordSys = coordSysProvider(coordSysType, targetModel);
  if (!coordSys) {
    return false;
  }
  if (kind === CoordinateSystemUsageKind.dataCoordSys) {
    targetModel.coordinateSystem = coordSys;
  } else {
    targetModel.boxCoordinateSystem = coordSys;
  }
  return true;
}
var each$3 = each$4;
var LOCATION_PARAMS = ["left", "right", "top", "bottom", "width", "height"];
var HV_NAMES = [["width", "left", "right"], ["height", "top", "bottom"]];
function boxLayout(orient, group, gap, maxWidth, maxHeight) {
  var x = 0;
  var y = 0;
  if (maxWidth == null) {
    maxWidth = Infinity;
  }
  if (maxHeight == null) {
    maxHeight = Infinity;
  }
  var currentLineMaxSize = 0;
  group.eachChild(function(child, idx) {
    var rect = child.getBoundingRect();
    var nextChild = group.childAt(idx + 1);
    var nextChildRect = nextChild && nextChild.getBoundingRect();
    var nextX;
    var nextY;
    if (orient === "horizontal") {
      var moveX = rect.width + (nextChildRect ? -nextChildRect.x + rect.x : 0);
      nextX = x + moveX;
      if (nextX > maxWidth || child.newline) {
        x = 0;
        nextX = moveX;
        y += currentLineMaxSize + gap;
        currentLineMaxSize = rect.height;
      } else {
        currentLineMaxSize = Math.max(currentLineMaxSize, rect.height);
      }
    } else {
      var moveY = rect.height + (nextChildRect ? -nextChildRect.y + rect.y : 0);
      nextY = y + moveY;
      if (nextY > maxHeight || child.newline) {
        x += currentLineMaxSize + gap;
        y = 0;
        nextY = moveY;
        currentLineMaxSize = rect.width;
      } else {
        currentLineMaxSize = Math.max(currentLineMaxSize, rect.width);
      }
    }
    if (child.newline) {
      return;
    }
    child.x = x;
    child.y = y;
    child.markRedraw();
    orient === "horizontal" ? x = nextX + gap : y = nextY + gap;
  });
}
var box = boxLayout;
curry$1(boxLayout, "vertical");
curry$1(boxLayout, "horizontal");
function getBoxLayoutParams(boxLayoutModel, ignoreParent) {
  return {
    left: boxLayoutModel.getShallow("left", ignoreParent),
    top: boxLayoutModel.getShallow("top", ignoreParent),
    right: boxLayoutModel.getShallow("right", ignoreParent),
    bottom: boxLayoutModel.getShallow("bottom", ignoreParent),
    width: boxLayoutModel.getShallow("width", ignoreParent),
    height: boxLayoutModel.getShallow("height", ignoreParent)
  };
}
function getLayoutRect(positionInfo, containerRect, margin) {
  margin = normalizeCssArray(margin || 0);
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  var left = parsePercent(positionInfo.left, containerWidth);
  var top = parsePercent(positionInfo.top, containerHeight);
  var right = parsePercent(positionInfo.right, containerWidth);
  var bottom = parsePercent(positionInfo.bottom, containerHeight);
  var width = parsePercent(positionInfo.width, containerWidth);
  var height = parsePercent(positionInfo.height, containerHeight);
  var verticalMargin = margin[2] + margin[0];
  var horizontalMargin = margin[1] + margin[3];
  var aspect = positionInfo.aspect;
  if (isNaN(width)) {
    width = containerWidth - right - horizontalMargin - left;
  }
  if (isNaN(height)) {
    height = containerHeight - bottom - verticalMargin - top;
  }
  if (aspect != null) {
    if (isNaN(width) && isNaN(height)) {
      if (aspect > containerWidth / containerHeight) {
        width = containerWidth * 0.8;
      } else {
        height = containerHeight * 0.8;
      }
    }
    if (isNaN(width)) {
      width = aspect * height;
    }
    if (isNaN(height)) {
      height = width / aspect;
    }
  }
  if (isNaN(left)) {
    left = containerWidth - right - width - horizontalMargin;
  }
  if (isNaN(top)) {
    top = containerHeight - bottom - height - verticalMargin;
  }
  switch (positionInfo.left || positionInfo.right) {
    case "center":
      left = containerWidth / 2 - width / 2 - margin[3];
      break;
    case "right":
      left = containerWidth - width - horizontalMargin;
      break;
  }
  switch (positionInfo.top || positionInfo.bottom) {
    case "middle":
    case "center":
      top = containerHeight / 2 - height / 2 - margin[0];
      break;
    case "bottom":
      top = containerHeight - height - verticalMargin;
      break;
  }
  left = left || 0;
  top = top || 0;
  if (isNaN(width)) {
    width = containerWidth - horizontalMargin - left - (right || 0);
  }
  if (isNaN(height)) {
    height = containerHeight - verticalMargin - top - (bottom || 0);
  }
  var rect = new BoundingRect((containerRect.x || 0) + left + margin[3], (containerRect.y || 0) + top + margin[0], width, height);
  rect.margin = margin;
  return rect;
}
function applyPreserveAspect(component, layoutRect, aspect) {
  var preserveAspect = component.getShallow("preserveAspect", true);
  if (!preserveAspect) {
    return layoutRect;
  }
  var actualAspect = layoutRect.width / layoutRect.height;
  if (Math.abs(Math.atan(aspect) - Math.atan(actualAspect)) < 1e-9) {
    return layoutRect;
  }
  var preserveAspectAlign = component.getShallow("preserveAspectAlign", true);
  var preserveAspectVerticalAlign = component.getShallow("preserveAspectVerticalAlign", true);
  var layoutOptInner = {
    width: layoutRect.width,
    height: layoutRect.height
  };
  var isCover = preserveAspect === "cover";
  if (actualAspect > aspect && !isCover || actualAspect < aspect && isCover) {
    layoutOptInner.width = layoutRect.height * aspect;
    preserveAspectAlign === "left" ? layoutOptInner.left = 0 : preserveAspectAlign === "right" ? layoutOptInner.right = 0 : layoutOptInner.left = "center";
  } else {
    layoutOptInner.height = layoutRect.width / aspect;
    preserveAspectVerticalAlign === "top" ? layoutOptInner.top = 0 : preserveAspectVerticalAlign === "bottom" ? layoutOptInner.bottom = 0 : layoutOptInner.top = "middle";
  }
  return getLayoutRect(layoutOptInner, layoutRect);
}
var BoxLayoutReferenceType = {
  rect: 1
};
function createBoxLayoutReference(model, api, opt) {
  var refContainer;
  var refPoint;
  var layoutRefType;
  var boxCoordSys = model.boxCoordinateSystem;
  var boxCoordFrom;
  if (boxCoordSys) {
    var _a2 = getCoordForBoxCoordSys(model), coord = _a2.coord, from = _a2.from;
    if (boxCoordSys.dataToLayout) {
      layoutRefType = BoxLayoutReferenceType.rect;
      boxCoordFrom = from;
      var result = boxCoordSys.dataToLayout(coord);
      refContainer = result.contentRect || result.rect;
    }
  }
  if (layoutRefType == null) {
    layoutRefType = BoxLayoutReferenceType.rect;
  }
  if (layoutRefType === BoxLayoutReferenceType.rect) {
    if (!refContainer) {
      refContainer = {
        x: 0,
        y: 0,
        width: api.getWidth(),
        height: api.getHeight()
      };
    }
    refPoint = [refContainer.x + refContainer.width / 2, refContainer.y + refContainer.height / 2];
  }
  return {
    type: layoutRefType,
    refContainer,
    refPoint,
    boxCoordFrom
  };
}
function fetchLayoutMode(ins) {
  var layoutMode = ins.layoutMode || ins.constructor.layoutMode;
  return isObject$2(layoutMode) ? layoutMode : layoutMode ? {
    type: layoutMode
  } : null;
}
function mergeLayoutParam(targetOption, newOption, opt) {
  var ignoreSize = opt && opt.ignoreSize;
  !isArray(ignoreSize) && (ignoreSize = [ignoreSize, ignoreSize]);
  var hResult = merge2(HV_NAMES[0], 0);
  var vResult = merge2(HV_NAMES[1], 1);
  copy2(HV_NAMES[0], targetOption, hResult);
  copy2(HV_NAMES[1], targetOption, vResult);
  function merge2(names, hvIdx) {
    var newParams = {};
    var newValueCount = 0;
    var merged = {};
    var mergedValueCount = 0;
    var enoughParamNumber = 2;
    each$3(names, function(name) {
      merged[name] = targetOption[name];
    });
    each$3(names, function(name) {
      hasOwn(newOption, name) && (newParams[name] = merged[name] = newOption[name]);
      hasValue(newParams, name) && newValueCount++;
      hasValue(merged, name) && mergedValueCount++;
    });
    if (ignoreSize[hvIdx]) {
      if (hasValue(newOption, names[1])) {
        merged[names[2]] = null;
      } else if (hasValue(newOption, names[2])) {
        merged[names[1]] = null;
      }
      return merged;
    }
    if (mergedValueCount === enoughParamNumber || !newValueCount) {
      return merged;
    } else if (newValueCount >= enoughParamNumber) {
      return newParams;
    } else {
      for (var i = 0; i < names.length; i++) {
        var name_1 = names[i];
        if (!hasOwn(newParams, name_1) && hasOwn(targetOption, name_1)) {
          newParams[name_1] = targetOption[name_1];
          break;
        }
      }
      return newParams;
    }
  }
  function hasValue(obj, name) {
    return obj[name] != null && obj[name] !== "auto";
  }
  function copy2(names, target, source) {
    each$3(names, function(name) {
      target[name] = source[name];
    });
  }
}
function getLayoutParams(source) {
  return copyLayoutParams({}, source);
}
function copyLayoutParams(target, source) {
  source && target && each$3(LOCATION_PARAMS, function(name) {
    hasOwn(source, name) && (target[name] = source[name]);
  });
  return target;
}
var inner$b = makeInner();
var ComponentModel = (
  /** @class */
  function(_super) {
    __extends(ComponentModel2, _super);
    function ComponentModel2(option, parentModel, ecModel) {
      var _this = _super.call(this, option, parentModel, ecModel) || this;
      _this.uid = getUID("ec_cpt_model");
      return _this;
    }
    ComponentModel2.prototype.init = function(option, parentModel, ecModel) {
      this.mergeDefaultAndTheme(option, ecModel);
    };
    ComponentModel2.prototype.mergeDefaultAndTheme = function(option, ecModel) {
      var layoutMode = fetchLayoutMode(this);
      var inputPositionParams = layoutMode ? getLayoutParams(option) : {};
      var themeModel = ecModel.getTheme();
      merge(option, themeModel.get(this.mainType));
      merge(option, this.getDefaultOption());
      if (layoutMode) {
        mergeLayoutParam(option, inputPositionParams, layoutMode);
      }
    };
    ComponentModel2.prototype.mergeOption = function(option, ecModel) {
      merge(this.option, option, true);
      var layoutMode = fetchLayoutMode(this);
      if (layoutMode) {
        mergeLayoutParam(this.option, option, layoutMode);
      }
    };
    ComponentModel2.prototype.optionUpdated = function(newCptOption, isInit) {
    };
    ComponentModel2.prototype.getDefaultOption = function() {
      var ctor = this.constructor;
      if (!isExtendedClass(ctor)) {
        return ctor.defaultOption;
      }
      var fields = inner$b(this);
      if (!fields.defaultOption) {
        var optList = [];
        var clz = ctor;
        while (clz) {
          var opt = clz.prototype.defaultOption;
          opt && optList.push(opt);
          clz = clz.superClass;
        }
        var defaultOption2 = {};
        for (var i = optList.length - 1; i >= 0; i--) {
          defaultOption2 = merge(defaultOption2, optList[i], true);
        }
        fields.defaultOption = defaultOption2;
      }
      return fields.defaultOption;
    };
    ComponentModel2.prototype.getReferringComponents = function(mainType, opt) {
      var indexKey = mainType + "Index";
      var idKey = mainType + "Id";
      return queryReferringComponents(this.ecModel, mainType, {
        index: this.get(indexKey, true),
        id: this.get(idKey, true)
      }, opt);
    };
    ComponentModel2.prototype.getBoxLayoutParams = function() {
      return getBoxLayoutParams(this, false);
    };
    ComponentModel2.prototype.getZLevelKey = function() {
      return "";
    };
    ComponentModel2.prototype.setZLevel = function(zlevel) {
      this.option.zlevel = zlevel;
    };
    ComponentModel2.protoInitialize = function() {
      var proto = ComponentModel2.prototype;
      proto.type = "component";
      proto.id = "";
      proto.name = "";
      proto.mainType = "";
      proto.subType = "";
      proto.componentIndex = 0;
    }();
    return ComponentModel2;
  }(Model)
);
mountExtend(ComponentModel, Model);
enableClassManagement(ComponentModel);
enableSubTypeDefaulter(ComponentModel);
enableTopologicalTravel(ComponentModel, getDependencies);
function getDependencies(componentType) {
  var deps = [];
  each$4(ComponentModel.getClassesByMainType(componentType), function(clz) {
    deps = deps.concat(clz.dependencies || clz.prototype.dependencies || []);
  });
  deps = map$1(deps, function(type) {
    return parseClassType(type).main;
  });
  if (componentType !== "dataset" && indexOf(deps, "dataset") <= 0) {
    deps.unshift("dataset");
  }
  return deps;
}
var tokens = {
  color: {},
  darkColor: {},
  size: {}
};
var color$1 = tokens.color = {
  theme: ["#5070dd", "#b6d634", "#505372", "#ff994d", "#0ca8df", "#ffd10a", "#fb628b", "#785db0", "#3fbe95"],
  neutral00: "#fff",
  neutral05: "#f4f7fd",
  neutral10: "#e8ebf0",
  neutral15: "#dbdee4",
  neutral20: "#cfd2d7",
  neutral25: "#c3c5cb",
  neutral30: "#b7b9be",
  neutral35: "#aaacb2",
  neutral40: "#9ea0a5",
  neutral45: "#929399",
  neutral50: "#86878c",
  neutral55: "#797b7f",
  neutral60: "#6d6e73",
  neutral65: "#616266",
  neutral70: "#54555a",
  neutral75: "#48494d",
  neutral80: "#3c3c41",
  neutral85: "#303034",
  neutral90: "#232328",
  neutral95: "#17171b",
  neutral99: "#000",
  accent05: "#eff1f9",
  accent10: "#e0e4f2",
  accent15: "#d0d6ec",
  accent20: "#c0c9e6",
  accent25: "#b1bbdf",
  accent30: "#a1aed9",
  accent35: "#91a0d3",
  accent40: "#8292cc",
  accent45: "#7285c6",
  accent50: "#6578ba",
  accent55: "#5c6da9",
  accent60: "#536298",
  accent65: "#4a5787",
  accent70: "#404c76",
  accent75: "#374165",
  accent80: "#2e3654",
  accent85: "#252b43",
  accent90: "#1b2032",
  accent95: "#121521",
  transparent: "rgba(0,0,0,0)",
  highlight: "rgba(255,231,130,0.8)"
};
extend(color$1, {
  primary: color$1.neutral80,
  secondary: color$1.neutral70,
  tertiary: color$1.neutral60,
  quaternary: color$1.neutral50,
  disabled: color$1.neutral20,
  border: color$1.neutral30,
  borderTint: color$1.neutral20,
  borderShade: color$1.neutral40,
  background: color$1.neutral05,
  backgroundTint: "rgba(234,237,245,0.5)",
  backgroundTransparent: "rgba(255,255,255,0)",
  backgroundShade: color$1.neutral10,
  shadow: "rgba(0,0,0,0.2)",
  shadowTint: "rgba(129,130,136,0.2)",
  axisLine: color$1.neutral70,
  axisLineTint: color$1.neutral40,
  axisTick: color$1.neutral70,
  axisTickMinor: color$1.neutral60,
  axisLabel: color$1.neutral70,
  axisSplitLine: color$1.neutral15,
  axisMinorSplitLine: color$1.neutral05
});
for (var key in color$1) {
  if (color$1.hasOwnProperty(key)) {
    var hex = color$1[key];
    if (key === "theme") {
      tokens.darkColor.theme = color$1.theme.slice();
    } else if (key === "highlight") {
      tokens.darkColor.highlight = "rgba(255,231,130,0.4)";
    } else if (key.indexOf("accent") === 0) {
      tokens.darkColor[key] = modifyHSL(hex, null, function(s) {
        return s * 0.5;
      }, function(l) {
        return Math.min(1, 1.3 - l);
      });
    } else {
      tokens.darkColor[key] = modifyHSL(hex, null, function(s) {
        return s * 0.9;
      }, function(l) {
        return 1 - Math.pow(l, 1.5);
      });
    }
  }
}
tokens.size = {
  xxs: 2,
  xs: 5,
  s: 10,
  m: 15,
  l: 20,
  xl: 30,
  xxl: 40,
  xxxl: 50
};
var platform = "";
if (typeof navigator !== "undefined") {
  platform = navigator.platform || "";
}
var decalColor = "rgba(0, 0, 0, 0.2)";
var themeColor = tokens.color.theme[0];
var lightThemeColor = modifyHSL(themeColor, null, null, 0.9);
const globalDefault = {
  darkMode: "auto",
  // backgroundColor: 'rgba(0,0,0,0)',
  colorBy: "series",
  color: tokens.color.theme,
  gradientColor: [lightThemeColor, themeColor],
  aria: {
    decal: {
      decals: [{
        color: decalColor,
        dashArrayX: [1, 0],
        dashArrayY: [2, 5],
        symbolSize: 1,
        rotation: Math.PI / 6
      }, {
        color: decalColor,
        symbol: "circle",
        dashArrayX: [[8, 8], [0, 8, 8, 0]],
        dashArrayY: [6, 0],
        symbolSize: 0.8
      }, {
        color: decalColor,
        dashArrayX: [1, 0],
        dashArrayY: [4, 3],
        rotation: -Math.PI / 4
      }, {
        color: decalColor,
        dashArrayX: [[6, 6], [0, 6, 6, 0]],
        dashArrayY: [6, 0]
      }, {
        color: decalColor,
        dashArrayX: [[1, 0], [1, 6]],
        dashArrayY: [1, 0, 6, 0],
        rotation: Math.PI / 4
      }, {
        color: decalColor,
        symbol: "triangle",
        dashArrayX: [[9, 9], [0, 9, 9, 0]],
        dashArrayY: [7, 2],
        symbolSize: 0.75
      }]
    }
  },
  // If xAxis and yAxis declared, grid is created by default.
  // grid: {},
  textStyle: {
    // color: '#000',
    // decoration: 'none',
    // PENDING
    fontFamily: platform.match(/^Win/) ? "Microsoft YaHei" : "sans-serif",
    // fontFamily: 'Arial, Verdana, sans-serif',
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  // http://blogs.adobe.com/webplatform/2014/02/24/using-blend-modes-in-html-canvas/
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  // Default is source-over
  blendMode: null,
  stateAnimation: {
    duration: 300,
    easing: "cubicOut"
  },
  animation: "auto",
  animationDuration: 1e3,
  animationDurationUpdate: 500,
  animationEasing: "cubicInOut",
  animationEasingUpdate: "cubicInOut",
  animationThreshold: 2e3,
  // Configuration for progressive/incremental rendering
  progressiveThreshold: 3e3,
  progressive: 400,
  // Threshold of if use single hover layer to optimize.
  // It is recommended that `hoverLayerThreshold` is equivalent to or less than
  // `progressiveThreshold`, otherwise hover will cause restart of progressive,
  // which is unexpected.
  // see example <echarts/test/heatmap-large.html>.
  hoverLayerThreshold: 3e3,
  // See: module:echarts/scale/Time
  useUTC: false
};
var VISUAL_DIMENSIONS = createHashMap(["tooltip", "label", "itemName", "itemId", "itemGroupId", "itemChildGroupId", "seriesName"]);
var SOURCE_FORMAT_ORIGINAL = "original";
var SOURCE_FORMAT_ARRAY_ROWS = "arrayRows";
var SOURCE_FORMAT_OBJECT_ROWS = "objectRows";
var SOURCE_FORMAT_KEYED_COLUMNS = "keyedColumns";
var SOURCE_FORMAT_TYPED_ARRAY = "typedArray";
var SOURCE_FORMAT_UNKNOWN = "unknown";
var SERIES_LAYOUT_BY_COLUMN = "column";
var SERIES_LAYOUT_BY_ROW = "row";
var BE_ORDINAL = {
  Must: 1,
  Might: 2,
  Not: 3
  // Other cases
};
var innerGlobalModel = makeInner();
function resetSourceDefaulter(ecModel) {
  innerGlobalModel(ecModel).datasetMap = createHashMap();
}
function makeSeriesEncodeForAxisCoordSys(coordDimensions, seriesModel, source) {
  var encode = {};
  var datasetModel = querySeriesUpstreamDatasetModel(seriesModel);
  if (!datasetModel || !coordDimensions) {
    return encode;
  }
  var encodeItemName = [];
  var encodeSeriesName = [];
  var ecModel = seriesModel.ecModel;
  var datasetMap = innerGlobalModel(ecModel).datasetMap;
  var key = datasetModel.uid + "_" + source.seriesLayoutBy;
  var baseCategoryDimIndex;
  var categoryWayValueDimStart;
  coordDimensions = coordDimensions.slice();
  each$4(coordDimensions, function(coordDimInfoLoose, coordDimIdx) {
    var coordDimInfo = isObject$2(coordDimInfoLoose) ? coordDimInfoLoose : coordDimensions[coordDimIdx] = {
      name: coordDimInfoLoose
    };
    if (coordDimInfo.type === "ordinal" && baseCategoryDimIndex == null) {
      baseCategoryDimIndex = coordDimIdx;
      categoryWayValueDimStart = getDataDimCountOnCoordDim(coordDimInfo);
    }
    encode[coordDimInfo.name] = [];
  });
  var datasetRecord = datasetMap.get(key) || datasetMap.set(key, {
    categoryWayDim: categoryWayValueDimStart,
    valueWayDim: 0
  });
  each$4(coordDimensions, function(coordDimInfo, coordDimIdx) {
    var coordDimName = coordDimInfo.name;
    var count = getDataDimCountOnCoordDim(coordDimInfo);
    if (baseCategoryDimIndex == null) {
      var start = datasetRecord.valueWayDim;
      pushDim(encode[coordDimName], start, count);
      pushDim(encodeSeriesName, start, count);
      datasetRecord.valueWayDim += count;
    } else if (baseCategoryDimIndex === coordDimIdx) {
      pushDim(encode[coordDimName], 0, count);
      pushDim(encodeItemName, 0, count);
    } else {
      var start = datasetRecord.categoryWayDim;
      pushDim(encode[coordDimName], start, count);
      pushDim(encodeSeriesName, start, count);
      datasetRecord.categoryWayDim += count;
    }
  });
  function pushDim(dimIdxArr, idxFrom, idxCount) {
    for (var i = 0; i < idxCount; i++) {
      dimIdxArr.push(idxFrom + i);
    }
  }
  function getDataDimCountOnCoordDim(coordDimInfo) {
    var dimsDef = coordDimInfo.dimsDef;
    return dimsDef ? dimsDef.length : 1;
  }
  encodeItemName.length && (encode.itemName = encodeItemName);
  encodeSeriesName.length && (encode.seriesName = encodeSeriesName);
  return encode;
}
function querySeriesUpstreamDatasetModel(seriesModel) {
  var thisData = seriesModel.get("data", true);
  if (!thisData) {
    return queryReferringComponents(seriesModel.ecModel, "dataset", {
      index: seriesModel.get("datasetIndex", true),
      id: seriesModel.get("datasetId", true)
    }, SINGLE_REFERRING).models[0];
  }
}
function queryDatasetUpstreamDatasetModels(datasetModel) {
  if (!datasetModel.get("transform", true) && !datasetModel.get("fromTransformResult", true)) {
    return [];
  }
  return queryReferringComponents(datasetModel.ecModel, "dataset", {
    index: datasetModel.get("fromDatasetIndex", true),
    id: datasetModel.get("fromDatasetId", true)
  }, SINGLE_REFERRING).models;
}
function guessOrdinal(source, dimIndex) {
  return doGuessOrdinal(source.data, source.sourceFormat, source.seriesLayoutBy, source.dimensionsDefine, source.startIndex, dimIndex);
}
function doGuessOrdinal(data, sourceFormat, seriesLayoutBy, dimensionsDefine, startIndex, dimIndex) {
  var result;
  var maxLoop = 5;
  if (isTypedArray(data)) {
    return BE_ORDINAL.Not;
  }
  var dimName;
  var dimType;
  if (dimensionsDefine) {
    var dimDefItem = dimensionsDefine[dimIndex];
    if (isObject$2(dimDefItem)) {
      dimName = dimDefItem.name;
      dimType = dimDefItem.type;
    } else if (isString(dimDefItem)) {
      dimName = dimDefItem;
    }
  }
  if (dimType != null) {
    return dimType === "ordinal" ? BE_ORDINAL.Must : BE_ORDINAL.Not;
  }
  if (sourceFormat === SOURCE_FORMAT_ARRAY_ROWS) {
    var dataArrayRows = data;
    if (seriesLayoutBy === SERIES_LAYOUT_BY_ROW) {
      var sample = dataArrayRows[dimIndex];
      for (var i = 0; i < (sample || []).length && i < maxLoop; i++) {
        if ((result = detectValue(sample[startIndex + i])) != null) {
          return result;
        }
      }
    } else {
      for (var i = 0; i < dataArrayRows.length && i < maxLoop; i++) {
        var row = dataArrayRows[startIndex + i];
        if (row && (result = detectValue(row[dimIndex])) != null) {
          return result;
        }
      }
    }
  } else if (sourceFormat === SOURCE_FORMAT_OBJECT_ROWS) {
    var dataObjectRows = data;
    if (!dimName) {
      return BE_ORDINAL.Not;
    }
    for (var i = 0; i < dataObjectRows.length && i < maxLoop; i++) {
      var item = dataObjectRows[i];
      if (item && (result = detectValue(item[dimName])) != null) {
        return result;
      }
    }
  } else if (sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS) {
    var dataKeyedColumns = data;
    if (!dimName) {
      return BE_ORDINAL.Not;
    }
    var sample = dataKeyedColumns[dimName];
    if (!sample || isTypedArray(sample)) {
      return BE_ORDINAL.Not;
    }
    for (var i = 0; i < sample.length && i < maxLoop; i++) {
      if ((result = detectValue(sample[i])) != null) {
        return result;
      }
    }
  } else if (sourceFormat === SOURCE_FORMAT_ORIGINAL) {
    var dataOriginal = data;
    for (var i = 0; i < dataOriginal.length && i < maxLoop; i++) {
      var item = dataOriginal[i];
      var val = getDataItemValue(item);
      if (!isArray(val)) {
        return BE_ORDINAL.Not;
      }
      if ((result = detectValue(val[dimIndex])) != null) {
        return result;
      }
    }
  }
  function detectValue(val2) {
    var beStr = isString(val2);
    if (val2 != null && Number.isFinite(Number(val2)) && val2 !== "") {
      return beStr ? BE_ORDINAL.Might : BE_ORDINAL.Not;
    } else if (beStr && val2 !== "-") {
      return BE_ORDINAL.Must;
    }
  }
  return BE_ORDINAL.Not;
}
var internalOptionCreatorMap = createHashMap();
function concatInternalOptions(ecModel, mainType, newCmptOptionList) {
  var internalOptionCreator = internalOptionCreatorMap.get(mainType);
  if (!internalOptionCreator) {
    return newCmptOptionList;
  }
  var internalOptions = internalOptionCreator(ecModel);
  if (!internalOptions) {
    return newCmptOptionList;
  }
  return newCmptOptionList.concat(internalOptions);
}
var innerColor = makeInner();
makeInner();
var PaletteMixin = (
  /** @class */
  function() {
    function PaletteMixin2() {
    }
    PaletteMixin2.prototype.getColorFromPalette = function(name, scope, requestNum) {
      var defaultPalette = normalizeToArray(this.get("color", true));
      var layeredPalette = this.get("colorLayer", true);
      return getFromPalette(this, innerColor, defaultPalette, layeredPalette, name, scope, requestNum);
    };
    PaletteMixin2.prototype.clearColorPalette = function() {
      clearPalette(this, innerColor);
    };
    return PaletteMixin2;
  }()
);
function getNearestPalette(palettes, requestColorNum) {
  var paletteNum = palettes.length;
  for (var i = 0; i < paletteNum; i++) {
    if (palettes[i].length > requestColorNum) {
      return palettes[i];
    }
  }
  return palettes[paletteNum - 1];
}
function getFromPalette(that, inner2, defaultPalette, layeredPalette, name, scope, requestNum) {
  scope = scope || that;
  var scopeFields = inner2(scope);
  var paletteIdx = scopeFields.paletteIdx || 0;
  var paletteNameMap = scopeFields.paletteNameMap = scopeFields.paletteNameMap || {};
  if (paletteNameMap.hasOwnProperty(name)) {
    return paletteNameMap[name];
  }
  var palette = requestNum == null || !layeredPalette ? defaultPalette : getNearestPalette(layeredPalette, requestNum);
  palette = palette || defaultPalette;
  if (!palette || !palette.length) {
    return;
  }
  var pickedPaletteItem = palette[paletteIdx];
  if (name) {
    paletteNameMap[name] = pickedPaletteItem;
  }
  scopeFields.paletteIdx = (paletteIdx + 1) % palette.length;
  return pickedPaletteItem;
}
function clearPalette(that, inner2) {
  inner2(that).paletteIdx = 0;
  inner2(that).paletteNameMap = {};
}
var reCreateSeriesIndices;
var assertSeriesInitialized;
var initBase;
var OPTION_INNER_KEY = "\0_ec_inner";
var OPTION_INNER_VALUE = 1;
var GlobalModel = (
  /** @class */
  function(_super) {
    __extends(GlobalModel2, _super);
    function GlobalModel2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalModel2.prototype.init = function(option, parentModel, ecModel, theme2, locale, optionManager) {
      theme2 = theme2 || {};
      this.option = null;
      this._theme = new Model(theme2);
      this._locale = new Model(locale);
      this._optionManager = optionManager;
    };
    GlobalModel2.prototype.setOption = function(option, opts, optionPreprocessorFuncs2) {
      var innerOpt = normalizeSetOptionInput(opts);
      this._optionManager.setOption(option, optionPreprocessorFuncs2, innerOpt);
      this._resetOption(null, innerOpt);
    };
    GlobalModel2.prototype.resetOption = function(type, opt) {
      return this._resetOption(type, normalizeSetOptionInput(opt));
    };
    GlobalModel2.prototype._resetOption = function(type, opt) {
      var optionChanged = false;
      var optionManager = this._optionManager;
      if (!type || type === "recreate") {
        var baseOption = optionManager.mountOption(type === "recreate");
        if (!this.option || type === "recreate") {
          initBase(this, baseOption);
        } else {
          this.restoreData();
          this._mergeOption(baseOption, opt);
        }
        optionChanged = true;
      }
      if (type === "timeline" || type === "media") {
        this.restoreData();
      }
      if (!type || type === "recreate" || type === "timeline") {
        var timelineOption = optionManager.getTimelineOption(this);
        if (timelineOption) {
          optionChanged = true;
          this._mergeOption(timelineOption, opt);
        }
      }
      if (!type || type === "recreate" || type === "media") {
        var mediaOptions = optionManager.getMediaOption(this);
        if (mediaOptions.length) {
          each$4(mediaOptions, function(mediaOption) {
            optionChanged = true;
            this._mergeOption(mediaOption, opt);
          }, this);
        }
      }
      return optionChanged;
    };
    GlobalModel2.prototype.mergeOption = function(option) {
      this._mergeOption(option, null);
    };
    GlobalModel2.prototype._mergeOption = function(newOption, opt) {
      var option = this.option;
      var componentsMap = this._componentsMap;
      var componentsCount = this._componentsCount;
      var newCmptTypes = [];
      var newCmptTypeMap = createHashMap();
      var replaceMergeMainTypeMap = opt && opt.replaceMergeMainTypeMap;
      resetSourceDefaulter(this);
      each$4(newOption, function(componentOption, mainType) {
        if (componentOption == null) {
          return;
        }
        if (!ComponentModel.hasClass(mainType)) {
          option[mainType] = option[mainType] == null ? clone$1(componentOption) : merge(option[mainType], componentOption, true);
        } else if (mainType) {
          newCmptTypes.push(mainType);
          newCmptTypeMap.set(mainType, true);
        }
      });
      if (replaceMergeMainTypeMap) {
        replaceMergeMainTypeMap.each(function(val, mainTypeInReplaceMerge) {
          if (ComponentModel.hasClass(mainTypeInReplaceMerge) && !newCmptTypeMap.get(mainTypeInReplaceMerge)) {
            newCmptTypes.push(mainTypeInReplaceMerge);
            newCmptTypeMap.set(mainTypeInReplaceMerge, true);
          }
        });
      }
      ComponentModel.topologicalTravel(newCmptTypes, ComponentModel.getAllClassMainTypes(), visitComponent, this);
      function visitComponent(mainType) {
        var newCmptOptionList = concatInternalOptions(this, mainType, normalizeToArray(newOption[mainType]));
        var oldCmptList = componentsMap.get(mainType);
        var mergeMode = (
          // `!oldCmptList` means init. See the comment in `mappingToExists`
          !oldCmptList ? "replaceAll" : replaceMergeMainTypeMap && replaceMergeMainTypeMap.get(mainType) ? "replaceMerge" : "normalMerge"
        );
        var mappingResult = mappingToExists(oldCmptList, newCmptOptionList, mergeMode);
        setComponentTypeToKeyInfo(mappingResult, mainType, ComponentModel);
        option[mainType] = null;
        componentsMap.set(mainType, null);
        componentsCount.set(mainType, 0);
        var optionsByMainType = [];
        var cmptsByMainType = [];
        var cmptsCountByMainType = 0;
        var tooltipExists;
        each$4(mappingResult, function(resultItem, index) {
          var componentModel = resultItem.existing;
          var newCmptOption = resultItem.newOption;
          if (!newCmptOption) {
            if (componentModel) {
              componentModel.mergeOption({}, this);
              componentModel.optionUpdated({}, false);
            }
          } else {
            var isSeriesType = mainType === "series";
            var ComponentModelClass = ComponentModel.getClass(
              mainType,
              resultItem.keyInfo.subType,
              !isSeriesType
              // Give a more detailed warn later if series don't exists
            );
            if (!ComponentModelClass) {
              return;
            }
            if (mainType === "tooltip") {
              if (tooltipExists) {
                return;
              }
              tooltipExists = true;
            }
            if (componentModel && componentModel.constructor === ComponentModelClass) {
              componentModel.name = resultItem.keyInfo.name;
              componentModel.mergeOption(newCmptOption, this);
              componentModel.optionUpdated(newCmptOption, false);
            } else {
              var extraOpt = extend({
                componentIndex: index
              }, resultItem.keyInfo);
              componentModel = new ComponentModelClass(newCmptOption, this, this, extraOpt);
              extend(componentModel, extraOpt);
              if (resultItem.brandNew) {
                componentModel.__requireNewView = true;
              }
              componentModel.init(newCmptOption, this, this);
              componentModel.optionUpdated(null, true);
            }
          }
          if (componentModel) {
            optionsByMainType.push(componentModel.option);
            cmptsByMainType.push(componentModel);
            cmptsCountByMainType++;
          } else {
            optionsByMainType.push(void 0);
            cmptsByMainType.push(void 0);
          }
        }, this);
        option[mainType] = optionsByMainType;
        componentsMap.set(mainType, cmptsByMainType);
        componentsCount.set(mainType, cmptsCountByMainType);
        if (mainType === "series") {
          reCreateSeriesIndices(this);
        }
      }
      if (!this._seriesIndices) {
        reCreateSeriesIndices(this);
      }
    };
    GlobalModel2.prototype.getOption = function() {
      var option = clone$1(this.option);
      each$4(option, function(optInMainType, mainType) {
        if (ComponentModel.hasClass(mainType)) {
          var opts = normalizeToArray(optInMainType);
          var realLen = opts.length;
          var metNonInner = false;
          for (var i = realLen - 1; i >= 0; i--) {
            if (opts[i] && !isComponentIdInternal(opts[i])) {
              metNonInner = true;
            } else {
              opts[i] = null;
              !metNonInner && realLen--;
            }
          }
          opts.length = realLen;
          option[mainType] = opts;
        }
      });
      delete option[OPTION_INNER_KEY];
      return option;
    };
    GlobalModel2.prototype.setTheme = function(theme2) {
      this._theme = new Model(theme2);
      this._resetOption("recreate", null);
    };
    GlobalModel2.prototype.getTheme = function() {
      return this._theme;
    };
    GlobalModel2.prototype.getLocaleModel = function() {
      return this._locale;
    };
    GlobalModel2.prototype.setUpdatePayload = function(payload) {
      this._payload = payload;
    };
    GlobalModel2.prototype.getUpdatePayload = function() {
      return this._payload;
    };
    GlobalModel2.prototype.getComponent = function(mainType, idx) {
      var list = this._componentsMap.get(mainType);
      if (list) {
        var cmpt = list[idx || 0];
        if (cmpt) {
          return cmpt;
        } else if (idx == null) {
          for (var i = 0; i < list.length; i++) {
            if (list[i]) {
              return list[i];
            }
          }
        }
      }
    };
    GlobalModel2.prototype.queryComponents = function(condition) {
      var mainType = condition.mainType;
      if (!mainType) {
        return [];
      }
      var index = condition.index;
      var id = condition.id;
      var name = condition.name;
      var cmpts = this._componentsMap.get(mainType);
      if (!cmpts || !cmpts.length) {
        return [];
      }
      var result;
      if (index != null) {
        result = [];
        each$4(normalizeToArray(index), function(idx) {
          cmpts[idx] && result.push(cmpts[idx]);
        });
      } else if (id != null) {
        result = queryByIdOrName("id", id, cmpts);
      } else if (name != null) {
        result = queryByIdOrName("name", name, cmpts);
      } else {
        result = filter(cmpts, function(cmpt) {
          return !!cmpt;
        });
      }
      return filterBySubType(result, condition);
    };
    GlobalModel2.prototype.findComponents = function(condition) {
      var query = condition.query;
      var mainType = condition.mainType;
      var queryCond = getQueryCond(query);
      var result = queryCond ? this.queryComponents(queryCond) : filter(this._componentsMap.get(mainType), function(cmpt) {
        return !!cmpt;
      });
      return doFilter(filterBySubType(result, condition));
      function getQueryCond(q) {
        var indexAttr = mainType + "Index";
        var idAttr = mainType + "Id";
        var nameAttr = mainType + "Name";
        return q && (q[indexAttr] != null || q[idAttr] != null || q[nameAttr] != null) ? {
          mainType,
          // subType will be filtered finally.
          index: q[indexAttr],
          id: q[idAttr],
          name: q[nameAttr]
        } : null;
      }
      function doFilter(res) {
        return condition.filter ? filter(res, condition.filter) : res;
      }
    };
    GlobalModel2.prototype.eachComponent = function(mainType, cb, context) {
      var componentsMap = this._componentsMap;
      if (isFunction(mainType)) {
        var ctxForAll_1 = cb;
        var cbForAll_1 = mainType;
        componentsMap.each(function(cmpts2, componentType) {
          for (var i2 = 0; cmpts2 && i2 < cmpts2.length; i2++) {
            var cmpt2 = cmpts2[i2];
            cmpt2 && cbForAll_1.call(ctxForAll_1, componentType, cmpt2, cmpt2.componentIndex);
          }
        });
      } else {
        var cmpts = isString(mainType) ? componentsMap.get(mainType) : isObject$2(mainType) ? this.findComponents(mainType) : null;
        for (var i = 0; cmpts && i < cmpts.length; i++) {
          var cmpt = cmpts[i];
          cmpt && cb.call(context, cmpt, cmpt.componentIndex);
        }
      }
    };
    GlobalModel2.prototype.getSeriesByName = function(name) {
      var nameStr = convertOptionIdName(name, null);
      return filter(this._componentsMap.get("series"), function(oneSeries) {
        return !!oneSeries && nameStr != null && oneSeries.name === nameStr;
      });
    };
    GlobalModel2.prototype.getSeriesByIndex = function(seriesIndex) {
      return this._componentsMap.get("series")[seriesIndex];
    };
    GlobalModel2.prototype.getSeriesByType = function(subType) {
      return filter(this._componentsMap.get("series"), function(oneSeries) {
        return !!oneSeries && oneSeries.subType === subType;
      });
    };
    GlobalModel2.prototype.getSeries = function() {
      return filter(this._componentsMap.get("series"), function(oneSeries) {
        return !!oneSeries;
      });
    };
    GlobalModel2.prototype.getSeriesCount = function() {
      return this._componentsCount.get("series");
    };
    GlobalModel2.prototype.eachSeries = function(cb, context) {
      assertSeriesInitialized(this);
      each$4(this._seriesIndices, function(rawSeriesIndex) {
        var series = this._componentsMap.get("series")[rawSeriesIndex];
        cb.call(context, series, rawSeriesIndex);
      }, this);
    };
    GlobalModel2.prototype.eachRawSeries = function(cb, context) {
      each$4(this._componentsMap.get("series"), function(series) {
        series && cb.call(context, series, series.componentIndex);
      });
    };
    GlobalModel2.prototype.eachSeriesByType = function(subType, cb, context) {
      assertSeriesInitialized(this);
      each$4(this._seriesIndices, function(rawSeriesIndex) {
        var series = this._componentsMap.get("series")[rawSeriesIndex];
        if (series.subType === subType) {
          cb.call(context, series, rawSeriesIndex);
        }
      }, this);
    };
    GlobalModel2.prototype.eachRawSeriesByType = function(subType, cb, context) {
      return each$4(this.getSeriesByType(subType), cb, context);
    };
    GlobalModel2.prototype.isSeriesFiltered = function(seriesModel) {
      assertSeriesInitialized(this);
      return this._seriesIndicesMap.get(seriesModel.componentIndex) == null;
    };
    GlobalModel2.prototype.getCurrentSeriesIndices = function() {
      return (this._seriesIndices || []).slice();
    };
    GlobalModel2.prototype.filterSeries = function(cb, context) {
      assertSeriesInitialized(this);
      var newSeriesIndices = [];
      each$4(this._seriesIndices, function(seriesRawIdx) {
        var series = this._componentsMap.get("series")[seriesRawIdx];
        cb.call(context, series, seriesRawIdx) && newSeriesIndices.push(seriesRawIdx);
      }, this);
      this._seriesIndices = newSeriesIndices;
      this._seriesIndicesMap = createHashMap(newSeriesIndices);
    };
    GlobalModel2.prototype.restoreData = function(payload) {
      reCreateSeriesIndices(this);
      var componentsMap = this._componentsMap;
      var componentTypes = [];
      componentsMap.each(function(components, componentType) {
        if (ComponentModel.hasClass(componentType)) {
          componentTypes.push(componentType);
        }
      });
      ComponentModel.topologicalTravel(componentTypes, ComponentModel.getAllClassMainTypes(), function(componentType) {
        each$4(componentsMap.get(componentType), function(component) {
          if (component && (componentType !== "series" || !isNotTargetSeries(component, payload))) {
            component.restoreData();
          }
        });
      });
    };
    GlobalModel2.internalField = function() {
      reCreateSeriesIndices = function(ecModel) {
        var seriesIndices = ecModel._seriesIndices = [];
        each$4(ecModel._componentsMap.get("series"), function(series) {
          series && seriesIndices.push(series.componentIndex);
        });
        ecModel._seriesIndicesMap = createHashMap(seriesIndices);
      };
      assertSeriesInitialized = function(ecModel) {
      };
      initBase = function(ecModel, baseOption) {
        ecModel.option = {};
        ecModel.option[OPTION_INNER_KEY] = OPTION_INNER_VALUE;
        ecModel._componentsMap = createHashMap({
          series: []
        });
        ecModel._componentsCount = createHashMap();
        var airaOption = baseOption.aria;
        if (isObject$2(airaOption) && airaOption.enabled == null) {
          airaOption.enabled = true;
        }
        mergeTheme(baseOption, ecModel._theme.option);
        merge(baseOption, globalDefault, false);
        ecModel._mergeOption(baseOption, null);
      };
    }();
    return GlobalModel2;
  }(Model)
);
function isNotTargetSeries(seriesModel, payload) {
  if (payload) {
    var index = payload.seriesIndex;
    var id = payload.seriesId;
    var name_1 = payload.seriesName;
    return index != null && seriesModel.componentIndex !== index || id != null && seriesModel.id !== id || name_1 != null && seriesModel.name !== name_1;
  }
}
function mergeTheme(option, theme2) {
  var notMergeColorLayer = option.color && !option.colorLayer;
  each$4(theme2, function(themeItem, name) {
    if (name === "colorLayer" && notMergeColorLayer || name === "color" && option.color) {
      return;
    }
    if (!ComponentModel.hasClass(name)) {
      if (typeof themeItem === "object") {
        option[name] = !option[name] ? clone$1(themeItem) : merge(option[name], themeItem, false);
      } else {
        if (option[name] == null) {
          option[name] = themeItem;
        }
      }
    }
  });
}
function queryByIdOrName(attr, idOrName, cmpts) {
  if (isArray(idOrName)) {
    var keyMap_1 = createHashMap();
    each$4(idOrName, function(idOrNameItem) {
      if (idOrNameItem != null) {
        var idName = convertOptionIdName(idOrNameItem, null);
        idName != null && keyMap_1.set(idOrNameItem, true);
      }
    });
    return filter(cmpts, function(cmpt) {
      return cmpt && keyMap_1.get(cmpt[attr]);
    });
  } else {
    var idName_1 = convertOptionIdName(idOrName, null);
    return filter(cmpts, function(cmpt) {
      return cmpt && idName_1 != null && cmpt[attr] === idName_1;
    });
  }
}
function filterBySubType(components, condition) {
  return condition.hasOwnProperty("subType") ? filter(components, function(cmpt) {
    return cmpt && cmpt.subType === condition.subType;
  }) : components;
}
function normalizeSetOptionInput(opts) {
  var replaceMergeMainTypeMap = createHashMap();
  opts && each$4(normalizeToArray(opts.replaceMerge), function(mainType) {
    replaceMergeMainTypeMap.set(mainType, true);
  });
  return {
    replaceMergeMainTypeMap
  };
}
mixin(GlobalModel, PaletteMixin);
var availableMethods = [
  "getDom",
  "getZr",
  "getWidth",
  "getHeight",
  "getDevicePixelRatio",
  "dispatchAction",
  "isSSR",
  "isDisposed",
  "on",
  "off",
  "getDataURL",
  "getConnectedDataURL",
  // 'getModel',
  "getOption",
  // 'getViewOfComponentModel',
  // 'getViewOfSeriesModel',
  "getId",
  "updateLabelLayout"
];
var ExtensionAPI = (
  /** @class */
  /* @__PURE__ */ function() {
    function ExtensionAPI2(ecInstance) {
      each$4(availableMethods, function(methodName) {
        this[methodName] = bind$1(ecInstance[methodName], ecInstance);
      }, this);
    }
    return ExtensionAPI2;
  }()
);
var QUERY_REG = /^(min|max)?(.+)$/;
var OptionManager = (
  /** @class */
  function() {
    function OptionManager2(api) {
      this._timelineOptions = [];
      this._mediaList = [];
      this._currentMediaIndices = [];
      this._api = api;
    }
    OptionManager2.prototype.setOption = function(rawOption, optionPreprocessorFuncs2, opt) {
      if (rawOption) {
        each$4(normalizeToArray(rawOption.series), function(series) {
          series && series.data && isTypedArray(series.data) && setAsPrimitive(series.data);
        });
        each$4(normalizeToArray(rawOption.dataset), function(dataset) {
          dataset && dataset.source && isTypedArray(dataset.source) && setAsPrimitive(dataset.source);
        });
      }
      rawOption = clone$1(rawOption);
      var optionBackup = this._optionBackup;
      var newParsedOption = parseRawOption(rawOption, optionPreprocessorFuncs2, !optionBackup);
      this._newBaseOption = newParsedOption.baseOption;
      if (optionBackup) {
        if (newParsedOption.timelineOptions.length) {
          optionBackup.timelineOptions = newParsedOption.timelineOptions;
        }
        if (newParsedOption.mediaList.length) {
          optionBackup.mediaList = newParsedOption.mediaList;
        }
        if (newParsedOption.mediaDefault) {
          optionBackup.mediaDefault = newParsedOption.mediaDefault;
        }
      } else {
        this._optionBackup = newParsedOption;
      }
    };
    OptionManager2.prototype.mountOption = function(isRecreate) {
      var optionBackup = this._optionBackup;
      this._timelineOptions = optionBackup.timelineOptions;
      this._mediaList = optionBackup.mediaList;
      this._mediaDefault = optionBackup.mediaDefault;
      this._currentMediaIndices = [];
      return clone$1(isRecreate ? optionBackup.baseOption : this._newBaseOption);
    };
    OptionManager2.prototype.getTimelineOption = function(ecModel) {
      var option;
      var timelineOptions = this._timelineOptions;
      if (timelineOptions.length) {
        var timelineModel = ecModel.getComponent("timeline");
        if (timelineModel) {
          option = clone$1(
            // FIXME:TS as TimelineModel or quivlant interface
            timelineOptions[timelineModel.getCurrentIndex()]
          );
        }
      }
      return option;
    };
    OptionManager2.prototype.getMediaOption = function(ecModel) {
      var ecWidth = this._api.getWidth();
      var ecHeight = this._api.getHeight();
      var mediaList = this._mediaList;
      var mediaDefault = this._mediaDefault;
      var indices = [];
      var result = [];
      if (!mediaList.length && !mediaDefault) {
        return result;
      }
      for (var i = 0, len2 = mediaList.length; i < len2; i++) {
        if (applyMediaQuery(mediaList[i].query, ecWidth, ecHeight)) {
          indices.push(i);
        }
      }
      if (!indices.length && mediaDefault) {
        indices = [-1];
      }
      if (indices.length && !indicesEquals(indices, this._currentMediaIndices)) {
        result = map$1(indices, function(index) {
          return clone$1(index === -1 ? mediaDefault.option : mediaList[index].option);
        });
      }
      this._currentMediaIndices = indices;
      return result;
    };
    return OptionManager2;
  }()
);
function parseRawOption(rawOption, optionPreprocessorFuncs2, isNew) {
  var mediaList = [];
  var mediaDefault;
  var baseOption;
  var declaredBaseOption = rawOption.baseOption;
  var timelineOnRoot = rawOption.timeline;
  var timelineOptionsOnRoot = rawOption.options;
  var mediaOnRoot = rawOption.media;
  var hasMedia = !!rawOption.media;
  var hasTimeline = !!(timelineOptionsOnRoot || timelineOnRoot || declaredBaseOption && declaredBaseOption.timeline);
  if (declaredBaseOption) {
    baseOption = declaredBaseOption;
    if (!baseOption.timeline) {
      baseOption.timeline = timelineOnRoot;
    }
  } else {
    if (hasTimeline || hasMedia) {
      rawOption.options = rawOption.media = null;
    }
    baseOption = rawOption;
  }
  if (hasMedia) {
    if (isArray(mediaOnRoot)) {
      each$4(mediaOnRoot, function(singleMedia) {
        if (singleMedia && singleMedia.option) {
          if (singleMedia.query) {
            mediaList.push(singleMedia);
          } else if (!mediaDefault) {
            mediaDefault = singleMedia;
          }
        }
      });
    }
  }
  doPreprocess(baseOption);
  each$4(timelineOptionsOnRoot, function(option) {
    return doPreprocess(option);
  });
  each$4(mediaList, function(media) {
    return doPreprocess(media.option);
  });
  function doPreprocess(option) {
    each$4(optionPreprocessorFuncs2, function(preProcess) {
      preProcess(option, isNew);
    });
  }
  return {
    baseOption,
    timelineOptions: timelineOptionsOnRoot || [],
    mediaDefault,
    mediaList
  };
}
function applyMediaQuery(query, ecWidth, ecHeight) {
  var realMap = {
    width: ecWidth,
    height: ecHeight,
    aspectratio: ecWidth / ecHeight
    // lower case for convenience.
  };
  var applicable = true;
  each$4(query, function(value, attr) {
    var matched = attr.match(QUERY_REG);
    if (!matched || !matched[1] || !matched[2]) {
      return;
    }
    var operator = matched[1];
    var realAttr = matched[2].toLowerCase();
    if (!compare(realMap[realAttr], value, operator)) {
      applicable = false;
    }
  });
  return applicable;
}
function compare(real, expect, operator) {
  if (operator === "min") {
    return real >= expect;
  } else if (operator === "max") {
    return real <= expect;
  } else {
    return real === expect;
  }
}
function indicesEquals(indices1, indices2) {
  return indices1.join(",") === indices2.join(",");
}
var each$2 = each$4;
var isObject$1 = isObject$2;
var POSSIBLE_STYLES = ["areaStyle", "lineStyle", "nodeStyle", "linkStyle", "chordStyle", "label", "labelLine"];
function compatEC2ItemStyle(opt) {
  var itemStyleOpt = opt && opt.itemStyle;
  if (!itemStyleOpt) {
    return;
  }
  for (var i = 0, len2 = POSSIBLE_STYLES.length; i < len2; i++) {
    var styleName = POSSIBLE_STYLES[i];
    var normalItemStyleOpt = itemStyleOpt.normal;
    var emphasisItemStyleOpt = itemStyleOpt.emphasis;
    if (normalItemStyleOpt && normalItemStyleOpt[styleName]) {
      opt[styleName] = opt[styleName] || {};
      if (!opt[styleName].normal) {
        opt[styleName].normal = normalItemStyleOpt[styleName];
      } else {
        merge(opt[styleName].normal, normalItemStyleOpt[styleName]);
      }
      normalItemStyleOpt[styleName] = null;
    }
    if (emphasisItemStyleOpt && emphasisItemStyleOpt[styleName]) {
      opt[styleName] = opt[styleName] || {};
      if (!opt[styleName].emphasis) {
        opt[styleName].emphasis = emphasisItemStyleOpt[styleName];
      } else {
        merge(opt[styleName].emphasis, emphasisItemStyleOpt[styleName]);
      }
      emphasisItemStyleOpt[styleName] = null;
    }
  }
}
function convertNormalEmphasis(opt, optType, useExtend) {
  if (opt && opt[optType] && (opt[optType].normal || opt[optType].emphasis)) {
    var normalOpt = opt[optType].normal;
    var emphasisOpt = opt[optType].emphasis;
    if (normalOpt) {
      if (useExtend) {
        opt[optType].normal = opt[optType].emphasis = null;
        defaults(opt[optType], normalOpt);
      } else {
        opt[optType] = normalOpt;
      }
    }
    if (emphasisOpt) {
      opt.emphasis = opt.emphasis || {};
      opt.emphasis[optType] = emphasisOpt;
      if (emphasisOpt.focus) {
        opt.emphasis.focus = emphasisOpt.focus;
      }
      if (emphasisOpt.blurScope) {
        opt.emphasis.blurScope = emphasisOpt.blurScope;
      }
    }
  }
}
function removeEC3NormalStatus(opt) {
  convertNormalEmphasis(opt, "itemStyle");
  convertNormalEmphasis(opt, "lineStyle");
  convertNormalEmphasis(opt, "areaStyle");
  convertNormalEmphasis(opt, "label");
  convertNormalEmphasis(opt, "labelLine");
  convertNormalEmphasis(opt, "upperLabel");
  convertNormalEmphasis(opt, "edgeLabel");
}
function compatTextStyle(opt, propName) {
  var labelOptSingle = isObject$1(opt) && opt[propName];
  var textStyle = isObject$1(labelOptSingle) && labelOptSingle.textStyle;
  if (textStyle) {
    for (var i = 0, len2 = TEXT_STYLE_OPTIONS.length; i < len2; i++) {
      var textPropName = TEXT_STYLE_OPTIONS[i];
      if (textStyle.hasOwnProperty(textPropName)) {
        labelOptSingle[textPropName] = textStyle[textPropName];
      }
    }
  }
}
function compatEC3CommonStyles(opt) {
  if (opt) {
    removeEC3NormalStatus(opt);
    compatTextStyle(opt, "label");
    opt.emphasis && compatTextStyle(opt.emphasis, "label");
  }
}
function processSeries(seriesOpt) {
  if (!isObject$1(seriesOpt)) {
    return;
  }
  compatEC2ItemStyle(seriesOpt);
  removeEC3NormalStatus(seriesOpt);
  compatTextStyle(seriesOpt, "label");
  compatTextStyle(seriesOpt, "upperLabel");
  compatTextStyle(seriesOpt, "edgeLabel");
  if (seriesOpt.emphasis) {
    compatTextStyle(seriesOpt.emphasis, "label");
    compatTextStyle(seriesOpt.emphasis, "upperLabel");
    compatTextStyle(seriesOpt.emphasis, "edgeLabel");
  }
  var markPoint = seriesOpt.markPoint;
  if (markPoint) {
    compatEC2ItemStyle(markPoint);
    compatEC3CommonStyles(markPoint);
  }
  var markLine = seriesOpt.markLine;
  if (markLine) {
    compatEC2ItemStyle(markLine);
    compatEC3CommonStyles(markLine);
  }
  var markArea = seriesOpt.markArea;
  if (markArea) {
    compatEC3CommonStyles(markArea);
  }
  var data = seriesOpt.data;
  if (seriesOpt.type === "graph") {
    data = data || seriesOpt.nodes;
    var edgeData = seriesOpt.links || seriesOpt.edges;
    if (edgeData && !isTypedArray(edgeData)) {
      for (var i = 0; i < edgeData.length; i++) {
        compatEC3CommonStyles(edgeData[i]);
      }
    }
    each$4(seriesOpt.categories, function(opt) {
      removeEC3NormalStatus(opt);
    });
  }
  if (data && !isTypedArray(data)) {
    for (var i = 0; i < data.length; i++) {
      compatEC3CommonStyles(data[i]);
    }
  }
  markPoint = seriesOpt.markPoint;
  if (markPoint && markPoint.data) {
    var mpData = markPoint.data;
    for (var i = 0; i < mpData.length; i++) {
      compatEC3CommonStyles(mpData[i]);
    }
  }
  markLine = seriesOpt.markLine;
  if (markLine && markLine.data) {
    var mlData = markLine.data;
    for (var i = 0; i < mlData.length; i++) {
      if (isArray(mlData[i])) {
        compatEC3CommonStyles(mlData[i][0]);
        compatEC3CommonStyles(mlData[i][1]);
      } else {
        compatEC3CommonStyles(mlData[i]);
      }
    }
  }
  if (seriesOpt.type === "gauge") {
    compatTextStyle(seriesOpt, "axisLabel");
    compatTextStyle(seriesOpt, "title");
    compatTextStyle(seriesOpt, "detail");
  } else if (seriesOpt.type === "treemap") {
    convertNormalEmphasis(seriesOpt.breadcrumb, "itemStyle");
    each$4(seriesOpt.levels, function(opt) {
      removeEC3NormalStatus(opt);
    });
  } else if (seriesOpt.type === "tree") {
    removeEC3NormalStatus(seriesOpt.leaves);
  }
}
function toArr(o) {
  return isArray(o) ? o : o ? [o] : [];
}
function toObj(o) {
  return (isArray(o) ? o[0] : o) || {};
}
function globalCompatStyle(option, isTheme) {
  each$2(toArr(option.series), function(seriesOpt) {
    isObject$1(seriesOpt) && processSeries(seriesOpt);
  });
  var axes = ["xAxis", "yAxis", "radiusAxis", "angleAxis", "singleAxis", "parallelAxis", "radar"];
  isTheme && axes.push("valueAxis", "categoryAxis", "logAxis", "timeAxis");
  each$2(axes, function(axisName) {
    each$2(toArr(option[axisName]), function(axisOpt) {
      if (axisOpt) {
        compatTextStyle(axisOpt, "axisLabel");
        compatTextStyle(axisOpt.axisPointer, "label");
      }
    });
  });
  each$2(toArr(option.parallel), function(parallelOpt) {
    var parallelAxisDefault = parallelOpt && parallelOpt.parallelAxisDefault;
    compatTextStyle(parallelAxisDefault, "axisLabel");
    compatTextStyle(parallelAxisDefault && parallelAxisDefault.axisPointer, "label");
  });
  each$2(toArr(option.calendar), function(calendarOpt) {
    convertNormalEmphasis(calendarOpt, "itemStyle");
    compatTextStyle(calendarOpt, "dayLabel");
    compatTextStyle(calendarOpt, "monthLabel");
    compatTextStyle(calendarOpt, "yearLabel");
  });
  each$2(toArr(option.radar), function(radarOpt) {
    compatTextStyle(radarOpt, "name");
    if (radarOpt.name && radarOpt.axisName == null) {
      radarOpt.axisName = radarOpt.name;
      delete radarOpt.name;
    }
    if (radarOpt.nameGap != null && radarOpt.axisNameGap == null) {
      radarOpt.axisNameGap = radarOpt.nameGap;
      delete radarOpt.nameGap;
    }
  });
  each$2(toArr(option.geo), function(geoOpt) {
    if (isObject$1(geoOpt)) {
      compatEC3CommonStyles(geoOpt);
      each$2(toArr(geoOpt.regions), function(regionObj) {
        compatEC3CommonStyles(regionObj);
      });
    }
  });
  each$2(toArr(option.timeline), function(timelineOpt) {
    compatEC3CommonStyles(timelineOpt);
    convertNormalEmphasis(timelineOpt, "label");
    convertNormalEmphasis(timelineOpt, "itemStyle");
    convertNormalEmphasis(timelineOpt, "controlStyle", true);
    var data = timelineOpt.data;
    isArray(data) && each$4(data, function(item) {
      if (isObject$2(item)) {
        convertNormalEmphasis(item, "label");
        convertNormalEmphasis(item, "itemStyle");
      }
    });
  });
  each$2(toArr(option.toolbox), function(toolboxOpt) {
    convertNormalEmphasis(toolboxOpt, "iconStyle");
    each$2(toolboxOpt.feature, function(featureOpt) {
      convertNormalEmphasis(featureOpt, "iconStyle");
    });
  });
  compatTextStyle(toObj(option.axisPointer), "label");
  compatTextStyle(toObj(option.tooltip).axisPointer, "label");
}
function get(opt, path) {
  var pathArr = path.split(",");
  var obj = opt;
  for (var i = 0; i < pathArr.length; i++) {
    obj = obj && obj[pathArr[i]];
    if (obj == null) {
      break;
    }
  }
  return obj;
}
function set(opt, path, val, overwrite) {
  var pathArr = path.split(",");
  var obj = opt;
  var key;
  var i = 0;
  for (; i < pathArr.length - 1; i++) {
    key = pathArr[i];
    if (obj[key] == null) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  if (obj[pathArr[i]] == null) {
    obj[pathArr[i]] = val;
  }
}
function compatLayoutProperties(option) {
  option && each$4(LAYOUT_PROPERTIES, function(prop) {
    if (prop[0] in option && !(prop[1] in option)) {
      option[prop[1]] = option[prop[0]];
    }
  });
}
var LAYOUT_PROPERTIES = [["x", "left"], ["y", "top"], ["x2", "right"], ["y2", "bottom"]];
var COMPATITABLE_COMPONENTS = ["grid", "geo", "parallel", "legend", "toolbox", "title", "visualMap", "dataZoom", "timeline"];
var BAR_ITEM_STYLE_MAP = [["borderRadius", "barBorderRadius"], ["borderColor", "barBorderColor"], ["borderWidth", "barBorderWidth"]];
function compatBarItemStyle(option) {
  var itemStyle = option && option.itemStyle;
  if (itemStyle) {
    for (var i = 0; i < BAR_ITEM_STYLE_MAP.length; i++) {
      var oldName = BAR_ITEM_STYLE_MAP[i][1];
      var newName = BAR_ITEM_STYLE_MAP[i][0];
      if (itemStyle[oldName] != null) {
        itemStyle[newName] = itemStyle[oldName];
      }
    }
  }
}
function compatPieLabel(option) {
  if (!option) {
    return;
  }
  if (option.alignTo === "edge" && option.margin != null && option.edgeDistance == null) {
    option.edgeDistance = option.margin;
  }
}
function compatSunburstState(option) {
  if (!option) {
    return;
  }
  if (option.downplay && !option.blur) {
    option.blur = option.downplay;
  }
}
function compatGraphFocus(option) {
  if (!option) {
    return;
  }
  if (option.focusNodeAdjacency != null) {
    option.emphasis = option.emphasis || {};
    if (option.emphasis.focus == null) {
      option.emphasis.focus = "adjacency";
    }
  }
}
function traverseTree(data, cb) {
  if (data) {
    for (var i = 0; i < data.length; i++) {
      cb(data[i]);
      data[i] && traverseTree(data[i].children, cb);
    }
  }
}
function globalBackwardCompat(option, isTheme) {
  globalCompatStyle(option, isTheme);
  option.series = normalizeToArray(option.series);
  each$4(option.series, function(seriesOpt) {
    if (!isObject$2(seriesOpt)) {
      return;
    }
    var seriesType2 = seriesOpt.type;
    if (seriesType2 === "line") {
      if (seriesOpt.clipOverflow != null) {
        seriesOpt.clip = seriesOpt.clipOverflow;
      }
    } else if (seriesType2 === "pie" || seriesType2 === "gauge") {
      if (seriesOpt.clockWise != null) {
        seriesOpt.clockwise = seriesOpt.clockWise;
      }
      compatPieLabel(seriesOpt.label);
      var data = seriesOpt.data;
      if (data && !isTypedArray(data)) {
        for (var i = 0; i < data.length; i++) {
          compatPieLabel(data[i]);
        }
      }
      if (seriesOpt.hoverOffset != null) {
        seriesOpt.emphasis = seriesOpt.emphasis || {};
        if (seriesOpt.emphasis.scaleSize = null) {
          seriesOpt.emphasis.scaleSize = seriesOpt.hoverOffset;
        }
      }
    } else if (seriesType2 === "gauge") {
      var pointerColor = get(seriesOpt, "pointer.color");
      pointerColor != null && set(seriesOpt, "itemStyle.color", pointerColor);
    } else if (seriesType2 === "bar") {
      compatBarItemStyle(seriesOpt);
      compatBarItemStyle(seriesOpt.backgroundStyle);
      compatBarItemStyle(seriesOpt.emphasis);
      var data = seriesOpt.data;
      if (data && !isTypedArray(data)) {
        for (var i = 0; i < data.length; i++) {
          if (typeof data[i] === "object") {
            compatBarItemStyle(data[i]);
            compatBarItemStyle(data[i] && data[i].emphasis);
          }
        }
      }
    } else if (seriesType2 === "sunburst") {
      var highlightPolicy = seriesOpt.highlightPolicy;
      if (highlightPolicy) {
        seriesOpt.emphasis = seriesOpt.emphasis || {};
        if (!seriesOpt.emphasis.focus) {
          seriesOpt.emphasis.focus = highlightPolicy;
        }
      }
      compatSunburstState(seriesOpt);
      traverseTree(seriesOpt.data, compatSunburstState);
    } else if (seriesType2 === "graph" || seriesType2 === "sankey") {
      compatGraphFocus(seriesOpt);
    } else if (seriesType2 === "map") {
      if (seriesOpt.mapType && !seriesOpt.map) {
        seriesOpt.map = seriesOpt.mapType;
      }
      if (seriesOpt.mapLocation) {
        defaults(seriesOpt, seriesOpt.mapLocation);
      }
    }
    if (seriesOpt.hoverAnimation != null) {
      seriesOpt.emphasis = seriesOpt.emphasis || {};
      if (seriesOpt.emphasis && seriesOpt.emphasis.scale == null) {
        seriesOpt.emphasis.scale = seriesOpt.hoverAnimation;
      }
    }
    compatLayoutProperties(seriesOpt);
  });
  if (option.dataRange) {
    option.visualMap = option.dataRange;
  }
  each$4(COMPATITABLE_COMPONENTS, function(componentName) {
    var options = option[componentName];
    if (options) {
      if (!isArray(options)) {
        options = [options];
      }
      each$4(options, function(option2) {
        compatLayoutProperties(option2);
      });
    }
  });
}
function dataStack(ecModel) {
  var stackInfoMap = createHashMap();
  ecModel.eachSeries(function(seriesModel) {
    var stack = seriesModel.get("stack");
    if (stack) {
      var stackInfoList = stackInfoMap.get(stack) || stackInfoMap.set(stack, []);
      var data = seriesModel.getData();
      var stackInfo = {
        // Used for calculate axis extent automatically.
        // TODO: Type getCalculationInfo return more specific type?
        stackResultDimension: data.getCalculationInfo("stackResultDimension"),
        stackedOverDimension: data.getCalculationInfo("stackedOverDimension"),
        stackedDimension: data.getCalculationInfo("stackedDimension"),
        stackedByDimension: data.getCalculationInfo("stackedByDimension"),
        isStackedByIndex: data.getCalculationInfo("isStackedByIndex"),
        data,
        seriesModel
      };
      if (!stackInfo.stackedDimension || !(stackInfo.isStackedByIndex || stackInfo.stackedByDimension)) {
        return;
      }
      stackInfoList.push(stackInfo);
    }
  });
  stackInfoMap.each(function(stackInfoList) {
    if (stackInfoList.length === 0) {
      return;
    }
    var firstSeries = stackInfoList[0].seriesModel;
    var stackOrder = firstSeries.get("stackOrder") || "seriesAsc";
    if (stackOrder === "seriesDesc") {
      stackInfoList.reverse();
    }
    each$4(stackInfoList, function(stackInfo, index) {
      stackInfo.data.setCalculationInfo("stackedOnSeries", index > 0 ? stackInfoList[index - 1].seriesModel : null);
    });
    calculateStack(stackInfoList);
  });
}
function calculateStack(stackInfoList) {
  each$4(stackInfoList, function(targetStackInfo, idxInStack) {
    var resultVal = [];
    var resultNaN = [NaN, NaN];
    var dims = [targetStackInfo.stackResultDimension, targetStackInfo.stackedOverDimension];
    var targetData = targetStackInfo.data;
    var isStackedByIndex = targetStackInfo.isStackedByIndex;
    var stackStrategy = targetStackInfo.seriesModel.get("stackStrategy") || "samesign";
    targetData.modify(dims, function(v0, v12, dataIndex) {
      var sum = targetData.get(targetStackInfo.stackedDimension, dataIndex);
      if (isNaN(sum)) {
        return resultNaN;
      }
      var byValue;
      var stackedDataRawIndex;
      if (isStackedByIndex) {
        stackedDataRawIndex = targetData.getRawIndex(dataIndex);
      } else {
        byValue = targetData.get(targetStackInfo.stackedByDimension, dataIndex);
      }
      var stackedOver = NaN;
      for (var j = idxInStack - 1; j >= 0; j--) {
        var stackInfo = stackInfoList[j];
        if (!isStackedByIndex) {
          stackedDataRawIndex = stackInfo.data.rawIndexOf(stackInfo.stackedByDimension, byValue);
        }
        if (stackedDataRawIndex >= 0) {
          var val = stackInfo.data.getByRawIndex(stackInfo.stackResultDimension, stackedDataRawIndex);
          if (stackStrategy === "all" || stackStrategy === "positive" && val > 0 || stackStrategy === "negative" && val < 0 || stackStrategy === "samesign" && sum >= 0 && val > 0 || stackStrategy === "samesign" && sum <= 0 && val < 0) {
            sum = addSafe(sum, val);
            stackedOver = val;
            break;
          }
        }
      }
      resultVal[0] = sum;
      resultVal[1] = stackedOver;
      return resultVal;
    });
  });
}
var SourceImpl = (
  /** @class */
  /* @__PURE__ */ function() {
    function SourceImpl2(fields) {
      this.data = fields.data || (fields.sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS ? {} : []);
      this.sourceFormat = fields.sourceFormat || SOURCE_FORMAT_UNKNOWN;
      this.seriesLayoutBy = fields.seriesLayoutBy || SERIES_LAYOUT_BY_COLUMN;
      this.startIndex = fields.startIndex || 0;
      this.dimensionsDetectedCount = fields.dimensionsDetectedCount;
      this.metaRawOption = fields.metaRawOption;
      var dimensionsDefine = this.dimensionsDefine = fields.dimensionsDefine;
      if (dimensionsDefine) {
        for (var i = 0; i < dimensionsDefine.length; i++) {
          var dim = dimensionsDefine[i];
          if (dim.type == null) {
            if (guessOrdinal(this, i) === BE_ORDINAL.Must) {
              dim.type = "ordinal";
            }
          }
        }
      }
    }
    return SourceImpl2;
  }()
);
function isSourceInstance(val) {
  return val instanceof SourceImpl;
}
function createSource(sourceData, thisMetaRawOption, sourceFormat) {
  sourceFormat = sourceFormat || detectSourceFormat(sourceData);
  var seriesLayoutBy = thisMetaRawOption.seriesLayoutBy;
  var determined = determineSourceDimensions(sourceData, sourceFormat, seriesLayoutBy, thisMetaRawOption.sourceHeader, thisMetaRawOption.dimensions);
  var source = new SourceImpl({
    data: sourceData,
    sourceFormat,
    seriesLayoutBy,
    dimensionsDefine: determined.dimensionsDefine,
    startIndex: determined.startIndex,
    dimensionsDetectedCount: determined.dimensionsDetectedCount,
    metaRawOption: clone$1(thisMetaRawOption)
  });
  return source;
}
function createSourceFromSeriesDataOption(data) {
  return new SourceImpl({
    data,
    sourceFormat: isTypedArray(data) ? SOURCE_FORMAT_TYPED_ARRAY : SOURCE_FORMAT_ORIGINAL
  });
}
function cloneSourceShallow(source) {
  return new SourceImpl({
    data: source.data,
    sourceFormat: source.sourceFormat,
    seriesLayoutBy: source.seriesLayoutBy,
    dimensionsDefine: clone$1(source.dimensionsDefine),
    startIndex: source.startIndex,
    dimensionsDetectedCount: source.dimensionsDetectedCount
  });
}
function detectSourceFormat(data) {
  var sourceFormat = SOURCE_FORMAT_UNKNOWN;
  if (isTypedArray(data)) {
    sourceFormat = SOURCE_FORMAT_TYPED_ARRAY;
  } else if (isArray(data)) {
    if (data.length === 0) {
      sourceFormat = SOURCE_FORMAT_ARRAY_ROWS;
    }
    for (var i = 0, len2 = data.length; i < len2; i++) {
      var item = data[i];
      if (item == null) {
        continue;
      } else if (isArray(item) || isTypedArray(item)) {
        sourceFormat = SOURCE_FORMAT_ARRAY_ROWS;
        break;
      } else if (isObject$2(item)) {
        sourceFormat = SOURCE_FORMAT_OBJECT_ROWS;
        break;
      }
    }
  } else if (isObject$2(data)) {
    for (var key in data) {
      if (hasOwn(data, key) && isArrayLike(data[key])) {
        sourceFormat = SOURCE_FORMAT_KEYED_COLUMNS;
        break;
      }
    }
  }
  return sourceFormat;
}
function determineSourceDimensions(data, sourceFormat, seriesLayoutBy, sourceHeader, dimensionsDefine) {
  var dimensionsDetectedCount;
  var startIndex;
  if (!data) {
    return {
      dimensionsDefine: normalizeDimensionsOption(dimensionsDefine),
      startIndex,
      dimensionsDetectedCount
    };
  }
  if (sourceFormat === SOURCE_FORMAT_ARRAY_ROWS) {
    var dataArrayRows = data;
    if (sourceHeader === "auto" || sourceHeader == null) {
      arrayRowsTravelFirst(function(val) {
        if (val != null && val !== "-") {
          if (isString(val)) {
            startIndex == null && (startIndex = 1);
          } else {
            startIndex = 0;
          }
        }
      }, seriesLayoutBy, dataArrayRows, 10);
    } else {
      startIndex = isNumber(sourceHeader) ? sourceHeader : sourceHeader ? 1 : 0;
    }
    if (!dimensionsDefine && startIndex === 1) {
      dimensionsDefine = [];
      arrayRowsTravelFirst(function(val, index) {
        dimensionsDefine[index] = val != null ? val + "" : "";
      }, seriesLayoutBy, dataArrayRows, Infinity);
    }
    dimensionsDetectedCount = dimensionsDefine ? dimensionsDefine.length : seriesLayoutBy === SERIES_LAYOUT_BY_ROW ? dataArrayRows.length : dataArrayRows[0] ? dataArrayRows[0].length : null;
  } else if (sourceFormat === SOURCE_FORMAT_OBJECT_ROWS) {
    if (!dimensionsDefine) {
      dimensionsDefine = objectRowsCollectDimensions(data);
    }
  } else if (sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS) {
    if (!dimensionsDefine) {
      dimensionsDefine = [];
      each$4(data, function(colArr, key) {
        dimensionsDefine.push(key);
      });
    }
  } else if (sourceFormat === SOURCE_FORMAT_ORIGINAL) {
    var value0 = getDataItemValue(data[0]);
    dimensionsDetectedCount = isArray(value0) && value0.length || 1;
  } else ;
  return {
    startIndex,
    dimensionsDefine: normalizeDimensionsOption(dimensionsDefine),
    dimensionsDetectedCount
  };
}
function objectRowsCollectDimensions(data) {
  var firstIndex = 0;
  var obj;
  while (firstIndex < data.length && !(obj = data[firstIndex++])) {
  }
  if (obj) {
    return keys(obj);
  }
}
function normalizeDimensionsOption(dimensionsDefine) {
  if (!dimensionsDefine) {
    return;
  }
  var nameMap = createHashMap();
  return map$1(dimensionsDefine, function(rawItem, index) {
    rawItem = isObject$2(rawItem) ? rawItem : {
      name: rawItem
    };
    var item = {
      name: rawItem.name,
      displayName: rawItem.displayName,
      type: rawItem.type
    };
    if (item.name == null) {
      return item;
    }
    item.name += "";
    if (item.displayName == null) {
      item.displayName = item.name;
    }
    var exist = nameMap.get(item.name);
    if (!exist) {
      nameMap.set(item.name, {
        count: 1
      });
    } else {
      item.name += "-" + exist.count++;
    }
    return item;
  });
}
function arrayRowsTravelFirst(cb, seriesLayoutBy, data, maxLoop) {
  if (seriesLayoutBy === SERIES_LAYOUT_BY_ROW) {
    for (var i = 0; i < data.length && i < maxLoop; i++) {
      cb(data[i] ? data[i][0] : null, i);
    }
  } else {
    var value0 = data[0] || [];
    for (var i = 0; i < value0.length && i < maxLoop; i++) {
      cb(value0[i], i);
    }
  }
}
function shouldRetrieveDataByName(source) {
  var sourceFormat = source.sourceFormat;
  return sourceFormat === SOURCE_FORMAT_OBJECT_ROWS || sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS;
}
var _a, _b, _c, _d;
var providerMethods;
var mountMethods;
var DefaultDataProvider = (
  /** @class */
  function() {
    function DefaultDataProvider2(sourceParam, dimSize) {
      var source = !isSourceInstance(sourceParam) ? createSourceFromSeriesDataOption(sourceParam) : sourceParam;
      this._source = source;
      var data = this._data = source.data;
      var sourceFormat = source.sourceFormat;
      source.seriesLayoutBy;
      if (sourceFormat === SOURCE_FORMAT_TYPED_ARRAY) {
        this._offset = 0;
        this._dimSize = dimSize;
        this._data = data;
      }
      mountMethods(this, data, source);
    }
    DefaultDataProvider2.prototype.getSource = function() {
      return this._source;
    };
    DefaultDataProvider2.prototype.count = function() {
      return 0;
    };
    DefaultDataProvider2.prototype.getItem = function(idx, out) {
      return;
    };
    DefaultDataProvider2.prototype.appendData = function(newData) {
    };
    DefaultDataProvider2.prototype.clean = function() {
    };
    DefaultDataProvider2.protoInitialize = function() {
      var proto = DefaultDataProvider2.prototype;
      proto.pure = false;
      proto.persistent = true;
    }();
    DefaultDataProvider2.internalField = function() {
      var _a2;
      mountMethods = function(provider, data, source) {
        var sourceFormat = source.sourceFormat;
        var seriesLayoutBy = source.seriesLayoutBy;
        var startIndex = source.startIndex;
        var dimsDef = source.dimensionsDefine;
        var methods = providerMethods[getMethodMapKey(sourceFormat, seriesLayoutBy)];
        extend(provider, methods);
        if (sourceFormat === SOURCE_FORMAT_TYPED_ARRAY) {
          provider.getItem = getItemForTypedArray;
          provider.count = countForTypedArray;
          provider.fillStorage = fillStorageForTypedArray;
        } else {
          var rawItemGetter = getRawSourceItemGetter(sourceFormat, seriesLayoutBy);
          provider.getItem = bind$1(rawItemGetter, null, data, startIndex, dimsDef);
          var rawCounter = getRawSourceDataCounter(sourceFormat, seriesLayoutBy);
          provider.count = bind$1(rawCounter, null, data, startIndex, dimsDef);
        }
      };
      var getItemForTypedArray = function(idx, out) {
        idx = idx - this._offset;
        out = out || [];
        var data = this._data;
        var dimSize = this._dimSize;
        var offset = dimSize * idx;
        for (var i = 0; i < dimSize; i++) {
          out[i] = data[offset + i];
        }
        return out;
      };
      var fillStorageForTypedArray = function(start, end, storage, extent) {
        var data = this._data;
        var dimSize = this._dimSize;
        for (var dim = 0; dim < dimSize; dim++) {
          var dimExtent = extent[dim];
          var min = dimExtent[0] == null ? Infinity : dimExtent[0];
          var max = dimExtent[1] == null ? -Infinity : dimExtent[1];
          var count = end - start;
          var arr = storage[dim];
          for (var i = 0; i < count; i++) {
            var val = data[i * dimSize + dim];
            arr[start + i] = val;
            val < min && (min = val);
            val > max && (max = val);
          }
          dimExtent[0] = min;
          dimExtent[1] = max;
        }
      };
      var countForTypedArray = function() {
        return this._data ? this._data.length / this._dimSize : 0;
      };
      providerMethods = (_a2 = {}, _a2[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_COLUMN] = {
        pure: true,
        appendData: appendDataSimply
      }, _a2[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_ROW] = {
        pure: true,
        appendData: function() {
          throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
        }
      }, _a2[SOURCE_FORMAT_OBJECT_ROWS] = {
        pure: true,
        appendData: appendDataSimply
      }, _a2[SOURCE_FORMAT_KEYED_COLUMNS] = {
        pure: true,
        appendData: function(newData) {
          var data = this._data;
          each$4(newData, function(newCol, key) {
            var oldCol = data[key] || (data[key] = []);
            for (var i = 0; i < (newCol || []).length; i++) {
              oldCol.push(newCol[i]);
            }
          });
        }
      }, _a2[SOURCE_FORMAT_ORIGINAL] = {
        appendData: appendDataSimply
      }, _a2[SOURCE_FORMAT_TYPED_ARRAY] = {
        persistent: false,
        pure: true,
        appendData: function(newData) {
          this._data = newData;
        },
        // Clean self if data is already used.
        clean: function() {
          this._offset += this.count();
          this._data = null;
        }
      }, _a2);
      function appendDataSimply(newData) {
        for (var i = 0; i < newData.length; i++) {
          this._data.push(newData[i]);
        }
      }
    }();
    return DefaultDataProvider2;
  }()
);
var validateSimply = function(rawData) {
  if (!isArray(rawData)) {
    error("series.data or dataset.source must be an array.");
  }
};
_a = {}, _a[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_COLUMN] = validateSimply, _a[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_ROW] = validateSimply, _a[SOURCE_FORMAT_OBJECT_ROWS] = validateSimply, _a[SOURCE_FORMAT_KEYED_COLUMNS] = function(rawData, dimsDef) {
  for (var i = 0; i < dimsDef.length; i++) {
    var dimName = dimsDef[i].name;
    if (dimName == null) {
      error("dimension name must not be null/undefined.");
    }
  }
}, _a[SOURCE_FORMAT_ORIGINAL] = validateSimply, _a;
var getItemSimply = function(rawData, startIndex, dimsDef, idx) {
  return rawData[idx];
};
var rawSourceItemGetterMap = (_b = {}, _b[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_COLUMN] = function(rawData, startIndex, dimsDef, idx) {
  return rawData[idx + startIndex];
}, _b[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_ROW] = function(rawData, startIndex, dimsDef, idx, out) {
  idx += startIndex;
  var item = out || [];
  var data = rawData;
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    item[i] = row ? row[idx] : null;
  }
  return item;
}, _b[SOURCE_FORMAT_OBJECT_ROWS] = getItemSimply, _b[SOURCE_FORMAT_KEYED_COLUMNS] = function(rawData, startIndex, dimsDef, idx, out) {
  var item = out || [];
  for (var i = 0; i < dimsDef.length; i++) {
    var dimName = dimsDef[i].name;
    var col = dimName != null ? rawData[dimName] : null;
    item[i] = col ? col[idx] : null;
  }
  return item;
}, _b[SOURCE_FORMAT_ORIGINAL] = getItemSimply, _b);
function getRawSourceItemGetter(sourceFormat, seriesLayoutBy) {
  var method = rawSourceItemGetterMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];
  return method;
}
var countSimply = function(rawData, startIndex, dimsDef) {
  return rawData.length;
};
var rawSourceDataCounterMap = (_c = {}, _c[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_COLUMN] = function(rawData, startIndex, dimsDef) {
  return Math.max(0, rawData.length - startIndex);
}, _c[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_ROW] = function(rawData, startIndex, dimsDef) {
  var row = rawData[0];
  return row ? Math.max(0, row.length - startIndex) : 0;
}, _c[SOURCE_FORMAT_OBJECT_ROWS] = countSimply, _c[SOURCE_FORMAT_KEYED_COLUMNS] = function(rawData, startIndex, dimsDef) {
  var dimName = dimsDef[0].name;
  var col = dimName != null ? rawData[dimName] : null;
  return col ? col.length : 0;
}, _c[SOURCE_FORMAT_ORIGINAL] = countSimply, _c);
function getRawSourceDataCounter(sourceFormat, seriesLayoutBy) {
  var method = rawSourceDataCounterMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];
  return method;
}
var getRawValueSimply = function(dataItem, dimIndex, property) {
  return dataItem[dimIndex];
};
var rawSourceValueGetterMap = (_d = {}, _d[SOURCE_FORMAT_ARRAY_ROWS] = getRawValueSimply, _d[SOURCE_FORMAT_OBJECT_ROWS] = function(dataItem, dimIndex, property) {
  return dataItem[property];
}, _d[SOURCE_FORMAT_KEYED_COLUMNS] = getRawValueSimply, _d[SOURCE_FORMAT_ORIGINAL] = function(dataItem, dimIndex, property) {
  var value = getDataItemValue(dataItem);
  return !(value instanceof Array) ? value : value[dimIndex];
}, _d[SOURCE_FORMAT_TYPED_ARRAY] = getRawValueSimply, _d);
function getRawSourceValueGetter(sourceFormat) {
  var method = rawSourceValueGetterMap[sourceFormat];
  return method;
}
function getMethodMapKey(sourceFormat, seriesLayoutBy) {
  return sourceFormat === SOURCE_FORMAT_ARRAY_ROWS ? sourceFormat + "_" + seriesLayoutBy : sourceFormat;
}
function retrieveRawValue(data, dataIndex, dim) {
  if (!data) {
    return;
  }
  var dataItem = data.getRawDataItem(dataIndex);
  if (dataItem == null) {
    return;
  }
  var store = data.getStore();
  var sourceFormat = store.getSource().sourceFormat;
  if (dim != null) {
    var dimIndex = data.getDimensionIndex(dim);
    var property = store.getDimensionProperty(dimIndex);
    return getRawSourceValueGetter(sourceFormat)(dataItem, dimIndex, property);
  } else {
    var result = dataItem;
    if (sourceFormat === SOURCE_FORMAT_ORIGINAL) {
      result = getDataItemValue(dataItem);
    }
    return result;
  }
}
var DIMENSION_LABEL_REG = /\{@(.+?)\}/g;
var DataFormatMixin = (
  /** @class */
  function() {
    function DataFormatMixin2() {
    }
    DataFormatMixin2.prototype.getDataParams = function(dataIndex, dataType) {
      var data = this.getData(dataType);
      var rawValue = this.getRawValue(dataIndex, dataType);
      var rawDataIndex = data.getRawIndex(dataIndex);
      var name = data.getName(dataIndex);
      var itemOpt = data.getRawDataItem(dataIndex);
      var style = data.getItemVisual(dataIndex, "style");
      var color2 = style && style[data.getItemVisual(dataIndex, "drawType") || "fill"];
      var borderColor = style && style.stroke;
      var mainType = this.mainType;
      var isSeries2 = mainType === "series";
      var userOutput = data.userOutput && data.userOutput.get();
      return {
        componentType: mainType,
        componentSubType: this.subType,
        componentIndex: this.componentIndex,
        seriesType: isSeries2 ? this.subType : null,
        seriesIndex: this.seriesIndex,
        seriesId: isSeries2 ? this.id : null,
        seriesName: isSeries2 ? this.name : null,
        name,
        dataIndex: rawDataIndex,
        data: itemOpt,
        dataType,
        value: rawValue,
        color: color2,
        borderColor,
        dimensionNames: userOutput ? userOutput.fullDimensions : null,
        encode: userOutput ? userOutput.encode : null,
        // Param name list for mapping `a`, `b`, `c`, `d`, `e`
        $vars: ["seriesName", "name", "value"]
      };
    };
    DataFormatMixin2.prototype.getFormattedLabel = function(dataIndex, status, dataType, labelDimIndex, formatter, extendParams) {
      status = status || "normal";
      var data = this.getData(dataType);
      var params = this.getDataParams(dataIndex, dataType);
      if (extendParams) {
        params.value = extendParams.interpolatedValue;
      }
      if (labelDimIndex != null && isArray(params.value)) {
        params.value = params.value[labelDimIndex];
      }
      if (!formatter) {
        var itemModel = data.getItemModel(dataIndex);
        formatter = itemModel.get(status === "normal" ? ["label", "formatter"] : [status, "label", "formatter"]);
      }
      if (isFunction(formatter)) {
        params.status = status;
        params.dimensionIndex = labelDimIndex;
        return formatter(params);
      } else if (isString(formatter)) {
        var str = formatTpl(formatter, params);
        return str.replace(DIMENSION_LABEL_REG, function(origin, dimStr) {
          var len2 = dimStr.length;
          var dimLoose = dimStr;
          if (dimLoose.charAt(0) === "[" && dimLoose.charAt(len2 - 1) === "]") {
            dimLoose = +dimLoose.slice(1, len2 - 1);
          }
          var val = retrieveRawValue(data, dataIndex, dimLoose);
          if (extendParams && isArray(extendParams.interpolatedValue)) {
            var dimIndex = data.getDimensionIndex(dimLoose);
            if (dimIndex >= 0) {
              val = extendParams.interpolatedValue[dimIndex];
            }
          }
          return val != null ? val + "" : "";
        });
      }
    };
    DataFormatMixin2.prototype.getRawValue = function(idx, dataType) {
      return retrieveRawValue(this.getData(dataType), idx);
    };
    DataFormatMixin2.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
      return;
    };
    return DataFormatMixin2;
  }()
);
function normalizeTooltipFormatResult(result) {
  var markupText;
  var markupFragment;
  if (isObject$2(result)) {
    if (result.type) {
      markupFragment = result;
    }
  } else {
    markupText = result;
  }
  return {
    text: markupText,
    // markers: markers || markersExisting,
    frag: markupFragment
  };
}
function createTask(define) {
  return new Task(define);
}
var Task = (
  /** @class */
  function() {
    function Task2(define) {
      define = define || {};
      this._reset = define.reset;
      this._plan = define.plan;
      this._count = define.count;
      this._onDirty = define.onDirty;
      this._dirty = true;
    }
    Task2.prototype.perform = function(performArgs) {
      var upTask = this._upstream;
      var skip = performArgs && performArgs.skip;
      if (this._dirty && upTask) {
        var context = this.context;
        context.data = context.outputData = upTask.context.outputData;
      }
      if (this.__pipeline) {
        this.__pipeline.currentTask = this;
      }
      var planResult;
      if (this._plan && !skip) {
        planResult = this._plan(this.context);
      }
      var lastModBy = normalizeModBy(this._modBy);
      var lastModDataCount = this._modDataCount || 0;
      var modBy = normalizeModBy(performArgs && performArgs.modBy);
      var modDataCount = performArgs && performArgs.modDataCount || 0;
      if (lastModBy !== modBy || lastModDataCount !== modDataCount) {
        planResult = "reset";
      }
      function normalizeModBy(val) {
        !(val >= 1) && (val = 1);
        return val;
      }
      var forceFirstProgress;
      if (this._dirty || planResult === "reset") {
        this._dirty = false;
        forceFirstProgress = this._doReset(skip);
      }
      this._modBy = modBy;
      this._modDataCount = modDataCount;
      var step = performArgs && performArgs.step;
      if (upTask) {
        this._dueEnd = upTask._outputDueEnd;
      } else {
        this._dueEnd = this._count ? this._count(this.context) : Infinity;
      }
      if (this._progress) {
        var start = this._dueIndex;
        var end = Math.min(step != null ? this._dueIndex + step : Infinity, this._dueEnd);
        if (!skip && (forceFirstProgress || start < end)) {
          var progress = this._progress;
          if (isArray(progress)) {
            for (var i = 0; i < progress.length; i++) {
              this._doProgress(progress[i], start, end, modBy, modDataCount);
            }
          } else {
            this._doProgress(progress, start, end, modBy, modDataCount);
          }
        }
        this._dueIndex = end;
        var outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : end;
        this._outputDueEnd = outputDueEnd;
      } else {
        this._dueIndex = this._outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : this._dueEnd;
      }
      return this.unfinished();
    };
    Task2.prototype.dirty = function() {
      this._dirty = true;
      this._onDirty && this._onDirty(this.context);
    };
    Task2.prototype._doProgress = function(progress, start, end, modBy, modDataCount) {
      iterator.reset(start, end, modBy, modDataCount);
      this._callingProgress = progress;
      this._callingProgress({
        start,
        end,
        count: end - start,
        next: iterator.next
      }, this.context);
    };
    Task2.prototype._doReset = function(skip) {
      this._dueIndex = this._outputDueEnd = this._dueEnd = 0;
      this._settedOutputEnd = null;
      var progress;
      var forceFirstProgress;
      if (!skip && this._reset) {
        progress = this._reset(this.context);
        if (progress && progress.progress) {
          forceFirstProgress = progress.forceFirstProgress;
          progress = progress.progress;
        }
        if (isArray(progress) && !progress.length) {
          progress = null;
        }
      }
      this._progress = progress;
      this._modBy = this._modDataCount = null;
      var downstream = this._downstream;
      downstream && downstream.dirty();
      return forceFirstProgress;
    };
    Task2.prototype.unfinished = function() {
      return this._progress && this._dueIndex < this._dueEnd;
    };
    Task2.prototype.pipe = function(downTask) {
      if (this._downstream !== downTask || this._dirty) {
        this._downstream = downTask;
        downTask._upstream = this;
        downTask.dirty();
      }
    };
    Task2.prototype.dispose = function() {
      if (this._disposed) {
        return;
      }
      this._upstream && (this._upstream._downstream = null);
      this._downstream && (this._downstream._upstream = null);
      this._dirty = false;
      this._disposed = true;
    };
    Task2.prototype.getUpstream = function() {
      return this._upstream;
    };
    Task2.prototype.getDownstream = function() {
      return this._downstream;
    };
    Task2.prototype.setOutputEnd = function(end) {
      this._outputDueEnd = this._settedOutputEnd = end;
    };
    return Task2;
  }()
);
var iterator = /* @__PURE__ */ function() {
  var end;
  var current;
  var modBy;
  var modDataCount;
  var winCount;
  var it = {
    reset: function(s, e, sStep, sCount) {
      current = s;
      end = e;
      modBy = sStep;
      modDataCount = sCount;
      winCount = Math.ceil(modDataCount / modBy);
      it.next = modBy > 1 && modDataCount > 0 ? modNext : sequentialNext;
    }
  };
  return it;
  function sequentialNext() {
    return current < end ? current++ : null;
  }
  function modNext() {
    var dataIndex = current % winCount * modBy + Math.ceil(current / winCount);
    var result = current >= end ? null : dataIndex < modDataCount ? dataIndex : current;
    current++;
    return result;
  }
}();
function parseDataValue(value, opt) {
  var dimType = opt && opt.type;
  if (dimType === "ordinal") {
    return value;
  }
  if (dimType === "time" && !isNumber(value) && value != null && value !== "-") {
    value = +parseDate(value);
  }
  return value == null || value === "" ? NaN : Number(value);
}
createHashMap({
  "number": function(val) {
    return parseFloat(val);
  },
  "time": function(val) {
    return +parseDate(val);
  },
  "trim": function(val) {
    return isString(val) ? trim(val) : val;
  }
});
var SortOrderComparator = (
  /** @class */
  function() {
    function SortOrderComparator2(order, incomparable) {
      var isDesc = order === "desc";
      this._resultLT = isDesc ? 1 : -1;
      if (incomparable == null) {
        incomparable = isDesc ? "min" : "max";
      }
      this._incomparable = incomparable === "min" ? -Infinity : Infinity;
    }
    SortOrderComparator2.prototype.evaluate = function(lval, rval) {
      var lvalFloat = isNumber(lval) ? lval : numericToNumber(lval);
      var rvalFloat = isNumber(rval) ? rval : numericToNumber(rval);
      var lvalNotNumeric = isNaN(lvalFloat);
      var rvalNotNumeric = isNaN(rvalFloat);
      if (lvalNotNumeric) {
        lvalFloat = this._incomparable;
      }
      if (rvalNotNumeric) {
        rvalFloat = this._incomparable;
      }
      if (lvalNotNumeric && rvalNotNumeric) {
        var lvalIsStr = isString(lval);
        var rvalIsStr = isString(rval);
        if (lvalIsStr) {
          lvalFloat = rvalIsStr ? lval : 0;
        }
        if (rvalIsStr) {
          rvalFloat = lvalIsStr ? rval : 0;
        }
      }
      return lvalFloat < rvalFloat ? this._resultLT : lvalFloat > rvalFloat ? -this._resultLT : 0;
    };
    return SortOrderComparator2;
  }()
);
var ExternalSource = (
  /** @class */
  function() {
    function ExternalSource2() {
    }
    ExternalSource2.prototype.getRawData = function() {
      throw new Error("not supported");
    };
    ExternalSource2.prototype.getRawDataItem = function(dataIndex) {
      throw new Error("not supported");
    };
    ExternalSource2.prototype.cloneRawData = function() {
      return;
    };
    ExternalSource2.prototype.getDimensionInfo = function(dim) {
      return;
    };
    ExternalSource2.prototype.cloneAllDimensionInfo = function() {
      return;
    };
    ExternalSource2.prototype.count = function() {
      return;
    };
    ExternalSource2.prototype.retrieveValue = function(dataIndex, dimIndex) {
      return;
    };
    ExternalSource2.prototype.retrieveValueFromItem = function(dataItem, dimIndex) {
      return;
    };
    ExternalSource2.prototype.convertValue = function(rawVal, dimInfo) {
      return parseDataValue(rawVal, dimInfo);
    };
    return ExternalSource2;
  }()
);
function createExternalSource(internalSource, externalTransform) {
  var extSource = new ExternalSource();
  var data = internalSource.data;
  var sourceFormat = extSource.sourceFormat = internalSource.sourceFormat;
  var sourceHeaderCount = internalSource.startIndex;
  var errMsg = "";
  if (internalSource.seriesLayoutBy !== SERIES_LAYOUT_BY_COLUMN) {
    throwError(errMsg);
  }
  var dimensions = [];
  var dimsByName = {};
  var dimsDef = internalSource.dimensionsDefine;
  if (dimsDef) {
    each$4(dimsDef, function(dimDef, idx) {
      var name = dimDef.name;
      var dimDefExt = {
        index: idx,
        name,
        displayName: dimDef.displayName
      };
      dimensions.push(dimDefExt);
      if (name != null) {
        var errMsg_1 = "";
        if (hasOwn(dimsByName, name)) {
          throwError(errMsg_1);
        }
        dimsByName[name] = dimDefExt;
      }
    });
  } else {
    for (var i = 0; i < internalSource.dimensionsDetectedCount || 0; i++) {
      dimensions.push({
        index: i
      });
    }
  }
  var rawItemGetter = getRawSourceItemGetter(sourceFormat, SERIES_LAYOUT_BY_COLUMN);
  if (externalTransform.__isBuiltIn) {
    extSource.getRawDataItem = function(dataIndex) {
      return rawItemGetter(data, sourceHeaderCount, dimensions, dataIndex);
    };
    extSource.getRawData = bind$1(getRawData, null, internalSource);
  }
  extSource.cloneRawData = bind$1(cloneRawData, null, internalSource);
  var rawCounter = getRawSourceDataCounter(sourceFormat, SERIES_LAYOUT_BY_COLUMN);
  extSource.count = bind$1(rawCounter, null, data, sourceHeaderCount, dimensions);
  var rawValueGetter = getRawSourceValueGetter(sourceFormat);
  extSource.retrieveValue = function(dataIndex, dimIndex) {
    var rawItem = rawItemGetter(data, sourceHeaderCount, dimensions, dataIndex);
    return retrieveValueFromItem(rawItem, dimIndex);
  };
  var retrieveValueFromItem = extSource.retrieveValueFromItem = function(dataItem, dimIndex) {
    if (dataItem == null) {
      return;
    }
    var dimDef = dimensions[dimIndex];
    if (dimDef) {
      return rawValueGetter(dataItem, dimIndex, dimDef.name);
    }
  };
  extSource.getDimensionInfo = bind$1(getDimensionInfo, null, dimensions, dimsByName);
  extSource.cloneAllDimensionInfo = bind$1(cloneAllDimensionInfo, null, dimensions);
  return extSource;
}
function getRawData(upstream) {
  var sourceFormat = upstream.sourceFormat;
  if (!isSupportedSourceFormat(sourceFormat)) {
    var errMsg = "";
    throwError(errMsg);
  }
  return upstream.data;
}
function cloneRawData(upstream) {
  var sourceFormat = upstream.sourceFormat;
  var data = upstream.data;
  if (!isSupportedSourceFormat(sourceFormat)) {
    var errMsg = "";
    throwError(errMsg);
  }
  if (sourceFormat === SOURCE_FORMAT_ARRAY_ROWS) {
    var result = [];
    for (var i = 0, len2 = data.length; i < len2; i++) {
      result.push(data[i].slice());
    }
    return result;
  } else if (sourceFormat === SOURCE_FORMAT_OBJECT_ROWS) {
    var result = [];
    for (var i = 0, len2 = data.length; i < len2; i++) {
      result.push(extend({}, data[i]));
    }
    return result;
  }
}
function getDimensionInfo(dimensions, dimsByName, dim) {
  if (dim == null) {
    return;
  }
  if (isNumber(dim) || !isNaN(dim) && !hasOwn(dimsByName, dim)) {
    return dimensions[dim];
  } else if (hasOwn(dimsByName, dim)) {
    return dimsByName[dim];
  }
}
function cloneAllDimensionInfo(dimensions) {
  return clone$1(dimensions);
}
var externalTransformMap = createHashMap();
function registerExternalTransform(externalTransform) {
  externalTransform = clone$1(externalTransform);
  var type = externalTransform.type;
  var errMsg = "";
  if (!type) {
    throwError(errMsg);
  }
  var typeParsed = type.split(":");
  if (typeParsed.length !== 2) {
    throwError(errMsg);
  }
  var isBuiltIn = false;
  if (typeParsed[0] === "echarts") {
    type = typeParsed[1];
    isBuiltIn = true;
  }
  externalTransform.__isBuiltIn = isBuiltIn;
  externalTransformMap.set(type, externalTransform);
}
function applyDataTransform(rawTransOption, sourceList, infoForPrint) {
  var pipedTransOption = normalizeToArray(rawTransOption);
  var pipeLen = pipedTransOption.length;
  var errMsg = "";
  if (!pipeLen) {
    throwError(errMsg);
  }
  for (var i = 0, len2 = pipeLen; i < len2; i++) {
    var transOption = pipedTransOption[i];
    sourceList = applySingleDataTransform(transOption, sourceList);
    if (i !== len2 - 1) {
      sourceList.length = Math.max(sourceList.length, 1);
    }
  }
  return sourceList;
}
function applySingleDataTransform(transOption, upSourceList, infoForPrint, pipeIndex) {
  var errMsg = "";
  if (!upSourceList.length) {
    throwError(errMsg);
  }
  if (!isObject$2(transOption)) {
    throwError(errMsg);
  }
  var transType = transOption.type;
  var externalTransform = externalTransformMap.get(transType);
  if (!externalTransform) {
    throwError(errMsg);
  }
  var extUpSourceList = map$1(upSourceList, function(upSource) {
    return createExternalSource(upSource, externalTransform);
  });
  var resultList = normalizeToArray(externalTransform.transform({
    upstream: extUpSourceList[0],
    upstreamList: extUpSourceList,
    config: clone$1(transOption.config)
  }));
  return map$1(resultList, function(result, resultIndex) {
    var errMsg2 = "";
    if (!isObject$2(result)) {
      throwError(errMsg2);
    }
    if (!result.data) {
      throwError(errMsg2);
    }
    var sourceFormat = detectSourceFormat(result.data);
    if (!isSupportedSourceFormat(sourceFormat)) {
      throwError(errMsg2);
    }
    var resultMetaRawOption;
    var firstUpSource = upSourceList[0];
    if (firstUpSource && resultIndex === 0 && !result.dimensions) {
      var startIndex = firstUpSource.startIndex;
      if (startIndex) {
        result.data = firstUpSource.data.slice(0, startIndex).concat(result.data);
      }
      resultMetaRawOption = {
        seriesLayoutBy: SERIES_LAYOUT_BY_COLUMN,
        sourceHeader: startIndex,
        dimensions: firstUpSource.metaRawOption.dimensions
      };
    } else {
      resultMetaRawOption = {
        seriesLayoutBy: SERIES_LAYOUT_BY_COLUMN,
        sourceHeader: 0,
        dimensions: result.dimensions
      };
    }
    return createSource(result.data, resultMetaRawOption, null);
  });
}
function isSupportedSourceFormat(sourceFormat) {
  return sourceFormat === SOURCE_FORMAT_ARRAY_ROWS || sourceFormat === SOURCE_FORMAT_OBJECT_ROWS;
}
var UNDEFINED = "undefined";
var CtorUint32Array = typeof Uint32Array === UNDEFINED ? Array : Uint32Array;
var CtorUint16Array = typeof Uint16Array === UNDEFINED ? Array : Uint16Array;
var CtorInt32Array$1 = typeof Int32Array === UNDEFINED ? Array : Int32Array;
var CtorFloat64Array = typeof Float64Array === UNDEFINED ? Array : Float64Array;
var dataCtors = {
  "float": CtorFloat64Array,
  "int": CtorInt32Array$1,
  // Ordinal data type can be string or int
  "ordinal": Array,
  "number": Array,
  "time": CtorFloat64Array
};
var defaultDimValueGetters;
function getIndicesCtor(rawCount) {
  return rawCount > 65535 ? CtorUint32Array : CtorUint16Array;
}
function getInitialExtent() {
  return [Infinity, -Infinity];
}
function cloneChunk(originalChunk) {
  var Ctor = originalChunk.constructor;
  return Ctor === Array ? originalChunk.slice() : new Ctor(originalChunk);
}
function prepareStore(store, dimIdx, dimType, end, append) {
  var DataCtor = dataCtors[dimType || "float"];
  if (append) {
    var oldStore = store[dimIdx];
    var oldLen = oldStore && oldStore.length;
    if (!(oldLen === end)) {
      var newStore = new DataCtor(end);
      for (var j = 0; j < oldLen; j++) {
        newStore[j] = oldStore[j];
      }
      store[dimIdx] = newStore;
    }
  } else {
    store[dimIdx] = new DataCtor(end);
  }
}
var DataStore = (
  /** @class */
  function() {
    function DataStore2() {
      this._chunks = [];
      this._rawExtent = [];
      this._extent = [];
      this._count = 0;
      this._rawCount = 0;
      this._calcDimNameToIdx = createHashMap();
    }
    DataStore2.prototype.initData = function(provider, inputDimensions, dimValueGetter) {
      this._provider = provider;
      this._chunks = [];
      this._indices = null;
      this.getRawIndex = this._getRawIdxIdentity;
      var source = provider.getSource();
      var defaultGetter = this.defaultDimValueGetter = defaultDimValueGetters[source.sourceFormat];
      this._dimValueGetter = dimValueGetter || defaultGetter;
      this._rawExtent = [];
      shouldRetrieveDataByName(source);
      this._dimensions = map$1(inputDimensions, function(dim) {
        return {
          // Only pick these two props. Not leak other properties like orderMeta.
          type: dim.type,
          property: dim.property
        };
      });
      this._initDataFromProvider(0, provider.count());
    };
    DataStore2.prototype.getProvider = function() {
      return this._provider;
    };
    DataStore2.prototype.getSource = function() {
      return this._provider.getSource();
    };
    DataStore2.prototype.ensureCalculationDimension = function(dimName, type) {
      var calcDimNameToIdx = this._calcDimNameToIdx;
      var dimensions = this._dimensions;
      var calcDimIdx = calcDimNameToIdx.get(dimName);
      if (calcDimIdx != null) {
        if (dimensions[calcDimIdx].type === type) {
          return calcDimIdx;
        }
      } else {
        calcDimIdx = dimensions.length;
      }
      dimensions[calcDimIdx] = {
        type
      };
      calcDimNameToIdx.set(dimName, calcDimIdx);
      this._chunks[calcDimIdx] = new dataCtors[type || "float"](this._rawCount);
      this._rawExtent[calcDimIdx] = getInitialExtent();
      return calcDimIdx;
    };
    DataStore2.prototype.collectOrdinalMeta = function(dimIdx, ordinalMeta) {
      var chunk = this._chunks[dimIdx];
      var dim = this._dimensions[dimIdx];
      var rawExtents = this._rawExtent;
      var offset = dim.ordinalOffset || 0;
      var len2 = chunk.length;
      if (offset === 0) {
        rawExtents[dimIdx] = getInitialExtent();
      }
      var dimRawExtent = rawExtents[dimIdx];
      for (var i = offset; i < len2; i++) {
        var val = chunk[i] = ordinalMeta.parseAndCollect(chunk[i]);
        if (!isNaN(val)) {
          dimRawExtent[0] = Math.min(val, dimRawExtent[0]);
          dimRawExtent[1] = Math.max(val, dimRawExtent[1]);
        }
      }
      dim.ordinalMeta = ordinalMeta;
      dim.ordinalOffset = len2;
      dim.type = "ordinal";
    };
    DataStore2.prototype.getOrdinalMeta = function(dimIdx) {
      var dimInfo = this._dimensions[dimIdx];
      var ordinalMeta = dimInfo.ordinalMeta;
      return ordinalMeta;
    };
    DataStore2.prototype.getDimensionProperty = function(dimIndex) {
      var item = this._dimensions[dimIndex];
      return item && item.property;
    };
    DataStore2.prototype.appendData = function(data) {
      var provider = this._provider;
      var start = this.count();
      provider.appendData(data);
      var end = provider.count();
      if (!provider.persistent) {
        end += start;
      }
      if (start < end) {
        this._initDataFromProvider(start, end, true);
      }
      return [start, end];
    };
    DataStore2.prototype.appendValues = function(values, minFillLen) {
      var chunks = this._chunks;
      var dimensions = this._dimensions;
      var dimLen = dimensions.length;
      var rawExtent = this._rawExtent;
      var start = this.count();
      var end = start + Math.max(values.length, minFillLen || 0);
      for (var i = 0; i < dimLen; i++) {
        var dim = dimensions[i];
        prepareStore(chunks, i, dim.type, end, true);
      }
      var emptyDataItem = [];
      for (var idx = start; idx < end; idx++) {
        var sourceIdx = idx - start;
        for (var dimIdx = 0; dimIdx < dimLen; dimIdx++) {
          var dim = dimensions[dimIdx];
          var val = defaultDimValueGetters.arrayRows.call(this, values[sourceIdx] || emptyDataItem, dim.property, sourceIdx, dimIdx);
          chunks[dimIdx][idx] = val;
          var dimRawExtent = rawExtent[dimIdx];
          val < dimRawExtent[0] && (dimRawExtent[0] = val);
          val > dimRawExtent[1] && (dimRawExtent[1] = val);
        }
      }
      this._rawCount = this._count = end;
      return {
        start,
        end
      };
    };
    DataStore2.prototype._initDataFromProvider = function(start, end, append) {
      var provider = this._provider;
      var chunks = this._chunks;
      var dimensions = this._dimensions;
      var dimLen = dimensions.length;
      var rawExtent = this._rawExtent;
      var dimNames = map$1(dimensions, function(dim2) {
        return dim2.property;
      });
      for (var i = 0; i < dimLen; i++) {
        var dim = dimensions[i];
        if (!rawExtent[i]) {
          rawExtent[i] = getInitialExtent();
        }
        prepareStore(chunks, i, dim.type, end, append);
      }
      if (provider.fillStorage) {
        provider.fillStorage(start, end, chunks, rawExtent);
      } else {
        var dataItem = [];
        for (var idx = start; idx < end; idx++) {
          dataItem = provider.getItem(idx, dataItem);
          for (var dimIdx = 0; dimIdx < dimLen; dimIdx++) {
            var dimStorage = chunks[dimIdx];
            var val = this._dimValueGetter(dataItem, dimNames[dimIdx], idx, dimIdx);
            dimStorage[idx] = val;
            var dimRawExtent = rawExtent[dimIdx];
            val < dimRawExtent[0] && (dimRawExtent[0] = val);
            val > dimRawExtent[1] && (dimRawExtent[1] = val);
          }
        }
      }
      if (!provider.persistent && provider.clean) {
        provider.clean();
      }
      this._rawCount = this._count = end;
      this._extent = [];
    };
    DataStore2.prototype.count = function() {
      return this._count;
    };
    DataStore2.prototype.get = function(dim, idx) {
      if (!(idx >= 0 && idx < this._count)) {
        return NaN;
      }
      var dimStore = this._chunks[dim];
      return dimStore ? dimStore[this.getRawIndex(idx)] : NaN;
    };
    DataStore2.prototype.getValues = function(dimensions, idx) {
      var values = [];
      var dimArr = [];
      if (idx == null) {
        idx = dimensions;
        dimensions = [];
        for (var i = 0; i < this._dimensions.length; i++) {
          dimArr.push(i);
        }
      } else {
        dimArr = dimensions;
      }
      for (var i = 0, len2 = dimArr.length; i < len2; i++) {
        values.push(this.get(dimArr[i], idx));
      }
      return values;
    };
    DataStore2.prototype.getByRawIndex = function(dim, rawIdx) {
      if (!(rawIdx >= 0 && rawIdx < this._rawCount)) {
        return NaN;
      }
      var dimStore = this._chunks[dim];
      return dimStore ? dimStore[rawIdx] : NaN;
    };
    DataStore2.prototype.getSum = function(dim) {
      var dimData = this._chunks[dim];
      var sum = 0;
      if (dimData) {
        for (var i = 0, len2 = this.count(); i < len2; i++) {
          var value = this.get(dim, i);
          if (!isNaN(value)) {
            sum += value;
          }
        }
      }
      return sum;
    };
    DataStore2.prototype.getMedian = function(dim) {
      var dimDataArray = [];
      this.each([dim], function(val) {
        if (!isNaN(val)) {
          dimDataArray.push(val);
        }
      });
      var sortedDimDataArray = dimDataArray.sort(function(a, b) {
        return a - b;
      });
      var len2 = this.count();
      return len2 === 0 ? 0 : len2 % 2 === 1 ? sortedDimDataArray[(len2 - 1) / 2] : (sortedDimDataArray[len2 / 2] + sortedDimDataArray[len2 / 2 - 1]) / 2;
    };
    DataStore2.prototype.indexOfRawIndex = function(rawIndex) {
      if (rawIndex >= this._rawCount || rawIndex < 0) {
        return -1;
      }
      if (!this._indices) {
        return rawIndex;
      }
      var indices = this._indices;
      var rawDataIndex = indices[rawIndex];
      if (rawDataIndex != null && rawDataIndex < this._count && rawDataIndex === rawIndex) {
        return rawIndex;
      }
      var left = 0;
      var right = this._count - 1;
      while (left <= right) {
        var mid = (left + right) / 2 | 0;
        if (indices[mid] < rawIndex) {
          left = mid + 1;
        } else if (indices[mid] > rawIndex) {
          right = mid - 1;
        } else {
          return mid;
        }
      }
      return -1;
    };
    DataStore2.prototype.getIndices = function() {
      var newIndices;
      var indices = this._indices;
      if (indices) {
        var Ctor = indices.constructor;
        var thisCount = this._count;
        if (Ctor === Array) {
          newIndices = new Ctor(thisCount);
          for (var i = 0; i < thisCount; i++) {
            newIndices[i] = indices[i];
          }
        } else {
          newIndices = new Ctor(indices.buffer, 0, thisCount);
        }
      } else {
        var Ctor = getIndicesCtor(this._rawCount);
        newIndices = new Ctor(this.count());
        for (var i = 0; i < newIndices.length; i++) {
          newIndices[i] = i;
        }
      }
      return newIndices;
    };
    DataStore2.prototype.filter = function(dims, cb) {
      if (!this._count) {
        return this;
      }
      var newStore = this.clone();
      var count = newStore.count();
      var Ctor = getIndicesCtor(newStore._rawCount);
      var newIndices = new Ctor(count);
      var value = [];
      var dimSize = dims.length;
      var offset = 0;
      var dim0 = dims[0];
      var chunks = newStore._chunks;
      for (var i = 0; i < count; i++) {
        var keep = void 0;
        var rawIdx = newStore.getRawIndex(i);
        if (dimSize === 0) {
          keep = cb(i);
        } else if (dimSize === 1) {
          var val = chunks[dim0][rawIdx];
          keep = cb(val, i);
        } else {
          var k = 0;
          for (; k < dimSize; k++) {
            value[k] = chunks[dims[k]][rawIdx];
          }
          value[k] = i;
          keep = cb.apply(null, value);
        }
        if (keep) {
          newIndices[offset++] = rawIdx;
        }
      }
      if (offset < count) {
        newStore._indices = newIndices;
      }
      newStore._count = offset;
      newStore._extent = [];
      newStore._updateGetRawIdx();
      return newStore;
    };
    DataStore2.prototype.selectRange = function(range) {
      var newStore = this.clone();
      var len2 = newStore._count;
      if (!len2) {
        return this;
      }
      var dims = keys(range);
      var dimSize = dims.length;
      if (!dimSize) {
        return this;
      }
      var originalCount = newStore.count();
      var Ctor = getIndicesCtor(newStore._rawCount);
      var newIndices = new Ctor(originalCount);
      var offset = 0;
      var dim0 = dims[0];
      var min = range[dim0][0];
      var max = range[dim0][1];
      var storeArr = newStore._chunks;
      var quickFinished = false;
      if (!newStore._indices) {
        var idx = 0;
        if (dimSize === 1) {
          var dimStorage = storeArr[dims[0]];
          for (var i = 0; i < len2; i++) {
            var val = dimStorage[i];
            if (val >= min && val <= max || isNaN(val)) {
              newIndices[offset++] = idx;
            }
            idx++;
          }
          quickFinished = true;
        } else if (dimSize === 2) {
          var dimStorage = storeArr[dims[0]];
          var dimStorage2 = storeArr[dims[1]];
          var min2 = range[dims[1]][0];
          var max2 = range[dims[1]][1];
          for (var i = 0; i < len2; i++) {
            var val = dimStorage[i];
            var val2 = dimStorage2[i];
            if ((val >= min && val <= max || isNaN(val)) && (val2 >= min2 && val2 <= max2 || isNaN(val2))) {
              newIndices[offset++] = idx;
            }
            idx++;
          }
          quickFinished = true;
        }
      }
      if (!quickFinished) {
        if (dimSize === 1) {
          for (var i = 0; i < originalCount; i++) {
            var rawIndex = newStore.getRawIndex(i);
            var val = storeArr[dims[0]][rawIndex];
            if (val >= min && val <= max || isNaN(val)) {
              newIndices[offset++] = rawIndex;
            }
          }
        } else {
          for (var i = 0; i < originalCount; i++) {
            var keep = true;
            var rawIndex = newStore.getRawIndex(i);
            for (var k = 0; k < dimSize; k++) {
              var dimk = dims[k];
              var val = storeArr[dimk][rawIndex];
              if (val < range[dimk][0] || val > range[dimk][1]) {
                keep = false;
              }
            }
            if (keep) {
              newIndices[offset++] = newStore.getRawIndex(i);
            }
          }
        }
      }
      if (offset < originalCount) {
        newStore._indices = newIndices;
      }
      newStore._count = offset;
      newStore._extent = [];
      newStore._updateGetRawIdx();
      return newStore;
    };
    DataStore2.prototype.map = function(dims, cb) {
      var target = this.clone(dims);
      this._updateDims(target, dims, cb);
      return target;
    };
    DataStore2.prototype.modify = function(dims, cb) {
      this._updateDims(this, dims, cb);
    };
    DataStore2.prototype._updateDims = function(target, dims, cb) {
      var targetChunks = target._chunks;
      var tmpRetValue = [];
      var dimSize = dims.length;
      var dataCount = target.count();
      var values = [];
      var rawExtent = target._rawExtent;
      for (var i = 0; i < dims.length; i++) {
        rawExtent[dims[i]] = getInitialExtent();
      }
      for (var dataIndex = 0; dataIndex < dataCount; dataIndex++) {
        var rawIndex = target.getRawIndex(dataIndex);
        for (var k = 0; k < dimSize; k++) {
          values[k] = targetChunks[dims[k]][rawIndex];
        }
        values[dimSize] = dataIndex;
        var retValue = cb && cb.apply(null, values);
        if (retValue != null) {
          if (typeof retValue !== "object") {
            tmpRetValue[0] = retValue;
            retValue = tmpRetValue;
          }
          for (var i = 0; i < retValue.length; i++) {
            var dim = dims[i];
            var val = retValue[i];
            var rawExtentOnDim = rawExtent[dim];
            var dimStore = targetChunks[dim];
            if (dimStore) {
              dimStore[rawIndex] = val;
            }
            if (val < rawExtentOnDim[0]) {
              rawExtentOnDim[0] = val;
            }
            if (val > rawExtentOnDim[1]) {
              rawExtentOnDim[1] = val;
            }
          }
        }
      }
    };
    DataStore2.prototype.lttbDownSample = function(valueDimension, rate) {
      var target = this.clone([valueDimension], true);
      var targetStorage = target._chunks;
      var dimStore = targetStorage[valueDimension];
      var len2 = this.count();
      var sampledIndex = 0;
      var frameSize = Math.floor(1 / rate);
      var currentRawIndex = this.getRawIndex(0);
      var maxArea;
      var area;
      var nextRawIndex;
      var newIndices = new (getIndicesCtor(this._rawCount))(Math.min((Math.ceil(len2 / frameSize) + 2) * 2, len2));
      newIndices[sampledIndex++] = currentRawIndex;
      for (var i = 1; i < len2 - 1; i += frameSize) {
        var nextFrameStart = Math.min(i + frameSize, len2 - 1);
        var nextFrameEnd = Math.min(i + frameSize * 2, len2);
        var avgX = (nextFrameEnd + nextFrameStart) / 2;
        var avgY = 0;
        for (var idx = nextFrameStart; idx < nextFrameEnd; idx++) {
          var rawIndex = this.getRawIndex(idx);
          var y = dimStore[rawIndex];
          if (isNaN(y)) {
            continue;
          }
          avgY += y;
        }
        avgY /= nextFrameEnd - nextFrameStart;
        var frameStart = i;
        var frameEnd = Math.min(i + frameSize, len2);
        var pointAX = i - 1;
        var pointAY = dimStore[currentRawIndex];
        maxArea = -1;
        nextRawIndex = frameStart;
        var firstNaNIndex = -1;
        var countNaN = 0;
        for (var idx = frameStart; idx < frameEnd; idx++) {
          var rawIndex = this.getRawIndex(idx);
          var y = dimStore[rawIndex];
          if (isNaN(y)) {
            countNaN++;
            if (firstNaNIndex < 0) {
              firstNaNIndex = rawIndex;
            }
            continue;
          }
          area = Math.abs((pointAX - avgX) * (y - pointAY) - (pointAX - idx) * (avgY - pointAY));
          if (area > maxArea) {
            maxArea = area;
            nextRawIndex = rawIndex;
          }
        }
        if (countNaN > 0 && countNaN < frameEnd - frameStart) {
          newIndices[sampledIndex++] = Math.min(firstNaNIndex, nextRawIndex);
          nextRawIndex = Math.max(firstNaNIndex, nextRawIndex);
        }
        newIndices[sampledIndex++] = nextRawIndex;
        currentRawIndex = nextRawIndex;
      }
      newIndices[sampledIndex++] = this.getRawIndex(len2 - 1);
      target._count = sampledIndex;
      target._indices = newIndices;
      target.getRawIndex = this._getRawIdx;
      return target;
    };
    DataStore2.prototype.minmaxDownSample = function(valueDimension, rate) {
      var target = this.clone([valueDimension], true);
      var targetStorage = target._chunks;
      var frameSize = Math.floor(1 / rate);
      var dimStore = targetStorage[valueDimension];
      var len2 = this.count();
      var newIndices = new (getIndicesCtor(this._rawCount))(Math.ceil(len2 / frameSize) * 2);
      var offset = 0;
      for (var i = 0; i < len2; i += frameSize) {
        var minIndex = i;
        var minValue = dimStore[this.getRawIndex(minIndex)];
        var maxIndex = i;
        var maxValue = dimStore[this.getRawIndex(maxIndex)];
        var thisFrameSize = frameSize;
        if (i + frameSize > len2) {
          thisFrameSize = len2 - i;
        }
        for (var k = 0; k < thisFrameSize; k++) {
          var rawIndex = this.getRawIndex(i + k);
          var value = dimStore[rawIndex];
          if (value < minValue) {
            minValue = value;
            minIndex = i + k;
          }
          if (value > maxValue) {
            maxValue = value;
            maxIndex = i + k;
          }
        }
        var rawMinIndex = this.getRawIndex(minIndex);
        var rawMaxIndex = this.getRawIndex(maxIndex);
        if (minIndex < maxIndex) {
          newIndices[offset++] = rawMinIndex;
          newIndices[offset++] = rawMaxIndex;
        } else {
          newIndices[offset++] = rawMaxIndex;
          newIndices[offset++] = rawMinIndex;
        }
      }
      target._count = offset;
      target._indices = newIndices;
      target._updateGetRawIdx();
      return target;
    };
    DataStore2.prototype.downSample = function(dimension, rate, sampleValue, sampleIndex) {
      var target = this.clone([dimension], true);
      var targetStorage = target._chunks;
      var frameValues = [];
      var frameSize = Math.floor(1 / rate);
      var dimStore = targetStorage[dimension];
      var len2 = this.count();
      var rawExtentOnDim = target._rawExtent[dimension] = getInitialExtent();
      var newIndices = new (getIndicesCtor(this._rawCount))(Math.ceil(len2 / frameSize));
      var offset = 0;
      for (var i = 0; i < len2; i += frameSize) {
        if (frameSize > len2 - i) {
          frameSize = len2 - i;
          frameValues.length = frameSize;
        }
        for (var k = 0; k < frameSize; k++) {
          var dataIdx = this.getRawIndex(i + k);
          frameValues[k] = dimStore[dataIdx];
        }
        var value = sampleValue(frameValues);
        var sampleFrameIdx = this.getRawIndex(Math.min(i + sampleIndex(frameValues, value) || 0, len2 - 1));
        dimStore[sampleFrameIdx] = value;
        if (value < rawExtentOnDim[0]) {
          rawExtentOnDim[0] = value;
        }
        if (value > rawExtentOnDim[1]) {
          rawExtentOnDim[1] = value;
        }
        newIndices[offset++] = sampleFrameIdx;
      }
      target._count = offset;
      target._indices = newIndices;
      target._updateGetRawIdx();
      return target;
    };
    DataStore2.prototype.each = function(dims, cb) {
      if (!this._count) {
        return;
      }
      var dimSize = dims.length;
      var chunks = this._chunks;
      for (var i = 0, len2 = this.count(); i < len2; i++) {
        var rawIdx = this.getRawIndex(i);
        switch (dimSize) {
          case 0:
            cb(i);
            break;
          case 1:
            cb(chunks[dims[0]][rawIdx], i);
            break;
          case 2:
            cb(chunks[dims[0]][rawIdx], chunks[dims[1]][rawIdx], i);
            break;
          default:
            var k = 0;
            var value = [];
            for (; k < dimSize; k++) {
              value[k] = chunks[dims[k]][rawIdx];
            }
            value[k] = i;
            cb.apply(null, value);
        }
      }
    };
    DataStore2.prototype.getDataExtent = function(dim) {
      var dimData = this._chunks[dim];
      var initialExtent = getInitialExtent();
      if (!dimData) {
        return initialExtent;
      }
      var currEnd = this.count();
      var useRaw = !this._indices;
      var dimExtent;
      if (useRaw) {
        return this._rawExtent[dim].slice();
      }
      dimExtent = this._extent[dim];
      if (dimExtent) {
        return dimExtent.slice();
      }
      dimExtent = initialExtent;
      var min = dimExtent[0];
      var max = dimExtent[1];
      for (var i = 0; i < currEnd; i++) {
        var rawIdx = this.getRawIndex(i);
        var value = dimData[rawIdx];
        value < min && (min = value);
        value > max && (max = value);
      }
      dimExtent = [min, max];
      this._extent[dim] = dimExtent;
      return dimExtent;
    };
    DataStore2.prototype.getRawDataItem = function(idx) {
      var rawIdx = this.getRawIndex(idx);
      if (!this._provider.persistent) {
        var val = [];
        var chunks = this._chunks;
        for (var i = 0; i < chunks.length; i++) {
          val.push(chunks[i][rawIdx]);
        }
        return val;
      } else {
        return this._provider.getItem(rawIdx);
      }
    };
    DataStore2.prototype.clone = function(clonedDims, ignoreIndices) {
      var target = new DataStore2();
      var chunks = this._chunks;
      var clonedDimsMap = clonedDims && reduce(clonedDims, function(obj, dimIdx) {
        obj[dimIdx] = true;
        return obj;
      }, {});
      if (clonedDimsMap) {
        for (var i = 0; i < chunks.length; i++) {
          target._chunks[i] = !clonedDimsMap[i] ? chunks[i] : cloneChunk(chunks[i]);
        }
      } else {
        target._chunks = chunks;
      }
      this._copyCommonProps(target);
      if (!ignoreIndices) {
        target._indices = this._cloneIndices();
      }
      target._updateGetRawIdx();
      return target;
    };
    DataStore2.prototype._copyCommonProps = function(target) {
      target._count = this._count;
      target._rawCount = this._rawCount;
      target._provider = this._provider;
      target._dimensions = this._dimensions;
      target._extent = clone$1(this._extent);
      target._rawExtent = clone$1(this._rawExtent);
    };
    DataStore2.prototype._cloneIndices = function() {
      if (this._indices) {
        var Ctor = this._indices.constructor;
        var indices = void 0;
        if (Ctor === Array) {
          var thisCount = this._indices.length;
          indices = new Ctor(thisCount);
          for (var i = 0; i < thisCount; i++) {
            indices[i] = this._indices[i];
          }
        } else {
          indices = new Ctor(this._indices);
        }
        return indices;
      }
      return null;
    };
    DataStore2.prototype._getRawIdxIdentity = function(idx) {
      return idx;
    };
    DataStore2.prototype._getRawIdx = function(idx) {
      if (idx < this._count && idx >= 0) {
        return this._indices[idx];
      }
      return -1;
    };
    DataStore2.prototype._updateGetRawIdx = function() {
      this.getRawIndex = this._indices ? this._getRawIdx : this._getRawIdxIdentity;
    };
    DataStore2.internalField = function() {
      function getDimValueSimply(dataItem, property, dataIndex, dimIndex) {
        return parseDataValue(dataItem[dimIndex], this._dimensions[dimIndex]);
      }
      defaultDimValueGetters = {
        arrayRows: getDimValueSimply,
        objectRows: function(dataItem, property, dataIndex, dimIndex) {
          return parseDataValue(dataItem[property], this._dimensions[dimIndex]);
        },
        keyedColumns: getDimValueSimply,
        original: function(dataItem, property, dataIndex, dimIndex) {
          var value = dataItem && (dataItem.value == null ? dataItem : dataItem.value);
          return parseDataValue(value instanceof Array ? value[dimIndex] : value, this._dimensions[dimIndex]);
        },
        typedArray: function(dataItem, property, dataIndex, dimIndex) {
          return dataItem[dimIndex];
        }
      };
    }();
    return DataStore2;
  }()
);
var SourceManager = (
  /** @class */
  function() {
    function SourceManager2(sourceHost) {
      this._sourceList = [];
      this._storeList = [];
      this._upstreamSignList = [];
      this._versionSignBase = 0;
      this._dirty = true;
      this._sourceHost = sourceHost;
    }
    SourceManager2.prototype.dirty = function() {
      this._setLocalSource([], []);
      this._storeList = [];
      this._dirty = true;
    };
    SourceManager2.prototype._setLocalSource = function(sourceList, upstreamSignList) {
      this._sourceList = sourceList;
      this._upstreamSignList = upstreamSignList;
      this._versionSignBase++;
      if (this._versionSignBase > 9e10) {
        this._versionSignBase = 0;
      }
    };
    SourceManager2.prototype._getVersionSign = function() {
      return this._sourceHost.uid + "_" + this._versionSignBase;
    };
    SourceManager2.prototype.prepareSource = function() {
      if (this._isDirty()) {
        this._createSource();
        this._dirty = false;
      }
    };
    SourceManager2.prototype._createSource = function() {
      this._setLocalSource([], []);
      var sourceHost = this._sourceHost;
      var upSourceMgrList = this._getUpstreamSourceManagers();
      var hasUpstream = !!upSourceMgrList.length;
      var resultSourceList;
      var upstreamSignList;
      if (isSeries(sourceHost)) {
        var seriesModel = sourceHost;
        var data = void 0;
        var sourceFormat = void 0;
        var upSource = void 0;
        if (hasUpstream) {
          var upSourceMgr = upSourceMgrList[0];
          upSourceMgr.prepareSource();
          upSource = upSourceMgr.getSource();
          data = upSource.data;
          sourceFormat = upSource.sourceFormat;
          upstreamSignList = [upSourceMgr._getVersionSign()];
        } else {
          data = seriesModel.get("data", true);
          sourceFormat = isTypedArray(data) ? SOURCE_FORMAT_TYPED_ARRAY : SOURCE_FORMAT_ORIGINAL;
          upstreamSignList = [];
        }
        var newMetaRawOption = this._getSourceMetaRawOption() || {};
        var upMetaRawOption = upSource && upSource.metaRawOption || {};
        var seriesLayoutBy = retrieve2(newMetaRawOption.seriesLayoutBy, upMetaRawOption.seriesLayoutBy) || null;
        var sourceHeader = retrieve2(newMetaRawOption.sourceHeader, upMetaRawOption.sourceHeader);
        var dimensions = retrieve2(newMetaRawOption.dimensions, upMetaRawOption.dimensions);
        var needsCreateSource = seriesLayoutBy !== upMetaRawOption.seriesLayoutBy || !!sourceHeader !== !!upMetaRawOption.sourceHeader || dimensions;
        resultSourceList = needsCreateSource ? [createSource(data, {
          seriesLayoutBy,
          sourceHeader,
          dimensions
        }, sourceFormat)] : [];
      } else {
        var datasetModel = sourceHost;
        if (hasUpstream) {
          var result = this._applyTransform(upSourceMgrList);
          resultSourceList = result.sourceList;
          upstreamSignList = result.upstreamSignList;
        } else {
          var sourceData = datasetModel.get("source", true);
          resultSourceList = [createSource(sourceData, this._getSourceMetaRawOption(), null)];
          upstreamSignList = [];
        }
      }
      this._setLocalSource(resultSourceList, upstreamSignList);
    };
    SourceManager2.prototype._applyTransform = function(upMgrList) {
      var datasetModel = this._sourceHost;
      var transformOption = datasetModel.get("transform", true);
      var fromTransformResult = datasetModel.get("fromTransformResult", true);
      if (fromTransformResult != null) {
        var errMsg = "";
        if (upMgrList.length !== 1) {
          doThrow(errMsg);
        }
      }
      var sourceList;
      var upSourceList = [];
      var upstreamSignList = [];
      each$4(upMgrList, function(upMgr) {
        upMgr.prepareSource();
        var upSource = upMgr.getSource(fromTransformResult || 0);
        var errMsg2 = "";
        if (fromTransformResult != null && !upSource) {
          doThrow(errMsg2);
        }
        upSourceList.push(upSource);
        upstreamSignList.push(upMgr._getVersionSign());
      });
      if (transformOption) {
        sourceList = applyDataTransform(transformOption, upSourceList, {
          datasetIndex: datasetModel.componentIndex
        });
      } else if (fromTransformResult != null) {
        sourceList = [cloneSourceShallow(upSourceList[0])];
      }
      return {
        sourceList,
        upstreamSignList
      };
    };
    SourceManager2.prototype._isDirty = function() {
      if (this._dirty) {
        return true;
      }
      var upSourceMgrList = this._getUpstreamSourceManagers();
      for (var i = 0; i < upSourceMgrList.length; i++) {
        var upSrcMgr = upSourceMgrList[i];
        if (
          // Consider the case that there is ancestor diry, call it recursively.
          // The performance is probably not an issue because usually the chain is not long.
          upSrcMgr._isDirty() || this._upstreamSignList[i] !== upSrcMgr._getVersionSign()
        ) {
          return true;
        }
      }
    };
    SourceManager2.prototype.getSource = function(sourceIndex) {
      sourceIndex = sourceIndex || 0;
      var source = this._sourceList[sourceIndex];
      if (!source) {
        var upSourceMgrList = this._getUpstreamSourceManagers();
        return upSourceMgrList[0] && upSourceMgrList[0].getSource(sourceIndex);
      }
      return source;
    };
    SourceManager2.prototype.getSharedDataStore = function(seriesDimRequest) {
      var schema = seriesDimRequest.makeStoreSchema();
      return this._innerGetDataStore(schema.dimensions, seriesDimRequest.source, schema.hash);
    };
    SourceManager2.prototype._innerGetDataStore = function(storeDims, seriesSource, sourceReadKey) {
      var sourceIndex = 0;
      var storeList = this._storeList;
      var cachedStoreMap = storeList[sourceIndex];
      if (!cachedStoreMap) {
        cachedStoreMap = storeList[sourceIndex] = {};
      }
      var cachedStore = cachedStoreMap[sourceReadKey];
      if (!cachedStore) {
        var upSourceMgr = this._getUpstreamSourceManagers()[0];
        if (isSeries(this._sourceHost) && upSourceMgr) {
          cachedStore = upSourceMgr._innerGetDataStore(storeDims, seriesSource, sourceReadKey);
        } else {
          cachedStore = new DataStore();
          cachedStore.initData(new DefaultDataProvider(seriesSource, storeDims.length), storeDims);
        }
        cachedStoreMap[sourceReadKey] = cachedStore;
      }
      return cachedStore;
    };
    SourceManager2.prototype._getUpstreamSourceManagers = function() {
      var sourceHost = this._sourceHost;
      if (isSeries(sourceHost)) {
        var datasetModel = querySeriesUpstreamDatasetModel(sourceHost);
        return !datasetModel ? [] : [datasetModel.getSourceManager()];
      } else {
        return map$1(queryDatasetUpstreamDatasetModels(sourceHost), function(datasetModel2) {
          return datasetModel2.getSourceManager();
        });
      }
    };
    SourceManager2.prototype._getSourceMetaRawOption = function() {
      var sourceHost = this._sourceHost;
      var seriesLayoutBy;
      var sourceHeader;
      var dimensions;
      if (isSeries(sourceHost)) {
        seriesLayoutBy = sourceHost.get("seriesLayoutBy", true);
        sourceHeader = sourceHost.get("sourceHeader", true);
        dimensions = sourceHost.get("dimensions", true);
      } else if (!this._getUpstreamSourceManagers().length) {
        var model = sourceHost;
        seriesLayoutBy = model.get("seriesLayoutBy", true);
        sourceHeader = model.get("sourceHeader", true);
        dimensions = model.get("dimensions", true);
      }
      return {
        seriesLayoutBy,
        sourceHeader,
        dimensions
      };
    };
    return SourceManager2;
  }()
);
function isSeries(sourceHost) {
  return sourceHost.mainType === "series";
}
function doThrow(errMsg) {
  throw new Error(errMsg);
}
var TOOLTIP_LINE_HEIGHT_CSS = "line-height:1";
function getTooltipLineHeight(textStyle) {
  var lineHeight = textStyle.lineHeight;
  if (lineHeight == null) {
    return TOOLTIP_LINE_HEIGHT_CSS;
  } else {
    return "line-height:" + encodeHTML(lineHeight + "") + "px";
  }
}
function getTooltipTextStyle(textStyle, renderMode) {
  var nameFontColor = textStyle.color || tokens.color.tertiary;
  var nameFontSize = textStyle.fontSize || 12;
  var nameFontWeight = textStyle.fontWeight || "400";
  var valueFontColor = textStyle.color || tokens.color.secondary;
  var valueFontSize = textStyle.fontSize || 14;
  var valueFontWeight = textStyle.fontWeight || "900";
  if (renderMode === "html") {
    return {
      // eslint-disable-next-line max-len
      nameStyle: "font-size:" + encodeHTML(nameFontSize + "") + "px;color:" + encodeHTML(nameFontColor) + ";font-weight:" + encodeHTML(nameFontWeight + ""),
      // eslint-disable-next-line max-len
      valueStyle: "font-size:" + encodeHTML(valueFontSize + "") + "px;color:" + encodeHTML(valueFontColor) + ";font-weight:" + encodeHTML(valueFontWeight + "")
    };
  } else {
    return {
      nameStyle: {
        fontSize: nameFontSize,
        fill: nameFontColor,
        fontWeight: nameFontWeight
      },
      valueStyle: {
        fontSize: valueFontSize,
        fill: valueFontColor,
        fontWeight: valueFontWeight
      }
    };
  }
}
var HTML_GAPS = [0, 10, 20, 30];
var RICH_TEXT_GAPS = ["", "\n", "\n\n", "\n\n\n"];
function createTooltipMarkup(type, option) {
  option.type = type;
  return option;
}
function isSectionFragment(frag) {
  return frag.type === "section";
}
function getBuilder(frag) {
  return isSectionFragment(frag) ? buildSection : buildNameValue;
}
function getBlockGapLevel(frag) {
  if (isSectionFragment(frag)) {
    var gapLevel_1 = 0;
    var subBlockLen = frag.blocks.length;
    var hasInnerGap_1 = subBlockLen > 1 || subBlockLen > 0 && !frag.noHeader;
    each$4(frag.blocks, function(subBlock) {
      var subGapLevel = getBlockGapLevel(subBlock);
      if (subGapLevel >= gapLevel_1) {
        gapLevel_1 = subGapLevel + +(hasInnerGap_1 && // 0 always can not be readable gap level.
        (!subGapLevel || isSectionFragment(subBlock) && !subBlock.noHeader));
      }
    });
    return gapLevel_1;
  }
  return 0;
}
function buildSection(ctx, fragment, topMarginForOuterGap, toolTipTextStyle) {
  var noHeader = fragment.noHeader;
  var gaps = getGap(getBlockGapLevel(fragment));
  var subMarkupTextList = [];
  var subBlocks = fragment.blocks || [];
  assert(!subBlocks || isArray(subBlocks));
  subBlocks = subBlocks || [];
  var orderMode = ctx.orderMode;
  if (fragment.sortBlocks && orderMode) {
    subBlocks = subBlocks.slice();
    var orderMap = {
      valueAsc: "asc",
      valueDesc: "desc"
    };
    if (hasOwn(orderMap, orderMode)) {
      var comparator_1 = new SortOrderComparator(orderMap[orderMode], null);
      subBlocks.sort(function(a, b) {
        return comparator_1.evaluate(a.sortParam, b.sortParam);
      });
    } else if (orderMode === "seriesDesc") {
      subBlocks.reverse();
    }
  }
  each$4(subBlocks, function(subBlock, idx) {
    var valueFormatter = fragment.valueFormatter;
    var subMarkupText2 = getBuilder(subBlock)(
      // Inherit valueFormatter
      valueFormatter ? extend(extend({}, ctx), {
        valueFormatter
      }) : ctx,
      subBlock,
      idx > 0 ? gaps.html : 0,
      toolTipTextStyle
    );
    subMarkupText2 != null && subMarkupTextList.push(subMarkupText2);
  });
  var subMarkupText = ctx.renderMode === "richText" ? subMarkupTextList.join(gaps.richText) : wrapBlockHTML(toolTipTextStyle, subMarkupTextList.join(""), noHeader ? topMarginForOuterGap : gaps.html);
  if (noHeader) {
    return subMarkupText;
  }
  var displayableHeader = makeValueReadable(fragment.header, "ordinal", ctx.useUTC);
  var nameStyle = getTooltipTextStyle(toolTipTextStyle, ctx.renderMode).nameStyle;
  var tooltipLineHeight = getTooltipLineHeight(toolTipTextStyle);
  if (ctx.renderMode === "richText") {
    return wrapInlineNameRichText(ctx, displayableHeader, nameStyle) + gaps.richText + subMarkupText;
  } else {
    return wrapBlockHTML(toolTipTextStyle, '<div style="' + nameStyle + ";" + tooltipLineHeight + ';">' + encodeHTML(displayableHeader) + "</div>" + subMarkupText, topMarginForOuterGap);
  }
}
function buildNameValue(ctx, fragment, topMarginForOuterGap, toolTipTextStyle) {
  var renderMode = ctx.renderMode;
  var noName = fragment.noName;
  var noValue = fragment.noValue;
  var noMarker = !fragment.markerType;
  var name = fragment.name;
  var useUTC = ctx.useUTC;
  var valueFormatter = fragment.valueFormatter || ctx.valueFormatter || function(value) {
    value = isArray(value) ? value : [value];
    return map$1(value, function(val, idx) {
      return makeValueReadable(val, isArray(valueTypeOption) ? valueTypeOption[idx] : valueTypeOption, useUTC);
    });
  };
  if (noName && noValue) {
    return;
  }
  var markerStr = noMarker ? "" : ctx.markupStyleCreator.makeTooltipMarker(fragment.markerType, fragment.markerColor || tokens.color.secondary, renderMode);
  var readableName = noName ? "" : makeValueReadable(name, "ordinal", useUTC);
  var valueTypeOption = fragment.valueType;
  var readableValueList = noValue ? [] : valueFormatter(fragment.value, fragment.dataIndex);
  var valueAlignRight = !noMarker || !noName;
  var valueCloseToMarker = !noMarker && noName;
  var _a2 = getTooltipTextStyle(toolTipTextStyle, renderMode), nameStyle = _a2.nameStyle, valueStyle = _a2.valueStyle;
  return renderMode === "richText" ? (noMarker ? "" : markerStr) + (noName ? "" : wrapInlineNameRichText(ctx, readableName, nameStyle)) + (noValue ? "" : wrapInlineValueRichText(ctx, readableValueList, valueAlignRight, valueCloseToMarker, valueStyle)) : wrapBlockHTML(toolTipTextStyle, (noMarker ? "" : markerStr) + (noName ? "" : wrapInlineNameHTML(readableName, !noMarker, nameStyle)) + (noValue ? "" : wrapInlineValueHTML(readableValueList, valueAlignRight, valueCloseToMarker, valueStyle)), topMarginForOuterGap);
}
function buildTooltipMarkup(fragment, markupStyleCreator, renderMode, orderMode, useUTC, toolTipTextStyle) {
  if (!fragment) {
    return;
  }
  var builder = getBuilder(fragment);
  var ctx = {
    useUTC,
    renderMode,
    orderMode,
    markupStyleCreator,
    valueFormatter: fragment.valueFormatter
  };
  return builder(ctx, fragment, 0, toolTipTextStyle);
}
function getGap(gapLevel) {
  return {
    html: HTML_GAPS[gapLevel],
    richText: RICH_TEXT_GAPS[gapLevel]
  };
}
function wrapBlockHTML(textStyle, encodedContent, topGap) {
  var clearfix = '<div style="clear:both"></div>';
  var marginCSS = "margin: " + topGap + "px 0 0";
  var tooltipLineHeight = getTooltipLineHeight(textStyle);
  return '<div style="' + marginCSS + ";" + tooltipLineHeight + ';">' + encodedContent + clearfix + "</div>";
}
function wrapInlineNameHTML(name, leftHasMarker, style) {
  var marginCss = leftHasMarker ? "margin-left:2px" : "";
  return '<span style="' + style + ";" + marginCss + '">' + encodeHTML(name) + "</span>";
}
function wrapInlineValueHTML(valueList, alignRight, valueCloseToMarker, style) {
  var paddingStr = valueCloseToMarker ? "10px" : "20px";
  var alignCSS = alignRight ? "float:right;margin-left:" + paddingStr : "";
  valueList = isArray(valueList) ? valueList : [valueList];
  return '<span style="' + alignCSS + ";" + style + '">' + map$1(valueList, function(value) {
    return encodeHTML(value);
  }).join("&nbsp;&nbsp;") + "</span>";
}
function wrapInlineNameRichText(ctx, name, style) {
  return ctx.markupStyleCreator.wrapRichTextStyle(name, style);
}
function wrapInlineValueRichText(ctx, values, alignRight, valueCloseToMarker, style) {
  var styles = [style];
  var paddingLeft = valueCloseToMarker ? 10 : 20;
  alignRight && styles.push({
    padding: [0, 0, 0, paddingLeft],
    align: "right"
  });
  return ctx.markupStyleCreator.wrapRichTextStyle(isArray(values) ? values.join("  ") : values, styles);
}
function retrieveVisualColorForTooltipMarker(series, dataIndex) {
  var style = series.getData().getItemVisual(dataIndex, "style");
  var color2 = style[series.visualDrawType];
  return convertToColorString(color2);
}
function getPaddingFromTooltipModel(model, renderMode) {
  var padding = model.get("padding");
  return padding != null ? padding : renderMode === "richText" ? [8, 10] : 10;
}
var TooltipMarkupStyleCreator = (
  /** @class */
  function() {
    function TooltipMarkupStyleCreator2() {
      this.richTextStyles = {};
      this._nextStyleNameId = getRandomIdBase();
    }
    TooltipMarkupStyleCreator2.prototype._generateStyleName = function() {
      return "__EC_aUTo_" + this._nextStyleNameId++;
    };
    TooltipMarkupStyleCreator2.prototype.makeTooltipMarker = function(markerType, colorStr, renderMode) {
      var markerId = renderMode === "richText" ? this._generateStyleName() : null;
      var marker = getTooltipMarker({
        color: colorStr,
        type: markerType,
        renderMode,
        markerId
      });
      if (isString(marker)) {
        return marker;
      } else {
        this.richTextStyles[markerId] = marker.style;
        return marker.content;
      }
    };
    TooltipMarkupStyleCreator2.prototype.wrapRichTextStyle = function(text, styles) {
      var finalStl = {};
      if (isArray(styles)) {
        each$4(styles, function(stl) {
          return extend(finalStl, stl);
        });
      } else {
        extend(finalStl, styles);
      }
      var styleName = this._generateStyleName();
      this.richTextStyles[styleName] = finalStl;
      return "{" + styleName + "|" + text + "}";
    };
    return TooltipMarkupStyleCreator2;
  }()
);
function defaultSeriesFormatTooltip(opt) {
  var series = opt.series;
  var dataIndex = opt.dataIndex;
  var multipleSeries = opt.multipleSeries;
  var data = series.getData();
  var tooltipDims = data.mapDimensionsAll("defaultedTooltip");
  var tooltipDimLen = tooltipDims.length;
  var value = series.getRawValue(dataIndex);
  var isValueArr = isArray(value);
  var markerColor = retrieveVisualColorForTooltipMarker(series, dataIndex);
  var inlineValue;
  var inlineValueType;
  var subBlocks;
  var sortParam;
  if (tooltipDimLen > 1 || isValueArr && !tooltipDimLen) {
    var formatArrResult = formatTooltipArrayValue(value, series, dataIndex, tooltipDims, markerColor);
    inlineValue = formatArrResult.inlineValues;
    inlineValueType = formatArrResult.inlineValueTypes;
    subBlocks = formatArrResult.blocks;
    sortParam = formatArrResult.inlineValues[0];
  } else if (tooltipDimLen) {
    var dimInfo = data.getDimensionInfo(tooltipDims[0]);
    sortParam = inlineValue = retrieveRawValue(data, dataIndex, tooltipDims[0]);
    inlineValueType = dimInfo.type;
  } else {
    sortParam = inlineValue = isValueArr ? value[0] : value;
  }
  var seriesNameSpecified = isNameSpecified(series);
  var seriesName = seriesNameSpecified && series.name || "";
  var itemName = data.getName(dataIndex);
  var inlineName = multipleSeries ? seriesName : itemName;
  return createTooltipMarkup("section", {
    header: seriesName,
    // When series name is not specified, do not show a header line with only '-'.
    // This case always happens in tooltip.trigger: 'item'.
    noHeader: multipleSeries || !seriesNameSpecified,
    sortParam,
    blocks: [createTooltipMarkup("nameValue", {
      markerType: "item",
      markerColor,
      // Do not mix display seriesName and itemName in one tooltip,
      // which might confuses users.
      name: inlineName,
      // name dimension might be auto assigned, where the name might
      // be not readable. So we check trim here.
      noName: !trim(inlineName),
      value: inlineValue,
      valueType: inlineValueType,
      dataIndex
    })].concat(subBlocks || [])
  });
}
function formatTooltipArrayValue(value, series, dataIndex, tooltipDims, colorStr) {
  var data = series.getData();
  var isValueMultipleLine = reduce(value, function(isValueMultipleLine2, val, idx) {
    var dimItem = data.getDimensionInfo(idx);
    return isValueMultipleLine2 = isValueMultipleLine2 || dimItem && dimItem.tooltip !== false && dimItem.displayName != null;
  }, false);
  var inlineValues = [];
  var inlineValueTypes = [];
  var blocks = [];
  tooltipDims.length ? each$4(tooltipDims, function(dim) {
    setEachItem(retrieveRawValue(data, dataIndex, dim), dim);
  }) : each$4(value, setEachItem);
  function setEachItem(val, dim) {
    var dimInfo = data.getDimensionInfo(dim);
    if (!dimInfo || dimInfo.otherDims.tooltip === false) {
      return;
    }
    if (isValueMultipleLine) {
      blocks.push(createTooltipMarkup("nameValue", {
        markerType: "subItem",
        markerColor: colorStr,
        name: dimInfo.displayName,
        value: val,
        valueType: dimInfo.type
      }));
    } else {
      inlineValues.push(val);
      inlineValueTypes.push(dimInfo.type);
    }
  }
  return {
    inlineValues,
    inlineValueTypes,
    blocks
  };
}
var inner$a = makeInner();
function getSelectionKey(data, dataIndex) {
  return data.getName(dataIndex) || data.getId(dataIndex);
}
var SERIES_UNIVERSAL_TRANSITION_PROP = "__universalTransitionEnabled";
var SeriesModel = (
  /** @class */
  function(_super) {
    __extends(SeriesModel2, _super);
    function SeriesModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this._selectedDataIndicesMap = {};
      return _this;
    }
    SeriesModel2.prototype.init = function(option, parentModel, ecModel) {
      this.seriesIndex = this.componentIndex;
      this.dataTask = createTask({
        count: dataTaskCount,
        reset: dataTaskReset
      });
      this.dataTask.context = {
        model: this
      };
      this.mergeDefaultAndTheme(option, ecModel);
      var sourceManager = inner$a(this).sourceManager = new SourceManager(this);
      sourceManager.prepareSource();
      var data = this.getInitialData(option, ecModel);
      wrapData(data, this);
      this.dataTask.context.data = data;
      inner$a(this).dataBeforeProcessed = data;
      autoSeriesName(this);
      this._initSelectedMapFromData(data);
    };
    SeriesModel2.prototype.mergeDefaultAndTheme = function(option, ecModel) {
      var layoutMode = fetchLayoutMode(this);
      var inputPositionParams = layoutMode ? getLayoutParams(option) : {};
      var themeSubType = this.subType;
      if (ComponentModel.hasClass(themeSubType)) {
        themeSubType += "Series";
      }
      merge(option, ecModel.getTheme().get(this.subType));
      merge(option, this.getDefaultOption());
      defaultEmphasis(option, "label", ["show"]);
      this.fillDataTextStyle(option.data);
      if (layoutMode) {
        mergeLayoutParam(option, inputPositionParams, layoutMode);
      }
    };
    SeriesModel2.prototype.mergeOption = function(newSeriesOption, ecModel) {
      newSeriesOption = merge(this.option, newSeriesOption, true);
      this.fillDataTextStyle(newSeriesOption.data);
      var layoutMode = fetchLayoutMode(this);
      if (layoutMode) {
        mergeLayoutParam(this.option, newSeriesOption, layoutMode);
      }
      var sourceManager = inner$a(this).sourceManager;
      sourceManager.dirty();
      sourceManager.prepareSource();
      var data = this.getInitialData(newSeriesOption, ecModel);
      wrapData(data, this);
      this.dataTask.dirty();
      this.dataTask.context.data = data;
      inner$a(this).dataBeforeProcessed = data;
      autoSeriesName(this);
      this._initSelectedMapFromData(data);
    };
    SeriesModel2.prototype.fillDataTextStyle = function(data) {
      if (data && !isTypedArray(data)) {
        var props = ["show"];
        for (var i = 0; i < data.length; i++) {
          if (data[i] && data[i].label) {
            defaultEmphasis(data[i], "label", props);
          }
        }
      }
    };
    SeriesModel2.prototype.getInitialData = function(option, ecModel) {
      return;
    };
    SeriesModel2.prototype.appendData = function(params) {
      var data = this.getRawData();
      data.appendData(params.data);
    };
    SeriesModel2.prototype.getData = function(dataType) {
      var task = getCurrentTask(this);
      if (task) {
        var data = task.context.data;
        return dataType == null || !data.getLinkedData ? data : data.getLinkedData(dataType);
      } else {
        return inner$a(this).data;
      }
    };
    SeriesModel2.prototype.getAllData = function() {
      var mainData = this.getData();
      return mainData && mainData.getLinkedDataAll ? mainData.getLinkedDataAll() : [{
        data: mainData
      }];
    };
    SeriesModel2.prototype.setData = function(data) {
      var task = getCurrentTask(this);
      if (task) {
        var context = task.context;
        context.outputData = data;
        if (task !== this.dataTask) {
          context.data = data;
        }
      }
      inner$a(this).data = data;
    };
    SeriesModel2.prototype.getEncode = function() {
      var encode = this.get("encode", true);
      if (encode) {
        return createHashMap(encode);
      }
    };
    SeriesModel2.prototype.getSourceManager = function() {
      return inner$a(this).sourceManager;
    };
    SeriesModel2.prototype.getSource = function() {
      return this.getSourceManager().getSource();
    };
    SeriesModel2.prototype.getRawData = function() {
      return inner$a(this).dataBeforeProcessed;
    };
    SeriesModel2.prototype.getColorBy = function() {
      var colorBy = this.get("colorBy");
      return colorBy || "series";
    };
    SeriesModel2.prototype.isColorBySeries = function() {
      return this.getColorBy() === "series";
    };
    SeriesModel2.prototype.getBaseAxis = function() {
      var coordSys = this.coordinateSystem;
      return coordSys && coordSys.getBaseAxis && coordSys.getBaseAxis();
    };
    SeriesModel2.prototype.indicesOfNearest = function(axisDim, dim, value, maxDistance) {
      var data = this.getData();
      var coordSys = this.coordinateSystem;
      var axis = coordSys && coordSys.getAxis(axisDim);
      if (!coordSys || !axis) {
        return [];
      }
      var targetCoord = axis.dataToCoord(value);
      if (maxDistance == null) {
        maxDistance = Infinity;
      }
      var nearestIndices = [];
      var minDist = Infinity;
      var minDiff = -1;
      var nearestIndicesLen = 0;
      data.each(dim, function(dimValue, idx) {
        var dataCoord = axis.dataToCoord(dimValue);
        var diff = targetCoord - dataCoord;
        var dist = Math.abs(diff);
        if (dist <= maxDistance) {
          if (dist < minDist || dist === minDist && diff >= 0 && minDiff < 0) {
            minDist = dist;
            minDiff = diff;
            nearestIndicesLen = 0;
          }
          if (diff === minDiff) {
            nearestIndices[nearestIndicesLen++] = idx;
          }
        }
      });
      nearestIndices.length = nearestIndicesLen;
      return nearestIndices;
    };
    SeriesModel2.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
      return defaultSeriesFormatTooltip({
        series: this,
        dataIndex,
        multipleSeries
      });
    };
    SeriesModel2.prototype.isAnimationEnabled = function() {
      var ecModel = this.ecModel;
      if (env.node && !(ecModel && ecModel.ssr)) {
        return false;
      }
      var animationEnabled = this.getShallow("animation");
      if (animationEnabled) {
        if (this.getData().count() > this.getShallow("animationThreshold")) {
          animationEnabled = false;
        }
      }
      return !!animationEnabled;
    };
    SeriesModel2.prototype.restoreData = function() {
      this.dataTask.dirty();
    };
    SeriesModel2.prototype.getColorFromPalette = function(name, scope, requestColorNum) {
      var ecModel = this.ecModel;
      var color2 = PaletteMixin.prototype.getColorFromPalette.call(this, name, scope, requestColorNum);
      if (!color2) {
        color2 = ecModel.getColorFromPalette(name, scope, requestColorNum);
      }
      return color2;
    };
    SeriesModel2.prototype.coordDimToDataDim = function(coordDim) {
      return this.getRawData().mapDimensionsAll(coordDim);
    };
    SeriesModel2.prototype.getProgressive = function() {
      return this.get("progressive");
    };
    SeriesModel2.prototype.getProgressiveThreshold = function() {
      return this.get("progressiveThreshold");
    };
    SeriesModel2.prototype.select = function(innerDataIndices, dataType) {
      this._innerSelect(this.getData(dataType), innerDataIndices);
    };
    SeriesModel2.prototype.unselect = function(innerDataIndices, dataType) {
      var selectedMap = this.option.selectedMap;
      if (!selectedMap) {
        return;
      }
      var selectedMode = this.option.selectedMode;
      var data = this.getData(dataType);
      if (selectedMode === "series" || selectedMap === "all") {
        this.option.selectedMap = {};
        this._selectedDataIndicesMap = {};
        return;
      }
      for (var i = 0; i < innerDataIndices.length; i++) {
        var dataIndex = innerDataIndices[i];
        var nameOrId = getSelectionKey(data, dataIndex);
        selectedMap[nameOrId] = false;
        this._selectedDataIndicesMap[nameOrId] = -1;
      }
    };
    SeriesModel2.prototype.toggleSelect = function(innerDataIndices, dataType) {
      var tmpArr = [];
      for (var i = 0; i < innerDataIndices.length; i++) {
        tmpArr[0] = innerDataIndices[i];
        this.isSelected(innerDataIndices[i], dataType) ? this.unselect(tmpArr, dataType) : this.select(tmpArr, dataType);
      }
    };
    SeriesModel2.prototype.getSelectedDataIndices = function() {
      if (this.option.selectedMap === "all") {
        return [].slice.call(this.getData().getIndices());
      }
      var selectedDataIndicesMap = this._selectedDataIndicesMap;
      var nameOrIds = keys(selectedDataIndicesMap);
      var dataIndices = [];
      for (var i = 0; i < nameOrIds.length; i++) {
        var dataIndex = selectedDataIndicesMap[nameOrIds[i]];
        if (dataIndex >= 0) {
          dataIndices.push(dataIndex);
        }
      }
      return dataIndices;
    };
    SeriesModel2.prototype.isSelected = function(dataIndex, dataType) {
      var selectedMap = this.option.selectedMap;
      if (!selectedMap) {
        return false;
      }
      var data = this.getData(dataType);
      return (selectedMap === "all" || selectedMap[getSelectionKey(data, dataIndex)]) && !data.getItemModel(dataIndex).get(["select", "disabled"]);
    };
    SeriesModel2.prototype.isUniversalTransitionEnabled = function() {
      if (this[SERIES_UNIVERSAL_TRANSITION_PROP]) {
        return true;
      }
      var universalTransitionOpt = this.option.universalTransition;
      if (!universalTransitionOpt) {
        return false;
      }
      if (universalTransitionOpt === true) {
        return true;
      }
      return universalTransitionOpt && universalTransitionOpt.enabled;
    };
    SeriesModel2.prototype._innerSelect = function(data, innerDataIndices) {
      var _a2, _b2;
      var option = this.option;
      var selectedMode = option.selectedMode;
      var len2 = innerDataIndices.length;
      if (!selectedMode || !len2) {
        return;
      }
      if (selectedMode === "series") {
        option.selectedMap = "all";
      } else if (selectedMode === "multiple") {
        if (!isObject$2(option.selectedMap)) {
          option.selectedMap = {};
        }
        var selectedMap = option.selectedMap;
        for (var i = 0; i < len2; i++) {
          var dataIndex = innerDataIndices[i];
          var nameOrId = getSelectionKey(data, dataIndex);
          selectedMap[nameOrId] = true;
          this._selectedDataIndicesMap[nameOrId] = data.getRawIndex(dataIndex);
        }
      } else if (selectedMode === "single" || selectedMode === true) {
        var lastDataIndex = innerDataIndices[len2 - 1];
        var nameOrId = getSelectionKey(data, lastDataIndex);
        option.selectedMap = (_a2 = {}, _a2[nameOrId] = true, _a2);
        this._selectedDataIndicesMap = (_b2 = {}, _b2[nameOrId] = data.getRawIndex(lastDataIndex), _b2);
      }
    };
    SeriesModel2.prototype._initSelectedMapFromData = function(data) {
      if (this.option.selectedMap) {
        return;
      }
      var dataIndices = [];
      if (data.hasItemOption) {
        data.each(function(idx) {
          var rawItem = data.getRawDataItem(idx);
          if (rawItem && rawItem.selected) {
            dataIndices.push(idx);
          }
        });
      }
      if (dataIndices.length > 0) {
        this._innerSelect(data, dataIndices);
      }
    };
    SeriesModel2.registerClass = function(clz) {
      return ComponentModel.registerClass(clz);
    };
    SeriesModel2.protoInitialize = function() {
      var proto = SeriesModel2.prototype;
      proto.type = "series.__base__";
      proto.seriesIndex = 0;
      proto.ignoreStyleOnData = false;
      proto.hasSymbolVisual = false;
      proto.defaultSymbol = "circle";
      proto.visualStyleAccessPath = "itemStyle";
      proto.visualDrawType = "fill";
    }();
    return SeriesModel2;
  }(ComponentModel)
);
mixin(SeriesModel, DataFormatMixin);
mixin(SeriesModel, PaletteMixin);
mountExtend(SeriesModel, ComponentModel);
function autoSeriesName(seriesModel) {
  var name = seriesModel.name;
  if (!isNameSpecified(seriesModel)) {
    seriesModel.name = getSeriesAutoName(seriesModel) || name;
  }
}
function getSeriesAutoName(seriesModel) {
  var data = seriesModel.getRawData();
  var dataDims = data.mapDimensionsAll("seriesName");
  var nameArr = [];
  each$4(dataDims, function(dataDim) {
    var dimInfo = data.getDimensionInfo(dataDim);
    dimInfo.displayName && nameArr.push(dimInfo.displayName);
  });
  return nameArr.join(" ");
}
function dataTaskCount(context) {
  return context.model.getRawData().count();
}
function dataTaskReset(context) {
  var seriesModel = context.model;
  seriesModel.setData(seriesModel.getRawData().cloneShallow());
  return dataTaskProgress;
}
function dataTaskProgress(param, context) {
  if (context.outputData && param.end > context.outputData.count()) {
    context.model.getRawData().cloneShallow(context.outputData);
  }
}
function wrapData(data, seriesModel) {
  each$4(concatArray(data.CHANGABLE_METHODS, data.DOWNSAMPLE_METHODS), function(methodName) {
    data.wrapMethod(methodName, curry$1(onDataChange, seriesModel));
  });
}
function onDataChange(seriesModel, newList) {
  var task = getCurrentTask(seriesModel);
  if (task) {
    task.setOutputEnd((newList || this).count());
  }
  return newList;
}
function getCurrentTask(seriesModel) {
  var scheduler = (seriesModel.ecModel || {}).scheduler;
  var pipeline = scheduler && scheduler.getPipeline(seriesModel.uid);
  if (pipeline) {
    var task = pipeline.currentTask;
    if (task) {
      var agentStubMap = task.agentStubMap;
      if (agentStubMap) {
        task = agentStubMap.get(seriesModel.uid);
      }
    }
    return task;
  }
}
var ComponentView = (
  /** @class */
  function() {
    function ComponentView2() {
      this.group = new Group$2();
      this.uid = getUID("viewComponent");
    }
    ComponentView2.prototype.init = function(ecModel, api) {
    };
    ComponentView2.prototype.render = function(model, ecModel, api, payload) {
    };
    ComponentView2.prototype.dispose = function(ecModel, api) {
    };
    ComponentView2.prototype.updateView = function(model, ecModel, api, payload) {
    };
    ComponentView2.prototype.updateLayout = function(model, ecModel, api, payload) {
    };
    ComponentView2.prototype.updateVisual = function(model, ecModel, api, payload) {
    };
    ComponentView2.prototype.toggleBlurSeries = function(seriesModels, isBlur, ecModel) {
    };
    ComponentView2.prototype.eachRendered = function(cb) {
      var group = this.group;
      if (group) {
        group.traverse(cb);
      }
    };
    return ComponentView2;
  }()
);
enableClassExtend(ComponentView);
enableClassManagement(ComponentView);
function createRenderPlanner() {
  var inner2 = makeInner();
  return function(seriesModel) {
    var fields = inner2(seriesModel);
    var pipelineContext = seriesModel.pipelineContext;
    var originalLarge = !!fields.large;
    var originalProgressive = !!fields.progressiveRender;
    var large = fields.large = !!(pipelineContext && pipelineContext.large);
    var progressive = fields.progressiveRender = !!(pipelineContext && pipelineContext.progressiveRender);
    return !!(originalLarge !== large || originalProgressive !== progressive) && "reset";
  };
}
var inner$9 = makeInner();
var renderPlanner = createRenderPlanner();
var ChartView = (
  /** @class */
  function() {
    function ChartView2() {
      this.group = new Group$2();
      this.uid = getUID("viewChart");
      this.renderTask = createTask({
        plan: renderTaskPlan,
        reset: renderTaskReset
      });
      this.renderTask.context = {
        view: this
      };
    }
    ChartView2.prototype.init = function(ecModel, api) {
    };
    ChartView2.prototype.render = function(seriesModel, ecModel, api, payload) {
    };
    ChartView2.prototype.highlight = function(seriesModel, ecModel, api, payload) {
      var data = seriesModel.getData(payload && payload.dataType);
      if (!data) {
        return;
      }
      toggleHighlight(data, payload, "emphasis");
    };
    ChartView2.prototype.downplay = function(seriesModel, ecModel, api, payload) {
      var data = seriesModel.getData(payload && payload.dataType);
      if (!data) {
        return;
      }
      toggleHighlight(data, payload, "normal");
    };
    ChartView2.prototype.remove = function(ecModel, api) {
      this.group.removeAll();
    };
    ChartView2.prototype.dispose = function(ecModel, api) {
    };
    ChartView2.prototype.updateView = function(seriesModel, ecModel, api, payload) {
      this.render(seriesModel, ecModel, api, payload);
    };
    ChartView2.prototype.updateLayout = function(seriesModel, ecModel, api, payload) {
      this.render(seriesModel, ecModel, api, payload);
    };
    ChartView2.prototype.updateVisual = function(seriesModel, ecModel, api, payload) {
      this.render(seriesModel, ecModel, api, payload);
    };
    ChartView2.prototype.eachRendered = function(cb) {
      traverseElements(this.group, cb);
    };
    ChartView2.markUpdateMethod = function(payload, methodName) {
      inner$9(payload).updateMethod = methodName;
    };
    ChartView2.protoInitialize = function() {
      var proto = ChartView2.prototype;
      proto.type = "chart";
    }();
    return ChartView2;
  }()
);
function elSetState(el, state, highlightDigit) {
  if (el && isHighDownDispatcher(el)) {
    (state === "emphasis" ? enterEmphasis : leaveEmphasis)(el, highlightDigit);
  }
}
function toggleHighlight(data, payload, state) {
  var dataIndex = queryDataIndex(data, payload);
  var highlightDigit = payload && payload.highlightKey != null ? getHighlightDigit(payload.highlightKey) : null;
  if (dataIndex != null) {
    each$4(normalizeToArray(dataIndex), function(dataIdx) {
      elSetState(data.getItemGraphicEl(dataIdx), state, highlightDigit);
    });
  } else {
    data.eachItemGraphicEl(function(el) {
      elSetState(el, state, highlightDigit);
    });
  }
}
enableClassExtend(ChartView);
enableClassManagement(ChartView);
function renderTaskPlan(context) {
  return renderPlanner(context.model);
}
function renderTaskReset(context) {
  var seriesModel = context.model;
  var ecModel = context.ecModel;
  var api = context.api;
  var payload = context.payload;
  var progressiveRender = seriesModel.pipelineContext.progressiveRender;
  var view = context.view;
  var updateMethod = payload && inner$9(payload).updateMethod;
  var methodName = progressiveRender ? "incrementalPrepareRender" : updateMethod && view[updateMethod] ? updateMethod : "render";
  if (methodName !== "render") {
    view[methodName](seriesModel, ecModel, api, payload);
  }
  return progressMethodMap[methodName];
}
var progressMethodMap = {
  incrementalPrepareRender: {
    progress: function(params, context) {
      context.view.incrementalRender(params, context.model, context.ecModel, context.api, context.payload);
    }
  },
  render: {
    // Put view.render in `progress` to support appendData. But in this case
    // view.render should not be called in reset, otherwise it will be called
    // twise. Use `forceFirstProgress` to make sure that view.render is called
    // in any cases.
    forceFirstProgress: true,
    progress: function(params, context) {
      context.view.render(context.model, context.ecModel, context.api, context.payload);
    }
  }
};
var ORIGIN_METHOD = "\0__throttleOriginMethod";
var RATE = "\0__throttleRate";
var THROTTLE_TYPE = "\0__throttleType";
function throttle(fn, delay, debounce) {
  var currCall;
  var lastCall = 0;
  var lastExec = 0;
  var timer = null;
  var diff;
  var scope;
  var args;
  var debounceNextCall;
  delay = delay || 0;
  function exec() {
    lastExec = (/* @__PURE__ */ new Date()).getTime();
    timer = null;
    fn.apply(scope, args || []);
  }
  var cb = function() {
    var cbArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      cbArgs[_i] = arguments[_i];
    }
    currCall = (/* @__PURE__ */ new Date()).getTime();
    scope = this;
    args = cbArgs;
    var thisDelay = debounceNextCall || delay;
    var thisDebounce = debounceNextCall || debounce;
    debounceNextCall = null;
    diff = currCall - (thisDebounce ? lastCall : lastExec) - thisDelay;
    clearTimeout(timer);
    if (thisDebounce) {
      timer = setTimeout(exec, thisDelay);
    } else {
      if (diff >= 0) {
        exec();
      } else {
        timer = setTimeout(exec, -diff);
      }
    }
    lastCall = currCall;
  };
  cb.clear = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  cb.debounceNextCall = function(debounceDelay) {
    debounceNextCall = debounceDelay;
  };
  return cb;
}
function createOrUpdate(obj, fnAttr, rate, throttleType) {
  var fn = obj[fnAttr];
  if (!fn) {
    return;
  }
  var originFn = fn[ORIGIN_METHOD] || fn;
  var lastThrottleType = fn[THROTTLE_TYPE];
  var lastRate = fn[RATE];
  if (lastRate !== rate || lastThrottleType !== throttleType) {
    if (rate == null || !throttleType) {
      return obj[fnAttr] = originFn;
    }
    fn = obj[fnAttr] = throttle(originFn, rate, throttleType === "debounce");
    fn[ORIGIN_METHOD] = originFn;
    fn[THROTTLE_TYPE] = throttleType;
    fn[RATE] = rate;
  }
  return fn;
}
function clear(obj, fnAttr) {
  var fn = obj[fnAttr];
  if (fn && fn[ORIGIN_METHOD]) {
    fn.clear && fn.clear();
    obj[fnAttr] = fn[ORIGIN_METHOD];
  }
}
var inner$8 = makeInner();
var defaultStyleMappers = {
  itemStyle: makeStyleMapper(ITEM_STYLE_KEY_MAP, true),
  lineStyle: makeStyleMapper(LINE_STYLE_KEY_MAP, true)
};
var defaultColorKey = {
  lineStyle: "stroke",
  itemStyle: "fill"
};
function getStyleMapper(seriesModel, stylePath) {
  var styleMapper = seriesModel.visualStyleMapper || defaultStyleMappers[stylePath];
  if (!styleMapper) {
    console.warn("Unknown style type '" + stylePath + "'.");
    return defaultStyleMappers.itemStyle;
  }
  return styleMapper;
}
function getDefaultColorKey(seriesModel, stylePath) {
  var colorKey = seriesModel.visualDrawType || defaultColorKey[stylePath];
  if (!colorKey) {
    console.warn("Unknown style type '" + stylePath + "'.");
    return "fill";
  }
  return colorKey;
}
var seriesStyleTask = {
  createOnAllSeries: true,
  performRawSeries: true,
  reset: function(seriesModel, ecModel) {
    var data = seriesModel.getData();
    var stylePath = seriesModel.visualStyleAccessPath || "itemStyle";
    var styleModel = seriesModel.getModel(stylePath);
    var getStyle = getStyleMapper(seriesModel, stylePath);
    var globalStyle = getStyle(styleModel);
    var decalOption = styleModel.getShallow("decal");
    if (decalOption) {
      data.setVisual("decal", decalOption);
      decalOption.dirty = true;
    }
    var colorKey = getDefaultColorKey(seriesModel, stylePath);
    var color2 = globalStyle[colorKey];
    var colorCallback = isFunction(color2) ? color2 : null;
    var hasAutoColor = globalStyle.fill === "auto" || globalStyle.stroke === "auto";
    if (!globalStyle[colorKey] || colorCallback || hasAutoColor) {
      var colorPalette = seriesModel.getColorFromPalette(
        // TODO series count changed.
        seriesModel.name,
        null,
        ecModel.getSeriesCount()
      );
      if (!globalStyle[colorKey]) {
        globalStyle[colorKey] = colorPalette;
        data.setVisual("colorFromPalette", true);
      }
      globalStyle.fill = globalStyle.fill === "auto" || isFunction(globalStyle.fill) ? colorPalette : globalStyle.fill;
      globalStyle.stroke = globalStyle.stroke === "auto" || isFunction(globalStyle.stroke) ? colorPalette : globalStyle.stroke;
    }
    data.setVisual("style", globalStyle);
    data.setVisual("drawType", colorKey);
    if (!ecModel.isSeriesFiltered(seriesModel) && colorCallback) {
      data.setVisual("colorFromPalette", false);
      return {
        dataEach: function(data2, idx) {
          var dataParams = seriesModel.getDataParams(idx);
          var itemStyle = extend({}, globalStyle);
          itemStyle[colorKey] = colorCallback(dataParams);
          data2.setItemVisual(idx, "style", itemStyle);
        }
      };
    }
  }
};
var sharedModel = new Model();
var dataStyleTask = {
  createOnAllSeries: true,
  performRawSeries: true,
  reset: function(seriesModel, ecModel) {
    if (seriesModel.ignoreStyleOnData || ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }
    var data = seriesModel.getData();
    var stylePath = seriesModel.visualStyleAccessPath || "itemStyle";
    var getStyle = getStyleMapper(seriesModel, stylePath);
    var colorKey = data.getVisual("drawType");
    return {
      dataEach: data.hasItemOption ? function(data2, idx) {
        var rawItem = data2.getRawDataItem(idx);
        if (rawItem && rawItem[stylePath]) {
          sharedModel.option = rawItem[stylePath];
          var style = getStyle(sharedModel);
          var existsStyle = data2.ensureUniqueItemVisual(idx, "style");
          extend(existsStyle, style);
          if (sharedModel.option.decal) {
            data2.setItemVisual(idx, "decal", sharedModel.option.decal);
            sharedModel.option.decal.dirty = true;
          }
          if (colorKey in style) {
            data2.setItemVisual(idx, "colorFromPalette", false);
          }
        }
      } : null
    };
  }
};
var dataColorPaletteTask = {
  performRawSeries: true,
  overallReset: function(ecModel) {
    var paletteScopeGroupByType = createHashMap();
    ecModel.eachSeries(function(seriesModel) {
      var colorBy = seriesModel.getColorBy();
      if (seriesModel.isColorBySeries()) {
        return;
      }
      var key = seriesModel.type + "-" + colorBy;
      var colorScope = paletteScopeGroupByType.get(key);
      if (!colorScope) {
        colorScope = {};
        paletteScopeGroupByType.set(key, colorScope);
      }
      inner$8(seriesModel).scope = colorScope;
    });
    ecModel.eachSeries(function(seriesModel) {
      if (seriesModel.isColorBySeries() || ecModel.isSeriesFiltered(seriesModel)) {
        return;
      }
      var dataAll = seriesModel.getRawData();
      var idxMap = {};
      var data = seriesModel.getData();
      var colorScope = inner$8(seriesModel).scope;
      var stylePath = seriesModel.visualStyleAccessPath || "itemStyle";
      var colorKey = getDefaultColorKey(seriesModel, stylePath);
      data.each(function(idx) {
        var rawIdx = data.getRawIndex(idx);
        idxMap[rawIdx] = idx;
      });
      dataAll.each(function(rawIdx) {
        var idx = idxMap[rawIdx];
        var fromPalette = data.getItemVisual(idx, "colorFromPalette");
        if (fromPalette) {
          var itemStyle = data.ensureUniqueItemVisual(idx, "style");
          var name_1 = dataAll.getName(rawIdx) || rawIdx + "";
          var dataCount = dataAll.count();
          itemStyle[colorKey] = seriesModel.getColorFromPalette(name_1, colorScope, dataCount);
        }
      });
    });
  }
};
var PI$2 = Math.PI;
function defaultLoading(api, opts) {
  opts = opts || {};
  defaults(opts, {
    text: "loading",
    textColor: tokens.color.primary,
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    fontFamily: "sans-serif",
    maskColor: "rgba(255,255,255,0.8)",
    showSpinner: true,
    color: tokens.color.theme[0],
    spinnerRadius: 10,
    lineWidth: 5,
    zlevel: 0
  });
  var group = new Group$2();
  var mask = new Rect({
    style: {
      fill: opts.maskColor
    },
    zlevel: opts.zlevel,
    z: 1e4
  });
  group.add(mask);
  var textContent = new ZRText({
    style: {
      text: opts.text,
      fill: opts.textColor,
      fontSize: opts.fontSize,
      fontWeight: opts.fontWeight,
      fontStyle: opts.fontStyle,
      fontFamily: opts.fontFamily
    },
    zlevel: opts.zlevel,
    z: 10001
  });
  var labelRect = new Rect({
    style: {
      fill: "none"
    },
    textContent,
    textConfig: {
      position: "right",
      distance: 10
    },
    zlevel: opts.zlevel,
    z: 10001
  });
  group.add(labelRect);
  var arc;
  if (opts.showSpinner) {
    arc = new Arc({
      shape: {
        startAngle: -PI$2 / 2,
        endAngle: -PI$2 / 2 + 0.1,
        r: opts.spinnerRadius
      },
      style: {
        stroke: opts.color,
        lineCap: "round",
        lineWidth: opts.lineWidth
      },
      zlevel: opts.zlevel,
      z: 10001
    });
    arc.animateShape(true).when(1e3, {
      endAngle: PI$2 * 3 / 2
    }).start("circularInOut");
    arc.animateShape(true).when(1e3, {
      startAngle: PI$2 * 3 / 2
    }).delay(300).start("circularInOut");
    group.add(arc);
  }
  group.resize = function() {
    var textWidth = textContent.getBoundingRect().width;
    var r = opts.showSpinner ? opts.spinnerRadius : 0;
    var cx = (api.getWidth() - r * 2 - (opts.showSpinner && textWidth ? 10 : 0) - textWidth) / 2 - (opts.showSpinner && textWidth ? 0 : 5 + textWidth / 2) + (opts.showSpinner ? 0 : textWidth / 2) + (textWidth ? 0 : r);
    var cy = api.getHeight() / 2;
    opts.showSpinner && arc.setShape({
      cx,
      cy
    });
    labelRect.setShape({
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2
    });
    mask.setShape({
      x: 0,
      y: 0,
      width: api.getWidth(),
      height: api.getHeight()
    });
  };
  group.resize();
  return group;
}
var Scheduler = (
  /** @class */
  function() {
    function Scheduler2(ecInstance, api, dataProcessorHandlers, visualHandlers) {
      this._stageTaskMap = createHashMap();
      this.ecInstance = ecInstance;
      this.api = api;
      dataProcessorHandlers = this._dataProcessorHandlers = dataProcessorHandlers.slice();
      visualHandlers = this._visualHandlers = visualHandlers.slice();
      this._allHandlers = dataProcessorHandlers.concat(visualHandlers);
    }
    Scheduler2.prototype.restoreData = function(ecModel, payload) {
      ecModel.restoreData(payload);
      this._stageTaskMap.each(function(taskRecord) {
        var overallTask = taskRecord.overallTask;
        overallTask && overallTask.dirty();
      });
    };
    Scheduler2.prototype.getPerformArgs = function(task, isBlock) {
      if (!task.__pipeline) {
        return;
      }
      var pipeline = this._pipelineMap.get(task.__pipeline.id);
      var pCtx = pipeline.context;
      var incremental = !isBlock && pipeline.progressiveEnabled && (!pCtx || pCtx.progressiveRender) && task.__idxInPipeline > pipeline.blockIndex;
      var step = incremental ? pipeline.step : null;
      var modDataCount = pCtx && pCtx.modDataCount;
      var modBy = modDataCount != null ? Math.ceil(modDataCount / step) : null;
      return {
        step,
        modBy,
        modDataCount
      };
    };
    Scheduler2.prototype.getPipeline = function(pipelineId) {
      return this._pipelineMap.get(pipelineId);
    };
    Scheduler2.prototype.updateStreamModes = function(seriesModel, view) {
      var pipeline = this._pipelineMap.get(seriesModel.uid);
      var data = seriesModel.getData();
      var dataLen = data.count();
      var progressiveRender = pipeline.progressiveEnabled && view.incrementalPrepareRender && dataLen >= pipeline.threshold;
      var large = seriesModel.get("large") && dataLen >= seriesModel.get("largeThreshold");
      var modDataCount = seriesModel.get("progressiveChunkMode") === "mod" ? dataLen : null;
      seriesModel.pipelineContext = pipeline.context = {
        progressiveRender,
        modDataCount,
        large
      };
    };
    Scheduler2.prototype.restorePipelines = function(ecModel) {
      var scheduler = this;
      var pipelineMap = scheduler._pipelineMap = createHashMap();
      ecModel.eachSeries(function(seriesModel) {
        var progressive = seriesModel.getProgressive();
        var pipelineId = seriesModel.uid;
        pipelineMap.set(pipelineId, {
          id: pipelineId,
          head: null,
          tail: null,
          threshold: seriesModel.getProgressiveThreshold(),
          progressiveEnabled: progressive && !(seriesModel.preventIncremental && seriesModel.preventIncremental()),
          blockIndex: -1,
          step: Math.round(progressive || 700),
          count: 0
        });
        scheduler._pipe(seriesModel, seriesModel.dataTask);
      });
    };
    Scheduler2.prototype.prepareStageTasks = function() {
      var stageTaskMap = this._stageTaskMap;
      var ecModel = this.api.getModel();
      var api = this.api;
      each$4(this._allHandlers, function(handler) {
        var record = stageTaskMap.get(handler.uid) || stageTaskMap.set(handler.uid, {});
        var errMsg = "";
        assert(!(handler.reset && handler.overallReset), errMsg);
        handler.reset && this._createSeriesStageTask(handler, record, ecModel, api);
        handler.overallReset && this._createOverallStageTask(handler, record, ecModel, api);
      }, this);
    };
    Scheduler2.prototype.prepareView = function(view, model, ecModel, api) {
      var renderTask = view.renderTask;
      var context = renderTask.context;
      context.model = model;
      context.ecModel = ecModel;
      context.api = api;
      renderTask.__block = !view.incrementalPrepareRender;
      this._pipe(model, renderTask);
    };
    Scheduler2.prototype.performDataProcessorTasks = function(ecModel, payload) {
      this._performStageTasks(this._dataProcessorHandlers, ecModel, payload, {
        block: true
      });
    };
    Scheduler2.prototype.performVisualTasks = function(ecModel, payload, opt) {
      this._performStageTasks(this._visualHandlers, ecModel, payload, opt);
    };
    Scheduler2.prototype._performStageTasks = function(stageHandlers, ecModel, payload, opt) {
      opt = opt || {};
      var unfinished = false;
      var scheduler = this;
      each$4(stageHandlers, function(stageHandler, idx) {
        if (opt.visualType && opt.visualType !== stageHandler.visualType) {
          return;
        }
        var stageHandlerRecord = scheduler._stageTaskMap.get(stageHandler.uid);
        var seriesTaskMap = stageHandlerRecord.seriesTaskMap;
        var overallTask = stageHandlerRecord.overallTask;
        if (overallTask) {
          var overallNeedDirty_1;
          var agentStubMap = overallTask.agentStubMap;
          agentStubMap.each(function(stub) {
            if (needSetDirty(opt, stub)) {
              stub.dirty();
              overallNeedDirty_1 = true;
            }
          });
          overallNeedDirty_1 && overallTask.dirty();
          scheduler.updatePayload(overallTask, payload);
          var performArgs_1 = scheduler.getPerformArgs(overallTask, opt.block);
          agentStubMap.each(function(stub) {
            stub.perform(performArgs_1);
          });
          if (overallTask.perform(performArgs_1)) {
            unfinished = true;
          }
        } else if (seriesTaskMap) {
          seriesTaskMap.each(function(task, pipelineId) {
            if (needSetDirty(opt, task)) {
              task.dirty();
            }
            var performArgs = scheduler.getPerformArgs(task, opt.block);
            performArgs.skip = !stageHandler.performRawSeries && ecModel.isSeriesFiltered(task.context.model);
            scheduler.updatePayload(task, payload);
            if (task.perform(performArgs)) {
              unfinished = true;
            }
          });
        }
      });
      function needSetDirty(opt2, task) {
        return opt2.setDirty && (!opt2.dirtyMap || opt2.dirtyMap.get(task.__pipeline.id));
      }
      this.unfinished = unfinished || this.unfinished;
    };
    Scheduler2.prototype.performSeriesTasks = function(ecModel) {
      var unfinished;
      ecModel.eachSeries(function(seriesModel) {
        unfinished = seriesModel.dataTask.perform() || unfinished;
      });
      this.unfinished = unfinished || this.unfinished;
    };
    Scheduler2.prototype.plan = function() {
      this._pipelineMap.each(function(pipeline) {
        var task = pipeline.tail;
        do {
          if (task.__block) {
            pipeline.blockIndex = task.__idxInPipeline;
            break;
          }
          task = task.getUpstream();
        } while (task);
      });
    };
    Scheduler2.prototype.updatePayload = function(task, payload) {
      payload !== "remain" && (task.context.payload = payload);
    };
    Scheduler2.prototype._createSeriesStageTask = function(stageHandler, stageHandlerRecord, ecModel, api) {
      var scheduler = this;
      var oldSeriesTaskMap = stageHandlerRecord.seriesTaskMap;
      var newSeriesTaskMap = stageHandlerRecord.seriesTaskMap = createHashMap();
      var seriesType2 = stageHandler.seriesType;
      var getTargetSeries = stageHandler.getTargetSeries;
      if (stageHandler.createOnAllSeries) {
        ecModel.eachRawSeries(create2);
      } else if (seriesType2) {
        ecModel.eachRawSeriesByType(seriesType2, create2);
      } else if (getTargetSeries) {
        getTargetSeries(ecModel, api).each(create2);
      }
      function create2(seriesModel) {
        var pipelineId = seriesModel.uid;
        var task = newSeriesTaskMap.set(pipelineId, oldSeriesTaskMap && oldSeriesTaskMap.get(pipelineId) || createTask({
          plan: seriesTaskPlan,
          reset: seriesTaskReset,
          count: seriesTaskCount
        }));
        task.context = {
          model: seriesModel,
          ecModel,
          api,
          // PENDING: `useClearVisual` not used?
          useClearVisual: stageHandler.isVisual && !stageHandler.isLayout,
          plan: stageHandler.plan,
          reset: stageHandler.reset,
          scheduler
        };
        scheduler._pipe(seriesModel, task);
      }
    };
    Scheduler2.prototype._createOverallStageTask = function(stageHandler, stageHandlerRecord, ecModel, api) {
      var scheduler = this;
      var overallTask = stageHandlerRecord.overallTask = stageHandlerRecord.overallTask || createTask({
        reset: overallTaskReset
      });
      overallTask.context = {
        ecModel,
        api,
        overallReset: stageHandler.overallReset,
        scheduler
      };
      var oldAgentStubMap = overallTask.agentStubMap;
      var newAgentStubMap = overallTask.agentStubMap = createHashMap();
      var seriesType2 = stageHandler.seriesType;
      var getTargetSeries = stageHandler.getTargetSeries;
      var overallProgress = true;
      var shouldOverallTaskDirty = false;
      var errMsg = "";
      assert(!stageHandler.createOnAllSeries, errMsg);
      if (seriesType2) {
        ecModel.eachRawSeriesByType(seriesType2, createStub);
      } else if (getTargetSeries) {
        getTargetSeries(ecModel, api).each(createStub);
      } else {
        overallProgress = false;
        each$4(ecModel.getSeries(), createStub);
      }
      function createStub(seriesModel) {
        var pipelineId = seriesModel.uid;
        var stub = newAgentStubMap.set(pipelineId, oldAgentStubMap && oldAgentStubMap.get(pipelineId) || // When the result of `getTargetSeries` changed, the overallTask
        // should be set as dirty and re-performed.
        (shouldOverallTaskDirty = true, createTask({
          reset: stubReset,
          onDirty: stubOnDirty
        })));
        stub.context = {
          model: seriesModel,
          overallProgress
          // FIXME:TS never used, so comment it
          // modifyOutputEnd: modifyOutputEnd
        };
        stub.agent = overallTask;
        stub.__block = overallProgress;
        scheduler._pipe(seriesModel, stub);
      }
      if (shouldOverallTaskDirty) {
        overallTask.dirty();
      }
    };
    Scheduler2.prototype._pipe = function(seriesModel, task) {
      var pipelineId = seriesModel.uid;
      var pipeline = this._pipelineMap.get(pipelineId);
      !pipeline.head && (pipeline.head = task);
      pipeline.tail && pipeline.tail.pipe(task);
      pipeline.tail = task;
      task.__idxInPipeline = pipeline.count++;
      task.__pipeline = pipeline;
    };
    Scheduler2.wrapStageHandler = function(stageHandler, visualType) {
      if (isFunction(stageHandler)) {
        stageHandler = {
          overallReset: stageHandler,
          seriesType: detectSeriseType(stageHandler)
        };
      }
      stageHandler.uid = getUID("stageHandler");
      visualType && (stageHandler.visualType = visualType);
      return stageHandler;
    };
    return Scheduler2;
  }()
);
function overallTaskReset(context) {
  context.overallReset(context.ecModel, context.api, context.payload);
}
function stubReset(context) {
  return context.overallProgress && stubProgress;
}
function stubProgress() {
  this.agent.dirty();
  this.getDownstream().dirty();
}
function stubOnDirty() {
  this.agent && this.agent.dirty();
}
function seriesTaskPlan(context) {
  return context.plan ? context.plan(context.model, context.ecModel, context.api, context.payload) : null;
}
function seriesTaskReset(context) {
  if (context.useClearVisual) {
    context.data.clearAllVisual();
  }
  var resetDefines = context.resetDefines = normalizeToArray(context.reset(context.model, context.ecModel, context.api, context.payload));
  return resetDefines.length > 1 ? map$1(resetDefines, function(v, idx) {
    return makeSeriesTaskProgress(idx);
  }) : singleSeriesTaskProgress;
}
var singleSeriesTaskProgress = makeSeriesTaskProgress(0);
function makeSeriesTaskProgress(resetDefineIdx) {
  return function(params, context) {
    var data = context.data;
    var resetDefine = context.resetDefines[resetDefineIdx];
    if (resetDefine && resetDefine.dataEach) {
      for (var i = params.start; i < params.end; i++) {
        resetDefine.dataEach(data, i);
      }
    } else if (resetDefine && resetDefine.progress) {
      resetDefine.progress(params, data);
    }
  };
}
function seriesTaskCount(context) {
  return context.data.count();
}
function detectSeriseType(legacyFunc) {
  seriesType = null;
  try {
    legacyFunc(ecModelMock, apiMock);
  } catch (e) {
  }
  return seriesType;
}
var ecModelMock = {};
var apiMock = {};
var seriesType;
mockMethods(ecModelMock, GlobalModel);
mockMethods(apiMock, ExtensionAPI);
ecModelMock.eachSeriesByType = ecModelMock.eachRawSeriesByType = function(type) {
  seriesType = type;
};
ecModelMock.eachComponent = function(cond) {
  if (cond.mainType === "series" && cond.subType) {
    seriesType = cond.subType;
  }
};
function mockMethods(target, Clz) {
  for (var name_1 in Clz.prototype) {
    target[name_1] = noop;
  }
}
var color = tokens.darkColor;
var backgroundColor = color.background;
var axisCommon = function() {
  return {
    axisLine: {
      lineStyle: {
        color: color.axisLine
      }
    },
    splitLine: {
      lineStyle: {
        color: color.axisSplitLine
      }
    },
    splitArea: {
      areaStyle: {
        color: [color.backgroundTint, color.backgroundTransparent]
      }
    },
    minorSplitLine: {
      lineStyle: {
        color: color.axisMinorSplitLine
      }
    },
    axisLabel: {
      color: color.axisLabel
    },
    axisName: {}
  };
};
var matrixAxis = {
  label: {
    color: color.secondary
  },
  itemStyle: {
    borderColor: color.borderTint
  },
  dividerLineStyle: {
    color: color.border
  }
};
var theme = {
  darkMode: true,
  color: color.theme,
  backgroundColor,
  axisPointer: {
    lineStyle: {
      color: color.border
    },
    crossStyle: {
      color: color.borderShade
    },
    label: {
      color: color.tertiary
    }
  },
  legend: {
    textStyle: {
      color: color.secondary
    },
    pageTextStyle: {
      color: color.tertiary
    }
  },
  textStyle: {
    color: color.secondary
  },
  title: {
    textStyle: {
      color: color.primary
    },
    subtextStyle: {
      color: color.quaternary
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: color.accent50
    }
  },
  tooltip: {
    backgroundColor: color.neutral20,
    defaultBorderColor: color.border,
    textStyle: {
      color: color.tertiary
    }
  },
  dataZoom: {
    borderColor: color.accent10,
    textStyle: {
      color: color.tertiary
    },
    brushStyle: {
      color: color.backgroundTint
    },
    handleStyle: {
      color: color.neutral00,
      borderColor: color.accent20
    },
    moveHandleStyle: {
      color: color.accent40
    },
    emphasis: {
      handleStyle: {
        borderColor: color.accent50
      }
    },
    dataBackground: {
      lineStyle: {
        color: color.accent30
      },
      areaStyle: {
        color: color.accent20
      }
    },
    selectedDataBackground: {
      lineStyle: {
        color: color.accent50
      },
      areaStyle: {
        color: color.accent30
      }
    }
  },
  visualMap: {
    textStyle: {
      color: color.secondary
    },
    handleStyle: {
      borderColor: color.neutral30
    }
  },
  timeline: {
    lineStyle: {
      color: color.accent10
    },
    label: {
      color: color.tertiary
    },
    controlStyle: {
      color: color.accent30,
      borderColor: color.accent30
    }
  },
  calendar: {
    itemStyle: {
      color: color.neutral00,
      borderColor: color.neutral20
    },
    dayLabel: {
      color: color.tertiary
    },
    monthLabel: {
      color: color.secondary
    },
    yearLabel: {
      color: color.secondary
    }
  },
  matrix: {
    x: matrixAxis,
    y: matrixAxis,
    backgroundColor: {
      borderColor: color.axisLine
    },
    body: {
      itemStyle: {
        borderColor: color.borderTint
      }
    }
  },
  timeAxis: axisCommon(),
  logAxis: axisCommon(),
  valueAxis: axisCommon(),
  categoryAxis: axisCommon(),
  line: {
    symbol: "circle"
  },
  graph: {
    color: color.theme
  },
  gauge: {
    title: {
      color: color.secondary
    },
    axisLine: {
      lineStyle: {
        color: [[1, color.neutral05]]
      }
    },
    axisLabel: {
      color: color.axisLabel
    },
    detail: {
      color: color.primary
    }
  },
  candlestick: {
    itemStyle: {
      color: "#f64e56",
      color0: "#54ea92",
      borderColor: "#f64e56",
      borderColor0: "#54ea92"
      // borderColor: '#ca2824',
      // borderColor0: '#09a443'
    }
  },
  funnel: {
    itemStyle: {
      borderColor: color.background
    }
  },
  radar: function() {
    var radar = axisCommon();
    radar.axisName = {
      color: color.axisLabel
    };
    radar.axisLine.lineStyle.color = color.neutral20;
    return radar;
  }(),
  treemap: {
    breadcrumb: {
      itemStyle: {
        color: color.neutral20,
        textStyle: {
          color: color.secondary
        }
      },
      emphasis: {
        itemStyle: {
          color: color.neutral30
        }
      }
    }
  },
  sunburst: {
    itemStyle: {
      borderColor: color.background
    }
  },
  map: {
    itemStyle: {
      borderColor: color.border,
      areaColor: color.neutral10
    },
    label: {
      color: color.tertiary
    },
    emphasis: {
      label: {
        color: color.primary
      },
      itemStyle: {
        areaColor: color.highlight
      }
    },
    select: {
      label: {
        color: color.primary
      },
      itemStyle: {
        areaColor: color.highlight
      }
    }
  },
  geo: {
    itemStyle: {
      borderColor: color.border,
      areaColor: color.neutral10
    },
    emphasis: {
      label: {
        color: color.primary
      },
      itemStyle: {
        areaColor: color.highlight
      }
    },
    select: {
      label: {
        color: color.primary
      },
      itemStyle: {
        color: color.highlight
      }
    }
  }
};
theme.categoryAxis.splitLine.show = false;
var ECEventProcessor = (
  /** @class */
  function() {
    function ECEventProcessor2() {
    }
    ECEventProcessor2.prototype.normalizeQuery = function(query) {
      var cptQuery = {};
      var dataQuery = {};
      var otherQuery = {};
      if (isString(query)) {
        var condCptType = parseClassType(query);
        cptQuery.mainType = condCptType.main || null;
        cptQuery.subType = condCptType.sub || null;
      } else {
        var suffixes_1 = ["Index", "Name", "Id"];
        var dataKeys_1 = {
          name: 1,
          dataIndex: 1,
          dataType: 1
        };
        each$4(query, function(val, key) {
          var reserved = false;
          for (var i = 0; i < suffixes_1.length; i++) {
            var propSuffix = suffixes_1[i];
            var suffixPos = key.lastIndexOf(propSuffix);
            if (suffixPos > 0 && suffixPos === key.length - propSuffix.length) {
              var mainType = key.slice(0, suffixPos);
              if (mainType !== "data") {
                cptQuery.mainType = mainType;
                cptQuery[propSuffix.toLowerCase()] = val;
                reserved = true;
              }
            }
          }
          if (dataKeys_1.hasOwnProperty(key)) {
            dataQuery[key] = val;
            reserved = true;
          }
          if (!reserved) {
            otherQuery[key] = val;
          }
        });
      }
      return {
        cptQuery,
        dataQuery,
        otherQuery
      };
    };
    ECEventProcessor2.prototype.filter = function(eventType, query) {
      var eventInfo = this.eventInfo;
      if (!eventInfo) {
        return true;
      }
      var targetEl = eventInfo.targetEl;
      var packedEvent = eventInfo.packedEvent;
      var model = eventInfo.model;
      var view = eventInfo.view;
      if (!model || !view) {
        return true;
      }
      var cptQuery = query.cptQuery;
      var dataQuery = query.dataQuery;
      return check(cptQuery, model, "mainType") && check(cptQuery, model, "subType") && check(cptQuery, model, "index", "componentIndex") && check(cptQuery, model, "name") && check(cptQuery, model, "id") && check(dataQuery, packedEvent, "name") && check(dataQuery, packedEvent, "dataIndex") && check(dataQuery, packedEvent, "dataType") && (!view.filterForExposedEvent || view.filterForExposedEvent(eventType, query.otherQuery, targetEl, packedEvent));
      function check(query2, host, prop, propOnHost) {
        return query2[prop] == null || host[propOnHost || prop] === query2[prop];
      }
    };
    ECEventProcessor2.prototype.afterTrigger = function() {
      this.eventInfo = null;
    };
    return ECEventProcessor2;
  }()
);
var SYMBOL_PROPS_WITH_CB = ["symbol", "symbolSize", "symbolRotate", "symbolOffset"];
var SYMBOL_PROPS = SYMBOL_PROPS_WITH_CB.concat(["symbolKeepAspect"]);
var seriesSymbolTask = {
  createOnAllSeries: true,
  // For legend.
  performRawSeries: true,
  reset: function(seriesModel, ecModel) {
    var data = seriesModel.getData();
    if (seriesModel.legendIcon) {
      data.setVisual("legendIcon", seriesModel.legendIcon);
    }
    if (!seriesModel.hasSymbolVisual) {
      return;
    }
    var symbolOptions = {};
    var symbolOptionsCb = {};
    var hasCallback = false;
    for (var i = 0; i < SYMBOL_PROPS_WITH_CB.length; i++) {
      var symbolPropName = SYMBOL_PROPS_WITH_CB[i];
      var val = seriesModel.get(symbolPropName);
      if (isFunction(val)) {
        hasCallback = true;
        symbolOptionsCb[symbolPropName] = val;
      } else {
        symbolOptions[symbolPropName] = val;
      }
    }
    symbolOptions.symbol = symbolOptions.symbol || seriesModel.defaultSymbol;
    data.setVisual(extend({
      legendIcon: seriesModel.legendIcon || symbolOptions.symbol,
      symbolKeepAspect: seriesModel.get("symbolKeepAspect")
    }, symbolOptions));
    if (ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }
    var symbolPropsCb = keys(symbolOptionsCb);
    function dataEach(data2, idx) {
      var rawValue = seriesModel.getRawValue(idx);
      var params = seriesModel.getDataParams(idx);
      for (var i2 = 0; i2 < symbolPropsCb.length; i2++) {
        var symbolPropName2 = symbolPropsCb[i2];
        data2.setItemVisual(idx, symbolPropName2, symbolOptionsCb[symbolPropName2](rawValue, params));
      }
    }
    return {
      dataEach: hasCallback ? dataEach : null
    };
  }
};
var dataSymbolTask = {
  createOnAllSeries: true,
  // For legend.
  performRawSeries: true,
  reset: function(seriesModel, ecModel) {
    if (!seriesModel.hasSymbolVisual) {
      return;
    }
    if (ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }
    var data = seriesModel.getData();
    function dataEach(data2, idx) {
      var itemModel = data2.getItemModel(idx);
      for (var i = 0; i < SYMBOL_PROPS.length; i++) {
        var symbolPropName = SYMBOL_PROPS[i];
        var val = itemModel.getShallow(symbolPropName, true);
        if (val != null) {
          data2.setItemVisual(idx, symbolPropName, val);
        }
      }
    }
    return {
      dataEach: data.hasItemOption ? dataEach : null
    };
  }
};
function getItemVisualFromData(data, dataIndex, key) {
  switch (key) {
    case "color":
      var style = data.getItemVisual(dataIndex, "style");
      return style[data.getVisual("drawType")];
    case "opacity":
      return data.getItemVisual(dataIndex, "style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return data.getItemVisual(dataIndex, key);
  }
}
function getVisualFromData(data, key) {
  switch (key) {
    case "color":
      var style = data.getVisual("style");
      return style[data.getVisual("drawType")];
    case "opacity":
      return data.getVisual("style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return data.getVisual(key);
  }
}
function handleSeriesLegacySelectEvents(type, eventPostfix, ecIns, ecModel, payload) {
  var legacyEventName = type + eventPostfix;
  if (!ecIns.isSilent(legacyEventName)) {
    ecModel.eachComponent({
      mainType: "series",
      subType: "pie"
    }, function(seriesModel) {
      var seriesIndex = seriesModel.seriesIndex;
      var selectedMap = seriesModel.option.selectedMap;
      var selected = payload.selected;
      for (var i = 0; i < selected.length; i++) {
        if (selected[i].seriesIndex === seriesIndex) {
          var data = seriesModel.getData();
          var dataIndex = queryDataIndex(data, payload.fromActionPayload);
          ecIns.trigger(legacyEventName, {
            type: legacyEventName,
            seriesId: seriesModel.id,
            name: isArray(dataIndex) ? data.getName(dataIndex[0]) : data.getName(dataIndex),
            selected: isString(selectedMap) ? selectedMap : extend({}, selectedMap)
          });
        }
      }
    });
  }
}
function handleLegacySelectEvents(messageCenter, ecIns, api) {
  messageCenter.on("selectchanged", function(params) {
    var ecModel = api.getModel();
    if (params.isFromClick) {
      handleSeriesLegacySelectEvents("map", "selectchanged", ecIns, ecModel, params);
      handleSeriesLegacySelectEvents("pie", "selectchanged", ecIns, ecModel, params);
    } else if (params.fromAction === "select") {
      handleSeriesLegacySelectEvents("map", "selected", ecIns, ecModel, params);
      handleSeriesLegacySelectEvents("pie", "selected", ecIns, ecModel, params);
    } else if (params.fromAction === "unselect") {
      handleSeriesLegacySelectEvents("map", "unselected", ecIns, ecModel, params);
      handleSeriesLegacySelectEvents("pie", "unselected", ecIns, ecModel, params);
    }
  });
}
function findEventDispatcher(target, det, returnFirstMatch) {
  var found;
  while (target) {
    if (det(target)) {
      found = target;
      if (returnFirstMatch) {
        break;
      }
    }
    target = target.__hostTarget || target.parent;
  }
  return found;
}
var Triangle = Path.extend({
  type: "triangle",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(path, shape) {
    var cx = shape.cx;
    var cy = shape.cy;
    var width = shape.width / 2;
    var height = shape.height / 2;
    path.moveTo(cx, cy - height);
    path.lineTo(cx + width, cy + height);
    path.lineTo(cx - width, cy + height);
    path.closePath();
  }
});
var Diamond = Path.extend({
  type: "diamond",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(path, shape) {
    var cx = shape.cx;
    var cy = shape.cy;
    var width = shape.width / 2;
    var height = shape.height / 2;
    path.moveTo(cx, cy - height);
    path.lineTo(cx + width, cy);
    path.lineTo(cx, cy + height);
    path.lineTo(cx - width, cy);
    path.closePath();
  }
});
var Pin = Path.extend({
  type: "pin",
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(path, shape) {
    var x = shape.x;
    var y = shape.y;
    var w = shape.width / 5 * 3;
    var h = Math.max(w, shape.height);
    var r = w / 2;
    var dy = r * r / (h - r);
    var cy = y - h + r + dy;
    var angle = Math.asin(dy / r);
    var dx = Math.cos(angle) * r;
    var tanX = Math.sin(angle);
    var tanY = Math.cos(angle);
    var cpLen = r * 0.6;
    var cpLen2 = r * 0.7;
    path.moveTo(x - dx, cy + dy);
    path.arc(x, cy, r, Math.PI - angle, Math.PI * 2 + angle);
    path.bezierCurveTo(x + dx - tanX * cpLen, cy + dy + tanY * cpLen, x, y - cpLen2, x, y);
    path.bezierCurveTo(x, y - cpLen2, x - dx + tanX * cpLen, cy + dy + tanY * cpLen, x - dx, cy + dy);
    path.closePath();
  }
});
var Arrow = Path.extend({
  type: "arrow",
  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(ctx, shape) {
    var height = shape.height;
    var width = shape.width;
    var x = shape.x;
    var y = shape.y;
    var dx = width / 3 * 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + height);
    ctx.lineTo(x, y + height / 4 * 3);
    ctx.lineTo(x - dx, y + height);
    ctx.lineTo(x, y);
    ctx.closePath();
  }
});
var symbolCtors = {
  line: Line$1,
  rect: Rect,
  roundRect: Rect,
  square: Rect,
  circle: Circle,
  diamond: Diamond,
  pin: Pin,
  arrow: Arrow,
  triangle: Triangle
};
var symbolShapeMakers = {
  line: function(x, y, w, h, shape) {
    shape.x1 = x;
    shape.y1 = y + h / 2;
    shape.x2 = x + w;
    shape.y2 = y + h / 2;
  },
  rect: function(x, y, w, h, shape) {
    shape.x = x;
    shape.y = y;
    shape.width = w;
    shape.height = h;
  },
  roundRect: function(x, y, w, h, shape) {
    shape.x = x;
    shape.y = y;
    shape.width = w;
    shape.height = h;
    shape.r = Math.min(w, h) / 4;
  },
  square: function(x, y, w, h, shape) {
    var size = Math.min(w, h);
    shape.x = x;
    shape.y = y;
    shape.width = size;
    shape.height = size;
  },
  circle: function(x, y, w, h, shape) {
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.r = Math.min(w, h) / 2;
  },
  diamond: function(x, y, w, h, shape) {
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  pin: function(x, y, w, h, shape) {
    shape.x = x + w / 2;
    shape.y = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  arrow: function(x, y, w, h, shape) {
    shape.x = x + w / 2;
    shape.y = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  triangle: function(x, y, w, h, shape) {
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.width = w;
    shape.height = h;
  }
};
var symbolBuildProxies = {};
each$4(symbolCtors, function(Ctor, name) {
  symbolBuildProxies[name] = new Ctor();
});
var SymbolClz = Path.extend({
  type: "symbol",
  shape: {
    symbolType: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  calculateTextPosition: function(out, config, rect) {
    var res = calculateTextPosition(out, config, rect);
    var shape = this.shape;
    if (shape && shape.symbolType === "pin" && config.position === "inside") {
      res.y = rect.y + rect.height * 0.4;
    }
    return res;
  },
  buildPath: function(ctx, shape, inBundle) {
    var symbolType = shape.symbolType;
    if (symbolType !== "none") {
      var proxySymbol = symbolBuildProxies[symbolType];
      if (!proxySymbol) {
        symbolType = "rect";
        proxySymbol = symbolBuildProxies[symbolType];
      }
      symbolShapeMakers[symbolType](shape.x, shape.y, shape.width, shape.height, proxySymbol.shape);
      proxySymbol.buildPath(ctx, proxySymbol.shape, inBundle);
    }
  }
});
function symbolPathSetColor(color2, innerColor2) {
  if (this.type !== "image") {
    var symbolStyle = this.style;
    if (this.__isEmptyBrush) {
      symbolStyle.stroke = color2;
      symbolStyle.fill = innerColor2 || tokens.color.neutral00;
      symbolStyle.lineWidth = 2;
    } else if (this.shape.symbolType === "line") {
      symbolStyle.stroke = color2;
    } else {
      symbolStyle.fill = color2;
    }
    this.markRedraw();
  }
}
function createSymbol$1(symbolType, x, y, w, h, color2, keepAspect) {
  var isEmpty = symbolType.indexOf("empty") === 0;
  if (isEmpty) {
    symbolType = symbolType.substr(5, 1).toLowerCase() + symbolType.substr(6);
  }
  var symbolPath;
  if (symbolType.indexOf("image://") === 0) {
    symbolPath = makeImage(symbolType.slice(8), new BoundingRect(x, y, w, h), keepAspect ? "center" : "cover");
  } else if (symbolType.indexOf("path://") === 0) {
    symbolPath = makePath(symbolType.slice(7), {}, new BoundingRect(x, y, w, h), keepAspect ? "center" : "cover");
  } else {
    symbolPath = new SymbolClz({
      shape: {
        symbolType,
        x,
        y,
        width: w,
        height: h
      }
    });
  }
  symbolPath.__isEmptyBrush = isEmpty;
  symbolPath.setColor = symbolPathSetColor;
  if (color2) {
    symbolPath.setColor(color2);
  }
  return symbolPath;
}
function normalizeSymbolSize(symbolSize) {
  if (!isArray(symbolSize)) {
    symbolSize = [+symbolSize, +symbolSize];
  }
  return [symbolSize[0] || 0, symbolSize[1] || 0];
}
function normalizeSymbolOffset(symbolOffset, symbolSize) {
  if (symbolOffset == null) {
    return;
  }
  if (!isArray(symbolOffset)) {
    symbolOffset = [symbolOffset, symbolOffset];
  }
  return [parsePercent(symbolOffset[0], symbolSize[0]) || 0, parsePercent(retrieve2(symbolOffset[1], symbolOffset[0]), symbolSize[1]) || 0];
}
var decalMap = new WeakMap();
var decalCache = new LRU(100);
var decalKeys = ["symbol", "symbolSize", "symbolKeepAspect", "color", "backgroundColor", "dashArrayX", "dashArrayY", "maxTileWidth", "maxTileHeight"];
function createOrUpdatePatternFromDecal(decalObject, api) {
  if (decalObject === "none") {
    return null;
  }
  var dpr = api.getDevicePixelRatio();
  var zr = api.getZr();
  var isSVG = zr.painter.type === "svg";
  if (decalObject.dirty) {
    decalMap["delete"](decalObject);
  }
  var oldPattern = decalMap.get(decalObject);
  if (oldPattern) {
    return oldPattern;
  }
  var decalOpt = defaults(decalObject, {
    symbol: "rect",
    symbolSize: 1,
    symbolKeepAspect: true,
    color: "rgba(0, 0, 0, 0.2)",
    backgroundColor: null,
    dashArrayX: 5,
    dashArrayY: 5,
    rotation: 0,
    maxTileWidth: 512,
    maxTileHeight: 512
  });
  if (decalOpt.backgroundColor === "none") {
    decalOpt.backgroundColor = null;
  }
  var pattern = {
    repeat: "repeat"
  };
  setPatternnSource(pattern);
  pattern.rotation = decalOpt.rotation;
  pattern.scaleX = pattern.scaleY = isSVG ? 1 : 1 / dpr;
  decalMap.set(decalObject, pattern);
  decalObject.dirty = false;
  return pattern;
  function setPatternnSource(pattern2) {
    var keys2 = [dpr];
    var isValidKey = true;
    for (var i = 0; i < decalKeys.length; ++i) {
      var value = decalOpt[decalKeys[i]];
      if (value != null && !isArray(value) && !isString(value) && !isNumber(value) && typeof value !== "boolean") {
        isValidKey = false;
        break;
      }
      keys2.push(value);
    }
    var cacheKey;
    if (isValidKey) {
      cacheKey = keys2.join(",") + (isSVG ? "-svg" : "");
      var cache = decalCache.get(cacheKey);
      if (cache) {
        isSVG ? pattern2.svgElement = cache : pattern2.image = cache;
      }
    }
    var dashArrayX = normalizeDashArrayX(decalOpt.dashArrayX);
    var dashArrayY = normalizeDashArrayY(decalOpt.dashArrayY);
    var symbolArray = normalizeSymbolArray(decalOpt.symbol);
    var lineBlockLengthsX = getLineBlockLengthX(dashArrayX);
    var lineBlockLengthY = getLineBlockLengthY(dashArrayY);
    var canvas = !isSVG && platformApi.createCanvas();
    var svgRoot = isSVG && {
      tag: "g",
      attrs: {},
      key: "dcl",
      children: []
    };
    var pSize = getPatternSize();
    var ctx;
    if (canvas) {
      canvas.width = pSize.width * dpr;
      canvas.height = pSize.height * dpr;
      ctx = canvas.getContext("2d");
    }
    brushDecal();
    if (isValidKey) {
      decalCache.put(cacheKey, canvas || svgRoot);
    }
    pattern2.image = canvas;
    pattern2.svgElement = svgRoot;
    pattern2.svgWidth = pSize.width;
    pattern2.svgHeight = pSize.height;
    function getPatternSize() {
      var width = 1;
      for (var i2 = 0, xlen = lineBlockLengthsX.length; i2 < xlen; ++i2) {
        width = getLeastCommonMultiple(width, lineBlockLengthsX[i2]);
      }
      var symbolRepeats = 1;
      for (var i2 = 0, xlen = symbolArray.length; i2 < xlen; ++i2) {
        symbolRepeats = getLeastCommonMultiple(symbolRepeats, symbolArray[i2].length);
      }
      width *= symbolRepeats;
      var height = lineBlockLengthY * lineBlockLengthsX.length * symbolArray.length;
      return {
        width: Math.max(1, Math.min(width, decalOpt.maxTileWidth)),
        height: Math.max(1, Math.min(height, decalOpt.maxTileHeight))
      };
    }
    function brushDecal() {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (decalOpt.backgroundColor) {
          ctx.fillStyle = decalOpt.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      var ySum = 0;
      for (var i2 = 0; i2 < dashArrayY.length; ++i2) {
        ySum += dashArrayY[i2];
      }
      if (ySum <= 0) {
        return;
      }
      var y = -lineBlockLengthY;
      var yId = 0;
      var yIdTotal = 0;
      var xId0 = 0;
      while (y < pSize.height) {
        if (yId % 2 === 0) {
          var symbolYId = yIdTotal / 2 % symbolArray.length;
          var x = 0;
          var xId1 = 0;
          var xId1Total = 0;
          while (x < pSize.width * 2) {
            var xSum = 0;
            for (var i2 = 0; i2 < dashArrayX[xId0].length; ++i2) {
              xSum += dashArrayX[xId0][i2];
            }
            if (xSum <= 0) {
              break;
            }
            if (xId1 % 2 === 0) {
              var size = (1 - decalOpt.symbolSize) * 0.5;
              var left = x + dashArrayX[xId0][xId1] * size;
              var top_1 = y + dashArrayY[yId] * size;
              var width = dashArrayX[xId0][xId1] * decalOpt.symbolSize;
              var height = dashArrayY[yId] * decalOpt.symbolSize;
              var symbolXId = xId1Total / 2 % symbolArray[symbolYId].length;
              brushSymbol(left, top_1, width, height, symbolArray[symbolYId][symbolXId]);
            }
            x += dashArrayX[xId0][xId1];
            ++xId1Total;
            ++xId1;
            if (xId1 === dashArrayX[xId0].length) {
              xId1 = 0;
            }
          }
          ++xId0;
          if (xId0 === dashArrayX.length) {
            xId0 = 0;
          }
        }
        y += dashArrayY[yId];
        ++yIdTotal;
        ++yId;
        if (yId === dashArrayY.length) {
          yId = 0;
        }
      }
      function brushSymbol(x2, y2, width2, height2, symbolType) {
        var scale2 = isSVG ? 1 : dpr;
        var symbol = createSymbol$1(symbolType, x2 * scale2, y2 * scale2, width2 * scale2, height2 * scale2, decalOpt.color, decalOpt.symbolKeepAspect);
        if (isSVG) {
          var symbolVNode = zr.painter.renderOneToVNode(symbol);
          if (symbolVNode) {
            svgRoot.children.push(symbolVNode);
          }
        } else {
          brushSingle(ctx, symbol);
        }
      }
    }
  }
}
function normalizeSymbolArray(symbol) {
  if (!symbol || symbol.length === 0) {
    return [["rect"]];
  }
  if (isString(symbol)) {
    return [[symbol]];
  }
  var isAllString = true;
  for (var i = 0; i < symbol.length; ++i) {
    if (!isString(symbol[i])) {
      isAllString = false;
      break;
    }
  }
  if (isAllString) {
    return normalizeSymbolArray([symbol]);
  }
  var result = [];
  for (var i = 0; i < symbol.length; ++i) {
    if (isString(symbol[i])) {
      result.push([symbol[i]]);
    } else {
      result.push(symbol[i]);
    }
  }
  return result;
}
function normalizeDashArrayX(dash) {
  if (!dash || dash.length === 0) {
    return [[0, 0]];
  }
  if (isNumber(dash)) {
    var dashValue = Math.ceil(dash);
    return [[dashValue, dashValue]];
  }
  var isAllNumber = true;
  for (var i = 0; i < dash.length; ++i) {
    if (!isNumber(dash[i])) {
      isAllNumber = false;
      break;
    }
  }
  if (isAllNumber) {
    return normalizeDashArrayX([dash]);
  }
  var result = [];
  for (var i = 0; i < dash.length; ++i) {
    if (isNumber(dash[i])) {
      var dashValue = Math.ceil(dash[i]);
      result.push([dashValue, dashValue]);
    } else {
      var dashValue = map$1(dash[i], function(n) {
        return Math.ceil(n);
      });
      if (dashValue.length % 2 === 1) {
        result.push(dashValue.concat(dashValue));
      } else {
        result.push(dashValue);
      }
    }
  }
  return result;
}
function normalizeDashArrayY(dash) {
  if (!dash || typeof dash === "object" && dash.length === 0) {
    return [0, 0];
  }
  if (isNumber(dash)) {
    var dashValue_1 = Math.ceil(dash);
    return [dashValue_1, dashValue_1];
  }
  var dashValue = map$1(dash, function(n) {
    return Math.ceil(n);
  });
  return dash.length % 2 ? dashValue.concat(dashValue) : dashValue;
}
function getLineBlockLengthX(dash) {
  return map$1(dash, function(line) {
    return getLineBlockLengthY(line);
  });
}
function getLineBlockLengthY(dash) {
  var blockLength = 0;
  for (var i = 0; i < dash.length; ++i) {
    blockLength += dash[i];
  }
  if (dash.length % 2 === 1) {
    return blockLength * 2;
  }
  return blockLength;
}
function decalVisual(ecModel, api) {
  ecModel.eachRawSeries(function(seriesModel) {
    if (ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }
    var data = seriesModel.getData();
    if (data.hasItemVisual()) {
      data.each(function(idx) {
        var decal2 = data.getItemVisual(idx, "decal");
        if (decal2) {
          var itemStyle = data.ensureUniqueItemVisual(idx, "style");
          itemStyle.decal = createOrUpdatePatternFromDecal(decal2, api);
        }
      });
    }
    var decal = data.getVisual("decal");
    if (decal) {
      var style = data.getVisual("style");
      style.decal = createOrUpdatePatternFromDecal(decal, api);
    }
  });
}
var lifecycle = new Eventful();
var implsStore = {};
function registerImpl(name, impl) {
  implsStore[name] = impl;
}
function getImpl(name) {
  return implsStore[name];
}
var TEST_FRAME_REMAIN_TIME = 1;
var PRIORITY_PROCESSOR_SERIES_FILTER = 800;
var PRIORITY_PROCESSOR_DATASTACK = 900;
var PRIORITY_PROCESSOR_FILTER = 1e3;
var PRIORITY_PROCESSOR_DEFAULT = 2e3;
var PRIORITY_PROCESSOR_STATISTIC = 5e3;
var PRIORITY_VISUAL_LAYOUT = 1e3;
var PRIORITY_VISUAL_PROGRESSIVE_LAYOUT = 1100;
var PRIORITY_VISUAL_GLOBAL = 2e3;
var PRIORITY_VISUAL_CHART = 3e3;
var PRIORITY_VISUAL_COMPONENT = 4e3;
var PRIORITY_VISUAL_CHART_DATA_CUSTOM = 4500;
var PRIORITY_VISUAL_POST_CHART_LAYOUT = 4600;
var PRIORITY_VISUAL_BRUSH = 5e3;
var PRIORITY_VISUAL_ARIA = 6e3;
var PRIORITY_VISUAL_DECAL = 7e3;
var PRIORITY = {
  PROCESSOR: {
    FILTER: PRIORITY_PROCESSOR_FILTER,
    SERIES_FILTER: PRIORITY_PROCESSOR_SERIES_FILTER,
    STATISTIC: PRIORITY_PROCESSOR_STATISTIC
  },
  VISUAL: {
    LAYOUT: PRIORITY_VISUAL_LAYOUT,
    PROGRESSIVE_LAYOUT: PRIORITY_VISUAL_PROGRESSIVE_LAYOUT,
    GLOBAL: PRIORITY_VISUAL_GLOBAL,
    CHART: PRIORITY_VISUAL_CHART,
    POST_CHART_LAYOUT: PRIORITY_VISUAL_POST_CHART_LAYOUT,
    COMPONENT: PRIORITY_VISUAL_COMPONENT,
    BRUSH: PRIORITY_VISUAL_BRUSH,
    CHART_ITEM: PRIORITY_VISUAL_CHART_DATA_CUSTOM,
    ARIA: PRIORITY_VISUAL_ARIA,
    DECAL: PRIORITY_VISUAL_DECAL
  }
};
var IN_MAIN_PROCESS_KEY = "__flagInMainProcess";
var MAIN_PROCESS_VERSION_KEY = "__mainProcessVersion";
var PENDING_UPDATE = "__pendingUpdate";
var STATUS_NEEDS_UPDATE_KEY = "__needsUpdateStatus";
var ACTION_REG = /^[a-zA-Z0-9_]+$/;
var CONNECT_STATUS_KEY = "__connectUpdateStatus";
var CONNECT_STATUS_PENDING = 0;
var CONNECT_STATUS_UPDATING = 1;
var CONNECT_STATUS_UPDATED = 2;
function createRegisterEventWithLowercaseECharts(method) {
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (this.isDisposed()) {
      disposedWarning(this.id);
      return;
    }
    return toLowercaseNameAndCallEventful(this, method, args);
  };
}
function createRegisterEventWithLowercaseMessageCenter(method) {
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return toLowercaseNameAndCallEventful(this, method, args);
  };
}
function toLowercaseNameAndCallEventful(host, method, args) {
  args[0] = args[0] && args[0].toLowerCase();
  return Eventful.prototype[method].apply(host, args);
}
var MessageCenter = (
  /** @class */
  function(_super) {
    __extends(MessageCenter2, _super);
    function MessageCenter2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    return MessageCenter2;
  }(Eventful)
);
var messageCenterProto = MessageCenter.prototype;
messageCenterProto.on = createRegisterEventWithLowercaseMessageCenter("on");
messageCenterProto.off = createRegisterEventWithLowercaseMessageCenter("off");
var prepare;
var prepareView;
var updateDirectly;
var updateMethods;
var doConvertPixel;
var updateStreamModes;
var doDispatchAction;
var flushPendingActions;
var triggerUpdatedEvent;
var bindRenderedEvent;
var bindMouseEvent;
var render;
var renderComponents;
var renderSeries;
var createExtensionAPI;
var enableConnect;
var markStatusToUpdate;
var applyChangedStates;
var updateMainProcessVersion;
var ECharts = (
  /** @class */
  function(_super) {
    __extends(ECharts2, _super);
    function ECharts2(dom, theme2, opts) {
      var _this = _super.call(this, new ECEventProcessor()) || this;
      _this._chartsViews = [];
      _this._chartsMap = {};
      _this._componentsViews = [];
      _this._componentsMap = {};
      _this._pendingActions = [];
      opts = opts || {};
      _this._dom = dom;
      var defaultRenderer = "canvas";
      var defaultCoarsePointer = "auto";
      var defaultUseDirtyRect = false;
      _this[MAIN_PROCESS_VERSION_KEY] = 1;
      if (opts.ssr) ;
      var zr = _this._zr = init$1(dom, {
        renderer: opts.renderer || defaultRenderer,
        devicePixelRatio: opts.devicePixelRatio,
        width: opts.width,
        height: opts.height,
        ssr: opts.ssr,
        useDirtyRect: retrieve2(opts.useDirtyRect, defaultUseDirtyRect),
        useCoarsePointer: retrieve2(opts.useCoarsePointer, defaultCoarsePointer),
        pointerSize: opts.pointerSize
      });
      _this._ssr = opts.ssr;
      _this._throttledZrFlush = throttle(bind$1(zr.flush, zr), 17);
      _this._updateTheme(theme2);
      _this._locale = createLocaleObject(opts.locale || SYSTEM_LANG);
      _this._coordSysMgr = new CoordinateSystemManager();
      var api = _this._api = createExtensionAPI(_this);
      function prioritySortFunc(a, b) {
        return a.__prio - b.__prio;
      }
      sort(visualFuncs, prioritySortFunc);
      sort(dataProcessorFuncs, prioritySortFunc);
      _this._scheduler = new Scheduler(_this, api, dataProcessorFuncs, visualFuncs);
      _this._messageCenter = new MessageCenter();
      _this._initEvents();
      _this.resize = bind$1(_this.resize, _this);
      zr.animation.on("frame", _this._onframe, _this);
      bindRenderedEvent(zr, _this);
      bindMouseEvent(zr, _this);
      setAsPrimitive(_this);
      return _this;
    }
    ECharts2.prototype._onframe = function() {
      if (this._disposed) {
        return;
      }
      applyChangedStates(this);
      var scheduler = this._scheduler;
      if (this[PENDING_UPDATE]) {
        var silent = this[PENDING_UPDATE].silent;
        this[IN_MAIN_PROCESS_KEY] = true;
        updateMainProcessVersion(this);
        try {
          prepare(this);
          updateMethods.update.call(this, null, this[PENDING_UPDATE].updateParams);
        } catch (e) {
          this[IN_MAIN_PROCESS_KEY] = false;
          this[PENDING_UPDATE] = null;
          throw e;
        }
        this._zr.flush();
        this[IN_MAIN_PROCESS_KEY] = false;
        this[PENDING_UPDATE] = null;
        flushPendingActions.call(this, silent);
        triggerUpdatedEvent.call(this, silent);
      } else if (scheduler.unfinished) {
        var remainTime = TEST_FRAME_REMAIN_TIME;
        var ecModel = this._model;
        var api = this._api;
        scheduler.unfinished = false;
        do {
          var startTime = +/* @__PURE__ */ new Date();
          scheduler.performSeriesTasks(ecModel);
          scheduler.performDataProcessorTasks(ecModel);
          updateStreamModes(this, ecModel);
          scheduler.performVisualTasks(ecModel);
          renderSeries(this, this._model, api, "remain", {});
          remainTime -= +/* @__PURE__ */ new Date() - startTime;
        } while (remainTime > 0 && scheduler.unfinished);
        if (!scheduler.unfinished) {
          this._zr.flush();
        }
      }
    };
    ECharts2.prototype.getDom = function() {
      return this._dom;
    };
    ECharts2.prototype.getId = function() {
      return this.id;
    };
    ECharts2.prototype.getZr = function() {
      return this._zr;
    };
    ECharts2.prototype.isSSR = function() {
      return this._ssr;
    };
    ECharts2.prototype.setOption = function(option, notMerge, lazyUpdate) {
      if (this[IN_MAIN_PROCESS_KEY]) {
        return;
      }
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var silent;
      var replaceMerge;
      var transitionOpt;
      if (isObject$2(notMerge)) {
        lazyUpdate = notMerge.lazyUpdate;
        silent = notMerge.silent;
        replaceMerge = notMerge.replaceMerge;
        transitionOpt = notMerge.transition;
        notMerge = notMerge.notMerge;
      }
      this[IN_MAIN_PROCESS_KEY] = true;
      updateMainProcessVersion(this);
      if (!this._model || notMerge) {
        var optionManager = new OptionManager(this._api);
        var theme2 = this._theme;
        var ecModel = this._model = new GlobalModel();
        ecModel.scheduler = this._scheduler;
        ecModel.ssr = this._ssr;
        ecModel.init(null, null, null, theme2, this._locale, optionManager);
      }
      this._model.setOption(option, {
        replaceMerge
      }, optionPreprocessorFuncs);
      var updateParams = {
        seriesTransition: transitionOpt,
        optionChanged: true
      };
      if (lazyUpdate) {
        this[PENDING_UPDATE] = {
          silent,
          updateParams
        };
        this[IN_MAIN_PROCESS_KEY] = false;
        this.getZr().wakeUp();
      } else {
        try {
          prepare(this);
          updateMethods.update.call(this, null, updateParams);
        } catch (e) {
          this[PENDING_UPDATE] = null;
          this[IN_MAIN_PROCESS_KEY] = false;
          throw e;
        }
        if (!this._ssr) {
          this._zr.flush();
        }
        this[PENDING_UPDATE] = null;
        this[IN_MAIN_PROCESS_KEY] = false;
        flushPendingActions.call(this, silent);
        triggerUpdatedEvent.call(this, silent);
      }
    };
    ECharts2.prototype.setTheme = function(theme2, opts) {
      if (this[IN_MAIN_PROCESS_KEY]) {
        return;
      }
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var ecModel = this._model;
      if (!ecModel) {
        return;
      }
      var silent = opts && opts.silent;
      var updateParams = null;
      if (this[PENDING_UPDATE]) {
        if (silent == null) {
          silent = this[PENDING_UPDATE].silent;
        }
        updateParams = this[PENDING_UPDATE].updateParams;
        this[PENDING_UPDATE] = null;
      }
      this[IN_MAIN_PROCESS_KEY] = true;
      updateMainProcessVersion(this);
      try {
        this._updateTheme(theme2);
        ecModel.setTheme(this._theme);
        prepare(this);
        updateMethods.update.call(this, {
          type: "setTheme"
        }, updateParams);
      } catch (e) {
        this[IN_MAIN_PROCESS_KEY] = false;
        throw e;
      }
      this[IN_MAIN_PROCESS_KEY] = false;
      flushPendingActions.call(this, silent);
      triggerUpdatedEvent.call(this, silent);
    };
    ECharts2.prototype._updateTheme = function(theme2) {
      if (isString(theme2)) {
        theme2 = themeStorage[theme2];
      }
      if (theme2) {
        theme2 = clone$1(theme2);
        theme2 && globalBackwardCompat(theme2, true);
        this._theme = theme2;
      }
    };
    ECharts2.prototype.getModel = function() {
      return this._model;
    };
    ECharts2.prototype.getOption = function() {
      return this._model && this._model.getOption();
    };
    ECharts2.prototype.getWidth = function() {
      return this._zr.getWidth();
    };
    ECharts2.prototype.getHeight = function() {
      return this._zr.getHeight();
    };
    ECharts2.prototype.getDevicePixelRatio = function() {
      return this._zr.painter.dpr || env.hasGlobalWindow && window.devicePixelRatio || 1;
    };
    ECharts2.prototype.getRenderedCanvas = function(opts) {
      return this.renderToCanvas(opts);
    };
    ECharts2.prototype.renderToCanvas = function(opts) {
      opts = opts || {};
      var painter = this._zr.painter;
      return painter.getRenderedCanvas({
        backgroundColor: opts.backgroundColor || this._model.get("backgroundColor"),
        pixelRatio: opts.pixelRatio || this.getDevicePixelRatio()
      });
    };
    ECharts2.prototype.renderToSVGString = function(opts) {
      opts = opts || {};
      var painter = this._zr.painter;
      return painter.renderToString({
        useViewBox: opts.useViewBox
      });
    };
    ECharts2.prototype.getSvgDataURL = function() {
      var zr = this._zr;
      var list = zr.storage.getDisplayList();
      each$4(list, function(el) {
        el.stopAnimation(null, true);
      });
      return zr.painter.toDataURL();
    };
    ECharts2.prototype.getDataURL = function(opts) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      opts = opts || {};
      var excludeComponents = opts.excludeComponents;
      var ecModel = this._model;
      var excludesComponentViews = [];
      var self = this;
      each$4(excludeComponents, function(componentType) {
        ecModel.eachComponent({
          mainType: componentType
        }, function(component) {
          var view = self._componentsMap[component.__viewId];
          if (!view.group.ignore) {
            excludesComponentViews.push(view);
            view.group.ignore = true;
          }
        });
      });
      var url = this._zr.painter.getType() === "svg" ? this.getSvgDataURL() : this.renderToCanvas(opts).toDataURL("image/" + (opts && opts.type || "png"));
      each$4(excludesComponentViews, function(view) {
        view.group.ignore = false;
      });
      return url;
    };
    ECharts2.prototype.getConnectedDataURL = function(opts) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var isSvg = opts.type === "svg";
      var groupId = this.group;
      var mathMin2 = Math.min;
      var mathMax2 = Math.max;
      var MAX_NUMBER = Infinity;
      if (connectedGroups[groupId]) {
        var left_1 = MAX_NUMBER;
        var top_1 = MAX_NUMBER;
        var right_1 = -MAX_NUMBER;
        var bottom_1 = -MAX_NUMBER;
        var canvasList_1 = [];
        var dpr_1 = opts && opts.pixelRatio || this.getDevicePixelRatio();
        each$4(instances, function(chart, id) {
          if (chart.group === groupId) {
            var canvas = isSvg ? chart.getZr().painter.getSvgDom().innerHTML : chart.renderToCanvas(clone$1(opts));
            var boundingRect = chart.getDom().getBoundingClientRect();
            left_1 = mathMin2(boundingRect.left, left_1);
            top_1 = mathMin2(boundingRect.top, top_1);
            right_1 = mathMax2(boundingRect.right, right_1);
            bottom_1 = mathMax2(boundingRect.bottom, bottom_1);
            canvasList_1.push({
              dom: canvas,
              left: boundingRect.left,
              top: boundingRect.top
            });
          }
        });
        left_1 *= dpr_1;
        top_1 *= dpr_1;
        right_1 *= dpr_1;
        bottom_1 *= dpr_1;
        var width = right_1 - left_1;
        var height = bottom_1 - top_1;
        var targetCanvas = platformApi.createCanvas();
        var zr_1 = init$1(targetCanvas, {
          renderer: isSvg ? "svg" : "canvas"
        });
        zr_1.resize({
          width,
          height
        });
        if (isSvg) {
          var content_1 = "";
          each$4(canvasList_1, function(item) {
            var x = item.left - left_1;
            var y = item.top - top_1;
            content_1 += '<g transform="translate(' + x + "," + y + ')">' + item.dom + "</g>";
          });
          zr_1.painter.getSvgRoot().innerHTML = content_1;
          if (opts.connectedBackgroundColor) {
            zr_1.painter.setBackgroundColor(opts.connectedBackgroundColor);
          }
          zr_1.refreshImmediately();
          return zr_1.painter.toDataURL();
        } else {
          if (opts.connectedBackgroundColor) {
            zr_1.add(new Rect({
              shape: {
                x: 0,
                y: 0,
                width,
                height
              },
              style: {
                fill: opts.connectedBackgroundColor
              }
            }));
          }
          each$4(canvasList_1, function(item) {
            var img = new ZRImage({
              style: {
                x: item.left * dpr_1 - left_1,
                y: item.top * dpr_1 - top_1,
                image: item.dom
              }
            });
            zr_1.add(img);
          });
          zr_1.refreshImmediately();
          return targetCanvas.toDataURL("image/" + (opts && opts.type || "png"));
        }
      } else {
        return this.getDataURL(opts);
      }
    };
    ECharts2.prototype.convertToPixel = function(finder, value, opt) {
      return doConvertPixel(this, "convertToPixel", finder, value, opt);
    };
    ECharts2.prototype.convertToLayout = function(finder, value, opt) {
      return doConvertPixel(this, "convertToLayout", finder, value, opt);
    };
    ECharts2.prototype.convertFromPixel = function(finder, value, opt) {
      return doConvertPixel(this, "convertFromPixel", finder, value, opt);
    };
    ECharts2.prototype.containPixel = function(finder, value) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var ecModel = this._model;
      var result;
      var findResult = parseFinder(ecModel, finder);
      each$4(findResult, function(models, key) {
        key.indexOf("Models") >= 0 && each$4(models, function(model) {
          var coordSys = model.coordinateSystem;
          if (coordSys && coordSys.containPoint) {
            result = result || !!coordSys.containPoint(value);
          } else if (key === "seriesModels") {
            var view = this._chartsMap[model.__viewId];
            if (view && view.containPoint) {
              result = result || view.containPoint(value, model);
            }
          } else ;
        }, this);
      }, this);
      return !!result;
    };
    ECharts2.prototype.getVisual = function(finder, visualType) {
      var ecModel = this._model;
      var parsedFinder = parseFinder(ecModel, finder, {
        defaultMainType: "series"
      });
      var seriesModel = parsedFinder.seriesModel;
      var data = seriesModel.getData();
      var dataIndexInside = parsedFinder.hasOwnProperty("dataIndexInside") ? parsedFinder.dataIndexInside : parsedFinder.hasOwnProperty("dataIndex") ? data.indexOfRawIndex(parsedFinder.dataIndex) : null;
      return dataIndexInside != null ? getItemVisualFromData(data, dataIndexInside, visualType) : getVisualFromData(data, visualType);
    };
    ECharts2.prototype.getViewOfComponentModel = function(componentModel) {
      return this._componentsMap[componentModel.__viewId];
    };
    ECharts2.prototype.getViewOfSeriesModel = function(seriesModel) {
      return this._chartsMap[seriesModel.__viewId];
    };
    ECharts2.prototype._initEvents = function() {
      var _this = this;
      each$4(MOUSE_EVENT_NAMES, function(eveName) {
        var handler = function(e) {
          var ecModel = _this.getModel();
          var el = e.target;
          var params;
          var isGlobalOut = eveName === "globalout";
          if (isGlobalOut) {
            params = {};
          } else {
            el && findEventDispatcher(el, function(parent) {
              var ecData = getECData(parent);
              if (ecData && ecData.dataIndex != null) {
                var dataModel = ecData.dataModel || ecModel.getSeriesByIndex(ecData.seriesIndex);
                params = dataModel && dataModel.getDataParams(ecData.dataIndex, ecData.dataType, el) || {};
                return true;
              } else if (ecData.eventData) {
                params = extend({}, ecData.eventData);
                return true;
              }
            }, true);
          }
          if (params) {
            var componentType = params.componentType;
            var componentIndex = params.componentIndex;
            if (componentType === "markLine" || componentType === "markPoint" || componentType === "markArea") {
              componentType = "series";
              componentIndex = params.seriesIndex;
            }
            var model = componentType && componentIndex != null && ecModel.getComponent(componentType, componentIndex);
            var view = model && _this[model.mainType === "series" ? "_chartsMap" : "_componentsMap"][model.__viewId];
            params.event = e;
            params.type = eveName;
            _this._$eventProcessor.eventInfo = {
              targetEl: el,
              packedEvent: params,
              model,
              view
            };
            _this.trigger(eveName, params);
          }
        };
        handler.zrEventfulCallAtLast = true;
        _this._zr.on(eveName, handler, _this);
      });
      var messageCenter = this._messageCenter;
      each$4(publicEventTypeMap, function(_, eventType) {
        messageCenter.on(eventType, function(event) {
          _this.trigger(eventType, event);
        });
      });
      handleLegacySelectEvents(messageCenter, this, this._api);
    };
    ECharts2.prototype.isDisposed = function() {
      return this._disposed;
    };
    ECharts2.prototype.clear = function() {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      this.setOption({
        series: []
      }, true);
    };
    ECharts2.prototype.dispose = function() {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      this._disposed = true;
      var dom = this.getDom();
      if (dom) {
        setAttribute(this.getDom(), DOM_ATTRIBUTE_KEY, "");
      }
      var chart = this;
      var api = chart._api;
      var ecModel = chart._model;
      each$4(chart._componentsViews, function(component) {
        component.dispose(ecModel, api);
      });
      each$4(chart._chartsViews, function(chart2) {
        chart2.dispose(ecModel, api);
      });
      chart._zr.dispose();
      chart._dom = chart._model = chart._chartsMap = chart._componentsMap = chart._chartsViews = chart._componentsViews = chart._scheduler = chart._api = chart._zr = chart._throttledZrFlush = chart._theme = chart._coordSysMgr = chart._messageCenter = null;
      delete instances[chart.id];
    };
    ECharts2.prototype.resize = function(opts) {
      if (this[IN_MAIN_PROCESS_KEY]) {
        return;
      }
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      this._zr.resize(opts);
      var ecModel = this._model;
      this._loadingFX && this._loadingFX.resize();
      if (!ecModel) {
        return;
      }
      var needPrepare = ecModel.resetOption("media");
      var silent = opts && opts.silent;
      if (this[PENDING_UPDATE]) {
        if (silent == null) {
          silent = this[PENDING_UPDATE].silent;
        }
        needPrepare = true;
        this[PENDING_UPDATE] = null;
      }
      this[IN_MAIN_PROCESS_KEY] = true;
      updateMainProcessVersion(this);
      try {
        needPrepare && prepare(this);
        updateMethods.update.call(this, {
          type: "resize",
          animation: extend({
            // Disable animation
            duration: 0
          }, opts && opts.animation)
        });
      } catch (e) {
        this[IN_MAIN_PROCESS_KEY] = false;
        throw e;
      }
      this[IN_MAIN_PROCESS_KEY] = false;
      flushPendingActions.call(this, silent);
      triggerUpdatedEvent.call(this, silent);
    };
    ECharts2.prototype.showLoading = function(name, cfg) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      if (isObject$2(name)) {
        cfg = name;
        name = "";
      }
      name = name || "default";
      this.hideLoading();
      if (!loadingEffects[name]) {
        return;
      }
      var el = loadingEffects[name](this._api, cfg);
      var zr = this._zr;
      this._loadingFX = el;
      zr.add(el);
    };
    ECharts2.prototype.hideLoading = function() {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      this._loadingFX && this._zr.remove(this._loadingFX);
      this._loadingFX = null;
    };
    ECharts2.prototype.makeActionFromEvent = function(eventObj) {
      var payload = extend({}, eventObj);
      payload.type = connectionEventRevertMap[eventObj.type];
      return payload;
    };
    ECharts2.prototype.dispatchAction = function(payload, opt) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      if (!isObject$2(opt)) {
        opt = {
          silent: !!opt
        };
      }
      if (!actions[payload.type]) {
        return;
      }
      if (!this._model) {
        return;
      }
      if (this[IN_MAIN_PROCESS_KEY]) {
        this._pendingActions.push(payload);
        return;
      }
      var silent = opt.silent;
      doDispatchAction.call(this, payload, silent);
      var flush = opt.flush;
      if (flush) {
        this._zr.flush();
      } else if (flush !== false && env.browser.weChat) {
        this._throttledZrFlush();
      }
      flushPendingActions.call(this, silent);
      triggerUpdatedEvent.call(this, silent);
    };
    ECharts2.prototype.updateLabelLayout = function() {
      lifecycle.trigger("series:layoutlabels", this._model, this._api, {
        // Not adding series labels.
        // TODO
        updatedSeries: []
      });
    };
    ECharts2.prototype.appendData = function(params) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var seriesIndex = params.seriesIndex;
      var ecModel = this.getModel();
      var seriesModel = ecModel.getSeriesByIndex(seriesIndex);
      seriesModel.appendData(params);
      this._scheduler.unfinished = true;
      this.getZr().wakeUp();
    };
    ECharts2.internalField = function() {
      prepare = function(ecIns) {
        var scheduler = ecIns._scheduler;
        scheduler.restorePipelines(ecIns._model);
        scheduler.prepareStageTasks();
        prepareView(ecIns, true);
        prepareView(ecIns, false);
        scheduler.plan();
      };
      prepareView = function(ecIns, isComponent) {
        var ecModel = ecIns._model;
        var scheduler = ecIns._scheduler;
        var viewList = isComponent ? ecIns._componentsViews : ecIns._chartsViews;
        var viewMap = isComponent ? ecIns._componentsMap : ecIns._chartsMap;
        var zr = ecIns._zr;
        var api = ecIns._api;
        for (var i = 0; i < viewList.length; i++) {
          viewList[i].__alive = false;
        }
        isComponent ? ecModel.eachComponent(function(componentType, model) {
          componentType !== "series" && doPrepare(model);
        }) : ecModel.eachSeries(doPrepare);
        function doPrepare(model) {
          var requireNewView = model.__requireNewView;
          model.__requireNewView = false;
          var viewId = "_ec_" + model.id + "_" + model.type;
          var view2 = !requireNewView && viewMap[viewId];
          if (!view2) {
            var classType = parseClassType(model.type);
            var Clazz = isComponent ? ComponentView.getClass(classType.main, classType.sub) : (
              // FIXME:TS
              // (ChartView as ChartViewConstructor).getClass('series', classType.sub)
              // For backward compat, still support a chart type declared as only subType
              // like "liquidfill", but recommend "series.liquidfill"
              // But need a base class to make a type series.
              ChartView.getClass(classType.sub)
            );
            view2 = new Clazz();
            view2.init(ecModel, api);
            viewMap[viewId] = view2;
            viewList.push(view2);
            zr.add(view2.group);
          }
          model.__viewId = view2.__id = viewId;
          view2.__alive = true;
          view2.__model = model;
          view2.group.__ecComponentInfo = {
            mainType: model.mainType,
            index: model.componentIndex
          };
          !isComponent && scheduler.prepareView(view2, model, ecModel, api);
        }
        for (var i = 0; i < viewList.length; ) {
          var view = viewList[i];
          if (!view.__alive) {
            !isComponent && view.renderTask.dispose();
            zr.remove(view.group);
            view.dispose(ecModel, api);
            viewList.splice(i, 1);
            if (viewMap[view.__id] === view) {
              delete viewMap[view.__id];
            }
            view.__id = view.group.__ecComponentInfo = null;
          } else {
            i++;
          }
        }
      };
      updateDirectly = function(ecIns, method, payload, mainType, subType) {
        var ecModel = ecIns._model;
        ecModel.setUpdatePayload(payload);
        if (!mainType) {
          each$4([].concat(ecIns._componentsViews).concat(ecIns._chartsViews), callView);
          return;
        }
        var query = {};
        query[mainType + "Id"] = payload[mainType + "Id"];
        query[mainType + "Index"] = payload[mainType + "Index"];
        query[mainType + "Name"] = payload[mainType + "Name"];
        var condition = {
          mainType,
          query
        };
        subType && (condition.subType = subType);
        var excludeSeriesId = payload.excludeSeriesId;
        var excludeSeriesIdMap;
        if (excludeSeriesId != null) {
          excludeSeriesIdMap = createHashMap();
          each$4(normalizeToArray(excludeSeriesId), function(id) {
            var modelId = convertOptionIdName(id, null);
            if (modelId != null) {
              excludeSeriesIdMap.set(modelId, true);
            }
          });
        }
        ecModel && ecModel.eachComponent(condition, function(model) {
          var isExcluded = excludeSeriesIdMap && excludeSeriesIdMap.get(model.id) != null;
          if (isExcluded) {
            return;
          }
          if (isHighDownPayload(payload)) {
            if (model instanceof SeriesModel) {
              if (payload.type === HIGHLIGHT_ACTION_TYPE && !payload.notBlur && !model.get(["emphasis", "disabled"])) {
                blurSeriesFromHighlightPayload(model, payload, ecIns._api);
              }
            } else {
              var _a2 = findComponentHighDownDispatchers(model.mainType, model.componentIndex, payload.name, ecIns._api), focusSelf = _a2.focusSelf, dispatchers = _a2.dispatchers;
              if (payload.type === HIGHLIGHT_ACTION_TYPE && focusSelf && !payload.notBlur) {
                blurComponent(model.mainType, model.componentIndex, ecIns._api);
              }
              if (dispatchers) {
                each$4(dispatchers, function(dispatcher) {
                  payload.type === HIGHLIGHT_ACTION_TYPE ? enterEmphasis(dispatcher) : leaveEmphasis(dispatcher);
                });
              }
            }
          } else if (isSelectChangePayload(payload)) {
            if (model instanceof SeriesModel) {
              toggleSelectionFromPayload(model, payload, ecIns._api);
              updateSeriesElementSelection(model);
              markStatusToUpdate(ecIns);
            }
          }
        }, ecIns);
        ecModel && ecModel.eachComponent(condition, function(model) {
          var isExcluded = excludeSeriesIdMap && excludeSeriesIdMap.get(model.id) != null;
          if (isExcluded) {
            return;
          }
          callView(ecIns[mainType === "series" ? "_chartsMap" : "_componentsMap"][model.__viewId]);
        }, ecIns);
        function callView(view) {
          view && view.__alive && view[method] && view[method](view.__model, ecModel, ecIns._api, payload);
        }
      };
      updateMethods = {
        prepareAndUpdate: function(payload) {
          prepare(this);
          updateMethods.update.call(this, payload, payload && {
            // Needs to mark option changed if newOption is given.
            // It's from MagicType.
            // TODO If use a separate flag optionChanged in payload?
            optionChanged: payload.newOption != null
          });
        },
        update: function(payload, updateParams) {
          var ecModel = this._model;
          var api = this._api;
          var zr = this._zr;
          var coordSysMgr = this._coordSysMgr;
          var scheduler = this._scheduler;
          if (!ecModel) {
            return;
          }
          ecModel.setUpdatePayload(payload);
          scheduler.restoreData(ecModel, payload);
          scheduler.performSeriesTasks(ecModel);
          coordSysMgr.create(ecModel, api);
          scheduler.performDataProcessorTasks(ecModel, payload);
          updateStreamModes(this, ecModel);
          coordSysMgr.update(ecModel, api);
          clearColorPalette(ecModel);
          scheduler.performVisualTasks(ecModel, payload);
          var backgroundColor2 = ecModel.get("backgroundColor") || "transparent";
          zr.setBackgroundColor(backgroundColor2);
          var darkMode = ecModel.get("darkMode");
          if (darkMode != null && darkMode !== "auto") {
            zr.setDarkMode(darkMode);
          }
          render(this, ecModel, api, payload, updateParams);
          lifecycle.trigger("afterupdate", ecModel, api);
        },
        updateTransform: function(payload) {
          var _this = this;
          var ecModel = this._model;
          var api = this._api;
          if (!ecModel) {
            return;
          }
          ecModel.setUpdatePayload(payload);
          var componentDirtyList = [];
          ecModel.eachComponent(function(componentType, componentModel) {
            if (componentType === "series") {
              return;
            }
            var componentView = _this.getViewOfComponentModel(componentModel);
            if (componentView && componentView.__alive) {
              if (componentView.updateTransform) {
                var result = componentView.updateTransform(componentModel, ecModel, api, payload);
                result && result.update && componentDirtyList.push(componentView);
              } else {
                componentDirtyList.push(componentView);
              }
            }
          });
          var seriesDirtyMap = createHashMap();
          ecModel.eachSeries(function(seriesModel) {
            var chartView = _this._chartsMap[seriesModel.__viewId];
            if (chartView.updateTransform) {
              var result = chartView.updateTransform(seriesModel, ecModel, api, payload);
              result && result.update && seriesDirtyMap.set(seriesModel.uid, 1);
            } else {
              seriesDirtyMap.set(seriesModel.uid, 1);
            }
          });
          clearColorPalette(ecModel);
          this._scheduler.performVisualTasks(ecModel, payload, {
            setDirty: true,
            dirtyMap: seriesDirtyMap
          });
          renderSeries(this, ecModel, api, payload, {}, seriesDirtyMap);
          lifecycle.trigger("afterupdate", ecModel, api);
        },
        updateView: function(payload) {
          var ecModel = this._model;
          if (!ecModel) {
            return;
          }
          ecModel.setUpdatePayload(payload);
          ChartView.markUpdateMethod(payload, "updateView");
          clearColorPalette(ecModel);
          this._scheduler.performVisualTasks(ecModel, payload, {
            setDirty: true
          });
          render(this, ecModel, this._api, payload, {});
          lifecycle.trigger("afterupdate", ecModel, this._api);
        },
        updateVisual: function(payload) {
          var _this = this;
          var ecModel = this._model;
          if (!ecModel) {
            return;
          }
          ecModel.setUpdatePayload(payload);
          ecModel.eachSeries(function(seriesModel) {
            seriesModel.getData().clearAllVisual();
          });
          ChartView.markUpdateMethod(payload, "updateVisual");
          clearColorPalette(ecModel);
          this._scheduler.performVisualTasks(ecModel, payload, {
            visualType: "visual",
            setDirty: true
          });
          ecModel.eachComponent(function(componentType, componentModel) {
            if (componentType !== "series") {
              var componentView = _this.getViewOfComponentModel(componentModel);
              componentView && componentView.__alive && componentView.updateVisual(componentModel, ecModel, _this._api, payload);
            }
          });
          ecModel.eachSeries(function(seriesModel) {
            var chartView = _this._chartsMap[seriesModel.__viewId];
            chartView.updateVisual(seriesModel, ecModel, _this._api, payload);
          });
          lifecycle.trigger("afterupdate", ecModel, this._api);
        },
        updateLayout: function(payload) {
          updateMethods.update.call(this, payload);
        }
      };
      function doConvertPixelImpl(ecIns, methodName, finder, value, opt) {
        if (ecIns._disposed) {
          disposedWarning(ecIns.id);
          return;
        }
        var ecModel = ecIns._model;
        var coordSysList = ecIns._coordSysMgr.getCoordinateSystems();
        var result;
        var parsedFinder = parseFinder(ecModel, finder);
        for (var i = 0; i < coordSysList.length; i++) {
          var coordSys = coordSysList[i];
          if (coordSys[methodName] && (result = coordSys[methodName](ecModel, parsedFinder, value, opt)) != null) {
            return result;
          }
        }
      }
      doConvertPixel = doConvertPixelImpl;
      updateStreamModes = function(ecIns, ecModel) {
        var chartsMap = ecIns._chartsMap;
        var scheduler = ecIns._scheduler;
        ecModel.eachSeries(function(seriesModel) {
          scheduler.updateStreamModes(seriesModel, chartsMap[seriesModel.__viewId]);
        });
      };
      doDispatchAction = function(payload, silent) {
        var _this = this;
        var ecModel = this.getModel();
        var payloadType = payload.type;
        var escapeConnect = payload.escapeConnect;
        var actionInfo = actions[payloadType];
        var cptTypeTmp = (actionInfo.update || "update").split(":");
        var updateMethod = cptTypeTmp.pop();
        var cptType = cptTypeTmp[0] != null && parseClassType(cptTypeTmp[0]);
        this[IN_MAIN_PROCESS_KEY] = true;
        updateMainProcessVersion(this);
        var payloads = [payload];
        var batched = false;
        if (payload.batch) {
          batched = true;
          payloads = map$1(payload.batch, function(item) {
            item = defaults(extend({}, item), payload);
            item.batch = null;
            return item;
          });
        }
        var eventObjBatch = [];
        var eventObj;
        var actionResultBatch = [];
        var nonRefinedEventType = actionInfo.nonRefinedEventType;
        var isSelectChange = isSelectChangePayload(payload);
        var isHighDown = isHighDownPayload(payload);
        if (isHighDown) {
          allLeaveBlur(this._api);
        }
        each$4(payloads, function(batchItem) {
          var actionResult = actionInfo.action(batchItem, ecModel, _this._api);
          if (actionInfo.refineEvent) {
            actionResultBatch.push(actionResult);
          } else {
            eventObj = actionResult;
          }
          eventObj = eventObj || extend({}, batchItem);
          eventObj.type = nonRefinedEventType;
          eventObjBatch.push(eventObj);
          if (isHighDown) {
            var _a2 = preParseFinder(payload), queryOptionMap = _a2.queryOptionMap, mainTypeSpecified = _a2.mainTypeSpecified;
            var componentMainType = mainTypeSpecified ? queryOptionMap.keys()[0] : "series";
            updateDirectly(_this, updateMethod, batchItem, componentMainType);
            markStatusToUpdate(_this);
          } else if (isSelectChange) {
            updateDirectly(_this, updateMethod, batchItem, "series");
            markStatusToUpdate(_this);
          } else if (cptType) {
            updateDirectly(_this, updateMethod, batchItem, cptType.main, cptType.sub);
          }
        });
        if (updateMethod !== "none" && !isHighDown && !isSelectChange && !cptType) {
          try {
            if (this[PENDING_UPDATE]) {
              prepare(this);
              updateMethods.update.call(this, payload);
              this[PENDING_UPDATE] = null;
            } else {
              updateMethods[updateMethod].call(this, payload);
            }
          } catch (e) {
            this[IN_MAIN_PROCESS_KEY] = false;
            throw e;
          }
        }
        if (batched) {
          eventObj = {
            type: nonRefinedEventType,
            escapeConnect,
            batch: eventObjBatch
          };
        } else {
          eventObj = eventObjBatch[0];
        }
        this[IN_MAIN_PROCESS_KEY] = false;
        if (!silent) {
          var refinedEvent = void 0;
          if (actionInfo.refineEvent) {
            var eventContent = actionInfo.refineEvent(actionResultBatch, payload, ecModel, this._api).eventContent;
            assert(isObject$2(eventContent));
            refinedEvent = defaults({
              type: actionInfo.refinedEventType
            }, eventContent);
            refinedEvent.fromAction = payload.type;
            refinedEvent.fromActionPayload = payload;
            refinedEvent.escapeConnect = true;
          }
          var messageCenter = this._messageCenter;
          messageCenter.trigger(eventObj.type, eventObj);
          if (refinedEvent) {
            messageCenter.trigger(refinedEvent.type, refinedEvent);
          }
        }
      };
      flushPendingActions = function(silent) {
        var pendingActions = this._pendingActions;
        while (pendingActions.length) {
          var payload = pendingActions.shift();
          doDispatchAction.call(this, payload, silent);
        }
      };
      triggerUpdatedEvent = function(silent) {
        !silent && this.trigger("updated");
      };
      bindRenderedEvent = function(zr, ecIns) {
        zr.on("rendered", function(params) {
          ecIns.trigger("rendered", params);
          if (
            // Although zr is dirty if initial animation is not finished
            // and this checking is called on frame, we also check
            // animation finished for robustness.
            zr.animation.isFinished() && !ecIns[PENDING_UPDATE] && !ecIns._scheduler.unfinished && !ecIns._pendingActions.length
          ) {
            ecIns.trigger("finished");
          }
        });
      };
      bindMouseEvent = function(zr, ecIns) {
        zr.on("mouseover", function(e) {
          var el = e.target;
          var dispatcher = findEventDispatcher(el, isHighDownDispatcher);
          if (dispatcher) {
            handleGlobalMouseOverForHighDown(dispatcher, e, ecIns._api);
            markStatusToUpdate(ecIns);
          }
        }).on("mouseout", function(e) {
          var el = e.target;
          var dispatcher = findEventDispatcher(el, isHighDownDispatcher);
          if (dispatcher) {
            handleGlobalMouseOutForHighDown(dispatcher, e, ecIns._api);
            markStatusToUpdate(ecIns);
          }
        }).on("click", function(e) {
          var el = e.target;
          var dispatcher = findEventDispatcher(el, function(target) {
            return getECData(target).dataIndex != null;
          }, true);
          if (dispatcher) {
            var actionType = dispatcher.selected ? "unselect" : "select";
            var ecData = getECData(dispatcher);
            ecIns._api.dispatchAction({
              type: actionType,
              dataType: ecData.dataType,
              dataIndexInside: ecData.dataIndex,
              seriesIndex: ecData.seriesIndex,
              isFromClick: true
            });
          }
        });
      };
      function clearColorPalette(ecModel) {
        ecModel.clearColorPalette();
        ecModel.eachSeries(function(seriesModel) {
          seriesModel.clearColorPalette();
        });
      }
      function allocateZlevels(ecModel) {
        var componentZLevels = [];
        var seriesZLevels = [];
        var hasSeparateZLevel = false;
        ecModel.eachComponent(function(componentType, componentModel) {
          var zlevel = componentModel.get("zlevel") || 0;
          var z = componentModel.get("z") || 0;
          var zlevelKey = componentModel.getZLevelKey();
          hasSeparateZLevel = hasSeparateZLevel || !!zlevelKey;
          (componentType === "series" ? seriesZLevels : componentZLevels).push({
            zlevel,
            z,
            idx: componentModel.componentIndex,
            type: componentType,
            key: zlevelKey
          });
        });
        if (hasSeparateZLevel) {
          var zLevels = componentZLevels.concat(seriesZLevels);
          var lastSeriesZLevel_1;
          var lastSeriesKey_1;
          sort(zLevels, function(a, b) {
            if (a.zlevel === b.zlevel) {
              return a.z - b.z;
            }
            return a.zlevel - b.zlevel;
          });
          each$4(zLevels, function(item) {
            var componentModel = ecModel.getComponent(item.type, item.idx);
            var zlevel = item.zlevel;
            var key = item.key;
            if (lastSeriesZLevel_1 != null) {
              zlevel = Math.max(lastSeriesZLevel_1, zlevel);
            }
            if (key) {
              if (zlevel === lastSeriesZLevel_1 && key !== lastSeriesKey_1) {
                zlevel++;
              }
              lastSeriesKey_1 = key;
            } else if (lastSeriesKey_1) {
              if (zlevel === lastSeriesZLevel_1) {
                zlevel++;
              }
              lastSeriesKey_1 = "";
            }
            lastSeriesZLevel_1 = zlevel;
            componentModel.setZLevel(zlevel);
          });
        }
      }
      render = function(ecIns, ecModel, api, payload, updateParams) {
        allocateZlevels(ecModel);
        renderComponents(ecIns, ecModel, api, payload, updateParams);
        each$4(ecIns._chartsViews, function(chart) {
          chart.__alive = false;
        });
        renderSeries(ecIns, ecModel, api, payload, updateParams);
        each$4(ecIns._chartsViews, function(chart) {
          if (!chart.__alive) {
            chart.remove(ecModel, api);
          }
        });
      };
      renderComponents = function(ecIns, ecModel, api, payload, updateParams, dirtyList) {
        each$4(dirtyList || ecIns._componentsViews, function(componentView) {
          var componentModel = componentView.__model;
          clearStates(componentModel, componentView);
          componentView.render(componentModel, ecModel, api, payload);
          updateZ(componentModel, componentView);
          updateStates(componentModel, componentView);
        });
      };
      renderSeries = function(ecIns, ecModel, api, payload, updateParams, dirtyMap) {
        var scheduler = ecIns._scheduler;
        updateParams = extend(updateParams || {}, {
          updatedSeries: ecModel.getSeries()
        });
        lifecycle.trigger("series:beforeupdate", ecModel, api, updateParams);
        var unfinished = false;
        ecModel.eachSeries(function(seriesModel) {
          var chartView = ecIns._chartsMap[seriesModel.__viewId];
          chartView.__alive = true;
          var renderTask = chartView.renderTask;
          scheduler.updatePayload(renderTask, payload);
          clearStates(seriesModel, chartView);
          if (dirtyMap && dirtyMap.get(seriesModel.uid)) {
            renderTask.dirty();
          }
          if (renderTask.perform(scheduler.getPerformArgs(renderTask))) {
            unfinished = true;
          }
          chartView.group.silent = !!seriesModel.get("silent");
          updateBlend(seriesModel, chartView);
          updateSeriesElementSelection(seriesModel);
        });
        scheduler.unfinished = unfinished || scheduler.unfinished;
        lifecycle.trigger("series:layoutlabels", ecModel, api, updateParams);
        lifecycle.trigger("series:transition", ecModel, api, updateParams);
        ecModel.eachSeries(function(seriesModel) {
          var chartView = ecIns._chartsMap[seriesModel.__viewId];
          updateZ(seriesModel, chartView);
          updateStates(seriesModel, chartView);
        });
        updateHoverLayerStatus(ecIns, ecModel);
        lifecycle.trigger("series:afterupdate", ecModel, api, updateParams);
      };
      markStatusToUpdate = function(ecIns) {
        ecIns[STATUS_NEEDS_UPDATE_KEY] = true;
        ecIns.getZr().wakeUp();
      };
      updateMainProcessVersion = function(ecIns) {
        ecIns[MAIN_PROCESS_VERSION_KEY] = (ecIns[MAIN_PROCESS_VERSION_KEY] + 1) % 1e3;
      };
      applyChangedStates = function(ecIns) {
        if (!ecIns[STATUS_NEEDS_UPDATE_KEY]) {
          return;
        }
        ecIns.getZr().storage.traverse(function(el) {
          if (isElementRemoved(el)) {
            return;
          }
          applyElementStates(el);
        });
        ecIns[STATUS_NEEDS_UPDATE_KEY] = false;
      };
      function applyElementStates(el) {
        var newStates = [];
        var oldStates = el.currentStates;
        for (var i = 0; i < oldStates.length; i++) {
          var stateName = oldStates[i];
          if (!(stateName === "emphasis" || stateName === "blur" || stateName === "select")) {
            newStates.push(stateName);
          }
        }
        if (el.selected && el.states.select) {
          newStates.push("select");
        }
        if (el.hoverState === HOVER_STATE_EMPHASIS && el.states.emphasis) {
          newStates.push("emphasis");
        } else if (el.hoverState === HOVER_STATE_BLUR && el.states.blur) {
          newStates.push("blur");
        }
        el.useStates(newStates);
      }
      function updateHoverLayerStatus(ecIns, ecModel) {
        var zr = ecIns._zr;
        var storage = zr.storage;
        var elCount = 0;
        storage.traverse(function(el) {
          if (!el.isGroup) {
            elCount++;
          }
        });
        if (elCount > ecModel.get("hoverLayerThreshold") && !env.node && !env.worker) {
          ecModel.eachSeries(function(seriesModel) {
            if (seriesModel.preventUsingHoverLayer) {
              return;
            }
            var chartView = ecIns._chartsMap[seriesModel.__viewId];
            if (chartView.__alive) {
              chartView.eachRendered(function(el) {
                if (el.states.emphasis) {
                  el.states.emphasis.hoverLayer = true;
                }
              });
            }
          });
        }
      }
      function updateBlend(seriesModel, chartView) {
        var blendMode = seriesModel.get("blendMode") || null;
        chartView.eachRendered(function(el) {
          if (!el.isGroup) {
            el.style.blend = blendMode;
          }
        });
      }
      function updateZ(model, view) {
        if (model.preventAutoZ) {
          return;
        }
        var zInfo = retrieveZInfo(model);
        view.eachRendered(function(el) {
          traverseUpdateZ(el, zInfo.z, zInfo.zlevel);
          return true;
        });
      }
      function clearStates(model, view) {
        view.eachRendered(function(el) {
          if (isElementRemoved(el)) {
            return;
          }
          var textContent = el.getTextContent();
          var textGuide = el.getTextGuideLine();
          if (el.stateTransition) {
            el.stateTransition = null;
          }
          if (textContent && textContent.stateTransition) {
            textContent.stateTransition = null;
          }
          if (textGuide && textGuide.stateTransition) {
            textGuide.stateTransition = null;
          }
          if (el.hasState()) {
            el.prevStates = el.currentStates;
            el.clearStates();
          } else if (el.prevStates) {
            el.prevStates = null;
          }
        });
      }
      function updateStates(model, view) {
        var stateAnimationModel = model.getModel("stateAnimation");
        var enableAnimation = model.isAnimationEnabled();
        var duration = stateAnimationModel.get("duration");
        var stateTransition = duration > 0 ? {
          duration,
          delay: stateAnimationModel.get("delay"),
          easing: stateAnimationModel.get("easing")
          // additive: stateAnimationModel.get('additive')
        } : null;
        view.eachRendered(function(el) {
          if (el.states && el.states.emphasis) {
            if (isElementRemoved(el)) {
              return;
            }
            if (el instanceof Path) {
              savePathStates(el);
            }
            if (el.__dirty) {
              var prevStates = el.prevStates;
              if (prevStates) {
                el.useStates(prevStates);
              }
            }
            if (enableAnimation) {
              el.stateTransition = stateTransition;
              var textContent = el.getTextContent();
              var textGuide = el.getTextGuideLine();
              if (textContent) {
                textContent.stateTransition = stateTransition;
              }
              if (textGuide) {
                textGuide.stateTransition = stateTransition;
              }
            }
            if (el.__dirty) {
              applyElementStates(el);
            }
          }
        });
      }
      createExtensionAPI = function(ecIns) {
        return new /** @class */
        (function(_super2) {
          __extends(class_1, _super2);
          function class_1() {
            return _super2 !== null && _super2.apply(this, arguments) || this;
          }
          class_1.prototype.getCoordinateSystems = function() {
            return ecIns._coordSysMgr.getCoordinateSystems();
          };
          class_1.prototype.getComponentByElement = function(el) {
            while (el) {
              var modelInfo = el.__ecComponentInfo;
              if (modelInfo != null) {
                return ecIns._model.getComponent(modelInfo.mainType, modelInfo.index);
              }
              el = el.parent;
            }
          };
          class_1.prototype.enterEmphasis = function(el, highlightDigit) {
            enterEmphasis(el, highlightDigit);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.leaveEmphasis = function(el, highlightDigit) {
            leaveEmphasis(el, highlightDigit);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.enterBlur = function(el) {
            enterBlur(el);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.leaveBlur = function(el) {
            leaveBlur(el);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.enterSelect = function(el) {
            enterSelect(el);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.leaveSelect = function(el) {
            leaveSelect(el);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.getModel = function() {
            return ecIns.getModel();
          };
          class_1.prototype.getViewOfComponentModel = function(componentModel) {
            return ecIns.getViewOfComponentModel(componentModel);
          };
          class_1.prototype.getViewOfSeriesModel = function(seriesModel) {
            return ecIns.getViewOfSeriesModel(seriesModel);
          };
          class_1.prototype.getMainProcessVersion = function() {
            return ecIns[MAIN_PROCESS_VERSION_KEY];
          };
          return class_1;
        }(ExtensionAPI))(ecIns);
      };
      enableConnect = function(chart) {
        function updateConnectedChartsStatus(charts, status) {
          for (var i = 0; i < charts.length; i++) {
            var otherChart = charts[i];
            otherChart[CONNECT_STATUS_KEY] = status;
          }
        }
        each$4(connectionEventRevertMap, function(_, eventType) {
          chart._messageCenter.on(eventType, function(event) {
            if (connectedGroups[chart.group] && chart[CONNECT_STATUS_KEY] !== CONNECT_STATUS_PENDING) {
              if (event && event.escapeConnect) {
                return;
              }
              var action_1 = chart.makeActionFromEvent(event);
              var otherCharts_1 = [];
              each$4(instances, function(otherChart) {
                if (otherChart !== chart && otherChart.group === chart.group) {
                  otherCharts_1.push(otherChart);
                }
              });
              updateConnectedChartsStatus(otherCharts_1, CONNECT_STATUS_PENDING);
              each$4(otherCharts_1, function(otherChart) {
                if (otherChart[CONNECT_STATUS_KEY] !== CONNECT_STATUS_UPDATING) {
                  otherChart.dispatchAction(action_1);
                }
              });
              updateConnectedChartsStatus(otherCharts_1, CONNECT_STATUS_UPDATED);
            }
          });
        });
      };
    }();
    return ECharts2;
  }(Eventful)
);
var echartsProto = ECharts.prototype;
echartsProto.on = createRegisterEventWithLowercaseECharts("on");
echartsProto.off = createRegisterEventWithLowercaseECharts("off");
echartsProto.one = function(eventName, cb, ctx) {
  var self = this;
  function wrapped() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    cb && cb.apply && cb.apply(this, args2);
    self.off(eventName, wrapped);
  }
  this.on.call(this, eventName, wrapped, ctx);
};
var MOUSE_EVENT_NAMES = ["click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "globalout", "contextmenu"];
function disposedWarning(id) {
}
var actions = {};
var connectionEventRevertMap = {};
var publicEventTypeMap = {};
var dataProcessorFuncs = [];
var optionPreprocessorFuncs = [];
var visualFuncs = [];
var themeStorage = {};
var loadingEffects = {};
var instances = {};
var connectedGroups = {};
var idBase = +/* @__PURE__ */ new Date() - 0;
var DOM_ATTRIBUTE_KEY = "_echarts_instance_";
function init(dom, theme2, opts) {
  {
    var existInstance = getInstanceByDom(dom);
    if (existInstance) {
      return existInstance;
    }
  }
  var chart = new ECharts(dom, theme2, opts);
  chart.id = "ec_" + idBase++;
  instances[chart.id] = chart;
  setAttribute(dom, DOM_ATTRIBUTE_KEY, chart.id);
  enableConnect(chart);
  lifecycle.trigger("afterinit", chart);
  return chart;
}
function getInstanceByDom(dom) {
  return instances[getAttribute(dom, DOM_ATTRIBUTE_KEY)];
}
function registerTheme(name, theme2) {
  themeStorage[name] = theme2;
}
function registerPreprocessor(preprocessorFunc) {
  if (indexOf(optionPreprocessorFuncs, preprocessorFunc) < 0) {
    optionPreprocessorFuncs.push(preprocessorFunc);
  }
}
function registerProcessor(priority, processor) {
  normalizeRegister(dataProcessorFuncs, priority, processor, PRIORITY_PROCESSOR_DEFAULT);
}
function registerPostInit(postInitFunc) {
  registerUpdateLifecycle("afterinit", postInitFunc);
}
function registerPostUpdate(postUpdateFunc) {
  registerUpdateLifecycle("afterupdate", postUpdateFunc);
}
function registerUpdateLifecycle(name, cb) {
  lifecycle.on(name, cb);
}
function registerAction(arg0, arg1, action) {
  var actionType;
  var publicEventType;
  var refineEvent;
  var update;
  var publishNonRefinedEvent;
  if (isFunction(arg1)) {
    action = arg1;
    arg1 = "";
  }
  if (isObject$2(arg0)) {
    actionType = arg0.type;
    publicEventType = arg0.event;
    update = arg0.update;
    publishNonRefinedEvent = arg0.publishNonRefinedEvent;
    if (!action) {
      action = arg0.action;
    }
    refineEvent = arg0.refineEvent;
  } else {
    actionType = arg0;
    publicEventType = arg1;
  }
  function createEventType(actionOrEventType) {
    return actionOrEventType.toLowerCase();
  }
  publicEventType = createEventType(publicEventType || actionType);
  var nonRefinedEventType = refineEvent ? createEventType(actionType) : publicEventType;
  if (actions[actionType]) {
    return;
  }
  assert(ACTION_REG.test(actionType) && ACTION_REG.test(publicEventType));
  if (refineEvent) {
    assert(publicEventType !== actionType);
  }
  actions[actionType] = {
    actionType,
    refinedEventType: publicEventType,
    nonRefinedEventType,
    update,
    action,
    refineEvent
  };
  publicEventTypeMap[publicEventType] = 1;
  if (refineEvent && publishNonRefinedEvent) {
    publicEventTypeMap[nonRefinedEventType] = 1;
  }
  connectionEventRevertMap[nonRefinedEventType] = actionType;
}
function registerCoordinateSystem(type, coordSysCreator) {
  CoordinateSystemManager.register(type, coordSysCreator);
}
function registerLayout(priority, layoutTask) {
  normalizeRegister(visualFuncs, priority, layoutTask, PRIORITY_VISUAL_LAYOUT, "layout");
}
function registerVisual(priority, visualTask) {
  normalizeRegister(visualFuncs, priority, visualTask, PRIORITY_VISUAL_CHART, "visual");
}
var registeredTasks = [];
function normalizeRegister(targetList, priority, fn, defaultPriority, visualType) {
  if (isFunction(priority) || isObject$2(priority)) {
    fn = priority;
    priority = defaultPriority;
  }
  if (indexOf(registeredTasks, fn) >= 0) {
    return;
  }
  registeredTasks.push(fn);
  var stageHandler = Scheduler.wrapStageHandler(fn, visualType);
  stageHandler.__prio = priority;
  stageHandler.__raw = fn;
  targetList.push(stageHandler);
}
function registerLoading(name, loadingFx) {
  loadingEffects[name] = loadingFx;
}
function registerMap(mapName, geoJson, specialAreas) {
  var registerMap2 = getImpl("registerMap");
  registerMap2 && registerMap2(mapName, geoJson, specialAreas);
}
var registerTransform = registerExternalTransform;
registerVisual(PRIORITY_VISUAL_GLOBAL, seriesStyleTask);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, dataStyleTask);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, dataColorPaletteTask);
registerVisual(PRIORITY_VISUAL_GLOBAL, seriesSymbolTask);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, dataSymbolTask);
registerVisual(PRIORITY_VISUAL_DECAL, decalVisual);
registerPreprocessor(globalBackwardCompat);
registerProcessor(PRIORITY_PROCESSOR_DATASTACK, dataStack);
registerLoading("default", defaultLoading);
registerAction({
  type: HIGHLIGHT_ACTION_TYPE,
  event: HIGHLIGHT_ACTION_TYPE,
  update: HIGHLIGHT_ACTION_TYPE
}, noop);
registerAction({
  type: DOWNPLAY_ACTION_TYPE,
  event: DOWNPLAY_ACTION_TYPE,
  update: DOWNPLAY_ACTION_TYPE
}, noop);
registerAction({
  type: SELECT_ACTION_TYPE,
  event: SELECT_CHANGED_EVENT_TYPE,
  update: SELECT_ACTION_TYPE,
  action: noop,
  refineEvent: makeSelectChangedEvent,
  publishNonRefinedEvent: true
});
registerAction({
  type: UNSELECT_ACTION_TYPE,
  event: SELECT_CHANGED_EVENT_TYPE,
  update: UNSELECT_ACTION_TYPE,
  action: noop,
  refineEvent: makeSelectChangedEvent,
  publishNonRefinedEvent: true
});
registerAction({
  type: TOGGLE_SELECT_ACTION_TYPE,
  event: SELECT_CHANGED_EVENT_TYPE,
  update: TOGGLE_SELECT_ACTION_TYPE,
  action: noop,
  refineEvent: makeSelectChangedEvent,
  publishNonRefinedEvent: true
});
function makeSelectChangedEvent(actionResultBatch, payload, ecModel, api) {
  return {
    eventContent: {
      selected: getAllSelectedIndices(ecModel),
      isFromClick: payload.isFromClick || false
    }
  };
}
registerTheme("default", {});
registerTheme("dark", theme);
function dataIndexMapValueLength(valNumOrArrLengthMoreThan2) {
  return valNumOrArrLengthMoreThan2 == null ? 0 : valNumOrArrLengthMoreThan2.length || 1;
}
function defaultKeyGetter(item) {
  return item;
}
var DataDiffer = (
  /** @class */
  function() {
    function DataDiffer2(oldArr, newArr, oldKeyGetter, newKeyGetter, context, diffMode) {
      this._old = oldArr;
      this._new = newArr;
      this._oldKeyGetter = oldKeyGetter || defaultKeyGetter;
      this._newKeyGetter = newKeyGetter || defaultKeyGetter;
      this.context = context;
      this._diffModeMultiple = diffMode === "multiple";
    }
    DataDiffer2.prototype.add = function(func) {
      this._add = func;
      return this;
    };
    DataDiffer2.prototype.update = function(func) {
      this._update = func;
      return this;
    };
    DataDiffer2.prototype.updateManyToOne = function(func) {
      this._updateManyToOne = func;
      return this;
    };
    DataDiffer2.prototype.updateOneToMany = function(func) {
      this._updateOneToMany = func;
      return this;
    };
    DataDiffer2.prototype.updateManyToMany = function(func) {
      this._updateManyToMany = func;
      return this;
    };
    DataDiffer2.prototype.remove = function(func) {
      this._remove = func;
      return this;
    };
    DataDiffer2.prototype.execute = function() {
      this[this._diffModeMultiple ? "_executeMultiple" : "_executeOneToOne"]();
    };
    DataDiffer2.prototype._executeOneToOne = function() {
      var oldArr = this._old;
      var newArr = this._new;
      var newDataIndexMap = {};
      var oldDataKeyArr = new Array(oldArr.length);
      var newDataKeyArr = new Array(newArr.length);
      this._initIndexMap(oldArr, null, oldDataKeyArr, "_oldKeyGetter");
      this._initIndexMap(newArr, newDataIndexMap, newDataKeyArr, "_newKeyGetter");
      for (var i = 0; i < oldArr.length; i++) {
        var oldKey = oldDataKeyArr[i];
        var newIdxMapVal = newDataIndexMap[oldKey];
        var newIdxMapValLen = dataIndexMapValueLength(newIdxMapVal);
        if (newIdxMapValLen > 1) {
          var newIdx = newIdxMapVal.shift();
          if (newIdxMapVal.length === 1) {
            newDataIndexMap[oldKey] = newIdxMapVal[0];
          }
          this._update && this._update(newIdx, i);
        } else if (newIdxMapValLen === 1) {
          newDataIndexMap[oldKey] = null;
          this._update && this._update(newIdxMapVal, i);
        } else {
          this._remove && this._remove(i);
        }
      }
      this._performRestAdd(newDataKeyArr, newDataIndexMap);
    };
    DataDiffer2.prototype._executeMultiple = function() {
      var oldArr = this._old;
      var newArr = this._new;
      var oldDataIndexMap = {};
      var newDataIndexMap = {};
      var oldDataKeyArr = [];
      var newDataKeyArr = [];
      this._initIndexMap(oldArr, oldDataIndexMap, oldDataKeyArr, "_oldKeyGetter");
      this._initIndexMap(newArr, newDataIndexMap, newDataKeyArr, "_newKeyGetter");
      for (var i = 0; i < oldDataKeyArr.length; i++) {
        var oldKey = oldDataKeyArr[i];
        var oldIdxMapVal = oldDataIndexMap[oldKey];
        var newIdxMapVal = newDataIndexMap[oldKey];
        var oldIdxMapValLen = dataIndexMapValueLength(oldIdxMapVal);
        var newIdxMapValLen = dataIndexMapValueLength(newIdxMapVal);
        if (oldIdxMapValLen > 1 && newIdxMapValLen === 1) {
          this._updateManyToOne && this._updateManyToOne(newIdxMapVal, oldIdxMapVal);
          newDataIndexMap[oldKey] = null;
        } else if (oldIdxMapValLen === 1 && newIdxMapValLen > 1) {
          this._updateOneToMany && this._updateOneToMany(newIdxMapVal, oldIdxMapVal);
          newDataIndexMap[oldKey] = null;
        } else if (oldIdxMapValLen === 1 && newIdxMapValLen === 1) {
          this._update && this._update(newIdxMapVal, oldIdxMapVal);
          newDataIndexMap[oldKey] = null;
        } else if (oldIdxMapValLen > 1 && newIdxMapValLen > 1) {
          this._updateManyToMany && this._updateManyToMany(newIdxMapVal, oldIdxMapVal);
          newDataIndexMap[oldKey] = null;
        } else if (oldIdxMapValLen > 1) {
          for (var i_1 = 0; i_1 < oldIdxMapValLen; i_1++) {
            this._remove && this._remove(oldIdxMapVal[i_1]);
          }
        } else {
          this._remove && this._remove(oldIdxMapVal);
        }
      }
      this._performRestAdd(newDataKeyArr, newDataIndexMap);
    };
    DataDiffer2.prototype._performRestAdd = function(newDataKeyArr, newDataIndexMap) {
      for (var i = 0; i < newDataKeyArr.length; i++) {
        var newKey = newDataKeyArr[i];
        var newIdxMapVal = newDataIndexMap[newKey];
        var idxMapValLen = dataIndexMapValueLength(newIdxMapVal);
        if (idxMapValLen > 1) {
          for (var j = 0; j < idxMapValLen; j++) {
            this._add && this._add(newIdxMapVal[j]);
          }
        } else if (idxMapValLen === 1) {
          this._add && this._add(newIdxMapVal);
        }
        newDataIndexMap[newKey] = null;
      }
    };
    DataDiffer2.prototype._initIndexMap = function(arr, map2, keyArr, keyGetterName) {
      var cbModeMultiple = this._diffModeMultiple;
      for (var i = 0; i < arr.length; i++) {
        var key = "_ec_" + this[keyGetterName](arr[i], i);
        if (!cbModeMultiple) {
          keyArr[i] = key;
        }
        if (!map2) {
          continue;
        }
        var idxMapVal = map2[key];
        var idxMapValLen = dataIndexMapValueLength(idxMapVal);
        if (idxMapValLen === 0) {
          map2[key] = i;
          if (cbModeMultiple) {
            keyArr.push(key);
          }
        } else if (idxMapValLen === 1) {
          map2[key] = [idxMapVal, i];
        } else {
          idxMapVal.push(i);
        }
      }
    };
    return DataDiffer2;
  }()
);
var DimensionUserOuput = (
  /** @class */
  function() {
    function DimensionUserOuput2(encode, dimRequest) {
      this._encode = encode;
      this._schema = dimRequest;
    }
    DimensionUserOuput2.prototype.get = function() {
      return {
        // Do not generate full dimension name until fist used.
        fullDimensions: this._getFullDimensionNames(),
        encode: this._encode
      };
    };
    DimensionUserOuput2.prototype._getFullDimensionNames = function() {
      if (!this._cachedDimNames) {
        this._cachedDimNames = this._schema ? this._schema.makeOutputDimensionNames() : [];
      }
      return this._cachedDimNames;
    };
    return DimensionUserOuput2;
  }()
);
function summarizeDimensions(data, schema) {
  var summary = {};
  var encode = summary.encode = {};
  var notExtraCoordDimMap = createHashMap();
  var defaultedLabel = [];
  var defaultedTooltip = [];
  var userOutputEncode = {};
  each$4(data.dimensions, function(dimName) {
    var dimItem = data.getDimensionInfo(dimName);
    var coordDim = dimItem.coordDim;
    if (coordDim) {
      var coordDimIndex = dimItem.coordDimIndex;
      getOrCreateEncodeArr(encode, coordDim)[coordDimIndex] = dimName;
      if (!dimItem.isExtraCoord) {
        notExtraCoordDimMap.set(coordDim, 1);
        if (mayLabelDimType(dimItem.type)) {
          defaultedLabel[0] = dimName;
        }
        getOrCreateEncodeArr(userOutputEncode, coordDim)[coordDimIndex] = data.getDimensionIndex(dimItem.name);
      }
      if (dimItem.defaultTooltip) {
        defaultedTooltip.push(dimName);
      }
    }
    VISUAL_DIMENSIONS.each(function(v, otherDim) {
      var encodeArr = getOrCreateEncodeArr(encode, otherDim);
      var dimIndex = dimItem.otherDims[otherDim];
      if (dimIndex != null && dimIndex !== false) {
        encodeArr[dimIndex] = dimItem.name;
      }
    });
  });
  var dataDimsOnCoord = [];
  var encodeFirstDimNotExtra = {};
  notExtraCoordDimMap.each(function(v, coordDim) {
    var dimArr = encode[coordDim];
    encodeFirstDimNotExtra[coordDim] = dimArr[0];
    dataDimsOnCoord = dataDimsOnCoord.concat(dimArr);
  });
  summary.dataDimsOnCoord = dataDimsOnCoord;
  summary.dataDimIndicesOnCoord = map$1(dataDimsOnCoord, function(dimName) {
    return data.getDimensionInfo(dimName).storeDimIndex;
  });
  summary.encodeFirstDimNotExtra = encodeFirstDimNotExtra;
  var encodeLabel = encode.label;
  if (encodeLabel && encodeLabel.length) {
    defaultedLabel = encodeLabel.slice();
  }
  var encodeTooltip = encode.tooltip;
  if (encodeTooltip && encodeTooltip.length) {
    defaultedTooltip = encodeTooltip.slice();
  } else if (!defaultedTooltip.length) {
    defaultedTooltip = defaultedLabel.slice();
  }
  encode.defaultedLabel = defaultedLabel;
  encode.defaultedTooltip = defaultedTooltip;
  summary.userOutput = new DimensionUserOuput(userOutputEncode, schema);
  return summary;
}
function getOrCreateEncodeArr(encode, dim) {
  if (!encode.hasOwnProperty(dim)) {
    encode[dim] = [];
  }
  return encode[dim];
}
function getDimensionTypeByAxis(axisType) {
  return axisType === "category" ? "ordinal" : axisType === "time" ? "time" : "float";
}
function mayLabelDimType(dimType) {
  return !(dimType === "ordinal" || dimType === "time");
}
var SeriesDimensionDefine = (
  /** @class */
  /* @__PURE__ */ function() {
    function SeriesDimensionDefine2(opt) {
      this.otherDims = {};
      if (opt != null) {
        extend(this, opt);
      }
    }
    return SeriesDimensionDefine2;
  }()
);
var inner$7 = makeInner();
var dimTypeShort = {
  float: "f",
  int: "i",
  ordinal: "o",
  number: "n",
  time: "t"
};
var SeriesDataSchema = (
  /** @class */
  function() {
    function SeriesDataSchema2(opt) {
      this.dimensions = opt.dimensions;
      this._dimOmitted = opt.dimensionOmitted;
      this.source = opt.source;
      this._fullDimCount = opt.fullDimensionCount;
      this._updateDimOmitted(opt.dimensionOmitted);
    }
    SeriesDataSchema2.prototype.isDimensionOmitted = function() {
      return this._dimOmitted;
    };
    SeriesDataSchema2.prototype._updateDimOmitted = function(dimensionOmitted) {
      this._dimOmitted = dimensionOmitted;
      if (!dimensionOmitted) {
        return;
      }
      if (!this._dimNameMap) {
        this._dimNameMap = ensureSourceDimNameMap(this.source);
      }
    };
    SeriesDataSchema2.prototype.getSourceDimensionIndex = function(dimName) {
      return retrieve2(this._dimNameMap.get(dimName), -1);
    };
    SeriesDataSchema2.prototype.getSourceDimension = function(dimIndex) {
      var dimensionsDefine = this.source.dimensionsDefine;
      if (dimensionsDefine) {
        return dimensionsDefine[dimIndex];
      }
    };
    SeriesDataSchema2.prototype.makeStoreSchema = function() {
      var dimCount = this._fullDimCount;
      var willRetrieveDataByName = shouldRetrieveDataByName(this.source);
      var makeHashStrict = !shouldOmitUnusedDimensions(dimCount);
      var dimHash = "";
      var dims = [];
      for (var fullDimIdx = 0, seriesDimIdx = 0; fullDimIdx < dimCount; fullDimIdx++) {
        var property = void 0;
        var type = void 0;
        var ordinalMeta = void 0;
        var seriesDimDef = this.dimensions[seriesDimIdx];
        if (seriesDimDef && seriesDimDef.storeDimIndex === fullDimIdx) {
          property = willRetrieveDataByName ? seriesDimDef.name : null;
          type = seriesDimDef.type;
          ordinalMeta = seriesDimDef.ordinalMeta;
          seriesDimIdx++;
        } else {
          var sourceDimDef = this.getSourceDimension(fullDimIdx);
          if (sourceDimDef) {
            property = willRetrieveDataByName ? sourceDimDef.name : null;
            type = sourceDimDef.type;
          }
        }
        dims.push({
          property,
          type,
          ordinalMeta
        });
        if (willRetrieveDataByName && property != null && (!seriesDimDef || !seriesDimDef.isCalculationCoord)) {
          dimHash += makeHashStrict ? property.replace(/\`/g, "`1").replace(/\$/g, "`2") : property;
        }
        dimHash += "$";
        dimHash += dimTypeShort[type] || "f";
        if (ordinalMeta) {
          dimHash += ordinalMeta.uid;
        }
        dimHash += "$";
      }
      var source = this.source;
      var hash = [source.seriesLayoutBy, source.startIndex, dimHash].join("$$");
      return {
        dimensions: dims,
        hash
      };
    };
    SeriesDataSchema2.prototype.makeOutputDimensionNames = function() {
      var result = [];
      for (var fullDimIdx = 0, seriesDimIdx = 0; fullDimIdx < this._fullDimCount; fullDimIdx++) {
        var name_1 = void 0;
        var seriesDimDef = this.dimensions[seriesDimIdx];
        if (seriesDimDef && seriesDimDef.storeDimIndex === fullDimIdx) {
          if (!seriesDimDef.isCalculationCoord) {
            name_1 = seriesDimDef.name;
          }
          seriesDimIdx++;
        } else {
          var sourceDimDef = this.getSourceDimension(fullDimIdx);
          if (sourceDimDef) {
            name_1 = sourceDimDef.name;
          }
        }
        result.push(name_1);
      }
      return result;
    };
    SeriesDataSchema2.prototype.appendCalculationDimension = function(dimDef) {
      this.dimensions.push(dimDef);
      dimDef.isCalculationCoord = true;
      this._fullDimCount++;
      this._updateDimOmitted(true);
    };
    return SeriesDataSchema2;
  }()
);
function isSeriesDataSchema(schema) {
  return schema instanceof SeriesDataSchema;
}
function createDimNameMap(dimsDef) {
  var dataDimNameMap = createHashMap();
  for (var i = 0; i < (dimsDef || []).length; i++) {
    var dimDefItemRaw = dimsDef[i];
    var userDimName = isObject$2(dimDefItemRaw) ? dimDefItemRaw.name : dimDefItemRaw;
    if (userDimName != null && dataDimNameMap.get(userDimName) == null) {
      dataDimNameMap.set(userDimName, i);
    }
  }
  return dataDimNameMap;
}
function ensureSourceDimNameMap(source) {
  var innerSource = inner$7(source);
  return innerSource.dimNameMap || (innerSource.dimNameMap = createDimNameMap(source.dimensionsDefine));
}
function shouldOmitUnusedDimensions(dimCount) {
  return dimCount > 30;
}
var isObject = isObject$2;
var map = map$1;
var CtorInt32Array = typeof Int32Array === "undefined" ? Array : Int32Array;
var ID_PREFIX = "e\0\0";
var INDEX_NOT_FOUND = -1;
var TRANSFERABLE_PROPERTIES = ["hasItemOption", "_nameList", "_idList", "_invertedIndicesMap", "_dimSummary", "userOutput", "_rawData", "_dimValueGetter", "_nameDimIdx", "_idDimIdx", "_nameRepeatCount"];
var CLONE_PROPERTIES = ["_approximateExtent"];
var prepareInvertedIndex;
var getId;
var getIdNameFromStore;
var normalizeDimensions;
var transferProperties;
var cloneListForMapAndSample;
var makeIdFromName;
var SeriesData = (
  /** @class */
  function() {
    function SeriesData2(dimensionsInput, hostModel) {
      this.type = "list";
      this._dimOmitted = false;
      this._nameList = [];
      this._idList = [];
      this._visual = {};
      this._layout = {};
      this._itemVisuals = [];
      this._itemLayouts = [];
      this._graphicEls = [];
      this._approximateExtent = {};
      this._calculationInfo = {};
      this.hasItemOption = false;
      this.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "minmaxDownSample", "lttbDownSample", "map"];
      this.CHANGABLE_METHODS = ["filterSelf", "selectRange"];
      this.DOWNSAMPLE_METHODS = ["downSample", "minmaxDownSample", "lttbDownSample"];
      var dimensions;
      var assignStoreDimIdx = false;
      if (isSeriesDataSchema(dimensionsInput)) {
        dimensions = dimensionsInput.dimensions;
        this._dimOmitted = dimensionsInput.isDimensionOmitted();
        this._schema = dimensionsInput;
      } else {
        assignStoreDimIdx = true;
        dimensions = dimensionsInput;
      }
      dimensions = dimensions || ["x", "y"];
      var dimensionInfos = {};
      var dimensionNames = [];
      var invertedIndicesMap = {};
      var needsHasOwn = false;
      var emptyObj = {};
      for (var i = 0; i < dimensions.length; i++) {
        var dimInfoInput = dimensions[i];
        var dimensionInfo = isString(dimInfoInput) ? new SeriesDimensionDefine({
          name: dimInfoInput
        }) : !(dimInfoInput instanceof SeriesDimensionDefine) ? new SeriesDimensionDefine(dimInfoInput) : dimInfoInput;
        var dimensionName = dimensionInfo.name;
        dimensionInfo.type = dimensionInfo.type || "float";
        if (!dimensionInfo.coordDim) {
          dimensionInfo.coordDim = dimensionName;
          dimensionInfo.coordDimIndex = 0;
        }
        var otherDims = dimensionInfo.otherDims = dimensionInfo.otherDims || {};
        dimensionNames.push(dimensionName);
        dimensionInfos[dimensionName] = dimensionInfo;
        if (emptyObj[dimensionName] != null) {
          needsHasOwn = true;
        }
        if (dimensionInfo.createInvertedIndices) {
          invertedIndicesMap[dimensionName] = [];
        }
        var dimIdx = i;
        if (isNumber(dimensionInfo.storeDimIndex)) {
          dimIdx = dimensionInfo.storeDimIndex;
        }
        if (otherDims.itemName === 0) {
          this._nameDimIdx = dimIdx;
        }
        if (otherDims.itemId === 0) {
          this._idDimIdx = dimIdx;
        }
        if (assignStoreDimIdx) {
          dimensionInfo.storeDimIndex = i;
        }
      }
      this.dimensions = dimensionNames;
      this._dimInfos = dimensionInfos;
      this._initGetDimensionInfo(needsHasOwn);
      this.hostModel = hostModel;
      this._invertedIndicesMap = invertedIndicesMap;
      if (this._dimOmitted) {
        var dimIdxToName_1 = this._dimIdxToName = createHashMap();
        each$4(dimensionNames, function(dimName) {
          dimIdxToName_1.set(dimensionInfos[dimName].storeDimIndex, dimName);
        });
      }
    }
    SeriesData2.prototype.getDimension = function(dim) {
      var dimIdx = this._recognizeDimIndex(dim);
      if (dimIdx == null) {
        return dim;
      }
      dimIdx = dim;
      if (!this._dimOmitted) {
        return this.dimensions[dimIdx];
      }
      var dimName = this._dimIdxToName.get(dimIdx);
      if (dimName != null) {
        return dimName;
      }
      var sourceDimDef = this._schema.getSourceDimension(dimIdx);
      if (sourceDimDef) {
        return sourceDimDef.name;
      }
    };
    SeriesData2.prototype.getDimensionIndex = function(dim) {
      var dimIdx = this._recognizeDimIndex(dim);
      if (dimIdx != null) {
        return dimIdx;
      }
      if (dim == null) {
        return -1;
      }
      var dimInfo = this._getDimInfo(dim);
      return dimInfo ? dimInfo.storeDimIndex : this._dimOmitted ? this._schema.getSourceDimensionIndex(dim) : -1;
    };
    SeriesData2.prototype._recognizeDimIndex = function(dim) {
      if (isNumber(dim) || dim != null && !isNaN(dim) && !this._getDimInfo(dim) && (!this._dimOmitted || this._schema.getSourceDimensionIndex(dim) < 0)) {
        return +dim;
      }
    };
    SeriesData2.prototype._getStoreDimIndex = function(dim) {
      var dimIdx = this.getDimensionIndex(dim);
      return dimIdx;
    };
    SeriesData2.prototype.getDimensionInfo = function(dim) {
      return this._getDimInfo(this.getDimension(dim));
    };
    SeriesData2.prototype._initGetDimensionInfo = function(needsHasOwn) {
      var dimensionInfos = this._dimInfos;
      this._getDimInfo = needsHasOwn ? function(dimName) {
        return dimensionInfos.hasOwnProperty(dimName) ? dimensionInfos[dimName] : void 0;
      } : function(dimName) {
        return dimensionInfos[dimName];
      };
    };
    SeriesData2.prototype.getDimensionsOnCoord = function() {
      return this._dimSummary.dataDimsOnCoord.slice();
    };
    SeriesData2.prototype.mapDimension = function(coordDim, idx) {
      var dimensionsSummary = this._dimSummary;
      if (idx == null) {
        return dimensionsSummary.encodeFirstDimNotExtra[coordDim];
      }
      var dims = dimensionsSummary.encode[coordDim];
      return dims ? dims[idx] : null;
    };
    SeriesData2.prototype.mapDimensionsAll = function(coordDim) {
      var dimensionsSummary = this._dimSummary;
      var dims = dimensionsSummary.encode[coordDim];
      return (dims || []).slice();
    };
    SeriesData2.prototype.getStore = function() {
      return this._store;
    };
    SeriesData2.prototype.initData = function(data, nameList, dimValueGetter) {
      var _this = this;
      var store;
      if (data instanceof DataStore) {
        store = data;
      }
      if (!store) {
        var dimensions = this.dimensions;
        var provider = isSourceInstance(data) || isArrayLike(data) ? new DefaultDataProvider(data, dimensions.length) : data;
        store = new DataStore();
        var dimensionInfos = map(dimensions, function(dimName) {
          return {
            type: _this._dimInfos[dimName].type,
            property: dimName
          };
        });
        store.initData(provider, dimensionInfos, dimValueGetter);
      }
      this._store = store;
      this._nameList = (nameList || []).slice();
      this._idList = [];
      this._nameRepeatCount = {};
      this._doInit(0, store.count());
      this._dimSummary = summarizeDimensions(this, this._schema);
      this.userOutput = this._dimSummary.userOutput;
    };
    SeriesData2.prototype.appendData = function(data) {
      var range = this._store.appendData(data);
      this._doInit(range[0], range[1]);
    };
    SeriesData2.prototype.appendValues = function(values, names) {
      var _a2 = this._store.appendValues(values, names && names.length), start = _a2.start, end = _a2.end;
      var shouldMakeIdFromName = this._shouldMakeIdFromName();
      this._updateOrdinalMeta();
      if (names) {
        for (var idx = start; idx < end; idx++) {
          var sourceIdx = idx - start;
          this._nameList[idx] = names[sourceIdx];
          if (shouldMakeIdFromName) {
            makeIdFromName(this, idx);
          }
        }
      }
    };
    SeriesData2.prototype._updateOrdinalMeta = function() {
      var store = this._store;
      var dimensions = this.dimensions;
      for (var i = 0; i < dimensions.length; i++) {
        var dimInfo = this._dimInfos[dimensions[i]];
        if (dimInfo.ordinalMeta) {
          store.collectOrdinalMeta(dimInfo.storeDimIndex, dimInfo.ordinalMeta);
        }
      }
    };
    SeriesData2.prototype._shouldMakeIdFromName = function() {
      var provider = this._store.getProvider();
      return this._idDimIdx == null && provider.getSource().sourceFormat !== SOURCE_FORMAT_TYPED_ARRAY && !provider.fillStorage;
    };
    SeriesData2.prototype._doInit = function(start, end) {
      if (start >= end) {
        return;
      }
      var store = this._store;
      var provider = store.getProvider();
      this._updateOrdinalMeta();
      var nameList = this._nameList;
      var idList = this._idList;
      var sourceFormat = provider.getSource().sourceFormat;
      var isFormatOriginal = sourceFormat === SOURCE_FORMAT_ORIGINAL;
      if (isFormatOriginal && !provider.pure) {
        var sharedDataItem = [];
        for (var idx = start; idx < end; idx++) {
          var dataItem = provider.getItem(idx, sharedDataItem);
          if (!this.hasItemOption && isDataItemOption(dataItem)) {
            this.hasItemOption = true;
          }
          if (dataItem) {
            var itemName = dataItem.name;
            if (nameList[idx] == null && itemName != null) {
              nameList[idx] = convertOptionIdName(itemName, null);
            }
            var itemId = dataItem.id;
            if (idList[idx] == null && itemId != null) {
              idList[idx] = convertOptionIdName(itemId, null);
            }
          }
        }
      }
      if (this._shouldMakeIdFromName()) {
        for (var idx = start; idx < end; idx++) {
          makeIdFromName(this, idx);
        }
      }
      prepareInvertedIndex(this);
    };
    SeriesData2.prototype.getApproximateExtent = function(dim) {
      return this._approximateExtent[dim] || this._store.getDataExtent(this._getStoreDimIndex(dim));
    };
    SeriesData2.prototype.setApproximateExtent = function(extent, dim) {
      dim = this.getDimension(dim);
      this._approximateExtent[dim] = extent.slice();
    };
    SeriesData2.prototype.getCalculationInfo = function(key) {
      return this._calculationInfo[key];
    };
    SeriesData2.prototype.setCalculationInfo = function(key, value) {
      isObject(key) ? extend(this._calculationInfo, key) : this._calculationInfo[key] = value;
    };
    SeriesData2.prototype.getName = function(idx) {
      var rawIndex = this.getRawIndex(idx);
      var name = this._nameList[rawIndex];
      if (name == null && this._nameDimIdx != null) {
        name = getIdNameFromStore(this, this._nameDimIdx, rawIndex);
      }
      if (name == null) {
        name = "";
      }
      return name;
    };
    SeriesData2.prototype._getCategory = function(dimIdx, idx) {
      var ordinal = this._store.get(dimIdx, idx);
      var ordinalMeta = this._store.getOrdinalMeta(dimIdx);
      if (ordinalMeta) {
        return ordinalMeta.categories[ordinal];
      }
      return ordinal;
    };
    SeriesData2.prototype.getId = function(idx) {
      return getId(this, this.getRawIndex(idx));
    };
    SeriesData2.prototype.count = function() {
      return this._store.count();
    };
    SeriesData2.prototype.get = function(dim, idx) {
      var store = this._store;
      var dimInfo = this._dimInfos[dim];
      if (dimInfo) {
        return store.get(dimInfo.storeDimIndex, idx);
      }
    };
    SeriesData2.prototype.getByRawIndex = function(dim, rawIdx) {
      var store = this._store;
      var dimInfo = this._dimInfos[dim];
      if (dimInfo) {
        return store.getByRawIndex(dimInfo.storeDimIndex, rawIdx);
      }
    };
    SeriesData2.prototype.getIndices = function() {
      return this._store.getIndices();
    };
    SeriesData2.prototype.getDataExtent = function(dim) {
      return this._store.getDataExtent(this._getStoreDimIndex(dim));
    };
    SeriesData2.prototype.getSum = function(dim) {
      return this._store.getSum(this._getStoreDimIndex(dim));
    };
    SeriesData2.prototype.getMedian = function(dim) {
      return this._store.getMedian(this._getStoreDimIndex(dim));
    };
    SeriesData2.prototype.getValues = function(dimensions, idx) {
      var _this = this;
      var store = this._store;
      return isArray(dimensions) ? store.getValues(map(dimensions, function(dim) {
        return _this._getStoreDimIndex(dim);
      }), idx) : store.getValues(dimensions);
    };
    SeriesData2.prototype.hasValue = function(idx) {
      var dataDimIndicesOnCoord = this._dimSummary.dataDimIndicesOnCoord;
      for (var i = 0, len2 = dataDimIndicesOnCoord.length; i < len2; i++) {
        if (isNaN(this._store.get(dataDimIndicesOnCoord[i], idx))) {
          return false;
        }
      }
      return true;
    };
    SeriesData2.prototype.indexOfName = function(name) {
      for (var i = 0, len2 = this._store.count(); i < len2; i++) {
        if (this.getName(i) === name) {
          return i;
        }
      }
      return -1;
    };
    SeriesData2.prototype.getRawIndex = function(idx) {
      return this._store.getRawIndex(idx);
    };
    SeriesData2.prototype.indexOfRawIndex = function(rawIndex) {
      return this._store.indexOfRawIndex(rawIndex);
    };
    SeriesData2.prototype.rawIndexOf = function(dim, value) {
      var invertedIndices = dim && this._invertedIndicesMap[dim];
      var rawIndex = invertedIndices && invertedIndices[value];
      if (rawIndex == null || isNaN(rawIndex)) {
        return INDEX_NOT_FOUND;
      }
      return rawIndex;
    };
    SeriesData2.prototype.each = function(dims, cb, ctx) {
      if (isFunction(dims)) {
        ctx = cb;
        cb = dims;
        dims = [];
      }
      var fCtx = ctx || this;
      var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
      this._store.each(dimIndices, fCtx ? bind$1(cb, fCtx) : cb);
    };
    SeriesData2.prototype.filterSelf = function(dims, cb, ctx) {
      if (isFunction(dims)) {
        ctx = cb;
        cb = dims;
        dims = [];
      }
      var fCtx = ctx || this;
      var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
      this._store = this._store.filter(dimIndices, fCtx ? bind$1(cb, fCtx) : cb);
      return this;
    };
    SeriesData2.prototype.selectRange = function(range) {
      var _this = this;
      var innerRange = {};
      var dims = keys(range);
      each$4(dims, function(dim) {
        var dimIdx = _this._getStoreDimIndex(dim);
        innerRange[dimIdx] = range[dim];
      });
      this._store = this._store.selectRange(innerRange);
      return this;
    };
    SeriesData2.prototype.mapArray = function(dims, cb, ctx) {
      if (isFunction(dims)) {
        ctx = cb;
        cb = dims;
        dims = [];
      }
      ctx = ctx || this;
      var result = [];
      this.each(dims, function() {
        result.push(cb && cb.apply(this, arguments));
      }, ctx);
      return result;
    };
    SeriesData2.prototype.map = function(dims, cb, ctx, ctxCompat) {
      var fCtx = ctx || ctxCompat || this;
      var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
      var list = cloneListForMapAndSample(this);
      list._store = this._store.map(dimIndices, fCtx ? bind$1(cb, fCtx) : cb);
      return list;
    };
    SeriesData2.prototype.modify = function(dims, cb, ctx, ctxCompat) {
      var fCtx = ctx || ctxCompat || this;
      var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
      this._store.modify(dimIndices, fCtx ? bind$1(cb, fCtx) : cb);
    };
    SeriesData2.prototype.downSample = function(dimension, rate, sampleValue, sampleIndex) {
      var list = cloneListForMapAndSample(this);
      list._store = this._store.downSample(this._getStoreDimIndex(dimension), rate, sampleValue, sampleIndex);
      return list;
    };
    SeriesData2.prototype.minmaxDownSample = function(valueDimension, rate) {
      var list = cloneListForMapAndSample(this);
      list._store = this._store.minmaxDownSample(this._getStoreDimIndex(valueDimension), rate);
      return list;
    };
    SeriesData2.prototype.lttbDownSample = function(valueDimension, rate) {
      var list = cloneListForMapAndSample(this);
      list._store = this._store.lttbDownSample(this._getStoreDimIndex(valueDimension), rate);
      return list;
    };
    SeriesData2.prototype.getRawDataItem = function(idx) {
      return this._store.getRawDataItem(idx);
    };
    SeriesData2.prototype.getItemModel = function(idx) {
      var hostModel = this.hostModel;
      var dataItem = this.getRawDataItem(idx);
      return new Model(dataItem, hostModel, hostModel && hostModel.ecModel);
    };
    SeriesData2.prototype.diff = function(otherList) {
      var thisList = this;
      return new DataDiffer(otherList ? otherList.getStore().getIndices() : [], this.getStore().getIndices(), function(idx) {
        return getId(otherList, idx);
      }, function(idx) {
        return getId(thisList, idx);
      });
    };
    SeriesData2.prototype.getVisual = function(key) {
      var visual = this._visual;
      return visual && visual[key];
    };
    SeriesData2.prototype.setVisual = function(kvObj, val) {
      this._visual = this._visual || {};
      if (isObject(kvObj)) {
        extend(this._visual, kvObj);
      } else {
        this._visual[kvObj] = val;
      }
    };
    SeriesData2.prototype.getItemVisual = function(idx, key) {
      var itemVisual = this._itemVisuals[idx];
      var val = itemVisual && itemVisual[key];
      if (val == null) {
        return this.getVisual(key);
      }
      return val;
    };
    SeriesData2.prototype.hasItemVisual = function() {
      return this._itemVisuals.length > 0;
    };
    SeriesData2.prototype.ensureUniqueItemVisual = function(idx, key) {
      var itemVisuals = this._itemVisuals;
      var itemVisual = itemVisuals[idx];
      if (!itemVisual) {
        itemVisual = itemVisuals[idx] = {};
      }
      var val = itemVisual[key];
      if (val == null) {
        val = this.getVisual(key);
        if (isArray(val)) {
          val = val.slice();
        } else if (isObject(val)) {
          val = extend({}, val);
        }
        itemVisual[key] = val;
      }
      return val;
    };
    SeriesData2.prototype.setItemVisual = function(idx, key, value) {
      var itemVisual = this._itemVisuals[idx] || {};
      this._itemVisuals[idx] = itemVisual;
      if (isObject(key)) {
        extend(itemVisual, key);
      } else {
        itemVisual[key] = value;
      }
    };
    SeriesData2.prototype.clearAllVisual = function() {
      this._visual = {};
      this._itemVisuals = [];
    };
    SeriesData2.prototype.setLayout = function(key, val) {
      isObject(key) ? extend(this._layout, key) : this._layout[key] = val;
    };
    SeriesData2.prototype.getLayout = function(key) {
      return this._layout[key];
    };
    SeriesData2.prototype.getItemLayout = function(idx) {
      return this._itemLayouts[idx];
    };
    SeriesData2.prototype.setItemLayout = function(idx, layout2, merge2) {
      this._itemLayouts[idx] = merge2 ? extend(this._itemLayouts[idx] || {}, layout2) : layout2;
    };
    SeriesData2.prototype.clearItemLayouts = function() {
      this._itemLayouts.length = 0;
    };
    SeriesData2.prototype.setItemGraphicEl = function(idx, el) {
      var seriesIndex = this.hostModel && this.hostModel.seriesIndex;
      setCommonECData(seriesIndex, this.dataType, idx, el);
      this._graphicEls[idx] = el;
    };
    SeriesData2.prototype.getItemGraphicEl = function(idx) {
      return this._graphicEls[idx];
    };
    SeriesData2.prototype.eachItemGraphicEl = function(cb, context) {
      each$4(this._graphicEls, function(el, idx) {
        if (el) {
          cb && cb.call(context, el, idx);
        }
      });
    };
    SeriesData2.prototype.cloneShallow = function(list) {
      if (!list) {
        list = new SeriesData2(this._schema ? this._schema : map(this.dimensions, this._getDimInfo, this), this.hostModel);
      }
      transferProperties(list, this);
      list._store = this._store;
      return list;
    };
    SeriesData2.prototype.wrapMethod = function(methodName, injectFunction) {
      var originalMethod = this[methodName];
      if (!isFunction(originalMethod)) {
        return;
      }
      this.__wrappedMethods = this.__wrappedMethods || [];
      this.__wrappedMethods.push(methodName);
      this[methodName] = function() {
        var res = originalMethod.apply(this, arguments);
        return injectFunction.apply(this, [res].concat(slice(arguments)));
      };
    };
    SeriesData2.internalField = function() {
      prepareInvertedIndex = function(data) {
        var invertedIndicesMap = data._invertedIndicesMap;
        each$4(invertedIndicesMap, function(invertedIndices, dim) {
          var dimInfo = data._dimInfos[dim];
          var ordinalMeta = dimInfo.ordinalMeta;
          var store = data._store;
          if (ordinalMeta) {
            invertedIndices = invertedIndicesMap[dim] = new CtorInt32Array(ordinalMeta.categories.length);
            for (var i = 0; i < invertedIndices.length; i++) {
              invertedIndices[i] = INDEX_NOT_FOUND;
            }
            for (var i = 0; i < store.count(); i++) {
              invertedIndices[store.get(dimInfo.storeDimIndex, i)] = i;
            }
          }
        });
      };
      getIdNameFromStore = function(data, dimIdx, idx) {
        return convertOptionIdName(data._getCategory(dimIdx, idx), null);
      };
      getId = function(data, rawIndex) {
        var id = data._idList[rawIndex];
        if (id == null && data._idDimIdx != null) {
          id = getIdNameFromStore(data, data._idDimIdx, rawIndex);
        }
        if (id == null) {
          id = ID_PREFIX + rawIndex;
        }
        return id;
      };
      normalizeDimensions = function(dimensions) {
        if (!isArray(dimensions)) {
          dimensions = dimensions != null ? [dimensions] : [];
        }
        return dimensions;
      };
      cloneListForMapAndSample = function(original) {
        var list = new SeriesData2(original._schema ? original._schema : map(original.dimensions, original._getDimInfo, original), original.hostModel);
        transferProperties(list, original);
        return list;
      };
      transferProperties = function(target, source) {
        each$4(TRANSFERABLE_PROPERTIES.concat(source.__wrappedMethods || []), function(propName) {
          if (source.hasOwnProperty(propName)) {
            target[propName] = source[propName];
          }
        });
        target.__wrappedMethods = source.__wrappedMethods;
        each$4(CLONE_PROPERTIES, function(propName) {
          target[propName] = clone$1(source[propName]);
        });
        target._calculationInfo = extend({}, source._calculationInfo);
      };
      makeIdFromName = function(data, idx) {
        var nameList = data._nameList;
        var idList = data._idList;
        var nameDimIdx = data._nameDimIdx;
        var idDimIdx = data._idDimIdx;
        var name = nameList[idx];
        var id = idList[idx];
        if (name == null && nameDimIdx != null) {
          nameList[idx] = name = getIdNameFromStore(data, nameDimIdx, idx);
        }
        if (id == null && idDimIdx != null) {
          idList[idx] = id = getIdNameFromStore(data, idDimIdx, idx);
        }
        if (id == null && name != null) {
          var nameRepeatCount = data._nameRepeatCount;
          var nmCnt = nameRepeatCount[name] = (nameRepeatCount[name] || 0) + 1;
          id = name;
          if (nmCnt > 1) {
            id += "__ec__" + nmCnt;
          }
          idList[idx] = id;
        }
      };
    }();
    return SeriesData2;
  }()
);
function prepareSeriesDataSchema(source, opt) {
  if (!isSourceInstance(source)) {
    source = createSourceFromSeriesDataOption(source);
  }
  opt = opt || {};
  var sysDims = opt.coordDimensions || [];
  var dimsDef = opt.dimensionsDefine || source.dimensionsDefine || [];
  var coordDimNameMap = createHashMap();
  var resultList = [];
  var dimCount = getDimCount(source, sysDims, dimsDef, opt.dimensionsCount);
  var omitUnusedDimensions = opt.canOmitUnusedDimensions && shouldOmitUnusedDimensions(dimCount);
  var isUsingSourceDimensionsDef = dimsDef === source.dimensionsDefine;
  var dataDimNameMap = isUsingSourceDimensionsDef ? ensureSourceDimNameMap(source) : createDimNameMap(dimsDef);
  var encodeDef = opt.encodeDefine;
  if (!encodeDef && opt.encodeDefaulter) {
    encodeDef = opt.encodeDefaulter(source, dimCount);
  }
  var encodeDefMap = createHashMap(encodeDef);
  var indicesMap = new CtorInt32Array$1(dimCount);
  for (var i = 0; i < indicesMap.length; i++) {
    indicesMap[i] = -1;
  }
  function getResultItem(dimIdx) {
    var idx = indicesMap[dimIdx];
    if (idx < 0) {
      var dimDefItemRaw = dimsDef[dimIdx];
      var dimDefItem = isObject$2(dimDefItemRaw) ? dimDefItemRaw : {
        name: dimDefItemRaw
      };
      var resultItem2 = new SeriesDimensionDefine();
      var userDimName = dimDefItem.name;
      if (userDimName != null && dataDimNameMap.get(userDimName) != null) {
        resultItem2.name = resultItem2.displayName = userDimName;
      }
      dimDefItem.type != null && (resultItem2.type = dimDefItem.type);
      dimDefItem.displayName != null && (resultItem2.displayName = dimDefItem.displayName);
      var newIdx = resultList.length;
      indicesMap[dimIdx] = newIdx;
      resultItem2.storeDimIndex = dimIdx;
      resultList.push(resultItem2);
      return resultItem2;
    }
    return resultList[idx];
  }
  if (!omitUnusedDimensions) {
    for (var i = 0; i < dimCount; i++) {
      getResultItem(i);
    }
  }
  encodeDefMap.each(function(dataDimsRaw, coordDim2) {
    var dataDims = normalizeToArray(dataDimsRaw).slice();
    if (dataDims.length === 1 && !isString(dataDims[0]) && dataDims[0] < 0) {
      encodeDefMap.set(coordDim2, false);
      return;
    }
    var validDataDims = encodeDefMap.set(coordDim2, []);
    each$4(dataDims, function(resultDimIdxOrName, idx) {
      var resultDimIdx2 = isString(resultDimIdxOrName) ? dataDimNameMap.get(resultDimIdxOrName) : resultDimIdxOrName;
      if (resultDimIdx2 != null && resultDimIdx2 < dimCount) {
        validDataDims[idx] = resultDimIdx2;
        applyDim(getResultItem(resultDimIdx2), coordDim2, idx);
      }
    });
  });
  var availDimIdx = 0;
  each$4(sysDims, function(sysDimItemRaw) {
    var coordDim2;
    var sysDimItemDimsDef;
    var sysDimItemOtherDims;
    var sysDimItem;
    if (isString(sysDimItemRaw)) {
      coordDim2 = sysDimItemRaw;
      sysDimItem = {};
    } else {
      sysDimItem = sysDimItemRaw;
      coordDim2 = sysDimItem.name;
      var ordinalMeta = sysDimItem.ordinalMeta;
      sysDimItem.ordinalMeta = null;
      sysDimItem = extend({}, sysDimItem);
      sysDimItem.ordinalMeta = ordinalMeta;
      sysDimItemDimsDef = sysDimItem.dimsDef;
      sysDimItemOtherDims = sysDimItem.otherDims;
      sysDimItem.name = sysDimItem.coordDim = sysDimItem.coordDimIndex = sysDimItem.dimsDef = sysDimItem.otherDims = null;
    }
    var dataDims = encodeDefMap.get(coordDim2);
    if (dataDims === false) {
      return;
    }
    dataDims = normalizeToArray(dataDims);
    if (!dataDims.length) {
      for (var i2 = 0; i2 < (sysDimItemDimsDef && sysDimItemDimsDef.length || 1); i2++) {
        while (availDimIdx < dimCount && getResultItem(availDimIdx).coordDim != null) {
          availDimIdx++;
        }
        availDimIdx < dimCount && dataDims.push(availDimIdx++);
      }
    }
    each$4(dataDims, function(resultDimIdx2, coordDimIndex) {
      var resultItem2 = getResultItem(resultDimIdx2);
      if (isUsingSourceDimensionsDef && sysDimItem.type != null) {
        resultItem2.type = sysDimItem.type;
      }
      applyDim(defaults(resultItem2, sysDimItem), coordDim2, coordDimIndex);
      if (resultItem2.name == null && sysDimItemDimsDef) {
        var sysDimItemDimsDefItem = sysDimItemDimsDef[coordDimIndex];
        !isObject$2(sysDimItemDimsDefItem) && (sysDimItemDimsDefItem = {
          name: sysDimItemDimsDefItem
        });
        resultItem2.name = resultItem2.displayName = sysDimItemDimsDefItem.name;
        resultItem2.defaultTooltip = sysDimItemDimsDefItem.defaultTooltip;
      }
      sysDimItemOtherDims && defaults(resultItem2.otherDims, sysDimItemOtherDims);
    });
  });
  function applyDim(resultItem2, coordDim2, coordDimIndex) {
    if (VISUAL_DIMENSIONS.get(coordDim2) != null) {
      resultItem2.otherDims[coordDim2] = coordDimIndex;
    } else {
      resultItem2.coordDim = coordDim2;
      resultItem2.coordDimIndex = coordDimIndex;
      coordDimNameMap.set(coordDim2, true);
    }
  }
  var generateCoord = opt.generateCoord;
  var generateCoordCount = opt.generateCoordCount;
  var fromZero = generateCoordCount != null;
  generateCoordCount = generateCoord ? generateCoordCount || 1 : 0;
  var extra = generateCoord || "value";
  function ifNoNameFillWithCoordName(resultItem2) {
    if (resultItem2.name == null) {
      resultItem2.name = resultItem2.coordDim;
    }
  }
  if (!omitUnusedDimensions) {
    for (var resultDimIdx = 0; resultDimIdx < dimCount; resultDimIdx++) {
      var resultItem = getResultItem(resultDimIdx);
      var coordDim = resultItem.coordDim;
      if (coordDim == null) {
        resultItem.coordDim = genCoordDimName(extra, coordDimNameMap, fromZero);
        resultItem.coordDimIndex = 0;
        if (!generateCoord || generateCoordCount <= 0) {
          resultItem.isExtraCoord = true;
        }
        generateCoordCount--;
      }
      ifNoNameFillWithCoordName(resultItem);
      if (resultItem.type == null && (guessOrdinal(source, resultDimIdx) === BE_ORDINAL.Must || resultItem.isExtraCoord && (resultItem.otherDims.itemName != null || resultItem.otherDims.seriesName != null))) {
        resultItem.type = "ordinal";
      }
    }
  } else {
    each$4(resultList, function(resultItem2) {
      ifNoNameFillWithCoordName(resultItem2);
    });
    resultList.sort(function(item0, item1) {
      return item0.storeDimIndex - item1.storeDimIndex;
    });
  }
  removeDuplication(resultList);
  return new SeriesDataSchema({
    source,
    dimensions: resultList,
    fullDimensionCount: dimCount,
    dimensionOmitted: omitUnusedDimensions
  });
}
function removeDuplication(result) {
  var duplicationMap = createHashMap();
  for (var i = 0; i < result.length; i++) {
    var dim = result[i];
    var dimOriginalName = dim.name;
    var count = duplicationMap.get(dimOriginalName) || 0;
    if (count > 0) {
      dim.name = dimOriginalName + (count - 1);
    }
    count++;
    duplicationMap.set(dimOriginalName, count);
  }
}
function getDimCount(source, sysDims, dimsDef, optDimCount) {
  var dimCount = Math.max(source.dimensionsDetectedCount || 1, sysDims.length, dimsDef.length, optDimCount || 0);
  each$4(sysDims, function(sysDimItem) {
    var sysDimItemDimsDef;
    if (isObject$2(sysDimItem) && (sysDimItemDimsDef = sysDimItem.dimsDef)) {
      dimCount = Math.max(dimCount, sysDimItemDimsDef.length);
    }
  });
  return dimCount;
}
function genCoordDimName(name, map2, fromZero) {
  if (fromZero || map2.hasKey(name)) {
    var i = 0;
    while (map2.hasKey(name + i)) {
      i++;
    }
    name += i;
  }
  map2.set(name, true);
  return name;
}
var CoordSysInfo = (
  /** @class */
  /* @__PURE__ */ function() {
    function CoordSysInfo2(coordSysName) {
      this.coordSysDims = [];
      this.axisMap = createHashMap();
      this.categoryAxisMap = createHashMap();
      this.coordSysName = coordSysName;
    }
    return CoordSysInfo2;
  }()
);
function getCoordSysInfoBySeries(seriesModel) {
  var coordSysName = seriesModel.get("coordinateSystem");
  var result = new CoordSysInfo(coordSysName);
  var fetch = fetchers[coordSysName];
  if (fetch) {
    fetch(seriesModel, result, result.axisMap, result.categoryAxisMap);
    return result;
  }
}
var fetchers = {
  cartesian2d: function(seriesModel, result, axisMap, categoryAxisMap) {
    var xAxisModel = seriesModel.getReferringComponents("xAxis", SINGLE_REFERRING).models[0];
    var yAxisModel = seriesModel.getReferringComponents("yAxis", SINGLE_REFERRING).models[0];
    result.coordSysDims = ["x", "y"];
    axisMap.set("x", xAxisModel);
    axisMap.set("y", yAxisModel);
    if (isCategory(xAxisModel)) {
      categoryAxisMap.set("x", xAxisModel);
      result.firstCategoryDimIndex = 0;
    }
    if (isCategory(yAxisModel)) {
      categoryAxisMap.set("y", yAxisModel);
      result.firstCategoryDimIndex == null && (result.firstCategoryDimIndex = 1);
    }
  },
  singleAxis: function(seriesModel, result, axisMap, categoryAxisMap) {
    var singleAxisModel = seriesModel.getReferringComponents("singleAxis", SINGLE_REFERRING).models[0];
    result.coordSysDims = ["single"];
    axisMap.set("single", singleAxisModel);
    if (isCategory(singleAxisModel)) {
      categoryAxisMap.set("single", singleAxisModel);
      result.firstCategoryDimIndex = 0;
    }
  },
  polar: function(seriesModel, result, axisMap, categoryAxisMap) {
    var polarModel = seriesModel.getReferringComponents("polar", SINGLE_REFERRING).models[0];
    var radiusAxisModel = polarModel.findAxisModel("radiusAxis");
    var angleAxisModel = polarModel.findAxisModel("angleAxis");
    result.coordSysDims = ["radius", "angle"];
    axisMap.set("radius", radiusAxisModel);
    axisMap.set("angle", angleAxisModel);
    if (isCategory(radiusAxisModel)) {
      categoryAxisMap.set("radius", radiusAxisModel);
      result.firstCategoryDimIndex = 0;
    }
    if (isCategory(angleAxisModel)) {
      categoryAxisMap.set("angle", angleAxisModel);
      result.firstCategoryDimIndex == null && (result.firstCategoryDimIndex = 1);
    }
  },
  geo: function(seriesModel, result, axisMap, categoryAxisMap) {
    result.coordSysDims = ["lng", "lat"];
  },
  parallel: function(seriesModel, result, axisMap, categoryAxisMap) {
    var ecModel = seriesModel.ecModel;
    var parallelModel = ecModel.getComponent("parallel", seriesModel.get("parallelIndex"));
    var coordSysDims = result.coordSysDims = parallelModel.dimensions.slice();
    each$4(parallelModel.parallelAxisIndex, function(axisIndex, index) {
      var axisModel = ecModel.getComponent("parallelAxis", axisIndex);
      var axisDim = coordSysDims[index];
      axisMap.set(axisDim, axisModel);
      if (isCategory(axisModel)) {
        categoryAxisMap.set(axisDim, axisModel);
        if (result.firstCategoryDimIndex == null) {
          result.firstCategoryDimIndex = index;
        }
      }
    });
  },
  matrix: function(seriesModel, result, axisMap, categoryAxisMap) {
    var matrixModel = seriesModel.getReferringComponents("matrix", SINGLE_REFERRING).models[0];
    result.coordSysDims = ["x", "y"];
    var xModel = matrixModel.getDimensionModel("x");
    var yModel = matrixModel.getDimensionModel("y");
    axisMap.set("x", xModel);
    axisMap.set("y", yModel);
    categoryAxisMap.set("x", xModel);
    categoryAxisMap.set("y", yModel);
  }
};
function isCategory(axisModel) {
  return axisModel.get("type") === "category";
}
function enableDataStack(seriesModel, dimensionsInput, opt) {
  opt = opt || {};
  var byIndex = opt.byIndex;
  var stackedCoordDimension = opt.stackedCoordDimension;
  var dimensionDefineList;
  var schema;
  var store;
  if (isLegacyDimensionsInput(dimensionsInput)) {
    dimensionDefineList = dimensionsInput;
  } else {
    schema = dimensionsInput.schema;
    dimensionDefineList = schema.dimensions;
    store = dimensionsInput.store;
  }
  var mayStack = !!(seriesModel && seriesModel.get("stack"));
  var stackedByDimInfo;
  var stackedDimInfo;
  var stackResultDimension;
  var stackedOverDimension;
  each$4(dimensionDefineList, function(dimensionInfo, index) {
    if (isString(dimensionInfo)) {
      dimensionDefineList[index] = dimensionInfo = {
        name: dimensionInfo
      };
    }
    if (mayStack && !dimensionInfo.isExtraCoord) {
      if (!byIndex && !stackedByDimInfo && dimensionInfo.ordinalMeta) {
        stackedByDimInfo = dimensionInfo;
      }
      if (!stackedDimInfo && dimensionInfo.type !== "ordinal" && dimensionInfo.type !== "time" && (!stackedCoordDimension || stackedCoordDimension === dimensionInfo.coordDim)) {
        stackedDimInfo = dimensionInfo;
      }
    }
  });
  if (stackedDimInfo && !byIndex && !stackedByDimInfo) {
    byIndex = true;
  }
  if (stackedDimInfo) {
    stackResultDimension = "__\0ecstackresult_" + seriesModel.id;
    stackedOverDimension = "__\0ecstackedover_" + seriesModel.id;
    if (stackedByDimInfo) {
      stackedByDimInfo.createInvertedIndices = true;
    }
    var stackedDimCoordDim_1 = stackedDimInfo.coordDim;
    var stackedDimType = stackedDimInfo.type;
    var stackedDimCoordIndex_1 = 0;
    each$4(dimensionDefineList, function(dimensionInfo) {
      if (dimensionInfo.coordDim === stackedDimCoordDim_1) {
        stackedDimCoordIndex_1++;
      }
    });
    var stackedOverDimensionDefine = {
      name: stackResultDimension,
      coordDim: stackedDimCoordDim_1,
      coordDimIndex: stackedDimCoordIndex_1,
      type: stackedDimType,
      isExtraCoord: true,
      isCalculationCoord: true,
      storeDimIndex: dimensionDefineList.length
    };
    var stackResultDimensionDefine = {
      name: stackedOverDimension,
      // This dimension contains stack base (generally, 0), so do not set it as
      // `stackedDimCoordDim` to avoid extent calculation, consider log scale.
      coordDim: stackedOverDimension,
      coordDimIndex: stackedDimCoordIndex_1 + 1,
      type: stackedDimType,
      isExtraCoord: true,
      isCalculationCoord: true,
      storeDimIndex: dimensionDefineList.length + 1
    };
    if (schema) {
      if (store) {
        stackedOverDimensionDefine.storeDimIndex = store.ensureCalculationDimension(stackedOverDimension, stackedDimType);
        stackResultDimensionDefine.storeDimIndex = store.ensureCalculationDimension(stackResultDimension, stackedDimType);
      }
      schema.appendCalculationDimension(stackedOverDimensionDefine);
      schema.appendCalculationDimension(stackResultDimensionDefine);
    } else {
      dimensionDefineList.push(stackedOverDimensionDefine);
      dimensionDefineList.push(stackResultDimensionDefine);
    }
  }
  return {
    stackedDimension: stackedDimInfo && stackedDimInfo.name,
    stackedByDimension: stackedByDimInfo && stackedByDimInfo.name,
    isStackedByIndex: byIndex,
    stackedOverDimension,
    stackResultDimension
  };
}
function isLegacyDimensionsInput(dimensionsInput) {
  return !isSeriesDataSchema(dimensionsInput.schema);
}
function isDimensionStacked(data, stackedDim) {
  return !!stackedDim && stackedDim === data.getCalculationInfo("stackedDimension");
}
function getStackedDimension(data, targetDim) {
  return isDimensionStacked(data, targetDim) ? data.getCalculationInfo("stackResultDimension") : targetDim;
}
function getCoordSysDimDefs(seriesModel, coordSysInfo) {
  var coordSysName = seriesModel.get("coordinateSystem");
  var registeredCoordSys = CoordinateSystemManager.get(coordSysName);
  var coordSysDimDefs;
  if (coordSysInfo && coordSysInfo.coordSysDims) {
    coordSysDimDefs = map$1(coordSysInfo.coordSysDims, function(dim) {
      var dimInfo = {
        name: dim
      };
      var axisModel = coordSysInfo.axisMap.get(dim);
      if (axisModel) {
        var axisType = axisModel.get("type");
        dimInfo.type = getDimensionTypeByAxis(axisType);
      }
      return dimInfo;
    });
  }
  if (!coordSysDimDefs) {
    coordSysDimDefs = registeredCoordSys && (registeredCoordSys.getDimensionsInfo ? registeredCoordSys.getDimensionsInfo() : registeredCoordSys.dimensions.slice()) || ["x", "y"];
  }
  return coordSysDimDefs;
}
function injectOrdinalMeta(dimInfoList, createInvertedIndices, coordSysInfo) {
  var firstCategoryDimIndex;
  var hasNameEncode;
  coordSysInfo && each$4(dimInfoList, function(dimInfo, dimIndex) {
    var coordDim = dimInfo.coordDim;
    var categoryAxisModel = coordSysInfo.categoryAxisMap.get(coordDim);
    if (categoryAxisModel) {
      if (firstCategoryDimIndex == null) {
        firstCategoryDimIndex = dimIndex;
      }
      dimInfo.ordinalMeta = categoryAxisModel.getOrdinalMeta();
      if (createInvertedIndices) {
        dimInfo.createInvertedIndices = true;
      }
    }
    if (dimInfo.otherDims.itemName != null) {
      hasNameEncode = true;
    }
  });
  if (!hasNameEncode && firstCategoryDimIndex != null) {
    dimInfoList[firstCategoryDimIndex].otherDims.itemName = 0;
  }
  return firstCategoryDimIndex;
}
function createSeriesData(sourceRaw, seriesModel, opt) {
  opt = opt || {};
  var sourceManager = seriesModel.getSourceManager();
  var source;
  var isOriginalSource = false;
  if (sourceRaw) {
    isOriginalSource = true;
    source = createSourceFromSeriesDataOption(sourceRaw);
  } else {
    source = sourceManager.getSource();
    isOriginalSource = source.sourceFormat === SOURCE_FORMAT_ORIGINAL;
  }
  var coordSysInfo = getCoordSysInfoBySeries(seriesModel);
  var coordSysDimDefs = getCoordSysDimDefs(seriesModel, coordSysInfo);
  var useEncodeDefaulter = opt.useEncodeDefaulter;
  var encodeDefaulter = isFunction(useEncodeDefaulter) ? useEncodeDefaulter : useEncodeDefaulter ? curry$1(makeSeriesEncodeForAxisCoordSys, coordSysDimDefs, seriesModel) : null;
  var createDimensionOptions = {
    coordDimensions: coordSysDimDefs,
    generateCoord: opt.generateCoord,
    encodeDefine: seriesModel.getEncode(),
    encodeDefaulter,
    canOmitUnusedDimensions: !isOriginalSource
  };
  var schema = prepareSeriesDataSchema(source, createDimensionOptions);
  var firstCategoryDimIndex = injectOrdinalMeta(schema.dimensions, opt.createInvertedIndices, coordSysInfo);
  var store = !isOriginalSource ? sourceManager.getSharedDataStore(schema) : null;
  var stackCalculationInfo = enableDataStack(seriesModel, {
    schema,
    store
  });
  var data = new SeriesData(schema, seriesModel);
  data.setCalculationInfo(stackCalculationInfo);
  var dimValueGetter = firstCategoryDimIndex != null && isNeedCompleteOrdinalData(source) ? function(itemOpt, dimName, dataIndex, dimIndex) {
    return dimIndex === firstCategoryDimIndex ? dataIndex : this.defaultDimValueGetter(itemOpt, dimName, dataIndex, dimIndex);
  } : null;
  data.hasItemOption = false;
  data.initData(
    // Try to reuse the data store in sourceManager if using dataset.
    isOriginalSource ? source : store,
    null,
    dimValueGetter
  );
  return data;
}
function isNeedCompleteOrdinalData(source) {
  if (source.sourceFormat === SOURCE_FORMAT_ORIGINAL) {
    var sampleItem = firstDataNotNull(source.data || []);
    return !isArray(getDataItemValue(sampleItem));
  }
}
function firstDataNotNull(arr) {
  var i = 0;
  while (i < arr.length && arr[i] == null) {
    i++;
  }
  return arr[i];
}
function isIntervalOrLogScale(scale2) {
  return scale2.type === "interval" || scale2.type === "log";
}
function intervalScaleNiceTicks(extent, spanWithBreaks, splitNumber, minInterval, maxInterval) {
  var result = {};
  var interval = result.interval = nice(spanWithBreaks / splitNumber);
  if (minInterval != null && interval < minInterval) {
    interval = result.interval = minInterval;
  }
  if (maxInterval != null && interval > maxInterval) {
    interval = result.interval = maxInterval;
  }
  var precision = result.intervalPrecision = getIntervalPrecision(interval);
  var niceTickExtent = result.niceTickExtent = [round(Math.ceil(extent[0] / interval) * interval, precision), round(Math.floor(extent[1] / interval) * interval, precision)];
  fixExtent(niceTickExtent, extent);
  return result;
}
function increaseInterval(interval) {
  var exp10 = Math.pow(10, quantityExponent(interval));
  var f = interval / exp10;
  if (!f) {
    f = 1;
  } else if (f === 2) {
    f = 3;
  } else if (f === 3) {
    f = 5;
  } else {
    f *= 2;
  }
  return round(f * exp10);
}
function getIntervalPrecision(interval) {
  return getPrecision(interval) + 2;
}
function clamp(niceTickExtent, idx, extent) {
  niceTickExtent[idx] = Math.max(Math.min(niceTickExtent[idx], extent[1]), extent[0]);
}
function fixExtent(niceTickExtent, extent) {
  !isFinite(niceTickExtent[0]) && (niceTickExtent[0] = extent[0]);
  !isFinite(niceTickExtent[1]) && (niceTickExtent[1] = extent[1]);
  clamp(niceTickExtent, 0, extent);
  clamp(niceTickExtent, 1, extent);
  if (niceTickExtent[0] > niceTickExtent[1]) {
    niceTickExtent[0] = niceTickExtent[1];
  }
}
function contain(val, extent) {
  return val >= extent[0] && val <= extent[1];
}
var ScaleCalculator = (
  /** @class */
  function() {
    function ScaleCalculator2() {
      this.normalize = normalize$1;
      this.scale = scale;
    }
    ScaleCalculator2.prototype.updateMethods = function(brkCtx) {
      if (brkCtx.hasBreaks()) {
        this.normalize = bind$1(brkCtx.normalize, brkCtx);
        this.scale = bind$1(brkCtx.scale, brkCtx);
      } else {
        this.normalize = normalize$1;
        this.scale = scale;
      }
    };
    return ScaleCalculator2;
  }()
);
function normalize$1(val, extent) {
  if (extent[1] === extent[0]) {
    return 0.5;
  }
  return (val - extent[0]) / (extent[1] - extent[0]);
}
function scale(val, extent) {
  return val * (extent[1] - extent[0]) + extent[0];
}
function logTransform(base2, extent, noClampNegative) {
  var loggedBase = Math.log(base2);
  return [
    // log(negative) is NaN, so safe guard here.
    // PENDING: But even getting a -Infinity still does not make sense in extent.
    //  Just keep it as is, getting a NaN to make some previous cases works by coincidence.
    Math.log(noClampNegative ? extent[0] : Math.max(0, extent[0])) / loggedBase,
    Math.log(noClampNegative ? extent[1] : Math.max(0, extent[1])) / loggedBase
  ];
}
var Scale = (
  /** @class */
  function() {
    function Scale2(setting) {
      this._calculator = new ScaleCalculator();
      this._setting = setting || {};
      this._extent = [Infinity, -Infinity];
    }
    Scale2.prototype.getSetting = function(name) {
      return this._setting[name];
    };
    Scale2.prototype._innerUnionExtent = function(other) {
      var extent = this._extent;
      this._innerSetExtent(other[0] < extent[0] ? other[0] : extent[0], other[1] > extent[1] ? other[1] : extent[1]);
    };
    Scale2.prototype.unionExtentFromData = function(data, dim) {
      this._innerUnionExtent(data.getApproximateExtent(dim));
    };
    Scale2.prototype.getExtent = function() {
      return this._extent.slice();
    };
    Scale2.prototype.setExtent = function(start, end) {
      this._innerSetExtent(start, end);
    };
    Scale2.prototype._innerSetExtent = function(start, end) {
      var thisExtent = this._extent;
      if (!isNaN(start)) {
        thisExtent[0] = start;
      }
      if (!isNaN(end)) {
        thisExtent[1] = end;
      }
      this._brkCtx && this._brkCtx.update(thisExtent);
    };
    Scale2.prototype.setBreaksFromOption = function(breakOptionList) {
    };
    Scale2.prototype._innerSetBreak = function(parsed) {
      if (this._brkCtx) {
        this._brkCtx.setBreaks(parsed);
        this._calculator.updateMethods(this._brkCtx);
        this._brkCtx.update(this._extent);
      }
    };
    Scale2.prototype._innerGetBreaks = function() {
      return this._brkCtx ? this._brkCtx.breaks : [];
    };
    Scale2.prototype.hasBreaks = function() {
      return this._brkCtx ? this._brkCtx.hasBreaks() : false;
    };
    Scale2.prototype._getExtentSpanWithBreaks = function() {
      return this._brkCtx && this._brkCtx.hasBreaks() ? this._brkCtx.getExtentSpan() : this._extent[1] - this._extent[0];
    };
    Scale2.prototype.isInExtentRange = function(value) {
      return this._extent[0] <= value && this._extent[1] >= value;
    };
    Scale2.prototype.isBlank = function() {
      return this._isBlank;
    };
    Scale2.prototype.setBlank = function(isBlank) {
      this._isBlank = isBlank;
    };
    return Scale2;
  }()
);
enableClassManagement(Scale);
var uidBase = 0;
var OrdinalMeta = (
  /** @class */
  function() {
    function OrdinalMeta2(opt) {
      this.categories = opt.categories || [];
      this._needCollect = opt.needCollect;
      this._deduplication = opt.deduplication;
      this.uid = ++uidBase;
      this._onCollect = opt.onCollect;
    }
    OrdinalMeta2.createByAxisModel = function(axisModel) {
      var option = axisModel.option;
      var data = option.data;
      var categories = data && map$1(data, getName);
      return new OrdinalMeta2({
        categories,
        needCollect: !categories,
        // deduplication is default in axis.
        deduplication: option.dedplication !== false
      });
    };
    OrdinalMeta2.prototype.getOrdinal = function(category) {
      return this._getOrCreateMap().get(category);
    };
    OrdinalMeta2.prototype.parseAndCollect = function(category) {
      var index;
      var needCollect = this._needCollect;
      if (!isString(category) && !needCollect) {
        return category;
      }
      if (needCollect && !this._deduplication) {
        index = this.categories.length;
        this.categories[index] = category;
        this._onCollect && this._onCollect(category, index);
        return index;
      }
      var map2 = this._getOrCreateMap();
      index = map2.get(category);
      if (index == null) {
        if (needCollect) {
          index = this.categories.length;
          this.categories[index] = category;
          map2.set(category, index);
          this._onCollect && this._onCollect(category, index);
        } else {
          index = NaN;
        }
      }
      return index;
    };
    OrdinalMeta2.prototype._getOrCreateMap = function() {
      return this._map || (this._map = createHashMap(this.categories));
    };
    return OrdinalMeta2;
  }()
);
function getName(obj) {
  if (isObject$2(obj) && obj.value != null) {
    return obj.value;
  } else {
    return obj + "";
  }
}
var OrdinalScale = (
  /** @class */
  function(_super) {
    __extends(OrdinalScale2, _super);
    function OrdinalScale2(setting) {
      var _this = _super.call(this, setting) || this;
      _this.type = "ordinal";
      var ordinalMeta = _this.getSetting("ordinalMeta");
      if (!ordinalMeta) {
        ordinalMeta = new OrdinalMeta({});
      }
      if (isArray(ordinalMeta)) {
        ordinalMeta = new OrdinalMeta({
          categories: map$1(ordinalMeta, function(item) {
            return isObject$2(item) ? item.value : item;
          })
        });
      }
      _this._ordinalMeta = ordinalMeta;
      _this._extent = _this.getSetting("extent") || [0, ordinalMeta.categories.length - 1];
      return _this;
    }
    OrdinalScale2.prototype.parse = function(val) {
      if (val == null) {
        return NaN;
      }
      return isString(val) ? this._ordinalMeta.getOrdinal(val) : Math.round(val);
    };
    OrdinalScale2.prototype.contain = function(val) {
      return contain(val, this._extent) && val >= 0 && val < this._ordinalMeta.categories.length;
    };
    OrdinalScale2.prototype.normalize = function(val) {
      val = this._getTickNumber(val);
      return this._calculator.normalize(val, this._extent);
    };
    OrdinalScale2.prototype.scale = function(val) {
      val = Math.round(this._calculator.scale(val, this._extent));
      return this.getRawOrdinalNumber(val);
    };
    OrdinalScale2.prototype.getTicks = function() {
      var ticks = [];
      var extent = this._extent;
      var rank = extent[0];
      while (rank <= extent[1]) {
        ticks.push({
          value: rank
        });
        rank++;
      }
      return ticks;
    };
    OrdinalScale2.prototype.getMinorTicks = function(splitNumber) {
      return;
    };
    OrdinalScale2.prototype.setSortInfo = function(info) {
      if (info == null) {
        this._ordinalNumbersByTick = this._ticksByOrdinalNumber = null;
        return;
      }
      var infoOrdinalNumbers = info.ordinalNumbers;
      var ordinalsByTick = this._ordinalNumbersByTick = [];
      var ticksByOrdinal = this._ticksByOrdinalNumber = [];
      var tickNum = 0;
      var allCategoryLen = this._ordinalMeta.categories.length;
      for (var len2 = Math.min(allCategoryLen, infoOrdinalNumbers.length); tickNum < len2; ++tickNum) {
        var ordinalNumber = infoOrdinalNumbers[tickNum];
        ordinalsByTick[tickNum] = ordinalNumber;
        ticksByOrdinal[ordinalNumber] = tickNum;
      }
      var unusedOrdinal = 0;
      for (; tickNum < allCategoryLen; ++tickNum) {
        while (ticksByOrdinal[unusedOrdinal] != null) {
          unusedOrdinal++;
        }
        ordinalsByTick.push(unusedOrdinal);
        ticksByOrdinal[unusedOrdinal] = tickNum;
      }
    };
    OrdinalScale2.prototype._getTickNumber = function(ordinal) {
      var ticksByOrdinalNumber = this._ticksByOrdinalNumber;
      return ticksByOrdinalNumber && ordinal >= 0 && ordinal < ticksByOrdinalNumber.length ? ticksByOrdinalNumber[ordinal] : ordinal;
    };
    OrdinalScale2.prototype.getRawOrdinalNumber = function(tickNumber) {
      var ordinalNumbersByTick = this._ordinalNumbersByTick;
      return ordinalNumbersByTick && tickNumber >= 0 && tickNumber < ordinalNumbersByTick.length ? ordinalNumbersByTick[tickNumber] : tickNumber;
    };
    OrdinalScale2.prototype.getLabel = function(tick) {
      if (!this.isBlank()) {
        var ordinalNumber = this.getRawOrdinalNumber(tick.value);
        var cateogry = this._ordinalMeta.categories[ordinalNumber];
        return cateogry == null ? "" : cateogry + "";
      }
    };
    OrdinalScale2.prototype.count = function() {
      return this._extent[1] - this._extent[0] + 1;
    };
    OrdinalScale2.prototype.isInExtentRange = function(value) {
      value = this._getTickNumber(value);
      return this._extent[0] <= value && this._extent[1] >= value;
    };
    OrdinalScale2.prototype.getOrdinalMeta = function() {
      return this._ordinalMeta;
    };
    OrdinalScale2.prototype.calcNiceTicks = function() {
    };
    OrdinalScale2.prototype.calcNiceExtent = function() {
    };
    OrdinalScale2.type = "ordinal";
    return OrdinalScale2;
  }(Scale)
);
Scale.registerClass(OrdinalScale);
var roundNumber = round;
var IntervalScale = (
  /** @class */
  function(_super) {
    __extends(IntervalScale2, _super);
    function IntervalScale2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "interval";
      _this._interval = 0;
      _this._intervalPrecision = 2;
      return _this;
    }
    IntervalScale2.prototype.parse = function(val) {
      return val == null || val === "" ? NaN : Number(val);
    };
    IntervalScale2.prototype.contain = function(val) {
      return contain(val, this._extent);
    };
    IntervalScale2.prototype.normalize = function(val) {
      return this._calculator.normalize(val, this._extent);
    };
    IntervalScale2.prototype.scale = function(val) {
      return this._calculator.scale(val, this._extent);
    };
    IntervalScale2.prototype.getInterval = function() {
      return this._interval;
    };
    IntervalScale2.prototype.setInterval = function(interval) {
      this._interval = interval;
      this._niceExtent = this._extent.slice();
      this._intervalPrecision = getIntervalPrecision(interval);
    };
    IntervalScale2.prototype.getTicks = function(opt) {
      opt = opt || {};
      var interval = this._interval;
      var extent = this._extent;
      var niceTickExtent = this._niceExtent;
      var intervalPrecision = this._intervalPrecision;
      var scaleBreakHelper = getScaleBreakHelper();
      var ticks = [];
      if (!interval) {
        return ticks;
      }
      if (opt.breakTicks === "only_break" && scaleBreakHelper) ;
      var safeLimit = 1e4;
      if (extent[0] < niceTickExtent[0]) {
        if (opt.expandToNicedExtent) {
          ticks.push({
            value: roundNumber(niceTickExtent[0] - interval, intervalPrecision)
          });
        } else {
          ticks.push({
            value: extent[0]
          });
        }
      }
      var estimateNiceMultiple = function(tickVal, targetTick) {
        return Math.round((targetTick - tickVal) / interval);
      };
      var tick = niceTickExtent[0];
      while (tick <= niceTickExtent[1]) {
        ticks.push({
          value: tick
        });
        tick = roundNumber(tick + interval, intervalPrecision);
        if (this._brkCtx) {
          var moreMultiple = this._brkCtx.calcNiceTickMultiple(tick, estimateNiceMultiple);
          if (moreMultiple >= 0) {
            tick = roundNumber(tick + moreMultiple * interval, intervalPrecision);
          }
        }
        if (ticks.length > 0 && tick === ticks[ticks.length - 1].value) {
          break;
        }
        if (ticks.length > safeLimit) {
          return [];
        }
      }
      var lastNiceTick = ticks.length ? ticks[ticks.length - 1].value : niceTickExtent[1];
      if (extent[1] > lastNiceTick) {
        if (opt.expandToNicedExtent) {
          ticks.push({
            value: roundNumber(lastNiceTick + interval, intervalPrecision)
          });
        } else {
          ticks.push({
            value: extent[1]
          });
        }
      }
      if (opt.breakTicks !== "none" && scaleBreakHelper) ;
      return ticks;
    };
    IntervalScale2.prototype.getMinorTicks = function(splitNumber) {
      var ticks = this.getTicks({
        expandToNicedExtent: true
      });
      var minorTicks = [];
      var extent = this.getExtent();
      for (var i = 1; i < ticks.length; i++) {
        var nextTick = ticks[i];
        var prevTick = ticks[i - 1];
        if (prevTick["break"] || nextTick["break"]) {
          continue;
        }
        var count = 0;
        var minorTicksGroup = [];
        var interval = nextTick.value - prevTick.value;
        var minorInterval = interval / splitNumber;
        var minorIntervalPrecision = getIntervalPrecision(minorInterval);
        while (count < splitNumber - 1) {
          var minorTick = roundNumber(prevTick.value + (count + 1) * minorInterval, minorIntervalPrecision);
          if (minorTick > extent[0] && minorTick < extent[1]) {
            minorTicksGroup.push(minorTick);
          }
          count++;
        }
        var scaleBreakHelper = getScaleBreakHelper();
        scaleBreakHelper && scaleBreakHelper.pruneTicksByBreak("auto", minorTicksGroup, this._getNonTransBreaks(), function(value) {
          return value;
        }, this._interval, extent);
        minorTicks.push(minorTicksGroup);
      }
      return minorTicks;
    };
    IntervalScale2.prototype._getNonTransBreaks = function() {
      return this._brkCtx ? this._brkCtx.breaks : [];
    };
    IntervalScale2.prototype.getLabel = function(data, opt) {
      if (data == null) {
        return "";
      }
      var precision = opt && opt.precision;
      if (precision == null) {
        precision = getPrecision(data.value) || 0;
      } else if (precision === "auto") {
        precision = this._intervalPrecision;
      }
      var dataNum = roundNumber(data.value, precision, true);
      return addCommas(dataNum);
    };
    IntervalScale2.prototype.calcNiceTicks = function(splitNumber, minInterval, maxInterval) {
      splitNumber = splitNumber || 5;
      var extent = this._extent.slice();
      var span = this._getExtentSpanWithBreaks();
      if (!isFinite(span)) {
        return;
      }
      if (span < 0) {
        span = -span;
        extent.reverse();
        this._innerSetExtent(extent[0], extent[1]);
        extent = this._extent.slice();
      }
      var result = intervalScaleNiceTicks(extent, span, splitNumber, minInterval, maxInterval);
      this._intervalPrecision = result.intervalPrecision;
      this._interval = result.interval;
      this._niceExtent = result.niceTickExtent;
    };
    IntervalScale2.prototype.calcNiceExtent = function(opt) {
      var extent = this._extent.slice();
      if (extent[0] === extent[1]) {
        if (extent[0] !== 0) {
          var expandSize = Math.abs(extent[0]);
          if (!opt.fixMax) {
            extent[1] += expandSize / 2;
            extent[0] -= expandSize / 2;
          } else {
            extent[0] -= expandSize / 2;
          }
        } else {
          extent[1] = 1;
        }
      }
      var span = extent[1] - extent[0];
      if (!isFinite(span)) {
        extent[0] = 0;
        extent[1] = 1;
      }
      this._innerSetExtent(extent[0], extent[1]);
      extent = this._extent.slice();
      this.calcNiceTicks(opt.splitNumber, opt.minInterval, opt.maxInterval);
      var interval = this._interval;
      var intervalPrecition = this._intervalPrecision;
      if (!opt.fixMin) {
        extent[0] = roundNumber(Math.floor(extent[0] / interval) * interval, intervalPrecition);
      }
      if (!opt.fixMax) {
        extent[1] = roundNumber(Math.ceil(extent[1] / interval) * interval, intervalPrecition);
      }
      this._innerSetExtent(extent[0], extent[1]);
    };
    IntervalScale2.prototype.setNiceExtent = function(min, max) {
      this._niceExtent = [min, max];
    };
    IntervalScale2.type = "interval";
    return IntervalScale2;
  }(Scale)
);
Scale.registerClass(IntervalScale);
var STACK_PREFIX = "__ec_stack_";
function getSeriesStackId(seriesModel) {
  return seriesModel.get("stack") || STACK_PREFIX + seriesModel.seriesIndex;
}
function getAxisKey(axis) {
  return axis.dim + axis.index;
}
function prepareLayoutBarSeries(seriesType2, ecModel) {
  var seriesModels = [];
  ecModel.eachSeriesByType(seriesType2, function(seriesModel) {
    if (isOnCartesian(seriesModel)) {
      seriesModels.push(seriesModel);
    }
  });
  return seriesModels;
}
function getValueAxesMinGaps(barSeries) {
  var axisValues = {};
  each$4(barSeries, function(seriesModel) {
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    if (baseAxis.type !== "time" && baseAxis.type !== "value") {
      return;
    }
    var data = seriesModel.getData();
    var key2 = baseAxis.dim + "_" + baseAxis.index;
    var dimIdx = data.getDimensionIndex(data.mapDimension(baseAxis.dim));
    var store = data.getStore();
    for (var i = 0, cnt = store.count(); i < cnt; ++i) {
      var value = store.get(dimIdx, i);
      if (!axisValues[key2]) {
        axisValues[key2] = [value];
      } else {
        axisValues[key2].push(value);
      }
    }
  });
  var axisMinGaps = {};
  for (var key in axisValues) {
    if (axisValues.hasOwnProperty(key)) {
      var valuesInAxis = axisValues[key];
      if (valuesInAxis) {
        valuesInAxis.sort(function(a, b) {
          return a - b;
        });
        var min = null;
        for (var j = 1; j < valuesInAxis.length; ++j) {
          var delta = valuesInAxis[j] - valuesInAxis[j - 1];
          if (delta > 0) {
            min = min === null ? delta : Math.min(min, delta);
          }
        }
        axisMinGaps[key] = min;
      }
    }
  }
  return axisMinGaps;
}
function makeColumnLayout(barSeries) {
  var axisMinGaps = getValueAxesMinGaps(barSeries);
  var seriesInfoList = [];
  each$4(barSeries, function(seriesModel) {
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    var axisExtent = baseAxis.getExtent();
    var bandWidth;
    if (baseAxis.type === "category") {
      bandWidth = baseAxis.getBandWidth();
    } else if (baseAxis.type === "value" || baseAxis.type === "time") {
      var key = baseAxis.dim + "_" + baseAxis.index;
      var minGap = axisMinGaps[key];
      var extentSpan = Math.abs(axisExtent[1] - axisExtent[0]);
      var scale2 = baseAxis.scale.getExtent();
      var scaleSpan = Math.abs(scale2[1] - scale2[0]);
      bandWidth = minGap ? extentSpan / scaleSpan * minGap : extentSpan;
    } else {
      var data = seriesModel.getData();
      bandWidth = Math.abs(axisExtent[1] - axisExtent[0]) / data.count();
    }
    var barWidth = parsePercent(seriesModel.get("barWidth"), bandWidth);
    var barMaxWidth = parsePercent(seriesModel.get("barMaxWidth"), bandWidth);
    var barMinWidth = parsePercent(
      // barMinWidth by default is 0.5 / 1 in cartesian. Because in value axis,
      // the auto-calculated bar width might be less than 0.5 / 1.
      seriesModel.get("barMinWidth") || (isInLargeMode(seriesModel) ? 0.5 : 1),
      bandWidth
    );
    var barGap = seriesModel.get("barGap");
    var barCategoryGap = seriesModel.get("barCategoryGap");
    var defaultBarGap = seriesModel.get("defaultBarGap");
    seriesInfoList.push({
      bandWidth,
      barWidth,
      barMaxWidth,
      barMinWidth,
      barGap,
      barCategoryGap,
      defaultBarGap,
      axisKey: getAxisKey(baseAxis),
      stackId: getSeriesStackId(seriesModel)
    });
  });
  return doCalBarWidthAndOffset(seriesInfoList);
}
function doCalBarWidthAndOffset(seriesInfoList) {
  var columnsMap = {};
  each$4(seriesInfoList, function(seriesInfo, idx) {
    var axisKey = seriesInfo.axisKey;
    var bandWidth = seriesInfo.bandWidth;
    var columnsOnAxis = columnsMap[axisKey] || {
      bandWidth,
      remainedWidth: bandWidth,
      autoWidthCount: 0,
      categoryGap: null,
      gap: seriesInfo.defaultBarGap || 0,
      stacks: {}
    };
    var stacks = columnsOnAxis.stacks;
    columnsMap[axisKey] = columnsOnAxis;
    var stackId = seriesInfo.stackId;
    if (!stacks[stackId]) {
      columnsOnAxis.autoWidthCount++;
    }
    stacks[stackId] = stacks[stackId] || {
      width: 0,
      maxWidth: 0
    };
    var barWidth = seriesInfo.barWidth;
    if (barWidth && !stacks[stackId].width) {
      stacks[stackId].width = barWidth;
      barWidth = Math.min(columnsOnAxis.remainedWidth, barWidth);
      columnsOnAxis.remainedWidth -= barWidth;
    }
    var barMaxWidth = seriesInfo.barMaxWidth;
    barMaxWidth && (stacks[stackId].maxWidth = barMaxWidth);
    var barMinWidth = seriesInfo.barMinWidth;
    barMinWidth && (stacks[stackId].minWidth = barMinWidth);
    var barGap = seriesInfo.barGap;
    barGap != null && (columnsOnAxis.gap = barGap);
    var barCategoryGap = seriesInfo.barCategoryGap;
    barCategoryGap != null && (columnsOnAxis.categoryGap = barCategoryGap);
  });
  var result = {};
  each$4(columnsMap, function(columnsOnAxis, coordSysName) {
    result[coordSysName] = {};
    var stacks = columnsOnAxis.stacks;
    var bandWidth = columnsOnAxis.bandWidth;
    var categoryGapPercent = columnsOnAxis.categoryGap;
    if (categoryGapPercent == null) {
      var columnCount = keys(stacks).length;
      categoryGapPercent = Math.max(35 - columnCount * 4, 15) + "%";
    }
    var categoryGap = parsePercent(categoryGapPercent, bandWidth);
    var barGapPercent = parsePercent(columnsOnAxis.gap, 1);
    var remainedWidth = columnsOnAxis.remainedWidth;
    var autoWidthCount = columnsOnAxis.autoWidthCount;
    var autoWidth = (remainedWidth - categoryGap) / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
    autoWidth = Math.max(autoWidth, 0);
    each$4(stacks, function(column) {
      var maxWidth = column.maxWidth;
      var minWidth = column.minWidth;
      if (!column.width) {
        var finalWidth = autoWidth;
        if (maxWidth && maxWidth < finalWidth) {
          finalWidth = Math.min(maxWidth, remainedWidth);
        }
        if (minWidth && minWidth > finalWidth) {
          finalWidth = minWidth;
        }
        if (finalWidth !== autoWidth) {
          column.width = finalWidth;
          remainedWidth -= finalWidth + barGapPercent * finalWidth;
          autoWidthCount--;
        }
      } else {
        var finalWidth = column.width;
        if (maxWidth) {
          finalWidth = Math.min(finalWidth, maxWidth);
        }
        if (minWidth) {
          finalWidth = Math.max(finalWidth, minWidth);
        }
        column.width = finalWidth;
        remainedWidth -= finalWidth + barGapPercent * finalWidth;
        autoWidthCount--;
      }
    });
    autoWidth = (remainedWidth - categoryGap) / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
    autoWidth = Math.max(autoWidth, 0);
    var widthSum = 0;
    var lastColumn;
    each$4(stacks, function(column, idx) {
      if (!column.width) {
        column.width = autoWidth;
      }
      lastColumn = column;
      widthSum += column.width * (1 + barGapPercent);
    });
    if (lastColumn) {
      widthSum -= lastColumn.width * barGapPercent;
    }
    var offset = -widthSum / 2;
    each$4(stacks, function(column, stackId) {
      result[coordSysName][stackId] = result[coordSysName][stackId] || {
        bandWidth,
        offset,
        width: column.width
      };
      offset += column.width * (1 + barGapPercent);
    });
  });
  return result;
}
function retrieveColumnLayout(barWidthAndOffset, axis, seriesModel) {
  if (barWidthAndOffset && axis) {
    var result = barWidthAndOffset[getAxisKey(axis)];
    return result;
  }
}
function isOnCartesian(seriesModel) {
  return seriesModel.coordinateSystem && seriesModel.coordinateSystem.type === "cartesian2d";
}
function isInLargeMode(seriesModel) {
  return seriesModel.pipelineContext && seriesModel.pipelineContext.large;
}
var bisect = function(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (a[mid][1] < x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
};
var TimeScale = (
  /** @class */
  function(_super) {
    __extends(TimeScale2, _super);
    function TimeScale2(settings) {
      var _this = _super.call(this, settings) || this;
      _this.type = "time";
      return _this;
    }
    TimeScale2.prototype.getLabel = function(tick) {
      var useUTC = this.getSetting("useUTC");
      return format(tick.value, fullLeveledFormatter[getDefaultFormatPrecisionOfInterval(getPrimaryTimeUnit(this._minLevelUnit))] || fullLeveledFormatter.second, useUTC, this.getSetting("locale"));
    };
    TimeScale2.prototype.getFormattedLabel = function(tick, idx, labelFormatter) {
      var isUTC = this.getSetting("useUTC");
      var lang = this.getSetting("locale");
      return leveledFormat(tick, idx, labelFormatter, lang, isUTC);
    };
    TimeScale2.prototype.getTicks = function(opt) {
      var interval = this._interval;
      var extent = this._extent;
      var ticks = [];
      if (!interval) {
        return ticks;
      }
      var useUTC = this.getSetting("useUTC");
      var extent0Unit = getUnitFromValue(extent[1], useUTC);
      ticks.push({
        value: extent[0],
        time: {
          level: 0,
          upperTimeUnit: extent0Unit,
          lowerTimeUnit: extent0Unit
        }
      });
      var innerTicks = getIntervalTicks(this._minLevelUnit, this._approxInterval, useUTC, extent, this._getExtentSpanWithBreaks(), this._brkCtx);
      ticks = ticks.concat(innerTicks);
      var extent1Unit = getUnitFromValue(extent[1], useUTC);
      ticks.push({
        value: extent[1],
        time: {
          level: 0,
          upperTimeUnit: extent1Unit,
          lowerTimeUnit: extent1Unit
        }
      });
      this.getSetting("useUTC");
      var upperUnitIndex = primaryTimeUnits.length - 1;
      var maxLevel = 0;
      each$4(ticks, function(tick) {
        upperUnitIndex = Math.min(upperUnitIndex, indexOf(primaryTimeUnits, tick.time.upperTimeUnit));
        maxLevel = Math.max(maxLevel, tick.time.level);
      });
      return ticks;
    };
    TimeScale2.prototype.calcNiceExtent = function(opt) {
      var extent = this.getExtent();
      if (extent[0] === extent[1]) {
        extent[0] -= ONE_DAY;
        extent[1] += ONE_DAY;
      }
      if (extent[1] === -Infinity && extent[0] === Infinity) {
        var d = /* @__PURE__ */ new Date();
        extent[1] = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
        extent[0] = extent[1] - ONE_DAY;
      }
      this._innerSetExtent(extent[0], extent[1]);
      this.calcNiceTicks(opt.splitNumber, opt.minInterval, opt.maxInterval);
    };
    TimeScale2.prototype.calcNiceTicks = function(approxTickNum, minInterval, maxInterval) {
      approxTickNum = approxTickNum || 10;
      var span = this._getExtentSpanWithBreaks();
      this._approxInterval = span / approxTickNum;
      if (minInterval != null && this._approxInterval < minInterval) {
        this._approxInterval = minInterval;
      }
      if (maxInterval != null && this._approxInterval > maxInterval) {
        this._approxInterval = maxInterval;
      }
      var scaleIntervalsLen = scaleIntervals.length;
      var idx = Math.min(bisect(scaleIntervals, this._approxInterval, 0, scaleIntervalsLen), scaleIntervalsLen - 1);
      this._interval = scaleIntervals[idx][1];
      this._intervalPrecision = getIntervalPrecision(this._interval);
      this._minLevelUnit = scaleIntervals[Math.max(idx - 1, 0)][0];
    };
    TimeScale2.prototype.parse = function(val) {
      return isNumber(val) ? val : +parseDate(val);
    };
    TimeScale2.prototype.contain = function(val) {
      return contain(val, this._extent);
    };
    TimeScale2.prototype.normalize = function(val) {
      return this._calculator.normalize(val, this._extent);
    };
    TimeScale2.prototype.scale = function(val) {
      return this._calculator.scale(val, this._extent);
    };
    TimeScale2.type = "time";
    return TimeScale2;
  }(IntervalScale)
);
var scaleIntervals = [
  // Format                           interval
  ["second", ONE_SECOND],
  ["minute", ONE_MINUTE],
  ["hour", ONE_HOUR],
  ["quarter-day", ONE_HOUR * 6],
  ["half-day", ONE_HOUR * 12],
  ["day", ONE_DAY * 1.2],
  ["half-week", ONE_DAY * 3.5],
  ["week", ONE_DAY * 7],
  ["month", ONE_DAY * 31],
  ["quarter", ONE_DAY * 95],
  ["half-year", ONE_YEAR / 2],
  ["year", ONE_YEAR]
  // 1Y
];
function isPrimaryUnitValueAndGreaterSame(unit, valueA, valueB, isUTC) {
  return roundTime(new Date(valueA), unit, isUTC).getTime() === roundTime(new Date(valueB), unit, isUTC).getTime();
}
function getDateInterval(approxInterval, daysInMonth) {
  approxInterval /= ONE_DAY;
  return approxInterval > 16 ? 16 : approxInterval > 7.5 ? 7 : approxInterval > 3.5 ? 4 : approxInterval > 1.5 ? 2 : 1;
}
function getMonthInterval(approxInterval) {
  var APPROX_ONE_MONTH = 30 * ONE_DAY;
  approxInterval /= APPROX_ONE_MONTH;
  return approxInterval > 6 ? 6 : approxInterval > 3 ? 3 : approxInterval > 2 ? 2 : 1;
}
function getHourInterval(approxInterval) {
  approxInterval /= ONE_HOUR;
  return approxInterval > 12 ? 12 : approxInterval > 6 ? 6 : approxInterval > 3.5 ? 4 : approxInterval > 2 ? 2 : 1;
}
function getMinutesAndSecondsInterval(approxInterval, isMinutes) {
  approxInterval /= isMinutes ? ONE_MINUTE : ONE_SECOND;
  return approxInterval > 30 ? 30 : approxInterval > 20 ? 20 : approxInterval > 15 ? 15 : approxInterval > 10 ? 10 : approxInterval > 5 ? 5 : approxInterval > 2 ? 2 : 1;
}
function getMillisecondsInterval(approxInterval) {
  return nice(approxInterval);
}
function getFirstTimestampOfUnit(timestamp, unitName, isUTC) {
  var upperUnitIdx = Math.max(0, indexOf(primaryTimeUnits, unitName) - 1);
  return roundTime(new Date(timestamp), primaryTimeUnits[upperUnitIdx], isUTC).getTime();
}
function createEstimateNiceMultiple(setMethodName, dateMethodInterval) {
  var tmpDate = /* @__PURE__ */ new Date(0);
  tmpDate[setMethodName](1);
  var tmpTime = tmpDate.getTime();
  tmpDate[setMethodName](1 + dateMethodInterval);
  var approxTimeInterval = tmpDate.getTime() - tmpTime;
  return function(tickVal, targetValue) {
    return Math.max(0, Math.round((targetValue - tickVal) / approxTimeInterval));
  };
}
function getIntervalTicks(bottomUnitName, approxInterval, isUTC, extent, extentSpanWithBreaks, brkCtx) {
  var safeLimit = 1e4;
  var unitNames = timeUnits;
  var iter = 0;
  function addTicksInSpan(interval, minTimestamp, maxTimestamp, getMethodName, setMethodName, isDate, out) {
    var estimateNiceMultiple = createEstimateNiceMultiple(setMethodName, interval);
    var dateTime = minTimestamp;
    var date = new Date(dateTime);
    while (dateTime < maxTimestamp && dateTime <= extent[1]) {
      out.push({
        value: dateTime
      });
      if (iter++ > safeLimit) {
        break;
      }
      date[setMethodName](date[getMethodName]() + interval);
      dateTime = date.getTime();
      if (brkCtx) {
        var moreMultiple = brkCtx.calcNiceTickMultiple(dateTime, estimateNiceMultiple);
        if (moreMultiple > 0) {
          date[setMethodName](date[getMethodName]() + moreMultiple * interval);
          dateTime = date.getTime();
        }
      }
    }
    out.push({
      value: dateTime,
      notAdd: true
    });
  }
  function addLevelTicks(unitName, lastLevelTicks, levelTicks2) {
    var newAddedTicks = [];
    var isFirstLevel = !lastLevelTicks.length;
    if (isPrimaryUnitValueAndGreaterSame(getPrimaryTimeUnit(unitName), extent[0], extent[1], isUTC)) {
      return;
    }
    if (isFirstLevel) {
      lastLevelTicks = [{
        value: getFirstTimestampOfUnit(extent[0], unitName, isUTC)
      }, {
        value: extent[1]
      }];
    }
    for (var i2 = 0; i2 < lastLevelTicks.length - 1; i2++) {
      var startTick = lastLevelTicks[i2].value;
      var endTick = lastLevelTicks[i2 + 1].value;
      if (startTick === endTick) {
        continue;
      }
      var interval = void 0;
      var getterName = void 0;
      var setterName = void 0;
      var isDate = false;
      switch (unitName) {
        case "year":
          interval = Math.max(1, Math.round(approxInterval / ONE_DAY / 365));
          getterName = fullYearGetterName(isUTC);
          setterName = fullYearSetterName(isUTC);
          break;
        case "half-year":
        case "quarter":
        case "month":
          interval = getMonthInterval(approxInterval);
          getterName = monthGetterName(isUTC);
          setterName = monthSetterName(isUTC);
          break;
        case "week":
        // PENDING If week is added. Ignore day.
        case "half-week":
        case "day":
          interval = getDateInterval(approxInterval);
          getterName = dateGetterName(isUTC);
          setterName = dateSetterName(isUTC);
          isDate = true;
          break;
        case "half-day":
        case "quarter-day":
        case "hour":
          interval = getHourInterval(approxInterval);
          getterName = hoursGetterName(isUTC);
          setterName = hoursSetterName(isUTC);
          break;
        case "minute":
          interval = getMinutesAndSecondsInterval(approxInterval, true);
          getterName = minutesGetterName(isUTC);
          setterName = minutesSetterName(isUTC);
          break;
        case "second":
          interval = getMinutesAndSecondsInterval(approxInterval, false);
          getterName = secondsGetterName(isUTC);
          setterName = secondsSetterName(isUTC);
          break;
        case "millisecond":
          interval = getMillisecondsInterval(approxInterval);
          getterName = millisecondsGetterName(isUTC);
          setterName = millisecondsSetterName(isUTC);
          break;
      }
      if (endTick >= extent[0] && startTick <= extent[1]) {
        addTicksInSpan(interval, startTick, endTick, getterName, setterName, isDate, newAddedTicks);
      }
      if (unitName === "year" && levelTicks2.length > 1 && i2 === 0) {
        levelTicks2.unshift({
          value: levelTicks2[0].value - interval
        });
      }
    }
    for (var i2 = 0; i2 < newAddedTicks.length; i2++) {
      levelTicks2.push(newAddedTicks[i2]);
    }
  }
  var levelsTicks = [];
  var currentLevelTicks = [];
  var tickCount = 0;
  var lastLevelTickCount = 0;
  for (var i = 0; i < unitNames.length; ++i) {
    var primaryTimeUnit = getPrimaryTimeUnit(unitNames[i]);
    if (!isPrimaryTimeUnit(unitNames[i])) {
      continue;
    }
    addLevelTicks(unitNames[i], levelsTicks[levelsTicks.length - 1] || [], currentLevelTicks);
    var nextPrimaryTimeUnit = unitNames[i + 1] ? getPrimaryTimeUnit(unitNames[i + 1]) : null;
    if (primaryTimeUnit !== nextPrimaryTimeUnit) {
      if (currentLevelTicks.length) {
        lastLevelTickCount = tickCount;
        currentLevelTicks.sort(function(a, b) {
          return a.value - b.value;
        });
        var levelTicksRemoveDuplicated = [];
        for (var i_1 = 0; i_1 < currentLevelTicks.length; ++i_1) {
          var tickValue = currentLevelTicks[i_1].value;
          if (i_1 === 0 || currentLevelTicks[i_1 - 1].value !== tickValue) {
            levelTicksRemoveDuplicated.push(currentLevelTicks[i_1]);
            if (tickValue >= extent[0] && tickValue <= extent[1]) {
              tickCount++;
            }
          }
        }
        var targetTickNum = extentSpanWithBreaks / approxInterval;
        if (tickCount > targetTickNum * 1.5 && lastLevelTickCount > targetTickNum / 1.5) {
          break;
        }
        levelsTicks.push(levelTicksRemoveDuplicated);
        if (tickCount > targetTickNum || bottomUnitName === unitNames[i]) {
          break;
        }
      }
      currentLevelTicks = [];
    }
  }
  var levelsTicksInExtent = filter(map$1(levelsTicks, function(levelTicks2) {
    return filter(levelTicks2, function(tick) {
      return tick.value >= extent[0] && tick.value <= extent[1] && !tick.notAdd;
    });
  }), function(levelTicks2) {
    return levelTicks2.length > 0;
  });
  var ticks = [];
  var maxLevel = levelsTicksInExtent.length - 1;
  for (var i = 0; i < levelsTicksInExtent.length; ++i) {
    var levelTicks = levelsTicksInExtent[i];
    for (var k = 0; k < levelTicks.length; ++k) {
      var unit = getUnitFromValue(levelTicks[k].value, isUTC);
      ticks.push({
        value: levelTicks[k].value,
        time: {
          level: maxLevel - i,
          upperTimeUnit: unit,
          lowerTimeUnit: unit
        }
      });
    }
  }
  ticks.sort(function(a, b) {
    return a.value - b.value;
  });
  var result = [];
  for (var i = 0; i < ticks.length; ++i) {
    if (i === 0 || ticks[i].value !== ticks[i - 1].value) {
      result.push(ticks[i]);
    }
  }
  return result;
}
Scale.registerClass(TimeScale);
var fixRound = round;
var mathFloor = Math.floor;
var mathCeil = Math.ceil;
var mathPow = Math.pow;
var mathLog = Math.log;
var LogScale = (
  /** @class */
  function(_super) {
    __extends(LogScale2, _super);
    function LogScale2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "log";
      _this.base = 10;
      _this._originalScale = new IntervalScale();
      return _this;
    }
    LogScale2.prototype.getTicks = function(opt) {
      opt = opt || {};
      var extent = this._extent.slice();
      var originalExtent = this._originalScale.getExtent();
      var ticks = _super.prototype.getTicks.call(this, opt);
      var base2 = this.base;
      this._originalScale._innerGetBreaks();
      return map$1(ticks, function(tick) {
        var val = tick.value;
        var roundingCriterion = null;
        var powVal = mathPow(base2, val);
        if (val === extent[0] && this._fixMin) {
          roundingCriterion = originalExtent[0];
        } else if (val === extent[1] && this._fixMax) {
          roundingCriterion = originalExtent[1];
        }
        var vBreak;
        if (roundingCriterion != null) {
          powVal = fixRoundingError(powVal, roundingCriterion);
        }
        return {
          value: powVal,
          "break": vBreak
        };
      }, this);
    };
    LogScale2.prototype._getNonTransBreaks = function() {
      return this._originalScale._innerGetBreaks();
    };
    LogScale2.prototype.setExtent = function(start, end) {
      this._originalScale.setExtent(start, end);
      var loggedExtent = logTransform(this.base, [start, end]);
      _super.prototype.setExtent.call(this, loggedExtent[0], loggedExtent[1]);
    };
    LogScale2.prototype.getExtent = function() {
      var base2 = this.base;
      var extent = _super.prototype.getExtent.call(this);
      extent[0] = mathPow(base2, extent[0]);
      extent[1] = mathPow(base2, extent[1]);
      var originalExtent = this._originalScale.getExtent();
      this._fixMin && (extent[0] = fixRoundingError(extent[0], originalExtent[0]));
      this._fixMax && (extent[1] = fixRoundingError(extent[1], originalExtent[1]));
      return extent;
    };
    LogScale2.prototype.unionExtentFromData = function(data, dim) {
      this._originalScale.unionExtentFromData(data, dim);
      var loggedOther = logTransform(this.base, data.getApproximateExtent(dim), true);
      this._innerUnionExtent(loggedOther);
    };
    LogScale2.prototype.calcNiceTicks = function(approxTickNum) {
      approxTickNum = approxTickNum || 10;
      var extent = this._extent.slice();
      var span = this._getExtentSpanWithBreaks();
      if (!isFinite(span) || span <= 0) {
        return;
      }
      var interval = quantity(span);
      var err = approxTickNum / span * interval;
      if (err <= 0.5) {
        interval *= 10;
      }
      while (!isNaN(interval) && Math.abs(interval) < 1 && Math.abs(interval) > 0) {
        interval *= 10;
      }
      var niceExtent = [fixRound(mathCeil(extent[0] / interval) * interval), fixRound(mathFloor(extent[1] / interval) * interval)];
      this._interval = interval;
      this._intervalPrecision = getIntervalPrecision(interval);
      this._niceExtent = niceExtent;
    };
    LogScale2.prototype.calcNiceExtent = function(opt) {
      _super.prototype.calcNiceExtent.call(this, opt);
      this._fixMin = opt.fixMin;
      this._fixMax = opt.fixMax;
    };
    LogScale2.prototype.contain = function(val) {
      val = mathLog(val) / mathLog(this.base);
      return _super.prototype.contain.call(this, val);
    };
    LogScale2.prototype.normalize = function(val) {
      val = mathLog(val) / mathLog(this.base);
      return _super.prototype.normalize.call(this, val);
    };
    LogScale2.prototype.scale = function(val) {
      val = _super.prototype.scale.call(this, val);
      return mathPow(this.base, val);
    };
    LogScale2.prototype.setBreaksFromOption = function(breakOptionList) {
      {
        return;
      }
    };
    LogScale2.type = "log";
    return LogScale2;
  }(IntervalScale)
);
function fixRoundingError(val, originalVal) {
  return fixRound(val, getPrecision(originalVal));
}
Scale.registerClass(LogScale);
var ScaleRawExtentInfo = (
  /** @class */
  function() {
    function ScaleRawExtentInfo2(scale2, model, originalExtent) {
      this._prepareParams(scale2, model, originalExtent);
    }
    ScaleRawExtentInfo2.prototype._prepareParams = function(scale2, model, dataExtent) {
      if (dataExtent[1] < dataExtent[0]) {
        dataExtent = [NaN, NaN];
      }
      this._dataMin = dataExtent[0];
      this._dataMax = dataExtent[1];
      var isOrdinal = this._isOrdinal = scale2.type === "ordinal";
      this._needCrossZero = scale2.type === "interval" && model.getNeedCrossZero && model.getNeedCrossZero();
      var axisMinValue = model.get("min", true);
      if (axisMinValue == null) {
        axisMinValue = model.get("startValue", true);
      }
      var modelMinRaw = this._modelMinRaw = axisMinValue;
      if (isFunction(modelMinRaw)) {
        this._modelMinNum = parseAxisModelMinMax(scale2, modelMinRaw({
          min: dataExtent[0],
          max: dataExtent[1]
        }));
      } else if (modelMinRaw !== "dataMin") {
        this._modelMinNum = parseAxisModelMinMax(scale2, modelMinRaw);
      }
      var modelMaxRaw = this._modelMaxRaw = model.get("max", true);
      if (isFunction(modelMaxRaw)) {
        this._modelMaxNum = parseAxisModelMinMax(scale2, modelMaxRaw({
          min: dataExtent[0],
          max: dataExtent[1]
        }));
      } else if (modelMaxRaw !== "dataMax") {
        this._modelMaxNum = parseAxisModelMinMax(scale2, modelMaxRaw);
      }
      if (isOrdinal) {
        this._axisDataLen = model.getCategories().length;
      } else {
        var boundaryGap = model.get("boundaryGap");
        var boundaryGapArr = isArray(boundaryGap) ? boundaryGap : [boundaryGap || 0, boundaryGap || 0];
        if (typeof boundaryGapArr[0] === "boolean" || typeof boundaryGapArr[1] === "boolean") {
          this._boundaryGapInner = [0, 0];
        } else {
          this._boundaryGapInner = [parsePercent$1(boundaryGapArr[0], 1), parsePercent$1(boundaryGapArr[1], 1)];
        }
      }
    };
    ScaleRawExtentInfo2.prototype.calculate = function() {
      var isOrdinal = this._isOrdinal;
      var dataMin = this._dataMin;
      var dataMax = this._dataMax;
      var axisDataLen = this._axisDataLen;
      var boundaryGapInner = this._boundaryGapInner;
      var span = !isOrdinal ? dataMax - dataMin || Math.abs(dataMin) : null;
      var min = this._modelMinRaw === "dataMin" ? dataMin : this._modelMinNum;
      var max = this._modelMaxRaw === "dataMax" ? dataMax : this._modelMaxNum;
      var minFixed = min != null;
      var maxFixed = max != null;
      if (min == null) {
        min = isOrdinal ? axisDataLen ? 0 : NaN : dataMin - boundaryGapInner[0] * span;
      }
      if (max == null) {
        max = isOrdinal ? axisDataLen ? axisDataLen - 1 : NaN : dataMax + boundaryGapInner[1] * span;
      }
      (min == null || !isFinite(min)) && (min = NaN);
      (max == null || !isFinite(max)) && (max = NaN);
      var isBlank = eqNaN(min) || eqNaN(max) || isOrdinal && !axisDataLen;
      if (this._needCrossZero) {
        if (min > 0 && max > 0 && !minFixed) {
          min = 0;
        }
        if (min < 0 && max < 0 && !maxFixed) {
          max = 0;
        }
      }
      var determinedMin = this._determinedMin;
      var determinedMax = this._determinedMax;
      if (determinedMin != null) {
        min = determinedMin;
        minFixed = true;
      }
      if (determinedMax != null) {
        max = determinedMax;
        maxFixed = true;
      }
      return {
        min,
        max,
        minFixed,
        maxFixed,
        isBlank
      };
    };
    ScaleRawExtentInfo2.prototype.modifyDataMinMax = function(minMaxName, val) {
      this[DATA_MIN_MAX_ATTR[minMaxName]] = val;
    };
    ScaleRawExtentInfo2.prototype.setDeterminedMinMax = function(minMaxName, val) {
      var attr = DETERMINED_MIN_MAX_ATTR[minMaxName];
      this[attr] = val;
    };
    ScaleRawExtentInfo2.prototype.freeze = function() {
      this.frozen = true;
    };
    return ScaleRawExtentInfo2;
  }()
);
var DETERMINED_MIN_MAX_ATTR = {
  min: "_determinedMin",
  max: "_determinedMax"
};
var DATA_MIN_MAX_ATTR = {
  min: "_dataMin",
  max: "_dataMax"
};
function ensureScaleRawExtentInfo(scale2, model, originalExtent) {
  var rawExtentInfo = scale2.rawExtentInfo;
  if (rawExtentInfo) {
    return rawExtentInfo;
  }
  rawExtentInfo = new ScaleRawExtentInfo(scale2, model, originalExtent);
  scale2.rawExtentInfo = rawExtentInfo;
  return rawExtentInfo;
}
function parseAxisModelMinMax(scale2, minMax) {
  return minMax == null ? null : eqNaN(minMax) ? NaN : scale2.parse(minMax);
}
function getScaleExtent(scale2, model) {
  var scaleType = scale2.type;
  var rawExtentResult = ensureScaleRawExtentInfo(scale2, model, scale2.getExtent()).calculate();
  scale2.setBlank(rawExtentResult.isBlank);
  var min = rawExtentResult.min;
  var max = rawExtentResult.max;
  var ecModel = model.ecModel;
  if (ecModel && scaleType === "time") {
    var barSeriesModels = prepareLayoutBarSeries("bar", ecModel);
    var isBaseAxisAndHasBarSeries_1 = false;
    each$4(barSeriesModels, function(seriesModel) {
      isBaseAxisAndHasBarSeries_1 = isBaseAxisAndHasBarSeries_1 || seriesModel.getBaseAxis() === model.axis;
    });
    if (isBaseAxisAndHasBarSeries_1) {
      var barWidthAndOffset = makeColumnLayout(barSeriesModels);
      var adjustedScale = adjustScaleForOverflow(min, max, model, barWidthAndOffset);
      min = adjustedScale.min;
      max = adjustedScale.max;
    }
  }
  return {
    extent: [min, max],
    // "fix" means "fixed", the value should not be
    // changed in the subsequent steps.
    fixMin: rawExtentResult.minFixed,
    fixMax: rawExtentResult.maxFixed
  };
}
function adjustScaleForOverflow(min, max, model, barWidthAndOffset) {
  var axisExtent = model.axis.getExtent();
  var axisLength = Math.abs(axisExtent[1] - axisExtent[0]);
  var barsOnCurrentAxis = retrieveColumnLayout(barWidthAndOffset, model.axis);
  if (barsOnCurrentAxis === void 0) {
    return {
      min,
      max
    };
  }
  var minOverflow = Infinity;
  each$4(barsOnCurrentAxis, function(item) {
    minOverflow = Math.min(item.offset, minOverflow);
  });
  var maxOverflow = -Infinity;
  each$4(barsOnCurrentAxis, function(item) {
    maxOverflow = Math.max(item.offset + item.width, maxOverflow);
  });
  minOverflow = Math.abs(minOverflow);
  maxOverflow = Math.abs(maxOverflow);
  var totalOverFlow = minOverflow + maxOverflow;
  var oldRange = max - min;
  var oldRangePercentOfNew = 1 - (minOverflow + maxOverflow) / axisLength;
  var overflowBuffer = oldRange / oldRangePercentOfNew - oldRange;
  max += overflowBuffer * (maxOverflow / totalOverFlow);
  min -= overflowBuffer * (minOverflow / totalOverFlow);
  return {
    min,
    max
  };
}
function niceScaleExtent(scale2, inModel) {
  var model = inModel;
  var extentInfo = getScaleExtent(scale2, model);
  var extent = extentInfo.extent;
  var splitNumber = model.get("splitNumber");
  if (scale2 instanceof LogScale) {
    scale2.base = model.get("logBase");
  }
  var scaleType = scale2.type;
  var interval = model.get("interval");
  var isIntervalOrTime = scaleType === "interval" || scaleType === "time";
  scale2.setBreaksFromOption(retrieveAxisBreaksOption(model));
  scale2.setExtent(extent[0], extent[1]);
  scale2.calcNiceExtent({
    splitNumber,
    fixMin: extentInfo.fixMin,
    fixMax: extentInfo.fixMax,
    minInterval: isIntervalOrTime ? model.get("minInterval") : null,
    maxInterval: isIntervalOrTime ? model.get("maxInterval") : null
  });
  if (interval != null) {
    scale2.setInterval && scale2.setInterval(interval);
  }
}
function createScaleByModel(model, axisType) {
  axisType = axisType || model.get("type");
  if (axisType) {
    switch (axisType) {
      // Buildin scale
      case "category":
        return new OrdinalScale({
          ordinalMeta: model.getOrdinalMeta ? model.getOrdinalMeta() : model.getCategories(),
          extent: [Infinity, -Infinity]
        });
      case "time":
        return new TimeScale({
          locale: model.ecModel.getLocaleModel(),
          useUTC: model.ecModel.get("useUTC")
        });
      default:
        return new (Scale.getClass(axisType) || IntervalScale)();
    }
  }
}
function ifAxisCrossZero(axis) {
  var dataExtent = axis.scale.getExtent();
  var min = dataExtent[0];
  var max = dataExtent[1];
  return !(min > 0 && max > 0 || min < 0 && max < 0);
}
function makeLabelFormatter(axis) {
  var labelFormatter = axis.getLabelModel().get("formatter");
  if (axis.type === "time") {
    var parsed_1 = parseTimeAxisLabelFormatter(labelFormatter);
    return function(tick, idx) {
      return axis.scale.getFormattedLabel(tick, idx, parsed_1);
    };
  } else if (isString(labelFormatter)) {
    return function(tick) {
      var label = axis.scale.getLabel(tick);
      var text = labelFormatter.replace("{value}", label != null ? label : "");
      return text;
    };
  } else if (isFunction(labelFormatter)) {
    if (axis.type === "category") {
      return function(tick, idx) {
        return labelFormatter(
          getAxisRawValue(axis, tick),
          tick.value - axis.scale.getExtent()[0],
          null
          // Using `null` just for backward compat.
        );
      };
    }
    var scaleBreakHelper_1 = getScaleBreakHelper();
    return function(tick, idx) {
      var extra = null;
      if (scaleBreakHelper_1) {
        extra = scaleBreakHelper_1.makeAxisLabelFormatterParamBreak(extra, tick["break"]);
      }
      return labelFormatter(getAxisRawValue(axis, tick), idx, extra);
    };
  } else {
    return function(tick) {
      return axis.scale.getLabel(tick);
    };
  }
}
function getAxisRawValue(axis, tick) {
  return axis.type === "category" ? axis.scale.getLabel(tick) : tick.value;
}
function getOptionCategoryInterval(model) {
  var interval = model.get("interval");
  return interval == null ? "auto" : interval;
}
function shouldShowAllLabels(axis) {
  return axis.type === "category" && getOptionCategoryInterval(axis.getLabelModel()) === 0;
}
function getDataDimensionsOnAxis(data, axisDim) {
  var dataDimMap = {};
  each$4(data.mapDimensionsAll(axisDim), function(dataDim) {
    dataDimMap[getStackedDimension(data, dataDim)] = true;
  });
  return keys(dataDimMap);
}
function isNameLocationCenter(nameLocation) {
  return nameLocation === "middle" || nameLocation === "center";
}
function shouldAxisShow(axisModel) {
  return axisModel.getShallow("show");
}
function retrieveAxisBreaksOption(model) {
  var option = model.get("breaks", true);
  if (option != null) {
    {
      return void 0;
    }
  }
}
var AxisModelCommonMixin = (
  /** @class */
  function() {
    function AxisModelCommonMixin2() {
    }
    AxisModelCommonMixin2.prototype.getNeedCrossZero = function() {
      var option = this.option;
      return !option.scale;
    };
    AxisModelCommonMixin2.prototype.getCoordSysModel = function() {
      return;
    };
    return AxisModelCommonMixin2;
  }()
);
var extensions = [];
var extensionRegisters = {
  registerPreprocessor,
  registerProcessor,
  registerPostInit,
  registerPostUpdate,
  registerUpdateLifecycle,
  registerAction,
  registerCoordinateSystem,
  registerLayout,
  registerVisual,
  registerTransform,
  registerLoading,
  registerMap,
  registerImpl,
  PRIORITY,
  ComponentModel,
  ComponentView,
  SeriesModel,
  ChartView,
  // TODO Use ComponentModel and SeriesModel instead of Constructor
  registerComponentModel: function(ComponentModelClass) {
    ComponentModel.registerClass(ComponentModelClass);
  },
  registerComponentView: function(ComponentViewClass) {
    ComponentView.registerClass(ComponentViewClass);
  },
  registerSeriesModel: function(SeriesModelClass) {
    SeriesModel.registerClass(SeriesModelClass);
  },
  registerChartView: function(ChartViewClass) {
    ChartView.registerClass(ChartViewClass);
  },
  registerCustomSeries: function(seriesType2, renderItem) {
  },
  registerSubTypeDefaulter: function(componentType, defaulter) {
    ComponentModel.registerSubTypeDefaulter(componentType, defaulter);
  },
  registerPainter: function(painterType, PainterCtor) {
    registerPainter(painterType, PainterCtor);
  }
};
function use(ext) {
  if (isArray(ext)) {
    each$4(ext, function(singleExt) {
      use(singleExt);
    });
    return;
  }
  if (indexOf(extensions, ext) >= 0) {
    return;
  }
  extensions.push(ext);
  if (isFunction(ext)) {
    ext = {
      install: ext
    };
  }
  ext.install(extensionRegisters);
}
var modelInner = makeInner();
var axisInner = makeInner();
var AxisTickLabelComputingKind = {
  estimate: 1,
  determine: 2
};
function createAxisLabelsComputingContext(kind) {
  return {
    out: {
      noPxChangeTryDetermine: []
    },
    kind
  };
}
function tickValuesToNumbers(axis, values) {
  var nums = map$1(values, function(val) {
    return axis.scale.parse(val);
  });
  if (axis.type === "time" && nums.length > 0) {
    nums.sort();
    nums.unshift(nums[0]);
    nums.push(nums[nums.length - 1]);
  }
  return nums;
}
function createAxisLabels(axis, ctx) {
  var custom = axis.getLabelModel().get("customValues");
  if (custom) {
    var labelFormatter_1 = makeLabelFormatter(axis);
    var extent_1 = axis.scale.getExtent();
    var tickNumbers = tickValuesToNumbers(axis, custom);
    var ticks = filter(tickNumbers, function(val) {
      return val >= extent_1[0] && val <= extent_1[1];
    });
    return {
      labels: map$1(ticks, function(numval) {
        var tick = {
          value: numval
        };
        return {
          formattedLabel: labelFormatter_1(tick),
          rawLabel: axis.scale.getLabel(tick),
          tickValue: numval,
          time: void 0,
          "break": void 0
        };
      })
    };
  }
  return axis.type === "category" ? makeCategoryLabels(axis, ctx) : makeRealNumberLabels(axis);
}
function createAxisTicks(axis, tickModel, opt) {
  var custom = axis.getTickModel().get("customValues");
  if (custom) {
    var extent_2 = axis.scale.getExtent();
    var tickNumbers = tickValuesToNumbers(axis, custom);
    return {
      ticks: filter(tickNumbers, function(val) {
        return val >= extent_2[0] && val <= extent_2[1];
      })
    };
  }
  return axis.type === "category" ? makeCategoryTicks(axis, tickModel) : {
    ticks: map$1(axis.scale.getTicks(opt), function(tick) {
      return tick.value;
    })
  };
}
function makeCategoryLabels(axis, ctx) {
  var labelModel = axis.getLabelModel();
  var result = makeCategoryLabelsActually(axis, labelModel, ctx);
  return !labelModel.get("show") || axis.scale.isBlank() ? {
    labels: []
  } : result;
}
function makeCategoryLabelsActually(axis, labelModel, ctx) {
  var labelsCache = ensureCategoryLabelCache(axis);
  var optionLabelInterval = getOptionCategoryInterval(labelModel);
  var isEstimate = ctx.kind === AxisTickLabelComputingKind.estimate;
  if (!isEstimate) {
    var result_1 = axisCacheGet(labelsCache, optionLabelInterval);
    if (result_1) {
      return result_1;
    }
  }
  var labels;
  var numericLabelInterval;
  if (isFunction(optionLabelInterval)) {
    labels = makeLabelsByCustomizedCategoryInterval(axis, optionLabelInterval);
  } else {
    numericLabelInterval = optionLabelInterval === "auto" ? makeAutoCategoryInterval(axis, ctx) : optionLabelInterval;
    labels = makeLabelsByNumericCategoryInterval(axis, numericLabelInterval);
  }
  var result = {
    labels,
    labelCategoryInterval: numericLabelInterval
  };
  if (!isEstimate) {
    axisCacheSet(labelsCache, optionLabelInterval, result);
  } else {
    ctx.out.noPxChangeTryDetermine.push(function() {
      axisCacheSet(labelsCache, optionLabelInterval, result);
      return true;
    });
  }
  return result;
}
function makeCategoryTicks(axis, tickModel) {
  var ticksCache = ensureCategoryTickCache(axis);
  var optionTickInterval = getOptionCategoryInterval(tickModel);
  var result = axisCacheGet(ticksCache, optionTickInterval);
  if (result) {
    return result;
  }
  var ticks;
  var tickCategoryInterval;
  if (!tickModel.get("show") || axis.scale.isBlank()) {
    ticks = [];
  }
  if (isFunction(optionTickInterval)) {
    ticks = makeLabelsByCustomizedCategoryInterval(axis, optionTickInterval, true);
  } else if (optionTickInterval === "auto") {
    var labelsResult = makeCategoryLabelsActually(axis, axis.getLabelModel(), createAxisLabelsComputingContext(AxisTickLabelComputingKind.determine));
    tickCategoryInterval = labelsResult.labelCategoryInterval;
    ticks = map$1(labelsResult.labels, function(labelItem) {
      return labelItem.tickValue;
    });
  } else {
    tickCategoryInterval = optionTickInterval;
    ticks = makeLabelsByNumericCategoryInterval(axis, tickCategoryInterval, true);
  }
  return axisCacheSet(ticksCache, optionTickInterval, {
    ticks,
    tickCategoryInterval
  });
}
function makeRealNumberLabels(axis) {
  var ticks = axis.scale.getTicks();
  var labelFormatter = makeLabelFormatter(axis);
  return {
    labels: map$1(ticks, function(tick, idx) {
      return {
        formattedLabel: labelFormatter(tick, idx),
        rawLabel: axis.scale.getLabel(tick),
        tickValue: tick.value,
        time: tick.time,
        "break": tick["break"]
      };
    })
  };
}
var ensureCategoryTickCache = initAxisCacheMethod("axisTick");
var ensureCategoryLabelCache = initAxisCacheMethod("axisLabel");
function initAxisCacheMethod(prop) {
  return function ensureCache(axis) {
    return axisInner(axis)[prop] || (axisInner(axis)[prop] = {
      list: []
    });
  };
}
function axisCacheGet(cache, key) {
  for (var i = 0; i < cache.list.length; i++) {
    if (cache.list[i].key === key) {
      return cache.list[i].value;
    }
  }
}
function axisCacheSet(cache, key, value) {
  cache.list.push({
    key,
    value
  });
  return value;
}
function makeAutoCategoryInterval(axis, ctx) {
  if (ctx.kind === AxisTickLabelComputingKind.estimate) {
    var result_2 = axis.calculateCategoryInterval(ctx);
    ctx.out.noPxChangeTryDetermine.push(function() {
      axisInner(axis).autoInterval = result_2;
      return true;
    });
    return result_2;
  }
  var result = axisInner(axis).autoInterval;
  return result != null ? result : axisInner(axis).autoInterval = axis.calculateCategoryInterval(ctx);
}
function calculateCategoryInterval(axis, ctx) {
  var kind = ctx.kind;
  var params = fetchAutoCategoryIntervalCalculationParams(axis);
  var labelFormatter = makeLabelFormatter(axis);
  var rotation = (params.axisRotate - params.labelRotate) / 180 * Math.PI;
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var tickCount = ordinalScale.count();
  if (ordinalExtent[1] - ordinalExtent[0] < 1) {
    return 0;
  }
  var step = 1;
  var maxCount = 40;
  if (tickCount > maxCount) {
    step = Math.max(1, Math.floor(tickCount / maxCount));
  }
  var tickValue = ordinalExtent[0];
  var unitSpan = axis.dataToCoord(tickValue + 1) - axis.dataToCoord(tickValue);
  var unitW = Math.abs(unitSpan * Math.cos(rotation));
  var unitH = Math.abs(unitSpan * Math.sin(rotation));
  var maxW = 0;
  var maxH = 0;
  for (; tickValue <= ordinalExtent[1]; tickValue += step) {
    var width = 0;
    var height = 0;
    var rect = getBoundingRect(labelFormatter({
      value: tickValue
    }), params.font, "center", "top");
    width = rect.width * 1.3;
    height = rect.height * 1.3;
    maxW = Math.max(maxW, width, 7);
    maxH = Math.max(maxH, height, 7);
  }
  var dw = maxW / unitW;
  var dh = maxH / unitH;
  isNaN(dw) && (dw = Infinity);
  isNaN(dh) && (dh = Infinity);
  var interval = Math.max(0, Math.floor(Math.min(dw, dh)));
  if (kind === AxisTickLabelComputingKind.estimate) {
    ctx.out.noPxChangeTryDetermine.push(bind$1(calculateCategoryIntervalTryDetermine, null, axis, interval, tickCount));
    return interval;
  }
  var lastInterval = calculateCategoryIntervalDealCache(axis, interval, tickCount);
  return lastInterval != null ? lastInterval : interval;
}
function calculateCategoryIntervalTryDetermine(axis, interval, tickCount) {
  return calculateCategoryIntervalDealCache(axis, interval, tickCount) == null;
}
function calculateCategoryIntervalDealCache(axis, interval, tickCount) {
  var cache = modelInner(axis.model);
  var axisExtent = axis.getExtent();
  var lastAutoInterval = cache.lastAutoInterval;
  var lastTickCount = cache.lastTickCount;
  if (lastAutoInterval != null && lastTickCount != null && Math.abs(lastAutoInterval - interval) <= 1 && Math.abs(lastTickCount - tickCount) <= 1 && lastAutoInterval > interval && cache.axisExtent0 === axisExtent[0] && cache.axisExtent1 === axisExtent[1]) {
    return lastAutoInterval;
  } else {
    cache.lastTickCount = tickCount;
    cache.lastAutoInterval = interval;
    cache.axisExtent0 = axisExtent[0];
    cache.axisExtent1 = axisExtent[1];
  }
}
function fetchAutoCategoryIntervalCalculationParams(axis) {
  var labelModel = axis.getLabelModel();
  return {
    axisRotate: axis.getRotate ? axis.getRotate() : axis.isHorizontal && !axis.isHorizontal() ? 90 : 0,
    labelRotate: labelModel.get("rotate") || 0,
    font: labelModel.getFont()
  };
}
function makeLabelsByNumericCategoryInterval(axis, categoryInterval, onlyTick) {
  var labelFormatter = makeLabelFormatter(axis);
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var labelModel = axis.getLabelModel();
  var result = [];
  var step = Math.max((categoryInterval || 0) + 1, 1);
  var startTick = ordinalExtent[0];
  var tickCount = ordinalScale.count();
  if (startTick !== 0 && step > 1 && tickCount / step > 2) {
    startTick = Math.round(Math.ceil(startTick / step) * step);
  }
  var showAllLabel = shouldShowAllLabels(axis);
  var includeMinLabel = labelModel.get("showMinLabel") || showAllLabel;
  var includeMaxLabel = labelModel.get("showMaxLabel") || showAllLabel;
  if (includeMinLabel && startTick !== ordinalExtent[0]) {
    addItem(ordinalExtent[0]);
  }
  var tickValue = startTick;
  for (; tickValue <= ordinalExtent[1]; tickValue += step) {
    addItem(tickValue);
  }
  if (includeMaxLabel && tickValue - step !== ordinalExtent[1]) {
    addItem(ordinalExtent[1]);
  }
  function addItem(tickValue2) {
    var tickObj = {
      value: tickValue2
    };
    result.push(onlyTick ? tickValue2 : {
      formattedLabel: labelFormatter(tickObj),
      rawLabel: ordinalScale.getLabel(tickObj),
      tickValue: tickValue2,
      time: void 0,
      "break": void 0
    });
  }
  return result;
}
function makeLabelsByCustomizedCategoryInterval(axis, categoryInterval, onlyTick) {
  var ordinalScale = axis.scale;
  var labelFormatter = makeLabelFormatter(axis);
  var result = [];
  each$4(ordinalScale.getTicks(), function(tick) {
    var rawLabel = ordinalScale.getLabel(tick);
    var tickValue = tick.value;
    if (categoryInterval(tick.value, rawLabel)) {
      result.push(onlyTick ? tickValue : {
        formattedLabel: labelFormatter(tick),
        rawLabel,
        tickValue,
        time: void 0,
        "break": void 0
      });
    }
  });
  return result;
}
var NORMALIZED_EXTENT = [0, 1];
var Axis = (
  /** @class */
  function() {
    function Axis2(dim, scale2, extent) {
      this.onBand = false;
      this.inverse = false;
      this.dim = dim;
      this.scale = scale2;
      this._extent = extent || [0, 0];
    }
    Axis2.prototype.contain = function(coord) {
      var extent = this._extent;
      var min = Math.min(extent[0], extent[1]);
      var max = Math.max(extent[0], extent[1]);
      return coord >= min && coord <= max;
    };
    Axis2.prototype.containData = function(data) {
      return this.scale.contain(this.scale.parse(data));
    };
    Axis2.prototype.getExtent = function() {
      return this._extent.slice();
    };
    Axis2.prototype.getPixelPrecision = function(dataExtent) {
      return getPixelPrecision(dataExtent || this.scale.getExtent(), this._extent);
    };
    Axis2.prototype.setExtent = function(start, end) {
      var extent = this._extent;
      extent[0] = start;
      extent[1] = end;
    };
    Axis2.prototype.dataToCoord = function(data, clamp2) {
      var extent = this._extent;
      var scale2 = this.scale;
      data = scale2.normalize(scale2.parse(data));
      if (this.onBand && scale2.type === "ordinal") {
        extent = extent.slice();
        fixExtentWithBands(extent, scale2.count());
      }
      return linearMap(data, NORMALIZED_EXTENT, extent, clamp2);
    };
    Axis2.prototype.coordToData = function(coord, clamp2) {
      var extent = this._extent;
      var scale2 = this.scale;
      if (this.onBand && scale2.type === "ordinal") {
        extent = extent.slice();
        fixExtentWithBands(extent, scale2.count());
      }
      var t = linearMap(coord, extent, NORMALIZED_EXTENT, clamp2);
      return this.scale.scale(t);
    };
    Axis2.prototype.pointToData = function(point, clamp2) {
      return;
    };
    Axis2.prototype.getTicksCoords = function(opt) {
      opt = opt || {};
      var tickModel = opt.tickModel || this.getTickModel();
      var result = createAxisTicks(this, tickModel, {
        breakTicks: opt.breakTicks,
        pruneByBreak: opt.pruneByBreak
      });
      var ticks = result.ticks;
      var ticksCoords = map$1(ticks, function(tickVal) {
        return {
          coord: this.dataToCoord(this.scale.type === "ordinal" ? this.scale.getRawOrdinalNumber(tickVal) : tickVal),
          tickValue: tickVal
        };
      }, this);
      var alignWithLabel = tickModel.get("alignWithLabel");
      fixOnBandTicksCoords(this, ticksCoords, alignWithLabel, opt.clamp);
      return ticksCoords;
    };
    Axis2.prototype.getMinorTicksCoords = function() {
      if (this.scale.type === "ordinal") {
        return [];
      }
      var minorTickModel = this.model.getModel("minorTick");
      var splitNumber = minorTickModel.get("splitNumber");
      if (!(splitNumber > 0 && splitNumber < 100)) {
        splitNumber = 5;
      }
      var minorTicks = this.scale.getMinorTicks(splitNumber);
      var minorTicksCoords = map$1(minorTicks, function(minorTicksGroup) {
        return map$1(minorTicksGroup, function(minorTick) {
          return {
            coord: this.dataToCoord(minorTick),
            tickValue: minorTick
          };
        }, this);
      }, this);
      return minorTicksCoords;
    };
    Axis2.prototype.getViewLabels = function(ctx) {
      ctx = ctx || createAxisLabelsComputingContext(AxisTickLabelComputingKind.determine);
      return createAxisLabels(this, ctx).labels;
    };
    Axis2.prototype.getLabelModel = function() {
      return this.model.getModel("axisLabel");
    };
    Axis2.prototype.getTickModel = function() {
      return this.model.getModel("axisTick");
    };
    Axis2.prototype.getBandWidth = function() {
      var axisExtent = this._extent;
      var dataExtent = this.scale.getExtent();
      var len2 = dataExtent[1] - dataExtent[0] + (this.onBand ? 1 : 0);
      len2 === 0 && (len2 = 1);
      var size = Math.abs(axisExtent[1] - axisExtent[0]);
      return Math.abs(size) / len2;
    };
    Axis2.prototype.calculateCategoryInterval = function(ctx) {
      ctx = ctx || createAxisLabelsComputingContext(AxisTickLabelComputingKind.determine);
      return calculateCategoryInterval(this, ctx);
    };
    return Axis2;
  }()
);
function fixExtentWithBands(extent, nTick) {
  var size = extent[1] - extent[0];
  var len2 = nTick;
  var margin = size / len2 / 2;
  extent[0] += margin;
  extent[1] -= margin;
}
function fixOnBandTicksCoords(axis, ticksCoords, alignWithLabel, clamp2) {
  var ticksLen = ticksCoords.length;
  if (!axis.onBand || alignWithLabel || !ticksLen) {
    return;
  }
  var axisExtent = axis.getExtent();
  var last;
  var diffSize;
  if (ticksLen === 1) {
    ticksCoords[0].coord = axisExtent[0];
    ticksCoords[0].onBand = true;
    last = ticksCoords[1] = {
      coord: axisExtent[1],
      tickValue: ticksCoords[0].tickValue,
      onBand: true
    };
  } else {
    var crossLen = ticksCoords[ticksLen - 1].tickValue - ticksCoords[0].tickValue;
    var shift_1 = (ticksCoords[ticksLen - 1].coord - ticksCoords[0].coord) / crossLen;
    each$4(ticksCoords, function(ticksItem) {
      ticksItem.coord -= shift_1 / 2;
      ticksItem.onBand = true;
    });
    var dataExtent = axis.scale.getExtent();
    diffSize = 1 + dataExtent[1] - ticksCoords[ticksLen - 1].tickValue;
    last = {
      coord: ticksCoords[ticksLen - 1].coord + shift_1 * diffSize,
      tickValue: dataExtent[1] + 1,
      onBand: true
    };
    ticksCoords.push(last);
  }
  var inverse = axisExtent[0] > axisExtent[1];
  if (littleThan(ticksCoords[0].coord, axisExtent[0])) {
    clamp2 ? ticksCoords[0].coord = axisExtent[0] : ticksCoords.shift();
  }
  if (clamp2 && littleThan(axisExtent[0], ticksCoords[0].coord)) {
    ticksCoords.unshift({
      coord: axisExtent[0],
      onBand: true
    });
  }
  if (littleThan(axisExtent[1], last.coord)) {
    clamp2 ? last.coord = axisExtent[1] : ticksCoords.pop();
  }
  if (clamp2 && littleThan(last.coord, axisExtent[1])) {
    ticksCoords.push({
      coord: axisExtent[1],
      onBand: true
    });
  }
  function littleThan(a, b) {
    a = round(a);
    b = round(b);
    return inverse ? a > b : a < b;
  }
}
var LABEL_LAYOUT_BASE_PROPS = ["label", "labelLine", "layoutOption", "priority", "defaultAttr", "marginForce", "minMarginForce", "marginDefault", "suggestIgnore"];
var LABEL_LAYOUT_DIRTY_BIT_OTHERS = 1;
var LABEL_LAYOUT_DIRTY_BIT_OBB = 2;
var LABEL_LAYOUT_DIRTY_ALL = LABEL_LAYOUT_DIRTY_BIT_OTHERS | LABEL_LAYOUT_DIRTY_BIT_OBB;
function setLabelLayoutDirty(labelGeometry, dirtyOrClear, dirtyBits) {
  dirtyBits = dirtyBits || LABEL_LAYOUT_DIRTY_ALL;
  dirtyOrClear ? labelGeometry.dirty |= dirtyBits : labelGeometry.dirty &= ~dirtyBits;
}
function isLabelLayoutDirty(labelGeometry, dirtyBits) {
  dirtyBits = dirtyBits || LABEL_LAYOUT_DIRTY_ALL;
  return labelGeometry.dirty == null || !!(labelGeometry.dirty & dirtyBits);
}
function ensureLabelLayoutWithGeometry(labelLayout) {
  if (!labelLayout) {
    return;
  }
  if (isLabelLayoutDirty(labelLayout)) {
    computeLabelGeometry(labelLayout, labelLayout.label, labelLayout);
  }
  return labelLayout;
}
function computeLabelGeometry(out, label, opt) {
  var rawTransform = label.getComputedTransform();
  out.transform = ensureCopyTransform(out.transform, rawTransform);
  var outLocalRect = out.localRect = ensureCopyRect(out.localRect, label.getBoundingRect());
  var labelStyleExt = label.style;
  var margin = labelStyleExt.margin;
  var marginForce = opt && opt.marginForce;
  var minMarginForce = opt && opt.minMarginForce;
  var marginDefault = opt && opt.marginDefault;
  var marginType = labelStyleExt.__marginType;
  if (marginType == null && marginDefault) {
    margin = marginDefault;
    marginType = LabelMarginType.textMargin;
  }
  for (var i = 0; i < 4; i++) {
    _tmpLabelMargin[i] = marginType === LabelMarginType.minMargin && minMarginForce && minMarginForce[i] != null ? minMarginForce[i] : marginForce && marginForce[i] != null ? marginForce[i] : margin ? margin[i] : 0;
  }
  if (marginType === LabelMarginType.textMargin) {
    expandOrShrinkRect(outLocalRect, _tmpLabelMargin, false, false);
  }
  var outGlobalRect = out.rect = ensureCopyRect(out.rect, outLocalRect);
  if (rawTransform) {
    outGlobalRect.applyTransform(rawTransform);
  }
  if (marginType === LabelMarginType.minMargin) {
    expandOrShrinkRect(outGlobalRect, _tmpLabelMargin, false, false);
  }
  out.axisAligned = isBoundingRectAxisAligned(rawTransform);
  (out.label = out.label || {}).ignore = label.ignore;
  setLabelLayoutDirty(out, false);
  setLabelLayoutDirty(out, true, LABEL_LAYOUT_DIRTY_BIT_OBB);
  return out;
}
var _tmpLabelMargin = [0, 0, 0, 0];
function computeLabelGeometry2(out, rawLocalRect, rawTransform) {
  out.transform = ensureCopyTransform(out.transform, rawTransform);
  out.localRect = ensureCopyRect(out.localRect, rawLocalRect);
  out.rect = ensureCopyRect(out.rect, rawLocalRect);
  if (rawTransform) {
    out.rect.applyTransform(rawTransform);
  }
  out.axisAligned = isBoundingRectAxisAligned(rawTransform);
  out.obb = void 0;
  (out.label = out.label || {}).ignore = false;
  return out;
}
function labelLayoutApplyTranslation(labelLayout, offset) {
  if (!labelLayout) {
    return;
  }
  labelLayout.label.x += offset.x;
  labelLayout.label.y += offset.y;
  labelLayout.label.markRedraw();
  var transform = labelLayout.transform;
  if (transform) {
    transform[4] += offset.x;
    transform[5] += offset.y;
  }
  var globalRect = labelLayout.rect;
  if (globalRect) {
    globalRect.x += offset.x;
    globalRect.y += offset.y;
  }
  var obb = labelLayout.obb;
  if (obb) {
    obb.fromBoundingRect(labelLayout.localRect, transform);
  }
}
function newLabelLayoutWithGeometry(newBaseWithDefaults, source) {
  for (var i = 0; i < LABEL_LAYOUT_BASE_PROPS.length; i++) {
    var prop = LABEL_LAYOUT_BASE_PROPS[i];
    if (newBaseWithDefaults[prop] == null) {
      newBaseWithDefaults[prop] = source[prop];
    }
  }
  return ensureLabelLayoutWithGeometry(newBaseWithDefaults);
}
function ensureOBB(labelGeometry) {
  var obb = labelGeometry.obb;
  if (!obb || isLabelLayoutDirty(labelGeometry, LABEL_LAYOUT_DIRTY_BIT_OBB)) {
    labelGeometry.obb = obb = obb || new OrientedBoundingRect();
    obb.fromBoundingRect(labelGeometry.localRect, labelGeometry.transform);
    setLabelLayoutDirty(labelGeometry, false, LABEL_LAYOUT_DIRTY_BIT_OBB);
  }
  return obb;
}
function hideOverlap(labelList) {
  var displayedLabels = [];
  labelList.sort(function(a, b) {
    return (b.suggestIgnore ? 1 : 0) - (a.suggestIgnore ? 1 : 0) || b.priority - a.priority;
  });
  function hideEl(el) {
    if (!el.ignore) {
      var emphasisState = el.ensureState("emphasis");
      if (emphasisState.ignore == null) {
        emphasisState.ignore = false;
      }
    }
    el.ignore = true;
  }
  for (var i = 0; i < labelList.length; i++) {
    var labelItem = ensureLabelLayoutWithGeometry(labelList[i]);
    if (labelItem.label.ignore) {
      continue;
    }
    var label = labelItem.label;
    var labelLine = labelItem.labelLine;
    var overlapped = false;
    for (var j = 0; j < displayedLabels.length; j++) {
      if (labelIntersect(labelItem, displayedLabels[j], null, {
        touchThreshold: 0.05
      })) {
        overlapped = true;
        break;
      }
    }
    if (overlapped) {
      hideEl(label);
      labelLine && hideEl(labelLine);
    } else {
      displayedLabels.push(labelItem);
    }
  }
}
function labelIntersect(baseLayoutInfo, targetLayoutInfo, mtv, intersectOpt) {
  if (!baseLayoutInfo || !targetLayoutInfo) {
    return false;
  }
  if (baseLayoutInfo.label && baseLayoutInfo.label.ignore || targetLayoutInfo.label && targetLayoutInfo.label.ignore) {
    return false;
  }
  if (!baseLayoutInfo.rect.intersect(targetLayoutInfo.rect, mtv, intersectOpt)) {
    return false;
  }
  if (baseLayoutInfo.axisAligned && targetLayoutInfo.axisAligned) {
    return true;
  }
  return ensureOBB(baseLayoutInfo).intersect(ensureOBB(targetLayoutInfo), mtv, intersectOpt);
}
function getDefaultLabel(data, dataIndex) {
  var labelDims = data.mapDimensionsAll("defaultedLabel");
  var len2 = labelDims.length;
  if (len2 === 1) {
    var rawVal = retrieveRawValue(data, dataIndex, labelDims[0]);
    return rawVal != null ? rawVal + "" : null;
  } else if (len2) {
    var vals = [];
    for (var i = 0; i < labelDims.length; i++) {
      vals.push(retrieveRawValue(data, dataIndex, labelDims[i]));
    }
    return vals.join(" ");
  }
}
var Symbol$1 = (
  /** @class */
  function(_super) {
    __extends(Symbol2, _super);
    function Symbol2(data, idx, seriesScope, opts) {
      var _this = _super.call(this) || this;
      _this.updateData(data, idx, seriesScope, opts);
      return _this;
    }
    Symbol2.prototype._createSymbol = function(symbolType, data, idx, symbolSize, z2, keepAspect) {
      this.removeAll();
      var symbolPath = createSymbol$1(symbolType, -1, -1, 2, 2, null, keepAspect);
      symbolPath.attr({
        z2: retrieve2(z2, 100),
        culling: true,
        scaleX: symbolSize[0] / 2,
        scaleY: symbolSize[1] / 2
      });
      symbolPath.drift = driftSymbol;
      this._symbolType = symbolType;
      this.add(symbolPath);
    };
    Symbol2.prototype.stopSymbolAnimation = function(toLastFrame) {
      this.childAt(0).stopAnimation(null, toLastFrame);
    };
    Symbol2.prototype.getSymbolType = function() {
      return this._symbolType;
    };
    Symbol2.prototype.getSymbolPath = function() {
      return this.childAt(0);
    };
    Symbol2.prototype.highlight = function() {
      enterEmphasis(this.childAt(0));
    };
    Symbol2.prototype.downplay = function() {
      leaveEmphasis(this.childAt(0));
    };
    Symbol2.prototype.setZ = function(zlevel, z) {
      var symbolPath = this.childAt(0);
      symbolPath.zlevel = zlevel;
      symbolPath.z = z;
    };
    Symbol2.prototype.setDraggable = function(draggable, hasCursorOption) {
      var symbolPath = this.childAt(0);
      symbolPath.draggable = draggable;
      symbolPath.cursor = !hasCursorOption && draggable ? "move" : symbolPath.cursor;
    };
    Symbol2.prototype.updateData = function(data, idx, seriesScope, opts) {
      this.silent = false;
      var symbolType = data.getItemVisual(idx, "symbol") || "circle";
      var seriesModel = data.hostModel;
      var symbolSize = Symbol2.getSymbolSize(data, idx);
      var z2 = Symbol2.getSymbolZ2(data, idx);
      var isInit = symbolType !== this._symbolType;
      var disableAnimation = opts && opts.disableAnimation;
      if (isInit) {
        var keepAspect = data.getItemVisual(idx, "symbolKeepAspect");
        this._createSymbol(symbolType, data, idx, symbolSize, z2, keepAspect);
      } else {
        var symbolPath = this.childAt(0);
        symbolPath.silent = false;
        var target = {
          scaleX: symbolSize[0] / 2,
          scaleY: symbolSize[1] / 2
        };
        disableAnimation ? symbolPath.attr(target) : updateProps$1(symbolPath, target, seriesModel, idx);
        saveOldStyle(symbolPath);
      }
      this._updateCommon(data, idx, symbolSize, seriesScope, opts);
      if (isInit) {
        var symbolPath = this.childAt(0);
        if (!disableAnimation) {
          var target = {
            scaleX: this._sizeX,
            scaleY: this._sizeY,
            style: {
              // Always fadeIn. Because it has fadeOut animation when symbol is removed..
              opacity: symbolPath.style.opacity
            }
          };
          symbolPath.scaleX = symbolPath.scaleY = 0;
          symbolPath.style.opacity = 0;
          initProps(symbolPath, target, seriesModel, idx);
        }
      }
      if (disableAnimation) {
        this.childAt(0).stopAnimation("leave");
      }
    };
    Symbol2.prototype._updateCommon = function(data, idx, symbolSize, seriesScope, opts) {
      var symbolPath = this.childAt(0);
      var seriesModel = data.hostModel;
      var emphasisItemStyle;
      var blurItemStyle;
      var selectItemStyle;
      var focus;
      var blurScope;
      var emphasisDisabled;
      var labelStatesModels;
      var hoverScale;
      var cursorStyle;
      if (seriesScope) {
        emphasisItemStyle = seriesScope.emphasisItemStyle;
        blurItemStyle = seriesScope.blurItemStyle;
        selectItemStyle = seriesScope.selectItemStyle;
        focus = seriesScope.focus;
        blurScope = seriesScope.blurScope;
        labelStatesModels = seriesScope.labelStatesModels;
        hoverScale = seriesScope.hoverScale;
        cursorStyle = seriesScope.cursorStyle;
        emphasisDisabled = seriesScope.emphasisDisabled;
      }
      if (!seriesScope || data.hasItemOption) {
        var itemModel = seriesScope && seriesScope.itemModel ? seriesScope.itemModel : data.getItemModel(idx);
        var emphasisModel = itemModel.getModel("emphasis");
        emphasisItemStyle = emphasisModel.getModel("itemStyle").getItemStyle();
        selectItemStyle = itemModel.getModel(["select", "itemStyle"]).getItemStyle();
        blurItemStyle = itemModel.getModel(["blur", "itemStyle"]).getItemStyle();
        focus = emphasisModel.get("focus");
        blurScope = emphasisModel.get("blurScope");
        emphasisDisabled = emphasisModel.get("disabled");
        labelStatesModels = getLabelStatesModels(itemModel);
        hoverScale = emphasisModel.getShallow("scale");
        cursorStyle = itemModel.getShallow("cursor");
      }
      var symbolRotate = data.getItemVisual(idx, "symbolRotate");
      symbolPath.attr("rotation", (symbolRotate || 0) * Math.PI / 180 || 0);
      var symbolOffset = normalizeSymbolOffset(data.getItemVisual(idx, "symbolOffset"), symbolSize);
      if (symbolOffset) {
        symbolPath.x = symbolOffset[0];
        symbolPath.y = symbolOffset[1];
      }
      cursorStyle && symbolPath.attr("cursor", cursorStyle);
      var symbolStyle = data.getItemVisual(idx, "style");
      var visualColor = symbolStyle.fill;
      if (symbolPath instanceof ZRImage) {
        var pathStyle = symbolPath.style;
        symbolPath.useStyle(extend({
          // TODO other properties like x, y ?
          image: pathStyle.image,
          x: pathStyle.x,
          y: pathStyle.y,
          width: pathStyle.width,
          height: pathStyle.height
        }, symbolStyle));
      } else {
        if (symbolPath.__isEmptyBrush) {
          symbolPath.useStyle(extend({}, symbolStyle));
        } else {
          symbolPath.useStyle(symbolStyle);
        }
        symbolPath.style.decal = null;
        symbolPath.setColor(visualColor, opts && opts.symbolInnerColor);
        symbolPath.style.strokeNoScale = true;
      }
      var liftZ = data.getItemVisual(idx, "liftZ");
      var z2Origin = this._z2;
      if (liftZ != null) {
        if (z2Origin == null) {
          this._z2 = symbolPath.z2;
          symbolPath.z2 += liftZ;
        }
      } else if (z2Origin != null) {
        symbolPath.z2 = z2Origin;
        this._z2 = null;
      }
      var useNameLabel = opts && opts.useNameLabel;
      setLabelStyle(symbolPath, labelStatesModels, {
        labelFetcher: seriesModel,
        labelDataIndex: idx,
        defaultText: getLabelDefaultText,
        inheritColor: visualColor,
        defaultOpacity: symbolStyle.opacity
      });
      function getLabelDefaultText(idx2) {
        return useNameLabel ? data.getName(idx2) : getDefaultLabel(data, idx2);
      }
      this._sizeX = symbolSize[0] / 2;
      this._sizeY = symbolSize[1] / 2;
      var emphasisState = symbolPath.ensureState("emphasis");
      emphasisState.style = emphasisItemStyle;
      symbolPath.ensureState("select").style = selectItemStyle;
      symbolPath.ensureState("blur").style = blurItemStyle;
      var scaleRatio = hoverScale == null || hoverScale === true ? Math.max(1.1, 3 / this._sizeY) : isFinite(hoverScale) && hoverScale > 0 ? +hoverScale : 1;
      emphasisState.scaleX = this._sizeX * scaleRatio;
      emphasisState.scaleY = this._sizeY * scaleRatio;
      this.setSymbolScale(1);
      toggleHoverEmphasis(this, focus, blurScope, emphasisDisabled);
    };
    Symbol2.prototype.setSymbolScale = function(scale2) {
      this.scaleX = this.scaleY = scale2;
    };
    Symbol2.prototype.fadeOut = function(cb, seriesModel, opt) {
      var symbolPath = this.childAt(0);
      var dataIndex = getECData(this).dataIndex;
      var animationOpt = opt && opt.animation;
      this.silent = symbolPath.silent = true;
      if (opt && opt.fadeLabel) {
        var textContent = symbolPath.getTextContent();
        if (textContent) {
          removeElement(textContent, {
            style: {
              opacity: 0
            }
          }, seriesModel, {
            dataIndex,
            removeOpt: animationOpt,
            cb: function() {
              symbolPath.removeTextContent();
            }
          });
        }
      } else {
        symbolPath.removeTextContent();
      }
      removeElement(symbolPath, {
        style: {
          opacity: 0
        },
        scaleX: 0,
        scaleY: 0
      }, seriesModel, {
        dataIndex,
        cb,
        removeOpt: animationOpt
      });
    };
    Symbol2.getSymbolSize = function(data, idx) {
      return normalizeSymbolSize(data.getItemVisual(idx, "symbolSize"));
    };
    Symbol2.getSymbolZ2 = function(data, idx) {
      return data.getItemVisual(idx, "z2");
    };
    return Symbol2;
  }(Group$2)
);
function driftSymbol(dx, dy) {
  this.parent.drift(dx, dy);
}
function symbolNeedsDraw(data, point, idx, opt) {
  return point && !isNaN(point[0]) && !isNaN(point[1]) && !(opt.isIgnore && opt.isIgnore(idx)) && !(opt.clipShape && !opt.clipShape.contain(point[0], point[1])) && data.getItemVisual(idx, "symbol") !== "none";
}
function normalizeUpdateOpt(opt) {
  if (opt != null && !isObject$2(opt)) {
    opt = {
      isIgnore: opt
    };
  }
  return opt || {};
}
function makeSeriesScope$1(data) {
  var seriesModel = data.hostModel;
  var emphasisModel = seriesModel.getModel("emphasis");
  return {
    emphasisItemStyle: emphasisModel.getModel("itemStyle").getItemStyle(),
    blurItemStyle: seriesModel.getModel(["blur", "itemStyle"]).getItemStyle(),
    selectItemStyle: seriesModel.getModel(["select", "itemStyle"]).getItemStyle(),
    focus: emphasisModel.get("focus"),
    blurScope: emphasisModel.get("blurScope"),
    emphasisDisabled: emphasisModel.get("disabled"),
    hoverScale: emphasisModel.get("scale"),
    labelStatesModels: getLabelStatesModels(seriesModel),
    cursorStyle: seriesModel.get("cursor")
  };
}
var SymbolDraw = (
  /** @class */
  function() {
    function SymbolDraw2(SymbolCtor) {
      this.group = new Group$2();
      this._SymbolCtor = SymbolCtor || Symbol$1;
    }
    SymbolDraw2.prototype.updateData = function(data, opt) {
      this._progressiveEls = null;
      opt = normalizeUpdateOpt(opt);
      var group = this.group;
      var seriesModel = data.hostModel;
      var oldData = this._data;
      var SymbolCtor = this._SymbolCtor;
      var disableAnimation = opt.disableAnimation;
      var seriesScope = makeSeriesScope$1(data);
      var symbolUpdateOpt = {
        disableAnimation
      };
      var getSymbolPoint = opt.getSymbolPoint || function(idx) {
        return data.getItemLayout(idx);
      };
      if (!oldData) {
        group.removeAll();
      }
      data.diff(oldData).add(function(newIdx) {
        var point = getSymbolPoint(newIdx);
        if (symbolNeedsDraw(data, point, newIdx, opt)) {
          var symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
          symbolEl.setPosition(point);
          data.setItemGraphicEl(newIdx, symbolEl);
          group.add(symbolEl);
        }
      }).update(function(newIdx, oldIdx) {
        var symbolEl = oldData.getItemGraphicEl(oldIdx);
        var point = getSymbolPoint(newIdx);
        if (!symbolNeedsDraw(data, point, newIdx, opt)) {
          group.remove(symbolEl);
          return;
        }
        var newSymbolType = data.getItemVisual(newIdx, "symbol") || "circle";
        var oldSymbolType = symbolEl && symbolEl.getSymbolType && symbolEl.getSymbolType();
        if (!symbolEl || oldSymbolType && oldSymbolType !== newSymbolType) {
          group.remove(symbolEl);
          symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
          symbolEl.setPosition(point);
        } else {
          symbolEl.updateData(data, newIdx, seriesScope, symbolUpdateOpt);
          var target = {
            x: point[0],
            y: point[1]
          };
          disableAnimation ? symbolEl.attr(target) : updateProps$1(symbolEl, target, seriesModel);
        }
        group.add(symbolEl);
        data.setItemGraphicEl(newIdx, symbolEl);
      }).remove(function(oldIdx) {
        var el = oldData.getItemGraphicEl(oldIdx);
        el && el.fadeOut(function() {
          group.remove(el);
        }, seriesModel);
      }).execute();
      this._getSymbolPoint = getSymbolPoint;
      this._data = data;
    };
    SymbolDraw2.prototype.updateLayout = function() {
      var _this = this;
      var data = this._data;
      if (data) {
        data.eachItemGraphicEl(function(el, idx) {
          var point = _this._getSymbolPoint(idx);
          el.setPosition(point);
          el.markRedraw();
        });
      }
    };
    SymbolDraw2.prototype.incrementalPrepareUpdate = function(data) {
      this._seriesScope = makeSeriesScope$1(data);
      this._data = null;
      this.group.removeAll();
    };
    SymbolDraw2.prototype.incrementalUpdate = function(taskParams, data, opt) {
      this._progressiveEls = [];
      opt = normalizeUpdateOpt(opt);
      function updateIncrementalAndHover(el2) {
        if (!el2.isGroup) {
          el2.incremental = true;
          el2.ensureState("emphasis").hoverLayer = true;
        }
      }
      for (var idx = taskParams.start; idx < taskParams.end; idx++) {
        var point = data.getItemLayout(idx);
        if (symbolNeedsDraw(data, point, idx, opt)) {
          var el = new this._SymbolCtor(data, idx, this._seriesScope);
          el.traverse(updateIncrementalAndHover);
          el.setPosition(point);
          this.group.add(el);
          data.setItemGraphicEl(idx, el);
          this._progressiveEls.push(el);
        }
      }
    };
    SymbolDraw2.prototype.eachRendered = function(cb) {
      traverseElements(this._progressiveEls || this.group, cb);
    };
    SymbolDraw2.prototype.remove = function(enableAnimation) {
      var group = this.group;
      var data = this._data;
      if (data && enableAnimation) {
        data.eachItemGraphicEl(function(el) {
          el.fadeOut(function() {
            group.remove(el);
          }, data.hostModel);
        });
      } else {
        group.removeAll();
      }
    };
    return SymbolDraw2;
  }()
);
var LegendVisualProvider = (
  /** @class */
  function() {
    function LegendVisualProvider2(getDataWithEncodedVisual, getRawData2) {
      this._getDataWithEncodedVisual = getDataWithEncodedVisual;
      this._getRawData = getRawData2;
    }
    LegendVisualProvider2.prototype.getAllNames = function() {
      var rawData = this._getRawData();
      return rawData.mapArray(rawData.getName);
    };
    LegendVisualProvider2.prototype.containName = function(name) {
      var rawData = this._getRawData();
      return rawData.indexOfName(name) >= 0;
    };
    LegendVisualProvider2.prototype.indexOfName = function(name) {
      var dataWithEncodedVisual = this._getDataWithEncodedVisual();
      return dataWithEncodedVisual.indexOfName(name);
    };
    LegendVisualProvider2.prototype.getItemVisual = function(dataIndex, key) {
      var dataWithEncodedVisual = this._getDataWithEncodedVisual();
      return dataWithEncodedVisual.getItemVisual(dataIndex, key);
    };
    return LegendVisualProvider2;
  }()
);
var OUTER_BOUNDS_DEFAULT = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
};
var OUTER_BOUNDS_CLAMP_DEFAULT = ["25%", "25%"];
var GridModel = (
  /** @class */
  function(_super) {
    __extends(GridModel2, _super);
    function GridModel2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    GridModel2.prototype.mergeDefaultAndTheme = function(option, ecModel) {
      var outerBoundsCp = getLayoutParams(option.outerBounds);
      _super.prototype.mergeDefaultAndTheme.apply(this, arguments);
      if (outerBoundsCp && option.outerBounds) {
        mergeLayoutParam(option.outerBounds, outerBoundsCp);
      }
    };
    GridModel2.prototype.mergeOption = function(newOption, ecModel) {
      _super.prototype.mergeOption.apply(this, arguments);
      if (this.option.outerBounds && newOption.outerBounds) {
        mergeLayoutParam(this.option.outerBounds, newOption.outerBounds);
      }
    };
    GridModel2.type = "grid";
    GridModel2.dependencies = ["xAxis", "yAxis"];
    GridModel2.layoutMode = "box";
    GridModel2.defaultOption = {
      show: false,
      // zlevel: 0,
      z: 0,
      left: "15%",
      top: 65,
      right: "10%",
      bottom: 80,
      // If grid size contain label
      containLabel: false,
      outerBoundsMode: "auto",
      outerBounds: OUTER_BOUNDS_DEFAULT,
      outerBoundsContain: "all",
      outerBoundsClampWidth: OUTER_BOUNDS_CLAMP_DEFAULT[0],
      outerBoundsClampHeight: OUTER_BOUNDS_CLAMP_DEFAULT[1],
      // width: {totalWidth} - left - right,
      // height: {totalHeight} - top - bottom,
      backgroundColor: tokens.color.transparent,
      borderWidth: 1,
      borderColor: tokens.color.neutral30
    };
    return GridModel2;
  }(ComponentModel)
);
var CartesianAxisModel = (
  /** @class */
  function(_super) {
    __extends(CartesianAxisModel2, _super);
    function CartesianAxisModel2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    CartesianAxisModel2.prototype.getCoordSysModel = function() {
      return this.getReferringComponents("grid", SINGLE_REFERRING).models[0];
    };
    CartesianAxisModel2.type = "cartesian2dAxis";
    return CartesianAxisModel2;
  }(ComponentModel)
);
mixin(CartesianAxisModel, AxisModelCommonMixin);
var defaultOption = {
  show: true,
  // zlevel: 0,
  z: 0,
  // Inverse the axis.
  inverse: false,
  // Axis name displayed.
  name: "",
  // 'start' | 'middle' | 'end'
  nameLocation: "end",
  // By degree. By default auto rotate by nameLocation.
  nameRotate: null,
  nameTruncate: {
    maxWidth: null,
    ellipsis: "...",
    placeholder: "."
  },
  // Use global text style by default.
  nameTextStyle: {
    // textMargin: never, // The default value will be specified based on `nameLocation`.
  },
  // The gap between axisName and axisLine.
  nameGap: 15,
  // Default `false` to support tooltip.
  silent: false,
  // Default `false` to avoid legacy user event listener fail.
  triggerEvent: false,
  tooltip: {
    show: false
  },
  axisPointer: {},
  axisLine: {
    show: true,
    onZero: true,
    onZeroAxisIndex: null,
    lineStyle: {
      color: tokens.color.axisLine,
      width: 1,
      type: "solid"
    },
    // The arrow at both ends the the axis.
    symbol: ["none", "none"],
    symbolSize: [10, 15],
    breakLine: true
  },
  axisTick: {
    show: true,
    // Whether axisTick is inside the grid or outside the grid.
    inside: false,
    // The length of axisTick.
    length: 5,
    lineStyle: {
      width: 1
    }
  },
  axisLabel: {
    show: true,
    // Whether axisLabel is inside the grid or outside the grid.
    inside: false,
    rotate: 0,
    // true | false | null/undefined (auto)
    showMinLabel: null,
    // true | false | null/undefined (auto)
    showMaxLabel: null,
    margin: 8,
    // formatter: null,
    fontSize: 12,
    color: tokens.color.axisLabel,
    // In scenarios like axis labels, when labels text's progression direction matches the label
    // layout direction (e.g., when all letters are in a single line), extra start/end margin is
    // needed to prevent the text from appearing visually joined. In the other case, when lables
    // are stacked (e.g., having rotation or horizontal labels on yAxis), the layout needs to be
    // compact, so NO extra top/bottom margin should be applied.
    textMargin: [0, 3]
  },
  splitLine: {
    show: true,
    showMinLine: true,
    showMaxLine: true,
    lineStyle: {
      color: tokens.color.axisSplitLine,
      width: 1,
      type: "solid"
    }
  },
  splitArea: {
    show: false,
    areaStyle: {
      color: [tokens.color.backgroundTint, tokens.color.backgroundTransparent]
    }
  },
  breakArea: {
    show: true,
    itemStyle: {
      color: tokens.color.neutral00,
      // Break border color should be darker than the splitLine
      // because it has opacity and should be more prominent
      borderColor: tokens.color.border,
      borderWidth: 1,
      borderType: [3, 3],
      opacity: 0.6
    },
    zigzagAmplitude: 4,
    zigzagMinSpan: 4,
    zigzagMaxSpan: 20,
    zigzagZ: 100,
    expandOnClick: true
  },
  breakLabelLayout: {
    moveOverlap: "auto"
  }
};
var categoryAxis = merge({
  // The gap at both ends of the axis. For categoryAxis, boolean.
  boundaryGap: true,
  // Set false to faster category collection.
  deduplication: null,
  jitter: 0,
  jitterOverlap: true,
  jitterMargin: 2,
  // splitArea: {
  // show: false
  // },
  splitLine: {
    show: false
  },
  axisTick: {
    // If tick is align with label when boundaryGap is true
    alignWithLabel: false,
    interval: "auto",
    show: "auto"
  },
  axisLabel: {
    interval: "auto"
  }
}, defaultOption);
var valueAxis = merge({
  boundaryGap: [0, 0],
  axisLine: {
    // Not shown when other axis is categoryAxis in cartesian
    show: "auto"
  },
  axisTick: {
    // Not shown when other axis is categoryAxis in cartesian
    show: "auto"
  },
  // TODO
  // min/max: [30, datamin, 60] or [20, datamin] or [datamin, 60]
  splitNumber: 5,
  minorTick: {
    // Minor tick, not available for cateogry axis.
    show: false,
    // Split number of minor ticks. The value should be in range of (0, 100)
    splitNumber: 5,
    // Length of minor tick
    length: 3,
    // Line style
    lineStyle: {
      // Default to be same with axisTick
    }
  },
  minorSplitLine: {
    show: false,
    lineStyle: {
      color: tokens.color.axisMinorSplitLine,
      width: 1
    }
  }
}, defaultOption);
var timeAxis = merge({
  splitNumber: 6,
  axisLabel: {
    // To eliminate labels that are not nice
    showMinLabel: false,
    showMaxLabel: false,
    rich: {
      primary: {
        fontWeight: "bold"
      }
    }
  },
  splitLine: {
    show: false
  }
}, valueAxis);
var logAxis = defaults({
  logBase: 10
}, valueAxis);
const axisDefault = {
  category: categoryAxis,
  value: valueAxis,
  time: timeAxis,
  log: logAxis
};
var AXIS_TYPES = {
  value: 1,
  category: 1,
  time: 1,
  log: 1
};
var _impl = null;
function getAxisBreakHelper() {
  return _impl;
}
function axisModelCreator(registers, axisName, BaseAxisModelClass, extraDefaultOption) {
  each$4(AXIS_TYPES, function(v, axisType) {
    var defaultOption2 = merge(merge({}, axisDefault[axisType], true), extraDefaultOption, true);
    var AxisModel = (
      /** @class */
      function(_super) {
        __extends(AxisModel2, _super);
        function AxisModel2() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.type = axisName + "Axis." + axisType;
          return _this;
        }
        AxisModel2.prototype.mergeDefaultAndTheme = function(option, ecModel) {
          var layoutMode = fetchLayoutMode(this);
          var inputPositionParams = layoutMode ? getLayoutParams(option) : {};
          var themeModel = ecModel.getTheme();
          merge(option, themeModel.get(axisType + "Axis"));
          merge(option, this.getDefaultOption());
          option.type = getAxisType(option);
          if (layoutMode) {
            mergeLayoutParam(option, inputPositionParams, layoutMode);
          }
        };
        AxisModel2.prototype.optionUpdated = function() {
          var thisOption = this.option;
          if (thisOption.type === "category") {
            this.__ordinalMeta = OrdinalMeta.createByAxisModel(this);
          }
        };
        AxisModel2.prototype.getCategories = function(rawData) {
          var option = this.option;
          if (option.type === "category") {
            if (rawData) {
              return option.data;
            }
            return this.__ordinalMeta.categories;
          }
        };
        AxisModel2.prototype.getOrdinalMeta = function() {
          return this.__ordinalMeta;
        };
        AxisModel2.prototype.updateAxisBreaks = function(payload) {
          return {
            breaks: []
          };
        };
        AxisModel2.type = axisName + "Axis." + axisType;
        AxisModel2.defaultOption = defaultOption2;
        return AxisModel2;
      }(BaseAxisModelClass)
    );
    registers.registerComponentModel(AxisModel);
  });
  registers.registerSubTypeDefaulter(axisName + "Axis", getAxisType);
}
function getAxisType(option) {
  return option.type || (option.data ? "category" : "value");
}
var Cartesian = (
  /** @class */
  function() {
    function Cartesian2(name) {
      this.type = "cartesian";
      this._dimList = [];
      this._axes = {};
      this.name = name || "";
    }
    Cartesian2.prototype.getAxis = function(dim) {
      return this._axes[dim];
    };
    Cartesian2.prototype.getAxes = function() {
      return map$1(this._dimList, function(dim) {
        return this._axes[dim];
      }, this);
    };
    Cartesian2.prototype.getAxesByScale = function(scaleType) {
      scaleType = scaleType.toLowerCase();
      return filter(this.getAxes(), function(axis) {
        return axis.scale.type === scaleType;
      });
    };
    Cartesian2.prototype.addAxis = function(axis) {
      var dim = axis.dim;
      this._axes[dim] = axis;
      this._dimList.push(dim);
    };
    return Cartesian2;
  }()
);
var cartesian2DDimensions = ["x", "y"];
function canCalculateAffineTransform(scale2) {
  return (scale2.type === "interval" || scale2.type === "time") && !scale2.hasBreaks();
}
var Cartesian2D = (
  /** @class */
  function(_super) {
    __extends(Cartesian2D2, _super);
    function Cartesian2D2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "cartesian2d";
      _this.dimensions = cartesian2DDimensions;
      return _this;
    }
    Cartesian2D2.prototype.calcAffineTransform = function() {
      this._transform = this._invTransform = null;
      var xAxisScale = this.getAxis("x").scale;
      var yAxisScale = this.getAxis("y").scale;
      if (!canCalculateAffineTransform(xAxisScale) || !canCalculateAffineTransform(yAxisScale)) {
        return;
      }
      var xScaleExtent = xAxisScale.getExtent();
      var yScaleExtent = yAxisScale.getExtent();
      var start = this.dataToPoint([xScaleExtent[0], yScaleExtent[0]]);
      var end = this.dataToPoint([xScaleExtent[1], yScaleExtent[1]]);
      var xScaleSpan = xScaleExtent[1] - xScaleExtent[0];
      var yScaleSpan = yScaleExtent[1] - yScaleExtent[0];
      if (!xScaleSpan || !yScaleSpan) {
        return;
      }
      var scaleX = (end[0] - start[0]) / xScaleSpan;
      var scaleY = (end[1] - start[1]) / yScaleSpan;
      var translateX = start[0] - xScaleExtent[0] * scaleX;
      var translateY = start[1] - yScaleExtent[0] * scaleY;
      var m = this._transform = [scaleX, 0, 0, scaleY, translateX, translateY];
      this._invTransform = invert([], m);
    };
    Cartesian2D2.prototype.getBaseAxis = function() {
      return this.getAxesByScale("ordinal")[0] || this.getAxesByScale("time")[0] || this.getAxis("x");
    };
    Cartesian2D2.prototype.containPoint = function(point) {
      var axisX = this.getAxis("x");
      var axisY = this.getAxis("y");
      return axisX.contain(axisX.toLocalCoord(point[0])) && axisY.contain(axisY.toLocalCoord(point[1]));
    };
    Cartesian2D2.prototype.containData = function(data) {
      return this.getAxis("x").containData(data[0]) && this.getAxis("y").containData(data[1]);
    };
    Cartesian2D2.prototype.containZone = function(data1, data2) {
      var zoneDiag1 = this.dataToPoint(data1);
      var zoneDiag2 = this.dataToPoint(data2);
      var area = this.getArea();
      var zone = new BoundingRect(zoneDiag1[0], zoneDiag1[1], zoneDiag2[0] - zoneDiag1[0], zoneDiag2[1] - zoneDiag1[1]);
      return area.intersect(zone);
    };
    Cartesian2D2.prototype.dataToPoint = function(data, clamp2, out) {
      out = out || [];
      var xVal = data[0];
      var yVal = data[1];
      if (this._transform && xVal != null && isFinite(xVal) && yVal != null && isFinite(yVal)) {
        return applyTransform$1(out, data, this._transform);
      }
      var xAxis = this.getAxis("x");
      var yAxis = this.getAxis("y");
      out[0] = xAxis.toGlobalCoord(xAxis.dataToCoord(xVal, clamp2));
      out[1] = yAxis.toGlobalCoord(yAxis.dataToCoord(yVal, clamp2));
      return out;
    };
    Cartesian2D2.prototype.clampData = function(data, out) {
      var xScale = this.getAxis("x").scale;
      var yScale = this.getAxis("y").scale;
      var xAxisExtent = xScale.getExtent();
      var yAxisExtent = yScale.getExtent();
      var x = xScale.parse(data[0]);
      var y = yScale.parse(data[1]);
      out = out || [];
      out[0] = Math.min(Math.max(Math.min(xAxisExtent[0], xAxisExtent[1]), x), Math.max(xAxisExtent[0], xAxisExtent[1]));
      out[1] = Math.min(Math.max(Math.min(yAxisExtent[0], yAxisExtent[1]), y), Math.max(yAxisExtent[0], yAxisExtent[1]));
      return out;
    };
    Cartesian2D2.prototype.pointToData = function(point, clamp2, out) {
      out = out || [];
      if (this._invTransform) {
        return applyTransform$1(out, point, this._invTransform);
      }
      var xAxis = this.getAxis("x");
      var yAxis = this.getAxis("y");
      out[0] = xAxis.coordToData(xAxis.toLocalCoord(point[0]), clamp2);
      out[1] = yAxis.coordToData(yAxis.toLocalCoord(point[1]), clamp2);
      return out;
    };
    Cartesian2D2.prototype.getOtherAxis = function(axis) {
      return this.getAxis(axis.dim === "x" ? "y" : "x");
    };
    Cartesian2D2.prototype.getArea = function(tolerance) {
      tolerance = tolerance || 0;
      var xExtent = this.getAxis("x").getGlobalExtent();
      var yExtent = this.getAxis("y").getGlobalExtent();
      var x = Math.min(xExtent[0], xExtent[1]) - tolerance;
      var y = Math.min(yExtent[0], yExtent[1]) - tolerance;
      var width = Math.max(xExtent[0], xExtent[1]) - x + tolerance;
      var height = Math.max(yExtent[0], yExtent[1]) - y + tolerance;
      return new BoundingRect(x, y, width, height);
    };
    return Cartesian2D2;
  }(Cartesian)
);
var Axis2D = (
  /** @class */
  function(_super) {
    __extends(Axis2D2, _super);
    function Axis2D2(dim, scale2, coordExtent, axisType, position) {
      var _this = _super.call(this, dim, scale2, coordExtent) || this;
      _this.index = 0;
      _this.type = axisType || "value";
      _this.position = position || "bottom";
      return _this;
    }
    Axis2D2.prototype.isHorizontal = function() {
      var position = this.position;
      return position === "top" || position === "bottom";
    };
    Axis2D2.prototype.getGlobalExtent = function(asc) {
      var ret = this.getExtent();
      ret[0] = this.toGlobalCoord(ret[0]);
      ret[1] = this.toGlobalCoord(ret[1]);
      asc && ret[0] > ret[1] && ret.reverse();
      return ret;
    };
    Axis2D2.prototype.pointToData = function(point, clamp2) {
      return this.coordToData(this.toLocalCoord(point[this.dim === "x" ? 0 : 1]), clamp2);
    };
    Axis2D2.prototype.setCategorySortInfo = function(info) {
      if (this.type !== "category") {
        return false;
      }
      this.model.option.categorySortInfo = info;
      this.scale.setSortInfo(info);
    };
    return Axis2D2;
  }(Axis)
);
var AXIS_BREAK_EXPAND_ACTION_TYPE = "expandAxisBreak";
var PI$1 = Math.PI;
var DEFAULT_CENTER_NAME_MARGIN_LEVELS = [[1, 2, 1, 2], [5, 3, 5, 3], [8, 3, 8, 3]];
var DEFAULT_ENDS_NAME_MARGIN_LEVELS = [[0, 1, 0, 1], [0, 3, 0, 3], [0, 3, 0, 3]];
var getLabelInner = makeInner();
var getTickInner = makeInner();
var AxisBuilderSharedContext = (
  /** @class */
  function() {
    function AxisBuilderSharedContext2(resolveAxisNameOverlap) {
      this.recordMap = {};
      this.resolveAxisNameOverlap = resolveAxisNameOverlap;
    }
    AxisBuilderSharedContext2.prototype.ensureRecord = function(axisModel) {
      var dim = axisModel.axis.dim;
      var idx = axisModel.componentIndex;
      var recordMap = this.recordMap;
      var records = recordMap[dim] || (recordMap[dim] = []);
      return records[idx] || (records[idx] = {
        ready: {}
      });
    };
    return AxisBuilderSharedContext2;
  }()
);
function resetOverlapRecordToShared(cfg, shared, axisModel, labelLayoutList) {
  var axis = axisModel.axis;
  var record = shared.ensureRecord(axisModel);
  var labelInfoList = [];
  var stOccupiedRect;
  var useStOccupiedRect = hasAxisName(cfg.axisName) && isNameLocationCenter(cfg.nameLocation);
  each$4(labelLayoutList, function(layout2) {
    var layoutInfo = ensureLabelLayoutWithGeometry(layout2);
    if (!layoutInfo || layoutInfo.label.ignore) {
      return;
    }
    labelInfoList.push(layoutInfo);
    var transGroup = record.transGroup;
    if (useStOccupiedRect) {
      transGroup.transform ? invert(_stTransTmp, transGroup.transform) : identity(_stTransTmp);
      if (layoutInfo.transform) {
        mul(_stTransTmp, _stTransTmp, layoutInfo.transform);
      }
      BoundingRect.copy(_stLabelRectTmp, layoutInfo.localRect);
      _stLabelRectTmp.applyTransform(_stTransTmp);
      stOccupiedRect ? stOccupiedRect.union(_stLabelRectTmp) : BoundingRect.copy(stOccupiedRect = new BoundingRect(0, 0, 0, 0), _stLabelRectTmp);
    }
  });
  var sortByDim = Math.abs(record.dirVec.x) > 0.1 ? "x" : "y";
  var sortByValue = record.transGroup[sortByDim];
  labelInfoList.sort(function(info1, info2) {
    return Math.abs(info1.label[sortByDim] - sortByValue) - Math.abs(info2.label[sortByDim] - sortByValue);
  });
  if (useStOccupiedRect && stOccupiedRect) {
    var extent = axis.getExtent();
    var axisLineX = Math.min(extent[0], extent[1]);
    var axisLineWidth = Math.max(extent[0], extent[1]) - axisLineX;
    stOccupiedRect.union(new BoundingRect(axisLineX, 0, axisLineWidth, 1));
  }
  record.stOccupiedRect = stOccupiedRect;
  record.labelInfoList = labelInfoList;
}
var _stTransTmp = create();
var _stLabelRectTmp = new BoundingRect(0, 0, 0, 0);
var resolveAxisNameOverlapDefault = function(cfg, ctx, axisModel, nameLayoutInfo, nameMoveDirVec, thisRecord) {
  if (isNameLocationCenter(cfg.nameLocation)) {
    var stOccupiedRect = thisRecord.stOccupiedRect;
    if (stOccupiedRect) {
      moveIfOverlap(computeLabelGeometry2({}, stOccupiedRect, thisRecord.transGroup.transform), nameLayoutInfo, nameMoveDirVec);
    }
  } else {
    moveIfOverlapByLinearLabels(thisRecord.labelInfoList, thisRecord.dirVec, nameLayoutInfo, nameMoveDirVec);
  }
};
function moveIfOverlap(basedLayoutInfo, movableLayoutInfo, moveDirVec) {
  var mtv = new Point();
  if (labelIntersect(basedLayoutInfo, movableLayoutInfo, mtv, {
    direction: Math.atan2(moveDirVec.y, moveDirVec.x),
    bidirectional: false,
    touchThreshold: 0.05
  })) {
    labelLayoutApplyTranslation(movableLayoutInfo, mtv);
  }
}
function moveIfOverlapByLinearLabels(baseLayoutInfoList, baseDirVec, movableLayoutInfo, moveDirVec) {
  var sameDir = Point.dot(moveDirVec, baseDirVec) >= 0;
  for (var idx = 0, len2 = baseLayoutInfoList.length; idx < len2; idx++) {
    var labelInfo = baseLayoutInfoList[sameDir ? idx : len2 - 1 - idx];
    if (!labelInfo.label.ignore) {
      moveIfOverlap(labelInfo, movableLayoutInfo, moveDirVec);
    }
  }
}
var AxisBuilder = (
  /** @class */
  function() {
    function AxisBuilder2(axisModel, api, opt, shared) {
      this.group = new Group$2();
      this._axisModel = axisModel;
      this._api = api;
      this._local = {};
      this._shared = shared || new AxisBuilderSharedContext(resolveAxisNameOverlapDefault);
      this._resetCfgDetermined(opt);
    }
    AxisBuilder2.prototype.updateCfg = function(opt) {
      var raw = this._cfg.raw;
      raw.position = opt.position;
      raw.labelOffset = opt.labelOffset;
      this._resetCfgDetermined(raw);
    };
    AxisBuilder2.prototype.__getRawCfg = function() {
      return this._cfg.raw;
    };
    AxisBuilder2.prototype._resetCfgDetermined = function(raw) {
      var axisModel = this._axisModel;
      var axisModelDefaultOption = axisModel.getDefaultOption ? axisModel.getDefaultOption() : {};
      var axisName = retrieve2(raw.axisName, axisModel.get("name"));
      var nameMoveOverlapOption = axisModel.get("nameMoveOverlap");
      if (nameMoveOverlapOption == null || nameMoveOverlapOption === "auto") {
        nameMoveOverlapOption = retrieve2(raw.defaultNameMoveOverlap, true);
      }
      var cfg = {
        raw,
        position: raw.position,
        rotation: raw.rotation,
        nameDirection: retrieve2(raw.nameDirection, 1),
        tickDirection: retrieve2(raw.tickDirection, 1),
        labelDirection: retrieve2(raw.labelDirection, 1),
        labelOffset: retrieve2(raw.labelOffset, 0),
        silent: retrieve2(raw.silent, true),
        axisName,
        nameLocation: retrieve3(axisModel.get("nameLocation"), axisModelDefaultOption.nameLocation, "end"),
        shouldNameMoveOverlap: hasAxisName(axisName) && nameMoveOverlapOption,
        optionHideOverlap: axisModel.get(["axisLabel", "hideOverlap"]),
        showMinorTicks: axisModel.get(["minorTick", "show"])
      };
      this._cfg = cfg;
      var transformGroup = new Group$2({
        x: cfg.position[0],
        y: cfg.position[1],
        rotation: cfg.rotation
      });
      transformGroup.updateTransform();
      this._transformGroup = transformGroup;
      var record = this._shared.ensureRecord(axisModel);
      record.transGroup = this._transformGroup;
      record.dirVec = new Point(Math.cos(-cfg.rotation), Math.sin(-cfg.rotation));
    };
    AxisBuilder2.prototype.build = function(axisPartNameMap, extraParams) {
      var _this = this;
      if (!axisPartNameMap) {
        axisPartNameMap = {
          axisLine: true,
          axisTickLabelEstimate: false,
          axisTickLabelDetermine: true,
          axisName: true
        };
      }
      each$4(AXIS_BUILDER_AXIS_PART_NAMES, function(partName) {
        if (axisPartNameMap[partName]) {
          builders[partName](_this._cfg, _this._local, _this._shared, _this._axisModel, _this.group, _this._transformGroup, _this._api, extraParams || {});
        }
      });
      return this;
    };
    AxisBuilder2.innerTextLayout = function(axisRotation, textRotation, direction) {
      var rotationDiff = remRadian(textRotation - axisRotation);
      var textAlign;
      var textVerticalAlign;
      if (isRadianAroundZero(rotationDiff)) {
        textVerticalAlign = direction > 0 ? "top" : "bottom";
        textAlign = "center";
      } else if (isRadianAroundZero(rotationDiff - PI$1)) {
        textVerticalAlign = direction > 0 ? "bottom" : "top";
        textAlign = "center";
      } else {
        textVerticalAlign = "middle";
        if (rotationDiff > 0 && rotationDiff < PI$1) {
          textAlign = direction > 0 ? "right" : "left";
        } else {
          textAlign = direction > 0 ? "left" : "right";
        }
      }
      return {
        rotation: rotationDiff,
        textAlign,
        textVerticalAlign
      };
    };
    AxisBuilder2.makeAxisEventDataBase = function(axisModel) {
      var eventData = {
        componentType: axisModel.mainType,
        componentIndex: axisModel.componentIndex
      };
      eventData[axisModel.mainType + "Index"] = axisModel.componentIndex;
      return eventData;
    };
    AxisBuilder2.isLabelSilent = function(axisModel) {
      var tooltipOpt = axisModel.get("tooltip");
      return axisModel.get("silent") || !(axisModel.get("triggerEvent") || tooltipOpt && tooltipOpt.show);
    };
    return AxisBuilder2;
  }()
);
var AXIS_BUILDER_AXIS_PART_NAMES = ["axisLine", "axisTickLabelEstimate", "axisTickLabelDetermine", "axisName"];
var builders = {
  axisLine: function(cfg, local, shared, axisModel, group, transformGroup, api) {
    var shown = axisModel.get(["axisLine", "show"]);
    if (shown === "auto") {
      shown = true;
      if (cfg.raw.axisLineAutoShow != null) {
        shown = !!cfg.raw.axisLineAutoShow;
      }
    }
    if (!shown) {
      return;
    }
    var extent = axisModel.axis.getExtent();
    var matrix = transformGroup.transform;
    var pt1 = [extent[0], 0];
    var pt2 = [extent[1], 0];
    var inverse = pt1[0] > pt2[0];
    if (matrix) {
      applyTransform$1(pt1, pt1, matrix);
      applyTransform$1(pt2, pt2, matrix);
    }
    var lineStyle = extend({
      lineCap: "round"
    }, axisModel.getModel(["axisLine", "lineStyle"]).getLineStyle());
    var pathBaseProp = {
      strokeContainThreshold: cfg.raw.strokeContainThreshold || 5,
      silent: true,
      z2: 1,
      style: lineStyle
    };
    if (axisModel.get(["axisLine", "breakLine"]) && axisModel.axis.scale.hasBreaks()) {
      getAxisBreakHelper().buildAxisBreakLine(axisModel, group, transformGroup, pathBaseProp);
    } else {
      var line = new Line$1(extend({
        shape: {
          x1: pt1[0],
          y1: pt1[1],
          x2: pt2[0],
          y2: pt2[1]
        }
      }, pathBaseProp));
      subPixelOptimizeLine(line.shape, line.style.lineWidth);
      line.anid = "line";
      group.add(line);
    }
    var arrows = axisModel.get(["axisLine", "symbol"]);
    if (arrows != null) {
      var arrowSize = axisModel.get(["axisLine", "symbolSize"]);
      if (isString(arrows)) {
        arrows = [arrows, arrows];
      }
      if (isString(arrowSize) || isNumber(arrowSize)) {
        arrowSize = [arrowSize, arrowSize];
      }
      var arrowOffset = normalizeSymbolOffset(axisModel.get(["axisLine", "symbolOffset"]) || 0, arrowSize);
      var symbolWidth_1 = arrowSize[0];
      var symbolHeight_1 = arrowSize[1];
      each$4([{
        rotate: cfg.rotation + Math.PI / 2,
        offset: arrowOffset[0],
        r: 0
      }, {
        rotate: cfg.rotation - Math.PI / 2,
        offset: arrowOffset[1],
        r: Math.sqrt((pt1[0] - pt2[0]) * (pt1[0] - pt2[0]) + (pt1[1] - pt2[1]) * (pt1[1] - pt2[1]))
      }], function(point, index) {
        if (arrows[index] !== "none" && arrows[index] != null) {
          var symbol = createSymbol$1(arrows[index], -symbolWidth_1 / 2, -symbolHeight_1 / 2, symbolWidth_1, symbolHeight_1, lineStyle.stroke, true);
          var r = point.r + point.offset;
          var pt = inverse ? pt2 : pt1;
          symbol.attr({
            rotation: point.rotate,
            x: pt[0] + r * Math.cos(cfg.rotation),
            y: pt[1] - r * Math.sin(cfg.rotation),
            silent: true,
            z2: 11
          });
          group.add(symbol);
        }
      });
    }
  },
  /**
   * [CAUTION] This method can be called multiple times, following the change due to `resetCfg` called
   *  in size measurement. Thus this method should be idempotent, and should be performant.
   */
  axisTickLabelEstimate: function(cfg, local, shared, axisModel, group, transformGroup, api, extraParams) {
    var needCallLayout = dealLastTickLabelResultReusable(local, group, extraParams);
    if (needCallLayout) {
      layOutAxisTickLabel(cfg, local, shared, axisModel, group, transformGroup, api, AxisTickLabelComputingKind.estimate);
    }
  },
  /**
   * Finish axis tick label build.
   * Can be only called once.
   */
  axisTickLabelDetermine: function(cfg, local, shared, axisModel, group, transformGroup, api, extraParams) {
    var needCallLayout = dealLastTickLabelResultReusable(local, group, extraParams);
    if (needCallLayout) {
      layOutAxisTickLabel(cfg, local, shared, axisModel, group, transformGroup, api, AxisTickLabelComputingKind.determine);
    }
    var ticksEls = buildAxisMajorTicks(cfg, group, transformGroup, axisModel);
    syncLabelIgnoreToMajorTicks(cfg, local.labelLayoutList, ticksEls);
    buildAxisMinorTicks(cfg, group, transformGroup, axisModel, cfg.tickDirection);
  },
  /**
   * [CAUTION] This method can be called multiple times, following the change due to `resetCfg` called
   *  in size measurement. Thus this method should be idempotent, and should be performant.
   */
  axisName: function(cfg, local, shared, axisModel, group, transformGroup, api, extraParams) {
    var sharedRecord = shared.ensureRecord(axisModel);
    if (local.nameEl) {
      group.remove(local.nameEl);
      local.nameEl = sharedRecord.nameLayout = sharedRecord.nameLocation = null;
    }
    var name = cfg.axisName;
    if (!hasAxisName(name)) {
      return;
    }
    var nameLocation = cfg.nameLocation;
    var nameDirection = cfg.nameDirection;
    var textStyleModel = axisModel.getModel("nameTextStyle");
    var gap = axisModel.get("nameGap") || 0;
    var extent = axisModel.axis.getExtent();
    var gapStartEndSignal = axisModel.axis.inverse ? -1 : 1;
    var pos = new Point(0, 0);
    var nameMoveDirVec = new Point(0, 0);
    if (nameLocation === "start") {
      pos.x = extent[0] - gapStartEndSignal * gap;
      nameMoveDirVec.x = -gapStartEndSignal;
    } else if (nameLocation === "end") {
      pos.x = extent[1] + gapStartEndSignal * gap;
      nameMoveDirVec.x = gapStartEndSignal;
    } else {
      pos.x = (extent[0] + extent[1]) / 2;
      pos.y = cfg.labelOffset + nameDirection * gap;
      nameMoveDirVec.y = nameDirection;
    }
    var mt = create();
    nameMoveDirVec.transform(rotate(mt, mt, cfg.rotation));
    var nameRotation = axisModel.get("nameRotate");
    if (nameRotation != null) {
      nameRotation = nameRotation * PI$1 / 180;
    }
    var labelLayout;
    var axisNameAvailableWidth;
    if (isNameLocationCenter(nameLocation)) {
      labelLayout = AxisBuilder.innerTextLayout(
        cfg.rotation,
        nameRotation != null ? nameRotation : cfg.rotation,
        // Adapt to axis.
        nameDirection
      );
    } else {
      labelLayout = endTextLayout(cfg.rotation, nameLocation, nameRotation || 0, extent);
      axisNameAvailableWidth = cfg.raw.axisNameAvailableWidth;
      if (axisNameAvailableWidth != null) {
        axisNameAvailableWidth = Math.abs(axisNameAvailableWidth / Math.sin(labelLayout.rotation));
        !isFinite(axisNameAvailableWidth) && (axisNameAvailableWidth = null);
      }
    }
    var textFont = textStyleModel.getFont();
    var truncateOpt = axisModel.get("nameTruncate", true) || {};
    var ellipsis = truncateOpt.ellipsis;
    var maxWidth = retrieve(cfg.raw.nameTruncateMaxWidth, truncateOpt.maxWidth, axisNameAvailableWidth);
    var nameMarginLevel = extraParams.nameMarginLevel || 0;
    var textEl = new ZRText({
      x: pos.x,
      y: pos.y,
      rotation: labelLayout.rotation,
      silent: AxisBuilder.isLabelSilent(axisModel),
      style: createTextStyle(textStyleModel, {
        text: name,
        font: textFont,
        overflow: "truncate",
        width: maxWidth,
        ellipsis,
        fill: textStyleModel.getTextColor() || axisModel.get(["axisLine", "lineStyle", "color"]),
        align: textStyleModel.get("align") || labelLayout.textAlign,
        verticalAlign: textStyleModel.get("verticalAlign") || labelLayout.textVerticalAlign
      }),
      z2: 1
    });
    setTooltipConfig({
      el: textEl,
      componentModel: axisModel,
      itemName: name
    });
    textEl.__fullText = name;
    textEl.anid = "name";
    if (axisModel.get("triggerEvent")) {
      var eventData = AxisBuilder.makeAxisEventDataBase(axisModel);
      eventData.targetType = "axisName";
      eventData.name = name;
      getECData(textEl).eventData = eventData;
    }
    transformGroup.add(textEl);
    textEl.updateTransform();
    local.nameEl = textEl;
    var nameLayout = sharedRecord.nameLayout = ensureLabelLayoutWithGeometry({
      label: textEl,
      priority: textEl.z2,
      defaultAttr: {
        ignore: textEl.ignore
      },
      marginDefault: isNameLocationCenter(nameLocation) ? DEFAULT_CENTER_NAME_MARGIN_LEVELS[nameMarginLevel] : DEFAULT_ENDS_NAME_MARGIN_LEVELS[nameMarginLevel]
    });
    sharedRecord.nameLocation = nameLocation;
    group.add(textEl);
    textEl.decomposeTransform();
    if (cfg.shouldNameMoveOverlap && nameLayout) {
      var record = shared.ensureRecord(axisModel);
      shared.resolveAxisNameOverlap(cfg, shared, axisModel, nameLayout, nameMoveDirVec, record);
    }
  }
};
function layOutAxisTickLabel(cfg, local, shared, axisModel, group, transformGroup, api, kind) {
  if (!axisLabelBuildResultExists(local)) {
    buildAxisLabel(cfg, local, group, kind, axisModel, api);
  }
  var labelLayoutList = local.labelLayoutList;
  updateAxisLabelChangableProps(cfg, axisModel, labelLayoutList, transformGroup);
  adjustBreakLabels(axisModel, cfg.rotation);
  var optionHideOverlap = cfg.optionHideOverlap;
  fixMinMaxLabelShow(axisModel, labelLayoutList, optionHideOverlap);
  if (optionHideOverlap) {
    hideOverlap(
      // Filter the already ignored labels by the previous overlap resolving methods.
      filter(labelLayoutList, function(layout2) {
        return layout2 && !layout2.label.ignore;
      })
    );
  }
  resetOverlapRecordToShared(cfg, shared, axisModel, labelLayoutList);
}
function endTextLayout(rotation, textPosition, textRotate, extent) {
  var rotationDiff = remRadian(textRotate - rotation);
  var textAlign;
  var textVerticalAlign;
  var inverse = extent[0] > extent[1];
  var onLeft = textPosition === "start" && !inverse || textPosition !== "start" && inverse;
  if (isRadianAroundZero(rotationDiff - PI$1 / 2)) {
    textVerticalAlign = onLeft ? "bottom" : "top";
    textAlign = "center";
  } else if (isRadianAroundZero(rotationDiff - PI$1 * 1.5)) {
    textVerticalAlign = onLeft ? "top" : "bottom";
    textAlign = "center";
  } else {
    textVerticalAlign = "middle";
    if (rotationDiff < PI$1 * 1.5 && rotationDiff > PI$1 / 2) {
      textAlign = onLeft ? "left" : "right";
    } else {
      textAlign = onLeft ? "right" : "left";
    }
  }
  return {
    rotation: rotationDiff,
    textAlign,
    textVerticalAlign
  };
}
function fixMinMaxLabelShow(axisModel, labelLayoutList, optionHideOverlap) {
  if (shouldShowAllLabels(axisModel.axis)) {
    return;
  }
  function deal(showMinMaxLabel, outmostLabelIdx, innerLabelIdx) {
    var outmostLabelLayout = ensureLabelLayoutWithGeometry(labelLayoutList[outmostLabelIdx]);
    var innerLabelLayout = ensureLabelLayoutWithGeometry(labelLayoutList[innerLabelIdx]);
    if (!outmostLabelLayout || !innerLabelLayout) {
      return;
    }
    if (showMinMaxLabel === false || outmostLabelLayout.suggestIgnore) {
      ignoreEl(outmostLabelLayout.label);
      return;
    }
    if (innerLabelLayout.suggestIgnore) {
      ignoreEl(innerLabelLayout.label);
      return;
    }
    var touchThreshold = 0.1;
    if (!optionHideOverlap) {
      var marginForce = [0, 0, 0, 0];
      outmostLabelLayout = newLabelLayoutWithGeometry({
        marginForce
      }, outmostLabelLayout);
      innerLabelLayout = newLabelLayoutWithGeometry({
        marginForce
      }, innerLabelLayout);
    }
    if (labelIntersect(outmostLabelLayout, innerLabelLayout, null, {
      touchThreshold
    })) {
      if (showMinMaxLabel) {
        ignoreEl(innerLabelLayout.label);
      } else {
        ignoreEl(outmostLabelLayout.label);
      }
    }
  }
  var showMinLabel = axisModel.get(["axisLabel", "showMinLabel"]);
  var showMaxLabel = axisModel.get(["axisLabel", "showMaxLabel"]);
  var labelsLen = labelLayoutList.length;
  deal(showMinLabel, 0, 1);
  deal(showMaxLabel, labelsLen - 1, labelsLen - 2);
}
function syncLabelIgnoreToMajorTicks(cfg, labelLayoutList, tickEls) {
  if (cfg.showMinorTicks) {
    return;
  }
  each$4(labelLayoutList, function(labelLayout) {
    if (labelLayout && labelLayout.label.ignore) {
      for (var idx = 0; idx < tickEls.length; idx++) {
        var tickEl = tickEls[idx];
        var tickInner = getTickInner(tickEl);
        var labelInner2 = getLabelInner(labelLayout.label);
        if (tickInner.tickValue != null && !tickInner.onBand && tickInner.tickValue === labelInner2.tickValue) {
          ignoreEl(tickEl);
          return;
        }
      }
    }
  });
}
function ignoreEl(el) {
  el && (el.ignore = true);
}
function createTicks(ticksCoords, tickTransform, tickEndCoord, tickLineStyle, anidPrefix) {
  var tickEls = [];
  var pt1 = [];
  var pt2 = [];
  for (var i = 0; i < ticksCoords.length; i++) {
    var tickCoord = ticksCoords[i].coord;
    pt1[0] = tickCoord;
    pt1[1] = 0;
    pt2[0] = tickCoord;
    pt2[1] = tickEndCoord;
    if (tickTransform) {
      applyTransform$1(pt1, pt1, tickTransform);
      applyTransform$1(pt2, pt2, tickTransform);
    }
    var tickEl = new Line$1({
      shape: {
        x1: pt1[0],
        y1: pt1[1],
        x2: pt2[0],
        y2: pt2[1]
      },
      style: tickLineStyle,
      z2: 2,
      autoBatch: true,
      silent: true
    });
    subPixelOptimizeLine(tickEl.shape, tickEl.style.lineWidth);
    tickEl.anid = anidPrefix + "_" + ticksCoords[i].tickValue;
    tickEls.push(tickEl);
    var inner2 = getTickInner(tickEl);
    inner2.onBand = !!ticksCoords[i].onBand;
    inner2.tickValue = ticksCoords[i].tickValue;
  }
  return tickEls;
}
function buildAxisMajorTicks(cfg, group, transformGroup, axisModel) {
  var axis = axisModel.axis;
  var tickModel = axisModel.getModel("axisTick");
  var shown = tickModel.get("show");
  if (shown === "auto") {
    shown = true;
    if (cfg.raw.axisTickAutoShow != null) {
      shown = !!cfg.raw.axisTickAutoShow;
    }
  }
  if (!shown || axis.scale.isBlank()) {
    return [];
  }
  var lineStyleModel = tickModel.getModel("lineStyle");
  var tickEndCoord = cfg.tickDirection * tickModel.get("length");
  var ticksCoords = axis.getTicksCoords();
  var ticksEls = createTicks(ticksCoords, transformGroup.transform, tickEndCoord, defaults(lineStyleModel.getLineStyle(), {
    stroke: axisModel.get(["axisLine", "lineStyle", "color"])
  }), "ticks");
  for (var i = 0; i < ticksEls.length; i++) {
    group.add(ticksEls[i]);
  }
  return ticksEls;
}
function buildAxisMinorTicks(cfg, group, transformGroup, axisModel, tickDirection) {
  var axis = axisModel.axis;
  var minorTickModel = axisModel.getModel("minorTick");
  if (!cfg.showMinorTicks || axis.scale.isBlank()) {
    return;
  }
  var minorTicksCoords = axis.getMinorTicksCoords();
  if (!minorTicksCoords.length) {
    return;
  }
  var lineStyleModel = minorTickModel.getModel("lineStyle");
  var tickEndCoord = tickDirection * minorTickModel.get("length");
  var minorTickLineStyle = defaults(lineStyleModel.getLineStyle(), defaults(axisModel.getModel("axisTick").getLineStyle(), {
    stroke: axisModel.get(["axisLine", "lineStyle", "color"])
  }));
  for (var i = 0; i < minorTicksCoords.length; i++) {
    var minorTicksEls = createTicks(minorTicksCoords[i], transformGroup.transform, tickEndCoord, minorTickLineStyle, "minorticks_" + i);
    for (var k = 0; k < minorTicksEls.length; k++) {
      group.add(minorTicksEls[k]);
    }
  }
}
function dealLastTickLabelResultReusable(local, group, extraParams) {
  if (axisLabelBuildResultExists(local)) {
    var axisLabelsCreationContext = local.axisLabelsCreationContext;
    var noPxChangeTryDetermine = axisLabelsCreationContext.out.noPxChangeTryDetermine;
    if (extraParams.noPxChange) {
      var canDetermine = true;
      for (var idx = 0; idx < noPxChangeTryDetermine.length; idx++) {
        canDetermine = canDetermine && noPxChangeTryDetermine[idx]();
      }
      if (canDetermine) {
        return false;
      }
    }
    if (noPxChangeTryDetermine.length) {
      group.remove(local.labelGroup);
      axisLabelBuildResultSet(local, null, null, null);
    }
  }
  return true;
}
function buildAxisLabel(cfg, local, group, kind, axisModel, api) {
  var axis = axisModel.axis;
  var show = retrieve(cfg.raw.axisLabelShow, axisModel.get(["axisLabel", "show"]));
  var labelGroup = new Group$2();
  group.add(labelGroup);
  var axisLabelCreationCtx = createAxisLabelsComputingContext(kind);
  if (!show || axis.scale.isBlank()) {
    axisLabelBuildResultSet(local, [], labelGroup, axisLabelCreationCtx);
    return;
  }
  var labelModel = axisModel.getModel("axisLabel");
  var labels = axis.getViewLabels(axisLabelCreationCtx);
  var labelRotation = (retrieve(cfg.raw.labelRotate, labelModel.get("rotate")) || 0) * PI$1 / 180;
  var labelLayout = AxisBuilder.innerTextLayout(cfg.rotation, labelRotation, cfg.labelDirection);
  var rawCategoryData = axisModel.getCategories && axisModel.getCategories(true);
  var labelEls = [];
  var triggerEvent = axisModel.get("triggerEvent");
  var z2Min = Infinity;
  var z2Max = -Infinity;
  each$4(labels, function(labelItem, index) {
    var _a2;
    var tickValue = axis.scale.type === "ordinal" ? axis.scale.getRawOrdinalNumber(labelItem.tickValue) : labelItem.tickValue;
    var formattedLabel = labelItem.formattedLabel;
    var rawLabel = labelItem.rawLabel;
    var itemLabelModel = labelModel;
    if (rawCategoryData && rawCategoryData[tickValue]) {
      var rawCategoryItem = rawCategoryData[tickValue];
      if (isObject$2(rawCategoryItem) && rawCategoryItem.textStyle) {
        itemLabelModel = new Model(rawCategoryItem.textStyle, labelModel, axisModel.ecModel);
      }
    }
    var textColor = itemLabelModel.getTextColor() || axisModel.get(["axisLine", "lineStyle", "color"]);
    var align = itemLabelModel.getShallow("align", true) || labelLayout.textAlign;
    var alignMin = retrieve2(itemLabelModel.getShallow("alignMinLabel", true), align);
    var alignMax = retrieve2(itemLabelModel.getShallow("alignMaxLabel", true), align);
    var verticalAlign = itemLabelModel.getShallow("verticalAlign", true) || itemLabelModel.getShallow("baseline", true) || labelLayout.textVerticalAlign;
    var verticalAlignMin = retrieve2(itemLabelModel.getShallow("verticalAlignMinLabel", true), verticalAlign);
    var verticalAlignMax = retrieve2(itemLabelModel.getShallow("verticalAlignMaxLabel", true), verticalAlign);
    var z2 = 10 + (((_a2 = labelItem.time) === null || _a2 === void 0 ? void 0 : _a2.level) || 0);
    z2Min = Math.min(z2Min, z2);
    z2Max = Math.max(z2Max, z2);
    var textEl = new ZRText({
      // --- transform props start ---
      // All of the transform props MUST not be set here, but should be set in
      // `updateAxisLabelChangableProps`, because they may change in estimation,
      // and need to calculate based on global coord sys by `decomposeTransform`.
      x: 0,
      y: 0,
      rotation: 0,
      // --- transform props end ---
      silent: AxisBuilder.isLabelSilent(axisModel),
      z2,
      style: createTextStyle(itemLabelModel, {
        text: formattedLabel,
        align: index === 0 ? alignMin : index === labels.length - 1 ? alignMax : align,
        verticalAlign: index === 0 ? verticalAlignMin : index === labels.length - 1 ? verticalAlignMax : verticalAlign,
        fill: isFunction(textColor) ? textColor(
          // (1) In category axis with data zoom, tick is not the original
          // index of axis.data. So tick should not be exposed to user
          // in category axis.
          // (2) Compatible with previous version, which always use formatted label as
          // input. But in interval scale the formatted label is like '223,445', which
          // maked user replace ','. So we modify it to return original val but remain
          // it as 'string' to avoid error in replacing.
          axis.type === "category" ? rawLabel : axis.type === "value" ? tickValue + "" : tickValue,
          index
        ) : textColor
      })
    });
    textEl.anid = "label_" + tickValue;
    var inner2 = getLabelInner(textEl);
    inner2["break"] = labelItem["break"];
    inner2.tickValue = tickValue;
    inner2.layoutRotation = labelLayout.rotation;
    setTooltipConfig({
      el: textEl,
      componentModel: axisModel,
      itemName: formattedLabel,
      formatterParamsExtra: {
        isTruncated: function() {
          return textEl.isTruncated;
        },
        value: rawLabel,
        tickIndex: index
      }
    });
    if (triggerEvent) {
      var eventData = AxisBuilder.makeAxisEventDataBase(axisModel);
      eventData.targetType = "axisLabel";
      eventData.value = rawLabel;
      eventData.tickIndex = index;
      if (labelItem["break"]) {
        eventData["break"] = {
          // type: labelItem.break.type,
          start: labelItem["break"].parsedBreak.vmin,
          end: labelItem["break"].parsedBreak.vmax
        };
      }
      if (axis.type === "category") {
        eventData.dataIndex = tickValue;
      }
      getECData(textEl).eventData = eventData;
      if (labelItem["break"]) {
        addBreakEventHandler(axisModel, api, textEl, labelItem["break"]);
      }
    }
    labelEls.push(textEl);
    labelGroup.add(textEl);
  });
  var labelLayoutList = map$1(labelEls, function(label) {
    return {
      label,
      priority: getLabelInner(label)["break"] ? label.z2 + (z2Max - z2Min + 1) : label.z2,
      defaultAttr: {
        ignore: label.ignore
      }
    };
  });
  axisLabelBuildResultSet(local, labelLayoutList, labelGroup, axisLabelCreationCtx);
}
function axisLabelBuildResultExists(local) {
  return !!local.labelLayoutList;
}
function axisLabelBuildResultSet(local, labelLayoutList, labelGroup, axisLabelsCreationContext) {
  local.labelLayoutList = labelLayoutList;
  local.labelGroup = labelGroup;
  local.axisLabelsCreationContext = axisLabelsCreationContext;
}
function updateAxisLabelChangableProps(cfg, axisModel, labelLayoutList, transformGroup) {
  var labelMargin = axisModel.get(["axisLabel", "margin"]);
  each$4(labelLayoutList, function(layout2, idx) {
    var geometry = ensureLabelLayoutWithGeometry(layout2);
    if (!geometry) {
      return;
    }
    var labelEl = geometry.label;
    var inner2 = getLabelInner(labelEl);
    geometry.suggestIgnore = labelEl.ignore;
    labelEl.ignore = false;
    copyTransform(_tmpLayoutEl, _tmpLayoutElReset);
    _tmpLayoutEl.x = axisModel.axis.dataToCoord(inner2.tickValue);
    _tmpLayoutEl.y = cfg.labelOffset + cfg.labelDirection * labelMargin;
    _tmpLayoutEl.rotation = inner2.layoutRotation;
    transformGroup.add(_tmpLayoutEl);
    _tmpLayoutEl.updateTransform();
    transformGroup.remove(_tmpLayoutEl);
    _tmpLayoutEl.decomposeTransform();
    copyTransform(labelEl, _tmpLayoutEl);
    labelEl.markRedraw();
    setLabelLayoutDirty(geometry, true);
    ensureLabelLayoutWithGeometry(geometry);
  });
}
var _tmpLayoutEl = new Rect();
var _tmpLayoutElReset = new Rect();
function hasAxisName(axisName) {
  return !!axisName;
}
function addBreakEventHandler(axisModel, api, textEl, visualBreak) {
  textEl.on("click", function(params) {
    var payload = {
      type: AXIS_BREAK_EXPAND_ACTION_TYPE,
      breaks: [{
        start: visualBreak.parsedBreak.breakOption.start,
        end: visualBreak.parsedBreak.breakOption.end
      }]
    };
    payload[axisModel.axis.dim + "AxisIndex"] = axisModel.componentIndex;
    api.dispatchAction(payload);
  });
}
function adjustBreakLabels(axisModel, axisRotation, labelLayoutList) {
  {
    return;
  }
}
function layout(rect, axisModel, opt) {
  opt = opt || {};
  var axis = axisModel.axis;
  var layout2 = {};
  var otherAxisOnZeroOf = axis.getAxesOnZeroOf()[0];
  var rawAxisPosition = axis.position;
  var axisPosition = otherAxisOnZeroOf ? "onZero" : rawAxisPosition;
  var axisDim = axis.dim;
  var rectBound = [rect.x, rect.x + rect.width, rect.y, rect.y + rect.height];
  var idx = {
    left: 0,
    right: 1,
    top: 0,
    bottom: 1,
    onZero: 2
  };
  var axisOffset = axisModel.get("offset") || 0;
  var posBound = axisDim === "x" ? [rectBound[2] - axisOffset, rectBound[3] + axisOffset] : [rectBound[0] - axisOffset, rectBound[1] + axisOffset];
  if (otherAxisOnZeroOf) {
    var onZeroCoord = otherAxisOnZeroOf.toGlobalCoord(otherAxisOnZeroOf.dataToCoord(0));
    posBound[idx.onZero] = Math.max(Math.min(onZeroCoord, posBound[1]), posBound[0]);
  }
  layout2.position = [axisDim === "y" ? posBound[idx[axisPosition]] : rectBound[0], axisDim === "x" ? posBound[idx[axisPosition]] : rectBound[3]];
  layout2.rotation = Math.PI / 2 * (axisDim === "x" ? 0 : 1);
  var dirMap = {
    top: -1,
    bottom: 1,
    left: -1,
    right: 1
  };
  layout2.labelDirection = layout2.tickDirection = layout2.nameDirection = dirMap[rawAxisPosition];
  layout2.labelOffset = otherAxisOnZeroOf ? posBound[idx[rawAxisPosition]] - posBound[idx.onZero] : 0;
  if (axisModel.get(["axisTick", "inside"])) {
    layout2.tickDirection = -layout2.tickDirection;
  }
  if (retrieve(opt.labelInside, axisModel.get(["axisLabel", "inside"]))) {
    layout2.labelDirection = -layout2.labelDirection;
  }
  var labelRotate = axisModel.get(["axisLabel", "rotate"]);
  layout2.labelRotate = axisPosition === "top" ? -labelRotate : labelRotate;
  layout2.z2 = 1;
  return layout2;
}
function isCartesian2DInjectedAsDataCoordSys(seriesModel) {
  return seriesModel.coordinateSystem && seriesModel.coordinateSystem.type === "cartesian2d";
}
function findAxisModels(seriesModel) {
  var axisModelMap = {
    xAxisModel: null,
    yAxisModel: null
  };
  each$4(axisModelMap, function(v, key) {
    var axisType = key.replace(/Model$/, "");
    var axisModel = seriesModel.getReferringComponents(axisType, SINGLE_REFERRING).models[0];
    axisModelMap[key] = axisModel;
  });
  return axisModelMap;
}
function createCartesianAxisViewCommonPartBuilder(gridRect, cartesians, axisModel, api, ctx, defaultNameMoveOverlap) {
  var layoutResult = layout(gridRect, axisModel);
  var axisLineAutoShow = false;
  var axisTickAutoShow = false;
  for (var i = 0; i < cartesians.length; i++) {
    if (isIntervalOrLogScale(cartesians[i].getOtherAxis(axisModel.axis).scale)) {
      axisLineAutoShow = axisTickAutoShow = true;
      if (axisModel.axis.type === "category" && axisModel.axis.onBand) {
        axisTickAutoShow = false;
      }
    }
  }
  layoutResult.axisLineAutoShow = axisLineAutoShow;
  layoutResult.axisTickAutoShow = axisTickAutoShow;
  layoutResult.defaultNameMoveOverlap = defaultNameMoveOverlap;
  return new AxisBuilder(axisModel, api, layoutResult, ctx);
}
function updateCartesianAxisViewCommonPartBuilder(axisBuilder, gridRect, axisModel) {
  var newRaw = layout(gridRect, axisModel);
  axisBuilder.updateCfg(newRaw);
}
function alignScaleTicks(scale2, axisModel, alignToScale) {
  var intervalScaleProto = IntervalScale.prototype;
  var alignToTicks = intervalScaleProto.getTicks.call(alignToScale);
  var alignToNicedTicks = intervalScaleProto.getTicks.call(alignToScale, {
    expandToNicedExtent: true
  });
  var alignToSplitNumber = alignToTicks.length - 1;
  var alignToInterval = intervalScaleProto.getInterval.call(alignToScale);
  var scaleExtent = getScaleExtent(scale2, axisModel);
  var rawExtent = scaleExtent.extent;
  var isMinFixed = scaleExtent.fixMin;
  var isMaxFixed = scaleExtent.fixMax;
  if (scale2.type === "log") {
    rawExtent = logTransform(scale2.base, rawExtent, true);
  }
  scale2.setBreaksFromOption(retrieveAxisBreaksOption(axisModel));
  scale2.setExtent(rawExtent[0], rawExtent[1]);
  scale2.calcNiceExtent({
    splitNumber: alignToSplitNumber,
    fixMin: isMinFixed,
    fixMax: isMaxFixed
  });
  var extent = intervalScaleProto.getExtent.call(scale2);
  if (isMinFixed) {
    rawExtent[0] = extent[0];
  }
  if (isMaxFixed) {
    rawExtent[1] = extent[1];
  }
  var interval = intervalScaleProto.getInterval.call(scale2);
  var min = rawExtent[0];
  var max = rawExtent[1];
  if (isMinFixed && isMaxFixed) {
    interval = (max - min) / alignToSplitNumber;
  } else if (isMinFixed) {
    max = rawExtent[0] + interval * alignToSplitNumber;
    while (max < rawExtent[1] && isFinite(max) && isFinite(rawExtent[1])) {
      interval = increaseInterval(interval);
      max = rawExtent[0] + interval * alignToSplitNumber;
    }
  } else if (isMaxFixed) {
    min = rawExtent[1] - interval * alignToSplitNumber;
    while (min > rawExtent[0] && isFinite(min) && isFinite(rawExtent[0])) {
      interval = increaseInterval(interval);
      min = rawExtent[1] - interval * alignToSplitNumber;
    }
  } else {
    var nicedSplitNumber = scale2.getTicks().length - 1;
    if (nicedSplitNumber > alignToSplitNumber) {
      interval = increaseInterval(interval);
    }
    var range = interval * alignToSplitNumber;
    max = Math.ceil(rawExtent[1] / interval) * interval;
    min = round(max - range);
    if (min < 0 && rawExtent[0] >= 0) {
      min = 0;
      max = round(range);
    } else if (max > 0 && rawExtent[1] <= 0) {
      max = 0;
      min = -round(range);
    }
  }
  var t0 = (alignToTicks[0].value - alignToNicedTicks[0].value) / alignToInterval;
  var t1 = (alignToTicks[alignToSplitNumber].value - alignToNicedTicks[alignToSplitNumber].value) / alignToInterval;
  intervalScaleProto.setExtent.call(scale2, min + interval * t0, max + interval * t1);
  intervalScaleProto.setInterval.call(scale2, interval);
  if (t0 || t1) {
    intervalScaleProto.setNiceExtent.call(scale2, min + interval, max - interval);
  }
}
var XY_TO_MARGIN_IDX = [
  [3, 1],
  [0, 2]
  // xyIdx 1 => 'y'
];
var Grid = (
  /** @class */
  function() {
    function Grid2(gridModel, ecModel, api) {
      this.type = "grid";
      this._coordsMap = {};
      this._coordsList = [];
      this._axesMap = {};
      this._axesList = [];
      this.axisPointerEnabled = true;
      this.dimensions = cartesian2DDimensions;
      this._initCartesian(gridModel, ecModel, api);
      this.model = gridModel;
    }
    Grid2.prototype.getRect = function() {
      return this._rect;
    };
    Grid2.prototype.update = function(ecModel, api) {
      var axesMap = this._axesMap;
      this._updateScale(ecModel, this.model);
      function updateAxisTicks(axes) {
        var alignTo;
        var axesIndices = keys(axes);
        var len2 = axesIndices.length;
        if (!len2) {
          return;
        }
        var axisNeedsAlign = [];
        for (var i = len2 - 1; i >= 0; i--) {
          var idx = +axesIndices[i];
          var axis = axes[idx];
          var model = axis.model;
          var scale2 = axis.scale;
          if (
            // Only value and log axis without interval support alignTicks.
            isIntervalOrLogScale(scale2) && model.get("alignTicks") && model.get("interval") == null
          ) {
            axisNeedsAlign.push(axis);
          } else {
            niceScaleExtent(scale2, model);
            if (isIntervalOrLogScale(scale2)) {
              alignTo = axis;
            }
          }
        }
        if (axisNeedsAlign.length) {
          if (!alignTo) {
            alignTo = axisNeedsAlign.pop();
            niceScaleExtent(alignTo.scale, alignTo.model);
          }
          each$4(axisNeedsAlign, function(axis2) {
            alignScaleTicks(axis2.scale, axis2.model, alignTo.scale);
          });
        }
      }
      updateAxisTicks(axesMap.x);
      updateAxisTicks(axesMap.y);
      var onZeroRecords = {};
      each$4(axesMap.x, function(xAxis) {
        fixAxisOnZero(axesMap, "y", xAxis, onZeroRecords);
      });
      each$4(axesMap.y, function(yAxis) {
        fixAxisOnZero(axesMap, "x", yAxis, onZeroRecords);
      });
      this.resize(this.model, api);
    };
    Grid2.prototype.resize = function(gridModel, api, beforeDataProcessing) {
      var layoutRef = createBoxLayoutReference(gridModel, api);
      var gridRect = this._rect = getLayoutRect(gridModel.getBoxLayoutParams(), layoutRef.refContainer);
      var axesMap = this._axesMap;
      var coordsList = this._coordsList;
      var optionContainLabel = gridModel.get("containLabel");
      updateAllAxisExtentTransByGridRect(axesMap, gridRect);
      if (!beforeDataProcessing) {
        var axisBuilderSharedCtx = createAxisBiulders(gridRect, coordsList, axesMap, optionContainLabel, api);
        var noPxChange = void 0;
        if (optionContainLabel) {
          {
            noPxChange = layOutGridByOuterBounds(gridRect.clone(), "axisLabel", null, gridRect, axesMap, axisBuilderSharedCtx, layoutRef);
          }
        } else {
          var _a2 = prepareOuterBounds(gridModel, gridRect, layoutRef), outerBoundsRect = _a2.outerBoundsRect, parsedOuterBoundsContain = _a2.parsedOuterBoundsContain, outerBoundsClamp = _a2.outerBoundsClamp;
          if (outerBoundsRect) {
            noPxChange = layOutGridByOuterBounds(outerBoundsRect, parsedOuterBoundsContain, outerBoundsClamp, gridRect, axesMap, axisBuilderSharedCtx, layoutRef);
          }
        }
        createOrUpdateAxesView(gridRect, axesMap, AxisTickLabelComputingKind.determine, null, noPxChange, layoutRef);
      }
      each$4(this._coordsList, function(coord) {
        coord.calcAffineTransform();
      });
    };
    Grid2.prototype.getAxis = function(dim, axisIndex) {
      var axesMapOnDim = this._axesMap[dim];
      if (axesMapOnDim != null) {
        return axesMapOnDim[axisIndex || 0];
      }
    };
    Grid2.prototype.getAxes = function() {
      return this._axesList.slice();
    };
    Grid2.prototype.getCartesian = function(xAxisIndex, yAxisIndex) {
      if (xAxisIndex != null && yAxisIndex != null) {
        var key = "x" + xAxisIndex + "y" + yAxisIndex;
        return this._coordsMap[key];
      }
      if (isObject$2(xAxisIndex)) {
        yAxisIndex = xAxisIndex.yAxisIndex;
        xAxisIndex = xAxisIndex.xAxisIndex;
      }
      for (var i = 0, coordList = this._coordsList; i < coordList.length; i++) {
        if (coordList[i].getAxis("x").index === xAxisIndex || coordList[i].getAxis("y").index === yAxisIndex) {
          return coordList[i];
        }
      }
    };
    Grid2.prototype.getCartesians = function() {
      return this._coordsList.slice();
    };
    Grid2.prototype.convertToPixel = function(ecModel, finder, value) {
      var target = this._findConvertTarget(finder);
      return target.cartesian ? target.cartesian.dataToPoint(value) : target.axis ? target.axis.toGlobalCoord(target.axis.dataToCoord(value)) : null;
    };
    Grid2.prototype.convertFromPixel = function(ecModel, finder, value) {
      var target = this._findConvertTarget(finder);
      return target.cartesian ? target.cartesian.pointToData(value) : target.axis ? target.axis.coordToData(target.axis.toLocalCoord(value)) : null;
    };
    Grid2.prototype._findConvertTarget = function(finder) {
      var seriesModel = finder.seriesModel;
      var xAxisModel = finder.xAxisModel || seriesModel && seriesModel.getReferringComponents("xAxis", SINGLE_REFERRING).models[0];
      var yAxisModel = finder.yAxisModel || seriesModel && seriesModel.getReferringComponents("yAxis", SINGLE_REFERRING).models[0];
      var gridModel = finder.gridModel;
      var coordsList = this._coordsList;
      var cartesian;
      var axis;
      if (seriesModel) {
        cartesian = seriesModel.coordinateSystem;
        indexOf(coordsList, cartesian) < 0 && (cartesian = null);
      } else if (xAxisModel && yAxisModel) {
        cartesian = this.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
      } else if (xAxisModel) {
        axis = this.getAxis("x", xAxisModel.componentIndex);
      } else if (yAxisModel) {
        axis = this.getAxis("y", yAxisModel.componentIndex);
      } else if (gridModel) {
        var grid = gridModel.coordinateSystem;
        if (grid === this) {
          cartesian = this._coordsList[0];
        }
      }
      return {
        cartesian,
        axis
      };
    };
    Grid2.prototype.containPoint = function(point) {
      var coord = this._coordsList[0];
      if (coord) {
        return coord.containPoint(point);
      }
    };
    Grid2.prototype._initCartesian = function(gridModel, ecModel, api) {
      var _this = this;
      var grid = this;
      var axisPositionUsed = {
        left: false,
        right: false,
        top: false,
        bottom: false
      };
      var axesMap = {
        x: {},
        y: {}
      };
      var axesCount = {
        x: 0,
        y: 0
      };
      ecModel.eachComponent("xAxis", createAxisCreator("x"), this);
      ecModel.eachComponent("yAxis", createAxisCreator("y"), this);
      if (!axesCount.x || !axesCount.y) {
        this._axesMap = {};
        this._axesList = [];
        return;
      }
      this._axesMap = axesMap;
      each$4(axesMap.x, function(xAxis, xAxisIndex) {
        each$4(axesMap.y, function(yAxis, yAxisIndex) {
          var key = "x" + xAxisIndex + "y" + yAxisIndex;
          var cartesian = new Cartesian2D(key);
          cartesian.master = _this;
          cartesian.model = gridModel;
          _this._coordsMap[key] = cartesian;
          _this._coordsList.push(cartesian);
          cartesian.addAxis(xAxis);
          cartesian.addAxis(yAxis);
        });
      });
      function createAxisCreator(dimName) {
        return function(axisModel, idx) {
          if (!isAxisUsedInTheGrid(axisModel, gridModel)) {
            return;
          }
          var axisPosition = axisModel.get("position");
          if (dimName === "x") {
            if (axisPosition !== "top" && axisPosition !== "bottom") {
              axisPosition = axisPositionUsed.bottom ? "top" : "bottom";
            }
          } else {
            if (axisPosition !== "left" && axisPosition !== "right") {
              axisPosition = axisPositionUsed.left ? "right" : "left";
            }
          }
          axisPositionUsed[axisPosition] = true;
          var axis = new Axis2D(dimName, createScaleByModel(axisModel), [0, 0], axisModel.get("type"), axisPosition);
          var isCategory2 = axis.type === "category";
          axis.onBand = isCategory2 && axisModel.get("boundaryGap");
          axis.inverse = axisModel.get("inverse");
          axisModel.axis = axis;
          axis.model = axisModel;
          axis.grid = grid;
          axis.index = idx;
          grid._axesList.push(axis);
          axesMap[dimName][idx] = axis;
          axesCount[dimName]++;
        };
      }
    };
    Grid2.prototype._updateScale = function(ecModel, gridModel) {
      each$4(this._axesList, function(axis) {
        axis.scale.setExtent(Infinity, -Infinity);
        if (axis.type === "category") {
          var categorySortInfo = axis.model.get("categorySortInfo");
          axis.scale.setSortInfo(categorySortInfo);
        }
      });
      ecModel.eachSeries(function(seriesModel) {
        if (isCartesian2DInjectedAsDataCoordSys(seriesModel)) {
          var axesModelMap = findAxisModels(seriesModel);
          var xAxisModel = axesModelMap.xAxisModel;
          var yAxisModel = axesModelMap.yAxisModel;
          if (!isAxisUsedInTheGrid(xAxisModel, gridModel) || !isAxisUsedInTheGrid(yAxisModel, gridModel)) {
            return;
          }
          var cartesian = this.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
          var data = seriesModel.getData();
          var xAxis = cartesian.getAxis("x");
          var yAxis = cartesian.getAxis("y");
          unionExtent(data, xAxis);
          unionExtent(data, yAxis);
        }
      }, this);
      function unionExtent(data, axis) {
        each$4(getDataDimensionsOnAxis(data, axis.dim), function(dim) {
          axis.scale.unionExtentFromData(data, dim);
        });
      }
    };
    Grid2.prototype.getTooltipAxes = function(dim) {
      var baseAxes = [];
      var otherAxes = [];
      each$4(this.getCartesians(), function(cartesian) {
        var baseAxis = dim != null && dim !== "auto" ? cartesian.getAxis(dim) : cartesian.getBaseAxis();
        var otherAxis = cartesian.getOtherAxis(baseAxis);
        indexOf(baseAxes, baseAxis) < 0 && baseAxes.push(baseAxis);
        indexOf(otherAxes, otherAxis) < 0 && otherAxes.push(otherAxis);
      });
      return {
        baseAxes,
        otherAxes
      };
    };
    Grid2.create = function(ecModel, api) {
      var grids = [];
      ecModel.eachComponent("grid", function(gridModel, idx) {
        var grid = new Grid2(gridModel, ecModel, api);
        grid.name = "grid_" + idx;
        grid.resize(gridModel, api, true);
        gridModel.coordinateSystem = grid;
        grids.push(grid);
      });
      ecModel.eachSeries(function(seriesModel) {
        injectCoordSysByOption({
          targetModel: seriesModel,
          coordSysType: "cartesian2d",
          coordSysProvider
        });
        function coordSysProvider() {
          var axesModelMap = findAxisModels(seriesModel);
          var xAxisModel = axesModelMap.xAxisModel;
          var yAxisModel = axesModelMap.yAxisModel;
          var gridModel = xAxisModel.getCoordSysModel();
          var grid = gridModel.coordinateSystem;
          return grid.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
        }
      });
      return grids;
    };
    Grid2.dimensions = cartesian2DDimensions;
    return Grid2;
  }()
);
function isAxisUsedInTheGrid(axisModel, gridModel) {
  return axisModel.getCoordSysModel() === gridModel;
}
function fixAxisOnZero(axesMap, otherAxisDim, axis, onZeroRecords) {
  axis.getAxesOnZeroOf = function() {
    return otherAxisOnZeroOf ? [otherAxisOnZeroOf] : [];
  };
  var otherAxes = axesMap[otherAxisDim];
  var otherAxisOnZeroOf;
  var axisModel = axis.model;
  var onZero = axisModel.get(["axisLine", "onZero"]);
  var onZeroAxisIndex = axisModel.get(["axisLine", "onZeroAxisIndex"]);
  if (!onZero) {
    return;
  }
  if (onZeroAxisIndex != null) {
    if (canOnZeroToAxis(otherAxes[onZeroAxisIndex])) {
      otherAxisOnZeroOf = otherAxes[onZeroAxisIndex];
    }
  } else {
    for (var idx in otherAxes) {
      if (otherAxes.hasOwnProperty(idx) && canOnZeroToAxis(otherAxes[idx]) && !onZeroRecords[getOnZeroRecordKey(otherAxes[idx])]) {
        otherAxisOnZeroOf = otherAxes[idx];
        break;
      }
    }
  }
  if (otherAxisOnZeroOf) {
    onZeroRecords[getOnZeroRecordKey(otherAxisOnZeroOf)] = true;
  }
  function getOnZeroRecordKey(axis2) {
    return axis2.dim + "_" + axis2.index;
  }
}
function canOnZeroToAxis(axis) {
  return axis && axis.type !== "category" && axis.type !== "time" && ifAxisCrossZero(axis);
}
function updateAxisTransform(axis, coordBase) {
  var axisExtent = axis.getExtent();
  var axisExtentSum = axisExtent[0] + axisExtent[1];
  axis.toGlobalCoord = axis.dim === "x" ? function(coord) {
    return coord + coordBase;
  } : function(coord) {
    return axisExtentSum - coord + coordBase;
  };
  axis.toLocalCoord = axis.dim === "x" ? function(coord) {
    return coord - coordBase;
  } : function(coord) {
    return axisExtentSum - coord + coordBase;
  };
}
function updateAllAxisExtentTransByGridRect(axesMap, gridRect) {
  each$4(axesMap.x, function(axis) {
    return updateAxisExtentTransByGridRect(axis, gridRect.x, gridRect.width);
  });
  each$4(axesMap.y, function(axis) {
    return updateAxisExtentTransByGridRect(axis, gridRect.y, gridRect.height);
  });
}
function updateAxisExtentTransByGridRect(axis, gridXY, gridWH) {
  var extent = [0, gridWH];
  var idx = axis.inverse ? 1 : 0;
  axis.setExtent(extent[idx], extent[1 - idx]);
  updateAxisTransform(axis, gridXY);
}
function layOutGridByOuterBounds(outerBoundsRect, outerBoundsContain, outerBoundsClamp, gridRect, axesMap, axisBuilderSharedCtx, layoutRef) {
  createOrUpdateAxesView(gridRect, axesMap, AxisTickLabelComputingKind.estimate, outerBoundsContain, false, layoutRef);
  var margin = [0, 0, 0, 0];
  fillLabelNameOverflowOnOneDimension(0);
  fillLabelNameOverflowOnOneDimension(1);
  fillMarginOnOneDimension(gridRect, 0, NaN);
  fillMarginOnOneDimension(gridRect, 1, NaN);
  var noPxChange = find(margin, function(item) {
    return item > 0;
  }) == null;
  expandOrShrinkRect(gridRect, margin, true, true, outerBoundsClamp);
  updateAllAxisExtentTransByGridRect(axesMap, gridRect);
  return noPxChange;
  function fillLabelNameOverflowOnOneDimension(xyIdx) {
    each$4(axesMap[XY$1[xyIdx]], function(axis) {
      if (!shouldAxisShow(axis.model)) {
        return;
      }
      var sharedRecord = axisBuilderSharedCtx.ensureRecord(axis.model);
      var labelInfoList = sharedRecord.labelInfoList;
      if (labelInfoList) {
        for (var idx = 0; idx < labelInfoList.length; idx++) {
          var labelInfo = labelInfoList[idx];
          var proportion = axis.scale.normalize(getLabelInner(labelInfo.label).tickValue);
          proportion = xyIdx === 1 ? 1 - proportion : proportion;
          fillMarginOnOneDimension(labelInfo.rect, xyIdx, proportion);
          fillMarginOnOneDimension(labelInfo.rect, 1 - xyIdx, NaN);
        }
      }
      var nameLayout = sharedRecord.nameLayout;
      if (nameLayout) {
        var proportion = isNameLocationCenter(sharedRecord.nameLocation) ? 0.5 : NaN;
        fillMarginOnOneDimension(nameLayout.rect, xyIdx, proportion);
        fillMarginOnOneDimension(nameLayout.rect, 1 - xyIdx, NaN);
      }
    });
  }
  function fillMarginOnOneDimension(itemRect, xyIdx, proportion) {
    var overflow1 = outerBoundsRect[XY$1[xyIdx]] - itemRect[XY$1[xyIdx]];
    var overflow2 = itemRect[WH$1[xyIdx]] + itemRect[XY$1[xyIdx]] - (outerBoundsRect[WH$1[xyIdx]] + outerBoundsRect[XY$1[xyIdx]]);
    overflow1 = applyProportion(overflow1, 1 - proportion);
    overflow2 = applyProportion(overflow2, proportion);
    var minIdx = XY_TO_MARGIN_IDX[xyIdx][0];
    var maxIdx = XY_TO_MARGIN_IDX[xyIdx][1];
    margin[minIdx] = mathMax(margin[minIdx], overflow1);
    margin[maxIdx] = mathMax(margin[maxIdx], overflow2);
  }
  function applyProportion(overflow, proportion) {
    if (overflow > 0 && !eqNaN(proportion) && proportion > 1e-4) {
      overflow /= proportion;
    }
    return overflow;
  }
}
function createAxisBiulders(gridRect, cartesians, axesMap, optionContainLabel, api) {
  var axisBuilderSharedCtx = new AxisBuilderSharedContext(resolveAxisNameOverlapForGrid);
  each$4(axesMap, function(axisList) {
    return each$4(axisList, function(axis) {
      if (shouldAxisShow(axis.model)) {
        var defaultNameMoveOverlap = !optionContainLabel;
        axis.axisBuilder = createCartesianAxisViewCommonPartBuilder(gridRect, cartesians, axis.model, api, axisBuilderSharedCtx, defaultNameMoveOverlap);
      }
    });
  });
  return axisBuilderSharedCtx;
}
function createOrUpdateAxesView(gridRect, axesMap, kind, outerBoundsContain, noPxChange, layoutRef) {
  var isDetermine = kind === AxisTickLabelComputingKind.determine;
  each$4(axesMap, function(axisList) {
    return each$4(axisList, function(axis) {
      if (shouldAxisShow(axis.model)) {
        updateCartesianAxisViewCommonPartBuilder(axis.axisBuilder, gridRect, axis.model);
        axis.axisBuilder.build(isDetermine ? {
          axisTickLabelDetermine: true
        } : {
          axisTickLabelEstimate: true
        }, {
          noPxChange
        });
      }
    });
  });
  var nameMarginLevelMap = {
    x: 0,
    y: 0
  };
  calcNameMarginLevel(0);
  calcNameMarginLevel(1);
  function calcNameMarginLevel(xyIdx) {
    nameMarginLevelMap[XY$1[1 - xyIdx]] = gridRect[WH$1[xyIdx]] <= layoutRef.refContainer[WH$1[xyIdx]] * 0.5 ? 0 : 1 - xyIdx === 1 ? 2 : 1;
  }
  each$4(axesMap, function(axisList, xy) {
    return each$4(axisList, function(axis) {
      if (shouldAxisShow(axis.model)) {
        if (outerBoundsContain === "all" || isDetermine) {
          axis.axisBuilder.build({
            axisName: true
          }, {
            nameMarginLevel: nameMarginLevelMap[xy]
          });
        }
        if (isDetermine) {
          axis.axisBuilder.build({
            axisLine: true
          });
        }
      }
    });
  });
}
function prepareOuterBounds(gridModel, rawRridRect, layoutRef) {
  var outerBoundsRect;
  var optionOuterBoundsMode = gridModel.get("outerBoundsMode", true);
  if (optionOuterBoundsMode === "same") {
    outerBoundsRect = rawRridRect.clone();
  } else if (optionOuterBoundsMode == null || optionOuterBoundsMode === "auto") {
    outerBoundsRect = getLayoutRect(gridModel.get("outerBounds", true) || OUTER_BOUNDS_DEFAULT, layoutRef.refContainer);
  } else ;
  var optionOuterBoundsContain = gridModel.get("outerBoundsContain", true);
  var parsedOuterBoundsContain;
  if (optionOuterBoundsContain == null || optionOuterBoundsContain === "auto") {
    parsedOuterBoundsContain = "all";
  } else if (indexOf(["all", "axisLabel"], optionOuterBoundsContain) < 0) {
    parsedOuterBoundsContain = "all";
  } else {
    parsedOuterBoundsContain = optionOuterBoundsContain;
  }
  var outerBoundsClamp = [parsePositionSizeOption(retrieve2(gridModel.get("outerBoundsClampWidth", true), OUTER_BOUNDS_CLAMP_DEFAULT[0]), rawRridRect.width), parsePositionSizeOption(retrieve2(gridModel.get("outerBoundsClampHeight", true), OUTER_BOUNDS_CLAMP_DEFAULT[1]), rawRridRect.height)];
  return {
    outerBoundsRect,
    parsedOuterBoundsContain,
    outerBoundsClamp
  };
}
var resolveAxisNameOverlapForGrid = function(cfg, ctx, axisModel, nameLayoutInfo, nameMoveDirVec, thisRecord) {
  var perpendicularDim = axisModel.axis.dim === "x" ? "y" : "x";
  resolveAxisNameOverlapDefault(cfg, ctx, axisModel, nameLayoutInfo, nameMoveDirVec, thisRecord);
  if (!isNameLocationCenter(cfg.nameLocation)) {
    each$4(ctx.recordMap[perpendicularDim], function(perpenRecord) {
      if (perpenRecord && perpenRecord.labelInfoList && perpenRecord.dirVec) {
        moveIfOverlapByLinearLabels(perpenRecord.labelInfoList, perpenRecord.dirVec, nameLayoutInfo, nameMoveDirVec);
      }
    });
  }
};
function collect(ecModel, api) {
  var result = {
    /**
     * key: makeKey(axis.model)
     * value: {
     *      axis,
     *      coordSys,
     *      axisPointerModel,
     *      triggerTooltip,
     *      triggerEmphasis,
     *      involveSeries,
     *      snap,
     *      seriesModels,
     *      seriesDataCount
     * }
     */
    axesInfo: {},
    seriesInvolved: false,
    /**
     * key: makeKey(coordSys.model)
     * value: Object: key makeKey(axis.model), value: axisInfo
     */
    coordSysAxesInfo: {},
    coordSysMap: {}
  };
  collectAxesInfo(result, ecModel, api);
  result.seriesInvolved && collectSeriesInfo(result, ecModel);
  return result;
}
function collectAxesInfo(result, ecModel, api) {
  var globalTooltipModel = ecModel.getComponent("tooltip");
  var globalAxisPointerModel = ecModel.getComponent("axisPointer");
  var linksOption = globalAxisPointerModel.get("link", true) || [];
  var linkGroups = [];
  each$4(api.getCoordinateSystems(), function(coordSys) {
    if (!coordSys.axisPointerEnabled) {
      return;
    }
    var coordSysKey = makeKey(coordSys.model);
    var axesInfoInCoordSys = result.coordSysAxesInfo[coordSysKey] = {};
    result.coordSysMap[coordSysKey] = coordSys;
    var coordSysModel = coordSys.model;
    var baseTooltipModel = coordSysModel.getModel("tooltip", globalTooltipModel);
    each$4(coordSys.getAxes(), curry$1(saveTooltipAxisInfo, false, null));
    if (coordSys.getTooltipAxes && globalTooltipModel && baseTooltipModel.get("show")) {
      var triggerAxis = baseTooltipModel.get("trigger") === "axis";
      var cross = baseTooltipModel.get(["axisPointer", "type"]) === "cross";
      var tooltipAxes = coordSys.getTooltipAxes(baseTooltipModel.get(["axisPointer", "axis"]));
      if (triggerAxis || cross) {
        each$4(tooltipAxes.baseAxes, curry$1(saveTooltipAxisInfo, cross ? "cross" : true, triggerAxis));
      }
      if (cross) {
        each$4(tooltipAxes.otherAxes, curry$1(saveTooltipAxisInfo, "cross", false));
      }
    }
    function saveTooltipAxisInfo(fromTooltip, triggerTooltip, axis) {
      var axisPointerModel = axis.model.getModel("axisPointer", globalAxisPointerModel);
      var axisPointerShow = axisPointerModel.get("show");
      if (!axisPointerShow || axisPointerShow === "auto" && !fromTooltip && !isHandleTrigger(axisPointerModel)) {
        return;
      }
      if (triggerTooltip == null) {
        triggerTooltip = axisPointerModel.get("triggerTooltip");
      }
      axisPointerModel = fromTooltip ? makeAxisPointerModel(axis, baseTooltipModel, globalAxisPointerModel, ecModel, fromTooltip, triggerTooltip) : axisPointerModel;
      var snap = axisPointerModel.get("snap");
      var triggerEmphasis = axisPointerModel.get("triggerEmphasis");
      var axisKey = makeKey(axis.model);
      var involveSeries = triggerTooltip || snap || axis.type === "category";
      var axisInfo = result.axesInfo[axisKey] = {
        key: axisKey,
        axis,
        coordSys,
        axisPointerModel,
        triggerTooltip,
        triggerEmphasis,
        involveSeries,
        snap,
        useHandle: isHandleTrigger(axisPointerModel),
        seriesModels: [],
        linkGroup: null
      };
      axesInfoInCoordSys[axisKey] = axisInfo;
      result.seriesInvolved = result.seriesInvolved || involveSeries;
      var groupIndex = getLinkGroupIndex(linksOption, axis);
      if (groupIndex != null) {
        var linkGroup = linkGroups[groupIndex] || (linkGroups[groupIndex] = {
          axesInfo: {}
        });
        linkGroup.axesInfo[axisKey] = axisInfo;
        linkGroup.mapper = linksOption[groupIndex].mapper;
        axisInfo.linkGroup = linkGroup;
      }
    }
  });
}
function makeAxisPointerModel(axis, baseTooltipModel, globalAxisPointerModel, ecModel, fromTooltip, triggerTooltip) {
  var tooltipAxisPointerModel = baseTooltipModel.getModel("axisPointer");
  var fields = ["type", "snap", "lineStyle", "shadowStyle", "label", "animation", "animationDurationUpdate", "animationEasingUpdate", "z"];
  var volatileOption = {};
  each$4(fields, function(field) {
    volatileOption[field] = clone$1(tooltipAxisPointerModel.get(field));
  });
  volatileOption.snap = axis.type !== "category" && !!triggerTooltip;
  if (tooltipAxisPointerModel.get("type") === "cross") {
    volatileOption.type = "line";
  }
  var labelOption = volatileOption.label || (volatileOption.label = {});
  labelOption.show == null && (labelOption.show = false);
  if (fromTooltip === "cross") {
    var tooltipAxisPointerLabelShow = tooltipAxisPointerModel.get(["label", "show"]);
    labelOption.show = tooltipAxisPointerLabelShow != null ? tooltipAxisPointerLabelShow : true;
    if (!triggerTooltip) {
      var crossStyle = volatileOption.lineStyle = tooltipAxisPointerModel.get("crossStyle");
      crossStyle && defaults(labelOption, crossStyle.textStyle);
    }
  }
  return axis.model.getModel("axisPointer", new Model(volatileOption, globalAxisPointerModel, ecModel));
}
function collectSeriesInfo(result, ecModel) {
  ecModel.eachSeries(function(seriesModel) {
    var coordSys = seriesModel.coordinateSystem;
    var seriesTooltipTrigger = seriesModel.get(["tooltip", "trigger"], true);
    var seriesTooltipShow = seriesModel.get(["tooltip", "show"], true);
    if (!coordSys || !coordSys.model || seriesTooltipTrigger === "none" || seriesTooltipTrigger === false || seriesTooltipTrigger === "item" || seriesTooltipShow === false || seriesModel.get(["axisPointer", "show"], true) === false) {
      return;
    }
    each$4(result.coordSysAxesInfo[makeKey(coordSys.model)], function(axisInfo) {
      var axis = axisInfo.axis;
      if (coordSys.getAxis(axis.dim) === axis) {
        axisInfo.seriesModels.push(seriesModel);
        axisInfo.seriesDataCount == null && (axisInfo.seriesDataCount = 0);
        axisInfo.seriesDataCount += seriesModel.getData().count();
      }
    });
  });
}
function getLinkGroupIndex(linksOption, axis) {
  var axisModel = axis.model;
  var dim = axis.dim;
  for (var i = 0; i < linksOption.length; i++) {
    var linkOption = linksOption[i] || {};
    if (checkPropInLink(linkOption[dim + "AxisId"], axisModel.id) || checkPropInLink(linkOption[dim + "AxisIndex"], axisModel.componentIndex) || checkPropInLink(linkOption[dim + "AxisName"], axisModel.name)) {
      return i;
    }
  }
}
function checkPropInLink(linkPropValue, axisPropValue) {
  return linkPropValue === "all" || isArray(linkPropValue) && indexOf(linkPropValue, axisPropValue) >= 0 || linkPropValue === axisPropValue;
}
function fixValue(axisModel) {
  var axisInfo = getAxisInfo(axisModel);
  if (!axisInfo) {
    return;
  }
  var axisPointerModel = axisInfo.axisPointerModel;
  var scale2 = axisInfo.axis.scale;
  var option = axisPointerModel.option;
  var status = axisPointerModel.get("status");
  var value = axisPointerModel.get("value");
  if (value != null) {
    value = scale2.parse(value);
  }
  var useHandle = isHandleTrigger(axisPointerModel);
  if (status == null) {
    option.status = useHandle ? "show" : "hide";
  }
  var extent = scale2.getExtent().slice();
  extent[0] > extent[1] && extent.reverse();
  if (
    // Pick a value on axis when initializing.
    value == null || value > extent[1]
  ) {
    value = extent[1];
  }
  if (value < extent[0]) {
    value = extent[0];
  }
  option.value = value;
  if (useHandle) {
    option.status = axisInfo.axis.scale.isBlank() ? "hide" : "show";
  }
}
function getAxisInfo(axisModel) {
  var coordSysAxesInfo = (axisModel.ecModel.getComponent("axisPointer") || {}).coordSysAxesInfo;
  return coordSysAxesInfo && coordSysAxesInfo.axesInfo[makeKey(axisModel)];
}
function getAxisPointerModel(axisModel) {
  var axisInfo = getAxisInfo(axisModel);
  return axisInfo && axisInfo.axisPointerModel;
}
function isHandleTrigger(axisPointerModel) {
  return !!axisPointerModel.get(["handle", "show"]);
}
function makeKey(model) {
  return model.type + "||" + model.id;
}
var axisPointerClazz = {};
var AxisView = (
  /** @class */
  function(_super) {
    __extends(AxisView2, _super);
    function AxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = AxisView2.type;
      return _this;
    }
    AxisView2.prototype.render = function(axisModel, ecModel, api, payload) {
      this.axisPointerClass && fixValue(axisModel);
      _super.prototype.render.apply(this, arguments);
      this._doUpdateAxisPointerClass(axisModel, api, true);
    };
    AxisView2.prototype.updateAxisPointer = function(axisModel, ecModel, api, payload) {
      this._doUpdateAxisPointerClass(axisModel, api, false);
    };
    AxisView2.prototype.remove = function(ecModel, api) {
      var axisPointer = this._axisPointer;
      axisPointer && axisPointer.remove(api);
    };
    AxisView2.prototype.dispose = function(ecModel, api) {
      this._disposeAxisPointer(api);
      _super.prototype.dispose.apply(this, arguments);
    };
    AxisView2.prototype._doUpdateAxisPointerClass = function(axisModel, api, forceRender) {
      var Clazz = AxisView2.getAxisPointerClass(this.axisPointerClass);
      if (!Clazz) {
        return;
      }
      var axisPointerModel = getAxisPointerModel(axisModel);
      axisPointerModel ? (this._axisPointer || (this._axisPointer = new Clazz())).render(axisModel, axisPointerModel, api, forceRender) : this._disposeAxisPointer(api);
    };
    AxisView2.prototype._disposeAxisPointer = function(api) {
      this._axisPointer && this._axisPointer.dispose(api);
      this._axisPointer = null;
    };
    AxisView2.registerAxisPointerClass = function(type, clazz) {
      axisPointerClazz[type] = clazz;
    };
    AxisView2.getAxisPointerClass = function(type) {
      return type && axisPointerClazz[type];
    };
    AxisView2.type = "axis";
    return AxisView2;
  }(ComponentView)
);
var inner$6 = makeInner();
function rectCoordAxisBuildSplitArea(axisView, axisGroup, axisModel, gridModel) {
  var axis = axisModel.axis;
  if (axis.scale.isBlank()) {
    return;
  }
  var splitAreaModel = axisModel.getModel("splitArea");
  var areaStyleModel = splitAreaModel.getModel("areaStyle");
  var areaColors = areaStyleModel.get("color");
  var gridRect = gridModel.coordinateSystem.getRect();
  var ticksCoords = axis.getTicksCoords({
    tickModel: splitAreaModel,
    clamp: true,
    breakTicks: "none",
    pruneByBreak: "preserve_extent_bound"
  });
  if (!ticksCoords.length) {
    return;
  }
  var areaColorsLen = areaColors.length;
  var lastSplitAreaColors = inner$6(axisView).splitAreaColors;
  var newSplitAreaColors = createHashMap();
  var colorIndex = 0;
  if (lastSplitAreaColors) {
    for (var i = 0; i < ticksCoords.length; i++) {
      var cIndex = lastSplitAreaColors.get(ticksCoords[i].tickValue);
      if (cIndex != null) {
        colorIndex = (cIndex + (areaColorsLen - 1) * i) % areaColorsLen;
        break;
      }
    }
  }
  var prev = axis.toGlobalCoord(ticksCoords[0].coord);
  var areaStyle = areaStyleModel.getAreaStyle();
  areaColors = isArray(areaColors) ? areaColors : [areaColors];
  for (var i = 1; i < ticksCoords.length; i++) {
    var tickCoord = axis.toGlobalCoord(ticksCoords[i].coord);
    var x = void 0;
    var y = void 0;
    var width = void 0;
    var height = void 0;
    if (axis.isHorizontal()) {
      x = prev;
      y = gridRect.y;
      width = tickCoord - x;
      height = gridRect.height;
      prev = x + width;
    } else {
      x = gridRect.x;
      y = prev;
      width = gridRect.width;
      height = tickCoord - y;
      prev = y + height;
    }
    var tickValue = ticksCoords[i - 1].tickValue;
    tickValue != null && newSplitAreaColors.set(tickValue, colorIndex);
    axisGroup.add(new Rect({
      anid: tickValue != null ? "area_" + tickValue : null,
      shape: {
        x,
        y,
        width,
        height
      },
      style: defaults({
        fill: areaColors[colorIndex]
      }, areaStyle),
      autoBatch: true,
      silent: true
    }));
    colorIndex = (colorIndex + 1) % areaColorsLen;
  }
  inner$6(axisView).splitAreaColors = newSplitAreaColors;
}
function rectCoordAxisHandleRemove(axisView) {
  inner$6(axisView).splitAreaColors = null;
}
var selfBuilderAttrs = ["splitArea", "splitLine", "minorSplitLine", "breakArea"];
var CartesianAxisView = (
  /** @class */
  function(_super) {
    __extends(CartesianAxisView2, _super);
    function CartesianAxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = CartesianAxisView2.type;
      _this.axisPointerClass = "CartesianAxisPointer";
      return _this;
    }
    CartesianAxisView2.prototype.render = function(axisModel, ecModel, api, payload) {
      this.group.removeAll();
      var oldAxisGroup = this._axisGroup;
      this._axisGroup = new Group$2();
      this.group.add(this._axisGroup);
      if (!shouldAxisShow(axisModel)) {
        return;
      }
      this._axisGroup.add(axisModel.axis.axisBuilder.group);
      each$4(selfBuilderAttrs, function(name) {
        if (axisModel.get([name, "show"])) {
          axisElementBuilders[name](this, this._axisGroup, axisModel, axisModel.getCoordSysModel(), api);
        }
      }, this);
      var isInitialSortFromBarRacing = payload && payload.type === "changeAxisOrder" && payload.isInitSort;
      if (!isInitialSortFromBarRacing) {
        groupTransition(oldAxisGroup, this._axisGroup, axisModel);
      }
      _super.prototype.render.call(this, axisModel, ecModel, api, payload);
    };
    CartesianAxisView2.prototype.remove = function() {
      rectCoordAxisHandleRemove(this);
    };
    CartesianAxisView2.type = "cartesianAxis";
    return CartesianAxisView2;
  }(AxisView)
);
var axisElementBuilders = {
  splitLine: function(axisView, axisGroup, axisModel, gridModel, api) {
    var axis = axisModel.axis;
    if (axis.scale.isBlank()) {
      return;
    }
    var splitLineModel = axisModel.getModel("splitLine");
    var lineStyleModel = splitLineModel.getModel("lineStyle");
    var lineColors = lineStyleModel.get("color");
    var showMinLine = splitLineModel.get("showMinLine") !== false;
    var showMaxLine = splitLineModel.get("showMaxLine") !== false;
    lineColors = isArray(lineColors) ? lineColors : [lineColors];
    var gridRect = gridModel.coordinateSystem.getRect();
    var isHorizontal = axis.isHorizontal();
    var lineCount = 0;
    var ticksCoords = axis.getTicksCoords({
      tickModel: splitLineModel,
      breakTicks: "none",
      pruneByBreak: "preserve_extent_bound"
    });
    var p1 = [];
    var p2 = [];
    var lineStyle = lineStyleModel.getLineStyle();
    for (var i = 0; i < ticksCoords.length; i++) {
      var tickCoord = axis.toGlobalCoord(ticksCoords[i].coord);
      if (i === 0 && !showMinLine || i === ticksCoords.length - 1 && !showMaxLine) {
        continue;
      }
      var tickValue = ticksCoords[i].tickValue;
      if (isHorizontal) {
        p1[0] = tickCoord;
        p1[1] = gridRect.y;
        p2[0] = tickCoord;
        p2[1] = gridRect.y + gridRect.height;
      } else {
        p1[0] = gridRect.x;
        p1[1] = tickCoord;
        p2[0] = gridRect.x + gridRect.width;
        p2[1] = tickCoord;
      }
      var colorIndex = lineCount++ % lineColors.length;
      var line = new Line$1({
        anid: tickValue != null ? "line_" + tickValue : null,
        autoBatch: true,
        shape: {
          x1: p1[0],
          y1: p1[1],
          x2: p2[0],
          y2: p2[1]
        },
        style: defaults({
          stroke: lineColors[colorIndex]
        }, lineStyle),
        silent: true
      });
      subPixelOptimizeLine(line.shape, lineStyle.lineWidth);
      axisGroup.add(line);
    }
  },
  minorSplitLine: function(axisView, axisGroup, axisModel, gridModel, api) {
    var axis = axisModel.axis;
    var minorSplitLineModel = axisModel.getModel("minorSplitLine");
    var lineStyleModel = minorSplitLineModel.getModel("lineStyle");
    var gridRect = gridModel.coordinateSystem.getRect();
    var isHorizontal = axis.isHorizontal();
    var minorTicksCoords = axis.getMinorTicksCoords();
    if (!minorTicksCoords.length) {
      return;
    }
    var p1 = [];
    var p2 = [];
    var lineStyle = lineStyleModel.getLineStyle();
    for (var i = 0; i < minorTicksCoords.length; i++) {
      for (var k = 0; k < minorTicksCoords[i].length; k++) {
        var tickCoord = axis.toGlobalCoord(minorTicksCoords[i][k].coord);
        if (isHorizontal) {
          p1[0] = tickCoord;
          p1[1] = gridRect.y;
          p2[0] = tickCoord;
          p2[1] = gridRect.y + gridRect.height;
        } else {
          p1[0] = gridRect.x;
          p1[1] = tickCoord;
          p2[0] = gridRect.x + gridRect.width;
          p2[1] = tickCoord;
        }
        var line = new Line$1({
          anid: "minor_line_" + minorTicksCoords[i][k].tickValue,
          autoBatch: true,
          shape: {
            x1: p1[0],
            y1: p1[1],
            x2: p2[0],
            y2: p2[1]
          },
          style: lineStyle,
          silent: true
        });
        subPixelOptimizeLine(line.shape, lineStyle.lineWidth);
        axisGroup.add(line);
      }
    }
  },
  splitArea: function(axisView, axisGroup, axisModel, gridModel, api) {
    rectCoordAxisBuildSplitArea(axisView, axisGroup, axisModel, gridModel);
  },
  breakArea: function(axisView, axisGroup, axisModel, gridModel, api) {
    axisModel.axis.scale;
  }
};
var CartesianXAxisView = (
  /** @class */
  function(_super) {
    __extends(CartesianXAxisView2, _super);
    function CartesianXAxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = CartesianXAxisView2.type;
      return _this;
    }
    CartesianXAxisView2.type = "xAxis";
    return CartesianXAxisView2;
  }(CartesianAxisView)
);
var CartesianYAxisView = (
  /** @class */
  function(_super) {
    __extends(CartesianYAxisView2, _super);
    function CartesianYAxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = CartesianXAxisView.type;
      return _this;
    }
    CartesianYAxisView2.type = "yAxis";
    return CartesianYAxisView2;
  }(CartesianAxisView)
);
var GridView = (
  /** @class */
  function(_super) {
    __extends(GridView2, _super);
    function GridView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "grid";
      return _this;
    }
    GridView2.prototype.render = function(gridModel, ecModel) {
      this.group.removeAll();
      if (gridModel.get("show")) {
        this.group.add(new Rect({
          shape: gridModel.coordinateSystem.getRect(),
          style: defaults({
            fill: gridModel.get("backgroundColor")
          }, gridModel.getItemStyle()),
          silent: true,
          z2: -1
        }));
      }
    };
    GridView2.type = "grid";
    return GridView2;
  }(ComponentView)
);
var extraOption = {
  // gridIndex: 0,
  // gridId: '',
  offset: 0
};
function install$9(registers) {
  registers.registerComponentView(GridView);
  registers.registerComponentModel(GridModel);
  registers.registerCoordinateSystem("cartesian2d", Grid);
  axisModelCreator(registers, "x", CartesianAxisModel, extraOption);
  axisModelCreator(registers, "y", CartesianAxisModel, extraOption);
  registers.registerComponentView(CartesianXAxisView);
  registers.registerComponentView(CartesianYAxisView);
  registers.registerPreprocessor(function(option) {
    if (option.xAxis && option.yAxis && !option.grid) {
      option.grid = {};
    }
  });
}
var inner$5 = makeInner();
function isTaken(zr, resourceKey) {
  return !!inner$5(zr)[resourceKey];
}
registerAction({
  type: "takeGlobalCursor",
  event: "globalCursorTaken",
  update: "update"
}, noop);
var IRRELEVANT_EXCLUDES = {
  "axisPointer": 1,
  "tooltip": 1,
  "brush": 1
};
function onIrrelevantElement(e, api, targetComponent) {
  var eventElComponent = api.getComponentByElement(e.topTarget);
  if (!eventElComponent || eventElComponent === targetComponent || IRRELEVANT_EXCLUDES.hasOwnProperty(eventElComponent.mainType)) {
    return false;
  }
  var eventElCoordSys = eventElComponent.coordinateSystem;
  if (!eventElCoordSys || eventElCoordSys.model === targetComponent) {
    return false;
  }
  var eventElCmptZInfo = retrieveZInfo(eventElComponent);
  var targetCmptZInfo = retrieveZInfo(targetComponent);
  if ((eventElCmptZInfo.zlevel - targetCmptZInfo.zlevel || eventElCmptZInfo.z - targetCmptZInfo.z) <= 0) {
    return false;
  }
  return true;
}
var RoamController = (
  /** @class */
  function(_super) {
    __extends(RoamController2, _super);
    function RoamController2(zr) {
      var _this = _super.call(this) || this;
      _this._zr = zr;
      var mousedownHandler = bind$1(_this._mousedownHandler, _this);
      var mousemoveHandler = bind$1(_this._mousemoveHandler, _this);
      var mouseupHandler = bind$1(_this._mouseupHandler, _this);
      var mousewheelHandler = bind$1(_this._mousewheelHandler, _this);
      var pinchHandler = bind$1(_this._pinchHandler, _this);
      _this.enable = function(controlType, rawOpt) {
        var zInfo = rawOpt.zInfo;
        var _a2 = retrieveZInfo(zInfo.component), z = _a2.z, zlevel = _a2.zlevel;
        var zInfoParsed = {
          component: zInfo.component,
          z,
          zlevel,
          // By default roam controller is the lowest z2 comparing to other elememts in a component.
          z2: retrieve2(zInfo.z2, -Infinity)
        };
        var triggerInfo = extend({}, rawOpt.triggerInfo);
        this._opt = defaults(extend({}, rawOpt), {
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          // By default, wheel do not trigger move.
          moveOnMouseWheel: false,
          preventDefaultMouseMove: true,
          zInfoParsed,
          triggerInfo
        });
        if (controlType == null) {
          controlType = true;
        }
        if (!this._enabled || this._controlType !== controlType) {
          this._enabled = true;
          this.disable();
          if (controlType === true || controlType === "move" || controlType === "pan") {
            addRoamZrListener(zr, "mousedown", mousedownHandler, zInfoParsed);
            addRoamZrListener(zr, "mousemove", mousemoveHandler, zInfoParsed);
            addRoamZrListener(zr, "mouseup", mouseupHandler, zInfoParsed);
          }
          if (controlType === true || controlType === "scale" || controlType === "zoom") {
            addRoamZrListener(zr, "mousewheel", mousewheelHandler, zInfoParsed);
            addRoamZrListener(zr, "pinch", pinchHandler, zInfoParsed);
          }
        }
      };
      _this.disable = function() {
        this._enabled = false;
        removeRoamZrListener(zr, "mousedown", mousedownHandler);
        removeRoamZrListener(zr, "mousemove", mousemoveHandler);
        removeRoamZrListener(zr, "mouseup", mouseupHandler);
        removeRoamZrListener(zr, "mousewheel", mousewheelHandler);
        removeRoamZrListener(zr, "pinch", pinchHandler);
      };
      return _this;
    }
    RoamController2.prototype.isDragging = function() {
      return this._dragging;
    };
    RoamController2.prototype.isPinching = function() {
      return this._pinching;
    };
    RoamController2.prototype._checkPointer = function(e, x, y) {
      var opt = this._opt;
      var zInfoParsed = opt.zInfoParsed;
      if (onIrrelevantElement(e, opt.api, zInfoParsed.component)) {
        return false;
      }
      var triggerInfo = opt.triggerInfo;
      var roamTrigger = triggerInfo.roamTrigger;
      var inArea = false;
      if (roamTrigger === "global") {
        inArea = true;
      }
      if (!inArea) {
        inArea = triggerInfo.isInSelf(e, x, y);
      }
      if (inArea && triggerInfo.isInClip && !triggerInfo.isInClip(e, x, y)) {
        inArea = false;
      }
      return inArea;
    };
    RoamController2.prototype._decideCursorStyle = function(e, x, y, forReverse) {
      var target = e.target;
      if (!target && this._checkPointer(e, x, y)) {
        return "grab";
      }
      if (forReverse) {
        return target && target.cursor || "default";
      }
    };
    RoamController2.prototype.dispose = function() {
      this.disable();
    };
    RoamController2.prototype._mousedownHandler = function(e) {
      if (isMiddleOrRightButtonOnMouseUpDown(e) || eventConsumed(e)) {
        return;
      }
      var el = e.target;
      while (el) {
        if (el.draggable) {
          return;
        }
        el = el.__hostTarget || el.parent;
      }
      var x = e.offsetX;
      var y = e.offsetY;
      if (this._checkPointer(e, x, y)) {
        this._x = x;
        this._y = y;
        this._dragging = true;
      }
    };
    RoamController2.prototype._mousemoveHandler = function(e) {
      var zr = this._zr;
      if (e.gestureEvent === "pinch" || isTaken(zr, "globalPan") || eventConsumed(e)) {
        return;
      }
      var x = e.offsetX;
      var y = e.offsetY;
      if (!this._dragging || !isAvailableBehavior("moveOnMouseMove", e, this._opt)) {
        var cursorStyle = this._decideCursorStyle(e, x, y, false);
        if (cursorStyle) {
          zr.setCursorStyle(cursorStyle);
        }
        return;
      }
      zr.setCursorStyle("grabbing");
      var oldX = this._x;
      var oldY = this._y;
      var dx = x - oldX;
      var dy = y - oldY;
      this._x = x;
      this._y = y;
      if (this._opt.preventDefaultMouseMove) {
        stop(e.event);
      }
      e.__ecRoamConsumed = true;
      trigger(this, "pan", "moveOnMouseMove", e, {
        dx,
        dy,
        oldX,
        oldY,
        newX: x,
        newY: y,
        isAvailableBehavior: null
      });
    };
    RoamController2.prototype._mouseupHandler = function(e) {
      if (eventConsumed(e)) {
        return;
      }
      var zr = this._zr;
      if (!isMiddleOrRightButtonOnMouseUpDown(e)) {
        this._dragging = false;
        var cursorStyle = this._decideCursorStyle(e, e.offsetX, e.offsetY, true);
        if (cursorStyle) {
          zr.setCursorStyle(cursorStyle);
        }
      }
    };
    RoamController2.prototype._mousewheelHandler = function(e) {
      if (eventConsumed(e)) {
        return;
      }
      var shouldZoom = isAvailableBehavior("zoomOnMouseWheel", e, this._opt);
      var shouldMove = isAvailableBehavior("moveOnMouseWheel", e, this._opt);
      var wheelDelta = e.wheelDelta;
      var absWheelDeltaDelta = Math.abs(wheelDelta);
      var originX = e.offsetX;
      var originY = e.offsetY;
      if (wheelDelta === 0 || !shouldZoom && !shouldMove) {
        return;
      }
      if (shouldZoom) {
        var factor = absWheelDeltaDelta > 3 ? 1.4 : absWheelDeltaDelta > 1 ? 1.2 : 1.1;
        var scale2 = wheelDelta > 0 ? factor : 1 / factor;
        this._checkTriggerMoveZoom(this, "zoom", "zoomOnMouseWheel", e, {
          scale: scale2,
          originX,
          originY,
          isAvailableBehavior: null
        });
      }
      if (shouldMove) {
        var absDelta = Math.abs(wheelDelta);
        var scrollDelta = (wheelDelta > 0 ? 1 : -1) * (absDelta > 3 ? 0.4 : absDelta > 1 ? 0.15 : 0.05);
        this._checkTriggerMoveZoom(this, "scrollMove", "moveOnMouseWheel", e, {
          scrollDelta,
          originX,
          originY,
          isAvailableBehavior: null
        });
      }
    };
    RoamController2.prototype._pinchHandler = function(e) {
      if (isTaken(this._zr, "globalPan") || eventConsumed(e)) {
        return;
      }
      var scale2 = e.pinchScale > 1 ? 1.1 : 1 / 1.1;
      this._checkTriggerMoveZoom(this, "zoom", null, e, {
        scale: scale2,
        originX: e.pinchX,
        originY: e.pinchY,
        isAvailableBehavior: null
      });
    };
    RoamController2.prototype._checkTriggerMoveZoom = function(controller, eventName, behaviorToCheck, e, contollerEvent) {
      if (controller._checkPointer(e, contollerEvent.originX, contollerEvent.originY)) {
        stop(e.event);
        e.__ecRoamConsumed = true;
        trigger(controller, eventName, behaviorToCheck, e, contollerEvent);
      }
    };
    return RoamController2;
  }(Eventful)
);
function eventConsumed(e) {
  return e.__ecRoamConsumed;
}
var innerZrStore = makeInner();
function ensureZrStore(zr) {
  var store = innerZrStore(zr);
  store.roam = store.roam || {};
  store.uniform = store.uniform || {};
  return store;
}
function addRoamZrListener(zr, eventType, listener, zInfoParsed) {
  var store = ensureZrStore(zr);
  var roam = store.roam;
  var listenerList = roam[eventType] = roam[eventType] || [];
  var idx = 0;
  for (; idx < listenerList.length; idx++) {
    var currZInfo = listenerList[idx].zInfoParsed;
    if ((currZInfo.zlevel - zInfoParsed.zlevel || currZInfo.z - zInfoParsed.z || currZInfo.z2 - zInfoParsed.z2) <= 0) {
      break;
    }
  }
  listenerList.splice(idx, 0, {
    listener,
    zInfoParsed
  });
  ensureUniformListener(zr, eventType);
}
function removeRoamZrListener(zr, eventType, listener) {
  var store = ensureZrStore(zr);
  var listenerList = store.roam[eventType] || [];
  for (var idx = 0; idx < listenerList.length; idx++) {
    if (listenerList[idx].listener === listener) {
      listenerList.splice(idx, 1);
      if (!listenerList.length) {
        removeUniformListener(zr, eventType);
      }
      return;
    }
  }
}
function ensureUniformListener(zr, eventType) {
  var store = ensureZrStore(zr);
  if (!store.uniform[eventType]) {
    zr.on(eventType, store.uniform[eventType] = function(event) {
      var listenerList = store.roam[eventType];
      if (listenerList) {
        for (var i = 0; i < listenerList.length; i++) {
          listenerList[i].listener(event);
        }
      }
    });
  }
}
function removeUniformListener(zr, eventType) {
  var store = ensureZrStore(zr);
  var uniform = store.uniform;
  if (uniform[eventType]) {
    zr.off(eventType, uniform[eventType]);
    uniform[eventType] = null;
  }
}
function trigger(controller, eventName, behaviorToCheck, e, contollerEvent) {
  contollerEvent.isAvailableBehavior = bind$1(isAvailableBehavior, null, behaviorToCheck, e);
  controller.trigger(eventName, contollerEvent);
}
function isAvailableBehavior(behaviorToCheck, e, settings) {
  var setting = settings[behaviorToCheck];
  return !behaviorToCheck || setting && (!isString(setting) || e.event[setting + "Key"]);
}
function updateViewOnPan(controllerHost, dx, dy) {
  var target = controllerHost.target;
  target.x += dx;
  target.y += dy;
  target.dirty();
}
function updateViewOnZoom(controllerHost, zoomDelta, zoomX, zoomY) {
  var target = controllerHost.target;
  var zoomLimit = controllerHost.zoomLimit;
  var newZoom = controllerHost.zoom = controllerHost.zoom || 1;
  newZoom *= zoomDelta;
  newZoom = clampByZoomLimit(newZoom, zoomLimit);
  var zoomScale = newZoom / controllerHost.zoom;
  controllerHost.zoom = newZoom;
  zoomTransformableByOrigin(target, zoomX, zoomY, zoomScale);
  target.dirty();
}
function getCenterCoord(view, point) {
  return view.pointToProjected ? view.pointToProjected(point) : view.pointToData(point);
}
function updateCenterAndZoomInAction(view, payload, zoomLimit) {
  var previousZoom = view.getZoom();
  var center = view.getCenter();
  var deltaZoom = payload.zoom;
  var point = view.projectedToPoint ? view.projectedToPoint(center) : view.dataToPoint(center);
  if (payload.dx != null && payload.dy != null) {
    point[0] -= payload.dx;
    point[1] -= payload.dy;
    view.setCenter(getCenterCoord(view, point));
  }
  if (deltaZoom != null) {
    deltaZoom = clampByZoomLimit(previousZoom * deltaZoom, zoomLimit) / previousZoom;
    zoomTransformableByOrigin(view, payload.originX, payload.originY, deltaZoom);
    view.updateTransform();
    view.setCenter(getCenterCoord(view, point));
    view.setZoom(deltaZoom * previousZoom);
  }
  return {
    center: view.getCenter(),
    zoom: view.getZoom()
  };
}
function zoomTransformableByOrigin(target, originX, originY, deltaZoom) {
  target.x -= (originX - target.x) * (deltaZoom - 1);
  target.y -= (originY - target.y) * (deltaZoom - 1);
  target.scaleX *= deltaZoom;
  target.scaleY *= deltaZoom;
}
function clampByZoomLimit(zoom, zoomLimit) {
  if (zoomLimit) {
    var zoomMin = zoomLimit.min || 0;
    var zoomMax = zoomLimit.max || Infinity;
    zoom = Math.max(Math.min(zoomMax, zoom), zoomMin);
  }
  return zoom;
}
var v2ApplyTransform = applyTransform$1;
var View = (
  /** @class */
  function(_super) {
    __extends(View2, _super);
    function View2(name, opt) {
      var _this = _super.call(this) || this;
      _this.type = "view";
      _this.dimensions = ["x", "y"];
      _this._roamTransformable = new Transformable();
      _this._rawTransformable = new Transformable();
      _this.name = name;
      _this._opt = opt;
      return _this;
    }
    View2.prototype.setBoundingRect = function(x, y, width, height) {
      this._rect = new BoundingRect(x, y, width, height);
      this._updateCenterAndZoom();
      return this._rect;
    };
    View2.prototype.getBoundingRect = function() {
      return this._rect;
    };
    View2.prototype.setViewRect = function(x, y, width, height) {
      this._transformTo(x, y, width, height);
      this._viewRect = new BoundingRect(x, y, width, height);
    };
    View2.prototype._transformTo = function(x, y, width, height) {
      var rect = this.getBoundingRect();
      var rawTransform = this._rawTransformable;
      rawTransform.transform = rect.calculateTransform(new BoundingRect(x, y, width, height));
      var rawParent = rawTransform.parent;
      rawTransform.parent = null;
      rawTransform.decomposeTransform();
      rawTransform.parent = rawParent;
      this._updateTransform();
    };
    View2.prototype.setCenter = function(centerCoord) {
      var opt = this._opt;
      if (opt && opt.api && opt.ecModel && opt.ecModel.getShallow("legacyViewCoordSysCenterBase") && centerCoord) {
        centerCoord = [parsePercent(centerCoord[0], opt.api.getWidth()), parsePercent(centerCoord[1], opt.api.getWidth())];
      }
      this._centerOption = clone$1(centerCoord);
      this._updateCenterAndZoom();
    };
    View2.prototype.setZoom = function(zoom) {
      this._zoom = clampByZoomLimit(zoom || 1, this.zoomLimit);
      this._updateCenterAndZoom();
    };
    View2.prototype.getDefaultCenter = function() {
      var rawRect = this.getBoundingRect();
      var cx = rawRect.x + rawRect.width / 2;
      var cy = rawRect.y + rawRect.height / 2;
      return [cx, cy];
    };
    View2.prototype.getCenter = function() {
      return this._center || this.getDefaultCenter();
    };
    View2.prototype.getZoom = function() {
      return this._zoom || 1;
    };
    View2.prototype.getRoamTransform = function() {
      return this._roamTransformable.getLocalTransform();
    };
    View2.prototype._updateCenterAndZoom = function() {
      var centerOption = this._centerOption;
      var rect = this._rect;
      if (centerOption && rect) {
        this._center = [parsePercent(centerOption[0], rect.width, rect.x), parsePercent(centerOption[1], rect.height, rect.y)];
      }
      var rawTransformMatrix = this._rawTransformable.getLocalTransform();
      var roamTransform = this._roamTransformable;
      var defaultCenter = this.getDefaultCenter();
      var center = this.getCenter();
      var zoom = this.getZoom();
      center = applyTransform$1([], center, rawTransformMatrix);
      defaultCenter = applyTransform$1([], defaultCenter, rawTransformMatrix);
      roamTransform.originX = center[0];
      roamTransform.originY = center[1];
      roamTransform.x = defaultCenter[0] - center[0];
      roamTransform.y = defaultCenter[1] - center[1];
      roamTransform.scaleX = roamTransform.scaleY = zoom;
      this._updateTransform();
    };
    View2.prototype._updateTransform = function() {
      var roamTransformable = this._roamTransformable;
      var rawTransformable = this._rawTransformable;
      rawTransformable.parent = roamTransformable;
      roamTransformable.updateTransform();
      rawTransformable.updateTransform();
      copy(this.transform || (this.transform = []), rawTransformable.transform || create());
      this._rawTransform = rawTransformable.getLocalTransform();
      this.invTransform = this.invTransform || [];
      invert(this.invTransform, this.transform);
      this.decomposeTransform();
    };
    View2.prototype.getTransformInfo = function() {
      var rawTransformable = this._rawTransformable;
      var roamTransformable = this._roamTransformable;
      var dummyTransformable = new Transformable();
      dummyTransformable.transform = roamTransformable.transform;
      dummyTransformable.decomposeTransform();
      return {
        roam: {
          x: dummyTransformable.x,
          y: dummyTransformable.y,
          scaleX: dummyTransformable.scaleX,
          scaleY: dummyTransformable.scaleY
        },
        raw: {
          x: rawTransformable.x,
          y: rawTransformable.y,
          scaleX: rawTransformable.scaleX,
          scaleY: rawTransformable.scaleY
        }
      };
    };
    View2.prototype.getViewRect = function() {
      return this._viewRect;
    };
    View2.prototype.getViewRectAfterRoam = function() {
      var rect = this.getBoundingRect().clone();
      rect.applyTransform(this.transform);
      return rect;
    };
    View2.prototype.dataToPoint = function(data, noRoam, out) {
      var transform = noRoam ? this._rawTransform : this.transform;
      out = out || [];
      return transform ? v2ApplyTransform(out, data, transform) : copy$1(out, data);
    };
    View2.prototype.pointToData = function(point, reserved, out) {
      out = out || [];
      var invTransform = this.invTransform;
      return invTransform ? v2ApplyTransform(out, point, invTransform) : (out[0] = point[0], out[1] = point[1], out);
    };
    View2.prototype.convertToPixel = function(ecModel, finder, value) {
      var coordSys = getCoordSys(finder);
      return coordSys === this ? coordSys.dataToPoint(value) : null;
    };
    View2.prototype.convertFromPixel = function(ecModel, finder, pixel) {
      var coordSys = getCoordSys(finder);
      return coordSys === this ? coordSys.pointToData(pixel) : null;
    };
    View2.prototype.containPoint = function(point) {
      return this.getViewRectAfterRoam().contain(point[0], point[1]);
    };
    View2.dimensions = ["x", "y"];
    return View2;
  }(Transformable)
);
function getCoordSys(finder) {
  var seriesModel = finder.seriesModel;
  return seriesModel ? seriesModel.coordinateSystem : null;
}
var inner$4 = makeInner();
function linkSeriesData(opt) {
  var mainData = opt.mainData;
  var datas = opt.datas;
  if (!datas) {
    datas = {
      main: mainData
    };
    opt.datasAttr = {
      main: "data"
    };
  }
  opt.datas = opt.mainData = null;
  linkAll(mainData, datas, opt);
  each$4(datas, function(data) {
    each$4(mainData.TRANSFERABLE_METHODS, function(methodName) {
      data.wrapMethod(methodName, curry$1(transferInjection, opt));
    });
  });
  mainData.wrapMethod("cloneShallow", curry$1(cloneShallowInjection, opt));
  each$4(mainData.CHANGABLE_METHODS, function(methodName) {
    mainData.wrapMethod(methodName, curry$1(changeInjection, opt));
  });
  assert(datas[mainData.dataType] === mainData);
}
function transferInjection(opt, res) {
  if (isMainData(this)) {
    var datas = extend({}, inner$4(this).datas);
    datas[this.dataType] = res;
    linkAll(res, datas, opt);
  } else {
    linkSingle(res, this.dataType, inner$4(this).mainData, opt);
  }
  return res;
}
function changeInjection(opt, res) {
  opt.struct && opt.struct.update();
  return res;
}
function cloneShallowInjection(opt, res) {
  each$4(inner$4(res).datas, function(data, dataType) {
    data !== res && linkSingle(data.cloneShallow(), dataType, res, opt);
  });
  return res;
}
function getLinkedData(dataType) {
  var mainData = inner$4(this).mainData;
  return dataType == null || mainData == null ? mainData : inner$4(mainData).datas[dataType];
}
function getLinkedDataAll() {
  var mainData = inner$4(this).mainData;
  return mainData == null ? [{
    data: mainData
  }] : map$1(keys(inner$4(mainData).datas), function(type) {
    return {
      type,
      data: inner$4(mainData).datas[type]
    };
  });
}
function isMainData(data) {
  return inner$4(data).mainData === data;
}
function linkAll(mainData, datas, opt) {
  inner$4(mainData).datas = {};
  each$4(datas, function(data, dataType) {
    linkSingle(data, dataType, mainData, opt);
  });
}
function linkSingle(data, dataType, mainData, opt) {
  inner$4(mainData).datas[dataType] = data;
  inner$4(data).mainData = mainData;
  data.dataType = dataType;
  if (opt.struct) {
    data[opt.structAttr] = opt.struct;
    opt.struct[opt.datasAttr[dataType]] = data;
  }
  data.getLinkedData = getLinkedData;
  data.getLinkedDataAll = getLinkedDataAll;
}
function categoryFilter(ecModel) {
  var legendModels = ecModel.findComponents({
    mainType: "legend"
  });
  if (!legendModels || !legendModels.length) {
    return;
  }
  ecModel.eachSeriesByType("graph", function(graphSeries) {
    var categoriesData = graphSeries.getCategoriesData();
    var graph = graphSeries.getGraph();
    var data = graph.data;
    var categoryNames = categoriesData.mapArray(categoriesData.getName);
    data.filterSelf(function(idx) {
      var model = data.getItemModel(idx);
      var category = model.getShallow("category");
      if (category != null) {
        if (isNumber(category)) {
          category = categoryNames[category];
        }
        for (var i = 0; i < legendModels.length; i++) {
          if (!legendModels[i].isSelected(category)) {
            return false;
          }
        }
      }
      return true;
    });
  });
}
function categoryVisual(ecModel) {
  var paletteScope = {};
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    var categoriesData = seriesModel.getCategoriesData();
    var data = seriesModel.getData();
    var categoryNameIdxMap = {};
    categoriesData.each(function(idx) {
      var name = categoriesData.getName(idx);
      categoryNameIdxMap["ec-" + name] = idx;
      var itemModel = categoriesData.getItemModel(idx);
      var style = itemModel.getModel("itemStyle").getItemStyle();
      if (!style.fill) {
        style.fill = seriesModel.getColorFromPalette(name, paletteScope);
      }
      categoriesData.setItemVisual(idx, "style", style);
      var symbolVisualList = ["symbol", "symbolSize", "symbolKeepAspect"];
      for (var i = 0; i < symbolVisualList.length; i++) {
        var symbolVisual = itemModel.getShallow(symbolVisualList[i], true);
        if (symbolVisual != null) {
          categoriesData.setItemVisual(idx, symbolVisualList[i], symbolVisual);
        }
      }
    });
    if (categoriesData.count()) {
      data.each(function(idx) {
        var model = data.getItemModel(idx);
        var categoryIdx = model.getShallow("category");
        if (categoryIdx != null) {
          if (isString(categoryIdx)) {
            categoryIdx = categoryNameIdxMap["ec-" + categoryIdx];
          }
          var categoryStyle = categoriesData.getItemVisual(categoryIdx, "style");
          var style = data.ensureUniqueItemVisual(idx, "style");
          extend(style, categoryStyle);
          var visualList = ["symbol", "symbolSize", "symbolKeepAspect"];
          for (var i = 0; i < visualList.length; i++) {
            data.setItemVisual(idx, visualList[i], categoriesData.getItemVisual(categoryIdx, visualList[i]));
          }
        }
      });
    }
  });
}
function normalize(a) {
  if (!(a instanceof Array)) {
    a = [a, a];
  }
  return a;
}
function graphEdgeVisual(ecModel) {
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    var graph = seriesModel.getGraph();
    var edgeData = seriesModel.getEdgeData();
    var symbolType = normalize(seriesModel.get("edgeSymbol"));
    var symbolSize = normalize(seriesModel.get("edgeSymbolSize"));
    edgeData.setVisual("fromSymbol", symbolType && symbolType[0]);
    edgeData.setVisual("toSymbol", symbolType && symbolType[1]);
    edgeData.setVisual("fromSymbolSize", symbolSize && symbolSize[0]);
    edgeData.setVisual("toSymbolSize", symbolSize && symbolSize[1]);
    edgeData.setVisual("style", seriesModel.getModel("lineStyle").getLineStyle());
    edgeData.each(function(idx) {
      var itemModel = edgeData.getItemModel(idx);
      var edge = graph.getEdgeByIndex(idx);
      var symbolType2 = normalize(itemModel.getShallow("symbol", true));
      var symbolSize2 = normalize(itemModel.getShallow("symbolSize", true));
      var style = itemModel.getModel("lineStyle").getLineStyle();
      var existsStyle = edgeData.ensureUniqueItemVisual(idx, "style");
      extend(existsStyle, style);
      switch (existsStyle.stroke) {
        case "source": {
          var nodeStyle = edge.node1.getVisual("style");
          existsStyle.stroke = nodeStyle && nodeStyle.fill;
          break;
        }
        case "target": {
          var nodeStyle = edge.node2.getVisual("style");
          existsStyle.stroke = nodeStyle && nodeStyle.fill;
          break;
        }
      }
      symbolType2[0] && edge.setVisual("fromSymbol", symbolType2[0]);
      symbolType2[1] && edge.setVisual("toSymbol", symbolType2[1]);
      symbolSize2[0] && edge.setVisual("fromSymbolSize", symbolSize2[0]);
      symbolSize2[1] && edge.setVisual("toSymbolSize", symbolSize2[1]);
    });
  });
}
var KEY_DELIMITER = "-->";
var getAutoCurvenessParams = function(seriesModel) {
  return seriesModel.get("autoCurveness") || null;
};
var createCurveness = function(seriesModel, appendLength) {
  var autoCurvenessParmas = getAutoCurvenessParams(seriesModel);
  var length = 20;
  var curvenessList = [];
  if (isNumber(autoCurvenessParmas)) {
    length = autoCurvenessParmas;
  } else if (isArray(autoCurvenessParmas)) {
    seriesModel.__curvenessList = autoCurvenessParmas;
    return;
  }
  if (appendLength > length) {
    length = appendLength;
  }
  var len2 = length % 2 ? length + 2 : length + 3;
  curvenessList = [];
  for (var i = 0; i < len2; i++) {
    curvenessList.push((i % 2 ? i + 1 : i) / 10 * (i % 2 ? -1 : 1));
  }
  seriesModel.__curvenessList = curvenessList;
};
var getKeyOfEdges = function(n1, n2, seriesModel) {
  var source = [n1.id, n1.dataIndex].join(".");
  var target = [n2.id, n2.dataIndex].join(".");
  return [seriesModel.uid, source, target].join(KEY_DELIMITER);
};
var getOppositeKey = function(key) {
  var keys2 = key.split(KEY_DELIMITER);
  return [keys2[0], keys2[2], keys2[1]].join(KEY_DELIMITER);
};
var getEdgeFromMap = function(edge, seriesModel) {
  var key = getKeyOfEdges(edge.node1, edge.node2, seriesModel);
  return seriesModel.__edgeMap[key];
};
var getTotalLengthBetweenNodes = function(edge, seriesModel) {
  var len2 = getEdgeMapLengthWithKey(getKeyOfEdges(edge.node1, edge.node2, seriesModel), seriesModel);
  var lenV = getEdgeMapLengthWithKey(getKeyOfEdges(edge.node2, edge.node1, seriesModel), seriesModel);
  return len2 + lenV;
};
var getEdgeMapLengthWithKey = function(key, seriesModel) {
  var edgeMap = seriesModel.__edgeMap;
  return edgeMap[key] ? edgeMap[key].length : 0;
};
function initCurvenessList(seriesModel) {
  if (!getAutoCurvenessParams(seriesModel)) {
    return;
  }
  seriesModel.__curvenessList = [];
  seriesModel.__edgeMap = {};
  createCurveness(seriesModel);
}
function createEdgeMapForCurveness(n1, n2, seriesModel, index) {
  if (!getAutoCurvenessParams(seriesModel)) {
    return;
  }
  var key = getKeyOfEdges(n1, n2, seriesModel);
  var edgeMap = seriesModel.__edgeMap;
  var oppositeEdges = edgeMap[getOppositeKey(key)];
  if (edgeMap[key] && !oppositeEdges) {
    edgeMap[key].isForward = true;
  } else if (oppositeEdges && edgeMap[key]) {
    oppositeEdges.isForward = true;
    edgeMap[key].isForward = false;
  }
  edgeMap[key] = edgeMap[key] || [];
  edgeMap[key].push(index);
}
function getCurvenessForEdge(edge, seriesModel, index, needReverse) {
  var autoCurvenessParams = getAutoCurvenessParams(seriesModel);
  var isArrayParam = isArray(autoCurvenessParams);
  if (!autoCurvenessParams) {
    return null;
  }
  var edgeArray = getEdgeFromMap(edge, seriesModel);
  if (!edgeArray) {
    return null;
  }
  var edgeIndex = -1;
  for (var i = 0; i < edgeArray.length; i++) {
    if (edgeArray[i] === index) {
      edgeIndex = i;
      break;
    }
  }
  var totalLen = getTotalLengthBetweenNodes(edge, seriesModel);
  createCurveness(seriesModel, totalLen);
  edge.lineStyle = edge.lineStyle || {};
  var curKey = getKeyOfEdges(edge.node1, edge.node2, seriesModel);
  var curvenessList = seriesModel.__curvenessList;
  var parityCorrection = isArrayParam ? 0 : totalLen % 2 ? 0 : 1;
  if (!edgeArray.isForward) {
    var oppositeKey = getOppositeKey(curKey);
    var len2 = getEdgeMapLengthWithKey(oppositeKey, seriesModel);
    var resValue = curvenessList[edgeIndex + len2 + parityCorrection];
    if (needReverse) {
      if (isArrayParam) {
        if (autoCurvenessParams && autoCurvenessParams[0] === 0) {
          return (len2 + parityCorrection) % 2 ? resValue : -resValue;
        } else {
          return ((len2 % 2 ? 0 : 1) + parityCorrection) % 2 ? resValue : -resValue;
        }
      } else {
        return (len2 + parityCorrection) % 2 ? resValue : -resValue;
      }
    } else {
      return curvenessList[edgeIndex + len2 + parityCorrection];
    }
  } else {
    return curvenessList[parityCorrection + edgeIndex];
  }
}
function simpleLayout(seriesModel) {
  var coordSys = seriesModel.coordinateSystem;
  if (coordSys && coordSys.type !== "view") {
    return;
  }
  var graph = seriesModel.getGraph();
  graph.eachNode(function(node) {
    var model = node.getModel();
    node.setLayout([+model.get("x"), +model.get("y")]);
  });
  simpleLayoutEdge(graph, seriesModel);
}
function simpleLayoutEdge(graph, seriesModel) {
  graph.eachEdge(function(edge, index) {
    var curveness = retrieve3(edge.getModel().get(["lineStyle", "curveness"]), -getCurvenessForEdge(edge, seriesModel, index, true), 0);
    var p1 = clone$2(edge.node1.getLayout());
    var p2 = clone$2(edge.node2.getLayout());
    var points = [p1, p2];
    if (+curveness) {
      points.push([(p1[0] + p2[0]) / 2 - (p1[1] - p2[1]) * curveness, (p1[1] + p2[1]) / 2 - (p2[0] - p1[0]) * curveness]);
    }
    edge.setLayout(points);
  });
}
function graphSimpleLayout(ecModel, api) {
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    var layout2 = seriesModel.get("layout");
    var coordSys = seriesModel.coordinateSystem;
    if (coordSys && coordSys.type !== "view") {
      var data_1 = seriesModel.getData();
      var dimensions_1 = [];
      each$4(coordSys.dimensions, function(coordDim) {
        dimensions_1 = dimensions_1.concat(data_1.mapDimensionsAll(coordDim));
      });
      for (var dataIndex = 0; dataIndex < data_1.count(); dataIndex++) {
        var value = [];
        var hasValue = false;
        for (var i = 0; i < dimensions_1.length; i++) {
          var val = data_1.get(dimensions_1[i], dataIndex);
          if (!isNaN(val)) {
            hasValue = true;
          }
          value.push(val);
        }
        if (hasValue) {
          data_1.setItemLayout(dataIndex, coordSys.dataToPoint(value));
        } else {
          data_1.setItemLayout(dataIndex, [NaN, NaN]);
        }
      }
      simpleLayoutEdge(data_1.graph, seriesModel);
    } else if (!layout2 || layout2 === "none") {
      simpleLayout(seriesModel);
    }
  });
}
function getNodeGlobalScale(seriesModel) {
  var coordSys = seriesModel.coordinateSystem;
  if (coordSys.type !== "view") {
    return 1;
  }
  var nodeScaleRatio = seriesModel.option.nodeScaleRatio;
  var groupZoom = coordSys.scaleX;
  var roamZoom = coordSys.getZoom();
  var nodeScale = (roamZoom - 1) * nodeScaleRatio + 1;
  return nodeScale / groupZoom;
}
function getSymbolSize(node) {
  var symbolSize = node.getVisual("symbolSize");
  if (symbolSize instanceof Array) {
    symbolSize = (symbolSize[0] + symbolSize[1]) / 2;
  }
  return +symbolSize;
}
var PI = Math.PI;
var _symbolRadiansHalf = [];
function circularLayout(seriesModel, basedOn, draggingNode, pointer) {
  var coordSys = seriesModel.coordinateSystem;
  if (coordSys && coordSys.type !== "view") {
    return;
  }
  var rect = coordSys.getBoundingRect();
  var nodeData = seriesModel.getData();
  var graph = nodeData.graph;
  var cx = rect.width / 2 + rect.x;
  var cy = rect.height / 2 + rect.y;
  var r = Math.min(rect.width, rect.height) / 2;
  var count = nodeData.count();
  nodeData.setLayout({
    cx,
    cy
  });
  if (!count) {
    return;
  }
  if (draggingNode) {
    var _a2 = coordSys.pointToData(pointer), tempX = _a2[0], tempY = _a2[1];
    var v = [tempX - cx, tempY - cy];
    normalize$2(v, v);
    scale$1(v, v, r);
    draggingNode.setLayout([cx + v[0], cy + v[1]], true);
    var circularRotateLabel = seriesModel.get(["circular", "rotateLabel"]);
    rotateNodeLabel(draggingNode, circularRotateLabel, cx, cy);
  }
  _layoutNodesBasedOn[basedOn](seriesModel, graph, nodeData, r, cx, cy, count);
  graph.eachEdge(function(edge, index) {
    var curveness = retrieve3(edge.getModel().get(["lineStyle", "curveness"]), getCurvenessForEdge(edge, seriesModel, index), 0);
    var p1 = clone$2(edge.node1.getLayout());
    var p2 = clone$2(edge.node2.getLayout());
    var cp1;
    var x12 = (p1[0] + p2[0]) / 2;
    var y12 = (p1[1] + p2[1]) / 2;
    if (+curveness) {
      curveness *= 3;
      cp1 = [cx * curveness + x12 * (1 - curveness), cy * curveness + y12 * (1 - curveness)];
    }
    edge.setLayout([p1, p2, cp1]);
  });
}
var _layoutNodesBasedOn = {
  value: function(seriesModel, graph, nodeData, r, cx, cy, count) {
    var angle = 0;
    var sum = nodeData.getSum("value");
    var unitAngle = Math.PI * 2 / (sum || count);
    graph.eachNode(function(node) {
      var value = node.getValue("value");
      var radianHalf = unitAngle * (sum ? value : 1) / 2;
      angle += radianHalf;
      node.setLayout([r * Math.cos(angle) + cx, r * Math.sin(angle) + cy]);
      angle += radianHalf;
    });
  },
  symbolSize: function(seriesModel, graph, nodeData, r, cx, cy, count) {
    var sumRadian = 0;
    _symbolRadiansHalf.length = count;
    var nodeScale = getNodeGlobalScale(seriesModel);
    graph.eachNode(function(node) {
      var symbolSize = getSymbolSize(node);
      isNaN(symbolSize) && (symbolSize = 2);
      symbolSize < 0 && (symbolSize = 0);
      symbolSize *= nodeScale;
      var symbolRadianHalf = Math.asin(symbolSize / 2 / r);
      isNaN(symbolRadianHalf) && (symbolRadianHalf = PI / 2);
      _symbolRadiansHalf[node.dataIndex] = symbolRadianHalf;
      sumRadian += symbolRadianHalf * 2;
    });
    var halfRemainRadian = (2 * PI - sumRadian) / count / 2;
    var angle = 0;
    graph.eachNode(function(node) {
      var radianHalf = halfRemainRadian + _symbolRadiansHalf[node.dataIndex];
      angle += radianHalf;
      (!node.getLayout() || !node.getLayout().fixed) && node.setLayout([r * Math.cos(angle) + cx, r * Math.sin(angle) + cy]);
      angle += radianHalf;
    });
  }
};
function rotateNodeLabel(node, circularRotateLabel, cx, cy) {
  var el = node.getGraphicEl();
  if (!el) {
    return;
  }
  var nodeModel = node.getModel();
  var labelRotate = nodeModel.get(["label", "rotate"]) || 0;
  var symbolPath = el.getSymbolPath();
  if (circularRotateLabel) {
    var pos = node.getLayout();
    var rad = Math.atan2(pos[1] - cy, pos[0] - cx);
    if (rad < 0) {
      rad = Math.PI * 2 + rad;
    }
    var isLeft = pos[0] < cx;
    if (isLeft) {
      rad = rad - Math.PI;
    }
    var textPosition = isLeft ? "left" : "right";
    symbolPath.setTextConfig({
      rotation: -rad,
      position: textPosition,
      origin: "center"
    });
    var emphasisState = symbolPath.ensureState("emphasis");
    extend(emphasisState.textConfig || (emphasisState.textConfig = {}), {
      position: textPosition
    });
  } else {
    symbolPath.setTextConfig({
      rotation: labelRotate *= Math.PI / 180
    });
  }
}
function graphCircularLayout(ecModel) {
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    if (seriesModel.get("layout") === "circular") {
      circularLayout(seriesModel, "symbolSize");
    }
  });
}
var scaleAndAdd = scaleAndAdd$1;
function forceLayout(inNodes, inEdges, opts) {
  var nodes = inNodes;
  var edges = inEdges;
  var rect = opts.rect;
  var width = rect.width;
  var height = rect.height;
  var center = [rect.x + width / 2, rect.y + height / 2];
  var gravity = opts.gravity == null ? 0.1 : opts.gravity;
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    if (!n.p) {
      n.p = create$1(width * (Math.random() - 0.5) + center[0], height * (Math.random() - 0.5) + center[1]);
    }
    n.pp = clone$2(n.p);
    n.edges = null;
  }
  var initialFriction = opts.friction == null ? 0.6 : opts.friction;
  var friction = initialFriction;
  var beforeStepCallback;
  var afterStepCallback;
  return {
    warmUp: function() {
      friction = initialFriction * 0.8;
    },
    setFixed: function(idx) {
      nodes[idx].fixed = true;
    },
    setUnfixed: function(idx) {
      nodes[idx].fixed = false;
    },
    /**
     * Before step hook
     */
    beforeStep: function(cb) {
      beforeStepCallback = cb;
    },
    /**
     * After step hook
     */
    afterStep: function(cb) {
      afterStepCallback = cb;
    },
    /**
     * Some formulas were originally copied from "d3.js"
     * https://github.com/d3/d3/blob/b516d77fb8566b576088e73410437494717ada26/src/layout/force.js
     * with some modifications made for this project.
     * See the license statement at the head of this file.
     */
    step: function(cb) {
      beforeStepCallback && beforeStepCallback(nodes, edges);
      var v12 = [];
      var nLen = nodes.length;
      for (var i2 = 0; i2 < edges.length; i2++) {
        var e = edges[i2];
        if (e.ignoreForceLayout) {
          continue;
        }
        var n1 = e.n1;
        var n2 = e.n2;
        sub(v12, n2.p, n1.p);
        var d = len(v12) - e.d;
        var w = n2.w / (n1.w + n2.w);
        if (isNaN(w)) {
          w = 0;
        }
        normalize$2(v12, v12);
        !n1.fixed && scaleAndAdd(n1.p, n1.p, v12, w * d * friction);
        !n2.fixed && scaleAndAdd(n2.p, n2.p, v12, -(1 - w) * d * friction);
      }
      for (var i2 = 0; i2 < nLen; i2++) {
        var n3 = nodes[i2];
        if (!n3.fixed) {
          sub(v12, center, n3.p);
          scaleAndAdd(n3.p, n3.p, v12, gravity * friction);
        }
      }
      for (var i2 = 0; i2 < nLen; i2++) {
        var n1 = nodes[i2];
        for (var j = i2 + 1; j < nLen; j++) {
          var n2 = nodes[j];
          sub(v12, n2.p, n1.p);
          var d = len(v12);
          if (d === 0) {
            set$1(v12, Math.random() - 0.5, Math.random() - 0.5);
            d = 1;
          }
          var repFact = (n1.rep + n2.rep) / d / d;
          !n1.fixed && scaleAndAdd(n1.pp, n1.pp, v12, repFact);
          !n2.fixed && scaleAndAdd(n2.pp, n2.pp, v12, -repFact);
        }
      }
      var v = [];
      for (var i2 = 0; i2 < nLen; i2++) {
        var n3 = nodes[i2];
        if (!n3.fixed) {
          sub(v, n3.p, n3.pp);
          scaleAndAdd(n3.p, n3.p, v, friction);
          copy$1(n3.pp, n3.p);
        }
      }
      friction = friction * 0.992;
      var finished = friction < 0.01;
      afterStepCallback && afterStepCallback(nodes, edges, finished);
      cb && cb(finished);
    }
  };
}
function graphForceLayout(ecModel) {
  ecModel.eachSeriesByType("graph", function(graphSeries) {
    var coordSys = graphSeries.coordinateSystem;
    if (coordSys && coordSys.type !== "view") {
      return;
    }
    if (graphSeries.get("layout") === "force") {
      var preservedPoints_1 = graphSeries.preservedPoints || {};
      var graph_1 = graphSeries.getGraph();
      var nodeData_1 = graph_1.data;
      var edgeData = graph_1.edgeData;
      var forceModel = graphSeries.getModel("force");
      var initLayout = forceModel.get("initLayout");
      if (graphSeries.preservedPoints) {
        nodeData_1.each(function(idx) {
          var id = nodeData_1.getId(idx);
          nodeData_1.setItemLayout(idx, preservedPoints_1[id] || [NaN, NaN]);
        });
      } else if (!initLayout || initLayout === "none") {
        simpleLayout(graphSeries);
      } else if (initLayout === "circular") {
        circularLayout(graphSeries, "value");
      }
      var nodeDataExtent_1 = nodeData_1.getDataExtent("value");
      var edgeDataExtent_1 = edgeData.getDataExtent("value");
      var repulsion = forceModel.get("repulsion");
      var edgeLength = forceModel.get("edgeLength");
      var repulsionArr_1 = isArray(repulsion) ? repulsion : [repulsion, repulsion];
      var edgeLengthArr_1 = isArray(edgeLength) ? edgeLength : [edgeLength, edgeLength];
      edgeLengthArr_1 = [edgeLengthArr_1[1], edgeLengthArr_1[0]];
      var nodes_1 = nodeData_1.mapArray("value", function(value, idx) {
        var point = nodeData_1.getItemLayout(idx);
        var rep = linearMap(value, nodeDataExtent_1, repulsionArr_1);
        if (isNaN(rep)) {
          rep = (repulsionArr_1[0] + repulsionArr_1[1]) / 2;
        }
        return {
          w: rep,
          rep,
          fixed: nodeData_1.getItemModel(idx).get("fixed"),
          p: !point || isNaN(point[0]) || isNaN(point[1]) ? null : point
        };
      });
      var edges = edgeData.mapArray("value", function(value, idx) {
        var edge = graph_1.getEdgeByIndex(idx);
        var d = linearMap(value, edgeDataExtent_1, edgeLengthArr_1);
        if (isNaN(d)) {
          d = (edgeLengthArr_1[0] + edgeLengthArr_1[1]) / 2;
        }
        var edgeModel = edge.getModel();
        var curveness = retrieve3(edge.getModel().get(["lineStyle", "curveness"]), -getCurvenessForEdge(edge, graphSeries, idx, true), 0);
        return {
          n1: nodes_1[edge.node1.dataIndex],
          n2: nodes_1[edge.node2.dataIndex],
          d,
          curveness,
          ignoreForceLayout: edgeModel.get("ignoreForceLayout")
        };
      });
      var rect = coordSys.getBoundingRect();
      var forceInstance = forceLayout(nodes_1, edges, {
        rect,
        gravity: forceModel.get("gravity"),
        friction: forceModel.get("friction")
      });
      forceInstance.beforeStep(function(nodes, edges2) {
        for (var i = 0, l = nodes.length; i < l; i++) {
          if (nodes[i].fixed) {
            copy$1(nodes[i].p, graph_1.getNodeByIndex(i).getLayout());
          }
        }
      });
      forceInstance.afterStep(function(nodes, edges2, stopped) {
        for (var i = 0, l = nodes.length; i < l; i++) {
          if (!nodes[i].fixed) {
            graph_1.getNodeByIndex(i).setLayout(nodes[i].p);
          }
          preservedPoints_1[nodeData_1.getId(i)] = nodes[i].p;
        }
        for (var i = 0, l = edges2.length; i < l; i++) {
          var e = edges2[i];
          var edge = graph_1.getEdgeByIndex(i);
          var p1 = e.n1.p;
          var p2 = e.n2.p;
          var points = edge.getLayout();
          points = points ? points.slice() : [];
          points[0] = points[0] || [];
          points[1] = points[1] || [];
          copy$1(points[0], p1);
          copy$1(points[1], p2);
          if (+e.curveness) {
            points[2] = [(p1[0] + p2[0]) / 2 - (p1[1] - p2[1]) * e.curveness, (p1[1] + p2[1]) / 2 - (p2[0] - p1[0]) * e.curveness];
          }
          edge.setLayout(points);
        }
      });
      graphSeries.forceLayout = forceInstance;
      graphSeries.preservedPoints = preservedPoints_1;
      forceInstance.step();
    } else {
      graphSeries.forceLayout = null;
    }
  });
}
function getViewRect(seriesModel, api, aspect) {
  var layoutRef = createBoxLayoutReference(seriesModel, api);
  var option = extend(seriesModel.getBoxLayoutParams(), {
    aspect
  });
  var viewRect = getLayoutRect(option, layoutRef.refContainer);
  return applyPreserveAspect(seriesModel, viewRect, aspect);
}
function createViewCoordSys(ecModel, api) {
  var viewList = [];
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    injectCoordSysByOption({
      targetModel: seriesModel,
      coordSysType: "view",
      coordSysProvider: createViewCoordSys2,
      isDefaultDataCoordSys: true
    });
    function createViewCoordSys2() {
      var data = seriesModel.getData();
      var positions = data.mapArray(function(idx) {
        var itemModel = data.getItemModel(idx);
        return [+itemModel.get("x"), +itemModel.get("y")];
      });
      var min = [];
      var max = [];
      fromPoints(positions, min, max);
      if (max[0] - min[0] === 0) {
        max[0] += 1;
        min[0] -= 1;
      }
      if (max[1] - min[1] === 0) {
        max[1] += 1;
        min[1] -= 1;
      }
      var aspect = (max[0] - min[0]) / (max[1] - min[1]);
      var viewRect = getViewRect(seriesModel, api, aspect);
      if (isNaN(aspect)) {
        min = [viewRect.x, viewRect.y];
        max = [viewRect.x + viewRect.width, viewRect.y + viewRect.height];
      }
      var bbWidth = max[0] - min[0];
      var bbHeight = max[1] - min[1];
      var viewCoordSys = new View(null, {
        api,
        ecModel
      });
      viewCoordSys.zoomLimit = seriesModel.get("scaleLimit");
      viewCoordSys.setBoundingRect(min[0], min[1], bbWidth, bbHeight);
      viewCoordSys.setViewRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
      viewCoordSys.setCenter(seriesModel.get("center"));
      viewCoordSys.setZoom(seriesModel.get("zoom"));
      viewList.push(viewCoordSys);
      return viewCoordSys;
    }
  });
  return viewList;
}
var straightLineProto = Line$1.prototype;
var bezierCurveProto = BezierCurve.prototype;
var StraightLineShape = (
  /** @class */
  /* @__PURE__ */ function() {
    function StraightLineShape2() {
      this.x1 = 0;
      this.y1 = 0;
      this.x2 = 0;
      this.y2 = 0;
      this.percent = 1;
    }
    return StraightLineShape2;
  }()
);
(function(_super) {
  __extends(CurveShape, _super);
  function CurveShape() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return CurveShape;
})(StraightLineShape);
function isStraightLine(shape) {
  return isNaN(+shape.cpx1) || isNaN(+shape.cpy1);
}
var ECLinePath = (
  /** @class */
  function(_super) {
    __extends(ECLinePath2, _super);
    function ECLinePath2(opts) {
      var _this = _super.call(this, opts) || this;
      _this.type = "ec-line";
      return _this;
    }
    ECLinePath2.prototype.getDefaultStyle = function() {
      return {
        stroke: tokens.color.neutral99,
        fill: null
      };
    };
    ECLinePath2.prototype.getDefaultShape = function() {
      return new StraightLineShape();
    };
    ECLinePath2.prototype.buildPath = function(ctx, shape) {
      if (isStraightLine(shape)) {
        straightLineProto.buildPath.call(this, ctx, shape);
      } else {
        bezierCurveProto.buildPath.call(this, ctx, shape);
      }
    };
    ECLinePath2.prototype.pointAt = function(t) {
      if (isStraightLine(this.shape)) {
        return straightLineProto.pointAt.call(this, t);
      } else {
        return bezierCurveProto.pointAt.call(this, t);
      }
    };
    ECLinePath2.prototype.tangentAt = function(t) {
      var shape = this.shape;
      var p = isStraightLine(shape) ? [shape.x2 - shape.x1, shape.y2 - shape.y1] : bezierCurveProto.tangentAt.call(this, t);
      return normalize$2(p, p);
    };
    return ECLinePath2;
  }(Path)
);
var SYMBOL_CATEGORIES = ["fromSymbol", "toSymbol"];
function makeSymbolTypeKey(symbolCategory) {
  return "_" + symbolCategory + "Type";
}
function makeSymbolTypeValue(name, lineData, idx) {
  var symbolType = lineData.getItemVisual(idx, name);
  if (!symbolType || symbolType === "none") {
    return symbolType;
  }
  var symbolSize = lineData.getItemVisual(idx, name + "Size");
  var symbolRotate = lineData.getItemVisual(idx, name + "Rotate");
  var symbolOffset = lineData.getItemVisual(idx, name + "Offset");
  var symbolKeepAspect = lineData.getItemVisual(idx, name + "KeepAspect");
  var symbolSizeArr = normalizeSymbolSize(symbolSize);
  var symbolOffsetArr = normalizeSymbolOffset(symbolOffset || 0, symbolSizeArr);
  return symbolType + symbolSizeArr + symbolOffsetArr + (symbolRotate || "") + (symbolKeepAspect || "");
}
function createSymbol(name, lineData, idx) {
  var symbolType = lineData.getItemVisual(idx, name);
  if (!symbolType || symbolType === "none") {
    return;
  }
  var symbolSize = lineData.getItemVisual(idx, name + "Size");
  var symbolRotate = lineData.getItemVisual(idx, name + "Rotate");
  var symbolOffset = lineData.getItemVisual(idx, name + "Offset");
  var symbolKeepAspect = lineData.getItemVisual(idx, name + "KeepAspect");
  var symbolSizeArr = normalizeSymbolSize(symbolSize);
  var symbolOffsetArr = normalizeSymbolOffset(symbolOffset || 0, symbolSizeArr);
  var symbolPath = createSymbol$1(symbolType, -symbolSizeArr[0] / 2 + symbolOffsetArr[0], -symbolSizeArr[1] / 2 + symbolOffsetArr[1], symbolSizeArr[0], symbolSizeArr[1], null, symbolKeepAspect);
  symbolPath.__specifiedRotation = symbolRotate == null || isNaN(symbolRotate) ? void 0 : +symbolRotate * Math.PI / 180 || 0;
  symbolPath.name = name;
  return symbolPath;
}
function createLine(points) {
  var line = new ECLinePath({
    name: "line",
    subPixelOptimize: true
  });
  setLinePoints(line.shape, points);
  return line;
}
function setLinePoints(targetShape, points) {
  targetShape.x1 = points[0][0];
  targetShape.y1 = points[0][1];
  targetShape.x2 = points[1][0];
  targetShape.y2 = points[1][1];
  targetShape.percent = 1;
  var cp1 = points[2];
  if (cp1) {
    targetShape.cpx1 = cp1[0];
    targetShape.cpy1 = cp1[1];
  } else {
    targetShape.cpx1 = NaN;
    targetShape.cpy1 = NaN;
  }
}
var Line = (
  /** @class */
  function(_super) {
    __extends(Line2, _super);
    function Line2(lineData, idx, seriesScope) {
      var _this = _super.call(this) || this;
      _this._createLine(lineData, idx, seriesScope);
      return _this;
    }
    Line2.prototype._createLine = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var linePoints = lineData.getItemLayout(idx);
      var z2 = lineData.getItemVisual(idx, "z2");
      var line = createLine(linePoints);
      line.shape.percent = 0;
      initProps(line, {
        z2: retrieve2(z2, 0),
        shape: {
          percent: 1
        }
      }, seriesModel, idx);
      this.add(line);
      each$4(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbol = createSymbol(symbolCategory, lineData, idx);
        this.add(symbol);
        this[makeSymbolTypeKey(symbolCategory)] = makeSymbolTypeValue(symbolCategory, lineData, idx);
      }, this);
      this._updateCommonStl(lineData, idx, seriesScope);
    };
    Line2.prototype.updateData = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var line = this.childOfName("line");
      var linePoints = lineData.getItemLayout(idx);
      var target = {
        shape: {}
      };
      setLinePoints(target.shape, linePoints);
      updateProps$1(line, target, seriesModel, idx);
      each$4(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbolType = makeSymbolTypeValue(symbolCategory, lineData, idx);
        var key = makeSymbolTypeKey(symbolCategory);
        if (this[key] !== symbolType) {
          this.remove(this.childOfName(symbolCategory));
          var symbol = createSymbol(symbolCategory, lineData, idx);
          this.add(symbol);
        }
        this[key] = symbolType;
      }, this);
      this._updateCommonStl(lineData, idx, seriesScope);
    };
    Line2.prototype.getLinePath = function() {
      return this.childAt(0);
    };
    Line2.prototype._updateCommonStl = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var line = this.childOfName("line");
      var emphasisLineStyle = seriesScope && seriesScope.emphasisLineStyle;
      var blurLineStyle = seriesScope && seriesScope.blurLineStyle;
      var selectLineStyle = seriesScope && seriesScope.selectLineStyle;
      var labelStatesModels = seriesScope && seriesScope.labelStatesModels;
      var emphasisDisabled = seriesScope && seriesScope.emphasisDisabled;
      var focus = seriesScope && seriesScope.focus;
      var blurScope = seriesScope && seriesScope.blurScope;
      if (!seriesScope || lineData.hasItemOption) {
        var itemModel = lineData.getItemModel(idx);
        var emphasisModel = itemModel.getModel("emphasis");
        emphasisLineStyle = emphasisModel.getModel("lineStyle").getLineStyle();
        blurLineStyle = itemModel.getModel(["blur", "lineStyle"]).getLineStyle();
        selectLineStyle = itemModel.getModel(["select", "lineStyle"]).getLineStyle();
        emphasisDisabled = emphasisModel.get("disabled");
        focus = emphasisModel.get("focus");
        blurScope = emphasisModel.get("blurScope");
        labelStatesModels = getLabelStatesModels(itemModel);
      }
      var lineStyle = lineData.getItemVisual(idx, "style");
      var visualColor = lineStyle.stroke;
      line.useStyle(lineStyle);
      line.style.fill = null;
      line.style.strokeNoScale = true;
      line.ensureState("emphasis").style = emphasisLineStyle;
      line.ensureState("blur").style = blurLineStyle;
      line.ensureState("select").style = selectLineStyle;
      each$4(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbol = this.childOfName(symbolCategory);
        if (symbol) {
          symbol.setColor(visualColor);
          symbol.style.opacity = lineStyle.opacity;
          for (var i = 0; i < SPECIAL_STATES.length; i++) {
            var stateName = SPECIAL_STATES[i];
            var lineState = line.getState(stateName);
            if (lineState) {
              var lineStateStyle = lineState.style || {};
              var state = symbol.ensureState(stateName);
              var stateStyle = state.style || (state.style = {});
              if (lineStateStyle.stroke != null) {
                stateStyle[symbol.__isEmptyBrush ? "stroke" : "fill"] = lineStateStyle.stroke;
              }
              if (lineStateStyle.opacity != null) {
                stateStyle.opacity = lineStateStyle.opacity;
              }
            }
          }
          symbol.markRedraw();
        }
      }, this);
      var rawVal = seriesModel.getRawValue(idx);
      setLabelStyle(this, labelStatesModels, {
        labelDataIndex: idx,
        labelFetcher: {
          getFormattedLabel: function(dataIndex, stateName) {
            return seriesModel.getFormattedLabel(dataIndex, stateName, lineData.dataType);
          }
        },
        inheritColor: visualColor || tokens.color.neutral99,
        defaultOpacity: lineStyle.opacity,
        defaultText: (rawVal == null ? lineData.getName(idx) : isFinite(rawVal) ? round(rawVal) : rawVal) + ""
      });
      var label = this.getTextContent();
      if (label) {
        var labelNormalModel = labelStatesModels.normal;
        label.__align = label.style.align;
        label.__verticalAlign = label.style.verticalAlign;
        label.__position = labelNormalModel.get("position") || "middle";
        var distance = labelNormalModel.get("distance");
        if (!isArray(distance)) {
          distance = [distance, distance];
        }
        label.__labelDistance = distance;
      }
      this.setTextConfig({
        position: null,
        local: true,
        inside: false
        // Can't be inside for stroke element.
      });
      toggleHoverEmphasis(this, focus, blurScope, emphasisDisabled);
    };
    Line2.prototype.highlight = function() {
      enterEmphasis(this);
    };
    Line2.prototype.downplay = function() {
      leaveEmphasis(this);
    };
    Line2.prototype.updateLayout = function(lineData, idx) {
      this.setLinePoints(lineData.getItemLayout(idx));
    };
    Line2.prototype.setLinePoints = function(points) {
      var linePath = this.childOfName("line");
      setLinePoints(linePath.shape, points);
      linePath.dirty();
    };
    Line2.prototype.beforeUpdate = function() {
      var lineGroup = this;
      var symbolFrom = lineGroup.childOfName("fromSymbol");
      var symbolTo = lineGroup.childOfName("toSymbol");
      var label = lineGroup.getTextContent();
      if (!symbolFrom && !symbolTo && (!label || label.ignore)) {
        return;
      }
      var invScale = 1;
      var parentNode = this.parent;
      while (parentNode) {
        if (parentNode.scaleX) {
          invScale /= parentNode.scaleX;
        }
        parentNode = parentNode.parent;
      }
      var line = lineGroup.childOfName("line");
      if (!this.__dirty && !line.__dirty) {
        return;
      }
      var percent = line.shape.percent;
      var fromPos = line.pointAt(0);
      var toPos = line.pointAt(percent);
      var d = sub([], toPos, fromPos);
      normalize$2(d, d);
      function setSymbolRotation(symbol, percent2) {
        var specifiedRotation = symbol.__specifiedRotation;
        if (specifiedRotation == null) {
          var tangent2 = line.tangentAt(percent2);
          symbol.attr("rotation", (percent2 === 1 ? -1 : 1) * Math.PI / 2 - Math.atan2(tangent2[1], tangent2[0]));
        } else {
          symbol.attr("rotation", specifiedRotation);
        }
      }
      if (symbolFrom) {
        symbolFrom.setPosition(fromPos);
        setSymbolRotation(symbolFrom, 0);
        symbolFrom.scaleX = symbolFrom.scaleY = invScale * percent;
        symbolFrom.markRedraw();
      }
      if (symbolTo) {
        symbolTo.setPosition(toPos);
        setSymbolRotation(symbolTo, 1);
        symbolTo.scaleX = symbolTo.scaleY = invScale * percent;
        symbolTo.markRedraw();
      }
      if (label && !label.ignore) {
        label.x = label.y = 0;
        label.originX = label.originY = 0;
        var textAlign = void 0;
        var textVerticalAlign = void 0;
        var distance = label.__labelDistance;
        var distanceX = distance[0] * invScale;
        var distanceY = distance[1] * invScale;
        var halfPercent = percent / 2;
        var tangent = line.tangentAt(halfPercent);
        var n = [tangent[1], -tangent[0]];
        var cp = line.pointAt(halfPercent);
        if (n[1] > 0) {
          n[0] = -n[0];
          n[1] = -n[1];
        }
        var dir = tangent[0] < 0 ? -1 : 1;
        if (label.__position !== "start" && label.__position !== "end") {
          var rotation = -Math.atan2(tangent[1], tangent[0]);
          if (toPos[0] < fromPos[0]) {
            rotation = Math.PI + rotation;
          }
          label.rotation = rotation;
        }
        var dy = void 0;
        switch (label.__position) {
          case "insideStartTop":
          case "insideMiddleTop":
          case "insideEndTop":
          case "middle":
            dy = -distanceY;
            textVerticalAlign = "bottom";
            break;
          case "insideStartBottom":
          case "insideMiddleBottom":
          case "insideEndBottom":
            dy = distanceY;
            textVerticalAlign = "top";
            break;
          default:
            dy = 0;
            textVerticalAlign = "middle";
        }
        switch (label.__position) {
          case "end":
            label.x = d[0] * distanceX + toPos[0];
            label.y = d[1] * distanceY + toPos[1];
            textAlign = d[0] > 0.8 ? "left" : d[0] < -0.8 ? "right" : "center";
            textVerticalAlign = d[1] > 0.8 ? "top" : d[1] < -0.8 ? "bottom" : "middle";
            break;
          case "start":
            label.x = -d[0] * distanceX + fromPos[0];
            label.y = -d[1] * distanceY + fromPos[1];
            textAlign = d[0] > 0.8 ? "right" : d[0] < -0.8 ? "left" : "center";
            textVerticalAlign = d[1] > 0.8 ? "bottom" : d[1] < -0.8 ? "top" : "middle";
            break;
          case "insideStartTop":
          case "insideStart":
          case "insideStartBottom":
            label.x = distanceX * dir + fromPos[0];
            label.y = fromPos[1] + dy;
            textAlign = tangent[0] < 0 ? "right" : "left";
            label.originX = -distanceX * dir;
            label.originY = -dy;
            break;
          case "insideMiddleTop":
          case "insideMiddle":
          case "insideMiddleBottom":
          case "middle":
            label.x = cp[0];
            label.y = cp[1] + dy;
            textAlign = "center";
            label.originY = -dy;
            break;
          case "insideEndTop":
          case "insideEnd":
          case "insideEndBottom":
            label.x = -distanceX * dir + toPos[0];
            label.y = toPos[1] + dy;
            textAlign = tangent[0] >= 0 ? "right" : "left";
            label.originX = distanceX * dir;
            label.originY = -dy;
            break;
        }
        label.scaleX = label.scaleY = invScale;
        label.setStyle({
          // Use the user specified text align and baseline first
          verticalAlign: label.__verticalAlign || textVerticalAlign,
          align: label.__align || textAlign
        });
      }
    };
    return Line2;
  }(Group$2)
);
var LineDraw = (
  /** @class */
  function() {
    function LineDraw2(LineCtor) {
      this.group = new Group$2();
      this._LineCtor = LineCtor || Line;
    }
    LineDraw2.prototype.updateData = function(lineData) {
      var _this = this;
      this._progressiveEls = null;
      var lineDraw = this;
      var group = lineDraw.group;
      var oldLineData = lineDraw._lineData;
      lineDraw._lineData = lineData;
      if (!oldLineData) {
        group.removeAll();
      }
      var seriesScope = makeSeriesScope(lineData);
      lineData.diff(oldLineData).add(function(idx) {
        _this._doAdd(lineData, idx, seriesScope);
      }).update(function(newIdx, oldIdx) {
        _this._doUpdate(oldLineData, lineData, oldIdx, newIdx, seriesScope);
      }).remove(function(idx) {
        group.remove(oldLineData.getItemGraphicEl(idx));
      }).execute();
    };
    LineDraw2.prototype.updateLayout = function() {
      var lineData = this._lineData;
      if (!lineData) {
        return;
      }
      lineData.eachItemGraphicEl(function(el, idx) {
        el.updateLayout(lineData, idx);
      }, this);
    };
    LineDraw2.prototype.incrementalPrepareUpdate = function(lineData) {
      this._seriesScope = makeSeriesScope(lineData);
      this._lineData = null;
      this.group.removeAll();
    };
    LineDraw2.prototype.incrementalUpdate = function(taskParams, lineData) {
      this._progressiveEls = [];
      function updateIncrementalAndHover(el2) {
        if (!el2.isGroup && !isEffectObject(el2)) {
          el2.incremental = true;
          el2.ensureState("emphasis").hoverLayer = true;
        }
      }
      for (var idx = taskParams.start; idx < taskParams.end; idx++) {
        var itemLayout = lineData.getItemLayout(idx);
        if (lineNeedsDraw(itemLayout)) {
          var el = new this._LineCtor(lineData, idx, this._seriesScope);
          el.traverse(updateIncrementalAndHover);
          this.group.add(el);
          lineData.setItemGraphicEl(idx, el);
          this._progressiveEls.push(el);
        }
      }
    };
    LineDraw2.prototype.remove = function() {
      this.group.removeAll();
    };
    LineDraw2.prototype.eachRendered = function(cb) {
      traverseElements(this._progressiveEls || this.group, cb);
    };
    LineDraw2.prototype._doAdd = function(lineData, idx, seriesScope) {
      var itemLayout = lineData.getItemLayout(idx);
      if (!lineNeedsDraw(itemLayout)) {
        return;
      }
      var el = new this._LineCtor(lineData, idx, seriesScope);
      lineData.setItemGraphicEl(idx, el);
      this.group.add(el);
    };
    LineDraw2.prototype._doUpdate = function(oldLineData, newLineData, oldIdx, newIdx, seriesScope) {
      var itemEl = oldLineData.getItemGraphicEl(oldIdx);
      if (!lineNeedsDraw(newLineData.getItemLayout(newIdx))) {
        this.group.remove(itemEl);
        return;
      }
      if (!itemEl) {
        itemEl = new this._LineCtor(newLineData, newIdx, seriesScope);
      } else {
        itemEl.updateData(newLineData, newIdx, seriesScope);
      }
      newLineData.setItemGraphicEl(newIdx, itemEl);
      this.group.add(itemEl);
    };
    return LineDraw2;
  }()
);
function isEffectObject(el) {
  return el.animators && el.animators.length > 0;
}
function makeSeriesScope(lineData) {
  var hostModel = lineData.hostModel;
  var emphasisModel = hostModel.getModel("emphasis");
  return {
    lineStyle: hostModel.getModel("lineStyle").getLineStyle(),
    emphasisLineStyle: emphasisModel.getModel(["lineStyle"]).getLineStyle(),
    blurLineStyle: hostModel.getModel(["blur", "lineStyle"]).getLineStyle(),
    selectLineStyle: hostModel.getModel(["select", "lineStyle"]).getLineStyle(),
    emphasisDisabled: emphasisModel.get("disabled"),
    blurScope: emphasisModel.get("blurScope"),
    focus: emphasisModel.get("focus"),
    labelStatesModels: getLabelStatesModels(hostModel)
  };
}
function isPointNaN(pt) {
  return isNaN(pt[0]) || isNaN(pt[1]);
}
function lineNeedsDraw(pts) {
  return pts && !isPointNaN(pts[0]) && !isPointNaN(pts[1]);
}
var v1 = [];
var v2 = [];
var v3 = [];
var quadraticAt = quadraticAt$1;
var v2DistSquare = distSquare;
var mathAbs = Math.abs;
function intersectCurveCircle(curvePoints, center, radius) {
  var p0 = curvePoints[0];
  var p1 = curvePoints[1];
  var p2 = curvePoints[2];
  var d = Infinity;
  var t;
  var radiusSquare = radius * radius;
  var interval = 0.1;
  for (var _t = 0.1; _t <= 0.9; _t += 0.1) {
    v1[0] = quadraticAt(p0[0], p1[0], p2[0], _t);
    v1[1] = quadraticAt(p0[1], p1[1], p2[1], _t);
    var diff = mathAbs(v2DistSquare(v1, center) - radiusSquare);
    if (diff < d) {
      d = diff;
      t = _t;
    }
  }
  for (var i = 0; i < 32; i++) {
    var next = t + interval;
    v2[0] = quadraticAt(p0[0], p1[0], p2[0], t);
    v2[1] = quadraticAt(p0[1], p1[1], p2[1], t);
    v3[0] = quadraticAt(p0[0], p1[0], p2[0], next);
    v3[1] = quadraticAt(p0[1], p1[1], p2[1], next);
    var diff = v2DistSquare(v2, center) - radiusSquare;
    if (mathAbs(diff) < 0.01) {
      break;
    }
    var nextDiff = v2DistSquare(v3, center) - radiusSquare;
    interval /= 2;
    if (diff < 0) {
      if (nextDiff >= 0) {
        t = t + interval;
      } else {
        t = t - interval;
      }
    } else {
      if (nextDiff >= 0) {
        t = t - interval;
      } else {
        t = t + interval;
      }
    }
  }
  return t;
}
function adjustEdge(graph, scale2) {
  var tmp0 = [];
  var quadraticSubdivide$1 = quadraticSubdivide;
  var pts = [[], [], []];
  var pts2 = [[], []];
  var v = [];
  scale2 /= 2;
  graph.eachEdge(function(edge, idx) {
    var linePoints = edge.getLayout();
    var fromSymbol = edge.getVisual("fromSymbol");
    var toSymbol = edge.getVisual("toSymbol");
    if (!linePoints.__original) {
      linePoints.__original = [clone$2(linePoints[0]), clone$2(linePoints[1])];
      if (linePoints[2]) {
        linePoints.__original.push(clone$2(linePoints[2]));
      }
    }
    var originalPoints = linePoints.__original;
    if (linePoints[2] != null) {
      copy$1(pts[0], originalPoints[0]);
      copy$1(pts[1], originalPoints[2]);
      copy$1(pts[2], originalPoints[1]);
      if (fromSymbol && fromSymbol !== "none") {
        var symbolSize = getSymbolSize(edge.node1);
        var t = intersectCurveCircle(pts, originalPoints[0], symbolSize * scale2);
        quadraticSubdivide$1(pts[0][0], pts[1][0], pts[2][0], t, tmp0);
        pts[0][0] = tmp0[3];
        pts[1][0] = tmp0[4];
        quadraticSubdivide$1(pts[0][1], pts[1][1], pts[2][1], t, tmp0);
        pts[0][1] = tmp0[3];
        pts[1][1] = tmp0[4];
      }
      if (toSymbol && toSymbol !== "none") {
        var symbolSize = getSymbolSize(edge.node2);
        var t = intersectCurveCircle(pts, originalPoints[1], symbolSize * scale2);
        quadraticSubdivide$1(pts[0][0], pts[1][0], pts[2][0], t, tmp0);
        pts[1][0] = tmp0[1];
        pts[2][0] = tmp0[2];
        quadraticSubdivide$1(pts[0][1], pts[1][1], pts[2][1], t, tmp0);
        pts[1][1] = tmp0[1];
        pts[2][1] = tmp0[2];
      }
      copy$1(linePoints[0], pts[0]);
      copy$1(linePoints[1], pts[2]);
      copy$1(linePoints[2], pts[1]);
    } else {
      copy$1(pts2[0], originalPoints[0]);
      copy$1(pts2[1], originalPoints[1]);
      sub(v, pts2[1], pts2[0]);
      normalize$2(v, v);
      if (fromSymbol && fromSymbol !== "none") {
        var symbolSize = getSymbolSize(edge.node1);
        scaleAndAdd$1(pts2[0], pts2[0], v, symbolSize * scale2);
      }
      if (toSymbol && toSymbol !== "none") {
        var symbolSize = getSymbolSize(edge.node2);
        scaleAndAdd$1(pts2[1], pts2[1], v, -symbolSize * scale2);
      }
      copy$1(linePoints[0], pts2[0]);
      copy$1(linePoints[1], pts2[1]);
    }
  });
}
var inner$3 = makeInner();
function getThumbnailBridge(model) {
  if (model) {
    return inner$3(model).bridge;
  }
}
function isViewCoordSys(coordSys) {
  return coordSys.type === "view";
}
var GraphView = (
  /** @class */
  function(_super) {
    __extends(GraphView2, _super);
    function GraphView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = GraphView2.type;
      return _this;
    }
    GraphView2.prototype.init = function(ecModel, api) {
      var symbolDraw = new SymbolDraw();
      var lineDraw = new LineDraw();
      var group = this.group;
      var mainGroup = new Group$2();
      this._controller = new RoamController(api.getZr());
      this._controllerHost = {
        target: mainGroup
      };
      mainGroup.add(symbolDraw.group);
      mainGroup.add(lineDraw.group);
      group.add(mainGroup);
      this._symbolDraw = symbolDraw;
      this._lineDraw = lineDraw;
      this._mainGroup = mainGroup;
      this._firstRender = true;
    };
    GraphView2.prototype.render = function(seriesModel, ecModel, api) {
      var _this = this;
      var coordSys = seriesModel.coordinateSystem;
      var isForceLayout = false;
      this._model = seriesModel;
      this._api = api;
      this._active = true;
      var thumbnailInfo = this._getThumbnailInfo();
      if (thumbnailInfo) {
        thumbnailInfo.bridge.reset(api);
      }
      var symbolDraw = this._symbolDraw;
      var lineDraw = this._lineDraw;
      if (isViewCoordSys(coordSys)) {
        var groupNewProp = {
          x: coordSys.x,
          y: coordSys.y,
          scaleX: coordSys.scaleX,
          scaleY: coordSys.scaleY
        };
        if (this._firstRender) {
          this._mainGroup.attr(groupNewProp);
        } else {
          updateProps$1(this._mainGroup, groupNewProp, seriesModel);
        }
      }
      adjustEdge(seriesModel.getGraph(), getNodeGlobalScale(seriesModel));
      var data = seriesModel.getData();
      symbolDraw.updateData(data);
      var edgeData = seriesModel.getEdgeData();
      lineDraw.updateData(edgeData);
      this._updateNodeAndLinkScale();
      this._updateController(null, seriesModel, api);
      clearTimeout(this._layoutTimeout);
      var forceLayout2 = seriesModel.forceLayout;
      var layoutAnimation = seriesModel.get(["force", "layoutAnimation"]);
      if (forceLayout2) {
        isForceLayout = true;
        this._startForceLayoutIteration(forceLayout2, api, layoutAnimation);
      }
      var layout2 = seriesModel.get("layout");
      data.graph.eachNode(function(node) {
        var idx = node.dataIndex;
        var el = node.getGraphicEl();
        var itemModel = node.getModel();
        if (!el) {
          return;
        }
        el.off("drag").off("dragend");
        var draggable = itemModel.get("draggable");
        if (draggable) {
          el.on("drag", function(e) {
            switch (layout2) {
              case "force":
                forceLayout2.warmUp();
                !_this._layouting && _this._startForceLayoutIteration(forceLayout2, api, layoutAnimation);
                forceLayout2.setFixed(idx);
                data.setItemLayout(idx, [el.x, el.y]);
                break;
              case "circular":
                data.setItemLayout(idx, [el.x, el.y]);
                node.setLayout({
                  fixed: true
                }, true);
                circularLayout(seriesModel, "symbolSize", node, [e.offsetX, e.offsetY]);
                _this.updateLayout(seriesModel);
                break;
              case "none":
              default:
                data.setItemLayout(idx, [el.x, el.y]);
                simpleLayoutEdge(seriesModel.getGraph(), seriesModel);
                _this.updateLayout(seriesModel);
                break;
            }
          }).on("dragend", function() {
            if (forceLayout2) {
              forceLayout2.setUnfixed(idx);
            }
          });
        }
        el.setDraggable(draggable, !!itemModel.get("cursor"));
        var focus = itemModel.get(["emphasis", "focus"]);
        if (focus === "adjacency") {
          getECData(el).focus = node.getAdjacentDataIndices();
        }
      });
      data.graph.eachEdge(function(edge) {
        var el = edge.getGraphicEl();
        var focus = edge.getModel().get(["emphasis", "focus"]);
        if (!el) {
          return;
        }
        if (focus === "adjacency") {
          getECData(el).focus = {
            edge: [edge.dataIndex],
            node: [edge.node1.dataIndex, edge.node2.dataIndex]
          };
        }
      });
      var circularRotateLabel = seriesModel.get("layout") === "circular" && seriesModel.get(["circular", "rotateLabel"]);
      var cx = data.getLayout("cx");
      var cy = data.getLayout("cy");
      data.graph.eachNode(function(node) {
        rotateNodeLabel(node, circularRotateLabel, cx, cy);
      });
      this._firstRender = false;
      if (!isForceLayout) {
        this._renderThumbnail(seriesModel, api, this._symbolDraw, this._lineDraw);
      }
    };
    GraphView2.prototype.dispose = function() {
      this.remove();
      this._controller && this._controller.dispose();
      this._controllerHost = null;
    };
    GraphView2.prototype._startForceLayoutIteration = function(forceLayout2, api, layoutAnimation) {
      var self = this;
      var firstRendered = false;
      (function step() {
        forceLayout2.step(function(stopped) {
          self.updateLayout(self._model);
          if (stopped || !firstRendered) {
            firstRendered = true;
            self._renderThumbnail(self._model, api, self._symbolDraw, self._lineDraw);
          }
          (self._layouting = !stopped) && (layoutAnimation ? self._layoutTimeout = setTimeout(step, 16) : step());
        });
      })();
    };
    GraphView2.prototype._updateController = function(clipRect, seriesModel, api) {
      var controller = this._controller;
      var controllerHost = this._controllerHost;
      var coordSys = seriesModel.coordinateSystem;
      if (!isViewCoordSys(coordSys)) {
        controller.disable();
        return;
      }
      controller.enable(seriesModel.get("roam"), {
        api,
        zInfo: {
          component: seriesModel
        },
        triggerInfo: {
          roamTrigger: seriesModel.get("roamTrigger"),
          isInSelf: function(e, x, y) {
            return coordSys.containPoint([x, y]);
          },
          isInClip: function(e, x, y) {
            return !clipRect || clipRect.contain(x, y);
          }
        }
      });
      controllerHost.zoomLimit = seriesModel.get("scaleLimit");
      controllerHost.zoom = coordSys.getZoom();
      controller.off("pan").off("zoom").on("pan", function(e) {
        api.dispatchAction({
          seriesId: seriesModel.id,
          type: "graphRoam",
          dx: e.dx,
          dy: e.dy
        });
      }).on("zoom", function(e) {
        api.dispatchAction({
          seriesId: seriesModel.id,
          type: "graphRoam",
          zoom: e.scale,
          originX: e.originX,
          originY: e.originY
        });
      });
    };
    GraphView2.prototype.updateViewOnPan = function(seriesModel, api, params) {
      if (!this._active) {
        return;
      }
      updateViewOnPan(this._controllerHost, params.dx, params.dy);
      this._updateThumbnailWindow();
    };
    GraphView2.prototype.updateViewOnZoom = function(seriesModel, api, params) {
      if (!this._active) {
        return;
      }
      updateViewOnZoom(this._controllerHost, params.zoom, params.originX, params.originY);
      this._updateNodeAndLinkScale();
      adjustEdge(seriesModel.getGraph(), getNodeGlobalScale(seriesModel));
      this._lineDraw.updateLayout();
      api.updateLabelLayout();
      this._updateThumbnailWindow();
    };
    GraphView2.prototype._updateNodeAndLinkScale = function() {
      var seriesModel = this._model;
      var data = seriesModel.getData();
      var nodeScale = getNodeGlobalScale(seriesModel);
      data.eachItemGraphicEl(function(el, idx) {
        el && el.setSymbolScale(nodeScale);
      });
    };
    GraphView2.prototype.updateLayout = function(seriesModel) {
      if (!this._active) {
        return;
      }
      adjustEdge(seriesModel.getGraph(), getNodeGlobalScale(seriesModel));
      this._symbolDraw.updateLayout();
      this._lineDraw.updateLayout();
    };
    GraphView2.prototype.remove = function() {
      this._active = false;
      clearTimeout(this._layoutTimeout);
      this._layouting = false;
      this._layoutTimeout = null;
      this._symbolDraw && this._symbolDraw.remove();
      this._lineDraw && this._lineDraw.remove();
      this._controller && this._controller.disable();
    };
    GraphView2.prototype._getThumbnailInfo = function() {
      var model = this._model;
      var coordSys = model.coordinateSystem;
      if (coordSys.type !== "view") {
        return;
      }
      var bridge = getThumbnailBridge(model);
      if (!bridge) {
        return;
      }
      return {
        bridge,
        coordSys
      };
    };
    GraphView2.prototype._updateThumbnailWindow = function() {
      var info = this._getThumbnailInfo();
      if (info) {
        info.bridge.updateWindow(info.coordSys.transform, this._api);
      }
    };
    GraphView2.prototype._renderThumbnail = function(seriesModel, api, symbolDraw, lineDraw) {
      var info = this._getThumbnailInfo();
      if (!info) {
        return;
      }
      var bridgeGroup = new Group$2();
      var symbolNodes = symbolDraw.group.children();
      var lineNodes = lineDraw.group.children();
      var lineGroup = new Group$2();
      var symbolGroup = new Group$2();
      bridgeGroup.add(symbolGroup);
      bridgeGroup.add(lineGroup);
      for (var i = 0; i < symbolNodes.length; i++) {
        var node = symbolNodes[i];
        var sub2 = node.children()[0];
        var x = node.x;
        var y = node.y;
        var subShape = clone$1(sub2.shape);
        var shape = extend(subShape, {
          width: sub2.scaleX,
          height: sub2.scaleY,
          x: x - sub2.scaleX / 2,
          y: y - sub2.scaleY / 2
        });
        var style = clone$1(sub2.style);
        var subThumbnail = new sub2.constructor({
          shape,
          style,
          z2: 151
        });
        symbolGroup.add(subThumbnail);
      }
      for (var i = 0; i < lineNodes.length; i++) {
        var node = lineNodes[i];
        var line = node.children()[0];
        var style = clone$1(line.style);
        var shape = clone$1(line.shape);
        var lineThumbnail = new ECLinePath({
          style,
          shape,
          z2: 151
        });
        lineGroup.add(lineThumbnail);
      }
      info.bridge.renderContent({
        api,
        roamType: seriesModel.get("roam"),
        viewportRect: null,
        group: bridgeGroup,
        targetTrans: info.coordSys.transform
      });
    };
    GraphView2.type = "graph";
    return GraphView2;
  }(ChartView)
);
function generateNodeKey(id) {
  return "_EC_" + id;
}
var Graph = (
  /** @class */
  function() {
    function Graph2(directed) {
      this.type = "graph";
      this.nodes = [];
      this.edges = [];
      this._nodesMap = {};
      this._edgesMap = {};
      this._directed = directed || false;
    }
    Graph2.prototype.isDirected = function() {
      return this._directed;
    };
    Graph2.prototype.addNode = function(id, dataIndex) {
      id = id == null ? "" + dataIndex : "" + id;
      var nodesMap = this._nodesMap;
      if (nodesMap[generateNodeKey(id)]) {
        return;
      }
      var node = new GraphNode(id, dataIndex);
      node.hostGraph = this;
      this.nodes.push(node);
      nodesMap[generateNodeKey(id)] = node;
      return node;
    };
    Graph2.prototype.getNodeByIndex = function(dataIndex) {
      var rawIdx = this.data.getRawIndex(dataIndex);
      return this.nodes[rawIdx];
    };
    Graph2.prototype.getNodeById = function(id) {
      return this._nodesMap[generateNodeKey(id)];
    };
    Graph2.prototype.addEdge = function(n1, n2, dataIndex) {
      var nodesMap = this._nodesMap;
      var edgesMap = this._edgesMap;
      if (isNumber(n1)) {
        n1 = this.nodes[n1];
      }
      if (isNumber(n2)) {
        n2 = this.nodes[n2];
      }
      if (!(n1 instanceof GraphNode)) {
        n1 = nodesMap[generateNodeKey(n1)];
      }
      if (!(n2 instanceof GraphNode)) {
        n2 = nodesMap[generateNodeKey(n2)];
      }
      if (!n1 || !n2) {
        return;
      }
      var key = n1.id + "-" + n2.id;
      var edge = new GraphEdge(n1, n2, dataIndex);
      edge.hostGraph = this;
      if (this._directed) {
        n1.outEdges.push(edge);
        n2.inEdges.push(edge);
      }
      n1.edges.push(edge);
      if (n1 !== n2) {
        n2.edges.push(edge);
      }
      this.edges.push(edge);
      edgesMap[key] = edge;
      return edge;
    };
    Graph2.prototype.getEdgeByIndex = function(dataIndex) {
      var rawIdx = this.edgeData.getRawIndex(dataIndex);
      return this.edges[rawIdx];
    };
    Graph2.prototype.getEdge = function(n1, n2) {
      if (n1 instanceof GraphNode) {
        n1 = n1.id;
      }
      if (n2 instanceof GraphNode) {
        n2 = n2.id;
      }
      var edgesMap = this._edgesMap;
      if (this._directed) {
        return edgesMap[n1 + "-" + n2];
      } else {
        return edgesMap[n1 + "-" + n2] || edgesMap[n2 + "-" + n1];
      }
    };
    Graph2.prototype.eachNode = function(cb, context) {
      var nodes = this.nodes;
      var len2 = nodes.length;
      for (var i = 0; i < len2; i++) {
        if (nodes[i].dataIndex >= 0) {
          cb.call(context, nodes[i], i);
        }
      }
    };
    Graph2.prototype.eachEdge = function(cb, context) {
      var edges = this.edges;
      var len2 = edges.length;
      for (var i = 0; i < len2; i++) {
        if (edges[i].dataIndex >= 0 && edges[i].node1.dataIndex >= 0 && edges[i].node2.dataIndex >= 0) {
          cb.call(context, edges[i], i);
        }
      }
    };
    Graph2.prototype.breadthFirstTraverse = function(cb, startNode, direction, context) {
      if (!(startNode instanceof GraphNode)) {
        startNode = this._nodesMap[generateNodeKey(startNode)];
      }
      if (!startNode) {
        return;
      }
      var edgeType = direction === "out" ? "outEdges" : direction === "in" ? "inEdges" : "edges";
      for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].__visited = false;
      }
      if (cb.call(context, startNode, null)) {
        return;
      }
      var queue = [startNode];
      while (queue.length) {
        var currentNode = queue.shift();
        var edges = currentNode[edgeType];
        for (var i = 0; i < edges.length; i++) {
          var e = edges[i];
          var otherNode = e.node1 === currentNode ? e.node2 : e.node1;
          if (!otherNode.__visited) {
            if (cb.call(context, otherNode, currentNode)) {
              return;
            }
            queue.push(otherNode);
            otherNode.__visited = true;
          }
        }
      }
    };
    Graph2.prototype.update = function() {
      var data = this.data;
      var edgeData = this.edgeData;
      var nodes = this.nodes;
      var edges = this.edges;
      for (var i = 0, len2 = nodes.length; i < len2; i++) {
        nodes[i].dataIndex = -1;
      }
      for (var i = 0, len2 = data.count(); i < len2; i++) {
        nodes[data.getRawIndex(i)].dataIndex = i;
      }
      edgeData.filterSelf(function(idx) {
        var edge = edges[edgeData.getRawIndex(idx)];
        return edge.node1.dataIndex >= 0 && edge.node2.dataIndex >= 0;
      });
      for (var i = 0, len2 = edges.length; i < len2; i++) {
        edges[i].dataIndex = -1;
      }
      for (var i = 0, len2 = edgeData.count(); i < len2; i++) {
        edges[edgeData.getRawIndex(i)].dataIndex = i;
      }
    };
    Graph2.prototype.clone = function() {
      var graph = new Graph2(this._directed);
      var nodes = this.nodes;
      var edges = this.edges;
      for (var i = 0; i < nodes.length; i++) {
        graph.addNode(nodes[i].id, nodes[i].dataIndex);
      }
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        graph.addEdge(e.node1.id, e.node2.id, e.dataIndex);
      }
      return graph;
    };
    return Graph2;
  }()
);
var GraphNode = (
  /** @class */
  function() {
    function GraphNode2(id, dataIndex) {
      this.inEdges = [];
      this.outEdges = [];
      this.edges = [];
      this.dataIndex = -1;
      this.id = id == null ? "" : id;
      this.dataIndex = dataIndex == null ? -1 : dataIndex;
    }
    GraphNode2.prototype.degree = function() {
      return this.edges.length;
    };
    GraphNode2.prototype.inDegree = function() {
      return this.inEdges.length;
    };
    GraphNode2.prototype.outDegree = function() {
      return this.outEdges.length;
    };
    GraphNode2.prototype.getModel = function(path) {
      if (this.dataIndex < 0) {
        return;
      }
      var graph = this.hostGraph;
      var itemModel = graph.data.getItemModel(this.dataIndex);
      return itemModel.getModel(path);
    };
    GraphNode2.prototype.getAdjacentDataIndices = function() {
      var dataIndices = {
        edge: [],
        node: []
      };
      for (var i = 0; i < this.edges.length; i++) {
        var adjacentEdge = this.edges[i];
        if (adjacentEdge.dataIndex < 0) {
          continue;
        }
        dataIndices.edge.push(adjacentEdge.dataIndex);
        dataIndices.node.push(adjacentEdge.node1.dataIndex, adjacentEdge.node2.dataIndex);
      }
      return dataIndices;
    };
    GraphNode2.prototype.getTrajectoryDataIndices = function() {
      var connectedEdgesMap = createHashMap();
      var connectedNodesMap = createHashMap();
      for (var i = 0, len2 = this.edges.length; i < len2; i++) {
        var adjacentEdge = this.edges[i];
        if (adjacentEdge.dataIndex < 0) {
          continue;
        }
        connectedEdgesMap.set(adjacentEdge.dataIndex, true);
        var sourceNodesQueue = [adjacentEdge.node1];
        var targetNodesQueue = [adjacentEdge.node2];
        var nodeIteratorIndex = 0;
        while (nodeIteratorIndex < sourceNodesQueue.length) {
          var sourceNode = sourceNodesQueue[nodeIteratorIndex];
          nodeIteratorIndex++;
          connectedNodesMap.set(sourceNode.dataIndex, true);
          var sourceNodeInEdges = sourceNode.inEdges;
          for (var j = 0, len_1 = sourceNodeInEdges.length, inEdge = void 0, inEdgeDataIndex = void 0; j < len_1; j++) {
            inEdge = sourceNodeInEdges[j];
            inEdgeDataIndex = inEdge.dataIndex;
            if (inEdgeDataIndex >= 0 && !connectedEdgesMap.hasKey(inEdgeDataIndex)) {
              connectedEdgesMap.set(inEdgeDataIndex, true);
              sourceNodesQueue.push(inEdge.node1);
            }
          }
        }
        nodeIteratorIndex = 0;
        while (nodeIteratorIndex < targetNodesQueue.length) {
          var targetNode = targetNodesQueue[nodeIteratorIndex];
          nodeIteratorIndex++;
          connectedNodesMap.set(targetNode.dataIndex, true);
          var targetNodeOutEdges = targetNode.outEdges;
          for (var j = 0, len_2 = targetNodeOutEdges.length, outEdge = void 0, outEdgeDataIndex = void 0; j < len_2; j++) {
            outEdge = targetNodeOutEdges[j];
            outEdgeDataIndex = outEdge.dataIndex;
            if (outEdgeDataIndex >= 0 && !connectedEdgesMap.hasKey(outEdgeDataIndex)) {
              connectedEdgesMap.set(outEdgeDataIndex, true);
              targetNodesQueue.push(outEdge.node2);
            }
          }
        }
      }
      return {
        edge: connectedEdgesMap.keys(),
        node: connectedNodesMap.keys()
      };
    };
    return GraphNode2;
  }()
);
var GraphEdge = (
  /** @class */
  function() {
    function GraphEdge2(n1, n2, dataIndex) {
      this.dataIndex = -1;
      this.node1 = n1;
      this.node2 = n2;
      this.dataIndex = dataIndex == null ? -1 : dataIndex;
    }
    GraphEdge2.prototype.getModel = function(path) {
      if (this.dataIndex < 0) {
        return;
      }
      var graph = this.hostGraph;
      var itemModel = graph.edgeData.getItemModel(this.dataIndex);
      return itemModel.getModel(path);
    };
    GraphEdge2.prototype.getAdjacentDataIndices = function() {
      return {
        edge: [this.dataIndex],
        node: [this.node1.dataIndex, this.node2.dataIndex]
      };
    };
    GraphEdge2.prototype.getTrajectoryDataIndices = function() {
      var connectedEdgesMap = createHashMap();
      var connectedNodesMap = createHashMap();
      connectedEdgesMap.set(this.dataIndex, true);
      var sourceNodes = [this.node1];
      var targetNodes = [this.node2];
      var nodeIteratorIndex = 0;
      while (nodeIteratorIndex < sourceNodes.length) {
        var sourceNode = sourceNodes[nodeIteratorIndex];
        nodeIteratorIndex++;
        connectedNodesMap.set(sourceNode.dataIndex, true);
        var sourceNodeInEdges = sourceNode.inEdges;
        for (var j = 0, len2 = sourceNodeInEdges.length, inEdge = void 0, inEdgeDataIndex = void 0; j < len2; j++) {
          inEdge = sourceNode.inEdges[j];
          inEdgeDataIndex = inEdge.dataIndex;
          if (inEdgeDataIndex >= 0 && !connectedEdgesMap.hasKey(inEdgeDataIndex)) {
            connectedEdgesMap.set(inEdgeDataIndex, true);
            sourceNodes.push(inEdge.node1);
          }
        }
      }
      nodeIteratorIndex = 0;
      while (nodeIteratorIndex < targetNodes.length) {
        var targetNode = targetNodes[nodeIteratorIndex];
        nodeIteratorIndex++;
        connectedNodesMap.set(targetNode.dataIndex, true);
        var targetNodeOutEdges = targetNode.outEdges;
        for (var j = 0, len2 = targetNodeOutEdges.length, outEdge = void 0, outEdgeDataIndex = void 0; j < len2; j++) {
          outEdge = targetNode.outEdges[j];
          outEdgeDataIndex = outEdge.dataIndex;
          if (outEdgeDataIndex >= 0 && !connectedEdgesMap.hasKey(outEdgeDataIndex)) {
            connectedEdgesMap.set(outEdgeDataIndex, true);
            targetNodes.push(outEdge.node2);
          }
        }
      }
      return {
        edge: connectedEdgesMap.keys(),
        node: connectedNodesMap.keys()
      };
    };
    return GraphEdge2;
  }()
);
function createGraphDataProxyMixin(hostName, dataName) {
  return {
    /**
     * @param Default 'value'. can be 'a', 'b', 'c', 'd', 'e'.
     */
    getValue: function(dimension) {
      var data = this[hostName][dataName];
      return data.getStore().get(data.getDimensionIndex(dimension || "value"), this.dataIndex);
    },
    // TODO: TYPE stricter type.
    setVisual: function(key, value) {
      this.dataIndex >= 0 && this[hostName][dataName].setItemVisual(this.dataIndex, key, value);
    },
    getVisual: function(key) {
      return this[hostName][dataName].getItemVisual(this.dataIndex, key);
    },
    setLayout: function(layout2, merge2) {
      this.dataIndex >= 0 && this[hostName][dataName].setItemLayout(this.dataIndex, layout2, merge2);
    },
    getLayout: function() {
      return this[hostName][dataName].getItemLayout(this.dataIndex);
    },
    getGraphicEl: function() {
      return this[hostName][dataName].getItemGraphicEl(this.dataIndex);
    },
    getRawIndex: function() {
      return this[hostName][dataName].getRawIndex(this.dataIndex);
    }
  };
}
mixin(GraphNode, createGraphDataProxyMixin("hostGraph", "data"));
mixin(GraphEdge, createGraphDataProxyMixin("hostGraph", "edgeData"));
function createGraphFromNodeEdge(nodes, edges, seriesModel, directed, beforeLink) {
  var graph = new Graph(directed);
  for (var i = 0; i < nodes.length; i++) {
    graph.addNode(retrieve(
      // Id, name, dataIndex
      nodes[i].id,
      nodes[i].name,
      i
    ), i);
  }
  var linkNameList = [];
  var validEdges = [];
  var linkCount = 0;
  for (var i = 0; i < edges.length; i++) {
    var link = edges[i];
    var source = link.source;
    var target = link.target;
    if (graph.addEdge(source, target, linkCount)) {
      validEdges.push(link);
      linkNameList.push(retrieve(convertOptionIdName(link.id, null), source + " > " + target));
      linkCount++;
    }
  }
  var coordSys = seriesModel.get("coordinateSystem");
  var nodeData;
  if (coordSys === "cartesian2d" || coordSys === "polar" || coordSys === "matrix") {
    nodeData = createSeriesData(nodes, seriesModel);
  } else {
    var coordSysCtor = CoordinateSystemManager.get(coordSys);
    var coordDimensions = coordSysCtor ? coordSysCtor.dimensions || [] : [];
    if (indexOf(coordDimensions, "value") < 0) {
      coordDimensions.concat(["value"]);
    }
    var dimensions = prepareSeriesDataSchema(nodes, {
      coordDimensions,
      encodeDefine: seriesModel.getEncode()
    }).dimensions;
    nodeData = new SeriesData(dimensions, seriesModel);
    nodeData.initData(nodes);
  }
  var edgeData = new SeriesData(["value"], seriesModel);
  edgeData.initData(validEdges, linkNameList);
  beforeLink && beforeLink(nodeData, edgeData);
  linkSeriesData({
    mainData: nodeData,
    struct: graph,
    structAttr: "graph",
    datas: {
      node: nodeData,
      edge: edgeData
    },
    datasAttr: {
      node: "data",
      edge: "edgeData"
    }
  });
  graph.update();
  return graph;
}
var GraphSeriesModel = (
  /** @class */
  function(_super) {
    __extends(GraphSeriesModel2, _super);
    function GraphSeriesModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = GraphSeriesModel2.type;
      _this.hasSymbolVisual = true;
      return _this;
    }
    GraphSeriesModel2.prototype.init = function(option) {
      _super.prototype.init.apply(this, arguments);
      var self = this;
      function getCategoriesData() {
        return self._categoriesData;
      }
      this.legendVisualProvider = new LegendVisualProvider(getCategoriesData, getCategoriesData);
      this.fillDataTextStyle(option.edges || option.links);
      this._updateCategoriesData();
    };
    GraphSeriesModel2.prototype.mergeOption = function(option) {
      _super.prototype.mergeOption.apply(this, arguments);
      this.fillDataTextStyle(option.edges || option.links);
      this._updateCategoriesData();
    };
    GraphSeriesModel2.prototype.mergeDefaultAndTheme = function(option) {
      _super.prototype.mergeDefaultAndTheme.apply(this, arguments);
      defaultEmphasis(option, "edgeLabel", ["show"]);
    };
    GraphSeriesModel2.prototype.getInitialData = function(option, ecModel) {
      var edges = option.edges || option.links || [];
      var nodes = option.data || option.nodes || [];
      var self = this;
      if (nodes && edges) {
        initCurvenessList(this);
        var graph = createGraphFromNodeEdge(nodes, edges, this, true, beforeLink);
        each$4(graph.edges, function(edge) {
          createEdgeMapForCurveness(edge.node1, edge.node2, this, edge.dataIndex);
        }, this);
        return graph.data;
      }
      function beforeLink(nodeData, edgeData) {
        nodeData.wrapMethod("getItemModel", function(model) {
          var categoriesModels = self._categoriesModels;
          var categoryIdx = model.getShallow("category");
          var categoryModel = categoriesModels[categoryIdx];
          if (categoryModel) {
            categoryModel.parentModel = model.parentModel;
            model.parentModel = categoryModel;
          }
          return model;
        });
        var oldGetModel = Model.prototype.getModel;
        function newGetModel(path, parentModel) {
          var model = oldGetModel.call(this, path, parentModel);
          model.resolveParentPath = resolveParentPath;
          return model;
        }
        edgeData.wrapMethod("getItemModel", function(model) {
          model.resolveParentPath = resolveParentPath;
          model.getModel = newGetModel;
          return model;
        });
        function resolveParentPath(pathArr) {
          if (pathArr && (pathArr[0] === "label" || pathArr[1] === "label")) {
            var newPathArr = pathArr.slice();
            if (pathArr[0] === "label") {
              newPathArr[0] = "edgeLabel";
            } else if (pathArr[1] === "label") {
              newPathArr[1] = "edgeLabel";
            }
            return newPathArr;
          }
          return pathArr;
        }
      }
    };
    GraphSeriesModel2.prototype.getGraph = function() {
      return this.getData().graph;
    };
    GraphSeriesModel2.prototype.getEdgeData = function() {
      return this.getGraph().edgeData;
    };
    GraphSeriesModel2.prototype.getCategoriesData = function() {
      return this._categoriesData;
    };
    GraphSeriesModel2.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
      if (dataType === "edge") {
        var nodeData = this.getData();
        var params = this.getDataParams(dataIndex, dataType);
        var edge = nodeData.graph.getEdgeByIndex(dataIndex);
        var sourceName = nodeData.getName(edge.node1.dataIndex);
        var targetName = nodeData.getName(edge.node2.dataIndex);
        var nameArr = [];
        sourceName != null && nameArr.push(sourceName);
        targetName != null && nameArr.push(targetName);
        return createTooltipMarkup("nameValue", {
          name: nameArr.join(" > "),
          value: params.value,
          noValue: params.value == null
        });
      }
      var nodeMarkup = defaultSeriesFormatTooltip({
        series: this,
        dataIndex,
        multipleSeries
      });
      return nodeMarkup;
    };
    GraphSeriesModel2.prototype._updateCategoriesData = function() {
      var categories = map$1(this.option.categories || [], function(category) {
        return category.value != null ? category : extend({
          value: 0
        }, category);
      });
      var categoriesData = new SeriesData(["value"], this);
      categoriesData.initData(categories);
      this._categoriesData = categoriesData;
      this._categoriesModels = categoriesData.mapArray(function(idx) {
        return categoriesData.getItemModel(idx);
      });
    };
    GraphSeriesModel2.prototype.setZoom = function(zoom) {
      this.option.zoom = zoom;
    };
    GraphSeriesModel2.prototype.setCenter = function(center) {
      this.option.center = center;
    };
    GraphSeriesModel2.prototype.isAnimationEnabled = function() {
      return _super.prototype.isAnimationEnabled.call(this) && !(this.get("layout") === "force" && this.get(["force", "layoutAnimation"]));
    };
    GraphSeriesModel2.type = "series.graph";
    GraphSeriesModel2.dependencies = ["grid", "polar", "geo", "singleAxis", "calendar"];
    GraphSeriesModel2.defaultOption = {
      // zlevel: 0,
      z: 2,
      coordinateSystem: "view",
      // Default option for all coordinate systems
      // xAxisIndex: 0,
      // yAxisIndex: 0,
      // polarIndex: 0,
      // geoIndex: 0,
      legendHoverLink: true,
      layout: null,
      // Configuration of circular layout
      circular: {
        rotateLabel: false
      },
      // Configuration of force directed layout
      force: {
        initLayout: null,
        // Node repulsion. Can be an array to represent range.
        repulsion: [0, 50],
        gravity: 0.1,
        // Initial friction
        friction: 0.6,
        // Edge length. Can be an array to represent range.
        edgeLength: 30,
        layoutAnimation: true
      },
      left: "center",
      top: "center",
      // right: null,
      // bottom: null,
      // width: '80%',
      // height: '80%',
      symbol: "circle",
      symbolSize: 10,
      edgeSymbol: ["none", "none"],
      edgeSymbolSize: 10,
      edgeLabel: {
        position: "middle",
        distance: 5
      },
      draggable: false,
      roam: false,
      // Default on center of graph
      center: null,
      zoom: 1,
      // Symbol size scale ratio in roam
      nodeScaleRatio: 0.6,
      // cursor: null,
      // categories: [],
      // data: []
      // Or
      // nodes: []
      //
      // links: []
      // Or
      // edges: []
      label: {
        show: false,
        formatter: "{b}"
      },
      itemStyle: {},
      lineStyle: {
        // Don't use tokens.color.border because of the opacity
        color: tokens.color.neutral50,
        width: 1,
        opacity: 0.5
      },
      emphasis: {
        scale: true,
        label: {
          show: true
        }
      },
      select: {
        itemStyle: {
          borderColor: tokens.color.primary
        }
      }
    };
    return GraphSeriesModel2;
  }(SeriesModel)
);
function install$8(registers) {
  registers.registerChartView(GraphView);
  registers.registerSeriesModel(GraphSeriesModel);
  registers.registerProcessor(categoryFilter);
  registers.registerVisual(categoryVisual);
  registers.registerVisual(graphEdgeVisual);
  registers.registerLayout(graphSimpleLayout);
  registers.registerLayout(registers.PRIORITY.VISUAL.POST_CHART_LAYOUT, graphCircularLayout);
  registers.registerLayout(graphForceLayout);
  registers.registerCoordinateSystem("graphView", {
    dimensions: View.dimensions,
    create: createViewCoordSys
  });
  registers.registerAction({
    type: "focusNodeAdjacency",
    event: "focusNodeAdjacency",
    update: "series:focusNodeAdjacency"
  }, noop);
  registers.registerAction({
    type: "unfocusNodeAdjacency",
    event: "unfocusNodeAdjacency",
    update: "series:unfocusNodeAdjacency"
  }, noop);
  registers.registerAction({
    type: "graphRoam",
    event: "graphRoam",
    update: "none"
  }, function(payload, ecModel, api) {
    ecModel.eachComponent({
      mainType: "series",
      query: payload
    }, function(seriesModel) {
      var graphView = api.getViewOfSeriesModel(seriesModel);
      if (graphView) {
        if (payload.dx != null && payload.dy != null) {
          graphView.updateViewOnPan(seriesModel, api, payload);
        }
        if (payload.zoom != null && payload.originX != null && payload.originY != null) {
          graphView.updateViewOnZoom(seriesModel, api, payload);
        }
      }
      var coordSys = seriesModel.coordinateSystem;
      var res = updateCenterAndZoomInAction(coordSys, payload, seriesModel.get("scaleLimit"));
      seriesModel.setCenter && seriesModel.setCenter(res.center);
      seriesModel.setZoom && seriesModel.setZoom(res.zoom);
    });
  });
}
var inner$2 = makeInner();
var clone = clone$1;
var bind = bind$1;
var BaseAxisPointer = (
  /** @class */
  function() {
    function BaseAxisPointer2() {
      this._dragging = false;
      this.animationThreshold = 15;
    }
    BaseAxisPointer2.prototype.render = function(axisModel, axisPointerModel, api, forceRender) {
      var value = axisPointerModel.get("value");
      var status = axisPointerModel.get("status");
      this._axisModel = axisModel;
      this._axisPointerModel = axisPointerModel;
      this._api = api;
      if (!forceRender && this._lastValue === value && this._lastStatus === status) {
        return;
      }
      this._lastValue = value;
      this._lastStatus = status;
      var group = this._group;
      var handle = this._handle;
      if (!status || status === "hide") {
        group && group.hide();
        handle && handle.hide();
        return;
      }
      group && group.show();
      handle && handle.show();
      var elOption = {};
      this.makeElOption(elOption, value, axisModel, axisPointerModel, api);
      var graphicKey = elOption.graphicKey;
      if (graphicKey !== this._lastGraphicKey) {
        this.clear(api);
      }
      this._lastGraphicKey = graphicKey;
      var moveAnimation = this._moveAnimation = this.determineAnimation(axisModel, axisPointerModel);
      if (!group) {
        group = this._group = new Group$2();
        this.createPointerEl(group, elOption, axisModel, axisPointerModel);
        this.createLabelEl(group, elOption, axisModel, axisPointerModel);
        api.getZr().add(group);
      } else {
        var doUpdateProps = curry$1(updateProps, axisPointerModel, moveAnimation);
        this.updatePointerEl(group, elOption, doUpdateProps);
        this.updateLabelEl(group, elOption, doUpdateProps, axisPointerModel);
      }
      updateMandatoryProps(group, axisPointerModel, true);
      this._renderHandle(value);
    };
    BaseAxisPointer2.prototype.remove = function(api) {
      this.clear(api);
    };
    BaseAxisPointer2.prototype.dispose = function(api) {
      this.clear(api);
    };
    BaseAxisPointer2.prototype.determineAnimation = function(axisModel, axisPointerModel) {
      var animation = axisPointerModel.get("animation");
      var axis = axisModel.axis;
      var isCategoryAxis = axis.type === "category";
      var useSnap = axisPointerModel.get("snap");
      if (!useSnap && !isCategoryAxis) {
        return false;
      }
      if (animation === "auto" || animation == null) {
        var animationThreshold = this.animationThreshold;
        if (isCategoryAxis && axis.getBandWidth() > animationThreshold) {
          return true;
        }
        if (useSnap) {
          var seriesDataCount = getAxisInfo(axisModel).seriesDataCount;
          var axisExtent = axis.getExtent();
          return Math.abs(axisExtent[0] - axisExtent[1]) / seriesDataCount > animationThreshold;
        }
        return false;
      }
      return animation === true;
    };
    BaseAxisPointer2.prototype.makeElOption = function(elOption, value, axisModel, axisPointerModel, api) {
    };
    BaseAxisPointer2.prototype.createPointerEl = function(group, elOption, axisModel, axisPointerModel) {
      var pointerOption = elOption.pointer;
      if (pointerOption) {
        var pointerEl = inner$2(group).pointerEl = new graphic[pointerOption.type](clone(elOption.pointer));
        group.add(pointerEl);
      }
    };
    BaseAxisPointer2.prototype.createLabelEl = function(group, elOption, axisModel, axisPointerModel) {
      if (elOption.label) {
        var labelEl = inner$2(group).labelEl = new ZRText(clone(elOption.label));
        group.add(labelEl);
        updateLabelShowHide(labelEl, axisPointerModel);
      }
    };
    BaseAxisPointer2.prototype.updatePointerEl = function(group, elOption, updateProps2) {
      var pointerEl = inner$2(group).pointerEl;
      if (pointerEl && elOption.pointer) {
        pointerEl.setStyle(elOption.pointer.style);
        updateProps2(pointerEl, {
          shape: elOption.pointer.shape
        });
      }
    };
    BaseAxisPointer2.prototype.updateLabelEl = function(group, elOption, updateProps2, axisPointerModel) {
      var labelEl = inner$2(group).labelEl;
      if (labelEl) {
        labelEl.setStyle(elOption.label.style);
        updateProps2(labelEl, {
          // Consider text length change in vertical axis, animation should
          // be used on shape, otherwise the effect will be weird.
          // TODOTODO
          // shape: elOption.label.shape,
          x: elOption.label.x,
          y: elOption.label.y
        });
        updateLabelShowHide(labelEl, axisPointerModel);
      }
    };
    BaseAxisPointer2.prototype._renderHandle = function(value) {
      if (this._dragging || !this.updateHandleTransform) {
        return;
      }
      var axisPointerModel = this._axisPointerModel;
      var zr = this._api.getZr();
      var handle = this._handle;
      var handleModel = axisPointerModel.getModel("handle");
      var status = axisPointerModel.get("status");
      if (!handleModel.get("show") || !status || status === "hide") {
        handle && zr.remove(handle);
        this._handle = null;
        return;
      }
      var isInit;
      if (!this._handle) {
        isInit = true;
        handle = this._handle = createIcon(handleModel.get("icon"), {
          cursor: "move",
          draggable: true,
          onmousemove: function(e) {
            stop(e.event);
          },
          onmousedown: bind(this._onHandleDragMove, this, 0, 0),
          drift: bind(this._onHandleDragMove, this),
          ondragend: bind(this._onHandleDragEnd, this)
        });
        zr.add(handle);
      }
      updateMandatoryProps(handle, axisPointerModel, false);
      handle.setStyle(handleModel.getItemStyle(null, ["color", "borderColor", "borderWidth", "opacity", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"]));
      var handleSize = handleModel.get("size");
      if (!isArray(handleSize)) {
        handleSize = [handleSize, handleSize];
      }
      handle.scaleX = handleSize[0] / 2;
      handle.scaleY = handleSize[1] / 2;
      createOrUpdate(this, "_doDispatchAxisPointer", handleModel.get("throttle") || 0, "fixRate");
      this._moveHandleToValue(value, isInit);
    };
    BaseAxisPointer2.prototype._moveHandleToValue = function(value, isInit) {
      updateProps(this._axisPointerModel, !isInit && this._moveAnimation, this._handle, getHandleTransProps(this.getHandleTransform(value, this._axisModel, this._axisPointerModel)));
    };
    BaseAxisPointer2.prototype._onHandleDragMove = function(dx, dy) {
      var handle = this._handle;
      if (!handle) {
        return;
      }
      this._dragging = true;
      var trans = this.updateHandleTransform(getHandleTransProps(handle), [dx, dy], this._axisModel, this._axisPointerModel);
      this._payloadInfo = trans;
      handle.stopAnimation();
      handle.attr(getHandleTransProps(trans));
      inner$2(handle).lastProp = null;
      this._doDispatchAxisPointer();
    };
    BaseAxisPointer2.prototype._doDispatchAxisPointer = function() {
      var handle = this._handle;
      if (!handle) {
        return;
      }
      var payloadInfo = this._payloadInfo;
      var axisModel = this._axisModel;
      this._api.dispatchAction({
        type: "updateAxisPointer",
        x: payloadInfo.cursorPoint[0],
        y: payloadInfo.cursorPoint[1],
        tooltipOption: payloadInfo.tooltipOption,
        axesInfo: [{
          axisDim: axisModel.axis.dim,
          axisIndex: axisModel.componentIndex
        }]
      });
    };
    BaseAxisPointer2.prototype._onHandleDragEnd = function() {
      this._dragging = false;
      var handle = this._handle;
      if (!handle) {
        return;
      }
      var value = this._axisPointerModel.get("value");
      this._moveHandleToValue(value);
      this._api.dispatchAction({
        type: "hideTip"
      });
    };
    BaseAxisPointer2.prototype.clear = function(api) {
      this._lastValue = null;
      this._lastStatus = null;
      var zr = api.getZr();
      var group = this._group;
      var handle = this._handle;
      if (zr && group) {
        this._lastGraphicKey = null;
        group && zr.remove(group);
        handle && zr.remove(handle);
        this._group = null;
        this._handle = null;
        this._payloadInfo = null;
      }
      clear(this, "_doDispatchAxisPointer");
    };
    BaseAxisPointer2.prototype.doClear = function() {
    };
    BaseAxisPointer2.prototype.buildLabel = function(xy, wh, xDimIndex) {
      xDimIndex = xDimIndex || 0;
      return {
        x: xy[xDimIndex],
        y: xy[1 - xDimIndex],
        width: wh[xDimIndex],
        height: wh[1 - xDimIndex]
      };
    };
    return BaseAxisPointer2;
  }()
);
function updateProps(animationModel, moveAnimation, el, props) {
  if (!propsEqual(inner$2(el).lastProp, props)) {
    inner$2(el).lastProp = props;
    moveAnimation ? updateProps$1(el, props, animationModel) : (el.stopAnimation(), el.attr(props));
  }
}
function propsEqual(lastProps, newProps) {
  if (isObject$2(lastProps) && isObject$2(newProps)) {
    var equals_1 = true;
    each$4(newProps, function(item, key) {
      equals_1 = equals_1 && propsEqual(lastProps[key], item);
    });
    return !!equals_1;
  } else {
    return lastProps === newProps;
  }
}
function updateLabelShowHide(labelEl, axisPointerModel) {
  labelEl[axisPointerModel.get(["label", "show"]) ? "show" : "hide"]();
}
function getHandleTransProps(trans) {
  return {
    x: trans.x || 0,
    y: trans.y || 0,
    rotation: trans.rotation || 0
  };
}
function updateMandatoryProps(group, axisPointerModel, silent) {
  var z = axisPointerModel.get("z");
  var zlevel = axisPointerModel.get("zlevel");
  group && group.traverse(function(el) {
    if (el.type !== "group") {
      z != null && (el.z = z);
      zlevel != null && (el.zlevel = zlevel);
      el.silent = silent;
    }
  });
}
function buildElStyle(axisPointerModel) {
  var axisPointerType = axisPointerModel.get("type");
  var styleModel = axisPointerModel.getModel(axisPointerType + "Style");
  var style;
  if (axisPointerType === "line") {
    style = styleModel.getLineStyle();
    style.fill = null;
  } else if (axisPointerType === "shadow") {
    style = styleModel.getAreaStyle();
    style.stroke = null;
  }
  return style;
}
function buildLabelElOption(elOption, axisModel, axisPointerModel, api, labelPos) {
  var value = axisPointerModel.get("value");
  var text = getValueLabel(value, axisModel.axis, axisModel.ecModel, axisPointerModel.get("seriesDataIndices"), {
    precision: axisPointerModel.get(["label", "precision"]),
    formatter: axisPointerModel.get(["label", "formatter"])
  });
  var labelModel = axisPointerModel.getModel("label");
  var paddings = normalizeCssArray(labelModel.get("padding") || 0);
  var font = labelModel.getFont();
  var textRect = getBoundingRect(text, font);
  var position = labelPos.position;
  var width = textRect.width + paddings[1] + paddings[3];
  var height = textRect.height + paddings[0] + paddings[2];
  var align = labelPos.align;
  align === "right" && (position[0] -= width);
  align === "center" && (position[0] -= width / 2);
  var verticalAlign = labelPos.verticalAlign;
  verticalAlign === "bottom" && (position[1] -= height);
  verticalAlign === "middle" && (position[1] -= height / 2);
  confineInContainer(position, width, height, api);
  var bgColor = labelModel.get("backgroundColor");
  if (!bgColor || bgColor === "auto") {
    bgColor = axisModel.get(["axisLine", "lineStyle", "color"]);
  }
  elOption.label = {
    // shape: {x: 0, y: 0, width: width, height: height, r: labelModel.get('borderRadius')},
    x: position[0],
    y: position[1],
    style: createTextStyle(labelModel, {
      text,
      font,
      fill: labelModel.getTextColor(),
      padding: paddings,
      backgroundColor: bgColor
    }),
    // Label should be over axisPointer.
    z2: 10
  };
}
function confineInContainer(position, width, height, api) {
  var viewWidth = api.getWidth();
  var viewHeight = api.getHeight();
  position[0] = Math.min(position[0] + width, viewWidth) - width;
  position[1] = Math.min(position[1] + height, viewHeight) - height;
  position[0] = Math.max(position[0], 0);
  position[1] = Math.max(position[1], 0);
}
function getValueLabel(value, axis, ecModel, seriesDataIndices, opt) {
  value = axis.scale.parse(value);
  var text = axis.scale.getLabel({
    value
  }, {
    // If `precision` is set, width can be fixed (like '12.00500'), which
    // helps to debounce when when moving label.
    precision: opt.precision
  });
  var formatter = opt.formatter;
  if (formatter) {
    var params_1 = {
      value: getAxisRawValue(axis, {
        value
      }),
      axisDimension: axis.dim,
      axisIndex: axis.index,
      seriesData: []
    };
    each$4(seriesDataIndices, function(idxItem) {
      var series = ecModel.getSeriesByIndex(idxItem.seriesIndex);
      var dataIndex = idxItem.dataIndexInside;
      var dataParams = series && series.getDataParams(dataIndex);
      dataParams && params_1.seriesData.push(dataParams);
    });
    if (isString(formatter)) {
      text = formatter.replace("{value}", text);
    } else if (isFunction(formatter)) {
      text = formatter(params_1);
    }
  }
  return text;
}
function getTransformedPosition(axis, value, layoutInfo) {
  var transform = create();
  rotate(transform, transform, layoutInfo.rotation);
  translate(transform, transform, layoutInfo.position);
  return applyTransform([axis.dataToCoord(value), (layoutInfo.labelOffset || 0) + (layoutInfo.labelDirection || 1) * (layoutInfo.labelMargin || 0)], transform);
}
function buildCartesianSingleLabelElOption(value, elOption, layoutInfo, axisModel, axisPointerModel, api) {
  var textLayout = AxisBuilder.innerTextLayout(layoutInfo.rotation, 0, layoutInfo.labelDirection);
  layoutInfo.labelMargin = axisPointerModel.get(["label", "margin"]);
  buildLabelElOption(elOption, axisModel, axisPointerModel, api, {
    position: getTransformedPosition(axisModel.axis, value, layoutInfo),
    align: textLayout.textAlign,
    verticalAlign: textLayout.textVerticalAlign
  });
}
function makeLineShape(p1, p2, xDimIndex) {
  xDimIndex = xDimIndex || 0;
  return {
    x1: p1[xDimIndex],
    y1: p1[1 - xDimIndex],
    x2: p2[xDimIndex],
    y2: p2[1 - xDimIndex]
  };
}
function makeRectShape(xy, wh, xDimIndex) {
  xDimIndex = xDimIndex || 0;
  return {
    x: xy[xDimIndex],
    y: xy[1 - xDimIndex],
    width: wh[xDimIndex],
    height: wh[1 - xDimIndex]
  };
}
var CartesianAxisPointer = (
  /** @class */
  function(_super) {
    __extends(CartesianAxisPointer2, _super);
    function CartesianAxisPointer2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    CartesianAxisPointer2.prototype.makeElOption = function(elOption, value, axisModel, axisPointerModel, api) {
      var axis = axisModel.axis;
      var grid = axis.grid;
      var axisPointerType = axisPointerModel.get("type");
      var otherExtent = getCartesian(grid, axis).getOtherAxis(axis).getGlobalExtent();
      var pixelValue = axis.toGlobalCoord(axis.dataToCoord(value, true));
      if (axisPointerType && axisPointerType !== "none") {
        var elStyle = buildElStyle(axisPointerModel);
        var pointerOption = pointerShapeBuilder[axisPointerType](axis, pixelValue, otherExtent);
        pointerOption.style = elStyle;
        elOption.graphicKey = pointerOption.type;
        elOption.pointer = pointerOption;
      }
      var layoutInfo = layout(grid.getRect(), axisModel);
      buildCartesianSingleLabelElOption(value, elOption, layoutInfo, axisModel, axisPointerModel, api);
    };
    CartesianAxisPointer2.prototype.getHandleTransform = function(value, axisModel, axisPointerModel) {
      var layoutInfo = layout(axisModel.axis.grid.getRect(), axisModel, {
        labelInside: false
      });
      layoutInfo.labelMargin = axisPointerModel.get(["handle", "margin"]);
      var pos = getTransformedPosition(axisModel.axis, value, layoutInfo);
      return {
        x: pos[0],
        y: pos[1],
        rotation: layoutInfo.rotation + (layoutInfo.labelDirection < 0 ? Math.PI : 0)
      };
    };
    CartesianAxisPointer2.prototype.updateHandleTransform = function(transform, delta, axisModel, axisPointerModel) {
      var axis = axisModel.axis;
      var grid = axis.grid;
      var axisExtent = axis.getGlobalExtent(true);
      var otherExtent = getCartesian(grid, axis).getOtherAxis(axis).getGlobalExtent();
      var dimIndex = axis.dim === "x" ? 0 : 1;
      var currPosition = [transform.x, transform.y];
      currPosition[dimIndex] += delta[dimIndex];
      currPosition[dimIndex] = Math.min(axisExtent[1], currPosition[dimIndex]);
      currPosition[dimIndex] = Math.max(axisExtent[0], currPosition[dimIndex]);
      var cursorOtherValue = (otherExtent[1] + otherExtent[0]) / 2;
      var cursorPoint = [cursorOtherValue, cursorOtherValue];
      cursorPoint[dimIndex] = currPosition[dimIndex];
      var tooltipOptions = [{
        verticalAlign: "middle"
      }, {
        align: "center"
      }];
      return {
        x: currPosition[0],
        y: currPosition[1],
        rotation: transform.rotation,
        cursorPoint,
        tooltipOption: tooltipOptions[dimIndex]
      };
    };
    return CartesianAxisPointer2;
  }(BaseAxisPointer)
);
function getCartesian(grid, axis) {
  var opt = {};
  opt[axis.dim + "AxisIndex"] = axis.index;
  return grid.getCartesian(opt);
}
var pointerShapeBuilder = {
  line: function(axis, pixelValue, otherExtent) {
    var targetShape = makeLineShape([pixelValue, otherExtent[0]], [pixelValue, otherExtent[1]], getAxisDimIndex(axis));
    return {
      type: "Line",
      subPixelOptimize: true,
      shape: targetShape
    };
  },
  shadow: function(axis, pixelValue, otherExtent) {
    var bandWidth = Math.max(1, axis.getBandWidth());
    var span = otherExtent[1] - otherExtent[0];
    return {
      type: "Rect",
      shape: makeRectShape([pixelValue - bandWidth / 2, otherExtent[0]], [bandWidth, span], getAxisDimIndex(axis))
    };
  }
};
function getAxisDimIndex(axis) {
  return axis.dim === "x" ? 0 : 1;
}
var AxisPointerModel = (
  /** @class */
  function(_super) {
    __extends(AxisPointerModel2, _super);
    function AxisPointerModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = AxisPointerModel2.type;
      return _this;
    }
    AxisPointerModel2.type = "axisPointer";
    AxisPointerModel2.defaultOption = {
      // 'auto' means that show when triggered by tooltip or handle.
      show: "auto",
      // zlevel: 0,
      z: 50,
      type: "line",
      // axispointer triggered by tootip determine snap automatically,
      // see `modelHelper`.
      snap: false,
      triggerTooltip: true,
      triggerEmphasis: true,
      value: null,
      status: null,
      link: [],
      // Do not set 'auto' here, otherwise global animation: false
      // will not effect at this axispointer.
      animation: null,
      animationDurationUpdate: 200,
      lineStyle: {
        color: tokens.color.border,
        width: 1,
        type: "dashed"
      },
      shadowStyle: {
        color: tokens.color.shadowTint
      },
      label: {
        show: true,
        formatter: null,
        precision: "auto",
        margin: 3,
        color: tokens.color.neutral00,
        padding: [5, 7, 5, 7],
        backgroundColor: tokens.color.accent60,
        borderColor: null,
        borderWidth: 0,
        borderRadius: 3
      },
      handle: {
        show: false,
        // eslint-disable-next-line
        icon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z",
        size: 45,
        // handle margin is from symbol center to axis, which is stable when circular move.
        margin: 50,
        // color: '#1b8bbd'
        // color: '#2f4554'
        color: tokens.color.accent40,
        // For mobile performance
        throttle: 40
      }
    };
    return AxisPointerModel2;
  }(ComponentModel)
);
var inner$1 = makeInner();
var each$1 = each$4;
function register(key, api, handler) {
  if (env.node) {
    return;
  }
  var zr = api.getZr();
  inner$1(zr).records || (inner$1(zr).records = {});
  initGlobalListeners(zr, api);
  var record = inner$1(zr).records[key] || (inner$1(zr).records[key] = {});
  record.handler = handler;
}
function initGlobalListeners(zr, api) {
  if (inner$1(zr).initialized) {
    return;
  }
  inner$1(zr).initialized = true;
  useHandler("click", curry$1(doEnter, "click"));
  useHandler("mousemove", curry$1(doEnter, "mousemove"));
  useHandler("globalout", onLeave);
  function useHandler(eventType, cb) {
    zr.on(eventType, function(e) {
      var dis = makeDispatchAction$1(api);
      each$1(inner$1(zr).records, function(record) {
        record && cb(record, e, dis.dispatchAction);
      });
      dispatchTooltipFinally(dis.pendings, api);
    });
  }
}
function dispatchTooltipFinally(pendings, api) {
  var showLen = pendings.showTip.length;
  var hideLen = pendings.hideTip.length;
  var actuallyPayload;
  if (showLen) {
    actuallyPayload = pendings.showTip[showLen - 1];
  } else if (hideLen) {
    actuallyPayload = pendings.hideTip[hideLen - 1];
  }
  if (actuallyPayload) {
    actuallyPayload.dispatchAction = null;
    api.dispatchAction(actuallyPayload);
  }
}
function onLeave(record, e, dispatchAction) {
  record.handler("leave", null, dispatchAction);
}
function doEnter(currTrigger, record, e, dispatchAction) {
  record.handler(currTrigger, e, dispatchAction);
}
function makeDispatchAction$1(api) {
  var pendings = {
    showTip: [],
    hideTip: []
  };
  var dispatchAction = function(payload) {
    var pendingList = pendings[payload.type];
    if (pendingList) {
      pendingList.push(payload);
    } else {
      payload.dispatchAction = dispatchAction;
      api.dispatchAction(payload);
    }
  };
  return {
    dispatchAction,
    pendings
  };
}
function unregister(key, api) {
  if (env.node) {
    return;
  }
  var zr = api.getZr();
  var record = (inner$1(zr).records || {})[key];
  if (record) {
    inner$1(zr).records[key] = null;
  }
}
var AxisPointerView = (
  /** @class */
  function(_super) {
    __extends(AxisPointerView2, _super);
    function AxisPointerView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = AxisPointerView2.type;
      return _this;
    }
    AxisPointerView2.prototype.render = function(globalAxisPointerModel, ecModel, api) {
      var globalTooltipModel = ecModel.getComponent("tooltip");
      var triggerOn = globalAxisPointerModel.get("triggerOn") || globalTooltipModel && globalTooltipModel.get("triggerOn") || "mousemove|click";
      register("axisPointer", api, function(currTrigger, e, dispatchAction) {
        if (triggerOn !== "none" && (currTrigger === "leave" || triggerOn.indexOf(currTrigger) >= 0)) {
          dispatchAction({
            type: "updateAxisPointer",
            currTrigger,
            x: e && e.offsetX,
            y: e && e.offsetY
          });
        }
      });
    };
    AxisPointerView2.prototype.remove = function(ecModel, api) {
      unregister("axisPointer", api);
    };
    AxisPointerView2.prototype.dispose = function(ecModel, api) {
      unregister("axisPointer", api);
    };
    AxisPointerView2.type = "axisPointer";
    return AxisPointerView2;
  }(ComponentView)
);
function findPointFromSeries(finder, ecModel) {
  var point = [];
  var seriesIndex = finder.seriesIndex;
  var seriesModel;
  if (seriesIndex == null || !(seriesModel = ecModel.getSeriesByIndex(seriesIndex))) {
    return {
      point: []
    };
  }
  var data = seriesModel.getData();
  var dataIndex = queryDataIndex(data, finder);
  if (dataIndex == null || dataIndex < 0 || isArray(dataIndex)) {
    return {
      point: []
    };
  }
  var el = data.getItemGraphicEl(dataIndex);
  var coordSys = seriesModel.coordinateSystem;
  if (seriesModel.getTooltipPosition) {
    point = seriesModel.getTooltipPosition(dataIndex) || [];
  } else if (coordSys && coordSys.dataToPoint) {
    if (finder.isStacked) {
      var baseAxis = coordSys.getBaseAxis();
      var valueAxis2 = coordSys.getOtherAxis(baseAxis);
      var valueAxisDim = valueAxis2.dim;
      var baseAxisDim = baseAxis.dim;
      var baseDataOffset = valueAxisDim === "x" || valueAxisDim === "radius" ? 1 : 0;
      var baseDim = data.mapDimension(baseAxisDim);
      var stackedData = [];
      stackedData[baseDataOffset] = data.get(baseDim, dataIndex);
      stackedData[1 - baseDataOffset] = data.get(data.getCalculationInfo("stackResultDimension"), dataIndex);
      point = coordSys.dataToPoint(stackedData) || [];
    } else {
      point = coordSys.dataToPoint(data.getValues(map$1(coordSys.dimensions, function(dim) {
        return data.mapDimension(dim);
      }), dataIndex)) || [];
    }
  } else if (el) {
    var rect = el.getBoundingRect().clone();
    rect.applyTransform(el.transform);
    point = [rect.x + rect.width / 2, rect.y + rect.height / 2];
  }
  return {
    point,
    el
  };
}
var inner = makeInner();
function axisTrigger(payload, ecModel, api) {
  var currTrigger = payload.currTrigger;
  var point = [payload.x, payload.y];
  var finder = payload;
  var dispatchAction = payload.dispatchAction || bind$1(api.dispatchAction, api);
  var coordSysAxesInfo = ecModel.getComponent("axisPointer").coordSysAxesInfo;
  if (!coordSysAxesInfo) {
    return;
  }
  if (illegalPoint(point)) {
    point = findPointFromSeries({
      seriesIndex: finder.seriesIndex,
      // Do not use dataIndexInside from other ec instance.
      // FIXME: auto detect it?
      dataIndex: finder.dataIndex
    }, ecModel).point;
  }
  var isIllegalPoint = illegalPoint(point);
  var inputAxesInfo = finder.axesInfo;
  var axesInfo = coordSysAxesInfo.axesInfo;
  var shouldHide = currTrigger === "leave" || illegalPoint(point);
  var outputPayload = {};
  var showValueMap = {};
  var dataByCoordSys = {
    list: [],
    map: {}
  };
  var updaters = {
    showPointer: curry$1(showPointer, showValueMap),
    showTooltip: curry$1(showTooltip, dataByCoordSys)
  };
  each$4(coordSysAxesInfo.coordSysMap, function(coordSys, coordSysKey) {
    var coordSysContainsPoint = isIllegalPoint || coordSys.containPoint(point);
    each$4(coordSysAxesInfo.coordSysAxesInfo[coordSysKey], function(axisInfo, key) {
      var axis = axisInfo.axis;
      var inputAxisInfo = findInputAxisInfo(inputAxesInfo, axisInfo);
      if (!shouldHide && coordSysContainsPoint && (!inputAxesInfo || inputAxisInfo)) {
        var val = inputAxisInfo && inputAxisInfo.value;
        if (val == null && !isIllegalPoint) {
          val = axis.pointToData(point);
        }
        val != null && processOnAxis(axisInfo, val, updaters, false, outputPayload);
      }
    });
  });
  var linkTriggers = {};
  each$4(axesInfo, function(tarAxisInfo, tarKey) {
    var linkGroup = tarAxisInfo.linkGroup;
    if (linkGroup && !showValueMap[tarKey]) {
      each$4(linkGroup.axesInfo, function(srcAxisInfo, srcKey) {
        var srcValItem = showValueMap[srcKey];
        if (srcAxisInfo !== tarAxisInfo && srcValItem) {
          var val = srcValItem.value;
          linkGroup.mapper && (val = tarAxisInfo.axis.scale.parse(linkGroup.mapper(val, makeMapperParam(srcAxisInfo), makeMapperParam(tarAxisInfo))));
          linkTriggers[tarAxisInfo.key] = val;
        }
      });
    }
  });
  each$4(linkTriggers, function(val, tarKey) {
    processOnAxis(axesInfo[tarKey], val, updaters, true, outputPayload);
  });
  updateModelActually(showValueMap, axesInfo, outputPayload);
  dispatchTooltipActually(dataByCoordSys, point, payload, dispatchAction);
  dispatchHighDownActually(axesInfo, dispatchAction, api);
  return outputPayload;
}
function processOnAxis(axisInfo, newValue, updaters, noSnap, outputFinder) {
  var axis = axisInfo.axis;
  if (axis.scale.isBlank() || !axis.containData(newValue)) {
    return;
  }
  if (!axisInfo.involveSeries) {
    updaters.showPointer(axisInfo, newValue);
    return;
  }
  var payloadInfo = buildPayloadsBySeries(newValue, axisInfo);
  var payloadBatch = payloadInfo.payloadBatch;
  var snapToValue = payloadInfo.snapToValue;
  if (payloadBatch[0] && outputFinder.seriesIndex == null) {
    extend(outputFinder, payloadBatch[0]);
  }
  if (!noSnap && axisInfo.snap) {
    if (axis.containData(snapToValue) && snapToValue != null) {
      newValue = snapToValue;
    }
  }
  updaters.showPointer(axisInfo, newValue, payloadBatch);
  updaters.showTooltip(axisInfo, payloadInfo, snapToValue);
}
function buildPayloadsBySeries(value, axisInfo) {
  var axis = axisInfo.axis;
  var dim = axis.dim;
  var snapToValue = value;
  var payloadBatch = [];
  var minDist = Number.MAX_VALUE;
  var minDiff = -1;
  each$4(axisInfo.seriesModels, function(series, idx) {
    var dataDim = series.getData().mapDimensionsAll(dim);
    var seriesNestestValue;
    var dataIndices;
    if (series.getAxisTooltipData) {
      var result = series.getAxisTooltipData(dataDim, value, axis);
      dataIndices = result.dataIndices;
      seriesNestestValue = result.nestestValue;
    } else {
      dataIndices = series.indicesOfNearest(
        dim,
        dataDim[0],
        value,
        // Add a threshold to avoid find the wrong dataIndex
        // when data length is not same.
        // false,
        axis.type === "category" ? 0.5 : null
      );
      if (!dataIndices.length) {
        return;
      }
      seriesNestestValue = series.getData().get(dataDim[0], dataIndices[0]);
    }
    if (seriesNestestValue == null || !isFinite(seriesNestestValue)) {
      return;
    }
    var diff = value - seriesNestestValue;
    var dist = Math.abs(diff);
    if (dist <= minDist) {
      if (dist < minDist || diff >= 0 && minDiff < 0) {
        minDist = dist;
        minDiff = diff;
        snapToValue = seriesNestestValue;
        payloadBatch.length = 0;
      }
      each$4(dataIndices, function(dataIndex) {
        payloadBatch.push({
          seriesIndex: series.seriesIndex,
          dataIndexInside: dataIndex,
          dataIndex: series.getData().getRawIndex(dataIndex)
        });
      });
    }
  });
  return {
    payloadBatch,
    snapToValue
  };
}
function showPointer(showValueMap, axisInfo, value, payloadBatch) {
  showValueMap[axisInfo.key] = {
    value,
    payloadBatch
  };
}
function showTooltip(dataByCoordSys, axisInfo, payloadInfo, value) {
  var payloadBatch = payloadInfo.payloadBatch;
  var axis = axisInfo.axis;
  var axisModel = axis.model;
  var axisPointerModel = axisInfo.axisPointerModel;
  if (!axisInfo.triggerTooltip || !payloadBatch.length) {
    return;
  }
  var coordSysModel = axisInfo.coordSys.model;
  var coordSysKey = makeKey(coordSysModel);
  var coordSysItem = dataByCoordSys.map[coordSysKey];
  if (!coordSysItem) {
    coordSysItem = dataByCoordSys.map[coordSysKey] = {
      coordSysId: coordSysModel.id,
      coordSysIndex: coordSysModel.componentIndex,
      coordSysType: coordSysModel.type,
      coordSysMainType: coordSysModel.mainType,
      dataByAxis: []
    };
    dataByCoordSys.list.push(coordSysItem);
  }
  coordSysItem.dataByAxis.push({
    axisDim: axis.dim,
    axisIndex: axisModel.componentIndex,
    axisType: axisModel.type,
    axisId: axisModel.id,
    value,
    // Caustion: viewHelper.getValueLabel is actually on "view stage", which
    // depends that all models have been updated. So it should not be performed
    // here. Considering axisPointerModel used here is volatile, which is hard
    // to be retrieve in TooltipView, we prepare parameters here.
    valueLabelOpt: {
      precision: axisPointerModel.get(["label", "precision"]),
      formatter: axisPointerModel.get(["label", "formatter"])
    },
    seriesDataIndices: payloadBatch.slice()
  });
}
function updateModelActually(showValueMap, axesInfo, outputPayload) {
  var outputAxesInfo = outputPayload.axesInfo = [];
  each$4(axesInfo, function(axisInfo, key) {
    var option = axisInfo.axisPointerModel.option;
    var valItem = showValueMap[key];
    if (valItem) {
      !axisInfo.useHandle && (option.status = "show");
      option.value = valItem.value;
      option.seriesDataIndices = (valItem.payloadBatch || []).slice();
    } else {
      !axisInfo.useHandle && (option.status = "hide");
    }
    option.status === "show" && outputAxesInfo.push({
      axisDim: axisInfo.axis.dim,
      axisIndex: axisInfo.axis.model.componentIndex,
      value: option.value
    });
  });
}
function dispatchTooltipActually(dataByCoordSys, point, payload, dispatchAction) {
  if (illegalPoint(point) || !dataByCoordSys.list.length) {
    dispatchAction({
      type: "hideTip"
    });
    return;
  }
  var sampleItem = ((dataByCoordSys.list[0].dataByAxis[0] || {}).seriesDataIndices || [])[0] || {};
  dispatchAction({
    type: "showTip",
    escapeConnect: true,
    x: point[0],
    y: point[1],
    tooltipOption: payload.tooltipOption,
    position: payload.position,
    dataIndexInside: sampleItem.dataIndexInside,
    dataIndex: sampleItem.dataIndex,
    seriesIndex: sampleItem.seriesIndex,
    dataByCoordSys: dataByCoordSys.list
  });
}
function dispatchHighDownActually(axesInfo, dispatchAction, api) {
  var zr = api.getZr();
  var highDownKey = "axisPointerLastHighlights";
  var lastHighlights = inner(zr)[highDownKey] || {};
  var newHighlights = inner(zr)[highDownKey] = {};
  each$4(axesInfo, function(axisInfo, key) {
    var option = axisInfo.axisPointerModel.option;
    option.status === "show" && axisInfo.triggerEmphasis && each$4(option.seriesDataIndices, function(batchItem) {
      var key2 = batchItem.seriesIndex + " | " + batchItem.dataIndex;
      newHighlights[key2] = batchItem;
    });
  });
  var toHighlight = [];
  var toDownplay = [];
  each$4(lastHighlights, function(batchItem, key) {
    !newHighlights[key] && toDownplay.push(batchItem);
  });
  each$4(newHighlights, function(batchItem, key) {
    !lastHighlights[key] && toHighlight.push(batchItem);
  });
  toDownplay.length && api.dispatchAction({
    type: "downplay",
    escapeConnect: true,
    // Not blur others when highlight in axisPointer.
    notBlur: true,
    batch: toDownplay
  });
  toHighlight.length && api.dispatchAction({
    type: "highlight",
    escapeConnect: true,
    // Not blur others when highlight in axisPointer.
    notBlur: true,
    batch: toHighlight
  });
}
function findInputAxisInfo(inputAxesInfo, axisInfo) {
  for (var i = 0; i < (inputAxesInfo || []).length; i++) {
    var inputAxisInfo = inputAxesInfo[i];
    if (axisInfo.axis.dim === inputAxisInfo.axisDim && axisInfo.axis.model.componentIndex === inputAxisInfo.axisIndex) {
      return inputAxisInfo;
    }
  }
}
function makeMapperParam(axisInfo) {
  var axisModel = axisInfo.axis.model;
  var item = {};
  var dim = item.axisDim = axisInfo.axis.dim;
  item.axisIndex = item[dim + "AxisIndex"] = axisModel.componentIndex;
  item.axisName = item[dim + "AxisName"] = axisModel.name;
  item.axisId = item[dim + "AxisId"] = axisModel.id;
  return item;
}
function illegalPoint(point) {
  return !point || point[0] == null || isNaN(point[0]) || point[1] == null || isNaN(point[1]);
}
function install$7(registers) {
  AxisView.registerAxisPointerClass("CartesianAxisPointer", CartesianAxisPointer);
  registers.registerComponentModel(AxisPointerModel);
  registers.registerComponentView(AxisPointerView);
  registers.registerPreprocessor(function(option) {
    if (option) {
      (!option.axisPointer || option.axisPointer.length === 0) && (option.axisPointer = {});
      var link = option.axisPointer.link;
      if (link && !isArray(link)) {
        option.axisPointer.link = [link];
      }
    }
  });
  registers.registerProcessor(registers.PRIORITY.PROCESSOR.STATISTIC, function(ecModel, api) {
    ecModel.getComponent("axisPointer").coordSysAxesInfo = collect(ecModel, api);
  });
  registers.registerAction({
    type: "updateAxisPointer",
    event: "updateAxisPointer",
    update: ":updateAxisPointer"
  }, axisTrigger);
}
function install$6(registers) {
  use(install$9);
  use(install$7);
}
function makeBackground(rect, componentModel) {
  var padding = normalizeCssArray(componentModel.get("padding"));
  var style = componentModel.getItemStyle(["color", "opacity"]);
  style.fill = componentModel.get("backgroundColor");
  var bgRect = new Rect({
    shape: {
      x: rect.x - padding[3],
      y: rect.y - padding[0],
      width: rect.width + padding[1] + padding[3],
      height: rect.height + padding[0] + padding[2],
      r: componentModel.get("borderRadius")
    },
    style,
    silent: true,
    z2: -1
  });
  return bgRect;
}
var TooltipModel = (
  /** @class */
  function(_super) {
    __extends(TooltipModel2, _super);
    function TooltipModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = TooltipModel2.type;
      return _this;
    }
    TooltipModel2.type = "tooltip";
    TooltipModel2.dependencies = ["axisPointer"];
    TooltipModel2.defaultOption = {
      // zlevel: 0,
      z: 60,
      show: true,
      // tooltip main content
      showContent: true,
      // 'trigger' only works on coordinate system.
      // 'item' | 'axis' | 'none'
      trigger: "item",
      // 'click' | 'mousemove' | 'none'
      triggerOn: "mousemove|click",
      alwaysShowContent: false,
      renderMode: "auto",
      // whether restraint content inside viewRect.
      // If renderMode: 'richText', default true.
      // If renderMode: 'html', defaults to `false` (for backward compat).
      confine: null,
      showDelay: 0,
      hideDelay: 100,
      // Animation transition time, unit is second
      transitionDuration: 0.4,
      displayTransition: true,
      enterable: false,
      backgroundColor: tokens.color.neutral00,
      // box shadow
      shadowBlur: 10,
      shadowColor: "rgba(0, 0, 0, .2)",
      shadowOffsetX: 1,
      shadowOffsetY: 2,
      // tooltip border radius, unit is px, default is 4
      borderRadius: 4,
      // tooltip border width, unit is px, default is 0 (no border)
      borderWidth: 1,
      defaultBorderColor: tokens.color.border,
      // Tooltip inside padding, default is 5 for all direction
      // Array is allowed to set up, right, bottom, left, same with css
      // The default value: See `tooltip/tooltipMarkup.ts#getPaddingFromTooltipModel`.
      padding: null,
      // Extra css text
      extraCssText: "",
      // axis indicator, trigger by axis
      axisPointer: {
        // default is line
        // legal values: 'line' | 'shadow' | 'cross'
        type: "line",
        // Valid when type is line, appoint tooltip line locate on which line. Optional
        // legal values: 'x' | 'y' | 'angle' | 'radius' | 'auto'
        // default is 'auto', chose the axis which type is category.
        // for multiply y axis, cartesian coord chose x axis, polar chose angle axis
        axis: "auto",
        animation: "auto",
        animationDurationUpdate: 200,
        animationEasingUpdate: "exponentialOut",
        crossStyle: {
          color: tokens.color.borderShade,
          width: 1,
          type: "dashed",
          // TODO formatter
          textStyle: {}
        }
        // lineStyle and shadowStyle should not be specified here,
        // otherwise it will always override those styles on option.axisPointer.
      },
      textStyle: {
        color: tokens.color.tertiary,
        fontSize: 14
      }
    };
    return TooltipModel2;
  }(ComponentModel)
);
function shouldTooltipConfine(tooltipModel) {
  var confineOption = tooltipModel.get("confine");
  return confineOption != null ? !!confineOption : tooltipModel.get("renderMode") === "richText";
}
function testStyle(styleProps) {
  if (!env.domSupported) {
    return;
  }
  var style = document.documentElement.style;
  for (var i = 0, len2 = styleProps.length; i < len2; i++) {
    if (styleProps[i] in style) {
      return styleProps[i];
    }
  }
}
var TRANSFORM_VENDOR = testStyle(["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]);
var TRANSITION_VENDOR = testStyle(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
function toCSSVendorPrefix(styleVendor, styleProp) {
  if (!styleVendor) {
    return styleProp;
  }
  styleProp = toCamelCase(styleProp, true);
  var idx = styleVendor.indexOf(styleProp);
  styleVendor = idx === -1 ? styleProp : "-" + styleVendor.slice(0, idx) + "-" + styleProp;
  return styleVendor.toLowerCase();
}
function getComputedStyle(el, style) {
  var stl = el.currentStyle || document.defaultView && document.defaultView.getComputedStyle(el);
  return stl ? stl[style] : null;
}
var CSS_TRANSITION_VENDOR = toCSSVendorPrefix(TRANSITION_VENDOR, "transition");
var CSS_TRANSFORM_VENDOR = toCSSVendorPrefix(TRANSFORM_VENDOR, "transform");
var gCssText = "position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;" + (env.transform3dSupported ? "will-change:transform;" : "");
function mirrorPos(pos) {
  pos = pos === "left" ? "right" : pos === "right" ? "left" : pos === "top" ? "bottom" : "top";
  return pos;
}
function assembleArrow(tooltipModel, borderColor, arrowPosition) {
  if (!isString(arrowPosition) || arrowPosition === "inside") {
    return "";
  }
  var backgroundColor2 = tooltipModel.get("backgroundColor");
  var borderWidth = tooltipModel.get("borderWidth");
  borderColor = convertToColorString(borderColor);
  var arrowPos = mirrorPos(arrowPosition);
  var arrowSize = Math.max(Math.round(borderWidth) * 1.5, 6);
  var positionStyle = "";
  var transformStyle = CSS_TRANSFORM_VENDOR + ":";
  var rotateDeg;
  if (indexOf(["left", "right"], arrowPos) > -1) {
    positionStyle += "top:50%";
    transformStyle += "translateY(-50%) rotate(" + (rotateDeg = arrowPos === "left" ? -225 : -45) + "deg)";
  } else {
    positionStyle += "left:50%";
    transformStyle += "translateX(-50%) rotate(" + (rotateDeg = arrowPos === "top" ? 225 : 45) + "deg)";
  }
  var rotateRadian = rotateDeg * Math.PI / 180;
  var arrowWH = arrowSize + borderWidth;
  var rotatedWH = arrowWH * Math.abs(Math.cos(rotateRadian)) + arrowWH * Math.abs(Math.sin(rotateRadian));
  var arrowOffset = Math.round(((rotatedWH - Math.SQRT2 * borderWidth) / 2 + Math.SQRT2 * borderWidth - (rotatedWH - arrowWH) / 2) * 100) / 100;
  positionStyle += ";" + arrowPos + ":-" + arrowOffset + "px";
  var borderStyle = borderColor + " solid " + borderWidth + "px;";
  var styleCss = ["position:absolute;width:" + arrowSize + "px;height:" + arrowSize + "px;z-index:-1;", positionStyle + ";" + transformStyle + ";", "border-bottom:" + borderStyle, "border-right:" + borderStyle, "background-color:" + backgroundColor2 + ";"];
  return '<div style="' + styleCss.join("") + '"></div>';
}
function assembleTransition(duration, onlyFadeTransition, enableDisplayTransition) {
  var transitionCurve = "cubic-bezier(0.23,1,0.32,1)";
  var transitionOption = "";
  var transitionText = "";
  if (enableDisplayTransition) {
    transitionOption = " " + duration / 2 + "s " + transitionCurve;
    transitionText = "opacity" + transitionOption + ",visibility" + transitionOption;
  }
  if (!onlyFadeTransition) {
    transitionOption = " " + duration + "s " + transitionCurve;
    transitionText += (transitionText.length ? "," : "") + (env.transformSupported ? "" + CSS_TRANSFORM_VENDOR + transitionOption : ",left" + transitionOption + ",top" + transitionOption);
  }
  return CSS_TRANSITION_VENDOR + ":" + transitionText;
}
function assembleTransform(x, y, toString) {
  var x0 = x.toFixed(0) + "px";
  var y0 = y.toFixed(0) + "px";
  if (!env.transformSupported) {
    return toString ? "top:" + y0 + ";left:" + x0 + ";" : [["top", y0], ["left", x0]];
  }
  var is3d = env.transform3dSupported;
  var translate2 = "translate" + (is3d ? "3d" : "") + "(" + x0 + "," + y0 + (is3d ? ",0" : "") + ")";
  return toString ? "top:0;left:0;" + CSS_TRANSFORM_VENDOR + ":" + translate2 + ";" : [["top", 0], ["left", 0], [TRANSFORM_VENDOR, translate2]];
}
function assembleFont(textStyleModel) {
  var cssText = [];
  var fontSize = textStyleModel.get("fontSize");
  var color2 = textStyleModel.getTextColor();
  color2 && cssText.push("color:" + color2);
  cssText.push("font:" + textStyleModel.getFont());
  var lineHeight = retrieve2(textStyleModel.get("lineHeight"), Math.round(fontSize * 3 / 2));
  fontSize && cssText.push("line-height:" + lineHeight + "px");
  var shadowColor = textStyleModel.get("textShadowColor");
  var shadowBlur = textStyleModel.get("textShadowBlur") || 0;
  var shadowOffsetX = textStyleModel.get("textShadowOffsetX") || 0;
  var shadowOffsetY = textStyleModel.get("textShadowOffsetY") || 0;
  shadowColor && shadowBlur && cssText.push("text-shadow:" + shadowOffsetX + "px " + shadowOffsetY + "px " + shadowBlur + "px " + shadowColor);
  each$4(["decoration", "align"], function(name) {
    var val = textStyleModel.get(name);
    val && cssText.push("text-" + name + ":" + val);
  });
  return cssText.join(";");
}
function assembleCssText(tooltipModel, enableTransition, onlyFadeTransition, enableDisplayTransition) {
  var cssText = [];
  var transitionDuration = tooltipModel.get("transitionDuration");
  var backgroundColor2 = tooltipModel.get("backgroundColor");
  var shadowBlur = tooltipModel.get("shadowBlur");
  var shadowColor = tooltipModel.get("shadowColor");
  var shadowOffsetX = tooltipModel.get("shadowOffsetX");
  var shadowOffsetY = tooltipModel.get("shadowOffsetY");
  var textStyleModel = tooltipModel.getModel("textStyle");
  var padding = getPaddingFromTooltipModel(tooltipModel, "html");
  var boxShadow = shadowOffsetX + "px " + shadowOffsetY + "px " + shadowBlur + "px " + shadowColor;
  cssText.push("box-shadow:" + boxShadow);
  enableTransition && transitionDuration > 0 && cssText.push(assembleTransition(transitionDuration, onlyFadeTransition, enableDisplayTransition));
  if (backgroundColor2) {
    cssText.push("background-color:" + backgroundColor2);
  }
  each$4(["width", "color", "radius"], function(name) {
    var borderName = "border-" + name;
    var camelCase = toCamelCase(borderName);
    var val = tooltipModel.get(camelCase);
    val != null && cssText.push(borderName + ":" + val + (name === "color" ? "" : "px"));
  });
  cssText.push(assembleFont(textStyleModel));
  if (padding != null) {
    cssText.push("padding:" + normalizeCssArray(padding).join("px ") + "px");
  }
  return cssText.join(";") + ";";
}
function makeStyleCoord$1(out, zr, container, zrX, zrY) {
  var zrPainter = zr && zr.painter;
  if (container) {
    var zrViewportRoot = zrPainter && zrPainter.getViewportRoot();
    if (zrViewportRoot) {
      transformLocalCoord(out, zrViewportRoot, container, zrX, zrY);
    }
  } else {
    out[0] = zrX;
    out[1] = zrY;
    var viewportRootOffset = zrPainter && zrPainter.getViewportRootOffset();
    if (viewportRootOffset) {
      out[0] += viewportRootOffset.offsetLeft;
      out[1] += viewportRootOffset.offsetTop;
    }
  }
  out[2] = out[0] / zr.getWidth();
  out[3] = out[1] / zr.getHeight();
}
var TooltipHTMLContent = (
  /** @class */
  function() {
    function TooltipHTMLContent2(api, opt) {
      this._show = false;
      this._styleCoord = [0, 0, 0, 0];
      this._enterable = true;
      this._alwaysShowContent = false;
      this._firstShow = true;
      this._longHide = true;
      if (env.wxa) {
        return null;
      }
      var el = document.createElement("div");
      el.domBelongToZr = true;
      this.el = el;
      var zr = this._zr = api.getZr();
      var appendTo = opt.appendTo;
      var container = appendTo && (isString(appendTo) ? document.querySelector(appendTo) : isDom(appendTo) ? appendTo : isFunction(appendTo) && appendTo(api.getDom()));
      makeStyleCoord$1(this._styleCoord, zr, container, api.getWidth() / 2, api.getHeight() / 2);
      (container || api.getDom()).appendChild(el);
      this._api = api;
      this._container = container;
      var self = this;
      el.onmouseenter = function() {
        if (self._enterable) {
          clearTimeout(self._hideTimeout);
          self._show = true;
        }
        self._inContent = true;
      };
      el.onmousemove = function(e) {
        e = e || window.event;
        if (!self._enterable) {
          var handler = zr.handler;
          var zrViewportRoot = zr.painter.getViewportRoot();
          normalizeEvent(zrViewportRoot, e, true);
          handler.dispatch("mousemove", e);
        }
      };
      el.onmouseleave = function() {
        self._inContent = false;
        if (self._enterable) {
          if (self._show) {
            self.hideLater(self._hideDelay);
          }
        }
      };
    }
    TooltipHTMLContent2.prototype.update = function(tooltipModel) {
      if (!this._container) {
        var container = this._api.getDom();
        var position = getComputedStyle(container, "position");
        var domStyle = container.style;
        if (domStyle.position !== "absolute" && position !== "absolute") {
          domStyle.position = "relative";
        }
      }
      var alwaysShowContent = tooltipModel.get("alwaysShowContent");
      alwaysShowContent && this._moveIfResized();
      this._alwaysShowContent = alwaysShowContent;
      this._enableDisplayTransition = tooltipModel.get("displayTransition") && tooltipModel.get("transitionDuration") > 0;
      this.el.className = tooltipModel.get("className") || "";
    };
    TooltipHTMLContent2.prototype.show = function(tooltipModel, nearPointColor) {
      clearTimeout(this._hideTimeout);
      clearTimeout(this._longHideTimeout);
      var el = this.el;
      var style = el.style;
      var styleCoord = this._styleCoord;
      if (!el.innerHTML) {
        style.display = "none";
      } else {
        style.cssText = gCssText + assembleCssText(tooltipModel, !this._firstShow, this._longHide, this._enableDisplayTransition) + assembleTransform(styleCoord[0], styleCoord[1], true) + ("border-color:" + convertToColorString(nearPointColor) + ";") + (tooltipModel.get("extraCssText") || "") + (";pointer-events:" + (this._enterable ? "auto" : "none"));
      }
      this._show = true;
      this._firstShow = false;
      this._longHide = false;
    };
    TooltipHTMLContent2.prototype.setContent = function(content, markers, tooltipModel, borderColor, arrowPosition) {
      var el = this.el;
      if (content == null) {
        el.innerHTML = "";
        return;
      }
      var arrow = "";
      if (isString(arrowPosition) && tooltipModel.get("trigger") === "item" && !shouldTooltipConfine(tooltipModel)) {
        arrow = assembleArrow(tooltipModel, borderColor, arrowPosition);
      }
      if (isString(content)) {
        el.innerHTML = content + arrow;
      } else if (content) {
        el.innerHTML = "";
        if (!isArray(content)) {
          content = [content];
        }
        for (var i = 0; i < content.length; i++) {
          if (isDom(content[i]) && content[i].parentNode !== el) {
            el.appendChild(content[i]);
          }
        }
        if (arrow && el.childNodes.length) {
          var arrowEl = document.createElement("div");
          arrowEl.innerHTML = arrow;
          el.appendChild(arrowEl);
        }
      }
    };
    TooltipHTMLContent2.prototype.setEnterable = function(enterable) {
      this._enterable = enterable;
    };
    TooltipHTMLContent2.prototype.getSize = function() {
      var el = this.el;
      return el ? [el.offsetWidth, el.offsetHeight] : [0, 0];
    };
    TooltipHTMLContent2.prototype.moveTo = function(zrX, zrY) {
      if (!this.el) {
        return;
      }
      var styleCoord = this._styleCoord;
      makeStyleCoord$1(styleCoord, this._zr, this._container, zrX, zrY);
      if (styleCoord[0] != null && styleCoord[1] != null) {
        var style_1 = this.el.style;
        var transforms = assembleTransform(styleCoord[0], styleCoord[1]);
        each$4(transforms, function(transform) {
          style_1[transform[0]] = transform[1];
        });
      }
    };
    TooltipHTMLContent2.prototype._moveIfResized = function() {
      var ratioX = this._styleCoord[2];
      var ratioY = this._styleCoord[3];
      this.moveTo(ratioX * this._zr.getWidth(), ratioY * this._zr.getHeight());
    };
    TooltipHTMLContent2.prototype.hide = function() {
      var _this = this;
      var style = this.el.style;
      if (this._enableDisplayTransition) {
        style.visibility = "hidden";
        style.opacity = "0";
      } else {
        style.display = "none";
      }
      env.transform3dSupported && (style.willChange = "");
      this._show = false;
      this._longHideTimeout = setTimeout(function() {
        return _this._longHide = true;
      }, 500);
    };
    TooltipHTMLContent2.prototype.hideLater = function(time) {
      if (this._show && !(this._inContent && this._enterable) && !this._alwaysShowContent) {
        if (time) {
          this._hideDelay = time;
          this._show = false;
          this._hideTimeout = setTimeout(bind$1(this.hide, this), time);
        } else {
          this.hide();
        }
      }
    };
    TooltipHTMLContent2.prototype.isShow = function() {
      return this._show;
    };
    TooltipHTMLContent2.prototype.dispose = function() {
      clearTimeout(this._hideTimeout);
      clearTimeout(this._longHideTimeout);
      var zr = this._zr;
      transformLocalCoordClear(zr && zr.painter && zr.painter.getViewportRoot(), this._container);
      var el = this.el;
      if (el) {
        el.onmouseenter = el.onmousemove = el.onmouseleave = null;
        var parentNode = el.parentNode;
        parentNode && parentNode.removeChild(el);
      }
      this.el = this._container = null;
    };
    return TooltipHTMLContent2;
  }()
);
var TooltipRichContent = (
  /** @class */
  function() {
    function TooltipRichContent2(api) {
      this._show = false;
      this._styleCoord = [0, 0, 0, 0];
      this._alwaysShowContent = false;
      this._enterable = true;
      this._zr = api.getZr();
      makeStyleCoord(this._styleCoord, this._zr, api.getWidth() / 2, api.getHeight() / 2);
    }
    TooltipRichContent2.prototype.update = function(tooltipModel) {
      var alwaysShowContent = tooltipModel.get("alwaysShowContent");
      alwaysShowContent && this._moveIfResized();
      this._alwaysShowContent = alwaysShowContent;
    };
    TooltipRichContent2.prototype.show = function() {
      if (this._hideTimeout) {
        clearTimeout(this._hideTimeout);
      }
      this.el.show();
      this._show = true;
    };
    TooltipRichContent2.prototype.setContent = function(content, markupStyleCreator, tooltipModel, borderColor, arrowPosition) {
      var _this = this;
      if (isObject$2(content)) {
        throwError("");
      }
      if (this.el) {
        this._zr.remove(this.el);
      }
      var textStyleModel = tooltipModel.getModel("textStyle");
      this.el = new ZRText({
        style: {
          rich: markupStyleCreator.richTextStyles,
          text: content,
          lineHeight: 22,
          borderWidth: 1,
          borderColor,
          textShadowColor: textStyleModel.get("textShadowColor"),
          fill: tooltipModel.get(["textStyle", "color"]),
          padding: getPaddingFromTooltipModel(tooltipModel, "richText"),
          verticalAlign: "top",
          align: "left"
        },
        z: tooltipModel.get("z")
      });
      each$4(["backgroundColor", "borderRadius", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"], function(propName) {
        _this.el.style[propName] = tooltipModel.get(propName);
      });
      each$4(["textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"], function(propName) {
        _this.el.style[propName] = textStyleModel.get(propName) || 0;
      });
      this._zr.add(this.el);
      var self = this;
      this.el.on("mouseover", function() {
        if (self._enterable) {
          clearTimeout(self._hideTimeout);
          self._show = true;
        }
        self._inContent = true;
      });
      this.el.on("mouseout", function() {
        if (self._enterable) {
          if (self._show) {
            self.hideLater(self._hideDelay);
          }
        }
        self._inContent = false;
      });
    };
    TooltipRichContent2.prototype.setEnterable = function(enterable) {
      this._enterable = enterable;
    };
    TooltipRichContent2.prototype.getSize = function() {
      var el = this.el;
      var bounding = this.el.getBoundingRect();
      var shadowOuterSize = calcShadowOuterSize(el.style);
      return [bounding.width + shadowOuterSize.left + shadowOuterSize.right, bounding.height + shadowOuterSize.top + shadowOuterSize.bottom];
    };
    TooltipRichContent2.prototype.moveTo = function(x, y) {
      var el = this.el;
      if (el) {
        var styleCoord = this._styleCoord;
        makeStyleCoord(styleCoord, this._zr, x, y);
        x = styleCoord[0];
        y = styleCoord[1];
        var style = el.style;
        var borderWidth = mathMaxWith0(style.borderWidth || 0);
        var shadowOuterSize = calcShadowOuterSize(style);
        el.x = x + borderWidth + shadowOuterSize.left;
        el.y = y + borderWidth + shadowOuterSize.top;
        el.markRedraw();
      }
    };
    TooltipRichContent2.prototype._moveIfResized = function() {
      var ratioX = this._styleCoord[2];
      var ratioY = this._styleCoord[3];
      this.moveTo(ratioX * this._zr.getWidth(), ratioY * this._zr.getHeight());
    };
    TooltipRichContent2.prototype.hide = function() {
      if (this.el) {
        this.el.hide();
      }
      this._show = false;
    };
    TooltipRichContent2.prototype.hideLater = function(time) {
      if (this._show && !(this._inContent && this._enterable) && !this._alwaysShowContent) {
        if (time) {
          this._hideDelay = time;
          this._show = false;
          this._hideTimeout = setTimeout(bind$1(this.hide, this), time);
        } else {
          this.hide();
        }
      }
    };
    TooltipRichContent2.prototype.isShow = function() {
      return this._show;
    };
    TooltipRichContent2.prototype.dispose = function() {
      this._zr.remove(this.el);
    };
    return TooltipRichContent2;
  }()
);
function mathMaxWith0(val) {
  return Math.max(0, val);
}
function calcShadowOuterSize(style) {
  var shadowBlur = mathMaxWith0(style.shadowBlur || 0);
  var shadowOffsetX = mathMaxWith0(style.shadowOffsetX || 0);
  var shadowOffsetY = mathMaxWith0(style.shadowOffsetY || 0);
  return {
    left: mathMaxWith0(shadowBlur - shadowOffsetX),
    right: mathMaxWith0(shadowBlur + shadowOffsetX),
    top: mathMaxWith0(shadowBlur - shadowOffsetY),
    bottom: mathMaxWith0(shadowBlur + shadowOffsetY)
  };
}
function makeStyleCoord(out, zr, zrX, zrY) {
  out[0] = zrX;
  out[1] = zrY;
  out[2] = out[0] / zr.getWidth();
  out[3] = out[1] / zr.getHeight();
}
var proxyRect = new Rect({
  shape: {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  }
});
var TooltipView = (
  /** @class */
  function(_super) {
    __extends(TooltipView2, _super);
    function TooltipView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = TooltipView2.type;
      return _this;
    }
    TooltipView2.prototype.init = function(ecModel, api) {
      if (env.node || !api.getDom()) {
        return;
      }
      var tooltipModel = ecModel.getComponent("tooltip");
      var renderMode = this._renderMode = getTooltipRenderMode(tooltipModel.get("renderMode"));
      this._tooltipContent = renderMode === "richText" ? new TooltipRichContent(api) : new TooltipHTMLContent(api, {
        appendTo: tooltipModel.get("appendToBody", true) ? "body" : tooltipModel.get("appendTo", true)
      });
    };
    TooltipView2.prototype.render = function(tooltipModel, ecModel, api) {
      if (env.node || !api.getDom()) {
        return;
      }
      this.group.removeAll();
      this._tooltipModel = tooltipModel;
      this._ecModel = ecModel;
      this._api = api;
      var tooltipContent = this._tooltipContent;
      tooltipContent.update(tooltipModel);
      tooltipContent.setEnterable(tooltipModel.get("enterable"));
      this._initGlobalListener();
      this._keepShow();
      if (this._renderMode !== "richText" && tooltipModel.get("transitionDuration")) {
        createOrUpdate(this, "_updatePosition", 50, "fixRate");
      } else {
        clear(this, "_updatePosition");
      }
    };
    TooltipView2.prototype._initGlobalListener = function() {
      var tooltipModel = this._tooltipModel;
      var triggerOn = tooltipModel.get("triggerOn");
      register("itemTooltip", this._api, bind$1(function(currTrigger, e, dispatchAction) {
        if (triggerOn !== "none") {
          if (triggerOn.indexOf(currTrigger) >= 0) {
            this._tryShow(e, dispatchAction);
          } else if (currTrigger === "leave") {
            this._hide(dispatchAction);
          }
        }
      }, this));
    };
    TooltipView2.prototype._keepShow = function() {
      var tooltipModel = this._tooltipModel;
      var ecModel = this._ecModel;
      var api = this._api;
      var triggerOn = tooltipModel.get("triggerOn");
      if (this._lastX != null && this._lastY != null && triggerOn !== "none" && triggerOn !== "click") {
        var self_1 = this;
        clearTimeout(this._refreshUpdateTimeout);
        this._refreshUpdateTimeout = setTimeout(function() {
          !api.isDisposed() && self_1.manuallyShowTip(tooltipModel, ecModel, api, {
            x: self_1._lastX,
            y: self_1._lastY,
            dataByCoordSys: self_1._lastDataByCoordSys
          });
        });
      }
    };
    TooltipView2.prototype.manuallyShowTip = function(tooltipModel, ecModel, api, payload) {
      if (payload.from === this.uid || env.node || !api.getDom()) {
        return;
      }
      var dispatchAction = makeDispatchAction(payload, api);
      this._ticket = "";
      var dataByCoordSys = payload.dataByCoordSys;
      var cmptRef = findComponentReference(payload, ecModel, api);
      if (cmptRef) {
        var rect = cmptRef.el.getBoundingRect().clone();
        rect.applyTransform(cmptRef.el.transform);
        this._tryShow({
          offsetX: rect.x + rect.width / 2,
          offsetY: rect.y + rect.height / 2,
          target: cmptRef.el,
          position: payload.position,
          // When manully trigger, the mouse is not on the el, so we'd better to
          // position tooltip on the bottom of the el and display arrow is possible.
          positionDefault: "bottom"
        }, dispatchAction);
      } else if (payload.tooltip && payload.x != null && payload.y != null) {
        var el = proxyRect;
        el.x = payload.x;
        el.y = payload.y;
        el.update();
        getECData(el).tooltipConfig = {
          name: null,
          option: payload.tooltip
        };
        this._tryShow({
          offsetX: payload.x,
          offsetY: payload.y,
          target: el
        }, dispatchAction);
      } else if (dataByCoordSys) {
        this._tryShow({
          offsetX: payload.x,
          offsetY: payload.y,
          position: payload.position,
          dataByCoordSys,
          tooltipOption: payload.tooltipOption
        }, dispatchAction);
      } else if (payload.seriesIndex != null) {
        if (this._manuallyAxisShowTip(tooltipModel, ecModel, api, payload)) {
          return;
        }
        var pointInfo = findPointFromSeries(payload, ecModel);
        var cx = pointInfo.point[0];
        var cy = pointInfo.point[1];
        if (cx != null && cy != null) {
          this._tryShow({
            offsetX: cx,
            offsetY: cy,
            target: pointInfo.el,
            position: payload.position,
            // When manully trigger, the mouse is not on the el, so we'd better to
            // position tooltip on the bottom of the el and display arrow is possible.
            positionDefault: "bottom"
          }, dispatchAction);
        }
      } else if (payload.x != null && payload.y != null) {
        api.dispatchAction({
          type: "updateAxisPointer",
          x: payload.x,
          y: payload.y
        });
        this._tryShow({
          offsetX: payload.x,
          offsetY: payload.y,
          position: payload.position,
          target: api.getZr().findHover(payload.x, payload.y).target
        }, dispatchAction);
      }
    };
    TooltipView2.prototype.manuallyHideTip = function(tooltipModel, ecModel, api, payload) {
      var tooltipContent = this._tooltipContent;
      if (this._tooltipModel) {
        tooltipContent.hideLater(this._tooltipModel.get("hideDelay"));
      }
      this._lastX = this._lastY = this._lastDataByCoordSys = null;
      if (payload.from !== this.uid) {
        this._hide(makeDispatchAction(payload, api));
      }
    };
    TooltipView2.prototype._manuallyAxisShowTip = function(tooltipModel, ecModel, api, payload) {
      var seriesIndex = payload.seriesIndex;
      var dataIndex = payload.dataIndex;
      var coordSysAxesInfo = ecModel.getComponent("axisPointer").coordSysAxesInfo;
      if (seriesIndex == null || dataIndex == null || coordSysAxesInfo == null) {
        return;
      }
      var seriesModel = ecModel.getSeriesByIndex(seriesIndex);
      if (!seriesModel) {
        return;
      }
      var data = seriesModel.getData();
      var tooltipCascadedModel = buildTooltipModel([data.getItemModel(dataIndex), seriesModel, (seriesModel.coordinateSystem || {}).model], this._tooltipModel);
      if (tooltipCascadedModel.get("trigger") !== "axis") {
        return;
      }
      api.dispatchAction({
        type: "updateAxisPointer",
        seriesIndex,
        dataIndex,
        position: payload.position
      });
      return true;
    };
    TooltipView2.prototype._tryShow = function(e, dispatchAction) {
      var el = e.target;
      var tooltipModel = this._tooltipModel;
      if (!tooltipModel) {
        return;
      }
      this._lastX = e.offsetX;
      this._lastY = e.offsetY;
      var dataByCoordSys = e.dataByCoordSys;
      if (dataByCoordSys && dataByCoordSys.length) {
        this._showAxisTooltip(dataByCoordSys, e);
      } else if (el) {
        var ecData = getECData(el);
        if (ecData.ssrType === "legend") {
          return;
        }
        this._lastDataByCoordSys = null;
        var seriesDispatcher_1;
        var cmptDispatcher_1;
        findEventDispatcher(el, function(target) {
          if (target.tooltipDisabled) {
            seriesDispatcher_1 = cmptDispatcher_1 = null;
            return true;
          }
          if (seriesDispatcher_1 || cmptDispatcher_1) {
            return;
          }
          if (getECData(target).dataIndex != null) {
            seriesDispatcher_1 = target;
          } else if (getECData(target).tooltipConfig != null) {
            cmptDispatcher_1 = target;
          }
        }, true);
        if (seriesDispatcher_1) {
          this._showSeriesItemTooltip(e, seriesDispatcher_1, dispatchAction);
        } else if (cmptDispatcher_1) {
          this._showComponentItemTooltip(e, cmptDispatcher_1, dispatchAction);
        } else {
          this._hide(dispatchAction);
        }
      } else {
        this._lastDataByCoordSys = null;
        this._hide(dispatchAction);
      }
    };
    TooltipView2.prototype._showOrMove = function(tooltipModel, cb) {
      var delay = tooltipModel.get("showDelay");
      cb = bind$1(cb, this);
      clearTimeout(this._showTimout);
      delay > 0 ? this._showTimout = setTimeout(cb, delay) : cb();
    };
    TooltipView2.prototype._showAxisTooltip = function(dataByCoordSys, e) {
      var ecModel = this._ecModel;
      var globalTooltipModel = this._tooltipModel;
      var point = [e.offsetX, e.offsetY];
      var singleTooltipModel = buildTooltipModel([e.tooltipOption], globalTooltipModel);
      var renderMode = this._renderMode;
      var cbParamsList = [];
      var articleMarkup = createTooltipMarkup("section", {
        blocks: [],
        noHeader: true
      });
      var markupTextArrLegacy = [];
      var markupStyleCreator = new TooltipMarkupStyleCreator();
      each$4(dataByCoordSys, function(itemCoordSys) {
        each$4(itemCoordSys.dataByAxis, function(axisItem) {
          var axisModel = ecModel.getComponent(axisItem.axisDim + "Axis", axisItem.axisIndex);
          var axisValue = axisItem.value;
          if (!axisModel || axisValue == null) {
            return;
          }
          var axisValueLabel = getValueLabel(axisValue, axisModel.axis, ecModel, axisItem.seriesDataIndices, axisItem.valueLabelOpt);
          var axisSectionMarkup = createTooltipMarkup("section", {
            header: axisValueLabel,
            noHeader: !trim(axisValueLabel),
            sortBlocks: true,
            blocks: []
          });
          articleMarkup.blocks.push(axisSectionMarkup);
          each$4(axisItem.seriesDataIndices, function(idxItem) {
            var series = ecModel.getSeriesByIndex(idxItem.seriesIndex);
            var dataIndex = idxItem.dataIndexInside;
            var cbParams = series.getDataParams(dataIndex);
            if (cbParams.dataIndex < 0) {
              return;
            }
            cbParams.axisDim = axisItem.axisDim;
            cbParams.axisIndex = axisItem.axisIndex;
            cbParams.axisType = axisItem.axisType;
            cbParams.axisId = axisItem.axisId;
            cbParams.axisValue = getAxisRawValue(axisModel.axis, {
              value: axisValue
            });
            cbParams.axisValueLabel = axisValueLabel;
            cbParams.marker = markupStyleCreator.makeTooltipMarker("item", convertToColorString(cbParams.color), renderMode);
            var seriesTooltipResult = normalizeTooltipFormatResult(series.formatTooltip(dataIndex, true, null));
            var frag = seriesTooltipResult.frag;
            if (frag) {
              var valueFormatter = buildTooltipModel([series], globalTooltipModel).get("valueFormatter");
              axisSectionMarkup.blocks.push(valueFormatter ? extend({
                valueFormatter
              }, frag) : frag);
            }
            if (seriesTooltipResult.text) {
              markupTextArrLegacy.push(seriesTooltipResult.text);
            }
            cbParamsList.push(cbParams);
          });
        });
      });
      articleMarkup.blocks.reverse();
      markupTextArrLegacy.reverse();
      var positionExpr = e.position;
      var orderMode = singleTooltipModel.get("order");
      var builtMarkupText = buildTooltipMarkup(articleMarkup, markupStyleCreator, renderMode, orderMode, ecModel.get("useUTC"), singleTooltipModel.get("textStyle"));
      builtMarkupText && markupTextArrLegacy.unshift(builtMarkupText);
      var blockBreak = renderMode === "richText" ? "\n\n" : "<br/>";
      var allMarkupText = markupTextArrLegacy.join(blockBreak);
      this._showOrMove(singleTooltipModel, function() {
        if (this._updateContentNotChangedOnAxis(dataByCoordSys, cbParamsList)) {
          this._updatePosition(singleTooltipModel, positionExpr, point[0], point[1], this._tooltipContent, cbParamsList);
        } else {
          this._showTooltipContent(singleTooltipModel, allMarkupText, cbParamsList, Math.random() + "", point[0], point[1], positionExpr, null, markupStyleCreator);
        }
      });
    };
    TooltipView2.prototype._showSeriesItemTooltip = function(e, dispatcher, dispatchAction) {
      var ecModel = this._ecModel;
      var ecData = getECData(dispatcher);
      var seriesIndex = ecData.seriesIndex;
      var seriesModel = ecModel.getSeriesByIndex(seriesIndex);
      var dataModel = ecData.dataModel || seriesModel;
      var dataIndex = ecData.dataIndex;
      var dataType = ecData.dataType;
      var data = dataModel.getData(dataType);
      var renderMode = this._renderMode;
      var positionDefault = e.positionDefault;
      var tooltipModel = buildTooltipModel([data.getItemModel(dataIndex), dataModel, seriesModel && (seriesModel.coordinateSystem || {}).model], this._tooltipModel, positionDefault ? {
        position: positionDefault
      } : null);
      var tooltipTrigger = tooltipModel.get("trigger");
      if (tooltipTrigger != null && tooltipTrigger !== "item") {
        return;
      }
      var params = dataModel.getDataParams(dataIndex, dataType);
      var markupStyleCreator = new TooltipMarkupStyleCreator();
      params.marker = markupStyleCreator.makeTooltipMarker("item", convertToColorString(params.color), renderMode);
      var seriesTooltipResult = normalizeTooltipFormatResult(dataModel.formatTooltip(dataIndex, false, dataType));
      var orderMode = tooltipModel.get("order");
      var valueFormatter = tooltipModel.get("valueFormatter");
      var frag = seriesTooltipResult.frag;
      var markupText = frag ? buildTooltipMarkup(valueFormatter ? extend({
        valueFormatter
      }, frag) : frag, markupStyleCreator, renderMode, orderMode, ecModel.get("useUTC"), tooltipModel.get("textStyle")) : seriesTooltipResult.text;
      var asyncTicket = "item_" + dataModel.name + "_" + dataIndex;
      this._showOrMove(tooltipModel, function() {
        this._showTooltipContent(tooltipModel, markupText, params, asyncTicket, e.offsetX, e.offsetY, e.position, e.target, markupStyleCreator);
      });
      dispatchAction({
        type: "showTip",
        dataIndexInside: dataIndex,
        dataIndex: data.getRawIndex(dataIndex),
        seriesIndex,
        from: this.uid
      });
    };
    TooltipView2.prototype._showComponentItemTooltip = function(e, el, dispatchAction) {
      var isHTMLRenderMode = this._renderMode === "html";
      var ecData = getECData(el);
      var tooltipConfig = ecData.tooltipConfig;
      var tooltipOpt = tooltipConfig.option || {};
      var encodeHTMLContent = tooltipOpt.encodeHTMLContent;
      if (isString(tooltipOpt)) {
        var content = tooltipOpt;
        tooltipOpt = {
          content,
          // Fixed formatter
          formatter: content
        };
        encodeHTMLContent = true;
      }
      if (encodeHTMLContent && isHTMLRenderMode && tooltipOpt.content) {
        tooltipOpt = clone$1(tooltipOpt);
        tooltipOpt.content = encodeHTML(tooltipOpt.content);
      }
      var tooltipModelCascade = [tooltipOpt];
      var cmpt = this._ecModel.getComponent(ecData.componentMainType, ecData.componentIndex);
      if (cmpt) {
        tooltipModelCascade.push(cmpt);
      }
      tooltipModelCascade.push({
        formatter: tooltipOpt.content
      });
      var positionDefault = e.positionDefault;
      var subTooltipModel = buildTooltipModel(tooltipModelCascade, this._tooltipModel, positionDefault ? {
        position: positionDefault
      } : null);
      var defaultHtml = subTooltipModel.get("content");
      var asyncTicket = Math.random() + "";
      var markupStyleCreator = new TooltipMarkupStyleCreator();
      this._showOrMove(subTooltipModel, function() {
        var formatterParams = clone$1(subTooltipModel.get("formatterParams") || {});
        this._showTooltipContent(subTooltipModel, defaultHtml, formatterParams, asyncTicket, e.offsetX, e.offsetY, e.position, el, markupStyleCreator);
      });
      dispatchAction({
        type: "showTip",
        from: this.uid
      });
    };
    TooltipView2.prototype._showTooltipContent = function(tooltipModel, defaultHtml, params, asyncTicket, x, y, positionExpr, el, markupStyleCreator) {
      this._ticket = "";
      if (!tooltipModel.get("showContent") || !tooltipModel.get("show")) {
        return;
      }
      var tooltipContent = this._tooltipContent;
      tooltipContent.setEnterable(tooltipModel.get("enterable"));
      var formatter = tooltipModel.get("formatter");
      positionExpr = positionExpr || tooltipModel.get("position");
      var html = defaultHtml;
      var nearPoint = this._getNearestPoint([x, y], params, tooltipModel.get("trigger"), tooltipModel.get("borderColor"), tooltipModel.get("defaultBorderColor", true));
      var nearPointColor = nearPoint.color;
      if (formatter) {
        if (isString(formatter)) {
          var useUTC = tooltipModel.ecModel.get("useUTC");
          var params0 = isArray(params) ? params[0] : params;
          var isTimeAxis = params0 && params0.axisType && params0.axisType.indexOf("time") >= 0;
          html = formatter;
          if (isTimeAxis) {
            html = format(params0.axisValue, html, useUTC);
          }
          html = formatTpl(html, params, true);
        } else if (isFunction(formatter)) {
          var callback = bind$1(function(cbTicket, html2) {
            if (cbTicket === this._ticket) {
              tooltipContent.setContent(html2, markupStyleCreator, tooltipModel, nearPointColor, positionExpr);
              this._updatePosition(tooltipModel, positionExpr, x, y, tooltipContent, params, el);
            }
          }, this);
          this._ticket = asyncTicket;
          html = formatter(params, asyncTicket, callback);
        } else {
          html = formatter;
        }
      }
      tooltipContent.setContent(html, markupStyleCreator, tooltipModel, nearPointColor, positionExpr);
      tooltipContent.show(tooltipModel, nearPointColor);
      this._updatePosition(tooltipModel, positionExpr, x, y, tooltipContent, params, el);
    };
    TooltipView2.prototype._getNearestPoint = function(point, tooltipDataParams, trigger2, borderColor, defaultBorderColor) {
      if (trigger2 === "axis" || isArray(tooltipDataParams)) {
        return {
          color: borderColor || defaultBorderColor
        };
      }
      if (!isArray(tooltipDataParams)) {
        return {
          color: borderColor || tooltipDataParams.color || tooltipDataParams.borderColor
        };
      }
    };
    TooltipView2.prototype._updatePosition = function(tooltipModel, positionExpr, x, y, content, params, el) {
      var viewWidth = this._api.getWidth();
      var viewHeight = this._api.getHeight();
      positionExpr = positionExpr || tooltipModel.get("position");
      var contentSize = content.getSize();
      var align = tooltipModel.get("align");
      var vAlign = tooltipModel.get("verticalAlign");
      var rect = el && el.getBoundingRect().clone();
      el && rect.applyTransform(el.transform);
      if (isFunction(positionExpr)) {
        positionExpr = positionExpr([x, y], params, content.el, rect, {
          viewSize: [viewWidth, viewHeight],
          contentSize: contentSize.slice()
        });
      }
      if (isArray(positionExpr)) {
        x = parsePercent(positionExpr[0], viewWidth);
        y = parsePercent(positionExpr[1], viewHeight);
      } else if (isObject$2(positionExpr)) {
        var boxLayoutPosition = positionExpr;
        boxLayoutPosition.width = contentSize[0];
        boxLayoutPosition.height = contentSize[1];
        var layoutRect = getLayoutRect(boxLayoutPosition, {
          width: viewWidth,
          height: viewHeight
        });
        x = layoutRect.x;
        y = layoutRect.y;
        align = null;
        vAlign = null;
      } else if (isString(positionExpr) && el) {
        var pos = calcTooltipPosition(positionExpr, rect, contentSize, tooltipModel.get("borderWidth"));
        x = pos[0];
        y = pos[1];
      } else {
        var pos = refixTooltipPosition(x, y, content, viewWidth, viewHeight, align ? null : 20, vAlign ? null : 20);
        x = pos[0];
        y = pos[1];
      }
      align && (x -= isCenterAlign(align) ? contentSize[0] / 2 : align === "right" ? contentSize[0] : 0);
      vAlign && (y -= isCenterAlign(vAlign) ? contentSize[1] / 2 : vAlign === "bottom" ? contentSize[1] : 0);
      if (shouldTooltipConfine(tooltipModel)) {
        var pos = confineTooltipPosition(x, y, content, viewWidth, viewHeight);
        x = pos[0];
        y = pos[1];
      }
      content.moveTo(x, y);
    };
    TooltipView2.prototype._updateContentNotChangedOnAxis = function(dataByCoordSys, cbParamsList) {
      var lastCoordSys = this._lastDataByCoordSys;
      var lastCbParamsList = this._cbParamsList;
      var contentNotChanged = !!lastCoordSys && lastCoordSys.length === dataByCoordSys.length;
      contentNotChanged && each$4(lastCoordSys, function(lastItemCoordSys, indexCoordSys) {
        var lastDataByAxis = lastItemCoordSys.dataByAxis || [];
        var thisItemCoordSys = dataByCoordSys[indexCoordSys] || {};
        var thisDataByAxis = thisItemCoordSys.dataByAxis || [];
        contentNotChanged = contentNotChanged && lastDataByAxis.length === thisDataByAxis.length;
        contentNotChanged && each$4(lastDataByAxis, function(lastItem, indexAxis) {
          var thisItem = thisDataByAxis[indexAxis] || {};
          var lastIndices = lastItem.seriesDataIndices || [];
          var newIndices = thisItem.seriesDataIndices || [];
          contentNotChanged = contentNotChanged && lastItem.value === thisItem.value && lastItem.axisType === thisItem.axisType && lastItem.axisId === thisItem.axisId && lastIndices.length === newIndices.length;
          contentNotChanged && each$4(lastIndices, function(lastIdxItem, j) {
            var newIdxItem = newIndices[j];
            contentNotChanged = contentNotChanged && lastIdxItem.seriesIndex === newIdxItem.seriesIndex && lastIdxItem.dataIndex === newIdxItem.dataIndex;
          });
          lastCbParamsList && each$4(lastItem.seriesDataIndices, function(idxItem) {
            var seriesIdx = idxItem.seriesIndex;
            var cbParams = cbParamsList[seriesIdx];
            var lastCbParams = lastCbParamsList[seriesIdx];
            if (cbParams && lastCbParams && lastCbParams.data !== cbParams.data) {
              contentNotChanged = false;
            }
          });
        });
      });
      this._lastDataByCoordSys = dataByCoordSys;
      this._cbParamsList = cbParamsList;
      return !!contentNotChanged;
    };
    TooltipView2.prototype._hide = function(dispatchAction) {
      this._lastDataByCoordSys = null;
      dispatchAction({
        type: "hideTip",
        from: this.uid
      });
    };
    TooltipView2.prototype.dispose = function(ecModel, api) {
      if (env.node || !api.getDom()) {
        return;
      }
      clear(this, "_updatePosition");
      this._tooltipContent.dispose();
      unregister("itemTooltip", api);
    };
    TooltipView2.type = "tooltip";
    return TooltipView2;
  }(ComponentView)
);
function buildTooltipModel(modelCascade, globalTooltipModel, defaultTooltipOption) {
  var ecModel = globalTooltipModel.ecModel;
  var resultModel;
  if (defaultTooltipOption) {
    resultModel = new Model(defaultTooltipOption, ecModel, ecModel);
    resultModel = new Model(globalTooltipModel.option, resultModel, ecModel);
  } else {
    resultModel = globalTooltipModel;
  }
  for (var i = modelCascade.length - 1; i >= 0; i--) {
    var tooltipOpt = modelCascade[i];
    if (tooltipOpt) {
      if (tooltipOpt instanceof Model) {
        tooltipOpt = tooltipOpt.get("tooltip", true);
      }
      if (isString(tooltipOpt)) {
        tooltipOpt = {
          formatter: tooltipOpt
        };
      }
      if (tooltipOpt) {
        resultModel = new Model(tooltipOpt, resultModel, ecModel);
      }
    }
  }
  return resultModel;
}
function makeDispatchAction(payload, api) {
  return payload.dispatchAction || bind$1(api.dispatchAction, api);
}
function refixTooltipPosition(x, y, content, viewWidth, viewHeight, gapH, gapV) {
  var size = content.getSize();
  var width = size[0];
  var height = size[1];
  if (gapH != null) {
    if (x + width + gapH + 2 > viewWidth) {
      x -= width + gapH;
    } else {
      x += gapH;
    }
  }
  if (gapV != null) {
    if (y + height + gapV > viewHeight) {
      y -= height + gapV;
    } else {
      y += gapV;
    }
  }
  return [x, y];
}
function confineTooltipPosition(x, y, content, viewWidth, viewHeight) {
  var size = content.getSize();
  var width = size[0];
  var height = size[1];
  x = Math.min(x + width, viewWidth) - width;
  y = Math.min(y + height, viewHeight) - height;
  x = Math.max(x, 0);
  y = Math.max(y, 0);
  return [x, y];
}
function calcTooltipPosition(position, rect, contentSize, borderWidth) {
  var domWidth = contentSize[0];
  var domHeight = contentSize[1];
  var offset = Math.ceil(Math.SQRT2 * borderWidth) + 8;
  var x = 0;
  var y = 0;
  var rectWidth = rect.width;
  var rectHeight = rect.height;
  switch (position) {
    case "inside":
      x = rect.x + rectWidth / 2 - domWidth / 2;
      y = rect.y + rectHeight / 2 - domHeight / 2;
      break;
    case "top":
      x = rect.x + rectWidth / 2 - domWidth / 2;
      y = rect.y - domHeight - offset;
      break;
    case "bottom":
      x = rect.x + rectWidth / 2 - domWidth / 2;
      y = rect.y + rectHeight + offset;
      break;
    case "left":
      x = rect.x - domWidth - offset;
      y = rect.y + rectHeight / 2 - domHeight / 2;
      break;
    case "right":
      x = rect.x + rectWidth + offset;
      y = rect.y + rectHeight / 2 - domHeight / 2;
  }
  return [x, y];
}
function isCenterAlign(align) {
  return align === "center" || align === "middle";
}
function findComponentReference(payload, ecModel, api) {
  var queryOptionMap = preParseFinder(payload).queryOptionMap;
  var componentMainType = queryOptionMap.keys()[0];
  if (!componentMainType || componentMainType === "series") {
    return;
  }
  var queryResult = queryReferringComponents(ecModel, componentMainType, queryOptionMap.get(componentMainType), {
    useDefault: false,
    enableAll: false,
    enableNone: false
  });
  var model = queryResult.models[0];
  if (!model) {
    return;
  }
  var view = api.getViewOfComponentModel(model);
  var el;
  view.group.traverse(function(subEl) {
    var tooltipConfig = getECData(subEl).tooltipConfig;
    if (tooltipConfig && tooltipConfig.name === payload.name) {
      el = subEl;
      return true;
    }
  });
  if (el) {
    return {
      componentMainType,
      componentIndex: model.componentIndex,
      el
    };
  }
}
function install$5(registers) {
  use(install$7);
  registers.registerComponentModel(TooltipModel);
  registers.registerComponentView(TooltipView);
  registers.registerAction({
    type: "showTip",
    event: "showTip",
    update: "tooltip:manuallyShowTip"
  }, noop);
  registers.registerAction({
    type: "hideTip",
    event: "hideTip",
    update: "tooltip:manuallyHideTip"
  }, noop);
}
var TitleModel = (
  /** @class */
  function(_super) {
    __extends(TitleModel2, _super);
    function TitleModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = TitleModel2.type;
      _this.layoutMode = {
        type: "box",
        ignoreSize: true
      };
      return _this;
    }
    TitleModel2.type = "title";
    TitleModel2.defaultOption = {
      // zlevel: 0,
      z: 6,
      show: true,
      text: "",
      target: "blank",
      subtext: "",
      subtarget: "blank",
      left: "center",
      top: tokens.size.m,
      backgroundColor: tokens.color.transparent,
      borderColor: tokens.color.primary,
      borderWidth: 0,
      padding: 5,
      itemGap: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: tokens.color.primary
      },
      subtextStyle: {
        fontSize: 12,
        color: tokens.color.quaternary
      }
    };
    return TitleModel2;
  }(ComponentModel)
);
var TitleView = (
  /** @class */
  function(_super) {
    __extends(TitleView2, _super);
    function TitleView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = TitleView2.type;
      return _this;
    }
    TitleView2.prototype.render = function(titleModel, ecModel, api) {
      this.group.removeAll();
      if (!titleModel.get("show")) {
        return;
      }
      var group = this.group;
      var textStyleModel = titleModel.getModel("textStyle");
      var subtextStyleModel = titleModel.getModel("subtextStyle");
      var textAlign = titleModel.get("textAlign");
      var textVerticalAlign = retrieve2(titleModel.get("textBaseline"), titleModel.get("textVerticalAlign"));
      var textEl = new ZRText({
        style: createTextStyle(textStyleModel, {
          text: titleModel.get("text"),
          fill: textStyleModel.getTextColor()
        }, {
          disableBox: true
        }),
        z2: 10
      });
      var textRect = textEl.getBoundingRect();
      var subText = titleModel.get("subtext");
      var subTextEl = new ZRText({
        style: createTextStyle(subtextStyleModel, {
          text: subText,
          fill: subtextStyleModel.getTextColor(),
          y: textRect.height + titleModel.get("itemGap"),
          verticalAlign: "top"
        }, {
          disableBox: true
        }),
        z2: 10
      });
      var link = titleModel.get("link");
      var sublink = titleModel.get("sublink");
      var triggerEvent = titleModel.get("triggerEvent", true);
      textEl.silent = !link && !triggerEvent;
      subTextEl.silent = !sublink && !triggerEvent;
      if (link) {
        textEl.on("click", function() {
          windowOpen(link, "_" + titleModel.get("target"));
        });
      }
      if (sublink) {
        subTextEl.on("click", function() {
          windowOpen(sublink, "_" + titleModel.get("subtarget"));
        });
      }
      getECData(textEl).eventData = getECData(subTextEl).eventData = triggerEvent ? {
        componentType: "title",
        componentIndex: titleModel.componentIndex
      } : null;
      group.add(textEl);
      subText && group.add(subTextEl);
      var groupRect = group.getBoundingRect();
      var layoutOption = titleModel.getBoxLayoutParams();
      layoutOption.width = groupRect.width;
      layoutOption.height = groupRect.height;
      var layoutRef = createBoxLayoutReference(titleModel, api);
      var layoutRect = getLayoutRect(layoutOption, layoutRef.refContainer, titleModel.get("padding"));
      if (!textAlign) {
        textAlign = titleModel.get("left") || titleModel.get("right");
        if (textAlign === "middle") {
          textAlign = "center";
        }
        if (textAlign === "right") {
          layoutRect.x += layoutRect.width;
        } else if (textAlign === "center") {
          layoutRect.x += layoutRect.width / 2;
        }
      }
      if (!textVerticalAlign) {
        textVerticalAlign = titleModel.get("top") || titleModel.get("bottom");
        if (textVerticalAlign === "center") {
          textVerticalAlign = "middle";
        }
        if (textVerticalAlign === "bottom") {
          layoutRect.y += layoutRect.height;
        } else if (textVerticalAlign === "middle") {
          layoutRect.y += layoutRect.height / 2;
        }
        textVerticalAlign = textVerticalAlign || "top";
      }
      group.x = layoutRect.x;
      group.y = layoutRect.y;
      group.markRedraw();
      var alignStyle = {
        align: textAlign,
        verticalAlign: textVerticalAlign
      };
      textEl.setStyle(alignStyle);
      subTextEl.setStyle(alignStyle);
      groupRect = group.getBoundingRect();
      var padding = layoutRect.margin;
      var style = titleModel.getItemStyle(["color", "opacity"]);
      style.fill = titleModel.get("backgroundColor");
      var rect = new Rect({
        shape: {
          x: groupRect.x - padding[3],
          y: groupRect.y - padding[0],
          width: groupRect.width + padding[1] + padding[3],
          height: groupRect.height + padding[0] + padding[2],
          r: titleModel.get("borderRadius")
        },
        style,
        subPixelOptimize: true,
        silent: true
      });
      group.add(rect);
    };
    TitleView2.type = "title";
    return TitleView2;
  }(ComponentView)
);
function install$4(registers) {
  registers.registerComponentModel(TitleModel);
  registers.registerComponentView(TitleView);
}
var getDefaultSelectorOptions = function(ecModel, type) {
  if (type === "all") {
    return {
      type: "all",
      title: ecModel.getLocaleModel().get(["legend", "selector", "all"])
    };
  } else if (type === "inverse") {
    return {
      type: "inverse",
      title: ecModel.getLocaleModel().get(["legend", "selector", "inverse"])
    };
  }
};
var LegendModel = (
  /** @class */
  function(_super) {
    __extends(LegendModel2, _super);
    function LegendModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = LegendModel2.type;
      _this.layoutMode = {
        type: "box",
        // legend.width/height are maxWidth/maxHeight actually,
        // whereas real width/height is calculated by its content.
        // (Setting {left: 10, right: 10} does not make sense).
        // So consider the case:
        // `setOption({legend: {left: 10});`
        // then `setOption({legend: {right: 10});`
        // The previous `left` should be cleared by setting `ignoreSize`.
        ignoreSize: true
      };
      return _this;
    }
    LegendModel2.prototype.init = function(option, parentModel, ecModel) {
      this.mergeDefaultAndTheme(option, ecModel);
      option.selected = option.selected || {};
      this._updateSelector(option);
    };
    LegendModel2.prototype.mergeOption = function(option, ecModel) {
      _super.prototype.mergeOption.call(this, option, ecModel);
      this._updateSelector(option);
    };
    LegendModel2.prototype._updateSelector = function(option) {
      var selector = option.selector;
      var ecModel = this.ecModel;
      if (selector === true) {
        selector = option.selector = ["all", "inverse"];
      }
      if (isArray(selector)) {
        each$4(selector, function(item, index) {
          isString(item) && (item = {
            type: item
          });
          selector[index] = merge(item, getDefaultSelectorOptions(ecModel, item.type));
        });
      }
    };
    LegendModel2.prototype.optionUpdated = function() {
      this._updateData(this.ecModel);
      var legendData = this._data;
      if (legendData[0] && this.get("selectedMode") === "single") {
        var hasSelected = false;
        for (var i = 0; i < legendData.length; i++) {
          var name_1 = legendData[i].get("name");
          if (this.isSelected(name_1)) {
            this.select(name_1);
            hasSelected = true;
            break;
          }
        }
        !hasSelected && this.select(legendData[0].get("name"));
      }
    };
    LegendModel2.prototype._updateData = function(ecModel) {
      var potentialData = [];
      var availableNames = [];
      ecModel.eachRawSeries(function(seriesModel) {
        var seriesName = seriesModel.name;
        availableNames.push(seriesName);
        var isPotential;
        if (seriesModel.legendVisualProvider) {
          var provider = seriesModel.legendVisualProvider;
          var names = provider.getAllNames();
          if (!ecModel.isSeriesFiltered(seriesModel)) {
            availableNames = availableNames.concat(names);
          }
          if (names.length) {
            potentialData = potentialData.concat(names);
          } else {
            isPotential = true;
          }
        } else {
          isPotential = true;
        }
        if (isPotential && isNameSpecified(seriesModel)) {
          potentialData.push(seriesModel.name);
        }
      });
      this._availableNames = availableNames;
      var rawData = this.get("data") || potentialData;
      var legendNameMap = createHashMap();
      var legendData = map$1(rawData, function(dataItem) {
        if (isString(dataItem) || isNumber(dataItem)) {
          dataItem = {
            name: dataItem
          };
        }
        if (legendNameMap.get(dataItem.name)) {
          return null;
        }
        legendNameMap.set(dataItem.name, true);
        return new Model(dataItem, this, this.ecModel);
      }, this);
      this._data = filter(legendData, function(item) {
        return !!item;
      });
    };
    LegendModel2.prototype.getData = function() {
      return this._data;
    };
    LegendModel2.prototype.select = function(name) {
      var selected = this.option.selected;
      var selectedMode = this.get("selectedMode");
      if (selectedMode === "single") {
        var data = this._data;
        each$4(data, function(dataItem) {
          selected[dataItem.get("name")] = false;
        });
      }
      selected[name] = true;
    };
    LegendModel2.prototype.unSelect = function(name) {
      if (this.get("selectedMode") !== "single") {
        this.option.selected[name] = false;
      }
    };
    LegendModel2.prototype.toggleSelected = function(name) {
      var selected = this.option.selected;
      if (!selected.hasOwnProperty(name)) {
        selected[name] = true;
      }
      this[selected[name] ? "unSelect" : "select"](name);
    };
    LegendModel2.prototype.allSelect = function() {
      var data = this._data;
      var selected = this.option.selected;
      each$4(data, function(dataItem) {
        selected[dataItem.get("name", true)] = true;
      });
    };
    LegendModel2.prototype.inverseSelect = function() {
      var data = this._data;
      var selected = this.option.selected;
      each$4(data, function(dataItem) {
        var name = dataItem.get("name", true);
        if (!selected.hasOwnProperty(name)) {
          selected[name] = true;
        }
        selected[name] = !selected[name];
      });
    };
    LegendModel2.prototype.isSelected = function(name) {
      var selected = this.option.selected;
      return !(selected.hasOwnProperty(name) && !selected[name]) && indexOf(this._availableNames, name) >= 0;
    };
    LegendModel2.prototype.getOrient = function() {
      return this.get("orient") === "vertical" ? {
        index: 1,
        name: "vertical"
      } : {
        index: 0,
        name: "horizontal"
      };
    };
    LegendModel2.type = "legend.plain";
    LegendModel2.dependencies = ["series"];
    LegendModel2.defaultOption = {
      // zlevel: 0,
      z: 4,
      show: true,
      orient: "horizontal",
      left: "center",
      // right: 'center',
      // top: 0,
      bottom: tokens.size.m,
      align: "auto",
      backgroundColor: tokens.color.transparent,
      borderColor: tokens.color.border,
      borderRadius: 0,
      borderWidth: 0,
      padding: 5,
      itemGap: 8,
      itemWidth: 25,
      itemHeight: 14,
      symbolRotate: "inherit",
      symbolKeepAspect: true,
      inactiveColor: tokens.color.disabled,
      inactiveBorderColor: tokens.color.disabled,
      inactiveBorderWidth: "auto",
      itemStyle: {
        color: "inherit",
        opacity: "inherit",
        borderColor: "inherit",
        borderWidth: "auto",
        borderCap: "inherit",
        borderJoin: "inherit",
        borderDashOffset: "inherit",
        borderMiterLimit: "inherit"
      },
      lineStyle: {
        width: "auto",
        color: "inherit",
        inactiveColor: tokens.color.disabled,
        inactiveWidth: 2,
        opacity: "inherit",
        type: "inherit",
        cap: "inherit",
        join: "inherit",
        dashOffset: "inherit",
        miterLimit: "inherit"
      },
      textStyle: {
        color: tokens.color.secondary
      },
      selectedMode: true,
      selector: false,
      selectorLabel: {
        show: true,
        borderRadius: 10,
        padding: [3, 5, 3, 5],
        fontSize: 12,
        fontFamily: "sans-serif",
        color: tokens.color.tertiary,
        borderWidth: 1,
        borderColor: tokens.color.border
      },
      emphasis: {
        selectorLabel: {
          show: true,
          color: tokens.color.quaternary
        }
      },
      selectorPosition: "auto",
      selectorItemGap: 7,
      selectorButtonGap: 10,
      tooltip: {
        show: false
      },
      triggerEvent: false
    };
    return LegendModel2;
  }(ComponentModel)
);
var curry = curry$1;
var each = each$4;
var Group$1 = Group$2;
var LegendView = (
  /** @class */
  function(_super) {
    __extends(LegendView2, _super);
    function LegendView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = LegendView2.type;
      _this.newlineDisabled = false;
      return _this;
    }
    LegendView2.prototype.init = function() {
      this.group.add(this._contentGroup = new Group$1());
      this.group.add(this._selectorGroup = new Group$1());
      this._isFirstRender = true;
    };
    LegendView2.prototype.getContentGroup = function() {
      return this._contentGroup;
    };
    LegendView2.prototype.getSelectorGroup = function() {
      return this._selectorGroup;
    };
    LegendView2.prototype.render = function(legendModel, ecModel, api) {
      var isFirstRender = this._isFirstRender;
      this._isFirstRender = false;
      this.resetInner();
      if (!legendModel.get("show", true)) {
        return;
      }
      var itemAlign = legendModel.get("align");
      var orient = legendModel.get("orient");
      if (!itemAlign || itemAlign === "auto") {
        itemAlign = legendModel.get("left") === "right" && orient === "vertical" ? "right" : "left";
      }
      var selector = legendModel.get("selector", true);
      var selectorPosition = legendModel.get("selectorPosition", true);
      if (selector && (!selectorPosition || selectorPosition === "auto")) {
        selectorPosition = orient === "horizontal" ? "end" : "start";
      }
      this.renderInner(itemAlign, legendModel, ecModel, api, selector, orient, selectorPosition);
      var refContainer = createBoxLayoutReference(legendModel, api).refContainer;
      var positionInfo = legendModel.getBoxLayoutParams();
      var padding = legendModel.get("padding");
      var maxSize = getLayoutRect(positionInfo, refContainer, padding);
      var mainRect = this.layoutInner(legendModel, itemAlign, maxSize, isFirstRender, selector, selectorPosition);
      var layoutRect = getLayoutRect(defaults({
        width: mainRect.width,
        height: mainRect.height
      }, positionInfo), refContainer, padding);
      this.group.x = layoutRect.x - mainRect.x;
      this.group.y = layoutRect.y - mainRect.y;
      this.group.markRedraw();
      this.group.add(this._backgroundEl = makeBackground(
        mainRect,
        // FXIME: most itemStyle options does not work in background because inherit is not handled yet.
        legendModel
      ));
    };
    LegendView2.prototype.resetInner = function() {
      this.getContentGroup().removeAll();
      this._backgroundEl && this.group.remove(this._backgroundEl);
      this.getSelectorGroup().removeAll();
    };
    LegendView2.prototype.renderInner = function(itemAlign, legendModel, ecModel, api, selector, orient, selectorPosition) {
      var contentGroup = this.getContentGroup();
      var legendDrawnMap = createHashMap();
      var selectMode = legendModel.get("selectedMode");
      var triggerEvent = legendModel.get("triggerEvent");
      var excludeSeriesId = [];
      ecModel.eachRawSeries(function(seriesModel) {
        !seriesModel.get("legendHoverLink") && excludeSeriesId.push(seriesModel.id);
      });
      each(legendModel.getData(), function(legendItemModel, dataIndex) {
        var _this = this;
        var name = legendItemModel.get("name");
        if (!this.newlineDisabled && (name === "" || name === "\n")) {
          var g = new Group$1();
          g.newline = true;
          contentGroup.add(g);
          return;
        }
        var seriesModel = ecModel.getSeriesByName(name)[0];
        if (legendDrawnMap.get(name)) {
          return;
        }
        if (seriesModel) {
          var data = seriesModel.getData();
          var lineVisualStyle = data.getVisual("legendLineStyle") || {};
          var legendIcon = data.getVisual("legendIcon");
          var style = data.getVisual("style");
          var itemGroup = this._createItem(seriesModel, name, dataIndex, legendItemModel, legendModel, itemAlign, lineVisualStyle, style, legendIcon, selectMode, api);
          itemGroup.on("click", curry(dispatchSelectAction, name, null, api, excludeSeriesId)).on("mouseover", curry(dispatchHighlightAction, seriesModel.name, null, api, excludeSeriesId)).on("mouseout", curry(dispatchDownplayAction, seriesModel.name, null, api, excludeSeriesId));
          if (ecModel.ssr) {
            itemGroup.eachChild(function(child) {
              var ecData = getECData(child);
              ecData.seriesIndex = seriesModel.seriesIndex;
              ecData.dataIndex = dataIndex;
              ecData.ssrType = "legend";
            });
          }
          if (triggerEvent) {
            itemGroup.eachChild(function(child) {
              _this.packEventData(child, legendModel, seriesModel, dataIndex, name);
            });
          }
          legendDrawnMap.set(name, true);
        } else {
          ecModel.eachRawSeries(function(seriesModel2) {
            var _this2 = this;
            if (legendDrawnMap.get(name)) {
              return;
            }
            if (seriesModel2.legendVisualProvider) {
              var provider = seriesModel2.legendVisualProvider;
              if (!provider.containName(name)) {
                return;
              }
              var idx = provider.indexOfName(name);
              var style2 = provider.getItemVisual(idx, "style");
              var legendIcon2 = provider.getItemVisual(idx, "legendIcon");
              var colorArr = parse(style2.fill);
              if (colorArr && colorArr[3] === 0) {
                colorArr[3] = 0.2;
                style2 = extend(extend({}, style2), {
                  fill: stringify(colorArr, "rgba")
                });
              }
              var itemGroup2 = this._createItem(seriesModel2, name, dataIndex, legendItemModel, legendModel, itemAlign, {}, style2, legendIcon2, selectMode, api);
              itemGroup2.on("click", curry(dispatchSelectAction, null, name, api, excludeSeriesId)).on("mouseover", curry(dispatchHighlightAction, null, name, api, excludeSeriesId)).on("mouseout", curry(dispatchDownplayAction, null, name, api, excludeSeriesId));
              if (ecModel.ssr) {
                itemGroup2.eachChild(function(child) {
                  var ecData = getECData(child);
                  ecData.seriesIndex = seriesModel2.seriesIndex;
                  ecData.dataIndex = dataIndex;
                  ecData.ssrType = "legend";
                });
              }
              if (triggerEvent) {
                itemGroup2.eachChild(function(child) {
                  _this2.packEventData(child, legendModel, seriesModel2, dataIndex, name);
                });
              }
              legendDrawnMap.set(name, true);
            }
          }, this);
        }
      }, this);
      if (selector) {
        this._createSelector(selector, legendModel, api, orient, selectorPosition);
      }
    };
    LegendView2.prototype.packEventData = function(el, legendModel, seriesModel, dataIndex, name) {
      var eventData = {
        componentType: "legend",
        componentIndex: legendModel.componentIndex,
        dataIndex,
        value: name,
        seriesIndex: seriesModel.seriesIndex
      };
      getECData(el).eventData = eventData;
    };
    LegendView2.prototype._createSelector = function(selector, legendModel, api, orient, selectorPosition) {
      var selectorGroup = this.getSelectorGroup();
      each(selector, function createSelectorButton(selectorItem) {
        var type = selectorItem.type;
        var labelText = new ZRText({
          style: {
            x: 0,
            y: 0,
            align: "center",
            verticalAlign: "middle"
          },
          onclick: function() {
            api.dispatchAction({
              type: type === "all" ? "legendAllSelect" : "legendInverseSelect",
              legendId: legendModel.id
            });
          }
        });
        selectorGroup.add(labelText);
        var labelModel = legendModel.getModel("selectorLabel");
        var emphasisLabelModel = legendModel.getModel(["emphasis", "selectorLabel"]);
        setLabelStyle(labelText, {
          normal: labelModel,
          emphasis: emphasisLabelModel
        }, {
          defaultText: selectorItem.title
        });
        enableHoverEmphasis(labelText);
      });
    };
    LegendView2.prototype._createItem = function(seriesModel, name, dataIndex, legendItemModel, legendModel, itemAlign, lineVisualStyle, itemVisualStyle, legendIcon, selectMode, api) {
      var drawType = seriesModel.visualDrawType;
      var itemWidth = legendModel.get("itemWidth");
      var itemHeight = legendModel.get("itemHeight");
      var isSelected = legendModel.isSelected(name);
      var iconRotate = legendItemModel.get("symbolRotate");
      var symbolKeepAspect = legendItemModel.get("symbolKeepAspect");
      var legendIconType = legendItemModel.get("icon");
      legendIcon = legendIconType || legendIcon || "roundRect";
      var style = getLegendStyle(legendIcon, legendItemModel, lineVisualStyle, itemVisualStyle, drawType, isSelected, api);
      var itemGroup = new Group$1();
      var textStyleModel = legendItemModel.getModel("textStyle");
      if (isFunction(seriesModel.getLegendIcon) && (!legendIconType || legendIconType === "inherit")) {
        itemGroup.add(seriesModel.getLegendIcon({
          itemWidth,
          itemHeight,
          icon: legendIcon,
          iconRotate,
          itemStyle: style.itemStyle,
          lineStyle: style.lineStyle,
          symbolKeepAspect
        }));
      } else {
        var rotate2 = legendIconType === "inherit" && seriesModel.getData().getVisual("symbol") ? iconRotate === "inherit" ? seriesModel.getData().getVisual("symbolRotate") : iconRotate : 0;
        itemGroup.add(getDefaultLegendIcon({
          itemWidth,
          itemHeight,
          icon: legendIcon,
          iconRotate: rotate2,
          itemStyle: style.itemStyle,
          symbolKeepAspect
        }));
      }
      var textX = itemAlign === "left" ? itemWidth + 5 : -5;
      var textAlign = itemAlign;
      var formatter = legendModel.get("formatter");
      var content = name;
      if (isString(formatter) && formatter) {
        content = formatter.replace("{name}", name != null ? name : "");
      } else if (isFunction(formatter)) {
        content = formatter(name);
      }
      var textColor = isSelected ? textStyleModel.getTextColor() : legendItemModel.get("inactiveColor");
      itemGroup.add(new ZRText({
        style: createTextStyle(textStyleModel, {
          text: content,
          x: textX,
          y: itemHeight / 2,
          fill: textColor,
          align: textAlign,
          verticalAlign: "middle"
        }, {
          inheritColor: textColor
        })
      }));
      var hitRect = new Rect({
        shape: itemGroup.getBoundingRect(),
        style: {
          // Cannot use 'invisible' because SVG SSR will miss the node
          fill: "transparent"
        }
      });
      var tooltipModel = legendItemModel.getModel("tooltip");
      if (tooltipModel.get("show")) {
        setTooltipConfig({
          el: hitRect,
          componentModel: legendModel,
          itemName: name,
          itemTooltipOption: tooltipModel.option
        });
      }
      itemGroup.add(hitRect);
      itemGroup.eachChild(function(child) {
        child.silent = true;
      });
      hitRect.silent = !selectMode;
      this.getContentGroup().add(itemGroup);
      enableHoverEmphasis(itemGroup);
      itemGroup.__legendDataIndex = dataIndex;
      return itemGroup;
    };
    LegendView2.prototype.layoutInner = function(legendModel, itemAlign, maxSize, isFirstRender, selector, selectorPosition) {
      var contentGroup = this.getContentGroup();
      var selectorGroup = this.getSelectorGroup();
      box(legendModel.get("orient"), contentGroup, legendModel.get("itemGap"), maxSize.width, maxSize.height);
      var contentRect = contentGroup.getBoundingRect();
      var contentPos = [-contentRect.x, -contentRect.y];
      selectorGroup.markRedraw();
      contentGroup.markRedraw();
      if (selector) {
        box(
          // Buttons in selectorGroup always layout horizontally
          "horizontal",
          selectorGroup,
          legendModel.get("selectorItemGap", true)
        );
        var selectorRect = selectorGroup.getBoundingRect();
        var selectorPos = [-selectorRect.x, -selectorRect.y];
        var selectorButtonGap = legendModel.get("selectorButtonGap", true);
        var orientIdx = legendModel.getOrient().index;
        var wh = orientIdx === 0 ? "width" : "height";
        var hw = orientIdx === 0 ? "height" : "width";
        var yx = orientIdx === 0 ? "y" : "x";
        if (selectorPosition === "end") {
          selectorPos[orientIdx] += contentRect[wh] + selectorButtonGap;
        } else {
          contentPos[orientIdx] += selectorRect[wh] + selectorButtonGap;
        }
        selectorPos[1 - orientIdx] += contentRect[hw] / 2 - selectorRect[hw] / 2;
        selectorGroup.x = selectorPos[0];
        selectorGroup.y = selectorPos[1];
        contentGroup.x = contentPos[0];
        contentGroup.y = contentPos[1];
        var mainRect = {
          x: 0,
          y: 0
        };
        mainRect[wh] = contentRect[wh] + selectorButtonGap + selectorRect[wh];
        mainRect[hw] = Math.max(contentRect[hw], selectorRect[hw]);
        mainRect[yx] = Math.min(0, selectorRect[yx] + selectorPos[1 - orientIdx]);
        return mainRect;
      } else {
        contentGroup.x = contentPos[0];
        contentGroup.y = contentPos[1];
        return this.group.getBoundingRect();
      }
    };
    LegendView2.prototype.remove = function() {
      this.getContentGroup().removeAll();
      this._isFirstRender = true;
    };
    LegendView2.type = "legend.plain";
    return LegendView2;
  }(ComponentView)
);
function getLegendStyle(iconType, legendItemModel, lineVisualStyle, itemVisualStyle, drawType, isSelected, api) {
  function handleCommonProps(style, visualStyle) {
    if (style.lineWidth === "auto") {
      style.lineWidth = visualStyle.lineWidth > 0 ? 2 : 0;
    }
    each(style, function(propVal, propName) {
      style[propName] === "inherit" && (style[propName] = visualStyle[propName]);
    });
  }
  var itemStyleModel = legendItemModel.getModel("itemStyle");
  var itemStyle = itemStyleModel.getItemStyle();
  var iconBrushType = iconType.lastIndexOf("empty", 0) === 0 ? "fill" : "stroke";
  var decalStyle = itemStyleModel.getShallow("decal");
  itemStyle.decal = !decalStyle || decalStyle === "inherit" ? itemVisualStyle.decal : createOrUpdatePatternFromDecal(decalStyle, api);
  if (itemStyle.fill === "inherit") {
    itemStyle.fill = itemVisualStyle[drawType];
  }
  if (itemStyle.stroke === "inherit") {
    itemStyle.stroke = itemVisualStyle[iconBrushType];
  }
  if (itemStyle.opacity === "inherit") {
    itemStyle.opacity = (drawType === "fill" ? itemVisualStyle : lineVisualStyle).opacity;
  }
  handleCommonProps(itemStyle, itemVisualStyle);
  var legendLineModel = legendItemModel.getModel("lineStyle");
  var lineStyle = legendLineModel.getLineStyle();
  handleCommonProps(lineStyle, lineVisualStyle);
  itemStyle.fill === "auto" && (itemStyle.fill = itemVisualStyle.fill);
  itemStyle.stroke === "auto" && (itemStyle.stroke = itemVisualStyle.fill);
  lineStyle.stroke === "auto" && (lineStyle.stroke = itemVisualStyle.fill);
  if (!isSelected) {
    var borderWidth = legendItemModel.get("inactiveBorderWidth");
    var visualHasBorder = itemStyle[iconBrushType];
    itemStyle.lineWidth = borderWidth === "auto" ? itemVisualStyle.lineWidth > 0 && visualHasBorder ? 2 : 0 : itemStyle.lineWidth;
    itemStyle.fill = legendItemModel.get("inactiveColor");
    itemStyle.stroke = legendItemModel.get("inactiveBorderColor");
    lineStyle.stroke = legendLineModel.get("inactiveColor");
    lineStyle.lineWidth = legendLineModel.get("inactiveWidth");
  }
  return {
    itemStyle,
    lineStyle
  };
}
function getDefaultLegendIcon(opt) {
  var symboType = opt.icon || "roundRect";
  var icon = createSymbol$1(symboType, 0, 0, opt.itemWidth, opt.itemHeight, opt.itemStyle.fill, opt.symbolKeepAspect);
  icon.setStyle(opt.itemStyle);
  icon.rotation = (opt.iconRotate || 0) * Math.PI / 180;
  icon.setOrigin([opt.itemWidth / 2, opt.itemHeight / 2]);
  if (symboType.indexOf("empty") > -1) {
    icon.style.stroke = icon.style.fill;
    icon.style.fill = tokens.color.neutral00;
    icon.style.lineWidth = 2;
  }
  return icon;
}
function dispatchSelectAction(seriesName, dataName, api, excludeSeriesId) {
  dispatchDownplayAction(seriesName, dataName, api, excludeSeriesId);
  api.dispatchAction({
    type: "legendToggleSelect",
    name: seriesName != null ? seriesName : dataName
  });
  dispatchHighlightAction(seriesName, dataName, api, excludeSeriesId);
}
function isUseHoverLayer(api) {
  var list = api.getZr().storage.getDisplayList();
  var emphasisState;
  var i = 0;
  var len2 = list.length;
  while (i < len2 && !(emphasisState = list[i].states.emphasis)) {
    i++;
  }
  return emphasisState && emphasisState.hoverLayer;
}
function dispatchHighlightAction(seriesName, dataName, api, excludeSeriesId) {
  if (!isUseHoverLayer(api)) {
    api.dispatchAction({
      type: "highlight",
      seriesName,
      name: dataName,
      excludeSeriesId
    });
  }
}
function dispatchDownplayAction(seriesName, dataName, api, excludeSeriesId) {
  if (!isUseHoverLayer(api)) {
    api.dispatchAction({
      type: "downplay",
      seriesName,
      name: dataName,
      excludeSeriesId
    });
  }
}
function legendFilter(ecModel) {
  var legendModels = ecModel.findComponents({
    mainType: "legend"
  });
  if (legendModels && legendModels.length) {
    ecModel.filterSeries(function(series) {
      for (var i = 0; i < legendModels.length; i++) {
        if (!legendModels[i].isSelected(series.name)) {
          return false;
        }
      }
      return true;
    });
  }
}
function legendSelectActionHandler(methodName, payload, ecModel) {
  var isAllSelect = methodName === "allSelect" || methodName === "inverseSelect";
  var selectedMap = {};
  var actionLegendIndices = [];
  ecModel.eachComponent({
    mainType: "legend",
    query: payload
  }, function(legendModel) {
    if (isAllSelect) {
      legendModel[methodName]();
    } else {
      legendModel[methodName](payload.name);
    }
    makeSelectedMap(legendModel, selectedMap);
    actionLegendIndices.push(legendModel.componentIndex);
  });
  var allSelectedMap = {};
  ecModel.eachComponent("legend", function(legendModel) {
    each$4(selectedMap, function(isSelected, name) {
      legendModel[isSelected ? "select" : "unSelect"](name);
    });
    makeSelectedMap(legendModel, allSelectedMap);
  });
  return isAllSelect ? {
    selected: allSelectedMap,
    // return legendIndex array to tell the developers which legends are allSelect / inverseSelect
    legendIndex: actionLegendIndices
  } : {
    name: payload.name,
    selected: allSelectedMap
  };
}
function makeSelectedMap(legendModel, out) {
  var selectedMap = out || {};
  each$4(legendModel.getData(), function(model) {
    var name = model.get("name");
    if (name === "\n" || name === "") {
      return;
    }
    var isItemSelected = legendModel.isSelected(name);
    if (hasOwn(selectedMap, name)) {
      selectedMap[name] = selectedMap[name] && isItemSelected;
    } else {
      selectedMap[name] = isItemSelected;
    }
  });
  return selectedMap;
}
function installLegendAction(registers) {
  registers.registerAction("legendToggleSelect", "legendselectchanged", curry$1(legendSelectActionHandler, "toggleSelected"));
  registers.registerAction("legendAllSelect", "legendselectall", curry$1(legendSelectActionHandler, "allSelect"));
  registers.registerAction("legendInverseSelect", "legendinverseselect", curry$1(legendSelectActionHandler, "inverseSelect"));
  registers.registerAction("legendSelect", "legendselected", curry$1(legendSelectActionHandler, "select"));
  registers.registerAction("legendUnSelect", "legendunselected", curry$1(legendSelectActionHandler, "unSelect"));
}
function install$3(registers) {
  registers.registerComponentModel(LegendModel);
  registers.registerComponentView(LegendView);
  registers.registerProcessor(registers.PRIORITY.PROCESSOR.SERIES_FILTER, legendFilter);
  registers.registerSubTypeDefaulter("legend", function() {
    return "plain";
  });
  installLegendAction(registers);
}
var ScrollableLegendModel = (
  /** @class */
  function(_super) {
    __extends(ScrollableLegendModel2, _super);
    function ScrollableLegendModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = ScrollableLegendModel2.type;
      return _this;
    }
    ScrollableLegendModel2.prototype.setScrollDataIndex = function(scrollDataIndex) {
      this.option.scrollDataIndex = scrollDataIndex;
    };
    ScrollableLegendModel2.prototype.init = function(option, parentModel, ecModel) {
      var inputPositionParams = getLayoutParams(option);
      _super.prototype.init.call(this, option, parentModel, ecModel);
      mergeAndNormalizeLayoutParams(this, option, inputPositionParams);
    };
    ScrollableLegendModel2.prototype.mergeOption = function(option, ecModel) {
      _super.prototype.mergeOption.call(this, option, ecModel);
      mergeAndNormalizeLayoutParams(this, this.option, option);
    };
    ScrollableLegendModel2.type = "legend.scroll";
    ScrollableLegendModel2.defaultOption = inheritDefaultOption(LegendModel.defaultOption, {
      scrollDataIndex: 0,
      pageButtonItemGap: 5,
      pageButtonGap: null,
      pageButtonPosition: "end",
      pageFormatter: "{current}/{total}",
      pageIcons: {
        horizontal: ["M0,0L12,-10L12,10z", "M0,0L-12,-10L-12,10z"],
        vertical: ["M0,0L20,0L10,-20z", "M0,0L20,0L10,20z"]
      },
      pageIconColor: tokens.color.accent50,
      pageIconInactiveColor: tokens.color.accent10,
      pageIconSize: 15,
      pageTextStyle: {
        color: tokens.color.tertiary
      },
      animationDurationUpdate: 800
    });
    return ScrollableLegendModel2;
  }(LegendModel)
);
function mergeAndNormalizeLayoutParams(legendModel, target, raw) {
  var orient = legendModel.getOrient();
  var ignoreSize = [1, 1];
  ignoreSize[orient.index] = 0;
  mergeLayoutParam(target, raw, {
    type: "box",
    ignoreSize: !!ignoreSize
  });
}
var Group = Group$2;
var WH = ["width", "height"];
var XY = ["x", "y"];
var ScrollableLegendView = (
  /** @class */
  function(_super) {
    __extends(ScrollableLegendView2, _super);
    function ScrollableLegendView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = ScrollableLegendView2.type;
      _this.newlineDisabled = true;
      _this._currentIndex = 0;
      return _this;
    }
    ScrollableLegendView2.prototype.init = function() {
      _super.prototype.init.call(this);
      this.group.add(this._containerGroup = new Group());
      this._containerGroup.add(this.getContentGroup());
      this.group.add(this._controllerGroup = new Group());
    };
    ScrollableLegendView2.prototype.resetInner = function() {
      _super.prototype.resetInner.call(this);
      this._controllerGroup.removeAll();
      this._containerGroup.removeClipPath();
      this._containerGroup.__rectSize = null;
    };
    ScrollableLegendView2.prototype.renderInner = function(itemAlign, legendModel, ecModel, api, selector, orient, selectorPosition) {
      var self = this;
      _super.prototype.renderInner.call(this, itemAlign, legendModel, ecModel, api, selector, orient, selectorPosition);
      var controllerGroup = this._controllerGroup;
      var pageIconSize = legendModel.get("pageIconSize", true);
      var pageIconSizeArr = isArray(pageIconSize) ? pageIconSize : [pageIconSize, pageIconSize];
      createPageButton("pagePrev", 0);
      var pageTextStyleModel = legendModel.getModel("pageTextStyle");
      controllerGroup.add(new ZRText({
        name: "pageText",
        style: {
          // Placeholder to calculate a proper layout.
          text: "xx/xx",
          fill: pageTextStyleModel.getTextColor(),
          font: pageTextStyleModel.getFont(),
          verticalAlign: "middle",
          align: "center"
        },
        silent: true
      }));
      createPageButton("pageNext", 1);
      function createPageButton(name, iconIdx) {
        var pageDataIndexName = name + "DataIndex";
        var icon = createIcon(legendModel.get("pageIcons", true)[legendModel.getOrient().name][iconIdx], {
          // Buttons will be created in each render, so we do not need
          // to worry about avoiding using legendModel kept in scope.
          onclick: bind$1(self._pageGo, self, pageDataIndexName, legendModel, api)
        }, {
          x: -pageIconSizeArr[0] / 2,
          y: -pageIconSizeArr[1] / 2,
          width: pageIconSizeArr[0],
          height: pageIconSizeArr[1]
        });
        icon.name = name;
        controllerGroup.add(icon);
      }
    };
    ScrollableLegendView2.prototype.layoutInner = function(legendModel, itemAlign, maxSize, isFirstRender, selector, selectorPosition) {
      var selectorGroup = this.getSelectorGroup();
      var orientIdx = legendModel.getOrient().index;
      var wh = WH[orientIdx];
      var xy = XY[orientIdx];
      var hw = WH[1 - orientIdx];
      var yx = XY[1 - orientIdx];
      selector && box(
        // Buttons in selectorGroup always layout horizontally
        "horizontal",
        selectorGroup,
        legendModel.get("selectorItemGap", true)
      );
      var selectorButtonGap = legendModel.get("selectorButtonGap", true);
      var selectorRect = selectorGroup.getBoundingRect();
      var selectorPos = [-selectorRect.x, -selectorRect.y];
      var processMaxSize = clone$1(maxSize);
      selector && (processMaxSize[wh] = maxSize[wh] - selectorRect[wh] - selectorButtonGap);
      var mainRect = this._layoutContentAndController(legendModel, isFirstRender, processMaxSize, orientIdx, wh, hw, yx, xy);
      if (selector) {
        if (selectorPosition === "end") {
          selectorPos[orientIdx] += mainRect[wh] + selectorButtonGap;
        } else {
          var offset = selectorRect[wh] + selectorButtonGap;
          selectorPos[orientIdx] -= offset;
          mainRect[xy] -= offset;
        }
        mainRect[wh] += selectorRect[wh] + selectorButtonGap;
        selectorPos[1 - orientIdx] += mainRect[yx] + mainRect[hw] / 2 - selectorRect[hw] / 2;
        mainRect[hw] = Math.max(mainRect[hw], selectorRect[hw]);
        mainRect[yx] = Math.min(mainRect[yx], selectorRect[yx] + selectorPos[1 - orientIdx]);
        selectorGroup.x = selectorPos[0];
        selectorGroup.y = selectorPos[1];
        selectorGroup.markRedraw();
      }
      return mainRect;
    };
    ScrollableLegendView2.prototype._layoutContentAndController = function(legendModel, isFirstRender, maxSize, orientIdx, wh, hw, yx, xy) {
      var contentGroup = this.getContentGroup();
      var containerGroup = this._containerGroup;
      var controllerGroup = this._controllerGroup;
      box(legendModel.get("orient"), contentGroup, legendModel.get("itemGap"), !orientIdx ? null : maxSize.width, orientIdx ? null : maxSize.height);
      box(
        // Buttons in controller are layout always horizontally.
        "horizontal",
        controllerGroup,
        legendModel.get("pageButtonItemGap", true)
      );
      var contentRect = contentGroup.getBoundingRect();
      var controllerRect = controllerGroup.getBoundingRect();
      var showController = this._showController = contentRect[wh] > maxSize[wh];
      var contentPos = [-contentRect.x, -contentRect.y];
      if (!isFirstRender) {
        contentPos[orientIdx] = contentGroup[xy];
      }
      var containerPos = [0, 0];
      var controllerPos = [-controllerRect.x, -controllerRect.y];
      var pageButtonGap = retrieve2(legendModel.get("pageButtonGap", true), legendModel.get("itemGap", true));
      if (showController) {
        var pageButtonPosition = legendModel.get("pageButtonPosition", true);
        if (pageButtonPosition === "end") {
          controllerPos[orientIdx] += maxSize[wh] - controllerRect[wh];
        } else {
          containerPos[orientIdx] += controllerRect[wh] + pageButtonGap;
        }
      }
      controllerPos[1 - orientIdx] += contentRect[hw] / 2 - controllerRect[hw] / 2;
      contentGroup.setPosition(contentPos);
      containerGroup.setPosition(containerPos);
      controllerGroup.setPosition(controllerPos);
      var mainRect = {
        x: 0,
        y: 0
      };
      mainRect[wh] = showController ? maxSize[wh] : contentRect[wh];
      mainRect[hw] = Math.max(contentRect[hw], controllerRect[hw]);
      mainRect[yx] = Math.min(0, controllerRect[yx] + controllerPos[1 - orientIdx]);
      containerGroup.__rectSize = maxSize[wh];
      if (showController) {
        var clipShape = {
          x: 0,
          y: 0
        };
        clipShape[wh] = Math.max(maxSize[wh] - controllerRect[wh] - pageButtonGap, 0);
        clipShape[hw] = mainRect[hw];
        containerGroup.setClipPath(new Rect({
          shape: clipShape
        }));
        containerGroup.__rectSize = clipShape[wh];
      } else {
        controllerGroup.eachChild(function(child) {
          child.attr({
            invisible: true,
            silent: true
          });
        });
      }
      var pageInfo = this._getPageInfo(legendModel);
      pageInfo.pageIndex != null && updateProps$1(
        contentGroup,
        {
          x: pageInfo.contentPosition[0],
          y: pageInfo.contentPosition[1]
        },
        // When switch from "show controller" to "not show controller", view should be
        // updated immediately without animation, otherwise causes weird effect.
        showController ? legendModel : null
      );
      this._updatePageInfoView(legendModel, pageInfo);
      return mainRect;
    };
    ScrollableLegendView2.prototype._pageGo = function(to, legendModel, api) {
      var scrollDataIndex = this._getPageInfo(legendModel)[to];
      scrollDataIndex != null && api.dispatchAction({
        type: "legendScroll",
        scrollDataIndex,
        legendId: legendModel.id
      });
    };
    ScrollableLegendView2.prototype._updatePageInfoView = function(legendModel, pageInfo) {
      var controllerGroup = this._controllerGroup;
      each$4(["pagePrev", "pageNext"], function(name) {
        var key = name + "DataIndex";
        var canJump = pageInfo[key] != null;
        var icon = controllerGroup.childOfName(name);
        if (icon) {
          icon.setStyle("fill", canJump ? legendModel.get("pageIconColor", true) : legendModel.get("pageIconInactiveColor", true));
          icon.cursor = canJump ? "pointer" : "default";
        }
      });
      var pageText = controllerGroup.childOfName("pageText");
      var pageFormatter = legendModel.get("pageFormatter");
      var pageIndex = pageInfo.pageIndex;
      var current = pageIndex != null ? pageIndex + 1 : 0;
      var total = pageInfo.pageCount;
      pageText && pageFormatter && pageText.setStyle("text", isString(pageFormatter) ? pageFormatter.replace("{current}", current == null ? "" : current + "").replace("{total}", total == null ? "" : total + "") : pageFormatter({
        current,
        total
      }));
    };
    ScrollableLegendView2.prototype._getPageInfo = function(legendModel) {
      var scrollDataIndex = legendModel.get("scrollDataIndex", true);
      var contentGroup = this.getContentGroup();
      var containerRectSize = this._containerGroup.__rectSize;
      var orientIdx = legendModel.getOrient().index;
      var wh = WH[orientIdx];
      var xy = XY[orientIdx];
      var targetItemIndex = this._findTargetItemIndex(scrollDataIndex);
      var children = contentGroup.children();
      var targetItem = children[targetItemIndex];
      var itemCount = children.length;
      var pCount = !itemCount ? 0 : 1;
      var result = {
        contentPosition: [contentGroup.x, contentGroup.y],
        pageCount: pCount,
        pageIndex: pCount - 1,
        pagePrevDataIndex: null,
        pageNextDataIndex: null
      };
      if (!targetItem) {
        return result;
      }
      var targetItemInfo = getItemInfo(targetItem);
      result.contentPosition[orientIdx] = -targetItemInfo.s;
      for (var i = targetItemIndex + 1, winStartItemInfo = targetItemInfo, winEndItemInfo = targetItemInfo, currItemInfo = null; i <= itemCount; ++i) {
        currItemInfo = getItemInfo(children[i]);
        if (
          // Half of the last item is out of the window.
          !currItemInfo && winEndItemInfo.e > winStartItemInfo.s + containerRectSize || currItemInfo && !intersect(currItemInfo, winStartItemInfo.s)
        ) {
          if (winEndItemInfo.i > winStartItemInfo.i) {
            winStartItemInfo = winEndItemInfo;
          } else {
            winStartItemInfo = currItemInfo;
          }
          if (winStartItemInfo) {
            if (result.pageNextDataIndex == null) {
              result.pageNextDataIndex = winStartItemInfo.i;
            }
            ++result.pageCount;
          }
        }
        winEndItemInfo = currItemInfo;
      }
      for (var i = targetItemIndex - 1, winStartItemInfo = targetItemInfo, winEndItemInfo = targetItemInfo, currItemInfo = null; i >= -1; --i) {
        currItemInfo = getItemInfo(children[i]);
        if (
          // If the the end item does not intersect with the window started
          // from the current item, a page can be settled.
          (!currItemInfo || !intersect(winEndItemInfo, currItemInfo.s)) && winStartItemInfo.i < winEndItemInfo.i
        ) {
          winEndItemInfo = winStartItemInfo;
          if (result.pagePrevDataIndex == null) {
            result.pagePrevDataIndex = winStartItemInfo.i;
          }
          ++result.pageCount;
          ++result.pageIndex;
        }
        winStartItemInfo = currItemInfo;
      }
      return result;
      function getItemInfo(el) {
        if (el) {
          var itemRect = el.getBoundingRect();
          var start = itemRect[xy] + el[xy];
          return {
            s: start,
            e: start + itemRect[wh],
            i: el.__legendDataIndex
          };
        }
      }
      function intersect(itemInfo, winStart) {
        return itemInfo.e >= winStart && itemInfo.s <= winStart + containerRectSize;
      }
    };
    ScrollableLegendView2.prototype._findTargetItemIndex = function(targetDataIndex) {
      if (!this._showController) {
        return 0;
      }
      var index;
      var contentGroup = this.getContentGroup();
      var defaultIndex;
      contentGroup.eachChild(function(child, idx) {
        var legendDataIdx = child.__legendDataIndex;
        if (defaultIndex == null && legendDataIdx != null) {
          defaultIndex = idx;
        }
        if (legendDataIdx === targetDataIndex) {
          index = idx;
        }
      });
      return index != null ? index : defaultIndex;
    };
    ScrollableLegendView2.type = "legend.scroll";
    return ScrollableLegendView2;
  }(LegendView)
);
function installScrollableLegendAction(registers) {
  registers.registerAction("legendScroll", "legendscroll", function(payload, ecModel) {
    var scrollDataIndex = payload.scrollDataIndex;
    scrollDataIndex != null && ecModel.eachComponent({
      mainType: "legend",
      subType: "scroll",
      query: payload
    }, function(legendModel) {
      legendModel.setScrollDataIndex(scrollDataIndex);
    });
  });
}
function install$2(registers) {
  use(install$3);
  registers.registerComponentModel(ScrollableLegendModel);
  registers.registerComponentView(ScrollableLegendView);
  installScrollableLegendAction(registers);
}
function install$1(registers) {
  use(install$3);
  use(install$2);
}
function install(registers) {
  registers.registerPainter("canvas", CanvasPainter);
}
export {
  install$8 as a,
  install$5 as b,
  install$4 as c,
  install$1 as d,
  install$6 as e,
  install as f,
  init as i,
  use as u
};
//# sourceMappingURL=echarts-CzUZ8isT.js.map
