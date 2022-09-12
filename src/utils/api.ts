import type { IIp, IOpenWeather, TOpenWeatherResponse } from './interfaces';

export const getWeather = (query: string): Promise<TOpenWeatherResponse> => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${
      process.env.WEATHER_API_KEY ? process.env.WEATHER_API_KEY : ''
    }`
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw res;
      }
    })
    .then((res: IOpenWeather) => {
      return res;
    })
    .catch((e: Response | Error) => {
      if (e instanceof Response) {
        if (e.status === 404) {
          return { message: 'Not found city' };
        } else {
          return { message: 'Unknown error' };
        }
      } else {
        return { message: 'Unknown error' };
      }
    });
};

export const checkIp = (): Promise<IIp> => {
  return fetch(
    `https://ipinfo.io/?token=${
      process.env.IP_API_KEY ? process.env.IP_API_KEY : ''
    }`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw Error('Error');
      }
    })
    .catch((err) => {
      return err;
    });
};
