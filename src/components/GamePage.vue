<template>
    <div class="game-container">
        <div class="cancel">
            <button @click="cancelButton">Oтмена</button>
        </div>
        <div class="equation-container">
            <template v-for="(char, index) in currentTask?.equation" :key="index">
                <input
                        v-if="char === '_'"
                        class="equation-char"
                        v-model.number="currentAnswerArray[index]"
                        required
                />
                <span v-else>{{ char }}</span>
            </template>
        </div>
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
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useStore} from 'vuex';
import {Task} from "@/domain/domain";
import game from "@/domain/game";
import router from "@/router";

const store = useStore();

const currentTask: Task | null = store.state.currentTask;
const activeIndex = ref<number>(0); // Реактивная переменная для отслеживания активного индекса
const currentAnswer = ref(''); //
const currentAnswerArray = ref<number[]>([]);
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const helper = Object.values(currentTask?.answer as any)

console.log(helper, 'helper')
const addDigit = (digit: any) => {
    // currentAnswerArray.value.push(digit);
};

const showAnswer = () => {
    // TODO для показа решения (без проверки). Подумать как выводить лучше эти числа
    // TODO 1. На места пропусков
    // TODO 2. Либо же как-то по-другому
    // if (!currentTask) return;
    // console.log(currentAnswerArray.value, 'before')
    // // Заменить значения массива currentAnswerArray на значения из helper
    // currentAnswerArray.value = [...helper as number[]];
    // console.log(currentAnswerArray.value, 'after')
}

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
// TODO должно отображаться модальное окно с результатами (верный/неверный ответ). После закрытия модального окна пользователь автоматически переходит к следующему примеру.
const checkAnswer = () => {
    if (!currentTask) return;
    currentTask.answer = Object.values(currentAnswerArray.value)
    const isCorrect = game.resolver.checkTask(currentTask);
    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
};

const handleCorrectAnswer = () => {
    console.log("Верно!")
};

const handleIncorrectAnswer = () => {
    console.log("Неверно!")
};
const cancelButton = () => {
    // TODO Игра прекращается пользователь переходит на главную страницу.
    // TODO В общую статистику добавляются результаты по всем примерам из незаконченного раунда,
    // TODO которые пользователь успел отправить на проверку.

    router.push({name: 'settingsPage'});
}
</script>

<style scoped>
.game-container {
    padding: 40px;
    width: 800px;
    height: 600px;
    border: 1px solid salmon;
    background-color: #fdfdfd;
    position: relative;
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
}

.cancel button {
    background-color: white;
    text-transform: uppercase;
    color: #6f6f6f;
    width: 100px;
    height: 35px;
    border: none;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}

.cancel button:active {
    transform: translateY(2px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

</style>
