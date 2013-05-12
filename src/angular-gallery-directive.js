angular.module('fiestah.gallery', [])

// Container directive for the items, navigation and nav dots container
// elements
.directive('gallery', function () {
  return {
    restrict: 'EA',
    controller: [
      '$scope', '$element', '$attrs',
      function ($scope, $element, $attrs) {
        // Parse gallery height and width
        $scope.WIDTH = parseInt($attrs.galleryWidth, 10);
        $scope.HEIGHT = parseInt($attrs.galleryHeight, 10);
        $scope.selectedIndex = 0;

        $scope.scrollTo = function (index) {
          var numOfItems = $scope.items.length;

          // Going from the last item to the first
          $scope.isWrappingNext = ($scope.selectedIndex === numOfItems - 1)
            && index === 0;

          // Going from the first item to the last
          $scope.isWrappingPrevious = ($scope.selectedIndex === 0)
            && index === numOfItems - 1;

          // Either way
          $scope.isWrapping = $scope.isWrappingNext
            || $scope.isWrappingPrevious
            || false;

          $scope.selectedIndex = index;
          $scope.position = {
            left: ($scope.WIDTH * index * -1) + 'px'
          };
        };

        $scope.previous = function () {
          var index = ($scope.selectedIndex === 0)
            ? $scope.items.length
            : $scope.selectedIndex;

          $scope.scrollTo(index - 1);
        };

        $scope.next = function () {
          $scope.scrollTo(($scope.selectedIndex + 1) % $scope.items.length)
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

// Directive for container that has all the items. All this really does is
// setting the size of the film strip viewport
.directive('galleryItems', function () {
  return {
    restrict: 'EA',
    require: '^gallery',
    link: function (scope, el, attrs) {
      // Frames the currently selected item on the film strip
      el.parent().css({
        width: scope.WIDTH + 'px',
        height: scope.HEIGHT + 'px'
      })
    }
  };
});
