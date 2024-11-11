import $ from 'jquery'
// -------------------------------------

let scale = 1
let isDragging = false
let startX, startY, initialX, initialY

// 滑鼠事件
$(".lightBoxImg img").on("mousedown", (e) => {
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  initialX = $(".lightBoxImg img").position().left
  initialY = $(".lightBoxImg img").position().top
  $(".lightBoxImg img").css('cursor', 'grabbing')
  e.preventDefault()
})

$(window).on('mousemove', (e) => {
  if (isDragging) {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    $(".lightBoxImg img").css({
      left: initialX + dx / scale + 'px',
      top: initialY + dy / scale + 'px'
    })

  }
})

$(window).on('mouseup', (e) => {
  isDragging = false
  $(".lightBoxImg img").css('cursor', 'grab')
})

// 觸碰事件
$(".lightBoxImg img").on("touchstart", (e) => {
  const touch = e.touches[0]

  isDragging = true
  startX = touch.clientX
  startY = touch.clientY
  initialX = $(".lightBoxImg img").position().left
  initialY = $(".lightBoxImg img").position().top
  $(".lightBoxImg img").css('cursor', 'grabbing')

  e.preventDefault()
})

$(window).on("touchmove", (e) => {
  if (isDragging) {
    const touch = e.touches[0]
    const dx = (touch.clientX - startX) / scale
    const dy = (touch.clientY - startY) / scale


    const newLeft = initialX + dx
    const newTop = initialY + dy

    $(".lightBoxImg img").css({
      left: newLeft + 'px',
      top: newTop + 'px'
    })
  }
})

$(window).on("touchend", () => {
  if (isDragging) {
    isDragging = false
    $(".lightBoxImg img").css('cursor', 'grab')
  }
})

// 放大
const maxScale = 2.5
const scaleFactor = 0.1
const lightBoxImg = $(".lightBoxImg")

// 滾輪
lightBoxImg.on("wheel", (e) => {
  e.preventDefault()
  if (e.originalEvent.deltaY < 0) {
    scale = Math.min(maxScale, scale + scaleFactor)
  } else {
    scale = Math.max(1, scale - scaleFactor)
  }
  $(".lightBoxImg img").css('transform', `scale(${scale})`)
})

$('.lightBoxclose').on('click', (e) => {
  $('.lightBoxArea').css('display', 'none')
  $('.secImg img').remove()
  $('.time').html('')
  $('.theme').html('')
  $('.country_from').html('')
  $('.country_to').html('')
  $('.remark').html('')
  $(".lightBoxImg img").removeAttr('style')
  document.documentElement.style.overflow = 'auto'
})