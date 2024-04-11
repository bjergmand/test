/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
import "@aws-amplify/ui-vue/styles.css";

Amplify.configure(amplifyconfig);

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
