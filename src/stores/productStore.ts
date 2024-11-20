import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { Category } from "@/models/Product";
import type { ProductDTO } from "@/models/Product";

export const useProductStore = defineStore('product', () => {
    const products: Ref<ProductDTO[]> = ref([
        {
            id: "1",
            displayName: "Gurlis Signature Bag",
            desc: "Eine stilvolle gehäkelte Handtasche für besondere Anlässe.",
            price: 59.99,
            category: Category.Handbags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "2",
            displayName: "Karin's Spezialtasche",
            desc: "Perfekt für den Alltag mit praktischen Trageoptionen.",
            price: 49.99,
            category: Category.Shoulderbags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "3",
            displayName: "Karin's Favourite",
            desc: "Eine lässige gehäkelte Handtasche für jeden Tag.",
            price: 39.99,
            category: Category.Handbags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "4",
            displayName: "Die Edle Gurli",
            desc: "Eine gehäkelte Umhängetasche für modische Akzente.",
            price: 44.99,
            category: Category.Shoulderbags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "5",
            displayName: "Süsson Bag",
            desc: "Eine gehäkelte Handtasche im Vintage-Look.",
            price: 69.99,
            category: Category.Handbags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "6",
            displayName: "Das Häckelwunder",
            desc: "Eine elegante gehäkelte Umhängetasche für besondere Anlässe.",
            price: 54.99,
            category: Category.Shoulderbags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        }
    ]);

    return {
        products
    }
})
