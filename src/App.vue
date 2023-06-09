<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
}
</script>

<style>
#app {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 20px;
}
</style>
