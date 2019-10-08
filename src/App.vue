<template>
  <div id="app">
    <NavBar />
    <!--
    Cuando diferentes rutas usan el mismo componente
    Por ejemplo '/profile/:username', siendo username un parámetro variable,
    Crear el componente nuevamente con el parámetro 'key'
    -->
    <transition
      name="fade"
      mode="out-in"
    >
      <RouterView :key="$route.fullPath" />
    </transition>
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
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

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
    // 1100px
    font-size: 68.75%; // 1rem = 11px
  }

  @media screen and (max-width: 43.75em) {
    // 700px
    font-size: 56.25%; // 1rem = 9px
  }
}

body {
  font-family: "Merriweather Sans", sans-serif;
  font-weight: 400;
  line-height: 1.6;
  color: $color-primary-dark;
}

ul {
  list-style: none;
}

a:link,
a:visited {
  text-decoration: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  transform: translate(-30px);
  opacity: 0;
}
</style>
