<template>
  <div class="route-wrapper">
    <h1>Registrieren</h1>
    <router-link
        :to="{name: SiteLinks.Login}">
      Bereits registriert? <span class="register-text">Log dich ein!</span>
    </router-link>
    <DynamicInputField
        :input-type="InputType.Email"
        v-model:user-input="email"
        v-model:user-error="emailError"
        label="Email"
    />
    <DynamicInputField
        :input-type="InputType.Email"
        v-model:user-input="emailRepeat"
        v-model:user-error="emailRepeatError"
        label="Email wiederholen"
    />
    <DynamicInputField
        :input-type="InputType.Password"
        v-model:user-input="password"
        v-model:user-error="passwordError"
        label="Passwort"
    />
    <DynamicButton
        @click="register"
        button-text="Registrieren"
    />
  </div>
</template>

<script setup lang="ts">
import DynamicInputField from "@/components/DynamicInputField.vue";
import {nextTick, type Ref, ref, watch} from "vue";
import {InputType, SiteLinks} from "@/models/Enums";
import DynamicButton from "@/components/DynamicButton.vue";
import {useUserStore} from "@/stores/userStore";
import {useRouter} from "vue-router";

const router = useRouter()

const userStore = useUserStore()

const email: Ref<string> = ref('')
const emailRepeat: Ref<string> = ref('')
const password: Ref<string> = ref('')

const emailError: Ref<string> = ref('')
const passwordError: Ref<string> = ref('')
const emailRepeatError: Ref<string> = ref('')

watch([email, emailRepeat], () => {
  if (emailRepeat.value.trim()) {
    if (emailRepeat.value !== email.value) {
      emailRepeatError.value = 'Email stimmt nicht überein'
    } else {
      emailRepeatError.value = ''
    }
  }
})


async function register() {
  const fields = [
    {value: email.value, error: emailError},
    {value: emailRepeat.value, error: emailRepeatError},
    {value: password.value, error: passwordError}
  ];

  let hasErrors = false;
  let firstErrorElement: HTMLElement | null = null;

  fields.forEach(field => {
    if (!field.value?.trim()) {
      field.error.value = 'Dieses Feld darf nicht leer sein!';
      hasErrors = true;
    }

    if (field.error.value) {
      hasErrors = true;

      if (!firstErrorElement) {
        firstErrorElement = document.querySelector(`[aria-describedby="error-${field.error.value}"]`);
      }
    }
  });

  if (hasErrors) {
    await nextTick(() => {
      firstErrorElement?.scrollIntoView({block: 'center', behavior: 'smooth'});
    })
    return;
  } else {
    await userStore.register(email.value, password.value)
    await router.push({name: SiteLinks.User})
  }
}

</script>

<style scoped>

.route-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  a {
    font-size: 14px;
  }

  .register-text {
    font-size: 14px;
    font-weight: 700;
  }
}

</style>