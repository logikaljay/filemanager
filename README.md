# File Manager for Node
## Requirements
* node
* imagemagick

## NPM install
* express - 3.x
* imagemagick - ~0.1.3
* node-uuid - ~1.4.1
* fs.extra - ~1.2.1
* async - ~0.2.9
* mime - ~1.2.11

## Plans
* container like storage that issues a api key on creation
* api for common tasks like create/upload/delete/resize
* container cache for resizing

## API (so far)
### Containers
* /container/list - POST - { container: 'name', key: 'secret' }
* /container/:container/list - POST - { key: 'secret' }
* /container/create - POST - { container: 'name', key: 'secret' }
* /container/delete - DELETE - { container: 'name', key: 'secret' }

### Files
* /upload - POST - { container: 'name', key: 'secret', file: @file.jpg }
* /download/:container/:file - POST - { key: 'secret' }
* /delete/:container/:file - DELETE - { key: 'secret' }
* /rename - PUT - { container: 'name', key: 'secret', oldfile: file.jpg, newfile: newfile.jpg }
