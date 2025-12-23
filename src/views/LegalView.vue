<script setup lang="ts">
import { ShieldCheck, UserMinus, Mail } from 'lucide-vue-next';
</script>

<template>
    <div class="max-w-5xl mx-auto px-4 py-12">
        <h1 class="text-4xl font-display font-bold text-tanuki-green mb-8 flex items-center gap-3">
            <ShieldCheck class="w-10 h-10" />
            Confidentialité & Mentions Légales
        </h1>

        <div class="space-y-8 text-tanuki-brown-dark bg-white p-8 rounded-3xl shadow-lg border border-tanuki-beige/50">
            <!-- Data Collection -->
            <section>
                <h2 class="text-2xl font-bold text-tanuki-green mb-4">1. Collecte des données</h2>
                <p class="leading-relaxed">
                    TanukiCode collecte uniquement les données nécessaires à votre expérience d'apprentissage :
                </p>
                <ul class="list-disc ml-6 mt-2 space-y-1">
                    <li>Votre adresse email (pour la création et la sécurisation de votre compte).</li>
                    <li>Votre progression (score, séries, records) pour vous permettre de la retrouver sur tous vos
                        appareils.</li>
                </ul>
                <p class="mt-4 italic">Nous ne vendons ni ne partageons vos données avec des tiers.</p>
            </section>

            <!-- Usage -->
            <section>
                <h2 class="text-2xl font-bold text-tanuki-green mb-4">2. Utilisation des données</h2>
                <p class="leading-relaxed">
                    Vos données sont stockées chez notre partenaire technique <strong>Supabase</strong> (infrastructure
                    sécurisée).
                    Elles sont utilisées exclusivement pour :
                </p>
                <ul class="list-disc ml-6 mt-2 space-y-1">
                    <li>Sauvegarder et synchroniser votre progression.</li>
                    <li>Améliorer l'application sur la base de statistiques anonymisées.</li>
                </ul>
            </section>

            <!-- nLPD / GDPR Rights -->
            <section>
                <h2 class="text-2xl font-bold text-tanuki-green mb-4 flex items-center gap-2">
                    <UserMinus class="w-6 h-6" />
                    3. Vos droits (Droit à l'oubli)
                </h2>
                <p class="leading-relaxed mb-4">
                    Conformément à la <strong>RGPD</strong> et à la <strong>nLPD</strong> (Suisse), vous disposez d'un
                    droit d'accès, de modification et de suppression de vos données.
                </p>
                <div class="bg-tanuki-beige/20 p-4 rounded-xl border border-tanuki-beige">
                    <p class="font-bold">Comment supprimer vos données ?</p>
                    <p class="text-sm mt-1">
                        Vous pouvez supprimer votre compte et toutes les données associées directement depuis votre
                        profil dans l'en-tête de l'application (Bouton "Supprimer mon compte").
                        Toute suppression est immédiate et irréversible.
                    </p>
                </div>
            </section>

            <!-- Contact -->
            <section>
                <h2 class="text-2xl font-bold text-tanuki-green mb-4 flex items-center gap-2">
                    <Mail class="w-6 h-6" />
                    4. Contact
                </h2>
                <p class="leading-relaxed">
                    Pour toute question relative à vos données personnelles, vous pouvez contacter le responsable du
                    site via
                    <a href="https://contact.brendanfleurdelys.ch/?origin=tanuki" target="_blank"
                        class="text-tanuki-green font-bold hover:underline">
                        notre formulaire de contact
                    </a>.
                </p>
            </section>

            <footer class="pt-8 border-t border-tanuki-beige/50 text-sm text-gray-400 text-center">
                Dernière mise à jour : 23 décembre 2025
            </footer>
        </div>

        <div class="mt-12 text-center">
            <RouterLink to="/" class="text-tanuki-green font-bold hover:underline">
                ← Retour à l'accueil
            </RouterLink>
        </div>
    </div>
</template>
