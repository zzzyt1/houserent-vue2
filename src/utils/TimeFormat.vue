<script>
//格式化时间函数
export default {
  methods: {
    formatTime(dateTimeString) {
      const date = new Date(dateTimeString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    },
    formatList(newsList) {
      return newsList.map(item => ({
        ...item,
        create_time: this.formatTime(item.create_time)
      }))
    }
  }
}
</script>