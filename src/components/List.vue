<template>
  <Layout>
    <h2 :class="$style.heading">
      <slot name="header" />
    </h2>

    <div :class="$style.wrap">
      <BaseFilter v-model="search" />

      <BaseButton
        v-if="$slots.button"
        @click="$emit('child-clicked')"
      >
        <slot name="button" />
      </BaseButton>
    </div>

    <div :class="$style['table-container']">
      <table :class="$style.table">
        <thead>
          <tr>
            <th
              v-for="(title, index) in titles"
              :key="index"
              :class="$style['table-heading']"
            >
              {{ title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(obj, i) in filteredData"
            :key="i"
            :class="$style['table-row']"
          >
            <td
              v-for="(val, key, j) in obj"
              :key="j"
              :class="$style['table-cell']"
            >
              <div>
                <template v-if="Array.isArray(val)">
                  <div
                    v-for="(nestedVal, nestedIndex) in val"
                    :key="nestedIndex"
                  >
                    {{ nestedVal }}
                  </div>
                </template>
                <template v-else>
                  {{ val }}
                </template>
              </div>
            </td>
            <td :class="[$style['table-cell'], $style['button-container']]">
              <div
                v-for="(action, index) in actions"
                :key="index"
              >
                <ButtonAction
                  :obj="obj"
                  :param="action.param"
                  :action="action.name"
                  :path="$route.path"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import ButtonAction from '@/components/ButtonAction'

export default {
  components: {
    Layout,
    ButtonAction
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    actions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    titles () {
      return [...this.fields, 'Acciones']
    },
    filteredData () {
      const lowerCaseSearch = this.search.toLowerCase().trim()

      return this.data.filter(element => {
        return Object.values(element).some(value => {
          return String(value).toLowerCase().includes(lowerCaseSearch)
        })
      })
    }
  }
}
</script>

<style lang="scss" module>
  .heading {
    @include heading(left);
  }

  .wrap {
    display: flex;
    width: 100%;
    margin-bottom: 2rem;

    > input {
      flex-basis: 100%;
    }

    > input:not(:only-child) {
      flex-basis: 75%;
    }
  }

  @media screen and (max-width: 43.75em) {
    // 700px
    .wrap input {
      flex-basis: 65%;
    }
  }

  .table-container {
    overflow-x: auto;
    box-shadow:
      0 3px 6px rgba($color-primary-dark, 0.16),
      0 3px 6px rgba($color-primary-dark, 0.23);
  }

  .table {
    border-collapse: collapse;
    border-radius: $size-border-radius;
    font-size: $size-font-lg;
    overflow: hidden;
    width: 100%;

    &-heading {
      background-color: $color-secondary;
      color: $color-primary-light;
      font-weight: 400;
      padding: 1rem;
      text-align: left;
    }

    &-row:hover {
      background-color: darken($color-primary-light, 5);
    }

    &-cell {
      height: 7rem;
      padding: 1rem;

      > div {
        height: 100%;
      }
    }
  }

  .button-container {
    display: flex;
    > div {
      flex: 1;
      display: flex;
    }

    > div:not(:last-child) {
      margin-right: .5rem;
    }
  }
</style>
