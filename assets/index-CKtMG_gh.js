const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/typescript-CUSX335q.js","assets/katex-S9ZM2IJj.js","assets/vendor-Cgv2NQ8W.js","assets/vendor-DkC2A9Vi.css"])))=>i.map(i=>d[i]);
import{_ as L,a as B,b as O}from"./console.vue_vue_type_style_index_0_lang-BcB1u4Bv.js";import{d as R,u as q,_ as A}from"./index-C0BRAMKf.js";import{D as H,au as P,av as F,b as a,d as I,w as k,I as D,J,N as f,F as G,G as Y,P as l,Y as V,Q as p,aw as S,ax as N,af as _,ai as h,a3 as K}from"./vendor-Cgv2NQ8W.js";import"./index.vue_vue_type_script_setup_true_lang-DGOEfTCQ.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./echarts-CyEgZDPw.js";import"./zrender-BMBjG4B0.js";import"./katex-S9ZM2IJj.js";import"./typescript-CUSX335q.js";const Q={class:"h-full overflow-auto w-full"},W=H({__name:"sandbox",props:P({html:{type:String,required:!0},css:{type:String,required:!0},js:{type:String,required:!0},ts:{type:String,required:!0}},{logs:{required:!0,type:Array},logsModifiers:{}}),emits:["update:logs"],setup(E){const v=E,j=F(E,"logs"),i=a(null),n=I(()=>x(v.html,v.css,v.js,v.ts)),u=a(n.value),w=R(s=>{u.value=s},500),g=T();g(u.value),k(n,s=>{w(s)}),k(u,s=>{g(s)});function T(){let s=null;const r=b=>{s&&clearTimeout(s),s=null,i.value?(j.value=[],i.value.srcdoc=b):s=setTimeout(()=>r(b),100)};return r}function c(s){return s.replace(/<\/script>/gi,"<\/script>")}function x(s,r,b,M){const U=c(b),m=c(M);return`<!DOCTYPE html>
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
  ${s}
  <script>${m}<\/script>
  <script>${U}<\/script>
</body>
</html>`}return(s,r)=>(J(),D("div",Q,[f("iframe",{ref_key:"iframeRef",ref:i,title:"preview",sandbox:"allow-scripts allow-modals allow-forms allow-popups",class:"w-full h-full"},null,512)]))}}),z={class:"h-full"},X={class:"h-10 flex items-center justify-between px-10"},Z={style:{height:"calc(100% - 40px)"},class:"flex"},ee={class:"h-full w-1/2"},te={class:"w-1/2"},se=H({__name:"index",setup(E){const i=q().playground.selectedExampleFiles,n=a("HTML"),u=a("HTML"),w=a(i.value.html.code),g=a(i.value.css.code),T=a(i.value.js.code),c=a(i.value.ts.code),x=a(""),s=a(!1),r=a(null),M=(()=>{let o=null;const e=C=>{const y=r.value;if(!y)return"console.warn('TypeScript compiler not loaded yet. Running without TS.');";try{return y.transpileModule(c.value,{compilerOptions:{target:y.ScriptTarget.ES2020,module:y.ModuleKind.ESNext,sourceMap:!1,lib:["es2020","dom"]}}).outputText}catch(d){return`console.error('TS compile error:', ${JSON.stringify(String(d&&(d.message||d)))} )`}},t=C=>{o&&clearTimeout(o),o=null,x.value=e(),!r.value&&(o=setTimeout(()=>t(),100))};return t})();M(c.value);const U=R(o=>{M(o)},500);k(c,o=>{U(o)});const m=a([]);function $(o){const e=o&&o.data;if(!e||e.source!=="playground-console")return;const{level:t,args:C}=e,y=(Array.isArray(C)?C:[C]).map(d=>typeof d=="string"?d:JSON.stringify(d)).join(" ");m.value.push({level:t,text:y,t:Date.now()})}return G(async()=>{window.addEventListener("message",$);try{r.value=await A(()=>import("./typescript-CUSX335q.js").then(o=>o.t),__vite__mapDeps([0,1,2,3])),s.value=!0}catch{s.value=!1}}),Y(()=>{window.removeEventListener("message",$)}),(o,e)=>(J(),D("div",z,[f("div",X,[f("div",null,[l(p(N),{modelValue:n.value,"onUpdate:modelValue":e[0]||(e[0]=t=>n.value=t)},{default:V(()=>[l(p(S),{label:"HTML"}),l(p(S),{label:"CSS"}),l(p(S),{label:"JavaScript"}),l(p(S),{label:"TypeScript"})]),_:1},8,["modelValue"])]),f("div",null,[l(p(N),{modelValue:u.value,"onUpdate:modelValue":e[1]||(e[1]=t=>u.value=t)},{default:V(()=>[l(p(S),{label:"HTML"}),l(p(S),{label:"Console"})]),_:1},8,["modelValue"])])]),f("div",Z,[f("div",ee,[_(l(L,{code:w.value,"onUpdate:code":e[2]||(e[2]=t=>w.value=t),title:"HTML",lang:"html"},null,8,["code"]),[[h,n.value==="HTML"]]),_(l(L,{code:g.value,"onUpdate:code":e[3]||(e[3]=t=>g.value=t),title:"CSS",lang:"css"},null,8,["code"]),[[h,n.value==="CSS"]]),_(l(L,{code:T.value,"onUpdate:code":e[4]||(e[4]=t=>T.value=t),title:"JavaScript",lang:"js"},null,8,["code"]),[[h,n.value==="JavaScript"]]),_(l(L,{code:c.value,"onUpdate:code":e[5]||(e[5]=t=>c.value=t),title:"TypeScript",lang:"ts"},null,8,["code"]),[[h,n.value==="TypeScript"]])]),f("div",te,[_(l(W,{logs:m.value,"onUpdate:logs":e[6]||(e[6]=t=>m.value=t),html:w.value,css:g.value,js:T.value,ts:x.value},null,8,["logs","html","css","js","ts"]),[[h,u.value==="HTML"]]),_(l(B,{logs:m.value,"onUpdate:logs":e[7]||(e[7]=t=>m.value=t)},null,8,["logs"]),[[h,u.value==="Console"]])])])]))}}),pe=H({__name:"index",setup(E){return(v,j)=>(J(),K(O,null,{main:V(()=>[l(se)]),_:1}))}});export{pe as default};
