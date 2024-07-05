import { useState } from 'react'

interface Values {
  name: string
  email: string
}

interface Errors {
  name?: string
  email?: string
}

const ContactUs = () => {
  const [formSubmit, setFormSubmit] = useState(false)
  const [values, setValues] = useState<Values>({ name: '', email: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (values: Values): Errors => {
    const errors: Errors = {}
    if (!values.name) {
      errors.name = 'Required'
    } else if (values.name.length < 2) {
      errors.name = 'Must be at least 2 characters'
    }
    if (!values.email) {
      errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
    return errors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleBlur = () => {
    setErrors(validate(values))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      try {
        const res = await fetch('/api/sendEmail.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Franchesco Somontes <onboarding@resend.dev>',
            to: values.email,
            subject: `Hi, ${values.name}`,
            html: `<p>Hi, ${values.name}</p>`,
            text: `Hi, ${values.name}`,
          }),
        })
        if (!res.ok) {
          console.error('An error occurred:', res.statusText)
          return
        }
        await res.json()
        setValues({ name: '', email: '' })
        setFormSubmit(true)
      } catch (error) {
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {formSubmit && (
        <h3 className="text-lg font-bold text-green-300">
          Thanks, I'll be in touch
        </h3>
      )}
      {Object.keys(errors).length > 0 && (
        <h3 className="text-lg font-bold text-red-500">
          Review your input in order to proceed
        </h3>
      )}
      {!formSubmit && Object.keys(errors).length === 0 && !isSubmitting && (
        <h3 className="text-lg font-bold text-gray-500">
          Get in touch with me:
        </h3>
      )}
      <form
        className="flex flex-col w-full md:w-2/3 mx-auto gap-1"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <label
          className={
            errors.name
              ? 'block text-red-900 text-sm font-bold'
              : 'block text-gray-700 text-sm font-bold'
          }
          htmlFor="name"
        >
          Your Name
        </label>
        <div className={errors.name ? 'flex' : 'flex'}>
          <input
            id="name"
            name="name"
            type="text"
            className={
              errors.name
                ? 'bg-red-200 border border-red-500 text-red-900 text-sm rounded-md block w-full p-2.5 placeholder-red-900'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  placeholder-gray-700'
            }
            placeholder="Your name goes here"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {errors.name && (
          <span className="text-red-500 font-semibold text-sm">
            {errors.name}
          </span>
        )}
        <label
          className={
            errors.email
              ? 'block text-red-900 text-sm font-bold'
              : 'block text-gray-700 text-sm font-bold'
          }
          htmlFor="email"
        >
          Your Email
        </label>
        <div className={errors.email ? 'flex' : 'flex'}>
          <input
            id="email"
            name="email"
            type="email"
            className={
              errors.email
                ? 'bg-red-200 border border-red-500 text-red-900 text-sm rounded-md block w-full p-2.5 placeholder-red-900'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700'
            }
            placeholder="Here goes your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {errors.email && (
          <span className="text-red-500 font-semibold text-sm">
            {errors.email}
          </span>
        )}
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className={
            formSubmit || !isSubmitting
              ? 'text-white w-1/3 md:w-1/5 md:mt-3 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-50'
              : 'text-white w-1/3 md:w-1/5 md:mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
          }
        >
          {isSubmitting ? (
            <span className="flex gap-3 justify-center items-center">
              <svg
                aria-hidden="true"
                className="w-5 h-5 mr-2 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.0249C84.6952 27.7421 86.3311 30.7766 87.4337 34.0095C88.2154 36.2677 90.5679 37.6887 92.9676 37.0409Z"
                  fill="currentFill"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  )
}

export default ContactUs
