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
        type: Number,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    min: {
        type: String,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
});

</script>

<style scoped>
.slider {
    width: 200px;
}
</style>
