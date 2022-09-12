<template>
  <div
    class="widget"
    :class="[
      isNightTheme ? 'widget_night' : '',
      queries.length === 0 || isSettingsOpen ? 'widget_with-paddings' : '',
      isLoading && !isSettingsOpen ? 'widget_with-preloader' : '',
    ]"
  >
    <div
      class="widget__title-container"
      v-if="
        queries.length === 0 ||
        isSettingsOpen ||
        (isLoading && answers.length === 0)
      "
    >
      <h2
        class="widget__title"
        :class="[isNightTheme ? 'widget__title_night' : '']"
        v-if="isSettingsOpen || answers.length === 0"
      >
        {{ isSettingsOpen ? 'Settings' : 'Weather widget' }}
      </h2>
      <div class="widget__buttons-container">
        <button
          class="widget__button"
          @click="isNightTheme = !isNightTheme"
          type="button"
        >
          <moon-icon v-if="isNightTheme" :class="'widget__icon'" />
          <sun-icon v-else :class="'widget__icon'" />
        </button>
        <button
          class="widget__button"
          @click="handleSettingsClick"
          type="button"
        >
          <gear-icon
            v-if="!isSettingsOpen"
            :color="isNightTheme ? 'white' : 'black'"
            :class="'widget__icon'"
          />
          <cross-icon
            v-else
            :color="isNightTheme ? 'white' : 'black'"
            :class="'widget__icon'"
          />
        </button>
      </div>
    </div>
    <Preloader
      v-if="isLoading"
      className="widget__preloader"
      :is-visible="isLoading"
      :relative="true"
      :is-night-theme="isNightTheme"
    />
    <div
      class="widget__wrapper"
      v-if="!isSettingsOpen"
      v-for="(item, id) in answers"
      :key="id"
    >
      <div class="widget__title-container">
        <h2
          class="widget__title"
          :class="[isNightTheme ? 'widget__title_night' : '']"
        >
          {{ item.name }}, {{ item.sys.country }}
        </h2>
        <div class="widget__buttons-container" v-if="id === 0">
          <button
            class="widget__button"
            @click="isNightTheme = !isNightTheme"
            type="button"
          >
            <moon-icon v-if="isNightTheme" :class="'widget__icon'" />
            <sun-icon v-else :class="'widget__icon'" />
          </button>
          <button
            class="widget__button"
            @click="handleSettingsClick"
            type="button"
          >
            <gear-icon
              :color="isNightTheme ? 'white' : 'black'"
              :class="'widget__icon'"
            />
          </button>
        </div>
      </div>
      <div class="widget__img-container">
        <img
          class="widget__img"
          :src="item.imgSrc || ''"
          :alt="`${item.weather[0].main} image`"
        />
        <p
          class="widget__temp"
          :class="[isNightTheme ? 'widget__temp_night' : '']"
        >
          {{ Math.round(item.main.temp) }}&#176;C
        </p>
      </div>
      <p
        class="widget__desc"
        :class="[isNightTheme ? 'widget__desc_night' : '']"
      >
        Feels like {{ Math.round(item.main.feels_like) }}&#176;C.
        {{ item.weather[0].main }}.
        {{
          item.weather[0].description.charAt(0).toUpperCase() +
          item.weather[0].description.slice(1)
        }}
      </p>
      <div class="widget__inf-container">
        <div class="widget__inf-icon-wrapper">
          <arrow-icon
            :class="'widget__icon widget__icon_small widget__icon_with-margin'"
            :color="isNightTheme ? 'white' : 'black'"
            :style="{ transform: `rotate(${item.wind.deg}deg)` }"
          />
          <p
            class="widget__inf-title"
            :class="[isNightTheme ? 'widget__inf-title_night' : '']"
          >
            {{ Math.round(item.wind.speed * 10) / 10 }}m/s
          </p>
        </div>
        <div>
          <p
            class="widget__inf-title"
            :class="[isNightTheme ? 'widget__inf-title_night' : '']"
          >
            {{ item.main.pressure }}hPa
          </p>
        </div>
        <p
          class="widget__inf-title"
          :class="[isNightTheme ? 'widget__inf-title_night' : '']"
        >
          Humidity: {{ item.main.humidity }}%
        </p>
        <p
          class="widget__inf-title"
          :class="[isNightTheme ? 'widget__inf-title_night' : '']"
        >
          Visibility: {{ Math.round(item.visibility / 1000) }}km
        </p>
      </div>
    </div>
    <div v-else class="widget__settings-wrapper">
      <div
        v-if="!isLoading"
        class="widget__settings-item"
        :class="[isNightTheme ? 'widget__settings-item_night' : '']"
        id="container-for-dragging"
        v-for="(item, id) in queries"
        :draggable="isButtonDragged ? 'true' : 'false'"
        @dragstart="isButtonDragged ? dragStart($event) : null"
        @dragend="isButtonDragged ? dragEnd($event, id) : null"
        @dragover="isButtonDragged ? dragOver($event) : null"
        :key="id"
      >
        <button
          class="widget__button widget__button_cursor_move"
          @mouseenter="isButtonDragged = true"
          @mouseleave="isButtonDragged = false"
          type="button"
        >
          <burger-icon
            :class="'widget__icon'"
            :color="isNightTheme ? 'white' : 'black'"
          />
        </button>
        <h2
          class="widget__title"
          :class="[isNightTheme ? 'widget__title_night' : '']"
        >
          {{ item.query }}
        </h2>
        <button
          class="widget__button"
          @click="deleteItem(item.id)"
          type="button"
        >
          <delete-icon
            :class="'widget__icon'"
            :color="isNightTheme ? 'white' : 'black'"
          />
        </button>
      </div>
      <Preloader
        className="widget__preloader"
        :is-visible="isLoading && queries.length === 0"
        :relative="true"
        v-else
      />
      <form class="widget__settings-form" @submit.prevent="addItem">
        <h2
          class="widget__title"
          :class="[isNightTheme ? 'widget__title_night' : '']"
        >
          Add Location:
        </h2>
        <div class="widget__settings-input-container">
          <input
            class="widget__settings-input"
            :class="[isNightTheme ? 'widget__settings-input_night' : '']"
            v-model="cityInput"
          />
          <button class="widget__button" type="submit">
            <add-icon
              :class="'widget__icon'"
              :color="isNightTheme ? 'white' : 'black'"
            />
          </button>
        </div>
        <span v-if="error" class="widget__error">{{ error }}</span>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { getWeather, checkIp } from '@/utils/api';
  import type { IOpenWeather, TOpenWeatherResponse } from '@/utils/interfaces';
  import Preloader from '@/components/Preloader/Preloader.vue';
  import GearIcon from '@/icons/GearIcon.vue';
  import MoonIcon from '@/icons/MoonIcon.vue';
  import SunIcon from '@/icons/SunIcon.vue';
  import ArrowIcon from '@/icons/ArrowIcon.vue';
  import CrossIcon from '@/icons/CrossIcon.vue';
  import DeleteIcon from '@/icons/DeleteIcon.vue';
  import BurgerIcon from '@/icons/BurgerIcon.vue';
  import AddIcon from '@/icons/AddIcon.vue';

  type Query = { id: number; query: string };

  interface Data {
    isNightTheme: boolean;
    isLoading: boolean;
    isSettingsOpen: boolean;
    error: string;
    numberOfQueries: number;
    queries: Query[];
    changedQueries: Query[];
    answers: IOpenWeather[];
    changedAnswers: IOpenWeather[];
    selected: Node | null;
    isButtonDragged: boolean;
    cityInput: string;
  }

  export default defineComponent({
    components: {
      Preloader,
      GearIcon,
      MoonIcon,
      SunIcon,
      ArrowIcon,
      CrossIcon,
      DeleteIcon,
      BurgerIcon,
      AddIcon,
    },
    data(): Data {
      return {
        isNightTheme: false,
        isLoading: true,
        isSettingsOpen: false,
        error: '',
        numberOfQueries: 0,
        queries: [],
        changedQueries: [],
        answers: [],
        changedAnswers: [],
        selected: null,
        isButtonDragged: false,
        cityInput: '',
      };
    },
    mounted() {
      const stringQueries: string | null = localStorage.getItem('queries');
      const oldQueries: Query[] | null =
        typeof stringQueries === 'string' ? JSON.parse(stringQueries) : null;

      if (oldQueries && oldQueries.length > 0) {
        const queries = oldQueries.map((i, id) => {
          i.id = id;
          return i;
        });
        this.queries = queries;
        this.numberOfQueries = queries.length;
        this.fetchWeather(queries);
      } else {
        this.fetchIpAndAddCity();
      }
    },
    methods: {
      fetchWeather(query: string | Query[], newRequest?: boolean, id?: number) {
        this.isLoading = true;
        if (Array.isArray(query)) {
          const qq = query.map((q) => {
            return getWeather(q.query);
          });

          Promise.all(qq)
            .then((e) => {
              e.forEach((r, id) => {
                this.getWeatherHelper(r, query[id].query, newRequest, id);
              });
            })
            .finally(() => {
              this.isLoading = false;
            });
        } else {
          getWeather(query)
            .then((e) => {
              this.getWeatherHelper(e, query, newRequest, id);
            })
            .finally(() => {
              this.isLoading = false;
            });
        }
      },
      getWeatherHelper(
        e: TOpenWeatherResponse,
        query: string,
        newRequest?: boolean,
        id?: number
      ) {
        if ('message' in e) {
          this.error = e.message;
          console.log(e.message);
        } else {
          if (newRequest) {
            const newQueries = [
              ...this.queries,
              { query, id: this.numberOfQueries },
            ];
            this.numberOfQueries++;
            localStorage.setItem('queries', JSON.stringify(newQueries));
            this.queries = newQueries;
            this.changedQueries = newQueries;
          }
          e.customId = id || 0;
          this.answers.push(e);
          e.imgSrc = `https://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png`;
        }
      },
      fetchIpAndAddCity() {
        checkIp().then((res) => {
          this.fetchWeather(res.city, true);
        });
      },
      dragStart(e: DragEvent) {
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          this.selected = e.target as Node;
        }
      },
      dragOver(e: DragEvent) {
        const target = e.target as Element | undefined;
        const selected = this.selected as Node | undefined;
        if (target && selected) {
          const closest = target.closest('#container-for-dragging') as
            | Node
            | undefined;
          if (closest) {
            const parentNode = closest.parentNode;
            if (parentNode) {
              if (this.isBefore(selected, closest)) {
                parentNode.insertBefore(selected, closest);
              } else {
                parentNode.insertBefore(selected, closest.nextSibling);
              }
            }
          }
        }
      },
      dragEnd(e: DragEvent, id: number) {
        const target = e.target as Element;
        if (target) {
          const node = target.parentNode;
          if (node) {
            this.reorderCities(id, [...node?.children].indexOf(target));
          }
        }

        this.selected = null;
      },
      isBefore(el1: Node | null, el2: Node | null) {
        if (el1 && el2) {
          let cur;
          if (el2.parentNode === el1.parentNode) {
            for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
              if (cur === el2) return true;
            }
          }
          return false;
        } else return false;
      },
      reorderCities(oldItemId: number, newItemId: number) {
        const queries = [...this.queries];
        const answers = [...this.answers];

        this.arrayMove(queries, oldItemId, newItemId);
        this.changedQueries = queries;
        localStorage.setItem('queries', JSON.stringify(queries));

        this.arrayMove(answers, oldItemId, newItemId);
        this.changedAnswers = answers;
      },
      handleSettingsClick() {
        if (this.isSettingsOpen) {
          this.answers = this.changedAnswers;
          this.queries = this.changedQueries;
        } else {
          this.changedAnswers = this.answers;
          this.changedQueries = this.queries;
        }
        this.isSettingsOpen = !this.isSettingsOpen;
      },
      arrayMove(arr: any[], old_index: number, new_index: number) {
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
      },
      deleteItem(idItem: number | undefined) {
        if (typeof idItem === 'number') {
          const filteredAnswers = this.changedAnswers.filter((i) => {
            if (typeof i.customId === 'number') {
              return i.customId !== idItem;
            } else {
              return true;
            }
          });
          const filteredQueries = this.changedQueries.filter((i) => {
            return i.id !== idItem;
          });

          localStorage.setItem('queries', JSON.stringify(filteredQueries));
          this.queries = filteredQueries;
          this.changedQueries = filteredQueries;
          this.changedAnswers = filteredAnswers;
        }
      },
      addItem() {
        if (this.cityInput) {
          this.fetchWeather(this.cityInput, true);
          this.cityInput = '';
        }
      },
    },
    watch: {
      cityInput() {
        this.error = '';
      },
    },
  });
</script>

<style lang="scss">
  @import '@/styles/styles.scss';
  @import '@/components/Preloader/Preloader.scss';

  button,
  input {
    font-family: inherit;
  }

  .widget {
    font-family: Arial, Helvetica, sans-serif;
    width: 180px;
    background-color: #e7e8ec;
    border-radius: 5px;
    box-sizing: border-box;

    &_night {
      background-color: #525252;
    }

    &_with-paddings {
      padding: 5px;
    }

    &_with-preloader {
      padding: 5px 5px 15px;
    }

    &__wrapper {
      padding: 5px;
      margin-top: 20px;

      &:first-of-type {
        margin-top: 0;
      }
    }

    &__settings-wrapper {
    }

    &__settings-item {
      border-radius: 5px;
      background-color: $item-color;
      padding: 5px 2px;
      display: flex;
      margin-top: 20px;
      align-items: center;
      justify-content: space-between;

      &_night {
        background-color: $item-color-night;
      }
    }

    &__settings-form {
      margin-top: 20px;
    }

    &__settings-input-container {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__settings-input {
      font-size: 16px;
      padding: 2px;
      width: 100%;
      background-color: rgba(0, 0, 0, 0);
      border: 2px solid $item-color;
      border-radius: 4px;
      color: $color-main;
      margin-right: 10px;
      transition: border-color 0.5s;

      &:hover {
        border: 2px solid $input-border;
      }

      &:focus {
        outline: none;
        border: 2px solid $input-border;
      }

      &_night {
        color: $color-night-main;
        border-color: $item-color-night;

        &:hover {
          border-color: $input-border-night;
        }

        &:focus {
          border-color: $input-border-night;
        }
      }
    }

    &__title-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: $color-main;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      &_night {
        color: $color-night-main;
      }
    }

    &__buttons-container {
      display: flex;
    }

    &__button {
      border: none;
      background-color: rgba(0, 0, 0, 0);
      width: 18px;
      height: 18px;
      cursor: pointer;
      padding: 0;

      &:first-of-type {
        margin-right: 5px;
      }
      &_cursor {
        &_move {
          cursor: move;
        }
      }
    }

    &__icon {
      width: 18px;
      height: 18px;

      &_small {
        width: 15px;
        height: 15px;
      }

      &_with-margin {
        margin-right: 5px;
      }
    }

    &__img-container {
      display: flex;
      align-items: center;
    }

    &__img {
      width: 75px;
      height: 75px;
    }

    &__temp {
      font-size: 22px;
      font-weight: 600;
      margin: 0;
      color: $color-main;

      &_night {
        color: $color-night-main;
      }
    }

    &__desc {
      font-size: 12px;
      font-weight: 400;
      margin: 0;
      color: $color-main;

      &_night {
        color: $color-night-main;
      }
    }

    &__inf-container {
      margin-top: 15px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px 5px;
    }

    &__inf-icon-wrapper {
      display: flex;
      align-items: center;
    }

    &__inf-title {
      font-size: 12px;
      line-height: 14px;
      font-weight: 400;
      margin: 0;
      color: $color-main;

      &_night {
        color: $color-night-main;
      }
    }

    &__error {
      margin-top: 5px;
      display: block;
      color: $error-color;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &__preloader {
      margin-top: 10px;
    }
  }
</style>
