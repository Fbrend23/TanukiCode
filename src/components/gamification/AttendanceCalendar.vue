<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { Calendar } from 'lucide-vue-next';

const userStore = useUserStore();

const tooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    count: 0,
    date: '',
    align: 'center'
});

const showTooltip = (event: MouseEvent, day: { date: string; count: number; level: number }) => {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const threshold = 100;

    let align = 'center';
    let x = rect.left + rect.width / 2;

    if (rect.left < threshold) {
        align = 'left';
        x = rect.left;
    } else if (rect.right > viewportWidth - threshold) {
        align = 'right';
        x = rect.right;
    }

    tooltip.value = {
        visible: true,
        x,
        y: rect.top - 8,
        count: day.count,
        date: day.date,
        align
    };
};

const hideTooltip = () => {
    tooltip.value.visible = false;
};

const weeksToShow = ref(15);

const updateWeeks = () => {
    // Mobile: 12 weeks, Desktop: 25 weeks
    weeksToShow.value = window.innerWidth < 768 ? 12 : 25;
};

onMounted(() => {
    updateWeeks();
    window.addEventListener('resize', updateWeeks);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateWeeks);
});

const selectedYear = ref<string | number>('recent');

const availableYears = computed(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();
    years.add(currentYear);

    // Add years from data
    Object.keys(userStore.dailyActivity).forEach(date => {
        const y = parseInt(date.substring(0, 4));
        if (!isNaN(y)) years.add(y);
    });

    return Array.from(years).sort((a, b) => b - a);
});

const cellSize = computed(() => selectedYear.value === 'recent' ? 'w-5 h-5' : 'w-3 h-3');
const labelSize = computed(() => selectedYear.value === 'recent' ? 'h-5 leading-5' : 'h-3 leading-3');

const calendarData = computed(() => {
    let targetStartDate: Date;
    let totalDays: number;

    if (selectedYear.value === 'recent') {
        const today = new Date();
        const endDate = new Date(today);

        // Determine days in the current partial week (Mon=1 ... Sun=7)
        const currentDayIndex = today.getDay();
        const daysInLastColumn = currentDayIndex === 0 ? 7 : currentDayIndex;

        // We want 'weeksToShow' total columns.
        const fullWeeks = weeksToShow.value - 1;
        const totalDaysToSubtract = (fullWeeks * 7) + (daysInLastColumn - 1);

        targetStartDate = new Date(endDate);
        targetStartDate.setDate(endDate.getDate() - totalDaysToSubtract);

        totalDays = (fullWeeks * 7) + daysInLastColumn;
    } else {
        // Specific Year View (Full Year)
        const year = selectedYear.value as number;

        // Start: Find the first Monday of the year (or previous year if week starts earlier)
        // Standard approach: Start at Jan 1, backup to Monday.
        const jan1 = new Date(year, 0, 1);
        const jan1Day = jan1.getDay(); // 0=Sun
        const distanceToMon = jan1Day === 0 ? 6 : jan1Day - 1;

        targetStartDate = new Date(jan1);
        targetStartDate.setDate(jan1.getDate() - distanceToMon);

        // End: Find last Sunday of the year
        const dec31 = new Date(year, 11, 31);
        const dec31Day = dec31.getDay();
        const distanceToSun = dec31Day === 0 ? 0 : 7 - dec31Day;

        const targetEndDate = new Date(dec31);
        targetEndDate.setDate(dec31.getDate() + distanceToSun);

        // Calculate days difference
        const diffTime = Math.abs(targetEndDate.getTime() - targetStartDate.getTime());
        totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const grid: { date: string; count: number; level: number }[] = [];

    const iter = new Date(targetStartDate);
    for (let i = 0; i < totalDays; i++) {
        // Use local date components
        const year = iter.getFullYear();
        const month = String(iter.getMonth() + 1).padStart(2, '0');
        const day = String(iter.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

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
    <div class="card p-2 md:p-3 w-full overflow-hidden">
        <h3 class="text-lg font-bold text-tanuki-brown mb-4 flex items-center justify-center gap-2">
            <Calendar class="w-5 h-5 text-tanuki-green" />
            Calendrier d'assiduité
        </h3>

        <!-- Year Selector -->
        <div class="flex gap-2 justify-center mb-4 flex-wrap">
            <button class="px-3 py-1 text-xs font-bold rounded-full transition-colors border"
                :class="selectedYear === 'recent' ? 'bg-tanuki-green text-white border-tanuki-green' : 'bg-white text-gray-500 border-gray-200 hover:border-tanuki-green hover:text-tanuki-green'"
                @click="selectedYear = 'recent'">
                Récents
            </button>
            <button v-for="year in availableYears" :key="year"
                class="px-3 py-1 text-xs font-bold rounded-full transition-colors border"
                :class="selectedYear === year ? 'bg-tanuki-green text-white border-tanuki-green' : 'bg-white text-gray-500 border-gray-200 hover:border-tanuki-green hover:text-tanuki-green'"
                @click="selectedYear = year">
                {{ year }}
            </button>
        </div>

        <!-- Overflow for mobile scrolling -->
        <div class="overflow-x-auto pb-2 pt-10 -mx-2 px-2">
            <div class="flex gap-1 min-w-max">
                <!-- Days of week labels -->
                <div class="grid grid-rows-7 gap-1 text-[9px] text-gray-400 font-bold items-center pr-2 pt-px">
                    <span :class="labelSize">Lun</span>
                    <span :class="[labelSize, 'opacity-0']">Mar</span>
                    <span :class="labelSize">Mer</span>
                    <span :class="[labelSize, 'opacity-0']">Jeu</span>
                    <span :class="labelSize">Ven</span>
                    <span :class="[labelSize, 'opacity-0']">Sam</span>
                    <span :class="labelSize">Dim</span>
                </div>

                <!-- The Grid -->
                <!-- We need to group by columns (weeks) -->
                <!-- Since calendarData is flat (Sun->Mon->...), and we want Columns=Weeks, we can display using CSS Grid with grid-flow-col -->
                <div class="grid grid-rows-7 gap-1 grid-flow-col">
                    <div v-for="(day, idx) in calendarData" :key="idx" @mouseenter="showTooltip($event, day)"
                        @mouseleave="hideTooltip" @click="showTooltip($event, day)"
                        :class="[cellSize, 'rounded border transition-all hover:scale-125 relative hover:z-10 cursor-pointer', getLevelColor(day.level)]">
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
            <span>Moins</span>
            <div class="flex gap-1">
                <div :class="[cellSize, 'rounded bg-gray-100']"></div>
                <div :class="[cellSize, 'rounded bg-tanuki-green/30']"></div>
                <div :class="[cellSize, 'rounded bg-tanuki-green/50']"></div>
                <div :class="[cellSize, 'rounded bg-tanuki-green/80']"></div>
                <div :class="[cellSize, 'rounded bg-tanuki-green']"></div>
            </div>
            <span>Plus</span>
        </div>
    </div>

    <Teleport to="body">
        <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="tooltip.visible"
                class="fixed z-9999 px-3 py-1.5 text-xs font-bold text-white bg-gray-900/90 backdrop-blur-sm shadow-xl rounded-lg pointer-events-none transform -translate-y-full border border-white/10 whitespace-nowrap"
                :class="tooltip.align === 'left' ? 'translate-x-0' : (tooltip.align === 'right' ? '-translate-x-full' : '-translate-x-1/2')"
                :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }">
                {{ tooltip.count }} activités le {{ formatDate(tooltip.date) }}
            </div>
        </Transition>
    </Teleport>
</template>
