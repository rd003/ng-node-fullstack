import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { PersonModel } from "./person.model";

@Injectable({ providedIn: "root" })
export class PersonService {
    private readonly apiUrl = environment.BASE_URL + "/people";
    private readonly http = inject(HttpClient);

    getAll() {
        return this.http.get<Array<PersonModel>>(this.apiUrl);
    }

    getOne(id: number) {
        return this.http.get<PersonModel>(`${this.apiUrl}/${id}`);
    }

    delete(id: number) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    update(person: PersonModel) {
        const { id, ...personWithoutId } = person;
        return this.http.put<void>(`${this.apiUrl}/${person.id}`, personWithoutId);
    }

    add(person: PersonModel) {
        const { id, ...personWithoutId } = person;
        return this.http.post<PersonModel>(this.apiUrl, personWithoutId);
    }
}