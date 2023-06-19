<template>
    <div class="equation-container">
        <div v-for="(char, index) in equation" :key="index">
            <input
                    v-if="char === '_'"
                    class="equation-char"
                    :value="inputValues[index]"
                    @input="updateInputValue(index, Number($event.target.value) )"
            />
            <span v-else>{{ char }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, defineProps} from 'vue';
import {useStore} from "vuex";
import {Task} from "@/domain/domain";

const props = defineProps({
    currentTask: {
        type: Object as () => Task,
        required: true,
    },
});
const inputStore = useStore('inputStore');

const inputValues = inputStore.getters.getInputValues

const updateInputValue = (index: number, value: number) => {
    console.log(index, value)
    inputStore.dispatch('updateInputValue', {index, value})
}
const generateEquation = (): string => {
    let equation = `${props.currentTask.startValue}`;
    for (let i = 0; i < props.currentTask.complexity; i++) {
        equation += ` ${props.currentTask.operators[i].displaySign} _`;
    }
    equation += ` = ${props.currentTask.result}`;
    return equation;
}
const equation = computed(() => generateEquation())
</script>

<style scoped>
.equation-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 32px;
}

input {
    width: 64px;
    text-align: center;
    font-size: 32px;
    border: none;
    border-bottom: 1px solid #bcbcbc;
}

input:focus {
    outline: none;
    border: none;
    border-bottom: 1px solid black;
}
</style>


<style scoped>
.equation-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 32px;
}

input {
    width: 64px;
    text-align: center;
    font-size: 32px;
    border: none;
    border-bottom: 1px solid #bcbcbc;
}

input:focus {
    outline: none;
    border: none;
    border-bottom: 1px solid black;
}
</style>
