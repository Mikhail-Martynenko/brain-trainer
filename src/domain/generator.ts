import {GenerateTaskParams, Generator, Operator, Task} from "@/domain/domain";
import {getRandomInteger} from "@/utils";

const generator: Generator = {
    generateTask(params: GenerateTaskParams): Task {
        const {complexity, allowedOperators} = params;
        const startValue = getRandomInteger(1, 10);
        const operators: Operator[] = [];
        const hiddenNumbers: number[] = [];

        // Генерация случайных операторов из списка выбранных операторов
        for (let i = 0; i < complexity; i++) {
            const randomOperator = allowedOperators[Math.floor(Math.random() * allowedOperators.length)];
            operators.push(randomOperator);
            const hiddenNumber = getRandomInteger(1, 10); // Случайное число, которое будет скрыто
            hiddenNumbers.push(hiddenNumber);
        }
        // TODO Логика не учитывает приоритет операторов - доработать
        // TODO Возможно надо перенести логику в resolver, а здесь вызвать функцию checkTask из него
        // Вычисление результата уравнения
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
export default generator;