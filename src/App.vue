<template>
  <div id="app">
    <NavBar />
    <!--
    Cuando diferentes rutas usan el mismo componente
    Por ejemplo '/profile/:username', siendo username un parámetro variable,
    Crear el componente nuevamente con el parámetro 'key'
    -->
    <main class="page-wrapper">
      <transition
        name="router-animation"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <RouterView :key="$route.fullPath" />
      </transition>
    </main>

    <!-- <footer class="footer">
      Cátedra IdS 2019 - Grupo 1
    </footer> -->
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  components: { NavBar },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll (event) {
      const nav = document.querySelector('nav')
      const topOfNav = nav.offsetTop
      const navHeight = nav.offsetHeight

      if (window.scrollY > topOfNav) {
        document.body.style.paddingTop = navHeight + 'px'
        nav.classList.add('fixed')
      } else {
        document.body.style.paddingTop = 0
        nav.classList.remove('fixed')
      }
    }
  }
}
</script>

<style lang="scss">
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css');

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  > nav.fixed {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
  }
}

*,
*::before,
*::after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

html {
  box-sizing: border-box;
  font-size: 62.5%; // 1rem = 10px

  @media screen and (min-width: 87.5em) {
    // at 1100px, 1rem = 11px
    font-size: 68.75%;
  }

  @media screen and (max-width: 43.75em) {
    // at 700px, 1rem = 9px
    font-size: 56.25%;
  }
}

body {
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 400;
  color: $color-primary-dark;
}

.page-wrapper > * {
  animation-duration: .3s;
}

ul {
  list-style: none;
}

a:link,
a:visited {
  text-decoration: none;
}
</style>
