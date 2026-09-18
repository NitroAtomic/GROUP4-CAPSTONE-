export default {
  name: 'ClientData',
  methods: {
    startQuiz() {
      this.$router.push({
        name: 'QuizQuestion',
        params: { moduleId: 'course-2' }
      });
    }
  }
};
