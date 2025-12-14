import { cn } from "@shared/lib/utils"
import { Button } from "@shared/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@shared/ui/field"
import { Input } from "@shared/ui/input"
import { Link } from "@tanstack/react-router"
import { Card, CardContent } from "@shared/ui/card"
import firstImg from '@assets/images/background/firstImg.jpg'
import { useRegister, RegisterData } from '../../api/use-register'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'


interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string; 
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    username: '',
  })
  
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  
  const { mutate: register, isPending } = useRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    if (id === 'confirmPassword') {
      setConfirmPassword(value)
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }))
    }
    
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }
    
    if (!formData.username) {
      newErrors.username = 'Имя пользователя обязательно'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно быть минимум 3 символа'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Можно использовать только буквы, цифры и подчеркивание'
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов'
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль'
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      register(formData)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
                <p className="text-muted-foreground text-balance">
                  Создайте аккаунт в ECHO PR
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Имя пользователя</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-destructive mt-1">{errors.username}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Можно использовать буквы, цифры и подчеркивание
                </p>
              </Field>
              
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </Field>
              
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </Field>
              
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirmPassword">Повторите пароль</FieldLabel>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                )}
              </Field>
              
              <Field>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Регистрация...
                    </>
                  ) : (
                    'Зарегистрироваться'
                  )}
                </Button>
              </Field>
    
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Или продолжить с
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                
              </Field>
              
              <FieldDescription className="text-center">
                Уже есть аккаунт? <Link to="/auth/signin">Войти</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          
          <div className="bg-muted relative md:block">
            <img
              src={firstImg}
              alt="Изображение"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      
      <FieldDescription className="px-6 text-center">
        Нажимая "Продолжить", вы соглашаетесь с нашими <Link to="/">Условиями обслуживания</Link>{" "}
        и <Link to="/">Политикой конфиденциальности</Link>.
      </FieldDescription>
    </div>
  )
}