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
  e.preventDefault()
})

$(".lightBoxImg img").on("touchstart", (e) => {
  const touch = e.touches[0];

  isDragging = true;
  startX = touch.clientX;
  startY = touch.clientY;
  initialX = $(".lightBoxImg img").position().left;
  initialY = $(".lightBoxImg img").position().top;
  $(".lightBoxImg img").css('cursor', 'grabbing');

  e.preventDefault();
});

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
    const touch = e.touches[0];
    const dx = (touch.clientX - startX) / scale;
    const dy = (touch.clientY - startY) / scale;


    const newLeft = initialX + dx;
    const newTop = initialY + dy;

    $(".lightBoxImg img").css({
      left: newLeft + 'px',
      top: newTop + 'px'
    });
  }
});


$(window).on('mouseup', (e) => {
  isDragging = false
  $(".lightBoxImg img").css('cursor', 'grab')
})

$(window).on("touchend", () => {
  if (isDragging) {
    isDragging = false;
    $(".lightBoxImg img").css('cursor', 'grab');
  }
});


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


$('.lightBoxclose').on('click', (e) => {
  $('.lightBoxArea').css('display', 'none')
  $('.secImg img').remove()
  $('.time').html('')
  $('.theme').html('')
  $('.country_from').html('')
  $('.country_to').html('')
  $('.remark').html('')
  $('body').css('overflow','auto')
  $(".lightBoxImg img").removeAttr('style')

})

const $lightBoxInfo = $('.lightBoxInfo');
const $lightBoxImg = $('.lightBoxImg img');
const $secImg = $('.secImg');

$('.exhibititem img').on('click', (e) => {
  const id = e.target.dataset.id;
  $('body').css('overflow','hidden')
  $.ajax({
    url: 'https://drc-api.hopto.org/api/exhibits-item.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ id })
  }).done(function (data) {
    const item = data[0];
    updateLightboxInfo(item, data);
    return loadCountryInfo(item.country_from||'', item.country_to||'');
  }).fail(function () {
    alert("系統目前無法連接後台資料庫");
  });

  $('.lightBoxArea').css('display', 'block');
});

function updateLightboxInfo(item, data) {
  $lightBoxInfo.find('.theme').html(`主題:${item.theme}`);
  $lightBoxInfo.find('.remark').html(`備註:<br>${item.remark || ''}`);
  $lightBoxInfo.find('.time').html(`年份:${item.time || ''}`);
  $lightBoxImg.attr('src', `https://drccollector.hopto.org/images/envelopes/${item.img}`);

  if (data.length > 1) {
    $secImg.css('display', 'flex').empty();
    data.forEach((imgItem) => {
      const newImg = $('<img>', {
        src: `https://drccollector.hopto.org/images/envelopes/${imgItem.img}`,
        alt: "",
        "data-id": "",
        draggable: "false",
        class: "littleImg"
      });
      $secImg.append(newImg);
    });
  }

  $('.littleImg').on('click', (e) => {
    scale = 1;
    $lightBoxImg.removeAttr('style').attr('src', e.target.src);
  });
}

function loadCountryInfo(country_from, country_to) {
  return $.ajax({
    url: 'http://localhost/DrC-work-project-API/exhibits-country.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ country_from, country_to})
  }).done(function (data) {
    updateCountryInfo(data);
  })
}

function updateCountryInfo(data) {
  const from = data[0]?.c_name || '';
  const to = data[1]?.c_name || '';
  $lightBoxInfo.find('.country_from').html(`寄出國家:${from}`);
  $lightBoxInfo.find('.country_to').html(`收件國家:${to}`);
}
