import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVotes } from './my-votes';

describe('MyVotes', () => {
  let component: MyVotes;
  let fixture: ComponentFixture<MyVotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyVotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
