# angular-gallery-directive

This is a basic SEO-friendly gallery built on AngularJS. Unlike Bootstrap's carousel component, this works with html rendered on the server-side (instead of `ng-repeat`) so that search bots can crawl the gallery content. You may still use `ng-repeat` to render if you don't care about that.

It depends on jQuery for things like `element.position()` and `element.height()`. Likely IE8+ only.

<!-- [Full Demo](http://jsfiddle.net/thatmarvin/FhjBv/embedded/result/). -->


## Directives
All are required to except for `gallery-indicators`

- `gallery`: _attribute_ The root scope of the gallery.
- `gallery-window`: _attribute_ This "window" element should wrap `gallery-items` so that it limits the visible portion of the "film strip" by hiding the overflow.
- `gallery-item-list`: _attribute_ The "film strip" of the gallery, which is the parent element for all the gallery image/item elements.
- `gallery-indicators`: _element/attribute_ _optional_ This generates the typical little round dots on galleries that tell you where in the gallery you're at. Click on it to scroll to the associated item.


## CSS and Classes
You'll need this [_minimal_ amount of CSS](src/angular-gallery-directive.css) to get it working. All classes below are required to hook up the CSS:

- `.gallery-window`: The "window" that wraps the `.gallery-item-list`
- `.gallery-item-list`: The "filmstrip" that contains a bunch of `.gallery-item`s.
- `.gallery-item`: The item in the gallery. Could contain `<img>`s or any arbitrary html.

If you want margins between items, just add them in CSS:

``` css
.gallery-item + .gallery-item { margin-left: 20px; }
```

\* While it is possible add these classes via JS by default, you'd likely still want them in there on load anyway to minimize FOUC before JS kicks in.


## `$scope` functions
Call these anywhere within the `gallery` scope:

### Scroll one item at a time:
- `scrollToIndex(index)`: Scroll to the numbered item
- `nextItem()`: Scroll to the next item. It will wrap from the last item to the first.
- `previousItem()`: Same as `next()`, but in reverse.

### Scroll several items at a time (when gallery is wider than a single item):

- `scrollToScreen(index)`
- `nextScreen()`
- `previousScreen()`


## Barebones Example:
Your HTML should look something like:

``` html
  <div gallery class="gallery">
    <!-- The images -->
    <div gallery-window class="gallery-window">
      <ul gallery-item-list class="gallery-item-list">
        <li class="gallery-item">
           <img src="/photo-1.jpg" width="300" height="200" alt="">
        </li>
        <li class="gallery-item">
           <img src="/photo-2.jpg" width="300" height="200" alt="">
        </li>
        <li class="gallery-item">
           <img src="/photo-3.jpg" width="300" height="200" alt="">
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

Because AngularJS is awesome, you can markup the gallery however you want (say, add captions to the photos or order elements differently) as long as the directives and class names are at the right places.

Similarly for navigation, just trigger `previousItem()/previousScreen()` or `nextItem()/nextScreen()` using directives like `ng-click` wherever you feel like it.


## Notes:
- This uses `display: inline-block` to inline the gallery items, so watch out for white spaces/line breaks between `.gallery-item`s, which will introduce extra space between the them.


## Todos:
- Tests
- Support `ng-animate`
- Support `controller as` syntax
- Keyboard nav support
- Figure out default/custom templates
