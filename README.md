# angular-gallery-directive

This is a basic SEO-friendly gallery built on AngularJS. Unlike Bootstrap's carousel component, this works with html rendered on the server-side (instead of `ng-repeat`) so that search bots can crawl the gallery content. You may still use `ng-repeat` if you don't care about that.

No dependencies other than Angular 1.2+; likely IE9+ only.

Demo: http://fiestah.github.io/angular-gallery-directive/


## Install

```
bower install angular-gallery-directive
```


## Provided Directives
All are required to except for `gallery-indicators`.

- `gallery`: _attribute_ The root scope of the gallery.
- `gallery-window`: _attribute_ This "window" element should wrap `gallery-items` so that it limits the visible portion of the "film strip" by hiding the overflow.
- `gallery-item-list`: _attribute_ The "film strip" of the gallery, which is the parent element for all the gallery image/item elements.
- `gallery-item`: _attribute_ The individual gallery image/item element.
- `gallery-indicators`: _attribute_ _optional_ This generates the typical little round dots on galleries that tell you where in the gallery you're at. Click on it to scroll to the associated item.


## CSS and Classes
You'll need this [_minimal_ amount of CSS](src/angular-gallery-directive.css) to get it working. Remember to define the dimensions of your `[gallery-window]`, which can be either fixed or fluid in a responsive grid.

If you want margins between items, just add them in CSS:

``` css
[gallery-item] + [gallery-item] { margin-left: 20px; }
```


## `$scope` Functions

Call these anywhere within the scope of `gallery`:

### Scroll one item at a time:

- `scrollToIndex(index)`: Scroll to the numbered item
- `nextItem()`: Scroll to the next item. It will wrap from the last item to the first.
- `previousItem()`: Same as `next()`, but in reverse.

### Scroll several items at a time (when gallery is wider than a single item):

- `scrollToScreen(index)`
- `nextScreen()`
- `previousScreen()`

### Sugar to check if there’s a previous/next item/screen:

- `hasPreviousItem()`/`hasNextItem()`: Returns whether or not the currently selected item has a preceeding/next item
- `hasPreviousScreen()`/`hasNextScreen()`


## Barebones Example:

Your HTML should look something like this:

``` html
  <div gallery>
    <!-- The images -->
    <div gallery-window>
      <div gallery-item-list>
        <div gallery-item>
           <img src="/photo-1.jpg" width="300" height="200" alt="">
        </div>
        <div gallery-item>
           <img src="/photo-2.jpg" width="300" height="200" alt="">
        </div>
        <div gallery-item>
           <img src="/photo-3.jpg" width="300" height="200" alt="">
        </div>
      </div>
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

Because Angular is awesome, you can markup the gallery however you want (say, add captions to the photos or order elements differently) as long as the directives are declared at the right places.

Similarly for navigation, just trigger `previousItem()/previousScreen()` or `nextItem()/nextScreen()` using directives like `ng-click` wherever you feel like it.


## Notes:
- This uses `display: inline-block` to inline the gallery items, so watch out for white spaces/line breaks between `.gallery-item`s, which will introduce an extra 4px space between them.


## Todos:

- Support `ng-animate`
- Support `controller as` syntax
- Keyboard nav support
- Figure out default/custom templates
