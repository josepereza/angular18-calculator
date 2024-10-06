import { NgClass } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  host: {
        '(window:scroll)': 'onScroll($event)',
  },
})
export class NavbarComponent {
  private lastScrollTop = 0;
  private readonly SCROLL_THRESHOLD = 50;
  isVisible = signal(true);

  // @HostListener('window:scroll', ['$event'])
  
  onScroll($event:any) {
    console.log($event)
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    if (Math.abs(st - this.lastScrollTop) <= this.SCROLL_THRESHOLD) return;

    if (st > this.lastScrollTop && st > 100) {
      // Scrolling down
      this.isVisible.set(false);
    } else {
      // Scrolling up
      this.isVisible.set(true);
    }
    
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

}
