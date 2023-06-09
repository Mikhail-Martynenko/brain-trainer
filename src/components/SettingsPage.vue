<template>
    <div>
        <div>
            <div>
                <h1>Привет!</h1>
                <!--            <ul>-->
                <!--                <li v-for="session in statistics.sessions" :key="session.id">-->
                <!--                    {{ session.startTime }} - {{ session.endTime }}: {{ session.score }}-->
                <!--                </li>-->
                <!--            </ul>-->
            </div>
            <form @submit.prevent="startGame">

                <h2>Настройки</h2>
                <label for="roundTime">Время раунда:</label>
                <input type="range" v-model.number="roundTime" id="roundTime" min="1" max="15" />
                <span>Длительность {{ roundTime }} минут</span>

                <br>
                <label for="difficulty">Сложность:</label>
                <input
                        type="range" v-model.number="selectedDifficulty" id="difficulty" min="1" :max="difficulty"
                        required
                />
                <span>Сложность {{ selectedDifficulty }}</span>
                <br>
                <div class="operators">
                    <label v-for="operator in ALLOWED_OPERATORS" :key="operator.symbol">
                        <input type="checkbox" v-model="operator.checked" @change="updateSelectedOperators" />
                        {{ operator.label }}
                    </label>
                </div>
                <button type="submit">Начать игру</button>
            </form>


        </div>
        <!--            <div>{{ currentTask.equation }}</div>-->
        <!--            <input-->
        <!--                class="input-skip"-->
        <!--                v-for="(_, index) in currentTask.answer"-->
        <!--                :key="index"-->
        <!--                type="number"-->
        <!--                @input="updateAnswer(index, $event.target.value)" required-->
        <!--            />-->
        <!--            <button @click="checkAnswer">Проверить ответ</button>-->
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
.operators {
    display: flex;
    flex-direction: column;
    margin: 20px;
    gap: 20px;
}
</style>
