<template>
  <div class="reg row">

  <div id="regform" class="col-md-5" style="width:400px">
      <form role="form ">
      <div class="form-group">
        <label for="exampleInputEmail1">Email</label>
        <input v-model="login" type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
            <small id="passwordHelpInline" class="text-muted">
            example@gmail.com
            </small>
      </div>
      <div class="form-group">
        <label for="exampleInputName">Name</label>
        <input v-model="name" type="text" class="form-control" id="exampleInputPassword1" placeholder="Name">
            <small id="passwordHelpInline" class="text-muted">
            Must be 3-20 characters long, contain letters, and must not contain spaces, special characters, or emoji. 
            </small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="pass" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            <small id="passwordHelpInline" class="text-muted">
               Must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
            </small>
      </div>
      <button @click="submit()" class="btn btn-default">Submit</button>
      <router-link to="/"><button class="btn btn-default">Home</button></router-link>
          <p style="padding:10px">{{msg}}</p>
    </form>
  </div>
 
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      msg:'',
      login:'',
      name:'',
      pass:''
    }
  },
  methods:{
    submit: function(){
      var self = this
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify({
         name: self.name,
         login: self.login,
         pass: self.pass
      });

          xhr.open("POST", getUrl()+'users/', true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    var res = JSON.parse(xhr.responseText)
                    if(res === true){
                      self.msg = 'Thank You! Please follow to Home page for Sign In'
                          login = ''
                          name = ''
                          pass = ''
                    }
                    else
                    self.msg = res
                  }
            }
          xhr.send(json)
    }
  }



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.reg{
  width: 400px;
  margin: 30px auto;
}

#regform{
  background-color: #fce3c7;
  padding: 30px;
}

a {
  color: #42b983;
}
</style>
