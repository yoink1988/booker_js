<template>
  <div class="book-it">
        <!-- <a class="link" @click="changeTimeFormat()">TimeFormat</a> -->
        <a class="link" @click="$parent.content = 'calendar'">Back to Calendar</a>
    <div class="row">
      <div class="col form">
        <div>
          Book for:
          <select v-model="userToBook" >
            <option value="">select user</option>
            <option v-for="emp in employees" :value="emp.id">{{emp.name}}</option>
          </select>
        </div>
        <div>
          YEAR:<select v-model="selectedYear">
            <option value="">Year</option>
            <option v-for="year in yearSelector" :value="year.value">{{year.title}}</option>
          </select>
        </div>
        <div>
          MONTH:<select v-model="selectedMonth">
            <option value="">Month</option>
            <option v-for="mon in monthSelector" :value="mon.value">{{mon.title}}</option>
          </select>
        </div>
        <div>
          DAY:<select v-model="selectedDay">
            <option value="">Day</option>
            <option v-for="day in daySelector" :value="day.value">{{day.title}}</option>
          </select>
        </div>

        

        <div>
        START
          <div>
            <select v-model="timeStartH">
              <option value="">HH</option>
              <option v-for="h in hoursSelector" :value="h.value">{{h.title}}</option>
            </select>
          </div>
          <div>
            <select v-model="timeStartM">
              <!-- <option value="">MM</option> -->
              <option v-for="m in minutesSelector" :value="m.value">{{m.title}}</option>
            </select>
          </div>
          <div v-if="timeFormat == '12'">
            <select v-model="modeStart">
              <option :value="mode[0]">{{mode[0]}}</option>
              <option :value="mode[1]">{{mode[1]}}</option>
            </select>
          </div>
      </div>
        <div>
        END
        <div>
          <select v-model="timeEndH">
            <option value="">HH</option>
            <option v-for="s in hoursSelector" :value="s.value">{{s.title}}</option>
          </select>
        </div>
        <div>
          <select v-model="timeEndM">
            <!-- <option value="">MM</option> -->
            <option v-for="m in minutesSelector" :value="m.value">{{m.title}}</option>
          </select>
        </div>
         <div v-if="timeFormat == '12'">
          <select v-model="modeEnd">
            <option :value="mode[0]">{{mode[0]}}</option>
            <option :value="mode[1]">{{mode[1]}}</option>
          </select>
        </div>
      </div>
        <div class="descr">
          <textarea v-model="descr" cols="30" rows="3"></textarea>
        </div>

         <div class="radio">
          <div>
            <p>Is Recuring</p>
            <input type="radio" id="one" :value="false" v-model="isReccuring">
            <label for="one">No</label>
          </div>
          <div>
            <input type="radio" id="two" :value="true" v-model="isReccuring">
            <label for="two">Yes</label>
          </div>  
         </div>   

         <div v-if="isReccuring">
          
          <div v-for="t in recTypes">
            <input :value="t" v-model="selectedRecurring" type="radio">
            <label>{{t}}</label>
          </div>

          <div>
            <input v-model="duration" type="text" size="4"> duration (max 4 weeks)
          </div>
         </div>

      </div>
    </div>
        <button @click="submit()" class="btn">Submit</button>
        {{msg}}
        <button @click="test()" class="switch">Test</button>
  </div>
</template>

<script>
export default {
  name: 'BookIt',
  props: ['user', 'idRoom','timeFormat'],
  data () {
    return {
      msg:'',
      // timeFormat: '12',
      duration: '',
      isReccuring: false,
      selectedRecurring:'weekly',
      recTypes:['weekly', 'be-weekly', 'monthly'],
      descr: '',
      curtentDate: new Date(),
      employees:[],
      userToBook:'',
      selectedYear: '',
      yearsInDropdown: 2,
      mode:['AM', 'PM'],
      modeStart:'AM',
      modeEnd:'AM',
      minutes:['00', '30'],
      selectedMonth: '',
      selectedDay:'',
      timeStartH:'',
      timeStartM:'00',
      timeEndH:'',
      timeEndM:'00',
      timeStartMod: '',
      timeEndMod: '',
    }
  },
  methods:{
    test: function(){
      var self = this
      var arr = []
      arr.push('qwe')
      var obj = {}
      obj.test = arr

      obj.test.push('sadas')
      console.log(obj)
    },
    submit:function(){
      var self = this
      self.msg = ''
      var ds = new Date(self.selectedYear, self.selectedMonth, self.selectedDay, 8, 0).getTime()
      var de = new Date(self.selectedYear, self.selectedMonth, self.selectedDay, 20, 0).getTime()
      if(self.checkInputs()){
        var obj = {}
        obj.id_room = self.idRoom
        // details = {}
        obj.details = {}
        obj.details.id_emp = self.userToBook
        obj.details.descr = self.descr
        if(self.timeFormat == '12'){
          obj.details.start = new Date(self.selectedMonth+1 +'/'+self.selectedDay+'/'+self.selectedYear+' '+self.timeStartH+':'+self.timeStartM+' '+self.modeStart).getTime()
          obj.details.end = new Date(self.selectedMonth+1 +'/'+self.selectedDay+'/'+self.selectedYear+' '+self.timeEndH+':'+self.timeEndM+' '+self.modeEnd).getTime()
        }else{
          obj.details.start = new Date(self.selectedYear, self.selectedMonth, self.selectedDay, self.timeStartH, self.timeStartM).getTime()
          obj.details.end = new Date(self.selectedYear, self.selectedMonth, self.selectedDay, self.timeEndH, self.timeEndM).getTime()
        }
                if(obj.details.start > obj.details.end){
                  self.msg = 'Start of event must be earlier than end'
                  return
                }
                if((obj.details.start < ds) || (obj.details.end < ds) || (obj.details.start > de) || (obj.details.end > de))
                {
                  self.msg = 'Avaliable time 8:00-20:00'
                  return
                }

        // obj.event = details
        if(self.isReccuring){
          var reccuring = {}
          reccuring.type = self.selectedRecurring
          reccuring.duration = self.duration
          obj.reccuring = reccuring
        }

      // self.authMsg = ''
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify(obj);
          xhr.open("POST", getUrl()+'events/', true)
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));          
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    console.log(xhr.responseText)
                    var res = JSON.parse(xhr.responseText) 
                    if(typeof(res == 'string')){
                      self.msg = res
                    }
                    else{
                      console.log(res)
                      }
                  }
            }
          xhr.send(json)
        }
      
    },
    checkInputs: function(){
      var self = this
      
      if(!self.userToBook){
        self.msg = 'Select User'
        return false
      }
      if(!self.selectedYear || !Number.isInteger(self.selectedMonth) || !self.selectedDay){
        self.msg = 'Select Day'
        return false
      }
      if(!self.timeStartH || !self.timeStartM || !self.timeEndH || !self.timeEndM){
        self.msg = 'Check time fileds'
        return false
      }
      if(!self.descr){
        self.msg = 'Check description field'
        return false
      }
      if(self.isReccuring)
      {
        if(self.duration == ''){
          self.msg = 'Duration required'
          return false
        }

        if(!Number.isInteger(+self.duration) || (+self.duration < 0)){
          self.msg = 'Duration must be a positive integer'
          return false
        }
        if(self.selectedRecurring == 'weekly'){
          if(!Number.isInteger(+self.duration) || (+self.duration > 3)){
            self.msg = 'duration on Weekly type must be in (1-3)'
            return false
          }
          if(self.selectedRecurring == 'be-weekly'){
            if(!Number.isInteger(+self.duration) || (+self.duration > 2)){
            self.msg = 'duration on be-weekly type must be in (1-2)'
            return false              
            }
          }
          if(self.selectedRecurring=='monthly'){
            if(self.duration != '1'){
              self.msg = 'on Monthly max duration is 1'
              return false
            }
          }
        }
      }
      return true
    },
      getEmployees: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        if(self.user.id_role == ADMIN){
          xhr.open('GET', getUrl()+'users/', true)
        }else{
          xhr.open('GET', getUrl()+'users/'+self.user.id, true)
         
        }
        xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));        
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res){
                  self.employees = res
                  // console.log(self.employees)
                }else{
                  self.employees = []
                  self.msg = 'No users Found'
                }
              }
        }
        xhr.send();
    },
    changeTimeFormat:function(){
      var self = this
      self.timeStartH = '';
      self.timeEndH = '';
      if(self.timeFormat == '12'){
        self.timeFormat = '24'
      }else{
        self.timeFormat = '12'
      }
    },

  },

  created(){
    this.getEmployees()
  },
  // watch:{
  //   timeEndH(){
  //     debugger
  //   }
  // },
  computed:{
    yearSelector(){
      var self = this
      var years = []
      for(var i=0;i<self.yearsInDropdown;i++){
        years.push({value: new Date().getFullYear()+i, title:new Date().getFullYear()+i})
      }
      return years
    },
    monthSelector(){
      var self = this
      var currDate = new Date()
      var monthSelArr = []
      var month = ['Jan','Feb','Mar','Apr','May','Jun',
        'Jul','Aug','Sep','Oct','Nov','Dec'];
      if(currDate.getFullYear() != self.selectedYear){
        month.forEach(function(month, key){
          monthSelArr.push({value: key, title:month})
        })
      }
      if(currDate.getFullYear() == self.selectedYear){
        self.selectedMonth = ''
        for(var i = currDate.getMonth();i <= 11 ;i++){
          monthSelArr.push({value:i, title:month[i]})
        }
      }
      return monthSelArr
    },
    daySelector(){
      var self = this
      var days = []
      var selYM = new Date(self.selectedYear, self.selectedMonth)
      var daysInMonth = new Date(selYM.getFullYear(), selYM.getMonth() + 1, 0).getDate()
      if( (selYM.getFullYear() == self.curtentDate.getFullYear()) && (selYM.getMonth() == self.curtentDate.getMonth())  ){
        self.selectedDay = ''
        for(var i=self.curtentDate.getDate(); i<=daysInMonth; i++){
          var d = new Date(self.selectedYear,self.selectedMonth, i)
          if((d.getDay() != 6) && (d.getDay() != 0)){
            days.push({value:i, title:i})
          }
        }
      }else{
        for(var i = 1; i <= daysInMonth; i++){
          var d = new Date(self.selectedYear,self.selectedMonth, i)
          if((d.getDay() != 6) && (d.getDay() != 0)){          
            days.push({value:i, title:i})
          }
        }
      }
      return days
    },
    hoursSelector(){
      var self = this
        var hours = []
        if(self.timeFormat == '12'){
          for(var i=1;i<=12;i++){
            hours.push({value:i, title:i})
          }
        }else{
          for(var i=8;i<=20;i++){
            hours.push({value:i, title:i})
          }        
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
</style>
