import { createRoot } from "react-dom/client"
import "./index.css"
import { Provider } from "react-redux"
import { AppHttpRequests } from "./app/AppHttpRequests"
import { store } from "./app/store"
import { App } from "./app/App"

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
