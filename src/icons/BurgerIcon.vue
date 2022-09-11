<template>
  <svg :class="class" :fill="color" viewBox="0 0 24 24">
    <path
      d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"
    />
  </svg>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      class: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
  });
</script>
