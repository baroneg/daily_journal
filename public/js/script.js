let sidebarToggle = document.querySelector(".sidebarToggle");

  sidebarToggle.addEventListener("click", function() {
    document.querySelector("body").classList.toggle("active");
    document.getElementById("sidebarToggle").classList.toggle("active");
    document.getElementById("footer").classList.toggle("active");

 });

$(function(){
  let current = window.location.pathname;

  $('.navigation-list li a').each(function(){
      let $this = $(this);
      if($this.attr('href') === current){
          $this.addClass("active");
      } else {
        $this.removeClass("active");
      }
  });
});







