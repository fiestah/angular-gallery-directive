Basic image gallery built on AngularJS. Likely IE8+ only. Requires jQuery just because of element.width(). 

[Full Demo](http://jsfiddle.net/thatmarvin/FhjBv/embedded/result/).

## Directives

### Elements/Attributes:
All are required to except for `gallery-indicators`

- `gallery`: The root scope of the gallery. 
    - `gallery-width` & `gallery-height`: Sets the visible area of the gallery. Include the units ('200px', '100%' etc.)
    - `gallery-item-width`: Register the width of each gallery item, in pixels
- `gallery-items`: Tell the gallery which is the container element for all the gallery images/items
- `gallery-indicators`: _optional_ This generates the regular little round dots on galleries that tell you where in the gallery you're at. Click on it to scroll to the associated item.

### `$scope` functions
You can call this anywhere within `gallery` scope in the HTML:

### Scroll one item at a time:
- `scrollToIndex(index)`: Scroll to the numbered item
- `nextItem()`: Scroll to the next item. It will wrap from the last item to the first.
- `previousItem()`: Same as `next()`, but in reverse.

### Scroll several items at a time (when gallery is wider than a single item):

- `scrollToScreen(index)`
- `nextScreen()`
- `previousScreen()`


### CSS and Classes
You'll need this [_minimal_ amount of CSS](src/angular-gallery-directive.css) to get it working. All classes below are required to hook up the CSS:

- `.gallery-item`: The item in the gallery. Could contain `<img>`s or any arbitrary html.
- `.gallery-item-list`: The "filmstrip" that contains a bunch of `.gallery-item`s.
- `.gallery-window`: The "window" that wraps the `.gallery-item-list`


## Barebones Example ([Fiddle](http://jsfiddle.net/thatmarvin/DDRVC/)):
First, pass in an array of objects (containing like image urls, captions, etc.) into `$scope.items` in the controller.

Set this variable directly:

``` js
  function GalleryController($scope) {
    $scope.items = [
      {url: '/1.jpg'},
      {url: '/2.jpg'}
     ];
  }
```

… or use an async service like `$http`:

``` js
  function GalleryController($scope, $http) {
    $http.get('/images.json').then(function (response) {
      // Promises are awesome
      $scope.items = response.data;
    });
  }
```


Your HTML should look something like:

``` html
  <div gallery
    gallery-width="300px"
    gallery-height="200px"
    gallery-item-width='300'
    ng-controller="GalleryController" class="gallery">
      <!-- The images -->
      <div class="gallery-window">
          <ul gallery-images class="gallery-item-list">
              <li ng-repeat="item in items" class="gallery-item">
                  <img ng-src="{{item.url}}" width="300" height="200">
              </li>
          </ul>
      </div>

      <!-- The little dots that tell you where you are -->
      <div gallery-indicators></div>

      <!-- Nav actions -->
      <div class="gallery-nav">
        <a ng-click="previousItem()">Previous</a>
        <a ng-click="nextItem()">Next</a>
      </div>
  </div>
```

Because AngularJS is awesome, you can markup the gallery items however you want (say, add captions to photos) as long as the directives and class names are in the right spots.

Similarly for navigation, just trigger `previousItem()/previousScreen()` or `nextItem()/nextScreen()` using directives like `ng-click` wherever you feel like it.


## Notes:
- This uses `display: inline-block` to inline the gallery items, so it does not like white spaces between `.gallery-item`s, and does not like IE7 and below very much.


## Todos:
- Tests
- Support `ng-animate`
- Keyboard nav support
- Figure out default/custom templates
