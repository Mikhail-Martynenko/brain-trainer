<template>
    <div class="setting-container">
        <div>
            <h1>Привет!</h1>
            <div class="statistic_text">
                <p>Добро пожаловать на ??? тренировочный день,</p>
                <p>Ваш последний результат - решено ??? из ???</p>
                <p>Общая точность ???%</p>
            </div>
            <!--            <ul>-->
            <!--                <li v-for="session in statistics.sessions" :key="session.id">-->
            <!--                    {{ session.startTime }} - {{ session.endTime }}: {{ session.score }}-->
            <!--                </li>-->
            <!--            </ul>-->
        </div>
        <form @submit.prevent="startGame">

            <h2>Настройки</h2>
            <input type="range" v-model.number="roundTime" min="1" max="15" />
            <span>Длительность {{ roundTime }} минут</span>

            <br>
            <input type="range" v-model.number="selectedDifficulty" min="1" :max="difficulty" required />
            <span>Сложность {{ selectedDifficulty }}</span>
            <br>
            <div class="operators">
                <label v-for="operator in ALLOWED_OPERATORS" :key="operator.symbol">
                    <input type="checkbox" v-model="operator.checked" @change="updateSelectedOperators" />
                    {{ operator.label }}
                </label>
            </div>
            <button class="start_game_button" type="submit">Play!</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';

import {
    OperatorSymbol,
    ALLOWED_OPERATORS,
    Operator,
    Task,
    GenerateTaskParams,
    Generator,
    Resolver,
    Statistics,
    Session,
    Game, difficulty,
} from '@/domain/domain';
import router from "@/router";
import {useStore} from "vuex";
import {getRandomInteger} from "@/utils";


const store = useStore();

const updateAnswer = (index: number, value: number) => {
    currentTask.value.answer[index] = Number(value);
};

const checkAnswer = () => {
    const isCorrect = game.resolver.checkTask(currentTask.value);

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

let selectedOperators: Operator[] = [];
const selectedDifficulty = ref(1);
const roundTime = ref(7);
// const answer = ref(0);
// const showModal = ref(false);
// const isCorrectAnswer = ref(false);
const updateSelectedOperators = () => {
    selectedOperators = ALLOWED_OPERATORS.filter(operator => operator.checked).map(operator => operator);
};

const statistics: Statistics = reactive({
    sessions: [],
});

const session: Session = {
    id: '',
    startTime: new Date(),
    endTime: null,
    score: 0,
};

const generator: Generator = {
    generateTask(params: GenerateTaskParams): Task {
        const {complexity, allowedOperators} = params;

        const startValue = getRandomInteger(1, 10); // Случайное начальное значение
        const operators: Operator[] = [];
        const hiddenNumbers: number[] = [];
        //const result = null;

        // Генерация случайных операторов из списка выбранных операторов
        for (let i = 0; i < complexity; i++) {
            const randomOperator = allowedOperators[Math.floor(Math.random() * allowedOperators.length)];
            operators.push(randomOperator);
            const hiddenNumber = getRandomInteger(1, 10); // Случайное число, которое будет скрыто
            hiddenNumbers.push(hiddenNumber);
        }


        // TODO Логика не учитывает приоритет операторов - доработать
        // TODO Возможно надо перенести логику в resolver, а здесь вызвать функцию checkTask из него
        //  Вычисление результата уравнения
        let calculatedResult = startValue;
        for (let i = 0; i < complexity; i++) {
            calculatedResult = operators[i].resolve(calculatedResult, hiddenNumbers[i]);
        }

        // Формирование уравнения со скрытыми числами
        let equation = `${startValue}`;
        for (let i = 0; i < complexity; i++) {
            equation += ` ${operators[i].displaySign} _`;
        }
        equation += ` = ${calculatedResult}`;
        console.log(equation)

        // Просто посмотреть, как выглядит полное уравнение TODO DELETE THIS
        let checkEquation = `${startValue}`;
        console.log(hiddenNumbers)
        for (let i = 0; i < complexity; i++) {
            checkEquation += ` ${operators[i].displaySign} ${hiddenNumbers[i]}`;
        }
        checkEquation += ` = ${calculatedResult}`;
        console.log(checkEquation)

        return {
            startValue,
            operators,
            answer: hiddenNumbers, // Значения, которые пользователь должен ввести
            result: calculatedResult,
            equation,
        };
    }
};

// TODO finalize
// TODO Вычислить ответ пользователя и сравнить его с результатом, вычисленным в generator
const resolver: Resolver = {
    checkTask(task: Task): boolean {
        const {startValue, operators, answer, result} = task;

        // Проверка наличия одинакового количества операторов и пропусков в ответе
        if (operators.length !== answer.length) return false;

        // // Применяем операторы к начальному значению
        let calculatedResult = startValue;
        for (let i = 0; i < operators.length; i++) {
            calculatedResult = operators[i].resolve(calculatedResult, answer[i]);
        }
        //Сравниваем полученный результат с ожидаемым результатом
        return calculatedResult === result;
    }
};

const game: Game = {
    statistics,
    config: {level: 1},
    session,
    generator,
    resolver,
};

// Вычисляемые свойства
const currentTask = ref<Task>({
    startValue: 0,
    operators: [],
    answer: [],
    result: 0,
    equation: ''
});

const startGame = () => {
    const selectedOperatorSymbols = selectedOperators.map(operator => operator.label);

    const params: GenerateTaskParams = {
        complexity: selectedDifficulty.value,
        allowedOperators: ALLOWED_OPERATORS.filter(operator => selectedOperatorSymbols.includes(operator.label)),
    };
    currentTask.value = game.generator.generateTask(params);
    store.dispatch('setCurrentTask', currentTask.value);

    router.push({name: 'game'});
};

// const checkAnswer = () => {
//     const isCorrect = game.resolver.checkTask(currentTask.value);
//     isCorrectAnswer.value = isCorrect;
//     showModal.value = true;
// };
//
// const nextTask = () => {
//     answer.value = 0;
//     isCorrectAnswer.value = false;
//     showModal.value = false;
//     // Генерация следующего задания или завершение игры
//     // ...
// };
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
