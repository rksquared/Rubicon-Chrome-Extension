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
        console.log(this.toJSON());
        this.fromJSON(this.toJSON());
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
        var node = this.nodes.filter(function (n) { return n.id === id; })[0];
        if (node.isSuggestion) {
            var a = node.anchor;
            delete a.suggestions[a.suggestions.indexOf(node)];
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
                delete _this.nodes[_this.nodes.indexOf(suggestion)];
            });
        }
        this.nodes = this.nodes.filter(function (n) { return n.id !== id; });
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
    HistoryGraph.prototype.toJSON = function () {
        return JSON.stringify(this.nodes.map(function (node) { return ({
            data: node.page,
            id: node.id,
            isSuggestion: node.isSuggestion,
            suggestions: node.isSuggestion ? null : node.suggestions.map(function (n) { return n.id; }),
            next: node.isSuggestion ? null : (node.next === null ? null : node.next.id),
            prev: node.isSuggestion ? null : (node.prev === null ? null : node.prev.id),
            anchor: node.isSuggestion ? node.anchor.id : null
        }); }));
    };
    HistoryGraph.prototype.fromJSON = function (json) {
        var _this = this;
        var nodes = JSON.parse(json);
        if (nodes.indexOf(null) !== -1)
            console.log('ERROR NULL');
        var nodeDict = {};
        var historyNodes = nodes.filter(function (n) { return !n.isSuggestion; });
        var suggestionNodes = nodes.filter(function (n) { return n.isSuggestion; });
        nodes.forEach(function (n) {
            _this.pages[n.data.url] = n.data;
            _this.nextNodeId = Math.max(_this.nextNodeId, n.id);
        });
        historyNodes.forEach(function (n) {
            var newNode = new HistoryNode_1.default(n.data, null, n.id);
            nodeDict[n.id] = newNode;
        });
        historyNodes.forEach(function (n) {
            if (n.next !== null) {
                nodeDict[n.id].next = nodeDict[n.next];
                nodeDict[n.next].prev = nodeDict[n.id];
            }
            else {
                _this.lastHistoryNode = nodeDict[n.id];
            }
            if (n.prev !== null) {
                nodeDict[n.id].prev = nodeDict[n.prev];
                nodeDict[n.prev].next = nodeDict[n.id];
            }
        });
        suggestionNodes.forEach(function (n) {
            var newNode = new SuggestionNode_1.default(_this.pages[n.data.url], nodeDict[n.anchor], n.id);
            nodeDict[n.id] = newNode;
            nodeDict[n.anchor].suggestions.push(nodeDict[n.id]);
        });
        console.log('NODES', Object.keys(nodeDict).map(function (n) { return nodeDict[n]; }));
        this.nodes = Object.keys(nodeDict).map(function (n) { return nodeDict[n]; });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzQ5ZGYyZDgwOGM1ZTliODI5NjciLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50UGFnZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL0hpc3RvcnlHcmFwaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSGlzdG9yeU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N1Z2dlc3Rpb25Ob2RlLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvUGFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3REQSwrQ0FBMEM7QUFFMUMsSUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFFeEMsc0RBQXNEO0FBRXRELHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFDekMsS0FBSztBQUNMLCtCQUErQjtBQUUvQixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ2xDLFVBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtRQUNqQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FB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d0JBQVksSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBSDVCLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBSXpCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxnQ0FBTyxHQUFQO1FBQ0ksT0FBTztZQUNILE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1NBQ2xCO0lBQ0wsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQztBQUVELGtCQUFlLGNBQWM7Ozs7Ozs7Ozs7O0FDeEI3QjtJQUlJLGNBQVksR0FBRyxFQUFFLEtBQUs7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDO0FBRUQsa0JBQWUsSUFBSSxDQUFDIiwiZmlsZSI6ImV2ZW50UGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEwNDcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDM0OWRmMmQ4MDhjNWU5YjgyOTY3IiwiaW1wb3J0IEhpc3RvcnlHcmFwaE5vZGUgZnJvbSAnLi9IaXN0b3J5R3JhcGhOb2RlJztcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgeyBTaW11bGF0aW9uTm9kZURhdHVtIH0gZnJvbSAnZDMnO1xyXG5pbXBvcnQgUGFnZSBmcm9tICcuL1BhZ2UnO1xyXG5pbXBvcnQgR3JhcGhMaW5rIGZyb20gJy4vR3JhcGhMaW5rJztcclxuaW1wb3J0IEdyYXBoTm9kZSBmcm9tICcuL0dyYXBoTm9kZSc7XHJcbmltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgSGlzdG9yeUdyYXBoIGZyb20gJy4vSGlzdG9yeUdyYXBoJztcclxuXHJcbmNvbnN0IGhpc3RvcnlHcmFwaCA9IG5ldyBIaXN0b3J5R3JhcGgoKTtcclxuXHJcbi8vIGNvbnN0IHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwNScpO1xyXG5cclxuLy8gc29ja2V0Lm9uKCdncmFwaERhdGEnLCAoZGF0YSkgPT4ge1xyXG4vLyAgIGNvbnNvbGUubG9nKCd1c2VyIGNvbm5lY3RlZCcsIGRhdGEpO1xyXG4vLyB9KVxyXG4vLyBzb2NrZXQuZW1pdCgnZXh0JywgJ2hlbGxvJyk7XHJcblxyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXHJcbiAgZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcclxuICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpO1xyXG4gICAgaWYgKHJlcXVlc3QudHlwZSA9PT0gJ2RlbGV0ZU5vZGUnKSB7XHJcbiAgICAgIGhpc3RvcnlHcmFwaC5kZWxldGVOb2RlKHJlcXVlc3QuaWQpO1xyXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LnR5cGUgPT09IFwiZ2V0Tm9kZXNBbmRMaW5rc1wiKSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gaGlzdG9yeUdyYXBoLmdlbmVyYXRlR3JhcGgoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgIHNlbmRSZXNwb25zZShyZXMpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmNocm9tZS50YWJzLm9uQ3JlYXRlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnb3BlbmVkIHRhYjonLCB0YWIpO1xyXG59KVxyXG4gIFxyXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCB0YWJJbmZvLCB0YWIpID0+IHtcclxuICAgIGxldCB1cmwgPSB0YWIudXJsO1xyXG4gICAgbGV0IHRpdGxlID0gdGFiLnRpdGxlO1xyXG4gICAgY29uc29sZS5sb2coJ3RhYnMgdXBkYXRlZDogdXJsJywgdXJsLCAndGl0bGUnLCB0aXRsZSk7XHJcbiAgICBpZiAodGFiSW5mby5zdGF0dXMgIT09ICdjb21wbGV0ZScpIHJldHVybjtcclxuICAgIGhpc3RvcnlHcmFwaC5hZGRQYWdlKHVybCwgdGl0bGUpO1xyXG59KVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXZlbnRQYWdlLnRzeCIsImltcG9ydCBHcmFwaE5vZGUgZnJvbSAnLi9HcmFwaE5vZGUnO1xyXG5pbXBvcnQgSGlzdG9yeU5vZGUgZnJvbSAnLi9IaXN0b3J5Tm9kZSc7XHJcbmltcG9ydCBTdWdnZXN0aW9uTm9kZSBmcm9tICcuL1N1Z2dlc3Rpb25Ob2RlJztcclxuaW1wb3J0IEdyYXBoTGluayBmcm9tICcuL0dyYXBoTGluayc7XHJcbmltcG9ydCBQYWdlIGZyb20gJy4vUGFnZSc7XHJcblxyXG5jbGFzcyBIaXN0b3J5R3JhcGgge1xyXG4gICAgcGFnZXM6IHtbdXJsOiBzdHJpbmddOiBQYWdlfSA9IHt9O1xyXG4gICAgbm9kZXM6IEFycmF5PEhpc3RvcnlOb2RlIHwgU3VnZ2VzdGlvbk5vZGU+ID0gW107XHJcbiAgICBsYXN0SGlzdG9yeU5vZGU6IEhpc3RvcnlOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBuZXh0Tm9kZUlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhZ2UgKHVybCwgdGl0bGUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5wYWdlc1t1cmxdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1t1cmxdID0gbmV3IFBhZ2UodXJsLCB0aXRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnBhZ2VzW3VybF07XHJcbiAgICAgICAgY29uc3QgaGlzdG9yeU5vZGU6IEhpc3RvcnlOb2RlID0gbmV3IEhpc3RvcnlOb2RlKHBhZ2UsIHRoaXMubGFzdEhpc3RvcnlOb2RlLCB0aGlzLm5leHROb2RlSWQpO1xyXG4gICAgICAgIHRoaXMubmV4dE5vZGVJZCArPSAxO1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RIaXN0b3J5Tm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RIaXN0b3J5Tm9kZS5uZXh0ID0gaGlzdG9yeU5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGFzdEhpc3RvcnlOb2RlID0gaGlzdG9yeU5vZGU7XHJcbiAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKGhpc3RvcnlOb2RlKTtcclxuICAgICAgICAvLyBhZGQgc3VnZ2VzdGlvbnMgYXN5bmNocm9ub3VzbHlcclxuICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiBbJ3d3dy5nb29nbGUuY29tJywgJ3d3dy5zdGFja292ZXJmbG93LmNvbScsICd3aWtpcGVkaWEub3JnJ10pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRTdWdnZXN0aW9uKGhpc3RvcnlOb2RlLCB1cmwsIHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMudG9KU09OKCkpO1xyXG4gICAgICAgIHRoaXMuZnJvbUpTT04odGhpcy50b0pTT04oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkU3VnZ2VzdGlvbihhbmNob3IsIHVybCwgdGl0bGUpIHtcclxuICAgICAgICBpZiAodGhpcy5wYWdlc1t1cmxdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1t1cmxdID0gbmV3IFBhZ2UodXJsLCB0aXRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnBhZ2VzW3VybF07XHJcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbk5vZGU6IFN1Z2dlc3Rpb25Ob2RlID0gbmV3IFN1Z2dlc3Rpb25Ob2RlKHBhZ2UsIGFuY2hvciwgdGhpcy5uZXh0Tm9kZUlkKTtcclxuICAgICAgICB0aGlzLm5leHROb2RlSWQgKz0gMTtcclxuICAgICAgICBhbmNob3Iuc3VnZ2VzdGlvbnMucHVzaChzdWdnZXN0aW9uTm9kZSk7XHJcbiAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKHN1Z2dlc3Rpb25Ob2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVOb2RlKGlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBub2RlOiBhbnkgPSB0aGlzLm5vZGVzLmZpbHRlcihuID0+IG4uaWQgPT09IGlkKVswXTtcclxuICAgICAgICBpZiAobm9kZS5pc1N1Z2dlc3Rpb24pIHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IG5vZGUuYW5jaG9yO1xyXG4gICAgICAgICAgICBkZWxldGUgYS5zdWdnZXN0aW9uc1thLnN1Z2dlc3Rpb25zLmluZGV4T2Yobm9kZSldO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnByZXYgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub2RlLm5leHQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUubmV4dC5wcmV2ID0gbm9kZS5wcmV2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RIaXN0b3J5Tm9kZSA9PT0gbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGlzdG9yeU5vZGUgPSBub2RlLnByZXY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZS5zdWdnZXN0aW9ucy5mb3JFYWNoKHN1Z2dlc3Rpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMubm9kZXNbdGhpcy5ub2Rlcy5pbmRleE9mKHN1Z2dlc3Rpb24pXTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMubm9kZXMuZmlsdGVyKG4gPT4gbi5pZCAhPT0gaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlR3JhcGgoKToge25vZGVzOiB7W2lkOiBzdHJpbmddOiBHcmFwaE5vZGV9LCBsaW5rczogR3JhcGhMaW5rW119IHtcclxuICAgICAgICBjb25zdCBsaW5rczogR3JhcGhMaW5rW10gPSBbXTtcclxuICAgICAgICBjb25zdCBub2Rlczoge1tpZDogc3RyaW5nXTogR3JhcGhOb2RlfSA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaCgobm9kZTogYW55LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGluazogR3JhcGhMaW5rIHwgbnVsbCA9IG5vZGUuZ2V0TGluaygpO1xyXG4gICAgICAgICAgICBpZiAobGluayAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbGlua3MucHVzaChsaW5rKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2Rlc1tub2RlLmlkXSA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IG5vZGUucGFnZSxcclxuICAgICAgICAgICAgICAgIGlkOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgcHJldklkOiAobm9kZS5pc1N1Z2dlc3Rpb24/IG51bGw6IChub2RlLnByZXYgPT09IG51bGw/IG51bGw6IG5vZGUucHJldi5pZCkpLFxyXG4gICAgICAgICAgICAgICAgYW5jaG9ySWQ6IG5vZGUuaXNTdWdnZXN0aW9uPyBub2RlLmFuY2hvci5pZDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGlzU3VnZ2VzdGlvbjogbm9kZS5pc1N1Z2dlc3Rpb24sXHJcbiAgICAgICAgICAgICAgICB4OiBpICogNTAgLSAyNSAqICh0aGlzLm5vZGVzLmxlbmd0aCksXHJcbiAgICAgICAgICAgICAgICB5OiAwLFxyXG4gICAgICAgICAgICAgICAgdng6IDAsXHJcbiAgICAgICAgICAgICAgICB2eTogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4ge25vZGVzOiBub2RlcywgbGlua3M6IGxpbmtzfVxyXG4gICAgfVxyXG5cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5ub2Rlcy5tYXAoKG5vZGU6IGFueSkgPT4gKHtcclxuICAgICAgICAgICAgZGF0YTogbm9kZS5wYWdlLFxyXG4gICAgICAgICAgICBpZDogbm9kZS5pZCxcclxuICAgICAgICAgICAgaXNTdWdnZXN0aW9uOiBub2RlLmlzU3VnZ2VzdGlvbixcclxuICAgICAgICAgICAgc3VnZ2VzdGlvbnM6IG5vZGUuaXNTdWdnZXN0aW9uPyBudWxsOiBub2RlLnN1Z2dlc3Rpb25zLm1hcChuID0+IG4uaWQpLFxyXG4gICAgICAgICAgICBuZXh0OiBub2RlLmlzU3VnZ2VzdGlvbj8gbnVsbDogKG5vZGUubmV4dCA9PT0gbnVsbD8gbnVsbDogbm9kZS5uZXh0LmlkKSxcclxuICAgICAgICAgICAgcHJldjogbm9kZS5pc1N1Z2dlc3Rpb24/IG51bGw6IChub2RlLnByZXYgPT09IG51bGw/IG51bGw6IG5vZGUucHJldi5pZCksXHJcbiAgICAgICAgICAgIGFuY2hvcjogbm9kZS5pc1N1Z2dlc3Rpb24/IG5vZGUuYW5jaG9yLmlkOiBudWxsXHJcbiAgICAgICAgfSkpKTtcclxuICAgIH1cclxuXHJcbiAgICBmcm9tSlNPTihqc29uKSB7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgICAgIGlmIChub2Rlcy5pbmRleE9mKG51bGwpICE9PSAtMSkgY29uc29sZS5sb2coJ0VSUk9SIE5VTEwnKTtcclxuICAgICAgICBjb25zdCBub2RlRGljdCA9IHt9O1xyXG4gICAgICAgIGNvbnN0IGhpc3RvcnlOb2RlcyA9IG5vZGVzLmZpbHRlcigobjogYW55KSA9PiAhbi5pc1N1Z2dlc3Rpb24pO1xyXG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Ob2RlcyA9IG5vZGVzLmZpbHRlcigobjogYW55KSA9PiBuLmlzU3VnZ2VzdGlvbik7XHJcbiAgICAgICAgbm9kZXMuZm9yRWFjaCgobjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNbbi5kYXRhLnVybF0gPSBuLmRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dE5vZGVJZCA9IE1hdGgubWF4KHRoaXMubmV4dE5vZGVJZCwgbi5pZCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBoaXN0b3J5Tm9kZXMuZm9yRWFjaCgobjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld05vZGUgPSBuZXcgSGlzdG9yeU5vZGUobi5kYXRhLCBudWxsLCBuLmlkKTtcclxuICAgICAgICAgICAgbm9kZURpY3Rbbi5pZF0gPSBuZXdOb2RlO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaGlzdG9yeU5vZGVzLmZvckVhY2goKG46IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobi5uZXh0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlRGljdFtuLmlkXS5uZXh0ID0gbm9kZURpY3Rbbi5uZXh0XTtcclxuICAgICAgICAgICAgICAgIG5vZGVEaWN0W24ubmV4dF0ucHJldiA9IG5vZGVEaWN0W24uaWRdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGlzdG9yeU5vZGUgPSBub2RlRGljdFtuLmlkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobi5wcmV2ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlRGljdFtuLmlkXS5wcmV2ID0gbm9kZURpY3Rbbi5wcmV2XTtcclxuICAgICAgICAgICAgICAgIG5vZGVEaWN0W24ucHJldl0ubmV4dCA9IG5vZGVEaWN0W24uaWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBzdWdnZXN0aW9uTm9kZXMuZm9yRWFjaCgobjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld05vZGUgPSBuZXcgU3VnZ2VzdGlvbk5vZGUodGhpcy5wYWdlc1tuLmRhdGEudXJsXSwgbm9kZURpY3Rbbi5hbmNob3JdLCBuLmlkKTtcclxuICAgICAgICAgICAgbm9kZURpY3Rbbi5pZF0gPSBuZXdOb2RlO1xyXG4gICAgICAgICAgICBub2RlRGljdFtuLmFuY2hvcl0uc3VnZ2VzdGlvbnMucHVzaChub2RlRGljdFtuLmlkXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdOT0RFUycsIE9iamVjdC5rZXlzKG5vZGVEaWN0KS5tYXAobiA9PiBub2RlRGljdFtuXSkpO1xyXG4gICAgICAgIHRoaXMubm9kZXMgPSAgT2JqZWN0LmtleXMobm9kZURpY3QpLm1hcChuID0+IG5vZGVEaWN0W25dKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeUdyYXBoXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9IaXN0b3J5R3JhcGgudHMiLCJpbXBvcnQgUGFnZSBmcm9tICcuL1BhZ2UnO1xyXG5pbXBvcnQgU3VnZ2VzdGlvbk5vZGUgZnJvbSAnLi9TdWdnZXN0aW9uTm9kZSc7XHJcbmltcG9ydCBHcmFwaExpbmsgZnJvbSAnLi9HcmFwaExpbmsnO1xyXG5cclxuY2xhc3MgSGlzdG9yeU5vZGUge1xyXG4gICAgcGFnZTogUGFnZTtcclxuICAgIHByZXY6IEhpc3RvcnlOb2RlIHwgbnVsbDtcclxuICAgIG5leHQ6IEhpc3RvcnlOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBzdWdnZXN0aW9uczogU3VnZ2VzdGlvbk5vZGVbXTtcclxuICAgIGlzU3VnZ2VzdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgaWQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYWdlLCBwcmV2LCBpZCkge1xyXG4gICAgICAgIHRoaXMucGFnZSA9IHBhZ2U7XHJcbiAgICAgICAgdGhpcy5wcmV2ID0gcHJldjtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5zdWdnZXN0aW9ucyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExpbmsoKTogR3JhcGhMaW5rIHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJldiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnByZXYuaWQsXHJcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5pZFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeU5vZGVcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0hpc3RvcnlOb2RlLnRzIiwiaW1wb3J0IFBhZ2UgZnJvbSAnLi9QYWdlJztcclxuaW1wb3J0IEhpc3RvcnlOb2RlIGZyb20gJy4vSGlzdG9yeU5vZGUnO1xyXG5pbXBvcnQgR3JhcGhMaW5rIGZyb20gJy4vR3JhcGhMaW5rJztcclxuXHJcbmNsYXNzIFN1Z2dlc3Rpb25Ob2RlIHtcclxuICAgIHBhZ2U6IFBhZ2U7XHJcbiAgICBhbmNob3I6IEhpc3RvcnlOb2RlO1xyXG4gICAgaXNTdWdnZXN0aW9uOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGlkOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFnZSwgYW5jaG9yLCBpZCkge1xyXG4gICAgICAgIHRoaXMucGFnZSA9IHBhZ2U7XHJcbiAgICAgICAgdGhpcy5hbmNob3IgPSBhbmNob3I7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExpbmsoKTogR3JhcGhMaW5rIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuYW5jaG9yLmlkLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMuaWRcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFN1Z2dlc3Rpb25Ob2RlXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdWdnZXN0aW9uTm9kZS50c3giLCJjbGFzcyBQYWdlIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHRpdGxlKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYWdlO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGFnZS50c3giXSwic291cmNlUm9vdCI6IiJ9