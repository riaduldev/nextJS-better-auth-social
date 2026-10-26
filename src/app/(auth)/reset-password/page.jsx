import React, { Suspense } from 'react';
import ResetPassForm from './ResetPassForm';

const ResetPasswordPage = () => {
    return (
        <div>
            <h1>This is reset password page</h1>
            <Suspense fallback = 'loading...'>
            <ResetPassForm></ResetPassForm>
            </Suspense>
        </div>
    );
};

export default ResetPasswordPage;