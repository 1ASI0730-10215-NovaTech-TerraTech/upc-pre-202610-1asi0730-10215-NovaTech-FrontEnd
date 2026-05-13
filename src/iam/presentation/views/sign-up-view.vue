<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useIamStore from '/src/iam/application/iam.store.js'

const router = useRouter()
const store = useIamStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleSignUp = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Password Error'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await store.signUp(
        { email: email.value, password: password.value },
        router
    )
  } catch (error) {
    errorMessage.value = store.errors[store.errors.length - 1]?.message || 'Error en el registro'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="sign-up-container">
    <h2>Create an account</h2>
    <form @submit.prevent="handleSignUp">
      <div class="form-group">
        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            v-model="email"
            required
            placeholder="tucorreo@ejemplo.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="******"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            required
            placeholder="******"
        />
      </div>

      <button type="submit" :disabled="loading">Register</button>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
    <p>Do you have an account? <router-link to="/sign-in">Sign In</router-link></p>
  </div>
</template>

<style scoped>
.sign-up-container {
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