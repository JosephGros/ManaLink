"use client";

import { Suspense } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";
import CustomLoader from "../components/CustomLoading";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div><CustomLoader /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;