import {GenerateTaskParams, Generator, Operator, Task} from "@/domain/domain";
import {getRandomInteger} from "@/utils";

const generator: Generator = {
    generateTask(params: GenerateTaskParams): Task {
        const {complexity, allowedOperators} = params;
        const startValue = getRandomInteger(1, 10);
        const operators: Operator[] = [];
        const hiddenNumbers: number[] = [];

        for (let i = 0; i < complexity; i++) {
            const randomOperator = allowedOperators[Math.floor(Math.random() * allowedOperators.length)];
            operators.push(randomOperator);
            const hiddenNumber = getRandomInteger(1, 10);
            hiddenNumbers.push(hiddenNumber);
        }

          operators.sort((a, b) => b.priority - a.priority);
        let calculatedResult = startValue;
        for (let i = 0; i < complexity; i++) {
            calculatedResult = operators[i].resolve(calculatedResult, hiddenNumbers[i]);
        }

        let equation = `${startValue}`;
        for (let i = 0; i < complexity; i++) {
            equation += ` ${operators[i].displaySign} _`;
        }
        equation += ` = ${calculatedResult}`;
        console.log(equation)

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
            answer: hiddenNumbers,
            result: calculatedResult,
            equation,
            complexity,
        };
    }
};
export default generator;