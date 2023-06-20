<template>
    <div class="setting-container">
        <WelcomeBlock
                :sessionCount="statisticsGame.statistics.sessions.length + 1"
                :lastSessionScore="statisticsGame.getLastSession().score"
                :lastSessionTotal="statisticsGame.getLastSession().score + statisticsGame.getLastSession().missed"
                :accuracy="statisticsGame.getAccuracy()"
        />
        <SettingsForm />
    </div>
</template>

<script setup lang="ts">
import WelcomeBlock from "@/components/settings/WelcomeBlock.vue";
import SettingsForm from "@/components/settings/SettingsForm.vue";
import statisticsGame from "@/domain/statisticsGame";
</script>

<style>
h1 {
    text-align: left;
}

.setting-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #6f6f6f;
    padding: 40px;
    width: 400px;
    position: relative;
}
</style>
