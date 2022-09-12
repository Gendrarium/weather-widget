<template>
  <svg
    viewBox="0 0 18 18"
    :class="class"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.3 8H10V1.7a1 1 0 0 0-2 0V8H1.7a1 1 0 1 0 0 2H8v6.3a1 1 0 0 0 2 0V10h6.3a1 1 0 0 0 0-2Z"
      :fill="color"
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
