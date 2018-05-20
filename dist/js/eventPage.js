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
/******/ 	return __webpack_require__(__webpack_require__.s = 543);
/******/ })
/************************************************************************/
/******/ ({

/***/ 543:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var nodes = [];
var links = [];
console.log(nodes);
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
            index: 0,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDNiYjBjYWFmNjlkOGIyMTMxNGIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50UGFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3ZEQSxJQUFJLEtBQUssR0FBdUIsRUFBRSxDQUFDO0FBQ25DLElBQUksS0FBSyxHQUFzRSxFQUFFLENBQUM7QUFFbEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUVuQixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ2xDLFVBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtRQUNqQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0QixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0QixVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzFCO1NBQU0sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUNyQyxLQUFLLEdBQUcsT0FBTyxD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dEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV4QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssVUFBVTtRQUFFLE9BQU87SUFFMUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNuRSxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxHQUFHLGVBQWUsRUFBRSxLQUFLLEdBQUcsY0FBYyxFQUFFLEtBQUssR0FBRyxjQUFjLENBQUMsQ0FBQztLQUNoRztBQUNMLENBQUMsQ0FBQyIsImZpbGUiOiJldmVudFBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1NDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQzYmIwY2FhZjY5ZDhiMjEzMTRiIiwiaW1wb3J0IEhpc3RvcnlHcmFwaE5vZGUgZnJvbSAnLi9IaXN0b3J5R3JhcGhOb2RlJztcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgeyBTaW11bGF0aW9uTm9kZURhdHVtIH0gZnJvbSAnZDMnO1xyXG5cclxuXHJcblxyXG5sZXQgbm9kZXM6IEhpc3RvcnlHcmFwaE5vZGVbXSA9IFtdO1xyXG5sZXQgbGlua3M6IEFycmF5PHtzb3VyY2U6IFNpbXVsYXRpb25Ob2RlRGF0dW0sIHRhcmdldDogU2ltdWxhdGlvbk5vZGVEYXR1bX0+ID0gW107XHJcblxyXG5jb25zb2xlLmxvZyhub2Rlcyk7XHJcblxyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXHJcbiAgZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcclxuICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpO1xyXG4gICAgaWYgKHJlcXVlc3QudHlwZSA9PT0gJ2RlbGV0ZU5vZGUnKSB7XHJcbiAgICAgIG5vZGVzID0gcmVxdWVzdC5ub2RlcztcclxuICAgICAgbGlua3MgPSByZXF1ZXN0LmxpbmtzO1xyXG4gICAgICBkZWxldGVOb2RlKHJlcXVlc3QuZGF0YSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QudHlwZSA9PT0gXCJhZGROb2RlXCIpIHtcclxuICAgICAgbm9kZXMgPSByZXF1ZXN0Lm5vZGVzO1xyXG4gICAgICBsaW5rcyA9IHJlcXVlc3QubGlua3M7XHJcbiAgICAgIGFkZE5vZGUocmVxdWVzdC5kYXRhKTtcclxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC50eXBlID09PSBcImdldE5vZGVzQW5kTGlua3NcIikge1xyXG4gICAgfVxyXG4gICAgc2VuZFJlc3BvbnNlKFtub2RlcywgbGlua3NdKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBhZGROb2RlKGk6IG51bWJlcikge1xyXG4gIGNvbnN0IG46IEhpc3RvcnlHcmFwaE5vZGUgPSB7XHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIG5hbWU6ICdXZWJzaXRlICcgKyBpXHJcbiAgICAgIH0sXHJcbiAgICAgIGluZGV4OiBub2Rlcy5sZW5ndGgsXHJcbiAgICAgIGlzU3VnZ2VzdGlvbjogZmFsc2UsXHJcbiAgICAgIG5leHQ6IG51bGwsXHJcbiAgICAgIHN1Z2dlc3Rpb25zOiBbJ3dpa2lwZWRpYS5jb20nICsgaSwgJ3N0YWNrb3ZlcmZsb3cuY29tJyArIGksICdnb29nbGUuY29tJyArIGldLFxyXG4gICAgICB2eDogMCxcclxuICAgICAgdnk6IDAsXHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDAsXHJcbiAgfVxyXG4gIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICBwYXJlbnQubmV4dCA9IG47XHJcbiAgICAgIG4ueCA9IHBhcmVudC54ICsgNDBcclxuICAgICAgbi55ID0gcGFyZW50LnlcclxuICAgICAgbGlua3MucHVzaCh7c291cmNlOiBub2Rlc1tub2Rlcy5sZW5ndGggLSAxXSwgdGFyZ2V0OiBufSk7XHJcbiAgfVxyXG4gIGZvciAobGV0IHN1Z2dlc3Rpb25JbmRleCA9IDA7IHN1Z2dlc3Rpb25JbmRleCA8IG4uc3VnZ2VzdGlvbnMubGVuZ3RoOyBzdWdnZXN0aW9uSW5kZXgrKykge1xyXG4gICAgICBjb25zdCBzdWdnZXN0aW9uID0gbi5zdWdnZXN0aW9uc1tzdWdnZXN0aW9uSW5kZXhdO1xyXG4gICAgICBjb25zdCBzdWdnZXN0aW9uTm9kZTogSGlzdG9yeUdyYXBoTm9kZSA9IHtcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBuYW1lOiBzdWdnZXN0aW9uXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaW5kZXg6IDAsIC8vIG5vZGVzLmxlbmd0aCxcclxuICAgICAgICAgIGlzU3VnZ2VzdGlvbjogdHJ1ZSxcclxuICAgICAgICAgIG5leHQ6IG51bGwsXHJcbiAgICAgICAgICBzdWdnZXN0aW9uczogW10sXHJcbiAgICAgICAgICB2eDogMCxcclxuICAgICAgICAgIHZ5OiAwLFxyXG4gICAgICAgICAgeDogbi54LFxyXG4gICAgICAgICAgeTogbi55IC0gMjAgKyA0MCAqIChzdWdnZXN0aW9uSW5kZXggJSAyKSxcclxuICAgICAgfVxyXG4gICAgICBub2Rlcy5wdXNoKHN1Z2dlc3Rpb25Ob2RlKTtcclxuICAgICAgbGlua3MucHVzaCh7c291cmNlOiBuLCB0YXJnZXQ6IHN1Z2dlc3Rpb25Ob2RlfSk7XHJcbiAgfVxyXG4gIG5vZGVzLnB1c2gobik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlbGV0ZU5vZGUoZCkge1xyXG4gICAgY29uc29sZS5sb2coZCk7XHJcbiAgbGV0IG5ld05vZGVzID0gbm9kZXMuZmlsdGVyKHggPT4geC5kYXRhLm5hbWUgIT09IGQuZGF0YS5uYW1lKTtcclxuICBsZXQgbmV3TGlua3MgPSBsaW5rcy5maWx0ZXIoKHg6IGFueSkgPT4geC5zb3VyY2UuZGF0YS5uYW1lICE9PSBkLmRhdGEubmFtZSAmJiB4LnRhcmdldC5kYXRhLm5hbWUgIT09IGQuZGF0YS5uYW1lKTtcclxuICBmb3IgKGNvbnN0IHN1Z2dlc3Rpb24gb2YgZC5zdWdnZXN0aW9ucykge1xyXG4gICAgbmV3Tm9kZXMgPSBuZXdOb2Rlcy5maWx0ZXIoKHg6IGFueSkgPT4geC5kYXRhLm5hbWUgIT09IHN1Z2dlc3Rpb24pO1xyXG4gICAgICBuZXdMaW5rcyA9IG5ld0xpbmtzLmZpbHRlcigoeDogYW55KSA9PiB4LnNvdXJjZS5kYXRhLm5hbWUgIT09IHN1Z2dlc3Rpb24gJiYgeC50YXJnZXQuZGF0YS5uYW1lICE9PSBzdWdnZXN0aW9uKTtcclxuICB9XHJcbiAgY29uc3QgcGFyZW50TGlzdCA9IG5ld05vZGVzLmZpbHRlcigoeDogYW55KSA9PiAoKHgubmV4dCAhPT0gbnVsbCkgPyB4Lm5leHQuZGF0YS5uYW1lIDogbnVsbCkgPT09IGQuZGF0YS5uYW1lKTtcclxuICBpZiAocGFyZW50TGlzdC5sZW5ndGggIT09IDApIHtcclxuICAgICAgY29uc3QgcGFyOiBIaXN0b3J5R3JhcGhOb2RlID0gcGFyZW50TGlzdFswXTtcclxuICAgICAgcGFyLm5leHQgPSBkLm5leHQ7XHJcbiAgICAgIGlmIChwYXIubmV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgbmV3TGluazoge3NvdXJjZTogSGlzdG9yeUdyYXBoTm9kZSwgdGFyZ2V0OiBIaXN0b3J5R3JhcGhOb2RlfSA9XHJcbiAgICAgICAgICAgICAge3NvdXJjZTogcGFyZW50TGlzdFswXSwgdGFyZ2V0OiBwYXIubmV4dH07XHJcbiAgICAgICAgICBuZXdMaW5rcy5wdXNoKG5ld0xpbmspO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIG5vZGVzID0gbmV3Tm9kZXM7XHJcbiAgbGlua3MgPSBuZXdMaW5rcztcclxufVxyXG5cclxuLy8gZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuLy8gICBhZGROb2RlKGkpO1xyXG4vLyB9XHJcblxyXG5mdW5jdGlvbiBhZGRQYWdlTm9kZSh0aXRsZSwgc3VnZ2VzdGlvbnMpIHtcclxuICAgIGNvbnN0IG46IEhpc3RvcnlHcmFwaE5vZGUgPSB7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBuYW1lOiB0aXRsZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5kZXg6IG5vZGVzLmxlbmd0aCxcclxuICAgICAgICBpc1N1Z2dlc3Rpb246IGZhbHNlLFxyXG4gICAgICAgIG5leHQ6IG51bGwsXHJcbiAgICAgICAgc3VnZ2VzdGlvbnM6IHN1Z2dlc3Rpb25zLFxyXG4gICAgICAgIHZ4OiAwLFxyXG4gICAgICAgIHZ5OiAwLFxyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMCxcclxuICAgIH1cclxuICAgIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgcGFyZW50Lm5leHQgPSBuO1xyXG4gICAgICAgIG4ueCA9IHBhcmVudC54ICsgNDBcclxuICAgICAgICBuLnkgPSBwYXJlbnQueVxyXG4gICAgICAgIGxpbmtzLnB1c2goe3NvdXJjZTogbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV0sIHRhcmdldDogbn0pO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgc3VnZ2VzdGlvbkluZGV4ID0gMDsgc3VnZ2VzdGlvbkluZGV4IDwgbi5zdWdnZXN0aW9ucy5sZW5ndGg7IHN1Z2dlc3Rpb25JbmRleCsrKSB7XHJcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbiA9IG4uc3VnZ2VzdGlvbnNbc3VnZ2VzdGlvbkluZGV4XTtcclxuICAgICAgICBjb25zdCBzdWdnZXN0aW9uTm9kZTogSGlzdG9yeUdyYXBoTm9kZSA9IHtcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogc3VnZ2VzdGlvblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpbmRleDogbm9kZXMubGVuZ3RoLFxyXG4gICAgICAgICAgICBpc1N1Z2dlc3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgIG5leHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zOiBbXSxcclxuICAgICAgICAgICAgdng6IDAsXHJcbiAgICAgICAgICAgIHZ5OiAwLFxyXG4gICAgICAgICAgICB4OiBuLngsXHJcbiAgICAgICAgICAgIHk6IG4ueSAtIDIwICsgNDAgKiAoc3VnZ2VzdGlvbkluZGV4ICUgMiksXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGVzLnB1c2goc3VnZ2VzdGlvbk5vZGUpO1xyXG4gICAgICAgIGxpbmtzLnB1c2goe3NvdXJjZTogbiwgdGFyZ2V0OiBzdWdnZXN0aW9uTm9kZX0pO1xyXG4gICAgfVxyXG4gICAgbm9kZXMucHVzaChuKTtcclxuICB9XHJcbiAgXHJcblxyXG5cclxuY2hyb21lLnRhYnMub25DcmVhdGVkLmFkZExpc3RlbmVyKCh0YWIpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdvcGVuZWQgdGFiOicsIHRhYik7XHJcbn0pXHJcbiAgXHJcbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQsIHRhYkluZm8sIHRhYikgPT4ge1xyXG4gICAgbGV0IHVybCA9IHRhYi51cmw7XHJcbiAgICBsZXQgdGl0bGUgPSB0YWIudGl0bGU7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3VybCcsIHVybCwgJ3RpdGxlJywgdGl0bGUpO1xyXG5cclxuICAgIGlmICh0YWJJbmZvLnN0YXR1cyAhPT0gJ2NvbXBsZXRlJykgcmV0dXJuO1xyXG5cclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgdGl0bGUgIT09IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdLmRhdGEubmFtZSkge1xyXG4gICAgICAgIGFkZFBhZ2VOb2RlKHRpdGxlLCBbdGl0bGUgKyAnIHN1Z2dlc3Rpb24gMScsIHRpdGxlICsgJ3N1Z2dlc3Rpb24gMicsIHRpdGxlICsgJ3N1Z2dlc3Rpb24gMyddKVxyXG4gICAgfVxyXG59KVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXZlbnRQYWdlLnRzeCJdLCJzb3VyY2VSb290IjoiIn0=