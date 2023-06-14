<template>
    <div class="timer">
        {{ formatTime(timeLeft) }}
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import game from "@/domain/game";
const timeLeft = ref(game.session.timer * 60);
const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const countdown = () => {
    timeLeft.value--;
};

// Start the timer when the component is mounted
onMounted(() => {
    const timer = setInterval(countdown, 1000);

    // Stop the timer when the time runs out
    watch(timeLeft, (newValue) => {
        if (newValue <= 0) {
            clearInterval(timer);
            // Additional actions when the time runs out
        }
    });
});
</script>

<style scoped>
.timer {
    position: absolute;
    background-color: #f7f4f4;
    border: 1px solid #d6e3fb;
    border-right: 25px solid #d6e3fb;
    width: 100px;
    height: 40px;
    right: 15px;
    top: 20px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
