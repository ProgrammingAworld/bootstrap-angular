myApp.directive('cartInfor',function() {
   return{
      restrict:'EAC',
      templateUrl:'/js/tpls/cartInfor.html',
      replace:true,
      scope:true,
      link:function (scope,elem,attrs) {
         // if(attrs.isShow=='true'){
         //    scope.isShow=true;
         // }
      },
      controller:function ($scope) {
         // $scope.isShow=false;
      }
   }
})
