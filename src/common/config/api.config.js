const ENV = import.meta.env.VITE_ENV_MODE
let API_BASE_URI = ''

if (ENV === 'dev') {
   API_BASE_URI = import.meta.env.VITE_DEV_BASE_URI
} else if (ENV === 'prod') {
   API_BASE_URI = VITE_PROD_BASE_URI
}

export default API_BASE_URI

