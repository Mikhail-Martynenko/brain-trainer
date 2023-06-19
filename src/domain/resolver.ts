// TODO finalize
// TODO Вычислить ответ пользователя и сравнить его с результатом, вычисленным в generator
import {Resolver, Task} from "@/domain/domain";

const resolver: Resolver = {
    checkTask(task: Task): boolean {
        const {startValue, operators, answer, result} = task;

        if (operators.length !== answer.length) return false;

        let calculatedResult = startValue;
        for (let i = 0; i < operators.length; i++) {
            calculatedResult = operators[i].resolve(calculatedResult, answer[i]);
        }
        return calculatedResult === result;
    }
};
export default resolver;