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
import firstImg from '@assets/images/background/logoForm.png'
import gosUslugi from '@assets/svg/icons/gosusligi-logo.svg'
import vkontakte from '@assets/svg/icons/social-vkontakte-svgrepo-com.svg'
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">С возвращением!</h1>
                <p className="text-muted-foreground text-balance">
                  Войдите в свой аккаунт Acme Inc
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Забыли пароль?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Войти</Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Или продолжить с
              </FieldSeparator>
              <Field className="grid grid-cols-2 gap-4">
                
                <Button variant="outline" type="button">
                    <img className="w-7 h-7" src={vkontakte} alt="" />

                  <span className="sr-only">Войти через Google</span>
                </Button>
                <Button variant="outline" type="button">
                  <img className="w-7 h-7" src={gosUslugi} alt="" />
                
                  <span className="sr-only">Войти через Meta</span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Нет аккаунта? <Link to="/auth/signup">Зарегистрироваться</Link>
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
        Нажимая "Продолжить", вы соглашаетесь с нашими <a href="#">Условиями обслуживания</a>{" "}
        и <a href="#">Политикой конфиденциальности</a>.
      </FieldDescription>
    </div>
  )
}
