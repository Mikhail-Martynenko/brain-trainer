import {createStore} from 'vuex';
import {Task} from "@/domain/domain";

interface AppState {
    currentTask: Task | null;
}

const taskStore = createStore<AppState>({
    state: {
        currentTask: null,

    },
    actions: {
        setCurrentTask({state}, task: Task) {
            state.currentTask = task;
        },
    },
});
export default taskStore;
