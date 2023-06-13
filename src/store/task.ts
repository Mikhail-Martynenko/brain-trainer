import {createStore} from 'vuex';
import {Task} from "@/domain/domain";

interface AppState {
    currentTask: Task | null;
}

export default createStore<AppState>({
    state: {
        currentTask: null,
    },
    actions: {
        setCurrentTask({state}, task: Task) {
            state.currentTask = task;
        },
    },
});