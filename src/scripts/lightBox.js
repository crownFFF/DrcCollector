import $ from 'jquery'

let scale = 1;
let isDragging = false
let startX, startY, initialX, initialY

$(".lightBoxImg img").on("mousedown", (e) => {
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  initialX = $(".lightBoxImg img").position().left
  initialY = $(".lightBoxImg img").position().top
  $(".lightBoxImg img").css('cursor', 'grabbing')
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

const maxScale = 2.5;
const scaleFactor = 0.1;
const lightBoxImg = $(".lightBoxImg")

lightBoxImg.on("wheel", (e) => {
  e.preventDefault()
  if (e.originalEvent.deltaY < 0) {
    scale = Math.min(maxScale, scale + scaleFactor)
  } else {
    scale = Math.max(1, scale - scaleFactor)
  }
  $(".lightBoxImg img").css('transform', `scale(${scale})`)
})

$('.exhibititem img').on('click', (e) => {
  const id = e.target.dataset.id
  $.ajax({
    url: 'https://drccollector.hopto.org:8090/preview/drccollectorapi.org/exhibits-item.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      id
    }),
    success: function (data) {
      const theme = data[0].theme
      const country_to = data[0].country_to || ''
      const country_from = data[0].country_from || ''
      const time = data[0].time || ''
      const remark = data[0].remark || ''
      const img = data[0].img
      $('.lightBoxInfo .theme').html(`主題:${theme}`)
      $('.lightBoxInfo .remark').html(`備註:<br>${remark}`)
      $('.lightBoxInfo .time').html(`年份:${time}`)
      $('.lightBoxImg img').attr('src', `https://drccollector.hopto.org/images/envelopes/${img}`)

      if (data.length > 1) {
        $('.secImg').css('display', 'flex')
        const imglist = $.map(data, (item) => {
          return item.img
        })
        for (let i = 0; i <= imglist.length; i++) {
          const newImg = $('<img>', {
            src: `https://drccollector.hopto.org/images/envelopes/${imglist[i]}`,
            alt:"",
            "data-id": "",
            draggable:"false",
          })
          $('.secImg').append(newImg)
        }
      }

    },
    error: function () {
      alert("系統目前無法連接後台資料庫")
    }
  })

  $('.lightBoxArea').css('display', 'block')
})

$('.lightBoxclose').on('click', (e) => {
  $('.lightBoxArea').css('display', 'none')
  $('.secImg img').remove()
  $(".lightBoxImg img").removeAttr('style')


})