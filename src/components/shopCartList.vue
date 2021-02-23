<template>
  <div class="shopCartList-wrapper">
    <cover v-model="showPopup" />
    <popup
      v-model="showPopup"
      :bottom="51"
    >
      <div
        ref="list"
        class="list"
      >
        <div class="head">
          <p>你目前还能用的7豆有{{ user.count }}个</p>
        </div>
        <div class="select">
          <div class="selectAll">
            <my-checkbox v-model="selectAll">
              <p>全选</p>
            </my-checkbox>
          </div>
          <div
            class="clear"
            @click.stop="cleanALL"
          >
            <my-icon name="delete" />
            <span>清空7享袋</span>
          </div>
        </div>
        <scroll
          ref="cartListScroll"
          class="container"
        >
          <my-checkbox-group
            ref="checkboxGroup"
            v-model="checked"
            @change="selected"
          >
            <transition-group
              name="list"
              tag="ul"
              @after-leave="onRefresh"
            >
              <li
                v-for="item in list"
                :key="item.id"
                class="item"
              >
                <my-checkbox
                  class="checkbox"
                  :name="item.id"
                >
                  <p class="context">
                    {{ item.name }} {{ item.price * item.num }} 豆
                  </p>
                </my-checkbox>
                <my-cart-control
                  class="cart-control"
                  :count="item.num"
                  :max="item.stock"
                  @add="addShopCart(item)"
                  @reduce="cutShopCart(item)"
                />
              </li>
            </transition-group>
          </my-checkbox-group>
        </scroll>
      </div>
    </popup>
  </div>
</template>

<script type="text/ecmascript-6">
import Cover from '../components/cover'
import Popup from '../components/popup'
import Scroll from '../components/scroll'
import CartControl from '../components/cart-control'
import {useStore} from "vuex";
import {Icon, CheckboxGroup, Checkbox} from 'vant'
import {computed, ref, watch} from 'vue'

const CHECKED_EVENT = 'change'
export default {
  components: {
    Cover: Cover,
    Popup: Popup,
    Scroll: Scroll,
    MyIcon: Icon,
    MyCartControl: CartControl,
    MyCheckboxGroup: CheckboxGroup,
    MyCheckbox: Checkbox,
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup(props, _ref) {
    const emit = _ref.emit
    const store = useStore()
    const selectAll = ref(false)
    const checked = ref([]);
    const checkboxGroup = ref(null);
    function addShopCart(shop) {
      store.dispatch('addShop', shop)
    }

    function cutShopCart(shop) {
      if(shop.num === 1) {
        store.dispatch('deleteShop', shop)
      } else {
        store.dispatch('cutShop', shop)
      }
    }
    function cleanALL() {
      store.dispatch('cleanShop')
    }

    function checkAll() {
      checkboxGroup.value.toggleAll(true);
    }

    function toggleAll() {
      checkboxGroup.value.toggleAll();
    }
    function selected (event) {
      let temp = []
       event.forEach(i => {
         temp.push(i)
       })
      emit(CHECKED_EVENT, temp)
    }
    watch(selectAll, (newValue) => {
      if (newValue) {
        checkAll()
      } else {
        toggleAll()
      }
    })
    return {
      user: computed(() => store.getters.userInfo),
      addShopCart,
      cutShopCart,
      selectAll,
      cleanALL,
      selected,
      checked,
      checkboxGroup
    }
  },
  data() {
    return {
      showPopup: false,
    }
  },
  watch: {
    list(newVal) {
      let temp = []
      for (let i in newVal) {
        let item = newVal[i]
        temp.push(item.id)
      }
      this.checked = temp
    },
  },
  methods: {
    openShopCart() {
      this.showPopup = !this.showPopup
    },
    onRefresh() {
      this.$refs.cartListScroll.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.shopCartList-wrapper
  width 100%

  .list
    position relative
    padding 10px 5px 48px 5px
    height 150px

    .head
      fontColor(font_color_minor)

    .select
      display flex
      justify-content space-between
      margin-top 10px

      p
        fontColor(font_color_minor)

    .container
      width 100%
      height 100px
      position absolute
      top 70px
      left 5px
      overflow hidden

      .item
        width 100%
        height 30px
        display flex
        justify-content space-between
        align-items center
        fontColor(font_color_minor)

        &.list-enter-active, &.list-leave-active
          transition all 0.3s ease

        &.list-enter-from, &.list-leave-to
          opacity 0

        .checkbox
          width 200px
          flex 1

          .context
            font-size $font-size-medium
            fontColor(font_color_minor)
</style>