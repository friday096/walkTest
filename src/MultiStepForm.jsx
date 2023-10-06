import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { BiPlusCircle, BiMinusCircle } from 'react-icons/bi';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        numbers: [],
    });

    const initialValues = {
        firstName: '',
        lastName: '',
        numberInput: '',
    };

    const validationSchemaStep1 = Yup.object({
        firstName: Yup.string()
            .required('First Name is required')
            .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces are allowed'),
        lastName: Yup.string()
            .required('Last Name is required')
            .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces are allowed'),
    });

    const validationSchemaStep2 = Yup.object({
        numberInput: Yup.number()
            .required('Number is required')
            .integer('Number must be an integer')
            .test('is-integer', 'Decimal numbers are not allowed', (value) => {
                return value === Math.floor(value);
            }),
    });

    const handleNextStep = (values) => {
        setFormData({ ...formData, ...values });

        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleAddNumber = (valueToAdd) => {
        setFormData({ ...formData, numbers: [...formData.numbers, valueToAdd] });
    };
    const handleRemoveNumber = (index) => {
        const updatedNumbers = [...formData.numbers];
        updatedNumbers.splice(index, 1);
        setFormData({ ...formData, numbers: updatedNumbers });
    };

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">Steps</div>
                        <div className="card-body">
                            <ul className="list-group">
                                <li className={`list-group-item ${step === 1 ? 'active' : ''}`}>
                                    Step 1 {step === 1 && <i className="bi bi-check"></i>}
                                </li>
                                <li className={`list-group-item ${step === 2 ? 'active' : ''}`}>
                                    Step 2 {step === 2 && <i className="bi bi-check"></i>}
                                </li>
                                <li className={`list-group-item ${step === 3 ? 'active' : ''}`}>
                                    Step 3 {step === 3 && <i className="bi bi-check"></i>}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Content</div>
                        <div className="card-body">
                            {step === 1 && (
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchemaStep1}
                                    onSubmit={(values) => {
                                        handleNextStep(values);
                                    }}
                                >
                                    <Form>
                                        <div className="mb-3">
                                            <label htmlFor="firstName" className="form-label">
                                                First Name
                                            </label>
                                            <Field type="text" name="firstName" id="firstName" className="form-control" />
                                            <ErrorMessage name="firstName" component="div" className="text-danger" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="lastName" className="form-label">
                                                Last Name
                                            </label>
                                            <Field type="text" name="lastName" id="lastName" className="form-control" />
                                            <ErrorMessage name="lastName" component="div" className="text-danger" />
                                        </div>
                                        <div className="mt-3">
                                            <button type="button" className="btn btn-secondary me-2" onClick={handlePrevStep}>
                                                Prev
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Next
                                            </button>
                                        </div>
                                    </Form>
                                </Formik>
                            )}
                            {step === 2 && (
                                <Formik
                                    initialValues={{ numberInput: '' }}
                                    validationSchema={validationSchemaStep2}
                                    onSubmit={(values) => {
                                        handleNextStep(values);
                                    }}
                                >
                                    <Form>
                                        <div className="mb-3">
                                            <label htmlFor="numberInput" className="form-label">
                                                Number Input
                                            </label>
                                            <div className="input-group">
                                                <Field type="number" name="numberInput" id="numberInput" className="form-control" />
                                                <button
                                                    onClick={() => handleAddNumber(1)}

                                                    type="button" className="btn btn-primary">
                                                    <BiPlusCircle />
                                                </button>
                                            </div>
                                            <ErrorMessage name="numberInput" component="div" className="text-danger" />
                                        </div>
                                        <div className="mb-3">
                                            <FieldArray name="numbers">
                                                {(arrayHelpers) => (
                                                    <div>
                                                        {formData.numbers.map((number, index) => (
                                                            <div key={index} className="input-group mb-2">
                                                                <Field
                                                                    type="number"
                                                                    name={`numbers.${index}`}
                                                                    id={`numbers.${index}`}
                                                                    className="form-control"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    onClick={() => {
                                                                        arrayHelpers.remove(index);
                                                                        handleRemoveNumber(index);
                                                                    }}
                                                                >
                                                                    <BiMinusCircle />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </FieldArray>
                                        </div>
                                        <div className="mt-3">
                                            <button type="button" className="btn btn-secondary me-2" onClick={handlePrevStep}>
                                                Prev
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Next
                                            </button>
                                        </div>
                                    </Form>
                                </Formik>
                            )}
                            {step === 3 && (
                                <div>
                                    <h4>Hi {formData.firstName} {formData.lastName}!</h4>
                                    <div>
                                        <h5>Sum of Numbers:</h5>
                                        <p>
                                            {formData.numbers.length > 0
                                                ? `Total Sum: ${formData.numbers.reduce((acc, num) => acc + num, 0) + parseInt(formData.numberInput)}`
                                                : `Total Sum : ${parseInt(formData.numberInput)}`
                                            }
                                        </p>
                                    </div>
                                    <div className="mt-3">
                                        <button type="button" className="btn btn-secondary me-2" onClick={handlePrevStep}>
                                            Prev
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiStepForm;