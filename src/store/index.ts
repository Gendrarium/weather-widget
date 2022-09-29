import { createStore } from 'vuex';
import type { IOpenWeather } from '@/utils/interfaces';
import { TQuery } from '@/interfaces';

export interface State {
  isNightTheme: boolean;
  isLoading: boolean;
  queries: TQuery[];
  answers: IOpenWeather[];
}

export default createStore<State>({
  state: {
    isNightTheme: false,
    isLoading: true,
    queries: [],
    answers: [],
  },
  mutations: {
    toggleIsNightTheme(state) {
      state.isNightTheme = !state.isNightTheme;
    },
    setIsLoading(state, payload: boolean) {
      state.isLoading = payload;
    },
    setQueries(state, queries: TQuery[]) {
      state.queries = queries;
    },
    setAnswers(state, answers: IOpenWeather[]) {
      state.answers = answers;
    },
  },
  actions: {},
});
