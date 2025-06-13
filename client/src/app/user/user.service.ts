import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { TokenModel } from "./models/token.model";
import { LoginModel } from "./models/login.model";
import { SignupModel } from "./models/signup.model";

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly apiUrl = environment.BASE_URL + "/auth";
    private readonly http = inject(HttpClient);

    login(loginData: LoginModel) {
        this.http.post<TokenModel>(this.apiUrl + "/login", loginData);
    }

    signup(signupData: SignupModel) {
        this.http.post<void>(this.apiUrl + "/signup", signupData);
    }

    refreshToken() {
        // we don't to pass {accessToken,refreshToken}. It will be passed through cookies
        this.http.post<TokenModel>(this.apiUrl + "/refresh" + "/refreshToken", null);
    }

    logout(accessToken: string) {
        this.http.post<void>(this.apiUrl + "/signup", { accessToken });
    }
}