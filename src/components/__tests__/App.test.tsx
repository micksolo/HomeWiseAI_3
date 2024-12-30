import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@components/App'

describe('App Component', () => {
  it('renders the main heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /homewise ai/i })
    expect(heading).toBeDefined()
    expect(heading.textContent?.toLowerCase()).toContain('homewise ai')
  })

  it('renders the privacy message', () => {
    render(<App />)
    const message = screen.getByText(/your local ai assistant that respects your privacy/i)
    expect(message).toBeDefined()
  })

  it('increments counter when button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button')
    expect(button.textContent).toContain('Count is 0')

    await user.click(button)
    expect(button.textContent).toContain('Count is 1')
  })
})
