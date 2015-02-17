MediaModule.factory('rouvenherzog.Media.MediaFactory', [
	'$rootScope',
	function( $rootScope ) {

		var Media = function( args ) {
			// Create a temporary media object from a file entry
			if( args.file ) {
				this.file = args.file;
				this.persisted = false;
				this.name = args.file.name;
				this.size = args.file.size;
				this.type = args.file.type;

				this.preview = undefined;
				this.loading_progress = 0;

				this.title = undefined;
				this.tags = [];

				this._loadPreview();
			}

			// Create a persisted media object
			else {
				this.persisted = true;
			}
		};

		Media.prototype.set = function( args ) {
			for( var key in args ) {
				this[key] = args[key];
			}
		};

		Media.prototype.setPersisted = function( persisted ) {
			this.persisted = persisted || false;
		};

		Media.prototype._loadPreview = function( ) {
			var reader = new FileReader();
			var self = this;

			reader.onload = function( e ) {
				$rootScope.$apply(function() {
					self.preview = e.target.result;
				});
			};

			reader.readAsDataURL(this.file);
		};

		Media.prototype.toFormData = function() {
			var data = new FormData();
			data.append('file', this.file);
			data.append('title', this.title);
			data.append('tags', this.tags);

			return data;
		};

		return {
			fromFile: function( file ) {
				return new Media({
					file: file
				})
			},

			fromMedia: function( args ) {
				return new Media(args);
			}
		}
	}
]);