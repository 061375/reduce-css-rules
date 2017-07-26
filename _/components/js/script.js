/**
* loops all stylesheets on webpage and removes duplicates
* if the selector is not being used it should be never found by the script and thus won't be added to the output sheet
* */
var Reduce = {
   // @param {Object}
   filtered:{},
   /**
    * init
    * @returns{Void}
    * */
   init: function() {
        var div = document.createElement('div');
            div.setAttribute('id','yhytyhtuhf_cssreduce_container');
            div.style.zIndex = '9999';
            div.style.position = "absolute";
            div.style.top = "0px";
            div.style.left = "0px";
            var input = document.createElement('input');
                input.setAttribute('type','text');
                input.setAttribute('id','yhytyhtuhf_cssreduce_url');
                input.setAttribute('placeholder','URL of stylesheet');
                input.style.width = "200px";
            div.appendChild(input);
            var button = document.createElement('button');
                button.setAttribute('type','button');
                button.setAttribute('id','yhytyhtuhf_cssreduce_button');
                button.innerHTML = "Run";
                button.addEventListener('click',function(e){
                    this.run();    
                });
            div.appendChild(button);
        document.getElementsByTagName('body').appendChild(div);
   },
   /**
    * run
    * runs the process
    * @returns {Void}
    * */
   run: function() {
        var url = document.getElementById('yhytyhtuhf_cssreduce_url').value;
        this.ajax(url,function(data){
            
            // add the stylesheet from previous runs on previous pages
            this.filtered = this.parseStyleSheet(data);
            
            // remove the URL and button for this tool so it doesn't get added to the stylesheet
            document.getElementById('yhytyhtuhf_cssreduce_container').remove();
            
            //get all tags in the body
            body = document.getElementsByTagName("body")[0].getElementsByTagName("*");
            
            // get body array length
            l = body.length;
            // loops all body tags
            for (var i=l; i--;) {
                // gather rules for this node
                this.gatherRules(body[i]);
            }
            // make a stylesheet
            var sheet = this.makeSheet(this.filtered,body);
            
            // send the result to the server to be stored 
            this.ajax(url,function(data){
                alert(data);
            },{
                method:'setStyle',
                data:{
                    sheet:sheet,
                    json:this.filtered
                }
            });
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
            callback(this.responseText);
          }
        };
        xhttp.open("POST", url, true);
        // if data not set assume we are simply getting the previous css
        if (typeof data === 'undefined')
            data = {
                method:'getStyle'
            }
        xhttp.send(data);
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
    * @returns {String}
    * */
   makeSheet: function(css) {
       var out = '';
       // loop the rules
       for (var s in css) {
           // add them to a string with no line-breaks
           out+=s+'{'+css[s]+'}';    
       }
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
       body.appendChild(b);
       return out;
   }
}
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