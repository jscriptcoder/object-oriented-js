describe('Global $JS API', function () {

    it('extends objects [ $JS.extend ]', function () {

        var dst =   { prop1: true },
            obj1 =  { prop2: 'Jasmine' },
            obj2 =  { prop3: 'Testing' },
            other = { prop4: true, prop5: 6 },
            result;

        $JS.extend(dst, obj1, obj2);

        expect(dst.prop1).toEqual(true);
        expect(dst.prop2).toEqual('Jasmine');
        expect(dst.prop3).toEqual('Testing');

        var res = $JS.extend({}, other, obj1, obj2);

        expect(other.prop2).toBeUndefined();
        expect(other.prop3).toBeUndefined();

        expect(res.prop2).toEqual('Jasmine');
        expect(res.prop3).toEqual('Testing');
        expect(res.prop4).toEqual(true);
        expect(res.prop5).toEqual(6);

    });

    it('creates namespaces [ $JS.namespace ]', function () {

        $JS.namespace('My.Namespace');
        expect(My.Namespace).toBeDefined();

        $JS.namespace([
            'My.Namespace.Test',
            'My.Namespace.Jasmine',
            'My.Another.One'
        ]);

        expect(My.Namespace.Test).toBeDefined();
        expect(My.Namespace.Jasmine).toBeDefined();
        expect(My.Another.One).toBeDefined();

        window.MyRoot = {};
        window.MyOtherRoot = {};

        $JS.namespace(MyRoot, 'SubNamespace');
        $JS.namespace(MyOtherRoot, [
            'Namespace.Test',
            'Namespace.Jasmine',
            'Another.One'
        ]);

        expect(MyRoot.SubNamespace).toBeDefined();
        expect(MyOtherRoot.Namespace.Test).toBeDefined();
        expect(MyOtherRoot.Namespace.Jasmine).toBeDefined();
        expect(MyOtherRoot.Another.One).toBeDefined();

    });

    it('defines a module [ $JS.module ]', function () {

        $JS.module('My.Module', {
            func1: function() {},
            func2: function() { return true; }
        });

        expect(My.Module.func1).toEqual(jasmine.any(Function));
        expect(My.Module.func2()).toBeTruthy();

        $JS.module('My.Other.Module', function() {
            var tester = 'Jasmine';

            return {
                getTester: function() { return tester; }
            };
        });

        expect(My.Other.Module.getTester).toEqual(jasmine.any(Function));
        expect(My.Other.Module.getTester()).toEqual('Jasmine');

        window.MyRootModule = {};

        $JS.module(MyRootModule, 'Another', {
            tester: 'Jasmine'
        });

        expect(MyRootModule.Another.tester).toEqual('Jasmine');

        var SubModule = $JS.module('My.Other.SubModule', My.Other.Module, {

            helloTester: function () {
                return 'Hello ' + SubModule.getTester();
            }

        });

        expect(My.Other.SubModule).toBe(SubModule);
        expect(My.Other.SubModule.$super).toBe(My.Other.Module);
        expect(My.Other.SubModule.getTester).toEqual(jasmine.any(Function));
        expect(My.Other.SubModule.getTester()).toEqual('Jasmine');
        expect(My.Other.SubModule.helloTester).toEqual(jasmine.any(Function));
        expect(My.Other.SubModule.helloTester()).toEqual('Hello Jasmine');

        var LastModule = My.Other.SubModule.$extend('My.Other.LastModule', {

            goodbyeTester: function () {
                return 'Goodbye ' + LastModule.getTester();
            }

        });

        expect(My.Other.LastModule).toBe(LastModule);
        expect(My.Other.LastModule.$super).toBe(My.Other.SubModule);
        expect(My.Other.LastModule.helloTester()).toEqual('Hello Jasmine');
        expect(My.Other.LastModule.goodbyeTester()).toEqual('Goodbye Jasmine');

    });

    it('defines an object [ $JS.object ]', function () {

        $JS.object('My.Object', {
            func1: function () {},
            func2: function () { return true; }
        });

        expect(My.Object.$super).toEqual(Object.prototype);
        expect(My.Object.func1).toEqual(jasmine.any(Function));
        expect(My.Object.func2()).toBeTruthy();

        $JS.object('My.Other.Object', function () {

            return {
                tester: 'Jasmine',
                getTester: function () { return this.tester; }
            };

        });

        expect(My.Other.Object.$super).toEqual(Object.prototype);
        expect(My.Other.Object.getTester).toEqual(jasmine.any(Function));
        expect(My.Other.Object.getTester()).toEqual('Jasmine');

        window.MyRootObject = {}

        $JS.object(MyRootObject, 'Another', {
            tester: 'Jasmine'
        });

        expect(MyRootObject.Another.tester).toEqual('Jasmine');

        var SubObject = $JS.object('My.Other.SubObject', My.Other.Object, {

            helloTester: function () {
                return 'Hello ' + SubObject.getTester.call(this);
            }

        });

        expect(My.Other.SubObject).toEqual(SubObject);
        expect(My.Other.SubObject.$super).toEqual(My.Other.Object);
        expect(My.Other.SubObject.getTester).toEqual(jasmine.any(Function));
        expect(My.Other.SubObject.getTester()).toEqual('Jasmine');
        expect(My.Other.SubObject.helloTester).toEqual(jasmine.any(Function));
        expect(My.Other.SubObject.helloTester()).toEqual('Hello Jasmine');

        var LastObject = My.Other.SubObject.$extend('My.Other.LastObject', {

            init: function (tester) {
                this.tester = tester;
            },

            goodbyeTester: function () {
                return 'Goodbye ' + SubObject.getTester.call(this);
            }

        });

        expect(My.Other.LastObject).toBe(LastObject);
        expect(My.Other.LastObject.$super).toBe(My.Other.SubObject);
        expect(My.Other.LastObject.helloTester()).toEqual('Hello Jasmine');
        expect(My.Other.LastObject.goodbyeTester()).toEqual('Goodbye Jasmine');

        var lastObj = My.Other.LastObject.$new('QUnit');

        expect(lastObj.$super).toBe(My.Other.SubObject);
        expect(lastObj.helloTester()).toEqual('Hello QUnit');
        expect(lastObj.goodbyeTester()).toEqual('Goodbye QUnit');

    });

    it('defines a type [ $JS.type ]', function () {

        $JS.type('My.FirstClass', {

            constructor: function(attr) {
                this.attr = attr;
            },

            getAttr: function () {
                return this.attr;
            }

        }, {
            tester: 'Jasmine',
            sayHello: function () { return 'Hello'; }
        });

        expect(My.FirstClass).toEqual(jasmine.any(Function));
        expect(My.FirstClass.tester).toEqual('Jasmine');
        expect(My.FirstClass.sayHello()).toEqual('Hello');

        var myFirst = new My.FirstClass('Jasmine');

        expect(myFirst instanceof Object).toBeTruthy();
        expect(myFirst instanceof My.FirstClass).toBeTruthy();
        expect(myFirst.getAttr()).toEqual('Jasmine');

        $JS.type('My.SecondClass', My.FirstClass, {

            constructor: function (attr) {
                My.SecondClass.$super.constructor.call(this, attr);
            },

            getAttr: function () {
                var attr = My.SecondClass.$super.getAttr.call(this);
                return attr + ' is cool!!!';
            }

        }, {
            sayTester: function () {
                return My.SecondClass.tester;
            }
        });

        expect(My.SecondClass).toEqual(jasmine.any(Function));
        expect(My.SecondClass.sayTester()).toEqual('Jasmine');

        var mySecond = new My.SecondClass('Unit Testing');

        expect(mySecond instanceof Object).toBeTruthy();
        expect(mySecond instanceof My.FirstClass).toBeTruthy();
        expect(mySecond instanceof My.SecondClass).toBeTruthy();
        expect(mySecond.getAttr()).toEqual('Unit Testing is cool!!!');

        window.MyRootClasses = {};

        $JS.type(MyRootClasses, 'Another', {
            sayTester: function () {
                return 'Jasmine';
            }
        });

        expect(MyRootClasses.Another).toEqual(jasmine.any(Function));
        expect(MyRootClasses.Another.prototype.sayTester).toEqual(jasmine.any(Function));

        var ThirdClass = My.SecondClass.$extend('My.ThirdClass', {

            constructor: function (attr) {
                ThirdClass.$super.constructor.call(this, attr);
            },

            sayTester: function () {
                return ThirdClass.tester;
            }

        });

        var myThird = new ThirdClass('Me');

        expect(myThird instanceof Object).toBeTruthy();
        expect(myThird instanceof My.FirstClass).toBeTruthy();
        expect(myThird instanceof My.SecondClass).toBeTruthy();
        expect(myThird instanceof My.ThirdClass).toBeTruthy();
        expect(myThird.attr).toEqual('Me');
        expect(myThird.getAttr()).toEqual('Me is cool!!!');
        expect(myThird.sayTester()).toEqual('Jasmine');

    });

    it('defines an interface', function () {

        $JS.interface('My.Interface1', ['func1', 'func2']);

        expect(My.Interface1.func1).toEqual(jasmine.any(Function));
        expect(My.Interface1.func2).toEqual(jasmine.any(Function));

        $JS.interface('My.Interface2', ['func3', 'func4']);

        expect(My.Interface2.func3).toThrow();
        expect(My.Interface2.func4).toThrow();

        $JS.interface('My.SubInterface1', My.Interface1, ['func5', 'func6']);

        expect(My.SubInterface1.func1).toEqual(jasmine.any(Function));
        expect(My.SubInterface1.func2).toEqual(jasmine.any(Function));
        expect(My.SubInterface1.func5).toEqual(jasmine.any(Function));
        expect(My.SubInterface1.func6).toEqual(jasmine.any(Function));
        expect(My.SubInterface1.func5).toThrow();
        expect(My.SubInterface1.func6).toThrow();

        $JS.interface('My.SubInterface2', [My.Interface1, My.Interface2], ['func7', 'func8']);

        expect(My.SubInterface2.func1).toEqual(jasmine.any(Function));
        expect(My.SubInterface2.func3).toEqual(jasmine.any(Function));
        expect(My.SubInterface2.func7).toThrow();

    });

    describe('Generic definition [ $JS.define ]', function () {

        it('defines a module [ $JS.define("path.to.module", { $module: true, ... }) ]', function () {

            $JS.define('Your.Module', {

                $module: true,

                func1: function() {},
                func2: function() { return true; }
            });

            expect(Your.Module.func1).toEqual(jasmine.any(Function));
            expect(Your.Module.func2()).toBeTruthy();

            $JS.define('Your.Other.Module', function() {
                var tester = 'Jasmine';

                return {

                    $module: true,

                    getTester: function() { return tester; }
                };
            });

            expect(Your.Other.Module.getTester).toEqual(jasmine.any(Function));
            expect(Your.Other.Module.getTester()).toEqual('Jasmine');

            window.YourRootModule = {};

            $JS.define(YourRootModule, 'Another', {

                $module: true,

                tester: 'Jasmine'
            });

            expect(YourRootModule.Another.tester).toEqual('Jasmine');

            var SubModule = $JS.define('Your.Other.SubModule', {

                $module: true,
                $extends: Your.Other.Module,

                helloTester: function () {
                    return 'Hello ' + SubModule.getTester();
                }

            });

            expect(Your.Other.SubModule).toBe(SubModule);
            expect(Your.Other.SubModule.$super).toBe(Your.Other.Module);
            expect(Your.Other.SubModule.getTester).toEqual(jasmine.any(Function));
            expect(Your.Other.SubModule.getTester()).toEqual('Jasmine');
            expect(Your.Other.SubModule.helloTester).toEqual(jasmine.any(Function));
            expect(Your.Other.SubModule.helloTester()).toEqual('Hello Jasmine');

            var LastModule = Your.Other.SubModule.$extend('Your.Other.LastModule', {

                goodbyeTester: function () {
                    return 'Goodbye ' + LastModule.getTester();
                }

            });

            expect(Your.Other.LastModule).toBe(LastModule);
            expect(Your.Other.LastModule.$super).toBe(Your.Other.SubModule);
            expect(Your.Other.LastModule.helloTester()).toEqual('Hello Jasmine');
            expect(Your.Other.LastModule.goodbyeTester()).toEqual('Goodbye Jasmine');

        });

        it('defines an object [ $JS.define("path.to.object", {...}) ]', function () {

            $JS.define('Your.Object', {
                func1: function () {},
                func2: function () { return true; }
            });

            expect(Your.Object.$super).toEqual(Object.prototype);
            expect(Your.Object.func1).toEqual(jasmine.any(Function));
            expect(Your.Object.func2()).toBeTruthy();

            $JS.define('Your.Other.Object', function () {

                return {
                    tester: 'Jasmine',
                    getTester: function () { return this.tester; }
                };

            });

            expect(Your.Other.Object.$super).toEqual(Object.prototype);
            expect(Your.Other.Object.getTester).toEqual(jasmine.any(Function));
            expect(Your.Other.Object.getTester()).toEqual('Jasmine');

            window.YourRootObject = {}

            $JS.define(YourRootObject, 'Another', {
                tester: 'Jasmine'
            });

            expect(YourRootObject.Another.tester).toEqual('Jasmine');

            var SubObject = $JS.define('Your.Other.SubObject', {

                $prototype: Your.Other.Object,

                helloTester: function () {
                    return 'Hello ' + SubObject.getTester.call(this);
                }

            });

            expect(Your.Other.SubObject).toEqual(SubObject);
            expect(Your.Other.SubObject.$super).toEqual(Your.Other.Object);
            expect(Your.Other.SubObject.getTester).toEqual(jasmine.any(Function));
            expect(Your.Other.SubObject.getTester()).toEqual('Jasmine');
            expect(Your.Other.SubObject.helloTester).toEqual(jasmine.any(Function));
            expect(Your.Other.SubObject.helloTester()).toEqual('Hello Jasmine');

            var LastObject = Your.Other.SubObject.$extend('Your.Other.LastObject', {

                init: function (tester) {
                    this.tester = tester;
                },

                goodbyeTester: function () {
                    return 'Goodbye ' + SubObject.getTester.call(this);
                }

            });

            expect(Your.Other.LastObject).toBe(LastObject);
            expect(Your.Other.LastObject.$super).toBe(Your.Other.SubObject);
            expect(Your.Other.LastObject.helloTester()).toEqual('Hello Jasmine');
            expect(Your.Other.LastObject.goodbyeTester()).toEqual('Goodbye Jasmine');

            var lastObj = Your.Other.LastObject.$new('QUnit');

            expect(lastObj.$super).toBe(Your.Other.SubObject);
            expect(lastObj.helloTester()).toEqual('Hello QUnit');
            expect(lastObj.goodbyeTester()).toEqual('Goodbye QUnit');

        });

        it('defines a class [ $JS.define("path.to.class", { constructor: function () {...} }) ]', function () {

            $JS.define('Your.FirstClass', {

                $statics: {
                    tester: 'Jasmine',
                    sayHello: function () { return 'Hello'; }
                },

                constructor: function(attr) {
                    this.attr = attr;
                },

                getAttr: function () {
                    return this.attr;
                }

            });

            expect(Your.FirstClass).toEqual(jasmine.any(Function));
            expect(Your.FirstClass.tester).toEqual('Jasmine');
            expect(Your.FirstClass.sayHello()).toEqual('Hello');

            var youtFirst = new Your.FirstClass('Jasmine');

            expect(youtFirst instanceof Object).toBeTruthy();
            expect(youtFirst instanceof Your.FirstClass).toBeTruthy();
            expect(youtFirst.getAttr()).toEqual('Jasmine');

            $JS.define('Your.SecondClass', {

                $extends: Your.FirstClass,
                $statics: {
                    sayTester: function () {
                        return Your.SecondClass.tester;
                    }
                },

                constructor: function (attr) {
                    Your.SecondClass.$super.constructor.call(this, attr);
                },

                getAttr: function () {
                    var attr = Your.SecondClass.$super.getAttr.call(this);
                    return attr + ' is cool!!!';
                }

            });

            expect(Your.SecondClass).toEqual(jasmine.any(Function));
            expect(Your.SecondClass.sayTester()).toEqual('Jasmine');

            var yourSecond = new Your.SecondClass('Unit Testing');

            expect(yourSecond instanceof Object).toBeTruthy();
            expect(yourSecond instanceof Your.FirstClass).toBeTruthy();
            expect(yourSecond instanceof Your.SecondClass).toBeTruthy();
            expect(yourSecond.getAttr()).toEqual('Unit Testing is cool!!!');

            window.YourRootClasses = {};

            $JS.define(YourRootClasses, 'Another', {

                $class: true,

                sayTester: function () {
                    return 'Jasmine';
                }
            });

            expect(YourRootClasses.Another).toEqual(jasmine.any(Function));
            expect(YourRootClasses.Another.prototype.sayTester).toEqual(jasmine.any(Function));

            var ThirdClass = Your.SecondClass.$extend('Your.ThirdClass', {

                constructor: function (attr) {
                    ThirdClass.$super.constructor.call(this, attr);
                },

                sayTester: function () {
                    return ThirdClass.tester;
                }

            });

            var yourThird = new ThirdClass('You');

            expect(yourThird instanceof Object).toBeTruthy();
            expect(yourThird instanceof Your.FirstClass).toBeTruthy();
            expect(yourThird instanceof Your.SecondClass).toBeTruthy();
            expect(yourThird instanceof Your.ThirdClass).toBeTruthy();
            expect(yourThird.attr).toEqual('You');
            expect(yourThird.getAttr()).toEqual('You is cool!!!');
            expect(yourThird.sayTester()).toEqual('Jasmine');

        });

        it('defines an interface [ $JS.define("path.to.interface", [...]) ]', function () {

            $JS.define('Your.Interface1', ['func1', 'func2']);

            expect(Your.Interface1.func1).toEqual(jasmine.any(Function));
            expect(Your.Interface1.func2).toEqual(jasmine.any(Function));

            $JS.define('Your.Interface2', ['func3', 'func4']);

            expect(Your.Interface2.func3).toThrow();
            expect(Your.Interface2.func4).toThrow();

            $JS.define('Your.SubInterface1', {
                $extends: Your.Interface1,
                $interface: ['func5', 'func6']
            });

            expect(Your.SubInterface1.func1).toEqual(jasmine.any(Function));
            expect(Your.SubInterface1.func2).toEqual(jasmine.any(Function));
            expect(Your.SubInterface1.func5).toEqual(jasmine.any(Function));
            expect(Your.SubInterface1.func6).toEqual(jasmine.any(Function));
            expect(Your.SubInterface1.func5).toThrow();
            expect(Your.SubInterface1.func6).toThrow();

            $JS.define('Your.SubInterface2', {
                $extends: [Your.Interface1, Your.Interface2],
                $interface: ['func7', 'func8']
            });

            expect(Your.SubInterface2.func1).toEqual(jasmine.any(Function));
            expect(Your.SubInterface2.func3).toEqual(jasmine.any(Function));
            expect(Your.SubInterface2.func7).toThrow();

        });

    });

});