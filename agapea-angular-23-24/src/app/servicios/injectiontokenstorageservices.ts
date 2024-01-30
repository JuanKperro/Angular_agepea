import { InjectionToken } from '@angular/core';
import { IStorageService } from '../modelos/interfaceservicios';

export const MI_TOKEN_SERVICIOSTORAGE = new InjectionToken<IStorageService>('ClaveStorageServices');
