<template>
  <div class="site-wrapper">
    <div v-if="displayedProduct" class="product-display">
      <div class="image-section">
        <div class="slider-container">
          <div
              class="slider"
              ref="sliderRef"
              @touchstart="onTouchStart"
              @touchmove="onTouchMove"
              @touchend="onTouchEnd"
              @mousedown.prevent="onMouseDown"
              @mouseup="onMouseUp"
              @mousemove="onMouseMove"
          >
            <div
                v-for="(img, index) in images"
                :key="index"
                class="slide"
            >
              <div class="image-wrapper">
                <img :src="getImage(images[currentIndex])" alt="Hauptbild"/>
              </div>

            </div>
          </div>
        </div>
        <div class="thumbnails">
          <div
              v-for="(img, index) in images"
              :key="'thumb-' + index"
              class="thumbnail"
              :class="{ active: currentIndex === index }"
              @click="goToSlide(index)"
          >
            <img :src="getImage(img)" :alt="'Thumbnail ' + (index + 1)"/>
          </div>
        </div>
      </div>

      <div class="product-info">
        <div class="top">
          <p class="article-number">Artikelnummer: {{ displayedProduct.id }}</p>
          <p class="display-name">{{ displayedProduct.displayName }}</p>
          <p class="price">{{ displayedProduct.getFormattedProductPrice() }}</p>
        </div>
        <div class="button-section">
          <DynamicButton
              button-text="In den Warenkorb"
              @click="cartStore.addProduct(displayedProduct, quantity)"
          />
          <QuantityButton
              @increase="increaseQuantity"
              @decrease="decreaseQuantity"
              :quantity="quantity"
          />
        </div>
        <div class="accordion-section">
          <AccordionItem
              v-for="(item, index) in accordionContent"
              :key="index"
              :is-open="activeIndex === index"
              :accordion-content="item"
              @toggleContent="toggleContent(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, computed, type Ref} from "vue";
import {useProductStore} from "@/stores/productStore";
import {useCartStore} from "@/stores/cartStore";
import {getImage} from "@/utils/ImageUtils";
import {Product} from "@/models/Product";
import QuantityButton from "@/components/QuantityButton.vue";
import DynamicButton from "@/components/DynamicButton.vue";
import AccordionItem from "@/components/AccordionItem.vue";
import type {AccordionItemContent} from "@/models/PropInterfaces";


const {id} = defineProps<{ id: string }>();


const productStore = useProductStore();
const cartStore = useCartStore();

const displayedProduct = computed(() => {
  const dto = productStore.products.find((product) => product.id === id);
  return dto ? Product.fromDto(dto) : undefined;
})

const accordionContent: Ref<AccordionItemContent[]> = ref([
  {
    header: 'Alles über unser Produkt',
    content: displayedProduct.value?.desc!
  },
  {
    header: 'Versand',
    content: 'Wir bieten einen schnellen und zuverlässigen Versand an. Ihre Bestellung wird innerhalb von 1-3 Werktagen bearbeitet und versendet. Die Lieferzeit beträgt in der Regel 3-5 Werktage, abhängig von Ihrem Standort. Versandkosten werden an der Kasse berechnet.'
  },
  {
    header: 'Rückgabe',
    content: 'Falls Sie mit Ihrem Kauf nicht zufrieden sind, können Sie die Ware innerhalb von 14 Tagen nach Erhalt zurückgeben. Bitte achten Sie darauf, dass das Produkt unbenutzt und in der Originalverpackung ist. Rücksendekosten trägt der Käufer, außer bei beschädigter Ware.'
  }
]);

const activeIndex: Ref<number | null> = ref(null)

function toggleContent(index:number){
  activeIndex.value = activeIndex.value === index ? null : index
}

const quantity = ref(1);
const currentIndex = ref(0);
const touchStartX = ref(0);
const touchDeltaX = ref(0);

const sliderRef = ref<HTMLDivElement | null>(null);

function increaseQuantity() {
  if (quantity.value < 5) quantity.value++;
}

function decreaseQuantity() {
  if (quantity.value > 1) quantity.value--;
}


const images = computed(() => displayedProduct.value?.images || []);

function goToSlide(index: number) {
  currentIndex.value = index;
  scrollToCurrentSlide();
}

function scrollToCurrentSlide() {
  if (sliderRef.value) {
    sliderRef.value.scrollTo({
      left: currentIndex.value * sliderRef.value.offsetWidth,
      behavior: "smooth",
    });
  }
}

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches[0].clientX;
}

function onTouchMove(event: TouchEvent) {
  touchDeltaX.value = event.touches[0].clientX - touchStartX.value;
}

function onTouchEnd() {
  if (touchDeltaX.value > 50 && currentIndex.value > 0) {
    currentIndex.value--;
  } else if (touchDeltaX.value < -50 && currentIndex.value < images.value.length - 1) {
    currentIndex.value++;
  }
  scrollToCurrentSlide();
  touchDeltaX.value = 0;
}

function onMouseDown(event: MouseEvent) {
  touchStartX.value = event.clientX;
}

function onMouseMove(event: MouseEvent) {
  if (touchStartX.value !== 0) {
    touchDeltaX.value = event.clientX - touchStartX.value;
  }
}

function onMouseUp() {
  onTouchEnd();
}
</script>


<style scoped>
.product-display {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 300px;
}

.slider {
  display: flex;
  transition: transform 0.3s ease;
}

.slide {
  flex: 0 0 100%;
  text-align: center;
}

.slide img {
  width: 100%;
  height: auto;
}

.thumbnails {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;

  .thumbnail {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid transparent;

    img {
      width: 95%;
      height: 95%;
      object-fit: cover;
    }

    &.active {
      border-color: #000;
    }
  }
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .top {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .article-number {
      font-size: 14px;
    }

    .display-name {
      font-size: 22px;
    }

    .price {
      font-style: italic;
      color: lightcoral;
    }
  }

  .button-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .accordion-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}


</style>
