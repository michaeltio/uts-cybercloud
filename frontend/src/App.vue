<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const newEmail = ref('');
const emailMessage = ref('');

const getUser = async () => {
  const response = await fetch(`http://localhost:3000/api/user/${userId.value}`);
  users.value = await response.json();
  console.log(users.value.email);
};

const changeEmail = async () => {
  const response = await fetch(`http://localhost:3000/api/user/${userId.value}/change-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: newEmail.value }),
  });
  emailMessage.value = await response.json();
};
</script>

<template>
  <div id="app">
    <h1>User Dashboard</h1>
    <div>
      <input v-model="userId" placeholder="Enter User ID" />
      <button @click="getUser">Get User Info</button>
    </div>
    <div v-if="users">
        <h2>{{ users.name }}</h2>
        <p>Email: {{ users.email }}</p>
        <p>{{ users.error }}</p>
        <hr />
    </div>
    <CommentSection />
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
    <p v-if="emailMessage.message">{{ emailMessage.message}}</p>
    <p v-if="emailMessage.error">{{ emailMessage.error }}</p>
  </div>
</template>
