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
/******/ 	return __webpack_require__(__webpack_require__.s = 998);
/******/ })
/************************************************************************/
/******/ ({

/***/ 998:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2IzOWQxZjkyN2RhMmZjMTVlNWQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50UGFnZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3ZEQSxJQUFJLEtBQUssR0FBdUIsRUFBRSxDQUFDO0FBQ25DLElBQUksS0FBSyxHQUFzRSxFQUFFLENBQUM7QUFFbEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUVuQixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ2xDLFVBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtRQUNqQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0QixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0QixVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzFCO1NBQU0sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUNyQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0QixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0QixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZCO1NBQU0sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLGtCQUFrQixFQUFFO0tBQy9DO0lBQ0QsWUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDakMsQ0FBQyxDQUFDLENBQUM7QUFFSCxpQkFBaUIsQ0FBUztJQUN4QixJQUFNLENBQUMsR0FBcUI7UUFDeEIsSUFBSSxFQUFFO1lBQ0YsSUFBSSxFQUFFLFVBQVUsR0FBRyxDQUFDO1NBQ3ZCO1FBQ0QsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNO1FBQ25CLFlBQVksRUFBRSxLQUFLO1FBQ25CLElBQUksRUFBRSxJQUFJO1FBQ1YsV0FBVyxFQUFFLENBQUMsZUFBZSxHQUFHLENBQUMsRUFBRSxtQkFBbUIsR0FBRyxDQUFDLEVBQUUsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUM3RSxFQUFFLEVBQUUsQ0FBQztRQUNMLEVBQUUsRUFBRSxDQUFDO1FBQ0wsQ0FBQyxFQUFFLENBQUM7UUFDSixDQUFDLEVBQUUsQ0FBQztLQUNQO0lBQ0QsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNsQixJQUFNLFFBQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxRQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRTtRQUNuQixDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQU0sQ0FBQyxDQUFDO1FBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUM1RDtJQUNELEtBQUssSUFBSSxlQUFlLEdBQUcsQ0FBQyxFQUFFLGVBQWUsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsRUFBRTtRQUNyRixJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2xELElBQU0sY0FBYyxHQUFxQjtZQUNyQyxJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxFQUFFLFVBQVU7YUFDbkI7WUFDRCxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDbkIsWUFBWSxFQUFFLElBQUk7WUFDbEIsSUFBSSxFQUFFLElBQUk7WUFDVixXQUFXLEVBQUUsRUFBRTtZQUNmLEVBQUUsRUFBRSxDQUFDO1lBQ0wsRUFBRSxFQUFFLENBQUM7WUFDTCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztTQUMzQztRQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUM7S0FDbkQ7SUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLENBQUM7QUFFRCxvQkFBb0IsQ0FBQztJQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBQyxJQUFJLFFBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUEzQixDQUEyQixDQUFDLENBQUM7SUFDOUQsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQU0sSUFBSyxRQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUF4RSxDQUF3RSxDQUFDLENBQUM7NEJBQ3ZHLFVBQVU7UUFDbkIsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFNLElBQUssUUFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUExQixDQUEwQixDQUFDLENBQUM7UUFDakUsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFNLElBQUssUUFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUF0RSxDQUFzRSxDQUFDLENBQUM7SUFDbkgsQ0FBQztJQUhELEtBQXlCLFVBQWEsRUFBYixNQUFDLENBQUMsV0FBVyxFQUFiLGNBQWEsRUFBYixJQUFhO1FBQWpDLElBQU0sVUFBVTtnQkFBVixVQUFVO0tBR3BCO0lBQ0QsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQU0sSUFBSyxRQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBN0QsQ0FBNkQsQ0FBQyxDQUFDO0lBQzlHLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDekIsSUFBTSxHQUFHLEdBQXFCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDbEIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUNuQixJQUFNLE9BQU8sR0FDVCxFQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBQztZQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFCO0tBQ0o7SUFDRCxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQ2pCLEtBQUssR0FBRyxRQUFRLENBQUM7QUFDbkIsQ0FBQztBQUVELGdDQUFnQztBQUNoQyxnQkFBZ0I7QUFDaEIsSUFBSTtBQUdKLHFCQUFxQixLQUFLLEVBQUUsV0FBVztJQUNuQyxJQUFNLENBQUMsR0FBcUI7UUFDeEIsSUFBSSxFQUFFO1lBQ0YsSUFBSSxFQUFFLEtBQUs7U0FDZDtRQUNELEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTTtRQUNuQixZQUFZLEVBQUUsS0FBSztRQUNuQixJQUFJLEVBQUUsSUFBSTtRQUNWLFdBQVcsRUFBRSxXQUFXO1FBQ3hCLEVBQUUsRUFBRSxDQUFDO1FBQ0wsRUFBRSxFQUFFLENBQUM7UUFDTCxDQUFDLEVBQUUsQ0FBQztRQUNKLENBQUMsRUFBRSxDQUFDO0tBQ1A7SUFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2xCLElBQU0sUUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLFFBQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFO1FBQ25CLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBTSxDQUFDLENBQUM7UUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsS0FBSyxJQUFJLGVBQWUsR0FBRyxDQUFDLEVBQUUsZUFBZSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxFQUFFO1FBQ3JGLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbEQsSUFBTSxjQUFjLEdBQXFCO1lBQ3JDLElBQUksRUFBRTtnQkFDRixJQUFJLEVBQUUsVUFBVTthQUNuQjtZQUNELEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNuQixZQUFZLEVBQUUsSUFBSTtZQUNsQixJQUFJLEVBQUUsSUFBSTtZQUNWLFdBQVcsRUFBRSxFQUFFO1lBQ2YsRUFBRSxFQUFFLENBQUM7WUFDTCxFQUFFLEVBQUUsQ0FBQztZQUNMLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNOLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQztLQUNuRDtJQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEIsQ0FBQztBQUlILE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFDLEdBQUc7SUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHO0lBQ2xELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbEIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUV0QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRXhDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxVQUFVO1FBQUUsT0FBTztJQUUxQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ25FLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEdBQUcsZUFBZSxFQUFFLEtBQUssR0FBRyxjQUFjLEVBQUUsS0FBSyxHQUFHLGNBQWMsQ0FBQyxDQUFDO0tBQ2hHO0FBQ0wsQ0FBQyxDQUFDIiwiZmlsZSI6ImV2ZW50UGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDk5OCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgY2IzOWQxZjkyN2RhMmZjMTVlNWQiLCJpbXBvcnQgSGlzdG9yeUdyYXBoTm9kZSBmcm9tICcuL0hpc3RvcnlHcmFwaE5vZGUnO1xuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xuaW1wb3J0IHsgU2ltdWxhdGlvbk5vZGVEYXR1bSB9IGZyb20gJ2QzJztcblxuXG5cbmxldCBub2RlczogSGlzdG9yeUdyYXBoTm9kZVtdID0gW107XG5sZXQgbGlua3M6IEFycmF5PHtzb3VyY2U6IFNpbXVsYXRpb25Ob2RlRGF0dW0sIHRhcmdldDogU2ltdWxhdGlvbk5vZGVEYXR1bX0+ID0gW107XG5cbmNvbnNvbGUubG9nKG5vZGVzKTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKFxuICBmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpO1xuICAgIGlmIChyZXF1ZXN0LnR5cGUgPT09ICdkZWxldGVOb2RlJykge1xuICAgICAgbm9kZXMgPSByZXF1ZXN0Lm5vZGVzO1xuICAgICAgbGlua3MgPSByZXF1ZXN0LmxpbmtzO1xuICAgICAgZGVsZXRlTm9kZShyZXF1ZXN0LmRhdGEpO1xuICAgIH0gZWxzZSBpZiAocmVxdWVzdC50eXBlID09PSBcImFkZE5vZGVcIikge1xuICAgICAgbm9kZXMgPSByZXF1ZXN0Lm5vZGVzO1xuICAgICAgbGlua3MgPSByZXF1ZXN0LmxpbmtzO1xuICAgICAgYWRkTm9kZShyZXF1ZXN0LmRhdGEpO1xuICAgIH0gZWxzZSBpZiAocmVxdWVzdC50eXBlID09PSBcImdldE5vZGVzQW5kTGlua3NcIikge1xuICAgIH1cbiAgICBzZW5kUmVzcG9uc2UoW25vZGVzLCBsaW5rc10pO1xufSk7XG5cbmZ1bmN0aW9uIGFkZE5vZGUoaTogbnVtYmVyKSB7XG4gIGNvbnN0IG46IEhpc3RvcnlHcmFwaE5vZGUgPSB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgICAgbmFtZTogJ1dlYnNpdGUgJyArIGlcbiAgICAgIH0sXG4gICAgICBpbmRleDogbm9kZXMubGVuZ3RoLFxuICAgICAgaXNTdWdnZXN0aW9uOiBmYWxzZSxcbiAgICAgIG5leHQ6IG51bGwsXG4gICAgICBzdWdnZXN0aW9uczogWyd3aWtpcGVkaWEuY29tJyArIGksICdzdGFja292ZXJmbG93LmNvbScgKyBpLCAnZ29vZ2xlLmNvbScgKyBpXSxcbiAgICAgIHZ4OiAwLFxuICAgICAgdnk6IDAsXG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgfVxuICBpZiAobm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XG4gICAgICBwYXJlbnQubmV4dCA9IG47XG4gICAgICBuLnggPSBwYXJlbnQueCArIDQwXG4gICAgICBuLnkgPSBwYXJlbnQueVxuICAgICAgbGlua3MucHVzaCh7c291cmNlOiBub2Rlc1tub2Rlcy5sZW5ndGggLSAxXSwgdGFyZ2V0OiBufSk7XG4gIH1cbiAgZm9yIChsZXQgc3VnZ2VzdGlvbkluZGV4ID0gMDsgc3VnZ2VzdGlvbkluZGV4IDwgbi5zdWdnZXN0aW9ucy5sZW5ndGg7IHN1Z2dlc3Rpb25JbmRleCsrKSB7XG4gICAgICBjb25zdCBzdWdnZXN0aW9uID0gbi5zdWdnZXN0aW9uc1tzdWdnZXN0aW9uSW5kZXhdO1xuICAgICAgY29uc3Qgc3VnZ2VzdGlvbk5vZGU6IEhpc3RvcnlHcmFwaE5vZGUgPSB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBuYW1lOiBzdWdnZXN0aW9uXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpbmRleDogbm9kZXMubGVuZ3RoLFxuICAgICAgICAgIGlzU3VnZ2VzdGlvbjogdHJ1ZSxcbiAgICAgICAgICBuZXh0OiBudWxsLFxuICAgICAgICAgIHN1Z2dlc3Rpb25zOiBbXSxcbiAgICAgICAgICB2eDogMCxcbiAgICAgICAgICB2eTogMCxcbiAgICAgICAgICB4OiBuLngsXG4gICAgICAgICAgeTogbi55IC0gMjAgKyA0MCAqIChzdWdnZXN0aW9uSW5kZXggJSAyKSxcbiAgICAgIH1cbiAgICAgIG5vZGVzLnB1c2goc3VnZ2VzdGlvbk5vZGUpO1xuICAgICAgbGlua3MucHVzaCh7c291cmNlOiBuLCB0YXJnZXQ6IHN1Z2dlc3Rpb25Ob2RlfSk7XG4gIH1cbiAgbm9kZXMucHVzaChuKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlTm9kZShkKSB7XG4gICAgY29uc29sZS5sb2coZCk7XG4gIGxldCBuZXdOb2RlcyA9IG5vZGVzLmZpbHRlcih4ID0+IHguZGF0YS5uYW1lICE9PSBkLmRhdGEubmFtZSk7XG4gIGxldCBuZXdMaW5rcyA9IGxpbmtzLmZpbHRlcigoeDogYW55KSA9PiB4LnNvdXJjZS5kYXRhLm5hbWUgIT09IGQuZGF0YS5uYW1lICYmIHgudGFyZ2V0LmRhdGEubmFtZSAhPT0gZC5kYXRhLm5hbWUpO1xuICBmb3IgKGNvbnN0IHN1Z2dlc3Rpb24gb2YgZC5zdWdnZXN0aW9ucykge1xuICAgIG5ld05vZGVzID0gbmV3Tm9kZXMuZmlsdGVyKCh4OiBhbnkpID0+IHguZGF0YS5uYW1lICE9PSBzdWdnZXN0aW9uKTtcbiAgICAgIG5ld0xpbmtzID0gbmV3TGlua3MuZmlsdGVyKCh4OiBhbnkpID0+IHguc291cmNlLmRhdGEubmFtZSAhPT0gc3VnZ2VzdGlvbiAmJiB4LnRhcmdldC5kYXRhLm5hbWUgIT09IHN1Z2dlc3Rpb24pO1xuICB9XG4gIGNvbnN0IHBhcmVudExpc3QgPSBuZXdOb2Rlcy5maWx0ZXIoKHg6IGFueSkgPT4gKCh4Lm5leHQgIT09IG51bGwpID8geC5uZXh0LmRhdGEubmFtZSA6IG51bGwpID09PSBkLmRhdGEubmFtZSk7XG4gIGlmIChwYXJlbnRMaXN0Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgY29uc3QgcGFyOiBIaXN0b3J5R3JhcGhOb2RlID0gcGFyZW50TGlzdFswXTtcbiAgICAgIHBhci5uZXh0ID0gZC5uZXh0O1xuICAgICAgaWYgKHBhci5uZXh0ICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgbmV3TGluazoge3NvdXJjZTogSGlzdG9yeUdyYXBoTm9kZSwgdGFyZ2V0OiBIaXN0b3J5R3JhcGhOb2RlfSA9XG4gICAgICAgICAgICAgIHtzb3VyY2U6IHBhcmVudExpc3RbMF0sIHRhcmdldDogcGFyLm5leHR9O1xuICAgICAgICAgIG5ld0xpbmtzLnB1c2gobmV3TGluayk7XG4gICAgICB9XG4gIH1cbiAgbm9kZXMgPSBuZXdOb2RlcztcbiAgbGlua3MgPSBuZXdMaW5rcztcbn1cblxuLy8gZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbi8vICAgYWRkTm9kZShpKTtcbi8vIH1cblxuXG5mdW5jdGlvbiBhZGRQYWdlTm9kZSh0aXRsZSwgc3VnZ2VzdGlvbnMpIHtcbiAgICBjb25zdCBuOiBIaXN0b3J5R3JhcGhOb2RlID0ge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBuYW1lOiB0aXRsZVxuICAgICAgICB9LFxuICAgICAgICBpbmRleDogbm9kZXMubGVuZ3RoLFxuICAgICAgICBpc1N1Z2dlc3Rpb246IGZhbHNlLFxuICAgICAgICBuZXh0OiBudWxsLFxuICAgICAgICBzdWdnZXN0aW9uczogc3VnZ2VzdGlvbnMsXG4gICAgICAgIHZ4OiAwLFxuICAgICAgICB2eTogMCxcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICB9XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIHBhcmVudC5uZXh0ID0gbjtcbiAgICAgICAgbi54ID0gcGFyZW50LnggKyA0MFxuICAgICAgICBuLnkgPSBwYXJlbnQueVxuICAgICAgICBsaW5rcy5wdXNoKHtzb3VyY2U6IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdLCB0YXJnZXQ6IG59KTtcbiAgICB9XG4gICAgZm9yIChsZXQgc3VnZ2VzdGlvbkluZGV4ID0gMDsgc3VnZ2VzdGlvbkluZGV4IDwgbi5zdWdnZXN0aW9ucy5sZW5ndGg7IHN1Z2dlc3Rpb25JbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb24gPSBuLnN1Z2dlc3Rpb25zW3N1Z2dlc3Rpb25JbmRleF07XG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Ob2RlOiBIaXN0b3J5R3JhcGhOb2RlID0ge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6IHN1Z2dlc3Rpb25cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmRleDogbm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgaXNTdWdnZXN0aW9uOiB0cnVlLFxuICAgICAgICAgICAgbmV4dDogbnVsbCxcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zOiBbXSxcbiAgICAgICAgICAgIHZ4OiAwLFxuICAgICAgICAgICAgdnk6IDAsXG4gICAgICAgICAgICB4OiBuLngsXG4gICAgICAgICAgICB5OiBuLnkgLSAyMCArIDQwICogKHN1Z2dlc3Rpb25JbmRleCAlIDIpLFxuICAgICAgICB9XG4gICAgICAgIG5vZGVzLnB1c2goc3VnZ2VzdGlvbk5vZGUpO1xuICAgICAgICBsaW5rcy5wdXNoKHtzb3VyY2U6IG4sIHRhcmdldDogc3VnZ2VzdGlvbk5vZGV9KTtcbiAgICB9XG4gICAgbm9kZXMucHVzaChuKTtcbiAgfVxuICBcblxuXG5jaHJvbWUudGFicy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIoKHRhYikgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdvcGVuZWQgdGFiOicsIHRhYik7XG59KVxuICBcbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQsIHRhYkluZm8sIHRhYikgPT4ge1xuICAgIGxldCB1cmwgPSB0YWIudXJsO1xuICAgIGxldCB0aXRsZSA9IHRhYi50aXRsZTtcblxuICAgIGNvbnNvbGUubG9nKCd1cmwnLCB1cmwsICd0aXRsZScsIHRpdGxlKTtcblxuICAgIGlmICh0YWJJbmZvLnN0YXR1cyAhPT0gJ2NvbXBsZXRlJykgcmV0dXJuO1xuXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCB0aXRsZSAhPT0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV0uZGF0YS5uYW1lKSB7XG4gICAgICAgIGFkZFBhZ2VOb2RlKHRpdGxlLCBbdGl0bGUgKyAnIHN1Z2dlc3Rpb24gMScsIHRpdGxlICsgJ3N1Z2dlc3Rpb24gMicsIHRpdGxlICsgJ3N1Z2dlc3Rpb24gMyddKVxuICAgIH1cbn0pXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXZlbnRQYWdlLnRzeCJdLCJzb3VyY2VSb290IjoiIn0=