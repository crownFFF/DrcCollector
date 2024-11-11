import $ from 'jquery'

// -------------------------------------

const page = window.location.pathname.split('/')
const $lightBoxInfo = $('.lightBoxInfo')
const $lightBoxImg = $('.lightBoxImg img')
const $secImg = $('.secImg')

if (page.includes('Stamp')) {

  document.addEventListener('DOMContentLoaded', () => {
    const loadingBox = document.querySelector('.loadingBtn')
    let page = 1
    let loading = false

    function loadItem() {
      if (loading) return
      loading = true

      // 所有郵票列表
      $.ajax({
        url: 'https://drc-collector.com/api/exhibits-stamp.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ page, limit: 12 })
      }).done((data) => {
        if (data.length < 12) {
          $('.loadingBtn').remove()
        }

        // 渲染郵票列表
        renderStamp(data)

        // 郵票圖片點擊燈箱
        stampInfo()

      }).fail(() => {
        alert("系統目前無法連接後台資料庫")
      })

      loading = false
      page += 1

    }

    // 郵票國家選項
    countryOption()

    loadingBox.addEventListener('click', () => {
      loadItem()
    })
    loadItem()
  })


  document.querySelector('#formArea').addEventListener('submit', (e) => {
    e.preventDefault()

    document.querySelector('.loadingBtn') ? document.querySelector('.loadingBtn').remove() : ''

    const country = document.querySelector('#country').value
    let yearStart = +document.querySelector('.yearStart').value
    let yearEnd = +document.querySelector('.yearEnd').value
    if (!yearStart) {
      yearStart = ''
    }
    if (!yearEnd) {
      yearEnd = ''
    }

    if (isNaN(yearStart) || isNaN(yearEnd)) {
      alert("請輸入年份")
      return
    }
    if (yearStart > yearEnd) {
      alert("結束年份需大於起始年份")
      return
    }
    const yearlist = [yearStart, yearEnd]

    $.ajax({
      url: 'https://drc-collector.com/api/exhibits-selectStamp.php',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ country, yearlist })
    }).done((data) => {

      $('.exhibititem').remove()

      if (data) {
        renderStamp(data)

        // 郵票圖片點擊燈箱
        stampInfo()

      } else {
        alert("查無資料")
      }

    }).fail(() => {
      alert("系統目前無法連接後台資料庫")
    })
  })
}

// 郵票國家資訊
function loadCountryInfoStamp(country_id) {
  return $.ajax({
    url: 'https://drc-collector.com/api/exhibits-country.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ country_id })
  }).done(function (data) {
    $lightBoxInfo.find('.country_id').html(`國家:${data[0].c_name}`)
  })
}
// 渲染郵票列表
function renderStamp(data) {
  data.forEach(item => {
    const bigDiv = $('<div>', {
      class: 'exhibititem'
    })
    const smallDiv = $('<div>', {
      class: 'exhibitTitle'
    })
    const img = $('<img>', {
      src: `https://admin.drc-collector.com/images/stamps/${item.img}`,
      alt: "",
      'data-id': `${item.id}`,
      draggable: "false"
    })

    const country_id = item.country_id
    $.ajax({
      url: 'https://drc-collector.com/api/exhibits-country.php',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ country_id })
    }).done(function (data) {
      const contury = $('<p>')
      contury.html(data[0].c_name ? `國家:${data[0].c_name}` : '國家:無')
      smallDiv.append(contury)
    })

    const year = $('<p>')
    year.html(item.year ? `年份:${item.year}` : '年份:無')
    smallDiv.append(year)
    bigDiv.append(img, smallDiv)
    $('.exhibitList').append(bigDiv)
  })
}

function stampInfo() {
  $('.exhibititem img').on('click', (e) => {
    const id = e.target.dataset.id
    document.documentElement.style.overflow = 'hidden'

    // 郵票燈箱內容
    $.ajax({
      url: 'https://drc-collector.com/api/exhibits-stamp.php',
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
      $lightBoxImg.attr('src', `https://admin.drc-collector.com/images/stamps/${item.img}`)

      $secImg.css('display', 'flex').empty()
      data.forEach((imgItem) => {
        const newImg = $('<img>', {
          src: `https://admin.drc-collector.com/images/stamps/${imgItem.img}`,
          alt: "",
          "data-id": "",
          draggable: "false",
          class: "littleImg"
        })
        $secImg.append(newImg)
      })
      $('.littleImg').on('click', (e) => {
        $lightBoxImg.removeAttr('style').attr('src', e.target.src)
      })

      return loadCountryInfoStamp(item.country_id || '')

    }).fail(function () {
      alert("系統目前無法連接後台資料庫")
    })

    $('.lightBoxArea').css('display', 'block')

  })
}

// 郵票國家選項
function countryOption() {
  const all = true
  $.ajax({
    url: 'https://drc-collector.com/api/exhibits-stamp.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ all })
  }).done((data) => {

    // select
    let countryData = []
    data.filter((item) => {
      countryData.push(item.country_id)
    })
    countryData = [...new Set(countryData)]
    // checkbox國家篩選
    $.ajax({
      url: 'https://drc-collector.com/api/exhibits-country.php',
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
  })

}
// gotop
window.addEventListener('resize', (e) => {
  if (window.screen.width <= 500) {
    $('aside .asideList .gotop').css('display', 'none')
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        $('aside.top').css('display', 'block')
      } else {
        $('aside.top').css('display', 'none')
      }
    })
  } else {
    $('aside .asideList .gotop').css('display', 'block')
    $('aside.top').css('display', 'none')
  }
})

$('aside.top').on('click', () => {
  window.scrollTo({
    top: 0
  })
})

