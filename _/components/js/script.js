/**
* loops all stylesheets on webpage and removes duplicates
* if the selector is not being used it should be never found by the script and thus won't be added to the output sheet
* */
var Reduce = {
   // @param {Object}
   filtered:{},
   // @param {String}
   phpurl:'_/php/ajax.php',
   // @param {Array}
   body:{},
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
    * loadStyleSheet
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
                                   this.filtered[rules[r].selectorText] = p;
                               }
                           }
                       }
                   }
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
Reduce.run();