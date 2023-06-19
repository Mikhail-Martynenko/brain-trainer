import {Resolver, Task} from "@/domain/domain";

class ResolverImpl implements Resolver {
    checkTask({startValue, operators, answer, result}: Task): boolean {
        if (operators.length !== answer.length) return false;

        let calculatedResult = startValue;
        for (let i = 0; i < operators.length; i++) {
            calculatedResult = operators[i].resolve(calculatedResult, answer[i]);
        }
        return calculatedResult === result;
    }
}

export default ResolverImpl;