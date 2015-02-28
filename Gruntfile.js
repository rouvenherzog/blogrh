module.exports = function(grunt) {
	// Configure Grunt
	grunt.initConfig({
		concat: {
			options: {
				separator: ';'
			},
			all: {
				files: {
					'frontend/static/js/rouvenherzog.js': [
						'frontend/angular/App.js',
						'frontend/angular/**/*.js'
					]
				}
			}
		},

		less: {
			development: {
				options: {},
				files: {
					'frontend/static/css/rouvenherzog.css': 'frontend/styles/**/!(login).less'
				}
			},

			login: {
				options: {},
				files: {
					'frontend/static/css/login.css': 'frontend/styles/users/login.less'
				}
			}
		},

		copy: {
			i18n: {
				cwd: 'frontend/locales/',
				expand: true,
				src: '*.json',
				dest: 'frontend/static/locales/'
			}
		},

		watch: {
			development: {
				files: ['frontend/angular/**/*.js', 'frontend/styles/**/*.less'],
				tasks: ['less', 'concat']
			}
		}
	});

	// Loading Grunt Tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
};