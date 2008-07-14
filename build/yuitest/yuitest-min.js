(function(){var A=function(C){C.namespace("Test");var B=C.Lang;C.Test.Case=function(D){this._should={};for(var E in D){this[E]=D[E];}if(!B.isString(this.name)){this.name="testCase"+C.guid();}};C.Test.Case.prototype={resume:function(D){C.Test.Runner.resume(D);},wait:function(F,E){var D=arguments;if(B.isFunction(D[0])){throw new C.Test.Wait(D[0],D[1]);}else{throw new C.Test.Wait(function(){C.Assert.fail("Timeout: wait() called but resume() never called.");},(B.isNumber(D[0])?D[0]:10000));}},setUp:function(){},tearDown:function(){}};C.Test.Wait=function(E,D){this.segment=(B.isFunction(E)?E:null);this.delay=(B.isNumber(D)?D:0);};};YUI.add("testcase",A,"3.0.0",{use:["lang"]});})();(function(){var A=function(B){B.namespace("Test");B.Test.Suite=function(C){this.name="";this.items=[];if(B.Lang.isString(C)){this.name=C;}else{if(B.Lang.isObject(C)){B.mix(this,C,true);}}if(this.name===""){this.name="testSuite"+B.guid();}};B.Test.Suite.prototype={add:function(C){if(C instanceof B.Test.Suite||C instanceof B.Test.Case){this.items.push(C);}},setUp:function(){},tearDown:function(){}};};YUI.add("testsuite",A,"3.0.0",{requires:["lang","testcase"]});})();(function(){var A=function(B){B.namespace("Test");if(B.Test.Runner){return ;}B.Test.Runner=(function(){function D(E){this.testObject=E;this.firstChild=null;this.lastChild=null;this.parent=null;this.next=null;this.results={passed:0,failed:0,total:0,ignored:0};if(E instanceof B.Test.Suite){this.results.type="testsuite";this.results.name=E.name;}else{if(E instanceof B.Test.Case){this.results.type="testcase";this.results.name=E.name;}}}D.prototype={appendChild:function(E){var F=new D(E);if(this.firstChild===null){this.firstChild=this.lastChild=F;}else{this.lastChild.next=F;this.lastChild=F;}F.parent=this;return F;}};function C(){C.superclass.constructor.apply(this,arguments);this.masterSuite=new B.Test.Suite("YUI Test Results");this._cur=null;this._root=null;this._log=true;var F=[this.TEST_CASE_BEGIN_EVENT,this.TEST_CASE_COMPLETE_EVENT,this.TEST_SUITE_BEGIN_EVENT,this.TEST_SUITE_COMPLETE_EVENT,this.TEST_PASS_EVENT,this.TEST_FAIL_EVENT,this.TEST_IGNORE_EVENT,this.COMPLETE_EVENT,this.BEGIN_EVENT];for(var E=0;E<F.length;E++){this.subscribe(F[E],this._logEvent,this,true);}}B.extend(C,B.Event.Target,{TEST_CASE_BEGIN_EVENT:"testcasebegin",TEST_CASE_COMPLETE_EVENT:"testcasecomplete",TEST_SUITE_BEGIN_EVENT:"testsuitebegin",TEST_SUITE_COMPLETE_EVENT:"testsuitecomplete",TEST_PASS_EVENT:"pass",TEST_FAIL_EVENT:"fail",TEST_IGNORE_EVENT:"ignore",COMPLETE_EVENT:"complete",BEGIN_EVENT:"begin",disableLogging:function(){this._log=false;},enableLogging:function(){this._log=true;},_logEvent:function(G){var F="";var E="";switch(G.type){case this.BEGIN_EVENT:F="Testing began at "+(new Date()).toString()+".";E="info";break;case this.COMPLETE_EVENT:F="Testing completed at "+(new Date()).toString()+".\nPassed:"+G.results.passed+" Failed:"+G.results.failed+" Total:"+G.results.total;E="info";break;case this.TEST_FAIL_EVENT:F=G.testName+": "+G.error.getMessage();E="fail";break;case this.TEST_IGNORE_EVENT:F=G.testName+": ignored.";E="ignore";break;case this.TEST_PASS_EVENT:F=G.testName+": passed.";E="pass";break;case this.TEST_SUITE_BEGIN_EVENT:F="Test suite \""+G.testSuite.name+"\" started.";E="info";break;case this.TEST_SUITE_COMPLETE_EVENT:F="Test suite \""+G.testSuite.name+"\" completed.\nPassed:"+G.results.passed+" Failed:"+G.results.failed+" Total:"+G.results.total;E="info";break;case this.TEST_CASE_BEGIN_EVENT:F="Test case \""+G.testCase.name+"\" started.";E="info";break;case this.TEST_CASE_COMPLETE_EVENT:F="Test case \""+G.testCase.name+"\" completed.\nPassed:"+G.results.passed+" Failed:"+G.results.failed+" Total:"+G.results.total;E="info";break;default:F="Unexpected event "+G.type;F="info";}if(this._log){B.log(F,E,"TestRunner");}},_addTestCaseToTestTree:function(E,F){var G=E.appendChild(F);for(var H in F){if(H.indexOf("test")===0&&B.Lang.isFunction(F[H])){G.appendChild(H);}}},_addTestSuiteToTestTree:function(E,H){var G=E.appendChild(H);for(var F=0;F<H.items.length;F++){if(H.items[F] instanceof B.Test.Suite){this._addTestSuiteToTestTree(G,H.items[F]);}else{if(H.items[F] instanceof B.Test.Case){this._addTestCaseToTestTree(G,H.items[F]);}}}},_buildTestTree:function(){this._root=new D(this.masterSuite);this._cur=this._root;for(var E=0;E<this.masterSuite.items.length;E++){if(this.masterSuite.items[E] instanceof B.Test.Suite){this._addTestSuiteToTestTree(this._root,this.masterSuite.items[E]);}else{if(this.masterSuite.items[E] instanceof B.Test.Case){this._addTestCaseToTestTree(this._root,this.masterSuite.items[E]);}}}},_handleTestObjectComplete:function(E){if(B.Lang.isObject(E.testObject)){E.parent.results.passed+=E.results.passed;E.parent.results.failed+=E.results.failed;E.parent.results.total+=E.results.total;E.parent.results.ignored+=E.results.ignored;E.parent.results[E.testObject.name]=E.results;if(E.testObject instanceof B.Test.Suite){E.testObject.tearDown();this.fire(this.TEST_SUITE_COMPLETE_EVENT,{testSuite:E.testObject,results:E.results});}else{if(E.testObject instanceof B.Test.Case){this.fire(this.TEST_CASE_COMPLETE_EVENT,{testCase:E.testObject,results:E.results});}}}},_next:function(){if(this._cur.firstChild){this._cur=this._cur.firstChild;}else{if(this._cur.next){this._cur=this._cur.next;}else{while(this._cur&&!this._cur.next&&this._cur!==this._root){this._handleTestObjectComplete(this._cur);this._cur=this._cur.parent;}if(this._cur==this._root){this._cur.results.type="report";this._cur.results.timestamp=(new Date()).toLocaleString();this._cur.results.duration=(new Date())-this._cur.results.duration;this.fire(this.COMPLETE_EVENT,{results:this._cur.results});this._cur=null;}else{this._handleTestObjectComplete(this._cur);this._cur=this._cur.next;}}}return this._cur;},_run:function(){var G=false;var F=this._next();if(F!==null){var E=F.testObject;if(B.Lang.isObject(E)){if(E instanceof B.Test.Suite){this.fire(this.TEST_SUITE_BEGIN_EVENT,{testSuite:E});E.setUp();}else{if(E instanceof B.Test.Case){this.fire(this.TEST_CASE_BEGIN_EVENT,{testCase:E});
}}if(typeof setTimeout!="undefined"){setTimeout(function(){B.Test.Runner._run();},0);}else{this._run();}}else{this._runTest(F);}}},_resumeTest:function(I){var E=this._cur;if(!E){return ;}var J=E.testObject;var G=E.parent.testObject;if(G.__yui_wait){clearTimeout(G.__yui_wait);delete G.__yui_wait;}var M=(G._should.fail||{})[J];var F=(G._should.error||{})[J];var H=false;var K=null;try{I.apply(G);if(M){K=new B.Assert.ShouldFail();H=true;}else{if(F){K=new B.Assert.ShouldError();H=true;}}}catch(L){if(G.__yui_wait){clearTimeout(G.__yui_wait);delete G.__yui_wait;}if(L instanceof B.Assert.Error){if(!M){K=L;H=true;}}else{if(L instanceof B.Test.Wait){if(B.Lang.isFunction(L.segment)){if(B.Lang.isNumber(L.delay)){if(typeof setTimeout!="undefined"){G.__yui_wait=setTimeout(function(){B.Test.Runner._resumeTest(L.segment);},L.delay);}else{throw new Error("Asynchronous tests not supported in this environment.");}}}return ;}else{if(!F){K=new B.Assert.UnexpectedError(L);H=true;}else{if(B.Lang.isString(F)){if(L.message!=F){K=new YAHOO.util.UnexpectedError(L);H=true;}}else{if(B.Lang.isFunction(F)){if(!(L instanceof F)){K=new YAHOO.util.UnexpectedError(L);H=true;}}else{if(B.Lang.isObject(F)){if(!(L instanceof F.constructor)||L.message!=F.message){K=new YAHOO.util.UnexpectedError(L);H=true;}}}}}}}}if(H){this.fire(this.TEST_FAIL_EVENT,{testCase:G,testName:J,error:K});}else{this.fire(this.TEST_PASS_EVENT,{testCase:G,testName:J});}G.tearDown();E.parent.results[J]={result:H?"fail":"pass",message:K?K.getMessage():"Test passed",type:"test",name:J};if(H){E.parent.results.failed++;}else{E.parent.results.passed++;}E.parent.results.total++;if(typeof setTimeout!="undefined"){setTimeout(function(){B.Test.Runner._run();},0);}else{this._run();}},_runTest:function(H){var E=H.testObject;var F=H.parent.testObject;var I=F[E];var G=(F._should.ignore||{})[E];if(G){H.parent.results[E]={result:"ignore",message:"Test ignored",type:"test",name:E};H.parent.results.ignored++;H.parent.results.total++;this.fire(this.TEST_IGNORE_EVENT,{testCase:F,testName:E});if(typeof setTimeout!="undefined"){setTimeout(function(){B.Test.Runner._run();},0);}else{this._run();}}else{F.setUp();this._resumeTest(I);}},fire:function(E,F){F=F||{};F.type=E;C.superclass.fire.call(this,E,F);},add:function(E){this.masterSuite.add(E);},clear:function(){this.masterSuite.items=[];},resume:function(E){this._resumeTest(E||function(){});},run:function(E){var F=B.Test.Runner;F._buildTestTree();F._root.results.duration=(new Date()).valueOf();F.fire(F.BEGIN_EVENT);F._run();}});return new C();})();};YUI.add("testrunner",A,"3.0.0",{requires:["event"]});})();(function(){var A=function(B){B.Assert={_formatMessage:function(D,C){var E=D;if(B.Lang.isString(D)&&D.length>0){return B.Lang.substitute(D,{message:C});}else{return C;}},fail:function(C){throw new B.Assert.Error(B.Assert._formatMessage(C,"Test force-failed."));},areEqual:function(D,E,C){if(D!=E){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(C,"Values should be equal."),D,E);}},areNotEqual:function(C,E,D){if(C==E){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(D,"Values should not be equal."),C);}},areNotSame:function(C,E,D){if(C===E){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(D,"Values should not be the same."),C);}},areSame:function(D,E,C){if(D!==E){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(C,"Values should be the same."),D,E);}},isFalse:function(D,C){if(false!==D){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(C,"Value should be false."),false,D);}},isTrue:function(D,C){if(true!==D){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(C,"Value should be true."),true,D);}},isNaN:function(D,C){if(!isNaN(D)){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(C,"Value should be NaN."),NaN,D);}},isNotNaN:function(D,C){if(isNaN(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Values should not be NaN."),NaN);}},isNotNull:function(D,C){if(B.Lang.isNull(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Values should not be null."),null);}},isNotUndefined:function(D,C){if(B.Lang.isUndefined(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Value should not be undefined."),undefined);}},isNull:function(D,C){if(!B.Lang.isNull(D)){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(C,"Value should be null."),null,D);}},isUndefined:function(D,C){if(!B.Lang.isUndefined(D)){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(C,"Value should be undefined."),undefined,D);}},isArray:function(D,C){if(!B.Lang.isArray(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Value should be an array."),D);}},isBoolean:function(D,C){if(!B.Lang.isBoolean(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Value should be a Boolean."),D);}},isFunction:function(D,C){if(!B.Lang.isFunction(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Value should be a function."),D);}},isInstanceOf:function(D,E,C){if(!(E instanceof D)){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(C,"Value isn't an instance of expected type."),D,E);}},isNumber:function(D,C){if(!B.Lang.isNumber(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Value should be a number."),D);}},isObject:function(D,C){if(!B.Lang.isObject(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Value should be an object."),D);}},isString:function(D,C){if(!B.Lang.isString(D)){throw new B.Assert.UnexpectedValue(B.Assert._formatMessage(C,"Value should be a string."),D);}},isTypeOf:function(C,E,D){if(typeof E!=C){throw new B.Assert.ComparisonFailure(B.Assert._formatMessage(D,"Value should be of type "+expected+"."),expected,typeof actual);}}};B.Assert.Error=function(C){arguments.callee.superclass.constructor.call(this,C);this.message=C;this.name="Assert Error";};B.extend(B.Assert.Error,Error,{getMessage:function(){return this.message;},toString:function(){return this.name+": "+this.getMessage();
},valueOf:function(){return this.toString();}});B.Assert.ComparisonFailure=function(D,C,E){arguments.callee.superclass.constructor.call(this,D);this.expected=C;this.actual=E;this.name="ComparisonFailure";};B.extend(B.Assert.ComparisonFailure,B.Assert.Error,{getMessage:function(){return this.message+"\nExpected: "+this.expected+" ("+(typeof this.expected)+")\nActual:"+this.actual+" ("+(typeof this.actual)+")";}});B.Assert.UnexpectedValue=function(D,C){arguments.callee.superclass.constructor.call(this,D);this.unexpected=C;this.name="UnexpectedValue";};B.extend(B.Assert.UnexpectedValue,B.Assert.Error,{getMessage:function(){return this.message+"\nUnexpected: "+this.unexpected+" ("+(typeof this.unexpected)+") ";}});B.Assert.ShouldFail=function(C){arguments.callee.superclass.constructor.call(this,C||"This test should fail but didn't.");this.name="ShouldFail";};B.extend(B.Assert.ShouldFail,B.Assert.Error);B.Assert.ShouldError=function(C){arguments.callee.superclass.constructor.call(this,C||"This test should have thrown an error but didn't.");this.name="ShouldError";};B.extend(B.Assert.ShouldError,B.Assert.Error);B.Assert.UnexpectedError=function(C){arguments.callee.superclass.constructor.call(this,"Unexpected error: "+C.message);this.cause=C;this.name="UnexpectedError";this.stack=C.stack;};B.extend(B.Assert.UnexpectedError,B.Assert.Error);};YUI.add("assert",A,"3.0.0",{requires:"substitute"});})();(function(){var A=function(C){var B=C.Assert;C.ArrayAssert={contains:function(H,G,E){var F=false;for(var D=0;D<G.length&&!F;D++){if(G[D]===H){F=true;}}if(!F){B.fail(B._formatMessage(E,"Value "+H+" ("+(typeof H)+") not found in array ["+G+"]."));}},containsItems:function(F,G,E){for(var D=0;D<F.length;D++){this.contains(F[D],G,E);}},containsMatch:function(H,G,E){if(typeof H!="function"){throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");}var F=false;for(var D=0;D<G.length&&!F;D++){if(H(G[D])){F=true;}}if(!F){B.fail(Assert._formatMessage(E,"No match found in array ["+G+"]."));}},doesNotContain:function(H,G,E){var F=false;for(var D=0;D<G.length&&!F;D++){if(G[D]===H){F=true;}}if(F){B.fail(Assert._formatMessage(E,"Value found in array ["+G+"]."));}},doesNotContainItems:function(F,G,E){for(var D=0;D<F.length;D++){this.doesNotContain(F[D],G,E);}},doesNotContainMatch:function(H,G,E){if(typeof H!="function"){throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");}var F=false;for(var D=0;D<G.length&&!F;D++){if(H(G[D])){F=true;}}if(F){B.fail(Assert._formatMessage(E,"Value found in array ["+G+"]."));}},indexOf:function(H,G,D,F){for(var E=0;E<G.length;E++){if(G[E]===H){B.areEqual(D,E,F||"Value exists at index "+E+" but should be at index "+D+".");return ;}}B.fail(Assert._formatMessage(F,"Value doesn't exist in array ["+G+"]."));},itemsAreEqual:function(G,H,F){var D=Math.max(G.length,H.length);for(var E=0;E<D;E++){B.areEqual(G[E],H[E],B._formatMessage(F,"Values in position "+E+" are not equal."));}},itemsAreEquivalent:function(H,I,E,G){if(typeof E!="function"){throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");}var D=Math.max(H.length,I.length);for(var F=0;F<D;F++){if(!E(H[F],I[F])){throw new B.ComparisonFailure(YAHOO.util.Assert._formatMessage(G,"Values in position "+F+" are not equivalent."),H[F],I[F]);}}},isEmpty:function(E,D){if(E.length>0){B.fail(B._formatMessage(D,"Array should be empty."));}},isNotEmpty:function(E,D){if(E.length===0){B.fail(B._formatMessage(D,"Array should not be empty."));}},itemsAreSame:function(G,H,F){var D=Math.max(G.length,H.length);for(var E=0;E<D;E++){B.areSame(G[E],H[E],B._formatMessage(F,"Values in position "+E+" are not the same."));}},lastIndexOf:function(H,G,D,F){for(var E=G.length;E>=0;E--){if(G[E]===H){B.areEqual(D,E,B._formatMessage(F,"Value exists at index "+E+" but should be at index "+D+"."));return ;}}B.fail(B._formatMessage(F,"Value doesn't exist in array."));}};};YUI.add("arrayassert",A,"3.0.0");})();(function(){var A=function(D){var C=D.Assert,B=D.Object;D.ObjectAssert={areEqual:function(F,G,E){B.each(F,function(I,H){D.Assert.areEqual(F[H],G[H],D.Assert._formatMessage(E,"Values should be equal for property "+H));});},has:function(E,F,G){if(!(E in F)){C.fail(C._formatMessage(G,"Property '"+E+"' not found on object."));}},hasAll:function(G,E,F){B.each(G,function(I,H){if(!(H in E)){C.fail(C._formatMessage(F,"Property '"+H+"' not found on object."));}});},owns:function(E,F,G){if(!B.owns(F,E)){C.fail(C._formatMessage(G,"Property '"+E+"' not found on object instance."));}},ownsAll:function(G,E,F){B.each(G,function(I,H){if(!B.owns(E,H)){C.fail(C._formatMessage(F,"Property '"+H+"' not found on object instance."));}});}};};YUI.add("objectassert",A,"3.0.0");})();(function(){var A=function(C){var B=C.Assert;C.DateAssert={datesAreEqual:function(E,F,D){if(E instanceof Date&&F instanceof Date){B.areEqual(E.getFullYear(),F.getFullYear(),B._formatMessage(D,"Years should be equal."));B.areEqual(E.getMonth(),F.getMonth(),B._formatMessage(D,"Months should be equal."));B.areEqual(E.getDate(),F.getDate(),B._formatMessage(D,"Day of month should be equal."));}else{throw new TypeError("DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");}},timesAreEqual:function(E,F,D){if(E instanceof Date&&F instanceof Date){B.areEqual(E.getHours(),F.getHours(),B._formatMessage(D,"Hours should be equal."));B.areEqual(E.getMinutes(),F.getMinutes(),B._formatMessage(D,"Minutes should be equal."));B.areEqual(E.getSeconds(),F.getSeconds(),B._formatMessage(D,"Seconds should be equal."));}else{throw new TypeError("DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");}}};};YUI.add("dateassert",A,"3.0.0");})();(function(){var A=function(B){B.namespace("Test");B.Test.Manager={TEST_PAGE_BEGIN_EVENT:"testpagebegin",TEST_PAGE_COMPLETE_EVENT:"testpagecomplete",TEST_MANAGER_BEGIN_EVENT:"testmanagerbegin",TEST_MANAGER_COMPLETE_EVENT:"testmanagercomplete",_curPage:null,_frame:null,_logger:null,_timeoutId:0,_pages:[],_results:null,_handleTestRunnerComplete:function(C){this.fireEvent(this.TEST_PAGE_COMPLETE_EVENT,{page:this._curPage,results:C.results});
this._processResults(this._curPage,C.results);this._logger.clearTestRunner();if(this._pages.length){this._timeoutId=setTimeout(function(){YAHOO.tool.TestManager._run();},1000);}else{this.fireEvent(this.TEST_MANAGER_COMPLETE_EVENT,this._results);}},_processResults:function(E,C){var D=this._results;D.passed+=C.passed;D.failed+=C.failed;D.ignored+=C.ignored;D.total+=C.total;if(C.failed){D.failedPages.push(E);}else{D.passedPages.push(E);}C.name=E;C.type="page";D[E]=C;},_run:function(){this._curPage=this._pages.shift();this.fireEvent(this.TEST_PAGE_BEGIN_EVENT,this._curPage);this._frame.location.replace(this._curPage);},load:function(){if(parent.YAHOO.tool.TestManager!==this){parent.YAHOO.tool.TestManager.load();}else{if(this._frame){var C=this._frame.YAHOO.tool.TestRunner;this._logger.setTestRunner(C);C.subscribe(C.COMPLETE_EVENT,this._handleTestRunnerComplete,this,true);C.run();}}},setPages:function(C){this._pages=C;},start:function(){if(!this._initialized){this.createEvent(this.TEST_PAGE_BEGIN_EVENT);this.createEvent(this.TEST_PAGE_COMPLETE_EVENT);this.createEvent(this.TEST_MANAGER_BEGIN_EVENT);this.createEvent(this.TEST_MANAGER_COMPLETE_EVENT);if(!this._frame){var C=document.createElement("iframe");C.style.visibility="hidden";C.style.position="absolute";document.body.appendChild(C);this._frame=C.contentWindow||C.contentDocument.parentWindow;}this._initialized=true;}this._results={passed:0,failed:0,ignored:0,total:0,type:"report",name:"YUI Test Results",failedPages:[],passedPages:[]};this.fireEvent(this.TEST_MANAGER_BEGIN_EVENT,null);this._run();},stop:function(){clearTimeout(this._timeoutId);}};B.mix(B.Test.Manager,B.Event.Target.prototype);};YUI.add("testmanager",A,"3.0.0");})();(function(){var A=function(B){B.namespace("Test.Format");B.Test.Format.JSON=function(C){return B.JSON.stringify(C);};B.Test.Format.XML=function(E){var C=B.Lang;var D="<"+E.type+" name=\""+E.name.replace(/"/g,"&quot;").replace(/'/g,"&apos;")+"\"";if(E.type=="test"){D+=" result=\""+E.result+"\" message=\""+E.message+"\">";}else{D+=" passed=\""+E.passed+"\" failed=\""+E.failed+"\" ignored=\""+E.ignored+"\" total=\""+E.total+"\">";for(var F in E){if(B.Object.owns(E,F)&&C.isObject(E[F])&&!C.isArray(E[F])){D+=arguments.callee(E[F]);}}}D+="</"+E.type+">";return D;};};YUI.add("testformat",A,"3.0.0");})();(function(){var A=function(B){B.namespace("Test");B.Test.Reporter=function(C,D){this.url=C;this.format=D||B.Test.Format.XML;this._fields=new Object();this._form=null;this._iframe=null;};B.Test.Reporter.prototype={constructor:B.Test.Reporter,addField:function(C,D){this._fields[C]=D;},clearFields:function(){this._fields=new Object();},destroy:function(){if(this._form){this._form.parentNode.removeChild(this._form);this._form=null;}if(this._iframe){this._iframe.parentNode.removeChild(this._iframe);this._iframe=null;}this._fields=null;},report:function(C){if(!this._form){this._form=document.createElement("form");this._form.method="post";this._form.style.visibility="hidden";this._form.style.position="absolute";this._form.style.top=0;document.body.appendChild(this._form);if(B.UA.ie){this._iframe=document.createElement("<iframe name=\"yuiTestTarget\" />");}else{this._iframe=document.createElement("iframe");this._iframe.name="yuiTestTarget";}this._iframe.src="javascript:false";this._iframe.style.visibility="hidden";this._iframe.style.position="absolute";this._iframe.style.top=0;document.body.appendChild(this._iframe);this._form.target="yuiTestTarget";}this._form.action=this.url;while(this._form.hasChildNodes()){this._form.removeChild(this._form.lastChild);}this._fields.results=this.format(C);this._fields.useragent=navigator.userAgent;this._fields.timestamp=(new Date()).toLocaleString();for(var D in this._fields){if(B.Object.owns(this._fields,D)&&typeof this._fields[D]!="function"){input=document.createElement("input");input.type="hidden";input.name=D;input.value=this._fields[D];this._form.appendChild(input);}}delete this._fields.results;delete this._fields.useragent;delete this._fields.timestamp;if(arguments[1]!==false){this._form.submit();}}};};YUI.add("testreporter",A,"3.0.0");})();YUI.add("mock",function(C){var A=C.Lang,B=C.Object;C.Mock=function(F){F=F||{};var D=null;try{D=B(F);}catch(E){D={};C.log("Couldn't create mock with prototype.","warn","Mock");}B.each(F,function(G){if(A.isFunction(F[G])){D[G]=function(){C.Assert.fail("Method "+G+"() was called but was not expected to be.");};}});return D;};C.Mock.expect=function(E,I){if(!E.__expectations){E.__expectations={};}if(I.method){var H=I.method,G=I.arguments||[],D=I.returns,K=A.isNumber(I.callCount)?I.callCount:1,F=I.error,J=I.run||function(){};E.__expectations[H]=I;I.callCount=K;I.actualCallCount=0;C.Array.each(G,function(L,M,N){if(!(N[M] instanceof C.Mock.Value)){N[M]=C.Mock.Value(C.Assert.areSame,[L],"Argument "+M+" of "+H+"() is incorrect.");}});if(K>0){E[H]=function(){I.actualCallCount++;C.Assert.areEqual(G.length,arguments.length,"Method "+H+"() passed incorrect number of arguments.");for(var M=0,L=G.length;M<L;M++){if(G[M]){G[M].verify(arguments[M]);}else{C.Assert.fail("Argument "+M+" ("+arguments[M]+") was not expected to be used.");}}J.apply(this,arguments);if(F){throw F;}return D;};}else{E[H]=function(){C.Assert.fail("Method "+H+"() should not have been called.");};}}else{if(I.property){E.__expectations[H]=I;}}};C.Mock.verify=function(D){B.each(D.__expectations,function(E){if(E.method){C.Assert.areEqual(E.callCount,E.actualCallCount,"Method "+E.method+"() wasn't called the expected number of times.");}else{if(E.property){C.Assert.areEqual(E.value,D[E.property],"Property "+E.property+" wasn't set to the correct value.");}}});};C.Mock.Value=function(F,D,E){if(this instanceof C.Mock.Value){this.verify=function(G){D=[].concat(D);D.push(G);D.push(E);F.apply(null,D);};}else{return new C.Mock.Value(F,D,E);}};C.Mock.Value.Any=C.Mock.Value(function(){},[]);C.Mock.Value.Boolean=C.Mock.Value(C.Assert.isBoolean,[]);C.Mock.Value.Number=C.Mock.Value(C.Assert.isNumber,[]);C.Mock.Value.String=C.Mock.Value(C.Assert.isString,[]);
C.Mock.Value.Object=C.Mock.Value(C.Assert.isObject,[]);C.Mock.Value.Function=C.Mock.Value(C.Assert.isFunction,[]);},"3.0.0");YUI.add("yuitest",function(){},"3.0.0",{use:["assert","objectassert","arrayassert","dateassert","testcase","testsuite","testrunner","mock"]});