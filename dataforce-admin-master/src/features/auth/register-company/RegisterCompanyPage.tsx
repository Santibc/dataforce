import React, { FC, useRef, useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, Paper } from '@mui/material';
import { StepOneForm, StepOneFormFields } from './stepper/StepOneForm';
import { StepTwoForm, StepTwoFormFields } from './stepper/StepTwoForm';
import Header from 'src/layouts/compact/Header';
import useOffSetTop from 'src/hooks/useOffSetTop';
import { HEADER } from 'src/config';
import { useLocation, useSearchParams } from 'react-router-dom';
import { StepThree } from './stepper/StepThree';
import { useCreateOnboardingRepositoryMutation } from 'src/api/onboardingRepository';
import { animateSlideForm } from 'src/utils/animateSlideForm';

interface RegisterCompanyPageProps { }

export const RegisterCompanyPage: FC<RegisterCompanyPageProps> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeStep = parseInt(searchParams.get('step') || '0', 10);
    const { mutateAsync: sendOnboardingData, isLoading } = useCreateOnboardingRepositoryMutation();
    const parent = useRef();
    const parent2 = useRef();
    const parent3 = useRef();

    React.useEffect(() => {
        parent.current && animateSlideForm(parent);
    }, [parent]);

    React.useEffect(() => {
        parent2.current && animateSlideForm(parent2);
    }, [parent2]);

    React.useEffect(() => {
        parent3.current && animateSlideForm(parent3);
    }, [parent3]);

    const handleNext = () => {
        setSearchParams((prev) => {
            prev.set('step', `${activeStep + 1}`);
            return prev;
        });
    };

    const handleBack = () => {
        setSearchParams((prev) => {
            prev.set('step', `${activeStep - 1}`);
            return prev;
        });
    };

    const handleStepSubmit = async (data: StepOneFormFields | StepTwoFormFields) => {
        setSearchParams((prev) => {
            Object.entries(data).map(([key, value]) => prev.set(key, value));
            return prev;
        });
        handleNext();
    };

    const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

    return (
        <>
            <Header isOffset={isOffset} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                }}
            >
                <Paper sx={{ padding: 5, width: '900px' }} elevation={11}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        <Step key="StepOne">
                            <StepLabel>Owner information</StepLabel>
                        </Step>
                        <Step key="StepTwo">
                            <StepLabel>Company information</StepLabel>
                        </Step>
                        <Step key="StepThree">
                            <StepLabel>Done!</StepLabel>
                        </Step>
                    </Stepper>

                    <Box ref={parent}>
                        {activeStep === 0 && (
                            <StepOneForm onSubmit={handleStepSubmit}>
                                <></>
                            </StepOneForm>
                        )}
                    </Box>

                    <Box ref={parent2}>
                        {activeStep === 1 && (
                            <StepTwoForm
                                onSubmit={async (values) => {
                                    await sendOnboardingData({
                                        firstname: searchParams.get('name') || '',
                                        lastname: searchParams.get('surname') || '',
                                        email: searchParams.get('email') || '',
                                        phone_number: searchParams.get('phone_number') || '',
                                        payroll: searchParams.get('payroll') || '',
                                        name: values.company_name,
                                        address: values.address,
                                        driver_amount: values.driver_amount,
                                        fleat_size: values.fleat_size,
                                    });
                                    handleStepSubmit(values);
                                }}
                            >
                                {activeStep === 1 ? (
                                    <Button onClick={handleBack} sx={{ mr: 1 }} disabled={isLoading}>
                                        Back
                                    </Button>
                                ) : null}
                            </StepTwoForm>
                        )}
                    </Box>

                    <Box ref={parent3}>{activeStep === 2 && <StepThree />}</Box>
                </Paper>
            </Box>
        </>
    );
};
