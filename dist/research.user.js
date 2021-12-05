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
!function(){"use strict";const e=new class{constructor(){const e=document.createElement("div"),t=document.createElement("div");e.innerHTML='<div style="position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 48px 16px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>',t.innerHTML='<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;">[Super Bay]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0;" data-notify-content></p></section>',this.notifyWrapper=e.firstElementChild,this.notifyEl=t.firstElementChild,document.body.appendChild(this.notifyWrapper),this.destroy=this.destroy.bind(this)}trigger({content:e}){const t=this.notifyEl.cloneNode(!0);t.querySelector("p").innerText=e,this.notifyWrapper.appendChild(t),setTimeout(this.destroy,2e3)}destroy(){this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild)}};const t=".sold-result-table",n=".search-input-panel__research-button",o=".research-container input",r=".research-table-row",i=".research-table-row__link-row-anchor",a="#EFEFEF";async function s(){await async function(t,n,o=20){let r=-1,i=null;for(;++r<o;)if(await new Promise((e=>setTimeout((()=>{i=t(),e()}),250))),i)return i;n&&e.trigger({content:n})}((()=>document.querySelector(t)),"Results table took too long to load. Try again.")&&function(){e.trigger({content:"Table upgraded. Visible listings have a darker background."});const n=document.querySelector(t).querySelectorAll(r);for(const e of n)e.querySelector(i)||(e.style.backgroundColor=a)}()}function d(e){e.target.disabled||s()}function l(e){"Enter"===e.key&&s()}e.trigger({content:"Plugin activated!"}),document.querySelector(n).addEventListener("click",d),document.querySelector(o).addEventListener("keydown",l),s()}();
