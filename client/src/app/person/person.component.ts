import { HttpErrorResponse } from "@angular/common/http";
import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { PersonService } from "./person.service";
import { PersonModel } from "./person.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface PeopleState {
    people: readonly PersonModel[];
    loading: boolean;
    error: HttpErrorResponse | null;
}

@Component({
    selector: 'app-person',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: 'person.component.html',
    styles: [``]
})
export class PersonComponent implements OnInit {

    private readonly personService = inject(PersonService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly _initState: PeopleState = {
        people: [],
        loading: false,
        error: null
    }
    state = signal(this._initState);

    fb = inject(FormBuilder);

    get f() {
        return this.personForm.controls;
    }

    personForm = this.fb.group({
        id: [0],
        firstName: ['', [Validators.required, Validators.maxLength(30)]],
        lastName: ['', [Validators.required, Validators.maxLength(30)]]
    });

    onSubmit() {
        console.log(this.personForm.value);
    }

    onCancel = () => this.personForm.reset();

    onEdit(person: any) {
        this.personForm.patchValue(person);
    }

    onDelete(person: any) {
        if (window.confirm('Are your sure to delete?')) {

        }
    }
    private setLoading(val: boolean) {
        this.state.update(() => ({ ...this.state(), loading: val }));
    }

    ngOnInit(): void {
        this.setLoading(true);
        this.personService.getAll().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (people) => this.state.update(() => ({ people, loading: false, error: null })),
            error: (error) => {
                console.log(error);
                this.state.update(() => ({ ...this.state(), loading: false, error }));
            }
        })
    }
}