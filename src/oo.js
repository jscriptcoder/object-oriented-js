/**
 * @overwiew Just another class system ;-), containing the basic functionality to organize your code
 * @author Francisco Ramos <jscriptcoder@gmail.com>
 */

/**
 * Global $JS variable
 * @namespace $JS
 */
(function (global, $JS) {

    var

    /**
     * @type function
     * @private
     */
    __obj_proto_construct__ = Object.prototype.constructor,

    /**
     * @type function
     * @private
     */
    __arr_proto_slice__ = Array.prototype.slice,

    /**
     * @param {object} dst
     * @param {...object} obj
     * @returns {object}
     * @private
     */
    __extend__ = function (dst) {
        var obj, i, len, p;

        for (i = 1, len = arguments.length; i < len; i++) {
            obj = arguments[i];

            if (obj && obj !== dst) {
                for (p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        dst[p] = obj[p];
                    }
                }
            }

        }

        return dst;

    },

    /**
     * Helper function for mixins
     * @param {object|object[]} mixins
     * @returns {object}
     * @private
     */
    __mixin_helper__ = function (mixins) {
        var obj = {};

        if (mixins instanceof Array) {

            for (var i = 0, len = mixins.length; i < len; i++) {
                __extend__(obj, __mixin_helper__(mixins[i]));
            }

        } else if (typeof mixins === 'function') {

            __extend__(obj, mixins.prototype);
            delete obj['constructor'];

        } else if (typeof mixins === 'object') {
            __extend__(obj, mixins);
        }

        delete obj['$super'];

        return obj;
    }

    ;

    /**
     * Extends objects jQuery-like ($.extend)
     * @memberof $JS
     * @example
     *
     * $JS.extend(ObjDestination, ObjOrigin);
     *
     * var objResult = $JS.extend({}, obj1, obj2, obj3);
     *
     * @param {object} dest
     * @param {...object} obj
     * @returns {object} dest object result
     */
    $JS.extend = __extend__;

    /**
     * Creates object namespaces
     * @memberof $JS
     * @example
     *
     * $JS.namespace('App.MyNamespace');
     *
     * $JS.namespace([
     *   'App.Services',
     *   'App.Services.Providers'
     *   'App.Types',
     *   'App.Controllers'
     * ]);
     *
     * $JS.namespace((window.Root = {}), 'SubNamespace');
     *
     * @param {object} [root=global] - root object
     * @param {string|string[]} path - namespace or list of namespaces
	 * @param {any} [value] - optional value to put in the namespace
     * @returns {object}
     * @throws {Error} [$JS.namespace] "path" is mandatory string or Object
     */
    $JS.namespace = function (root, path, value) {

        if (typeof root === 'string' || root instanceof Array) {
            value = path;
            path = root;
            root = global;
        }

        if (path instanceof Array) {

            for (var i = 0, len = path.length; i < len; i++) {
                $JS.namespace(root, path[i]);
            }

        } else if (typeof path === 'string') {

            var ns = path.split('.'),
                len = ns.length;

            for (var i = 0; i < len; i++) {
                root = root[ns[i]] = (i + 1 === len && typeof value !== 'undefined') ? value : (root[ns[i]] || {});
            }

            return root;

        } else {
            throw Error('[$JS.namespace] "path" is mandatory string or Object');
        }

    };

    /**
     * Defines modules - follows module pattern
     * @memberof $JS
     * @example
     *
     * $JS.module('App.Utils', {
     *   func1: function () {...},
     *   func1: function () {...}
     * });
     *
     * $JS.module('App.Services', function () {
     *   var myPrivate = '';
     *   return {
     *     getMyPrivate: function () { return myPrivate; },
     *     setMyPrivate: function (val) { myPrivate = val; }
     *   };
     * });
     *
     * $JS.module('App.MoreUtils', App.Utils, {
     *   greatFunc: function () {...}
     * });
     *
     * // or
     * App.Utils.$extend('App.MoreUtils', {
     *   greatFunc: function () {...}
     * })
     *
     * @param {object} [root=global] - root object
     * @param {string} path - path.to.module
     * @param {object} [supermodule]
     * @param {object|function} factory
     * @returns {object} created module
     * @throws {Error} [$JS.module] "path" is mandatory string
     * @public
     */
    $JS.module = function (root, path, supermodule, factory) {

        if (typeof root === 'string') {
            factory = supermodule;
            supermodule = path;
            path = root;
            root = global;
        }

        if (typeof path !== 'string') throw Error('[$JS.module] "path" is mandatory string');

        if (typeof factory === 'undefined') {
            factory = supermodule || {};
            supermodule = {};
        }

        var Module = $JS.namespace(root, path, typeof factory === 'function' ? factory() : factory);

        if (typeof supermodule === 'object') {
            EF.extend(Module, supermodule);
            Module.$super = supermodule;
        }

        Module.$extend = function (_root, _path, _factory) {

            if (typeof _root === 'string') {
                _factory = _path;
                _path = _root;
                _root = global;
            }

            return $JS.module(_root, _path, Module, _factory);
        };

        return Module;

    };

    /**
     * Define objects. We need to polyfill Object.create in IE8
     * @memberof $JS
     * @example
     *
     * $JS.object('App.Person', {
     *   name: '',
     *   init: function (name) { this.name = name; },
     *   getName: function () { return this.name; }
     *   sayName: function () { alert(this.name); }
     * });
     *
     * App.Person.$extend('App.Me', {
     *   init: function () {
     *     App.Me.$super.init.call(this, 'Fran'); // App.Person.init.call(this, 'Fran');
     *   }
     * });
     *
     * var me = App.Me.$new();
     * me.sayName(); // will alert 'Fran'
     *
     * @param {object} [root=global] - root object
     * @param {string} path - path.to.object
     * @param {object} [superobj]
     * @param {object|Function} factory
     * @returns {object} new object
     * @throws {Error} [$JS.object] "path" is mandatory string
     * @public
     */
    $JS.object = function (root, path, superobj, factory) {

        if (typeof root === 'string') {
            factory = superobj;
            superobj = path;
            path = root;
            root = global;
        }

        if (typeof path !== 'string') throw Error('[$JS.object] "path" is mandatory string');

        if (typeof factory === 'undefined') {
            factory = superobj || {};
            superobj = Object.prototype;
        } else {
            superobj = superobj || Object.prototype;
        }

        var Obj = Object.create(superobj); // IE8 needs polyfill

        $JS.extend(Obj, typeof factory === 'function' ? factory() : factory);

        Obj.$super = superobj;

        Obj.$new = function () {
            var newObj = Object.create(Obj);

            if (typeof newObj.init === 'function') {
                newObj.init.apply(newObj, __arr_proto_slice__.call(arguments));
            }

            return newObj;
        };

        Obj.$extend = function (_root, _path, _factory) {

            if (typeof _root === 'string') {
                _factory = _path;
                _path = _root;
                _root = global;
            }

            return $JS.object(_root, _path, Obj, _factory);
        };

        return $JS.namespace(root, path, Obj);

    };

    /**
     * Defines types (or classes. Personally I don't like calling them 'classes');
     * @memberof $JS
     * @example
     *
     * $JS.class('App.MyClass', {
     *
     *   __priv__: null,
     *   constructor: function (param) { this.__priv__ = param; },
     *   method1: function () {...},
     *   method2: function () {...}
     *
     * }, {
     *
     *   static1: 'value',
     *   static2: function () {...}
     *
     * });
     *
     * // inheritance
     * $JS.class('App.MySubClass', App.MyClass, {
     *   __priv2__: null,
     *   constructor: function (param1, param2) {
     *     App.MyClass.call(this, param1);
     *     this.__priv2__ = param2;
     *   },
     *   method1: function () {...}, // overrides method1
     *   method3: function () {...}
     * });
     *
     * // or
     * App.MyClass.$extend('App.MySubClass', {...});
     *
     * @param {object} [root=global] - root object
     * @param {string} path - path.to.class
     * @param {function} [superclass]
     * @param {object} members
     * @param {object} [statics]
     * @returns {function} constructor function
     * @throws {Error} [$JS.class] "path" is mandatory string
     * @public
     */
    $JS.type = $JS['class'] = function (root, path, superclass, members, statics) { // $JS['class'] <- Fucking IE8

        if (typeof root === 'string') {
            statics = members;
            members = superclass;
            superclass = path;
            path = root;
            root = global;
        }

        if (typeof path !== 'string') throw Error('[$JS.class] "path" is mandatory string');

        if (superclass && typeof superclass === 'object') {
            statics = members;
            members = superclass;
            superclass = null;
        }

        var Constructor = members.constructor === __obj_proto_construct__ ? function () { } : members.constructor,
            Class = $JS.namespace(root, path, Constructor);

        if (typeof superclass === 'function') {

            var superproto = superclass.prototype,
                proxyClass = function() { this.constructor = Class; };

            $JS.extend(Class, superclass);

            Class.$super = proxyClass.prototype = superproto;
            Class.prototype = new proxyClass();

        }

        $JS.extend(Class.prototype, members);
        $JS.extend(Class, statics);

        Class.$extend = function (_root, _path, _members, _statics) {

            if (typeof _root === 'string') {
                _statics = _members;
                _members = _path;
                _path = _root;
                _root = global;
            }

            return $JS['class'](_root, _path, Class, _members, _statics);
        };

        return Class;
    };

    /**
     * Defines interfaces. This might be useless but helps you to structure your code :-)
     * @memberof $JS
     * @example
     *
     * $JS.interface('App.MyInterface', [
     *   'method1',
     *   'method2',
     *   'method3'
     * ]);
     *
     * $JS.interface('App.MoreInterface', App.MyInterface, [
     *   'method4',
     *   'method5'
     * ]);
     *
     * // or
     * App.MyInterface.$extend('App.MoreInterface', [
     *   'method4',
     *   'method5'
     * ]);
     *
     * @param {object} [root=global] - root object
     * @param {string} path - path.to.interface
     * @param {object|object[]} [superint]
     * @param {string[]} intdef
     * @returns {object} created interface-object
     * @throws {Error} [$JS.interface] "path" is mandatory string
     * @public
     */
    $JS.interface = function (root, path, superint, intdef) {

        if (typeof root === 'string') {
            intdef = superint;
            superint = path;
            path = root;
            root = global;
        }

        if (typeof path !== 'string') throw Error('[$JS.interface] "path" is mandatory string');

        if (typeof intdef === 'undefined') {
            intdef = superint || [];
            superint = null;
        }

        var Interface = {};

        if (superint && typeof superint === 'object') $JS.extend(Interface, __mixin_helper__(superint));

        intdef.forEach(function(el, idx) {
            Interface[el] = function () {
                throw Error('Abstract method ' + el + ' must be implemented.');
            }
        });

        Interface.$extend = function (_root, _path, _intdef) {

            if (typeof _root === 'string') {
                _intdef = _path;
                _path = _root;
                _root = global;
            }

            return $JS.interface(_root, _path, Interface, _intdef);

        };

        return $JS.namespace(root, path, Interface);

    };

    /**
     * Defines classes, modules, objects or interfaces. Inspired by ExtJS 4 class system
     * @see {@link http://www.sencha.com/learn/sencha-class-system} for further information
     * @memberof $JS
     * @example
     *
     * $JS.define('App.Utils', {
     *   $module: true,
     *   func1: function () {...},
     *   func1: function () {...}
     * });
     *
     * $JS.define('App.Services', function () {
     *   var myPrivate = '';
     *   return {
     *     $module: true,
     *     getMyPrivate: function () { return myPrivate; },
     *     setMyPrivate: function (val) { myPrivate = val; }
     *   };
     * });
     *
     * $JS.define('App.MoreUtils', {
     *   $module: true,
     *   $extends: App.Utils,
     *   greatFunc: function () {...}
     * });
     *
     * @example
     *
     * $JS.define('App.Person', {
     *   name: '',
     *   init: function (name) { this.name = name; },
     *   getName: function () { return this.name; }
     *   sayName: function () { alert(this.name); }
     * });
     *
     * $JS.define('App.Me', {
     *   $prototype: App.Person,
     *   init: function () {
     *     App.Me.$super.init.call(this, 'Fran'); // App.Person.init.call(this, 'Fran');
     *   }
     * });
     *
     * @example
     *
     * $JS.define('App.MyClass', {
     *
     *   $statics: {
     *     static1: function () {...},
     *     static2: function () {...}
     *   },
     *
     *   __priv__: null,
     *   constructor: function (param) { this.__priv__ = param; },
     *   method1: function () {...},
     *   method2: function () {...}
     *
     * });
     *
     * // inheritance
     * $JS.define('App.MySubClass', {
     *
     *   $extends: App.MyClass,
     *
     *   __priv2__: null,
     *   constructor: function (param1, param2) {
     *     App.MyClass.call(this, param1);
     *     this.__priv2__ = param2;
     *   },
     *   method1: function () {...}, // overrides method1
     *   method3: function () {...}
     * });
     *
     * @example
     *
     * $JS.define('App.MyInterface', [
     *   'method1',
     *   'method2',
     *   'method3'
     * ]);
     *
     * $JS.define('App.MoreInterface', {
     *
     *   $extends: App.MyInterface,
     *   $interface: [
     *     'method4',
     *     'method5'
     *   ]
     * });
     *
     * $JS.define('App.MySpecialClass', {
     *
     *   $implements: App.MoreInterface,
     *   $extends: App.MyClass,
     *   $defined: function (Type) {
     *     //Do something when the type is defined
     *   }
     *
     *   constructor: function () {...}
     * });
     *
     * @param {object} [root=global] - root object
     * @param {string} path - path to class
     * @param {object|string[]} config - configuration object
     * @param {function|object} [config.$extends] - inherits from
     * @param {function|object|any[]} [config.$mixins] - borrows from
     * @param {object} [config.$statics] - statics members for classes
     * @param {boolean} [config.$module] - indicates module
     * @param {function} [config.$defined] - it's called when the type is defined
     * @returns {function|object} constructor function or module
     * @throws {Error} [$JS.define] "path" is mandatory string
     * @public
     */
    $JS.define = function (root, path, config) {

        if (typeof root === 'string') {
            config = path;
            path = root;
            root = global;
        }

        if (typeof path !== 'string') throw Error('[$JS.define] "path" is mandatory string');

        if (typeof config === 'function') config = config();

        if (config instanceof Array) config = { $interface: config }; // we're creating an interface

        var superobj = config.$extends || config.$prototype,
            mixins = config.$mixins || config.$implements,
            interf = config.$interface instanceof Array ? config.$interface : null,
            statics = config.$statics,
            isclass = (config.constructor && config.constructor !== __obj_proto_construct__) || config.$class,
            ismod = config.$module || config.$singleton,
            defined = config.$defined,
            members, type;

        // there is no need to keep these reserved words
        delete config['$extends']; delete config['$prototype'];
        delete config['$mixins']; delete config['$implements'];
        delete config['$statics']; delete config['$class'];
        delete config['$module']; delete config['$singleton'];
        delete config['$defined']; delete config['$interface']

        members = config;

        if (mixins) {
            members = $JS.extend(__mixin_helper__(mixins), members);
            members['constructor'] = config['constructor']; // IE8 doesn't iterate over "constructor" property
        }

        if (isclass) {
            type = $JS['class'](root, path, superobj, members, statics);
        } else if (ismod) {
            type = $JS.module(root, path, superobj, members);
        } else if (interf) {
            type = $JS.interface(root, path, superobj, interf);
        } else {
            type = $JS.object(root, path, superobj, members);
        }

        if (typeof defined === 'function') defined(type);

        return type;

    };

})(this, this.$JS || (this.$JS = {}));