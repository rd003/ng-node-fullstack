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
        const person = this.personForm.value as PersonModel;
        if (!person) return;
        // TODO: in add person, we are also passing 'id' in body. Either exclude it or create a new model for it
        this.setLoading(true);
        person.id > 0
            ? this.updatePerson(person)
            : this.addPerson(person)
    }

    private addPerson(person: PersonModel) {
        this.personService.add(person).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (person) => {
                console.log(`added person: ${JSON.stringify(person)}`);
                this.state.update(() => (
                    {
                        ...this.state(),
                        people: { ...this.state().people, person },
                        loading: false
                    }));
            },
            error: (error) => {
                console.log(error);
                this.setError(error);
            }
        });
    }

    private updatePerson(person: PersonModel) {
        this.personService.update(person).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => this.state.update(() => (
                {
                    ...this.state(),
                    people: { ...this.state().people.map(a => a.id === person.id ? person : a) },
                    loading: false
                })),
            error: (error) => {
                console.log(error);
                this.setError(error);
            }
        });
    }

    onCancel = () => this.personForm.reset();

    onEdit(person: PersonModel) {
        this.personForm.patchValue(person);
    }

    onDelete(person: PersonModel) {
        if (window.confirm(`Are your sure to delete a record : ${person.firstName} ${person.lastName} ?`)) {
            this.personService.delete(person.id).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe({
                next: () => this.state.update(() => (
                    {
                        ...this.state(),
                        people: { ...this.state().people.filter(a => a.id !== person.id) },
                        loading: false
                    })),
                error: (error) => {
                    console.log(error);
                    this.setError(error);
                }
            });
        }
    }
    private setLoading(val: boolean) {
        this.state.update(() => ({ ...this.state(), loading: val }));
    }

    private setError(error: HttpErrorResponse) {
        this.state.update(() => ({ ...this.state(), loading: false, error }));
    }

    ngOnInit(): void {
        this.setLoading(true);
        this.personService.getAll().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (people) => {
                // TODO: object in list is :
                // { Id: 2, FirstName: 'Mahendra', LastName: 'Singh' }
                // But their attribute should be in camel case
                this.state.update(() => ({ people, loading: false, error: null }))
            }
            ,
            error: (error) => {
                console.log(error);
                this.setError(error);
            }
        })
    }
}