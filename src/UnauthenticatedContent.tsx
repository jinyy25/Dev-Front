import { Routes, Route, Navigate } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm } from './components';
import AskList from "./components/ask-form/ask-list";
import AskUploadLayout from "./components/ask-form/ask-upload-layout";
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

        <Route
               path='/ask'
               element={
               <AskList/>
               }
        />

        <Route
               path='/ask-upload'
               element={
               <AskUploadLayout/>
               }
        />
      <Route path='*' element={<Navigate to={'/login'} />}></Route>
      <Route path='*' element={<Navigate to={'/ask'} />}></Route>
      <Route path='*' element={<Navigate to={'/ask-upload'} />}></Route>
    </Routes>
  );
}
