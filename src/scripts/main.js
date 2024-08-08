import Swiper from 'swiper'
import ScrollReveal from 'scrollreveal'
import $ from 'jquery'
import 'slick-carousel'


// loading動畫
const data = sessionStorage.getItem("loading")
if (data == "ok") {
  $(".loadingArea").remove()
}
$(function () {
  const data = sessionStorage.getItem("loading")
  if (data != "ok") {
    $(".loadingArea").addClass("show")
    setTimeout(() => {
      $(".loadingArea").remove()
      sessionStorage.setItem("loading", "ok")
    }, 5000)
  }
})


// Swiper
const swiper = new Swiper('.swiper-container', {
  slidesPerView: 3,
  spaceBetween: 30,
  centeredSlides: true,
  loop: true,
  autoplay: true
})

// slick
$('.articleList').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  dots: false,
  vertical: true,
  verticalSwiping: true,
  autoplay: true,
  autoplaySpeed: 3000,
  infinite: true,
  arrows: false
})

// 點擊事件
$('.mobilemain').on('click', () => {
  $('.mobilemenu').fadeIn(100).addClass('show')
  $('.mobilemenu').css('display', 'block')
  $('body').css('overflow', 'hidden')
  return false
})

$('.closeBox').on('click', () => {
  $('.mobilemenu').fadeOut().removeClass('show')
  $('body').css('overflow', 'auto')
  return false
})

$('.searchIcon').on('click', () => {
  $('.search').css('height', '40px')
  $('.searchInput').trigger("focus")
  return false
})

$('.searchInput').on('blur', () => {
  $('.search').css('height', '0')
  return false
})

// ScrollReveal
document.addEventListener('DOMContentLoaded', function () {
  const sr = ScrollReveal({
    distance: '50px',
    duration: 500,
    easing: 'linear',
    mobile: false,
  })
  sr.reveal('[data-rs]', {
    origin: 'bottom'
  })

  sr.reveal('.articleInfo', {
    origin: 'right',
    viewOffset: {
      top: 0,
      right: 0,
      bottom: -600,
      left: 0,
    }
  })

  sr.reveal('.footerList li', {
    origin: 'top',
    viewFactor: 0.8,
    interval: 300,
    viewOffset: {
      top: 0,
      right: 0,
      bottom: -800,
      left: 0,
    },
  })

  sr.reveal('.loadingName span', {
    origin: 'bottom',
    viewFactor: 0.8,
    interval: 200,
    duration: 600,
  })

  sr.reveal('.loadingLine', {
    origin: 'bottom',
    viewFactor: 0.8,
    delay: 700,
    duration: 600,
  })
})

// import { createApp } from 'vue'
// import App from '../pages/about.vue'
// import router from '../routers/index'
// const app = createApp(App)
// app.use(router)
// app.mount('#about')

