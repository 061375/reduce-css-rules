/**
 * Reduce
 * @author Jeremy Heminger 2017 <j.heminger13@gmail.com>
 * @version 1.2
 * 
 * loops all stylesheets on webpage and removes duplicates
 * if the selector is not being used it should be never found by the script and thus won't be added to the output sheet
 *
 * 
 * */
var Reduce = {
    
   // @param {Object}
   filtered:{},
   
   
   // @param {String}
   phpurl:'_/php/ajax.php',
   
   
   // @param {Array}
   body:{},
   
   init: function() {
    // create and append some controls
        var f = document.createElement('div');
            f.style.backgroundColor = "rgba(0,0,0,0.6)";
            f.style.position = 'absolute';
            f.style.top = "0px";
            f.style.left = "0px";
            f.style.width = "100%";
            f.style.height = window.innerHeight+"px";
            f.style.zIndex = '9998';
            f.setAttribute("id","reduce_d5gyurt-fader");
            var c = document.createElement("div");
                c.style.position = "absolute";
                c.style.top = "0px";
                c.style.left = "0px";
                c.style.zIndex = "9999";
                c.setAttribute("id","reduce_d5gyurt-container");
                f.appendChild(c);
                var r = document.createElement("button");
                    r.setAttribute("type","button");
                    r.style.float = "left";
                    r.innerHTML = "Run";
                    r.addEventListener("click",function(){Reduce.run();});
                c.appendChild(r);
                var r = document.createElement("button");
                    r.setAttribute("type","button");
                    r.style.float = "left";
                    r.innerHTML = "Reset";
                    r.addEventListener("click",function(){Reduce.reset();});
                c.appendChild(r);
                var r = document.createElement("button");
                    r.setAttribute("type","button");
                    r.style.float = "left";
                    r.innerHTML = "Close";
                    r.addEventListener("click",function(){
                        document.getElementById("reduce_d5gyurt-container").remove();
                        document.getElementById("reduce_d5gyurt-fader").remove(); 
                    });
                c.appendChild(r);
            f.appendChild(c);
        document.getElementsByTagName("body")[0].appendChild(f);
   },
   /**
    * run
    * runs the process
    * @returns {Void}
    * */
   run: function() {
        this.ajax(this.phpurl,function(data){
            // if there is already data from a previous run (another page)
            // then we want to combine it with the currect page
            // duplicates will be overwitten
            // this is because stylesheets may contain rules never used on a page
            if (typeof data.json !== 'undefined') {
                Reduce.filtered = JSON.parse(data.json);
                console.log('Reduce.run :: Reduce.filtered');
                console.log(Reduce.filtered);
            }
            //get all tags in the body
            Reduce.body = document.getElementsByTagName("body")[0].getElementsByTagName("*");
            
            // get body array length
            l = Reduce.body.length;
            // loops all body tags
            for (var i=l; i--;) {
                // gather rules for this node
                Reduce.gatherRules(Reduce.body[i]);
            }
            // make a stylesheet
            var sheet = Reduce.makeSheet(Reduce.filtered);
            
            console.log("\n\n\nReduce.run :: sheet");
            console.log(sheet);
            // send the result to the server to be stored 
            Reduce.ajax(Reduce.phpurl,function(data){
                alert(data);
            },{
                method:'setStyle',
                data:{
                    domain:window.location.hostname,
                    sheet:sheet,
                    json:Reduce.filtered
                }
            });
        },{
            method:'getStyle',
            data: {
                domain:window.location.hostname
            }
        });
   },
   /**
    * reset
    * deletes a project based on the current domain
    * @returns {Void}
    * */
   reset: function() {
        Reduce.ajax(Reduce.phpurl,function(data){
            alert(data);
        },{
            method:'resetDirectory',
            data:{
                domain:window.location.hostname
            }
        }); 
   },
   /**
    * ajax
    * @param {String} url
    * @param {Function} callback
    * @param {Object} {method:'',data:''}
    * @returns {Void}
    * */
   ajax: function(url,callback,data) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var d = Reduce.parseStyleSheet(this.responseText);
            if (typeof d.success === 'undefined') {
                // set an unknown error
                alert('an unknown error occured');
                return false;
            }
            if (0 == d.success) {
                // set a caught error
                var er = '';
                for(var i in d.message) {
                    er+=d.message[i]+"\n";
                }
                alert("Errors: "+er);
                return false;
            }
            // no errors then pass the result to the callback
            callback(d.message);
          }
        };
        xhttp.open("POST", url, true);
        // allow nested arrays in post data
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // // build a query string based on the object
        var q = '';
        for(i in data) {
            if (typeof data[i] === 'object') {
                for(j in data[i]) {
                    
                    if (typeof data[i][j] === 'object') {
                        q+=i+'['+j+']='+JSON.stringify(data[i][j])+'&';
                    }else{
                        q+=i+'['+j+']='+data[i][j]+'&';
                    }
                }
            }else{
                q += i+'='+data[i]+'&';
            }
        }
        // remove the stray dellimeter
        q = q.substring(0,q.length - 1);
        xhttp.send(q);
   },
   /**
    * parseStyleSheet
    * @param {String} json
    * @returns {Object}
    * */
   parseStyleSheet: function(json) {
        return JSON.parse(json);       
   },
   /**
    * gatherRules
    * @param {Object} the current dom node
    * @returns {Void}
    * */
   gatherRules: function(a) {
       // @param {String}
       var re;
       // @param {Object} gets all the calculated stylesheets , {Object} 
       var sheets = document.styleSheets, o = {};
       // loop sheets object
       for (var i in sheets) {
           // get the rules from this sheet
           var rules = sheets[i].rules || sheets[i].cssRules;
           //console.log(rules);
           // loop all the rules for this sheet
           for (var r in rules) {
            
               // if the rule has a name
               if(typeof rules[r].selectorText !== 'undefined') {
                   // get the rule for this name
                   var n = document.querySelectorAll(rules[r].selectorText);
                   // get the length
                   l = n.length;
                   // if there is anything to test
                   if(l > 0) {
                       // loop em all
                       for(var x =0; x<l; x++) {
                           // if this selector matches this node
                           if(n[x].isSameNode(a)) {
                               // get the actual rules 
                               var re = /{(.*)}/;
                               // 
                               var m = rules[r].cssText.match(re);
                               // if there are rules
                               if (m != null) {
                                   // get the style of the current node
                                   var p = a.getAttribute("style");
                                   p = m[0].replace(re, '$1').trim();
                                   // add the rule to the filtered object
                                   // if the selector already exists then it will be replaced
                                   // cascading stylesheet!!!
                                   // if p is empty ... skip it
                                   if (p.trim() != '') 
                                        this.filtered[rules[r].selectorText] = p;
                               }
                           }
                       }
                   }
               }
               /**
                * Test for and add media queries
                * @todo I think I can loop these to get what media querires are (actually) being used on a node
                * */
                if (typeof rules[r].media !== 'undefined' && rules[r].media.length > 0) {
                    var mrules = "";
                    for(var s in rules[r].cssRules) {
                        if (typeof rules[r].cssRules[s].cssText === 'undefined') continue;
                        mrules += rules[r].cssRules[s].cssText;
                    }
                    this.filtered[rules[r].conditionText] = mrules;
                    
                }
           }
       }
   },
   /**
    * makeSheet
    * @param {Object}
    * @param {Boolean} show the result
    * @returns {String}
    * */
   makeSheet: function(css,show) {
       var out = '';
       // loop the rules
       for (var s in css) {
           // add them to a string with no line-breaks
           out+=s+'{'+css[s]+'}';    
       }
    
       if (typeof show !== 'undefined' && show) {
            // create a text field to hold the result that can be copied and pasted
            var b = document.createElement('textarea');
                b.setAttribute("onclick","this.focus();this.select()");
                b.setAttribute("readonly","readonly");
                b.style.zIndex = '9999';
                b.style.position = "absolute";
                b.style.top = "0px";
                b.style.left = "0px";
                b.style.width = "1000px";
                b.style.height = "1000px";
                // add the results
                b.innerHTML = out;
            // add the textarea to the page
            Reduce.body[0].appendChild(b);
       }
       return out;
   }
}
/**
 * remove
 * */
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
window.onload = function(){Reduce.init();}