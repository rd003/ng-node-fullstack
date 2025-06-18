import { computed, DestroyRef, inject, Injectable, signal } from "@angular/core";
import { UserService } from "../user/user.service";
import { MyInfoModel } from "../user/models/my-info.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: 'root' })
export class UserStore {
    private readonly userService = inject(UserService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly _initialState: MyInfoModel = {
        username: '',
        role: ''
    };

    private readonly _isLoading = signal(true);

    private readonly state = signal(this._initialState);

    username = computed(() => this.state().username);
    role = computed(() => this.state().role);
    isLoading = computed(() => this._isLoading());
    isLoaded = computed(() => !this._isLoading());

    logout() {
        this.state.set(this._initialState);
        this._isLoading.set(false);
    }

    loadUserStore() {
        this.userService.getUserInfo().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (myInfo) => {
                if (!myInfo) return;
                const { username, role } = myInfo;
                this.state.set({ username, role });

                console.log('UserStore loaded:', this.username()); // Debug log
            },
            error: (error) => {
                console.log('UserStore error:', error);
            },
            complete: () => this._isLoading.set(false)
        });
    }

    constructor() {
        // Add a small delay to ensure all dependencies are properly initialized
        setTimeout(() => {
            this.loadUserStore();
        }, 0);
    }
}