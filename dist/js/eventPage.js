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
/******/ 	return __webpack_require__(__webpack_require__.s = 536);
/******/ })
/************************************************************************/
/******/ ({

/***/ 536:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var nodes = [];
var links = [];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'deleteNode') {
        nodes = request.nodes;
        links = request.links;
        deleteNode(request.data);
    }
    else if (request.type === "addNode") {
        nodes = request.nodes;
        links = request.links;
        addNode(request.data);
    }
    else if (request.type === "getNodesAndLinks") {
    }
    sendResponse([nodes, links]);
});
function addNode(i) {
    var n = {
        data: {
            name: 'Website ' + i
        },
        index: nodes.length,
        isSuggestion: false,
        next: null,
        suggestions: ['wikipedia.com' + i, 'stackoverflow.com' + i, 'google.com' + i],
        vx: 0,
        vy: 0,
        x: 0,
        y: 0,
    };
    if (nodes.length > 0) {
        var parent_1 = nodes[nodes.length - 1];
        parent_1.next = n;
        n.x = parent_1.x + 40;
        n.y = parent_1.y;
        links.push({ source: nodes[nodes.length - 1], target: n });
    }
    for (var suggestionIndex = 0; suggestionIndex < n.suggestions.length; suggestionIndex++) {
        var suggestion = n.suggestions[suggestionIndex];
        var suggestionNode = {
            data: {
                name: suggestion
            },
            index: nodes.length,
            isSuggestion: true,
            next: null,
            suggestions: [],
            vx: 0,
            vy: 0,
            x: n.x,
            y: n.y - 20 + 40 * (suggestionIndex % 2),
        };
        nodes.push(suggestionNode);
        links.push({ source: n, target: suggestionNode });
    }
    nodes.push(n);
}
function deleteNode(d) {
    console.log(d);
    var newNodes = nodes.filter(function (x) { return x.data.name !== d.data.name; });
    var newLinks = links.filter(function (x) { return x.source.data.name !== d.data.name && x.target.data.name !== d.data.name; });
    var _loop_1 = function (suggestion) {
        newNodes = newNodes.filter(function (x) { return x.data.name !== suggestion; });
        newLinks = newLinks.filter(function (x) { return x.source.data.name !== suggestion && x.target.data.name !== suggestion; });
    };
    for (var _i = 0, _a = d.suggestions; _i < _a.length; _i++) {
        var suggestion = _a[_i];
        _loop_1(suggestion);
    }
    var parentList = newNodes.filter(function (x) { return ((x.next !== null) ? x.next.data.name : null) === d.data.name; });
    if (parentList.length !== 0) {
        var par = parentList[0];
        par.next = d.next;
        if (par.next !== null) {
            var newLink = { source: parentList[0], target: par.next };
            newLinks.push(newLink);
        }
    }
    nodes = newNodes;
    links = newLinks;
}
// for (let i = 0; i < 2; i++) {
//   addNode(i);
// }
function addPageNode(title, suggestions) {
    var n = {
        data: {
            name: title
        },
        index: nodes.length,
        isSuggestion: false,
        next: null,
        suggestions: suggestions,
        vx: 0,
        vy: 0,
        x: 0,
        y: 0,
    };
    if (nodes.length > 0) {
        var parent_2 = nodes[nodes.length - 1];
        parent_2.next = n;
        n.x = parent_2.x + 40;
        n.y = parent_2.y;
        links.push({ source: nodes[nodes.length - 1], target: n });
    }
    for (var suggestionIndex = 0; suggestionIndex < n.suggestions.length; suggestionIndex++) {
        var suggestion = n.suggestions[suggestionIndex];
        var suggestionNode = {
            data: {
                name: suggestion
            },
            index: nodes.length,
            isSuggestion: true,
            next: null,
            suggestions: [],
            vx: 0,
            vy: 0,
            x: n.x,
            y: n.y - 20 + 40 * (suggestionIndex % 2),
        };
        nodes.push(suggestionNode);
        links.push({ source: n, target: suggestionNode });
    }
    nodes.push(n);
}
chrome.tabs.onCreated.addListener(function (tab) {
    console.log('opened tab:', tab);
});
chrome.tabs.onUpdated.addListener(function (tabId, tabInfo, tab) {
    var url = tab.url;
    var title = tab.title;
    console.log('url', url, 'title', title);
    if (tabInfo.status !== 'complete')
        return;
    if (nodes.length === 0 || title !== nodes[nodes.length - 1].data.name) {
        addPageNode(title, [title + ' suggestion 1', title + 'suggestion 2', title + 'suggestion 3']);
    }
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWM4MjBkYzU0YzgyYjYzZWE5MzYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50UGFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3hEQSxJQUFJLEtBQUssR0FBdUIsRUFBRSxDQUFDO0FBQ25DLElBQUksS0FBSyxHQUFzRSxFQUFFLENBQUM7QUFFbEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUNsQyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFBWTtJQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUU7UUFDakMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdEIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdEIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxQjtTQUFNLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDckMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdEIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxL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QUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV4QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssVUFBVTtRQUFFLE9BQU87SUFFMUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNuRSxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxHQUFHLGVBQWUsRUFBRSxLQUFLLEdBQUcsY0FBYyxFQUFFLEtBQUssR0FBRyxjQUFjLENBQUMsQ0FBQztLQUNoRztBQUNMLENBQUMsQ0FBQyIsImZpbGUiOiJldmVudFBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1MzYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDljODIwZGM1NGM4MmI2M2VhOTM2IiwiaW1wb3J0IEhpc3RvcnlHcmFwaE5vZGUgZnJvbSAnLi9IaXN0b3J5R3JhcGhOb2RlJztcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgeyBTaW11bGF0aW9uTm9kZURhdHVtIH0gZnJvbSAnZDMnO1xyXG5cclxuXHJcbmxldCBub2RlczogSGlzdG9yeUdyYXBoTm9kZVtdID0gW107XHJcbmxldCBsaW5rczogQXJyYXk8e3NvdXJjZTogU2ltdWxhdGlvbk5vZGVEYXR1bSwgdGFyZ2V0OiBTaW11bGF0aW9uTm9kZURhdHVtfT4gPSBbXTtcclxuXHJcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcclxuICBmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xyXG4gICAgY29uc29sZS5sb2cocmVxdWVzdCk7XHJcbiAgICBpZiAocmVxdWVzdC50eXBlID09PSAnZGVsZXRlTm9kZScpIHtcclxuICAgICAgbm9kZXMgPSByZXF1ZXN0Lm5vZGVzO1xyXG4gICAgICBsaW5rcyA9IHJlcXVlc3QubGlua3M7XHJcbiAgICAgIGRlbGV0ZU5vZGUocmVxdWVzdC5kYXRhKTtcclxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC50eXBlID09PSBcImFkZE5vZGVcIikge1xyXG4gICAgICBub2RlcyA9IHJlcXVlc3Qubm9kZXM7XHJcbiAgICAgIGxpbmtzID0gcmVxdWVzdC5saW5rcztcclxuICAgICAgYWRkTm9kZShyZXF1ZXN0LmRhdGEpO1xyXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LnR5cGUgPT09IFwiZ2V0Tm9kZXNBbmRMaW5rc1wiKSB7XHJcbiAgICB9XHJcbiAgICBzZW5kUmVzcG9uc2UoW25vZGVzLCBsaW5rc10pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGFkZE5vZGUoaTogbnVtYmVyKSB7XHJcbiAgY29uc3QgbjogSGlzdG9yeUdyYXBoTm9kZSA9IHtcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgICAgbmFtZTogJ1dlYnNpdGUgJyArIGlcclxuICAgICAgfSxcclxuICAgICAgaW5kZXg6IG5vZGVzLmxlbmd0aCxcclxuICAgICAgaXNTdWdnZXN0aW9uOiBmYWxzZSxcclxuICAgICAgbmV4dDogbnVsbCxcclxuICAgICAgc3VnZ2VzdGlvbnM6IFsnd2lraXBlZGlhLmNvbScgKyBpLCAnc3RhY2tvdmVyZmxvdy5jb20nICsgaSwgJ2dvb2dsZS5jb20nICsgaV0sXHJcbiAgICAgIHZ4OiAwLFxyXG4gICAgICB2eTogMCxcclxuICAgICAgeDogMCxcclxuICAgICAgeTogMCxcclxuICB9XHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgcGFyZW50ID0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgIHBhcmVudC5uZXh0ID0gbjtcclxuICAgICAgbi54ID0gcGFyZW50LnggKyA0MFxyXG4gICAgICBuLnkgPSBwYXJlbnQueVxyXG4gICAgICBsaW5rcy5wdXNoKHtzb3VyY2U6IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdLCB0YXJnZXQ6IG59KTtcclxuICB9XHJcbiAgZm9yIChsZXQgc3VnZ2VzdGlvbkluZGV4ID0gMDsgc3VnZ2VzdGlvbkluZGV4IDwgbi5zdWdnZXN0aW9ucy5sZW5ndGg7IHN1Z2dlc3Rpb25JbmRleCsrKSB7XHJcbiAgICAgIGNvbnN0IHN1Z2dlc3Rpb24gPSBuLnN1Z2dlc3Rpb25zW3N1Z2dlc3Rpb25JbmRleF07XHJcbiAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Ob2RlOiBIaXN0b3J5R3JhcGhOb2RlID0ge1xyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHN1Z2dlc3Rpb25cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBpbmRleDogbm9kZXMubGVuZ3RoLFxyXG4gICAgICAgICAgaXNTdWdnZXN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgbmV4dDogbnVsbCxcclxuICAgICAgICAgIHN1Z2dlc3Rpb25zOiBbXSxcclxuICAgICAgICAgIHZ4OiAwLFxyXG4gICAgICAgICAgdnk6IDAsXHJcbiAgICAgICAgICB4OiBuLngsXHJcbiAgICAgICAgICB5OiBuLnkgLSAyMCArIDQwICogKHN1Z2dlc3Rpb25JbmRleCAlIDIpLFxyXG4gICAgICB9XHJcbiAgICAgIG5vZGVzLnB1c2goc3VnZ2VzdGlvbk5vZGUpO1xyXG4gICAgICBsaW5rcy5wdXNoKHtzb3VyY2U6IG4sIHRhcmdldDogc3VnZ2VzdGlvbk5vZGV9KTtcclxuICB9XHJcbiAgbm9kZXMucHVzaChuKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVsZXRlTm9kZShkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhkKTtcclxuICBsZXQgbmV3Tm9kZXMgPSBub2Rlcy5maWx0ZXIoeCA9PiB4LmRhdGEubmFtZSAhPT0gZC5kYXRhLm5hbWUpO1xyXG4gIGxldCBuZXdMaW5rcyA9IGxpbmtzLmZpbHRlcigoeDogYW55KSA9PiB4LnNvdXJjZS5kYXRhLm5hbWUgIT09IGQuZGF0YS5uYW1lICYmIHgudGFyZ2V0LmRhdGEubmFtZSAhPT0gZC5kYXRhLm5hbWUpO1xyXG4gIGZvciAoY29uc3Qgc3VnZ2VzdGlvbiBvZiBkLnN1Z2dlc3Rpb25zKSB7XHJcbiAgICBuZXdOb2RlcyA9IG5ld05vZGVzLmZpbHRlcigoeDogYW55KSA9PiB4LmRhdGEubmFtZSAhPT0gc3VnZ2VzdGlvbik7XHJcbiAgICAgIG5ld0xpbmtzID0gbmV3TGlua3MuZmlsdGVyKCh4OiBhbnkpID0+IHguc291cmNlLmRhdGEubmFtZSAhPT0gc3VnZ2VzdGlvbiAmJiB4LnRhcmdldC5kYXRhLm5hbWUgIT09IHN1Z2dlc3Rpb24pO1xyXG4gIH1cclxuICBjb25zdCBwYXJlbnRMaXN0ID0gbmV3Tm9kZXMuZmlsdGVyKCh4OiBhbnkpID0+ICgoeC5uZXh0ICE9PSBudWxsKSA/IHgubmV4dC5kYXRhLm5hbWUgOiBudWxsKSA9PT0gZC5kYXRhLm5hbWUpO1xyXG4gIGlmIChwYXJlbnRMaXN0Lmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICBjb25zdCBwYXI6IEhpc3RvcnlHcmFwaE5vZGUgPSBwYXJlbnRMaXN0WzBdO1xyXG4gICAgICBwYXIubmV4dCA9IGQubmV4dDtcclxuICAgICAgaWYgKHBhci5uZXh0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBjb25zdCBuZXdMaW5rOiB7c291cmNlOiBIaXN0b3J5R3JhcGhOb2RlLCB0YXJnZXQ6IEhpc3RvcnlHcmFwaE5vZGV9ID1cclxuICAgICAgICAgICAgICB7c291cmNlOiBwYXJlbnRMaXN0WzBdLCB0YXJnZXQ6IHBhci5uZXh0fTtcclxuICAgICAgICAgIG5ld0xpbmtzLnB1c2gobmV3TGluayk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgbm9kZXMgPSBuZXdOb2RlcztcclxuICBsaW5rcyA9IG5ld0xpbmtzO1xyXG59XHJcblxyXG4vLyBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4vLyAgIGFkZE5vZGUoaSk7XHJcbi8vIH1cclxuXHJcblxyXG5mdW5jdGlvbiBhZGRQYWdlTm9kZSh0aXRsZSwgc3VnZ2VzdGlvbnMpIHtcclxuICAgIGNvbnN0IG46IEhpc3RvcnlHcmFwaE5vZGUgPSB7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBuYW1lOiB0aXRsZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5kZXg6IG5vZGVzLmxlbmd0aCxcclxuICAgICAgICBpc1N1Z2dlc3Rpb246IGZhbHNlLFxyXG4gICAgICAgIG5leHQ6IG51bGwsXHJcbiAgICAgICAgc3VnZ2VzdGlvbnM6IHN1Z2dlc3Rpb25zLFxyXG4gICAgICAgIHZ4OiAwLFxyXG4gICAgICAgIHZ5OiAwLFxyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMCxcclxuICAgIH1cclxuICAgIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgcGFyZW50Lm5leHQgPSBuO1xyXG4gICAgICAgIG4ueCA9IHBhcmVudC54ICsgNDBcclxuICAgICAgICBuLnkgPSBwYXJlbnQueVxyXG4gICAgICAgIGxpbmtzLnB1c2goe3NvdXJjZTogbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV0sIHRhcmdldDogbn0pO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgc3VnZ2VzdGlvbkluZGV4ID0gMDsgc3VnZ2VzdGlvbkluZGV4IDwgbi5zdWdnZXN0aW9ucy5sZW5ndGg7IHN1Z2dlc3Rpb25JbmRleCsrKSB7XHJcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbiA9IG4uc3VnZ2VzdGlvbnNbc3VnZ2VzdGlvbkluZGV4XTtcclxuICAgICAgICBjb25zdCBzdWdnZXN0aW9uTm9kZTogSGlzdG9yeUdyYXBoTm9kZSA9IHtcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogc3VnZ2VzdGlvblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpbmRleDogbm9kZXMubGVuZ3RoLFxyXG4gICAgICAgICAgICBpc1N1Z2dlc3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgIG5leHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zOiBbXSxcclxuICAgICAgICAgICAgdng6IDAsXHJcbiAgICAgICAgICAgIHZ5OiAwLFxyXG4gICAgICAgICAgICB4OiBuLngsXHJcbiAgICAgICAgICAgIHk6IG4ueSAtIDIwICsgNDAgKiAoc3VnZ2VzdGlvbkluZGV4ICUgMiksXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGVzLnB1c2goc3VnZ2VzdGlvbk5vZGUpO1xyXG4gICAgICAgIGxpbmtzLnB1c2goe3NvdXJjZTogbiwgdGFyZ2V0OiBzdWdnZXN0aW9uTm9kZX0pO1xyXG4gICAgfVxyXG4gICAgbm9kZXMucHVzaChuKTtcclxuICB9XHJcbiAgXHJcblxyXG5cclxuY2hyb21lLnRhYnMub25DcmVhdGVkLmFkZExpc3RlbmVyKCh0YWIpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdvcGVuZWQgdGFiOicsIHRhYik7XHJcbn0pXHJcbiAgXHJcbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQsIHRhYkluZm8sIHRhYikgPT4ge1xyXG4gICAgbGV0IHVybCA9IHRhYi51cmw7XHJcbiAgICBsZXQgdGl0bGUgPSB0YWIudGl0bGU7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3VybCcsIHVybCwgJ3RpdGxlJywgdGl0bGUpO1xyXG5cclxuICAgIGlmICh0YWJJbmZvLnN0YXR1cyAhPT0gJ2NvbXBsZXRlJykgcmV0dXJuO1xyXG5cclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgdGl0bGUgIT09IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdLmRhdGEubmFtZSkge1xyXG4gICAgICAgIGFkZFBhZ2VOb2RlKHRpdGxlLCBbdGl0bGUgKyAnIHN1Z2dlc3Rpb24gMScsIHRpdGxlICsgJ3N1Z2dlc3Rpb24gMicsIHRpdGxlICsgJ3N1Z2dlc3Rpb24gMyddKVxyXG4gICAgfVxyXG59KVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXZlbnRQYWdlLnRzeCJdLCJzb3VyY2VSb290IjoiIn0=