<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { Calendar } from 'lucide-vue-next';

const userStore = useUserStore();

// Generate last 365 days or just 60 days? GitHub shows a year.
// Let's do a smaller version for mobile friendly: last 4-5 months (approx 20 weeks).
const WEEKS_TO_SHOW = 15;

const calendarData = computed(() => {
    const today = new Date();
    // We want WEEKS_TO_SHOW columns
    // We align the start date to be a Sunday approximately WEEKS_TO_SHOW weeks ago.

    // Calculate the most recent Sunday (start of current week, if we consider Sun start)
    // Or rather: we want the grid to end with "Today" or "This Week".
    // Let's end on the current week's Saturday (or today? GitHub ends on Today and shifts grid).
    // Let's make the grid 7 rows x N cols.
    // The Last cell (bottom right) should be related to "Today" or "This Week Saturday".

    // Simplest: Calculate Start Date = Today - (N weeks * 7 days) + adjustments to align to Sunday.

    const targetEndDate = new Date(today);
    const targetStartDate = new Date(targetEndDate);
    targetStartDate.setDate(targetEndDate.getDate() - (WEEKS_TO_SHOW * 7) + 1);

    // Adjust to previous Sunday to start the grid cleanly
    while (targetStartDate.getDay() !== 0) {
        targetStartDate.setDate(targetStartDate.getDate() - 1);
    }

    const grid: { date: string; count: number; level: number }[] = [];

    const iter = new Date(targetStartDate);
    // We generate exactly WEEKS_TO_SHOW * 7 days
    const totalDays = WEEKS_TO_SHOW * 7;

    for (let i = 0; i < totalDays; i++) {
        const dateStr = iter.toISOString().split('T')[0] as string;
        const count = userStore.dailyActivity[dateStr] || 0;

        let level = 0;
        if (count > 0) level = 1;
        if (count > 5) level = 2;
        if (count > 15) level = 3;
        if (count > 30) level = 4;

        grid.push({ date: dateStr, count, level });
        iter.setDate(iter.getDate() + 1);
    }

    return grid;
});

const getLevelColor = (level: number) => {
    switch (level) {
        case 0: return 'bg-gray-100 border-transparent';
        case 1: return 'bg-tanuki-green/30 border-tanuki-green/20'; // light green
        case 2: return 'bg-tanuki-green/50 border-tanuki-green/40';
        case 3: return 'bg-tanuki-green/80 border-tanuki-green/60';
        case 4: return 'bg-tanuki-green border-tanuki-green-dark';
        default: return 'bg-gray-100';
    }
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
}
</script>

<template>
    <div class="card p-5 w-full overflow-hidden">
        <h3 class="text-lg font-bold text-tanuki-brown mb-4 flex items-center gap-2">
            <Calendar class="w-5 h-5 text-tanuki-green" />
            Calendrier d'assiduité
        </h3>

        <!-- Overflow for mobile scrolling -->
        <div class="overflow-x-auto pb-2 -mx-2 px-2">
            <div class="flex gap-1 min-w-max">
                <!-- Days of week labels -->
                <div class="grid grid-rows-7 gap-1 text-[9px] text-gray-400 font-bold items-center pr-2 pt-px">
                    <span class="h-3 leading-3">Dim</span>
                    <span class="h-3 leading-3 opacity-0">Lun</span>
                    <span class="h-3 leading-3">Mar</span>
                    <span class="h-3 leading-3 opacity-0">Mer</span>
                    <span class="h-3 leading-3">Jeu</span>
                    <span class="h-3 leading-3 opacity-0">Ven</span>
                    <span class="h-3 leading-3">Sam</span>
                </div>

                <!-- The Grid -->
                <!-- We need to group by columns (weeks) -->
                <!-- Since calendarData is flat (Sun->Mon->...), and we want Columns=Weeks, we can display using CSS Grid with grid-flow-col -->
                <div class="grid grid-rows-7 gap-1 grid-flow-col">
                    <div v-for="(day, idx) in calendarData" :key="idx"
                        :class="['w-3 h-3 rounded-sm border transition-all hover:scale-125 relative group', getLevelColor(day.level)]">

                        <!-- Tooltip -->
                        <div
                            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none">
                            {{ day.count }} activités le {{ formatDate(day.date) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-end gap-2 text-xs text-gray-400 mt-2">
            <span>Moins</span>
            <div class="flex gap-1">
                <div class="w-3 h-3 rounded-sm bg-gray-100"></div>
                <div class="w-3 h-3 rounded-sm bg-tanuki-green/30"></div>
                <div class="w-3 h-3 rounded-sm bg-tanuki-green/50"></div>
                <div class="w-3 h-3 rounded-sm bg-tanuki-green/80"></div>
                <div class="w-3 h-3 rounded-sm bg-tanuki-green"></div>
            </div>
            <span>Plus</span>
        </div>
    </div>
</template>
