<template>
  <div class="modal">
    <!-- <script type="text/x-template" id="modal-template"> -->
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              
                <slot name="header">
                  <!-- Event Details{{eventId}} -->
                  Event Details 
                </slot>



            <slot name="body">
              <div  v-if="( (currDate < eventStartPoint) && (isOwner || isAdmin)) "> Time: 
                <select v-model="startH">
                  <option v-for="h in hoursSelector" :value="h.value">{{h.title}}</option>
                </select>
                <select v-model="startM">
                  <option v-for="m in minutesSelector" :value="m.value">{{m.title}}</option>
                </select>
                -
                <select v-model="endH">
                  <option v-for="h in hoursSelector" :value="h.value">{{h.title}}</option>
                </select>
                <select v-model="endM">
                  <option v-for="m in minutesSelector" :value="m.value">{{m.title}}</option>
                </select>
              </div>
              <div v-if="((currDate > eventStartPoint)) || (!isOwner && !isAdmin)">
                Time: <span>{{startH}}:{{endM}} - {{endH}}:{{endM}}</span>
              </div>
                <div v-if="( (currDate < eventStartPoint) && (isOwner || isAdmin) )">
                  Notes: <textarea v-model="event.descr"></textarea>
                </div>
                <div v-if="currDate > eventStartPoint">
                  Notes: <span>{{event.descr}}</span>
                </div>
                <div v-if="isAdmin && (currDate < eventStartPoint)">
                  Who: 
                  <select v-if="employees" v-model="selectedUser">
                    <option v-for="emp in employees" :value="emp.id">{{emp.name}}</option>
                  </select>
                </div>
                <div v-if="!isAdmin || (currDate > eventStartPoint)">
                  Who: <span>{{event.u_name}}</span>
                </div>
              <p></p>
              <p> PubDate: {{event.submit}}</p>

              <div v-if="( (currDate < eventStartPoint) && (isOwner || isAdmin) )">
                <div v-if="isRecc">
                  <input v-model="aplyToRec" type="checkbox">Apply to all
                </div>
                <div>
                  <button @click="update()">update</button>
                  <button @click="remove()">delete</button>
                  {{msg}}
                </div>  
              </div>
            </slot>


                <slot name="footer">
                  <button class="modal-default-button" @click="$emit('close')"> OK </button>
                </slot>
            </div>
          </div>
        </div>
      </transition>
    <!-- </script> -->
  </div>
</template>

<script>
export default {
  props:['event', 'user'],
  name: 'Modal',
  data () {
    return {
      isRecc: false,
      aplyToRec: false,
      eventStartPoint: '',
      startH: '',
      startM: '',
      endH: '',
      endM: '',
      users: '',
      minutes:['00', '30'],
      selectedUser: '',
      employees: {},
      isOwner: false,
      isAdmin: false,
      msg:''
    }
  },
  created(){
    this.isUserAdmin()
    this.isUserOwner()
    this.getParametres()
    this.isReccuring()
    this.getUsers()
  },
  methods:{
    update:function(){
      var self = this
      var data = {}
      var timeStart = new Date(self.event.start)
      timeStart.setHours(self.startH, self.startM)
      var timeEnd = new Date(self.event.end)
      timeEnd.setHours(self.endH, self.endM)
      data.id = self.event.id
      data.id_room = self.event.room_id
      var details = {}
      details.startPoint = self.eventStartPoint.getTime()
      details.id_user = self.selectedUser
      details.timeStart = timeStart.getTime()
      details.timeEnd = timeEnd.getTime()
      details.desc = self.event.descr
      data.details = details
      if(self.isRecc && self.aplyToRec){
        data.occur = true
      }
        var xhr = new XMLHttpRequest();
        var json = JSON.stringify(data);
            xhr.open("PUT", getUrl()+'events/', true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));            
              xhr.onreadystatechange = function() {
                  if (xhr.readyState != 4) return
                    if (xhr.status != 200) {
                          alert(xhr.status + ': ' + xhr.statusText)}
                          else {
                            var res = JSON.parse(xhr.responseText)
                            if(res === true){
                              self.msg = 'Updated'
                              self.$emit('reload')
                            }
                            else{
                              self.msg = res
                            }
                    }
              }
        xhr.send(json)
    },
    remove: function(){
      var self = this
       self.msg = ''   
        var xhr = new XMLHttpRequest();
        var url = getUrl()+'events/id/'+self.event.id+'/from/'+self.eventStartPoint.getTime()

        if(self.aplyToRec){
          url+='/all/true'
        }
        xhr.open("DELETE", url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));         
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    console.log(xhr.responseText)
                      // var res = JSON.parse(xhr.responseText)
                      // if(res){
                      //   self.authMsg = 'Deleted'
                      // }
                      // else{
                      //   self.authMsg = 'Fail'
                      // }
                  }
          }
          xhr.send(null);     
    
    },
    isUserOwner:function(){
      if(this.user.id == this.event.u_id){
        this.isOwner = true
      }
    },
    isUserAdmin: function (){
      if(this.user.id_role == ADMIN){
        this.isAdmin = true
      }
    },
      getUsers: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        if(self.user.id_role == ADMIN){
          xhr.open('GET', getUrl()+'users/', true)
        xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));        
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res){
                  self.employees = res
                }else{
                  self.employees = []
                  self.msg = 'No users Found'
                }
              }
        }
        xhr.send();
      }else{
        self.employees = [{id:self.event.u_id, name: self.event.u_name}]
      }
    },
    getParametres: function(){
      var self = this
      self.currDate = new Date()
      self.selectedUser = self.event.u_id
      var tmpS = new Date(self.event.start)
      var tmpE = new Date(self.event.end)
      self.eventStartPoint = tmpS

      self.startH = tmpS.getHours()
      self.endH = tmpE.getHours()

      if(tmpS.getMinutes() == '0'){
        self.startM = '00'
      }else{
        self.startM = tmpS.getMinutes()
      }
      if(tmpE.getMinutes() == '0'){
        self.endM = '00'
      }else{
        self.endM = tmpE.getMinutes()
      }
    },
    isReccuring: function(){
      var self = this
      if(!self.isAdmin && !self.isOwner){
        return
      }
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'events/id/'+self.event.id+'/count/true', true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res > 1){
                  self.isRecc = true
                }
              }
        }
        xhr.send();      
    }
  },
  computed:{
      hoursSelector(){
      var self = this
        var hours = []
          for(var i=8;i<=20;i++){
            hours.push({value:i, title:i})
        }
        return hours
    },

    minutesSelector(){
      var self = this
      var minutes = []
      self.minutes.forEach(function(m){
        minutes.push({value:m, title:m})
      })
      return minutes
    }
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

.modal{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 800px;
  margin: 200px 25%;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
