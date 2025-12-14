import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { tokenService } from '../lib/token-service'

export interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
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

export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginData) => {
      console.log('📤 Отправка входа:', data)
      
      const response = await apiClient.post<LoginResponse>(
        '/api/v1/auth/login', 
        data
      )
      
      console.log('✅ Ответ входа:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      tokenService.setTokens(data.tokens.access_token, data.tokens.refresh_token)
      
      tokenService.setUser(data.user)
      
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      toast.success('Вход выполнен успешно!')
       navigate({ to: '/dashboard', replace: true })
    },
    onError: (error: any) => {
      console.error('💥 Ошибка входа:', error)
      
      let errorMessage = 'Ошибка входа'
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      toast.error(errorMessage)
    },
  })
}