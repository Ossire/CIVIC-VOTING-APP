import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  errorMessage = signal<string | null>(null);

  clearError() {
    this.errorMessage.set(null);
  }

  handleError(error: HttpErrorResponse | any) {
    let message = 'An unexpected system error occurred.';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        message = 'DATABASE_OFFLINE: Could not establish a connection to the backend.';
      } else {
        const serverMessage = error.error?.message;

        switch (error.status) {
          case 400:
            message = Array.isArray(serverMessage)
              ? serverMessage.join(', ')
              : serverMessage || 'Invalid Request Data.';
            break;
          case 401:
            message = 'Invalid credentials.';
            break;
          case 403:
            if (typeof serverMessage === 'string') {
              const lowerMessage = serverMessage.toLowerCase();

              if (lowerMessage.includes('havent voted on any poll')) {
                message = serverMessage;
              } else if (lowerMessage.includes('because this poll')) {
                message = serverMessage;
              } else {
                message = 'ACCESS_DENIED: You do not have permission for this action.';
              }
            } else {
              message = 'ACCESS_DENIED: You do not have permission for this action.';
            }
            break;
          case 404:
            message = 'RESOURCE_NOT_FOUND: The requested record does not exist.';
            break;
          case 409:
            message = serverMessage || 'Conflict: This record already exists.';
            break;
          case 500:
            message = 'INTERNAL_SERVER_ERROR: The backend encountered a fault.';
            break;
          default:
            message =
              serverMessage || `System Error ${error.status}: ${error.statusText || 'Unknown'}`;
        }
      }
    } else if (error?.message) {
      message = error.message;
    }

    this.errorMessage.set(message);

    console.error(`[ErrorService] Resolved Message: ${message}`, error);

    return throwError(() => new Error(message));
  }
}
