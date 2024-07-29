  <script setup>
  import { ref } from 'vue';

  const list = ref(
    [{
      id: 1,
      img: '../assets/stamp001-1.jpg',
      title: '首日封',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'#',
    },
    {
      id: 2,
      img: '../assets/stamp001-1.jpg',
      title: '實寄封',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'#',
    },
    {
      id: 3,
      img: '../assets/stamp001-1.jpg',
      title: '其他郵封',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'#',
    },
    {
      id: 4,
      img: '../assets/stamp001-1.jpg',
      title: '郵票',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'#',
    },
    {
      id: 5,
      img: '../assets/stamp001-1.jpg',
      title: '明信片',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'#',
    },
    {
      id: 6,
      img: '../assets/stamp001-1.jpg',
      title: '郵簡',
      enTitle: 'stamp',
      article: '郵封的 歷史：從手工製作到現代生產',
      url:'#',
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