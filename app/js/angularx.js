


angular.module('x',[])
.directive('template',['$http', '$templateCache', '$anchorScroll', '$compile', 
                 function($http,   $templateCache,   $anchorScroll,   $compile) {
  return {
    restrict: 'ECA',
    terminal: true,
    compile: function(element, attr) {
      var srcExp = attr.template || attr.src,
          onloadExp = attr.onload || '',
          autoScrollExp = attr.autoscroll;
      var childlink = $compile(element.contents())       
      return function(scope, element) {
        var changeCounter = 0,
            childScope;

        var clearContent = function() {
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }

          element.html('');
        };

        scope.$watch(srcExp, function templateWatchAction(src) {
          var thisChangeId = ++changeCounter;

          if (src) {
            $http.get(src, {cache: $templateCache}).success(function(response) {
              if (thisChangeId !== changeCounter) return;

              if (childScope) childScope.$destroy();
              childScope = scope.$new();
              element.html(response);
              
              $compile(element.contents())(childScope);
              childlink(scope)
              if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                $anchorScroll();
              }

              childScope.$emit('$templateContentLoaded');
              scope.$eval(onloadExp);
            }).error(function() {
              if (thisChangeId === changeCounter) clearContent();
            });
          } else clearContent();
        });
      };
    }
  };
}])



.directive('include',[ '$rootScope',
                 function($rootScope) {
  return {
    restrict: 'ECA',
    terminal: true,
    link: function(scope, element, attr)  {
      var target = attr.name;      
      $rootScope[target]=element;
      }
    
  };
}])


.directive('define',[ '$rootScope','$compile', 
                 function($rootScope,$compile) {
  return {
    restrict: 'ECA',
    terminal: true,
    compile: function(element, attr){
      var target=attr.name;
      var content = element.html();
    return function(scope, element, attr) {
        var targetElement=$rootScope[target];
        targetElement.html(content);
        var link = $compile(element.contents())(scope);                   
          
        
    }
  }
  };
}])  ;





