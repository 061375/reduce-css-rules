javascript:var Reduce={filtered:{},phpurl:"_/php/ajax.php",body:{},init:function(){var a=document.createElement("div");a.style.backgroundColor="rgba(0,0,0,0.6)",a.style.position="absolute",a.style.top="0px",a.style.left="0px",a.style.width="100%",a.style.height=window.innerHeight+"px",a.style.zIndex="9998",a.setAttribute("id","reduce_d5gyurt-fader");var b=document.createElement("div");b.style.position="absolute",b.style.top="0px",b.style.left="0px",b.style.zIndex="9999",b.setAttribute("id","reduce_d5gyurt-container"),a.appendChild(b);var c=document.createElement("button");c.setAttribute("type","button"),c.style["float"]="left",c.innerHTML="Run",c.addEventListener("click",function(){Reduce.run()}),b.appendChild(c);var c=document.createElement("button");c.setAttribute("type","button"),c.style["float"]="left",c.innerHTML="Reset",c.addEventListener("click",function(){Reduce.reset()}),b.appendChild(c);var c=document.createElement("button");c.setAttribute("type","button"),c.style["float"]="left",c.innerHTML="Close",c.addEventListener("click",function(){document.getElementById("reduce_d5gyurt-container").remove(),document.getElementById("reduce_d5gyurt-fader").remove()}),b.appendChild(c),a.appendChild(b),document.getElementsByTagName("body")[0].appendChild(a)},run:function(){this.ajax(this.phpurl,function(a){"undefined"!=typeof a.json&&(Reduce.filtered=JSON.parse(a.json),console.log("Reduce.run :: Reduce.filtered"),console.log(Reduce.filtered)),Reduce.body=document.getElementsByTagName("body")[0].getElementsByTagName("*"),l=Reduce.body.length;for(var b=l;b--;)Reduce.gatherRules(Reduce.body[b]);var c=Reduce.makeSheet(Reduce.filtered);console.log("\n\n\nReduce.run :: sheet"),console.log(c),Reduce.ajax(Reduce.phpurl,function(a){alert(a)},{method:"setStyle",data:{domain:window.location.hostname,sheet:c,json:Reduce.filtered}})},{method:"getStyle",data:{domain:window.location.hostname}})},reset:function(){Reduce.ajax(Reduce.phpurl,function(a){alert(a)},{method:"resetDirectory",data:{domain:window.location.hostname}})},ajax:function(a,b,c){var d=new XMLHttpRequest;d.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var a=Reduce.parseStyleSheet(this.responseText);if("undefined"==typeof a.success)return alert("an unknown error occured"),!1;if(0==a.success){var c="";for(var d in a.message)c+=a.message[d]+"\n";return alert("Errors: "+c),!1}b(a.message)}},d.open("POST",a,!0),d.setRequestHeader("Content-type","application/x-www-form-urlencoded");var e="";for(i in c)if("object"==typeof c[i])for(j in c[i])e+="object"==typeof c[i][j]?i+"["+j+"]="+JSON.stringify(c[i][j])+"&":i+"["+j+"]="+c[i][j]+"&";else e+=i+"="+c[i]+"&";e=e.substring(0,e.length-1),d.send(e)},parseStyleSheet:function(a){return JSON.parse(a)},gatherRules:function(a){var b,c=document.styleSheets;for(var d in c){var e=c[d].rules||c[d].cssRules;for(var f in e)if("undefined"!=typeof e[f].selectorText){var g=document.querySelectorAll(e[f].selectorText);if(l=g.length,l>0)for(var h=0;h<l;h++)if(g[h].isSameNode(a)){var b=/{(.*)}/,i=e[f].cssText.match(b);if(null!=i){var j=a.getAttribute("style");j=i[0].replace(b,"$1").trim(),""!=j.trim()&&(this.filtered[e[f].selectorText]=j)}}}}},makeSheet:function(a,b){var c="";for(var d in a)c+=d+"{"+a[d]+"}";if("undefined"!=typeof b&&b){var e=document.createElement("textarea");e.setAttribute("onclick","this.focus();this.select()"),e.setAttribute("readonly","readonly"),e.style.zIndex="9999",e.style.position="absolute",e.style.top="0px",e.style.left="0px",e.style.width="1000px",e.style.height="1000px",e.innerHTML=c,Reduce.body[0].appendChild(e)}return c}};Element.prototype.remove=function(){this.parentElement.removeChild(this)},NodeList.prototype.remove=HTMLCollection.prototype.remove=function(){for(var a=this.length-1;a>=0;a--)this[a]&&this[a].parentElement&&this[a].parentElement.removeChild(this[a])},window.onload=function(){Reduce.init()};