import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

export function renderRoute(hash = '') {
  window.location.hash = hash
  const user = userEvent.setup()
  const utils = render(<App />)
  return { user, ...utils }
}

export const polite = (screen) => screen.getByTestId('live-polite')
export const assertive = (screen) => screen.getByTestId('live-assertive')