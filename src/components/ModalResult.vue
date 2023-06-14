<template>
    <div class="modal" v-if="show">
        <div class="modal-overlay" @click="close"></div>
        <div class="modal-content">
            <h2>{{ props.title }}</h2>
            <button @click="close">Закрыть</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
    title: String,
    show: Boolean,
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid black;
}
</style>
