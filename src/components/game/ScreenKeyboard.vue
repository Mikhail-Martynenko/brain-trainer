<template>
    <div class="buttons">
        <div class="keyboard">
            <button v-for="digit in digits" :key="digit" @click="addDigit(digit)">{{ digit }}</button>
        </div>
        <div class="helpers-buttons">
            <button @click="focusFieldLeft">&lt;</button>
            <button @click="focusFieldRight">&gt;</button>
            <button @click="emit('showAnswer')">?</button>
            <button @click="emit('checkAnswer')">=</button>
        </div>
    </div>

</template>

<script setup lang="ts">
import {defineEmits, defineProps, ref} from 'vue';
import {useStore} from "vuex";

const taskStore = useStore('taskStore');

const activeIndex = ref<number>(0);
let currentTask = taskStore.getters.getCurrentTask;

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const emit = defineEmits(['answerChecked', 'showAnswer', 'checkAnswer']);

const props = defineProps({
    // inputValues: {
    //     type: Object as () => { [index: number]: number },
    //     required: true,
    // },
    // showAnswer: {
    //     type: Function as unknown as () => () => void,
    //     required: true,
    // },
    // checkAnswer: {
    //     type: Function as unknown as () => () => void,
    //     required: true,
    // },
});

const addDigit = (digit: number) => {
    const currentIndex = activeIndex.value;
    const inputElements = document.querySelectorAll('.equation-char');
    if (inputElements.length === 0 || currentIndex < 0 || currentIndex >= inputElements.length) return;

    const activeInput = inputElements[currentIndex] as HTMLInputElement;
    activeInput.value += digit;
    //emit('updateInputValue', {currentIndex, value: activeInput.value});
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

// const showAnswer = () => {
//     if (!currentTask) return;
//
//     const inputElements = document.querySelectorAll('.equation-char');
//     if (inputElements.length === 0) return;
//
//     for (let i = 0; i < inputElements.length; i++) {
//         const inputElement = inputElements[i] as HTMLInputElement;
//         inputElement.value = String(currentTask.answer[i]);
//         emit('updateInputValue', [i, Number(currentTask.answer[i])]);
//
//     }
// };
// const checkAnswer = () => {
//     if (!currentTask) return;
//     console.log(props.inputValues, 'inputValues.value');
//     currentTask.answer = Object.values(props.inputValues) // .slice(0,currentTask.answer.length)
//     console.log(Object.values(currentTask.answer), 'Решение на проверку')
//     const isCorrect = game.resolver.checkTask(currentTask);
//     emit('answerChecked', isCorrect);
// };
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
