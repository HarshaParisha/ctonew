import MoodTapModel from '../models/MoodTap.js';
import { MoodType, MoodData, GlobalStats, MoodMessage } from '../types.js';

const MOOD_WEIGHTS: { [key in MoodType]: number } = {
  happy: 1,
  sad: -0.8,
  angry: -1,
  tired: -0.3,
  emotional: -0.5,
  chaotic: -0.6,
};

export class MoodEngine {
  async calculateGlobalStats(): Promise<GlobalStats> {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentTaps = await MoodTapModel.find({
      timestamp: { $gte: oneDayAgo },
    });

    const countryMap = new Map<string, MoodData>();
    const cityMap = new Map<string, Map<string, MoodData>>();
    const messages: MoodMessage[] = [];

    for (const tap of recentTaps) {
      if (!countryMap.has(tap.country)) {
        countryMap.set(tap.country, {
          country: tap.country,
          moods: {
            happy: 0,
            sad: 0,
            angry: 0,
            tired: 0,
            emotional: 0,
            chaotic: 0,
          },
          total: 0,
          dominantMood: 'happy',
          percentage: 0,
        });
      }

      const countryData = countryMap.get(tap.country)!;
      countryData.moods[tap.mood as MoodType]++;
      countryData.total++;

      if (!cityMap.has(tap.country)) {
        cityMap.set(tap.country, new Map());
      }

      const countryCity = cityMap.get(tap.country)!;
      const cityKey = `${tap.country}-${tap.city}`;

      if (!countryCity.has(cityKey)) {
        countryCity.set(cityKey, {
          country: tap.country,
          city: tap.city,
          moods: {
            happy: 0,
            sad: 0,
            angry: 0,
            tired: 0,
            emotional: 0,
            chaotic: 0,
          },
          total: 0,
          dominantMood: 'happy',
          percentage: 0,
        });
      }

      const cityData = countryCity.get(cityKey)!;
      cityData.moods[tap.mood as MoodType]++;
      cityData.total++;

      if (tap.message) {
        messages.push({
          mood: tap.mood as MoodType,
          message: tap.message,
          country: tap.country,
          city: tap.city,
          timestamp: tap.timestamp,
        });
      }
    }

    const countryData = Array.from(countryMap.values()).map((data) => {
      const dominantMood = (Object.entries(data.moods).sort(([, a], [, b]) => b - a)[0][0] as MoodType) || 'happy';
      return {
        ...data,
        dominantMood,
        percentage: data.total > 0 ? (data.moods[dominantMood] / data.total) * 100 : 0,
      };
    });

    const cityData: { [country: string]: MoodData[] } = {};
    cityMap.forEach((cities, country) => {
      cityData[country] = Array.from(cities.values()).map((data) => {
        const dominantMood = (Object.entries(data.moods).sort(([, a], [, b]) => b - a)[0][0] as MoodType) || 'happy';
        return {
          ...data,
          dominantMood,
          percentage: data.total > 0 ? (data.moods[dominantMood] / data.total) * 100 : 0,
        };
      });
    });

    const worldMoodIndex = this.calculateWorldMoodIndex(recentTaps);
    const recentMessages = messages
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);

    return {
      worldMoodIndex,
      totalTaps: recentTaps.length,
      recentMessages,
      countryData,
      cityData,
    };
  }

  private calculateWorldMoodIndex(taps: any[]): number {
    if (taps.length === 0) return 5.0;

    let totalWeight = 0;
    for (const tap of taps) {
      totalWeight += MOOD_WEIGHTS[tap.mood as MoodType];
    }

    const avgWeight = totalWeight / taps.length;
    const normalized = ((avgWeight + 1) / 2) * 10;

    return Math.max(0, Math.min(10, normalized));
  }

  async saveMoodTap(tap: {
    mood: string;
    timestamp: number;
    country: string;
    city: string;
    message?: string;
  }): Promise<void> {
    const moodTap = new MoodTapModel(tap);
    await moodTap.save();
  }
}
