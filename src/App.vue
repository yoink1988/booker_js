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
	content:'';
	display:table;
}
.clearfix:after {
	clear:both;
}
body{
  width: 1100 px;
  margin:0 auto;
   background: #F0F0F0;
   
   
}
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  text-align: center;
 
  height: 100%;
  /* color: #2c3e50; */


}
.link{
  cursor: pointer;
}
</style>
