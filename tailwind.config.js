/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" 
  ],
  theme: {
    extend: {
      colors: {
        "main-color": "var(--main-color)",
        "second-color": "var(--second-color)",
        "text-color":"var(--text-color)",
        "2nd-text":"var(--2nd-text)",
        "bg-color":"var(--bg-color)",
        "bg-card-color":"var(--card-color)",
        "review-color":"var(--review-color)",
        "error-color":"var(--error-color)",
        "footer-color":"var(--footer-bg)"
      },
      screens:{
      'nav-break':'850px'
      }
    },
    fontFamily: {
      "tendify-anchor": ["Hedvig Letters Serif", "serif"] ,
      "websiteFonr" : ["Poppins", "sans-serif"],
      "caveat" : ["Caveat", "cursive"]
  }

  },
  plugins: [
    require('flowbite/plugin'), 
    require('tailwind-scrollbar-hide')
  ],
}

