  <script setup>
  import { ref } from 'vue';

  const list = ref(
    [{
      id: 1,
      img: '/images/stamp001-1.jpg',
      title: '首日封',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'/exhibits/FDC?type=FDC',
    },
    {
      id: 2,
      img: '/images/stamp001-1.jpg',
      title: '實寄封',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'/exhibits/RegisteredCover?type=RegisteredCover',
    },
    {
      id: 3,
      img: '/images/stamp001-1.jpg',
      title: '其他郵封',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'/exhibits/OtherPostalCovers?type=OtherPostalCovers',
    },
    {
      id: 4,
      img: '/images/stamp001-1.jpg',
      title: '郵票',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'/exhibits/Stamp?type=Stamp',
    },
    {
      id: 5,
      img: '/images/stamp001-1.jpg',
      title: '明信片',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'/exhibits/Postcard?type=Postcard',
    },
    {
      id: 6,
      img: '/images/stamp001-1.jpg',
      title: '郵簡',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'/exhibits/PostalCard?type=PostalCard',
    }
    ]
  )

  

</script>

<template>
  <div class="swiper-slide" v-for="item in list" :key="item.id">
    <a :href=item.url>
      <div class="swiperImg">
        <img :src=item.img alt="" />
      </div>
      <div class="swiperCentent">
        <span class="swiperTitle"> {{ item.title }} </span>
        <span class="swiperTitleEn"> {{ item.enTitle }} </span>
        <span class="swiperArticle">
          {{ item.article }}
        </span>
      </div>
    </a>
  </div>
</template>


<style></style>