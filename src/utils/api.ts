import type { IIp, IOpenWeather, TOpenWeatherResponse } from './interfaces';

// export const getWeather = (query: string): Promise<TOpenWeatherResponse> => {
//   return fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${
//       process.env.WEATHER_API_KEY ? process.env.WEATHER_API_KEY : ''
//     }`
//   )
//     .then((res) => {
//       if (res.status === 200) {
//         return res.json();
//       } else {
//         throw res;
//       }
//     })
//     .then((res: IOpenWeather) => {
//       return res;
//     })
//     .catch((e: Response | Error) => {
//       if (e instanceof Response) {
//         if (e.status === 404) {
//           return { message: 'Not found city' };
//         } else {
//           return { message: 'Unknown error' };
//         }
//       } else {
//         return { message: 'Unknown error' };
//       }
//     });
// };

export const getWeather = (query: string): Promise<TOpenWeatherResponse> => {
  return Promise.resolve({
      coord: { lon: -74.006, lat: 40.7143 },
      weather: [
        {
          id: 804,
          main: 'Clouds',
          description: 'overcast clouds',
          icon: '04d',
        },
      ],
      base: 'stations',
      main: {
        temp: 21.2,
        feels_like: 21.52,
        temp_min: 18.42,
        temp_max: 23.44,
        pressure: 1018,
        humidity: 82,
      },
      visibility: 10000,
      wind: { speed: 4.63, deg: 50 },
      clouds: { all: 100 },
      dt: 1662931324,
      sys: {
        type: 2,
        id: 2039034,
        country: 'US',
        sunrise: 1662892372,
        sunset: 1662937966,
      },
      timezone: -14400,
      id: 5128581,
      name: query,
      cod: 200,
    }
  );
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
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
