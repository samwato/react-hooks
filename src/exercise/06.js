import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonForm,
} from '../pokemon'


function PokemonInfo({ pokemonName }) {

  const [{ status, error, pokemon }, setState] = React.useState({
    status: 'idle',
    error: null,
    pokemon: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return

    setState({
      status: 'pending',
      error: null,
      pokemon: null,
    })

    fetchPokemon(pokemonName).then(
      (pokemonData) => {
        setState({
          status: 'resolved',
          error: null,
          pokemon: pokemonData,
        })
      },
      (err) => {
        setState({
          status: 'rejected',
          error: err,
          pokemon: null,
        })
      })

  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return (
      <PokemonDataView pokemon={pokemon} />
    )
  }

  throw new Error('impossible state')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function InfoErrorFallback({ error, resetErrorBoundary }) {
    return (
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={InfoErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
