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
      v-if="isLoading && queries.length > 0"
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
        <div class="widget__inf-icon-wrapper">
          <pressure-icon
            :class="'widget__icon widget__icon_small widget__icon_with-margin'"
            :color="isNightTheme ? 'white' : 'black'"
          />
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
          @pointerdown="isButtonDragged = true"
          @pointerup="isButtonDragged = false"
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
  import GearIcon from '@/icons/GearIcon.vue';
  import MoonIcon from '@/icons/MoonIcon.vue';
  import SunIcon from '@/icons/SunIcon.vue';
  import ArrowIcon from '@/icons/ArrowIcon.vue';
  import CrossIcon from '@/icons/CrossIcon.vue';
  import DeleteIcon from '@/icons/DeleteIcon.vue';
  import BurgerIcon from '@/icons/BurgerIcon.vue';
  import AddIcon from '@/icons/AddIcon.vue';
  import PressureIcon from '@/icons/PressureIcon.vue';

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
      GearIcon,
      MoonIcon,
      SunIcon,
      ArrowIcon,
      CrossIcon,
      DeleteIcon,
      BurgerIcon,
      AddIcon,
      PressureIcon,
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
                this.getWeatherHelper(r, newRequest, id);
              });
            })
            .catch((e) => console.log(e))
            .finally(() => {
              this.isLoading = false;
            });
        } else {
          getWeather(query)
            .then((e) => {
              this.getWeatherHelper(e, newRequest, id);
            })
            .catch((e) => console.log(e))
            .finally(() => {
              this.isLoading = false;
            });
        }
      },
      getWeatherHelper(
        e: TOpenWeatherResponse,
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
              { query: e.name, id: this.numberOfQueries },
            ];
            this.numberOfQueries++;
            localStorage.setItem('queries', JSON.stringify(newQueries));
            this.changedQueries = [...newQueries];
            this.queries = [...newQueries];
          }
          e.customId = id || 0;
          e.imgSrc = `https://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png`;
          if (this.isSettingsOpen) {
            this.changedAnswers.push(e);
          } else {
            this.answers.push(e);
          }
        }
      },
      fetchIpAndAddCity() {
        checkIp()
          .then((res) => {
            if ('city' in res) {
              this.fetchWeather(res.city, true);
            } else {
              this.fetchWeather('New York', true);
              throw res;
            }
          })
          .catch((e) => console.log(e));
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
          const isThisFirstRequest = this.changedAnswers.some(
            (i) => i.name === this.cityInput
          );
          if (!isThisFirstRequest) {
            this.fetchWeather(this.cityInput, true, this.numberOfQueries);
            this.cityInput = '';
          } else {
            this.error = 'City already added!';
          }
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
