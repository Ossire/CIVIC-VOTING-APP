import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  handleError(errorhttp: HttpErrorResponse) {
    let errorMessage = 'Something went wrong!';

    if (errorhttp.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${errorhttp.error.message}`;
    } else {
      const serverMessage = errorhttp.error?.message;

      switch (errorhttp.status) {
        case 400:
          errorMessage = Array.isArray(serverMessage)
            ? serverMessage.join(', ')
            : serverMessage || 'Bad Request.';
          break;
        case 401:
          errorMessage = errorhttp.url?.includes('/auth/login')
            ? 'Invalid email or password.'
            : 'Session expired. Please log in again.';
          break;
        case 409:
          errorMessage = serverMessage || 'This record already exists.';
          break;
        case 500:
          errorMessage = 'Server error. Our robots are fixing it.';
          break;
        default:
          errorMessage = serverMessage || `Error ${errorhttp.status}: ${errorhttp.statusText}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
