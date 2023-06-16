<template>
    <div class="slider">
        <input type="range" :value="modelValue" :min="min" :max="max" @input="$emit('update:modelValue', $event.target.value)" />
        <label class="slider-label">{{ label }}
            <span class="slider-value">{{ modelValue }}</span>
        </label>
    </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';

 defineProps({
    modelValue: {
        required: true,
    },
    label: {
        required: true,
    },
    min: {
        required: true,
    },
    max: {
        required: true,
    },
});

</script>

<style scoped>
.slider {
    width: 200px;
}
</style>
