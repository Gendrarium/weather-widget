<template>
  <!-- <svg
    viewBox="0 0 32 32"
    fill="none"
    :class="class"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 6.4c.7 0 1.4.3 2 .8.5.6.9 1.3 1 2h4.5l.6.3.2.6c0 .2 0 .4-.2.6l-.5.3h-.7l-1.4 12.6c0 .5-.3 1-.7 1.4a2 2 0 0 1-1.4.6h-6.8a2 2 0 0 1-1.4-.6c-.4-.4-.7-.9-.7-1.4L9 11h-.6c-.2 0-.4 0-.5-.2a.9.9 0 0 1-.3-.6c0-.3 0-.5.2-.6.1-.2.3-.3.5-.3H13c0-.8.4-1.5 1-2 .5-.6 1.2-.9 1.9-.9Zm0 1.7c-.6 0-1.2.5-1.3 1.2h2.6C17.2 8.6 16.6 8 16 8Z"
      :fill="color"
    />
  </svg> -->
  <svg
    :class="class"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"
    />
  </svg>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      color: {
        type: String,
        required: true,
      },
      class: {
        type: String,
        required: true,
      },
    },
  });
</script>
