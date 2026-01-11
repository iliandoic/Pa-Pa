// API error handler - handles errors from Spring Boot backend
export default function apiError(error: any): never {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("API Response Error:", error.response)

    const message = error.response.data?.message ||
                    error.response.data ||
                    error.message ||
                    "An error occurred"

    throw new Error(message.charAt(0).toUpperCase() + message.slice(1))
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("No response received from server")
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    throw new Error(error.message)
  } else {
    throw new Error("An unknown error occurred")
  }
}
