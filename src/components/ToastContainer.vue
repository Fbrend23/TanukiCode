<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-vue-next'

const store = useNotificationStore()

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
}

const colors = {
  success: 'bg-green-100 border-green-500 text-green-800',
  error: 'bg-red-100 border-red-500 text-red-800',
  info: 'bg-blue-100 border-blue-500 text-blue-800',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-800'
}
</script>

<template>
  <div class="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 flex flex-col gap-2 pointer-events-none">
    <TransitionGroup enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="-translate-y-8 opacity-0" enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200 transform" leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-8 opacity-0">
      <div v-for="notification in store.notifications" :key="notification.id"
        class="pointer-events-auto flex items-start p-4 rounded-xl border-l-4 shadow-lg pr-10 relative cursor-pointer"
        :class="colors[notification.type]" @click="store.removeNotification(notification.id)">
        <component :is="icons[notification.type]" class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />

        <p class="text-sm font-medium pr-2">{{ notification.message }}</p>

        <button @click.stop="store.removeNotification(notification.id)"
          class="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors">
          <X class="w-4 h-4 opacity-50" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
