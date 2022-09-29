<template>
  <weather-widget/>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import WeatherWidget from '@/components/WeatherWidget/WeatherWidget.vue';

  export default defineComponent({
    components: {
      WeatherWidget,
    },
  });
</script>

<style lang="scss">
  @import '@/components/Preloader/Preloader.scss';
  @import '@/components/WeatherWidget/WeatherWidget.scss';

  button,
  input {
    font-family: inherit;
  }
</style>
