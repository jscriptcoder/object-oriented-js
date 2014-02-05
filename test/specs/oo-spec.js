describe('Global $JS API', function () {

    it('extends objects [ $JS.extend ]', function () {});

    it('creates namespaces [ $JS.namespace ]', function () {});

    it('defines a module [ $JS.module ]', function () {});

    it('defines an object [ $JS.object ]', function () {});

    it('defines a type [ $JS.type ]', function () {});

    it('defines an interface', function () {});

    describe('Generic definition [ $JS.define ]', function () {

        it('defines a module [ $JS.define("path.to.module", { $module: true, ... }) ]', function () {});

        it('defines an object [ $JS.define("path.to.object", {...}) ]', function () {});

        it('defines a class [ $JS.define("path.to.class", { constructor: function () {...} }) ]', function () {});

        it('defines an interface [ $JS.define("path.to.interface", [...]) ]', function () {});

    });

});