describe('angular-gallery-directive', function () {
  describe('with ng-repeat', function () {
    runTests('test/fixtures/gallery-ng-repeat.html');
  });

  describe('with served html', function () {
    runTests('test/fixtures/gallery-served.html');
  });
});


function runTests(fixture) {
  var element;

  function getOffset() {
    return element.find('[gallery-item-list]').css('left');
  }

  function getItems() {
    return element.find('[gallery-item]');
  }

  function getItemWidth() {
    return getItems().first().width();
  }

  beforeEach(module('fiestah.gallery'));
  beforeEach(module(fixture));
  beforeEach(inject(function ($compile, $rootScope, $templateCache) {
    this.$scope = $rootScope.$new();
    this.$scope.images = [1, 2, 3, 4, 5, 6];

    element = angular.element($templateCache.get(fixture));
    $compile(element)(this.$scope);


    // Append gallery to dom for CSS to take effect
    angular.element(document).find('body').append(element);

    this.$scope.$digest();
  }));

  afterEach(function () {
    element.remove();
  });

  it('defaults to showing the first image', function () {
    expect(getOffset()).to.equal('0px');
  });

  describe('scrolling items', function () {
    describe('scrollToItem(n)', function () {
      var n = 2;

      it('shows the n-th item', function () {
        this.$scope.scrollToItem(n);
        this.$scope.$digest();

        expect(getOffset()).to.equal(-n * getItemWidth() + 'px');
      });
      it('resets isWrapping', inject(function ($timeout) {
        // Trigger wrapping first
        this.$scope.previousItem();
        this.$scope.$digest();

        // Scroll to item
        this.$scope.scrollToItem(n);
        this.$scope.$digest();
        $timeout.flush();

        expect(this.$scope.isWrapping).to.be.false;
      }));
    });

    describe('previousItem()', function () {
      it('shows the previous item', function () {
        // Go to the last item
        this.$scope.nextItem();
        this.$scope.$digest();

        // Then go to the next item
        this.$scope.previousItem();
        this.$scope.$digest();

        expect(getOffset()).to.equal('0px');
      });
      describe('on the first item', function () {
        beforeEach(function () {
          this.$scope.previousItem();
          this.$scope.$digest();
        });
        it('wraps to the the last item', function () {
          expect(getOffset()).to.equal(-(getItems().length - 1) * getItemWidth() + 'px');
        });
        it('sets isWrapping to true', function () {
          expect(this.$scope.isWrappingPrevious).to.be.true;
          expect(this.$scope.isWrapping).to.be.true;
        });
      });

    });

    describe('nextItem()', function () {
      it('shows the next item', function () {
        this.$scope.nextItem();
        this.$scope.$digest();

        expect(getOffset()).to.equal(-getItemWidth() + 'px');
      });

      describe('on the last item', function () {
        beforeEach(function () {
          // Go to the last item
          this.$scope.previousItem();
          this.$scope.$digest();

          // Then go to the next item
          this.$scope.nextItem();
          this.$scope.$digest();
        });
        it('wraps to the the first item', function () {
          expect(getOffset()).to.equal('0px');
        });
        it('sets isWrapping to true', function () {
          expect(this.$scope.isWrappingNext).to.be.true;
          expect(this.$scope.isWrapping).to.be.true;
        });
      });
    });

    describe('hasPreviousItem()', function () {
      describe('on the first item', function () {
        it('returns false', function () {
          expect(this.$scope.hasPreviousItem()).to.be.false;
        });
      });
      describe('on the other items', function () {
        it('returns true', function () {
          this.$scope.nextItem();
          this.$scope.$digest();

          expect(this.$scope.hasPreviousItem()).to.be.true;
        });
      });
    });

    describe('hasNextItem()', function () {
      describe('on the last item', function () {
        it('returns false', function () {
          this.$scope.previousItem();
          this.$scope.$digest();

          expect(this.$scope.hasNextItem()).to.be.false;
        });
      });
      describe('on the other items', function () {
        it('returns true', function () {
          expect(this.$scope.hasNextItem()).to.be.true;
        });
      });
    });
  });


  describe('scrolling screens', function () {
    beforeEach(function () {
      // Fits 2.x items
      element.width(750);
    });

    describe('scrollToScreen(n)', function () {
      it('shows the n-th screen', function () {
        // Go the 2nd screen
        this.$scope.scrollToScreen(1);
        this.$scope.$digest();

        // Shows the 3rd item (which was cut off in the first screen)
        expect(getOffset()).to.equal('-600px');
      });
    });

    describe('previousScreen()', function () {
      it('shows the previous screen', function () {
        this.$scope.nextScreen();
        this.$scope.$digest();

        this.$scope.previousScreen();
        this.$scope.$digest();

        expect(getOffset()).to.equal('0px');
      });

      describe('on the first screen', function () {
        beforeEach(function () {
          this.$scope.previousScreen();
          this.$scope.$digest();
        });
        it('wraps to the last screen', function () {
          expect(getOffset()).to.equal('-1200px');
        });
        it('sets isWrapping to true', function () {
          expect(this.$scope.isWrappingPrevious).to.be.true;
          expect(this.$scope.isWrapping).to.be.true;
        });
      });
    });

    describe('nextScreen()', function () {
      it('shows the next screen', function () {
        this.$scope.nextScreen();
        this.$scope.$digest();

        expect(getOffset()).to.equal('-600px');
      });

      describe('on the last screen', function () {
        beforeEach(function () {
          this.$scope.previousScreen();
          this.$scope.$digest();

          this.$scope.nextScreen();
          this.$scope.$digest();
        });
        it('wraps to the first screen', function () {
          expect(getOffset()).to.equal('0px');
        });
        it('sets isWrapping to true', function () {
          expect(this.$scope.isWrappingNext).to.be.true;
          expect(this.$scope.isWrapping).to.be.true;
        });
      });
    });

    describe('hasPreviousScreen()', function () {
      describe('on the first screen', function () {
        it('returns false', function () {
          expect(this.$scope.hasPreviousScreen()).to.be.false;
        });
      });
      describe('on the other screens', function () {
        it('returns true', function () {
          this.$scope.nextScreen();
          this.$scope.$digest();

          expect(this.$scope.hasPreviousScreen()).to.be.true;
        });
      });
    });

    describe('hasNextScreen()', function () {
      describe('on the last screen', function () {
        it('returns false', function () {
          this.$scope.previousScreen();
          this.$scope.$digest();

          expect(this.$scope.hasNextScreen()).to.be.false;
        });
      });
      describe('on the other screens', function () {
        it('returns true', function () {
          expect(this.$scope.hasNextScreen()).to.be.true;
        });
      });
    });
  });

  describe('position indicators', function () {
    it('marks the selected item on init', function () {
      expect($('.indicator').first().hasClass('selected')).to.be.true;
    });
    it('marks the selected item on change', function () {
      var n = 4;
      this.$scope.scrollToItem(n)
      this.$scope.$digest();

      expect($('.indicator').eq(n).hasClass('selected')).to.be.true;
    });
  });

}
