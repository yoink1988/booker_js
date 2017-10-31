<template>
  <div class="Auth row">
      <div id="auth-form" class="col-md-5" style="width:400px">
      <form role="form ">
      <div class="form-group">
        <label for="exampleInputName">Name</label>
        <input v-model="name" type="text" class="form-control" id="exampleInputPassword1" placeholder="Name">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="pass" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
      </div>
      <button @click="submit()" class="btn btn-default">Submit</button>
          <p style="padding:10px">{{msg}}</p>
    </form>
  </div>
  </div>

</template>

<script>
export default {
  name: 'Auth',
  data () {
    return {
      name:'',
      pass:'',
      msg:''
    }
  },
  methods:{
  
    
  },
  created(){

  },
  computed:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.Auth{
  width: 400px;
  margin: 30px auto;
}

#auth-form{
  /* background-color: #fce3c7; */
  padding: 30px;
}

</style>
