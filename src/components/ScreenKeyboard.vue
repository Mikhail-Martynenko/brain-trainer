<template>
    <div class="buttons">
        <div class="keyboard">
            <button v-for="digit in digits" :key="digit" @click="addDigit(digit)">{{ digit }}</button>
        </div>
        <div class="helpers-buttons">
            <button @click="focusFieldLeft">&lt;</button>
            <button @click="focusFieldRight">&gt;</button>
            <button @click="showAnswer">?</button>
            <button @click="checkAnswer">=</button>
        </div>
    </div>

</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Task} from "@/domain/domain";
import taskStore from "@/store/task";
import {useStore} from "vuex";
import game from "@/domain/game";

const activeIndex = ref<number>(0); // Реактивная переменная для отслеживания активного индекса
let currentTask: Task | null = taskStore.state.currentTask;
const sessionStore = useStore('sessionStore');
const inputStore = useStore('inputStore');

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];


const inputValues = inputStore.getters.getInputValues
const addDigit = (digit: number) => {
    console.log(inputValues)
    const currentIndex = activeIndex.value;
    const inputElements = document.querySelectorAll('.equation-char');
    if (inputElements.length === 0 || currentIndex < 0 || currentIndex >= inputElements.length) return;

    const activeInput = inputElements[currentIndex] as HTMLInputElement;
    activeInput.value += digit;
    inputStore.dispatch('updateInputValue', {index: currentIndex, value: Number(activeInput.value)});
};

const focusFieldLeft = () => {
    const currentIndex = activeIndex.value;
    const inputElements = document.querySelectorAll('.equation-char');
    if (inputElements.length === 0) return;
    const lastIndex = inputElements.length - 1;

    const newIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    activeIndex.value = newIndex;
    (inputElements[newIndex] as HTMLInputElement).focus();

};

const focusFieldRight = () => {
    const currentIndex = activeIndex.value;
    const inputElements = document.querySelectorAll('.equation-char');
    if (inputElements.length === 0) return;

    const lastIndex = inputElements.length - 1;

    const newIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    activeIndex.value = newIndex;
    (inputElements[newIndex] as HTMLInputElement).focus();
};

const showAnswer = () => {
    if (!currentTask) return;

    const inputElements = document.querySelectorAll('.equation-char');
    if (inputElements.length === 0) return;

    currentTask.answer.forEach((value, index) => {
        const inputElement = inputElements[index] as HTMLInputElement;
        inputElement.value = String(value);
        inputStore.dispatch('updateInputValue', {index, value});
    });
};

const checkAnswer = () => {
    if (!currentTask) return;
    console.log(inputValues, 'inputValues.value');
    currentTask.answer = Object.values(inputValues) // .slice(0,currentTask.answer.length)
    console.log(Object.values(currentTask.answer), 'Решение на проверку')
    const isCorrect = game.resolver.checkTask(currentTask);

    if (isCorrect) {
        // modalTitle.value = 'Верно!';
        // showModal.value = true;
        sessionStore.dispatch('incrementScore')
    } else {
        // modalTitle.value = 'Неверно!';
        // showModal.value = true;
        sessionStore.dispatch('incrementMissed')
    }
};
</script>

<style scoped>
.keyboard {
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

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
