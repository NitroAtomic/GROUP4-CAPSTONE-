export default {
  name: 'ClientImpersonation',
  methods: {
    startQuiz() {
      this.$router.push({
        name: 'QuizQuestion',
        params: { moduleId: 'course-1' }
      });
    }
  }
};
