import { Routes, Route, Navigate } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm } from './components';
// , ResetPasswordForm, ChangePasswordForm, CreateAccountForm


export default function UnauthenticatedContent() {
  return (
    <Routes>
      <Route
        path='/login' 
        element={
          <SingleCard title="Sign In">
            <LoginForm />
          </SingleCard>
        }
      />
      <Route path='*' element={<Navigate to={'/login'} />}></Route>
    </Routes>
  );
}
