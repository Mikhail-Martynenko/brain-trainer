<template>
    <div class="setting-container">
        <WelcomeBlock
                :sessionCount="sessionStore.state.sessions.length + 1"
                :lastSessionScore="lastSession.score"
                :lastSessionTotal="lastSession.score + lastSession.missed"
                :accuracy="sessionStore.getters.getAccuracy"
        />
        <SettingsForm />
    </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import WelcomeBlock from "@/components/WelcomeBlock.vue";
import SettingsForm from "@/components/SettingsForm.vue";

const sessionStore = useStore('sessionStore');
const lastSession = sessionStore.getters.getLastSession;
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
