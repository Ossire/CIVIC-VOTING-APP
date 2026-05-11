import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollDetail } from './poll-detail';

describe('PollDetail', () => {
  let component: PollDetail;
  let fixture: ComponentFixture<PollDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
