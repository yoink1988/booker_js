<template>
  <div class="Empty">
    qweqwe
    <table>
      <thead>
        <tr>
          <td>‹</td>
          <td  colspan="5">{{lang_month}}</td>
          <td>›</td>
        </tr>
        <tr><td>Пн</td><td>Вт</td><td>Ср</td><td>Чт</td><td>Пт</td><td>Сб</td><td>Вс</td></tr>
      </thead>
      <tbody>
        <!-- <tr v-for=""></tr> -->
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  data () {
    return {
      date: '',
      lang_month: 'MONTH'
    }
  },
  methods:{
    calendar: function (year, month){
      var Dlast = new Date(year,month+1,0).getDate()
      self.days = Array(+Dlast).fill('-');
      var D = new Date(year,month,Dlast)
      var DNlast = new Date(D.getFullYear(),D.getMonth(),Dlast).getDay()
      var DNfirst = new Date(D.getFullYear(),D.getMonth(),1).getDay()

      console.log(Dlast)
      console.log(D)
      console.log(DNlast)
      console.log(DNfirst)
      console.log(self.days)
    }
  },
  created(){
    this.calendar(new Date().getFullYear(), new Date().getMonth())
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
