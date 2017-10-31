<template>
  <div class="row">
    <button @click="setWeekFirstDay()" class="day-switch">WeekFromSunday</button>
    <button @click="test()" class="switch">Test</button>
    <div class="row">
      <ul>
        <li v-for="room in rooms"><a href="#" @click="setActiveRoom(room.id)">{{room.name}}</a></li>
      </ul>
    </div>
    <div class="calendar col cal-block">
    <table class="table">
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
                {{day.inner}}
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
      lang: 'en',
      months_en : ['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      refreshed: false,
      currMonth: '',
      currYear: '',
      firstDayMonday: true,
      myCalendar: '',
      items: [],
      translateArray: {},
      rooms:[],
      events:[]
    }
  },
  methods:{
    test:function(){
      var self = this
      self.events.forEach(function(el){
        var start = new Date()
        start.setTime(Date.parse(el.start))
        // console.log(start.getHours())
        // console.log(start.getMinutes())
        var startString = start.getHours()+':'+start.getMinutes()
        var end = new Date()
        end.setTime(Date.parse(el.end))
        var endString = end.getHours()+':'+end.getMinutes()
        console.log(startString+' -- ' + endString)
        // console.log(end.getHours())
        // console.log(end.getMinutes())        
        // var testDate = new Date()
        // testDate.setDate(self.currYear, self.currMonth, 31)
        // console.log(testDate)
      })
    },
         createCalendar: function() {
            var self = this
            var year = self.currYear
            var month = self.currMonth
            var mon = month - 1;
            var d = new Date(year, mon);
      
            // var clearDay = 0 //количество дней, которые нужно пропустить
            self.items[0] = []

            for (var i = 0; i < self.getDay(d); i++) {
                self.items[0].push({})
                // clearDay ++
            }

            // ячейки календаря с датами
            var row = 0
            while (d.getMonth() == mon) {
                self.items[row].push({inner: d.getDate()})
              
              if (self.getDay(d) % 7 == 6) { // вс, последний день - перевод строки
                row ++
                self.items[row] = []
              }
      
              d.setDate(d.getDate() + 1);
            }
            self.refreshed = false
            console.log(self.items)
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
      self.createCalendar()
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
      self.createCalendar()
    },
    setWeekFirstDay: function(){
      var self = this
      self.firstDayMonday = !self.firstDayMonday
      self.refreshed = false
      self.items = []
      self.createCalendar()
    },
    getTranslate: function (){
      var self = this
      self.translateArray = getTrans()
    },
    getRooms: function(){
      var self = this
        self.xhr.open('GET', getUrl()+'rooms/', true)
          self.xhr.onreadystatechange = function() {
            if (self.xhr.readyState != 4) return
              if (self.xhr.status != 200) {
                alert(self.xhr.status + ': ' + self.xhr.statusText)
              } else {
                var res = JSON.parse(self.xhr.responseText)
                if(res){
                  self.rooms = res
                  self.activeRoomId = self.rooms[0].id
                  self.getEvents()
                }else{
                  self.errMsg = 'Rooms not found'
                }
              }
        }
        self.xhr.send();
    },
    getXhr:function(){
      var self = this
      self.xhr = new XMLHttpRequest()
    },
    getEvents: function(){
      var self = this
        self.xhr.open('GET', getUrl()+'events/year/'+self.currYear+'/month/'+self.currMonth+'/room/'+self.activeRoomId, true)
          self.xhr.onreadystatechange = function() {
            if (self.xhr.readyState != 4) return
              if (self.xhr.status != 200) {
                alert(self.xhr.status + ': ' + self.xhr.statusText)
              } else {
                var res = JSON.parse(self.xhr.responseText)
                if(res){
                  self.events = res
                  console.log(self.events)
                }else{
                  self.events = []
                }
              }
        }
        self.xhr.send();
    },   
    setActiveRoom: function(id){
      var self = this
      self.activeRoomId = id
      console.log(self.activeRoomId)
    }   
    
  },
  created(){
    this.getMonth()
    this.getYear()
    this.getXhr()
    this.getRooms()
    this.createCalendar()
    // console.log(this.currYear)
    // console.log(this.currMonth)
  },
  computed:{
    calendarToDraw(){
      var self = this
      if(!self.refreshed){
      var calendar = self.items
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
</style>
