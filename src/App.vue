<template>
  <!-- <img alt="Vue logo" id='custom' src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> --
  
  <h1>The Element Object</h1>
  <h2>The addEventListener() Method</h2>

  <p>Execute a function when a user clicks on a button:</p>

  <button id="myBtn">Try it</button>

  <p id="demo"> </p> -->

 <GameView />
  
</template>

<script>

import GameView from './components/GameView.vue'
export default {
  name: 'App',
  components: {
    GameView
  }
}

onload = () => {
  //
}




</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  min-height: 720px;
}

.gameview {
  min-height: 720px;
}
.id {
  color: aqua;
}
</style>
