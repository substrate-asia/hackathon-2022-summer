import './App.css'
import { useState } from 'react'

import TriggerList from './components/TriggerList'
import ActionList from './components/ActionList'
import RecipeList from './components/RecipeList'

function App() {
  const [triggers, setTriggers] = useState([])

  const [actions, setActions] = useState([])

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', color: 'white' }}>DIFTTT</h1>

      <TriggerList
        triggers={triggers}
        setTriggers={setTriggers}
      />

      <ActionList
        actions={actions}
        setActions={setActions}
      />

      <RecipeList
        triggers={triggers}
        actions={actions}
      />
    </div>
  )
}

export default App
