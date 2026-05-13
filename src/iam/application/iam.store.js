import {IamApi} from "../infrastructure/iam-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {UserAssembler} from "../infrastructure/user.assembler.js";

function hashPassword(password) {
    return btoa(password);
}

const iamApi = new IamApi();

const useIamStore = defineStore('iam', () => {
    const users = ref([]);
    const errors = ref([]);
    const usersLoaded = ref(false);
    const isSignedIn = ref(false);
    const currentUsername = ref(null);
    const currentUserId = ref('');
    const currentToken = computed(() => isSignedIn.value? localStorage.getItem('token') : null);

    function signIn({ email, password }, router) {
        const performSignIn = () => {

            const user = users.value.find(user => user.email === email);
            if (!user) {
                isSignedIn.value = false;
                errors.value.push(new Error('Invalid email'));
                router.push({name: 'iam-sign-in'});
                return;
            }

            const hashInput = hashPassword(password);
            if (user.password_hash !== hashInput) {
                isSignedIn.value = false;
                errors.value.push(new Error('Invalid password'));
                router.push({name: 'iam-sign-in'});
                return;
            }


            currentUsername.value = user.email;
            currentUserId.value = user.id;
            const sessionToken = `jwt-${user.id}-${Date.now()}`;
            localStorage.setItem('token', sessionToken);
            isSignedIn.value = true;
            errors.value = [];
            router.push({ name: 'home' });
        };
        if (usersLoaded.value) {
            performSignIn();
        } else {
            iamApi.getUsers()
                .then(response => {
                    users.value = UserAssembler.toEntitiesFromResponse(response);
                    usersLoaded.value = true;
                    performSignIn();
                })
                .catch(error => {
                    isSignedIn.value = false;
                    console.error(error);
                    errors.value.push(error);
                    router.push({ name: 'iam-sign-in' });
                });
        }
    }

    function signUp({ email, password }, router) {
        const hashedPassword = hashPassword(password);
        const newUserData = {
            email: email,
            password_hash: hashedPassword
        };
        iamApi.createUser(newUserData)
            .then(response => {
                console.log('user created', response.data);
                errors.value = [];
                router.push({ name: 'iam-sign-in' });
            })
            .catch(error => {
                console.error('Error in create user', error);
                const messageError = error.response?.data?.message || error.message || 'Error creating user';
                errors.value.push(new Error(messageError));
                router.push({ name: 'iam-sign-in' });
            });
    }

    function signOut() {
        currentUsername.value = null;
        currentUserId.value = '';
        localStorage.removeItem('token');
        isSignedIn.value = false;
        errors.value = [];
        console.log('user logged out successfully!');
    }

    function fetchUsers() {
        iamApi.getUsers()
            .then(response => {
                users.value = UserAssembler.toEntitiesFromResponse(response);
                usersLoaded.value = true;
                console.log(`Loaded ${users.value.length} users.`);
                errors.value = [];
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                errors.value.push(error);
            });
    }

    return {
        users,
        errors,
        usersLoaded,
        currentUsername,
        currentUserId,
        currentToken,
        isSignedIn,
        signIn,
        signUp,
        signOut,
        fetchUsers
    };
});

export default useIamStore;