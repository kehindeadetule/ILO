'use client';
import React, { useState } from 'react';
import * as emailjs from '@emailjs/browser';
import * as yup from 'yup';
import Message from '@/components/contact-us/Message';
import BookingForm from '@/components/contact-us/BookingForm';
import FormModal from '@/components/contact-us/FormModal';
import { FormData, FormErrors } from '@/components/utils/types';

type FormType = 'prayer' | 'testimony' | 'questions';

// Form Validation Schemas
const baseSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
});

const testimonySchema = baseSchema.shape({
  sharePermission: yup
    .string()
    .oneOf(['yes-full', 'yes-initials', 'yes-anonymous', 'no'])
    .required('Share permission is required'),
});

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
  sharePermission: 'no',
  phone: '',
  dateRequested: '',
  timePreference: '',
  eventType: '',
  numberOfAttendees: '',
  venueDetails: '',
  additionalNotes: '',
};

const ContactPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>('prayer');
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [openBooking, setOpenBooking] = useState(false);
  const handleOpen = (type: FormType): void => {
    setFormType(type);
    setIsOpen(true);
  };
  const handleBooking = (): void => {
    setIsOpen(true);
    setOpenBooking(true);
    window.scrollTo(0, 0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;

    // Update formData with new value
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

  const handleClose = (): void => {
    setIsOpen(false);
    setFormType('prayer');
    setFormData(initialFormData);
    setErrors({});
  };

  const validateForm = () => {
    try {
      if (formType === 'testimony') {
        testimonySchema.validateSync(formData, { abortEarly: false });
      } else {
        baseSchema.validateSync(formData, { abortEarly: false });
      }
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
    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false); // Stop submitting if there are validation errors
      return;
    }
    setIsSubmitting(true);
    try {
      const templateParams = {
        ...formData,
        form_type: formType,
      };

      await emailjs.send(
        'service_n4g7p1q',
        'template_l2ev4br',
        templateParams,
        'qyiwirb-eSmBvDZFR'
      );
      setMessage(true);
      setFormData(initialFormData);
      handleClose();
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {openBooking ? (
        <BookingForm />
      ) : (
        <>
          {message ? (
            <Message />
          ) : (
            <section className='container md:w-[87%] mx-auto md:pt-40 pt-28 relative mb-20 '>
              <h1 className='text-2xl text-center mt-6 md:mb-14 mb-10 tracking-wider leading-[4.5rem]'>
                Let&apos;s Start A <br className='md:hidden block' />{' '}
                Conversation
              </h1>
              <section className='grid md:grid-cols-4 md:gap-10'>
                <div className='text-white md:col-span-2'>
                  <img
                    src='/assets/contact-bg.png'
                    alt='podcast 1'
                    className='md:rounded-2xl max-h-md'
                  />
                </div>
                <div className='md:col-span-2 md:w-4/5 p-5 md:p-0'>
                  <div className='md:mt-16 mt-10 md:bg-transparent bg-white md:shadow-none shadow-[0_1px_12px_rgba(0,0,0,0.2)] rounded-lg p-5'>
                    <h2 className='font-[600] text-[#2F8668] text-2xl leading-10 tracking-wider'>
                      Need Prayer?
                    </h2>
                    <p className='text-lg'>
                      We believe in the power of prayer and we would love to
                      pray for you. &quot;Therefore confess your sins to each
                      other and pray for each other so that you may be healed.
                      The prayer of a righteous person is powerful and
                      effective. (James 5:16)&quot;.
                    </p>
                    <button
                      onClick={() => handleOpen('prayer')}
                      className='mt-8 md:rounded-2xl rounded-3xl border border-black md:text-xs md:px-6 px-8 py-2 flex items-center space-x-2 w-fit mx-auto md:mx-0 mb-2 md:mb-0'
                      type='button'>
                      PRAYER REQUEST FORM
                    </button>
                  </div>
                  <div className='md:mt-16  mt-8 md:bg-transparent bg-white md:shadow-none shadow-[0_1px_12px_rgba(0,0,0,0.2)] rounded-lg p-5'>
                    <h2 className='font-[600] text-[#2F8668] text-2xl leading-10 tracking-wider'>
                      Want To Share?
                    </h2>
                    <p className='text-lg'>
                      We love hearing stories about what God is doing. If you
                      have a testimony you&apos;d like to share, you can use the
                      form below. Please indicate on the form whether we have
                      your permission to share it with others.
                    </p>
                    <button
                      onClick={() => handleOpen('testimony')}
                      className='mt-8 md:rounded-2xl rounded-3xl border border-black md:text-xs md:px-6 px-12 py-2 flex items-center space-x-2 md:w-fit mx-auto md:mx-0 mb-2 md:mb-0'
                      type='button'>
                      SHARE TESTIMONY
                    </button>
                  </div>
                  <div className='md:mt-16 mt-8 md:bg-transparent bg-white md:shadow-none shadow-[0_1px_12px_rgba(0,0,0,0.2)] rounded-lg p-5'>
                    <h2 className='font-[600] text-[#2F8668] text-2xl leading-10 tracking-wider'>
                      Got Questions?
                    </h2>
                    <p className='text-lg'>
                      Use this form to submit any question you have. Please try
                      to be concise so we can get back to you quickly. If you
                      have a booking question, please fill out the booking form
                      and we will get back to you to answer further questions.
                    </p>
                    <div className='grid grid-cols-2 md:gap-10 gap-4 mt-3'>
                      <button
                        onClick={() => handleOpen('questions')}
                        className='mt-8 md:rounded-2xl rounded-3xl mb-2 md:mb-0 border border-black md:text-xs px-6 py-2 text-center w-full'
                        type='button'>
                        QUESTIONS
                      </button>
                      <button
                        onClick={() => handleBooking()}
                        className='mt-8 md:rounded-2xl rounded-3xl mb-2 md:mb-0 border border-black md:text-xs px-6 py-2 text-center w-full'>
                        BOOKING
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <FormModal
                isOpen={isOpen}
                onClose={handleClose}
                formType={formType}
                handleSubmit={handleSubmit}
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                setErrors={setErrors}
                validateForm={validateForm}
                isSubmitting={isSubmitting}
              />
            </section>
          )}
        </>
      )}
    </>
  );
};

export default ContactPage;
