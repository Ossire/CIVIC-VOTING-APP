import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PollService } from '../../core/services/poll.service';
import { ErrorService } from '../../core/services/error.service';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-poll.html',
  styleUrl: './create-poll.css',
})
export class CreatePollComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pollService = inject(PollService);
  public errorService = inject(ErrorService);

  isLoading = signal(false);
  isEditMode = signal(false);
  pollId = signal<string | null>(null);
  deletedOptionIds = signal<number[]>([]);

  pollForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required]],
    endsAt: ['', [Validators.required]],
    options: this.fb.array([]),
  });

  get options() {
    return this.pollForm.get('options') as FormArray;
  }

  ngOnInit() {
    this.errorService.clearError();
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.pollId.set(id);
      this.loadPollForEdit(id);
    } else {
      this.addOption();
      this.addOption();
    }
  }

  loadPollForEdit(id: string) {
    this.isLoading.set(true);
    this.pollService.getPollById(id).subscribe({
      next: (poll) => {
        this.options.clear();

        poll.options.forEach((opt: any) => {
          this.options.push(
            this.fb.group({
              id: [opt.id],
              text: [opt.text, Validators.required],
            }),
          );
        });
        const dateSource = poll.endsAt;
        const formattedDate = dateSource ? new Date(dateSource).toISOString().slice(0, 16) : '';

        this.pollForm.patchValue({
          title: poll.title,
          description: poll.description,
          endsAt: formattedDate,
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorService.handleError(err);
      },
    });
  }

  addOption() {
    this.options.push(
      this.fb.group({
        id: [null],
        text: ['', Validators.required],
      }),
    );
  }

  removeOption(index: number) {
    if (index > 1) {
      const optionGroup = this.options.at(index);
      const id = optionGroup.get('id')?.value;

      if (id) {
        this.deletedOptionIds.update((ids) => [...ids, id]);
      }

      this.options.removeAt(index);
    }
  }

  onSubmit() {
    if (this.pollForm.invalid) return;
    this.isLoading.set(true);
    this.errorService.clearError();

    const rawValue = this.pollForm.getRawValue();

    const formattedData: any = {
      title: rawValue.title,
      description: rawValue.description,
      endsAt: rawValue.endsAt,
      options: rawValue.options.map((opt: any) => ({
        id: opt.id || undefined,
        text: String(opt.text),
      })),
    };

    if (this.isEditMode()) {
      formattedData.deleteOptions = this.deletedOptionIds();
    }

    const request = this.isEditMode()
      ? this.pollService.updatePoll(this.pollId()!, formattedData)
      : this.pollService.createPoll(formattedData);

    request.subscribe({
      next: () => {
        this.deletedOptionIds.set([]);
        this.handleSuccess();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorService.handleError(err);
      },
    });
  }

  private handleSuccess() {
    this.isLoading.set(false);
    this.router.navigate(['/admin/dashboard']);
  }
}
