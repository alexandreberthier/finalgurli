<template>
  <div class="accordion-wrapper">
    <div
        @click="$emit('toggleContent')"
        class="visible-section">
      <p>{{ accordionContent.header }}</p>
      <div class="icon-wrapper">
        <img :src="getImage('ic_chevron_bottom.png')" :class="{'rotate': isOpen}" alt="">
      </div>
    </div>
    <div v-if="isOpen" class="hidden-section">
      <p v-html="accordionContent.content"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getImage} from "@/utils/ImageUtils";
import type {AccordionItemContent} from "@/models/PropInterfaces";


const {accordionContent, isOpen} = defineProps<{
  accordionContent: AccordionItemContent,
  isOpen: boolean
}>()
</script>

<style scoped>

.accordion-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--black);

  .visible-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    box-sizing: border-box;
    padding: 10px;
    user-select: none;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 20px;
        height: 20px;
        transition: all 250ms ease-in-out;

        &.rotate {
          transform: rotate(180deg)
        }
      }
    }
  }

  .hidden-section {
    box-sizing: border-box;
    padding: 10px;
    display: flex;

    p {
      font-size: 16px;
    }
  }
}

</style>