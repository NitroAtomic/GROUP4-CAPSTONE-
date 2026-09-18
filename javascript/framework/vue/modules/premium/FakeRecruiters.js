export default {
  name: 'FakeRecruiters',
  methods: {
    startQuiz() {
      this.$router.push({
        name: 'QuizQuestion',
        params: { moduleId: 'course-3' }
      });
    }
  }
};
