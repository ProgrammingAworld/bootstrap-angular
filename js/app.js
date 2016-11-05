var myApp=angular.module('myApp',['ui.router']);

myApp.config(function ($urlRouterProvider) {
   $urlRouterProvider.otherwise('/list');
});
myApp.config(['$stateProvider',function ($stateProvider) {
   $stateProvider
   .state('list',{
      url:'/list',
      templateUrl:'/js/tpls/list.html',
      controller:'listController'
   })
   .state('detail',{
      url:'/detail/:id',
      templateUrl:'/js/tpls/detail.html',
      controller:'detailController'
   })
   .state('cart',{
      url:'/cart',
      templateUrl:'/js/tpls/cart.html',
      controller:'cartController'
   })
   .state('cart.pay',{
      url:'/pay',
      templateUrl:'/js/tpls/pay.html',
      controller:'payController'
   })
}]);

myApp.controller('listController',['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
   $rootScope.goods=[];
   $rootScope.totalPrice=0;
   $rootScope.totalNum=0
   $http({
      url:'/mock/list.json'
   })
   .then(function(res) {
      $rootScope.items=res.data.data;
      $rootScope.content=res.data.content;
      $rootScope.proportion=res.data.proportion;
      if (localStorage.getItem('goods')) {
         $rootScope.goods=JSON.parse(localStorage.getItem('goods'));
         getTotalInfor();
      }
   });
   $scope.add=function(id,price){
      var flag=true;
      var good={
         id:id,
         price:price,
         num:1
      };
      for (var i = 0; i < $rootScope.goods.length; i++) {
         if ($rootScope.goods[i].id==id) {
             $rootScope.goods[i].num=$rootScope.goods[i].num+1;
            flag=false;
         }
      }
      if (flag) {
         $rootScope.goods.push(good);
      }
      save();
      getTotalInfor();
   }
   var save=function () {
      var goods=JSON.stringify($rootScope.goods);
      localStorage.setItem('goods',goods);
   }
   var getTotalInfor=function () {
      $rootScope.totalPrice=0;
      $rootScope.totalNum=0;
      for (var i = 0; i < $rootScope.goods.length; i++) {
         $rootScope.totalPrice=$rootScope.totalPrice+$rootScope.goods[i].price*$rootScope.goods[i].num;
         $rootScope.totalNum=$rootScope.totalNum+$rootScope.goods[i].num;
      }
   }
}]);

myApp.controller('detailController',['$scope','$rootScope','$stateParams','$http',function($scope,$rootScope,$stateParams){
   var id=$stateParams.id;
   $scope.content=$rootScope.content;
   $scope.proportion=$rootScope.proportion;

   for (var i = 0; i < $rootScope.items.length; i++) {
      if ($rootScope.items[i].id==id) {
         $scope.item=$rootScope.items[i];
         break;
      }
   }
   console.log($scope.item);
   $scope.addToCart=function(id,price){
      console.log(id+" "+price);
      var flag=true;
      var good={
         id:id,
         price:price,
         num:1
      };
      for (var i = 0; i < $rootScope.goods.length; i++) {
         if ($rootScope.goods[i].id==id) {
             $rootScope.goods[i].num=$rootScope.goods[i].num+1;
            flag=false;
         }
      }
      if (flag) {
         $rootScope.goods.push(good);
      }
      save();
      getTotalInfor();
   }
   $scope.remove=function (id) {
      for (var i = 0; i < $rootScope.goods.length; i++) {
         if ($rootScope.goods[i].id==id) {
            $rootScope.goods.splice(i,1);
         }
      }
      save();
      getTotalInfor();
   }

   $scope.home=function () {
      window.location.href="";
   }
   var save=function () {
      if ($rootScope.goods.length==0) {
         localStorage.clear();
      }else {
         var goods=JSON.stringify($rootScope.goods);
         localStorage.setItem('goods',goods);
      }
   }
   var getTotalInfor=function () {
      $rootScope.totalPrice=0;
      $rootScope.totalNum=0;
      for (var i = 0; i < $rootScope.goods.length; i++) {
         $rootScope.totalPrice=$rootScope.totalPrice+$rootScope.goods[i].price*$rootScope.goods[i].num;
         $rootScope.totalNum=$rootScope.totalNum+$rootScope.goods[i].num;
      }
   }
}])

myApp.controller('cartController',["$scope",'$rootScope',function ($scope,$rootScope) {
   $rootScope.showPay=false;
   var getTotalInfor=function () {
      $rootScope.totalPrice=0;
      $scope.totalNum=0;
      for (var i = 0; i < $scope.goods.length; i++) {
         $rootScope.totalPrice=$rootScope.totalPrice+$scope.goods[i].price*$scope.goods[i].num;
         $scope.totalNum=$scope.totalNum+$scope.goods[i].num;
      }
   }
   var save=function () {
      if ($scope.goods.length==0) {
         localStorage.clear();
      }else {
         var goods=JSON.stringify($scope.goods);
         localStorage.setItem('goods',goods);
      }
   }

   $scope.isShow=false;
   if (localStorage.getItem('goods')) {
      $scope.goods=JSON.parse(localStorage.getItem('goods'));
      getTotalInfor();
   }else {
      $scope.isShow=true;
   }
   $scope.increase=function(id,num){
      for (var i = 0; i < $scope.goods.length; i++) {
         if ($scope.goods[i].id==id) {
            $scope.goods[i].num=$scope.goods[i].num+1;
            getTotalInfor();
            save();
            break;
         }
      }
   }
   $scope.decrease=function(id,num){
      for (var i = 0; i < $scope.goods.length; i++) {
         if ($scope.goods[i].id==id) {
            if ($scope.goods[i].num>1) {
               $scope.goods[i].num=$scope.goods[i].num-1;
               getTotalInfor();
               save();
               break;
            }
         }
      }
   }
   $scope.delate=function (id) {
      for (var i = 0; i < $scope.goods.length; i++) {
         if ($scope.goods[i].id==id) {
            $scope.goods.splice(i,1);
            if ($scope.goods.length==0) {
               localStorage.clear();
               $scope.isShow=true;
            }
            save();
            getTotalInfor();
         }
      }
   }
   $scope.changeNum=function (id) {
      for (var i = 0; i < $scope.goods.length; i++) {
         if ($scope.goods[i].id==id) {
            if ($scope.goods[i].num<=1) {
               $scope.goods[i].num=1;
               save();
            }
            getTotalInfor();
         }
      }
   }
   $scope.clearCart=function functionName(){
      $scope.isShow=true;
      $scope.goods=[];
      localStorage.clear();
      $rootScope.totalPrice=0;
      $scope.totalNum=0;
      getTotalInfor();
   }
}]);
myApp.controller('payController',["$scope",'$rootScope',function ($scope,$rootScope) {
   $scope.pay1=false;
   $scope.pay2=false;
   $rootScope.showPay=true;
   $scope.showApliay=function() {
      $scope.pay1=true;
      $scope.pay2=false;
   }
   $scope.showWechat=function() {
      $scope.pay1=false;
      $scope.pay2=true;
   }
}])
