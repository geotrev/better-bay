// ==UserScript==
// @name        Super Bay - Research
// @description Better controls in seller hub research
// @namespace   https://github.com/geotrev/super-bay
// @version     1.0.11
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.ebay.com/sh/research*
// @downloadURL https://github.com/geotrev/super-bay/raw/main/dist/research.user.js
// @updateURL   https://github.com/geotrev/super-bay/raw/main/dist/research.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";const t=new class{constructor(){const t=document.createElement("div"),e=document.createElement("div");t.innerHTML='<div style="position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 48px 16px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>',e.innerHTML='<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;">[Super Bay]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0;" data-notify-content></p></section>',this.notifyWrapper=t.firstElementChild,this.notifyEl=e.firstElementChild,document.body.appendChild(this.notifyWrapper),this.destroy=this.destroy.bind(this)}trigger({content:t}){const e=this.notifyEl.cloneNode(!0);e.querySelector("p").innerText=t,this.notifyWrapper.appendChild(e),setTimeout(this.destroy,2e3)}destroy(){this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild)}};async function e(e,n,i=20){let o=-1,r=null;for(;++o<i;)if(await new Promise((t=>setTimeout((()=>{r=e(),t()}),250))),r)return r;n&&t.trigger({content:n})}const n=".sold-result-table",i=".search-input-panel__research-button",o=".research-container input";async function r(){await e((()=>document.querySelector(n)),"Results table took too long to load. Try again.")&&t.trigger({content:"Table upgraded. "})}function d(t){t.target.disabled||r()}function a(t){"Enter"===t.key&&r()}!async function(){t.trigger({content:"Plugin activated!"}),document.querySelector(i).addEventListener("click",d),document.querySelector(o).addEventListener("keydown",a),await e((()=>document.querySelector(n)),"Search to get started.")&&r()}()}();
