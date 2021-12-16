import { render, screen } from '@/utils/test-utils'

import DinoFormFieldText from './DinoFormFieldText'

const setup = ({ touched }: { touched: boolean }) => {
  const formik = {
    values: {
      title: 'TEST_VALUE'
    },
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    touched: {
      title: touched
    },
    errors: {
      title: 'TEST_ERROR'
    }
  }

  return { formik }
}

describe('DinoFormFieldText component', () => {
  it('should render a form field text', () => {
    const { formik } = setup({ touched: false })

    render(
      <DinoFormFieldText label="TEST_TITLE" formik={formik} name="title" />
    )

    const textbox = screen.getByRole('textbox', {
      name: 'TEST_TITLE'
    })
    expect(textbox).toBeInTheDocument()
  })

  it("should show error message if it's invalid", () => {
    const { formik } = setup({ touched: false })

    const { rerender } = render(
      <DinoFormFieldText
        required={true}
        label="TEST_TITLE"
        formik={formik}
        name="title"
      />
    )

    const errorBlock = screen.queryByText('TEST_ERROR')
    expect(errorBlock).not.toBeInTheDocument()

    const { formik: formik2 } = setup({ touched: true })

    rerender(
      <DinoFormFieldText
        required={true}
        label="TEST_TITLE"
        formik={formik2}
        name="title"
      />
    )

    const errorBlock2 = screen.queryByText('TEST_ERROR')
    expect(errorBlock2).toBeInTheDocument()
  })
})