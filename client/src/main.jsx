import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Suspense } from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
<Suspense fallback={<div>Loading...</div>}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Suspense>
)
