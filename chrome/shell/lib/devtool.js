/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by godsong on 16/10/7.
	 */
	var panelsCreated = false;
	chrome.devtools.network.onNavigated.addListener(function () {
	    createPanel();
	});
	function createPanel() {
	    if (!panelsCreated) {
	        chrome.devtools.panels.create('Weex', '/icons/16.png', 'panel.html', function (panel) {
	            panelsCreated = true;
	            console.log(panel);
	        });
	    }
	}
	createPanel();

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmU2YmVjNWIzYjkxOTM5YTQ0ZTk/YmM2YyIsIndlYnBhY2s6Ly8vLi9zcmMvZGV2dG9vbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkNBLEtBQUksZ0JBQWMsS0FBbEI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsQ0FBd0IsV0FBeEIsQ0FBb0MsV0FBcEMsQ0FBZ0QsWUFBVztBQUN2RDtBQUNILEVBRkQ7QUFHQSxVQUFTLFdBQVQsR0FBc0I7QUFDbEIsU0FBRyxDQUFDLGFBQUosRUFBbUI7QUFDZixnQkFBTyxRQUFQLENBQWdCLE1BQWhCLENBQXVCLE1BQXZCLENBQThCLE1BQTlCLEVBQXNDLGVBQXRDLEVBQXVELFlBQXZELEVBQXFFLFVBQVUsS0FBVixFQUFpQjtBQUNsRiw2QkFBYyxJQUFkO0FBQ0EscUJBQVEsR0FBUixDQUFZLEtBQVo7QUFFSCxVQUpEO0FBS0g7QUFDSjtBQUNELGUiLCJmaWxlIjoiZGV2dG9vbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgYmU2YmVjNWIzYjkxOTM5YTQ0ZTlcbiAqKi8iLCIvKipcbiAqIENyZWF0ZWQgYnkgZ29kc29uZyBvbiAxNi8xMC83LlxuICovXG52YXIgcGFuZWxzQ3JlYXRlZD1mYWxzZTtcbmNocm9tZS5kZXZ0b29scy5uZXR3b3JrLm9uTmF2aWdhdGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uKCkge1xuICAgIGNyZWF0ZVBhbmVsKCk7XG59KTtcbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsKCl7XG4gICAgaWYoIXBhbmVsc0NyZWF0ZWQpIHtcbiAgICAgICAgY2hyb21lLmRldnRvb2xzLnBhbmVscy5jcmVhdGUoJ1dlZXgnLCAnL2ljb25zLzE2LnBuZycsICdwYW5lbC5odG1sJywgZnVuY3Rpb24gKHBhbmVsKSB7XG4gICAgICAgICAgICBwYW5lbHNDcmVhdGVkPXRydWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwYW5lbCk7XG5cbiAgICAgICAgfSlcbiAgICB9XG59XG5jcmVhdGVQYW5lbCgpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RldnRvb2wuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9