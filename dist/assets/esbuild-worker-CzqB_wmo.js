(function(){"use strict";var Te={exports:{}},De;function Xe(){return De||(De=1,function(ee){(B=>{var K=Object.defineProperty,G=Object.getOwnPropertyDescriptor,Z=Object.getOwnPropertyNames,we=Object.prototype.hasOwnProperty,Pe=(t,n)=>{for(var r in n)K(t,r,{get:n[r],enumerable:!0})},Oe=(t,n,r,u)=>{if(n&&typeof n=="object"||typeof n=="function")for(let h of Z(n))!we.call(t,h)&&h!==r&&K(t,h,{get:()=>n[h],enumerable:!(u=G(n,h))||u.enumerable});return t},st=t=>Oe(K({},"__esModule",{value:!0}),t),ae=(t,n,r)=>new Promise((u,h)=>{var w=c=>{try{x(r.next(c))}catch(E){h(E)}},f=c=>{try{x(r.throw(c))}catch(E){h(E)}},x=c=>c.done?u(c.value):Promise.resolve(c.value).then(w,f);x((r=r.apply(t,n)).next())}),ve={};Pe(ve,{analyzeMetafile:()=>Et,analyzeMetafileSync:()=>jt,build:()=>bt,buildSync:()=>St,context:()=>xt,default:()=>Rt,formatMessages:()=>_t,formatMessagesSync:()=>Tt,initialize:()=>Ot,stop:()=>Pt,transform:()=>kt,transformSync:()=>$t,version:()=>vt}),B.exports=st(ve);function Ie(t){let n=u=>{if(u===null)r.write8(0);else if(typeof u=="boolean")r.write8(1),r.write8(+u);else if(typeof u=="number")r.write8(2),r.write32(u|0);else if(typeof u=="string")r.write8(3),r.write(ie(u));else if(u instanceof Uint8Array)r.write8(4),r.write(u);else if(u instanceof Array){r.write8(5),r.write32(u.length);for(let h of u)n(h)}else{let h=Object.keys(u);r.write8(6),r.write32(h.length);for(let w of h)r.write(ie(w)),n(u[w])}},r=new Me;return r.write32(0),r.write32(t.id<<1|+!t.isRequest),n(t.value),Re(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function it(t){let n=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return de(r.read());case 4:return r.read();case 5:{let f=r.read32(),x=[];for(let c=0;c<f;c++)x.push(n());return x}case 6:{let f=r.read32(),x={};for(let c=0;c<f;c++)x[de(r.read())]=n();return x}default:throw new Error("Invalid packet")}},r=new Me(t),u=r.read32(),h=(u&1)===0;u>>>=1;let w=n();if(r.ptr!==t.length)throw new Error("Invalid packet");return{id:u,isRequest:h,value:w}}var Me=class{constructor(t=new Uint8Array(1024)){this.buf=t,this.len=0,this.ptr=0}_write(t){if(this.len+t>this.buf.length){let n=new Uint8Array((this.len+t)*2);n.set(this.buf),this.buf=n}return this.len+=t,this.len-t}write8(t){let n=this._write(1);this.buf[n]=t}write32(t){let n=this._write(4);Re(this.buf,t,n)}write(t){let n=this._write(4+t.length);Re(this.buf,t.length,n),this.buf.set(t,n+4)}_read(t){if(this.ptr+t>this.buf.length)throw new Error("Invalid packet");return this.ptr+=t,this.ptr-t}read8(){return this.buf[this._read(1)]}read32(){return Fe(this.buf,this._read(4))}read(){let t=this.read32(),n=new Uint8Array(t),r=this._read(n.length);return n.set(this.buf.subarray(r,r+t)),n}},ie,de,Ce;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let t=new TextEncoder,n=new TextDecoder;ie=r=>t.encode(r),de=r=>n.decode(r),Ce='new TextEncoder().encode("")'}else if(typeof Buffer<"u")ie=t=>Buffer.from(t),de=t=>{let{buffer:n,byteOffset:r,byteLength:u}=t;return Buffer.from(n,r,u).toString()},Ce='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(ie("")instanceof Uint8Array))throw new Error(`Invariant violation: "${Ce} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function Fe(t,n){return t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24}function Re(t,n,r){t[r++]=n,t[r++]=n>>8,t[r++]=n>>16,t[r++]=n>>24}var Y=JSON.stringify,Ne="warning",Le="silent";function Ve(t){if(Q(t,"target"),t.indexOf(",")>=0)throw new Error(`Invalid target: ${t}`);return t}var be=()=>null,W=t=>typeof t=="boolean"?null:"a boolean",_=t=>typeof t=="string"?null:"a string",xe=t=>t instanceof RegExp?null:"a RegExp object",ue=t=>typeof t=="number"&&t===(t|0)?null:"an integer",Be=t=>typeof t=="function"?null:"a function",q=t=>Array.isArray(t)?null:"an array",ne=t=>typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"an object",lt=t=>typeof t=="object"&&t!==null?null:"an array or an object",ot=t=>t instanceof WebAssembly.Module?null:"a WebAssembly.Module",We=t=>typeof t=="object"&&!Array.isArray(t)?null:"an object or null",ze=t=>typeof t=="string"||typeof t=="boolean"?null:"a string or a boolean",at=t=>typeof t=="string"||typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"a string or an object",ut=t=>typeof t=="string"||Array.isArray(t)?null:"a string or an array",Ge=t=>typeof t=="string"||t instanceof Uint8Array?null:"a string or a Uint8Array",ct=t=>typeof t=="string"||t instanceof URL?null:"a string or a URL";function i(t,n,r,u){let h=t[r];if(n[r+""]=!0,h===void 0)return;let w=u(h);if(w!==null)throw new Error(`${Y(r)} must be ${w}`);return h}function H(t,n,r){for(let u in t)if(!(u in n))throw new Error(`Invalid option ${r}: ${Y(u)}`)}function ft(t){let n=Object.create(null),r=i(t,n,"wasmURL",ct),u=i(t,n,"wasmModule",ot),h=i(t,n,"worker",W);return H(t,n,"in initialize() call"),{wasmURL:r,wasmModule:u,worker:h}}function qe(t){let n;if(t!==void 0){n=Object.create(null);for(let r in t){let u=t[r];if(typeof u=="string"||u===!1)n[r]=u;else throw new Error(`Expected ${Y(r)} in mangle cache to map to either a string or false`)}}return n}function ke(t,n,r,u,h){let w=i(n,r,"color",W),f=i(n,r,"logLevel",_),x=i(n,r,"logLimit",ue);w!==void 0?t.push(`--color=${w}`):u&&t.push("--color=true"),t.push(`--log-level=${f||h}`),t.push(`--log-limit=${x||0}`)}function Q(t,n,r){if(typeof t!="string")throw new Error(`Expected value for ${n}${r!==void 0?" "+Y(r):""} to be a string, got ${typeof t} instead`);return t}function Je(t,n,r){let u=i(n,r,"legalComments",_),h=i(n,r,"sourceRoot",_),w=i(n,r,"sourcesContent",W),f=i(n,r,"target",ut),x=i(n,r,"format",_),c=i(n,r,"globalName",_),E=i(n,r,"mangleProps",xe),T=i(n,r,"reserveProps",xe),P=i(n,r,"mangleQuoted",W),V=i(n,r,"minify",W),A=i(n,r,"minifySyntax",W),R=i(n,r,"minifyWhitespace",W),X=i(n,r,"minifyIdentifiers",W),p=i(n,r,"lineLimit",ue),I=i(n,r,"drop",q),M=i(n,r,"dropLabels",q),g=i(n,r,"charset",_),a=i(n,r,"treeShaking",W),l=i(n,r,"ignoreAnnotations",W),o=i(n,r,"jsx",_),m=i(n,r,"jsxFactory",_),y=i(n,r,"jsxFragment",_),k=i(n,r,"jsxImportSource",_),$=i(n,r,"jsxDev",W),e=i(n,r,"jsxSideEffects",W),s=i(n,r,"define",ne),d=i(n,r,"logOverride",ne),v=i(n,r,"supported",ne),S=i(n,r,"pure",q),D=i(n,r,"keepNames",W),C=i(n,r,"platform",_),U=i(n,r,"tsconfigRaw",at);if(u&&t.push(`--legal-comments=${u}`),h!==void 0&&t.push(`--source-root=${h}`),w!==void 0&&t.push(`--sources-content=${w}`),f&&(Array.isArray(f)?t.push(`--target=${Array.from(f).map(Ve).join(",")}`):t.push(`--target=${Ve(f)}`)),x&&t.push(`--format=${x}`),c&&t.push(`--global-name=${c}`),C&&t.push(`--platform=${C}`),U&&t.push(`--tsconfig-raw=${typeof U=="string"?U:JSON.stringify(U)}`),V&&t.push("--minify"),A&&t.push("--minify-syntax"),R&&t.push("--minify-whitespace"),X&&t.push("--minify-identifiers"),p&&t.push(`--line-limit=${p}`),g&&t.push(`--charset=${g}`),a!==void 0&&t.push(`--tree-shaking=${a}`),l&&t.push("--ignore-annotations"),I)for(let O of I)t.push(`--drop:${Q(O,"drop")}`);if(M&&t.push(`--drop-labels=${Array.from(M).map(O=>Q(O,"dropLabels")).join(",")}`),E&&t.push(`--mangle-props=${E.source}`),T&&t.push(`--reserve-props=${T.source}`),P!==void 0&&t.push(`--mangle-quoted=${P}`),o&&t.push(`--jsx=${o}`),m&&t.push(`--jsx-factory=${m}`),y&&t.push(`--jsx-fragment=${y}`),k&&t.push(`--jsx-import-source=${k}`),$&&t.push("--jsx-dev"),e&&t.push("--jsx-side-effects"),s)for(let O in s){if(O.indexOf("=")>=0)throw new Error(`Invalid define: ${O}`);t.push(`--define:${O}=${Q(s[O],"define",O)}`)}if(d)for(let O in d){if(O.indexOf("=")>=0)throw new Error(`Invalid log override: ${O}`);t.push(`--log-override:${O}=${Q(d[O],"log override",O)}`)}if(v)for(let O in v){if(O.indexOf("=")>=0)throw new Error(`Invalid supported: ${O}`);const j=v[O];if(typeof j!="boolean")throw new Error(`Expected value for supported ${Y(O)} to be a boolean, got ${typeof j} instead`);t.push(`--supported:${O}=${j}`)}if(S)for(let O of S)t.push(`--pure:${Q(O,"pure")}`);D&&t.push("--keep-names")}function dt(t,n,r,u,h){var w;let f=[],x=[],c=Object.create(null),E=null,T=null;ke(f,n,c,r,u),Je(f,n,c);let P=i(n,c,"sourcemap",ze),V=i(n,c,"bundle",W),A=i(n,c,"splitting",W),R=i(n,c,"preserveSymlinks",W),X=i(n,c,"metafile",W),p=i(n,c,"outfile",_),I=i(n,c,"outdir",_),M=i(n,c,"outbase",_),g=i(n,c,"tsconfig",_),a=i(n,c,"resolveExtensions",q),l=i(n,c,"nodePaths",q),o=i(n,c,"mainFields",q),m=i(n,c,"conditions",q),y=i(n,c,"external",q),k=i(n,c,"packages",_),$=i(n,c,"alias",ne),e=i(n,c,"loader",ne),s=i(n,c,"outExtension",ne),d=i(n,c,"publicPath",_),v=i(n,c,"entryNames",_),S=i(n,c,"chunkNames",_),D=i(n,c,"assetNames",_),C=i(n,c,"inject",q),U=i(n,c,"banner",ne),O=i(n,c,"footer",ne),j=i(n,c,"entryPoints",lt),L=i(n,c,"absWorkingDir",_),F=i(n,c,"stdin",ne),N=(w=i(n,c,"write",W))!=null?w:h,re=i(n,c,"allowOverwrite",W),J=i(n,c,"mangleCache",ne);if(c.plugins=!0,H(n,c,`in ${t}() call`),P&&f.push(`--sourcemap${P===!0?"":`=${P}`}`),V&&f.push("--bundle"),re&&f.push("--allow-overwrite"),A&&f.push("--splitting"),R&&f.push("--preserve-symlinks"),X&&f.push("--metafile"),p&&f.push(`--outfile=${p}`),I&&f.push(`--outdir=${I}`),M&&f.push(`--outbase=${M}`),g&&f.push(`--tsconfig=${g}`),k&&f.push(`--packages=${k}`),a){let b=[];for(let z of a){if(Q(z,"resolve extension"),z.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${z}`);b.push(z)}f.push(`--resolve-extensions=${b.join(",")}`)}if(d&&f.push(`--public-path=${d}`),v&&f.push(`--entry-names=${v}`),S&&f.push(`--chunk-names=${S}`),D&&f.push(`--asset-names=${D}`),o){let b=[];for(let z of o){if(Q(z,"main field"),z.indexOf(",")>=0)throw new Error(`Invalid main field: ${z}`);b.push(z)}f.push(`--main-fields=${b.join(",")}`)}if(m){let b=[];for(let z of m){if(Q(z,"condition"),z.indexOf(",")>=0)throw new Error(`Invalid condition: ${z}`);b.push(z)}f.push(`--conditions=${b.join(",")}`)}if(y)for(let b of y)f.push(`--external:${Q(b,"external")}`);if($)for(let b in $){if(b.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${b}`);f.push(`--alias:${b}=${Q($[b],"alias",b)}`)}if(U)for(let b in U){if(b.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${b}`);f.push(`--banner:${b}=${Q(U[b],"banner",b)}`)}if(O)for(let b in O){if(b.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${b}`);f.push(`--footer:${b}=${Q(O[b],"footer",b)}`)}if(C)for(let b of C)f.push(`--inject:${Q(b,"inject")}`);if(e)for(let b in e){if(b.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${b}`);f.push(`--loader:${b}=${Q(e[b],"loader",b)}`)}if(s)for(let b in s){if(b.indexOf("=")>=0)throw new Error(`Invalid out extension: ${b}`);f.push(`--out-extension:${b}=${Q(s[b],"out extension",b)}`)}if(j)if(Array.isArray(j))for(let b=0,z=j.length;b<z;b++){let se=j[b];if(typeof se=="object"&&se!==null){let le=Object.create(null),te=i(se,le,"in",_),ye=i(se,le,"out",_);if(H(se,le,"in entry point at index "+b),te===void 0)throw new Error('Missing property "in" for entry point at index '+b);if(ye===void 0)throw new Error('Missing property "out" for entry point at index '+b);x.push([ye,te])}else x.push(["",Q(se,"entry point at index "+b)])}else for(let b in j)x.push([b,Q(j[b],"entry point",b)]);if(F){let b=Object.create(null),z=i(F,b,"contents",Ge),se=i(F,b,"resolveDir",_),le=i(F,b,"sourcefile",_),te=i(F,b,"loader",_);H(F,b,'in "stdin" object'),le&&f.push(`--sourcefile=${le}`),te&&f.push(`--loader=${te}`),se&&(T=se),typeof z=="string"?E=ie(z):z instanceof Uint8Array&&(E=z)}let me=[];if(l)for(let b of l)b+="",me.push(b);return{entries:x,flags:f,write:N,stdinContents:E,stdinResolveDir:T,absWorkingDir:L,nodePaths:me,mangleCache:qe(J)}}function ht(t,n,r,u){let h=[],w=Object.create(null);ke(h,n,w,r,u),Je(h,n,w);let f=i(n,w,"sourcemap",ze),x=i(n,w,"sourcefile",_),c=i(n,w,"loader",_),E=i(n,w,"banner",_),T=i(n,w,"footer",_),P=i(n,w,"mangleCache",ne);return H(n,w,`in ${t}() call`),f&&h.push(`--sourcemap=${f===!0?"external":f}`),x&&h.push(`--sourcefile=${x}`),c&&h.push(`--loader=${c}`),E&&h.push(`--banner=${E}`),T&&h.push(`--footer=${T}`),{flags:h,mangleCache:qe(P)}}function mt(t){const n={},r={didClose:!1,reason:""};let u={},h=0,w=0,f=new Uint8Array(16*1024),x=0,c=g=>{let a=x+g.length;if(a>f.length){let o=new Uint8Array(a*2);o.set(f),f=o}f.set(g,x),x+=g.length;let l=0;for(;l+4<=x;){let o=Fe(f,l);if(l+4+o>x)break;l+=4,R(f.subarray(l,l+o)),l+=o}l>0&&(f.copyWithin(0,l,x),x-=l)},E=g=>{r.didClose=!0,g&&(r.reason=": "+(g.message||g));const a="The service was stopped"+r.reason;for(let l in u)u[l](a,null);u={}},T=(g,a,l)=>{if(r.didClose)return l("The service is no longer running"+r.reason,null);let o=h++;u[o]=(m,y)=>{try{l(m,y)}finally{g&&g.unref()}},g&&g.ref(),t.writeToStdin(Ie({id:o,isRequest:!0,value:a}))},P=(g,a)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);t.writeToStdin(Ie({id:g,isRequest:!1,value:a}))},V=(g,a)=>ae(this,null,function*(){try{if(a.command==="ping"){P(g,{});return}if(typeof a.key=="number"){const l=n[a.key];if(!l)return;const o=l[a.command];if(o){yield o(g,a);return}}throw new Error("Invalid command: "+a.command)}catch(l){const o=[ce(l,t,null,void 0,"")];try{P(g,{errors:o})}catch{}}}),A=!0,R=g=>{if(A){A=!1;let l=String.fromCharCode(...g);if(l!=="0.21.5")throw new Error(`Cannot start service: Host version "0.21.5" does not match binary version ${Y(l)}`);return}let a=it(g);if(a.isRequest)V(a.id,a.value);else{let l=u[a.id];delete u[a.id],a.value.error?l(a.value.error,{}):l(null,a.value)}};return{readFromStdout:c,afterClose:E,service:{buildOrContext:({callName:g,refs:a,options:l,isTTY:o,defaultWD:m,callback:y})=>{let k=0;const $=w++,e={},s={ref(){++k===1&&a&&a.ref()},unref(){--k===0&&(delete n[$],a&&a.unref())}};n[$]=e,s.ref(),gt(g,$,T,P,s,t,e,l,o,m,(d,v)=>{try{y(d,v)}finally{s.unref()}})},transform:({callName:g,refs:a,input:l,options:o,isTTY:m,fs:y,callback:k})=>{const $=Ye();let e=s=>{try{if(typeof l!="string"&&!(l instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:d,mangleCache:v}=ht(g,o,m,Le),S={command:"transform",flags:d,inputFS:s!==null,input:s!==null?ie(s):typeof l=="string"?ie(l):l};v&&(S.mangleCache=v),T(a,S,(D,C)=>{if(D)return k(new Error(D),null);let U=he(C.errors,$),O=he(C.warnings,$),j=1,L=()=>{if(--j===0){let F={warnings:O,code:C.code,map:C.map,mangleCache:void 0,legalComments:void 0};"legalComments"in C&&(F.legalComments=C?.legalComments),C.mangleCache&&(F.mangleCache=C?.mangleCache),k(null,F)}};if(U.length>0)return k(ge("Transform failed",U,O),null);C.codeFS&&(j++,y.readFile(C.code,(F,N)=>{F!==null?k(F,null):(C.code=N,L())})),C.mapFS&&(j++,y.readFile(C.map,(F,N)=>{F!==null?k(F,null):(C.map=N,L())})),L()})}catch(d){let v=[];try{ke(v,o,{},m,Le)}catch{}const S=ce(d,t,$,void 0,"");T(a,{command:"error",flags:v,error:S},()=>{S.detail=$.load(S.detail),k(ge("Transform failed",[S],[]),null)})}};if((typeof l=="string"||l instanceof Uint8Array)&&l.length>1024*1024){let s=e;e=()=>y.writeFile(l,s)}e(null)},formatMessages:({callName:g,refs:a,messages:l,options:o,callback:m})=>{if(!o)throw new Error(`Missing second argument in ${g}() call`);let y={},k=i(o,y,"kind",_),$=i(o,y,"color",W),e=i(o,y,"terminalWidth",ue);if(H(o,y,`in ${g}() call`),k===void 0)throw new Error(`Missing "kind" in ${g}() call`);if(k!=="error"&&k!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${g}() call`);let s={command:"format-msgs",messages:oe(l,"messages",null,"",e),isWarning:k==="warning"};$!==void 0&&(s.color=$),e!==void 0&&(s.terminalWidth=e),T(a,s,(d,v)=>{if(d)return m(new Error(d),null);m(null,v.messages)})},analyzeMetafile:({callName:g,refs:a,metafile:l,options:o,callback:m})=>{o===void 0&&(o={});let y={},k=i(o,y,"color",W),$=i(o,y,"verbose",W);H(o,y,`in ${g}() call`);let e={command:"analyze-metafile",metafile:l};k!==void 0&&(e.color=k),$!==void 0&&(e.verbose=$),T(a,e,(s,d)=>{if(s)return m(new Error(s),null);m(null,d.result)})}}}}function gt(t,n,r,u,h,w,f,x,c,E,T){const P=Ye(),V=t==="context",A=(p,I)=>{const M=[];try{ke(M,x,{},c,Ne)}catch{}const g=ce(p,w,P,void 0,I);r(h,{command:"error",flags:M,error:g},()=>{g.detail=P.load(g.detail),T(ge(V?"Context failed":"Build failed",[g],[]),null)})};let R;if(typeof x=="object"){const p=x.plugins;if(p!==void 0){if(!Array.isArray(p))return A(new Error('"plugins" must be an array'),"");R=p}}if(R&&R.length>0){if(w.isSync)return A(new Error("Cannot use plugins in synchronous API calls"),"");pt(n,r,u,h,w,f,x,R,P).then(p=>{if(!p.ok)return A(p.error,p.pluginName);try{X(p.requestPlugins,p.runOnEndCallbacks,p.scheduleOnDisposeCallbacks)}catch(I){A(I,"")}},p=>A(p,""));return}try{X(null,(p,I)=>I([],[]),()=>{})}catch(p){A(p,"")}function X(p,I,M){const g=w.hasFS,{entries:a,flags:l,write:o,stdinContents:m,stdinResolveDir:y,absWorkingDir:k,nodePaths:$,mangleCache:e}=dt(t,x,c,Ne,g);if(o&&!w.hasFS)throw new Error('The "write" option is unavailable in this environment');const s={command:"build",key:n,entries:a,flags:l,write:o,stdinContents:m,stdinResolveDir:y,absWorkingDir:k||E,nodePaths:$,context:V};p&&(s.plugins=p),e&&(s.mangleCache=e);const d=(D,C)=>{const U={errors:he(D.errors,P),warnings:he(D.warnings,P),outputFiles:void 0,metafile:void 0,mangleCache:void 0},O=U.errors.slice(),j=U.warnings.slice();D.outputFiles&&(U.outputFiles=D.outputFiles.map(wt)),D.metafile&&(U.metafile=JSON.parse(D.metafile)),D.mangleCache&&(U.mangleCache=D.mangleCache),D.writeToStdout!==void 0&&console.log(de(D.writeToStdout).replace(/\n$/,"")),I(U,(L,F)=>{if(O.length>0||L.length>0){const N=ge("Build failed",O.concat(L),j.concat(F));return C(N,null,L,F)}C(null,U,L,F)})};let v,S;V&&(f["on-end"]=(D,C)=>new Promise(U=>{d(C,(O,j,L,F)=>{const N={errors:L,warnings:F};S&&S(O,j),v=void 0,S=void 0,u(D,N),U()})})),r(h,s,(D,C)=>{if(D)return T(new Error(D),null);if(!V)return d(C,(j,L)=>(M(),T(j,L)));if(C.errors.length>0)return T(ge("Context failed",C.errors,C.warnings),null);let U=!1;const O={rebuild:()=>(v||(v=new Promise((j,L)=>{let F;S=(re,J)=>{F||(F=()=>re?L(re):j(J))};const N=()=>{r(h,{command:"rebuild",key:n},(J,me)=>{J?L(new Error(J)):F?F():N()})};N()})),v),watch:(j={})=>new Promise((L,F)=>{if(!w.hasFS)throw new Error('Cannot use the "watch" API in this environment');H(j,{},"in watch() call"),r(h,{command:"watch",key:n},J=>{J?F(new Error(J)):L(void 0)})}),serve:(j={})=>new Promise((L,F)=>{if(!w.hasFS)throw new Error('Cannot use the "serve" API in this environment');const N={},re=i(j,N,"port",ue),J=i(j,N,"host",_),me=i(j,N,"servedir",_),b=i(j,N,"keyfile",_),z=i(j,N,"certfile",_),se=i(j,N,"fallback",_),le=i(j,N,"onRequest",Be);H(j,N,"in serve() call");const te={command:"serve",key:n,onRequest:!!le};re!==void 0&&(te.port=re),J!==void 0&&(te.host=J),me!==void 0&&(te.servedir=me),b!==void 0&&(te.keyfile=b),z!==void 0&&(te.certfile=z),se!==void 0&&(te.fallback=se),r(h,te,(ye,Dt)=>{if(ye)return F(new Error(ye));le&&(f["serve-request"]=(Ut,At)=>{le(At.args),u(Ut,{})}),L(Dt)})}),cancel:()=>new Promise(j=>{if(U)return j();r(h,{command:"cancel",key:n},()=>{j()})}),dispose:()=>new Promise(j=>{if(U)return j();U=!0,r(h,{command:"dispose",key:n},()=>{j(),M(),h.unref()})})};h.ref(),T(null,O)})}}var pt=(t,n,r,u,h,w,f,x,c)=>ae(void 0,null,function*(){let E=[],T=[],P={},V={},A=[],R=0,X=0,p=[],I=!1;x=[...x];for(let a of x){let l={};if(typeof a!="object")throw new Error(`Plugin at index ${X} must be an object`);const o=i(a,l,"name",_);if(typeof o!="string"||o==="")throw new Error(`Plugin at index ${X} is missing a name`);try{let m=i(a,l,"setup",Be);if(typeof m!="function")throw new Error("Plugin is missing a setup function");H(a,l,`on plugin ${Y(o)}`);let y={name:o,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};X++;let $=m({initialOptions:f,resolve:(e,s={})=>{if(!I)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof e!="string")throw new Error("The path to resolve must be a string");let d=Object.create(null),v=i(s,d,"pluginName",_),S=i(s,d,"importer",_),D=i(s,d,"namespace",_),C=i(s,d,"resolveDir",_),U=i(s,d,"kind",_),O=i(s,d,"pluginData",be),j=i(s,d,"with",ne);return H(s,d,"in resolve() call"),new Promise((L,F)=>{const N={command:"resolve",path:e,key:t,pluginName:o};if(v!=null&&(N.pluginName=v),S!=null&&(N.importer=S),D!=null&&(N.namespace=D),C!=null&&(N.resolveDir=C),U!=null)N.kind=U;else throw new Error('Must specify "kind" when calling "resolve"');O!=null&&(N.pluginData=c.store(O)),j!=null&&(N.with=yt(j,"with")),n(u,N,(re,J)=>{re!==null?F(new Error(re)):L({errors:he(J.errors,c),warnings:he(J.warnings,c),path:J.path,external:J.external,sideEffects:J.sideEffects,namespace:J.namespace,suffix:J.suffix,pluginData:c.load(J.pluginData)})})})},onStart(e){let s='This error came from the "onStart" callback registered here:',d=_e(new Error(s),h,"onStart");E.push({name:o,callback:e,note:d}),y.onStart=!0},onEnd(e){let s='This error came from the "onEnd" callback registered here:',d=_e(new Error(s),h,"onEnd");T.push({name:o,callback:e,note:d}),y.onEnd=!0},onResolve(e,s){let d='This error came from the "onResolve" callback registered here:',v=_e(new Error(d),h,"onResolve"),S={},D=i(e,S,"filter",xe),C=i(e,S,"namespace",_);if(H(e,S,`in onResolve() call for plugin ${Y(o)}`),D==null)throw new Error("onResolve() call is missing a filter");let U=R++;P[U]={name:o,callback:s,note:v},y.onResolve.push({id:U,filter:D.source,namespace:C||""})},onLoad(e,s){let d='This error came from the "onLoad" callback registered here:',v=_e(new Error(d),h,"onLoad"),S={},D=i(e,S,"filter",xe),C=i(e,S,"namespace",_);if(H(e,S,`in onLoad() call for plugin ${Y(o)}`),D==null)throw new Error("onLoad() call is missing a filter");let U=R++;V[U]={name:o,callback:s,note:v},y.onLoad.push({id:U,filter:D.source,namespace:C||""})},onDispose(e){A.push(e)},esbuild:h.esbuild});$&&(yield $),p.push(y)}catch(m){return{ok:!1,error:m,pluginName:o}}}w["on-start"]=(a,l)=>ae(void 0,null,function*(){let o={errors:[],warnings:[]};yield Promise.all(E.map(m=>ae(void 0,[m],function*({name:y,callback:k,note:$}){try{let e=yield k();if(e!=null){if(typeof e!="object")throw new Error(`Expected onStart() callback in plugin ${Y(y)} to return an object`);let s={},d=i(e,s,"errors",q),v=i(e,s,"warnings",q);H(e,s,`from onStart() callback in plugin ${Y(y)}`),d!=null&&o.errors.push(...oe(d,"errors",c,y,void 0)),v!=null&&o.warnings.push(...oe(v,"warnings",c,y,void 0))}}catch(e){o.errors.push(ce(e,h,c,$&&$(),y))}}))),r(a,o)}),w["on-resolve"]=(a,l)=>ae(void 0,null,function*(){let o={},m="",y,k;for(let $ of l.ids)try{({name:m,callback:y,note:k}=P[$]);let e=yield y({path:l.path,importer:l.importer,namespace:l.namespace,resolveDir:l.resolveDir,kind:l.kind,pluginData:c.load(l.pluginData),with:l.with});if(e!=null){if(typeof e!="object")throw new Error(`Expected onResolve() callback in plugin ${Y(m)} to return an object`);let s={},d=i(e,s,"pluginName",_),v=i(e,s,"path",_),S=i(e,s,"namespace",_),D=i(e,s,"suffix",_),C=i(e,s,"external",W),U=i(e,s,"sideEffects",W),O=i(e,s,"pluginData",be),j=i(e,s,"errors",q),L=i(e,s,"warnings",q),F=i(e,s,"watchFiles",q),N=i(e,s,"watchDirs",q);H(e,s,`from onResolve() callback in plugin ${Y(m)}`),o.id=$,d!=null&&(o.pluginName=d),v!=null&&(o.path=v),S!=null&&(o.namespace=S),D!=null&&(o.suffix=D),C!=null&&(o.external=C),U!=null&&(o.sideEffects=U),O!=null&&(o.pluginData=c.store(O)),j!=null&&(o.errors=oe(j,"errors",c,m,void 0)),L!=null&&(o.warnings=oe(L,"warnings",c,m,void 0)),F!=null&&(o.watchFiles=Ee(F,"watchFiles")),N!=null&&(o.watchDirs=Ee(N,"watchDirs"));break}}catch(e){o={id:$,errors:[ce(e,h,c,k&&k(),m)]};break}r(a,o)}),w["on-load"]=(a,l)=>ae(void 0,null,function*(){let o={},m="",y,k;for(let $ of l.ids)try{({name:m,callback:y,note:k}=V[$]);let e=yield y({path:l.path,namespace:l.namespace,suffix:l.suffix,pluginData:c.load(l.pluginData),with:l.with});if(e!=null){if(typeof e!="object")throw new Error(`Expected onLoad() callback in plugin ${Y(m)} to return an object`);let s={},d=i(e,s,"pluginName",_),v=i(e,s,"contents",Ge),S=i(e,s,"resolveDir",_),D=i(e,s,"pluginData",be),C=i(e,s,"loader",_),U=i(e,s,"errors",q),O=i(e,s,"warnings",q),j=i(e,s,"watchFiles",q),L=i(e,s,"watchDirs",q);H(e,s,`from onLoad() callback in plugin ${Y(m)}`),o.id=$,d!=null&&(o.pluginName=d),v instanceof Uint8Array?o.contents=v:v!=null&&(o.contents=ie(v)),S!=null&&(o.resolveDir=S),D!=null&&(o.pluginData=c.store(D)),C!=null&&(o.loader=C),U!=null&&(o.errors=oe(U,"errors",c,m,void 0)),O!=null&&(o.warnings=oe(O,"warnings",c,m,void 0)),j!=null&&(o.watchFiles=Ee(j,"watchFiles")),L!=null&&(o.watchDirs=Ee(L,"watchDirs"));break}}catch(e){o={id:$,errors:[ce(e,h,c,k&&k(),m)]};break}r(a,o)});let M=(a,l)=>l([],[]);T.length>0&&(M=(a,l)=>{ae(void 0,null,function*(){const o=[],m=[];for(const{name:y,callback:k,note:$}of T){let e,s;try{const d=yield k(a);if(d!=null){if(typeof d!="object")throw new Error(`Expected onEnd() callback in plugin ${Y(y)} to return an object`);let v={},S=i(d,v,"errors",q),D=i(d,v,"warnings",q);H(d,v,`from onEnd() callback in plugin ${Y(y)}`),S!=null&&(e=oe(S,"errors",c,y,void 0)),D!=null&&(s=oe(D,"warnings",c,y,void 0))}}catch(d){e=[ce(d,h,c,$&&$(),y)]}if(e){o.push(...e);try{a.errors.push(...e)}catch{}}if(s){m.push(...s);try{a.warnings.push(...s)}catch{}}}l(o,m)})});let g=()=>{for(const a of A)setTimeout(()=>a(),0)};return I=!0,{ok:!0,requestPlugins:p,runOnEndCallbacks:M,scheduleOnDisposeCallbacks:g}});function Ye(){const t=new Map;let n=0;return{load(r){return t.get(r)},store(r){if(r===void 0)return-1;const u=n++;return t.set(u,r),u}}}function _e(t,n,r){let u,h=!1;return()=>{if(h)return u;h=!0;try{let w=(t.stack+"").split(`
`);w.splice(1,1);let f=He(n,w,r);if(f)return u={text:t.message,location:f},u}catch{}}}function ce(t,n,r,u,h){let w="Internal error",f=null;try{w=(t&&t.message||t)+""}catch{}try{f=He(n,(t.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:h,text:w,location:f,notes:u?[u]:[],detail:r?r.store(t):-1}}function He(t,n,r){let u="    at ";if(t.readFileSync&&!n[0].startsWith(u)&&n[1].startsWith(u))for(let h=1;h<n.length;h++){let w=n[h];if(w.startsWith(u))for(w=w.slice(u.length);;){let f=/^(?:new |async )?\S+ \((.*)\)$/.exec(w);if(f){w=f[1];continue}if(f=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(w),f){w=f[1];continue}if(f=/^(\S+):(\d+):(\d+)$/.exec(w),f){let x;try{x=t.readFileSync(f[1],"utf8")}catch{break}let c=x.split(/\r\n|\r|\n|\u2028|\u2029/)[+f[2]-1]||"",E=+f[3]-1,T=c.slice(E,E+r.length)===r?r.length:0;return{file:f[1],namespace:"file",line:+f[2],column:ie(c.slice(0,E)).length,length:ie(c.slice(E,E+T)).length,lineText:c+`
`+n.slice(1).join(`
`),suggestion:""}}break}}return null}function ge(t,n,r){let u=5;t+=n.length<1?"":` with ${n.length} error${n.length<2?"":"s"}:`+n.slice(0,u+1).map((w,f)=>{if(f===u)return`
...`;if(!w.location)return`
error: ${w.text}`;let{file:x,line:c,column:E}=w.location,T=w.pluginName?`[plugin: ${w.pluginName}] `:"";return`
${x}:${c}:${E}: ERROR: ${T}${w.text}`}).join("");let h=new Error(t);for(const[w,f]of[["errors",n],["warnings",r]])Object.defineProperty(h,w,{configurable:!0,enumerable:!0,get:()=>f,set:x=>Object.defineProperty(h,w,{configurable:!0,enumerable:!0,value:x})});return h}function he(t,n){for(const r of t)r.detail=n.load(r.detail);return t}function Qe(t,n,r){if(t==null)return null;let u={},h=i(t,u,"file",_),w=i(t,u,"namespace",_),f=i(t,u,"line",ue),x=i(t,u,"column",ue),c=i(t,u,"length",ue),E=i(t,u,"lineText",_),T=i(t,u,"suggestion",_);if(H(t,u,n),E){const P=E.slice(0,(x&&x>0?x:0)+(c&&c>0?c:0)+(r&&r>0?r:80));!/[\x7F-\uFFFF]/.test(P)&&!/\n/.test(E)&&(E=P)}return{file:h||"",namespace:w||"",line:f||0,column:x||0,length:c||0,lineText:E||"",suggestion:T||""}}function oe(t,n,r,u,h){let w=[],f=0;for(const x of t){let c={},E=i(x,c,"id",_),T=i(x,c,"pluginName",_),P=i(x,c,"text",_),V=i(x,c,"location",We),A=i(x,c,"notes",q),R=i(x,c,"detail",be),X=`in element ${f} of "${n}"`;H(x,c,X);let p=[];if(A)for(const I of A){let M={},g=i(I,M,"text",_),a=i(I,M,"location",We);H(I,M,X),p.push({text:g||"",location:Qe(a,X,h)})}w.push({id:E||"",pluginName:T||u,text:P||"",location:Qe(V,X,h),notes:p,detail:r?r.store(R):-1}),f++}return w}function Ee(t,n){const r=[];for(const u of t){if(typeof u!="string")throw new Error(`${Y(n)} must be an array of strings`);r.push(u)}return r}function yt(t,n){const r=Object.create(null);for(const u in t){const h=t[u];if(typeof h!="string")throw new Error(`key ${Y(u)} in object ${Y(n)} must be a string`);r[u]=h}return r}function wt({path:t,contents:n,hash:r}){let u=null;return{path:t,contents:n,hash:r,get text(){const h=this.contents;return(u===null||h!==n)&&(n=h,u=de(h)),u}}}var vt="0.21.5",bt=t=>pe().build(t),xt=t=>pe().context(t),kt=(t,n)=>pe().transform(t,n),_t=(t,n)=>pe().formatMessages(t,n),Et=(t,n)=>pe().analyzeMetafile(t,n),St=()=>{throw new Error('The "buildSync" API only works in node')},$t=()=>{throw new Error('The "transformSync" API only works in node')},Tt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},jt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Pt=()=>(Se&&Se(),Promise.resolve()),fe,Se,$e,pe=()=>{if($e)return $e;throw fe?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Ot=t=>{t=ft(t||{});let n=t.wasmURL,r=t.wasmModule,u=t.worker!==!1;if(!n&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(fe)throw new Error('Cannot call "initialize" more than once');return fe=Ct(n||"",r,u),fe.catch(()=>{fe=void 0}),fe},Ct=(t,n,r)=>ae(void 0,null,function*(){let u;if(r){let E=new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
            // unused
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substring(0, nl));
                outputBuf = outputBuf.substring(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              go: {
                // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                // This changes the SP, thus we have to update the SP used by the imported function.
                // func wasmExit(code int32)
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                // func resetMemoryDataView()
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                // func nanotime1() int64
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                // func walltime() (sec int64, nsec int32)
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = (/* @__PURE__ */ new Date()).getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                // func scheduleTimeoutEvent(delay int64) int32
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8) + 1
                    // setTimeout has been seen to fire up to 1 millisecond early
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                // func clearTimeoutEvent(id int32)
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                // func getRandomData(r []byte)
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                // func finalizeRef(v ref)
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                // func stringVal(value string) ref
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                // func valueGet(v ref, p string) ref
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                // func valueSet(v ref, p string, x ref)
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                // func valueDelete(v ref, p string)
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                // func valueIndex(v ref, i int) ref
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                // valueSetIndex(v ref, i int, x ref)
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                // func valueCall(v ref, m string, args []ref) (ref, bool)
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                // func valueInvoke(v ref, args []ref) (ref, bool)
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueNew(v ref, args []ref) (ref, bool)
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueLength(v ref) int
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                // valuePrepareString(v ref) (ref, int)
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                // valueLoadString(v ref, b []byte)
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                // func valueInstanceOf(v ref, t ref) bool
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                // func copyBytesToGo(dst []byte, src ref) (int, bool)
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                // func copyBytesToJS(dst ref, src []byte) (int, bool)
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          run(instance) {
            return __async(this, null, function* () {
              if (!(instance instanceof WebAssembly.Instance)) {
                throw new Error("Go.run: WebAssembly.Instance expected");
              }
              this._inst = instance;
              this.mem = new DataView(this._inst.exports.mem.buffer);
              this._values = [
                // JS values that Go currently has references to, indexed by reference id
                NaN,
                0,
                null,
                true,
                false,
                globalThis,
                this
              ];
              this._goRefCounts = new Array(this._values.length).fill(Infinity);
              this._ids = /* @__PURE__ */ new Map([
                // mapping from JS values to reference ids
                [0, 1],
                [null, 2],
                [true, 3],
                [false, 4],
                [globalThis, 5],
                [this, 6]
              ]);
              this._idPool = [];
              this.exited = false;
              let offset = 4096;
              const strPtr = (str) => {
                const ptr = offset;
                const bytes = encoder.encode(str + "\\0");
                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                offset += bytes.length;
                if (offset % 8 !== 0) {
                  offset += 8 - offset % 8;
                }
                return ptr;
              };
              const argc = this.argv.length;
              const argvPtrs = [];
              this.argv.forEach((arg) => {
                argvPtrs.push(strPtr(arg));
              });
              argvPtrs.push(0);
              const keys = Object.keys(this.env).sort();
              keys.forEach((key) => {
                argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
              });
              argvPtrs.push(0);
              const argv = offset;
              argvPtrs.forEach((ptr) => {
                this.mem.setUint32(offset, ptr, true);
                this.mem.setUint32(offset + 4, 0, true);
                offset += 8;
              });
              const wasmMinDataAddr = 4096 + 8192;
              if (offset >= wasmMinDataAddr) {
                throw new Error("total length of command line and environment variables exceeds limit");
              }
              this._inst.exports.run(argc, argv);
              if (this.exited) {
                this._resolveExitPromise();
              }
              yield this._exitPromise;
            });
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1) console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin) resumeStdin();
          }
          return go;
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.21.5"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
        return go;
      };
      function tryToInstantiateModule(wasm, go) {
        return __async(this, null, function* () {
          if (wasm instanceof WebAssembly.Module) {
            return WebAssembly.instantiate(wasm, go.importObject);
          }
          const res = yield fetch(wasm);
          if (!res.ok) throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);
            return result2.instance;
          }
          const bytes = yield res.arrayBuffer();
          const result = yield WebAssembly.instantiate(bytes, go.importObject);
          return result.instance;
        });
      }
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});u=new Worker(URL.createObjectURL(E))}else{let E=(P=>{var V=(p,I,M)=>new Promise((g,a)=>{var l=y=>{try{m(M.next(y))}catch(k){a(k)}},o=y=>{try{m(M.throw(y))}catch(k){a(k)}},m=y=>y.done?g(y.value):Promise.resolve(y.value).then(l,o);m((M=M.apply(p,I)).next())});let A,R={};for(let p=self;p;p=Object.getPrototypeOf(p))for(let I of Object.getOwnPropertyNames(p))I in R||Object.defineProperty(R,I,{get:()=>self[I]});(()=>{const p=()=>{const g=new Error("not implemented");return g.code="ENOSYS",g};if(!R.fs){let g="";R.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(a,l){g+=M.decode(l);const o=g.lastIndexOf(`
`);return o!=-1&&(console.log(g.substring(0,o)),g=g.substring(o+1)),l.length},write(a,l,o,m,y,k){if(o!==0||m!==l.length||y!==null){k(p());return}const $=this.writeSync(a,l);k(null,$)},chmod(a,l,o){o(p())},chown(a,l,o,m){m(p())},close(a,l){l(p())},fchmod(a,l,o){o(p())},fchown(a,l,o,m){m(p())},fstat(a,l){l(p())},fsync(a,l){l(null)},ftruncate(a,l,o){o(p())},lchown(a,l,o,m){m(p())},link(a,l,o){o(p())},lstat(a,l){l(p())},mkdir(a,l,o){o(p())},open(a,l,o,m){m(p())},read(a,l,o,m,y,k){k(p())},readdir(a,l){l(p())},readlink(a,l){l(p())},rename(a,l,o){o(p())},rmdir(a,l){l(p())},stat(a,l){l(p())},symlink(a,l,o){o(p())},truncate(a,l,o){o(p())},unlink(a,l){l(p())},utimes(a,l,o,m){m(p())}}}if(R.process||(R.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw p()},pid:-1,ppid:-1,umask(){throw p()},cwd(){throw p()},chdir(){throw p()}}),!R.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!R.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!R.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!R.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const I=new TextEncoder("utf-8"),M=new TextDecoder("utf-8");R.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=e=>{e!==0&&console.warn("exit code:",e)},this._exitPromise=new Promise(e=>{this._resolveExitPromise=e}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const g=(e,s)=>{this.mem.setUint32(e+0,s,!0),this.mem.setUint32(e+4,Math.floor(s/4294967296),!0)},a=e=>{const s=this.mem.getUint32(e+0,!0),d=this.mem.getInt32(e+4,!0);return s+d*4294967296},l=e=>{const s=this.mem.getFloat64(e,!0);if(s===0)return;if(!isNaN(s))return s;const d=this.mem.getUint32(e,!0);return this._values[d]},o=(e,s)=>{if(typeof s=="number"&&s!==0){if(isNaN(s)){this.mem.setUint32(e+4,2146959360,!0),this.mem.setUint32(e,0,!0);return}this.mem.setFloat64(e,s,!0);return}if(s===void 0){this.mem.setFloat64(e,0,!0);return}let v=this._ids.get(s);v===void 0&&(v=this._idPool.pop(),v===void 0&&(v=this._values.length),this._values[v]=s,this._goRefCounts[v]=0,this._ids.set(s,v)),this._goRefCounts[v]++;let S=0;switch(typeof s){case"object":s!==null&&(S=1);break;case"string":S=2;break;case"symbol":S=3;break;case"function":S=4;break}this.mem.setUint32(e+4,2146959360|S,!0),this.mem.setUint32(e,v,!0)},m=e=>{const s=a(e+0),d=a(e+8);return new Uint8Array(this._inst.exports.mem.buffer,s,d)},y=e=>{const s=a(e+0),d=a(e+8),v=new Array(d);for(let S=0;S<d;S++)v[S]=l(s+S*8);return v},k=e=>{const s=a(e+0),d=a(e+8);return M.decode(new DataView(this._inst.exports.mem.buffer,s,d))},$=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":e=>{e>>>=0;const s=this.mem.getInt32(e+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(s)},"runtime.wasmWrite":e=>{e>>>=0;const s=a(e+8),d=a(e+16),v=this.mem.getInt32(e+24,!0);R.fs.writeSync(s,new Uint8Array(this._inst.exports.mem.buffer,d,v))},"runtime.resetMemoryDataView":e=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":e=>{e>>>=0,g(e+8,($+performance.now())*1e6)},"runtime.walltime":e=>{e>>>=0;const s=new Date().getTime();g(e+8,s/1e3),this.mem.setInt32(e+16,s%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":e=>{e>>>=0;const s=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(s,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(s);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},a(e+8)+1)),this.mem.setInt32(e+16,s,!0)},"runtime.clearTimeoutEvent":e=>{e>>>=0;const s=this.mem.getInt32(e+8,!0);clearTimeout(this._scheduledTimeouts.get(s)),this._scheduledTimeouts.delete(s)},"runtime.getRandomData":e=>{e>>>=0,crypto.getRandomValues(m(e+8))},"syscall/js.finalizeRef":e=>{e>>>=0;const s=this.mem.getUint32(e+8,!0);if(this._goRefCounts[s]--,this._goRefCounts[s]===0){const d=this._values[s];this._values[s]=null,this._ids.delete(d),this._idPool.push(s)}},"syscall/js.stringVal":e=>{e>>>=0,o(e+24,k(e+8))},"syscall/js.valueGet":e=>{e>>>=0;const s=Reflect.get(l(e+8),k(e+16));e=this._inst.exports.getsp()>>>0,o(e+32,s)},"syscall/js.valueSet":e=>{e>>>=0,Reflect.set(l(e+8),k(e+16),l(e+32))},"syscall/js.valueDelete":e=>{e>>>=0,Reflect.deleteProperty(l(e+8),k(e+16))},"syscall/js.valueIndex":e=>{e>>>=0,o(e+24,Reflect.get(l(e+8),a(e+16)))},"syscall/js.valueSetIndex":e=>{e>>>=0,Reflect.set(l(e+8),a(e+16),l(e+24))},"syscall/js.valueCall":e=>{e>>>=0;try{const s=l(e+8),d=Reflect.get(s,k(e+16)),v=y(e+32),S=Reflect.apply(d,s,v);e=this._inst.exports.getsp()>>>0,o(e+56,S),this.mem.setUint8(e+64,1)}catch(s){e=this._inst.exports.getsp()>>>0,o(e+56,s),this.mem.setUint8(e+64,0)}},"syscall/js.valueInvoke":e=>{e>>>=0;try{const s=l(e+8),d=y(e+16),v=Reflect.apply(s,void 0,d);e=this._inst.exports.getsp()>>>0,o(e+40,v),this.mem.setUint8(e+48,1)}catch(s){e=this._inst.exports.getsp()>>>0,o(e+40,s),this.mem.setUint8(e+48,0)}},"syscall/js.valueNew":e=>{e>>>=0;try{const s=l(e+8),d=y(e+16),v=Reflect.construct(s,d);e=this._inst.exports.getsp()>>>0,o(e+40,v),this.mem.setUint8(e+48,1)}catch(s){e=this._inst.exports.getsp()>>>0,o(e+40,s),this.mem.setUint8(e+48,0)}},"syscall/js.valueLength":e=>{e>>>=0,g(e+16,parseInt(l(e+8).length))},"syscall/js.valuePrepareString":e=>{e>>>=0;const s=I.encode(String(l(e+8)));o(e+16,s),g(e+24,s.length)},"syscall/js.valueLoadString":e=>{e>>>=0;const s=l(e+8);m(e+16).set(s)},"syscall/js.valueInstanceOf":e=>{e>>>=0,this.mem.setUint8(e+24,l(e+8)instanceof l(e+16)?1:0)},"syscall/js.copyBytesToGo":e=>{e>>>=0;const s=m(e+8),d=l(e+32);if(!(d instanceof Uint8Array||d instanceof Uint8ClampedArray)){this.mem.setUint8(e+48,0);return}const v=d.subarray(0,s.length);s.set(v),g(e+40,v.length),this.mem.setUint8(e+48,1)},"syscall/js.copyBytesToJS":e=>{e>>>=0;const s=l(e+8),d=m(e+16);if(!(s instanceof Uint8Array||s instanceof Uint8ClampedArray)){this.mem.setUint8(e+48,0);return}const v=d.subarray(0,s.length);s.set(v),g(e+40,v.length),this.mem.setUint8(e+48,1)},debug:e=>{console.log(e)}}}}run(g){return V(this,null,function*(){if(!(g instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=g,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,R,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[R,5],[this,6]]),this._idPool=[],this.exited=!1;let a=4096;const l=e=>{const s=a,d=I.encode(e+"\0");return new Uint8Array(this.mem.buffer,a,d.length).set(d),a+=d.length,a%8!==0&&(a+=8-a%8),s},o=this.argv.length,m=[];this.argv.forEach(e=>{m.push(l(e))}),m.push(0),Object.keys(this.env).sort().forEach(e=>{m.push(l(`${e}=${this.env[e]}`))}),m.push(0);const k=a;if(m.forEach(e=>{this.mem.setUint32(a,e,!0),this.mem.setUint32(a+4,0,!0),a+=8}),a>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(o,k),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(g){const a=this;return function(){const l={id:g,this:this,args:arguments};return a._pendingEvent=l,a._resume(),l.result}}}})(),A=({data:p})=>{let I=new TextDecoder,M=R.fs,g="";M.writeSync=(y,k)=>{if(y===1)P(k);else if(y===2){g+=I.decode(k);let $=g.split(`
`);$.length>1&&console.log($.slice(0,-1).join(`
`)),g=$[$.length-1]}else throw new Error("Bad write");return k.length};let a=[],l,o=0;A=({data:y})=>(y.length>0&&(a.push(y),l&&l()),m),M.read=(y,k,$,e,s,d)=>{if(y!==0||$!==0||e!==k.length||s!==null)throw new Error("Bad read");if(a.length===0){l=()=>M.read(y,k,$,e,s,d);return}let v=a[0],S=Math.max(0,Math.min(e,v.length-o));k.set(v.subarray(o,o+S),$),o+=S,o===v.length&&(a.shift(),o=0),d(null,S)};let m=new R.Go;return m.argv=["","--service=0.21.5"],X(p,m).then(y=>{P(null),m.run(y)},y=>{P(y)}),m};function X(p,I){return V(this,null,function*(){if(p instanceof WebAssembly.Module)return WebAssembly.instantiate(p,I.importObject);const M=yield fetch(p);if(!M.ok)throw new Error(`Failed to download ${JSON.stringify(p)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(M.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(M,I.importObject)).instance;const g=yield M.arrayBuffer();return(yield WebAssembly.instantiate(g,I.importObject)).instance})}return p=>A(p)})(P=>u.onmessage({data:P})),T;u={onmessage:null,postMessage:P=>setTimeout(()=>T=E({data:P})),terminate(){if(T)for(let P of T._scheduledTimeouts.values())clearTimeout(P)}}}let h,w;const f=new Promise((E,T)=>{h=E,w=T});u.onmessage=({data:E})=>{u.onmessage=({data:T})=>x(T),E?w(E):h()},u.postMessage(n||new URL(t,location.href).toString());let{readFromStdout:x,service:c}=mt({writeToStdin(E){u.postMessage(E)},isSync:!1,hasFS:!1,esbuild:ve});yield f,Se=()=>{u.terminate(),fe=void 0,Se=void 0,$e=void 0},$e={build:E=>new Promise((T,P)=>c.buildOrContext({callName:"build",refs:null,options:E,isTTY:!1,defaultWD:"/",callback:(V,A)=>V?P(V):T(A)})),context:E=>new Promise((T,P)=>c.buildOrContext({callName:"context",refs:null,options:E,isTTY:!1,defaultWD:"/",callback:(V,A)=>V?P(V):T(A)})),transform:(E,T)=>new Promise((P,V)=>c.transform({callName:"transform",refs:null,input:E,options:T||{},isTTY:!1,fs:{readFile(A,R){R(new Error("Internal error"),null)},writeFile(A,R){R(null)}},callback:(A,R)=>A?V(A):P(R)})),formatMessages:(E,T)=>new Promise((P,V)=>c.formatMessages({callName:"formatMessages",refs:null,messages:E,options:T,callback:(A,R)=>A?V(A):P(R)})),analyzeMetafile:(E,T)=>new Promise((P,V)=>c.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof E=="string"?E:JSON.stringify(E),options:T,callback:(A,R)=>A?V(A):P(R)}))}}),Rt=ve})(ee)}(Te)),Te.exports}var Ue=Xe();function Ke(ee){return{name:"virtual-fs",setup(B){const K=G=>!!G&&/^(https?:)?\/\//.test(G);B.onResolve({filter:/^\.\.\//},G=>K(G.importer)?null:{path:new URL(G.path,"file://"+G.resolveDir+"/").pathname,namespace:"virtual"}),B.onResolve({filter:/^\.\//},G=>K(G.importer)?null:{path:new URL(G.path,"file://"+G.resolveDir+"/").pathname,namespace:"virtual"}),B.onResolve({filter:/^\//},G=>K(G.importer)?null:{path:G.path,namespace:"virtual"}),B.onLoad({filter:/.*/,namespace:"virtual"},async G=>{const Z=G.path,we=ee[Z];if(we==null)return null;const Pe=Z.endsWith(".tsx")?"tsx":Z.endsWith(".ts")?"ts":Z.endsWith(".jsx")?"jsx":Z.endsWith(".js")?"js":"ts",Oe=Z.substring(0,Z.lastIndexOf("/"))||"/";return{contents:we,loader:Pe,resolveDir:Oe}})}}}const Ze="https://esm.sh",je=new Map;function et(ee){return`${Ze}/${ee}?bundle`}function tt(){return{name:"http-npm",setup(ee){ee.onResolve({filter:/^[^.\/]|^\@/},B=>({path:et(B.path),namespace:"http-url"})),ee.onResolve({filter:/^https?:\/\//},B=>({path:B.path,namespace:"http-url"})),ee.onResolve({filter:/^\.\.?\//,namespace:"http-url"},B=>({path:new URL(B.path,B.importer).toString(),namespace:"http-url"})),ee.onResolve({filter:/^\//,namespace:"http-url"},B=>({path:new URL(B.path,B.importer).toString(),namespace:"http-url"})),ee.onLoad({filter:/.*/,namespace:"http-url"},async B=>{if(je.has(B.path))return{contents:je.get(B.path),loader:"js"};const K=await fetch(B.path);if(!K.ok)throw new Error(`Failed to fetch ${B.path}: ${K.status}`);const G=await K.text();return je.set(B.path,G),{contents:G,loader:"js"}})}}}let Ae=!1;async function nt(){Ae||(await Ue.initialize({wasmURL:"/esbuild.wasm",worker:!1}),Ae=!0)}async function rt(ee,B="/index.ts"){return await nt(),(await Ue.build({entryPoints:[B],bundle:!0,write:!1,format:"esm",platform:"browser",sourcemap:"inline",plugins:[Ke(ee),tt()]})).outputFiles[0].text}self.onmessage=async ee=>{const{type:B,fileMap:K,entry:G}=ee.data??{};if(B==="bundle")try{const Z=await rt(K,G);self.postMessage({type:"bundle:ok",payload:{code:Z}})}catch(Z){self.postMessage({type:"bundle:err",error:String(Z?.message||Z)})}}})();
