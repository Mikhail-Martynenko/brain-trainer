<template>
    <form @submit.prevent="startGame">
        <h2>Настройки</h2>
        <div class="range_block">
            <SliderRange v-model="roundTime" label="Длительность" min="1" max="15" @input="saveSettings" />
            <SliderRange v-model="selectedDifficulty" label="Сложность" min="1" :max="maxDifficultyLevel" @input="saveSettings" />
        </div>
        <div class="operators">
            <label v-for="operator in ALLOWED_OPERATORS" :key="operator.symbol">
                <input type="checkbox" v-model="operator.checked" @change="updateSelectedOperators" />
                {{ operator.label }}
            </label>
        </div>
        <button class="start_game_button" type="submit">Play!</button>
    </form>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useStore} from 'vuex';
import game, {maxDifficultyLevel} from '@/domain/game';
import {ALLOWED_OPERATORS, GenerateTaskParams, Operator, Task} from "@/domain/domain";
import router from "@/router";
import SliderRange from "@/components/settings/SliderRange.vue";

let selectedOperators: Operator[] = [];
const roundTime = ref(7);
const selectedDifficulty = ref(game.config.level);

const taskStore = useStore('taskStore');
const sessionStore = useStore('sessionStore');

const currentTask = ref<Task>({
    startValue: 0,
    operators: [],
    answer: [],
    result: 0,
    equation: '',
    complexity: 1,
});

onMounted(initializeSettings);

function initializeSettings() {
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
}

const saveSettings = () => {
    localStorage.setItem('selectedDifficulty', selectedDifficulty.value.toString());
    localStorage.setItem('roundTime', roundTime.value.toString());
};

const updateSelectedOperators = () => {
    selectedOperators = ALLOWED_OPERATORS.filter(operator => operator.checked);
    localStorage.setItem('selectedOperators', JSON.stringify(selectedOperators.map(operator => operator.label)));
};

const startGame = () => {
    const selectedOperatorSymbols = selectedOperators.filter(operator => operator.checked).map(operator => operator.label);
    const allowedOperators = ALLOWED_OPERATORS.filter(operator => selectedOperatorSymbols.includes(operator.label));

    const params: GenerateTaskParams = {complexity: selectedDifficulty.value, allowedOperators: allowedOperators};

    currentTask.value = game.generator.generateTask(params);
    taskStore.dispatch('setCurrentTask', currentTask.value);

    game.session.timer = roundTime.value
    sessionStore.dispatch('startSession', game.session);

    router.push({name: 'gamePage'});
};
</script>
<style>
form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.range_block {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
    margin-bottom: 20px;
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