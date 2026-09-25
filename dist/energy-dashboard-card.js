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

let EnergyDashboardCard = class EnergyDashboardCard extends i {
    constructor() {
        super(...arguments);
        this.loading = false;
    }
    setConfig(config) {
        if (!config || config.type !== "custom:energy-dashboard-card") {
            throw new Error("Invalid configuration for energy-dashboard-card");
        }
        if (!config.config_entry_id) {
            throw new Error("config_entry_id is required");
        }
        this.config = config;
    }
    updated(changed) {
        if (changed.has("hass") && this.hass && !this.data && !this.loading) {
            void this.loadDashboardData();
        }
    }
    async loadDashboardData() {
        if (!this.hass)
            return;
        this.loading = true;
        this.error = undefined;
        try {
            this.data = await this.hass.callWS({
                type: "solar_battery_economy/get_dashboard_data",
                config_entry_id: this.config.config_entry_id,
            });
        }
        catch (error) {
            this.error =
                error instanceof Error
                    ? error.message
                    : JSON.stringify(error, null, 2);
        }
        finally {
            this.loading = false;
        }
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
        ${this.renderPriceHeader()}
        ${this.renderTimelineSection()}
        ${this.renderUpcomingPricesSection()}
        ${this.renderKpiSection()}
        ${this.renderConsumersSection()}
        ${this.renderInsightsSection()}
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
        const cheapest = intelligence.cheapest_future_period;
        const priceClass = this.getPriceClassLabel(current.price_class);
        const priceClassKey = current.price_class.toLowerCase();
        return b `
      <section class="price-header">
        <div class="header-top">
          <div>
            <div class="eyebrow">IMPORTPRIS JUST NU</div>

            <div class="current-price">
              ${this.formatPrice(current.import)}
              <span class="unit">kr/kWh</span>
            </div>

            <div class="current-time">
              ${this.formatInterval(current.start, current.end)}
            </div>
          </div>

          <div class="price-status ${priceClassKey}">
            <div class="status-label">${priceClass}</div>

            <div class="status-pqi">
              PQI ${this.formatNumber(intelligence.price_quality_index, 0)}
            </div>
          </div>
        </div>

        <div class="price-divider"></div>

        <div class="price-stats">
          <div class="stat">
            <div class="stat-label">Lägsta importpris idag</div>
            <div class="stat-value">
              ${this.formatPrice(statistics.lowest_import_price)}
            </div>
          </div>

          <div class="stat">
            <div class="stat-label">Snitt importpris idag</div>
            <div class="stat-value">
              ${this.formatPrice(statistics.average_import_price)}
            </div>
          </div>

          <div class="stat">
            <div class="stat-label">Högsta importpris idag</div>
            <div class="stat-value">
              ${this.formatPrice(statistics.highest_import_price)}
            </div>
          </div>
        </div>

        ${cheapest
            ? b `
              <div class="cheapest-period">
                <div class="cheapest-icon">↓</div>

                <div class="cheapest-content">
                  <div class="cheapest-label">
                    NÄSTA BILLIGA PERIOD
                  </div>

                  <div class="cheapest-time">
                    ${this.formatInterval(cheapest.start, cheapest.end)}
                  </div>

                  <div class="cheapest-price">
                    ${this.formatPrice(cheapest.average_import_price)}
                    kr/kWh import
                  </div>
                </div>
              </div>
            `
            : ""}
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
        return b `
      <section class="timeline-section">
        <div class="timeline-heading">
          <div>
            <div class="section-title">
              IMPORTPRIS & HUSFÖRBRUKNING
            </div>
            <div class="timeline-subtitle">
              Senaste 24h och kommande importpriser
            </div>
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
              ${this.renderHistoricalImportPrice(timeline)}
              ${this.renderFutureImportPrice(timeline)}
              ${this.renderNowMarker(timeline)}
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
        const historyStart = new Date(this.data.window.start).getTime();
        const historyEnd = new Date(this.data.window.end).getTime();
        const now = Date.now();
        if (!Number.isFinite(historyStart) || !Number.isFinite(historyEnd)) {
            return undefined;
        }
        const forecast = this.data.price.forecast
            .filter((item) => {
            const start = new Date(item.start).getTime();
            const end = new Date(item.end).getTime();
            return Number.isFinite(start) && Number.isFinite(end) && end > now;
        })
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        const futureEnd = forecast.length
            ? Math.max(...forecast.map((item) => new Date(item.end).getTime()))
            : historyEnd;
        const start = Math.min(historyStart, now - 24 * 60 * 60 * 1000);
        const end = Math.max(futureEnd, now);
        if (!(end > start))
            return undefined;
        const width = 1000;
        const height = 300;
        const plot = {
            left: 52,
            right: 16,
            top: 18,
            bottom: 34,
        };
        const plotWidth = width - plot.left - plot.right;
        const plotHeight = height - plot.top - plot.bottom;
        const x = (timestamp) => plot.left +
            ((timestamp - start) / (end - start)) * plotWidth;
        const importValues = [
            ...this.data.price_history.import_intervals.map((item) => item.import),
            ...forecast.map((item) => item.import),
        ].filter((value) => Number.isFinite(value) && value >= 0);
        const maxImport = Math.max(this.data.price.current.import, ...importValues, 0.01);
        const importMax = this.roundChartMax(maxImport);
        const houseValues = this.data.house_history
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
            now: Math.min(Math.max(now, start), end),
            x,
            yImport,
            yHouse,
            importMax,
            houseMax,
            historyEnd,
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
    renderTimelineGrid(timeline) {
        if (!timeline)
            return w ``;
        const yTicks = [0, 0.25, 0.5, 0.75, 1];
        const timeTicks = 6;
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

      ${Array.from({ length: timeTicks + 1 }, (_, index) => {
            const timestamp = timeline.start +
                ((timeline.end - timeline.start) / timeTicks) * index;
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
        if (!timeline || !this.data)
            return w ``;
        return this.data.house_history.map((item) => {
            const start = new Date(item.start).getTime();
            const end = new Date(item.end).getTime();
            if (!Number.isFinite(start) ||
                !Number.isFinite(end) ||
                end <= timeline.start ||
                start >= timeline.end ||
                item.energy_kwh <= 0) {
                return w ``;
            }
            const clippedStart = Math.max(start, timeline.start);
            const clippedEnd = Math.min(end, timeline.end);
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
          fill="var(--primary-color)"
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
            item.end > timeline.start &&
            item.start < timeline.now)
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
            stroke="var(--primary-color)"
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
        }))
            .filter((item) => Number.isFinite(item.start) &&
            Number.isFinite(item.end) &&
            Number.isFinite(item.import) &&
            item.end > item.start);
        if (!future.length)
            return w ``;
        const path = future
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
        stroke="var(--warning-color)"
        stroke-width="2.5"
        stroke-dasharray="6 5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    `;
    }
    renderNowMarker(timeline) {
        if (!timeline)
            return w ``;
        const x = timeline.x(timeline.now);
        return w `
      <line
        x1="${x}"
        x2="${x}"
        y1="${timeline.plot.top - 4}"
        y2="${timeline.plot.top + timeline.plotHeight}"
        stroke="var(--primary-text-color)"
        stroke-width="1.5"
        stroke-dasharray="3 4"
        opacity="0.85"
      ></line>
      <rect
        x="${x - 18}"
        y="0"
        width="36"
        height="18"
        rx="9"
        fill="var(--primary-text-color)"
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
        const labels = 6;
        return w `
      ${Array.from({ length: labels + 1 }, (_, index) => {
            const timestamp = timeline.start +
                ((timeline.end - timeline.start) / labels) * index;
            const date = new Date(timestamp);
            const x = timeline.x(timestamp);
            return w `
          <text
            x="${x}"
            y="${timeline.height - 10}"
            text-anchor="${index === 0 ? "start" : index === labels ? "end" : "middle"}"
            fill="var(--secondary-text-color)"
            font-size="10"
          >${this.formatTimeLabel(date)}</text>
        `;
        })}
    `;
    }
    formatTimeLabel(date) {
        return new Intl.DateTimeFormat("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
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
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .slice(0, 8);
        if (upcoming.length === 0)
            return b ``;
        return b `
      <section class="upcoming-section">
        <div class="section-title">KOMMANDE PRISER (15 MINUTER)</div>

        <div class="upcoming-list" aria-label="Kommande importpriser">
          ${upcoming.map((item) => b `
              <div class="upcoming-price ${item.price_class.toLowerCase()}">
                <div class="upcoming-time">
                  ${this.formatInterval(item.start, item.end)}
                </div>
                <div class="upcoming-value">
                  ${this.formatPrice(item.import)}
                  <span>kr/kWh</span>
                </div>
                <div class="upcoming-class">
                  ${this.getPriceClassShortLabel(item.price_class)}
                </div>
              </div>
            `)}
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
      <section class="kpi-section">
        <div class="section-title">SENASTE 24 TIMMARNA</div>

        <div class="kpi-grid">
          <div class="kpi">
            <div class="kpi-label">Importkostnad</div>

            <div class="kpi-value">
              ${this.formatNumber(house.cost, 2)}
              <span>kr</span>
            </div>

            <div class="kpi-meta">
              Total importkostnad
            </div>
          </div>

          <div class="kpi">
            <div class="kpi-label">Förbrukning</div>

            <div class="kpi-value">
              ${this.formatNumber(house.consumption_kwh, 2)}
              <span>kWh</span>
            </div>

            <div class="kpi-meta">
              Husets totala förbrukning
            </div>
          </div>

          <div class="kpi">
            <div class="kpi-label">Under medianpris</div>

            <div class="kpi-value">
              ${this.formatNumber(house.cheap_usage_percent, 1)}
              <span>%</span>
            </div>

            <div class="kpi-meta">
              Av energiförbrukningen
            </div>
          </div>

          <div class="kpi">
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
      </section>
    `;
    }
    // ---------------------------------------------------------------------------
    // CONSUMERS
    // ---------------------------------------------------------------------------
    renderConsumersSection() {
        if (!this.data)
            return b ``;
        const consumers = Object.values(this.data.consumers);
        return b `
      <section class="consumers-section">
        <div class="section-title">FÖRBRUKNING PER ENHET</div>

        <div class="consumer-list">
          ${consumers.map((consumer) => this.renderConsumer(consumer))}
        </div>
      </section>
    `;
    }
    renderConsumer(consumer) {
        const analysis = consumer.analysis;
        const hasConsumption = analysis.energy_kwh > 0;
        const name = consumer.name || this.getConsumerFallbackName(consumer);
        const share = hasConsumption
            ? this.calculateConsumerShare(analysis.energy_kwh)
            : 0;
        return b `
      <div class="consumer">
        <div class="consumer-main">
          <div class="consumer-name">
            ${name}
          </div>

          <div class="consumer-entity">
            ${consumer.energy_entity}
          </div>
        </div>

        <div class="consumer-metrics">
          <div class="consumer-metric">
            <div class="consumer-metric-label">Energi</div>

            <div class="consumer-metric-value">
              ${hasConsumption
            ? b `
                    ${this.formatNumber(analysis.energy_kwh, 2)}
                    <span>kWh</span>
                  `
            : b `
                    <span class="muted-value">
                      Ingen förbrukning
                    </span>
                  `}
            </div>
          </div>

          <div class="consumer-metric">
            <div class="consumer-metric-label">Andel</div>

            <div class="consumer-metric-value">
              ${this.formatNumber(share, 1)}
              <span>%</span>
            </div>
          </div>

          <div class="consumer-metric">
            <div class="consumer-metric-label">Kostnad</div>

            <div class="consumer-metric-value">
              ${hasConsumption
            ? b `
                    ${this.formatNumber(analysis.cost, 2)}
                    <span>kr</span>
                  `
            : b `
                    <span class="muted-value">—</span>
                  `}
            </div>
          </div>

          <div class="consumer-metric">
            <div class="consumer-metric-label">
              Snittpris
            </div>

            <div class="consumer-metric-value">
              ${analysis.average_import_price !== null
            ? b `
                    ${this.formatPrice(analysis.average_import_price)}
                    <span>kr/kWh</span>
                  `
            : b `
                    <span class="muted-value">—</span>
                  `}
            </div>
          </div>
        </div>
      </div>
    `;
    }
    calculateConsumerShare(energyKwh) {
        if (!this.data || this.data.house.consumption_kwh <= 0) {
            return 0;
        }
        return ((energyKwh / this.data.house.consumption_kwh) *
            100);
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
        if (!this.data || this.data.insights.length === 0) {
            return b ``;
        }
        return b `
      <section class="insights-section">
        <div class="section-title">INSIKTER</div>

        <div class="insights-list">
          ${this.data.insights.map((insight) => this.renderInsight(insight))}
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
          <div class="insight insight-warning">
            <div class="insight-icon">!</div>

            <div class="insight-content">
              <div class="insight-title">
                Dyraste förbrukningsperioden
              </div>

              <div class="insight-text">
                ${this.formatInterval(insight.start, insight.end)}
                · ${this.formatNumber(insight.energy_kwh, 3)}
                kWh · ${this.formatNumber(insight.cost, 2)}
                kr
              </div>

              <div class="insight-meta">
                Importpris
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
                · ${this.formatNumber(insight.energy_kwh, 3)}
                kWh · ${this.formatNumber(insight.cost, 2)}
                kr
              </div>

              <div class="insight-meta">
                Importpris
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
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (Number.isNaN(startDate.getTime()) ||
            Number.isNaN(endDate.getTime())) {
            return "—";
        }
        const formatter = new Intl.DateTimeFormat("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `${formatter.format(startDate)}–${formatter.format(endDate)}`;
    }
    // ---------------------------------------------------------------------------
    // STYLES
    // ---------------------------------------------------------------------------
    static { this.styles = i$3 `
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    .price-header {
      padding: 22px;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
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

    .price-status {
      min-width: 120px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      text-align: right;
    }

    .status-label {
      font-size: 14px;
      font-weight: 700;
    }

    .status-pqi {
      color: var(--secondary-text-color);
      font-size: 11px;
      margin-top: 4px;
    }

    .very_cheap .status-label,
    .cheap .status-label {
      color: var(--success-color);
    }

    .normal .status-label {
      color: var(--primary-text-color);
    }

    .expensive .status-label {
      color: var(--warning-color);
    }

    .very_expensive .status-label {
      color: var(--error-color);
    }

    .price-divider {
      border-top: 1px solid var(--divider-color);
      margin: 20px 0;
    }

    .price-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .stat {
      min-width: 0;
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

    .cheapest-period {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 20px;
      padding: 13px 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .cheapest-icon {
      align-items: center;
      background: var(--success-color);
      border-radius: 50%;
      color: var(--primary-background-color);
      display: flex;
      flex: 0 0 30px;
      font-size: 18px;
      font-weight: 700;
      height: 30px;
      justify-content: center;
      width: 30px;
    }

    .cheapest-label {
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .cheapest-time {
      font-size: 15px;
      font-weight: 600;
      margin-top: 2px;
    }

    .cheapest-price {
      color: var(--secondary-text-color);
      font-size: 11px;
      margin-top: 2px;
    }

    /* TIMELINE */

    .timeline-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
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
      border-top: 2px solid var(--primary-color);
    }

    .legend-line.future {
      border-top: 2px dashed var(--warning-color);
    }

    .legend-bar {
      background: var(--primary-color);
      border-radius: 1px;
      display: inline-block;
      height: 8px;
      opacity: 0.3;
      width: 14px;
    }

    .timeline-chart {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
      padding: 8px 8px 2px;
    }

    .timeline-chart svg {
      display: block;
      height: auto;
      min-height: 230px;
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
      padding: 20px 22px 22px;
    }

    .upcoming-list {
      display: grid;
      grid-template-columns: repeat(8, minmax(110px, 1fr));
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: thin;
    }

    .upcoming-price {
      min-width: 110px;
      padding: 11px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
    }

    .upcoming-time {
      color: var(--secondary-text-color);
      font-size: 10px;
      white-space: nowrap;
    }

    .upcoming-value {
      font-size: 17px;
      font-weight: 650;
      margin-top: 5px;
      white-space: nowrap;
    }

    .upcoming-value span {
      color: var(--secondary-text-color);
      font-size: 9px;
      font-weight: 500;
    }

    .upcoming-class {
      color: var(--secondary-text-color);
      font-size: 9px;
      margin-top: 3px;
    }

    .upcoming-price.very_cheap,
    .upcoming-price.cheap {
      border-color: color-mix(in srgb, var(--success-color) 45%, var(--divider-color));
    }

    .upcoming-price.expensive,
    .upcoming-price.very_expensive {
      border-color: color-mix(in srgb, var(--warning-color) 45%, var(--divider-color));
    }

    /* KPI */

    .kpi-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
    }

    .section-title {
      margin-bottom: 14px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .kpi {
      min-width: 0;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .kpi-label {
      color: var(--secondary-text-color);
      font-size: 11px;
      line-height: 1.3;
      margin-bottom: 7px;
    }

    .kpi-value {
      font-size: 22px;
      font-weight: 650;
      line-height: 1.15;
      white-space: nowrap;
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
      font-size: 10px;
      line-height: 1.35;
      margin-top: 6px;
    }

    /* CONSUMERS */

    .consumers-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
    }

    .consumer-list {
      display: grid;
      gap: 10px;
    }

    .consumer {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 14px;
    }

    .consumer-main {
      margin-bottom: 13px;
    }

    .consumer-name {
      font-size: 15px;
      font-weight: 650;
    }

    .consumer-entity {
      color: var(--secondary-text-color);
      font-size: 10px;
      margin-top: 3px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .consumer-metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    .consumer-metric-label {
      color: var(--secondary-text-color);
      font-size: 10px;
      margin-bottom: 4px;
    }

    .consumer-metric-value {
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
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
      gap: 10px;
    }

    .insight {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 13px 14px;
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
      background: var(--success-color);
      color: var(--primary-background-color);
    }

    .insight-warning .insight-icon {
      background: var(--warning-color);
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
    }

    .insight-text {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.45;
      margin-top: 3px;
    }

    .insight-meta {
      color: var(--secondary-text-color);
      font-size: 10px;
      margin-top: 4px;
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

    @media (max-width: 700px) {
      .kpi-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .consumer-metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        row-gap: 12px;
      }

      .upcoming-list {
        grid-template-columns: repeat(8, 118px);
      }
    }

    @media (max-width: 500px) {
      .price-header {
        padding: 18px;
      }

      .header-top {
        gap: 12px;
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

      .timeline-section,
      .kpi-section,
      .consumers-section,
      .insights-section {
        padding: 18px;
      }

      .timeline-heading {
        align-items: flex-start;
        flex-direction: column;
      }

      .timeline-legend {
        justify-content: flex-start;
      }

      .timeline-chart svg {
        min-height: 210px;
      }

      .kpi-grid {
        gap: 8px;
      }

      .kpi {
        padding: 12px;
      }

      .kpi-value {
        font-size: 19px;
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
