import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { updateProfileApi } from '../../../Apis/Api'; // Import the updateProfileApi function

const ProfileSettings = () => {
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    // phone: '',
    address: {
      street: '',
      city: '',
      country: '',
    },
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const user = localStorage.getItem('user'); // Get the entire user object from localStorage
    if (!user) {
      toast.error('User not found. Please log in.');
      return;
    }

    // Parse the user data and extract the necessary information
    const parsedUser = JSON.parse(user);

    // Set the form initial values from localStorage
    setInitialValues({
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      // phone: parsedUser.phone || '',
      address: {
        street: parsedUser.address?.street || '',
        city: parsedUser.address?.city || '',
        country: parsedUser.address?.country || '',
      },
    });
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    // phone: Yup.string()
    //   .matches(/^\d{10,15}$/, 'Phone must be 10-15 digits')
    //   .required('Phone is required'),
    address: Yup.object().shape({
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      country: Yup.string().required('Country is required'),
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Call the updateProfileApi function with the form values
      await updateProfileApi(values);
  
      // On successful API call, update localStorage
      const updatedUser = { 
        ...values, // Use the updated values from the form
        email: initialValues.email, // Ensure email remains unchanged (since it's not editable)
      };
  
      // Save the updated user data back to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload(); // Reload the page to reflect the changes
  
      // Show a success toast
      toast.success('Profile updated successfully!'); 
    } catch (error) {
      // Show an error toast if the API call fails
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false); // Set submitting to false once the form submission is complete
    }
  };
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          console.log('Form data on submit:', values); // Log values
          handleSubmit(values, { setSubmitting });
        }}
      >

        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter your name"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full border rounded px-3 py-2 bg-gray-200"
                  placeholder="Email cannot be changed"
                  disabled // Disable the field
                  readOnly // Ensure the field is read-only
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium">Phone</label>
                <Field
                  name="phone"
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter your phone number"
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div> */}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium">Street</label>
                  <Field
                    name="address.street"
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter your street"
                  />
                  {errors.address?.street && touched.address?.street && (
                    <p className="text-red-500 text-sm">{errors.address.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">City</label>
                  <Field
                    name="address.city"
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter your city"
                  />
                  {errors.address?.city && touched.address?.city && (
                    <p className="text-red-500 text-sm">{errors.address.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Country</label>
                  <Field
                    name="address.country"
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter your country"
                  />
                  {errors.address?.country && touched.address?.country && (
                    <p className="text-red-500 text-sm">{errors.address.country}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="reset"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileSettings;
