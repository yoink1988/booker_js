<template>
  <div class="row">
    <button @click="setWeekFirstDay()" class="day-switch">WeekFromSunday</button>
    <button @click="test()" class="switch">Test</button>
    <router-link to="/employees">Employee List</router-link>
    <div class="row">
      <ul>
        <li v-for="room in rooms"><a class="link" @click="setActiveRoom(room.id)">{{room.name}}</a></li>
      </ul>
    </div>
    <div v-if="activeRoomId" class="row">
      <span class="active-room">{{rooms[activeRoomId-1].name}}</span>
      <p><a class="link" @click="bookIt()">Book It!</a></p>
    </div>
    <div class="calendar col cal-block">
    <table class="table table-bordered">
      <thead>
        <tr>
        <td @click="monthMinus()">‹</td>
        <td colspan="5">{{months_en[currMonth-1]}} {{currYear}}</td>
          <td @click="monthPlus()">›</td>
        </tr>
      </thead>
      <tbody>
        <tr v-if="firstDayMonday"><td>пн</td><td>вт</td><td>ср</td><td>чт</td><td>пт</td><td>сб</td><td>вс</td></tr>
        <tr v-if="!firstDayMonday"><td>вс</td><td>пн</td><td>вт</td><td>ср</td><td>чт</td><td>пт</td><td>сб</td></tr>

        <tr v-for="row in calendarToDraw">
            <td v-for="day in row">
               <!-- <p>{{day[0]}}</p> -->
               <p v-if="day.length > 1">{{day[0]}}</p>
               <p v-for="event in day[1]"> <a @click="makePopUp(event)" class="link">{{event.timeString}}</a> </p>
               <p v-if="day.length == 1">{{day[0]}}</p>

            </td>
        </tr>

      </tbody>
    </table>

    </div>
</div>

</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      months_en : ['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      refreshed: false,
      currMonth: '',
      currYear: '',
      firstDayMonday: true,
      myCalendar: '',
      items: [],
      translateArray: {},
      rooms:[],
      events:[],
      user:{},
      activeRoomId:''
    }
  },
  methods:{
    test:function(){
      var self = this
      console.log(self.user)
    },
    makePopUp: function(event){
      var self = this
      alert(event.id)
    },
    bookIt: function (){
      var self = this
      alert('Booookaem komnatu '+self.activeRoomId)
    },
       getStorageData: function(){
        var self = this
        if(localStorage['user']){
         self.user = JSON.parse(localStorage['user'])
         self.checkAuth(self.user.id, self.user.hash)
        }else{
          self.$router.push('/')
        }

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
         createCalendar: function() {
            var self = this
            var year = self.currYear
            var month = self.currMonth
            var mon = month - 1;
            var d = new Date(year, mon);
              // console.log(month)
      
            //дни которые нужно пропустить
            self.items[0] = []

            for (var i = 0; i < self.getDay(d); i++) {
                self.items[0].push({})
            }

            // ячейки календаря с датами
            var row = 0
            while (d.getMonth() == mon) {
                self.items[row].push( [ d.getDate() ] )
              if (self.getDay(d) % 7 == 6) { // вс, последний день - перевод строки
                row ++
                self.items[row] = []
              }
      
              d.setDate(d.getDate() + 1);
            }
            self.refreshed = false
        },
        getDay: function(date) { // получить номер дня недели, от 0(пн) до 6(вс)
            var self = this
              var day = date.getDay();
              if(self.firstDayMonday){
                if (day == 0) day = 7;
                return  day - 1;
            }else{
              return day 
            }

    },
    getMonth: function(){
      var self = this
      self.currMonth = new Date().getMonth()+1
    }, 
    getYear: function(){
      var self = this
      self.currYear = new Date().getFullYear()
    }, 
    monthPlus: function(){
      var self = this
      self.items = []
      if(self.currMonth < 12){
        self.currMonth++
      }else{
        self.currYear++
        self.currMonth = 1
      }
      self.getEvents()
    },
    monthMinus: function(){
      var self = this
      self.items = []
      if(self.currMonth > 1){
        self.currMonth--
      }else{
        self.currYear--
        self.currMonth = 12
      }
      self.getEvents()
    },
    setWeekFirstDay: function(){
      var self = this
      self.firstDayMonday = !self.firstDayMonday
      self.refreshed = false
      self.items = []
      self.createCalendar()
    },
    getRooms: function(){
      var self = this
      var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'rooms/', true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res){
                  self.rooms = res
                  self.setActiveRoom(self.rooms[0].id)
                  self.getEvents()
                }else{
                  self.errMsg = 'Rooms not found'
                }
              }
        }
        xhr.send();
    },
    getEvents: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'events/year/'+self.currYear+'/month/'+self.currMonth+'/room/'+self.activeRoomId, true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res){
                  self.events = res
                }else{
                  self.events = []
                }
                  self.createCalendar()
              }
        }
        xhr.send();
    },   
    setActiveRoom: function(id){
      var self = this
      self.activeRoomId = id
      self.getEvents()
    }   
    
  },
  created(){
    this.getStorageData()
    this.getMonth()
    this.getYear()
    this.getRooms()

  },
  computed:{
    calendarToDraw(){
      var self = this
      if(!self.refreshed){
      var calendar = self.items

     calendar.forEach(function(week){
        week.forEach(function(day){
          if(day[0]){
          var d = new Date(self.currYear, self.currMonth-1, day[0])
          // var ev = self.events
            self.events.forEach(function(ev){
              var ed = new Date(ev.start)
              if(d.toDateString() == ed.toDateString()){
                
                var st_h = new Date(ev.start).getHours()
                var st_m = new Date(ev.start).getMinutes()
                var en_h = new Date(ev.end).getHours()
                var en_m = new Date(ev.end).getMinutes()

                if(st_m == '0'){
                  st_m = '00'
                }
                if(en_m == '0'){
                  en_m = '00'
                }
                ev.timeString = st_h+':'+st_m+' - '+en_h+':'+en_m

                if(day.length == 1){
                 day.push([ev])
                }else{
                  day[1].push(ev)
                }
                //  console.log(day)
              }
            })
          }
        })
      })

        self.refreshed = true
      }
       return calendar
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

.calendar{
  margin:50px auto;
}
.cal-block{
  width: 1000px;
}
.link{
  cursor: pointer;
}
.active-room{
  font-size: 130%;

}
</style>
