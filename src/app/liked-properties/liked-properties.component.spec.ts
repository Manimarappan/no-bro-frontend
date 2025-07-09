import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedPropertiesComponent } from './liked-properties.component';

describe('LikedPropertiesComponent', () => {
  let component: LikedPropertiesComponent;
  let fixture: ComponentFixture<LikedPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedPropertiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LikedPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
