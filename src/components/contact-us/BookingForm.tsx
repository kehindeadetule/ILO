'use client';
import React, { useEffect, useState } from 'react';
import * as emailjs from '@emailjs/browser';
import * as yup from 'yup';
import { FormField } from './FormModal';
import { BookingFormData } from '../utils/types';
import Message from './Message';
import CustomAlert from '../utils/CustomAlert';

interface Country {
  name: {
    common: string;
  };
  cca2: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: BookingFormData = {
  firstName: '',
  lastName: '',
  emailAddress: '',
  country: '',
  phoneNumber: '',
  churchName: '',
  dateOfEvent: '',
  eventLocation: '',
  eventDescription: '',
};

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [message, setMessage] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const bookingSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    emailAddress: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    country: yup.string().required('Country is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    churchName: yup.string().required('Church/Organization name is required'),
    dateOfEvent: yup.string().required('Date of event is required'),
    eventLocation: yup.string().required('Event location is required'),
    eventDescription: yup.string().required('Event Description is required'),
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          setShowAlert(true);
        }
        const data = await response.json();
        // Sort countries by name
        const sortedCountries = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.log('Error fetching countries:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the current field being typed in
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    try {
      bookingSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const templateParams = {
        ...formData,
      };

      await emailjs.send(
        'service_n4g7p1q',
        'template_xe54bx5',
        templateParams,
        'qyiwirb-eSmBvDZFR'
      );
      setFormData(initialFormData);
      setMessage(true);
      window.scrollTo(0, 0);
    } catch (error) {
      // console.error('Error sending email:', error);
      if (error instanceof yup.ValidationError) {
        const newErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }
      alert('Failed to send email. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderCountrySelect = (name: 'country', label: string) => (
    <div>
      <label htmlFor={name} className='block font-medium'>
        {label}
      </label>
      {showAlert ? (
        <CustomAlert variant='error'>
          Failed to fetch countries list. Please try again
        </CustomAlert>
      ) : (
        <select
          name={name}
          id={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={isLoadingCountries}
          className={`w-full p-2.5 border-2 rounded border-[#495551] outline-none mt-1 bg-inherit ${
            errors[name] ? 'border-red-500' : ''
          }`}>
          <option value=''>
            {isLoadingCountries ? 'Loading countries...' : 'Select a country'}
          </option>
          {countries.map((country) => (
            <option key={`${name}-${country.cca2}`} value={country.name.common}>
              {country.name.common}
            </option>
          ))}
        </select>
      )}
      {errors[name] && (
        <p className='text-red-500 text-sm mt-1'>{errors[name]}</p>
      )}
    </div>
  );
  return (
    <>
      {message ? (
        <Message />
      ) : (
        <section className='md:pt-20 pt-24'>
          <img
            src='/assets/booking-bg.png'
            alt='booking'
            className='md:h-screen md:w-full '
          />
          <div className='text-center md:my-20 mt-16 mb-8 '>
            <h1 className='text-[#2F8668] text-2xl'>Book Ibidun</h1>
            <h2 className='md:w-1/2 mx-auto mt-10 p-3 md:p-0 text-lg'>
              Thanks so much for considering Ibidun for your next event. Please
              fill out the form below and someone from our office will get back
              to you soon!
            </h2>
          </div>
          <div className='p-4 md:p-0'>
            <div className='bg-white rounded-lg md:p-6 px-4 py-6 max-w-2xl mx-auto w-full relative bg-gradient-to-r from-[#fdf4ce] to-[#DDFCF1] mb-28'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-5'>
                  {/* Name Fields */}

                  <div className='grid md:grid-cols-2 gap-4'>
                    <FormField
                      label='First Name'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                    />
                    <FormField
                      label='Last Name'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                    />
                  </div>
                  <FormField
                    label='Email Address'
                    name='emailAddress'
                    type='email'
                    value={formData.emailAddress}
                    onChange={handleChange}
                    error={errors.emailAddress}
                  />
                  <div className='grid md:grid-cols-2 gap-4'>
                    {renderCountrySelect('country', 'Country')}
                    <FormField
                      label='Phone Number'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      error={errors.phoneNumber}
                    />
                  </div>
                  <FormField
                    label='Name of Church or Organization'
                    name='churchName'
                    value={formData.churchName}
                    onChange={handleChange}
                    error={errors.churchName}
                  />
                  <FormField
                    label='Date of Event'
                    name='dateOfEvent'
                    type='date'
                    value={formData.dateOfEvent}
                    onChange={handleChange}
                    error={errors.dateOfEvent}
                  />
                  <FormField
                    label='Event Location (i.e. address, venue or building name)'
                    name='eventLocation'
                    value={formData.eventLocation}
                    onChange={handleChange}
                    error={errors.eventLocation}
                  />
                  <div>
                    <label htmlFor='eventDescription'>Event Description</label>
                    <textarea
                      name='eventDescription'
                      className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-24 bg-inherit ${
                        errors.eventDescription ? 'border-red-500' : ''
                      }`}
                      value={formData.eventDescription}
                      onChange={handleChange}
                    />
                    {errors.eventDescription && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.eventDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full py-2 bg-[#1B1B1B] text-white rounded-sm mt-5 hover:bg-[#235c49]'>
                    {isSubmitting ? 'SENDING...' : 'SEND'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default BookingForm;
