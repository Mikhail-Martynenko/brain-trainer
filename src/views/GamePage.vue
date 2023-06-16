<template>
    <div class="game-container">
        <div class="cancel">
            <button @click="cancelButton">Oтмена</button>
        </div>
        <TimerSession />
        <EquationContainer :equation="currentTask?.equation ? Array.from(currentTask.equation) : undefined" />
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
        <!--        <ScreenKeyboard :inputValues="inputValues" :updateInputValue="updateInputValue"/>-->
        <ModalResult v-if="showModal" :title="modalTitle" :show="showModal" @close="closeModal" />
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useStore} from 'vuex';
import {GenerateTaskParams, Task} from "@/domain/domain";
import game from "@/domain/game";
import router from "@/router";
import ModalResult from "@/components/ModalResult.vue";
import generator from "@/domain/generator";
import TimerSession from "@/components/TimerSession.vue";
import EquationContainer from "@/components/EquationContainer.vue";

const taskStore = useStore('taskStore');
const sessionStore = useStore('sessionStore');
const inputStore = useStore('inputStore');

const activeIndex = ref<number>(0); // Реактивная переменная для отслеживания активного индекса
const showModal = ref(false);
const modalTitle = ref('');

const inputValues = inputStore.getters.getInputValues

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

let currentTask = taskStore.getters.getCurrentTask;

const updateInputValue = (index: number, value: number) => {
    inputStore.dispatch('updateInputValue', {index, value})
};
const addDigit = (digit: number) => {
    const currentIndex = activeIndex.value;
    const inputElements = document.querySelectorAll('.equation-char');
    if (inputElements.length === 0 || currentIndex < 0 || currentIndex >= inputElements.length) return;

    const activeInput = inputElements[currentIndex] as HTMLInputElement;
    activeInput.value += digit;
    updateInputValue(currentIndex, Number(activeInput.value));
};

const showAnswer = () => {
    if (!currentTask) return;

    const inputElements = document.querySelectorAll('.equation-char');
    if (inputElements.length === 0) return;

    for (let i = 0; i < inputElements.length; i++) {
        const inputElement = inputElements[i] as HTMLInputElement;
        inputElement.value = String(currentTask.answer[i]);
        updateInputValue(i, Number(currentTask.answer[i]));

    }
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
const checkAnswer = () => {
    if (!currentTask) return;
    console.log(inputValues, 'inputValues.value');
    currentTask.answer = Object.values(inputValues) // .slice(0,currentTask.answer.length)
    console.log(Object.values(currentTask.answer), 'Решение на проверку')
    const isCorrect = game.resolver.checkTask(currentTask);

    if (isCorrect) {
        modalTitle.value = 'Верно!';
        showModal.value = true;
        sessionStore.dispatch('incrementScore')
    } else {
        modalTitle.value = 'Неверно!';
        showModal.value = true;
        sessionStore.dispatch('incrementMissed')
    }
};

const closeModal = () => {
    showModal.value = false;
    generateNewTask()
};

const generateNewTask = () => {
    if (!currentTask) return;

    const params: GenerateTaskParams = {
        complexity: currentTask?.complexity,
        allowedOperators: currentTask?.operators,
    };
    const newTask = generator.generateTask(params);
    taskStore.dispatch('setCurrentTask', newTask);
    currentTask = taskStore.getters.getCurrentTask;
}

const cancelButton = () => {
    router.push({name: 'settingsPage'});
}

</script>

<style scoped>
.game-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
    width: 800px;
    height: 600px;
    border: 1px solid salmon;
    background-color: #fdfdfd;
    position: relative;
}

.equation-container {
    font-size: 32px;
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

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

.cancel {
    position: absolute;
    top: 20px;
    left: 15px;
}

.cancel button {
    background-color: white;
    text-transform: uppercase;
    color: #6f6f6f;
    width: 100px;
    height: 40px;
    border: none;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}

.cancel button:active {
    transform: translateY(2px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

input {
    width: 64px;
    text-align: center;
    font-size: 32px;
    border: none;
    border-bottom: 1px solid #bcbcbc;
}

input:focus {
    outline: none;
    border: none;
    border-bottom: 1px solid black;
}

</style>