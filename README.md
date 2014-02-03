# Global namespace: $JS
=======================
This is just another library to define easily namespaces, modules, objects and/or types (or classes if you like, although I personally don't like calling them in such way, since Javascript does NOT have classes). This bunch of utilities come really handy and help you to organize your code in a better way.

## API
======
**+$JS.extend**:

Syntax:
```javascript
$JS.extend(dest: object, ...obj: object): object
```

Example:
```javascript
$JS.extend(ObjDest, ObjOrigin);

var objResult = $JS.extend({}, obj1, obj2, obj3);
```
---

**+$JS.namespace**:

Syntax:
```javascript
$JS.namespace(root?: object, path: string, value?: any): any
$JS.namespace(root?: object, path: string[], value?: any): void
```

```javascript
$JS.namespace('App.MyNamespace');

$JS.namespace([
	'App.Services',
	'App.Services.Providers'
	'App.Types',
	'App.Controllers'
]);
```
---

**+$JS.module**:

---

**+$JS.object**:

---

**+$JS.type or $JS.class** - $JS['class'] in IE8:

---

**+$JS.define**: