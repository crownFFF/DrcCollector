import $ from 'jquery'
// -------------------------------------

let scale = 1
let isDragging = false
let startX, startY, initialX, initialY

$(".lightBoxImg img").on("mousedown", (e) => {
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  initialX = $(".lightBoxImg img").position().left
  initialY = $(".lightBoxImg img").position().top
  $(".lightBoxImg img").css('cursor', 'grabbing')
  e.preventDefault()
})

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


$(window).on('mouseup', (e) => {
  isDragging = false
  $(".lightBoxImg img").css('cursor', 'grab')
})

$(window).on("touchend", () => {
  if (isDragging) {
    isDragging = false
    $(".lightBoxImg img").css('cursor', 'grab')
  }
})


const maxScale = 2.5
const scaleFactor = 0.1
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

$('.lightBoxclose').on('click', (e) => {
  $('.lightBoxArea').css('display', 'none')
  $('.secImg img').remove()
  $('.time').html('')
  $('.theme').html('')
  $('.country_from').html('')
  $('.country_to').html('')
  $('.remark').html('')
  $('body').css('overflow', 'auto')
  $(".lightBoxImg img").removeAttr('style')

})

const page = window.location.pathname.split('/')
const $lightBoxInfo = $('.lightBoxInfo')
const $lightBoxImg = $('.lightBoxImg img')
const $secImg = $('.secImg')
let countryData = []
let yearData = []

if (page.includes('Stamp')) {

  // 所有郵票列表
  $.ajax({
    url: 'https://drc-api.hopto.org/api/exhibits-stamp.php',
    type: 'POST',
    contentType: 'application/json',
  }).done((data) => {

    // 渲染郵票列表
    data.forEach(item => {
      const bigDiv = $('<div>', {
        class: 'exhibititem'
      })
      const smallDiv = $('<div>', {
        class: 'exhibitTitle'
      })
      const img = $('<img>', {
        src: `https://drccollector.hopto.org/images/stamps/${item.img}`,
        alt: "",
        'data-id': `${item.id}`,
        draggable: "false"
      })

      const year = $('<p>')
      year.html(item.year ? `年份:${item.year}` : '年份:無')
      smallDiv.append(year)
      bigDiv.append(img, smallDiv)
      $('.exhibitList').append(bigDiv)
    })

    // 郵票圖片點擊燈箱
    $('.exhibititem img').on('click', (e) => {
      const id = e.target.dataset.id
      $('body').css('overflow', 'hidden')

      // 郵票燈箱內容
      $.ajax({
        url: 'https://drc-api.hopto.org/api/exhibits-stamp.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id })
      }).done(function (data) {
        const item = data[0]
        item.price = item.price ? item.price : ''
        item.unit = item.unit ? item.unit : ''

        $lightBoxInfo.find('.theme').html(`面額:${item.price + item.unit}`)
        $lightBoxInfo.find('.remark').html(`備註:<br>${item.remark || ''}`)
        $lightBoxInfo.find('.time').html(`年份:${item.year || ''}`)
        $lightBoxImg.attr('src', `https://drccollector.hopto.org/images/stamps/${item.img}`)

        $secImg.css('display', 'flex').empty()
        data.forEach((imgItem) => {
          const newImg = $('<img>', {
            src: `https://drccollector.hopto.org/images/stamps/${imgItem.img}`,
            alt: "",
            "data-id": "",
            draggable: "false",
            class: "littleImg"
          })
          $secImg.append(newImg)
        })


        $('.littleImg').on('click', (e) => {
          scale = 1
          $lightBoxImg.removeAttr('style').attr('src', e.target.src)
        })

        return loadCountryInfoStamp(item.country_id || '')

      }).fail(function () {
        alert("系統目前無法連接後台資料庫")
      })

      $('.lightBoxArea').css('display', 'block')

    })

    // checkbox
    data.filter((item) => {
      countryData.push(item.country_id)
      yearData.push(item.year)
    })
    countryData = [...new Set(countryData)]
    yearData = [...new Set(yearData)].sort()

    // checkbox年分篩選
    yearData.forEach((item) => {
      const option = $('<option>', {
        text: item || '不明',
        value: item
      })
      $('form .form_year #year').append(option)
    })
    // checkbox國家篩選
    $.ajax({
      url: 'https://drc-api.hopto.org/api/exhibits-country.php',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ country_list: countryData })
    }).done(function (data) {
      data.forEach((item) => {
        const option = $('<option>', {
          text: item.c_name,
          value: item.id
        })
        $('form .form_country #country').append(option)
      })

    })

  }).fail(() => {
    alert("系統目前無法連接後台資料庫")
  })

  document.querySelector('#formArea').addEventListener('submit', (e) => {
    e.preventDefault()
  
    const country = document.querySelector('#country').value
    const year = document.querySelector('#year').value
  
    $.ajax({
      url: 'https://drc-api.hopto.org/api/exhibits-selectStamp.php',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ country, year })
    }).done((data) => {
  
      $('.exhibititem').remove()
  
      if (data) {
        data.forEach(item => {
          const bigDiv = $('<div>', {
            class: 'exhibititem'
          })
          const smallDiv = $('<div>', {
            class: 'exhibitTitle'
          })
          const img = $('<img>', {
            src: `https://drccollector.hopto.org/images/stamps/${item.img}`,
            alt: "",
            'data-id': `${item.id}`,
            draggable: "false"
          })
  
          const year = $('<p>')
          year.html(item.year ? `年份:${item.year}` : '年份:無')
          smallDiv.append(year)
          bigDiv.append(img, smallDiv)
          $('.exhibitList').append(bigDiv)
        })
        // 郵票圖片點擊燈箱
        $('.exhibititem img').on('click', (e) => {
          const id = e.target.dataset.id
          $('body').css('overflow', 'hidden')
  
          // 郵票燈箱內容
          $.ajax({
            url: 'https://drc-api.hopto.org/api/exhibits-stamp.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id })
          }).done(function (data) {
            const item = data[0]
            item.price = item.price ? item.price : ''
            item.unit = item.unit ? item.unit : ''
  
            $lightBoxInfo.find('.theme').html(`面額:${item.price + item.unit}`)
            $lightBoxInfo.find('.remark').html(`備註:<br>${item.remark || ''}`)
            $lightBoxInfo.find('.time').html(`年份:${item.year || ''}`)
            $lightBoxImg.attr('src', `https://drccollector.hopto.org/images/stamps/${item.img}`)
  
            $secImg.css('display', 'flex').empty()
            data.forEach((imgItem) => {
              const newImg = $('<img>', {
                src: `https://drccollector.hopto.org/images/stamps/${imgItem.img}`,
                alt: "",
                "data-id": "",
                draggable: "false",
                class: "littleImg"
              })
              $secImg.append(newImg)
            })
  
  
            $('.littleImg').on('click', (e) => {
              scale = 1
              $lightBoxImg.removeAttr('style').attr('src', e.target.src)
            })
  
            return loadCountryInfoStamp(item.country_id || '')
  
          }).fail(function () {
            alert("系統目前無法連接後台資料庫")
          })
  
          $('.lightBoxArea').css('display', 'block')
  
        })
      } else {
        alert("查無資料")
      }
  
    }).fail(() => {
      alert("系統目前無法連接後台資料庫")
    })
  })

} else {
  // 所有信封列表
  $.ajax({
    url: 'https://drc-api.hopto.org/api/exhibits-item.php',
    type: 'POST',
    contentType: 'application/json',
  }).done((data) => {
    const List = data.filter((item) => {
      return page.includes(item.typeEN)
    })

    // 渲染信封列表
    List.forEach(item => {
      const bigDiv = $('<div>', {
        class: 'exhibititem'
      })
      const smallDiv = $('<div>', {
        class: 'exhibitTitle'
      })
      const img = $('<img>', {
        src: `https://drccollector.hopto.org/images/envelopes/${item.img}`,
        alt: "",
        'data-id': `${item.id}`,
        draggable: "false"
      })

      const theme = $('<p>')
      theme.html(item.theme ? `主題:${item.theme}` : '')

      const time = $('<p>')
      time.html(item.time ? `年份:${item.time}` : '')

      smallDiv.append(theme, time)
      bigDiv.append(img, smallDiv)
      $('.exhibitList').append(bigDiv)

    })

    // 信封圖片點擊燈箱
    $('.exhibititem img').on('click', (e) => {
      const id = e.target.dataset.id
      $('body').css('overflow', 'hidden')
      $.ajax({
        url: 'https://drc-api.hopto.org/api/exhibits-item.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id })
      }).done(function (data) {
        const item = data[0]
        updateLightboxInfo(item, data)
        return loadCountryInfo(item.country_from || '', item.country_to || '')
      }).fail(function () {
        alert("系統目前無法連接後台資料庫")
      })

      $('.lightBoxArea').css('display', 'block')
    })


  }).fail(() => {
    alert("系統目前無法連接後台資料庫")
  })
}

// 信封燈箱資訊
function updateLightboxInfo(item, data) {
  $lightBoxInfo.find('.theme').html(`主題:${item.theme}`)
  $lightBoxInfo.find('.remark').html(`備註:<br>${item.remark || ''}`)
  $lightBoxInfo.find('.time').html(`年份:${item.time || ''}`)
  $lightBoxImg.attr('src', `https://drccollector.hopto.org/images/envelopes/${item.img}`)


  $secImg.css('display', 'flex').empty()
  data.forEach((imgItem) => {
    const newImg = $('<img>', {
      src: `https://drccollector.hopto.org/images/envelopes/${imgItem.img}`,
      alt: "",
      "data-id": "",
      draggable: "false",
      class: "littleImg"
    })
    $secImg.append(newImg)
  })


  $('.littleImg').on('click', (e) => {
    scale = 1
    $lightBoxImg.removeAttr('style').attr('src', e.target.src)
  })
}
// 信封國家資訊
function loadCountryInfo(country_from, country_to) {
  return $.ajax({
    url: 'https://drc-api.hopto.org/api/exhibits-country.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ country_from, country_to })
  }).done(function (data) {
    const from = data[0]?.c_name || ''
    const to = data[1]?.c_name || ''
    $lightBoxInfo.find('.country_from').html(`寄出國家:${from}`)
    $lightBoxInfo.find('.country_to').html(`收件國家:${to}`)
  })
}
// 郵票國家資訊
function loadCountryInfoStamp(country_id) {
  return $.ajax({
    url: 'https://drc-api.hopto.org/api/exhibits-country.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ country_id })
  }).done(function (data) {
    $lightBoxInfo.find('.country_id').html(`國家:${data[0].c_name}`)
  })
}

