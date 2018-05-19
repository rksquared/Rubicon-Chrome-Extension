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
chrome.tabs.onCreated.addListener(function (tab) {
    console.log('opened tab:', tab);
});
chrome.tabs.onUpdated.addListener(function (tabId, tabInfo, tab) {
    var url = tab.url;
    var title = tab.title;
    console.log('url', url, 'title', title);
});
var nodes = [];
var links = [];
console.log('AAAAAAAAA');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'deleteNode') {
        nodes = request.nodes;
        deleteNode(request.data);
    }
    else if (request.type === "addNode") {
        nodes = request.nodes;
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
function filterInPlace(a, condition) {
    var i = 0, j = 0;
    while (i < a.length) {
        var val = a[i];
        if (condition(val, i, a))
            a[j++] = val;
        i++;
    }
    a.length = j;
    return a;
}
function deleteNode(d) {
    var newNodes = nodes.filter(function (x) { return x.index !== d.index; });
    var newLinks = links.filter(function (x) { return x.source.index !== d.index && x.target.index !== d.index; });
    var _loop_1 = function (suggestion) {
        newNodes = newNodes.filter(function (x) { return x.data.name !== suggestion; });
        newLinks = newLinks.filter(function (x) { return x.source.data.name !== suggestion && x.target.data.name !== suggestion; });
    };
    for (var _i = 0, _a = d.suggestions; _i < _a.length; _i++) {
        var suggestion = _a[_i];
        _loop_1(suggestion);
    }
    var parentList = newNodes.filter(function (x) { return x.next === d; });
    if (parentList.length !== 0) {
        var par = parentList[0];
        par.next = d.next;
        if (par.next !== null) {
            var newLink = { source: parentList[0], target: par.next };
            newLinks.push(newLink);
        }
    }
    while (links.length)
        links.pop();
    for (var _b = 0, newLinks_1 = newLinks; _b < newLinks_1.length; _b++) {
        var l = newLinks_1[_b];
        links.push(l);
    }
    while (nodes.length)
        nodes.pop();
    for (var _c = 0, newNodes_1 = newNodes; _c < newNodes_1.length; _c++) {
        var n = newNodes_1[_c];
        nodes.push(n);
    }
}
for (var i = 0; i < 2; i++) {
    addNode(i);
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWRjMjU4MmZmYjkyNzU3Yjk1YWYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50UGFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3hEQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBQyxHQUFHO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRztJQUNwRCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2xCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFFdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFFRixJQUFJLEtBQUssR0FBdUIsRUFBRSxDQUFDO0FBQ25DLElBQU0sS0FBSyxHQUFzRSxFQUFFLENBQUM7QUFDcEYsT0FBTyxDQUFD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Q0FBQyxDQUFDO0tBQUE7QUFDMUMsQ0FBQztBQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDMUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ1oiLCJmaWxlIjoiZXZlbnRQYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNTM2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5ZGMyNTgyZmZiOTI3NTdiOTVhZiIsImltcG9ydCBIaXN0b3J5R3JhcGhOb2RlIGZyb20gJy4vSGlzdG9yeUdyYXBoTm9kZSc7XG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XG5pbXBvcnQgeyBTaW11bGF0aW9uTm9kZURhdHVtIH0gZnJvbSAnZDMnO1xuXG5cbmNocm9tZS50YWJzLm9uQ3JlYXRlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdvcGVuZWQgdGFiOicsIHRhYik7XG59KVxuXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCB0YWJJbmZvLCB0YWIpID0+IHtcbiAgbGV0IHVybCA9IHRhYi51cmw7XG4gIGxldCB0aXRsZSA9IHRhYi50aXRsZTtcblxuICBjb25zb2xlLmxvZygndXJsJywgdXJsLCAndGl0bGUnLCB0aXRsZSk7XG59KVxuXG5sZXQgbm9kZXM6IEhpc3RvcnlHcmFwaE5vZGVbXSA9IFtdO1xuY29uc3QgbGlua3M6IEFycmF5PHtzb3VyY2U6IFNpbXVsYXRpb25Ob2RlRGF0dW0sIHRhcmdldDogU2ltdWxhdGlvbk5vZGVEYXR1bX0+ID0gW107XG5jb25zb2xlLmxvZygnQUFBQUFBQUFBJylcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcbiAgZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXF1ZXN0KTtcbiAgICBpZiAocmVxdWVzdC50eXBlID09PSAnZGVsZXRlTm9kZScpIHtcbiAgICAgIG5vZGVzID0gcmVxdWVzdC5ub2RlcztcbiAgICAgIGRlbGV0ZU5vZGUocmVxdWVzdC5kYXRhKTtcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QudHlwZSA9PT0gXCJhZGROb2RlXCIpIHtcbiAgICAgIG5vZGVzID0gcmVxdWVzdC5ub2RlcztcbiAgICAgIGFkZE5vZGUocmVxdWVzdC5kYXRhKTtcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QudHlwZSA9PT0gXCJnZXROb2Rlc0FuZExpbmtzXCIpIHtcbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlKFtub2RlcywgbGlua3NdKTtcbn0pO1xuXG5mdW5jdGlvbiBhZGROb2RlKGk6IG51bWJlcikge1xuICBjb25zdCBuOiBIaXN0b3J5R3JhcGhOb2RlID0ge1xuICAgICAgZGF0YToge1xuICAgICAgICAgIG5hbWU6ICdXZWJzaXRlICcgKyBpXG4gICAgICB9LFxuICAgICAgaW5kZXg6IG5vZGVzLmxlbmd0aCxcbiAgICAgIGlzU3VnZ2VzdGlvbjogZmFsc2UsXG4gICAgICBuZXh0OiBudWxsLFxuICAgICAgc3VnZ2VzdGlvbnM6IFsnd2lraXBlZGlhLmNvbScgKyBpLCAnc3RhY2tvdmVyZmxvdy5jb20nICsgaSwgJ2dvb2dsZS5jb20nICsgaV0sXG4gICAgICB2eDogMCxcbiAgICAgIHZ5OiAwLFxuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gIH1cbiAgaWYgKG5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdO1xuICAgICAgcGFyZW50Lm5leHQgPSBuO1xuICAgICAgbi54ID0gcGFyZW50LnggKyA0MFxuICAgICAgbi55ID0gcGFyZW50LnlcbiAgICAgIGxpbmtzLnB1c2goe3NvdXJjZTogbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV0sIHRhcmdldDogbn0pO1xuICB9XG4gIGZvciAobGV0IHN1Z2dlc3Rpb25JbmRleCA9IDA7IHN1Z2dlc3Rpb25JbmRleCA8IG4uc3VnZ2VzdGlvbnMubGVuZ3RoOyBzdWdnZXN0aW9uSW5kZXgrKykge1xuICAgICAgY29uc3Qgc3VnZ2VzdGlvbiA9IG4uc3VnZ2VzdGlvbnNbc3VnZ2VzdGlvbkluZGV4XTtcbiAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Ob2RlOiBIaXN0b3J5R3JhcGhOb2RlID0ge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbmFtZTogc3VnZ2VzdGlvblxuICAgICAgICAgIH0sXG4gICAgICAgICAgaW5kZXg6IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICBpc1N1Z2dlc3Rpb246IHRydWUsXG4gICAgICAgICAgbmV4dDogbnVsbCxcbiAgICAgICAgICBzdWdnZXN0aW9uczogW10sXG4gICAgICAgICAgdng6IDAsXG4gICAgICAgICAgdnk6IDAsXG4gICAgICAgICAgeDogbi54LFxuICAgICAgICAgIHk6IG4ueSAtIDIwICsgNDAgKiAoc3VnZ2VzdGlvbkluZGV4ICUgMiksXG4gICAgICB9XG4gICAgICBub2Rlcy5wdXNoKHN1Z2dlc3Rpb25Ob2RlKTtcbiAgICAgIGxpbmtzLnB1c2goe3NvdXJjZTogbiwgdGFyZ2V0OiBzdWdnZXN0aW9uTm9kZX0pO1xuICB9XG4gIG5vZGVzLnB1c2gobik7XG59XG5cbmZ1bmN0aW9uIGZpbHRlckluUGxhY2UoYSwgY29uZGl0aW9uKSB7XG4gIGxldCBpID0gMCwgaiA9IDA7XG5cbiAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbCA9IGFbaV07XG4gICAgaWYgKGNvbmRpdGlvbih2YWwsIGksIGEpKSBhW2orK10gPSB2YWw7XG4gICAgaSsrO1xuICB9XG5cbiAgYS5sZW5ndGggPSBqO1xuICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlTm9kZShkKSB7XG4gIGxldCBuZXdOb2RlcyA9IG5vZGVzLmZpbHRlcih4ID0+IHguaW5kZXggIT09IGQuaW5kZXgpO1xuICBsZXQgbmV3TGlua3MgPSBsaW5rcy5maWx0ZXIoeCA9PiB4LnNvdXJjZS5pbmRleCAhPT0gZC5pbmRleCAmJiB4LnRhcmdldC5pbmRleCAhPT0gZC5pbmRleCk7XG4gIGZvciAoY29uc3Qgc3VnZ2VzdGlvbiBvZiBkLnN1Z2dlc3Rpb25zKSB7XG4gICAgbmV3Tm9kZXMgPSBuZXdOb2Rlcy5maWx0ZXIoKHg6IGFueSkgPT4geC5kYXRhLm5hbWUgIT09IHN1Z2dlc3Rpb24pO1xuICAgICAgbmV3TGlua3MgPSBuZXdMaW5rcy5maWx0ZXIoKHg6IGFueSkgPT4geC5zb3VyY2UuZGF0YS5uYW1lICE9PSBzdWdnZXN0aW9uICYmIHgudGFyZ2V0LmRhdGEubmFtZSAhPT0gc3VnZ2VzdGlvbik7XG4gIH1cbiAgY29uc3QgcGFyZW50TGlzdCA9IG5ld05vZGVzLmZpbHRlcigoeDogYW55KSA9PiB4Lm5leHQgPT09IGQpO1xuICBpZiAocGFyZW50TGlzdC5sZW5ndGggIT09IDApIHtcbiAgICAgIGNvbnN0IHBhcjogSGlzdG9yeUdyYXBoTm9kZSA9IHBhcmVudExpc3RbMF07XG4gICAgICBwYXIubmV4dCA9IGQubmV4dDtcbiAgICAgIGlmIChwYXIubmV4dCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IG5ld0xpbms6IHtzb3VyY2U6IEhpc3RvcnlHcmFwaE5vZGUsIHRhcmdldDogSGlzdG9yeUdyYXBoTm9kZX0gPVxuICAgICAgICAgICAgICB7c291cmNlOiBwYXJlbnRMaXN0WzBdLCB0YXJnZXQ6IHBhci5uZXh0fTtcbiAgICAgICAgICBuZXdMaW5rcy5wdXNoKG5ld0xpbmspO1xuICAgICAgfVxuICB9XG4gIHdoaWxlIChsaW5rcy5sZW5ndGgpIGxpbmtzLnBvcCgpO1xuICBmb3IgKGNvbnN0IGwgb2YgbmV3TGlua3MpIGxpbmtzLnB1c2gobCk7XG4gIHdoaWxlIChub2Rlcy5sZW5ndGgpIG5vZGVzLnBvcCgpO1xuICBmb3IgKGNvbnN0IG4gb2YgbmV3Tm9kZXMpIG5vZGVzLnB1c2gobik7XG59XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gIGFkZE5vZGUoaSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXZlbnRQYWdlLnRzeCJdLCJzb3VyY2VSb290IjoiIn0=