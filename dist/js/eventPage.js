/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1047);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1047:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HistoryGraph_1 = __webpack_require__(1048);
var historyGraph = new HistoryGraph_1.default();
// const socket = io.connect('http://localhost:3005');
// socket.on('graphData', (data) => {
//   console.log('user connected', data);
// })
// socket.emit('ext', 'hello');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'deleteNode') {
        historyGraph.deleteNode(request.id);
    }
    else if (request.type === "getNodesAndLinks") {
        var res = historyGraph.generateGraph();
        console.log(res);
        sendResponse(res);
    }
});
chrome.tabs.onCreated.addListener(function (tab) {
    console.log('opened tab:', tab);
});
chrome.tabs.onUpdated.addListener(function (tabId, tabInfo, tab) {
    var url = tab.url;
    var title = tab.title;
    console.log('tabs updated: url', url, 'title', title);
    if (tabInfo.status !== 'complete')
        return;
    historyGraph.addPage(url, title);
});


/***/ }),

/***/ 1048:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HistoryNode_1 = __webpack_require__(1049);
var SuggestionNode_1 = __webpack_require__(1050);
var Page_1 = __webpack_require__(1051);
var HistoryGraph = /** @class */ (function () {
    function HistoryGraph() {
        this.pages = {};
        this.nodes = [];
        this.lastHistoryNode = null;
        this.nextNodeId = 0;
        this.nextLinkId = 0;
    }
    HistoryGraph.prototype.addPage = function (url, title) {
        if (this.pages[url] === undefined) {
            this.pages[url] = new Page_1.default(url, title);
        }
        var page = this.pages[url];
        var historyNode = new HistoryNode_1.default(page, this.lastHistoryNode, this.nextNodeId);
        this.nextNodeId += 1;
        if (this.lastHistoryNode !== null) {
            this.lastHistoryNode.next = historyNode;
        }
        this.lastHistoryNode = historyNode;
        this.nodes.push(historyNode);
        // add suggestions asynchronously
        for (var _i = 0, _a = ['www.google.com', 'www.stackoverflow.com', 'wikipedia.org']; _i < _a.length; _i++) {
            var url_1 = _a[_i];
            this.addSuggestion(historyNode, url_1, url_1);
        }
    };
    HistoryGraph.prototype.addSuggestion = function (anchor, url, title) {
        if (this.pages[url] === undefined) {
            this.pages[url] = new Page_1.default(url, title);
        }
        var page = this.pages[url];
        var suggestionNode = new SuggestionNode_1.default(page, anchor, this.nextNodeId);
        this.nextNodeId += 1;
        anchor.suggestions.push(suggestionNode);
        this.nodes.push(suggestionNode);
    };
    HistoryGraph.prototype.deleteNode = function (id) {
        var _this = this;
        var node = this.nodes[id];
        console.log('DELETING', id, node);
        if (node.isSuggestion) {
            var a = node.anchor;
            delete a.suggestions[(a.suggestions.indexOf(node))];
        }
        else {
            if (node.prev !== null) {
                node.prev.next = node.next;
            }
            if (node.next !== null) {
                node.next.prev = node.prev;
            }
            if (this.lastHistoryNode === node) {
                this.lastHistoryNode = node.prev;
            }
            node.suggestions.forEach(function (suggestion) {
                delete _this.nodes[suggestion.id];
            });
        }
        delete this.nodes[id];
    };
    HistoryGraph.prototype.generateGraph = function () {
        var _this = this;
        var links = [];
        var nodes = {};
        this.nodes.forEach(function (node, i) {
            var link = node.getLink();
            if (link !== null) {
                links.push(link);
            }
            nodes[node.id] = {
                data: node.page,
                id: node.id,
                prevId: (node.isSuggestion ? null : (node.prev === null ? null : node.prev.id)),
                anchorId: node.isSuggestion ? node.anchor.id : null,
                isSuggestion: node.isSuggestion,
                x: i * 50 - 25 * (_this.nodes.length),
                y: 0,
                vx: 0,
                vy: 0
            };
        });
        return { nodes: nodes, links: links };
    };
    return HistoryGraph;
}());
exports.default = HistoryGraph;


/***/ }),

/***/ 1049:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HistoryNode = /** @class */ (function () {
    function HistoryNode(page, prev, id) {
        this.next = null;
        this.isSuggestion = false;
        this.page = page;
        this.prev = prev;
        this.id = id;
        this.suggestions = [];
    }
    HistoryNode.prototype.getLink = function () {
        if (this.prev === null) {
            return null;
        }
        return {
            source: this.prev.id,
            target: this.id
        };
    };
    return HistoryNode;
}());
exports.default = HistoryNode;


/***/ }),

/***/ 1050:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SuggestionNode = /** @class */ (function () {
    function SuggestionNode(page, anchor, id) {
        this.isSuggestion = true;
        this.page = page;
        this.anchor = anchor;
        this.id = id;
    }
    SuggestionNode.prototype.getLink = function () {
        return {
            source: this.anchor.id,
            target: this.id
        };
    };
    return SuggestionNode;
}());
exports.default = SuggestionNode;


/***/ }),

/***/ 1051:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Page = /** @class */ (function () {
    function Page(url, title) {
        this.title = title;
        this.url = url;
    }
    return Page;
}());
exports.default = Page;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmY3ZTM3ZGI2MzdhNTA2MmMwNWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50UGFnZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL0hpc3RvcnlHcmFwaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSGlzdG9yeU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N1Z2dlc3Rpb25Ob2RlLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvUGFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3REQSwrQ0FBMEM7QUFFMUMsSUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFFeEMsc0RBQXNEO0FBRXRELHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFDekMsS0FBSztBQUNMLCtCQUErQjtBQUUvQixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ2xDLFVBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtRQUNqQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FB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TztZQUNILE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1NBQ2xCO0lBQ0wsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQztBQUVELGtCQUFlLGNBQWM7Ozs7Ozs7Ozs7O0FDeEI3QjtJQUlJLGNBQVksR0FBRyxFQUFFLEtBQUs7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDO0FBRUQsa0JBQWUsSUFBSSxDQUFDIiwiZmlsZSI6ImV2ZW50UGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEwNDcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGZmN2UzN2RiNjM3YTUwNjJjMDVlIiwiaW1wb3J0IEhpc3RvcnlHcmFwaE5vZGUgZnJvbSAnLi9IaXN0b3J5R3JhcGhOb2RlJztcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgeyBTaW11bGF0aW9uTm9kZURhdHVtIH0gZnJvbSAnZDMnO1xyXG5pbXBvcnQgUGFnZSBmcm9tICcuL1BhZ2UnO1xyXG5pbXBvcnQgR3JhcGhMaW5rIGZyb20gJy4vR3JhcGhMaW5rJztcclxuaW1wb3J0IEdyYXBoTm9kZSBmcm9tICcuL0dyYXBoTm9kZSc7XHJcbmltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgSGlzdG9yeUdyYXBoIGZyb20gJy4vSGlzdG9yeUdyYXBoJztcclxuXHJcbmNvbnN0IGhpc3RvcnlHcmFwaCA9IG5ldyBIaXN0b3J5R3JhcGgoKTtcclxuXHJcbi8vIGNvbnN0IHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwNScpO1xyXG5cclxuLy8gc29ja2V0Lm9uKCdncmFwaERhdGEnLCAoZGF0YSkgPT4ge1xyXG4vLyAgIGNvbnNvbGUubG9nKCd1c2VyIGNvbm5lY3RlZCcsIGRhdGEpO1xyXG4vLyB9KVxyXG4vLyBzb2NrZXQuZW1pdCgnZXh0JywgJ2hlbGxvJyk7XHJcblxyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXHJcbiAgZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcclxuICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpO1xyXG4gICAgaWYgKHJlcXVlc3QudHlwZSA9PT0gJ2RlbGV0ZU5vZGUnKSB7XHJcbiAgICAgIGhpc3RvcnlHcmFwaC5kZWxldGVOb2RlKHJlcXVlc3QuaWQpO1xyXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LnR5cGUgPT09IFwiZ2V0Tm9kZXNBbmRMaW5rc1wiKSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gaGlzdG9yeUdyYXBoLmdlbmVyYXRlR3JhcGgoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgIHNlbmRSZXNwb25zZShyZXMpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmNocm9tZS50YWJzLm9uQ3JlYXRlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnb3BlbmVkIHRhYjonLCB0YWIpO1xyXG59KVxyXG4gIFxyXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCB0YWJJbmZvLCB0YWIpID0+IHtcclxuICAgIGxldCB1cmwgPSB0YWIudXJsO1xyXG4gICAgbGV0IHRpdGxlID0gdGFiLnRpdGxlO1xyXG4gICAgY29uc29sZS5sb2coJ3RhYnMgdXBkYXRlZDogdXJsJywgdXJsLCAndGl0bGUnLCB0aXRsZSk7XHJcbiAgICBpZiAodGFiSW5mby5zdGF0dXMgIT09ICdjb21wbGV0ZScpIHJldHVybjtcclxuICAgIGhpc3RvcnlHcmFwaC5hZGRQYWdlKHVybCwgdGl0bGUpO1xyXG59KVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXZlbnRQYWdlLnRzeCIsImltcG9ydCBHcmFwaE5vZGUgZnJvbSAnLi9HcmFwaE5vZGUnO1xyXG5pbXBvcnQgSGlzdG9yeU5vZGUgZnJvbSAnLi9IaXN0b3J5Tm9kZSc7XHJcbmltcG9ydCBTdWdnZXN0aW9uTm9kZSBmcm9tICcuL1N1Z2dlc3Rpb25Ob2RlJztcclxuaW1wb3J0IEdyYXBoTGluayBmcm9tICcuL0dyYXBoTGluayc7XHJcbmltcG9ydCBQYWdlIGZyb20gJy4vUGFnZSc7XHJcblxyXG5jbGFzcyBIaXN0b3J5R3JhcGgge1xyXG4gICAgcGFnZXM6IHtbdXJsOiBzdHJpbmddOiBQYWdlfSA9IHt9O1xyXG4gICAgbm9kZXM6IEFycmF5PEhpc3RvcnlOb2RlIHwgU3VnZ2VzdGlvbk5vZGU+ID0gW107XHJcbiAgICBsYXN0SGlzdG9yeU5vZGU6IEhpc3RvcnlOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBuZXh0Tm9kZUlkOiBudW1iZXIgPSAwO1xyXG4gICAgbmV4dExpbmtJZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYWdlICh1cmwsIHRpdGxlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFnZXNbdXJsXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNbdXJsXSA9IG5ldyBQYWdlKHVybCwgdGl0bGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwYWdlID0gdGhpcy5wYWdlc1t1cmxdO1xyXG4gICAgICAgIGNvbnN0IGhpc3RvcnlOb2RlOiBIaXN0b3J5Tm9kZSA9IG5ldyBIaXN0b3J5Tm9kZShwYWdlLCB0aGlzLmxhc3RIaXN0b3J5Tm9kZSwgdGhpcy5uZXh0Tm9kZUlkKTtcclxuICAgICAgICB0aGlzLm5leHROb2RlSWQgKz0gMTtcclxuICAgICAgICBpZiAodGhpcy5sYXN0SGlzdG9yeU5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0SGlzdG9yeU5vZGUubmV4dCA9IGhpc3RvcnlOb2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RIaXN0b3J5Tm9kZSA9IGhpc3RvcnlOb2RlO1xyXG4gICAgICAgIHRoaXMubm9kZXMucHVzaChoaXN0b3J5Tm9kZSk7XHJcbiAgICAgICAgLy8gYWRkIHN1Z2dlc3Rpb25zIGFzeW5jaHJvbm91c2x5XHJcbiAgICAgICAgZm9yIChjb25zdCB1cmwgb2YgWyd3d3cuZ29vZ2xlLmNvbScsICd3d3cuc3RhY2tvdmVyZmxvdy5jb20nLCAnd2lraXBlZGlhLm9yZyddKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3VnZ2VzdGlvbihoaXN0b3J5Tm9kZSwgdXJsLCB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGRTdWdnZXN0aW9uKGFuY2hvciwgdXJsLCB0aXRsZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhZ2VzW3VybF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzW3VybF0gPSBuZXcgUGFnZSh1cmwsIHRpdGxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGFnZSA9IHRoaXMucGFnZXNbdXJsXTtcclxuICAgICAgICBjb25zdCBzdWdnZXN0aW9uTm9kZTogU3VnZ2VzdGlvbk5vZGUgPSBuZXcgU3VnZ2VzdGlvbk5vZGUocGFnZSwgYW5jaG9yLCB0aGlzLm5leHROb2RlSWQpO1xyXG4gICAgICAgIHRoaXMubmV4dE5vZGVJZCArPSAxO1xyXG4gICAgICAgIGFuY2hvci5zdWdnZXN0aW9ucy5wdXNoKHN1Z2dlc3Rpb25Ob2RlKTtcclxuICAgICAgICB0aGlzLm5vZGVzLnB1c2goc3VnZ2VzdGlvbk5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZU5vZGUoaWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG5vZGU6IGFueSA9IHRoaXMubm9kZXNbaWRdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdERUxFVElORycsIGlkLCBub2RlKTtcclxuICAgICAgICBpZiAobm9kZS5pc1N1Z2dlc3Rpb24pIHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IG5vZGUuYW5jaG9yO1xyXG4gICAgICAgICAgICBkZWxldGUgYS5zdWdnZXN0aW9uc1soYS5zdWdnZXN0aW9ucy5pbmRleE9mKG5vZGUpKV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG5vZGUucHJldiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wcmV2Lm5leHQgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vZGUubmV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5uZXh0LnByZXYgPSBub2RlLnByZXY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdEhpc3RvcnlOb2RlID09PSBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXN0b3J5Tm9kZSA9IG5vZGUucHJldjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLnN1Z2dlc3Rpb25zLmZvckVhY2goc3VnZ2VzdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5ub2Rlc1tzdWdnZXN0aW9uLmlkXTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIHRoaXMubm9kZXNbaWRdO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlR3JhcGgoKToge25vZGVzOiB7W2lkOiBzdHJpbmddOiBHcmFwaE5vZGV9LCBsaW5rczogR3JhcGhMaW5rW119IHtcclxuICAgICAgICBjb25zdCBsaW5rczogR3JhcGhMaW5rW10gPSBbXTtcclxuICAgICAgICBjb25zdCBub2Rlczoge1tpZDogc3RyaW5nXTogR3JhcGhOb2RlfSA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaCgobm9kZTogYW55LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGluazogR3JhcGhMaW5rIHwgbnVsbCA9IG5vZGUuZ2V0TGluaygpO1xyXG4gICAgICAgICAgICBpZiAobGluayAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbGlua3MucHVzaChsaW5rKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2Rlc1tub2RlLmlkXSA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IG5vZGUucGFnZSxcclxuICAgICAgICAgICAgICAgIGlkOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgcHJldklkOiAobm9kZS5pc1N1Z2dlc3Rpb24/IG51bGw6IChub2RlLnByZXYgPT09IG51bGw/IG51bGw6IG5vZGUucHJldi5pZCkpLFxyXG4gICAgICAgICAgICAgICAgYW5jaG9ySWQ6IG5vZGUuaXNTdWdnZXN0aW9uPyBub2RlLmFuY2hvci5pZDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGlzU3VnZ2VzdGlvbjogbm9kZS5pc1N1Z2dlc3Rpb24sXHJcbiAgICAgICAgICAgICAgICB4OiBpICogNTAgLSAyNSAqICh0aGlzLm5vZGVzLmxlbmd0aCksXHJcbiAgICAgICAgICAgICAgICB5OiAwLFxyXG4gICAgICAgICAgICAgICAgdng6IDAsXHJcbiAgICAgICAgICAgICAgICB2eTogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4ge25vZGVzOiBub2RlcywgbGlua3M6IGxpbmtzfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5R3JhcGhcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0hpc3RvcnlHcmFwaC50cyIsImltcG9ydCBQYWdlIGZyb20gJy4vUGFnZSc7XHJcbmltcG9ydCBTdWdnZXN0aW9uTm9kZSBmcm9tICcuL1N1Z2dlc3Rpb25Ob2RlJztcclxuaW1wb3J0IEdyYXBoTGluayBmcm9tICcuL0dyYXBoTGluayc7XHJcblxyXG5jbGFzcyBIaXN0b3J5Tm9kZSB7XHJcbiAgICBwYWdlOiBQYWdlO1xyXG4gICAgcHJldjogSGlzdG9yeU5vZGUgfCBudWxsO1xyXG4gICAgbmV4dDogSGlzdG9yeU5vZGUgfCBudWxsID0gbnVsbDtcclxuICAgIHN1Z2dlc3Rpb25zOiBTdWdnZXN0aW9uTm9kZVtdO1xyXG4gICAgaXNTdWdnZXN0aW9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBpZDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhZ2UsIHByZXYsIGlkKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlID0gcGFnZTtcclxuICAgICAgICB0aGlzLnByZXYgPSBwcmV2O1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGluaygpOiBHcmFwaExpbmsgfCBudWxsIHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMucHJldi5pZCxcclxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmlkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5Tm9kZVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSGlzdG9yeU5vZGUudHMiLCJpbXBvcnQgUGFnZSBmcm9tICcuL1BhZ2UnO1xyXG5pbXBvcnQgSGlzdG9yeU5vZGUgZnJvbSAnLi9IaXN0b3J5Tm9kZSc7XHJcbmltcG9ydCBHcmFwaExpbmsgZnJvbSAnLi9HcmFwaExpbmsnO1xyXG5cclxuY2xhc3MgU3VnZ2VzdGlvbk5vZGUge1xyXG4gICAgcGFnZTogUGFnZTtcclxuICAgIGFuY2hvcjogSGlzdG9yeU5vZGU7XHJcbiAgICBpc1N1Z2dlc3Rpb246IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgaWQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYWdlLCBhbmNob3IsIGlkKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlID0gcGFnZTtcclxuICAgICAgICB0aGlzLmFuY2hvciA9IGFuY2hvcjtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGluaygpOiBHcmFwaExpbmsge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5hbmNob3IuaWQsXHJcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5pZFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3VnZ2VzdGlvbk5vZGVcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N1Z2dlc3Rpb25Ob2RlLnRzeCIsImNsYXNzIFBhZ2Uge1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIHVybDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybCwgdGl0bGUpIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBhZ2U7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QYWdlLnRzeCJdLCJzb3VyY2VSb290IjoiIn0=