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
        //TODO
    });

    it('defines a module [ $JS.module ]', function () {
        //TODO
    });

    it('defines an object [ $JS.object ]', function () {
        //TODO
    });

    it('defines a type [ $JS.type ]', function () {
        //TODO
    });

    it('defines an interface', function () {
        //TODO
    });

    describe('Generic definition [ $JS.define ]', function () {

        it('defines a module [ $JS.define("path.to.module", { $module: true, ... }) ]', function () {
            //TODO
        });

        it('defines an object [ $JS.define("path.to.object", {...}) ]', function () {
            //TODO
        });

        it('defines a class [ $JS.define("path.to.class", { constructor: function () {...} }) ]', function () {
            //TODO
        });

        it('defines an interface [ $JS.define("path.to.interface", [...]) ]', function () {
            //TODO
        });

    });

});