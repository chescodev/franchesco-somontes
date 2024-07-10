import { useState } from 'react'

interface Values {
  name: string
  email: string
  subject: string
  message: string
}

interface Errors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactUs = () => {
  const [formSubmit, setFormSubmit] = useState(false)
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
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
    if (!values.subject) {
      errors.subject = 'Required'
    }
    if (!values.message) {
      errors.message = 'Required'
    }
    return errors
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
            from: `${values.name} <onboarding@resend.dev>`,
            to: 'franchesco1510@gmail.com',
            subject: values.subject,
            html: `<p>Hola soy, ${values.name}</p><p>${values.message}</p><p>Mi correo es ${values.email}</p>`,
            text: `Hola, ${values.name}\n\n${values.message}`,
          }),
        })
        if (!res.ok) {
          console.error('An error occurred:', res.statusText)
          return
        }
        await res.json()
        setValues({ name: '', email: '', subject: '', message: '' })
        setFormSubmit(true)
      } catch (error) {
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="py-4 lg:py-2 px-4 mx-auto max-w-screen-md">
      <p className="mb-2 lg:mb-6 font-light text-gray-400">
        Si tienes alguna consulta no dudes en contactarme
      </p>
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Tu nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="shadow-sm border text-white bg-gray-700 border-gray-600 text-sm rounded-lg focus:ring-[#3b82f6] focus:border-[#3b82f6] block w-full p-2.5 placeholder-gray-400 shadow-sm-light"
            placeholder="Tu nombre"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Tu email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="shadow-sm border text-white bg-gray-700 border-gray-600 text-sm rounded-lg focus:ring-[#3b82f6] focus:border-[#3b82f6] block w-full p-2.5 placeholder-gray-400 shadow-sm-light"
            placeholder="tucorreo@gmail.com"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Asunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className="block p-3 w-full text-sm text-white bg-gray-700 rounded-lg border border-gray-600 shadow-sm focus:ring-[#3b82f6] focus:border-[#3b82f6] placeholder-gray-400 shadow-sm-light"
            placeholder="Déjame saber como puedo ayudarte"
            required
          />
          {errors.subject && (
            <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-400"
          >
            Tu mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className="block p-2.5 w-full text-sm text-white bg-gray-700 rounded-lg shadow-sm border border-gray-600 focus:ring-[#3b82f6] focus:border-[#3b82f6] placeholder-gray-400"
            placeholder="Déjame un comentario..."
            required
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="py-3 px-5 text-sm font-medium text-center text-white bg-[#2563eb] rounded-lg sm:w-fit hover:bg-[#1e40af] focus:ring-4 focus:outline-none focus:ring-[#1e40af]"
        >
          Mandar mensaje
        </button>
      </form>
      {formSubmit && (
        <p className="mt-4 text-green-500">¡Mensaje enviado con éxito!</p>
      )}
    </div>
  )
}

export default ContactUs
