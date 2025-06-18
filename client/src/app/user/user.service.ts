import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { TokenModel } from "./models/token.model";
import { LoginModel } from "./models/login.model";
import { SignupModel } from "./models/signup.model";
import { MyInfoModel } from "./models/my-info.model";
import { map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly apiUrl = environment.BASE_URL + "/auth";
    private readonly http = inject(HttpClient);

    login(loginData: LoginModel) {
        return this.http.post<TokenModel>(this.apiUrl + "/login", loginData);
    }

    getUserInfo() {
        return this.http.get<MyInfoModel>(this.apiUrl + "/me");
    }

    signup(signupData: SignupModel) {
        return this.http.post<void>(this.apiUrl + "/signup", signupData).pipe(map(() => true));
    }

    refreshToken() {
        // we don't to pass {accessToken,refreshToken}. It will be passed through cookies
        return this.http.post<TokenModel>(this.apiUrl + "/refresh", null);
    }

    logout() {
        return this.http.post<void>(this.apiUrl + "/logout", null);
    }
}