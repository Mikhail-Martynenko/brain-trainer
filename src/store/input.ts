import {createStore, Store, ActionContext} from 'vuex';

interface State {
    inputValues: Record<number, number>;
}

interface Actions {
    updateInputValue(
        context: ActionContext<State, State>,
        payload: { index: number; value: number }
    ): void;
}

interface Getters {
    getInputValues(state: State): Record<number, number>;
}

const inputStore = createStore<State>({
    state: {
        inputValues: {}
    },
    actions: {
        updateInputValue({state}, payload) {
            const {index, value} = payload;
            state.inputValues[index] = value;
        },
        deleteInputValue({state}) {
            state.inputValues = {};
        }
    },
    getters: {
        getInputValues(state) {
            return state.inputValues;
        }
    }
});

export default inputStore as Store<State> & Actions & Getters;
