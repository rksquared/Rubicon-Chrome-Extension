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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmUzYjcyZjcwMjQ5NWYxYTMzNzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50UGFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3hEQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBQyxHQUFHO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRztJQUNwRCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2xCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFFdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFFRixJQUFJLEtBQUssR0FBdUIsRUFBRSxDQUFDO0FBQ25DLElBQU0sS0FBSyxHQUFzRSxFQUFFLENBQUM7QUFDcEYsT0FBTyxDQUFD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Q0FBQyxDQUFDO0tBQUE7QUFDMUMsQ0FBQztBQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDMUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ1oiLCJmaWxlIjoiZXZlbnRQYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNTM2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiZTNiNzJmNzAyNDk1ZjFhMzM3NCIsImltcG9ydCBIaXN0b3J5R3JhcGhOb2RlIGZyb20gJy4vSGlzdG9yeUdyYXBoTm9kZSc7XHJcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcclxuaW1wb3J0IHsgU2ltdWxhdGlvbk5vZGVEYXR1bSB9IGZyb20gJ2QzJztcclxuXHJcblxyXG5jaHJvbWUudGFicy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIoKHRhYikgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdvcGVuZWQgdGFiOicsIHRhYik7XHJcbn0pXHJcblxyXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCB0YWJJbmZvLCB0YWIpID0+IHtcclxuICBsZXQgdXJsID0gdGFiLnVybDtcclxuICBsZXQgdGl0bGUgPSB0YWIudGl0bGU7XHJcblxyXG4gIGNvbnNvbGUubG9nKCd1cmwnLCB1cmwsICd0aXRsZScsIHRpdGxlKTtcclxufSlcclxuXHJcbmxldCBub2RlczogSGlzdG9yeUdyYXBoTm9kZVtdID0gW107XHJcbmNvbnN0IGxpbmtzOiBBcnJheTx7c291cmNlOiBTaW11bGF0aW9uTm9kZURhdHVtLCB0YXJnZXQ6IFNpbXVsYXRpb25Ob2RlRGF0dW19PiA9IFtdO1xyXG5jb25zb2xlLmxvZygnQUFBQUFBQUFBJylcclxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKFxyXG4gIGZ1bmN0aW9uKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhyZXF1ZXN0KTtcclxuICAgIGlmIChyZXF1ZXN0LnR5cGUgPT09ICdkZWxldGVOb2RlJykge1xyXG4gICAgICBub2RlcyA9IHJlcXVlc3Qubm9kZXM7XHJcbiAgICAgIGRlbGV0ZU5vZGUocmVxdWVzdC5kYXRhKTtcclxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC50eXBlID09PSBcImFkZE5vZGVcIikge1xyXG4gICAgICBub2RlcyA9IHJlcXVlc3Qubm9kZXM7XHJcbiAgICAgIGFkZE5vZGUocmVxdWVzdC5kYXRhKTtcclxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC50eXBlID09PSBcImdldE5vZGVzQW5kTGlua3NcIikge1xyXG4gICAgfVxyXG4gICAgc2VuZFJlc3BvbnNlKFtub2RlcywgbGlua3NdKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBhZGROb2RlKGk6IG51bWJlcikge1xyXG4gIGNvbnN0IG46IEhpc3RvcnlHcmFwaE5vZGUgPSB7XHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIG5hbWU6ICdXZWJzaXRlICcgKyBpXHJcbiAgICAgIH0sXHJcbiAgICAgIGluZGV4OiBub2Rlcy5sZW5ndGgsXHJcbiAgICAgIGlzU3VnZ2VzdGlvbjogZmFsc2UsXHJcbiAgICAgIG5leHQ6IG51bGwsXHJcbiAgICAgIHN1Z2dlc3Rpb25zOiBbJ3dpa2lwZWRpYS5jb20nICsgaSwgJ3N0YWNrb3ZlcmZsb3cuY29tJyArIGksICdnb29nbGUuY29tJyArIGldLFxyXG4gICAgICB2eDogMCxcclxuICAgICAgdnk6IDAsXHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDAsXHJcbiAgfVxyXG4gIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICBwYXJlbnQubmV4dCA9IG47XHJcbiAgICAgIG4ueCA9IHBhcmVudC54ICsgNDBcclxuICAgICAgbi55ID0gcGFyZW50LnlcclxuICAgICAgbGlua3MucHVzaCh7c291cmNlOiBub2Rlc1tub2Rlcy5sZW5ndGggLSAxXSwgdGFyZ2V0OiBufSk7XHJcbiAgfVxyXG4gIGZvciAobGV0IHN1Z2dlc3Rpb25JbmRleCA9IDA7IHN1Z2dlc3Rpb25JbmRleCA8IG4uc3VnZ2VzdGlvbnMubGVuZ3RoOyBzdWdnZXN0aW9uSW5kZXgrKykge1xyXG4gICAgICBjb25zdCBzdWdnZXN0aW9uID0gbi5zdWdnZXN0aW9uc1tzdWdnZXN0aW9uSW5kZXhdO1xyXG4gICAgICBjb25zdCBzdWdnZXN0aW9uTm9kZTogSGlzdG9yeUdyYXBoTm9kZSA9IHtcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdWdnZXN0aW9uXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaW5kZXg6IG5vZGVzLmxlbmd0aCxcclxuICAgICAgICAgIGlzU3VnZ2VzdGlvbjogdHJ1ZSxcclxuICAgICAgICAgIG5leHQ6IG51bGwsXHJcbiAgICAgICAgICBzdWdnZXN0aW9uczogW10sXHJcbiAgICAgICAgICB2eDogMCxcclxuICAgICAgICAgIHZ5OiAwLFxyXG4gICAgICAgICAgeDogbi54LFxyXG4gICAgICAgICAgeTogbi55IC0gMjAgKyA0MCAqIChzdWdnZXN0aW9uSW5kZXggJSAyKSxcclxuICAgICAgfVxyXG4gICAgICBub2Rlcy5wdXNoKHN1Z2dlc3Rpb25Ob2RlKTtcclxuICAgICAgbGlua3MucHVzaCh7c291cmNlOiBuLCB0YXJnZXQ6IHN1Z2dlc3Rpb25Ob2RlfSk7XHJcbiAgfVxyXG4gIG5vZGVzLnB1c2gobik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbHRlckluUGxhY2UoYSwgY29uZGl0aW9uKSB7XHJcbiAgbGV0IGkgPSAwLCBqID0gMDtcclxuXHJcbiAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xyXG4gICAgY29uc3QgdmFsID0gYVtpXTtcclxuICAgIGlmIChjb25kaXRpb24odmFsLCBpLCBhKSkgYVtqKytdID0gdmFsO1xyXG4gICAgaSsrO1xyXG4gIH1cclxuXHJcbiAgYS5sZW5ndGggPSBqO1xyXG4gIHJldHVybiBhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWxldGVOb2RlKGQpIHtcclxuICBsZXQgbmV3Tm9kZXMgPSBub2Rlcy5maWx0ZXIoeCA9PiB4LmluZGV4ICE9PSBkLmluZGV4KTtcclxuICBsZXQgbmV3TGlua3MgPSBsaW5rcy5maWx0ZXIoeCA9PiB4LnNvdXJjZS5pbmRleCAhPT0gZC5pbmRleCAmJiB4LnRhcmdldC5pbmRleCAhPT0gZC5pbmRleCk7XHJcbiAgZm9yIChjb25zdCBzdWdnZXN0aW9uIG9mIGQuc3VnZ2VzdGlvbnMpIHtcclxuICAgIG5ld05vZGVzID0gbmV3Tm9kZXMuZmlsdGVyKCh4OiBhbnkpID0+IHguZGF0YS5uYW1lICE9PSBzdWdnZXN0aW9uKTtcclxuICAgICAgbmV3TGlua3MgPSBuZXdMaW5rcy5maWx0ZXIoKHg6IGFueSkgPT4geC5zb3VyY2UuZGF0YS5uYW1lICE9PSBzdWdnZXN0aW9uICYmIHgudGFyZ2V0LmRhdGEubmFtZSAhPT0gc3VnZ2VzdGlvbik7XHJcbiAgfVxyXG4gIGNvbnN0IHBhcmVudExpc3QgPSBuZXdOb2Rlcy5maWx0ZXIoKHg6IGFueSkgPT4geC5uZXh0ID09PSBkKTtcclxuICBpZiAocGFyZW50TGlzdC5sZW5ndGggIT09IDApIHtcclxuICAgICAgY29uc3QgcGFyOiBIaXN0b3J5R3JhcGhOb2RlID0gcGFyZW50TGlzdFswXTtcclxuICAgICAgcGFyLm5leHQgPSBkLm5leHQ7XHJcbiAgICAgIGlmIChwYXIubmV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgbmV3TGluazoge3NvdXJjZTogSGlzdG9yeUdyYXBoTm9kZSwgdGFyZ2V0OiBIaXN0b3J5R3JhcGhOb2RlfSA9XHJcbiAgICAgICAgICAgICAge3NvdXJjZTogcGFyZW50TGlzdFswXSwgdGFyZ2V0OiBwYXIubmV4dH07XHJcbiAgICAgICAgICBuZXdMaW5rcy5wdXNoKG5ld0xpbmspO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIHdoaWxlIChsaW5rcy5sZW5ndGgpIGxpbmtzLnBvcCgpO1xyXG4gIGZvciAoY29uc3QgbCBvZiBuZXdMaW5rcykgbGlua3MucHVzaChsKTtcclxuICB3aGlsZSAobm9kZXMubGVuZ3RoKSBub2Rlcy5wb3AoKTtcclxuICBmb3IgKGNvbnN0IG4gb2YgbmV3Tm9kZXMpIG5vZGVzLnB1c2gobik7XHJcbn1cclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgYWRkTm9kZShpKTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXZlbnRQYWdlLnRzeCJdLCJzb3VyY2VSb290IjoiIn0=