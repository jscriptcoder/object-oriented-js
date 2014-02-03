# Object Oriented JavaScript
This is just another library to define easily namespaces, modules, objects and/or types (or classes if you like, although I personally don't like calling them in such way, since Javascript does NOT have classes). This bunch of utilities come really handy and help you to organize your code in a better way.

## Global $JS API
**$JS.extend**

Extends objects. Works similar to jQuery.extend, but without the deep copy.

_Syntax:_
```javascript
$JS.extend(dest: object, ...obj: object): object
```

_Example:_
```javascript
$JS.extend(ObjDest, ObjOrigin);

var objResult = $JS.extend({}, obj1, obj2, obj3);
```

**$JS.namespace**

Create objects namespace, and, if passed in, also add values (objects or other types) to it.

_Syntax:_
```javascript
$JS.namespace(root?: object, path: string|string[], value?: any): any
```

_Example:_
```javascript
$JS.namespace('App.MyNamespace');

$JS.namespace([
	'App.Services',
	'App.Services.Providers'
	'App.Types',
	'App.Controllers'
]);

App.MyNamespace.greatFunc = function () {..};
App.Controllers.WidgetCtrl = function () {..};
```

**$JS.module**

Defines modules, following the module patter approach. You can pass an object or function factory

_Syntax:_
```javascript
$JS.module(root?: object, path: string, supermodule?: object, factory: object|function): object
```

_Example:_
```javascript
$JS.module('App.Utils', {
    func1: function () {..},
    func2: function () {..}
});

$JS.module('App.Services', function () {
    var myPriv = 'something private';
    return {
        getPriv: function () { return myPriv; },
        setPriv: function (val) { myPriv = val; }
    };
});

$JS.module('App.MoreUtils', App.Utils, {
    greatFunc: function () {...}
});

//or
App.Utils.$extend('App.MoreUtils', {
    greatFunc: function () {...}
});

console.log(App.MoreUtils.$super); // logs App.Utils object
```

**$JS.object**

This one is hard to understand, but it's actually the most used one. Defines objects using Object.create, therefore it could be used to define prototypes, which can be used to create types or simply objects/modules.
It needs polyfill, Object.create, in IE8

_Syntax:_
```javascript
$JS.object(root?: object, path: string, superobj?: object, factory: object|function): object
```

_Example:_
```javascript
$JS.object('App.Person', {
    name: '',
    init: function (name) { this.name = name; },
    getName: function () { return this.name; },
    sayName: function (name) { alert(this.name); }
});

App.Person.$extend('App.Me', {
    init: function () {
        App.Me.$super.init.call(this, 'My name'); // App.Person.init.call(this, 'My name');
    }
});

var me = App.Me.$new(); // $new method will create a new object and call 'init' function if defined
me.sayName(); // alerts 'My name'
```

**$JS.type or $JS.class - $JS['class'] in IE8**

Defines types (and for those who can't understand it, classes, but once again, they're NOT classes)

_Syntax:_
```javascript
$JS.class(root?: object, path: string, superclass?: object, members: object, statics?: object): function
```

_Example:_
```javascript
$JS.class('App.MyClass', {
    __priv__: null,
    constructor: function (param) { this.__priv__ = param; },
    method1: function () {...},
    method2: function () {...}
}, {
    static1: 'value',
    static2: function () {...}
});

// inheritance
$JS.class('App.MySubClass', App.MyClass, {
    __priv2__: null,
    constructor: function (param1, param2) {
        App.MySubClass.$super.constructor.call(this, param1); //App.MyClass.call(this, param1);
        this.__priv2__ = param2;
    },
    method1: function () {...}, // overrides method1
    method3: function () {...}
});

// or simply
App.MyClass.$extend('App.MySubClass', {...});
```

**$JS.interface**

Yes, you read well, "interfaces". This might be useless but helps you to structure your code :-)

_Syntax:_
```javascript
$JS.interface(root?: object, path: string, superint?: object|object[], interf: string[]): object
```

_Example:_
```javascript
$JS.interface('App.SomeInterface', [
    'method1',
    'method2',
    'method3'
]);

$JS.interface('App.MoreInterface', App.SomeInterface, [
    'method4',
    'method5'
]);

App.MoreInterface.$extend('App.LastInterface', [
    'method6',
    'method7'
]);
```

**$JS.define**

Defines types, modules, objects and interfaces (basically it does the same as the all the previous ones).
Inspired by ExtJS 4 excelent class system.

_Syntax:_
```javascript
$JS.define(root?: object, path: string, config: object|function|string[]): object
```

_reserved properties for "config" parameter:_
```
config.**$extends** or config.**$prototype** -> inherits from
config.**mixins** or config.**implements** -> borrows from
config.**$interface** -> defines an interface
config.**$statics** -> object with all the static methods of a class
config.**constructor** or config.**$class** -> defines an class
config.**$module** or config.**$singleton** -> defines a module
config.**$ondefined** -> runs when the object has been defined taking the object as parameter
```

_Defining modules:_
```javascript
$JS.define('App.Utils', {
    $module: true,
    func1: function () {...},
    func1: function () {...}
});

$JS.define('App.Services', function () {

    var myPrivate = '';

    return {
        $module: true,
        getMyPrivate: function () { return myPrivate; },
        setMyPrivate: function (val) { myPrivate = val; }
    };

});

$JS.define('App.MoreUtils', {

    $module: true,
    $extends: App.Utils,

    greatFunc: function () {...}

});
```

_Defining objects:_
```javascript
$JS.define('App.Person', {

    name: '',
    init: function (name) { this.name = name; },
    getName: function () { return this.name; }
    sayName: function () { alert(this.name); }

});

$JS.define('App.Me', {

    $prototype: App.Person,

    init: function () {
        App.Person.init.call(this, 'Fran');
    }
});
```

_Defining types:_
```javascript
$JS.define('App.MyClass', {

    $statics: {
        static1: function () {...},
        static2: function () {...}
    },

    __priv__: null,

    constructor: function (param) { this.__priv__ = param; },

    method1: function () {...},
    method2: function () {...}

});

// inheritance
$JS.define('App.MySubClass', {

    $extends: App.MyClass,

    __priv2__: null,

    constructor: function (param1, param2) {
        App.MyClass.call(this, param1);
        this.__priv2__ = param2;
    },

    method1: function () {...}, // overrides method1
    method3: function () {...}
});
```

_Defining interfaces:_
```javascript
$JS.define('App.MyInterface', [
    'method1',
    'method2',
    'method3'
]);

$JS.define('App.MoreInterface', {

    $extends: App.MyInterface,
    $interface: [
        'method4',
        'method5'
    ]
});

$JS.define('App.MySpecialClass', {

    $implements: App.MoreInterface,
    $extends: App.MyClass,

    $ondefined: function (Type) {
        //Do something when the type is defined
    },

    constructor: function () {...}
});
```