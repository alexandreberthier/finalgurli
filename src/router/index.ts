import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FaqView from "@/views/FaqView.vue";
import DetailsView from "@/views/DetailsView.vue";
import CartView from "@/views/CartView.vue";
import AboutView from "@/views/AboutView.vue";
import AuthLayout from "@/views/AuthLayout.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import UserView from "@/views/UserView.vue";
import AdminView from "@/views/AdminView.vue";
import {useUserStore} from "@/stores/userStore";
import CheckoutLayout from "@/views/checkout/CheckoutLayout.vue";
import PersonalData from "@/views/checkout/PersonalData.vue";
import DeliveryAddress from "@/views/checkout/DeliveryAddress.vue";
import PaymentSummary from "@/views/checkout/PaymentSummary.vue";
import ConfirmOrder from "@/views/checkout/ConfirmOrder.vue";
import {useCheckoutStore} from "@/stores/checkoutStore";
import {useCartStore} from "@/stores/cartStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/ueberuns',
      name: 'about',
      component: AboutView
    },
    {
      path: '/faq',
      name: 'faq',
      component: FaqView
    },
    {
      path: '/details/:id',
      name: 'details',
      component: DetailsView,
      props: true
    },
    {
      path: '/warenkorb',
      name: 'cart',
      component: CartView
    },
    {
      path: '/meingurli',
      name: 'user',
      component: UserView,
      meta: {requiresAuth: true}
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {requiresAuth: true, isAdmin: true}
    },
    {
      path: '/auth',
      name: 'auth',
      redirect: { name: 'login' },
      component: AuthLayout,
      children: [
        {
          path: '',
          redirect: { name: 'login' }
        },
        {
          path: 'login',
          name: 'login',
          component: LoginView
        },
        {
          path: 'registrieren',
          name: 'register',
          component: RegisterView
        },
      ]
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutLayout,
      children: [
        {
          path: '',
          redirect: { name: 'personal-data' }
        },
        {
          path: 'persoenliche-daten',
          name: 'personal-data',
          component: PersonalData
        },
        {
          path: 'lieferadresse',
          name: 'delivery-data',
          component: DeliveryAddress
        },
        {
          path: 'zahlung',
          name: 'payment',
          component: PaymentSummary
        },
        {
          path: 'danke',
          name: 'order-confirmation',
          component: ConfirmOrder
        }
      ]
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const cartStore = useCartStore();
  const checkoutStore = useCheckoutStore();

  if (!userStore.isLoaded) {
    await userStore.fetchUser();
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next({ name: 'login' });
  }

  if (to.meta.isAdmin && !userStore.isAdmin) {
    return next({ name: 'login' });
  }

  if (to.name === 'cart' && cartStore.itemsInCart.length === 0) {
    return next({ name: 'home' });
  }

  if (typeof to.name === "string" && to.name.startsWith("personal-data") && cartStore.itemsInCart.length === 0) {
    return next({ name: "cart" });
  }

  if (typeof to.name === "string") {
    const stepIndex = checkoutStore.steps.findIndex(step => step.routeName === to.name);
    if (stepIndex > 0 && !checkoutStore.steps[stepIndex - 1].validated) {
      return next({ name: checkoutStore.steps[stepIndex - 1].routeName });
    }
  }

  next();
});



export default router
