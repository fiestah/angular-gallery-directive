angular.module('fiestah.gallery', [])

// Container directive for the items, navigation and nav dots container
// elements
.directive('gallery', function () {
  function link(scope, element, attrs) {
    scope.selectedIndex  = 0;
    scope.selectedScreen = 0;


    // If item elements are built using ng-repeat, they won't be rendered
    // yet at the time of directive compilation. This is why getItems() and
    // functions depending on it cannot be called immediately on load.
    function getItems() {
      return element.find('[gallery-item-list]').children();
    }

    // Get the offset position of a particular item
    function getItemOffset(index) {
      return getItems()[index].offsetLeft;
    }

    // Get the number of fully-visible items in the gallery container
    function getNumPerScreen() {
      // Get dimensions on demand to account for screen resizes
      var visibleWidth = element.width();
      var items        = getItems();

      for (var i=0; i<items.length; i++) {
        if (getItemOffset(i) + $(items[i]).width() > visibleWidth) {
          return i;
        }
      }
    }


    // Scroll by individual items
    scope.scrollToItem = function (index) {
      scope.selectedIndex = index;
      scope.position = {
        left: -(getItemOffset(index)) + 'px'
      };
    };

    scope.previousItem = function () {
      var numOfItems = getItems().length;
      var index = (scope.selectedIndex === 0)
        ? numOfItems - 1
        : scope.selectedIndex - 1;

      // Going from the first item to the last
      scope.isWrappingPrevious = (scope.selectedIndex === 0)
        && index === numOfItems - 1;
      scope.isWrapping = scope.isWrappingPrevious;

      scope.scrollToItem(index);
    };
    
    scope.hasPreviousItem = function () {
      return scope.selectedIndex !== 0;
    };

    scope.hasNextItem = function () {
      var numPerScreen = getNumPerScreen(),
      numOfItems = getItems().length;
      return ( (numOfItems - 1) - scope.selectedIndex ) > numPerScreen;
    };
    

    scope.nextItem = function () {
      // Going from the last item to the first
      var numOfItems = getItems().length;
      scope.isWrappingNext = (scope.selectedIndex === numOfItems - 1);
      scope.isWrapping = scope.isWrappingNext;

      scope.scrollToItem((scope.selectedIndex + 1) % numOfItems)
    };


    // Scroll by collection of items
    scope.scrollToScreen = function (screenIndex) {
      var numOfItems = getItems().length;
      var numPerScreen = getNumPerScreen();
      var itemIndex = (screenIndex * numPerScreen);
      var numOfScreens = Math.ceil(numOfItems / numPerScreen);

      scope.selectedScreen = screenIndex;

      scope.position = {
        left: -(getItemOffset(numPerScreen * screenIndex)) + 'px'
      };
    };

    scope.previousScreen = function () {
      var numOfItems = getItems().length;
      var numOfScreens = Math.ceil(numOfItems / getNumPerScreen());
      var index = (scope.selectedScreen === 0)
        ? numOfScreens - 1
        : scope.selectedScreen - 1;

      // Going from the first screen to the last
      scope.isWrappingPrevious = (scope.selectedScreen === 0)
        && index === numOfScreens - 1;
      scope.isWrapping = scope.isWrappingPrevious;

      scope.scrollToScreen(index);
    };

    scope.nextScreen = function () {
      var numOfItems = getItems().length;
      var numOfScreens = Math.ceil(numOfItems / getNumPerScreen());
      var index = (scope.selectedScreen + 1) % numOfScreens;

      // Going from the last screen to the first
      scope.isWrappingNext = (scope.selectedScreen === numOfScreens - 1)
        && index === 0;
      scope.isWrapping = scope.isWrappingNext;

      scope.scrollToScreen(index);
    };
  }

  return {
    restrict: 'A',
    link: link
  };
})

// Directive that shows the position of the currently selected item
.directive('galleryIndicators', function () {
  return {
    restrict: 'EA',
    template: '<a'
      + ' class="indicator"'
      + ' ng-repeat="item in items"'
      + ' ng-class="{selected: selectedIndex === $index}"'
      + ' ng-click="scrollTo({{$index}})"'
      + '><span class="num">{{$index + 1}}</span></a>'
  };
})

// The visible area of the "window" that frames the "film strip"
.directive('galleryWindow', ['$interval', function ($interval) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      // Frames the currently selected item on the film strip. Polling here is
      // needed when waiting for ng-repeat to finish rendering so we can set
      // the visible area to the height of the film strip
      var filmStripEl = $(element.children()[0]);
      var i = 0;
      var poll = $interval(function () {
        var height = filmStripEl.height();
        i++; // Keep a counter to give up after 5s

        if (height > 0 || i >= 20) {
          element.css({ height: height });
          $interval.cancel(poll);
        }
      }, 250);
    }
  };
}])

// Directive for the "film strip" parent element which contains all the
// scrollable items
.directive('galleryItemList', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      // Updates the posiiton of the film strip
      scope.$watch('position', function () {
        element.css(scope.position || {
          left: 0
        });
      });
    }
  };
});
