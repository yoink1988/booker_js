<template>
  <div id="app" class="clearfix">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.clearfix:before,
.clearfix:after {
  content: '';
  display: table;
}

.clearfix:after {
  clear: both;
}

body {
  width: 1100 px;
  margin: 0 auto;
  background: #F0F0F0;
}

#app {
  text-align: center;
  height: 100%;
}

.link {
  cursor: pointer;
}
</style>
