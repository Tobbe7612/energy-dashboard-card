/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

class DashboardRequestGuard {
    constructor() {
        this.generation = 0;
    }
    invalidate() {
        this.generation += 1;
        this.activeRequest = undefined;
    }
    async run(connection, configEntryId, getCurrentContext, request, callbacks) {
        if (this.activeRequest) {
            if (this.isCurrent(this.activeRequest, getCurrentContext()))
                return;
            this.activeRequest = undefined;
        }
        const token = {
            generation: this.generation,
            connection,
            configEntryId,
        };
        this.activeRequest = token;
        callbacks.onStart();
        try {
            const payload = await request();
            if (this.isCurrent(token, getCurrentContext())) {
                callbacks.onSuccess(payload);
            }
        }
        catch (error) {
            if (this.isCurrent(token, getCurrentContext())) {
                callbacks.onFailure(error);
            }
        }
        finally {
            if (this.isCurrent(token, getCurrentContext())) {
                callbacks.onFinish();
                this.activeRequest = undefined;
            }
        }
    }
    isCurrent(token, context) {
        return this.activeRequest === token &&
            token.generation === this.generation &&
            token.connection === context.connection &&
            token.configEntryId === context.configEntryId &&
            context.isConnected;
    }
}
class DashboardSubscription {
    constructor() {
        this.generation = 0;
    }
    isUsing(connection) {
        return this.connection === connection;
    }
    subscribe(connection, configEntryId, onPayload, onError) {
        if (this.unsubscribe)
            return Promise.resolve();
        if (this.pending)
            return this.pending;
        const generation = this.generation;
        this.connection = connection;
        this.pending = (async () => {
            try {
                const unsubscribe = await connection.subscribeMessage((payload) => {
                    if (generation === this.generation)
                        onPayload(payload);
                }, {
                    type: "solar_battery_economy/subscribe_dashboard_data",
                    config_entry_id: configEntryId,
                });
                if (generation !== this.generation) {
                    unsubscribe();
                    return;
                }
                this.unsubscribe = unsubscribe;
            }
            catch (error) {
                if (generation === this.generation)
                    onError(error);
            }
            finally {
                if (generation === this.generation)
                    this.pending = undefined;
            }
        })();
        return this.pending;
    }
    unsubscribeNow() {
        this.generation += 1;
        this.unsubscribe?.();
        this.unsubscribe = undefined;
        this.pending = undefined;
        this.connection = undefined;
    }
}

const DASHBOARD_TIME_ZONE = "Europe/Stockholm";
const SWEDISH_TIME_FORMATTER = new Intl.DateTimeFormat("sv-SE", {
    timeZone: DASHBOARD_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
});
function formatTimeLabelWithFormatter(formatter, date) {
    return formatter.format(date);
}
function formatIntervalWithFormatter(formatter, start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())) {
        return "—";
    }
    return `${formatter.format(startDate)}–${formatter.format(endDate)}`;
}

const DEFAULT_DASHBOARD_VIEW = "today";
const STOCKHOLM_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-CA", {
    timeZone: DASHBOARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
});
function getStockholmDateParts(timestamp) {
    const parts = STOCKHOLM_DATE_TIME_FORMATTER.formatToParts(new Date(timestamp));
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        hour: Number(values.hour),
        minute: Number(values.minute),
        second: Number(values.second),
    };
}
function getStockholmMidnight(timestamp, dayOffset) {
    const { year, month, day } = getStockholmDateParts(timestamp);
    const calendarDate = new Date(Date.UTC(year, month - 1, day + dayOffset));
    const targetAsUtc = Date.UTC(calendarDate.getUTCFullYear(), calendarDate.getUTCMonth(), calendarDate.getUTCDate());
    let result = targetAsUtc;
    for (let attempt = 0; attempt < 2; attempt += 1) {
        const local = getStockholmDateParts(result);
        const localAsUtc = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second);
        result = targetAsUtc - (localAsUtc - result);
    }
    return result;
}
function getTimelineBounds(payload, view) {
    const windowStart = new Date(payload.window.start).getTime();
    const todayStart = new Date(payload.window.today_start).getTime();
    if (!Number.isFinite(windowStart) ||
        !Number.isFinite(todayStart)) {
        return undefined;
    }
    const tomorrowStart = getStockholmMidnight(todayStart, 1);
    const followingStart = getStockholmMidnight(todayStart, 2);
    const bounds = view === "yesterday"
        ? { start: windowStart, end: todayStart, includeEnd: false }
        : view === "today"
            ? { start: todayStart, end: tomorrowStart, includeEnd: false }
            : { start: tomorrowStart, end: followingStart, includeEnd: false };
    return bounds.end > bounds.start ? bounds : undefined;
}
function isTimestampInTimeline(timestamp, bounds) {
    return Number.isFinite(timestamp) &&
        timestamp >= bounds.start &&
        (bounds.includeEnd ? timestamp <= bounds.end : timestamp < bounds.end);
}
function shouldShowNowMarker(view) {
    return view === "today";
}
function shouldIncludeForecast(view) {
    return view !== "yesterday";
}
function shouldIncludeConsumption(view) {
    return view !== "tomorrow";
}
function isHistoricalPriceInTimeline(timestamp, bounds, now) {
    return isTimestampInTimeline(timestamp, bounds) && timestamp < now;
}
function isConsumptionTimestampInTimeline(timestamp, bounds, now) {
    return isTimestampInTimeline(timestamp, bounds) && timestamp < now;
}
function isFuturePriceInTimeline(start, end, bounds, now) {
    return isTimestampInTimeline(start, bounds) &&
        Number.isFinite(end) &&
        end > now;
}
function getFuturePriceIntervals(forecast, bounds, now) {
    return forecast
        .filter((item) => isFuturePriceInTimeline(new Date(item.start).getTime(), new Date(item.end).getTime(), bounds, now))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

let EnergyDashboardCard = class EnergyDashboardCard extends i {
    constructor() {
        super(...arguments);
        this.loading = false;
        this.view = DEFAULT_DASHBOARD_VIEW;
        this.dashboardSubscription = new DashboardSubscription();
        this.dashboardRequestGuard = new DashboardRequestGuard();
    }
    setConfig(config) {
        if (!config || config.type !== "custom:energy-dashboard-card") {
            throw new Error("Invalid configuration for energy-dashboard-card");
        }
        if (!config.config_entry_id) {
            throw new Error("config_entry_id is required");
        }
        if (this.config?.config_entry_id !== config.config_entry_id) {
            this.dashboardSubscription.unsubscribeNow();
            this.invalidateFallbackRequests();
            this.data = undefined;
        }
        this.config = config;
        if (this.isConnected)
            void this.ensureDashboardSubscription();
    }
    connectedCallback() {
        super.connectedCallback();
        this.invalidateFallbackRequests();
        void this.ensureDashboardSubscription();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.dashboardSubscription.unsubscribeNow();
        this.invalidateFallbackRequests();
    }
    updated(changed) {
        if (changed.has("hass")) {
            const previousHass = changed.get("hass");
            if ((previousHass?.connection ?? previousHass) !==
                (this.hass?.connection ?? this.hass)) {
                this.invalidateFallbackRequests();
            }
            if (this.hass) {
                void this.ensureDashboardSubscription();
            }
            else {
                this.dashboardSubscription.unsubscribeNow();
            }
        }
    }
    async ensureDashboardSubscription() {
        if (!this.isConnected || !this.hass || !this.config?.config_entry_id) {
            return;
        }
        const connection = this.hass.connection;
        if (!connection?.subscribeMessage) {
            this.dashboardSubscription.unsubscribeNow();
            if (!this.data && !this.loading)
                void this.loadDashboardData();
            return;
        }
        if (!this.dashboardSubscription.isUsing(connection)) {
            this.dashboardSubscription.unsubscribeNow();
        }
        await this.dashboardSubscription.subscribe(connection, this.config.config_entry_id, (payload) => {
            if (this.isConnected) {
                this.data = payload;
                this.error = undefined;
            }
        }, () => {
            if (this.isConnected && !this.data) {
                this.error = undefined;
                void this.loadDashboardData();
            }
        });
    }
    invalidateFallbackRequests() {
        this.dashboardRequestGuard.invalidate();
        this.loading = false;
    }
    async loadDashboardData() {
        if (!this.hass)
            return;
        const hass = this.hass;
        const configEntryId = this.config.config_entry_id;
        await this.dashboardRequestGuard.run(hass.connection ?? hass, configEntryId, () => ({
            connection: this.hass?.connection ?? this.hass,
            configEntryId: this.config?.config_entry_id,
            isConnected: this.isConnected,
        }), () => hass.callWS({
            type: "solar_battery_economy/get_dashboard_data",
            config_entry_id: configEntryId,
        }), {
            onStart: () => {
                this.loading = true;
                this.error = undefined;
            },
            onSuccess: (payload) => { this.data = payload; },
            onFailure: (error) => {
                this.error =
                    error instanceof Error
                        ? error.message
                        : JSON.stringify(error, null, 2);
            },
            onFinish: () => { this.loading = false; },
        });
    }
    render() {
        if (this.loading) {
            return b `
        <ha-card>
          <div class="content loading">
            Laddar Energy Dashboard…
          </div>
        </ha-card>
      `;
        }
        if (this.error) {
            return b `
        <ha-card>
          <div class="content">
            <div class="title">Energy Dashboard</div>
            <div class="error">${this.error}</div>
          </div>
        </ha-card>
      `;
        }
        if (!this.data) {
            return b `
        <ha-card>
          <div class="content">
            Ingen dashboarddata ännu.
          </div>
        </ha-card>
      `;
        }
        return b `
      <ha-card>
        <div class="dashboard-layout">
          <div class="dashboard-overview">
            ${this.renderPriceHeader()}
          </div>

          <div class="dashboard-smart-score">
            ${this.renderSmartScoreSection()}
          </div>

          <div class="dashboard-timeline-prices">
            <div class="dashboard-timeline">
              ${this.renderTimelineSection()}
            </div>

          ${this.view === "today"
            ? b `<div class="dashboard-upcoming">
                ${this.renderUpcomingPricesSection()}
              </div>`
            : ""}
          </div>

          <div class="dashboard-lower-grid">
            <div class="dashboard-consumers">
              ${this.renderConsumersSection()}
            </div>

            <div class="dashboard-insights">
              ${this.renderInsightsSection()}
            </div>
          </div>
        </div>
      </ha-card>
    `;
    }
    // ---------------------------------------------------------------------------
    // PRICE HEADER
    // ---------------------------------------------------------------------------
    renderPriceHeader() {
        if (!this.data)
            return b ``;
        const current = this.data.price.current;
        const intelligence = this.data.price_intelligence;
        const statistics = intelligence.today_import_price_statistics;
        const priceClass = this.getPriceClassLabel(current.price_class);
        const priceClassKey = current.price_class.toLowerCase();
        const pqi = intelligence.price_quality_index;
        const gaugeAngle = 135 + (100 - pqi) * 2.7;
        return b `
      <section class="price-header">
        <div class="overview-layout">
          <div class="current-price-card ${priceClassKey}">
            <div class="eyebrow">IMPORTPRIS JUST NU</div>

            <div class="price-gauge" style="--pqi-angle: ${gaugeAngle}deg">
              <div class="price-gauge-ring" aria-hidden="true"></div>
              <div class="price-gauge-marker" aria-hidden="true"></div>

              <div class="price-gauge-center">
                <div class="current-price-row">
                  <div class="current-price">
                    ${this.formatPrice(current.import)}
                    <span class="unit">kr/kWh</span>
                  </div>

                  <div class="price-status ${priceClassKey}">
                    <div class="status-label">${priceClass}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="current-time">
              ${this.formatInterval(current.start, current.end)}
            </div>
          </div>

          <div class="overview-support">
            <div class="price-quality-summary">
              <div class="pqi-label">PRISINDEX (PQI)</div>
              <div class="pqi-value">
                ${this.formatNumber(intelligence.price_quality_index, 0)}<span>/100</span>
              </div>
            </div>

            <div class="price-stats">
              <div class="stat">
                <div class="stat-label">Lägsta</div>
                <div class="stat-value">
                  ${this.formatPrice(statistics.lowest_import_price)}
                </div>
              </div>

              <div class="stat">
                <div class="stat-label">Snitt</div>
                <div class="stat-value">
                  ${this.formatPrice(statistics.average_import_price)}
                </div>
              </div>

              <div class="stat">
                <div class="stat-label">Högsta</div>
                <div class="stat-value">
                  ${this.formatPrice(statistics.highest_import_price)}
                </div>
              </div>
            </div>

            ${this.renderKpiSection()}
          </div>
        </div>
      </section>
    `;
    }
    // ---------------------------------------------------------------------------
    // TIMELINE
    // ---------------------------------------------------------------------------
    renderTimelineSection() {
        if (!this.data)
            return b ``;
        const timeline = this.buildTimelineModel();
        if (!timeline) {
            return b `
        <section class="timeline-section">
          <div class="section-title">IMPORTPRIS & HUSFÖRBRUKNING</div>
          <div class="timeline-empty">
            Ingen tillräcklig tidsseriedata tillgänglig.
          </div>
        </section>
      `;
        }
        const consumerSeries = this.getConsumerTimelineSeries(timeline);
        return b `
      <section class="timeline-section">
        <div class="timeline-heading">
          <div>
            <div class="section-title">
              IMPORTPRIS & HUSFÖRBRUKNING
            </div>
            <div class="timeline-subtitle">
              ${this.view === "yesterday"
            ? "Gårdagens lokala dygn"
            : this.view === "today"
                ? "Dagens lokala dygn"
                : "Morgondagens lokala dygn"}
            </div>
          </div>
          <div class="timeline-view-selector" role="group" aria-label="Tidsvy">
            <button
              type="button"
              aria-pressed="${this.view === "yesterday"}"
              class=${this.view === "yesterday" ? "selected" : ""}
              @click=${() => this.setView("yesterday")}
            >IGÅR</button>
            <button
              type="button"
              aria-pressed="${this.view === "today"}"
              class=${this.view === "today" ? "selected" : ""}
              @click=${() => this.setView("today")}
            >IDAG</button>
            <button
              type="button"
              aria-pressed="${this.view === "tomorrow"}"
              class=${this.view === "tomorrow" ? "selected" : ""}
              @click=${() => this.setView("tomorrow")}
            >IMORGON</button>
          </div>
          <div class="timeline-legend">
            <span class="legend-item">
              <span class="legend-line history"></span>
              Historik
            </span>
            <span class="legend-item">
              <span class="legend-line future"></span>
              Prognos
            </span>
            <span class="legend-item">
              <span class="legend-bar"></span>
              Förbrukning
            </span>
            ${consumerSeries.map(({ consumer, index }) => b `
              <span class="legend-item">
                <span
                  class="legend-consumer"
                  style="--consumer-accent: ${this.getConsumerColor(index)}"
                ></span>
                ${consumer.name || this.getConsumerFallbackName(consumer)}
              </span>
            `)}
          </div>
        </div>

        <div class="timeline-chart">
          ${w `
            <svg
              viewBox="0 0 ${timeline.width} ${timeline.height}"
              preserveAspectRatio="none"
              role="img"
              aria-label="Tidslinje för importpris och husförbrukning"
            >
              ${this.renderTimelineGrid(timeline)}
              ${this.renderHouseBars(timeline)}
              ${this.renderConsumerSeries(timeline, consumerSeries)}
              ${this.renderHistoricalImportPrice(timeline)}
              ${this.renderFutureImportPrice(timeline)}
              ${shouldShowNowMarker(this.view)
            ? this.renderNowMarker(timeline, this.data.price.current.price_class.toLowerCase())
            : w ``}
              ${this.renderTimelineLabels(timeline)}
            </svg>
          `}
        </div>
      </section>
    `;
    }
    buildTimelineModel() {
        if (!this.data)
            return undefined;
        const bounds = getTimelineBounds(this.data, this.view);
        const now = Date.now();
        if (!bounds)
            return undefined;
        const { start, end } = bounds;
        const forecast = shouldIncludeForecast(this.view)
            ? getFuturePriceIntervals(this.data.price.forecast, bounds, now)
            : [];
        const width = 1000;
        const height = 250;
        const plot = {
            left: 52,
            right: 46,
            top: 18,
            bottom: 34,
        };
        const plotWidth = width - plot.left - plot.right;
        const plotHeight = height - plot.top - plot.bottom;
        const timelineNow = shouldShowNowMarker(this.view)
            ? Math.min(Math.max(now, start), end)
            : this.view === "yesterday"
                ? end
                : start;
        const x = (timestamp) => plot.left +
            ((timestamp - start) / (end - start)) * plotWidth;
        const importValues = [
            ...this.data.price_history.import_intervals
                .filter((item) => isTimestampInTimeline(new Date(item.start).getTime(), bounds))
                .map((item) => item.import),
            ...forecast.map((item) => item.import),
        ].filter((value) => Number.isFinite(value) && value >= 0);
        const currentImportStart = new Date(this.data.price.current.start).getTime();
        const currentImport = isTimestampInTimeline(currentImportStart, bounds)
            ? this.data.price.current.import
            : 0;
        const maxImport = Math.max(currentImport, ...importValues, 0.01);
        const importMax = this.roundChartMax(maxImport);
        const houseValues = this.data.house_history
            .filter((item) => shouldIncludeConsumption(this.view) &&
            isConsumptionTimestampInTimeline(new Date(item.start).getTime(), bounds, timelineNow))
            .map((item) => item.energy_kwh)
            .filter((value) => Number.isFinite(value) && value > 0);
        const maxHouse = Math.max(...houseValues, 0.01);
        const houseMax = this.roundChartMax(maxHouse);
        const yImport = (value) => plot.top + plotHeight - (value / importMax) * plotHeight;
        const yHouse = (value) => plot.top + plotHeight - (value / houseMax) * plotHeight;
        return {
            width,
            height,
            plot,
            plotWidth,
            plotHeight,
            start,
            end,
            now: timelineNow,
            bounds,
            x,
            yImport,
            yHouse,
            importMax,
            houseMax,
            historyEnd: end,
            forecast,
        };
    }
    roundChartMax(value) {
        if (!Number.isFinite(value) || value <= 0)
            return 1;
        const step = value <= 2
            ? 0.5
            : value <= 5
                ? 1
                : value <= 10
                    ? 2
                    : 5;
        return Math.ceil(value / step) * step;
    }
    getTimelineHourTicks(timeline) {
        if (!timeline)
            return [];
        const hourMs = 60 * 60 * 1000;
        const firstHour = Math.ceil(timeline.start / hourMs) * hourMs;
        const ticks = [];
        for (let tick = firstHour; tick <= timeline.end; tick += hourMs) {
            ticks.push(tick);
        }
        const desktopStride = Math.max(1, Math.ceil(ticks.length / 26));
        return ticks.map((tick, index) => ({
            timestamp: tick,
            desktop: index % desktopStride === 0,
            narrow: index % (desktopStride * 2) === 0,
            mobile: index % (desktopStride * 3) === 0,
        }));
    }
    getConsumerTimelineSeries(timeline) {
        if (!timeline ||
            !this.data ||
            !shouldIncludeConsumption(this.view))
            return [];
        return Object.values(this.data.consumers)
            .map((consumer, index) => {
            const points = consumer.history
                .map((point) => ({
                start: new Date(point.start).getTime(),
                end: new Date(point.end).getTime(),
                energy_kwh: point.energy_kwh,
            }))
                .filter((point) => Number.isFinite(point.start) &&
                Number.isFinite(point.end) &&
                point.end > point.start &&
                Number.isFinite(point.energy_kwh) &&
                point.energy_kwh > 0 &&
                isConsumptionTimestampInTimeline(point.start, timeline.bounds, timeline.now));
            return { consumer, index, points };
        })
            .filter(({ points }) => points.some((point) => point.energy_kwh > 0));
    }
    renderConsumerSeries(timeline, series) {
        if (!timeline)
            return w ``;
        return series.map(({ consumer, index, points }) => {
            const areas = points.map((point) => {
                const start = Math.max(point.start, timeline.start);
                const end = Math.min(point.end, timeline.now);
                if (end <= start)
                    return w ``;
                const x1 = timeline.x(start);
                const x2 = timeline.x(end);
                const y = timeline.yHouse(point.energy_kwh);
                const baseline = timeline.plot.top + timeline.plotHeight;
                return w `
          <rect
            x="${x1}"
            y="${y}"
            width="${Math.max(1, x2 - x1)}"
            height="${Math.max(1, baseline - y)}"
            rx="1"
            fill-opacity="0.52"
          >
            <title>
              ${consumer.name || this.getConsumerFallbackName(consumer)}
              · ${this.formatInterval(new Date(point.start).toISOString(), new Date(point.end).toISOString())}
              · ${this.formatNumber(point.energy_kwh, 3)} kWh
            </title>
          </rect>
          <line
            class="consumer-series-edge"
            x1="${x1}"
            x2="${x2}"
            y1="${y}"
            y2="${y}"
          ></line>
        `;
            });
            if (areas.length === 0)
                return w ``;
            return w `
        <g
          class="consumer-series"
          style="--consumer-accent: ${this.getConsumerColor(index)}"
        >
          <title>${consumer.name || this.getConsumerFallbackName(consumer)}</title>
          ${areas}
        </g>
      `;
        });
    }
    renderTimelineGrid(timeline) {
        if (!timeline)
            return w ``;
        const yTicks = [0, 0.25, 0.5, 0.75, 1];
        const timeTicks = this.getTimelineHourTicks(timeline);
        const gridColor = "var(--divider-color)";
        const secondary = "var(--secondary-text-color)";
        return w `
      ${yTicks.map((ratio) => {
            const y = timeline.plot.top +
                timeline.plotHeight -
                ratio * timeline.plotHeight;
            const value = timeline.importMax * ratio;
            return w `
          <line
            x1="${timeline.plot.left}"
            x2="${timeline.width - timeline.plot.right}"
            y1="${y}"
            y2="${y}"
            stroke="${gridColor}"
            stroke-width="1"
            opacity="${ratio === 0 ? 0.7 : 0.35}"
          ></line>
          <text
            x="${timeline.plot.left - 8}"
            y="${y + 3}"
            text-anchor="end"
            fill="${secondary}"
            font-size="10"
          >${value.toFixed(1).replace(".", ",")}</text>
        `;
        })}

      <text
        class="timeline-axis-title"
        transform="translate(13 ${timeline.plot.top + timeline.plotHeight / 2}) rotate(-90)"
        text-anchor="middle"
        dominant-baseline="middle"
      >kr/kWh</text>

      <line
        x1="${timeline.width - timeline.plot.right}"
        x2="${timeline.width - timeline.plot.right}"
        y1="${timeline.plot.top}"
        y2="${timeline.plot.top + timeline.plotHeight}"
        stroke="${gridColor}"
        stroke-width="1"
        opacity="0.35"
      ></line>

      ${yTicks.map((ratio) => {
            const y = timeline.plot.top +
                timeline.plotHeight -
                ratio * timeline.plotHeight;
            const value = timeline.houseMax * ratio;
            return w `
          <text
            x="${timeline.width - timeline.plot.right + 6}"
            y="${y + 3}"
            text-anchor="start"
            fill="${secondary}"
            font-size="10"
          >${value.toFixed(1).replace(".", ",")}</text>
        `;
        })}

      ${timeTicks.map(({ timestamp }) => {
            const x = timeline.x(timestamp);
            return w `
          <line
            x1="${x}"
            x2="${x}"
            y1="${timeline.plot.top}"
            y2="${timeline.plot.top + timeline.plotHeight}"
            stroke="${gridColor}"
            stroke-width="1"
            opacity="0.22"
          ></line>
        `;
        })}
    `;
    }
    renderHouseBars(timeline) {
        if (!timeline || !this.data || !shouldIncludeConsumption(this.view))
            return w ``;
        return this.data.house_history.map((item) => {
            const start = new Date(item.start).getTime();
            const end = new Date(item.end).getTime();
            if (!Number.isFinite(start) ||
                !Number.isFinite(end) ||
                start < timeline.start ||
                !isConsumptionTimestampInTimeline(start, timeline.bounds, timeline.now) ||
                item.energy_kwh <= 0) {
                return w ``;
            }
            const clippedStart = Math.max(start, timeline.start);
            const clippedEnd = Math.min(end, timeline.end, timeline.now);
            const x = timeline.x(clippedStart);
            const width = Math.max(1, timeline.x(clippedEnd) - timeline.x(clippedStart));
            const y = timeline.yHouse(item.energy_kwh);
            const height = timeline.plot.top + timeline.plotHeight - y;
            return w `
        <rect
          x="${x}"
          y="${y}"
          width="${width}"
          height="${Math.max(1, height)}"
          rx="1"
          fill="var(--energy-accent-cool)"
          opacity="0.22"
        >
          <title>
            ${this.formatInterval(item.start, item.end)}
            · ${this.formatNumber(item.energy_kwh, 3)} kWh
          </title>
        </rect>
      `;
        });
    }
    renderHistoricalImportPrice(timeline) {
        if (!timeline || !this.data)
            return w ``;
        const points = [...this.data.price_history.import_intervals]
            .map((item) => ({
            start: new Date(item.start).getTime(),
            end: new Date(item.end).getTime(),
            import: item.import,
        }))
            .filter((item) => Number.isFinite(item.start) &&
            Number.isFinite(item.end) &&
            Number.isFinite(item.import) &&
            isHistoricalPriceInTimeline(item.start, timeline.bounds, timeline.now))
            .sort((a, b) => a.start - b.start);
        const segments = [];
        let current = [];
        for (const point of points) {
            const clipped = {
                ...point,
                start: Math.max(point.start, timeline.start),
                end: Math.min(point.end, timeline.now),
            };
            const previous = current[current.length - 1];
            if (previous &&
                clipped.start > previous.end + 60 * 1000) {
                segments.push(current);
                current = [];
            }
            if (clipped.end > clipped.start) {
                current.push(clipped);
            }
        }
        if (current.length)
            segments.push(current);
        return w `
      ${segments.map((segment) => {
            const path = segment
                .map((point, index) => {
                const x = timeline.x(point.start);
                const y = timeline.yImport(point.import);
                return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
            })
                .join(" ");
            return w `
          <path
            d="${path}"
            fill="none"
            stroke="var(--energy-accent-cool)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        `;
        })}
    `;
    }
    renderFutureImportPrice(timeline) {
        if (!timeline)
            return w ``;
        const future = timeline.forecast
            .map((item) => ({
            start: Math.max(new Date(item.start).getTime(), timeline.now),
            end: new Date(item.end).getTime(),
            import: item.import,
            price_class: item.price_class,
        }))
            .filter((item) => Number.isFinite(item.start) &&
            Number.isFinite(item.end) &&
            Number.isFinite(item.import) &&
            item.end > item.start);
        if (!future.length)
            return w ``;
        if (future.length === 1) {
            const point = future[0];
            const x1 = timeline.x(point.start);
            const x2 = timeline.x(Math.min(point.end, timeline.end));
            const y = timeline.yImport(point.import);
            return w `
        <path
          class="forecast-price-segment ${point.price_class.toLowerCase()}"
          d="M ${x1.toFixed(2)} ${y.toFixed(2)} L ${x2.toFixed(2)} ${y.toFixed(2)}"
          fill="none"
          stroke-width="2.5"
          stroke-dasharray="6 5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      `;
        }
        return w `
      ${future.slice(0, -1).map((point, index) => {
            const next = future[index + 1];
            const x1 = timeline.x(point.start);
            const y1 = timeline.yImport(point.import);
            const x2 = timeline.x(next.start);
            const y2 = timeline.yImport(next.import);
            const path = `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
            return w `
          <path
            class="forecast-price-segment ${point.price_class.toLowerCase()}"
            d="${path}"
            fill="none"
            stroke-width="2.5"
            stroke-dasharray="6 5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        `;
        })}

      <text
        class="timeline-axis-title"
        transform="translate(${timeline.width - 11} ${timeline.plot.top + timeline.plotHeight / 2}) rotate(90)"
        text-anchor="middle"
        dominant-baseline="middle"
      >kWh</text>
    `;
    }
    renderNowMarker(timeline, priceClass) {
        if (!timeline)
            return w ``;
        const x = timeline.x(timeline.now);
        return w `
      <line
        x1="${x}"
        x2="${x}"
        y1="${timeline.plot.top - 4}"
        y2="${timeline.plot.top + timeline.plotHeight}"
        class="timeline-now-line ${priceClass}"
        stroke-width="2"
        stroke-dasharray="3 4"
        opacity="0.85"
      ></line>
      <rect
        class="timeline-now-label ${priceClass}"
        x="${x - 18}"
        y="0"
        width="36"
        height="18"
        rx="9"
      ></rect>
      <text
        x="${x}"
        y="12"
        text-anchor="middle"
        fill="var(--primary-background-color)"
        font-size="9"
        font-weight="700"
      >NU</text>
    `;
    }
    renderTimelineLabels(timeline) {
        if (!timeline)
            return w ``;
        const ticks = this.getTimelineHourTicks(timeline);
        return w `
      ${ticks.map(({ timestamp, desktop, narrow, mobile }) => {
            const date = new Date(timestamp);
            const x = timeline.x(timestamp);
            const textAnchor = x < timeline.plot.left + 18
                ? "start"
                : x > timeline.width - timeline.plot.right - 18
                    ? "end"
                    : "middle";
            return w `
          <text
            class="timeline-time-label ${desktop ? "hour-label-desktop" : ""} ${narrow ? "hour-label-narrow" : ""} ${mobile ? "hour-label-mobile" : ""}"
            display="${desktop ? "inline" : "none"}"
            x="${x}"
            y="${timeline.height - 10}"
            text-anchor="${textAnchor}"
            fill="var(--secondary-text-color)"
            font-size="10"
          >${this.formatTimeLabel(date)}</text>
        `;
        })}
    `;
    }
    formatTimeLabel(date) {
        return formatTimeLabelWithFormatter(SWEDISH_TIME_FORMATTER, date);
    }
    // ---------------------------------------------------------------------------
    // UPCOMING PRICES
    // ---------------------------------------------------------------------------
    renderUpcomingPricesSection() {
        if (!this.data)
            return b ``;
        const currentEnd = new Date(this.data.price.current.end).getTime();
        if (!Number.isFinite(currentEnd))
            return b ``;
        const upcoming = this.data.price.forecast
            .filter((item) => {
            const start = new Date(item.start).getTime();
            const end = new Date(item.end).getTime();
            return (Number.isFinite(start) &&
                Number.isFinite(end) &&
                start >= currentEnd &&
                end > start);
        })
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        if (upcoming.length === 0)
            return b ``;
        let hourMarkerIndex = 0;
        return b `
      <section class="upcoming-section">
        <div class="section-title">KOMMANDE PRISER (15 MINUTER)</div>

        <div class="upcoming-scroll">
          <div class="upcoming-track">
            <div class="upcoming-time-axis" aria-hidden="true">
              ${upcoming.map((item) => {
            const start = new Date(item.start);
            const isHour = start.getMinutes() === 0 &&
                start.getSeconds() === 0 &&
                start.getMilliseconds() === 0;
            const markerIndex = isHour ? hourMarkerIndex++ : -1;
            return b `
                  <span class="upcoming-time-cell ${isHour ? "upcoming-hour-marker" : ""}">
                    ${isHour
                ? b `
                          <span class="upcoming-hour-label ${markerIndex % 2 === 0 ? "hour-label-narrow" : ""} ${markerIndex % 3 === 0 ? "hour-label-mobile" : ""}">
                            ${this.formatTimeLabel(start)}
                          </span>
                        `
                : ""}
                  </span>
                `;
        })}
            </div>

            <div class="upcoming-list" aria-label="Kommande importpriser">
              ${upcoming.map((item) => {
            const details = `${this.formatInterval(item.start, item.end)} · ${this.formatPrice(item.import)} kr/kWh import · ${this.getPriceClassShortLabel(item.price_class)}`;
            return b `
                  <div
                    class="upcoming-price ${item.price_class.toLowerCase()}"
                    role="img"
                    aria-label="${details}"
                    title="${details}"
                  ></div>
                `;
        })}
            </div>
          </div>
        </div>
      </section>
    `;
    }
    // ---------------------------------------------------------------------------
    // KPI SECTION
    // ---------------------------------------------------------------------------
    renderKpiSection() {
        if (!this.data)
            return b ``;
        const house = this.data.house;
        const cheapest = this.data.price_intelligence.cheapest_future_period;
        return b `
      <div class="overview-kpis" aria-label="Nyckeltal – senaste 24 timmarna">
        <div class="overview-kpi">
          <div class="kpi-label">Importkostnad</div>
          <div class="kpi-value">
            ${this.formatNumber(house.cost, 2)}
            <span>kr</span>
          </div>
          <div class="kpi-meta">Total importkostnad</div>
        </div>

        <div class="overview-kpi">
          <div class="kpi-label">Förbrukning</div>
          <div class="kpi-value">
            ${this.formatNumber(house.consumption_kwh, 2)}
            <span>kWh</span>
          </div>
          <div class="kpi-meta">Husets totala förbrukning</div>
        </div>

        <div class="overview-kpi">
          <div class="kpi-label">Under medianpris</div>
          <div class="kpi-value">
            ${this.formatNumber(house.cheap_usage_percent, 1)}
            <span>%</span>
          </div>
          <div class="kpi-meta">Av energiförbrukningen</div>
        </div>

        <div class="overview-kpi">
          <div class="kpi-label">Nästa billiga period</div>
          <div class="kpi-value kpi-time">
            ${cheapest
            ? this.formatInterval(cheapest.start, cheapest.end)
            : "—"}
          </div>
          <div class="kpi-meta">
            ${cheapest
            ? `${this.formatPrice(cheapest.average_import_price)} kr/kWh import`
            : "Ingen period tillgänglig"}
          </div>
        </div>
      </div>
    `;
    }
    setView(view) {
        this.view = view;
    }
    // ---------------------------------------------------------------------------
    // CONSUMERS
    // ---------------------------------------------------------------------------
    renderSmartScoreSection() {
        if (!this.data)
            return b ``;
        const house = this.data.house;
        const score = house.smart_score;
        return b `
      <section class="smart-score-section">
        <div class="smart-score-card">
          <div class="smart-score-main">
            <div class="section-title">SMART SCORE</div>
            <div class="smart-score-value">
              ${score !== null && Number.isFinite(score)
            ? this.formatNumber(score, 0)
            : "—"}
              <span>/ 100</span>
            </div>
          </div>
          <div class="smart-score-metrics">
            <div class="smart-score-metric">
              <div class="smart-score-label">Över medianpris</div>
              <div class="smart-score-metric-value">
                ${this.formatNumber(house.expensive_usage_percent, 1)}<span>%</span>
              </div>
            </div>
            <div class="smart-score-metric">
              <div class="smart-score-label">Batteribidrag</div>
              <div class="smart-score-metric-value">
                ${this.formatNumber(house.battery_contribution_percent ?? undefined, 1)}<span>%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    }
    getConsumerColor(index) {
        const palette = [
            "#00cfff",
            "#b46cff",
            "#ff4fb8",
            "#6f7cff",
            "#25d9c8",
            "#d276ff",
            "#45a5ff",
        ];
        return palette[index % palette.length];
    }
    renderConsumersSection() {
        if (!this.data)
            return b ``;
        const consumers = Object.values(this.data.consumers);
        return b `
      <section class="consumers-section">
        <div class="section-title">FÖRBRUKNING PER ENHET</div>

        <div class="consumer-list-header" aria-hidden="true">
          <div>Enhet</div>
          <div>Förbrukning</div>
          <div class="consumer-average-price-column">Snittpris</div>
          <div>Kostnad</div>
        </div>

        <div class="consumer-list">
          ${consumers.map((consumer, index) => this.renderConsumer(consumer, index))}
        </div>
      </section>
    `;
    }
    renderConsumer(consumer, index) {
        const analysis = consumer.analysis;
        const hasConsumption = analysis.energy_kwh > 0;
        const name = consumer.name || this.getConsumerFallbackName(consumer);
        return b `
      <div
        class="consumer"
        style="--consumer-accent: ${this.getConsumerColor(index)}"
      >
        <div class="consumer-name">${name}</div>

        <div class="consumer-metric-value">
          ${hasConsumption
            ? b `
                ${this.formatNumber(analysis.energy_kwh, 2)}
                <span>kWh</span>
              `
            : b `
                <span class="muted-value">Ingen förbrukning</span>
              `}
        </div>

        <div class="consumer-metric-value consumer-average-price-column">
          ${analysis.average_import_price !== null
            ? b `
                ${this.formatPrice(analysis.average_import_price)}
                <span>kr/kWh</span>
              `
            : b `<span class="muted-value">—</span>`}
          </div>

        <div class="consumer-metric-value consumer-cost">
          ${this.formatNumber(analysis.cost, 2)}
          <span>kr</span>
        </div>

        <div class="consumer-details">
          <span>
            ${this.formatNumber(analysis.share_percent, 1)}% av husförbrukningen
          </span>
          <span class="consumer-detail-separator">·</span>
          ${analysis.price_alignment_delta === null
            ? b `<span class="muted-value">Prisjämförelse saknas</span>`
            : analysis.price_alignment_delta > 0
                ? b `
                  <span class="consumer-price-cheaper">
                    ${this.formatNumber(analysis.price_alignment_delta, 2)} kr/kWh billigare än huset
                  </span>
              `
                : analysis.price_alignment_delta < 0
                    ? b `
                    <span class="consumer-price-costlier">
                      ${this.formatNumber(Math.abs(analysis.price_alignment_delta), 2)} kr/kWh dyrare än huset
                    </span>
                  `
                    : b `<span class="consumer-price-equal">Samma snittpris som huset</span>`}
          <span class="consumer-detail-separator consumer-mobile-average-separator">·</span>
          <span class="consumer-mobile-average-price">
            Snittpris
            ${analysis.average_import_price !== null
            ? b `${this.formatPrice(analysis.average_import_price)} kr/kWh`
            : b `—`}
          </span>
        </div>
      </div>
    `;
    }
    getConsumerFallbackName(consumer) {
        const entity = consumer.energy_entity;
        if (entity.includes("charger")) {
            return "Elbil / Laddare";
        }
        if (entity.includes("thermia")) {
            return "Värmepump";
        }
        return entity;
    }
    // ---------------------------------------------------------------------------
    // INSIGHTS
    // ---------------------------------------------------------------------------
    renderInsightsSection() {
        if (!this.data) {
            return b ``;
        }
        const insights = this.data.insights.filter((insight) => insight.type !== "consumer_cost" &&
            insight.type !== "consumer_share" &&
            insight.type !== "consumer_price_alignment");
        if (insights.length === 0)
            return b ``;
        return b `
      <section class="insights-section">
        <div class="section-title">INSIGHTS – SENASTE 24H</div>

        <div class="insights-list">
          ${insights.map((insight) => this.renderInsight(insight))}
        </div>
      </section>
    `;
    }
    renderInsight(insight) {
        switch (insight.type) {
            case "cheap_consumption":
                return b `
          <div class="insight insight-positive">
            <div class="insight-icon">↓</div>

            <div class="insight-content">
              <div class="insight-title">
                Förbrukning under billiga priser
              </div>

              <div class="insight-text">
                ${this.formatNumber(insight.cheap_usage_percent, 1)}% av energin användes under medianpriset.
              </div>
            </div>
          </div>
        `;
            case "expensive_consumption":
                return b `
          <div class="insight insight-warning">
            <div class="insight-icon">↑</div>

            <div class="insight-content">
              <div class="insight-title">
                Förbrukning under dyra priser
              </div>

              <div class="insight-text">
                ${this.formatNumber(insight.expensive_usage_percent, 1)}% av energin användes under dyrare priser.
              </div>
            </div>
          </div>
        `;
            case "highest_cost_period":
                return b `
          <div class="insight insight-danger">
            <div class="insight-icon">!</div>

            <div class="insight-content">
              <div class="insight-title">
                Dyraste förbrukningsperioden
              </div>

              <div class="insight-text">
                ${this.formatInterval(insight.start, insight.end)}
              </div>

              <div class="insight-meta">
                ${this.formatNumber(insight.energy_kwh, 3)} kWh ·
                ${this.formatNumber(insight.cost, 2)} kr · Importpris
                ${this.formatPrice(insight.import_price)}
                kr/kWh
              </div>
            </div>
          </div>
        `;
            case "lowest_cost_period":
                return b `
          <div class="insight insight-positive">
            <div class="insight-icon">↓</div>

            <div class="insight-content">
              <div class="insight-title">
                Billigaste förbrukningsperioden
              </div>

              <div class="insight-text">
                ${this.formatInterval(insight.start, insight.end)}
              </div>

              <div class="insight-meta">
                ${this.formatNumber(insight.energy_kwh, 3)} kWh ·
                ${this.formatNumber(insight.cost, 2)} kr · Importpris
                ${this.formatPrice(insight.import_price)}
                kr/kWh
              </div>
            </div>
          </div>
        `;
            case "consumer_cost":
                return b `
          <div class="insight insight-neutral">
            <div class="insight-icon">•</div>

            <div class="insight-content">
              <div class="insight-title">
                ${insight.name}
              </div>

              <div class="insight-text">
                ${this.formatNumber(insight.energy_kwh, 2)}
                kWh kostade
                ${this.formatNumber(insight.cost, 2)}
                kr.
              </div>

              <div class="insight-meta">
                ${insight.average_import_price !== null
                    ? b `
                      Genomsnittligt importpris
                      ${this.formatPrice(insight.average_import_price)}
                      kr/kWh
                    `
                    : b `
                      Ingen förbrukning registrerad.
                    `}
              </div>
            </div>
          </div>
        `;
            case "consumer_share":
                return b `
          <div class="insight insight-neutral">
            <div class="insight-icon">•</div>

            <div class="insight-content">
              <div class="insight-title">
                ${insight.name}
              </div>

              <div class="insight-text">
                ${this.formatNumber(insight.share_percent, 1)}%
                av hushållets förbrukning.
              </div>
            </div>
          </div>
        `;
            case "consumer_price_alignment":
                return b `
          <div class="insight insight-neutral">
            <div class="insight-icon">•</div>

            <div class="insight-content">
              <div class="insight-title">
                ${insight.name} – prisjämförelse
              </div>

              <div class="insight-text">
                ${insight.price_alignment_delta > 0
                    ? b `
                      ${this.formatNumber(insight.price_alignment_delta, 2)} kr/kWh billigare än huset.
                    `
                    : insight.price_alignment_delta < 0
                        ? b `
                        ${this.formatNumber(Math.abs(insight.price_alignment_delta), 2)} kr/kWh dyrare än huset.
                      `
                        : b `
                        Samma snittpris som huset.
                      `}
              </div>
            </div>
          </div>
        `;
        }
    }
    // ---------------------------------------------------------------------------
    // FORMATTERS
    // ---------------------------------------------------------------------------
    getPriceClassShortLabel(priceClass) {
        switch (priceClass) {
            case "VERY_CHEAP":
                return "Mycket billigt";
            case "CHEAP":
                return "Billigt";
            case "NORMAL":
                return "Normalt";
            case "EXPENSIVE":
                return "Dyrt";
            case "VERY_EXPENSIVE":
                return "Mycket dyrt";
            default:
                return priceClass;
        }
    }
    getPriceClassLabel(priceClass) {
        switch (priceClass) {
            case "VERY_CHEAP":
                return "Mycket billigt";
            case "CHEAP":
                return "Billigt";
            case "NORMAL":
                return "Normalt";
            case "EXPENSIVE":
                return "Dyrt";
            case "VERY_EXPENSIVE":
                return "Mycket dyrt";
            default:
                return priceClass;
        }
    }
    formatPrice(value) {
        if (value === undefined || !Number.isFinite(value)) {
            return "—";
        }
        return value.toFixed(2).replace(".", ",");
    }
    formatNumber(value, decimals = 1) {
        if (value === undefined || !Number.isFinite(value)) {
            return "—";
        }
        return value.toFixed(decimals).replace(".", ",");
    }
    formatInterval(start, end) {
        return formatIntervalWithFormatter(SWEDISH_TIME_FORMATTER, start, end);
    }
    // ---------------------------------------------------------------------------
    // STYLES
    // ---------------------------------------------------------------------------
    static { this.styles = i$3 `
    :host {
      display: block;
      --energy-background: #0b1420;
      --energy-surface: #111e2c;
      --energy-panel: rgba(20, 35, 51, 0.78);
      --energy-border: rgba(145, 176, 203, 0.18);
      --energy-text: #eaf2fa;
      --energy-muted: #9eb1c3;
      --energy-price-cheap: #50dc84;
      --energy-price-normal: #f0cd58;
      --energy-price-expensive: #ff9b4e;
      --energy-price-very-expensive: #ff6f78;
      --energy-accent-cool: #50d8f2;
    }

    ha-card {
      background:
        radial-gradient(circle at 100% 0%, rgba(67, 196, 229, 0.08), transparent 38%),
        linear-gradient(145deg, var(--energy-background), var(--energy-surface));
      border: 1px solid var(--energy-border);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
      color: var(--energy-text);
      overflow: hidden;
      --primary-text-color: var(--energy-text);
      --secondary-text-color: var(--energy-muted);
      --divider-color: var(--energy-border);
      --primary-background-color: var(--energy-background);
      --card-background-color: var(--energy-panel);
      --ha-card-background: var(--energy-background);
      --primary-color: var(--energy-accent-cool);
      --info-color: var(--energy-accent-cool);
      --success-color: var(--energy-price-cheap);
      --warning-color: var(--energy-price-expensive);
      --error-color: var(--energy-price-very-expensive);
    }

    .dashboard-layout {
      container-name: dashboard-card;
      container-type: inline-size;
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      min-width: 0;
      width: 100%;
    }

    .dashboard-overview,
    .dashboard-timeline-prices,
    .dashboard-smart-score,
    .dashboard-lower-grid {
      grid-column: 1 / -1;
      min-width: 0;
    }

    .dashboard-timeline,
    .dashboard-upcoming {
      min-width: 0;
    }

    .dashboard-timeline-prices {
      background: var(--energy-panel);
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      grid-column: 1 / -1;
      min-width: 0;
      overflow: hidden;
    }

    .dashboard-lower-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      min-width: 0;
    }

    .dashboard-consumers,
    .dashboard-insights {
      background: var(--energy-panel);
      border: 1px solid var(--energy-border);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .dashboard-consumers > .consumers-section,
    .dashboard-insights > .insights-section {
      box-sizing: border-box;
      flex: 1;
    }

    .dashboard-upcoming > .upcoming-section,
    .upcoming-list {
      box-sizing: border-box;
      max-width: 100%;
      min-width: 0;
      width: 100%;
    }

    .price-header {
      background: var(--energy-panel);
      border: 1px solid var(--energy-border);
      border-radius: 12px;
      padding: 14px;
    }

    .overview-layout {
      display: grid;
      grid-template-columns: minmax(240px, 0.42fr) minmax(0, 1fr);
      gap: 14px;
      min-width: 0;
    }

    .overview-support {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: space-evenly;
      min-width: 0;
      padding: 4px 8px;
    }

    .price-quality-summary {
      align-items: baseline;
      border-bottom: 1px solid var(--energy-border);
      display: flex;
      gap: 12px;
      justify-content: space-between;
      min-width: 0;
      padding: 2px 2px 10px;
    }

    .pqi-label {
      color: var(--energy-muted);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      min-width: 0;
      text-transform: uppercase;
    }

    .pqi-value {
      color: var(--energy-accent-cool);
      font-size: 25px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }

    .pqi-value span {
      font-size: 14px;
      font-weight: 600;
    }

    .current-price-card {
      --current-price-accent: var(--energy-price-normal);
      align-items: flex-start;
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--energy-panel) 92%, var(--current-price-accent)),
        var(--energy-surface) 78%
      );
      border: 1px solid color-mix(in srgb, var(--current-price-accent) 30%, var(--divider-color));
      border-radius: 12px;
      box-shadow: 0 0 18px color-mix(in srgb, var(--current-price-accent) 7%, transparent);
      display: flex;
      flex-direction: column;
      min-width: 0;
      padding: 14px;
    }

    .current-price-card.very_cheap,
    .current-price-card.cheap {
      --current-price-accent: var(--energy-price-cheap);
    }

    .current-price-card.expensive {
      --current-price-accent: var(--energy-price-expensive);
    }

    .current-price-card.very_expensive {
      --current-price-accent: var(--energy-price-very-expensive);
    }

    .price-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      min-width: 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--energy-border);
    }

    .price-stats .stat {
      background: transparent;
      border: 0;
      border-radius: 0;
      min-width: 0;
      padding: 4px 10px;
    }

    .price-stats .stat + .stat {
      border-left: 1px solid var(--energy-border);
    }

    .price-stats .stat:first-child {
      padding-left: 2px;
    }

    .price-stats .stat:last-child {
      padding-right: 2px;
    }

    .price-stats .stat-label {
      margin-bottom: 4px;
    }

    .eyebrow,
    .section-title {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .eyebrow {
      margin-bottom: 6px;
    }

    .current-price {
      font-size: 38px;
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.03em;
    }

    .current-price-row {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px 12px;
      min-width: 0;
      max-width: 100%;
    }

    .price-gauge {
      align-self: center;
      display: grid;
      height: 164px;
      max-width: 100%;
      place-items: center;
      position: relative;
      width: 164px;
    }

    .price-gauge-ring {
      background: conic-gradient(
        from 135deg,
        var(--energy-price-cheap) 0deg,
        var(--energy-price-normal) 90deg,
        var(--energy-price-expensive) 180deg,
        var(--energy-price-very-expensive) 270deg,
        transparent 270deg 360deg
      );
      border-radius: 50%;
      filter: drop-shadow(0 2px 7px color-mix(in srgb, var(--current-price-accent) 24%, transparent));
      inset: 0;
      mask: radial-gradient(farthest-side, transparent calc(100% - 11px), #000 calc(100% - 9px));
      position: absolute;
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 11px), #000 calc(100% - 9px));
    }

    .price-gauge-marker {
      inset: 0;
      pointer-events: none;
      position: absolute;
      transform: rotate(var(--pqi-angle));
    }

    .price-gauge-marker::after {
      background: var(--current-price-accent);
      border: 2px solid var(--ha-card-background, var(--primary-background-color));
      border-radius: 50%;
      box-shadow: 0 0 8px color-mix(in srgb, var(--current-price-accent) 50%, transparent);
      content: "";
      height: 10px;
      left: 50%;
      position: absolute;
      top: 5px;
      transform: translateX(-50%);
      width: 10px;
    }

    .price-gauge-center {
      align-items: center;
      display: flex;
      inset: 18px;
      justify-content: center;
      position: absolute;
      text-align: center;
    }

    .price-gauge-center .current-price-row {
      align-items: center;
      flex-direction: column;
      gap: 4px;
      justify-content: center;
    }

    .price-gauge-center .current-price {
      font-size: 27px;
    }

    .price-gauge-center .current-price .unit {
      font-size: 11px;
      margin-left: 1px;
    }

    .price-gauge-center .price-status {
      align-self: center;
      background: color-mix(in srgb, var(--current-price-accent) 8%, transparent);
      border-color: color-mix(in srgb, var(--current-price-accent) 38%, var(--divider-color));
      min-width: 120px;
      padding: 6px 8px;
      text-align: center;
    }

    .price-gauge-center .status-label {
      font-size: 12px;
    }

    .current-price .unit {
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      letter-spacing: normal;
      margin-left: 4px;
    }

    .current-time {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-top: 7px;
    }

    .current-price-card .current-time {
      align-self: center;
      text-align: center;
    }

    .price-status {
      min-width: 120px;
      max-width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid color-mix(in srgb, var(--current-price-accent) 38%, var(--divider-color));
      border-radius: 12px;
      text-align: right;
      align-self: flex-start;
      margin-top: 14px;
      background: color-mix(in srgb, var(--current-price-accent) 8%, transparent);
    }

    .current-price-row .price-status {
      flex: 0 1 auto;
      margin-top: 0;
    }

    .status-label {
      font-size: 14px;
      font-weight: 700;
    }

    .very_cheap .status-label,
    .cheap .status-label {
      color: var(--energy-price-cheap);
    }

    .normal .status-label {
      color: var(--energy-price-normal);
    }

    .expensive .status-label {
      color: var(--energy-price-expensive);
    }

    .very_expensive .status-label {
      color: var(--energy-price-very-expensive);
    }

    .stat {
      background: var(--energy-panel);
      box-sizing: border-box;
      min-width: 0;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .stat-label {
      color: var(--secondary-text-color);
      font-size: 11px;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 17px;
      font-weight: 600;
    }

    /* TIMELINE */

    .timeline-section {
      padding: 18px 20px 10px;
    }

    .timeline-heading {
      align-items: flex-end;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 12px;
    }

    .timeline-subtitle {
      color: var(--secondary-text-color);
      font-size: 11px;
      margin-top: -8px;
    }

    .timeline-legend {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: flex-end;
    }

    .timeline-view-selector {
      border: 1px solid var(--energy-border);
      border-radius: 8px;
      display: flex;
      flex: 0 0 auto;
      gap: 2px;
      padding: 2px;
    }

    .timeline-view-selector button {
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: var(--energy-muted);
      cursor: pointer;
      font: inherit;
      font-size: 10px;
      font-weight: 600;
      padding: 5px 6px;
      white-space: nowrap;
    }

    .timeline-view-selector button.selected {
      background: color-mix(in srgb, var(--energy-accent-cool) 18%, transparent);
      color: var(--energy-text);
    }

    .legend-item {
      align-items: center;
      color: var(--secondary-text-color);
      display: inline-flex;
      font-size: 10px;
      gap: 5px;
      white-space: nowrap;
    }

    .legend-line {
      display: inline-block;
      height: 0;
      width: 20px;
    }

    .legend-line.history {
      border-top: 2px solid var(--energy-accent-cool);
    }

    .legend-line.future {
      border-top: 2px dashed var(--energy-muted);
    }

    .forecast-price-segment {
      stroke: var(--energy-price-normal);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2.5px;
    }

    .forecast-price-segment.very_cheap,
    .forecast-price-segment.cheap {
      stroke: var(--energy-price-cheap);
    }

    .forecast-price-segment.normal {
      stroke: var(--energy-price-normal);
    }

    .forecast-price-segment.expensive {
      stroke: var(--energy-price-expensive);
    }

    .forecast-price-segment.very_expensive {
      stroke: var(--energy-price-very-expensive);
    }

    .legend-bar {
      background: var(--energy-accent-cool);
      border-radius: 1px;
      display: inline-block;
      height: 8px;
      opacity: 0.3;
      width: 14px;
    }

    .legend-consumer {
      background: var(--consumer-accent);
      border-radius: 50%;
      display: inline-block;
      flex: 0 0 8px;
      height: 8px;
      width: 8px;
    }

    .consumer-series {
      fill: var(--consumer-accent);
    }

    .consumer-series-edge {
      stroke: var(--consumer-accent);
      stroke-opacity: 0.96;
      stroke-width: 1.25;
    }

    .timeline-time-label.hour-label-desktop {
      display: inline;
    }

    .timeline-chart {
      background: linear-gradient(
        to top,
        color-mix(in srgb, var(--energy-price-cheap) 6%, transparent),
        color-mix(in srgb, var(--energy-price-normal) 4%, transparent) 52%,
        color-mix(in srgb, var(--energy-price-expensive) 6%, transparent)
      );
      overflow: hidden;
      padding: 0;
    }

    .timeline-axis-title {
      fill: var(--secondary-text-color);
      font-size: 10px;
    }

    .timeline-now-line,
    .timeline-now-label {
      --timeline-now-accent: var(--energy-price-normal);
    }

    .timeline-now-line.very_cheap,
    .timeline-now-line.cheap,
    .timeline-now-label.very_cheap,
    .timeline-now-label.cheap {
      --timeline-now-accent: var(--energy-price-cheap);
    }

    .timeline-now-line.expensive,
    .timeline-now-label.expensive {
      --timeline-now-accent: var(--energy-price-expensive);
    }

    .timeline-now-line.very_expensive,
    .timeline-now-label.very_expensive {
      --timeline-now-accent: var(--energy-price-very-expensive);
    }

    .timeline-now-line {
      filter: drop-shadow(0 0 3px color-mix(in srgb, var(--timeline-now-accent) 48%, transparent));
      stroke: var(--timeline-now-accent);
    }

    .timeline-now-label {
      fill: var(--timeline-now-accent);
      filter: drop-shadow(0 0 4px color-mix(in srgb, var(--timeline-now-accent) 42%, transparent));
    }

    .timeline-chart svg {
      display: block;
      height: clamp(150px, 20cqw, 220px);
      min-height: 0;
      width: 100%;
    }

    .timeline-empty {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      color: var(--secondary-text-color);
      font-size: 12px;
      padding: 24px;
      text-align: center;
    }

    /* UPCOMING PRICES */

    .upcoming-section {
      border-top: 1px solid var(--divider-color);
      padding: 12px 20px 16px;
    }

    .upcoming-list {
      display: grid;
      grid-auto-columns: 10px;
      grid-auto-flow: column;
      grid-template-columns: none;
      gap: 2px;
      padding: 2px 1px 8px;
      width: max-content;
    }

    .upcoming-scroll {
      max-width: 100%;
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;
    }

    .upcoming-track {
      min-width: 100%;
      width: max-content;
    }

    .upcoming-time-axis {
      box-sizing: border-box;
      display: grid;
      grid-auto-columns: 10px;
      grid-auto-flow: column;
      grid-template-columns: none;
      gap: 2px;
      height: 18px;
      padding-left: 1px;
      width: max-content;
    }

    .upcoming-time-cell {
      box-sizing: border-box;
      min-width: 0;
      position: relative;
      width: 10px;
    }

    .upcoming-hour-marker {
      border-left: 1px solid var(--energy-border);
    }

    .upcoming-hour-label {
      bottom: 2px;
      color: var(--energy-muted);
      font-size: 9px;
      left: 3px;
      position: absolute;
      white-space: nowrap;
    }

    .upcoming-price {
      box-sizing: border-box;
      border: 1px solid color-mix(in srgb, var(--energy-border) 70%, transparent);
      border-radius: 2px;
      height: 26px;
      min-width: 10px;
      width: 10px;
    }

    .upcoming-price.very_cheap {
      background: color-mix(in srgb, var(--energy-price-cheap) 76%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-cheap) 82%, var(--energy-border));
    }

    .upcoming-price.cheap {
      background: color-mix(in srgb, var(--energy-price-cheap) 62%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-cheap) 70%, var(--energy-border));
    }

    .upcoming-price.normal {
      background: color-mix(in srgb, var(--energy-price-normal) 58%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-normal) 68%, var(--energy-border));
    }

    .upcoming-price.expensive {
      background: color-mix(in srgb, var(--energy-price-expensive) 66%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-expensive) 74%, var(--energy-border));
    }

    .upcoming-price.very_expensive {
      background: color-mix(in srgb, var(--energy-price-very-expensive) 74%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-very-expensive) 82%, var(--energy-border));
    }

    /* OVERVIEW KPIS */

    .section-title {
      margin-bottom: 14px;
    }

    .overview-kpis {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      min-width: 0;
    }

    .overview-kpi {
      min-width: 0;
      padding: 6px 10px 8px;
    }

    .overview-kpi:nth-child(even) {
      border-left: 1px solid var(--energy-border);
    }

    .overview-kpi:nth-child(n + 3) {
      border-top: 1px solid var(--energy-border);
      padding-top: 9px;
    }

    .overview-kpi:nth-child(odd) {
      padding-left: 2px;
    }

    .overview-kpi:nth-child(even) {
      padding-right: 2px;
    }

    .kpi-label {
      color: var(--energy-muted);
      font-size: 11px;
      line-height: 1.3;
      margin-bottom: 4px;
    }

    .kpi-value {
      font-size: 20px;
      font-weight: 650;
      line-height: 1.15;
      min-width: 0;
      overflow-wrap: anywhere;
      white-space: normal;
    }

    .kpi-value span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    .kpi-time {
      font-size: 17px;
    }

    .kpi-meta {
      color: var(--secondary-text-color);
      font-size: 9px;
      line-height: 1.35;
      margin-top: 3px;
    }

    /* SMART SCORE */

    .smart-score-section {
      border-top: 1px solid var(--divider-color);
      padding: 10px 22px;
    }

    .smart-score-card {
      background: var(--energy-panel);
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
      align-items: center;
      gap: 16px;
      padding: 10px 14px;
      border: 1px solid color-mix(in srgb, var(--energy-accent-cool) 28%, var(--divider-color));
      border-radius: 12px;
      box-shadow: 0 0 16px color-mix(in srgb, var(--energy-accent-cool) 7%, transparent);
    }

    .smart-score-main {
      align-items: baseline;
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
      min-width: 0;
    }

    .smart-score-value {
      color: var(--energy-accent-cool);
      font-size: 32px;
      font-weight: 700;
      line-height: 1.1;
    }

    .smart-score-value span,
    .smart-score-metric-value span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    .smart-score-label {
      color: var(--secondary-text-color);
      font-size: 11px;
      margin-bottom: 6px;
    }

    .smart-score-metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      align-items: center;
      min-width: 0;
    }

    .smart-score-metric-value {
      font-size: 17px;
      font-weight: 650;
      white-space: nowrap;
    }

    /* CONSUMERS */

    .consumers-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
    }

    .consumer-list {
      display: grid;
      min-width: 0;
      max-height: 240px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .consumer-list-header,
    .consumer {
      align-items: center;
      column-gap: 10px;
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 0.9fr);
      min-width: 0;
    }

    .consumer-list-header {
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 600;
      padding: 0 0 8px;
    }

    .consumer {
      border-top: 1px solid color-mix(in srgb, var(--energy-accent-cool) 14%, var(--divider-color));
      padding: 10px 0;
    }

    .consumer:hover {
      background: color-mix(in srgb, var(--energy-accent-cool) 4%, transparent);
    }

    .consumer-details {
      align-items: baseline;
      color: var(--secondary-text-color);
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      gap: 2px 5px;
      grid-column: 1 / -1;
      min-width: 0;
      overflow-wrap: anywhere;
      padding-top: 2px;
    }

    .consumer-detail-separator {
      color: var(--secondary-text-color);
    }

    .consumer-price-cheaper {
      color: var(--energy-price-cheap);
    }

    .consumer-price-costlier {
      color: var(--energy-price-very-expensive);
    }

    .consumer-price-equal {
      color: var(--energy-muted);
    }

    .consumer-mobile-average-price,
    .consumer-mobile-average-separator {
      display: none;
    }

    .consumer-name {
      align-items: flex-start;
      display: flex;
      font-size: 13px;
      font-weight: 600;
      gap: 7px;
      min-width: 0;
    }

    .consumer-name::before {
      background: var(--consumer-accent);
      border-radius: 50%;
      content: "";
      flex: 0 0 8px;
      height: 8px;
      margin-top: 4px;
      width: 8px;
    }

    .consumer-metric-value {
      font-size: 13px;
      font-weight: 550;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .consumer-metric-value span {
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 500;
    }

    .muted-value {
      color: var(--secondary-text-color) !important;
      font-size: 12px !important;
      font-weight: 500 !important;
    }

    /* INSIGHTS */

    .insights-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
    }

    .insights-list {
      display: grid;
      min-width: 0;
    }

    .insight {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      border-top: 1px solid var(--divider-color);
      min-width: 0;
      padding: 12px 0;
    }

    .insight:hover {
      background: color-mix(in srgb, var(--energy-accent-cool) 4%, transparent);
    }

    .insight:first-child {
      border-top: 0;
      padding-top: 0;
    }

    .insight-icon {
      align-items: center;
      border-radius: 50%;
      display: flex;
      flex: 0 0 30px;
      font-size: 15px;
      font-weight: 700;
      height: 30px;
      justify-content: center;
      width: 30px;
    }

    .insight-positive .insight-icon {
      background: var(--energy-price-cheap);
      color: var(--primary-background-color);
    }

    .insight-warning .insight-icon {
      background: var(--energy-price-expensive);
      color: var(--primary-background-color);
    }

    .insight-danger .insight-icon {
      background: var(--energy-price-very-expensive);
      color: var(--primary-background-color);
    }

    .insight-neutral .insight-icon {
      background: var(--secondary-text-color);
      color: var(--primary-background-color);
    }

    .insight-content {
      min-width: 0;
    }

    .insight-title {
      font-size: 14px;
      font-weight: 650;
      overflow-wrap: anywhere;
    }

    .insight-text {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.45;
      margin-top: 3px;
      overflow-wrap: anywhere;
    }

    .insight-meta {
      color: var(--secondary-text-color);
      font-size: 10px;
      margin-top: 4px;
      overflow-wrap: anywhere;
    }

    .loading {
      color: var(--secondary-text-color);
      padding: 20px;
    }

    .content {
      padding: 20px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
    }

    .error {
      color: var(--error-color);
      margin-top: 10px;
      white-space: pre-wrap;
    }

    @container dashboard-card (max-width: 980px) {
      .timeline-section {
        padding: 16px 16px 8px;
      }

      .upcoming-section {
        padding: 10px 16px 14px;
      }
    }

    @container dashboard-card (max-width: 780px) {
      .overview-layout {
        grid-template-columns: minmax(0, 1fr);
      }

      .overview-support {
        padding: 4px 2px;
      }
    }

    @container dashboard-card (max-width: 480px) {
      .price-stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 4px;
      }

      .price-stats .stat {
        padding-left: 6px;
        padding-right: 6px;
      }

      .price-stats .stat:first-child {
        padding-left: 0;
      }

      .price-stats .stat:last-child {
        padding-right: 0;
      }

      .price-stats .stat-value {
        font-size: 14px;
      }

      .kpi-value {
        font-size: 18px;
      }
    }

    @container dashboard-card (max-width: 860px) {
      .dashboard-lower-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .dashboard-consumers,
      .dashboard-insights {
        display: block;
      }

      .consumer-list {
        max-height: none;
        overflow-y: visible;
      }
    }

    @container dashboard-card (max-width: 700px) {
      .timeline-heading {
        align-items: flex-start;
        flex-direction: column;
        gap: 8px;
      }

      .timeline-legend {
        justify-content: flex-start;
      }

      .timeline-chart svg text {
        font-size: 15px;
      }

      .timeline-time-label.hour-label-desktop {
        display: none;
      }

      .timeline-time-label.hour-label-narrow {
        display: inline;
      }

      .upcoming-hour-label:not(.hour-label-narrow) {
        display: none;
      }

      .timeline-legend {
        gap: 8px;
      }
    }

    @container dashboard-card (max-width: 700px) {
      .smart-score-card {
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
      }
    }

    @container dashboard-card (max-width: 360px) {
      .overview-kpis {
        grid-template-columns: minmax(0, 1fr);
      }

      .overview-kpi,
      .overview-kpi:nth-child(even),
      .overview-kpi:nth-child(n + 3) {
        border-left: 0;
        border-top: 1px solid var(--energy-border);
        padding: 8px 0;
      }

      .overview-kpi:first-child {
        border-top: 0;
      }
    }

    @container dashboard-card (max-width: 520px) {
      .consumer-list-header,
      .consumer {
        grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 0.9fr);
      }

      .consumer-average-price-column {
        display: none;
      }

      .consumer-mobile-average-price,
      .consumer-mobile-average-separator {
        display: inline;
      }
    }

    @container dashboard-card (max-width: 420px) {
      .timeline-time-label.hour-label-narrow {
        display: none;
      }

      .timeline-time-label.hour-label-mobile {
        display: inline;
      }

      .upcoming-hour-label:not(.hour-label-mobile) {
        display: none;
      }

      .price-gauge {
        height: 148px;
        width: 148px;
      }

      .price-gauge-center {
        inset: 13px;
      }

      .price-gauge-center .current-price {
        font-size: 24px;
      }

      .price-gauge-center .price-status {
        min-width: 108px;
      }

      .smart-score-metrics {
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
      }
    }

    @media (max-width: 500px) {
      .price-header {
        padding: 18px;
      }

      .current-price {
        font-size: 32px;
      }

      .price-status {
        min-width: 100px;
        padding: 8px 10px;
      }

      .price-stats {
        gap: 8px;
      }

      .stat-value {
        font-size: 15px;
      }

      .smart-score-section,
      .consumers-section,
      .insights-section {
        padding: 18px;
      }

      .consumer {
        padding: 12px;
      }

    }
  `; }
};
__decorate([
    n({ attribute: false })
], EnergyDashboardCard.prototype, "hass", void 0);
__decorate([
    r()
], EnergyDashboardCard.prototype, "data", void 0);
__decorate([
    r()
], EnergyDashboardCard.prototype, "error", void 0);
__decorate([
    r()
], EnergyDashboardCard.prototype, "loading", void 0);
__decorate([
    r()
], EnergyDashboardCard.prototype, "view", void 0);
EnergyDashboardCard = __decorate([
    t("energy-dashboard-card")
], EnergyDashboardCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "energy-dashboard-card",
    name: "Energy Dashboard",
    description: "Energy Dashboard backed by Solar Battery Economy",
});

export { EnergyDashboardCard };
//# sourceMappingURL=energy-dashboard-card.js.map
