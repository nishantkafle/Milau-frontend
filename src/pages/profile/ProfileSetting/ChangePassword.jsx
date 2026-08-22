import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { updatePasswordApi } from '../../../Apis/Api'; // Import the API function

const ChangePassword = () => {
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [newPassVisible, setNewPassVisible] = useState(false);
  const [confPassVisible, setConfPassVisible] = useState(false);

  const toggleCurrentPassVisibility = () => setCurrentPassVisible(!currentPassVisible);
  const toggleNewPassVisibility = () => setNewPassVisible(!newPassVisible);
  const toggleConfPassVisibility = () => setConfPassVisible(!confPassVisible);

  const changePassword = async (values, actions) => {
    try {
      const userId = localStorage.getItem('user'); // Get user ID from localStorage
      if (!userId) {
        throw new Error('User not logged in. Please log in again.');
      }

      // Call the API to update the password
      await updatePasswordApi({
        oldPassword: values.currentPassword,
        newPassword: values.password,
      });

      toast.success('Password updated successfully');
      actions.resetForm(); // Reset the form after successful submission
    } catch (err) {
      toast.error(err?.response?.data?.message || 'An error occurred while updating password');
    } finally {
      actions.setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Enter your current password'),
    password: Yup.string()
      .required('Enter a new password')
      .notOneOf(
        [Yup.ref('currentPassword')],
        'New password must be different from the current password'
      )
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: Yup.string()
      .required('Confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <Formik
        initialValues={{
          currentPassword: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={changePassword}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Current Password</label>
              <div className="relative my-2">
                <Field
                  name="currentPassword"
                  type={currentPassVisible ? 'text' : 'password'}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={toggleCurrentPassVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {currentPassVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.currentPassword && touched.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">New Password</label>
              <div className="relative my-2">
                <Field
                  name="password"
                  type={newPassVisible ? 'text' : 'password'}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={toggleNewPassVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {newPassVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <div className="relative my-2">
                <Field
                  name="confirmPassword"
                  type={confPassVisible ? 'text' : 'password'}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={toggleConfPassVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {confPassVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
