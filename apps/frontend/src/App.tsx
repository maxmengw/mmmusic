import Router from './router'
import { Toaster } from 'react-hot-toast'
import { toastConfig } from './config/toastConfig'

function App() {
  return (
    <>
      <Toaster {...toastConfig} />
      <Router />
    </>
  )
}

export default App