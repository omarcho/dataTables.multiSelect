var module;
module.exports = function(grunt) {

	grunt.initConfig({
		cfg: {
            filename: 'dataTables.multiSelect',
            vanillaExportName: 'dataTables.multiSelect'
        },
		dirs: {
            src: 'src',
            dist: 'dist',
            docs: 'docs',
            test: 'test',
			libs: 'libs',
			css: 'css',
            examples: 'examples'
        },
		copy: {
            main: {
                expand: true,
				cwd:'<%= dirs.libs %>/',
                src: ['**'],
                dest: '<%= dirs.dist %>/',
            },
			examples: {
                expand: true,
                src: ['<%= dirs.libs %>/**', '<%= dirs.dist %>/**'],
                dest: '<%= dirs.examples %>/',
            },
			test: {
                expand: true,
                src: ['<%= dirs.libs %>/**', '<%= dirs.dist %>/**'],
                dest: '<%= dirs.test %>/',
            }
        },
		clean: {
            all: ['<%= dirs.dist %>/**']
        },
		uglify: {
            dist: {
                options: {
                    report: 'gzip',
                    preserveComments: 'some'
                },
                files: {
                    '<%= dirs.dist %>/js/<%= cfg.filename %>.min.js': ['<%= dirs.src %>/js/*.js']
                }
            }
        },
		karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
		"jshint": {
			"files": [
				"Gruntfile.js",
				"src/**/*.js",
				"test/**/*.js"
			],
			"options": {
				"globals": {
					"jQuery": true
				},
				reporterOutput: ""
			}
		},
		"watch": {
			"files": "<%= dirs.src %>/js/*.js",
			"tasks": ["uglify","copy:examples", "copy:test"]
		},
		
	});

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  
  
  grunt.registerTask('default', ['clean:all','uglify','copy:examples', 'copy:test']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('w', ['watch']);
 
};