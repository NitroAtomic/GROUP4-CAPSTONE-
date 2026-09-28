// Backend and integration: IamAtomic
export default {
  name: 'PremiumModules',

  data() {
    return {
      courses: [
        {
          title: 'Client Impersonation',
          summary: 'Fake clients, portfolio scams and escrow fraud aimed at freelancers.',
          path: '/modules/premium/client-impersonation'
        },
        {
          title: 'Invoice and Payment Scams',
          summary: 'Business email compromise, invoice manipulation and vendor account changes.',
          path: '/modules/premium/invoice-scams'
        },
        {
          title: 'Fake Job and Recruiter Offers',
          summary: 'Recruitment and onboarding scams that harvest identity documents.',
          path: '/modules/premium/fake-recruiters'
        },
        {
          title: 'Secure Client Data Handling',
          summary: 'Executive and virtual assistant impersonation, and authority scams.',
          path: '/modules/premium/client-data'
        }
      ]
    }
  }
}
