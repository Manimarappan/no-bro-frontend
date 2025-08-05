import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  faqs = [
    {
      question: 'What is No Bro?',
      answer: 'No Bro is a platform that connects tenants directly with property owners, eliminating brokers to make renting affordable and transparent.',
      isOpen: false
    },
    {
      question: 'How does No Bro save me money?',
      answer: 'By removing brokers, No Bro eliminates high brokerage fees, allowing you to negotiate directly with landlords and access verified listings at no extra cost.',
      isOpen: false
    },
    {
      question: 'How do I find a rental property on No Bro?',
      answer: 'Use our search filters to select your preferred city, budget, BHK, or amenities. Browse detailed listings with images and contact owners directly.',
      isOpen: false
    },
    {
      question: 'Are properties on No Bro verified?',
      answer: 'Yes, we verify property details and ownership to ensure transparency and trust, so you can rent with confidence.',
      isOpen: false
    },
    {
      question: 'Can I list my property on No Bro?',
      answer: 'Absolutely! Property owners can create free listings with photos and details, connecting directly with potential tenants.',
      isOpen: false
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  getSafeImageUrl(image: string | null): SafeUrl | string {
    return image
      ? this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${image}`)
      : '/assets/images/exels-naimbic-2.jpg';
  }
}
