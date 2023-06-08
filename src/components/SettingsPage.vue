<template>
    <div>
        <div>
            <h2>Настройки</h2>
            <form @submit.prevent="startGame">
                <label for="equationType">Тип вычислений:</label>
                <div>
                    <label v-for="operator in ALLOWED_OPERATORS" :key="operator.symbol">
                        <input type="checkbox" v-model="operator.checked" @change="updateSelectedOperators" />
                        {{ operator.label }}
                    </label>
                </div>

                <label for="difficulty">Сложность:</label>
                <select v-model="selectedDifficulty" id="difficulty">
                    <option v-for="difficulty in difficulties" :value="difficulty" :key="difficulty">
                        {{ difficulty }}
                    </option>
                </select>
                <br>
                <label for="roundTime">Время раунда (в секундах):</label>
                <input type="number" v-model.number="roundTime" id="roundTime" min="1" required>
                <br>
                <button type="submit">Начать игру</button>
            </form>

            <h2>Статистика тренировок</h2>
            <!--            <ul>-->
            <!--                <li v-for="session in statistics.sessions" :key="session.id">-->
            <!--                    {{ session.startTime }} - {{ session.endTime }}: {{ session.score }}-->
            <!--                </li>-->
            <!--            </ul>-->
        </div>
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
    Game,
} from '@/domain/domain';

const difficulties = [1, 2, 3, 4];

let selectedOperators: Operator[] = [];
const selectedDifficulty = ref(1);
const roundTime = ref(120);
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
const getRandomInteger = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const generator: Generator = {
    generateTask(params: GenerateTaskParams): Task {
        const {complexity, allowedOperators} = params;

        const startValue = getRandomInteger(1, 10); // Случайное начальное значение
        const operators: Operator[] = [];
        const hiddenNumbers: number[] = [];
        const result = null;

        // Генерация случайных операторов из списка выбранных операторов
        for (let i = 0; i < complexity; i++) {
            const randomOperator = allowedOperators[Math.floor(Math.random() * allowedOperators.length)];
            operators.push(randomOperator);
            const hiddenNumber = getRandomInteger(1, 10); // Случайное число, которое будет скрыто
            hiddenNumbers.push(hiddenNumber);
        }


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



        return {
            startValue,
            operators,
            answer: hiddenNumbers, // Значения, которые пользователь должен ввести
            result: calculatedResult,
            equation,
        };
    }
};


const resolver: Resolver = {
    checkTask(task: Task): boolean {
        const {startValue, operators, answer, result} = task;

        // Проверка наличия одинакового количества операторов и пропусков в ответе
        if (operators.length !== answer.length) {
            return false;
        }

        // // Применяем операторы к начальному значению
        // let calculatedResult = startValue;
        // for (let i = 0; i < operators.length; i++) {
        //     calculatedResult = operators[i].resolve(calculatedResult, answer[i]);
        // }
        // Сравниваем полученный результат с ожидаемым результатом
        // return calculatedResult === result;
        return false;
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
    // todo -  go to game page
    const selectedOperatorSymbols = selectedOperators.map(operator => operator.label);

    const params: GenerateTaskParams = {
        complexity: selectedDifficulty.value,
        allowedOperators: ALLOWED_OPERATORS.filter(operator => selectedOperatorSymbols.includes(operator.label)),
    };
    currentTask.value = game.generator.generateTask(params);
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
</style>
