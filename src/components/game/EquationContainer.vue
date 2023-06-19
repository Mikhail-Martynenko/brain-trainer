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
import {defineProps} from 'vue';
import {useStore} from "vuex";

const inputStore = useStore('inputStore');

const inputValues = inputStore.getters.getInputValues

const updateInputValue = (index: number, value: number) => {
    console.log(index, value)
    inputStore.dispatch('updateInputValue', {index, value})
}

defineProps({
    equation: {
        type: Array as () => string[] | undefined,
        required: true,
    },
});
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
