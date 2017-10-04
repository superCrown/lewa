$(function () {
    $(document).ready(function () {
  $(".dropdown-menu").mouseenter(function (){
    $(this).parents("li").addClass('openToggle');
  });
  $(".dropdown-menu").mouseleave(function (){
    $(this).parents("li").removeClass('openToggle');
  });
  $(".dropdown").mouseenter(function (){
    $(this).addClass('openToggle');
  });
  $(".dropdown").mouseleave(function (){
    $(this).removeClass('openToggle');
  });
  });
});