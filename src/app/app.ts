import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceDetectionService } from './core/device/device-detection.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App implements OnInit {
  private deviceService = inject(DeviceDetectionService);

  ngOnInit(): void {
    this.deviceService.checkAndRedirect();
  }
}
