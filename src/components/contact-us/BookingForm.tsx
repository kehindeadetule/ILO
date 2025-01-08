'use client';
import React, { useEffect, useState } from 'react';
import * as emailjs from '@emailjs/browser';
import * as yup from 'yup';
import { FormField } from './FormModal';
import { BookingFormData } from '../utils/types';
import Message from './Message';
import Helmet from '../utils/config/Helmet';

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
  churchWebsite: '',
  typeOfEvent: '',
  dateOfEvent: '',
  eventLocation: '',
  eventCountry: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  closestAirport: '',
  additionalInformation: '',
  hearAboutUs: '',
};

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [message, setMessage] = useState(false);

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
    churchWebsite: yup
      .string()
      .url('Invalid website URL')
      .required('Website is required'),
    typeOfEvent: yup.string().required('Type of event is required'),
    dateOfEvent: yup.string().required('Date of event is required'),
    eventLocation: yup.string().required('Event location is required'),
    eventCountry: yup.string().required('Event country is required'),
    addressLine1: yup.string().required('Address is required'),
    addressLine2: yup.string().optional(),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip code is required'),
    closestAirport: yup.string().required('Closest airport is required'),
    additionalInformation: yup.string().optional(),
    hearAboutUs: yup
      .string()
      .required('Please let us know how you heard about us'),
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        // Sort countries by name
        const sortedCountries = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
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
        'service_ltfctt5',
        'template_66h1ih1',
        templateParams,
        'b9-fOTwtOmdsEI_Cr'
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
  const renderCountrySelect = (
    name: 'country' | 'eventCountry',
    label: string
  ) => (
    <div>
      <label htmlFor={name} className='block font-medium'>
        {label}
      </label>
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
      {errors[name] && (
        <p className='text-red-500 text-sm mt-1'>{errors[name]}</p>
      )}
    </div>
  );
  return (
    <>
      <Helmet pageKey='booking' />

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
                    label='Church/Organization Website'
                    name='churchWebsite'
                    value={formData.churchWebsite}
                    onChange={handleChange}
                    error={errors.churchWebsite}
                  />

                  <div>
                    <label htmlFor='typeOfEvent'>Type of Event</label>
                    <textarea
                      name='typeOfEvent'
                      className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-24 bg-inherit ${
                        errors.typeOfEvent ? 'border-red-500' : ''
                      }`}
                      value={formData.typeOfEvent}
                      onChange={handleChange}
                    />
                    {errors.typeOfEvent && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.typeOfEvent}
                      </p>
                    )}
                  </div>

                  <FormField
                    label='Date of Event'
                    name='dateOfEvent'
                    type='date'
                    value={formData.dateOfEvent}
                    onChange={handleChange}
                    error={errors.dateOfEvent}
                  />

                  <FormField
                    label='Event Location (i.e. venue or building name)'
                    name='eventLocation'
                    value={formData.eventLocation}
                    onChange={handleChange}
                    error={errors.eventLocation}
                  />

                  {renderCountrySelect('eventCountry', 'Event Country')}

                  <FormField
                    label='Address Line 1'
                    name='addressLine1'
                    value={formData.addressLine1}
                    onChange={handleChange}
                    error={errors.addressLine1}
                  />

                  <FormField
                    label='Address Line 2 (optional)'
                    name='addressLine2'
                    value={formData.addressLine2 || ''}
                    onChange={handleChange}
                    error={errors.addressLine2}
                    //   required={false}
                  />

                  <div className='grid md:grid-cols-3 gap-4'>
                    <FormField
                      label='City'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                    />
                    <FormField
                      label='State'
                      name='state'
                      value={formData.state}
                      onChange={handleChange}
                      error={errors.state}
                    />
                    <FormField
                      label='Zip Code'
                      name='zipCode'
                      value={formData.zipCode}
                      onChange={handleChange}
                      error={errors.zipCode}
                    />
                  </div>

                  <FormField
                    label='Closest Major Airport'
                    name='closestAirport'
                    value={formData.closestAirport}
                    onChange={handleChange}
                    error={errors.closestAirport}
                  />

                  <div>
                    <label htmlFor='additionalInformation'>
                      Additional Information
                    </label>
                    <textarea
                      name='additionalInformation'
                      className='w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-24 bg-inherit'
                      value={formData.additionalInformation}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor='hearAboutUs'>
                      How did you hear about Ibidun
                    </label>
                    <textarea
                      name='hearAboutUs'
                      className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-24 bg-inherit ${
                        errors.hearAboutUs ? 'border-red-500' : ''
                      }`}
                      value={formData.hearAboutUs}
                      onChange={handleChange}
                    />
                    {errors.hearAboutUs && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.hearAboutUs}
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
