import { useAllUsersQuery } from 'src/api/usersRepository';
import { NewJobsiteForm, defaultValues } from './NewJobsiteForm';
import { IRecievedJobsite } from 'src/api/jobsitesRepository';

import { useState } from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import NewJobsiteUsersForm from './NewJobsiteUsersForm';

export interface NewJobsiteProps {
  initialValues?: NewJobsiteFields;
  edit?: boolean;
  onSubmit: (values: NewJobsiteFields) => Promise<void>;
  isLoading: boolean;
}

export interface NewJobsiteFields extends IRecievedJobsite {
  users_id: number[];
}

type formStepsType = 0 | 1;
const formSteps: formStepsType[] = [0, 1];
const jobsiteStep = formSteps[0];
const userStep = formSteps[1];

const JobsiteFormController = ({ edit, initialValues, onSubmit, isLoading }: NewJobsiteProps) => {
  const [activeStep, setActiveStep] = useState<formStepsType>(0);
  const [jobsiteFormState, setJobsiteFormState] = useState<IRecievedJobsite>(defaultValues);

  const { data: usersData } = useAllUsersQuery();

  const handleForwardStep = async () => {
    if (activeStep === jobsiteStep) {
      return setActiveStep(userStep);
    }
  };

  const handleNewJobsite = async (values: IRecievedJobsite) => {
    setJobsiteFormState(values);
    handleForwardStep();
  };

  const handleBackwardStep = () => {
    if (activeStep === userStep) {
      setJobsiteFormState((prev) => (prev))
      return setActiveStep(jobsiteStep);
    }
  };

  const handleSubmit = async (userIds: number[]) =>
    onSubmit({ ...jobsiteFormState, users_id: userIds });

  const activeForm =
    activeStep === 0 ? (
      <>
        {edit ? (
          <NewJobsiteForm onSubmit={handleNewJobsite} edit initialValues={initialValues} />
        ) : (
          <NewJobsiteForm onSubmit={handleNewJobsite} initialValues={jobsiteFormState} />
        )}
      </>
    ) : (
      <NewJobsiteUsersForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onBack={handleBackwardStep}
        usersData={usersData ?? []}
        initialValues={edit ? initialValues?.users_id : undefined}
      />
    );

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {formSteps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>
                  {index === jobsiteStep ? 'Jobsite information' : 'User information'}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeForm}
      </Box>
    </>
  );
};

export default JobsiteFormController;
