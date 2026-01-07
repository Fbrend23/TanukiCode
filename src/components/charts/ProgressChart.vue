<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ScriptableContext
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { TrendingUp } from 'lucide-vue-next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const userStore = useUserStore()

const chartData = computed(() => {
  const labels: string[] = []
  const dataPoints: number[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0] || ''

    labels.push(d.toLocaleDateString('fr-FR', { weekday: 'short' }))
    dataPoints.push(userStore.dailyActivity[dateStr] || 0)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Activité',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(76, 175, 80, 0.4)');
          gradient.addColorStop(1, 'rgba(76, 175, 80, 0.0)');
          return gradient;
        },
        borderColor: '#4CAF50',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4CAF50',
        pointHoverBackgroundColor: '#4CAF50',
        pointHoverBorderColor: '#fff',
        data: dataPoints,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
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
      padding: 10,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#795548'
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0,0,0,0.05)'
      },
      ticks: {
        display: false
      }
    }
  }
}
</script>

<template>
  <div class="card p-2 md:p-3 w-full h-72 flex flex-col overflow-hidden">
    <h3 class="text-lg font-bold text-tanuki-brown mb-4 flex items-center justify-center gap-2">
      <TrendingUp class="w-5 h-5 text-tanuki-green" />
      Progression (7 jours)
    </h3>
    <div class="w-full flex-1 min-h-0 relative">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
