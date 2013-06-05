angular.module('fiestah.gallery', [])

// Container directive for the items, navigation and nav dots container
// elements
.directive('gallery', function () {
  return {
    restrict: 'EA',
    controller: [
      '$scope', '$element', '$attrs', '$window',
      function ($scope, $element, $attrs, $window) {
        // Parse gallery height and width
        $scope.WIDTH = $attrs.galleryWidth;
        $scope.HEIGHT = $attrs.galleryHeight;
        $scope.selectedIndex = 0;
        $scope.selectedScreen = 0;

        var itemWidth = parseInt($attrs.galleryItemWidth, 10);

        // Get the number of fully-visible items in the gallery container
        function getNumPerScreen() {
          var viewportWidth = $element.width();
          return Math.floor(viewportWidth / itemWidth);
        }
        var numPerScreen = getNumPerScreen();

        // Adjust numPerScreen when the window gets resized if the gallery
        // width is not in fixed units
        // @todo: debounce the resize event
        if (/(%|em)$/.test($scope.WIDTH) {
          angular.element($window).bind('resize', function () {
            numPerScreen = getNumPerScreen();
          });
        }


        // Scroll by individual items
        $scope.scrollToItem = function (index) {
          $scope.selectedIndex = index;

          $scope.position = {
            left: -(itemWidth * index) + 'px'
          };
        };

        $scope.previousItem = function () {
          var numOfItems = $scope.items.length;
          var index = ($scope.selectedIndex === 0)
            ? $scope.items.length - 1
            : $scope.selectedIndex - 1;

          // Going from the first item to the last
          $scope.isWrappingPrevious = ($scope.selectedIndex === 0)
            && index === numOfItems - 1;
          $scope.isWrapping = $scope.isWrappingPrevious;

          $scope.scrollToItem(index);
        };

        $scope.nextItem = function () {
          // Going from the last item to the first
          var numOfItems = $scope.items.length;
          $scope.isWrappingNext = ($scope.selectedIndex === numOfItems - 1)
            && index === 0;
          $scope.isWrappingPrevious = $scope.isWrappingNext;

          $scope.scrollToItem(($scope.selectedIndex + 1) % $scope.items.length)
        };


        // Scroll by collection of items
        $scope.scrollToScreen = function (screenIndex) {
          var itemIndex = (screenIndex * numPerScreen);
          var numOfScreens = Math.ceil($scope.items.length / numPerScreen);

          $scope.selectedScreen = screenIndex;

          $scope.position = {
            left: -(itemWidth * numPerScreen * screenIndex) + 'px'
          };
        };

        $scope.previousScreen = function () {
          var numOfScreens = Math.ceil($scope.items.length / numPerScreen);
          var index = ($scope.selectedScreen === 0)
            ? numOfScreens - 1
            : $scope.selectedScreen - 1;

          // Going from the first screen to the last
          $scope.isWrappingPrevious = ($scope.selectedScreen === 0)
            && index === numOfScreens - 1;
          $scope.isWrapping = $scope.isWrappingPrevious;

          $scope.scrollToScreen(index);
        };

        $scope.nextScreen = function () {
          var numOfScreens = Math.ceil($scope.items.length / numPerScreen);
          var index = ($scope.selectedScreen + 1) % numOfScreens;

          // Going from the last screen to the first
          $scope.isWrappingNext = ($scope.selectedScreen === numOfScreens - 1)
            && index === 0;
          $scope.isWrapping = $scope.isWrappingNext;

          $scope.scrollToScreen(index);
        };

      }
    ]
  }
})

// Directive that shows the position of the currently selected item
.directive('galleryIndicators', function () {
  return {
    restrict: 'EA',
    require: '^gallery',
    template: '<a'
      + ' class="indicator"'
      + ' ng-repeat="item in items"'
      + ' ng-class="{selected: selectedIndex === $index}"'
      + ' ng-click="scrollTo({{$index}})"'
      + '><span class="num">{{$index + 1}}</span></a>'
  };
})

// Directive for container that contains all the scrollable items
.directive('galleryItems', function () {
  return {
    restrict: 'EA',
    require: '^gallery',
    link: function (scope, el, attrs) {
      // Frames the currently selected item on the film strip
      el.parent().css({
        width: scope.WIDTH,
        height: scope.HEIGHT
      });

      // Updates the posiiton of the film strip
      scope.$watch('position', function () {
        el.css(scope.position || {
          left: 0
        });
      });

    }
  };
});
