module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: './',

        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            {
                pattern: './test/*.html',
                watched: false,
                served: true,
                included: false
			 },
			 './test/libs/css/*.css',
			'./test/libs/js/jquery-1.10.2.min.js',
			'./test/libs/js/bootstrap.js',
			'./test/libs/js/bootstrap-multiselect.js',
			'./test/libs/js/jquery.dataTables.js',
			'./test/libs/js/dataTables.bootstrap.js',
			'./test/dist/js/dataTables.multiselect.js', 
			
			'./test/js/*.js',
			'./test/*.tests.js'
			
        ],

        // list of files to exclude
        exclude: [
        ],

        // test results reporter to use
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};