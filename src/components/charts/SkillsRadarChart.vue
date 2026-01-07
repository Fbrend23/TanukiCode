<script setup lang="ts">
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js'
import { Radar } from 'vue-chartjs'
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { hiragana, katakana } from '@/data/kana'
import { vocabulary } from '@/data/vocabulary'
import { kanjiList } from '@/data/kanji'
import { grammarLessons } from '@/data/grammar'
import { Hexagon } from 'lucide-vue-next'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const userStore = useUserStore()

const chartData = computed(() => {
  const availableKana = [...hiragana.filter(k => k.char), ...katakana.filter(k => k.char)].length;

  const masteredIds = userStore.masteredItems;

  // Using any for the data lists because their structures vary slightly but all have an ID/Char field we check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countMastered = (list: any[], idKey: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.filter((item: any) => masteredIds.includes(item[idKey] || item.char || item.character || item.word)).length;
  }

  const mKana = countMastered([...hiragana, ...katakana], 'char');
  const mKanji = countMastered(kanjiList, 'character');
  const mVocab = countMastered(vocabulary, 'word');
  const mGrammar = countMastered(grammarLessons, 'id');

  const sKana = availableKana ? (mKana / availableKana) * 100 : 0;
  const sKanji = kanjiList.length ? (mKanji / kanjiList.length) * 100 : 0;
  const sVocab = vocabulary.length ? (mVocab / vocabulary.length) * 100 : 0;
  const sGrammar = grammarLessons.length ? (mGrammar / grammarLessons.length) * 100 : 0;

  const sStreak = Math.min((userStore.streak / 30) * 100, 100);

  return {
    labels: ['Kanas', 'Kanjis', 'Vocabulaire', 'Grammaire', 'Série'],
    datasets: [
      {
        label: 'Compétences',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderColor: '#FFC107',
        pointBackgroundColor: '#FFC107',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#FFC107',
        data: [sKana, sKanji, sVocab, sGrammar, sStreak]
      }
    ]
  }
})

const chartOptions = {
  layout: {
    padding: -10
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#5D4037',
      titleColor: '#F5F5DC',
      bodyColor: '#fff',
      callbacks: {
        label: function (context: TooltipItem<'radar'>) {
          return (context.raw as number).toFixed(0) + '%';
        }
      }
    }
  },
  scales: {
    r: {
      angleLines: {
        color: 'rgba(0,0,0,0.1)'
      },
      grid: {
        color: 'rgba(0,0,0,0.1)'
      },
      pointLabels: {
        font: {
          family: "'Fredoka', sans-serif",
          size: 12
        },
        color: '#795548'
      },
      ticks: {
        display: false,
        stepSize: 20
      },
      suggestedMin: 0,
      suggestedMax: 100
    }
  }
}
</script>

<template>
  <div class="card p-2 md:p-3 w-full h-72 flex flex-col overflow-hidden">
    <h3 class="text-lg font-bold text-tanuki-brown mb-4 flex items-center justify-center gap-2">
      <Hexagon class="w-5 h-5 text-tanuki-green" />
      Radar Compétences
    </h3>
    <div class="w-full flex-1 min-h-0 relative">
      <Radar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
