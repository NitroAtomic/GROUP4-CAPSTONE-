export default {
  name: 'InvoiceScams',
  methods: {
    startQuiz() {
      this.$router.push({
        name: 'QuizQuestion',
        params: { moduleId: 'course-4' }
      });
    }
  }
};
