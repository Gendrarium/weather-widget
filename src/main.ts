import { defineCustomElement } from 'vue';
import App from './App.ce.vue';

const CustomElement = defineCustomElement(App);

customElements.define('weather-widget', CustomElement);
