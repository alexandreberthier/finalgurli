<template>
  <div class="site-wrapper">
    <div class="progress-wrapper">
      <div class="steps-wrapper">
        <div
            v-for="(step, index) in checkoutStore.steps"
            :key="step.routeName"
            :class="['step', { active: index <= currentStep, clickable: isStepClickable(index) }]"
            @click="goToStep(step.routeName)"
        >
          <p class="step-number">{{ index + 1 }}</p>
          <p class="step-name">{{ step.name }}</p>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressWidth }"></div>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <component :is="Component" ref="component"></component>
    </router-view>

    <div class="button-section">
      <!-- Weiter-Button: Nur anzeigen, wenn nicht beim Payment-Schritt -->
      <DynamicButton
          v-if="currentStep < checkoutStore.steps.length - 1 && currentStep !== paymentStepIndex"
          @click="validate"
          button-text="Weiter"
      />
      <!-- Zurück-Button: Nicht anzeigen, wenn der Benutzer auf dem ersten Schritt ist -->
      <DynamicButton
          v-if="currentStep >= 0 && currentStep < checkoutStore.steps.length -1"
          @click="goBack"
          :button-type="ButtonType.Secondary"
          button-text="Zurück"
      />
      <!-- Zurück zur Startseite: Nur auf dem letzten Schritt -->
      <DynamicButton
          v-if="currentStep === checkoutStore.steps.length - 1"
          @click="clearAndRedirect"
          :button-type="ButtonType.Primary"
          button-text="Zurück zur Startseite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DynamicButton from "@/components/DynamicButton.vue";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { ButtonType } from "@/models/Enums";

// Stores und Router
const cartStore = useCartStore();
const checkoutStore = useCheckoutStore();
const router = useRouter();
const route = useRoute();

// Aktuellen Schritt berechnen
const currentStep = computed(() => {
  return checkoutStore.steps.findIndex((step) => step.routeName === route.name);
});

// Progressbar-Breite berechnen
const progressWidth = computed(() => {
  if (currentStep.value === -1) return "0%";
  return ((currentStep.value) / (checkoutStore.steps.length - 1)) * 100 + "%";
});

// Index des Payment-Schrittes berechnen
const paymentStepIndex = computed(() =>
    checkoutStore.steps.findIndex((step) => step.routeName === "payment")
);

// Validieren und zum nächsten Schritt navigieren
function validate() {
  // Payment-Schritt überspringen
  if (currentStep.value === paymentStepIndex.value) return;

  // Komponenten-Validierung
  const component = ref<{ validateInputFields: () => boolean } | null>(null);
  if (component.value && !component.value.validateInputFields()) {
    return;
  }

  // Schritt validieren und weitergehen
  if (typeof route.name === "string") {
    checkoutStore.validateStep(route.name);
    const nextStep = checkoutStore.steps[currentStep.value + 1];
    if (nextStep) {
      router.push({ name: nextStep.routeName });
    }
  }
}

// Zum vorherigen Schritt zurückkehren
function goBack() {
  if (currentStep.value > 0) {
    const previousStep = checkoutStore.steps[currentStep.value - 1];
    if (previousStep) {
      router.push({ name: previousStep.routeName });
    }
  }
}

// Spezifischen Schritt direkt anspringen
function goToStep(routeName: string) {
  if (checkoutStore.isStepValidated(routeName)) {
    router.push({ name: routeName });
  }
}

// Schritte klicken nur bis zum aktuellen erlauben
function isStepClickable(index: number): boolean {
  return index <= currentStep.value && currentStep.value < checkoutStore.steps.length - 1;
}

// Checkout-Daten leeren und zur Startseite navigieren
function clearAndRedirect() {
  cartStore.clearCartData();
  checkoutStore.clearUserData();
  router.push({ name: "home" });
}
</script>

<style scoped>

.progress-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  position: relative;

  .progress-bar {
    background-color: lightgray;
    width: 100%;
    height: 10px;
    position: absolute;
    border-radius: 8px;
    z-index: -1;
    overflow: hidden;

    .progress {
      height: inherit;
      background-color: var(--black);
      transition: all 250ms ease-in-out;
    }
  }

  .steps-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;

    .step {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 25px;
      width: 25px;
      border: 1px solid var(--black);
      border-radius: 50%;
      position: relative;
      background-color: var(--white);
      cursor: pointer;

      &.active {
        background-color: var(--black);

        .step-number {
          color: var(--white)
        }

      }

      .step-name {
        position: absolute;
        top: 110%;
        font-size: 10px;
        text-align: center;
      }

    }
  }
}

.button-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>