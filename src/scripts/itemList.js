
import $, { data } from 'jquery'
// -------------------------------------

const page = window.location.pathname.split('/')
const $lightBoxInfo = $('.lightBoxInfo')
const $lightBoxImg = $('.lightBoxImg img')
const $secImg = $('.secImg')
let list

function typeList() {
  return $.ajax({
    url: 'https://drc-collector.com/api/exhibits-list.php',
    type: 'POST',
    contentType: 'application/json',
  })
}

(async function init() {
  try {
    list = await typeList()
    const List = list.filter((item) => {
      return page.includes(item.typeEN)
    })

    const typeId = List[0].id

    const loadingBox = document.querySelector('.loadingBtn')
    let coverPage = 1
    let loading = false

    function loadItem() {
      if (loading) return
      loading = true

      $.ajax({
        url: 'https://drc-collector.com/api/exhibits-item.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ typeId, coverPage })
      }).done((data) => {
        if (data.length < 12) {
          $('.loadingBtn').remove()
        }
        renderCover(data)

        // 信封圖片點擊燈箱
        coverInfo()

      }).fail(() => {
        alert("系統目前無法連接後台資料庫")
      })

      loading = false
      coverPage += 1

    }

    loadingBox.addEventListener('click', () => {
      loadItem()
    })
    loadItem()

    // 信封國家選項
    countryOption(typeId)

    document.querySelector('#formArea').addEventListener('submit', (e) => {
      e.preventDefault()
      document.querySelector('.loadingBtn') ? document.querySelector('.loadingBtn').remove() : ''
      const theme = document.querySelector('#theme').value

      let yearStart = +document.querySelector('.yearStart').value
      let yearEnd = +document.querySelector('.yearEnd').value

      if (isNaN(yearStart) || isNaN(yearEnd)) {
        alert("請輸入年份")
        return
      }
      if (yearStart > yearEnd) {
        alert("結束年份需大於起始年份")
        return
      }
      const yearlist = [yearStart, yearEnd]

      let country_from = document.querySelector('#country_from').value
      let country_to = document.querySelector('#country_to').value
      if (!country_from) {
        country_from = ""
      }
      if (!country_to) {
        country_to = ""
      }
      const countrylist = [country_from, country_to]


      $.ajax({
        url: 'https://drc-collector.com/api/exhibits-selectCover.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ countrylist, yearlist, theme, typeId })
      }).done((data) => {
        $('.exhibititem').remove()
        if (data) {
          renderCover(data)
          coverInfo()
        } else {
          alert("查無資料")
        }
      }).fail(() => {
        alert("系統目前無法連接後台資料庫")
      })

    })

  } catch (error) {
    console.error('error', error)
  }

})();


// 信封燈箱資訊
function updateLightboxInfo(item, data) {
  $lightBoxInfo.find('.theme').html(`主題:${item.theme}`)
  $lightBoxInfo.find('.remark').html(`備註:<br>${item.remark || ''}`)
  $lightBoxInfo.find('.time').html(`年份:${item.time || ''}`)
  $lightBoxImg.attr('src', `https://admin.drc-collector.com/images/envelopes/${item.img}`)


  $secImg.css('display', 'flex').empty()
  data.forEach((imgItem) => {
    const newImg = $('<img>', {
      src: `https://admin.drc-collector.com/images/envelopes/${imgItem.img}`,
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
}
// 信封國家資訊
function loadCountryInfo(country_from, country_to) {
  return $.ajax({
    url: 'https://drc-collector.com/api/exhibits-country.php',
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

function renderCover(data) {
  // 渲染信封列表  
  data.forEach(item => {
    const bigDiv = $('<div>', {
      class: 'exhibititem'
    })
    const smallDiv = $('<div>', {
      class: 'exhibitTitle'
    })
    const img = $('<img>', {
      src: `https://admin.drc-collector.com/images/envelopes/${item.img}`,
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

}

function coverInfo() {
  $('.exhibititem img').on('click', (e) => {
    const id = e.target.dataset.id
    $('body').css('overflow', 'hidden')
    $.ajax({
      url: 'https://drc-collector.com/api/exhibits-item.php',
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
}

// 信封國家選項
function countryOption(typeId) {
  const all = true
  $.ajax({
    url: 'https://drc-collector.com/api/exhibits-item.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ typeId, all })
  }).done((data) => {

    let country_from = []
    let country_to = []
    let themeData = []

    data.filter((item) => {
      country_from.push(item.country_from)
      country_to.push(item.country_to)
      themeData.push(item.theme)
    })

    country_from = [...new Set(country_from)]
    country_to = [...new Set(country_to)]
    themeData = [...new Set(themeData)]

    themeData.forEach((item) => {
      const option = $('<option>', {
        text: item || "未分類",
        value: item || "null",
      })
      $('form .form_theme #theme').append(option)
    })

    // select國家篩選(from)
    $.ajax({
      url: 'https://drc-collector.com/api/exhibits-country.php',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ country_list: country_from })
    }).done(function (data) {
      data.forEach((item) => {
        const option = $('<option>', {
          text: item.c_name,
          value: item.id
        })
        $('form .form_country #country_from').append(option)
      })
    })
    // select國家篩選(to)
    $.ajax({
      url: 'https://drc-collector.com/api/exhibits-country.php',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ country_list: country_to })
    }).done(function (data) {
      data.forEach((item) => {
        const option = $('<option>', {
          text: item.c_name,
          value: item.id
        })
        $('form .form_country #country_to').append(option)
      })
    })

    $('#country_from').on('change', () => {
      $('#country_to option').slice(1).remove()
      const from_value = document.querySelector('#country_from').value
      const to_Value = data.filter((item) => {
        return item.country_from == from_value
      })
      let to_List = []
      to_Value.filter((item) => {
        to_List.push(item.country_to)
      })
      to_List = [...new Set(to_List)]
      $.ajax({
        url: 'https://drc-collector.com/api/exhibits-country.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ country_list: to_List })
      }).done(function (data) {
        data.forEach((item) => {
          const option = $('<option>', {
            text: item.c_name,
            value: item.id
          })
          $('form .form_country #country_to').append(option)
        })
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

