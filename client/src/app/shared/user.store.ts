import { computed, inject, Injectable, signal } from "@angular/core";
import { UserService } from "../user/user.service";
import { MyInfoModel } from "../user/models/my-info.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: 'root' })
export class UserStore {
    private readonly userService = inject(UserService);

    private readonly _initialState: MyInfoModel = {
        username: '',
        role: ''
    };

    private readonly state = signal(this._initialState);

    username = computed(() => this.state().username);
    role = computed(() => this.state().role);

    constructor() {
        this.userService.getUserInfo().pipe(takeUntilDestroyed()).subscribe({
            next: (myInfo) => {
                if (!myInfo) return;
                const { username, role } = myInfo;
                this.state.set({ username, role });
                // console.log(this.username()); // john@example.com
                // console.log(this.role()); // admin
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}