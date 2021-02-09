<template>
  <div class="shopCartList-wrapper">
    <cover v-model="showPopup" />
    <popup
      v-model="showPopup"
      :bottom="51"
      @transitionend="_refresh"
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
              全选
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
          ref="scroll"
          class="container"
        >
          <ul>
            <my-checkbox-group
              ref="checkboxGroup"
              v-model="selected"
            >
              <transition-group
                name="list"
                tag="li"
              >
                <li
                  v-for="(item, index) in list"
                  :key="index"
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
          </ul>
        </scroll>
      </div>
    </popup>
  </div>
</template>

<script type="text/ecmascript-6">
import Popup from '../components/popup'
import Cover from '../components/cover'
import Scroll from '../components/scroll'
import CartControl from '../components/cart-control'
import {useStore} from "vuex";
import {Icon, CheckboxGroup, Checkbox} from 'vant'
import {computed, ref, watch} from 'vue'
const CHECKED_EVENT = 'change'
// const MAX_LIST_HEIGHT = 100
export default {
  components: {
    Popup: Popup,
    Cover: Cover,
    Scroll: Scroll,
    MyIcon: Icon,
    MyCartControl: CartControl,
    MyCheckboxGroup: CheckboxGroup,
    MyCheckbox: Checkbox,
  },
  props: {},
  setup(props, _ref) {
    const emit = _ref.emit
    const store = useStore()
    const selectAll = ref(false)
    const selected = ref([]);
    const checkboxGroup = ref(null);
    function addShopCart(shop) {
      store.dispatch('addShop', shop)
    }

    function cutShopCart(shop) {
      store.dispatch('cutShop', shop)
    }
    function cleanALL () {
      store.dispatch('cleanShop')
    }
    function checkAll () {
      checkboxGroup.value.toggleAll(true);
    }
    function toggleAll () {
      checkboxGroup.value.toggleAll();
    }

    watch(selected, (newValue) => {
      emit(CHECKED_EVENT, newValue)
    })
    watch(selectAll, (newValue) => {
      if (newValue){
        checkAll()
      } else {
        toggleAll()
      }
    })
    return {
      list: computed(() => store.getters.myShop),
      user: computed(() => store.getters.userInfo),
      addShopCart,
      cutShopCart,
      selectAll,
      cleanALL,
      selected,
      checkboxGroup,
    }
  },
  data() {
    return {
      showPopup: false
    }
  },
  watch: {
    list(newVal){
      let temp =[]
      for (let i in newVal){
        let item = newVal[i]
        temp.push(item.id)
      }
      this.selected = temp
    },
    selected (newValue) {
      if (newValue.length === 0) {
        this.show()
      }
      this._refresh()
    }
  },
  methods: {
    show() {
      this.showPopup = !this.showPopup
    },
    _refresh(){
      this.$refs.scroll.refresh()
    },
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/index.styl"
.shopCartList-wrapper
  width 100%
  .list
    position relative
    padding 10px 5px 0px 5px
    height 150px
    .head
      fontColor(font_color_minor)
    .select
      display flex
      justify-content space-between
      margin-top 10px
    .container
      width 100%
      height 100px
      position absolute
      top 70px
      left 5px
      overflow hidden
      .item
        height 30px
        display flex
        justify-content space-between
        align-items center
        &.list-enter-active, &.list-leave-active
          transition all 0.5s
        &.list-enter-from, &.list-leave-to
          opacity: 0;
        .checkbox
          width 200px
          flex 1
          .context
            font-size $font-size-medium
</style>