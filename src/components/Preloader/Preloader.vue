<template>
  <div
    :class="[
      className,
      `preloader${!isVisible ? ' preloader_display_none' : ''}${
        relative ? ' preloader_relative' : ''
      }`,
    ]"
  >
    <div
      :class="`preloader__container${
        relative ? ' preloader__container_relative' : ''
      }`"
    >
      <span
        :class="[
          `preloader__round${relative ? ' preloader__round_relative' : ''}`,
          $store.state.isNightTheme ? 'preloader__round_night' : '',
        ]"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      relative: {
        type: Boolean,
        required: true,
      },
      className: {
        type: String,
        required: true,
      },
    },
  });
</script>

<style lang="scss" src="./Preloader.scss"></style>
