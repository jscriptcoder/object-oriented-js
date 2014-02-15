module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                src: 'src/oo.js',
                dest: 'dist/oo.min.js'
            }
        }
    });

    grunt.registerTask('default', ['uglify']);

};