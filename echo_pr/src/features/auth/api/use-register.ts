import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { tokenService } from '../lib/token-service'

export interface RegisterData {
  email: string
  password: string
  username: string
}

interface RegisterResponse {
  user: {
    user_id: string
    email: string
    created_at: string
  }
  tokens: {
    access_token: string
    refresh_token: string
    token_type: string
  }
}

export const useRegister = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      console.log('📤 Отправка регистрации:', data)
      
      const response = await apiClient.post<RegisterResponse>(
        '/api/v1/auth/signup',
        {
          email: data.email,
          password: data.password,
          username: data.username
        }
      )
      
      console.log('✅ Ответ от сервера:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('🎉 onSuccess вызван! Данные:', data)
      
      if (!data.tokens?.access_token || !data.tokens?.refresh_token) {
        console.error('❌ Токены отсутствуют в ответе!')
        toast.error('Ошибка: токены не получены')
        return
      }
      
      console.log('💾 Сохраняем токены...')
      tokenService.setTokens(
        data.tokens.access_token,
        data.tokens.refresh_token
      )
      
      if (data.user) {
        tokenService.setUser(data.user)
      }
      
      setTimeout(() => {
        console.log('🔍 Проверка сохраненных данных:')
        tokenService.debug()
      }, 100)
      
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      toast.success('Регистрация успешна!')
      console.log('🚀 Перенаправляем на главную...')
        navigate({ to: '/dashboard', replace: true })
    },
    onError: (error: any) => {
      console.error('💥 Ошибка регистрации:', error)
      
      let errorMessage = 'Ошибка регистрации'
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    },
  })
}