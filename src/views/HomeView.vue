<template>
  <div class="site-wrapper">
    <div class="product-flex">
      <ProductCard
          v-for="product in products"
          :key="product.id"
          :item="product"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import ProductCard from "@/components/ProductCard.vue";
import {computed} from "vue";
import {useProductStore} from "@/stores/productStore";
import {Product} from "@/models/Product";

const productStore = useProductStore()

const products = computed(()=> {
  return productStore.products.map(product => Product.fromDto(product))
})
</script>

<style scoped>

.product-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

</style>