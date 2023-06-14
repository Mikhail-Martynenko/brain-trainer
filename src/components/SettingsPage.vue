<template>
    <div class="setting-container">
        <div>
            <h1>Привет!</h1>
            <div class="statistic_text">
                <p>Добро пожаловать на {{ sessionStore.state.sessions.length + 1 }} тренировочный день,</p>
                <p>Ваш последний результат - решено {{ lastSession.score }} из
                   {{ lastSession.score + lastSession.missed }}</p>
                <p>Общая точность {{ sessionStore.getters.getAccuracy }}%</p>
            </div>
        </div>
        <form @submit.prevent="startGame">
            <h2>Настройки</h2>
            <input type="range" v-model.number="roundTime" min="1" max="15" @input="saveSettings" />
            <span>Длительность {{ roundTime }} минут</span>

            <br>
            <input
                    type="range" v-model.number="selectedDifficulty" min="1" :max="maxDifficultyLevel"
                    @input="saveSettings"
            />
            <span>Сложность {{ selectedDifficulty }}</span>
            <br>
            <div class="operators">
                <label v-for="operator in ALLOWED_OPERATORS" :key="operator.symbol">
                    <input
                            type="checkbox" v-model="operator.checked" @change="updateSelectedOperators"
                    />
                    {{ operator.label }}
                </label>
            </div>
            <button class="start_game_button" type="submit">Play!</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';

import {ALLOWED_OPERATORS, Operator, Task, GenerateTaskParams} from '@/domain/domain';
import router from "@/router";
import {useStore} from "vuex";
import game, {maxDifficultyLevel} from "@/domain/game";

const taskStore = useStore('taskStore');
const sessionStore = useStore('sessionStore');

let selectedOperators: Operator[] = [];
const selectedDifficulty = ref<number>(game.config.level);
const roundTime = ref(7);
const lastSession = sessionStore.getters.getLastSession;
const currentTask = ref<Task>({
    startValue: 0,
    operators: [],
    answer: [],
    result: 0,
    equation: '',
    complexity: 1,
});

onMounted(() => {
    const savedSelectedDifficulty = localStorage.getItem('selectedDifficulty');
    const savedRoundTime = localStorage.getItem('roundTime');
    const savedSelectedOperators = localStorage.getItem('selectedOperators');
    if (!savedSelectedDifficulty) return;
    selectedDifficulty.value = parseInt(savedSelectedDifficulty);

    if (!savedRoundTime) return;
    roundTime.value = parseInt(savedRoundTime);

    if (!savedSelectedOperators) return;
    const operatorLabels = JSON.parse(savedSelectedOperators);
    selectedOperators = ALLOWED_OPERATORS.map(operator => {
        operator.checked = operatorLabels.includes(operator.label);
        return operator;
    });
});
const saveSettings = () => {
    localStorage.setItem('selectedDifficulty', selectedDifficulty.value.toString());
    localStorage.setItem('roundTime', roundTime.value.toString());
    localStorage.setItem('selectedOperators', JSON.stringify(selectedOperators.map(operator => operator.label)));
};
const updateSelectedOperators = () => {
    selectedOperators = ALLOWED_OPERATORS.filter(operator => operator.checked);
    saveSettings()
};

const startGame = () => {
    const selectedOperatorSymbols = selectedOperators.map(operator => operator.label);

    const params: GenerateTaskParams = {
        complexity: selectedDifficulty.value,
        allowedOperators: ALLOWED_OPERATORS.filter(operator => selectedOperatorSymbols.includes(operator.label)),
    };

    currentTask.value = game.generator.generateTask(params);
    taskStore.dispatch('setCurrentTask', currentTask.value);

    game.session.timer = roundTime.value
    sessionStore.dispatch('startSession', game.session);

    router.push({name: 'gamePage'});
};


</script>

<style>
h1 {
    text-align: left;
}

.statistic_text {
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

form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.operators {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
}

.start_game_button {
    position: absolute;
    bottom: 20px;
    right: 40px;
    background-color: white;
    border: none;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
    width: 75px;
    height: 35px;
}

.start_game_button:active {
    transform: translateY(2px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
