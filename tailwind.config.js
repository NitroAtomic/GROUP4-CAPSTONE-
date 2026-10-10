/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./javascript/framework/vue/**/*.vue",
    "./javascript/framework/vue/**/*.js",

    /* Yung aral ng bayad na module ay nandito na, sa labas ng frontend --
       inihahain ng API para hindi ito mabasa nang walang bayad.

       Kailangang makita pa rin ito ng Tailwind. Tinatanggal nito ang mga
       tuntunin sa @layer components kung hindi lumalabas ang pangalan ng
       klase sa sinusuri niyang mga file. Noong inilipat ang mga aral,
       naglaho ang buong anyo ng .learning-objectives, .red-flag-checklist
       at kapatid nila: nandoon pa rin ang markup, wala na ang kulay at
       hangganan. */
    "./backend-node/content/**/*.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}