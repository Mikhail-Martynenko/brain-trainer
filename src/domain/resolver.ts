// TODO finalize
// TODO Вычислить ответ пользователя и сравнить его с результатом, вычисленным в generator
import {Resolver, Task} from "@/domain/domain";

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
export default resolver;