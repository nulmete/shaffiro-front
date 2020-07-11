<template>
  <div id="app">
    <!-- <NavBar /> -->
    <!--
    Cuando diferentes rutas usan el mismo componente
    Por ejemplo '/profile/:username', siendo username un parámetro variable,
    Crear el componente nuevamente con el parámetro 'key'
    -->
    <main class="page-wrapper">
      Ahre
      <!-- <transition
        name="router-animation"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <RouterView :key="$route.fullPath" />
      </transition> -->
    </main>
  </div>
</template>

<script>
// import NavBar from '@/components/NavBar'

export default {
  // components: { NavBar }
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

.page-wrapper {
  flex: 1;
  position: relative;

  > * {
    animation-duration: .3s;
  }
}

.container {
  margin: 0 auto;
  max-width: $grid-width;
  padding: 0 1.5rem;
}

.heading-secondary {
  font-size: 3rem;
  font-weight: 700;
}

.flex-wrapper {
  display: flex;
  align-items: center;

  & > .form__group {
    flex: 1;
    margin: 0 !important;

    &:not(:last-child) {
      margin-right: 1.4rem !important;
    }
  }

  & > span {
    margin-right: 1.4rem;
  }
}

ul {
  list-style: none;
}

a:link,
a:visited {
  text-decoration: none;
}

.disabled,
.enabled {
  display: inline-block;
  cursor: pointer;
  border-radius: 2px;
  padding: 5px;
  color: #fff;
}
.disabled {
  background-color: #e74c3c;
}
.enabled {
  background-color: #27ae60;
}
</style>
