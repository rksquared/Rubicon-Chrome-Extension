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
/******/ 	return __webpack_require__(__webpack_require__.s = 1609);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1609:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HistoryGraph_1 = __webpack_require__(1610);
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

/***/ 1610:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HistoryNode_1 = __webpack_require__(1611);
var SuggestionNode_1 = __webpack_require__(1612);
var Page_1 = __webpack_require__(1613);
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

/***/ 1611:
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

/***/ 1612:
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

/***/ 1613:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTcwNzNlOTZlMzQ5ZDMwMjdkN2IiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50UGFnZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL0hpc3RvcnlHcmFwaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSGlzdG9yeU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N1Z2dlc3Rpb25Ob2RlLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvUGFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3REQSwrQ0FBMEM7QUFFMUMsSUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFFeEMsc0RBQXNEO0FBRXRELHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFDekMsS0FBSztBQUNMLCtCQUErQjtBQUUvQixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ2xDLFVBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtRQUNqQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FB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TztZQUNILE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1NBQ2xCO0lBQ0wsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQztBQUVELGtCQUFlLGNBQWM7Ozs7Ozs7Ozs7O0FDeEI3QjtJQUlJLGNBQVksR0FBRyxFQUFFLEtBQUs7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDO0FBRUQsa0JBQWUsSUFBSSxDQUFDIiwiZmlsZSI6ImV2ZW50UGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE2MDkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDE3MDczZTk2ZTM0OWQzMDI3ZDdiIiwiaW1wb3J0IEhpc3RvcnlHcmFwaE5vZGUgZnJvbSAnLi9IaXN0b3J5R3JhcGhOb2RlJztcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcbmltcG9ydCB7IFNpbXVsYXRpb25Ob2RlRGF0dW0gfSBmcm9tICdkMyc7XG5pbXBvcnQgUGFnZSBmcm9tICcuL1BhZ2UnO1xuaW1wb3J0IEdyYXBoTGluayBmcm9tICcuL0dyYXBoTGluayc7XG5pbXBvcnQgR3JhcGhOb2RlIGZyb20gJy4vR3JhcGhOb2RlJztcbmltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuaW1wb3J0IEhpc3RvcnlHcmFwaCBmcm9tICcuL0hpc3RvcnlHcmFwaCc7XG5cbmNvbnN0IGhpc3RvcnlHcmFwaCA9IG5ldyBIaXN0b3J5R3JhcGgoKTtcblxuLy8gY29uc3Qgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovL2xvY2FsaG9zdDozMDA1Jyk7XG5cbi8vIHNvY2tldC5vbignZ3JhcGhEYXRhJywgKGRhdGEpID0+IHtcbi8vICAgY29uc29sZS5sb2coJ3VzZXIgY29ubmVjdGVkJywgZGF0YSk7XG4vLyB9KVxuLy8gc29ja2V0LmVtaXQoJ2V4dCcsICdoZWxsbycpO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXG4gIGZ1bmN0aW9uKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVxdWVzdCk7XG4gICAgaWYgKHJlcXVlc3QudHlwZSA9PT0gJ2RlbGV0ZU5vZGUnKSB7XG4gICAgICBoaXN0b3J5R3JhcGguZGVsZXRlTm9kZShyZXF1ZXN0LmlkKTtcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QudHlwZSA9PT0gXCJnZXROb2Rlc0FuZExpbmtzXCIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gaGlzdG9yeUdyYXBoLmdlbmVyYXRlR3JhcGgoKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHJlcyk7XG4gICAgfVxufSk7XG5cbmNocm9tZS50YWJzLm9uQ3JlYXRlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ29wZW5lZCB0YWI6JywgdGFiKTtcbn0pXG4gIFxuY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZCwgdGFiSW5mbywgdGFiKSA9PiB7XG4gICAgbGV0IHVybCA9IHRhYi51cmw7XG4gICAgbGV0IHRpdGxlID0gdGFiLnRpdGxlO1xuICAgIGNvbnNvbGUubG9nKCd0YWJzIHVwZGF0ZWQ6IHVybCcsIHVybCwgJ3RpdGxlJywgdGl0bGUpO1xuICAgIGlmICh0YWJJbmZvLnN0YXR1cyAhPT0gJ2NvbXBsZXRlJykgcmV0dXJuO1xuICAgIGhpc3RvcnlHcmFwaC5hZGRQYWdlKHVybCwgdGl0bGUpO1xufSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9ldmVudFBhZ2UudHN4IiwiaW1wb3J0IEdyYXBoTm9kZSBmcm9tICcuL0dyYXBoTm9kZSc7XG5pbXBvcnQgSGlzdG9yeU5vZGUgZnJvbSAnLi9IaXN0b3J5Tm9kZSc7XG5pbXBvcnQgU3VnZ2VzdGlvbk5vZGUgZnJvbSAnLi9TdWdnZXN0aW9uTm9kZSc7XG5pbXBvcnQgR3JhcGhMaW5rIGZyb20gJy4vR3JhcGhMaW5rJztcbmltcG9ydCBQYWdlIGZyb20gJy4vUGFnZSc7XG5cbmNsYXNzIEhpc3RvcnlHcmFwaCB7XG4gICAgcGFnZXM6IHtbdXJsOiBzdHJpbmddOiBQYWdlfSA9IHt9O1xuICAgIG5vZGVzOiBBcnJheTxIaXN0b3J5Tm9kZSB8IFN1Z2dlc3Rpb25Ob2RlPiA9IFtdO1xuICAgIGxhc3RIaXN0b3J5Tm9kZTogSGlzdG9yeU5vZGUgfCBudWxsID0gbnVsbDtcbiAgICBuZXh0Tm9kZUlkOiBudW1iZXIgPSAwO1xuICAgIG5leHRMaW5rSWQ6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBhZGRQYWdlICh1cmwsIHRpdGxlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBhZ2VzW3VybF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlc1t1cmxdID0gbmV3IFBhZ2UodXJsLCB0aXRsZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFnZSA9IHRoaXMucGFnZXNbdXJsXTtcbiAgICAgICAgY29uc3QgaGlzdG9yeU5vZGU6IEhpc3RvcnlOb2RlID0gbmV3IEhpc3RvcnlOb2RlKHBhZ2UsIHRoaXMubGFzdEhpc3RvcnlOb2RlLCB0aGlzLm5leHROb2RlSWQpO1xuICAgICAgICB0aGlzLm5leHROb2RlSWQgKz0gMTtcbiAgICAgICAgaWYgKHRoaXMubGFzdEhpc3RvcnlOb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RIaXN0b3J5Tm9kZS5uZXh0ID0gaGlzdG9yeU5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0SGlzdG9yeU5vZGUgPSBoaXN0b3J5Tm9kZTtcbiAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKGhpc3RvcnlOb2RlKTtcbiAgICAgICAgLy8gYWRkIHN1Z2dlc3Rpb25zIGFzeW5jaHJvbm91c2x5XG4gICAgICAgIGZvciAoY29uc3QgdXJsIG9mIFsnd3d3Lmdvb2dsZS5jb20nLCAnd3d3LnN0YWNrb3ZlcmZsb3cuY29tJywgJ3dpa2lwZWRpYS5vcmcnXSkge1xuICAgICAgICAgICAgdGhpcy5hZGRTdWdnZXN0aW9uKGhpc3RvcnlOb2RlLCB1cmwsIHVybCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRTdWdnZXN0aW9uKGFuY2hvciwgdXJsLCB0aXRsZSkge1xuICAgICAgICBpZiAodGhpcy5wYWdlc1t1cmxdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZXNbdXJsXSA9IG5ldyBQYWdlKHVybCwgdGl0bGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnBhZ2VzW3VybF07XG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Ob2RlOiBTdWdnZXN0aW9uTm9kZSA9IG5ldyBTdWdnZXN0aW9uTm9kZShwYWdlLCBhbmNob3IsIHRoaXMubmV4dE5vZGVJZCk7XG4gICAgICAgIHRoaXMubmV4dE5vZGVJZCArPSAxO1xuICAgICAgICBhbmNob3Iuc3VnZ2VzdGlvbnMucHVzaChzdWdnZXN0aW9uTm9kZSk7XG4gICAgICAgIHRoaXMubm9kZXMucHVzaChzdWdnZXN0aW9uTm9kZSk7XG4gICAgfVxuXG4gICAgZGVsZXRlTm9kZShpZDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vZGU6IGFueSA9IHRoaXMubm9kZXNbaWRdO1xuICAgICAgICBjb25zb2xlLmxvZygnREVMRVRJTkcnLCBpZCwgbm9kZSk7XG4gICAgICAgIGlmIChub2RlLmlzU3VnZ2VzdGlvbikge1xuICAgICAgICAgICAgY29uc3QgYSA9IG5vZGUuYW5jaG9yO1xuICAgICAgICAgICAgZGVsZXRlIGEuc3VnZ2VzdGlvbnNbKGEuc3VnZ2VzdGlvbnMuaW5kZXhPZihub2RlKSldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5vZGUucHJldiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUubmV4dCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5vZGUubmV4dC5wcmV2ID0gbm9kZS5wcmV2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdEhpc3RvcnlOb2RlID09PSBub2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SGlzdG9yeU5vZGUgPSBub2RlLnByZXY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLnN1Z2dlc3Rpb25zLmZvckVhY2goc3VnZ2VzdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMubm9kZXNbc3VnZ2VzdGlvbi5pZF07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLm5vZGVzW2lkXTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUdyYXBoKCk6IHtub2Rlczoge1tpZDogc3RyaW5nXTogR3JhcGhOb2RlfSwgbGlua3M6IEdyYXBoTGlua1tdfSB7XG4gICAgICAgIGNvbnN0IGxpbmtzOiBHcmFwaExpbmtbXSA9IFtdO1xuICAgICAgICBjb25zdCBub2Rlczoge1tpZDogc3RyaW5nXTogR3JhcGhOb2RlfSA9IHt9O1xuICAgICAgICB0aGlzLm5vZGVzLmZvckVhY2goKG5vZGU6IGFueSwgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5rOiBHcmFwaExpbmsgfCBudWxsID0gbm9kZS5nZXRMaW5rKCk7XG4gICAgICAgICAgICBpZiAobGluayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxpbmtzLnB1c2gobGluayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2Rlc1tub2RlLmlkXSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBub2RlLnBhZ2UsXG4gICAgICAgICAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJldklkOiAobm9kZS5pc1N1Z2dlc3Rpb24/IG51bGw6IChub2RlLnByZXYgPT09IG51bGw/IG51bGw6IG5vZGUucHJldi5pZCkpLFxuICAgICAgICAgICAgICAgIGFuY2hvcklkOiBub2RlLmlzU3VnZ2VzdGlvbj8gbm9kZS5hbmNob3IuaWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgaXNTdWdnZXN0aW9uOiBub2RlLmlzU3VnZ2VzdGlvbixcbiAgICAgICAgICAgICAgICB4OiBpICogNTAgLSAyNSAqICh0aGlzLm5vZGVzLmxlbmd0aCksXG4gICAgICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgICAgICB2eDogMCxcbiAgICAgICAgICAgICAgICB2eTogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4ge25vZGVzOiBub2RlcywgbGlua3M6IGxpbmtzfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeUdyYXBoXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSGlzdG9yeUdyYXBoLnRzIiwiaW1wb3J0IFBhZ2UgZnJvbSAnLi9QYWdlJztcbmltcG9ydCBTdWdnZXN0aW9uTm9kZSBmcm9tICcuL1N1Z2dlc3Rpb25Ob2RlJztcbmltcG9ydCBHcmFwaExpbmsgZnJvbSAnLi9HcmFwaExpbmsnO1xuXG5jbGFzcyBIaXN0b3J5Tm9kZSB7XG4gICAgcGFnZTogUGFnZTtcbiAgICBwcmV2OiBIaXN0b3J5Tm9kZSB8IG51bGw7XG4gICAgbmV4dDogSGlzdG9yeU5vZGUgfCBudWxsID0gbnVsbDtcbiAgICBzdWdnZXN0aW9uczogU3VnZ2VzdGlvbk5vZGVbXTtcbiAgICBpc1N1Z2dlc3Rpb246IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBpZDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocGFnZSwgcHJldiwgaWQpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gcGFnZTtcbiAgICAgICAgdGhpcy5wcmV2ID0gcHJldjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zID0gW107XG4gICAgfVxuXG4gICAgZ2V0TGluaygpOiBHcmFwaExpbmsgfCBudWxsIHtcbiAgICAgICAgaWYgKHRoaXMucHJldiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5wcmV2LmlkLFxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmlkXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhpc3RvcnlOb2RlXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSGlzdG9yeU5vZGUudHMiLCJpbXBvcnQgUGFnZSBmcm9tICcuL1BhZ2UnO1xuaW1wb3J0IEhpc3RvcnlOb2RlIGZyb20gJy4vSGlzdG9yeU5vZGUnO1xuaW1wb3J0IEdyYXBoTGluayBmcm9tICcuL0dyYXBoTGluayc7XG5cbmNsYXNzIFN1Z2dlc3Rpb25Ob2RlIHtcbiAgICBwYWdlOiBQYWdlO1xuICAgIGFuY2hvcjogSGlzdG9yeU5vZGU7XG4gICAgaXNTdWdnZXN0aW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgICBpZDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocGFnZSwgYW5jaG9yLCBpZCkge1xuICAgICAgICB0aGlzLnBhZ2UgPSBwYWdlO1xuICAgICAgICB0aGlzLmFuY2hvciA9IGFuY2hvcjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH1cblxuICAgIGdldExpbmsoKTogR3JhcGhMaW5rIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5hbmNob3IuaWQsXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMuaWRcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3VnZ2VzdGlvbk5vZGVcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdWdnZXN0aW9uTm9kZS50c3giLCJjbGFzcyBQYWdlIHtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHVybDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodXJsLCB0aXRsZSkge1xuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFnZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QYWdlLnRzeCJdLCJzb3VyY2VSb290IjoiIn0=