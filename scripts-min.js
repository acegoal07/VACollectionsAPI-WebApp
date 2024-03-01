window.addEventListener("load",(()=>{document.querySelector("#search-form").addEventListener("submit",(async e=>{e.preventDefault(),document.querySelector("#search_results_output").querySelectorAll("*").forEach((e=>e.remove()));let t=document.querySelector("#size-select").value,r=document.querySelector("#image_check").checked,o=document.querySelector("#search_query").value;const c=document.querySelector("#hint_search_query"),l=document.querySelector("#search_query");let a=!0;""===o||o.length<0?(c.classList.add("show-inline"),l.classList.add("input-error"),a=!1):(c.classList.remove("show-inline"),l.classList.remove("input-error")),a&&(document.querySelector("#search-form").classList.remove("show-block"),document.querySelector("#loading-view").classList.add("show-block"),fetch(`https://api.vam.ac.uk/v2/objects/search?q=${o}&page_size=${t}`+("null"===document.querySelector("#order_by").value?"":`&order_by=${document.querySelector("#order_by").value}`)+("null"===document.querySelector("#order_sort").value?"":`&order_sort=${document.querySelector("#order_sort").value}`)+"&data_profile=full"+`&images_exist=${r}`).then((async e=>{if(e.ok)return await e.json();document.querySelector("#loading-view").classList.remove("show-block"),document.querySelector("#error-view").classList.add("show-block")})).then((e=>{const t=e.records,r=document.querySelector("#search_results_output");if(0===t.length){let e=document.createElement("div");e.setAttribute("class","record_display");let t=document.createElement("h2");t.textContent="No records found",e.appendChild(t);let o=document.createElement("p");o.textContent="There are no records that match your search query",e.appendChild(o),r.appendChild(e)}else t.forEach((async e=>{let t=document.createElement("div");t.setAttribute("class","record_display");let o=document.createElement("h2");o.textContent=`Record ${e.systemNumber}`,t.appendChild(o),await fetch(e._images._primary_thumbnail).then((async e=>{if(e.ok)return await e.blob()})).then((r=>{let o=document.createElement("img");o.src=URL.createObjectURL(r),o.alt=e._primaryTitle,t.appendChild(o);let c=document.createElement("a");c.href=e._images._iiif_image_base_url+"/full/full/0/default.jpg",c.setAttribute("target","_blank"),c.setAttribute("rel","noopener noreferrer"),c.classList.add("record_full_image_link"),c.textContent="View full image",t.appendChild(c)})).catch((e=>{let r=document.createElement("p");r.textContent="No image available",t.appendChild(r)}));let c=document.createElement("h3");c.textContent="Title:",t.appendChild(c);let l=document.createElement("p");l.textContent=`${""===e._primaryTitle?"No title":e._primaryTitle}`,t.appendChild(l);let a=document.createElement("h3");a.textContent="Date:",t.appendChild(a);let n=document.createElement("p");n.textContent=`${""===e._primaryDate?"No date":e._primaryDate}`,t.appendChild(n);let s=document.createElement("h3");s.textContent="Summary description:",t.appendChild(s);let d=document.createElement("p");d.textContent=`${""===e.summaryDescription?"No description available":e.summaryDescription.replaceAll(/<[^>]*>?/gm,"")}`,t.appendChild(d),r.appendChild(t)}));document.querySelector("#loading-view").classList.remove("show-block"),document.querySelector("#search-results").classList.add("show-block")})).catch((e=>{document.querySelector("#loading-view").classList.remove("show-block"),document.querySelector("#error-view").classList.add("show-block")})))})),document.querySelector("#try-again").addEventListener("click",(e=>{e.preventDefault(),document.querySelector("#error-view").classList.remove("show-block"),document.querySelector("#search-form").classList.add("show-block")})),document.querySelector("#back-to-search").addEventListener("click",(e=>{e.preventDefault(),document.querySelector("#search_query").value="",document.querySelector("#search-results").classList.remove("show-block"),document.querySelector("#search-form").classList.add("show-block")}))}));