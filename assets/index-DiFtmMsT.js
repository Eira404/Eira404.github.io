const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/typescript-CGIBXAIw.js","assets/@pixi-C5ejRgxM.js","assets/vendor-BT9nRNHj.js","assets/@codemirror-N9FfqkES.js","assets/vendor-DkC2A9Vi.css"])))=>i.map(i=>d[i]);
import{_ as L,a as B,b as D}from"./console.vue_vue_type_style_index_0_lang-BAPHJp-v.js";import{d as N,u as O,_ as q}from"./index-C4cq0LW6.js";import{ad as V,a$ as P,b0 as F,G as l,K as G,H as k,ag as A,ah as R,aj as f,ae as I,af as K,al as a,au as H,am as p,b1 as S,b2 as J,aM as h,aP as _,aA as W}from"./vendor-BT9nRNHj.js";import"./index.vue_vue_type_script_setup_true_lang-p629ok6l.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./@codemirror-N9FfqkES.js";import"./echarts-DqQ5Ouhr.js";import"./zrender-BJ9iwnX4.js";import"./katex-CEOJqCSt.js";import"./@pixi-C5ejRgxM.js";import"./typescript-CGIBXAIw.js";const Y={class:"h-full overflow-auto w-full"},z=V({__name:"sandbox",props:P({html:{type:String,required:!0},css:{type:String,required:!0},js:{type:String,required:!0},ts:{type:String,required:!0}},{logs:{required:!0,type:Array},logsModifiers:{}}),emits:["update:logs"],setup(E){const v=E,j=F(E,"logs"),i=l(null),n=G(()=>M(v.html,v.css,v.js,v.ts)),u=l(n.value),w=N(o=>{u.value=o},500),g=T();g(u.value),k(n,o=>{w(o)}),k(u,o=>{g(o)});function T(){let o=null;const r=b=>{o&&clearTimeout(o),o=null,i.value?(j.value=[],i.value.srcdoc=b):o=setTimeout(()=>r(b),100)};return r}function c(o){return o.replace(/<\/script>/gi,"<\/script>")}function M(o,r,b,x){const U=c(b),m=c(x);return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>html,body{height:100%;} ${r}</style>
  <script>
  // Console & error relay
  (function(){
    const send = (level, args)=>{
      try { parent.postMessage({ source:'playground-console', level, args: args.map((a)=>{
        try{
          if (typeof a === 'string') return a;
          if (a && a.stack) return a.stack;
          if (a instanceof Element) return '<' + a.tagName.toLowerCase() + '>';
          const seen = new WeakSet();
          return JSON.stringify(a, (k,v)=>{ if (typeof v==='object' && v!==null){ if (seen.has(v)) return '[Circular]'; seen.add(v);} return v; }, 2);
        }catch(e){ return String(a); }
      }) }, '*'); } catch(_){}
    };
    ['log','info','warn','error','debug'].forEach(m=>{
      const orig = console[m];
      console[m] = function(){ send(m, Array.from(arguments)); try{orig && orig.apply(console, arguments)}catch(_){} };
    });
    window.addEventListener('error', function(e){ send('error', [ (e && e.message ? e.message : 'Error') + (e && e.filename ? (' @ ' + e.filename + ':' + e.lineno + ':' + e.colno) : '') ]); });
    window.addEventListener('unhandledrejection', function(e){ send('error', ['Unhandled Rejection: ' + (e && e.reason ? (e.reason.stack || e.reason.message || String(e.reason)) : '')]); });
  })();
  <\/script>
</head>
<body>
  ${o}
  <script>${m}<\/script>
  <script>${U}<\/script>
</body>
</html>`}return(o,r)=>(R(),A("div",Y,[f("iframe",{ref_key:"iframeRef",ref:i,title:"preview",sandbox:"allow-scripts allow-modals allow-forms allow-popups",class:"w-full h-full"},null,512)]))}}),Q={class:"h-full"},X={class:"h-10 flex items-center justify-between px-10"},Z={style:{height:"calc(100% - 40px)"},class:"flex"},ee={class:"h-full w-1/2"},te={class:"w-1/2"},oe=V({__name:"index",setup(E){const i=O().playground.selectedExampleFiles,n=l("HTML"),u=l("HTML"),w=l(i.value.html.code),g=l(i.value.css.code),T=l(i.value.js.code),c=l(i.value.ts.code),M=l(""),o=l(!1),r=l(null),x=(()=>{let s=null;const e=C=>{const y=r.value;if(!y)return"console.warn('TypeScript compiler not loaded yet. Running without TS.');";try{return y.transpileModule(c.value,{compilerOptions:{target:y.ScriptTarget.ES2020,module:y.ModuleKind.ESNext,sourceMap:!1,lib:["es2020","dom"]}}).outputText}catch(d){return`console.error('TS compile error:', ${JSON.stringify(String(d&&(d.message||d)))} )`}},t=C=>{s&&clearTimeout(s),s=null,M.value=e(),!r.value&&(s=setTimeout(()=>t(),100))};return t})();x(c.value);const U=N(s=>{x(s)},500);k(c,s=>{U(s)});const m=l([]);function $(s){const e=s&&s.data;if(!e||e.source!=="playground-console")return;const{level:t,args:C}=e,y=(Array.isArray(C)?C:[C]).map(d=>typeof d=="string"?d:JSON.stringify(d)).join(" ");m.value.push({level:t,text:y,t:Date.now()})}return I(async()=>{window.addEventListener("message",$);try{r.value=await q(()=>import("./typescript-CGIBXAIw.js").then(s=>s.t),__vite__mapDeps([0,1,2,3,4])),o.value=!0}catch{o.value=!1}}),K(()=>{window.removeEventListener("message",$)}),(s,e)=>(R(),A("div",Q,[f("div",X,[f("div",null,[a(p(J),{modelValue:n.value,"onUpdate:modelValue":e[0]||(e[0]=t=>n.value=t)},{default:H(()=>[a(p(S),{label:"HTML"}),a(p(S),{label:"CSS"}),a(p(S),{label:"JavaScript"}),a(p(S),{label:"TypeScript"})]),_:1},8,["modelValue"])]),f("div",null,[a(p(J),{modelValue:u.value,"onUpdate:modelValue":e[1]||(e[1]=t=>u.value=t)},{default:H(()=>[a(p(S),{label:"HTML"}),a(p(S),{label:"Console"})]),_:1},8,["modelValue"])])]),f("div",Z,[f("div",ee,[h(a(L,{code:w.value,"onUpdate:code":e[2]||(e[2]=t=>w.value=t),title:"HTML",lang:"html"},null,8,["code"]),[[_,n.value==="HTML"]]),h(a(L,{code:g.value,"onUpdate:code":e[3]||(e[3]=t=>g.value=t),title:"CSS",lang:"css"},null,8,["code"]),[[_,n.value==="CSS"]]),h(a(L,{code:T.value,"onUpdate:code":e[4]||(e[4]=t=>T.value=t),title:"JavaScript",lang:"js"},null,8,["code"]),[[_,n.value==="JavaScript"]]),h(a(L,{code:c.value,"onUpdate:code":e[5]||(e[5]=t=>c.value=t),title:"TypeScript",lang:"ts"},null,8,["code"]),[[_,n.value==="TypeScript"]])]),f("div",te,[h(a(z,{logs:m.value,"onUpdate:logs":e[6]||(e[6]=t=>m.value=t),html:w.value,css:g.value,js:T.value,ts:M.value},null,8,["logs","html","css","js","ts"]),[[_,u.value==="HTML"]]),h(a(B,{logs:m.value,"onUpdate:logs":e[7]||(e[7]=t=>m.value=t)},null,8,["logs"]),[[_,u.value==="Console"]])])])]))}}),fe=V({__name:"index",setup(E){return(v,j)=>(R(),W(D,null,{main:H(()=>[a(oe)]),_:1}))}});export{fe as default};
//# sourceMappingURL=index-DiFtmMsT.js.map
