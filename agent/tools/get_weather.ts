import { defineTool } from "eve/tools";
import { z } from "zod";
import { fetchWeatherApi } from "openmeteo";

export default defineTool({
  description: "Get the current weather and daily forecast for a given latitude and longitude.",
  inputSchema: z.object({
    latitude: z.number().describe("The latitude of the location"),
    longitude: z.number().describe("The longitude of the location"),
  }),
  async execute({ latitude, longitude }) {
    const params = {
      latitude: [latitude],
      longitude: [longitude],
      current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max'
    };
    
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    
    if (!responses || responses.length === 0) {
      throw new Error("No weather data found");
    }

    const response = responses[0];
    const current = response.current()!;
    const daily = response.daily()!;
    
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const timeRange = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
      (t) => new Date((t + utcOffsetSeconds) * 1000).toISOString().split('T')[0]
    );

    return {
      current: {
        temperatureC: current.variables(0)!.value(),
        weatherCode: current.variables(1)!.value(),
        windSpeed: current.variables(2)!.value(),
        windDirection: current.variables(3)!.value(),
        precipitation: current.variables(4)!.value(),
      },
      dailyForecast: {
        time: timeRange,
        weatherCode: Array.from(daily.variables(0)!.valuesArray() || []),
        temperatureMaxC: Array.from(daily.variables(1)!.valuesArray() || []),
        temperatureMinC: Array.from(daily.variables(2)!.valuesArray() || []),
        precipitationSum: Array.from(daily.variables(3)!.valuesArray() || []),
        precipitationProbabilityMax: Array.from(daily.variables(4)!.valuesArray() || []),
      }
    };
  },
});
