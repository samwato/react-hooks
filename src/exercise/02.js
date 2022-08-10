// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {}
) => {

  const [state, setState] = React.useState(
    () => {
      const valueInLocalStorage = window.localStorage.getItem(key)
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage)
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  )

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({ initialUserInfo = {}}) {

  const [userInfo, setUserInfo] = useLocalStorageState('username', initialUserInfo)


  function handleChange(event) {
    const { name, value } = event.target
    setUserInfo({ ...userInfo, [name]: value })
  }

  return (
    <div>
      <form>
        <div>
          <label htmlFor="firstname">First Name: </label>
          <input value={userInfo.firstName} onChange={handleChange} name="firstName" id="firstname" />
        </div>
        <div>
          <label htmlFor="lastname">Last Name: </label>
          <input value={userInfo.lastName} onChange={handleChange} name="lastName" id="lastname" />
        </div>
      </form>
      {userInfo ? <strong>Hello {userInfo.firstName} {userInfo.lastName}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return (
    <Greeting />
  )
}

export default App
