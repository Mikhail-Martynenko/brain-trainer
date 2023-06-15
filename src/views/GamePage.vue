<template>
    <div class="game-container">
        <div class="cancel">
            <button @click="cancelButton">Oтмена</button>
        </div>
        <TimerSession />
        <EquationContainer :equation="currentTask?.equation ? Array.from(currentTask.equation) : undefined" />
        <ScreenKeyboard />
        <ModalResult v-if="showModal" :title="modalTitle" :show="showModal" @close="closeModal" />
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useStore} from 'vuex';
import {GenerateTaskParams, Task} from "@/domain/domain";
import router from "@/router";
import ModalResult from "@/components/ModalResult.vue";
import generator from "@/domain/generator";
import TimerSession from "@/components/TimerSession.vue";
import EquationContainer from "@/components/EquationContainer.vue";
import ScreenKeyboard from "@/components/ScreenKeyboard.vue";

const taskStore = useStore('taskStore');

const showModal = ref(false);
const modalTitle = ref('');

let currentTask: Task | null = taskStore.state.currentTask;

const closeModal = () => {
    showModal.value = false;
    generateNewTask()
};

const generateNewTask = () => {
    if (!currentTask) return;

    const params: GenerateTaskParams = {
        complexity: currentTask?.complexity,
        allowedOperators: currentTask?.operators,
    };
    const newTask = generator.generateTask(params);
    taskStore.dispatch('setCurrentTask', newTask);
    currentTask = taskStore.state.currentTask;
    console.log(currentTask)
    // inputValues.value = {};
}

const cancelButton = () => {
    router.push({name: 'settingsPage'});
}
</script>

<style scoped>
.game-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
    width: 800px;
    height: 600px;
    border: 1px solid salmon;
    background-color: #fdfdfd;
    position: relative;
}

.cancel {
    position: absolute;
    top: 20px;
    left: 15px;
}

.cancel button {
    background-color: white;
    text-transform: uppercase;
    color: #6f6f6f;
    width: 100px;
    height: 40px;
    border: none;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}

.cancel button:active {
    transform: translateY(2px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}


</style>
