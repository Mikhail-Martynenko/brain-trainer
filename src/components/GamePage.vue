<template>

    <div class="game-container">
        <div>{{ currentTask?.equation }}</div>
        <input
                class="input-skip"
                v-model="currentAnswer"
                type="text"
                readonly
        />
        <div class="buttons">
            <div class="keyboard">
                <button v-for="digit in digits" :key="digit" @click="addDigit(digit)">{{ digit }}</button>
            </div>
            <div class="helpers-buttons">
                <button @click="checkAnswer"> &lt;</button>
                <button @click="checkAnswer"> &gt;</button>
                <button @click="checkAnswer"> ?</button>
                <button @click="checkAnswer">=</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useStore} from 'vuex';
import {Task} from "@/domain/domain";

const store = useStore();

const currentTask: Task | null = store.state.currentTask;
const currentAnswer = ref('');
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];


const addDigit = (digit: any) => {
    currentAnswer.value += digit;
};

const checkAnswer = () => {
    // Выполнение логики проверки ответа
};
</script>

<style scoped>
.game-container {
    padding: 40px;
    width: 800px;
    height: 600px;
    border: 1px solid salmon;
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.keyboard {
    /*display: grid;*/
    /*grid-template-columns: repeat(3, 1fr);*/
    /*grid-gap: 10px;*/
    /*width: 40px;*/
    /*height: 40px;*/
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-around;
    width: 200px;
    gap: 20px;
    margin: 40px;
}

.keyboard button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f9734d;
    border: 1px solid #f76f48;
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.5);
    font-size: 20px;
    font-weight: 700;
}

.keyboard button:active {
    transform: translateY(2px);
    box-shadow: 0 4px 2px rgba(0, 0, 0, 0.3);
}

.helpers-buttons {
    width: 50px;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-around;
    gap: 20px;
}

.helpers-buttons button {
    width: 50px;
    height: 50px;
    color: black;
    font-size: 20px;
    font-weight: 700;
    border-radius: 50%;
    background-color: #7a7a7a;
    border: 1px solid #6f6f6f;
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.5);
}

.helpers-buttons button:active {
    transform: translateY(2px);
    box-shadow: 0 4px 2px rgba(0, 0, 0, 0.3);
}
</style>
