<script setup>
  import * as mutations from './graphql/mutations';
  import * as queries from './graphql/queries';
  import * as subscriptions from './graphql/subscriptions';
  import { generateClient } from 'aws-amplify/api';
  import { onMounted, ref } from 'vue';

  const name = ref('');
  const description = ref('');
  const todos = ref([]);

  const client = generateClient();

  async function addTodo() {
    if (!name.value || !description.value) return;
    const todo = { name: name.value, description: description.value };
    await client.graphql({
      query: mutations.createTodo,
      variables: { input: todo }
    });
    name.value = '';
    description.value = '';
  }

  async function fetchTodos() {
    const fetchedTodos = await client.graphql({
      query: queries.listTodos
    });

    todos.value = fetchedTodos.data.listTodos.items;
  }

  function subscribeToNewTodos() {
    client
      .graphql({
        query: subscriptions.onCreateTodo
      })
      .subscribe({
        next: ({ data }) => {
          todos.value = [...todos.value, data.onCreateTodo];
        }
      });
  }

  onMounted(() => {
    fetchTodos();
    subscribeToNewTodos();
  });
</script>
<template>
  <div id="app">
    <h1>Todo App</h1>
    <input type="text" v-model="name" placeholder="Todo name" />
    <input type="text" v-model="description" placeholder="Todo description" />
    <button v-on:click="addTodo">Create Todo</button>

    <div v-for="item in todos" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>