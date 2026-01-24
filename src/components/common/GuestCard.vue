<script setup lang="ts">
</script>

<template>
    <div class="w-full flex justify-center mb-8">
        <RouterLink to="/auth"
            class="bg-white border-2 border-tanuki-green/20 text-tanuki-green px-6 py-3 rounded-xl font-bold hover:bg-tanuki-green hover:text-white transition-all shadow-sm hover:shadow-md flex items-center gap-2 group">
            <img src="@/assets/tanuki-scroll.png" alt="Tanuki Étudiant" class="w-10 h-10 object-contain -ml-2" />
            <span>Connectez-vous pour sauvegarder votre progression</span>
        </RouterLink>
    </div>
</template>
