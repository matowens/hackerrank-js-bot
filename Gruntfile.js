module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['Gruntfile.js', 'bot/**/*.js'],
                tasks: ['test']
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'bot/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        shell: {
            fire: {
                command: [
                    'echo.',
                    'echo \x1B[31m ^<^< bot output ^>^> \x1B[39m',
                    'echo. \x1B[36m',
                    'node ./bot/bot.js',
                    'echo. \x1B[39m',
                    'echo \x1B[31m ^<^< end output ^>^> \x1B[39m'
                ].join('&&')
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('test', ['jshint', 'shell']);
    grunt.registerTask('default', ['test', 'watch']);

};
