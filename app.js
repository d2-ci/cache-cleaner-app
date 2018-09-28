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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	__webpack_require__(4);
	
	__webpack_require__(5);
	
	__webpack_require__(6);
	
	var _resources = __webpack_require__(10);
	
	var _resources2 = _interopRequireDefault(_resources);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	i18next.init({
	  returnEmptyString: false,
	  fallbackLng: false,
	  keySeparator: '|',
	  resources: _resources2.default
	});
	
	/* App Module */
	var cacheCleaner = angular.module('cacheCleaner', ['ui.bootstrap', 'ngRoute', 'ngCookies', 'ngSanitize', 'cacheCleanerDirectives', 'cacheCleanerControllers', 'cacheCleanerServices', 'cacheCleanerFilters', 'angularLocalStorage', 'jm.i18next']).value('DHIS2URL', '../api');

/***/ },
/* 2 */
/***/ function(module, exports) {

	/* global angular */
	
	'use strict';
	
	/* Services */
	
	var cacheCleanerServices = angular.module('cacheCleanerServices', ['ngResource']);
	
	cacheCleanerServices.service('idbStorageService', function ($window, $q) {
	
	    var indexedDB = $window.indexedDB;
	
	    var db = null;
	
	    var open = function open(dbName) {
	        var deferred = $q.defer();
	
	        var request = indexedDB.open(dbName);
	
	        request.onsuccess = function (e) {
	            db = e.target.result;
	            deferred.resolve();
	        };
	
	        request.onerror = function () {
	            deferred.reject();
	        };
	
	        return deferred.promise;
	    };
	
	    var dbExists = function dbExists(dbName) {
	
	        var deferred = $q.defer();
	
	        var request = indexedDB.open(dbName);
	
	        var existed = true;
	
	        request.onsuccess = function (e) {
	            request.result.close();
	
	            if (!existed) {
	                indexedDB.deleteDatabase(dbName);
	            }
	
	            deferred.resolve(existed);
	        };
	
	        request.onerror = function () {
	            deferred.reject();
	        };
	
	        request.onupgradeneeded = function () {
	            existed = false;
	        };
	
	        return deferred.promise;
	    };
	
	    var getObjectStores = function getObjectStores(dbName) {
	
	        var deferred = $q.defer();
	
	        var request = indexedDB.open(dbName);
	
	        request.onsuccess = function (e) {
	            var db = e.target.result;
	            deferred.resolve(db.objectStoreNames);
	        };
	
	        request.onerror = function () {
	            deferred.reject();
	        };
	        return deferred.promise;
	    };
	
	    var deleteDb = function deleteDb(dbName) {
	
	        var deferred = $q.defer();
	
	        var request = indexedDB.deleteDatabase(dbName);
	
	        request.onsuccess = function (e) {
	            deferred.resolve(true);
	        };
	
	        request.onerror = function (e) {
	            console.log('Error in deleting db: ', e);
	            deferred.resolve(false);
	        };
	        return deferred.promise;
	    };
	
	    return {
	        open: open,
	        deleteDb: deleteDb,
	        dbExists: dbExists,
	        getObjectStores: getObjectStores
	    };
	})
	/* Modal service for user interaction */
	.service('ModalService', ['$modal', function ($modal) {
	
	    var modalDefaults = {
	        backdrop: true,
	        keyboard: true,
	        modalFade: true,
	        templateUrl: 'views/modal.html'
	    };
	
	    var modalOptions = {
	        closeButtonText: 'Close',
	        actionButtonText: 'OK',
	        headerText: 'Proceed?',
	        bodyText: 'Perform this action?'
	    };
	
	    this.showModal = function (customModalDefaults, customModalOptions) {
	        if (!customModalDefaults) customModalDefaults = {};
	        customModalDefaults.backdrop = 'static';
	        return this.show(customModalDefaults, customModalOptions);
	    };
	
	    this.show = function (customModalDefaults, customModalOptions) {
	        //Create temp objects to work with since we're in a singleton service
	        var tempModalDefaults = {};
	        var tempModalOptions = {};
	
	        //Map angular-ui modal custom defaults to modal defaults defined in service
	        angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
	
	        //Map modal.html $scope custom properties to defaults defined in service
	        angular.extend(tempModalOptions, modalOptions, customModalOptions);
	
	        if (!tempModalDefaults.controller) {
	            tempModalDefaults.controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
	                $scope.modalOptions = tempModalOptions;
	                $scope.modalOptions.ok = function (result) {
	                    $modalInstance.close(result);
	                };
	                $scope.modalOptions.close = function (result) {
	                    $modalInstance.dismiss('cancel');
	                };
	            }];
	        }
	
	        return $modal.open(tempModalDefaults).result;
	    };
	}])
	/* service for wrapping sessionStorage '*/
	.service('SessionStorageService', function ($window) {
	    return {
	        get: function get(key) {
	            return JSON.parse($window.sessionStorage.getItem(key));
	        },
	        set: function set(key, obj) {
	            $window.sessionStorage.setItem(key, JSON.stringify(obj));
	        },
	        clearAll: function clearAll() {
	            for (var key in $window.sessionStorage) {
	                $window.sessionStorage.removeItem(key);
	            }
	        }
	    };
	}).factory('i18nLoader', function ($http, $q, SessionStorageService, DHIS2URL) {
	    return function () {
	        var promise;
	        var userSettings = SessionStorageService.get('USER_SETTING');
	        if (userSettings && userSettings.keyUiLocale) {
	            i18next.changeLanguage(userSettings.keyUiLocale);
	            promise = $q.when([]);
	        } else {
	            promise = $http.get(DHIS2URL + '/userSettings').then(function (response) {
	                if (response && response.data && response.data.keyUiLocale) {
	                    i18next.changeLanguage(response.data.keyUiLocale);
	                }
	            });
	        }
	        return promise;
	    };
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	/* Directives */
	
	var cacheCleanerDirectives = angular.module('cacheCleanerDirectives', []);

/***/ },
/* 4 */
/***/ function(module, exports) {

	/* global angular */
	
	'use strict';
	
	/* Controllers */
	
	var cacheCleanerControllers = angular.module('cacheCleanerControllers', [])
	
	//Controller for settings page
	.controller('MainController', function ($scope, storage, $window, idbStorageService, ModalService, i18nLoader) {
	
	    $scope.afterClearing = false;
	
	    var getItemsToClear = function getItemsToClear() {
	
	        $scope.lsCacheExists = false;
	        $scope.ssCacheExists = false;
	        $scope.idCacheExists = false;
	
	        $scope.lsKeys = [];
	        $scope.dbKeys = [];
	        $scope.ssKeys = [];
	
	        var reservedStorageKeys = ['key', 'getItem', 'setItem', 'removeItem', 'clear', 'length'];
	
	        for (var key in $window.sessionStorage) {
	            if (reservedStorageKeys.indexOf(key) === -1) {
	                $scope.ssKeys.push({ id: key, remove: false });
	                $scope.ssCacheExists = true;
	            }
	        }
	
	        for (var key in $window.localStorage) {
	            if (reservedStorageKeys.indexOf(key) === -1) {
	                $scope.lsKeys.push({ id: key, remove: false });
	                $scope.lsCacheExists = true;
	            }
	        }
	
	        var idxDBs = ['dhis2ou', 'dhis2', 'dhis2tc', 'dhis2ec', 'dhis2de', 'dhis2er'];
	        angular.forEach(idxDBs, function (db) {
	            idbStorageService.dbExists(db).then(function (res) {
	                if (res) {
	                    $scope.dbKeys.push({ id: db, remove: false });
	                    $scope.idCacheExists = true;
	                }
	            });
	        });
	    };
	
	    i18nLoader().then(function () {
	        getItemsToClear();
	    });
	
	    $scope.clearCache = function () {
	
	        ModalService.showModal({}).then(function () {
	
	            angular.forEach($scope.ssKeys, function (ssKey) {
	                if (ssKey.remove) {
	                    $window.sessionStorage.removeItem(ssKey.id);
	                    console.log('removed from session storage:  ', ssKey.id);
	                }
	            });
	
	            angular.forEach($scope.lsKeys, function (lsKey) {
	                if (lsKey.remove) {
	                    storage.remove(lsKey.id);
	                    console.log('removed from local storage:  ', lsKey.id);
	                }
	            });
	
	            angular.forEach($scope.dbKeys, function (dbKey) {
	                if (dbKey.remove) {
	                    idbStorageService.deleteDb(dbKey.id).then(function (res) {
	                        if (res) {
	                            console.log('removed from indexeddb:  ', dbKey.id);
	                        } else {
	                            console.log('failed to remove from indexeddb:  ', dbKey.id);
	                        }
	                    });
	                }
	            });
	            $scope.afterClearing = true;
	            getItemsToClear();
	        });
	    };
	
	    $scope.selectAll = function () {
	        angular.forEach($scope.ssKeys, function (ssKey) {
	            ssKey.remove = !ssKey.remove;
	        });
	
	        angular.forEach($scope.lsKeys, function (lsKey) {
	            lsKey.remove = !lsKey.remove;
	        });
	
	        angular.forEach($scope.dbKeys, function (dbKey) {
	            dbKey.remove = !dbKey.remove;
	        });
	    };
	});

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	/* Filters */
	
	var cacheCleanerFilters = angular.module('cacheCleanerFilters', []);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(8)();
	// imports
	
	
	// module
	exports.push([module.id, ".top-bar {\n    font-size: 16pt;\n    font-weight: normal;\n    color: #585D61;\n}\n\n.vertical-spacing{\n    margin-top: 20px;\n}\n\ntable\n{\n    font-size: 13px;\n    line-height: 24px;\n    table-layout: fixed;\n    margin-bottom: 10px;\n}\n\n.page {\n    width: 80%;\n    margin-left: auto;\n    margin-right: auto;\n    margin-top: 100px;\n}\n\ntd:nth-child(2) {\n    width: 10%;\n    text-align: center;\n}\n\nhtml {\n    font-size: 14px;\n}", ""]);
	
	// exports


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var i18nextResources = {
	  "ar": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "منظف ذاكرة التخزين المؤقت لمتصفح DHIS2",
	      "Session storage": "تخزين الجلسة",
	      "Local storage": "التخزين المحلي",
	      "indexedDB": "indexedDB",
	      "Clear": "مسح",
	      "Clearing cache": "جار تنظيف ذاكرة التخزين المؤقت",
	      "Are you sure you want to proceed with the cleaning?": "هل تريد بالتأكيد المتابعة في التنظيف؟",
	      "Cancel": "إلغاء",
	      "Proceed": "متابعة"
	    }
	  },
	  "ckb": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "باكردنةوةي زيادةي براوسيري دي اج اي اس 2",
	      "Session storage": "كوكردنةوي كويوونةوة",
	      "Local storage": "كؤكردنةوةي ناوخؤيي",
	      "indexedDB": "ثيوانة",
	      "Clear": "باك",
	      "Clearing cache": "باكردنةوةي زيادةكان",
	      "Are you sure you want to proceed with the cleaning?": "دلنايي ئةتةويت باكردنةوة ئةنجام بدةيت ؟ ",
	      "Cancel": "لابردن",
	      "Proceed": "ئةنجام دان"
	    }
	  },
	  "es": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "DHIS 2 limpiador de la caché del navegador",
	      "Session storage": "Almacenamiento de la sesión",
	      "Local storage": "Almacenamiento local",
	      "indexedDB": "BD indexada",
	      "Clear": "Limpiar",
	      "Clearing cache": "Borrando caché",
	      "Are you sure you want to proceed with the cleaning?": "¿Estás seguro de que quieres proseguir con el borrado?",
	      "Cancel": "Cancelar",
	      "Proceed": "Proceder"
	    }
	  },
	  "fr": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "Videur du cache navigateur DHIS2",
	      "Session storage": "Stockate de session",
	      "Local storage": "Stockage local",
	      "indexedDB": "IndexedDB",
	      "Clear": "Effacer",
	      "Clearing cache": "Vidange du cache",
	      "Are you sure you want to proceed with the cleaning?": "Êtes-vous sûr de vouloir procéder au nettoyage ?",
	      "Cancel": "Annuler",
	      "Proceed": "Poursuivre"
	    }
	  },
	  "id": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "DHIS 2 browser cache cleaner",
	      "Session storage": "Session Storage",
	      "Local storage": "Local Storage",
	      "indexedDB": "IndexedDB",
	      "Clear": "Hapus",
	      "Clearing cache": "Bersihkan cache",
	      "Are you sure you want to proceed with the cleaning?": "Apakah anda yakin untuk melanjutkan proses cleaning?",
	      "Cancel": "Batal",
	      "Proceed": "Lanjutkan"
	    }
	  },
	  "lo": {
	    "translation": {
	      "Home": "ໜ້າຫຼັກ",
	      "Profile": "ໂປຟາຍ",
	      "Apps": "ແອບ",
	      "More apps": "ແອບເພີ້ມເຕີມ",
	      "Search apps": "ຊອກຫາ",
	      "Settings": "ການຕັ້ງຄ່າ",
	      "Account": "ບັນຊີ",
	      "Log out": "ອອກຈາກລະບົບ",
	      "About DHIS 2": "ກ່ຽວກັບ DHIS 2",
	      "DHIS 2 browser cache cleaner": "ລ້າງຂໍ້ມູນຂອງ DHIS 2 ໃນເຄດລອງບາວເຊີ້",
	      "This clears the selected items from your browser cache": "ມັນຂະລ້າງຂໍ້ມູນໃນບາວເຊີ້ທັງໝົດ",
	      "Are you sure you want to proceed with the cleaning?": "ເຈົ້າຕ້ອງການລ້າງຂໍ້ມູນນີ້ອອກຈາກບາວເຊີ້ແທ້ບໍ?",
	      "Browser cache is cleared.": "ຂໍ້ມູນໃນບາວເຊີ້ຖືກລ້າງແລ້ວ",
	      "Browser cache is empty. Nothing to clear.": "ບໍ່ມີຂໍ້ມູນໃນຄວາມຈຳຂອງບາວເຊີ້",
	      "Clearing cache": "ລ້າງຂໍ້ມູນ",
	      "Proceed": "ດຳເນີນ",
	      "Select all": "ເລືອກທັງໝົດ",
	      "Unselect all": "ບໍ່ເລືອກທັງໝົດ",
	      "Cancel": "ຍົກເລີກ",
	      "Clear": "ລ້າງ"
	    }
	  },
	  "prs": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "پاک کننده حافظه بروزر DHIS 2",
	      "Session storage": "ذخیر کردن سیشن",
	      "Local storage": "ذخیره سازی داخلی",
	      "indexedDB": "IndexedDB",
	      "Clear": "پاک کردن",
	      "Clearing cache": "پاک سازی حافظه بروزر",
	      "Are you sure you want to proceed with the cleaning?": "آیا شما مطمین هستید با انجام پاک سازی؟",
	      "Cancel": "انصراف",
	      "Proceed": "اقدام کردن"
	    }
	  },
	  "ps": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "د DHIS 2 په لټوونکي کې د ثبت پاکوونکی ",
	      "Session storage": "د ناستې د جریان زېرمه کول",
	      "Local storage": "ځایي زېرمه کول",
	      "indexedDB": "په انټرنیټي جدول کې درجول (IndexedDB)",
	      "Clear": "پاک یې کړئ",
	      "Clearing cache": "ساتنځای د پاکولو په حال کې دی",
	      "Are you sure you want to proceed with the cleaning?": "آیا د پاکولو بهیر ته د دوام ورکولو په برخه کې ډاډه یاست؟",
	      "Cancel": "پاک یې کړئ",
	      "Proceed": "دوام ورکول"
	    }
	  },
	  "pt": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "Limpador do cache do navegador do DHIS 2",
	      "Session storage": "Armazenamento da sessão",
	      "Local storage": "Armazenamento local",
	      "indexedDB": "Base de dados indexada",
	      "Clear": "Limpar",
	      "Clearing cache": "Esvaziando o cache",
	      "Are you sure you want to proceed with the cleaning?": "Deseja prosseguir com a limpeza?",
	      "Cancel": "Cancelar",
	      "Proceed": "Prosseguir"
	    }
	  },
	  "sv": {
	    "translation": {
	      "Home": "Hem",
	      "DHIS 2": "DHIS2",
	      "DHIS 2 Home": "DHIS 2 Hem",
	      "Profile": "Profil",
	      "Apps": "Appar",
	      "More apps": "Mer appar",
	      "Search apps": "Sök appar",
	      "Settings": "Inst",
	      "Account": "Konto",
	      "Log out": "Logga ut",
	      "About DHIS 2": "Om DHIS 2",
	      "Session Storage": "Session lagring",
	      "Local Storage": "Lokal lagring",
	      "IndexedDB": "IndexedDB",
	      "DHIS 2 browser cache cleaner": "DHIS2 webbläsare cache rengörare",
	      "This clears selected items from your browser cache": "Detta rensar valda objekt från din webbläsarens cache",
	      "Are your sure you want to proceed with the cleaning?": "Är du säkert du vil forstätta med rensning?",
	      "Browser cache is cleared.": "Webbläsarens cache har rensats.",
	      "Browser cache is empty. Nothing to clear.": "Webbläsarens cache är tomt. Inget att rensa.",
	      "Clearing cache": "Rensa cacheminnet",
	      "Proceed": "Fortsätta",
	      "Select all": "Välj alla",
	      "Unselect all": "Ta bort alla",
	      "Cancel": "Annulera",
	      "Clear": "Ta bort"
	    }
	  },
	  "ur": {
	    "translation": {
	      "DHIS 2 browser cache cleaner": "DHIS 2 براؤزر کیش کلینر",
	      "Session storage": "سیشن اسٹوریج",
	      "Local storage": "مقامی ذخیرہ",
	      "indexedDB": "انڈیکس شدہ ڈی بی",
	      "Clear": "واضح کریں",
	      "Clearing cache": "صاف کرنے کیشے",
	      "Are you sure you want to proceed with the cleaning?": "کیا آپ واقعی صفائی کے ساتھ آگے بڑھنا چاہتے ہیں؟",
	      "Cancel": "منسوخ کریں",
	      "Proceed": "آگے بڑھو"
	    }
	  },
	  "vi": {
	    "translation": {
	      "Home": "Trang chủ",
	      "DHIS 2": "DHIS 2",
	      "DHIS 2 Home": "Trang chủ DHIS 2",
	      "Profile": "Hồ sơ",
	      "Apps": "Ứng dụng",
	      "More apps": "Thêm ứng dụng",
	      "Search apps": "Tìm ứng dụng",
	      "Settings": "Cài đặt",
	      "Account": "Tài khoản",
	      "Log out": "Đăng xuất",
	      "About DHIS 2": "Giới thiệu về DHIS2",
	      "Session storage": "Lưu trữ phiên",
	      "Local storage": "Lưu trữ cục bộ",
	      "IndexedDB": "Chỉ mục cơ sở dữ liệu",
	      "DHIS 2 browser cache cleaner": "Trình xóa dữ liệu cục bộ trong DHIS 2",
	      "This clears the selected items from your browser cache": "Xóa dữ liệu trong các mục đã chọn",
	      "Are you sure you want to proceed with the cleaning?": "Bạn có chắc chắn muốn thực thi việc xóa dữ liệu cục bộ?",
	      "Browser cache is cleared.": "Dữ liệu cục bộ đã được xóa",
	      "Browser cache is empty. Nothing to clear.": "Trình duyệt không có dữ liệu cục bộ. Không có gì để xóa.",
	      "Clearing cache": "Đang xóa...",
	      "Proceed": "Thực hiện",
	      "Select all": "Chọn tất cả",
	      "Unselect all": "Bỏ chọn tất cả",
	      "Cancel": "Hủy",
	      "Clear": "Xóa"
	    }
	  }
	};exports.default = i18nextResources;

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map