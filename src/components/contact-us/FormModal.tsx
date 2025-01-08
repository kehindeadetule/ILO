'use client';
import React, { JSX } from 'react';
import { FaX } from 'react-icons/fa6';
import { FormData, FormErrors } from '../utils/types';

export const FormField: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
}> = ({ label, name, type = 'text', value, onChange, error }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      name={name}
      className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 bg-inherit ${
        error ? 'border-red-500' : ''
      }`}
      value={value}
      onChange={onChange}
    />
    {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
  </div>
);

const FormModal: React.FC<{
  isOpen: boolean;
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClose: () => void;
  formType: 'prayer' | 'testimony' | 'questions';
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  isSubmitting: boolean;
  validateForm: () => boolean;
}> = ({
  isOpen,
  onClose,
  formType,
  formData,
  handleSubmit,
  handleChange,
  errors,
  isSubmitting,
}) => {
  const renderFormContent = () => {
    const forms: Record<'prayer' | 'testimony' | 'questions', JSX.Element> = {
      prayer: (
        <>
          <h2 className='text-xl font-semibold mb-4 text-[#2F8668]'>
            Need Prayer?
          </h2>
          <div className='space-y-4'>
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
            <FormField
              label='Email Address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <FormField
              label='Subject'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              error={errors.subject}
            />
            <div>
              <label htmlFor='message'>Please Pray For</label>
              <textarea
                name='message'
                className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-32 bg-inherit ${
                  errors.message ? 'border-red-500' : ''
                }`}
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && (
                <p className='text-red-500 text-sm mt-1'>{errors.message}</p>
              )}
            </div>
          </div>
        </>
      ),

      testimony: (
        <>
          <h2 className='text-xl font-semibold mb-4 text-[#2F8668]'>
            Share Your Testimony
          </h2>
          <div className='space-y-5'>
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
            <FormField
              label='Email Address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <FormField
              label='Subject'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              error={errors.subject}
            />
            <div>
              <label htmlFor='message'>Testimony</label>
              <textarea
                name='message'
                className={`w-full p-2 border-2 rounded h-32 border-[#495551] outline-none mt-1 bg-inherit ${
                  errors.message ? 'border-red-500' : ''
                }`}
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && (
                <p className='text-red-500 text-sm mt-1'>{errors.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <label className='block font-medium'>
                May We Share Your Story?
              </label>
              {[
                { value: 'yes-full', label: 'Yes, with my full name' },
                { value: 'yes-initials', label: 'Yes, with my initials' },
                { value: 'yes-anonymous', label: 'Yes, anonymously' },
                { value: 'no', label: 'No, thank you' },
              ].map((option) => (
                <div key={option.value}>
                  <label className='flex items-center'>
                    <div className='relative'>
                      <input
                        type='radio'
                        name='sharePermission'
                        value={option.value}
                        checked={formData.sharePermission === option.value}
                        onChange={handleChange}
                        className='sr-only peer'
                      />
                      <div className='w-4 h-4 border-2 border-black rounded-full peer-checked:border-[#2F8668]'></div>
                      <div className='absolute w-2 h-2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2F8668] rounded-full left-1/2 top-1/2 scale-0 peer-checked:scale-100 transition-transform'></div>
                    </div>
                    <span className='ml-2'>{option.label}</span>
                  </label>
                </div>
              ))}
              {errors.sharePermission && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.sharePermission}
                </p>
              )}
            </div>
          </div>
        </>
      ),

      questions: (
        <>
          <h2 className='text-xl font-semibold mb-4 text-[#2F8668]'>
            Got Questions?
          </h2>
          <div className='space-y-5'>
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
            <FormField
              label='Email Address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <FormField
              label='Subject'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              error={errors.subject}
            />
            <div>
              <label htmlFor='message'>Your Question</label>
              <textarea
                name='message'
                className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-32 bg-inherit ${
                  errors.message ? 'border-red-500' : ''
                }`}
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && (
                <p className='text-red-500 text-sm mt-1'>{errors.message}</p>
              )}
            </div>
          </div>
        </>
      ),
    };

    return forms[formType] || null;
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto ${
        formType === 'testimony' ? 'pt-32' : 'md:pt-16 pt-20'
      }`}>
      <div className='bg-white rounded-lg p-6 max-w-xl w-full relative bg-gradient-to-r from-[#fdf4ce] to-[#DDFCF1]'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'>
          <FaX size={24} />
        </button>

        <form onSubmit={handleSubmit} className='space-y-2 '>
          {renderFormContent()}
          <div className=' '>
            <button
              type='submit'
              className='w-full py-2 bg-[#1B1B1B] text-white rounded-sm mt-5 hover:bg-[#235c49]'>
              {isSubmitting
                ? 'SENDING...'
                : `SEND ${formType.toUpperCase()} ${
                    formType === 'prayer' ? 'REQUEST' : ''
                  }`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
