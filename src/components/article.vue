<script setup>
import { ref } from 'vue';
const list = ref(
  [
    {
      id:1,
      date:'2024.07.22',
      url:'#',
      title:'郵封的歷史：從手工製作到現代生產',
    },
    {
      id:2,
      date:'2024.07.22',
      url:'#',
      title:'郵封設計的藝術：從簡單到華麗',
    },
    {
      id:3,
      date:'2024.07.22',
      url:'#',
      title:'郵封的功能與用途',
    },
    {
      id:4,
      date:'2024.07.22',
      url:'#',
      title:'環保郵封：可持續發展的選擇',
    },
    {
      id:5,
      date:'2024.07.22',
      url:'#',
      title:'電子郵件時代的郵封：是否還有市場？',
    },
    {
      id:6,
      date:'2024.07.22',
      url:'#',
      title:'自製創意郵封：DIY指南',
    },
  ]
)




</script>

<template>
  <li class="articleBox" v-for="item in list" :key="item.id">
    <div class="articleDate">{{item.date}}</div>
    <h3 class="articleTex">
      <a :href=item.url>{{item.title}}</a>
    </h3>
  </li>
</template>


<style></style>