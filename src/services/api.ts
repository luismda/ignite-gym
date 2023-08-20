import axios, { AxiosError, AxiosInstance } from 'axios'

import { AppError } from '@utils/AppError'

import {
  getAuthTokenStorage,
  saveAuthTokenStorage,
} from '@storage/authTokenStorage'

type SignOut = () => void

type PromiseFailedQueueType = {
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: 'http://192.168.0.14:3333',
}) as APIInstanceProps

let failedQueue: PromiseFailedQueueType[] = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        const unauthorizedMessages = ['token.expired', 'token.invalid']

        if (
          unauthorizedMessages.includes(requestError.response.data?.message)
        ) {
          const { refreshToken } = await getAuthTokenStorage()

          if (!refreshToken) {
            signOut()

            return Promise.reject(requestError)
          }

          const originalRequestConfig = requestError.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  }

                  resolve(api(originalRequestConfig))
                },
                onFailure: (error) => {
                  reject(error)
                },
              })
            })
          }

          isRefreshing = true

          return new Promise((resolve, reject) => {
            async function requestRefreshToken() {
              try {
                const { data } = await api.post('/sessions/refresh-token', {
                  refresh_token: refreshToken,
                })

                await saveAuthTokenStorage({
                  accessToken: data.token,
                  refreshToken: data.refresh_token,
                })

                if (originalRequestConfig.data) {
                  originalRequestConfig.data = JSON.parse(
                    originalRequestConfig.data,
                  )
                }

                originalRequestConfig.headers = {
                  Authorization: `Bearer ${data.token}`,
                }

                api.defaults.headers.common.Authorization = `Bearer ${data.token}`

                failedQueue.forEach((request) => {
                  request.onSuccess(data.token)
                })

                resolve(api(originalRequestConfig))
              } catch (error) {
                failedQueue.forEach((request) => {
                  request.onFailure(error as AxiosError)
                })

                signOut()
                reject(error)
              } finally {
                isRefreshing = false
                failedQueue = []
              }
            }

            requestRefreshToken()
          })
        }

        signOut()
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message))
      }

      return Promise.reject(requestError)
    },
  )

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
