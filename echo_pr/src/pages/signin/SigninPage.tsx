import './SigninPage.scss'
import { LoginForm } from '@/features/auth/ui/loginForm/LoginForm'


export default function SigninPage() {
  return (
    <div className="dark flex min-h-svh flex-col items-center justify-center p-6 md:p-10" >
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
