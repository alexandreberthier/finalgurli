import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/userStore";

export const useCheckoutStore = defineStore("checkout", () => {
    const userStore = useUserStore();

    // Checkout-Daten
    const firstName = ref<string>("");
    const lastName = ref<string>("");
    const email = ref<string>("");
    const phoneNumber = ref<string>("");

    const street = ref<string>("");
    const houseNumber = ref<string>("");
    const postalCode = ref<string>("");
    const city = ref<string>("");
    const country = ref<string>("");

    // Validierte Schritte
    const steps = ref([
        { name: "Persönliche Daten", routeName: "personal-data", validated: false },
        { name: "Lieferadresse", routeName: "delivery-data", validated: false },
        { name: "Zahlung", routeName: "payment", validated: false },
        { name: "Danke", routeName: "order-confirmation", validated: false },
    ]);

    // Benutzeränderungen beobachten
    watch(
        () => userStore.user,
        (newUser) => {
            if (newUser?.personalData) {
                firstName.value = newUser.personalData.firstName || "";
                lastName.value = newUser.personalData.lastName || "";
                email.value = newUser.personalData.email || "";
                phoneNumber.value = newUser.personalData.phoneNumber || "";
            }
            if (newUser?.deliveryData) {
                street.value = newUser.deliveryData.street || "";
                houseNumber.value = newUser.deliveryData.houseNumber || "";
                postalCode.value = newUser.deliveryData.postalCode || "";
                city.value = newUser.deliveryData.city || "";
                country.value = newUser.deliveryData.country || "";
            }
        },
        { immediate: true }
    );

    // Daten im LocalStorage speichern
    watch(
        () => ({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            street: street.value,
            houseNumber: houseNumber.value,
            postalCode: postalCode.value,
            city: city.value,
            country: country.value,
        }),
        (newValues) => {
            localStorage.setItem("checkoutData", JSON.stringify(newValues));
        },
        { deep: true }
    );

    // Daten aus LocalStorage laden
    const savedData = localStorage.getItem("checkoutData");
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        firstName.value = parsedData.firstName || firstName.value;
        lastName.value = parsedData.lastName || lastName.value;
        email.value = parsedData.email || email.value;
        phoneNumber.value = parsedData.phoneNumber || phoneNumber.value;
        street.value = parsedData.street || street.value;
        houseNumber.value = parsedData.houseNumber || houseNumber.value;
        postalCode.value = parsedData.postalCode || postalCode.value;
        city.value = parsedData.city || city.value;
        country.value = parsedData.country || country.value;
    }

    // Schritte validieren
    function validateStep(routeName: string) {
        const step = steps.value.find((step) => step.routeName === routeName);
        if (step) {
            step.validated = true;
        }
    }

    function isStepValidated(routeName: string): boolean {
        const step = steps.value.find((step) => step.routeName === routeName);
        return step?.validated || false;
    }

    // Daten löschen
    function clearUserData() {
        localStorage.removeItem("checkoutData");
        steps.value.forEach((step) => (step.validated = false));
    }

    return {
        firstName,
        lastName,
        email,
        phoneNumber,
        street,
        houseNumber,
        postalCode,
        city,
        country,
        steps,
        validateStep,
        isStepValidated,
        clearUserData,
    };
});
