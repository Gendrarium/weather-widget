<template>
  <svg
    :class="class"
    :fill="color"
    viewBox="0 0 491.858 491.858"
  >
    <path
      d="M491.858,442.461c0,13.931-11.293,25.224-25.224,25.224L245.93,373.097L25.224,467.686
    C11.292,467.686,0,456.392,0,442.461L227.011,32.58c0,0,18.918-18.918,37.834,0C283.764,51.499,491.858,442.461,491.858,442.461z"
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
