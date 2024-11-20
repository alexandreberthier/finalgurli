import {defineStore} from "pinia";
import {ref, computed} from "vue";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import {doc, setDoc, getDoc} from "firebase/firestore";
import {User} from "@/models/User";
import {auth, db} from "@/config/firebaseConfig";
import type {UserDTO} from "@/models/User";
import {useRouter} from "vue-router";
import {SiteLinks} from "@/models/Enums";

export const useUserStore = defineStore('user', () => {
    const router = useRouter()

    const user = ref<User | null>(null);
    const error = ref<string | null>(null);
    const isLoaded = ref(false);
    const isLoggedIn = computed(() => !!user.value);
    const isAdmin = computed(() => user.value?.role === "admin");

    function handleError(e: any, defaultMessage: string): void {
        error.value = e.message || defaultMessage;
    }

    async function register(email: string, password: string): Promise<void> {
        try {
            // Firebase-Benutzer erstellen
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Neues UserDTO erstellen
            const newUserDTO: UserDTO = {
                id: userCredential.user.uid,
                role: "user",
                isAnonymous: false,
                personalData: {email},
                deliveryData: {}, // Leeres Objekt, da DeliveryData optional ist
            };

            // User-Instanz aus DTO erstellen
            const newUser = User.fromDto(newUserDTO);
            user.value = newUser;

            // Firestore-Dokument erstellen
            await setDoc(doc(db, "users", newUser.id), newUser.toDto());
        } catch (e: any) {
            handleError(e, "Registrierung fehlgeschlagen.");
        }
    }


    // Login eines Benutzers
    async function login(email: string, password: string): Promise<void> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Daten aus Firestore abrufen
            const userDoc = await getDoc(doc(db, "users", userId));
            if (!userDoc.exists()) {
                throw new Error("Benutzer nicht gefunden.");
            }

            const userData = userDoc.data() as UserDTO;
            user.value = User.fromDto(userData);
        } catch (e: any) {
            handleError(e, "Login fehlgeschlagen.");
        }
    }

    // Abmelden eines Benutzers
    async function logout(): Promise<void> {
        try {
            await signOut(auth);
            user.value = null;
            await router.push({name: SiteLinks.Home})
        } catch (e: any) {
            handleError(e, "Abmeldung fehlgeschlagen.");
        }
    }

    // Benutzer aus Firestore laden
    async function fetchUser(): Promise<void> {
        isLoaded.value = false;

        return new Promise<void>((resolve) => {
            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    try {
                        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                        if (userDoc.exists()) {
                            const userData = userDoc.data() as UserDTO;
                            user.value = User.fromDto(userData);
                        } else {
                            user.value = null;
                        }
                    } catch (e: any) {
                        handleError(e, "Fehler beim Abrufen des Benutzers.");
                    }
                } else {
                    user.value = null;
                }

                isLoaded.value = true;
                resolve();
            });
        });
    }

    // Benutzer-Daten aktualisieren
    async function updateUserData(updatedData: Partial<UserDTO>): Promise<void> {
        if (!user.value?.id) {
            throw new Error("Kein Benutzer eingeloggt.");
        }

        try {
            const userRef = doc(db, "users", user.value.id);

            // Firestore aktualisieren
            await setDoc(userRef, updatedData, {merge: true});

            // Lokale Daten aktualisieren
            Object.assign(user.value, updatedData);
        } catch (e: any) {
            handleError(e, "Fehler beim Aktualisieren der Benutzerdaten.");
        }
    }

    return {
        user,
        error,
        isLoaded,
        isLoggedIn,
        isAdmin,
        register,
        login,
        logout,
        fetchUser,
        updateUserData,
    };
});
