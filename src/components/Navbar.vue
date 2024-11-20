<template>
  <div class="nav-wrapper">
    <router-link
        @click="navbarStore.closeMenu(), cartStore.hideCartSlider()"
        :to="{name: SiteLinks.Home}">
      <div class="logo-wrapper">
        <img :src="getImage('logo.png')" alt="Zurück zum Start">
      </div>
    </router-link>
    <div :class="['links', {'open': navbarStore.menuOpen}]">
      <router-link
          @click="navbarStore.closeMenu()"
          v-for="(link, index) in links"
          :key="index"
          :to="{name: link.path, hash: link.hash}">
        <span class="link-name">{{ link.linkName }}</span>
      </router-link>
    </div>
    <div class="icon-section">
      <router-link
          v-if="!isLoggedIn"
          @click="cartStore.hideCartSlider(),  navbarStore.closeMenu()"
          :to="{name: SiteLinks.Auth}">
        <div class="icon-wrapper">
          <img :src="getImage('ic_user.png')" alt="Login oder Registieren">
        </div>
      </router-link>
      <div
          v-if="isLoggedIn"

          @click="userStore.logout()"
          class="icon-wrapper">
        <img :src="getImage('ic_logout.png')" alt="Ausloggen">
      </div>
      <div
          @click="cartStore.toggleCartSlider(), navbarStore.closeMenu()"
          class="icon-wrapper">
        <img :src="getImage('ic_cart.png')" alt="Zum Warenkorb">
      </div>
      <div
          @click="navbarStore.toggleMenu() , cartStore.hideCartSlider()"
          :class="['burger-menu', {'active': navbarStore.menuOpen}]">
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getImage} from "@/utils/ImageUtils";
import {computed, type Ref, ref} from "vue";
import type {Link} from "@/models/PropInterfaces";
import {SiteLinks} from "@/models/Enums";
import {useUserStore} from "@/stores/userStore";
import {useNavbarStore} from "@/stores/navbarStore";
import {useCartStore} from "@/stores/cartStore";

const userStore = useUserStore()
const navbarStore = useNavbarStore()
const cartStore = useCartStore()

const isLoggedIn = computed(() => {
  return userStore.isLoggedIn
})

const links: Ref<Link[]> = ref([
  {
    path: SiteLinks.Home,
    linkName: 'Kontakt',
    hash: '#contact'
  },
  {
    path: SiteLinks.Faq,
    linkName: 'Faq'
  },
  {
    path: SiteLinks.About,
    linkName: 'Wir'
  }

])
</script>

<style scoped>

.nav-wrapper {
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;
  justify-content: space-between;
  background-color: var(--white);

  .logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100px;
      height: auto;
    }
  }

  .links {
    display: flex;
    align-items: start;
    justify-content: start;
    flex-direction: column;
    gap: 32px;
    box-sizing: border-box;
    padding: 50px;
    position: fixed;
    top: 100px;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
    opacity: 0;
    transition: all 250ms ease-in-out;
    background-color: var(--white);

    a {
      font-size: 25px;
    }

    &.open {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .icon-section {
    display: flex;
    align-items: center;
    gap: 32px;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .burger-menu {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.active {
        span {
          background-color: transparent;

          &:after {
            bottom: 0;
            transform: rotate(45deg);
          }

          &:before {
            top: 0;
            transform: rotate(-45deg);
          }
        }
      }

      span {
        width: 100%;
        height: 2px;
        background-color: var(--black);
        position: relative;


        &:before, &:after {
          content: '';
          width: 100%;
          height: 2px;
          background-color: var(--black);
          position: absolute;
          transition: all 250ms ease-in-out;
        }

        &:after {
          bottom: 8px;
        }

        &:before {
          top: 8px;
        }
      }
    }
  }

}

</style>