import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: 'app-person',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: 'person.component.html',
    styles: [``]
})
export class PersonComponent {
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
}