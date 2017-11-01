<template>
  <div class="employees">
    <div v-if="content == 'list'">
      <p><a class="link" @click="setContent('add')">Add new employee</a></p>
    </div>
    <div v-else>
      <p><a class="link" @click="setContent('list')">Back to Emploees list</a></p>
    </div>
    <div v-if="content == 'add'">
      <add-section :user="user"></add-section>
    </div>
    <div v-if="content == 'list'">
      <div v-if="employees" class="row">
        <div class="col content">
          <table class="table">
            <thead>
            </thead>
            <tbody>
              <tr v-for="emp in employees">
                <td>
                  <a :href="'mailto:' + emp.email">{{emp.name}}</a>
                </td>
                <td>
                  <a class="link" @click="edit(emp.id)">Edit</a>
                </td>
                <td>
                  <a class="link" @click="remove(emp.id)">Remove</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="!employees">
      </div>
        {{msg}}
    </div>
  </div>
</template>

<script>
import AddEmployee from './AddEmployee.vue'
export default {
  name: 'Employees',
  data () {
    return {
      employees:[],
      user:{},
      msg: '',
      content: 'list'
    }
  },
  created(){
    this.getStorageData()
    this.getEmployees()
  },
  components:{
    'add-section' : AddEmployee
  },
  methods:{
     getStorageData: function(){
        var self = this
        if(localStorage['user']){
         self.user = JSON.parse(localStorage['user'])
         self.checkAuth(self.user.id, self.user.hash)
        }else{
          self.$router.push('/')
        }
      },
    setContent: function(content){
      var self = this
      self.content = content
    },
    checkAuth: function(id, hash){
      var self = this
      var xhr = new XMLHttpRequest()
          xhr.open("GET", getUrl()+'auth/', true)
          xhr.setRequestHeader("Authorization", "Basic " + btoa(id+":"+hash));
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                  } else{
                   var res = JSON.parse(xhr.responseText)
                   if(!res){
                     self.$router.push('/')
                   }
                   else{
                    //getUserData
                   }
              }
            }
          xhr.send()        
      },
    getEmployees: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'users/', true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res){
                  self.employees = res
                  console.log(self.employees)
                }else{
                  self.employees = []
                  self.msg = 'No users Found'
                }
              }
        }
        xhr.send();
    },      

  },

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

.row{
  margin: auto;
}

.content{
  width: 800px;
  margin: 30px auto;
}
</style>
