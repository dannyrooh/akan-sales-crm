import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DeviceDetectionService {
  readonly isMobile = signal(this.detectMobile());
  readonly redirectOptOut = signal(
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('akan_desktop_optout') === 'true'
  );

  private detectMobile(): boolean {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      || (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
  }

  checkAndRedirect(): void {
    if (this.isMobile() && !this.redirectOptOut()) {
      window.location.href = environment.mobileAppUrl;
    }
  }

  optOutOfRedirect(): void {
    this.redirectOptOut.set(true);
    localStorage.setItem('akan_desktop_optout', 'true');
  }
}
