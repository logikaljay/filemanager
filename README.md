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
### Auth
* /auth/create - POST - { email: 'bob@jones.co', password: 'supersecret' }
* /auth/reset - POST - { email: 'bob@jones.co', password: 'supersecret' }

### Containers
* /container/list - GET - { key: 'api-key' }
* /container/list/:container - POST - { key: 'api-key' }
* /container/create/:container - GET - { key: 'api-key' }
* /container/delete/:container - DELETE - { key: 'api-key' }

### Files
* /upload - POST - { container: 'name', key: 'secret', file: @file.jpg }
* /download/:container/:file - POST - { key: 'secret' }
* /delete/:container/:file - DELETE - { key: 'secret' }
* /rename - PUT - { container: 'name', key: 'secret', oldfile: file.jpg, newfile: newfile.jpg }
