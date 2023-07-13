<template>
    <div>
        <h1>Привет!</h1>
        <div class="statistic_text">
            <p>Добро пожаловать на {{ props.sessionCount }} тренировочный день,</p>
            <p>Ваш последний результат - решено {{ props.lastSessionScore }} из {{ props.lastSessionTotal }}</p>
            <p>Общая точность {{ props.accuracy }}%</p>
        </div>
    </div>
</template>

<script setup lang="ts">

import {defineProps} from 'vue';

const props = defineProps({
    sessionCount: Number,
    lastSessionScore: Number,
    lastSessionTotal: Number,
    accuracy: Number,
});

</script>
<style>
.statistic_text {
    text-align: left;
}
</style>