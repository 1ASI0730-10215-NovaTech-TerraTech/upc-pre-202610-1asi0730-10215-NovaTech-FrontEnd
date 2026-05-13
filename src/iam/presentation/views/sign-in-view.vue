<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useIamStore from '/src/iam/application/iam.store.js'

const router = useRouter()
const store = useIamStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleSignIn = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await store.signIn(
        {
          email: email.value,
          password: password.value
        },
        router
    )
  } catch (error) {
    errorMessage.value = store.errors[store.errors.length - 1]?.message || 'Sign in Error'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="sign-in-container">
    <h2>Sign In</h2>
    <form @submit.prevent="handleSignIn">
      <div class="form-group">
        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            v-model="email"
            required
            placeholder="address@example.com"
        />
      </div>

      <div class="form-group">
        <label for="password">password</label>
        <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="******"
        />
      </div>

      <button type="submit" :disabled="loading">Login</button>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
    <p>Do you don't have an account? <router-link to="/sign-up">Sign up</router-link></p>
  </div>
</template>

<style scoped>
.sign-in-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>